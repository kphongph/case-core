define([
  'angular',
  'angular-th',
  'ngRoute',
  'ngBootstrap',
  'ngBootstrap-tpls',
  './host/app',
  './person/app',
  './address/app',
], function(angular) {

  return angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'app.host',
    'app.address',
    'app.person'
  ]).config(function($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/host'
    });
  });

});
