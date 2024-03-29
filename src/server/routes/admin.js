var express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs");
//Importing required schemas

const Department = require("../schema/department");
const Users = require("../schema/Users");
const Classes = require("../schema/classes");
const BugReports = require("../schema/BugReport");
const Answers = require("../schema/Answers");

const mongoose = require("mongoose");

const sendMail = require("../functions/sendMail");
const Exam = require("../schema/Exams");
const { adminPassword, password } = require("../config");

var router = express.Router();

router.use(bodyParser.json());

//Change password of admin account
router.post("/changepassword", async (req, res, next) => {
  if (!/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]/.test(req.body.password)) {
    let configData = fs.readFileSync("./config.js", "utf-8");

    let newConfig = configData.replace(
      /adminPassword:\s\"[a-zA-Z0-9.@!#$%&'*+/=?^_`{|}~-]+\"\,/i,
      `adminPassword: "${req.body.password}",`
    );

    fs.writeFileSync("./config.js", newConfig);

    let checkNewConfig = fs.readFileSync("./config.js", "utf-8");
    if (checkNewConfig == configData) {
      res.statusCode = 203;
      res.end("Password not changed same password ");
    } else {
      res.statusCode = 200;
      res.end(newConfig);
    }
  } else {
    res.statusCode = 203;
    res.end("Only these charcters are allowoed a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-");
  }

  // res.end("Password Changed succesfully");
});

//Return department details from DB
router.get("/institutionstructure/department", async (req, res, next) => {
  let departments = await Department.find({});

  //response to front end
  let responseObject = {};

  for (let department of departments) {
    let headOfDept = null;

    responseObject[department.name] = {};

    //Setting id of department
    responseObject[department.name].id = department._id;

    //Setting HOD
    if (department.hod) {
      //HOD already assigned

      //Getting hod data
      headOfDept = await Users.findOne({
        _id: department.hod,
      });

      if (headOfDept) responseObject[department.name].assignedHod = headOfDept;
    }

    //Getting list of teachers in that department
    await Users.find({
      accountType: "teacher",
      department: department._id,
    }).then((response) => {
      responseObject[department.name].teachers = [];

      for (let index in response) {
        if (headOfDept) {
          //Removing HOD entry in teachers list to avoid duplication
          if (response[index]._id.toString() != headOfDept._id) {
            responseObject[department.name].teachers.push(response[index]);
          }
        } else {
          responseObject[department.name].teachers.push(response[index]);
        }
      }
    });
  }

  res.statusCode = 200;
  res.json(responseObject);
});

//Adding new department
router.post("/institutionstructure/department/add", async (req, res, next) => {
  let department = await Department.findOne({ name: req.body.departmentName });

  if (department) {
    res.statusCode = 203;
    res.end("Department name already exists");
  } else {
    let newDepartment = new Department({ name: req.body.departmentName });

    //Saving new department
    await newDepartment.save();

    res.statusCode = 200;
    res.end("New departmetn added successfully");
  }
});

//Editing a department
router.post("/institutionstructure/department/edit", async (req, res, next) => {
  let department = await Department.findOne({ _id: req.body.departmentId });

  if (department) {
    //If department exist with same name
    let anyDept = await Department.findOne({ name: req.body.newName });

    if (!anyDept) {
      department.name = req.body.newName;

      //Savng changes
      await department.save();

      res.statusCode = 200;
      res.end("Department edited successfully");
    } else {
      res.statusCode = 203;
      res.end("Department name already exists");
    }
  } else {
    res.statusCode = 203;
    res.end("Department doest not exists");
  }
});

