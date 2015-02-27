define([], function() {
  return ['$scope', '$rootScope', 'AUTH_EVENTS', 'User',
    function($scope, $rootScope, AUTH_EVENTS,  User) {
      $scope.email = "john@doe.com";
      $scope.password = "opensesame";
      $scope.login = function() {
        User.login({
          email:$scope.email,
          password:$scope.password
        }).$promise.then(function(user) {
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        });
      };
      
      $scope.logout = function() {
        User.logout().$promise.then(function() {
          $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        });
      };

      $scope.$apply();
    }
  ];
});
