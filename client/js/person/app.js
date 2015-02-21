define([
  'angular',
  'ngRoute',
  'ngBootstrap',
  'ngBootstrap-tpls',
  'lb.services',
  'util.services'
], function(angular) {
  var module = angular.module('app.person', ['ngRoute', 'lbServices',
    'utilServices', 'ui.bootstrap']);

  module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/person/:id?', {
      templateUrl: 'js/person/templates/detail.html',
      controller: 'PersonDetailCtrl'
    })
  }]);

/*
  module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/person', {
      templateUrl: 'js/person/templates/detail.html',
      controller: 'PersonDetailCtrl'
      controller: 'PersonSearchCtrl'
    })
  }]);
*/

  module.controller('PersonSearchCtrl', [
    '$scope', 'Person', 'UtilServices', '$injector',
    function($scope, Person, UtilServices, $injector) {
      require(['js/person/search'], function(detail) {
        $injector.invoke(detail, this, {
          '$scope': $scope,
          'Person': Person,
          'UtilServices': UtilServices,
        });
      });
    }
  ]);

  module.controller('PersonDetailCtrl', [
    '$scope', '$routeParams', '$timeout', 'Host', 'Person',
    'Adressvsperson', 'Address', 'UtilServices', '$injector',
    function($scope, $routeParams, $timeout, Host, Person,
      Adressvsperson, Address, UtilServices, $injector) {
      require(['js/person/detail'], function(detail) {
        $injector.invoke(detail, this, {
          '$routeParams': $routeParams,
          '$scope': $scope,
          '$timeout': $timeout,
          'Host': Host,
          'Person': Person,
          'Adressvsperson': Adressvsperson,
          'Address': Address,
          'UtilServices': UtilServices,
        });
      });
    }
 ]);
});
