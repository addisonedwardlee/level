angular.module('user.newAccount', [])

.controller('NewAccountCtrl', ['$scope', '$state', '$ionicPopup', 'LevelUserService', 
  function($scope, $state, $ionicPopup, LevelUserService) {
  
  //used to capture all user entered data
  $scope.form = {};
  $scope.userData = {};
  $scope.createAccount = function(){
    if($scope.formValidation()){  
      LevelUserService.create($scope.userData, function(data){
        LevelUserService.self = data;
        $state.go('app.activity');
      });
    }
  };

  $scope.cancel = function(){
    $state.go('login');
  };

  //validate user inputs
  $scope.formValidation = function(){
    if(!$scope.form.validation.screenName.$valid){
      $ionicPopup.alert({
        title: 'Incomplete Form',
        template: 'Missing Screen Name'
      });
      return false;
    }
    if(!$scope.form.validation.email.$valid){
      $ionicPopup.alert({
        title: 'Incomplete Form',
        template: 'Missing or Incomplete Email'
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

}]);
