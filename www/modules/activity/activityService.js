angular.module('activities.activityService', [])

.service('ActivityService', ['$http', 'LevelUserService', 'API_ENDPOINT', 
  function($http, LevelUserService, API_ENDPOINT){

  //this is used when navigating from one view to another
  // to avoid doing unneccesary API calls
  this.currentService = {};

  this.getAll = function(params, callback){
    $http.post(API_ENDPOINT + '/activities/get/' + LevelUserService.self.userId + '/' + LevelUserService.self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.create = function(params, callback){
    $http.post(API_ENDPOINT + '/activity/add/' + LevelUserService.self.userId + '/' + LevelUserService.self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.update = function(params, callback){
    $http.post(API_ENDPOINT + '/activity/update/' + LevelUserService.self.userId + '/' + LevelUserService.self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.deletePost = function(params, callback){
    $http.post(API_ENDPOINT + '/activity/delete/' + LevelUserService.self.userId + '/' + LevelUserService.self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.like = function(params, callback){
    $http.post(API_ENDPOINT + '/like/add/' + LevelUserService.self.userId + '/' + LevelUserService.self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.comment = function(params, callback){
    $http.post(API_ENDPOINT + '/comment/add/' + LevelUserService.self.userId + '/' + LevelUserService.self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

  this.deleteComment = function(params, callback){
    $http.post(API_ENDPOINT + '/comment/delete/' + LevelUserService.self.userId + '/' + LevelUserService.self.session, params)
      .success(function(data, status){
        callback(data);
      })
      .error(function(data, status){
        console.log('Error:' + data + '\n Status:' + status);
      });
  };

}]);