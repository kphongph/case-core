define([], function() {
  return ['$scope', 'Address', 'Province', 'City', 'Tumbon', 'Village',
    'UtilServices',
    function($scope, Address, Province, City, Tumbon, Village, UtilServices) {
      $scope.itemPerPage = 10;
      $scope.addresses = [];
      $scope.currentPage = 0;
      $scope.query_text_count = {};
      $scope.query_text = {};
      $scope.count = null;

      $scope.address = {};

      $scope.provinces = null;
      $scope.cities = null;
      $scope.tumbons = null;
      $scope.villages = null;


      // initial
      Province.find().$promise.then(function(results) {
        $scope.provinces = results;
      });

      $scope.create = function() {
        console.log($scope.address);
        Address.create($scope.address, function(err, result) {
          console.log(err);
          console.log(result);
        });
      }

      var build_query = function(query_text) {
        if (query_text) {
          $scope.query_text_count = query_text;
        }
        var query = {
          'filter': {}
        };
        query['filter'] = angular.copy($scope.query_text_count);
        query['filter']['limit'] = $scope.itemPerPage;
        query['filter']['skip'] = ($scope.currentPage - 1) * $scope.itemPerPage;
        query['filter']['include'] = ['province', 'city', 'tumbon',
          'village'];
        $scope.query_text = query;
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
        if ($scope.currentPage > 0 && $scope.count > 0) {
          build_query();
          Address.find($scope.query_text)
            .$promise.then(function(results) {
              results.forEach(function(address) {
                address.text = UtilServices.addressToString(
                  address);
              });
              $scope.addresses = results;
            });
        }
      });

      $scope.$watch('address.Province', function() {
        $scope.cities = null;
        $scope.tumbons = null;
        if ($scope.address.Province) {
          City.find({
              filter: {
                where: {
                  ProvinceID: $scope.address.Province
                }
              }
            })
            .$promise.then(function(results) {
              $scope.cities = results;
            });

          build_query({
            where: {
              'Province': $scope.address.Province
            }
          });
          queryCount();
        } else {
          build_query({});
        }
      });

      $scope.$watch('address.City', function() {
        $scope.tumbons = null;
        $scope.villages = null;

        if ($scope.address.City) {
          Tumbon.find({
              filter: {
                where: {
                  CityID: $scope.address.City
                }
              }
            })
            .$promise.then(function(results) {
              $scope.tumbons = results;
            });

          build_query({
            where: {
              and: [
                {
                  'Province': $scope.address.Province
                },
                {
                  'City': $scope.address.City
                },
            ]
            }
          });
          queryCount();
        }
      });

      $scope.$watch('address.Tumbon', function() {
        if ($scope.address.Tumbon) {
          Village.find({
              filter: {
                where: {
                  TumbonID: $scope.address.Tumbon
                }
              }
            })
            .$promise.then(function(results) {
              $scope.villages = results;
            });

          build_query({
            where: {
              and: [
                {
                  'Province': $scope.address.Province
                },
                {
                  'City': $scope.address.City
                },
                {
                  'Tumbon': $scope.address.Tumbon
                },
            ]
            }
          });
          queryCount();
        }
      });
      $scope.$watch('address.VillageID', function() {
        if ($scope.village) {
          build_query({
            where: {
              and: [{
                  'Province': $scope.address.Province
                }, {
                  'City': $scope.address.City
                }, {
                  'Tumbon': $scope.address.Tumbon
                },
                {
                  'VillageID': $scope.address.VillageID
                },
          ]
            }
          });
          queryCount();
        }
      });

      $scope.$watch('address.HouseNumber ' +
        '+ address.MooNumber' +
        '+ address.Alley' +
        '+ address.StreetName' +
        '+ address.PostCode',
        function() {
          if ($scope.province) {
            build_query({
              where: {
                and: [
                  {
                    'Province': $scope.address.Province
                  },
                  {
                    'City': $scope.address.City
                  },
                  {
                    'Tumbon': $scope.address.Tumbon
                  },
                  {
                    'VillageID': $scope.address.VillageID
                  },
                  {
                    'HouseNumber': $scope.address.HouseNumber
                  },
                ]
              }
            });
            queryCount();
          }
        });

      $scope.$apply();
    }
  ];
});
