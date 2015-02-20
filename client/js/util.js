define([
  'angular',
  'lb.services'
], function(angular) {
  angular.module('utilServices', ['lbServices'])
    .factory('UtilServices', [
      'Personvshost', 'Title', 'Gender', 'Nationality', 'Race',
      'Religion', 'Province',
      function(Personvshost, Title, Gender,
        Nationality, Race, Religion, Province
      ) {

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
          addressToString: function(address) {
            var st = address.HouseNumber;
            if(address.MooNumber) 
              st += ' หมู่ที่ '+address.MooNumber; 
            if(address.StreetName) 
              st += ' ถ.'+address.StreetName; 
            if(address.Alley) 
              st += ' ซ.'+address.Alley; 
            if(address.village && address.village.VillageName) 
              st += ' หมู่บ้าน '+address.village.VillageName; 
            if(address.tumbon && address.tumbon.TumbonDescription) 
              st += ' ต.'+address.tumbon.TumbonDescription; 
            if(address.city && address.city.CityDescription) 
              st += ' อ.'+address.city.CityDescription; 
            if(address.province && address.province.ProvinceDescription) 
              st += ' จ.'+address.province.ProvinceDescription; 
            if(address.PostCode) 
              st += ' '+address.PostCode; 
            return st;
          }

        };
      }
    ]);
});
