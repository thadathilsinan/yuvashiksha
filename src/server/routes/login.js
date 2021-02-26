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
const Department = require("../schema/department");
const Classes = require("../schema/classes");

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

//Check admin logged in or not
router.post("/checkAdmin", (req, res, next) => {
  if (req.user && req.user.accountType == "admin") {
    res.statusCode = 200;
    res.end("Admin Login success");
  } else {
    res.statusCode = 203;
    res.end("Admin NOT logged in");
  }
});

//Login admin
router.post("/admin", (req, res, next) => {
  //Using the passport local strategy login admn
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) {
      res.statusCode = 203;
      res.end("Username or password wrong");
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.statusCode = 200;
        res.end("Login Success");
      });
    }
  })(req, res, next);
});

//Logout user
router.get("/logout", (req, res, next) => {
  if (req.user) {
    req.logOut();
    res.statusCode = 200;
    res.end("User logged out succesfully");
  } else {
    res.statusCode = 203;
    res.end("Cannot logout. User not logged in!");
  }
});

//Get department lsit for teacher signup
router.get("/departments", async (req, res, next) => {
  let departments = await Department.find({});

  res.statusCode = 200;
  res.json(departments);
});

//return class information for Student signup
router.get("/getclasses", async (req, res, next) => {
  let classes = await Classes.find({});

  //Object with name of class as key and other data inside that key as object
  let responseObject = {};

  for (Class of classes) {
    responseObject[Class.name] = {};
    responseObject[Class.name].batches = [];

    //Getting other batches of the same class
    for (sameClass of classes) {
      if (sameClass.name == Class.name) {
        responseObject[Class.name].batches.push(sameClass.batch);
      }
    }
  }

  res.statusCode = 200;
  res.json(responseObject);
});

module.exports = router;
