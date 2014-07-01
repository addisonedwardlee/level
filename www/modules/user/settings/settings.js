angular.module('user.settings', [])

.controller('SettingsCtrl', ['$scope', '$state', '$window', 'FacebookLoginService', 'TwitterLoginService',
  function($scope, $state, $window, FacebookLoginService, TwitterLoginService) {
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
    $window.localStorage.setItem('self', {});
    $state.go('login');
  };

}]);