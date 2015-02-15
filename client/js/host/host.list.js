define([
  './module',
  './test_con'
], function(module) {
  return module.config(function($routeProvider) {
    $routeProvider.when('/host', {
       templateUrl: 'js/host/templates/list.html',
       controller: 'simple'
    });
  });
});
