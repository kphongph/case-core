define([
  'angular',
  'ngRoute',
  'lb.services',
  '../util'
], function(angular) {
  angular.module('app.host',['ngRoute','lbServices','utilServices'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/host', {
       templateUrl: 'js/host/templates/list.html',
       controller: 'HostListCtrl'
    })
    .when('/host/:id', {
       templateUrl: 'js/host/templates/detail.html',
       controller: 'HostDetailCtrl'
    })
    .otherwise({
      redirectTo:'/host'
    });


  }])
  .controller('HostListCtrl',[
    '$scope', '$injector', 'Employee', 
    'Host', 'Personvshost','UtilServices',
    function($scope,$injector,Employee,
      Host,Personvshost,UtilServices) {
    require(['js/host/list'], function(list) { 
      $injector.invoke(list, this, {
        '$scope':$scope, 
        'Host':Host, 
        'Employee':Employee,
        'Personvshost':Personvshost,
        'UtilServices':UtilServices
      });
    });
  }])
  .controller('HostDetailCtrl',[
    '$scope','$routeParams','$injector', 
    'Host','Person','UtilServices',
    function($scope,$routeParams,$injector,
      Host,Person,UtilServices) {
    require(['js/host/detail'], function(detail) { 
      $injector.invoke(detail, this, {
        '$routeParams':$routeParams,
        '$scope':$scope, 
        'Host':Host, 
        'Person':Person, 
        'UtilServices':UtilServices, 
      });
    });
  }]);

});
