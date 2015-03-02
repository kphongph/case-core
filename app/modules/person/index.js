'use strict';

module.exports = angular.module('app.modules.person', [
    'ngRoute',
    'lbServices'
  ]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/person/:id?', {
      templateUrl: 'modules/person/views/detail.html',
    })
  }])
  .controller(
    'app.modules.person.controllers.Search',
    require('./controllers/search'))
  .directive('personSearch',
    require('./directives/search'))