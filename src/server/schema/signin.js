const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SigninSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  accountType: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  googleSignup: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
  },
});

let Signin = mongoose.model("Signin", SigninSchema);
module.exports = Signin;
