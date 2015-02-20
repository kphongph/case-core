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
    ])
    .directive('buddhistEra',function (){
        return {
          restrict:'A',
          require: 'ngModel',
          link: function ($scope, $element, $attrs, $ctrl) {
            /*
            $element.bind('keyup', function() {
              if($ctrl.$viewValue.length < 8) {
                var tmp = $ctrl.$viewValue.replace(/[^0-9\.]+/g,'');
                $element.val(tmp);
              } else {
                var date = parseInt($ctrl.$viewValue.slice(0,2));
                var month = parseInt($ctrl.$viewValue.slice(2,4));
                var year = parseInt($ctrl.$viewValue.slice(4,8));
                if(year < 543) {
                  year = 543;
                }
                var tmp = new Date(year-543, month-1, date);
                var format = ('0'+(tmp.getDate())).slice(-2);
                format += '-';
                format += ('0'+(tmp.getMonth()+1)).slice(-2);
                format += '-';
                format += tmp.getFullYear()+543;
                $ctrl.$viewValue = format;
                $element.val(format);
              }
            });

            $element.bind('click', function() {
              $element.val('');
            });
            */
 
            $ctrl.$formatters.unshift(function(modelValue) {
              if(modelValue) {
                var tmp = new Date(modelValue);
                var format = ('0'+(tmp.getDate())).slice(-2);
                format += '-';
                format += ('0'+(tmp.getMonth()+1)).slice(-2);
                format += '-';
                format += tmp.getFullYear()+543;
                return format;
              }
              return null;
            });

            $ctrl.$parsers.unshift(function(viewValue) {
              console.log(viewValue);
              var parts = viewValue.split('-');
              try {
                var tmp_date = new Date(parts[2]-543,parts[1]-1,parts[0]);
                console.log(tmp_date);
                return tmp_date.toISOString();
              } catch(err) {
              }
            });
          }
        };
    });

});
