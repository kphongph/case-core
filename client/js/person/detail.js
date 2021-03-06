define([], function() {
  return ['$routeParams', '$scope', '$timeout', 'Host', 'Person',
    'Adressvsperson', 'Address', 'UtilServices',
    function($routeParams, $scope, $timeout, Host, Person,
      Adressvsperson, Address, UtilServices) {

      $scope.message = null;
      $scope.person = null;
      $scope.alerts = [];

      $scope.test = UtilServices.state;

      $scope.person_org = null;

      UtilServices.getTitles(function(titles) {
        $scope.titles = titles;
      });

      UtilServices.getGenders(function(results) {
        $scope.genders = results;
      });

      UtilServices.getNationalities(function(results) {
        $scope.nationalities = results;
      });

      UtilServices.getRaces(function(results) {
        $scope.races = results;
      });

      UtilServices.getReligions(function(results) {
        $scope.religions = results;
      });

      $scope.save = function() {
        $scope.message = {
          type: 'transfer',
          msg: 'Saving'
        };
        // $scope.person.DateTimeUpdate = new Date();
        $scope.person.$save().then(function() {
          $scope.message = {
            type: 'saved',
            msg: 'Saved'
          };
          $scope.person_org = angular.copy($scope.person);
          $timeout(function() {
            $scope.message = null;
          }, 5000);
        }, function(err) {
          $scope.message = {
            type: 'alert',
            msg: err
          };
        });
      };

      $scope.reset = function() {
        angular.copy($scope.person_org, $scope.person);
      }




      // initial loader
      var findById = function(id) {
        Person.findById({
          id: id,
        }).$promise.then(function(result) {
          $scope.person = result;
          $scope.person_org = angular.copy($scope.person);
          Adressvsperson.find({
              filter: {
                include: ['addresstype'],
                where: {
                  and: [{
                    CID: id
                }, {
                    ExitDate: null
                }]
                }
              }
            }).$promise
            .then(function(ad_history) {
              ad_history.forEach(function(ad_hist) {
                Address.findOne({
                  filter: {
                    where: {
                      AddressID: ad_hist.AddressID
                    },
                    include: ['village', 'tumbon', 'city',
                    'province']
                  }
                }).$promise.then(function(result) {
                  ad_hist.address = result;
                  if (ad_hist.AddressTypeID == '001') {
                    $scope.person.homeAddress =
                      UtilServices.addressToString(
                        result);
                  }
                  if (ad_hist.AddressTypeID == '002') {
                    $scope.person.contactAddress =
                      UtilServices.addressToString(result);
                  }
                });
              });
            });

        });
      }

      if ($routeParams.id) {
        findById($routeParams.id);
      }

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
        }
      });

      UtilServices.listen($scope, function(state) {
        if (state.key == 'person.cid') {
          findById(state.value);
        }
      });

      $scope.$apply();
    }
  ];
});
