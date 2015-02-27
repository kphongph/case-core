define([
  'angular',
  'angular-th',
  'ngRoute',
  'ngBootstrap',
  'ngBootstrap-tpls',
  '../modules/users/app',
  '../modules/forms/app',
  './person/app',
  './address/app',
], function(angular) {

  var module = angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'app.modules.users',
    'app.modules.forms',
    'app.address',
    'app.person'
  ]);

  module.config(function($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/person'
    });
  });
  
  return module;
});
