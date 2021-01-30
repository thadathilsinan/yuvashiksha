var express = require("express");
const bodyParser = require("body-parser");

let Signin = require("../schema/signin");
let Students = require("../schema/students");
let Teachers = require("../schema/teachers");

var router = express.Router();

router.use(bodyParser.json());

router.post("/", function (req, res, next) {
  Signin.findOne({
    username: req.body.username,
    password: req.body.password,
  })
    .then((user) => {
      if (!user) {
        res.statusCode = 203;
        res.end("Username or password incorrect");
      } else {
        res.statusCode = 200;
        res.end(
          `username=${user.username}` +
            " %split% " +
            `password=${user.password} %split% accountType=${user.accountType}`
        );
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/google", (req, res, next) => {});

module.exports = router;
