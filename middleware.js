var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('./models/User');
var passport = require('passport');
var session = require("express-session");
var bodyParser = require('body-parser');
var multer = require('multer');

var config = require('./env');

var middleware = function(server) {

  server.use(session({
    secret: config.SESSION_KEY,
    resave: true
  }));
  server.use(bodyParser.json());
  server.use(passport.initialize());
  server.use(passport.session());

  //manage files uploads
  server.use(multer({ dest: './public/uploads',
   rename: function (fieldname, filename) {
      console.log('rename');
      return filename+Date.now();
    },
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  var handleUser = function(token, tokenSecret, profile, done) {
    var user = {
      provider_id: profile.id,
      provider: profile.provider,
      name: profile.displayName,
      picture: profile.photos[0].value
    };
    User.findOrCreate(user, function(err, model) {
      done(err, model);
    });
  };

  passport.use(new FacebookStrategy({
      clientID: config.facebook.id,
      clientSecret: config.facebook.secret,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos']
    }, handleUser
  ));

  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.id,
      consumerSecret: config.twitter.secret,
      callbackURL: '/auth/twitter/callback'
    }, handleUser
  ));

  var handleCallback = function handleCallback(strat) {
    return function(req, res, next) {
      passport.authenticate(strat, function(err, user, info){
        if (err) return next(err);
        if (!user) return console.log('wtf')
        req.logIn(user, function(err){
          if (err) return next(err);
          var redirectUrl = req.session.redirectUrl || '/';
          res.redirect(redirectUrl);
        });
      })(req, res, next);
    }
  }

  server.get('/auth/facebook', passport.authenticate('facebook'));
  server.get('/auth/facebook/callback', handleCallback('facebook'));

  server.get('/auth/twitter', passport.authenticate('twitter'));
  server.get('/auth/twitter/callback', handleCallback('twitter'));
  
}

module.exports = middleware;