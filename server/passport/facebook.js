require('dotenv').config();
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'name', 'gender','birthday','email','location', 'picture.type(large)']
    },
    
    function(accessToken, refreshToken, profile, done) {
     
        
        done(null, profile);
    }
  )
);