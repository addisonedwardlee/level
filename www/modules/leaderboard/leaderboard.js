angular.module('level.controllers.leaderboard', [])

.controller('LeaderboardCtrl', ['$scope', 'LeaderboardService', function($scope, LeaderboardService) {
  $scope.leaderboard = LeaderboardService.getAll();
}]);