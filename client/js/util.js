define([
    'angular',
    'lb.services'
], function(angular) {
  angular.module('utilServices', ['lbServices'])
  .factory('UtilServices', [
    'Personvshost', 'Title',
    function(Personvshost,Title) {

    function getTitles(cb) {
      Title.find().$promise.then(function(titles) {
        cb(titles);
      });
    }

    function getPeopleByHost(hostId,cb) {
      Personvshost.find({filter:{
        fields:{CID:true},
        where:{
          and:[{hostdestination:hostId},{enddatetime:null}]
        }
      }}).$promise.then(function(results) {
        var cid_list = [];
        var cid_key = [];
        results.forEach(function(people) {
          if(cid_key.indexOf(people.CID)==-1) {
            cid_key.push(people.CID);
            cid_list.push(people);
          }
        });
        cb(cid_list);
      })
        
    };

    return {
      getPeopleByHost: getPeopleByHost,
      getTitles: getTitles
    };
  }]);
});
