define([
  'angular',
  'ngRoute',
  'ngBootstrap',
  'ngBootstrap-tpls',
  'lb.services',
  '../util'
], function(angular) {
  angular.module('app.person', ['ngRoute', 'lbServices', 'utilServices', 'ui.bootstrap'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/person/:id', {
        templateUrl: 'js/person/templates/detail.html',
        controller: 'PersonDetailCtrl'
      });

    }])
    .controller('PersonDetailCtrl', [
      '$scope', '$routeParams', '$timeout', '$injector',
      'Host', 'Person', 'Adressvsperson', 'Address', 'UtilServices',
      function($scope, $routeParams, $timeout, $injector,
        Host, Person, Adressvsperson, Address, UtilServices) {
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
