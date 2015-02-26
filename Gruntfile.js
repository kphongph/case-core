module.exports = function(grunt) {
  grunt.config('loopback_sdk_angular', {
    services: {
      options: {
        input: 'server/server.js',
        output: 'client/js/lb-services.js'
      }
    }
  });
  
  /*
  grunt.config('discover-ds', {
    options:{
      dsFile:'server/datasources.json',
      dsName:'caseDs',
      existModel:'common/models',
      dest:'common/grunt-models',
    }
  });
  */

  grunt.config('discover-ds', {
    options:{
      dsFile:'server/datasources.json',
      dsName:'aclDs',
      existModel:'common/models',
      dest:'common/grunt-models',
    }
  });
  
  grunt.config('jsbeautifier',{
    files : ['client/**/*.html',
      'client/js/**/*.js', 
      'client/modules/**/*.js'],
    options:{
      html:{
        indentSize:1,
        wrapLineLength: 80
      },
      js:{
        indentSize:2,
        indentLevel:0,
        spaceBeforeConditional:true,
        keepArrayIndentation:true,
        keepFunctionIndentation:true,
        preserveNewlines:true,
        wrapLineLength:80
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-loopback-sdk-angular');
  grunt.loadTasks('grunt-tasks');

  // Default task(s).
  grunt.registerTask('default', []);
  grunt.registerTask('lbservice', ['loopback_sdk_angular']);
  grunt.registerTask('beautify', ['jsbeautifier']);

};
