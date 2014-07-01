angular.module('activities.allActivities', [])

.controller('ActivityCtrl', ['$scope', '$ionicModal', '$ionicPopup', 'ActivityService', 'LevelUserService', 'ChallengeService',
  function($scope, $ionicModal, $ionicPopup, ActivityService, LevelUserService, ChallengeService) {
  
  $scope.self = LevelUserService.self;

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

  //Create new post Modal
  $scope.modalData = {};
  $scope.form = {};

  $ionicModal.fromTemplateUrl('modules/activity/allActivities/newPostPartial.html', {
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
      $scope.modalData.likes = [];
      $scope.modalData.comments = [];
      $scope.modalData.picture = null;
      //Create the post in the DB
      ActivityService.create($scope.modalData, function(data){
        $ionicPopup.alert({
          title: 'Post Created Succesfully!'        
        });
        $scope.modal.hide();
      });
      //Send the data to the Chart DB
      if($scope.modalData.text.indexOf('#') > -1){      
        var posts = $scope.modalData.text.split('#');
        //ignore the first item in the array, since it's an empty string
        for(var i = 1; i < posts.length; i++){ 
          var val = posts[i].split(' ');
          ChallengeService.postChallengeTaskToFeed({
            data : {
              tag: val[0],
              value: val[1]
            }
          }, function(){});
        }
      }
      //add some more fields to the data and add to the feed
      $scope.modalData.screenName = $scope.self.screenName;
      $scope.modalData.userId = $scope.self.userId;
      $scope.modalData.userImg = $scope.self.userImg;
      $scope.modalData.postTime = new Date();
      $scope.activities.unshift($scope.modalData);
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


.directive('activity', ['$ionicPopup', '$state', 'ActivityService', 'LevelUserService', 'TimeConversionService',
  function($ionicPopup, $state, ActivityService, LevelUserService, TimeConversionService){
  return {
    restrict: 'E',
    replace: true,
    scope: {
      activity: '='
    },
    templateUrl: 'modules/activity/allActivities/activityPartial.html',
    link: function(scope, element, attrs){    
      scope.self = LevelUserService.self;

      scope.goToChallenge = function(challengeId){
        $state.go('app.oneChallenge', {challengeId: challengeId, challengeTemplate: true});
      };

      scope.goToProfile = function(profileId){
        $state.go('app.profile', {profileId: profileId});
      };

      scope.convertTime = function(time){
        var convertedTime = new Date(time).getTime();
        return TimeConversionService(convertedTime);
      };

      scope.deletePost = function(index){
        if(scope.activity.userId === scope.self.userId){
          var confirmPopup = $ionicPopup.confirm({
            title: 'Delete post',
            template: 'Are you sure that you want to delete this post?',
            subTitle: 'This action cannot be undone'
          });
          confirmPopup.then(function(res) {
            if(res) {
              element.remove();
              ActivityService.deletePost({activityId: scope.activity.activityId}, function(){});
            }
          });
        }
      };
 
      scope.addComment = function(){
        ActivityService.currentActivity = scope.activity;
        $state.go('app.activityComments');
      };

      scope.liked = false;
      scope.checkLikes = function(){
        if(scope.activity.likes){
          for(var i = 0; i < scope.activity.likes.length; i++){
            if(scope.activity.likes[i].userId === scope.self.userId){
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
          scope.activity.likes.push({});
        }
      };
    }
  };
}]);