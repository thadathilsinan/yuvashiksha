/**
 * General purposes
 *
 */

var express = require("express");
const bodyParser = require("body-parser");

let router = express.Router();

router.use(bodyParser.json());

//return time to client side
router.get("/time", (req, res, next) => {
  let currentTime = new Date();
  res.json(currentTime);
});

module.exports = router;
