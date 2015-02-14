define([
  'angular',
  'ui.router',
  'ngBootstrap',
  'ngBootstrap-tpls',
  'lb.services',
], function(angular) {
  return angular.module('app.host', [
    'ui.router',
    'ui.bootstrap',
    'lbServices'
  ]);
});
