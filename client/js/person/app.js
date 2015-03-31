var module = angular.module('app.person', ['ngRoute']);

module.config(function($routeProvider) {
  $routeProvider.when('/person/:id?', {
    templateUrl: 'js/person/templates/detail.html',
  })
});

