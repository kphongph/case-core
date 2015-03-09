var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
var datasource = app.dataSources['caseDs'];

// var Model = app.models.Person;
var M1 = app.models.Form;
var M2 = app.models.Questiontype;

M2.find(function(err, m2_list) {
  m2_list.forEach(function(m2) {
    M1.findOne({where:{FID:m2.FID}}, function(err, m1) {
      m2['formId']=m1.id;
      m2.save(function(err, result) {
        console.log(result);
      });
    });
  });
});
