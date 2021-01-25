var express = require("express");
const bodyParser = require("body-parser");

let sendMail = require("../functions/sendMail");

let StudentSignup = require("../schema/student-signup");
let TeacherSignup = require("../schema/teacher-signup");

var router = express.Router();

router.use(bodyParser.json());

router.post("/", (req, res, next) => {
  //Creating a random number for OTP
  //Minimum range of OTP
  let min = 100000;

  //Maximum range of the OTP
  let max = 999999;

  //Generate a random number between the specified range
  let otp = Math.floor(Math.random() * (max - min) + min);

  //Subject For OTP Email
  let mailSubject = "OTP For Yuvashiksha Signup";

  //Body for OTP Email
  let mailBody = `An account signup was made with email: ${req.body.email}.
  Your OTP for the account signup is : ${otp}`;

  if (req.body.accountType == "student") {
    StudentSignup.create({
      name: req.body.name,
      admissionNumber: req.body.admissionNumber,
      class: req.body.class,
      batch: req.body.batch,
      email: req.body.email,
      parentEmail: req.body.parentEmail,
      otp: otp,
      password: null,
      googleSignup: null,
    })
      .then(
        (student) => {
          console.log(
            "New user data added to StudentSignup collection : " + student
          );
          sendMail(req.body.email, mailSubject, mailBody);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(student);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  } else if (req.body.accountType == "teacher") {
    TeacherSignup.create({
      name: req.body.name,
      idNumber: req.body.idNumber,
      email: req.body.email,
      department: req.body.department,
      otp: otp,
      password: null,
      googleSignup: null,
    })
      .then(
        (teacher) => {
          console.log(
            "New user data added to TeacherSignup collection : " + teacher
          );
          sendMail(req.body.email, mailSubject, mailBody);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(teacher);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
});

module.exports = router;
