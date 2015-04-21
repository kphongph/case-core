var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// boot scripts mount components like REST API
boot(app, __dirname);

// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

var path = require('path');
app.use(loopback.static(path.resolve(__dirname, '../md')));

app.use(loopback.urlNotFound());
app.use(loopback.errorHandler());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

if(require.main == module) {
  app.start();
}
