define([], function() {
  return ['$routeParams', '$scope', '$timeout','Host', 'Person',
    'Adressvsperson', 'Address', 'UtilServices',
    function($routeParams, $scope, $timeout, Host, Person,
      Adressvsperson, Address, UtilServices) {

      $scope.message = null;
      $scope.person = null;
      $scope.alerts = [];
      
      $scope.person_org = null;
      
      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };

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
        $scope.message = {type:'transfer', msg:'Saving'};
        $scope.person.$save().then(function() {
          $scope.message = {type:'saved', msg:'Saved'};
          $timeout(function() {
            $scope.message = null;
          }, 5000);
        }, function(err) {
          $scope.message = {type:'alert', msg:err};
        });
      };

      $scope.reset = function() {
        console.log($scope.person_org);
        angular.copy($scope.person_org, $scope.person);
      }
  

      // initial loader
      Person.findById({
        id: $routeParams.id,
      }).$promise.then(function(result) {
        $scope.person = result;
        angular.copy($scope.person, $scope.person_org);
        Adressvsperson.find({
            filter: {
              include:['addresstype'],
              where: {
                and:[
                  {CID: $routeParams.id},
                  {ExitDate: null}
                ]
              }
            }
          }).$promise
          .then(function(ad_history) {
            $scope.current_addresses = [];
            ad_history.forEach(function(ad_hist) {
              Address.findOne({
                filter: {
                  where:{AddressID:ad_hist.AddressID},
                  include: ['village', 'tumbon', 'city', 'province']
                }
              }).$promise.then(function(result) {
                ad_hist.address = result;
                $scope.current_addresses.push(ad_hist);
              });
            });
          });

      });

      $scope.$watch('person.DOB', function() {
        var current = new Date();
        if ($scope.person && $scope.person.DOB) {
          var tmp = new Date($scope.person.DOB);
          $scope.person.thaiDOB = ('0' + tmp.getDate()).slice(-2);
          $scope.person.thaiDOB += '-' + ('0' + (tmp.getMonth() + 1)).slice(-2);
          $scope.person.thaiDOB += '-' + (tmp.getFullYear() + 543);
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

      $scope.$apply();
    }
  ];
});
