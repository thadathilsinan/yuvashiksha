/**
 * ROUTER FOR /login
 *
 */

var express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

var router = express.Router();

//Importing required monggose models
const BugReport = require("../schema/BugReport");

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

router.post("/report", async (req, res, next) => {
  let newReport = new BugReport({
    userEmail: req.body.email,
    message: req.body.message,
  });

  let currentDate = new Date();

  newReport.date = currentDate;

  //Saving new report document to the database
  await newReport.save().catch((err) => next(err));

  res.statusCode = 200;
  res.end("Bug report successfully submitted");
});

router.get("/test", (req, res, next) => {
  res.cookie("name", "sinan");
  res.end("Success");
});

router.post("/google", (req, res, next) => {});

module.exports = router;
