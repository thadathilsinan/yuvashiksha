/**
 * ROUTER FOR /teacher
 *
 */

var express = require("express");
const bodyParser = require("body-parser");

var router = express.Router();

const bcrypt = require("bcryptjs");

//Importing required mongoose models
const Users = require("../schema/Users");
const Exams = require("../schema/Exams");
const Classes = require("../schema/classes");

router.use(bodyParser.json());

//Save user profile
router.post("/profile/save", async (req, res, next) => {
  let user = await Users.findOne({ _id: req.user._id });

  if (user) {
    if (!user.googleId && req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.body.email != user.email) {
      user.email = req.body.email;
    }

    //Saving changes to the db
    await user.save();

    res.statusCode = 200;
    res.end("Accound data saved successfully");
  } else {
    res.statusCode = 203;
    res.end("User account not found");
  }
});

//Create a new exam
router.post("/newexam", async (req, res, next) => {
  let exam = new Exams();

  exam.examName = req.body.examName;
  exam.subject = req.body.subject;
  exam.from = req.body.timeFrom;
  exam.to = req.body.timeTo;
  exam.date = req.body.date;
  exam.totalMarks = req.body.marks;
  exam.questionPaper = req.body.questions;
  exam.teacher = req.user.id;

  //Setting class data
  let Class = await Classes.findOne({
    name: req.body.Class,
    batch: req.body.batch,
  });

  if (Class) {
    exam.Class = Class._id;

    //Saving new Exam
    await exam.save();

    res.statusCode = 200;
    res.end("Exam successfully created");
  } else {
    res.statusCode = 203;
    res.end("Class data is not found");
  }
});

//Return exam data
router.post("/getexams", async (req, res, next) => {
  let exams = await Exams.find({});

  let responseObject = [];

  for (let e of exams) {
    let exam = { ...e };

    let Class = await Classes.findOne({ _id: e.Class });

    if (Class) {
      exam.Class = Class.name;
      exam.batch = Class.batch;
    } else {
      res.statusCode = 203;
      res.end("Error: Class not found");
      return;
    }
    responseObject.push(exam);
  }

  res.statusCode = 200;
  res.json(responseObject);
});

//return class information for Teacher Home page
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
