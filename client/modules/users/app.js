define([
  'angular',
  'ngRoute',
  'lb.services',
], function(angular) {
  var module = angular.module('app.modules.users', ['lbServices']);

  module.config(function($httpProvider) {
    $httpProvider.interceptors.push([ 
      '$injector',
      function($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  });

  // https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec

  module.constant('AUTH_EVENTS', {
   loginSuccess : 'auth-login-success',
   logoutSuccess : 'auth-logout-success',
   notAuthenticated : 'auth-not-authenticated'
  });
  
  module.factory('AuthInterceptor', function($rootScope,$q, AUTH_EVENTS) {
    return {
      responseError: function(response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated
        }[response.status], response);
        return $q.reject(response);
      }
    };
  });

  module.controller('app.modules.users.controllers.Login', [
    '$scope', '$rootScope', 'AUTH_EVENTS', 'User', '$injector', 
    function($scope,$rootScope,AUTH_EVENTS, User,$injector) {
    require(['modules/users/controllers/login.js'], function(login) { 
      $injector.invoke(login, this, {
        '$scope':$scope,
        '$rootScope':$rootScope,
        'AUTH_EVENTS':AUTH_EVENTS,
        'User':User,
      });
    });
  }]);

  module.directive('userInfo', function(AUTH_EVENTS, User) {
    return {
      restrict: 'A',
      template: '<div ng-if="authenticated"' +
           ' ng-include="\'modules/users/views/user.html\'"></div>',
      link: function($scope) {
        var getUser = function() {
          $scope.authenticated = User.isAuthenticated();
          $scope.user = User.getCurrent();
        };

        $scope.authenticated = User.isAuthenticated();
        $scope.user = User.getCurrent();

        $scope.$on(AUTH_EVENTS.loginSuccess, getUser);
        $scope.$on(AUTH_EVENTS.logoutSuccess, getUser);
     }
    }
  });

  module.directive('login', function(AUTH_EVENTS) {
    return {
      restrict: 'A',
      template: '<div ng-if="visible"' +
           ' ng-include="\'modules/users/views/login.html\'"></div>',
      link: function($scope) {
        var showDialog = function() {
          $scope.visible = true;
        }

        var hideDialog = function() {
          $scope.visible = false;
        }

        $scope.visible = false;

        $scope.$on(AUTH_EVENTS.loginSuccess, hideDialog);
        $scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
      }
    }
  });

});
