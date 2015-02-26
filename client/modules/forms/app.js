define([
  'angular',
  'ngRoute',
  'ngBootstrap',
  'ngBootstrap-tpls',
  'lb.services',
  'util.services'
], function(angular) {
  var module = angular.module('app.modules.forms', ['ngRoute', 'lbServices',
    'utilServices', 'ui.bootstrap']);

  module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/form/:id', {
      templateUrl: 'modules/forms/views/detail.html',
      controller: 'FormDetailCtrl'
    })
  }]);

  module.controller('FormDetailCtrl', [
    '$scope', '$routeParams', '$timeout', 'Host', 'Person', 'Form',
    'Systemtype', 'UtilServices', '$injector',
    function($scope, $routeParams, $timeout, Host, Person, Form, Systemtype,
      UtilServices, $injector) {
      require(['modules/forms/controllers/detail'], function(detail) {
        $injector.invoke(detail, this, {
          '$routeParams': $routeParams,
          '$scope': $scope,
          '$timeout': $timeout,
          'Host': Host,
          'Person': Person,
          'Form': Form,
          'Systemtype': Systemtype,
          'UtilServices': UtilServices,
        });
      });
    }
 ]);
});
