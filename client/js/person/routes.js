angular.module('app.person').config(function($routeProvider) {
  $routeProvider.when('/person/:id', {
    templateUrl: 'js/person/view/detail.html',
    controller:'app.person.controllers.detail'
  });

  $routeProvider.when('/person', {
    templateUrl: 'js/person/view/search.html',
    controller:'app.person.controllers.search'
  });
});
