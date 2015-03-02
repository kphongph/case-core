'use strict';

module.exports = angular.module('app.modules.form', [
    'ngRoute',
    'lbServices'
  ]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/form/person/:cid?', {
      templateUrl: 'modules/form/views/per_person.html',
      controller: 'app.modules.form.controllers.PerPerson'
    })
  }])
  .controller(
    'app.modules.form.controllers.PerPerson',
    require('./controllers/per_person'))