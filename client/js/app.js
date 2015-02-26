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

  return angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'app.modules.users',
    'app.modules.forms',
    'app.address',
    'app.person'
  ]).config(function($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/person'
    });
  });

});
