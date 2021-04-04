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
const Departments = require("../schema/department");
const { response } = require("express");

router.use(bodyParser.json());

//Save user profile
router.post("/profile/save", async (req, res, next) => {
  let user = await Users.findOne({ _id: req.user._id });

  if (user) {
    if (!user.googleId && req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    //Saving changes to the db
    await user.save();

    res.statusCode = 200;
    res.end("Password changed successfully");
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

//Edit an existing exam data
router.post("/editexam", async (req, res, next) => {
  let exam = await Exams.findOne({ _id: req.body.id });

  if (exam) {
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
      res.end("Exam successfully edited");
    } else {
      res.statusCode = 203;
      res.end("Class data is not found");
    }
  } else {
    res.statusCode = 203;
    res.end("Old Exam data is not found");
  }
});

//Return exam data
router.post("/getexams", async (req, res, next) => {
  //Find the class to which the exam data need to be extracted
  let Class = await Classes.findOne({
    department: req.user.department,
    name: req.body.Class,
    batch: req.body.batch,
  });

  let exams = await Exams.find({ Class, teacher: req.user._id });

  res.statusCode = 200;
  res.json(exams);
});

//Return exam data of particular teacher
router.post("/getexams/hod", async (req, res, next) => {
  //Find the class to which the exam data need to be extracted
  let Class = await Classes.findOne({
    name: req.body.Class,
    batch: req.body.batch,
  });

  let exams = await Exams.find({ Class, teacher: req.body.teacher });
  res.statusCode = 200;
  res.json(exams);
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

//Remove an existing exam
router.post("/removeexam", async (req, res, next) => {
  let exam = await Exams.findOneAndRemove({ _id: req.body.id });
  res.statusCode = 200;
  res.end("Exam removed successfully");
});

//Return teachers list who have exams in that department
router.get("/hod", async (req, res, next) => {
  let responseObject = {};
  let allExams = await Exams.find({});

  if (allExams.length <= 0) {
    res.statusCode = 200;
    res.end("Exams list is empty");
    return;
  }

  for (exam of allExams) {
    let Class = await Classes.findOne({ _id: exam.Class });
    let department = await Departments.findOne({ _id: Class.department });

    //Checking if the exam is conducted in the HOD's department
    if (String(department._id) == String(req.user.department)) {
      let teacher = await Users.findOne({ _id: exam.teacher });

      responseObject[teacher._id] = { name: teacher.name };
    }
  }

  res.statusCode = 200;
  res.json(responseObject);
});

//Return teachers list who have exams in that class of the mentor
router.get("/mentor", async (req, res, next) => {
  let responseObject = {};
  let allExams = await Exams.find({});

  if (allExams.length <= 0) {
    res.statusCode = 200;
    res.end("Exams list is empty");
    return;
  }

  //Mentor's class
  let mentorClass = await Classes.findOne({ mentor: req.user._id });

  if (!mentorClass) {
    res.statusCode = 203;
    res.end("Requested user is not a mentor");
    return;
  }

  for (exam of allExams) {
    let Class = await Classes.findOne({ _id: exam.Class });

    //Checking if the exam is conducted in the HOD's department
    if (String(Class._id) == String(mentorClass._id)) {
      let teacher = await Users.findOne({ _id: exam.teacher });

      responseObject[teacher._id] = { name: teacher.name };
    }
  }

  res.statusCode = 200;
  res.json(responseObject);
});

module.exports = router;
