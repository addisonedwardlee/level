angular.module('level.services.fblogin', [])

.service('FacebookLoginService', ['$rootScope', '$q', '$window', '$http', 
  function($rootScope, $q, $window, $http){

  var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth';

  // By default we store fbtoken in sessionStorage
  var tokenStore = window.sessionStorage;
  var fbAppId;
  var deferredLogin;
  var oauthRedirectURL = 'https://www.facebook.com/connect/login_success.html';

  /**
   * Initialize the OpenFB module. You must use this function and initialize the module with an appId before you can
   * use any other function.
   * @param appId - The id of the Facebook app
   */
  this.init = function(appId) {
    fbAppId = appId;
  };

  /**
   * Login to Facebook using OAuth. The OAuth workflow happens using the In-App Browser. 
   * @param fbScope - The set of Facebook permissions requested
   */
  this.login = function() {
    var loginWindow;

    deferredLogin = $q.defer();
    
    //reset the token before starting
    this.logout();

    loginWindow = window.open(FB_LOGIN_URL + '?client_id=' + fbAppId + '&redirect_uri=' + oauthRedirectURL +
      '&response_type=token&display=popup&scope=public_profile,user_friends,email', '_blank', 'location=no');

    // Listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
    loginWindow.addEventListener('loadstart', function (event) {
      var url = event.url;
      console.log('fb', url);
      if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
      console.log('if statement pass');

        loginWindow.close();
        oauthCallback(url);
      }
    });

    loginWindow.addEventListener('exit', function () {
      // Handle the situation where the user closes the login window manually before completing the login process
      deferredLogin.reject({error: 'user_cancelled', error_description: 'User cancelled login process', error_reason: "user_cancelled"});
    });

    return deferredLogin.promise;
  };

  /**
   * Called either by the loginWindow loadstart event handler defined in the login() function
   * @param url - The oautchRedictURL called by Facebook with the access_token in the querystring at the ned of the
   * OAuth workflow.
   */
  this.oauthCallback = function(url) {
    console.log('oauth called');
    // Parse the OAuth data received from Facebook
    var queryString;
    var obj;

    if (url.indexOf("access_token=") > 0) {
      console.log('insideAccess')
      queryString = url.substr(url.indexOf('#') + 1);
      obj = this.parseQueryString(queryString);
      tokenStore.fbtoken = obj.access_token;
      deferredLogin.resolve();
    } else if (url.indexOf("error=") > 0) {
      queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
      obj = this.parseQueryString(queryString);
      console.log('inside Errr', obj)

      deferredLogin.reject(obj);
    } else {
      deferredLogin.reject();
    }
  };

  /**
   * Application-level logout: discard the token.
   */
  this.logout = function() {
    tokenStore.fbtoken = undefined;
  };

  /**
   * Lets you make any Facebook Graph API request.
   * @param obj - Request configuration object. Can include:
   *  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
   *  path:    path in the Facebook graph: /me, /me.friends, etc. - Required
   *  params:  queryString parameters as a map - Optional
   */
  this.api = function(obj, callback) {

    var method = obj.method || 'GET';
    var params = obj.params || {};

    params['access_token'] = tokenStore.fbtoken;

    $http({method: method, url: 'https://graph.facebook.com' + obj.path, params: params})
      .success(function(data){
        callback(data);
      })
      .error(function(data, status, headers, config) {
        console.log('httpError', JSON.strigify(data));
        if (data.error && data.error.type === 'OAuthException') {
          $rootScope.$emit('OAuthException');
        }
      });
  };

  this.getMe = function(callback) {

    var params = {
      access_token: tokenStore.fbtoken
    };

    console.log('fbToken', tokenStore.fbtoken);
    $http.get('https://graph.facebook.com/me', params)
      .success(function(data){
        console.log('success', data)
        callback(data);
      })
      .error(function(data, status, headers, config) {
        console.log('httpError', JSON.strigify(data));
        if (data.error && data.error.type === 'OAuthException') {
          $rootScope.$emit('OAuthException');
        }
      });
  };

  /**
   * Helper function for a POST call into the Graph API
   * @param path
   * @param params
   * @returns {*}
   */
  this.post = function(path, params) {
    return this.api({method: 'POST', path: path, params: params});
  };

  this.parseQueryString = function(queryString) {
    var qs = decodeURIComponent(queryString),
      obj = {},
      params = qs.split('&');
    params.forEach(function (param) {
      var splitter = param.split('=');
      obj[splitter[0]] = splitter[1];
    });
    return obj;
  };
}]);

// Global function called back by the OAuth login dialog
function oauthCallback(url) {
  var injector = angular.element(document.getElementById('main')).injector();
  injector.invoke(function (FacebookLoginService) {
    FacebookLoginService.oauthCallback(url);
  });
}