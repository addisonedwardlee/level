angular.module('user.loginPage', [])

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
    .then(function(data){
      FacebookLoginService.get('/me')
      .success( function (user){
         var facebookData = {
          authIdFacebook: user.id,
          name: user.name
        };
        FacebookLoginService.get('/me/picture?redirect=0&height=200&type=normal&width=200')
        .success(function (image) {
          facebookData.userImg = image.data.url;
          LevelUserService.facebookConnect(facebookData, function(data){
            LevelUserService.self = data;
            console.log('_self', JSON.stringify(LevelUserService.self));
            $state.go('app.activity');
          });
        });
      });
    })
    .catch(function (error) {
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

}]);