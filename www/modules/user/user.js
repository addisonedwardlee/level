angular.module('user', [
  'user.loginPage',
  'user.newAccount',
  'user.levelLogin',
  'user.settings',
  'user.leaderboard',
  'user.profile',
  'user.charts',
  'user.fblogin',
  'user.twitterlogin',
  'user.levelusers'
  ])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: "/login",
        templateUrl: "modules/user/loginPage/loginPage.html",
        controller: 'LoginCtrl'
    })
    .state('newAccount', {
      url: "/newAccount",
        templateUrl: "modules/user/newAccount/newAccount.html",
        controller: 'NewAccountCtrl'
    })
    .state('levelLogin', {
      url: "/levelLogin",
        templateUrl: "moduless/user/levelLogin/levelLogin.html",
        controller: 'LevelLoginCtrl'
    })
    .state('app.profile', {
      url: "/profile/:profileId",
      views: {
        'menuContent' :{
          templateUrl: "modules/user/profile/profile.html",
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.charts', {
      url: "/profile/:profileId/:screenName/charts",
      views: {
        'menuContent' :{
          templateUrl: "modules/user/profile/charts/charts.html",
          controller: 'ChartsCtrl'
        }
      }
    })
    .state('app.leaderboard', {
      url: "/leaderboard",
      views: {
        'menuContent' :{
          templateUrl: "modules/user/leaderboard/leaderboard.html",
          controller: 'LeaderboardCtrl'
        }
      }
    })
    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "modules/user/settings/settings.html",
          controller: 'SettingsCtrl'
        }
      }
    });
});
