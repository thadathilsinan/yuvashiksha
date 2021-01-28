var express = require("express");
const bodyParser = require("body-parser");

var router = express.Router();

router.use(bodyParser.json());
router.get("/admin", function (req, res, next) {
  res.statusCode = 200;
  next();
});
module.exports = router;
