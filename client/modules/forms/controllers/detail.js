define([], function() {
  return ['$routeParams', '$scope', '$timeout', 'Host', 'Person', 'Form',
    'Systemtype', 'UtilServices',
    function($routeParams, $scope, $timeout, Host, Person, Form, Systemtype,
      UtilServices) {


      $scope.person = null;
      $scope.form = null;
      $scope.alerts = [];
      $scope.person_org = null;

      $scope.$watch('person.DOB', function() {
        var current = new Date();
        if ($scope.person && $scope.person.DOB) {
          var tmp = new Date($scope.person.DOB);
          $scope.person.age = current.getFullYear() - tmp.getFullYear();
          if (current.getMonth() < tmp.getMonth()) {
            $scope.person.age--;
          } else {
            if (current.getMonth() == tmp.getMonth() &&
              current.getDate() < tmp.getDate()) {
              $scope.person.age--;
            }
          }
          
          var system_types = "";
         
          // test with cid 0000000000013

          if($scope.person.age >= 60) {
            system_types = "00001";
          }

          Systemtype.findById({id:system_types})
          .$promise.then(function(result) {
            $scope.system = result;
            Systemtype.forms({id:system_types})
            .$promise.then(function(forms) {
              $scope.system.forms = forms;
            });
          });

        }
      });

      Person.findById({
        id: $routeParams.id,
      }).$promise.then(function(result) {
        $scope.person = result;
      });

      $scope.$apply();
    }
  ];
});
