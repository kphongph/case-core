'use strict';

module.exports = angular.module('app.modules.form', [
    'ngRoute',
    'lbServices'
  ]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/form/person/:cid?', {
      templateUrl: 'modules/form/views/per_person.html',
      controller: 'app.modules.form.controllers.PerPerson'
    });
    
    $routeProvider.when('/nform/person/:id?', {
      templateUrl: 'modules/form/views/per_nperson.html',
      controller: 'app.modules.form.controllers.NPerPerson'
    });
    
    
  }])
  .controller(
    'app.modules.form.controllers.PerPerson',
    require('./controllers/per_person'))
  .controller(
    'app.modules.form.controllers.NPerPerson',
    require('./controllers/per_nperson'))