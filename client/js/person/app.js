define([
  'angular',
  'ngRoute',
  'lb.services',
  '../util'
], function(angular) {
  angular.module('app.person', ['ngRoute', 'lbServices', 'utilServices'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/person/:id', {
        templateUrl: 'js/person/templates/detail.html',
        controller: 'PersonDetailCtrl'
      });

    }])
    .controller('PersonDetailCtrl', [
      '$scope', '$routeParams', '$injector',
      'Host', 'Person', 'UtilServices',
      function($scope, $routeParams, $injector,
        Host, Person, UtilServices) {
        require(['js/person/detail'], function(detail) {
          $injector.invoke(detail, this, {
            '$routeParams': $routeParams,
            '$scope': $scope,
            'Host': Host,
            'Person': Person,
            'UtilServices': UtilServices,
          });
        });
      }
    ]);

});
