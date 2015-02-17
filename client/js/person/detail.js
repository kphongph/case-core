define([], function() {
  return ['$routeParams','$scope','Host','Person','UtilServices', 
  function($routeParams,$scope,Host,Person,UtilServices) {

    $scope.person = null;

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    UtilServices.getTitles(function(titles) {
      console.log(titles);
      $scope.titles = titles;
    });

    // initial loader
    Person.findById({id:$routeParams.id}).$promise.then(function(result) {
      $scope.person = result;
    });

    $scope.$watch('person.DOB', function() {
      var current = new Date();
      if($scope.person && $scope.person.DOB) {
      var tmp = new Date($scope.person.DOB);
      $scope.person.thaiDOB = tmp.getDate();
      $scope.person.thaiDOB += '-'+(tmp.getMonth()+1);
      $scope.person.thaiDOB += '-'+ (tmp.getFullYear()+543);
      $scope.person.age = current.getFullYear() - tmp.getFullYear();
      if(current.getMonth()<tmp.getMonth()) {
        $scope.person.age--;
      } else {
        if(current.getMonth()==tmp.getMonth()&&
          current.getDate()<tmp.getDate()) {
            $scope.person.age--;
          }
      }
      }
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
