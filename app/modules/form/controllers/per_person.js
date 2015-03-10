'use strict';

module.exports = function($scope, $routeParams, Host, Person,
  Questiontype, Questionaire, Questionvsanswer, Qrecord, Qtimestamp, Form, Systemtype) {
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
    var system_types = "";

    // test with person id 54fda8c07b080506038e040f

    if ($scope.person.age >= 60) {
      system_types = "54fdc3e2aad7a5dc035e58eb";
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
    Form.questiontypes({
        id: form.id
      })
      .$promise.then(function(results) {
        $scope.form.questiontypes = results;
      });
  }

  $scope.selectQtimestamp = function(qtimestamp) {
    $scope.questiontype.questionaires = [];
    Qtimestamp.qrecords({id:qtimestamp.id})
    .$promise.then(function(records) {
      // make dict for record
      var record_dict = {};
      records.forEach(function(record) {
        record_dict[record.questionaireId] = record;
      });
      Questiontype.questionaires({
          id: qtimestamp.questiontypeId
        })
        .$promise.then(function(results) {
          $scope.questiontype.questionaires = results;
          results.forEach(function(qe,index) {
            Questionaire.questionvsanswers({id:qe.id, filter:{include:["answer"]}})
            .$promise.then(function(answers) {
              qe.answers = answers;
              qe.answers.forEach(function(answer) {
                var c_record = record_dict[qe.id];
                if (answer.answerId == c_record.answerId) {
                  answer.selected = true;
                  qe.qrecord_org = angular.copy(c_record);
                  qe.qrecord = c_record;
                }
              });

            });
          });
        });
    });
  };
  
  $scope.$watch("currentQuestion", function(val) {
    if($scope.questiontype && $scope.questiontype.questionaires) {
      $scope.c_question = $scope.questiontype.questionaires[val-1];
    }
  });

  $scope.$watch("questiontype.questionaires", function(val) {
    if($scope.questiontype && $scope.questiontype.questionaires) {
      $scope.currentQuestion = 0;
      $scope.questiontype.questionaires.forEach(function(qe) {   
        if(qe.qrecord) {
          // update
          if(qe.qrecord_org.answerId != qe.qrecord.answerId) {
          qe.qrecord.$save(function(result) {
            qe.qrecord_org = angular.copy(result);
          });
          }
        }
      });
      $scope.currentQuestion = 1;
      $scope.c_question = $scope.questiontype.questionaires[0];
    }
  },true);

  $scope.selectQuestiontype = function(questiontype) {
    $scope.questiontype = questiontype;

    Qtimestamp.find({
      filter: {
        where: {
          and: [{
            personId: $scope.person.id
          }, {
            questiontypeId: questiontype.id
          }]
        }
      }
    }).$promise.then(function(results) {
      $scope.questiontype.qtimestamps = results;
    });

    Questiontype.questionaires({
        id: questiontype.id
      })
      .$promise.then(function(results) {
        $scope.questiontype.questionaires = results;
        results.forEach(function(qe) {
          Questionaire.questionvsanswers({id:qe.id,filter:{include:["answer"]}})
          .$promise.then(function(answers) {
            qe.answers = answers;
          });
        });

      });
  }

};
