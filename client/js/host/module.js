define([
  'angular',
  'ngRoute',
  'ngBootstrap',
  'ngBootstrap-tpls',
  'lb.services',
], function(angular) {
  return angular.module('app.host', [
    'ngRoute',
    'ui.bootstrap',
    'lbServices'
  ]);
});
