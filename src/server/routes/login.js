var express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

let Register = require("../schema/register.js");
var router = express.Router();

router.use(bodyParser.json());

router.post("/register", function (req, res, next) {
  Register.create(req.body)
    .then(
      (user) => {
        console.log("User data enterd to DB ", user);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = router;
