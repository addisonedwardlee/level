angular.module('user.settings', [])

.controller('SettingsCtrl', ['$scope', '$state', 'FacebookLoginService', 'TwitterLoginService',
  function($scope, $state, FacebookLoginService, TwitterLoginService) {
  $scope.settings = [{
      text: 'Email',
      checked: true
    },{
      text: 'Push-Noficiations',
      checked: true
    },{
      text: 'Other setting',
      checked: false
    },{
      text: 'Other setting',
      checked: false
    },{
      text: 'Other setting',
      checked: true
    }];

  $scope.logout = function(){
    console.log('logout');
    FacebookLoginService.logout();
    TwitterLoginService.logout();
    $state.go('login');
  };

}]);