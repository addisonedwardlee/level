angular.module('level', [
  'ionic',
  'level.home',
  'user',
  'activities',
  'challenges',
  'level.services.timeConversion'
  ])

.constant('API_ENDPOINT', 'http://api.level.my/json')
.constant('myAppConfig', {
    oauthSettings: {
        consumerKey: '6oA2nOvgtau3G2SblyobZovUY',
        consumerSecret: '1FMl312LinkvYOHgYuMBo2uBZ594j4kyeJ072oPhmIQnAXuTiJ',
        requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
        authorizationUrl: "https://api.twitter.com/oauth/authorize",
        accessTokenUrl: "https://api.twitter.com/oauth/access_token",
        callbackUrl: "http://www.level.my"
    }
})

.run(function($state, $rootScope, $ionicPlatform, $window, FacebookLoginService) {
  
  // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
  $ionicPlatform.ready(function() {
    // if(window.cordova && window.cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    // }
    // if(window.StatusBar) {
    //   // org.apache.cordova.statusbar required
    //   StatusBar.styleDefault();
    // }
  });

  //Login related components
  //FACEBOOK
  FacebookLoginService.init(557799661004028);
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "modules/home/home.html",
      controller: 'HomeCtrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

