var express = require("express");
var router = express.Router();

/* GET home page. */
router
  .get("/", function (req, res, next) {
    res.json({
      batches: ["CS", "BSC"],
    });
    next();
  })
  .get("/1", (req, res, next) => {
    let error = new Error("Access to /admin/1 is not allowed");
    error.status = 500;
    next(error);
  });

module.exports = router;
