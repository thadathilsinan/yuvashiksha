var express = require("express");
const bodyParser = require("body-parser");

//Importing required schemas
const Admin = require("../schema/Admin");
const Department = require("../schema/department");
const Users = require("../schema/Users");

var router = express.Router();

router.use(bodyParser.json());

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

  departments.forEach(async (department, index, array) => {
    responseObject[department.name] = {};

    //Setting id of department
    responseObject[department.name].id = department._id;

    if (department.hod) {
      //HOD already assigned

      //Getting hod data
      let hod = await Users.findOne({
        _id: department.hod,
      });

      if (hod) responseObject[department.name].assignedHod = hod;
    }

    //Getting list of teachers in that department
    let teachers = await Users.find({
      accountType: "teacher",
      department: department.name,
    });

    if (teachers) responseObject[department.name].teachers = teachers;
  });

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
