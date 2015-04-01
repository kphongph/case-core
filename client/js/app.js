var module = angular.module('app', [
  'ui.bootstrap',
  'ngRoute',
  'app.person'
]); 

module.config(function($routeProvider) {
 $routeProvider.otherwise({redirectTo:'/person'});
});
