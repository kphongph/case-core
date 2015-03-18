var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
  "server":"AssertProjects.nu.ac.th",
  "port":1433,
  "userName":"sa",
  "password":"Theerawutt53",
  options :{ 
    "database":"2014_gen2_case",
    "encrypt": false 
  }
};

var query = function(st, cb) {
  var connection = new Connection(config);
  var results = [];
  connection.on('connect', function(err) {
    if(err) throw err; 
    request = new Request(st, function(err, count, rows) {
      if(err) throw err;
      cb(results);
      connection.close();
    });
  
    request.on('row', function(columns) {
      var obj = {};
      columns.forEach(function(column) {
        obj[column.metadata.colName] = column.value;
      });
      results.push(obj);
    });
    connection.execSql(request);
  });
};

var buildQuestionnaires = function(questionaire,cb) {
  var questionnaire = {};
  questionnaire['name'] = questionaire.QDesc;
  query("select * from QuestionVSAnswer where QTID='"+ 
    questionaire.QTID+"' and QID='"+questionaire.QID+"'",
    function(results) {
      // create radio
      questionnaire['questions'] = [];
      if(questionaire.IUControl == '20030') {
        var question = {};
        question['type']="radio";
        question['label']=questionaire.QDesc;
        question['choices'] = [];
        results.forEach(function(result) {
          var obj = {
            'label':answerDict[result.AID],
            'value':answerDict[result.AID]
          };
          question['choices'].push(obj);
        });
        questionnaire['questions'].push(question);
      }
      cb(questionnaire);
  });
};


var buildPart = function(qtype,cb) {
  var part = {'name':qtype.QTDesc};
  part['questionnaires'] = [];
  query("select * from Questionaire where QTID='"+qtype.QTID+"'", 
    function(results) {
      var count = results.length;
      results.forEach(function(result) {
        buildQuestionnaires(result,function(questionnaire) {
          count--;
          part['questionnaires'].push(questionnaire);
          if(count==0) {
            cb(part);
          }
        });
      });
  });
};


var formId = '00001';
var formTemplate = {};
var answerDict = {};

// executed by formId
query("select * from Form where FID ='"+formId+"'", function(forms) {
  formTemplate['name'] = forms[0].FDesc;
  formTemplate['parts'] = [];
  // create AnswerDict 
  query("select * from Answer", function(answers) {
    answers.forEach(function(answer) {
      answerDict[answer.AID] = answer.ADesc;
    });
    query("select * from QuestionType where FID ='"+formId+"'", 
      function(qtypes) {
        var qtid_list = [];
        qtypes.forEach(function(qtype) {
          // for each part
          buildPart(qtype,function(part) {
            formTemplate['parts'].push(part);
            console.log(JSON.stringify(formTemplate));
          });
        });
    });
  });
});
