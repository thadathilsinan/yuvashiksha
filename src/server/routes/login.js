/**
 * ROUTER FOR /login
 *
 */

var express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

//Importing required Monggose Models
let Users = require("../schema/Users");

var router = express.Router();

router.use(bodyParser.json());

router.post("/", function (req, res, next) {
  // Signin.findOne({
  //   username: req.body.username,
  //   password: req.body.password,
  // })
  //   .then((user) => {
  //     if (!user) {
  //       res.statusCode = 203;
  //       res.end("Username or password incorrect");
  //     } else {
  //       res.statusCode = 200;
  //       res.end(
  //         `username=${user.username}` +
  //           " %split% " +
  //           `password=${user.password} %split% accountType=${user.accountType}`
  //       );
  //     }
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });

  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});

router.get("/test", (req, res, next) => {
  res.cookie("name", "sinan");
  res.end("Success");
});

router.post("/google", (req, res, next) => {});

module.exports = router;
