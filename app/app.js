'use strict';

var angular = require('angular');
require('jquery');
require('bootstrap');
require('angular-route');
require('angular-resource');
require('angular-bootstrap');
require('angular-bootstrap-tpls');
require('./js/lb-services');

var app = angular.module('app', [
  require('./modules/person').name,
  require('./modules/form').name,
  'ui.bootstrap',
  'lbServices'
]);

app.config(function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/person'
  });
});
