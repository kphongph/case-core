define([
  './module',
  './test_con'
], function(module) {
  return module.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('host', {
      url: '/host',
      views: {
        '':{ templateUrl: 'js/host/templates/main.html'},
        'filter@host' : {
           templateUrl:'js/host/templates/filter.html'
        }
 
        //  controller: 'simple'
      }
    });
  });
});
