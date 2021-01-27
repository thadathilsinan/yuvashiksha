const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeachersSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  hod: {
    type: String,
  },
  mentor: {
    type: String,
  },
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
});

let Teachers = mongoose.model("Teachers", TeachersSchema);
module.exports = Teachers;
