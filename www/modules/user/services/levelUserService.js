angular.module('user.levelusers', [])

.service('LevelUserService', ['$http', 'API_ENDPOINT', 
  function($http, API_ENDPOINT){

  this.self = {};
  this.otherUser = {};

  //@params -> {userId: STRING, session: STRING}
  this.verifySession = function(params, callback) {
    $http.get(API_ENDPOINT + '/user/verifysession/' + this.self.userId + '/' + this.self.session)
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
    $http.post(API_ENDPOINT + '/user/update/' + this.self.userId + '/' + this.self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.delete = function(params, callback){
    $http.post(API_ENDPOINT + '/user/delete/' + this.self.userId + '/' + this.self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  //@id -> userId or _id
  this.getCharts = function(params, callback){
    $http.get('http://stats.level.my/json/series/' + params.screenName)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

}]);