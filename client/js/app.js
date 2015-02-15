define([
  'angular',
  'ui.router',
  './host/routes'
], function(angular) {

  'use strict';

  return angular.module('app', [
    'app.host',
    'ui.router',
  ]).config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/host');
  });

});
