var app = angular.module('app', [
  'ngMaterial',
  'lbServices'
]);

app.controller('AppCtrl', function($scope,Person) {
  $scope.search = function() {
    Person.find({filter:{limit:10}})
    .$promise.then(function(result) {
      console.log(result);
      $scope.people=result;
    });
  }
});
