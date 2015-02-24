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
    '$scope', 'Address', 'Province', 'City', 'Tumbon', 'Village',
    'UtilServices', '$injector',
    function($scope, Address, Province, City, Tumbon, Village, UtilServices,
      $injector) {
      require(['js/address/search'], function(search) {
        $injector.invoke(search, this, {
          '$scope': $scope,
          'Address': Address,
          'Province': Province,
          'City': City,
          'Tumbon': Tumbon,
          'Village': Village,
          'UtilServices': UtilServices,
        });
      });
    }
  ]);

});
