define([
  './module'
], function(module) {
  return module.config(function($stateProvider) {
    $stateProvider.state('host.info', {
      url: '/info',
      templateUrl: 'js/host/templates/host.detail.html',
      controller: function($scope) {
        console.log('Get host info!!!');
      }
    });
  });
});
