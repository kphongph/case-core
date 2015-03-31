var app = angular.module('app', ['person','onsen']);

app.controller('core.controller.main', function($scope,$window) {
  $scope.push = function() {
    $scope.navigator.pushPage('modules/person/search.html');
  }

  ons.ready(function() {
    $scope.navigator = $window.app.navigator;
  });
});
