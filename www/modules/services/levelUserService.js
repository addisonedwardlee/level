angular.module('level.services.levelusers', [])

.service('LevelUserService', ['$http', '$rootScope', 'API_ENDPOINT', 
  function($http, $rootScope, API_ENDPOINT){

  //@params -> {userId: STRING, session: STRING}
  this.verifySession = function(params, callback) {
    $http.get(API_ENDPOINT + '/user/verifysession/' + $rootScope._self.userId + '/' + $rootScope._self.session)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@id -> userId or _id
  this.getOne = function(id, callback){
    $http.get(API_ENDPOINT + '/user/get/' + id)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.twitterConnect = function(params, callback){
    $http.post(API_ENDPOINT + '/user/connect/', params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.facebookConnect = function(params, callback){
    $http.post(API_ENDPOINT + '/user/connect/', params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@params -> {either screenName or email: STRING, password: STRING}
  this.signIn = function(params, callback){
    $http.post(API_ENDPOINT + '/user/signin', params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@params -> {screenName: STRING, email: STRING, password: STRING}
  this.create = function(params, callback){
    $http.post(API_ENDPOINT + '/user/signup', params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.update = function(params, callback){
    $http.post(API_ENDPOINT + '/user/update', params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.delete = function(params, callback){
    $http.post(API_ENDPOINT + '/user/delete', params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@id -> userId or _id
  this.getCharts = function(callback){
    $http.get('http://stats.level.my/json/series/' + $rootScope._self.screenName)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

}]);