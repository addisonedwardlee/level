angular.module('challenges.oneChallenge', [])

.controller('ChallengeCtrl', ['$scope', '$ionicPopup', '$state', '$stateParams', 'ChallengeService', 'ActivityService', 'LevelUserService',
  function($scope, $ionicPopup, $state, $stateParams, ChallengeService, ActivityService, LevelUserService) {
  
  //get the challenge information and the user info
  var id = $stateParams.challengeId;

  //if challengeTemplate is true, this is a challenge template
  if($stateParams.challengeTemplate){
    ChallengeService.getOne(id, function(data){
      console.log('oneChallenge',data);
      $scope.challenge = data;
      $scope.challenge.started = false;
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
      $scope.challenge = data[0];
      $scope.challenge.started = true;
    });
  }

  $scope.goToProfile = function(profileId){
    $state.go('app.profile', {profileId: profileId});
  };

  $scope.startChallenge = function() {
    if(!$scope.challenge.started){
      ChallengeService.takeChallenge($scope.challenge, function(data){
        $scope.challenge.myChallengeId = data.myChallengeId;
      });
      $scope.challenge.started = true;
      $scope.challenge.startDate = new Date().toDateString();
      $scope.challenge.startTime = Date.now();
      console.log($scope.challenge.startTime);

      $scope.challenge.finishTime = 'in progress';
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
    ChallengeService.updateMyChallenge($scope.challenge, function(){});

    if($scope.challenge.userPoints === $scope.challenge.totalPoints) {
      //complete the challenge locally and update the DB
      $scope.challenge.completed = true;
      //calculate completion time
      console.log($scope.challenge.startTime, Date.now());
      $scope.challenge.finishTime = new Date(Date.now() - $scope.challenge.startTime).getMinutes() + ' minutes';
      ChallengeService.updateMyChallenge($scope.challenge, function(data){
        console.log('completed',data);
      });
      //show alert to tell user challenge now complete
      var popup = $ionicPopup.show({
        scope: $scope,
        title: 'Challenge Complete!',
        subTitle: 'You just completed ' + $scope.challenge.name + '!  Nice work!',
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
      templateUrl: 'modules/challenges/oneChallenge/exercisePartial.html',
      link: function(scope, element, attrs){
        //used to reset any exercises completed before challenge start
        scope.$on('challengeStarted', function(){
          scope.exercise.completed = false;
        });

        //track sets completed so far to determine if exercise is complete
        scope.complete = function(){
          if(!scope.exercise.completed){
            scope.exercise.completed = true;
            if(scope.challenge.started){
              //used to track progress at challenge level
              scope.$emit('completeExercise', scope.exercise.points);
              //create a new post
              ActivityService.create({
                likes: [],
                comments: [],
                text: '#' + scope.exercise.name + ' ' + scope.exercise.reps,
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