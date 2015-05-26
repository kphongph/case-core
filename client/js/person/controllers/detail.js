angular.module('app.person').controller(
  'app.person.controllers.detail', 
  function($scope,$routeParams,Person) {
    Person.findById({id:$routeParams.id})
    .$promise.then(function(result) {
      $scope.person = result;
    });
    
});