//Removing a department
router.post(
  "/institutionstructure/department/remove",
  async (req, res, next) => {
    let department = await Department.findOne({ _id: req.body.departmentId });

    if (department) {
      ///Removing Exam

      //Removing  teacher users in department
      let teachers = await Users.find({ department: department._id });
      for (let teacher of teachers) {
        let exams = await Exam.find({
          teacher: teacher._id,
        });

        for (let exam of exams) {
          await Answers.deleteMany({
            exam: exam._id,
          });
          await exam.remove();
        }
        await teacher.remove();
      }

      //Removing  student users in department
      let allStudents = await Users.find({});

      for (let student of allStudents) {
        let Class = await Classes.findOne({
          _id: student.class,
        });
        if (Class && Class.department == department._id) {
          await student.remove();
        }
      }

      //Removing classes in that department
      await Classes.deleteMany({
        department: department._id,
      });

      await department.remove();

      res.statusCode = 200;
      res.end("Department removed successfully");
    } else {
      res.statusCode = 203;
      res.end("Department doest not exists");
    }
  }
);

//Change hod
router.post(
  "/institutionstructure/department/changehod",
  async (req, res, next) => {
    let department = await Department.findOne({ _id: req.body.departmentId });

    department.hod = req.body.hod;
    await department.save();

    res.statusCode = 200;
    res.end("HOD changed successfully");
  }
);

//Return class details from DB
router.post("/institutionstructure/class", async (req, res, next) => {
  let classes = await Classes.find({
    department: mongoose.Types.ObjectId(req.body.department),
  });

  //response to front end
  let responseObject = [];

  for (let Class of classes) {
    //Class mentor
    let mentor = null;

    let newClass = {};

    //Setting id of class
    newClass.id = Class._id;
    newClass.name = Class.name;
    newClass.batch = Class.batch;

    //Setting Mentor
    if (Class.mentor) {
      //HOD already assigned

      //Getting hod data
      mentor = await Users.findOne({
        _id: Class.mentor,
      });

      if (mentor) newClass.assignedMentor = mentor;
    }

    //Getting list of teachers in that department
    await Users.find({
      accountType: "teacher",
      department: req.body.department,
    }).then((response) => {
      newClass.teachers = [];

      for (let index in response) {
        if (mentor) {
          //Removing Mentor entry in teachers list to avoid duplication
          if (response[index]._id.toString() != mentor._id) {
            newClass.teachers.push(response[index]);
          }
        } else {
          newClass.teachers.push(response[index]);
        }
      }
    });

    responseObject.push(newClass);
  }

  res.statusCode = 200;
  res.json(responseObject);
});

//Adding new class
router.post("/institutionstructure/class/add", async (req, res, next) => {
  let Class = await Classes.findOne({
    name: req.body.className,
    batch: req.body.batchName,
    department: req.body.department,
  });

  if (Class) {
    res.statusCode = 203;
    res.end("Class already exists");
  } else {
    let newClass = new Classes({
      name: req.body.className,
      department: req.body.department,
      batch: req.body.batchName,
    });

    //Saving new department
    await newClass.save();

    res.statusCode = 200;
    res.end("New Class added successfully");
  }
});

//Editing a class
router.post("/institutionstructure/class/edit", async (req, res, next) => {
  let Class = await Classes.findOne({ _id: req.body.classId });

  if (Class) {
    //If class exist with same name
    let anyClass = await Classes.findOne({
      name: req.body.newName,
      batch: req.body.newBatch,
    });

    if (!anyClass) {
      Class.name = req.body.newName;
      Class.batch = req.body.newBatch;

      //Savng changes
      await Class.save();

      res.statusCode = 200;
      res.end("Class edited successfully");
    } else {
      res.statusCode = 203;
      res.end("Class with same data already exists");
    }
  } else {
    res.statusCode = 203;
    res.end("Class doest not exists");
  }
});

//Removing a Class
router.post("/institutionstructure/class/remove", async (req, res, next) => {
  let Class = await Classes.findOne({ _id: req.body.classId });

  if (Class) {
    let exams = await Exam.find({ Class: Class._id });

    //removing exams
    for (let exam of exams) {
      let answer = await Answers.findOne({ exam: exam._id });
      answer.remove();
      exam.remove();
    }

    //removing students
    await Users.deleteMany({ class: Class._id });

    await Class.remove();

    res.statusCode = 200;
    res.end("Class removed successfully");
  } else {
    res.statusCode = 203;
    res.end("Class doest not exists");
  }
});

