var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
// var datasource = app.dataSources['caseDs'];

// var Model = app.models.Person;
var M1 = app.models.Answer;
var M2 = app.models.Questionvsanswer;

M2.find(function(err, m2_list) {
  var count = m2_list.length;
  m2_list.forEach(function(m2) {
    // M1.findOne({where:{and:[{QTID:m2.QTID},{QID:m2.QID} ]}}, function(err, m1) {
    M1.findOne({where:{AID:m2.AID}}, function(err, m1) {
      if(m1) {
      m2['answerId']=m1.id;
      m2.save(function(err, result) {
        console.log(result);
        count--;
        if(count==0) {
          console.log("Done!");
        }
      });
      } else {
        count--;
      }
    });
  });
});
