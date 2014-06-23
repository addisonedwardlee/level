angular.module('level.controllers.home', [])

.controller('HomeCtrl', ['$scope', '$location', 'LevelUserService',
  function($scope, $location, LevelUserService) {

  var twitterData = {
    screenName: '@Addison_Lee_',
    authIdTwitter: '2553293678',
    userImg: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png'
  };

  LevelUserService.twitterConnect(twitterData, function(data){
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