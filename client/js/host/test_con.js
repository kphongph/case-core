define([
  './module'
], function(module) {
  return module.controller('simple', function($scope,
    Province, Host, City, Tumbon, Personvshost) {
    $scope.province = null;
    $scope.city = null;
    $scope.tumbon = null;

    $scope.host_per_page = 20;

    $scope.active_hosts = null;

    $scope.getCity = function() {
      $scope.tumbon = null;
      getHost($scope.province, null, null, 1);
      City.find({
          filter: {
            where: {
              provinceid: $scope.province.ProvinceID
            }
          }
        })
        .$promise
        .then(function(results) {
          $scope.cities = results;
        });
    };

    $scope.getTumbon = function() {
      $scope.tumbon = null;
      getHost($scope.province, $scope.city, null, 1);
      Tumbon.find({
          filter: {
            where: {
              cityid: $scope.city.CityID
            }
          }
        })
        .$promise
        .then(function(results) {
          $scope.tumbons = results;
        });
    };

    var sorted = false;

    $scope.pageChanged = function(page) {
      if (!$scope.filterActive) {
        getHost($scope.province, $scope.city, $scope.tumbon, page);
      } else {
        if (!sorted) {
          $scope.active_hosts.sort(function(a, b) {
            if (a.activePerson > b.activePerson) {
              return -1;
            }
            return 1;
          });
        }
        $scope.hosts = [];
        $scope.host_count = $scope.active_hosts.length;
        var start = (page - 1) * $scope.host_per_page;

        for (var i = start; i < start + $scope.host_per_page && i < $scope.active_hosts.length; i++) {
          $scope.hosts.push($scope.active_hosts[i]);
        }
      }
    }

    var getActiveHosts = function() {
      $scope.active_hosts = [];

      Personvshost.find({
          filter: {
            fields: {
              HostDestination: true,
              CID: true
            },
            where: {
              enddatetime: null
            }
          }
        }).$promise
        .then(function(results) {
          var host_id = {};
          results.forEach(function(record) {
            if (!host_id[record.HostDestination]) {
              host_id[record.HostDestination] = {
                count: 0
              };
            }
            var t_host = host_id[record.HostDestination];
            if (!t_host[record.CID]) {
              t_host[record.CID] = 1;
              t_host['count'] ++;
            }
          });

          var tmp_list = [];
          for (var key in host_id) {
            tmp_list.push({
              'id': key,
              'count': host_id[key].count
            });
          }

          $scope.active_hosts = [];
          console.log('Active Host = ' + tmp_list.length);

          tmp_list.forEach(function(host_info) {
            Host.findById({
                id: host_info.id
              })
              .$promise
              .then(function(result) {
                result.activePerson = host_info.count;
                $scope.active_hosts.push(result);
              });
          });
        });
    }

    getActiveHosts();

    var getHost = function(province, city, tumbon, page) {
      var where_part = {};
      where_part['and'] = [];

      if (province)
        where_part['and'].push({
          hostprovince: province.ProvinceID
        });

      if (city)
        where_part['and'].push({
          hostcity: city.CityID
        });

      if (tumbon)
        where_part['and'].push({
          hosttumbon: tumbon.TumbonID
        });

      var query = {};
      query['filter'] = {
        limit: $scope.host_per_page,
        skip: (page - 1) * $scope.host_per_page
      };
      query['filter']['where'] = where_part;

      Host.count({
        where: where_part
      }).$promise.then(function(results) {
        $scope.host_count = results.count;
      });

      Host.find(query)
        .$promise
        .then(function(results) {
          results.forEach(function(host) {
            Personvshost.find({
                filter: {
                  where: {
                    and: [{
                      hostdestination: host.HostID
                    }, {
                      enddatetime: null
                    }]
                  }
                }
              }).$promise
              .then(function(results) {
                var count = 0;
                var cid_list = {};
                results.forEach(function(person) {
                  if (!cid_list[person.CID]) {
                    cid_list[person.CID] = 1;
                    count++;
                  }
                });
                host.activePerson = count;
              });
          });
          $scope.hosts = results;
        });
    }

    $scope.listProvince = function(val) {
      return Province.find({
          filter: {
            where: {
              provincedescription: {
                like: val + '%'
              }
            }
          }
        })
        .$promise
        .then(function(results) {
          $scope.tumbon = null;
          $scope.city = null;
          return results;
        });
    };
  });
});
