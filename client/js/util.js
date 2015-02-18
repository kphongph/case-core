define([
  'angular',
  'lb.services'
], function(angular) {
  angular.module('utilServices', ['lbServices'])
    .factory('UtilServices', [
      'Personvshost', 'Title', 'Gender', 'Nationality','Race',
      'Religion',
      function(Personvshost, Title, Gender, 
        Nationality,Race,Religion
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
          }

        };
      }
    ]);
});
