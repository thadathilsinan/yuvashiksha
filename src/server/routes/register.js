/**
 * EXPRESS ROUTER FOR /register
 *
 */

var express = require("express");
let passport = require("passport");
const bodyParser = require("body-parser");

//Helper function for sending emails
let sendMail = require("../functions/sendMail");

//Importing required Mongoose Models
let Users = require("../schema/Users");
let Otp = require("../schema/Otp");

var router = express.Router();

router.use(bodyParser.json());

//Function for generating a random otp and return it
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

//Funtion to send email to the user with OTP
let sendOtpMail = (otp, destination) => {
  //Subject For OTP Email
  let mailSubject = "OTP For Yuvashiksha Signup";

  //Body for OTP Email
  let mailBody = `An account signup was made with email: ${destination}.
Your OTP for the account signup is : ${otp}`;
  sendMail(destination, mailSubject, mailBody);
};

router.post("/", (req, res, next) => {
  /**
   * ROUTE FOR:
   * When user click 'Verify Email' Button in client side (FIRST STEP IN USER REGISTRATION)
   */

  Users.findOne({ registerNumber: req.body.registerNumber })
    .then((user) => {
      if (user) {
        //User with same register number already exists
        res.statusCode = 203;
        res.end("User with the register number already exist");
      }

      //Creating a new user
      let newUser = new Users({
        accountType: req.body.accountType,
        accountStatus: "signup-incomplete",
        name: req.body.name,
        email: req.body.email,
        registerNumber: req.body.registerNumber,
      });

      //Checking user type and add neccessary data to the new User object
      if (req.body.accountType == "student") {
        newUser.class = req.body.class;
        newUser.parentEmail = req.body.parentEmail;
      } else if (req.body.accountType == "teacher") {
        newUser.department = req.body.department;
      }

      //Saving the new user into the database
      newUser
        .save()
        .then(async (user) => {
          //Generating OTP for the user
          let otp = generateOtp();

          //Creating an expiry date for the new OTp
          let expiryDate = new Date();
          expiryDate.setMinutes(expiryDate.getMinutes() + 15);

          //Creating a new document in the OTP collection
          let newOtp = new Otp({
            userId: user._id,
            otp: otp,
            expiry: expiryDate,
          });

          //Saving newOtp into the OTP collection
          await newOtp.save().catch((err) => next(err));

          //All steps in the STEP 1 of REGISTRATION IS COMPLETED SUCCESSFULLY
          console.log(
            "New User account added to database",
            "REGISTER ACCOUNT STEP 1 COMPLETED"
          );

          //Sending Email with otp to the user
          sendOtpMail(otp, user.email);

          res.statusCode = 200;
          res.end("Registration part 1 completed");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

/**
 * ROUTE TO RESEND OTP FOR THE USER
 */
router.post("/resendotp", (req, res, next) => {
  Otp.findOne({ userId: req.body.userId })
    .then(async (otp) => {
      if (otp) {
        //Generating OTP for the user
        let newOtp = generateOtp();

        //Creating an expiry date for the new OTp
        let expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 15);

        //Setting new otp and expiry date
        otp.otp = newOtp;
        otp.expiry = expiryDate;

        //Saving the changes to the db
        await otp.save().catch((err) => next(err));

        //Sending email to the user with new otp
        await Users.findOne({ _id: req.body.userId })
          .then((user) => {
            sendOtpMail(newOtp, user.email);
          })
          .catch((err) => next(err));

        res.statusCode = 200;
        res.end("OTP resend successfully");
      } else {
        res.statusCode = 203;
        res.end("User account does not exists, Cannot resend OTP");
      }
    })
    .catch((err) => next(err));
});

/**
 * ROUTE FOR VERIFYING OTP FOR VERIFIYING USER EMAIL
 * PART 2 OF REGISTRATION OF NEW ACCOUNT
 */
router.post("/otp", (req, res, next) => {
  Otp.findOne({ userId: req.body.userId }).then((otp) => {
    if (otp) {
      //OTP Verification
      if (otp.otp == req.body.otp) {
        res.statusCode = 200;
        res.end("OTP Verified successfully");
      } else {
        res.statusCode = 203;
        res.end("OTP is incorrect");
      }
    } else {
      res.statusCode = 203;
      res.end("User account not found");
    }
  });
});

/**
 * FINAL PART OF THE USER ACCOUNT REGISTERATION
 * setting the password the user account
 */
router.post("/finish", (req, res, next) => {
  Users.findOne({ _id: req.body.userId })
    .then(async (user) => {
      if (user) {
        //Setting the password for the user and changing accountStatus
        user.password = req.body.password;
        user.accountStatus = "not-activated";

        //Saving changes to the db
        await user.save().catch((err) => nativeTouchData(err));

        res.statusCode = 200;
        res.end("User registration completed");
      } else {
        res.statusCode = 203;
        res.end("User account not found");
      }
    })
    .catch((err) => next(err));
});

/**
 * ROUTE FOR GOOGLE SIGNIN/SIGNINUP
 * THIS WILL BE REDIRECTED TO GOOGLE'S SERVER PAGE TO ENTER GOOGLE USER CREDENTIALS
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * This route is automatically called after the user successfully login to google
 */
router.get(
  "/redirect",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    //Checking if user account already exists with this google user
    Users.findOne({ googleId: req.user._json.sub })
      .then((user) => {
        if (user) {
          if (user.accountType == "student")
            res.redirect("http://localhost:3000/student");
          else if (user.accountType == "teacher")
            res.redirect("http://localhost:3000/teacher");
        } else {
          //Continue to google user signup page
          res.redirect(
            `http://localhost:3000/signup/google?name=${req.user._json.name}&id=${req.user._json.sub}&email=${req.user._json.email}`
          );
        }
      })
      .catch((err) => next(err));
  }
);

/**
 * GOOGLE VERIFED ACCOUNT SIGNUP PROCEDURE
 */
router.post("/googlesignup", async (req, res, next) => {
  await Users.findOne({ registerNumber: req.body.registerNumber }).then(
    (user) => {
      if (user) {
        res.statusCode = 203;
        res.end("User already exist with same register number");
      }
    }
  );

  let newUser = new Users({
    accountType: req.body.accountType,
    accountStatus: "not-activated",
    name: req.body.name,
    email: req.body.email,
    registerNumber: req.body.registerNumber,
    googleId: req.body.googleId,
  });

  //Checking user type and add neccessary data to the new User object
  if (req.body.accountType == "student") {
    newUser.class = req.body.class;
    newUser.parentEmail = req.body.parentEmail;
  } else if (req.body.accountType == "teacher") {
    newUser.department = req.body.department;
  }

  //Saving new user to the db
  await newUser.save().catch((err) => next(err));

  res.statusCode = 200;
  res.end("User registration completed.");
});

module.exports = router;
