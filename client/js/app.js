'use strict';

var app = angular.module('app', [
  'ui.router',
  'ui.bootstrap',
  'lbServices'
]);

app.config(function($stateProvider,$urlRouterProvider) {
  $urlRouterProvider.otherwise('/host');
  
  $stateProvider.state('host',{
    url:'/host',
    templateUrl:'js/host/templates/list.html',
    controller:'HostListCtrl'
  });

  $stateProvider.state('host.info',{
    url:'/:id',
    templateUrl:'js/host/templates/host.detail.html',
    controller:'HostCtrl'
  });
});
