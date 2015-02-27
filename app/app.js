'use strict';

var angular = require('angular');
require('jquery');
require('bootstrap');


var app = angular.module('app', []);


app.controller('HelloCtrl', function($scope) {
  $scope.test = 'Test V';
});

