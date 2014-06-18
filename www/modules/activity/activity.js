angular.module('level.controllers.activities', [])

.controller('ActivityCtrl', ['$scope','$rootScope', '$ionicModal', '$ionicPopup', 'ActivityService', 
  function($scope, $rootScope, $ionicModal, $ionicPopup, ActivityService) {
  
  $scope.index = {indexStart: 0,indexLimit: 20};

  $scope.getActivities = function(){
    ActivityService.getAll($scope.index, function(data){
      console.log('activities', data);
      $scope.activities = data;
       // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.getActivities();

  $scope.self = $rootScope._self;

  //Create new post Modal
  $scope.modalData = {};
  $scope.form = {};

  $ionicModal.fromTemplateUrl('modules/activity/newPostPartial.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.submitModal = function(){
    if($scope.formValidation()){
      $scope.modalData.numLikes = 0;
      $scope.modalData.numComments = 0;
      $scope.modalData.likes = [];
      $scope.modalData.comments = [];
      $scope.modalData.picture = null;
      ActivityService.create($scope.modalData, function(data){
        $ionicPopup.alert({
          title: 'Post Created Succesfully!'        
        });
        $scope.modal.hide();
        $scope.modalData = {};
      });
    }
  };

  //Modal validaiton to ensure all fields are set
  $scope.formValidation = function(){
    if(!$scope.form.validation.text.$valid){
      $ionicPopup.alert({
        title: 'Incomplete Form',
        template: 'Missing post text'
      });
      return false;
    }
    return true;
  };


}])

.directive('activity', ['$rootScope', '$ionicPopup', 'ActivityService', 
  function($rootScope, $ionicPopup, ActivityService){
  return {
    restrict: 'E',
    replace: true,
    scope: {
      activity: '='
    },
    templateUrl: 'modules/activity/activityPartial.html',
    link: function(scope, iElement, iAttrs){    
      scope.self = $rootScope._self;
        
      scope.convertTime = function(time){
        return moment(new Date(time)).fromNow();
      };
      scope.activity.postTime = scope.convertTime(scope.activity.postTime);

      scope.deletePost = function(){
        if(scope.activity.userId === scope.self.userId){
          var confirmPopup = $ionicPopup.confirm({
            title: 'Delete post',
            template: 'Are you sure that you want to delete this post?',
            subTitle: 'This action cannot be undone'
          });
          confirmPopup.then(function(res) {
            if(res) {
              ActivityService.deletePost({activityId: scope.activity.activityId}, function(){});
            }
          });
        }
      };

      scope.showComments = false;
      scope.newComment = false;

      scope.addComment = function(){
        scope.showComments = !scope.showComments;
      };

      scope.submitComment = function(){
        scope.newComment = true;
        scope.numComments++;

        var commentData = {
          activityId: scope.activity.activityId,
          text: scope.userComment
        };
        ActivityService.comment(commentData, function(){});
      };

      //this is not yet working
      scope.deleteComment = function(){
        if(scope.activity.userId === scope.self.userId){
          var confirmPopup = $ionicPopup.confirm({
            title: 'Delete comment',
            template: 'Are you sure that you want to delete this comment?',
            subTitle: 'This action cannot be undone'
          });
          confirmPopup.then(function(res) {
            if(res) {
              ActivityService.deleteComment({commentId: scope.activity.activityId}, function(){});
            }
          });
        }
      };

      scope.liked = false;
      scope.checkLikes = function(){
        if(scope.activity.likes){
          for(var i = 0; i < scope.activity.likes.length; i++){
            if(scope.activity.likes[i].userId === $rootScope._self._id){
              scope.liked = true;
            }
          }
        }
      };
      scope.checkLikes();

      scope.like = function(){
        if(!scope.liked){        
          ActivityService.like({activityId: scope.activity.activityId}, function(){});
          scope.liked = true;
          ++scope.activity.numLikes;
        }
      };
    }
  };
}]);