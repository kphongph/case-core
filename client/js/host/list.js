define([], function() {
  return ['$scope','Host','Employee','Personvshost','UtilServices', 
  function($scope,Host,Employee,Personvshost,UtilServices) {

    $scope.total_host = 0;
    $scope.currentPage = 0;
    $scope.itemPerPage = 5;
    $scope.active_hosts = [];
    $scope.hosts = [];

    Employee.find().$promise.then(function(results) {
      var hostid_list = [];
      results.forEach(function(employee) {
        if(hostid_list.indexOf(employee.HostID)==-1) {
          hostid_list.push(employee.HostID);
        }
      });
      $scope.currentPage =1 ;
      $scope.total_host = hostid_list.length;
      hostid_list.forEach(function(hostid) {
        Host.findById({id:hostid}).$promise.then(function(host) {
          UtilServices.getPersonByHost(hostid,function(data) {
            host.activePerson = data.length;
            $scope.active_hosts.push(host);
          });
        });
         
      });
    });

    $scope.$watch('active_hosts + currentPage', function() {
      var begin = (($scope.currentPage - 1) * $scope.itemPerPage);
      var end = begin + $scope.itemPerPage;
      $scope.hosts = $scope.active_hosts.slice(begin, end);
    });

    


    $scope.$apply();
  }];
});
