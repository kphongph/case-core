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
      input:'./server/server.js',
      dsName:'caseDs',
      dest:'common/grunt-models',
    }
  });

  grunt.loadNpmTasks('grunt-loopback-sdk-angular');
  grunt.loadTasks('grunt-tasks');

  // Default task(s).
  grunt.registerTask('default', ['discover-ds']);
  grunt.registerTask('lbservice', ['loopback_sdk_angular']);

};
