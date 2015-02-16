define([
    'angular'
], function(angular) {
  angular.module('utilServices', [])
  .factory('UtilServices', ['$http', function($http) {
    var baseUrl = '/api'
    function getPersonByHost(hostId,cb) {
      $http.get(baseUrl+'/Hosts/'+hostId+'/persons')
      .success(function(data,status,headers,config) {
        cb(data);
      });
    };

    return {
      getPersonByHost: getPersonByHost
    };
  }]);
});
