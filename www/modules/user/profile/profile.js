angular.module('user.profile', [])

.controller('ProfileCtrl', ['$scope', '$stateParams', '$state', 'LevelUserService', 'ChallengeService', 'TimeConversionService',
  function($scope, $stateParams, $state, LevelUserService, ChallengeService, TimeConversionService) {

  $scope.self = LevelUserService.self;

  var userId = $stateParams.profileId;
  var challengeIndex = {
    indexStart: 0,
    indexLimit: 20,
    userId: userId
  };

  //only do a user GET request if the profile isn't self
  //get myChallenges regardless
  if($scope.self.userId === userId){
    $scope.user = $scope.self;
    ChallengeService.getUserChallenges(challengeIndex, function(data){
      $scope.userchallenges = data;
    });
  } else {
    LevelUserService.getOne(userId, function(data){
      $scope.user = data;
      ChallengeService.getUserChallenges(challengeIndex, function(data){
        $scope.userchallenges = data;
      });
    });
  }

  $scope.convertTime = function(time){
    var convertedTime = new Date(time).getTime();
    return TimeConversionService(convertedTime);
  };

  $scope.goToLeaderboard = function(){
    $state.go('app.leaderboard');
  };

  $scope.goToCharts = function(){
    $state.go('app.charts', {profileId: userId, screenName: $scope.user.screenName});
  };

  $scope.goToMyChallenge = function(id){
    $state.go('app.oneChallenge', {challengeId: id});
  };

}]);