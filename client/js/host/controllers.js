angular
  .module('app')
  .controller('HostListCtrl',function($scope,$state,
     Province,Host,City,Tumbon,Personvshost) {

 $scope.province = null;
 $scope.city = null;
 $scope.tumbon = null;

 $scope.active_hosts = null;
 
 $scope.getCity = function() {
   $scope.tumbon = null;
   getHost($scope.province,null,null,1);
   City.find({
     filter:{
       where:{provinceid:$scope.province.ProvinceID}
     }
   })
   .$promise
   .then(function(results) {
     $scope.cities = results;
   });
 };

 $scope.getTumbon = function() {
   getHost($scope.province,$scope.city,null,1);
   Tumbon.find({
     filter:{
       where:{cityid:$scope.city.CityID}
     }
   })
   .$promise
   .then(function(results) {
     $scope.tumbons = results;
   });
 };
 
 $scope.pageChanged = function(page) {
   getHost($scope.province,$scope.city,$scope.tumbon,page);
 }
 
 
 var listActiveHosts = function() {
   console.log('+listActiveHosts');
   $scope.active_hosts = [];

   Personvshost.find({
     filter:{
       where:{enddatetime:null}
     }
   }).$promise
   .then(function(results) {
     var host_id = {};
     results.forEach(function(record) {
       if(!host_id[record.HostDestination]) {
         host_id[record.HostDestination] = {'count':0};
       }
       var t_host = host_id[record.HostDestination];
       if(!t_host[record.CID]) {
         t_host[record.CID]=1;
         t_host['count']++;
       }
     });
     for(var key in host_id) {
       $scope.active_hosts.push(key);
     }
   });
 }

 var getHost = function(province,city,tumbon,page) {
   var where_part = {};
   where_part['and'] = [];
   
   if($scope.filterActive) {
     if(!$scope.active_hosts) {
       listActiveHosts();  
     }
   } 

   if(province) 
     where_part['and'].push({hostprovince:province.ProvinceID});

   if(city) 
     where_part['and'].push({hostcity:city.CityID});

   if(tumbon) 
     where_part['and'].push({hosttumbon:tumbon.TumbonID});

   if($scope.filterActive) { 
     // where_part['and'].push({hostid:{inq:$scope.active_hosts}});
     where_part['and'].push({hostid:{inq:["02010448"]}});
   } 

   var query = {};
   query['filter'] = {limit:20,skip:(page-1)*20};
   query['filter']['where']=where_part;

   Host.count({where:where_part}).$promise.then(function(results) {
     $scope.host_count = results.count;
   });

   console.log(JSON.stringify(query));
   Host.find(query)
   .$promise
   .then(function(results) {
     console.log(results.length);
     results.forEach(function(host) {
       Personvshost.find({
         filter:{
           where:{
             and:[
              {hostdestination:host.HostID},
              {enddatetime:null}
             ]
           }
         }
       }).$promise
       .then(function(results) {
         var count = 0;
         var cid_list = {};
         results.forEach(function(person) {
           if(!cid_list[person.CID]) {
             cid_list[person.CID]=1;
             count++;
           }
         });
         host.activePerson = count;
       });
     });
     $scope.hosts=results;
   });
 }

 listActiveHosts();  

 $scope.listProvince = function(val) {
  return Province.find({
    filter:{where:{provincedescription:{like:val+'%'}}}
  })
  .$promise
  .then(function(results) {
    return results;
  });
 };

});

angular
  .module('app')
  .controller('HostCtrl',function($scope,$state,
     Province,Host,City,Tumbon) {
  Host.findById({
     id:$state.params.id
  })
  .$promise
  .then(function(results) {
    $scope.host = results;
  });
});
