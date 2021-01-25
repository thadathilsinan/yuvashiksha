const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSignupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  admissionNumber: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  parentEmail: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
  },
  password: {
    type: String,
  },
  googleSignup: {
    type: Boolean,
  },
});

let StudentSignup = mongoose.model("StudentSignup", StudentSignupSchema);
module.exports = StudentSignup;
