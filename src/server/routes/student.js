/**
 * ROUTER FOR /student
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
const Answers = require("../schema/Answers");
const Image = require("../schema/Images");

// router.use(bodyParser.json());

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

//return the exams related to the particular student
router.get("/exams", async (req, res, next) => {
  let exams = await Exams.find({ Class: req.user.class });

  res.statusCode = 200;
  res.json(exams);
});

//Save the answers to the db
router.post("/saveanswers", async (req, res, next) => {
  let answer = await Answers.findOne({
    exam: req.body.exam,
    student: req.user._id,
  });

  //Check if entry already exist
  if (answer) {
    //Updating the values
    answer.answers = req.body.answers;
    answer.completed = req.body.completed;

    //save changes
    await answer.save();
  } else {
    //Creating a new entry
    answer = new Answers({
      exam: req.body.exam,
      student: req.user._id,
      answers: req.body.answers,
      images: [],
      completed: req.body.completed,
    });

    //Saving changes
    await answer.save();
  }

  res.statusCode = 200;
  res.end("Answers updated successfully");
});

//Save the images to the db
router.post("/uploadimage", async (req, res, next) => {
  let answer = await Answers.findOne({
    exam: req.body.exam,
    student: req.user._id,
  });

  //Check if entry already exist
  if (answer) {
    //Updating the values
    let image = new Image({ image: req.body.image });

    //Saving image
    await image.save();

    answer.images.push(image._id);

    //save changes
    await answer.save();
  } else {
    //Creating a new entry
    answer = new Answers({
      exam: req.body.exam,
      student: req.user._id,
      answers: {},
      images: [req.body.image],
      completed: false,
    });

    //Saving changes
    await answer.save();
  }

  res.statusCode = 200;
  res.end("Image uploaded successfully");
});

//Restore the exam data
router.post("/restoreexam", async (req, res, next) => {
  let answer = await Answers.findOne({
    exam: req.body.exam,
    student: req.user._id,
  });

  if (answer) {
    res.statusCode = 200;
    res.json({
      exam: answer.exam,
      answers: answer.answers,
      images: [],
      completed: answer.completed,
    });
  } else {
    res.statusCode = 203;
    res.end("No data available to restore exam");
  }
});

//Check if the student already completed the exam
router.post("/checkcompleted", async (req, res, next) => {
  let answer = await Answers.findOne({
    exam: req.body.exam,
    student: req.user._id,
  });

  if (answer && answer.completed) {
    res.statusCode = 203;
    res.end("Exam already completed");
  } else {
    res.statusCode = 200;
    res.end("Exam completeness check finished");
  }
});

module.exports = router;
