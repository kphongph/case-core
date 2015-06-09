var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
var datasource = app.dataSources['eduDs'];

/*
datasource.discoverModelDefinitions(function(err,models) {
  models.forEach(function(def) {
    console.log(def.name);
  });
  datasource.disconnect();
});
*/

datasource.discoverSchema('Person', {schema:"dbo"},
  function(err, schema) {
  if (err) throw err;
  console.log(JSON.stringify(schema, null, '  '));
  datasource.disconnect();
});