//Change mentor
router.post(
  "/institutionstructure/class/changementor",
  async (req, res, next) => {
    let Class = await Classes.findOne({ _id: req.body.classId });

    //Check if the Teacher is already a mentor of any class
    let teacherAsMentor = await Classes.findOne({ mentor: req.body.mentor });

    if (teacherAsMentor) {
      res.statusCode = 203;
      res.end(
        "Cannot change Mentor :- This teacher is currently mentor of class: " +
          teacherAsMentor.name +
          ", batch: " +
          teacherAsMentor.batch
      );
    } else {
      Class.mentor = req.body.mentor;
      await Class.save();

      res.statusCode = 200;
      res.end("Mentor changed successfully");
    }
  }
);

//Get messages from db
router.get("/messages/", async (req, res, next) => {
  let messages = await BugReports.find({});

  res.statusCode = 200;
  res.json(messages);
});

//replay a message
router.post("/messages/replay", async (req, res, next) => {
  let message = await BugReports.findOne({ _id: req.body.messageId });

  if (message) {
    message.reply = req.body.message;

    //Sending email to user
    sendMail(
      message.userEmail,
      "Replay from Admin: YUVASHIKSHA",
      `We reviewed your issue with Yuvashiksha. \n ${req.body.message}`
    );

    //Saving replay to db
    await message.save();

    res.statusCode = 200;
    res.end("Replay send successfully");
  } else {
    res.statusCode = 203;
    res.end("Message not exist in db");
  }
});

//delete message
router.post("/messages/delete", async (req, res, next) => {
  let message = await BugReports.findOne({ _id: req.body.message });
  if (message) {
    await message.remove();
    res.statusCode = 200;
    res.end("Message deleted successfully");
  } else {
    res.statusCode = 203;
    res.end("Message not found");
  }
});

//Return User account details which are not activated yet
router.get("/verifyaccount", async function (req, res, next) {
  let responseObject = [];

  Users.find({ accountStatus: "not-activated", accountType: "teacher" })
    .then(async (teachers) => {
      //Parsing department name from department id
      for (let teacher of teachers) {
        let departmentName = await Department.findOne({
          _id: teacher.department,
        });

        responseObject.push({
          name: teacher.name,
          id: teacher._id,
          email: teacher.email,
          registerNumber: teacher.registerNumber,
          accountStatus: teacher.accountStatus,
          department: departmentName.name,
        });
      }

      res.statusCode = 200;
      res.json(responseObject);
    })
    .catch((err) => next(err));
});

//Accept a teacher account
router.post("/verifyaccount/accept", (req, res, next) => {
  let body = "";
  let subject = "Yuvashiksha account verified";
  Users.findOneAndUpdate({ _id: req.body.userId }, { accountStatus: "ok" })
    .then((user) => {
      body = `Dear ${user.name},
  Your account has been verified successfully by Yuvashiskha`;
      sendMail(user.email, subject, body);
      res.statusCode = 200;
      res.end("Successfully Verified");
    })
    .catch((err) => next(err));
});

//Reject a teacher account
router.post("/verifyaccount/reject", (req, res, next) => {
  let body = "";
  let subject = "Yuvashiksha account has been rejected";
  Users.findOneAndUpdate(
    { _id: req.body.userId },
    { accountStatus: "rejected" }
  )
    .then((user) => {
      body = `Dear ${user.name},
      Your account has been rejected by Yuvashiskha`;
      sendMail(user.email, subject, body);
      res.statusCode = 200;
      res.end("Successfully Rejected");
    })
    .catch((err) => next(err));
});

