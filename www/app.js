angular.module('level', [
  'ionic',
  'level.home',
  'level.services.timeConversion',
  'user',
  'activities',
  'challenges'
  ])

.constant('API_ENDPOINT', 'http://api.level.my/json')
.constant('TwitterInfo', {
    oauthSettings: {
        consumerKey: '6oA2nOvgtau3G2SblyobZovUY',
        consumerSecret: '1FMl312LinkvYOHgYuMBo2uBZ594j4kyeJ072oPhmIQnAXuTiJ',
        requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
        authorizationUrl: "https://api.twitter.com/oauth/authorize",
        accessTokenUrl: "https://api.twitter.com/oauth/access_token",
        callbackUrl: "http://www.level.my"
    }
})

.run(['$window', 'FacebookLoginService', 'LevelUserService', 
  function($window, FacebookLoginService, LevelUserService) {
  
  // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
  // $ionicPlatform.ready(function() {
    // if(window.cordova && window.cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    // }
    // if(window.StatusBar) {
    //   // org.apache.cordova.statusbar required
    //   StatusBar.styleDefault();
    // }
  // });

  //Login related components
  //FACEBOOK
  FacebookLoginService.init(557799661004028);

}])

.config(function($urlRouterProvider) {

  // if no state is matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

