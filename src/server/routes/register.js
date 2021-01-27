var express = require("express");
const bodyParser = require("body-parser");

let sendMail = require("../functions/sendMail");

let StudentSignup = require("../schema/student-signup");
let TeacherSignup = require("../schema/teacher-signup");

var router = express.Router();

router.use(bodyParser.json());

let generateOtp = () => {
  //Creating a random number for OTP
  //Minimum range of OTP
  let min = 100000;

  //Maximum range of the OTP
  let max = 999999;

  //Generate a random number between the specified range
  let otp = Math.floor(Math.random() * (max - min) + min);
  return otp;
};

let sendOtpMail = (otp, destination) => {
  //Subject For OTP Email
  let mailSubject = "OTP For Yuvashiksha Signup";

  //Body for OTP Email
  let mailBody = `An account signup was made with email: ${destination}.
Your OTP for the account signup is : ${otp}`;
  sendMail(destination, mailSubject, mailBody);
};

router
  .post("/", (req, res, next) => {
    let otp = generateOtp();

    if (req.body.accountType == "student") {
      StudentSignup.findOne({ admissionNumber: req.body.admissionNumber })
        .then((user) => {
          if (user) {
            let error = new Error("User already Exist.");
            next(error);
            res.end();
          } else {
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
                    "New user data added to StudentSignup collection : " +
                      student
                  );
                  sendOtpMail(otp, req.body.email);
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    admissionNumber: student.admissionNumber,
                    email: student.email,
                    accountType: req.body.accountType,
                  });
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          }
        })
        .catch((err) => {
          next(err);
        });
    } else if (req.body.accountType == "teacher") {
      TeacherSignup.findOne({ idNumber: req.body.idNumber })
        .then((user) => {
          if (user) {
            let error = new Error("User already Exist.");
            next(error);
          } else {
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
                    "New user data added to TeacherSignup collection : " +
                      teacher
                  );
                  sendOtpMail(otp, req.body.email);
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    idNumber: teacher.idNumber,
                    email: teacher.email,
                    accountType: req.body.accountType,
                  });
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          }
        })
        .catch((err) => {
          next(err);
        });
    } else {
      console.log(req);
      res.statusCode = 404;
      res.end("Invalid Account type");
    }
  })
  .post("/resendotp", (req, res, next) => {
    let otp = generateOtp();

    if (req.body.cookies.accountType == "student") {
      StudentSignup.findOneAndUpdate(
        {
          admissionNumber: req.body.cookies.admissionNumber,
          email: req.body.cookies.email,
        },
        { otp: otp }
      )
        .then((user) => {
          console.log("New OTP: ", user.otp);
          sendOtpMail(user.otp, user.email);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            admissionNumber: user.admissionNumber,
            email: user.email,
            accountType: req.body.cookies.accountType,
          });
        })
        .catch((err) => next(err));
    } else if (req.body.cookies.accountType == "teacher") {
      TeacherSignup.findOneAndUpdate(
        {
          idNumber: req.body.cookies.idNumber,
          email: req.body.cookies.email,
        },
        { otp: otp }
      )
        .then((user) => {
          console.log("New OTP: ", user.otp);
          sendOtpMail(user.otp, user.email);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            idNumber: user.idNumber,
            email: user.email,
            accountType: req.body.cookies.accountType,
          });
        })
        .catch((err) => next(err));
    } else {
      console.log(req);
      res.statusCode = 404;
      res.end("Cookie not found");
    }
  });

module.exports = router;
