angular.module('level.controllers.challenges', [])

.controller('ChallengesCtrl', ['$scope', '$rootScope', '$ionicModal', '$ionicScrollDelegate', '$ionicPopup', '$state', 'ChallengeService', 
  function($scope, $rootScope, $ionicModal, $ionicScrollDelegate, $ionicPopup, $state, ChallengeService) {
    
  //@limits -> {indexStart, indexLimit} used for pagination
  $scope.getChallenges = function(params){
    ChallengeService.getMany(params, function(data){
      $scope.challenges = data;
      $scope.indexStart = data.length;
      $scope.indexLimit = data.length + 20;
      $scope.$broadcast('scroll.refreshComplete');
    console.log('getChallenges', data);
    });
  };
  //on load, get challenges
  $scope.getChallenges({indexStart: 0, indexLimit: 20});

  //Create new challenge Modal
  $scope.modalData = {};
  $scope.form = {};

  $ionicModal.fromTemplateUrl('modules/challenges/newChallenge.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.resetModal();
    $ionicScrollDelegate.scrollTop();
    $scope.modal.show();
  };

  $scope.cancelModal = function() {
    $scope.resetModal();
    $scope.modal.hide();
  };

  $scope.resetModal = function(){
    $scope.modalData.name = '';
    $scope.modalData.description = '';
    $scope.modalData.tasks = [{}];
  };

  $scope.addTask = function(){
    $scope.modalData.tasks.push({});
  };

  $scope.submitModal = function(){
    if($scope.formValidation()){
      $scope.modalData.totalPoints = 0;

      for(var i = 0; i < $scope.modalData.tasks.length; i++){
        $scope.modalData.totalPoints += Number($scope.modalData.tasks[i].points);
      }
      
      ChallengeService.create($scope.modalData, function(data){
        $ionicPopup.show({
          title: 'Challenge Created Succesfully!',
          subTitle: 'Click below to see the details',
          scope: $scope,
          buttons: [
            { text: 'Look at it later' },
            { text: '<b>To The Challenge!</b>',
              type: 'button-positive',
              onTap: function() {
                //go to the challenge
                $state.go('app.oneChallenge', {challengeId: data.challengeId});
              }
            },
          ]
        });
        $scope.modal.hide();
      });
    }
  };

  //Cleanup the modal when we're done with it
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  //Modal validaiton to ensure all fields are set
  $scope.formValidation = function(){
    if(!$scope.form.validation.name.$valid){
      $ionicPopup.alert({
        title: 'Incomplete Form',
        template: 'Missing Challenge Name'
      });
      return false;
    }
    if(!$scope.form.validation.description.$valid){
      $ionicPopup.alert({
        title: 'Incomplete Form',
        template: 'Missing Description'
      });
      return false;
    }
    if(!$scope.form.validation.taskName.$valid || !$scope.form.validation.points.$valid || !$scope.form.validation.sets.$valid || !$scope.form.validation.reps.$valid){
      $ionicPopup.alert({
        title: 'Incomplete Form',
        template: 'All tasks need name, points, sets, and reps'
      });
      return false;
    }
    return true;
  };

}])

.controller('ChallengeCtrl', ['$scope', '$rootScope', '$ionicPopup', '$state', '$stateParams', 'ChallengeService', 'ActivityService',
  function($scope, $rootScope, $ionicPopup, $state, $stateParams, ChallengeService, ActivityService) {
  
  //get the challenge information and the user info
  var id = $stateParams.challengeId;
  ChallengeService.getOne(id, function(data){
    console.log('oneChallenge',data);
    $scope.challenge = data;
    if($scope.challenge.userId === $rootScope._self.userId){
      $scope.challengeOwner = true;
    } else {
      $scope.challengeOwner = false;
    }
  });

  $scope.started = false;
  $scope.startChallenge = function(){

    if(!$scope.started){
      ChallengeService.takeChallenge($scope.challenge, function(){});
      $scope.started = true;
      //ensure the points for this user are set to 0 at challenge start
      $scope.userPoints = 0;
      //used to reset any exercises completed before challenge start
      $scope.$broadcast('challengeStarted');

      $scope.newPostData = {
        challengeId: $scope.challenge.challengeId,
        challengeName: $scope.challenge.name,
        numLikes: 0,
        numComments: 0,
        likes: [],
        comments: []
      };
      ActivityService.create($scope.newPostData, function(data){});

    }
  };

  $scope.$on('completeExercise', function(event, points){
    $scope.userPoints += points;
  });

  $scope.deleteChallenge = function(){
    if($scope.challenge.creatorId === $rootScope._self._id){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete challenge',
        template: 'Are you sure that you want to delete this challenge?',
        subTitle: 'This action cannot be undone'
      });
      confirmPopup.then(function(res) {
        if(res) {
          ChallengeService.del({myChallengeId: $scope.challenge.challengeId}, function(){});
          $state.go('app.challenges');
        }
      });
    }
  };

}])

.directive('exercise', ['ChallengeService', 
  function(ChallengeService){
    return {
      restrict: 'E',
      replace: true,
      scope: {
        exercise: '='
      },
      templateUrl: 'modules/challenges/exercisePartial.html',
      link: function(scope, iElement, iAttrs){
        //used to reset any exercises completed before challenge start
        scope.exercise.complete = scope.exercise.complete || false;

        scope.$on('challengeStarted', function(){
          if(scope.exercise.complete){
            scope.exercise.complete = false;
          }
        });

        scope.complete = function(){
          if(!scope.exercise.complete){
            scope.exercise.complete = true;
            //used to track progress at challenge level
            scope.$emit('completeExercise', scope.exercise.points);
            var task = {
              data: {
                tag: scope.exercise.name,
                value: scope.exercise.reps
              }
            };
            //used to update charts
            ChallengeService.completeTask(task, function(){});
          }
          if(scope.dropdown){
            scope.dropdown = !scope.dropdown;
          }
        };

        scope.dropdown = false;
        scope.edit = function(){
          scope.dropdown = !scope.dropdown;
        };

        scope.takePicture = function() {
          navigator.camera.getPicture(function(imageURI) {
            console.log('success!');
            }, function(err) {
            console.log('err!', err);
            }, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI });
        };


      }
    };
}]);