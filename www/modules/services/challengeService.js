angular.module('level.services.challenge', [])

.service('ChallengeService', ['$http', '$rootScope', 'API_ENDPOINT',
  function($http, $rootScope, API_ENDPOINT){

  //@limits -> {indexStart, indexLimit} used for pagination
  this.getMany = function(params, callback){
    $http.post(API_ENDPOINT + '/challenges/get/', params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@id -> Challenge Id string
  this.getOne = function(id, callback){
    $http.get(API_ENDPOINT + '/challenge/get/' + id)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

 //@params -> {challengeId: STRING, taskId: STRING, sets: NUMBER, reps: NUMBER, amount: NUMBER, text: STRING}
  this.takeChallenge = function(params, callback){
    $http.post(API_ENDPOINT + '/mychallenge/add/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@params -> {userId: STRING, session: STRING}
  this.getUserChallenges = function(params, callback){
    $http.post(API_ENDPOINT + '/mychallenges/get/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@params -> {userId: STRING, session: STRING}
  this.completeTask = function(params, callback){
    params.user = {
      type: 't',
      id: $rootScope._self.authIdTwitter,
      screen_name: $rootScope._self.screenName.substring(1)
    };
    params.created_at = new Date().toUTCString();
    $http.post('http://stats.level.my/postData', params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@params -> challenge creation object (refer to challenge.js for specifics)
  this.create = function(params, callback){
    $http.post(API_ENDPOINT + '/challenge/add/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@params -> {userId: STRING, session: STRING, challengeId: STRING, key: newValue}
  this.update = function(params, callback){
    $http.post(API_ENDPOINT + '/challenge/update/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@params -> {challengeId: STRING}
  this.del = function(params, callback){
    $http.post(API_ENDPOINT + '/challenge/delete/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

}]);