angular.module('user.createScreenName', [])

.controller('CreateScreenNameCtrl', ['$scope', '$state', 'LevelUserService', 'FacebookLoginService',
  function($scope, $state, LevelUserService, FacebookLoginService) {
  
  $scope.self = LevelUserService.self;

  //used to capture all user entered data
  $scope.form = {};
  $scope.userData = {};
  $scope.createAccount = function(){
    if($scope.formValidation()){
      //first, get the user's image from Facebook
      FacebookLoginService.get('/me/picture?redirect=0&height=200&type=normal&width=200')
        .success(function (fbdata) {
          //@data from Facebook -> {data: {url: STRING }}
          //get all the appropriate data and send to the DB
          console.log('fbdata', JSON.stringify(fbdata.data));
          var data = {
            userName: $scope.self.name,
            authIdFacebook: $scope.self.authIdFacebook,
            userImg: fbdata.data.url,
            screenName: $scope.userData.screenName
          };
          console.log('pre self', JSON.stringify(data));
          LevelUserService.facebookConnect(data, function (levelData){
            LevelUserService.self = levelData;
            $window.localStorage.setItem('self', JSON.stringify(levelData));
            console.log('_self', JSON.stringify(LevelUserService.self));
            $state.go('app.activity');
          });
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
    return true;
  };

}]);