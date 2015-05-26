var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
// var datasource = app.dataSources['caseDs'];

// var Model = app.models.Person;
var M1 = app.models.Qtimestamp;

M1.find({where:{id:"54fea73b47d8f51053b4348a"},include:["qrecords"]
}, function(err, m2) {
  console.log(JSON.stringify(m2));
});
