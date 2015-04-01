var app = angular.module('StarterApp', ['ngMaterial']);

app.controller('AppCtrl', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
  
  $scope.search = function() {
    console.log("search");
  }
});
