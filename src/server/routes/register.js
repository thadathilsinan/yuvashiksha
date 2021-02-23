/* eslint-disable no-undef */
/**
 * EXPRESS ROUTER FOR /register
 *
 */

var express = require("express");
let passport = require("passport");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

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

//--------------------------------------ROUTES-----------------------------------------------------------------------------------

router.post("/", async (req, res, next) => {
  /**
   * ROUTE FOR:
   * When user click 'Verify Email' Button in client side (FIRST STEP IN USER REGISTRATION)
   */

  let oldUser = await Users.findOne({
    registerNumber: req.body.registerNumber,
  });

  if (oldUser && oldUser.accountStatus != "signup-incomplete") {
    //User with same register number already exists
    res.statusCode = 203;
    return res.end("User with the register number already exist");
  }

  //Creating a new user
  let newUser = {
    accountType: req.body.accountType,
    accountStatus: "signup-incomplete",
    name: req.body.name,
    email: req.body.email,
    registerNumber: req.body.registerNumber,
  };

  //Checking user type and add neccessary data to the new User object
  if (req.body.accountType === "student") {
    newUser.class = req.body.class;
    newUser.parentEmail = req.body.parentEmail;
  } else if (req.body.accountType === "teacher") {
    newUser.department = req.body.department;
  }

  //Saving cahnges to the Users collection
  await Users.findOneAndUpdate(
    { registerNumber: req.body.registerNumber },
    newUser,
    { upsert: true } //Create a document if not found
  ).catch((err) => next(err));

  await Users.findOne({ registerNumber: req.body.registerNumber }).then(
    (user) => {
      newUser = user;
    }
  );

  //Generating OTP for the user
  let otp = generateOtp();

  //Creating an expiry date for the new OTp
  let expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 15);

  //Creating a new document in the OTP collection
  let newOtp = {
    userId: newUser._id,
    otp: otp,
    expiry: expiryDate,
  };

  //Upsert the otp to the Otp collection
  await Otp.findOneAndUpdate({ userId: newUser._id }, newOtp, {
    upsert: true,
  }).catch((err) => next(err));

  //All steps in the STEP 1 of REGISTRATION IS COMPLETED SUCCESSFULLY
  console.log(
    "New User account added to database",
    "REGISTER ACCOUNT STEP 1 COMPLETED"
  );

  //Sending Email with otp to the user
  sendOtpMail(otp, newUser.email);

  res.cookie("userId", newUser._id, {
    maxAge: 86400000,
  });
  res.statusCode = 200;
  res.end("Registration part 1 completed");
});

/**
 * ROUTE TO RESEND OTP FOR THE USER
 */
router.post("/resendotp", async (req, res, next) => {
  let otp = await Otp.findOne({ userId: req.cookies.userId });
  // .then(async (otp) => {
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
    let user = await Users.findOne({ _id: req.cookies.userId });
    sendOtpMail(newOtp, user.email);

    res.statusCode = 200;
    res.send("OTP resend successfully");
  } else {
    res.statusCode = 203;
    res.end("User account does not exists, Cannot resend OTP");
  }
  // })
  // .catch((err) => next(err));
});

/**
 * ROUTE FOR VERIFYING OTP FOR VERIFIYING USER EMAIL
 * PART 2 OF REGISTRATION OF NEW ACCOUNT
 */
router.post("/otp", async (req, res, next) => {
  let otp = await Otp.findOne({ userId: req.cookies.userId });

  if (otp) {
    //Current time
    let currentTime = new Date();
    //OTP Verification
    if (otp.otp === parseInt(req.body.otp))
      if (otp.expiry.getTime() > currentTime.getTime()) {
        res.statusCode = 200;
        res.end("OTP Verified successfully");
      } else {
        res.statusCode = 203;
        res.end("OTP is expired");
      }
    else {
      res.statusCode = 203;
      res.end("OTP is incorrect");
    }
  } else {
    res.statusCode = 203;
    res.end("User account not found");
  }
});

/**
 * FINAL PART OF THE USER ACCOUNT REGISTERATION
 * setting the password the user account
 */
router.post("/finish", async (req, res, next) => {
  let user = await Users.findOne({ _id: req.cookies.userId });
  // .then(async (user) => {
  if (user) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Setting the password for the user and changing accountStatus
    user.password = hashedPassword;
    user.accountStatus = "not-activated";

    //Saving changes to the db
    await user.save().catch((err) => next(err));

    res.statusCode = 200;
    res.end("User registration completed");
  } else {
    res.statusCode = 203;
    res.end("User account not found");
  }
});

/**
 * ROUTE FOR GOOGLE SIGNIN/SIGNINUP
 * THIS WILL BE REDIRECTED TO GOOGLE'S SERVER PAGE TO ENTER GOOGLE USER CREDENTIALS
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/redirect", function (req, res, next) {
  passport.authenticate("google", function (err, user, info) {
    //Handling the authentication using custom callback

    //Check if error occured
    if (err) {
      return next(err);
    }

    //Check if user not authenticated
    if (!user) {
      //User not authenticated
      //Redirecting to the signup page with retrieved google data
      return res.redirect(
        `http://localhost:3000/signup/google?name=${info._json.name}&id=${info._json.sub}&email=${info._json.email}`
      );
    }

    //User authenticated successfully
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      //Based on accountType redirecting the users to corresponding page
      if (req.user.accountType === "student")
        return res.redirect("http://localhost:3000/student");
      else if (req.user.accountType === "teacher")
        return res.redirect("http://localhost:3000/teacher");
    });
  })(req, res, next);
});

/**
 * GOOGLE VERIFED ACCOUNT SIGNUP PROCEDURE
 */
router.post("/googlesignup", async (req, res, next) => {
  let oldUser = await Users.findOne({
    registerNumber: req.body.registerNumber,
  });

  //Check if user already exist with same registerNumber
  if (oldUser) {
    res.statusCode = 203;
    res.end("User already exist with same register number");
  }

  let newUser = new Users({
    accountType: req.body.accountType,
    accountStatus: "not-activated",
    name: req.body.name,
    email: req.body.email,
    registerNumber: req.body.registerNumber,
    googleId: req.body.googleId,
  });

  //Checking user type and add neccessary data to the new User object
  if (req.body.accountType === "student") {
    newUser.class = req.body.class;
    newUser.parentEmail = req.body.parentEmail;
  } else if (req.body.accountType === "teacher") {
    newUser.department = req.body.department;
  }

  //Saving new user to the db
  await newUser.save().catch((err) => next(err));

  res.statusCode = 200;
  res.clearCookie("user-session");
  res.end("User registration completed.");
});

module.exports = router;
