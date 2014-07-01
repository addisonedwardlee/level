angular.module('activities.oneActivity', [])

.controller('CommentCtrl', ['$scope', '$state', 'ActivityService', 'LevelUserService', 'TimeConversionService',
  function($scope, $state, ActivityService, LevelUserService, TimeConversionService) {
  
  $scope.self = LevelUserService.self;
  $scope.activity = ActivityService.currentActivity;

  $scope.goToChallenge = function(challengeId){
    $state.go('app.oneChallenge', {challengeId: challengeId, challengeTemplate: true});
  };

  $scope.goToProfile = function(profileId){
    $state.go('app.profile', {profileId: profileId});
  };

  $scope.convertTime = function(time){
    var convertedTime = new Date(time).getTime();
    return TimeConversionService(convertedTime);
  };


  $scope.submitComment = function(){
    if($scope.userComment){
      var commentData = {
        activityId: $scope.activity.activityId,
        text: $scope.userComment
      };
      ActivityService.comment(commentData, function(){});

      //add more data to make comment look right locally
      commentData.userImg = $scope.self.userImg;
      commentData.screenName = $scope.self.screenName;
      commentData.postTime = new Date();
      $scope.activity.comments.unshift(commentData);
      //reset user comment field
      $scope.userComment = '';
    }
  };

  $scope.deleteComment = function(index){
    var id = this.comment.commentId;
    if(this.comment.userId === $scope.self.userId){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete comment',
        template: 'Are you sure that you want to delete this comment?',
        subTitle: 'This action cannot be undone'
      });
      confirmPopup.then(function(res) {
        if(res) {
          $scope.activity.comments.splice(index, 1);
          ActivityService.deleteComment({
            activityId: $scope.activity.activityId,
            commentId: id
          }, function(){});
        }
      });
    }
  };

  $scope.liked = false;
  $scope.checkLikes = function(){
    if($scope.activity.likes){
      for(var i = 0; i < $scope.activity.likes.length; i++){
        if($scope.activity.likes[i].userId === $scope.self.userId){
          $scope.liked = true;
        }
      }
    }
  };
  $scope.checkLikes();

  $scope.like = function(){
    if(!$scope.liked){        
      ActivityService.like({activityId: $scope.activity.activityId}, function(){});
      $scope.liked = true;
      $scope.activity.likes.push({});
    }
  };

}]);