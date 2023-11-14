const passport = require('passport');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/user');

const googleAuthRouter = express.Router();

googleAuthRouter.use(cookieParser({
  sameSite: 'none',
  secure: false
}));

googleAuthRouter.use(passport.initialize());

googleAuthRouter.use(cors({
  origin: "http://127.0.0.1:5173",
  credentials: true
}));

passport.serializeUser((user,done)=>{
  //user.id is not profile id. it is id that created by the database
      done(null,user._id)
  })

  passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user)
    })
})

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/google/callback",
  scope: ['profile', 'email']
},
function (accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id },
    {
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      userImage: profile.photos[0].value
    },
    function (err, user) {
      return cb(err, user);
    });
}
));

googleAuthRouter.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

googleAuthRouter.get('/auth/google/callback', (req, res) => {
    passport.authenticate('google', { failureRedirect: '/login/failed', session: false }, (err, user) => {
      try {
        if (!user) {
          return res.status(401).json({ error: 'Google authentication failed' });
        }
        jwt.sign(
          {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userImage: user.userImage
          },
          process.env.JWT_KEY,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {
              sameSite: 'lax',
              secure: false
            }).redirect(process.env.REDIRECT_URI);
          }
        );
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res);
  });
  

googleAuthRouter.get('/auth/login/failed', (req, res) => {
  res.status(401).json({
    error: 'Login failed'
  });
});

module.exports = googleAuthRouter;
