var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

  app.use(loopback.token({
    model: app.models.accessToken
  }));

// boot scripts mount components like REST API
boot(app, __dirname, function(err) {
  if(err) throw err;
  if(require.main == module) {
    app.start();
  }
});

// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

var path = require('path');
app.use(loopback.static(path.resolve(__dirname, '../md')));

app.use(loopback.urlNotFound());
app.use(loopback.errorHandler());
