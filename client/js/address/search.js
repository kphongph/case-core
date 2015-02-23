define([], function() {
  return ['$scope', 'Address', 'UtilServices',
    function($scope, Address, UtilServices) {
      $scope.itemPerPage = 10;
      $scope.addresses = [];
      $scope.currentPage = 0;
      $scope.query_text_count = {};
      $scope.query_text = {};
      $scope.count = null;

      $scope.province = null;

      UtilServices.getProvinces(function(results) {
        $scope.provinces = results;
      });
      
      var build_query = function(query_text) {
        if(query_text) {
          $scope.query_text_count = query_text;
        }
        var query = {'filter':{}}; 
        query['filter']=angular.copy($scope.query_text_count);
        query['filter']['limit'] = $scope.itemPerPage;
        query['filter']['skip'] = ($scope.currentPage-1)*$scope.itemPerPage;
        query['filter']['include'] = ['province','city','tumbon','village'];
        $scope.query_text = query;
      }
      
      $scope.select = function(cid) {
        UtilServices.state = cid;
        UtilServices.update({key:'person.cid',value:cid});
      }

      Address.count()
      .$promise.then(function(result) {
        $scope.count = result.count;
        $scope.currentPage = 1;
      });

      var queryCount = function() {
        $scope.addresses = [];
        $scope.count = 0;
        $scope.currentPage = 0;
        Address.count($scope.query_text_count)
        .$promise.then(function(result) {
          $scope.count = result.count;
          $scope.currentPage = 1;
        });
      };

      $scope.$watch('currentPage', function() {
        if($scope.currentPage > 0 && $scope.count > 0) {
          build_query();
          Address.find($scope.query_text)
          .$promise.then(function(results) {
            results.forEach(function(address) {
              address.text = UtilServices.addressToString(address);
            });
          $scope.addresses = results;
          });
        }
      });

      $scope.$watch('province', function() {
        if($scope.province) {
          build_query({where:{'Province':$scope.province}});
          queryCount();
        } else {
          build_query({});
        }
      });

      $scope.$apply();
    }
  ];
});
