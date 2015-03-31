var module = angular.module('app', [
  'ngRoute',
  'app.person'
]); 

module.config(function($routeProvider) {
 $routeProvider.otherwise({redirectTo:'/person'});
});
