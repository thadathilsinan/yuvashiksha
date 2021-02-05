var express = require("express");
const bodyParser = require("body-parser");

let Signin = require("../schema/signin");
let Teachers = require("../schema/teachers");
let Students = require("../schema/students");

var router = express.Router();

router.use(bodyParser.json());
router.get("/verifyaccount", async function (req, res, next) {
  Signin.find({ accountStatus: "not-activated", accountType: "teacher" })
    .then(async (response) => {
      let teacherData = [];
      for (item of response) {
        await Teachers.findOne({ username: item.username }).then((teacher) => {
          teacherData.push(teacher);
        });
      }
      res.statusCode = 200;
      res.json({ data: teacherData });
    })
    .catch((err) => next(err));
});

router.post("/verifyaccount/accept", (req, res, next) => {
  Signin.findOneAndUpdate(
    { username: req.body.username },
    { accountStatus: "ok" }
  )
    .then((user) => {
      res.statusCode = 200;
      res.end("Suucessfully Verified");
    })
    .catch((err) => next(err));
});

router.post("/verifyaccount/reject", (req, res, next) => {
  Signin.findOneAndUpdate(
    { username: req.body.username },
    { accountStatus: "rejected" }
  )
    .then((user) => {
      res.statusCode = 200;
      res.end("Suucessfully Rejected");
    })
    .catch((err) => next(err));
});

router.get("/usermanagement/teacher", (req, res, next) => {
  Teachers.find({})
    .then((response) => {
      res.statusCode = 200;
      res.json({ data: response });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/usermanagement/teacher/delete", (req, res, next) => {
  Teachers.findOneAndDelete({ _id: req.body.teacher._id })
    .then((response) => {
      res.statusCode = 200;
      res.end("Successfully deleted teacher");
    })
    .catch((err) => next(err));
});

router.post("/usermanagement/teacher/disable", (req, res, next) => {
  Teachers.findOne({ _id: req.body.teacher._id })
    .then((response) => {
      if (response) {
        Signin.findOneAndUpdate(
          { username: req.body.teacher.username },
          { accountStatus: "disabled" }
        )
          .then((resp) => {
            res.statusCode = 200;
            res.end("Teacher account disabled successfully");
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
});
module.exports = router;