//Return teacher account details
router.get("/usermanagement/teacher", (req, res, next) => {
  let responseObject = [];

  Users.find({ accountType: "teacher" })
    .then(async (response) => {
      //Filtering data required
      for (let teacher of response) {
        newTeacher = {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          registerNumber: teacher.registerNumber,
          accountStatus: teacher.accountStatus,
        };

        //Parsing departmnet name
        let department = await Department.findOne({ _id: teacher.department });
        if (department) {
          newTeacher.department = department.name;
        }

        responseObject.push(newTeacher);
      }

      res.statusCode = 200;
      res.json(responseObject);
    })
    .catch((err) => {
      next(err);
    });
});

//Disable a user account
router.post("/usermanagement/disable", (req, res, next) => {
  let body = "";
  let subject = "Yuvashiksha Account has been disabled";
  Users.findOne({ _id: req.body.userId })
    .then(async (user) => {
      if (user) {
        user.accountStatus = "disabled";

        await user.save();
        //sending mail
        body = `Dear ${user.name},
        Your Account has been verified successfully by yuvashiskha`;
        sendMail(user.email, subject, body);

        res.statusCode = 200;
        res.end("Account disabled successfully");
      } else {
        res.statusCode = 203;
        res.end("User account not found");
      }
    })
    .catch((err) => next(err));
});

//Return student account details
router.get("/usermanagement/student", (req, res, next) => {
  let responseObject = [];

  Users.find({ accountType: "student" })
    .then(async (response) => {
      //Filtering data required
      for (let student of response) {
        newStudent = {
          id: student._id,
          name: student.name,
          email: student.email,
          parentEmail: student.parentEmail,
          registerNumber: student.registerNumber,
          accountStatus: student.accountStatus,
        };

        //Parsing class,batch name
        let Class = await Classes.findOne({ _id: student.class });
        if (Class) {
          newStudent.class = Class.name;
          newStudent.batch = Class.batch;
        }

        responseObject.push(newStudent);
      }
      res.statusCode = 200;
      res.json(responseObject);
    })
    .catch((err) => {
      next(err);
    });
});

//Enable a user account
router.post("/usermanagement/enable", (req, res, next) => {
  let body = "";
  let subject = "Yuvashiksha Account has been enabled";
  Users.findOne({ _id: req.body.userId })
    .then(async (user) => {
      if (user) {
        user.accountStatus = "ok";

        await user.save();
        body = `Dear ${user.name},
        Your Yuvashiksha account has been  enabled`;
        sendMail(user.email, subject, body);
        res.statusCode = 200;
        res.end("Account enabled successfully");
      } else {
        res.statusCode = 203;
        res.end("User account not found");
      }
    })
    .catch((err) => next(err));
});

//Delete a user account
router.post("/usermanagement/delete", async (req, res, next) => {
  let body = "";
  let subject = "Yuvashiksha Account has been deleted";
  let user = await Users.findOne({ _id: req.body.userId });

  if (user) {
    await user.remove();
    //sending mail notification
    body = `Dear ${user.name},
    Your Yuvashiksha account has been deleted`;
    sendMail(user.email, subject, body);

    res.statusCode = 200;
    res.end("Account removed successfully");
  } else {
    res.statusCode = 203;
    res.end("User account not found");
  }
});

//Search in teacher account
router.post("/usermanagement/teacher/search", async (req, res, next) => {
  let responseObject = [];
  let searchString = req.body.searchString;

  let isMatched = (string, searchString) => {
    if (!string || !searchString) {
      return false;
    }

    if (string.toLowerCase().indexOf(searchString.toLowerCase()) != -1) {
      return true;
    } else {
      return false;
    }
  };

  let users = await Users.find({ accountType: "teacher" });

  for (user of users) {
    newUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      registerNumber: user.registerNumber,
      accountStatus: user.accountStatus,
    };

    //Parsing departmnet name
    let department = await Department.findOne({ _id: user.department });
    if (department) {
      newUser.department = department.name;
    }

    if (
      isMatched(user.name, searchString) ||
      isMatched(user.email, searchString) ||
      isMatched(user.registerNumber, searchString) ||
      isMatched(newUser.department, searchString)
    ) {
      responseObject.push(newUser);
    }
  }

  res.statusCode = 200;
  res.json(responseObject);
});

