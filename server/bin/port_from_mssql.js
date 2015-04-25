var path = require('path');
var pluralize = require('pluralize');
var app = require(path.resolve(__dirname, '../server'));
var datasource = app.dataSources['caseDs'];
var fs=require('fs');

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var MongoClient = require('mongodb').MongoClient;

var mongourl = 'mongodb://52.74.105.192:27017/casedb_test';

var mssql_config = {
  "server":"AssertProjects.nu.ac.th",
  "port":1433,
  "database":"2014_gen2_case",
  "userName":"sa",
  "password":"Theerawutt53",
  "options" :{ 
    "connectTimeout":0,
    "database":"2014_gen2_case",
    "encrypt": true
  }
};

var mongodb = null;


var table_name = process.argv[2];

/*
datasource.discoverModelDefinitions(function(err,models) {
  models.forEach(function(def) {
    console.log(def.name);
  });
  datasource.disconnect();
});
*/


datasource.discoverSchema(table_name, {schema:"dbo"},
  function(err, schema) {
  if (err) throw err;
  var tmp = {};
  tmp['name']=schema['name'];
  tmp['options']= {"idInjection": true};
  tmp['mongodb']= {"collection":pluralize(table_name)};
  var props = {};
  for(var key in schema.properties) { 
    var tmpKey = schema.properties[key].mssql.columnName;   
    var type = schema.properties[key].type;   
    props[tmpKey] = {'type':type};
  }
  tmp['properties']=props;
  // console.log(JSON.stringify(tmp, null, '  '));
  fs.writeFile("../../common/models/"+table_name+".json",
    JSON.stringify(tmp,null,'  '));

  var mconfig = JSON.parse(fs.readFileSync("../model-config.json","utf8"));
  mconfig[tmp['name']] = {
    "dataSource": "caseMongoDs",
    "public": true
  }
  fs.writeFile("../model-config.json",
    JSON.stringify(mconfig,null,'  '));

  datasource.disconnect();
  export_content(table_name);
});

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


var export_content = function(table) { 
  MongoClient.connect(mongourl, function(err, db) {
    query(mssql_config,
      "select * from "+table, function(plans) {
      console.log('Found',plans.length,'records');
      var plan_col = db.collection(pluralize(table));
      plan_col.remove({},{w:1}, function(err, reCount) {
        console.log('removed',reCount.result.n,'documents');
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
  });
};
