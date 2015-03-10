var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
// var datasource = app.dataSources['caseDs'];

// var Model = app.models.Person;
var M1 = app.models.Qtimestamp;

M1.find({filter:{where:{id:"54fea73b47d8f51053b4348a"}}, function(err, m2_list) {
  var count = m2_list.length;
  console.log(count);
});
