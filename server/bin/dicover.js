var path = require('path');

var app = require(path.resolve(__dirname, '../server'));

var datasource = app.dataSources['aclDs'];


console.log('+discoverModel');
datasource.discoverModelDefinitions(function(err,models) {
  console.log('return from def');
  models.forEach(function(def) {
    console.log(def.name);
  });
  datasource.disconnect();
});
console.log('-discoverModel');

/*
datasource.discoverSchema('User', {schema: 'dbo'},
    function(err, schema) {
  if (err) throw err;

  console.log(JSON.stringify(schema, null, '  '));

  datasource.disconnect();
});
*/
