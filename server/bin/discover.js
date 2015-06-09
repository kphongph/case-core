var path = require('path');
var fs = require('fs');
var app = require(path.resolve(__dirname, '../server'));

var dsName = process.argv[2];
var tableName = process.argv[3];
var modelPath = process.argv[4];
var datasource = app.dataSources[dsName];

var modelConfigPath = "../model-config.json";

/*
datasource.discoverModelDefinitions(function(err,models) {
  models.forEach(function(def) {
    console.log(def.name);
  });
  datasource.disconnect();
});
*/

datasource.discoverSchema(tableName, {schema:"dbo"},
  function(err, schema) {
  if (err) throw err;
  schema.name = schema.options.mssql.table;
  var jsonContent = JSON.stringify(schema, null, '  ');
  var jsonPath = path.join(modelPath,tableName+'.json');
  var jsContent = "module.exports = function("+tableName+") {\n};";
  var jsPath = path.join(modelPath,tableName+'.js');
  
  fs.writeFile(jsonPath,jsonContent, function(err) {
    console.log(jsonPath,'created');
    fs.writeFile(jsPath,jsContent, function(err) {
      console.log(jsPath,'created');
      fs.readFile(modelConfigPath,'utf8',function(err,data) {
        if(err) throw err;
        var obj = JSON.parse(data);
        obj[tableName] = {
          "dataSource": dsName,
          "public": true
        };
        fs.writeFile(modelConfigPath,JSON.stringify(obj,null,'  '), function(err) {
          console.log(modelConfigPath,'updated');
          datasource.disconnect();
        });
      });
    });
  });
});
