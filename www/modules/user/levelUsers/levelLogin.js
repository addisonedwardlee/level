angular.module('user.levelLogin', [])

.controller('LevelLoginCtrl', ['$scope', '$state', '$ionicPopup', 'LevelUserService', 
  function($scope, $state, $ionicPopup, LevelUserService) {
  
  //used to capture all user entered data
  $scope.form = {};
  $scope.userData = {};
  $scope.login = function(){
    if($scope.formValidation()){  
      if($scope.userData.screenNameOrEmail.indexOf('@') === -1){
        //the user entered a screen name
        $scope.userData.screenName = $scope.userData.screenNameOrEmail;
      } else {
        //the user entered an email
        $scope.userData.email = $scope.userData.screenNameOrEmail;
      }
      LevelUserService.signIn($scope.userData, function(data){
        LevelUserService.self = data;
        $window.localStorage.setItem('self', JSON.stringify(data));
        console.log('_self', JSON.stringify(LevelUserService.self));
        $state.go('app.activity');
      });
    }
  };

  $scope.cancel = function(){
    $state.go('login');
  };

  //validate user inputs
    $scope.formValidation = function(){
    if(!$scope.form.validation.screenNameOrEmail.$valid){
      $ionicPopup.alert({
        title: 'Incomplete Form',
        template: 'Enter either Screen Name or Email'
      });
      return false;
    }
    if(!$scope.form.validation.password.$valid){
      $ionicPopup.alert({
        title: 'Incomplete Form',
        template: 'Incorrect password format'
      });
      return false;
    }
    return true;
  };

}])