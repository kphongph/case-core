'use strict';

module.exports = function($scope, $routeParams, Host, Person, 
  Questiontype, Questionvsanswer, Form, Systemtype) {
  $scope.person = null;
  $scope.alerts = [];

  var checkAge = function(person) {
    var current = new Date();
    var age = 0;
    if (person && person.DOB) {
      var tmp = new Date(person.DOB);
      age = current.getFullYear() - tmp.getFullYear();
      if (current.getMonth() < tmp.getMonth()) {
        age--;
      } else {
        if (current.getMonth() == tmp.getMonth() &&
          current.getDate() < tmp.getDate()) {
          age--;
        }
      }
      return age;
    }
  };

  Person.findById({
    id: $routeParams.cid,
  }).$promise.then(function(result) {
    $scope.person = result;
    $scope.person.age = checkAge($scope.person);
    console.log($scope.person.age);
    var system_types = "";

    // test with cid 0000000000013

    if ($scope.person.age >= 60) {
      system_types = "00001";
    }

    Systemtype.findById({
        id: system_types
      })
      .$promise.then(function(result) {
        $scope.system = result;
        Systemtype.forms({
            id: system_types
          })
          .$promise.then(function(forms) {
            $scope.system.forms = forms;
          });
      });
  });

  $scope.selectForm = function(form) {
    $scope.form = form;
    Form.questiontypes({id:form.FID})
    .$promise.then(function(results) {
      $scope.form.questiontypes = results;
    });
  }

  $scope.selectQuestiontype = function(questiontype) {
    $scope.questiontype = questiontype;
    Questiontype.questionaires({id:questiontype.QTID})
    .$promise.then(function(results) {
      $scope.questiontype.questionaires = results;
      results.forEach(function(qe) {
        Questionvsanswer.find({filter:{
          where:{
            and:[
              {QID:qe.QID},
              {QTID:qe.QTID}
            ]
          },
          include:['answer']
        }}).$promise.then(function(answers) {
          qe.answers = answers;
        });
      });

      /*
      $scope.questiontype.questionvsanswers = [];
      var qid_list = {};
      results.forEach(function(qa) {
        if(!qid_list[qa.QID]) {
          qid_list[qa.QID]={'question':qa.questionaire,'answers':[]};
        }
        qid_list[qa.QID]['answers'].push(qa.answer);
      });
      for(var key in qid_list) {
        $scope.questiontype.questionvsanswers.push(qid_list[key]);
      }
      */
    });
  }

};
