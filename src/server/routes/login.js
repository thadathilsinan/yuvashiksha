var express = require("express");
const bodyParser = require("body-parser");

var router = express.Router();

router.use(bodyParser.json());

router.post("/", function (req, res, next) {
  res.end();
  next();
});

module.exports = router;
