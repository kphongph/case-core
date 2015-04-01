angular.module('app.person').controller('app.person.controllers.search', 
  function($scope,Person) {

  $scope.page = 1;
  $scope.itemPerPage = 10;
  $scope.query_text = '';

  var build_query = function(query_text, page, itemPerPage) {
    var filter = {
      'where': {}
    };
    filter['fields'] = {'id':true};
    filter['fields']['CID'] = true;
    filter['fields']['FirstName'] = true;
    filter['fields']['LastName'] = true;

    filter['where']['or'] = [];
    filter['where']['or'].push({
      CID: { like: query_text }
    });
    filter['where']['or'].push({
      FirstName: { like: query_text }
    });
    filter['where']['or'].push({
      LastName: { like: query_text }
    });
    if (page) {
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
  }
  
  var make_query = function() {
    Person.find(build_query($scope.query_text,$scope.page,10))
    .$promise.then(function(results) {
      $scope.people = results;
    });
  };
   
  $scope.search = function(query) {
    $scope.query_text = query;
    Person.count(build_query(query))
    .$promise.then(function(results) {
      $scope.total_page = Math.ceil(results.count/$scope.itemPerPage);
      make_query();
    });
  }

  $scope.search('');
  
  $scope.$watch('page', function() {
    if($scope.page==1) {
      $scope.pre_disabled=true;
    } else {
      $scope.pre_disabled=false;
    }

    if($scope.page==$scope.total_page) { 
      $scope.nex_disabled=true;
    } else {
      $scope.nex_disabled=false;
    }
    make_query();
  });
});

