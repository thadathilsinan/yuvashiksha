const Users = require("../schema/Users");
const Admin = require("../schema/Admin");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { passReqToCallback: true },
      async (req, username, password, done) => {
        if (req.body.adminLogin) {
          //Admin account login
          let admin = await Admin.findOne({ username, password });

          if (admin) {
            //Admin Login success
            return done(null, { user: admin, accountType: "admin" });
          } else {
            //Login failed
            return done(null, false);
          }
        } else {
          //Noraml user login
          Users.findOne({ registerNumber: username }, (err, user) => {
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
      Admin.findOne({ _id: id.id }, (err, user) => {
        cb(null, id);
      });
    } else {
      Users.findOne({ _id: id }, (err, user) => {
        cb(err, user);
      });
    }
  });
};