//Search in student account
router.post("/usermanagement/student/search", async (req, res, next) => {
  let responseObject = [];
  let searchString = req.body.searchString;

  let isMatched = (string, searchString) => {
    if (!string || !searchString) {
      return false;
    }

    if (string.toLowerCase().indexOf(searchString.toLowerCase()) != -1) {
      return true;
    } else {
      return false;
    }
  };

  let users = await Users.find({ accountType: "student" });

  for (user of users) {
    newUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      parentEmail: user.parentEmail,
      registerNumber: user.registerNumber,
      accountStatus: user.accountStatus,
    };

    //Parsing class,batch name
    let Class = await Classes.findOne({ _id: user.class });
    if (Class) {
      newUser.class = Class.name;
      newUser.batch = Class.batch;
    }

    if (
      isMatched(user.name, searchString) ||
      isMatched(user.email, searchString) ||
      isMatched(user.registerNumber, searchString) ||
      isMatched(user.parentEmail, searchString) ||
      isMatched(newUser.class, searchString) ||
      isMatched(newUser.batch, searchString)
    ) {
      responseObject.push(newUser);
    }
  }

  res.statusCode = 200;
  res.json(responseObject);
});

//Return the form data for the report section of admin
router.get("/report/formdata", async (req, res, next) => {
  let responseObject = {
    departments: [],
  };

  let departments = await Department.find({});

  for (let i in departments) {
    let department = {
      id: departments[i]._id,
      name: departments[i].name,
      Classes: {},
    };

    //Getting the class details
    let Class = await Classes.find({ department: department.id });

    for (let j in Class) {
      let newClass = {
        id: Class[j].id,
        name: Class[j].name,
        batches: [],
      };

      //Getting batch details
      let classes = await Classes.find({
        department: department.id,
        name: Class[j].name,
      });

      for (let k in classes) {
        newClass.batches.push(classes[k].batch);
      }

      department.Classes[Class[j].name] = newClass;
    }

    responseObject.departments.push(department);
  }

  res.statusCode = 200;
  res.json(responseObject);
});

