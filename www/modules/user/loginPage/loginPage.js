angular.module('user.loginPage', [])

.controller('LoginCtrl', ['$scope', '$state', 'LevelUserService', 'FacebookLoginService', 'TwitterLoginService', '$rootScope', '$window',
 function($scope, $state, LevelUserService, FacebookLoginService, TwitterLoginService, $rootScope, $window) {

  //get the user's data from local storage if it exists
  var checkLocalStroage = function(){
    if($window.localStorage.getItem('self')){
      LevelUserService.self = JSON.parse($window.localStorage.getItem('self'));
      console.log('localStorage', JSON.stringify(LevelUserService.self));
    } else {
      console.log('no self in local storage');
      return false;
    }
  };

  //used for testing only
  $scope.skipLogin = function(){
    // var twitterData = {
    //     screenName: '@Addison_Lee_',
    //     authIdTwitter: '2553293678',
    //     userImg: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png'
    //   };

    //   LevelUserService.twitterConnect(twitterData, function(data){
    //     LevelUserService.self = data;
    //     $window.localStorage.setItem('self', JSON.stringify(data));
    //     console.log('_self', JSON.stringify(LevelUserService.self));
    //     $state.go('app.activity');
    //   });

    var fbData = {"name":"Addison Lee","authIdFacebook":"10152422655116168","userImg":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/t1.0-1/c0.0.200.200/p200x200/1375292_10151889353406168_1262564601_n.jpg","screenName":"TheRealAddison"};
      LevelUserService.facebookConnect(fbData, function(data){
        LevelUserService.self = data;
        $window.localStorage.setItem('self', JSON.stringify(data));
        console.log('_self', JSON.stringify(LevelUserService.self));
        $state.go('app.activity');
      });
  };

  $scope.basicLogin = function(){
    $state.go('levelLogin');
  };

  $scope.facebookLogin = function () {
    if(checkLocalStroage()){
      console.log('localStorage self exists');
      $state.go('app.activity');
    } else {
      console.log('localStorage self does not exist');
      FacebookLoginService.login()
      .then(function(){
        console.log('got initial, getting me');

        FacebookLoginService.get('/me')
          .success( function (user){
            console.log('got me', JSON.stringify(user));
            //parse the FB data and temporarily store it in LevelUserService
             LevelUserService.self = {
              authIdFacebook: user.id,
              profile: {
                name: user.name
              }
            };
            console.log('self/???', JSON.stringify(LevelUserService.self));
            $state.go('createScreenName');
          });
      })
      .catch(function (error) {
        console.log('FacebookLoginService error', error);
      });
    }
  };

  $scope.twitterLogin = function () {
    if(checkLocalStroage()){
      console.log('localStorage self exists');
      $state.go('app.activity');
    } else {
      TwitterLoginService.init()
      .then(function (data) {
        console.log('twitterData', data);
        var twitterData = {
          name: data.name,
          screenName: '@' + data.screen_name,
          authIdTwitter: '' + data.id,
          userImg: data.profile_image_url
        };

        LevelUserService.twitterConnect(twitterData, function(data){
          LevelUserService.self = data;
          $window.localStorage.setItem('self', JSON.stringify(data));
          console.log('_self', JSON.stringify(LevelUserService.self));
          $state.go('app.activity');
        });
      })
      .catch(function (error) {
        console.log('error', JSON.stringify(error));
      });
    }
  };

  $scope.createAccount = function(){
    $state.go('newAccount');
  };

}]);