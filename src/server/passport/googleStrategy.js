const Users = require("../schema/Users");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const bcrypt = require("bcryptjs");
const config = require("../config");

module.exports = (passport) => {
  //Setting the passport google strategy for google authentication
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "512354110909-ge6o3e0uphbkhmpg7qndaid7b1j1tkid.apps.googleusercontent.com",
        clientSecret: "cnJ_KHiLUX1oCsCJ_At-31X4",
        callbackURL: config.serverUrl + "/register/redirect",
      },
      async (accessToken, refreshToken, profile, done) => {
        // done(null, profile);

        //Check if the user already registered or not
        let user = await Users.findOne({ googleId: profile._json.sub }).catch(
          (err) => {
            throw err;
          }
        );

        if (user) {
          //Continue with login
          done(null, user);
        } else {
          //User not authenticated (Continue to signup page)
          done(null, false, profile);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (userId, done) {
    Users.findOne({ _id: userId }, (err, user) => {
      done(err, user);
    });
  });
};
