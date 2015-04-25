var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var MongoClient = require('mongodb').MongoClient;

// var mongourl = 'mongodb://128.199.108.210:27017/casedb';

var mongourl = 'mongodb://52.74.105.192:27017/casedb_test';

var mssql_config = {
  "server":"AssertProjects.nu.ac.th",
  "port":1433,
  "database":"2014_gen2_case",
  "userName":"sa",
  "password":"Theerawutt53",
  "options" :{ 
    "database":"2014_gen2_case",
    "encrypt": true
  }
};

var query = function(config, st, cb) {
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

var mongodb = null;

MongoClient.connect(mongourl, function(err, db) {
  query(mssql_config,
    "select * from Organization", function(plans) {
    var plan_col = db.collection('organizations');
    count = 0;
    plans.forEach(function(plan) {
      plan_col.insert(plan, {w:1}, function(err, doc) {
        if(!err) {
          count++;
          console.log(count,'/',plans.length);
          if(count == plans.length) {
            db.close();
          }
        }
          
      });
    });
  });
});
