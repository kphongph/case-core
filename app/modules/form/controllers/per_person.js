'use strict';

module.exports = function($scope, $routeParams, Host, Person,
  Questiontype, Questionaire, Questionvsanswer, Qrecord, Qtimestamp, Form, Systemtype) {
  $scope.person = null;
  $scope.qtimestamp = null;
  
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
  
  $scope.deleteQtimestamp = function(qtimestamp) {
    Qtimestamp.deleteById({id:qtimestamp.id})
    .$promise.then(function() {
      $scope.questiontype.qtimestamps = $scope.questiontype.qtimestamps.filter(function(elem) {
        return elem.id !== qtimestamp.id;
      });
      $scope.qtimestamp = null;
    });
  }
  
  $scope.clearQrecords = function(qtimestamp) {
    Qtimestamp.qrecords({id:qtimestamp.id})
    .$promise.then(function(records) {
        records.forEach(function(qrecord) {
          Qrecord.deleteById({id:qrecord.id})
          .$promise.then(function(){
            qtimestamp.qrecords = qtimestamp.qrecords.filter(function(elem) {
              return elem.id !==  qrecord.id;
            });
            $scope.qtimestamp.questionaires.forEach(function(qe) {
              if(qe.radio) {
                qe.qrecord = null;
              }
              if(qe.checkbox) {
                qe.answers.forEach(function(answer) {
                  answer.selected = false;
                });
              }
            });
          });
        });
    })
  }
  
  $scope.createQtimestamp = function() {
    var n_qt = {personId:$scope.person.id,questiontypeId:$scope.questiontype.id};
    Qtimestamp.create(n_qt).$promise.then(function(result) {
      $scope.selectQuestiontype($scope.questiontype);
    });
  }

  $scope.selectForm = function(form) {
    $scope.form = form;
    $scope.questiontype = null;
    $scope.qtimestamp = null;
    Form.questiontypes({
        id: form.id
      })
      .$promise.then(function(results) {
        $scope.form.questiontypes = results;
      });
  }

  $scope.selectQtimestamp = function(qtimestamp) {
    $scope.qtimestamp = qtimestamp;
    $scope.currentQuestion = 1;
    $scope.qtimestamp.questionaires = [];
    
    Questiontype.questionaires({
      id: qtimestamp.questiontypeId
    }).$promise.then(function(results) {
      // console.log(results.length);
      $scope.qtimestamp.questionaires = results;
      results.forEach(function(qe) {
        if(qe.IUControl == "20030") {
          qe.radio = true;
        }
        if(qe.IUControl == "20020") {
          qe.checkbox = true;
        }
        Questionaire.questionvsanswers({id:qe.id, filter:{include:["answer"]}})
        .$promise.then(function(answers) {
          qe.answers = answers;
          Qrecord.find({filter:{
            where:{and:[{questionaireId:qe.id},{qtimestampId:qtimestamp.id}]}
          }}).$promise.then(function(qrecords) {
            // radio
            if(qe.radio) {
              if(qrecords.length > 0) {
                qe.qrecord = qrecords[0];
              } else {
                qe.qrecord = {questionaireId:qe.id,qtimestampId:qtimestamp.id};
              }
            }
            // checkbox
            if(qe.checkbox) {
              qrecords.forEach(function(qrecord) {
                for(var i=0;i<qe.answers.length;i++) {
                  if(qe.answers[i].answerId == qrecord.answerId) {
                    qe.answers[i].selected = true;
                    qe.answers[i].qrecord = qrecord;
                    break;
                  }
                }
              });
            }
          });
        });
      });
    });
  };
  
  $scope.updateCheckbox = function(qtimestamp, answer) {
    if(answer.selected) {
      var qrecord = {qtimestampId:qtimestamp.id,questionaireId:answer.questionaireId,answerId:answer.answerId};
      if(!answer.qrecord) {
        Qrecord.create(qrecord).$promise.then(function(result) {
          answer.qrecord = result;
          qtimestamp.qrecords.push(result);    
        });
      }
    } else {
      if(answer.qrecord) {
        // delete
        Qrecord.deleteById({id:answer.qrecord.id}).$promise.then(function(result) {
          qtimestamp.qrecords = qtimestamp.qrecords.filter(function(elem) {
            return elem.id !==  answer.qrecord.id;
          });
          answer.qrecord = null;
        });
      }
    }
  }
  
  $scope.updateRadio = function(qrecord) {
    console.log(qrecord);
    if(qrecord.id) {
      Qrecord.findById({id:qrecord.id}, function(result) {
        result.answerId = qrecord.answerId;
        result.$save(function(result) {
          //
        });
      });
    } else {
      Qrecord.create(qrecord).$promise.then(function(result) {
        qrecord.id = result.id;
        $scope.qtimestamp.qrecords.push(qrecord);
      });
    }
  }

  $scope.selectQuestiontype = function(questiontype) {
    $scope.questiontype = questiontype;
    Form.findById({id:questiontype.formId}).$promise.then(function(form) {
      $scope.form = form;  
    });
    
    $scope.qtimestamp = null;
    Qtimestamp.find({
      filter: {
        where: {
          and: [{
            personId: $scope.person.id
          }, {
            questiontypeId: questiontype.id
          }]
        },
        include:["qrecords"]
      }
    }).$promise.then(function(results) {
      $scope.questiontype.qtimestamps = results;
    });
  }

};
