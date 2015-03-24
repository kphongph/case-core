var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var MongoClient = require('mongodb').MongoClient;

var mongourl = 'mongodb://128.199.108.210:27017/casedb';

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
      connection.close();
      cb(results);
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
        question['qid']=questionaire.QID;
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
  var part = {'name':qtype.QTDesc,'qtid':qtype.QTID};
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

var loadFromTemplate = function(template) {
  var document_dict = {}; 
  var document_count = 0;
  var part_count = template.parts.length;
  template.parts.forEach(function(part) {
    var q_st = "select * from QTimeStamp where QTID='"+part.qtid+"'";
    query(q_st, function(qts_list) {
      qts_list.forEach(function(qts) {
        var key=qts.CID+'-'+qts.QTSID;
        if(!document_dict[key]) {
          document_count++;
          var n_doc=JSON.parse(JSON.stringify(template));
          n_doc['cid']=qts.CID;
          n_doc['qtsid']=qts.QTSID;
          document_dict[key]=n_doc;
        }
      });

      part_count--;
      if(part_count==0) {
        console.log(document_count);
        var document_list = [];
        for(var key in document_dict) {
          document_list.push(document_dict[key]);
        }

        var collection = mongodb.collection("formTemplates");
        collection.remove({loadFromDB:true,fid:formId},{w:1},function(err,n) {
          console.log("removed",n.result.n,"documents");
          syncDocument(document_list,0);
        });
      }
    });
  });
  // build template
};

var syncDocument = function(document_list,index) {
  console.log("Performing",index,
    "CID",document_list[index].cid,
    "QTSID",document_list[index].qtsid);

  setValueForTemplate(document_list[index],function(document) {
    if(index+1<document_list.length) {
      syncDocument(document_list,index+1);
    } else {
      mongodb.close();
    }
  });
};

var setValueForTemplate = function(document,cb) {
  query("select * from QRecord where "+
     "QTSID='"+document.qtsid+"' and "+
     "CID='"+document.cid+"'", function(qrecords) {
    document['template']=false;
    document['loadFromDB']=true;
    document['loadDate']=new Date();
    qrecords.forEach(function(qrecord) {
      var part = null;
      for(var i=0;i<document.parts.length;i++) {
        if(document.parts[i].qtid == qrecord.QTID) {
          part = document.parts[i];
          break;
        }
      }
      if(part) {
        part.questionnaires.forEach(function(questionnaire) {
          questionnaire.questions.forEach(function(question) {
            if(qrecord.QID == question.qid) {
              question.value = answerDict[qrecord.AID];
            }
          });
        });
      }
      // store to mongodb
    });
    
    var collection = mongodb.collection("person");
    collection.findOne({"CID":document.cid},function(err,doc) {
      if(err) throw err;
      if(doc) {
        document.ownerId = doc._id;
        var formDB = mongodb.collection("formTemplates");
        formDB.insert(document,{w:1},function(err,result) {
          console.log("-> inserted",result.result.n,"documents");
          cb(document);
        });
      
      } else {
        console.log("-> Not Found CID "+document.cid);
        cb(document);
      }
    });
  });
}

var insertDocument = function(document_list) {
  console.log("inserting",document_list.length,"documents");
};


var formId = '00001';
var formTemplate = {};
var answerDict = {};
var mongodb = null;

// executed by formId
MongoClient.connect(mongourl, function(err, db) {
  if(err) throw err;
  mongodb = db;
  query("select * from Form where FID ='"+formId+"'", function(forms) {
    formTemplate['fid'] = forms[0].FID;
    formTemplate['name'] = forms[0].FDesc;
    formTemplate['parts'] = [];

    // create AnswerDict 
    query("select * from Answer", function(answers) {
      answers.forEach(function(answer) {
        answerDict[answer.AID] = answer.ADesc;
      });
      query("select * from QuestionType where FID ='"+formId+"'", 
        function(qtypes) {
          var parts = qtypes.length;
          qtypes.forEach(function(qtype) {
            buildPart(qtype,function(part) {
              parts--; 
              formTemplate['parts'].push(part);
              if(parts == 0) {
                loadFromTemplate(formTemplate);
              }
            });
          });
      });
    });
  });
});
