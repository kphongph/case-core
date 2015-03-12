'use strict';

module.exports = function($scope, $routeParams, FormTemplate, Person) {
  $scope.person = null;
  $scope.form = null;
  $scope.part = null;
  $scope.questionnaire = null;
  
  Person.findById({
    id: $routeParams.id,
  }).$promise.then(function(result) {
    $scope.person = result;
    FormTemplate.find().$promise.then(function(results) {
      $scope.forms = results;
    });
  });
  
  $scope.selectForm = function(form) {
    $scope.form = form;
  };
  
  $scope.selectPart = function(part) {
    $scope.part = part;
  };
  
  $scope.selectQuestionnaire = function(questionnaire) {
    $scope.questionnaire = questionnaire;
  }

};
