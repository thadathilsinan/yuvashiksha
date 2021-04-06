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
    answer.images = req.body.images;
    answer.completed = req.body.completed;

    //save changes
    await answer.save();
  } else {
    //Creating a new entry
    answer = new Answers({
      exam: req.body.exam,
      student: req.user._id,
      asnwers: req.body.answers,
      images: req.body.images,
      completed: req.body.completed,
    });

    //Saving changes
    await answer.save();
  }

  res.statusCode = 200;
  res.end("Answers updated successfully");
});

module.exports = router;
