(function(window, angular, undefined) {
  'use strict';
  var module = angular.module("utilServices", ['lbServices']);

  module.factory('UtilServices', [
    '$rootScope', 'Personvshost', 'Title', 'Gender', 'Nationality', 'Race',
    'Religion',
    'Province', '$injector',
    function($rootScope, Personvshost, Title, Gender,
      Nationality, Race, Religion, Province, $injector
    ) {
      var _state = {};

      var broadcast = function(state) {
        $rootScope.$broadcast('state.update', state);
      };

      var update = function(newState) {
        _state = newState;
        broadcast(_state);
      };

      var onUpdate = function($scope, callback) {
        $scope.$on('state.update', function(event, newState) {
          callback(newState);
        });
      };

      function getPeopleByHost(hostId, cb) {
        Personvshost.find({
          filter: {
            fields: {
              CID: true
            },
            where: {
              and: [{
                hostdestination: hostId
              }, {
                enddatetime: null
              }]
            }
          }
        }).$promise.then(function(results) {
          var cid_list = [];
          var cid_key = [];
          results.forEach(function(people) {
            if (cid_key.indexOf(people.CID) == -1) {
              cid_key.push(people.CID);
              cid_list.push(people);
            }
          });
          cb(cid_list);
        })

      };

      return {
        getPeopleByHost: getPeopleByHost,
        //
        getTitles: function(cb) {
          Title.find().$promise.then(function(results) {
            cb(results);
          });
        },
        //
        getGenders: function(cb) {
          Gender.find().$promise.then(function(results) {
            cb(results);
          });
        },
        //
        getReligions: function(cb) {
          Religion.find().$promise.then(function(results) {
            cb(results);
          });
        },
        //
        getRaces: function(cb) {
          Race.find().$promise.then(function(results) {
            cb(results);
          });
        },
        //
        getNationalities: function(cb) {
          Nationality.find().$promise.then(function(results) {
            cb(results);
          });
        },
        //
        getProvinces: function(cb) {
          Province.find().$promise.then(function(results) {
            cb(results);
          });
        },
        //
        addressToString: function(address) {
          var st = '';
          if (address.HouseNumber)
            st += address.MooNumber;
          if (address.MooNumber)
            st += ' หมู่ที่ ' + address.MooNumber;
          if (address.StreetName)
            st += ' ถ.' + address.StreetName;
          if (address.Alley)
            st += ' ซ.' + address.Alley;
          if (address.village && address.village.VillageName)
            st += ' หมู่บ้าน ' + address.village.VillageName;
          if (address.tumbon && address.tumbon.TumbonDescription)
            st += ' ต.' + address.tumbon.TumbonDescription;
          if (address.city && address.city.CityDescription)
            st += ' อ.' + address.city.CityDescription;
          if (address.province && address.province.ProvinceDescription)
            st += ' จ.' + address.province.ProvinceDescription;
          if (address.PostCode)
            st += ' ' + address.PostCode;
          return st;
        },
        // sharedProperties
        update: update,
        listen: onUpdate,
        state: _state,
        //
      };
    }
  ]);

  module.directive('buddhistEra', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attrs, $ctrl) {

        $ctrl.$formatters.unshift(function(modelValue) {
          if (modelValue) {
            var tmp = new Date(modelValue);
            var format = ('0' + (tmp.getDate())).slice(-2);
            format += '-';
            format += ('0' + (tmp.getMonth() + 1)).slice(-2);
            format += '-';
            format += tmp.getFullYear() + 543;
            return format;
          }
          return null;
        });

        $ctrl.$parsers.unshift(function(viewValue) {
          console.log(viewValue);
          var parts = viewValue.split('-');
          try {
            var tmp_date = new Date(parts[2] - 543, parts[1] - 1,
              parts[0]);
            console.log(tmp_date);
            return tmp_date.toISOString();
          } catch (err) {}
        });
      }
    };
  });

})(window, window.angular);
