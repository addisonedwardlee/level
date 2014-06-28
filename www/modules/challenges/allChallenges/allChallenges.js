angular.module('challenges.allChallenges', [])

.controller('ChallengesCtrl', ['$scope', '$ionicModal', '$ionicScrollDelegate', '$ionicPopup', '$state', 'ChallengeService', 
  function($scope, $ionicModal, $ionicScrollDelegate, $ionicPopup, $state, ChallengeService) {
    
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

  $scope.goToChallenge = function(challengeId){
    $state.go('app.oneChallenge', {challengeId: challengeId, challengeTemplate: true});
  };

  //Create new challenge Modal
  $scope.modalData = {};
  $scope.form = {};

  $ionicModal.fromTemplateUrl('modules/challenges/allChallenges/newChallenge.html', {
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
      //replace single tasks with one task per set
      var tasksTemp = $scope.modalData.tasks;
      $scope.modalData.tasks = [];
      for(var i = 0; i < tasksTemp.length; i++){
        for(var j = 0; j < tasksTemp[i].sets; j++){        
          //create a unique object for each set
          $scope.modalData.tasks.push({
            name: tasksTemp[i].name,
            points: 5,
            reps: tasksTemp[i].reps,
            completed: false
          });
        }
      }
      //update totalPoints based on the new number of tasks
      $scope.modalData.totalPoints = 5 * $scope.modalData.tasks.length;
      //send the challenge to the DB and on success, alert user
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
                $state.go('app.oneChallenge', {
                  challengeId: data.challengeId,
                  challengeTemplate: true
                });
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
    if(!$scope.form.validation.taskName.$valid || !$scope.form.validation.sets.$valid || !$scope.form.validation.reps.$valid){
      $ionicPopup.alert({
        title: 'Incomplete Form',
        template: 'All tasks need a name, sets, and reps'
      });
      return false;
    }
    return true;
  };

}]);