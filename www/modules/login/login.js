angular.module('level.controllers.login', [])

.controller('LoginCtrl', ['$scope', '$state', 'LevelUserService', 'FacebookLoginService', 'TwitterLoginService', '$rootScope',
 function($scope, $state, LevelUserService, FacebookLoginService, TwitterLoginService, $rootScope) {

  //used for testing only
  $scope.skipLogin = function(){
    var twitterData = {
        screenName: '@Addison_Lee',
        authIdTwitter: '2553293678',
        userImg: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png'
      };

      LevelUserService.twitterConnect(twitterData, function(data){
        LevelUserService.self = data;
        console.log('_self', JSON.stringify(LevelUserService.self));
        $state.go('app.activity');
      });
  };

  $scope.basicLogin = function(){
    $state.go('levelLogin');
  };

  $scope.facebookLogin = function () {
    FacebookLoginService.login()
    .success(function(){
      FacebookLoginService.getMe(function (data) {
        
        // var facebookData = {
        //   authIdFacebook: data.id,
        //   userImg: data.profile_image_url
        // };

        // LevelUserService.facebookConnect(facebookData, function(data){
          console.log('data', JSON.stringify(data));
        //   LevelUserService.self = data;
        // console.log('_self', JSON.stringify(LevelUserService.self));
        //   $state.go('app.activity');
        // });
      });
    })
    .error(function (error) {
      console.log('FacebookLoginService error', error);
    });
  };

  $scope.twitterLogin = function () {
    TwitterLoginService.init()
    .then(function (data) {
      var twitterData = {
        name: data.name,
        screenName: '@' + data.screen_name,
        authIdTwitter: '' + data.id,
        userImg: data.profile_image_url
      };

      LevelUserService.twitterConnect(twitterData, function(data){
        LevelUserService.self = data;
        console.log('_self', JSON.stringify(LevelUserService.self));
        $state.go('app.activity');
      });
    })
    .catch(function (error) {
      console.log('error', JSON.stringify(error));
    });
  };

  $scope.createAccount = function(){
    $state.go('newAccount');
  };

}])

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
        console.log(data);
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

