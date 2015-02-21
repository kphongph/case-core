define([], function() {
  return ['$scope', 'Person', 'UtilServices',
    function($scope, Person, UtilServices) {
      $scope.results = [];
      $scope.itemPerPage = 10;
      $scope.people = [];
      $scope.currentPage = 0;
      $scope.query_text = '';
      $scope.count = null;
      
      var build_query = function(query_text,page,itemPerPage) {
        var filter = {'where':{}};
        filter['fields'] = {};
        filter['fields']['CID']=true;
        filter['fields']['FirstName']=true;
        filter['fields']['LastName']=true;
        
        filter['where']['or'] = [];
        filter['where']['or'].push({
          CID:{like:'%'+query_text+'%'}
        });
        filter['where']['or'].push({
          FirstName:{like:'%'+query_text+'%'}
        });
        filter['where']['or'].push({
          LastName:{like:'%'+query_text+'%'}
        });
        if(page) {
          var query = {'filter':{}}; 
          query['filter']=filter;
          filter['limit'] = itemPerPage;
          filter['skip'] = (page-1)*itemPerPage;
          return query;
        } else {
          return filter;
        }
      }
      
      $scope.select = function(cid) {
        UtilServices.state = cid;
        UtilServices.update({key:'person.cid',value:cid});
      }

      $scope.search = function() {
        $scope.people = [];
        $scope.count = 0;
        $scope.currentPage = 0;
        Person.count(build_query($scope.query_text))
        .$promise.then(function(result) {
          $scope.count = result.count;
          $scope.currentPage = 1;
        });
      }

      Person.count(build_query($scope.query_text))
      .$promise.then(function(result) {
        $scope.count = result.count;
        $scope.currentPage = 1;
      });

      $scope.$watch('currentPage', function() {
        if($scope.currentPage > 0) {
        Person.find(build_query($scope.query_text, 
          $scope.currentPage,$scope.itemPerPage))
        .$promise.then(function(results) {
          $scope.people = results;
        });
        }
      });

      $scope.$apply();
    }
  ];
});
