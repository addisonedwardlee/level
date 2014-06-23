angular.module('level', [
  'ionic',
  'level.controllers.activities',
  'level.controllers.challenges',
  'level.controllers.home',
  'level.controllers.leaderboard',
  'level.controllers.settings',
  'level.controllers.profile',
  'level.controllers.charts',
  'level.controllers.login',
  'level.services.challenge',
  'level.services.activity',
  'level.services.levelusers',
  'level.services.leaderboard',
  'level.services.fblogin',
  'level.services.twitterlogin',
  'level.services.timeconversion'
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
    .state('login', {
      url: "/login",
        templateUrl: "modules/login/loginHome.html",
        controller: 'LoginCtrl'
    })
    .state('newAccount', {
      url: "/newAccount",
        templateUrl: "modules/login/newAccount.html",
        controller: 'NewAccountCtrl'
    })
    .state('levelLogin', {
      url: "/levelLogin",
        templateUrl: "modules/login/levelLogin.html",
        controller: 'LevelLoginCtrl'
    })
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "modules/home/home.html",
      controller: 'HomeCtrl'
    })
    .state('app.activity', {
      url: "/activity",
      views: {
        'menuContent' :{
          templateUrl: "modules/activity/activities.html",
          controller: 'ActivityCtrl'
        }
      }
    })
    .state('app.activityComments', {
      url: "/activity/:activityData",
      views: {
        'menuContent' :{
          templateUrl: "modules/activity/oneActivity.html",
          controller: 'CommentCtrl'
        }
      }
    })
    .state('app.challenges', {
      url: "/challenges",
      views: {
        'menuContent' :{
          templateUrl: "modules/challenges/allChallenges.html",
          controller: 'ChallengesCtrl'
        }
      }
    })
    .state('app.oneChallenge', {
      url: "/challenges/:challengeId/:challengeTemplate",
      views: {
        'menuContent' :{
          templateUrl: "modules/challenges/oneChallenge.html",
          controller: 'ChallengeCtrl'
        }
      }
    })
    .state('app.profile', {
      url: "/profile/:profileId",
      views: {
        'menuContent' :{
          templateUrl: "modules/profile/profile.html",
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.charts', {
      url: "/profile/:profileId/charts",
      views: {
        'menuContent' :{
          templateUrl: "modules/profile/charts.html",
          controller: 'ChartsCtrl'
        }
      }
    })
    .state('app.leaderboard', {
      url: "/leaderboard",
      views: {
        'menuContent' :{
          templateUrl: "modules/leaderboard/leaderboard.html",
          controller: 'LeaderboardCtrl'
        }
      }
    })
    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "modules/settings/settings.html",
          controller: 'SettingsCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