//Return the exam details for the report
router.post("/report/getdetails", async (req, res, next) => {
  let cDateFrom = req.body.dateFrom;
  let cDateTo = req.body.dateTo;

  //Fetch all exams
  let allExams = await Exam.find({});
  let filteredExams = [];

  //DATE FILTERS -------------------------
  if (cDateFrom && cDateTo) {
    //Ranged date filter
    let minDate = Date.parse(cDateFrom);
    let maxDate = Date.parse(cDateTo);

    for (let exam of allExams) {
      let examDate = Date.parse(exam.date);

      if (examDate >= minDate && examDate <= maxDate) {
        filteredExams.push(exam);
      }
    }
  } else if (cDateFrom || cDateTo) {
    //Single date filter
    let cDate = cDateFrom || cDateTo;
    let date = Date.parse(cDate);

    for (let exam of allExams) {
      let examDate = Date.parse(exam.date);

      if (date == examDate) {
        filteredExams.push(exam);
      }
    }
  } else {
    filteredExams = allExams;
  }

  //RANGED FILTERS---------------------------------------
  if (req.body.mode == "range") {
    let cDepartment = req.body.department;
    let cClass = req.body.Class;
    let cBatch = req.body.batch;

    //Department wise filtering
    if (cDepartment && !cClass && !cBatch) {
      let dateFilteredExams = filteredExams;
      filteredExams = [];

      for (let exam of dateFilteredExams) {
        let Class = await Classes.findOne({ _id: exam.Class });

        if (Class && Class.department == cDepartment) {
          filteredExams.push(exam);
        }
      }
    }
    //Class wise filering
    else if (cDepartment && cClass && !cBatch) {
      let dateFilteredExams = filteredExams;
      filteredExams = [];

      for (let exam of dateFilteredExams) {
        let Class = await Classes.findOne({ _id: exam.Class });

        if (Class && Class.department == cDepartment && Class.name == cClass) {
          console.log(Class.name);
          filteredExams.push(exam);
        }
      }
    }
    //Batch wise filering
    else if (cDepartment && cClass && cBatch) {
      let dateFilteredExams = filteredExams;
      filteredExams = [];

      for (let exam of dateFilteredExams) {
        let Class = await Classes.findOne({ _id: exam.Class });

        if (
          Class &&
          Class.department == cDepartment &&
          Class.name == cClass &&
          Class.batch == cBatch
        ) {
          filteredExams.push(exam);
        }
      }
    }
  } else if (req.body.mode == "single") {
    let cRegisterNo = req.body.registerNo;

    let dateFilteredExams = filteredExams;
    filteredExams = [];

    //TEACHER ACCOUNT FILTER
    if (req.body.accountType == "teacher") {
      for (let exam of dateFilteredExams) {
        let teacher = await Users.findOne({ _id: exam.teacher });

        if (teacher && teacher.registerNumber == cRegisterNo) {
          filteredExams.push(exam);
        }
      }
    }
    //STUDENT ACCOUNT FILTER
    else if (req.body.accountType == "student") {
      for (let exam of dateFilteredExams) {
        let student = await Users.findOne({ registerNumber: cRegisterNo });

        if (student && student.class.toString() == exam.Class.toString()) {
          filteredExams.push(exam);
        }
      }
    }
  }

  //COMPLETED ALL FILTERS

  let responseObject = {};

  //SETTING THE HEADER DETAILS FOR THE REPORT --------------------------------

  responseObject.header = {};

  if (req.body.department && req.body.mode == "range") {
    let department = await Department.findOne({ _id: req.body.department });

    responseObject.header["Department"] = department.name;
    responseObject.header["Class"] = req.body.Class;
    responseObject.header["Batch"] = req.body.batch;
  }

  if (req.body.registerNo && req.body.mode == "single") {
    responseObject.header["Register Number"] = req.body.registerNo;
    responseObject.header["Account Type"] = req.body.accountType;
  }

  if (req.body.dateFrom && req.body.dateTo) {
    responseObject.header["Date From"] = req.body.dateFrom;
    responseObject.header["Date To"] = req.body.dateTo;
  } else if (req.body.dateFrom || req.body.dateTo) {
    responseObject.header["Date"] = req.body.dateFrom || req.body.dateTo;
  }

  if (filteredExams.length <= 0) {
    res.statusCode = 203;
    res.end("No matching exams found");
  } else {
    //Parse the exams data
    let exams = [];

    if (!(req.body.mode == "single" && req.body.accountType == "student")) {
      for (let exam of filteredExams) {
        let answers = await Answers.find({ exam: exam._id });

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

        exams.push({ examData, studentData });
      }
    } else {
      let student = await Users.findOne({
        registerNumber: req.body.registerNo,
      });

      let studentData = {
        NAME: student.name,
        EMAIL: student.email,
        "PARENT EMAIL": student.parentEmail,
        "REGISTER NUMBER": student.registerNumber,
      };

      for (let exam of filteredExams) {
        let answer = await Answers.findOne({
          exam: exam._id,
          student: student._id,
        });

        if (!answer) {
          continue;
        }

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
          "MARKS OBTAINED": answer.totalMarks,
        };

        exams.push({ examData });
        responseObject.student = studentData;
      }
    }

    responseObject.exams = exams;
    res.json(responseObject);
  }
});

module.exports = router;
