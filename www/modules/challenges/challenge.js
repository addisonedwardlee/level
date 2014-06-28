angular.module('challenges', [
  'challenges.allChallenges',
  'challenges.oneChallenge',
  'challenges.challengeService'
  ])

.config(function($stateProvider) {

  $stateProvider
    .state('app.challenges', {
      url: "/challenges",
      views: {
        'menuContent' :{
          templateUrl: "modules/challenges/allChallenges/allChallenges.html",
          controller: 'ChallengesCtrl'
        }
      }
    })
    .state('app.oneChallenge', {
      url: "/challenges/:challengeId/:challengeTemplate",
      views: {
        'menuContent' :{
          templateUrl: "modules/challenges/oneChallenge/oneChallenge.html",
          controller: 'ChallengeCtrl'
        }
      }
    });
});