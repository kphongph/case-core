define([], function() {
  return ['$routeParams','$scope','Host','Person','UtilServices', 
  function($routeParams,$scope,Host,Person,UtilServices) {

    $scope.host = null;
    $scope.currentPage = 0;
    $scope.itemPerPage = 5;
    $scope.persons = [];

    Host.findById({id:$routeParams.id}).$promise.then(function(result) {
      $scope.host = result;
      UtilServices.getPersonByHost($routeParams.id,function(data) {
        $scope.host.persons = [];
        data.forEach(function(person) {
          Person.find({filter:{
            where:{cid:{like:person.CID+'%'}}}}).$promise
          .then(function(result) {
            $scope.host.persons.push(result[0]);
          });
        });
      });
    });
         
    /*
    $scope.$watch('active_hosts + currentPage', function() {
      var begin = (($scope.currentPage - 1) * $scope.itemPerPage);
      var end = begin + $scope.itemPerPage;
      $scope.hosts = $scope.active_hosts.slice(begin, end);
    });
    */

    $scope.$apply();
  }];
});
