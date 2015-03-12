'use strict';

module.exports = function($scope, $routeParams, FormTemplate, Person) {
  $scope.person = null;
  $scope.form = null;
  $scope.part = null;
  $scope.questionnaire = null;
  $scope.filledForms = null;
  $scope.formTemplate = null;
  
  Person.findById({
    id: $routeParams.id,
  }).$promise.then(function(result) {
    $scope.person = result;
    FormTemplate.find({filter:{where:{template:true}}})
    .$promise.then(function(results) {
      $scope.formTemplates = results;
    });
  });
  
  $scope.selectFormTemplate = function(formTemplate) {
    $scope.formTemplate = formTemplate;
    Person.forms({id:$scope.person.id,
     filter:{
       where:{and:[{template:false},{name:formTemplate.name}]}
     }
    }).$promise.then(function(results) {
      $scope.formTemplate.filledForms = results;
    });
  };

  $scope.createForm = function(form) {
    $scope.form = form;
    $scope.save(function() {
      $scope.selectFormTemplate($scope.formTemplate);
    });
  };
  
  $scope.selectForm = function(form) {
    $scope.form = form;
    $scope.part = null;
    $scope.questionnaire = null;
  };
  
  $scope.selectPart = function(part) {
    $scope.part = part;
    $scope.questionnaire = null;
  };
  
  $scope.selectQuestionnaire = function(questionnaire) {
    $scope.questionnaire = questionnaire;
  }

  $scope.save = function(cb) {
    if($scope.form) {
      if($scope.form.template) {
        // create new from template
        var nform = angular.copy($scope.form);
        delete nform['id'];
        delete nform['filledForms'];
        nform.template = false;
        Person.forms.create({id:$scope.person.id},nform)
        .$promise.then(function(result) {
          if(cb) {
           cb();
          }
          $scope.form = result;
        });
      } else {
        // update 
        $scope.form.$save(function(result) {
          if(cb) {
           cb();
          }
          $scope.form = result;
        });
      }
    }
  }

};
