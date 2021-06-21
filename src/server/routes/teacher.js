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
const Answers = require("../schema/Answers");
const Images = require("../schema/Images");

//Helper function for sending emails
let sendMail = require("../functions/sendMail");

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
  //Setting class data
  let Class = await Classes.findOne({
    name: req.body.Class,
    batch: req.body.batch,
  });

  //check if exam exists for that time
  let otherExams = await Exams.find({
    Class,
    date: req.body.date,
  });

  let newExamStartTime = new Date(
    `${req.body.date},${req.body.timeFrom}`
  ).getTime();
  let newExamEndTime = new Date(
    `${req.body.date},${req.body.timeTo}`
  ).getTime();

  let errorFlag = false;

  for (let exam of otherExams) {
    let examStartTime = new Date(`${exam.date},${exam.from}`).getTime();
    let examEndTime = new Date(`${exam.date},${exam.to}`).getTime();

    if (
      (newExamStartTime >= examStartTime && newExamStartTime <= examEndTime) ||
      (newExamEndTime >= examStartTime && newExamEndTime <= examEndTime)
    ) {
      errorFlag = true;
    }
  }

  if (!errorFlag) {
    let exam = new Exams();

    exam.examName = req.body.examName;
    exam.subject = req.body.subject;
    exam.from = req.body.timeFrom;
    exam.to = req.body.timeTo;
    exam.date = req.body.date;
    exam.totalMarks = req.body.marks;
    exam.questionPaper = req.body.questions;
    exam.teacher = req.user.id;

    if (Class) {
      exam.Class = Class._id;

      //Saving new Exam
      await exam.save();

      //Email send
      let students = await Users.find({ class: exam.Class });
      let subject = "Exam scheduled";

      for (let student of students) {
        let body = `Dear ${student.name},
         Your ${exam.subject}  ${exam.examName} has been scheduled on ${exam.date} from ${exam.from} to ${exam.to},
          Be prepared for your exam ! All  the very best ${student.name}`;
        sendMail(student.email, subject, body);
      }

      res.statusCode = 200;
      res.end("Exam successfully created");
    } else {
      res.statusCode = 203;
      res.end("Class data is not found");
    }
  } else {
    res.statusCode = 203;
    res.end("Another teacher had scheduled an exam in this time period");
  }
});

