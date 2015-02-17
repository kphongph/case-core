define([
  'angular',
  'ngRoute',
  'ngBootstrap',
  'ngBootstrap-tpls',
  './host/app',
  './person/app',
], function(angular) {

  return angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'app.host',
    'app.person'
  ]).config(function($routeProvider) {
    $routeProvider.otherwise({redirectTo:'/host'});
  });

});
