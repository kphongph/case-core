describe('Unit: MainController', function() {
  beforeEach(module('app'));
  
  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
    scope=$rootScope.new();
    ctrl = $controller('MainController', {$scope:scope}
    );
  });

  it('should create $scope.greeting', function() {
    expect(scope.greeting).toBeUndefined();
  });
});
