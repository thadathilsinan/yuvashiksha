var express = require("express");
let passport = require("passport");
const bodyParser = require("body-parser");

let sendMail = require("../functions/sendMail");

let StudentSignup = require("../schema/student-signup");
let TeacherSignup = require("../schema/teacher-signup");
let Students = require("../schema/students");
let Teachers = require("../schema/teachers");
let Signin = require("../schema/signin");

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
  })
  .post("/otp", (req, res, next) => {
    if (req.body.cookies.accountType == "student") {
      StudentSignup.findOne({
        admissionNumber: req.body.cookies.admissionNumber,
        email: req.body.cookies.email,
      })
        .then((user) => {
          if (!user) {
            res.statusCode = 203;
            res.end(
              "No user found.\nCookies may be cleared from your browser.\nYou are required to restart the signup process."
            );
          }

          if (user.otp == req.body.otp) {
            console.log("OTP successfully verified");
            res.statusCode = 200;
            res.end("OTP successfully verified");
          } else {
            console.log("OTP is incorrect");
            res.statusCode = 203;
            res.end("OTP incorrect");
          }
        })
        .catch((err) => next(err));
    } else if (req.body.cookies.accountType == "teacher") {
      TeacherSignup.findOne({
        idNumber: req.body.cookies.idNumber,
        email: req.body.cookies.email,
      })
        .then((user) => {
          if (!user) {
            res.statusCode = 203;
            res.end(
              "No user found.\nCookies may be cleared from your browser.\nYou are required to restart the signup process."
            );
          }

          if (user.otp == req.body.otp) {
            console.log("OTP successfully verified");
            res.statusCode = 200;
            res.end("OTP successfully verified");
          } else {
            console.log("OTP is incorrect");
            res.statusCode = 203;
            res.end("OTP incorrect");
          }
        })
        .catch((err) => next(err));
    } else {
      console.log(req);
      res.statusCode = 404;
      res.end("Cookie not found");
    }
  })
  .post("/finish", (req, res, next) => {
    if (req.body.cookies.accountType == "student") {
      StudentSignup.findOneAndUpdate(
        {
          admissionNumber: req.body.cookies.admissionNumber,
          email: req.body.cookies.email,
        },
        {
          password: req.body.password,
        }
      )
        .then((user) => {
          if (!user) {
            res.statusCode = 203;
            res.end(
              "No user found.\nCookies may be cleared from your browser.\nYou are required to restart the signup process."
            );
          } else {
            Students.create({
              username: user.email,
              name: user.name,
              admissionNumber: user.admissionNumber,
              class: user.class,
              batch: user.batch,
              email: user.email,
              parentEmail: user.parentEmail,
            })
              .then((newUser) => {
                Signin.create({
                  username: newUser.username,
                  password: req.body.password,
                  accountType: "student",
                  active: false,
                })
                  .then((newStudent) => {
                    console.log(
                      "Added new Student account into Students and Signin DB"
                    );

                    res.statusCode = 200;
                    res.end("Signup Successful");
                  })
                  .catch((err) => {
                    console.log("Error IN SIGIN");
                    next(err);
                  });
              })
              .catch((err) => {
                console.log("ERROR IN STUDENTS");
                next(err);
              });
          }
        })
        .catch((err) => {
          console.log("ERROR IN STUDENT SIGNUP");
          next(err);
        });
    } else if (req.body.cookies.accountType == "teacher") {
      TeacherSignup.findOneAndUpdate(
        {
          idNumber: req.body.cookies.idNumber,
          email: req.body.cookies.email,
        },
        { password: req.body.password }
      )
        .then((user) => {
          if (!user) {
            res.statusCode = 203;
            res.end(
              "No user found.\nCookies may be cleared from your browser.\nYou are required to restart the signup process."
            );
          } else {
            Teachers.create({
              username: user.email,
              mentor: null,
              hod: null,
              name: user.name,
              idNumber: user.idNumber,
              email: user.email,
              department: user.department,
            })
              .then((newTeacher) => {
                Signin.create({
                  username: newTeacher.username,
                  password: req.body.password,
                  accountType: "teacher",
                  active: false,
                })
                  .then((newTeacher) => {
                    console.log(
                      "Added new Teacher account into Teachers   and Signin DB"
                    );

                    res.statusCode = 200;
                    res.end("Signup Successful");
                  })
                  .catch((err) => next(err));
              })
              .catch((err) => next(err));
          }
        })
        .catch((err) => next(err));
    } else {
      console.log(req);
      res.statusCode = 404;
      res.end("Cookie not found");
    }
  });

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/redirect",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    res.header("Set-Cokkie", "googleUser=true");
    res.header(
      "Set-Cookie",
      "googleUserData=" + JSON.stringify(req.user._json)
    );
    res.redirect("http://localhost:3000/signup");
  }
);

module.exports = router;
