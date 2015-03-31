var app = angular.module('StarterApp', ['ngMaterial','lbServices']);

app.controller('AppCtrl', function($scope, $mdSidenav, Person) {
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.search = function() {
    Person.find({filter:{
      where:{
        CID:{ "like": $scope.query },
      },
      limit:10}
    }).$promise.then(function(result) {
      console.log(result);
    });
    console.log($scope.query);
  }

});
