'use strict';

module.exports = function($scope, Person) {
  $scope.currentPage = 0;
  $scope.itemPerPage = 10;
  $scope.query_text = '';
  $scope.count = null;

  var build_query = function(query_text, page, itemPerPage) {
    var filter = {'where': {}};
    filter['fields'] = {'CID':true, 'FirstName':true, 'LastName':true};
    var or_c = [];
    or_c.push({CID: {like: '%' + query_text + '%'}});
    or_c.push({FirstName: {like: '%' + query_text + '%'}});
    or_c.push({LastName: {like: '%' + query_text + '%'}});
    filter['where']['or']=or_c;
    if(page) {
      var query = {
        'filter': {}
      };
      query['filter'] = filter;
      filter['limit'] = itemPerPage;
      filter['skip'] = (page - 1) * itemPerPage;
      return query;
    } else {
      return filter;
    }
  };

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

  $scope.search();

  $scope.$watch('currentPage', function() {
    if($scope.currentPage > 0) {
      Person.find(build_query($scope.query_text,
        $scope.currentPage, $scope.itemPerPage))
      .$promise.then(function(results) {
        $scope.people = results;
      });
    }
  });
};
