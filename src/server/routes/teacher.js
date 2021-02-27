/**
 * ROUTER FOR /teacher
 *
 */

var express = require("express");
const bodyParser = require("body-parser");

var router = express.Router();

const bcrypt = require("bcryptjs");

//Importing required mongoose models
const Users = require("../schema/Users");

router.use(bodyParser.json());

router.post("/profile/save", async (req, res, next) => {
  let user = await Users.findOne({ _id: req.user._id });

  if (user) {
    if (!user.googleId && req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.body.email != user.email) {
      user.email = req.body.email;
    }

    //Saving changes to the db
    await user.save();

    res.statusCode = 200;
    res.end("Accound data saved successfully");
  } else {
    res.statusCode = 203;
    res.end("User account not found");
  }
});

module.exports = router;
