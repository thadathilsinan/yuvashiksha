const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentsSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
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
});

let Students = mongoose.model("Students", StudentsSchema);
module.exports = Students;
