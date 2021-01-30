const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSignupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
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
  googleId: {
    type: String,
  },
});

let TeacherSignup = mongoose.model("TeacherSignup", TeacherSignupSchema);
module.exports = TeacherSignup;
