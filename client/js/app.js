define([
  'angular',
  'ngRoute',
  'ngBootstrap',
  'ngBootstrap-tpls',
  './host/host'
], function(angular) {

  return angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'app.host'
  ]).config(function($routeProvider) {
    $routeProvider.otherwise({redirectTo:'/host'});
  });

});
