angular.module('activities', [
  'activities.allActivities',
  'activities.oneActivity',
  'activities.activityService'
  ])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('app.activity', {
      url: "/activity",
      views: {
        'menuContent' :{
          templateUrl: "modules/activity/allActivities/allActivities.html",
          controller: 'ActivityCtrl'
        }
      }
    })
    .state('app.activityComments', {
      url: "/activity/:activityData",
      views: {
        'menuContent' :{
          templateUrl: "modules/activity/oneActivity/oneActivity.html",
          controller: 'CommentCtrl'
        }
      }
    });
});