//Edit an existing exam data
router.post("/editexam", async (req, res, next) => {
  //Setting class data
  let Class = await Classes.findOne({
    name: req.body.Class,
    batch: req.body.batch,
  });

  //check if exam exists for that time
  let otherExams = await Exams.find({
    Class,
    date: req.body.date,
  });

  let newExamStartTime = new Date(
    `${req.body.date},${req.body.timeFrom}`
  ).getTime();
  let newExamEndTime = new Date(
    `${req.body.date},${req.body.timeTo}`
  ).getTime();

  let errorFlag = false;

  for (let exam of otherExams) {
    let examStartTime = new Date(`${exam.date},${exam.from}`).getTime();
    let examEndTime = new Date(`${exam.date},${exam.to}`).getTime();

    if (
      (newExamStartTime >= examStartTime && newExamStartTime <= examEndTime) ||
      (newExamEndTime >= examStartTime && newExamEndTime <= examEndTime)
    ) {
      errorFlag = true;
    }
  }

  if (!errorFlag) {
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

      if (Class) {
        exam.Class = Class._id;

        //Saving new Exam
        await exam.save();

        //Email send
        let students = await Users.find({ class: exam.Class });
        let subject = "Exam rescheduled";

        for (let student of students) {
          let body = `Dear ${student.name},
              Your ${exam.subject}  ${exam.examName} has been rescheduled to ${exam.date} from ${exam.from} to ${exam.to},
              Be prepared for your exam ! All  the very best ${student.name}`;
          sendMail(student.email, subject, body);
        }

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
  } else {
    res.statusCode = 203;
    res.end("Another teacher had scheduled an exam in this time period");
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

//return the list of students for account verification by the mentor
router.get("/profile/verifystudents", async (req, res, next) => {
  let responseObject = [];

  //getting the class of the mentor
  let mentorClass = await Classes.findOne({ mentor: req.user._id });

  let students = await Users.find({
    accountStatus: "not-activated",
    accountType: "student",
    class: mentorClass._id,
  });

  //Parsing class and batch  name from class id
  for (let student of students) {
    let Class = await Classes.findOne({
      _id: student.class,
    });

    if (!Class) break;

    responseObject.push({
      name: student.name,
      id: student._id,
      email: student.email,
      parentEmail: student.parentEmail,
      registerNumber: student.registerNumber,
      accountStatus: student.accountStatus,
      Class: Class.name,
      batch: Class.batch,
    });
  }
  res.statusCode = 200;
  res.json(responseObject);
});

//Accept a student account
router.post("/profile/verifystudents/accept", async (req, res, next) => {
  let student = await Users.findOne({ _id: req.body.userId });

  let body = "";
  let subject = "Yuvashiksha Account verified";
  //Change the account status
  student.accountStatus = "ok";
  await student.save();
  //send the mailBody
  body = `Dear ${student.name},
  Your Account has been verified successfully by teacher`;
  sendMail(student.email, subject, body);
  res.statusCode = 200;
  res.end("Account verified successfully");
});

//reject a student account
router.post("/profile/verifystudents/reject", async (req, res, next) => {
  let student = await Users.findOne({ _id: req.body.userId });
  let body = "";
  let subject = "Yuvashiksha Account has been rejected";
  //Change the account status
  student.accountStatus = "rejected";
  await student.save();
  //send the mailBody
  body = `Dear ${student.name},
  Your Account has been reject  by teacher `;
  sendMail(student.email, subject, body);
  res.statusCode = 200;
  res.end("Account rejected successfully");
});

//Return the list of students attended the exam
router.post("/previousexam/getstudents", async (req, res, next) => {
  let responseObject = [];
  let answers = await Answers.find({ exam: req.body.exam });

  for (let answer of answers) {
    let student = await Users.findOne({ _id: answer.student });
    let mark = "Not Evaluated";

    if (answer.totalMarks) {
      mark = answer.totalMarks;
    }

    responseObject.push({
      id: student._id,
      name: student.name,
      registerNumber: student.registerNumber,
      marks: mark,
    });
  }

  res.statusCode = 200;
  res.json(responseObject);
});

//Return the answers of exam for evaluation
router.post("/previousexam/evaluate/getanswers", async (req, res, next) => {
  let answer = await Answers.findOne({
    exam: req.body.exam,
    student: req.body.student,
  });

  res.statusCode = 200;
  res.json(answer);
});

//Return the images from the images collection
router.post("/previousexam/evaluate/getimages", async (req, res, next) => {
  let images = [];

  for (let image of req.body.images) {
    let img = await Images.findOne({ _id: image });
    images.push(img.image);
  }

  res.statusCode = 200;
  res.json(images);
});

router.post("/previousexam/evaluate/savemarks", async (req, res, next) => {
  //getting the document for saving new data
  let answer = await Answers.findOne({ _id: req.body.id });

  if (answer) {
    answer.answers = req.body.answers;
    answer.totalMarks = req.body.total;

    await answer.save();

    res.statusCode = 200;
    res.end("Marks saved successfully");
  } else {
    res.statusCode = 203;
    res.end("Answer document not found");
  }
});

//Publish exam result
router.post("/previousexam/publish", async (req, res, next) => {
  let answers = await Answers.find({ exam: req.body.exam });
  let exam = await Exams.findOne({ _id: req.body.exam });
  let subject = "Yuvashiksha Exam Result";
  let body = "";
  let bodyParent = "";

  for (let answer of answers) {
    let student = await Users.findOne({ _id: answer.student });

    if (!isNaN(parseInt(answer.totalMarks))) {
      bodyParent = `Dear parent of ${student.name}, 
      Your ward  ${student.name}'s exam result for the ${exam.subject} subject of your ${exam.examName} is published.
      Your total marks in the exam is: ${answer.totalMarks} / ${exam.totalMarks}. `;

      body = `Dear ${student.name},
    The result for the ${exam.subject} subject of your ${exam.examName} is published.
    Your total marks in the exam is: ${answer.totalMarks} / ${exam.totalMarks}.`;
    } else {
      bodyParent = `Dear parent of ${student.name}, 
      Your ward  ${student.name}'s exam result for the ${exam.subject} subject of  ${exam.examName} is published.
      Unfortunately teacher did not evaluated your answer paper. 
      Please contact teacher for more info `;
      body = `Dear ${student.name},
      The result for the ${exam.subject} subject of  ${exam.examName} is published.
      Unfortunately your teacher did not evaluated your answer paper. 
      Please contact your teacher for more info `;
    }

    sendMail(student.email, subject, body);
    sendMail(student.parentEmail, subject, bodyParent);
  }

  res.statusCode = 200;
  res.end("Result published successfully");
});

//Print the exam result
router.post("/previousexam/print", async (req, res, next) => {
  let answers = await Answers.find({ exam: req.body.exam });
  let exam = await Exams.findOne({ _id: req.body.exam });

  let teacher = await Users.findOne({ _id: exam.teacher });
  let Class = await Classes.findOne({ _id: exam.Class });

  let examData = {
    "EXAM NAME": `${exam.examName}`,
    SUBJECT: `${exam.subject}`,
    TEACHER: `${teacher.name} (${teacher.registerNumber})`,
    CLASS: `${Class.name} (${Class.batch})`,
    DATE: `${exam.date}`,
    TIME: `${exam.from} - ${exam.to}`,
    "TOTAL MARKS": `${exam.totalMarks}`,
  };

  let studentData = {};

  for (let i in answers) {
    let student = await Users.findOne({ _id: answers[i].student });

    studentData[student.registerNumber] = {
      name: student.name,
      email: student.email,
      marks: answers[i].totalMarks,
    };
  }

  res.statusCode = 200;
  res.json({ examData, studentData });
});

module.exports = router;
