angular.module('user.profile', [])

.controller('ProfileCtrl', ['$scope', '$stateParams', '$state', 'LevelUserService', 'ChallengeService', 'TimeConversionService',
  function($scope, $stateParams, $state, LevelUserService, ChallengeService, TimeConversionService) {

  var userId = $stateParams.profileId;
  var challengeIndex = {
    indexStart: 0,
    indexLimit: 20,
    userId: userId
  };
  LevelUserService.getOne(userId, function(data){
    console.log('user', data)
    $scope.user = data;
    ChallengeService.getUserChallenges(challengeIndex, function(data){
    console.log(data)
      $scope.userchallenges = data;
    });
  });

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