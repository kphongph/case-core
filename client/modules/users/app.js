define([
  'angular',
  'ngRoute',
  'lb.services',
], function(angular) {
  var module = angular.module('app.modules.users', ['lbServices']);

  module.controller('app.modules.users.controllers.Login', [
    '$scope', 'User', '$injector', function($scope,User,$injector) {
    require(['modules/users/controllers/login.js'], function(login) { 
      $injector.invoke(login, this, {
        '$scope':$scope,
        'User':User,
      });
    });
  }]);

  module.directive('login', function() {
    return {
      templateUrl: 'modules/users/views/login.html',
      restrict: 'E',
    }
  });

});
