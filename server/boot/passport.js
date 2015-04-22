module.exports = function(app) {
  
  var loopback = require('loopback');

  // Passport configurators
  var loopbackPassport = require('loopback-component-passport'); 
  var PassportConfigurator = loopbackPassport.PassportConfigurator;
  var passportConfigurator = new PassportConfigurator(app);

  
  var bodyParser = require('body-parser');
  var flash = require('express-flash');
  
  var config = {};

  try {
    config = require('../providers.json');
  } catch(err) {
    console.trace(err);
    process.exit(1);
  }

  app.use(loopback.session({
    secret:'kitty',
    saveUninitialized: true,
    resave:true
  }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));

  app.use(loopback.cookieParser('ltcnu'));

  app.use(loopback.token({
    model: app.models.accessToken
  }));

  passportConfigurator.init();
  
  app.use(flash());
  passportConfigurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential
  });

  for(var s in config) {
    var c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
  }

  var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

  app.get('/account', ensureLoggedIn('/'), function (req, res, next) {
    console.log(req.signedCookies);
    if(req.signedCookies.userId) {
      res.json(req.user);
    } else {
      res.json({'status':401,'message':'Unauthorized'});
    }
  });

  
  app.get('/auth/account',ensureLoggedIn('/'),function(req,res,next) {
    // res.json({'status':200,'message':'Successful'});
    // console.log('token',req.cookies);
    // res.send(req.user);
    res.redirect('/');
  });

  app.get('/link/account', ensureLoggedIn('/'),function(req,res,next) {
    res.json(req.user);
  });

  app.get('/unauthroized', function(req, res, next) {
    //  res.sendStatus(401);
    res.json({'status':401,'message':'Unauthorized'});
  });
  
  app.get('/auth/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
    // res.json({'status':200,'message':'Successful'});
  });

  console.log('passport plugin');
};
