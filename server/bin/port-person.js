var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
var datasource = app.dataSources['caseDs'];

var Person = app.models.Person;

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://128.199.108.210:27017/casedb';


MongoClient.connect(url, function(err, db) {
  if(err) throw err;
  var collection = db.collection('person');

  collection.drop(function(err, reply) {
    Person.find(function(err, results) {
      var total = results.length;
      var count = 0;
      console.log("inserting "+total+" records");
      results.forEach(function(person) {
        collection.insert(person.__data, function(err, result) {
          if(err) {
            console.log(err);
          } else {
            count++;
            console.log(" "+count+"/"+total+" inserted");
            if(count == total) {
              db.close();
            }
          }
        });
      });
    });
  });
});

