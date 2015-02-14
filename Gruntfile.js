module.exports = function(grunt) {
  grunt.config('loopback_sdk_angular', {
    services: {
      options: {
        input: 'server/server.js',
        output: 'client/js/lb-services.js'
      }
    }
  });
  
  grunt.config('discover-ds', {
    options:{
      dsFile:'server/datasources.json',
      dsName:'caseDs',
      dest:'common/grunt-models',
    }
  });
  
  grunt.config('jsbeautifier',{
    files : ['client/**/*.html','client/js/**/*.js'],
    options:{
      html:{indentSize:1},
      js:{indentSize:2}
    }
  });

  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-loopback-sdk-angular');
  grunt.loadTasks('grunt-tasks');

  // Default task(s).
  grunt.registerTask('default', ['discover-ds']);
  grunt.registerTask('lbservice', ['loopback_sdk_angular']);
  grunt.registerTask('beautify', ['jsbeautifier']);

};
