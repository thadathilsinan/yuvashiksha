var express = require("express");
const bodyParser = require("body-parser");

//Importing required schemas
const Admin = require("../schema/Admin");
const Department = require("../schema/department");
const Users = require("../schema/Users");
const Classes = require("../schema/classes");
const BugReports = require("../schema/BugReport");
const Answers = require("../schema/Answers");

const mongoose = require("mongoose");

const sendMail = require("../functions/sendMail");
const Exam = require("../schema/Exams");

var router = express.Router();

router.use(bodyParser.json());

//Change password of admin account
router.post("/changepassword", async (req, res, next) => {
  let adminAccount = await Admin.findOne({ _id: req.user.id });

  adminAccount.password = req.body.password;

  //saving new password to db
  await adminAccount.save();

  res.statusCode = 200;
  res.end("Password changed successfully");
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
  Users.findOneAndUpdate({ _id: req.body.userId }, { accountStatus: "ok" })
    .then((user) => {
      res.statusCode = 200;
      res.end("Successfully Verified");
    })
    .catch((err) => next(err));
});

//Reject a teacher account
router.post("/verifyaccount/reject", (req, res, next) => {
  Users.findOneAndUpdate(
    { _id: req.body.userId },
    { accountStatus: "rejected" }
  )
    .then((user) => {
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
  Users.findOne({ _id: req.body.userId })
    .then(async (user) => {
      if (user) {
        user.accountStatus = "disabled";

        await user.save();

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
  Users.findOne({ _id: req.body.userId })
    .then(async (user) => {
      if (user) {
        user.accountStatus = "ok";

        await user.save();

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
  let user = await Users.findOne({ _id: req.body.userId });

  if (user) {
    await user.remove();

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
  if (req.body.mode == "range") {
    let cDepartment = req.body.department;
    let cClass = req.body.Class;
    let cBatch = req.body.batch;
    let cDateFrom = req.body.dateFrom;
    let cDateTo = req.body.dateTo;

    //Fetch all exams
    let allExams = await Exam.find({});
    let filteredExams = [];

    //Date Filtering
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

    //COMPLETED ALL FILTERS
    console.log(filteredExams.length);
  }

  res.end("OKK");
});

module.exports = router;
