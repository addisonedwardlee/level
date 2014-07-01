angular.module('level.home', [])

.config(function($stateProvider) {

  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "modules/home/home.html",
      controller: 'HomeCtrl'
    });
})

.controller('HomeCtrl', ['$scope', '$location', 'LevelUserService',
  function($scope, $location, LevelUserService) {

  $scope.self = LevelUserService.self;

  LevelUserService.getOne('53b225bfff3368c66d961261', function(data){
    console.log('temp user login in home.js');
    LevelUserService.self = data;
    console.log('_self', JSON.stringify(LevelUserService.self));
    $scope.self = LevelUserService.self;
  });


  //watch used to update active tab  
  $scope.$on('$locationChangeStart', function(){
    var route = $location.url().split('/')[2];
    if(route === 'activity'){
      $scope.activeTab = 'activity';
    } else if(route === 'challenges'){
      $scope.activeTab = 'challenges';
    } else if(route === 'profile' || route === 'leaderboard'){
      $scope.activeTab = 'profile';
    } else {
      $scope.activeTab = 'settings';
    }
  });

}]);