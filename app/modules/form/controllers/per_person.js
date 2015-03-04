'use strict';

module.exports = function($scope, $routeParams, Host, Person,
  Questiontype, Questionvsanswer, Qrecord, Qtimestamp, Form, Systemtype) {
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
    Form.questiontypes({
        id: form.FID
      })
      .$promise.then(function(results) {
        $scope.form.questiontypes = results;
      });
  }

  $scope.selectQtimestamp = function(qtimestamp) {
    Qrecord.find({
      filter: {
        where: {
          and: [{
            CID: $scope.person.CID
          }, {
            QTID: qtimestamp.QTID
          }, {
            QTSID: qtimestamp.QTSID
          }]
        }
      }
    }).$promise.then(function(records) {
      // make dict for record
      var record_dict = {};
      records.forEach(function(record) {
        record_dict[record.QTID + '-' + record.QID] = record;
      });
      Questiontype.questionaires({
          id: qtimestamp.QTID
        })
        .$promise.then(function(results) {
          $scope.questiontype.questionaires = results;
          results.forEach(function(qe,index) {
            Questionvsanswer.find({
              filter: {
                where: {
                  and: [{
                    QID: qe.QID
                  }, {
                    QTID: qe.QTID
                  }]
                },
                include: ['answer']
              }
            }).$promise.then(function(answers) {
              qe.answers = answers;
              qe.answers.forEach(function(answer) {
                var c_record = record_dict[qe.QTID+'-'+qe.QID];
                if (answer.AID == c_record.AID) {
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

  $scope.$watch("questiontype.questionaires", function(val) {
    if($scope.questiontype && $scope.questiontype.questionaires) {
      $scope.questiontype.questionaires.forEach(function(qe) {   
        if(qe.qrecord) {
          // update
          if(qe.qrecord_org.AID != qe.qrecord.AID) {
          qe.qrecord.message = "saving...";
          qe.qrecord.$save(function(result) {
            qe.qrecord.message = "saved";
            qe.qrecord_org = angular.copy(result);
          });
          }
        }
      });
    }
  },true);

  $scope.selectQuestiontype = function(questiontype) {
    $scope.questiontype = questiontype;

    Qtimestamp.find({
      filter: {
        where: {
          and: [{
            CID: $scope.person.CID
          }, {
            QTID: questiontype.QTID
          }]
        }
      }
    }).$promise.then(function(results) {
      $scope.questiontype.qtimestamps = results;
    });

    Questiontype.questionaires({
        id: questiontype.QTID
      })
      .$promise.then(function(results) {
        $scope.questiontype.questionaires = results;
        results.forEach(function(qe) {
          Questionvsanswer.find({
            filter: {
              where: {
                and: [{
                  QID: qe.QID
                }, {
                  QTID: qe.QTID
                }]
              },
              include: ['answer']
            }
          }).$promise.then(function(answers) {
            qe.answers = answers;
          });
        });

      });
  }

};
