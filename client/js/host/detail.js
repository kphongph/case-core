define([], function() {
  return ['$routeParams', '$scope', 'Host', 'Person', 'UtilServices',
    function($routeParams, $scope, Host, Person, UtilServices) {

      $scope.host = null;
      $scope.currentPage = 0;
      $scope.itemPerPage = 5;
      $scope.people_cid = [];
      $scope.people = [];

      // initial loader
      Host.findById({
        id: $routeParams.id
      }).$promise.then(function(result) {
        $scope.host = result;
        UtilServices.getPeopleByHost($routeParams.id, function(data) {
          $scope.people_cid = data;
          $scope.currentPage = 1;
        });
      });

      $scope.$watch('currentPage', function() {
        var begin = (($scope.currentPage - 1) * $scope.itemPerPage);
        var end = begin + $scope.itemPerPage;
        $scope.people = $scope.people_cid.slice(begin, end);
        $scope.people.forEach(function(person) {
          Person.findById({
              id: person.CID
            }).$promise
            .then(function(result) {
              angular.extend(person, result);
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
    }
  ];
});
