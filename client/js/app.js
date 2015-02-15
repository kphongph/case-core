define([
  'angular',
  'ngRoute',
  './host/routes'
], function(angular) {

  return angular.module('app', [
    'ngRoute',
    'app.host',
  ]).config(function($routeProvider) {
    $routeProvider.otherwise({redirectTo:'/host'});
  });

});
