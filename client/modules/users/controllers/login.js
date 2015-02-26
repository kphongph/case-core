define([], function() {
  return ['$scope', 'User',
    function($scope, User) {
      $scope.user = User.getCurrent();
      console.log('run login');
      $scope.isAuthenticated = User.isAuthenticated();
      $scope.email = "john@doe.com";
      $scope.password = "opensesame";
      $scope.login = function() {
        User.login({
          email:$scope.email,
          password:$scope.password
        }).$promise.then(function(result) {
          $scope.user = result.user;
          $scope.isAuthenticated = User.isAuthenticated();
        });
      };
      
      $scope.logout = function() {
        User.logout().$promise.then(function() {
          $scope.user = User.getCurrent();
          $scope.isAuthenticated = User.isAuthenticated();
        });
      };


      $scope.$apply();
    }
  ];
});
