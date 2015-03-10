var path = require('path');

// var Model = app.models.Person;
// var Model = app.models.Systemtype;
// var Model = app.models.Form;
// var Model = app.models.Questiontype;
// var Model = app.models.Questionaire;

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://128.199.108.210:27017/casedb';


MongoClient.connect(url, function(err, db) {
  if(err) throw err;
  // var collection = db.collection('person');
  // var collection = db.collection('systemtype');
  var collection = db.collection('qtimestamp');
  collection.find().toArray(function(err, docs) {
    docs.forEach(function(doc) {
      console.log(doc);
    });
    db.close();
  });
  
});

