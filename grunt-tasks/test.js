var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

module.exports = function(grunt) {

  grunt.registerTask('discover-ds', function(which) {
    var done = this.async();
    var options = this.options({});
    var appFile = options.input;
    var dsName = options.dsName;

    if(!appFile) 
      grunt.fail.warn('Missing mandatory option "input".');
    
    if(!grunt.file.exists(appFile)) 
      grunt.fail.warn('Input file '+appFile + ' not found.');
    
    var app;   
    var datasource;
    try {
      app = require(path.resolve(appFile));
      datasource = app.dataSources[options.dsName];
      grunt.log.ok('Loaded LoopBack app %j', appFile);
    } catch (e) {
      var err = new Error('Cannot load LoopBack app ' + appFile);
      err.origError = e;
      grunt.fail.warn(err);
    }

    if(!datasource) 
      grunt.fail.warn('data source '+options.dsName+' not found.');
  
    datasource.discoverModelDefinitions(function(err, defs) {
      var count = defs.length;
      var schema_list = [];

      defs.forEach(function(def) {
        datasource.discoverSchema(def.name, function(err, schema) {
          count--;
         // grunt.log.ok(schema.name+' Generated ('+count+' more to generate)');
          var content = JSON.stringify(schema,null,'  ');
          var json_file = path.resolve(options.dest,schema.name+'.json');
          grunt.file.write(json_file,content);

          var jsTemplate = fs.readFileSync(
            require.resolve('./js.template.ejs'),
            { encoding: 'utf-8' }
          );    
          schema_list.push(schema);

          content = ejs.render(jsTemplate, {
            schema:schema
          });
          var js_file = path.resolve(options.dest,schema.name+'.js');
          grunt.file.write(js_file,content);

          if(count == 0) {
            var modelConfigTemplate = fs.readFileSync(
              require.resolve('./model-config.template.ejs'),
              { encoding: 'utf-8' }
            );    

            var model_config_content = ejs.render(modelConfigTemplate, {
               models:schema_list,
               dsName:dsName
            });

            grunt.file.write(path.resolve('./server/model-config.json'),
            model_config_content);
            datasource.disconnect();
            done();
          }
        });
      });
    });
  });
};
