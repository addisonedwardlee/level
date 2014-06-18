angular.module('level.controllers.profile', [])

.controller('ProfileCtrl', ['$scope', '$rootScope', '$stateParams', '$state', 'LevelUserService', 'ChallengeService',
  function($scope, $rootScope, $stateParams, $state, LevelUserService, ChallengeService) {

  var id = $stateParams.profileId;
  var challengeIndex = {
    indexStart: 0,
    indexLimit: 20,
    userId: id
  };
  LevelUserService.getOne(id, function(data){
    $scope.user = data;
    ChallengeService.getUserChallenges(challengeIndex, function(data){
      console.log(data)
      $scope.userchallenges = data;
    });
  });

  $scope.convertTime = function(time){
    return moment(new Date(time)).fromNow();
  };

  $scope.goToLeaderboard = function(){
    $state.go('app.leaderboard');
  };

  $scope.goToCharts = function(){
    $state.go('app.charts', {profileId: id});
  };

}]);