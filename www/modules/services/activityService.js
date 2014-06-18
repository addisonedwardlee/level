angular.module('level.services.activity', [])

.service('ActivityService', ['$http', '$rootScope', 'API_ENDPOINT', 
  function($http, $rootScope, API_ENDPOINT){

  this.getAll = function(params, callback){
    $http.post(API_ENDPOINT + '/activities/get/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.create = function(params, callback){
    $http.post(API_ENDPOINT + '/activity/add/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.update = function(params, callback){
    $http.post(API_ENDPOINT + '/activity/update/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.deletePost = function(params, callback){
    $http.post(API_ENDPOINT + '/activities/delete/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.like = function(params, callback){
    $http.post(API_ENDPOINT + '/like/add/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.comment = function(params, callback){
    $http.post(API_ENDPOINT + '/comment/add/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.deleteComment = function(params, callback){
    $http.post(API_ENDPOINT + '/comment/delete/' + $rootScope._self.userId + '/' + $rootScope._self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

}]);