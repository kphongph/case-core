angular
  .module('app')
  .controller('HostListCtrl',function($scope,$state,
     Province,Host,City,Tumbon) {
  
 $scope.getCity = function(province) {
   City.find({
     filter:{
       where:{provinceid:province.ProvinceID}
     }
   })
   .$promise
   .then(function(results) {
     $scope.cities = results;
   });
 };

 $scope.getTumbon = function(city) {
   Tumbon.find({
     filter:{
       where:{cityid:city.CityID}
     }
   })
   .$promise
   .then(function(results) {
     $scope.tumbons = results;
   });
 };
 

 $scope.getHost = function(tumbon) {
   Host.find({
     filter:{
       where:{hosttumbon:tumbon.TumbonID}
     }
   })
   .$promise
   .then(function(results) {
     $scope.hosts=results;
   });
 }
 
 Province.find()
 .$promise
 .then(function(results) {
   $scope.provinces = results
 });
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
