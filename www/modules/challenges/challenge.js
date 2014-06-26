angular.module('level.controllers.challenges', [])

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
      //create a holder for the user's myChallenge unique ID
      $scope.modalData.myChallengeId = null;
      $scope.modalData.totalPoints = 0;
      for(var i = 0; i < $scope.modalData.tasks.length; i++){
        //add up all the points per set/rep
        $scope.modalData.totalPoints += parseInt($scope.modalData.tasks[i].points) * $scope.modalData.tasks[i].sets;
        //create a unique object for each set
        var setsTemp = $scope.modalData.tasks[i].sets;
        $scope.modalData.tasks[i].sets = [];
        for(var j = 0; j < setsTemp; j++){        
          $scope.modalData.tasks[i].sets.push({
            reps: $scope.modalData.tasks[i].reps,
            completed: false
          });
        }
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

.controller('ChallengeCtrl', ['$scope', '$ionicPopup', '$state', '$stateParams', 'ChallengeService', 'ActivityService', 'LevelUserService',
  function($scope, $ionicPopup, $state, $stateParams, ChallengeService, ActivityService, LevelUserService) {
  
  //get the challenge information and the user info
  var id = $stateParams.challengeId;

  //if challengeTemplate is true, this is a challenge template
  if($stateParams.challengeTemplate){
    ChallengeService.getOne(id, function(data){
      console.log('oneChallenge',data);
      $scope.challenge = data;
      $scope.started = false;
      if($scope.challenge.userId === LevelUserService.self.userId){
        $scope.challengeOwner = true;
      } else {
        $scope.challengeOwner = false;
      }
    });
  } else {
  //otherwise, this is a myChallenge for a specific user
    ChallengeService.getUserChallenges({
      myChallengeId: id
    }, function(data){
      console.log('one user myChallenge',data);
      $scope.started = true;
      $scope.challenge = data[0];
    });
  }

  $scope.startChallenge = function(){
    if(!$scope.started){
      ChallengeService.takeChallenge($scope.challenge, function(data){
        $scope.challenge.myChallengeId = data.myChallengeId;
        console.log('started', $scope.challenge)
      });
      $scope.started = true;
      //ensure the points for this user are set to 0 at challenge start
      $scope.challenge.userPoints = 0;
      $scope.challenge.progressBar = 0;
      //used to reset any exercises completed before challenge start
      $scope.$broadcast('challengeStarted');
      //create a new post to the activity feed
      $scope.newPostData = {
        challengeId: $scope.challenge.challengeId,
        challengeName: $scope.challenge.name,
        likes: [],
        comments: []
      };
      ActivityService.create($scope.newPostData, function(data){});

    }
  };

  $scope.$on('completeExercise', function(event, points){
    $scope.challenge.userPoints += points;
    $scope.challenge.progressBar = ($scope.challenge.userPoints / $scope.challenge.totalPoints) * 100 + '%';

    //track the user's progress
    ChallengeService.updateMyChallenge($scope.challenge, function(data){
        console.log('points',data)
      });

    if($scope.challenge.userPoints === $scope.challenge.totalPoints) {
      //complete the challenge locally and update the DB
      $scope.challenge.completed = true;
      ChallengeService.updateMyChallenge($scope.challenge, function(data){
        console.log('completed',data);
      });
      //show alert to tell user challenge now complete
      var popup = $ionicPopup.show({
        scope: $scope,
        title: 'Challenge Complete!',
        subTitle: 'You just completed the ' + $scope.challenge.name + ' workout!  Nice work!',
        buttons: [
          { text: 'Close window' },
          {
            text: 'See your progress',
            type: 'button-positive',
            onTap: function() {
              $state.go('app.profile', {profileId: $scope.self.userId});
            }
          },
        ]
      });
    }
  });

  $scope.deleteChallenge = function(){
    if($scope.challenge.creatorId === LevelUserService.self._id){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete challenge',
        template: 'Are you sure that you want to delete this challenge?',
        subTitle: 'This action cannot be undone'
      });
      confirmPopup.then(function(res) {
        if(res) {
          ChallengeService.deleteChallenge({challengeId: $scope.challenge.challengeId}, function(){});
          $state.go('app.challenges');
        }
      });
    }
  };

}])

.directive('exercise', ['ChallengeService', 'LevelUserService', 'ActivityService',
  function(ChallengeService, LevelUserService, ActivityService){
    return {
      restrict: 'E',
      replace: true,
      scope: {
        exercise: '=',
        challenge: '='
      },
      templateUrl: 'modules/challenges/exercisePartial.html',
      link: function(scope, element, attrs){
        //used to reset any exercises completed before challenge start
        scope.exercise.complete = scope.exercise.complete || false;
        var challengeStarted = false;

        scope.$on('challengeStarted', function(){
          challengeStarted = true;
          scope.exercise.complete = false;
          scope.exercise.sets.forEach(function(set){
            set.completed = false;
          });
        });

        //track sets completed so far to determine if exercise is complete
        var setsSoFar = 0;
        scope.complete = function(){
          if(!this.set.completed){
            this.set.completed = true;
            if(challengeStarted){
              //used to track progress at challenge level
              scope.$emit('completeExercise', scope.exercise.points);
              //create a new post
              ActivityService.create({
                likes: [],
                comments: [],
                text: '#' + scope.exercise.name + ' ' + this.set.reps,
                challengeId: scope.challenge.challengeId,
                challengeName: scope.challenge.name
              }, function(){});
              //update the user's charts
              ChallengeService.postChallengeTaskToFeed({
                data: {
                  tag: scope.exercise.name,
                  value: scope.exercise.reps
                }
              }, function(){});
              //update the user's total points
              LevelUserService.update({points: parseInt(scope.exercise.reps)}, function(){});
              //update CSS if this is the last set
              setsSoFar++;
              if(setsSoFar === scope.exercise.sets.length){
                scope.exercise.complete = true;
              }
            }
          }
        };

        // scope.takePicture = function() {
        //   navigator.camera.getPicture(function(imageURI) {
        //     console.log('success!');
        //     }, function(err) {
        //     console.log('err!', err);
        //     }, { quality: 50,
        //     destinationType: Camera.DestinationType.FILE_URI });
        // };
      }
    };
}]);