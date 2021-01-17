const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoginSchema = new Schema({
  accountType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  admissionNumber: {
    type: String,
  },
  class: {
    type: String,
  },
  batch: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  parentEmail: {
    type: String,
  },
  idNumber: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
});

let Login = mongoose.model("Login", LoginSchema);
export default Login;
