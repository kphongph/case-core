define([
  'angular',
  'ngRoute',
  'lb.services',
], function(angular) {
  var module = angular.module('app.modules.users', ['lbServices']);

  /*
  module.directive('login', function() {
    return {
      templateUrl: 'modules/users/views/login.html',
      restrict: 'E',
    }
  });
  */

  module.directive('login', ['$injector', function($injector) {
    require(['modules/users/directives/login'], function(login) {
      console.log(JSON.stringify(login));
      return $injector.invoke(login, this, {});
    });
  }]);

});
