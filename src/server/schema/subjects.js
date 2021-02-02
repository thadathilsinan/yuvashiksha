const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubjectSchema = new Schema({
  class: {
    type: String,
    required: true,
  },
  subjectname: {
    type: String,
    required: true,
  },
});
let Subject = mongoose.model("Subject", SubjectSchema);
module.exports = Subject;
