var express = require("express");
const bodyParser = require("body-parser");

let Signin = require("../schema/signin");
let Teachers = require("../schema/teachers");

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
module.exports = router;
