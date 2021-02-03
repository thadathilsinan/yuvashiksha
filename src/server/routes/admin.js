var express = require("express");
const bodyParser = require("body-parser");

let Signin = require("../schema/signin");
let Teachers = require("../schema/teachers");

var router = express.Router();

router.use(bodyParser.json());
router.get("/", function (req, res, next) {
  Signin.find({ active: false, accountType: "teacher" })
    .then((response) => {
      let teacherData = [];
      for (item of response) {
        Teachers.findOne({ username: item.username }).then((teacher) => {
          teacherData.push(teacher);
        });
      }
      res.statusCode = 200;
      res.json({ data: teacherData });
    })
    .catch((err) => next(err));
});
module.exports = router;
