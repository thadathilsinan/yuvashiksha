var express = require("express");
const bodyParser = require("body-parser");

//Importing required schemas
const Admin = require("../schema/Admin");
const Department = require("../schema/department");
const Users = require("../schema/Users");
const Classes = require("../schema/classes");

const mongoose = require("mongoose");

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

// router.get("/verifyaccount", async function (req, res, next) {
//   Signin.find({ accountStatus: "not-activated", accountType: "teacher" })
//     .then(async (response) => {
//       let teacherData = [];
//       for (item of response) {
//         await Teachers.findOne({ username: item.username }).then((teacher) => {
//           teacherData.push(teacher);
//         });
//       }
//       res.statusCode = 200;
//       res.json({ data: teacherData });
//     })
//     .catch((err) => next(err));
// });

// router.post("/verifyaccount/accept", (req, res, next) => {
//   Signin.findOneAndUpdate(
//     { username: req.body.username },
//     { accountStatus: "ok" }
//   )
//     .then((user) => {
//       res.statusCode = 200;
//       res.end("Suucessfully Verified");
//     })
//     .catch((err) => next(err));
// });

// router.post("/verifyaccount/reject", (req, res, next) => {
//   Signin.findOneAndUpdate(
//     { username: req.body.username },
//     { accountStatus: "rejected" }
//   )
//     .then((user) => {
//       res.statusCode = 200;
//       res.end("Suucessfully Rejected");
//     })
//     .catch((err) => next(err));
// });

// router.get("/usermanagement/teacher", (req, res, next) => {
//   Teachers.find({})
//     .then((response) => {
//       res.statusCode = 200;
//       res.json({ data: response });
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

// router.post("/usermanagement/teacher/delete", (req, res, next) => {
//   Teachers.findOneAndDelete({ _id: req.body.teacher._id })
//     .then((response) => {
//       res.statusCode = 200;
//       res.end("Successfully deleted teacher");
//     })
//     .catch((err) => next(err));
// });

// router.post("/usermanagement/teacher/disable", (req, res, next) => {
//   Teachers.findOne({ _id: req.body.teacher._id })
//     .then((response) => {
//       if (response) {
//         Signin.findOneAndUpdate(
//           { username: req.body.teacher.username },
//           { accountStatus: "disabled" }
//         )
//           .then((resp) => {
//             res.statusCode = 200;
//             res.end("Teacher account disabled successfully");
//           })
//           .catch((err) => next(err));
//       }
//     })
//     .catch((err) => next(err));
// });
// router.get("/usermanagement/student", (req, res, next) => {
//   Students.find({})
//     .then((response) => {
//       res.statusCode = 200;
//       res.json({ data: response });
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

// router.post("/usermanagement/student/delete", (req, res, next) => {
//   Students.findOneAndDelete({ _id: req.body.student._id })
//     .then((response) => {
//       res.statusCode = 200;
//       res.end("Successfully deleted student");
//     })
//     .catch((err) => next(err));
// });

// router.post("/usermanagement/student/disable", (req, res, next) => {
//   Students.findOne({ _id: req.body.student._id })
//     .then((response) => {
//       if (response) {
//         Signin.findOneAndUpdate(
//           { username: req.body.student.username },
//           { accountStatus: "disabled" }
//         )
//           .then((resp) => {
//             res.statusCode = 200;
//             res.end("Student account disabled successfully");
//           })
//           .catch((err) => next(err));
//       }
//     })
//     .catch((err) => next(err));
// });
module.exports = router;
