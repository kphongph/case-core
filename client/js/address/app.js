define([
  'angular',
  'ngRoute',
  'ngBootstrap',
  'ngBootstrap-tpls',
  'lb.services',
  'util.services'
], function(angular) {
  var module = angular.module('app.address', ['ngRoute', 'lbServices',
    'utilServices', 'ui.bootstrap']);

  module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/address', {
      templateUrl: 'js/address/templates/search.html',
      controller: 'AddressSearchCtrl'
    })
  }]);


  module.controller('AddressSearchCtrl', [
    '$scope', 'Address', 'UtilServices', '$injector',
    function($scope, Address, UtilServices, $injector) {
      require(['js/address/search'], function(search) {
        $injector.invoke(search, this, {
          '$scope': $scope,
          'Person': Address,
          'UtilServices': UtilServices,
        });
      });
    }
  ]);

  /*
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
  */
});
