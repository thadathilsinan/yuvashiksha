/**
 * ROUTER FOR /login
 *
 */

var express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

var router = express.Router();

router.use(bodyParser.json());

router.post("/", function (req, res, next) {
  //Using the passport local strategy login
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) {
      res.statusCode = 203;
      res.end("Username or password wrong");
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.statusCode = 200;
        res.end("Successfully Authenticated");
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
