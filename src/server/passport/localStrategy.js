const Users = require("../schema/Users");

const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

const config = require("../config");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { passReqToCallback: true },
      async (req, username, password, done) => {
        if (req.body.adminLogin) {
          //Admin account login

          if (
            username == config.adminUsername &&
            password == config.adminPassword
          ) {
            //Admin Login success
            return done(null, {
              user: { username, password, accountType: "admin", id: 1 },
              accountType: "admin",
            });
          } else {
            //Login failed
            return done(null, false);
          }
        } else {
          //Noraml user login
          Users.findOne({ registerNumber: username }, (err, user) => {
            if (!user) {
              return done(null, false);
            }

            //Checking user account status
            if (user.accountStatus == "signup-incomplete") {
              return done(new Error("Account signup is INCOMPLETE"), false);
            } else if (user.accountStatus == "not-activated") {
              return done(new Error("User account NOT ACTIVATED"), false);
            } else if (user.accountStatus == "rejected") {
              return done(new Error("User account is REJECTED"), false);
            } else if (user.accountStatus == "disabled") {
              return done(new Error("Account is temporarily DISABLED"));
            } else if (user.accountStatus == "ok") {
              if (err) throw err;
              if (!user) return done(null, false);
              bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result === true) {
                  return done(null, user);
                } else {
                  return done(null, false);
                }
              });
            } else {
              return done(new Error("User account not valid", false));
            }
          });
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    if (user.accountType == "admin") {
      cb(null, { id: user.user.id, accountType: "admin" });
    } else {
      cb(null, user.id);
    }
  });
  passport.deserializeUser((id, cb) => {
    if (id.accountType == "admin") {
      cb(null, {
        username: config.adminUsername,
        password: config.adminPassword,
        accountType: "admin",
        id: 1,
      });
    } else {
      Users.findOne({ _id: id }, (err, user) => {
        cb(err, user);
      });
    }
  });
};
