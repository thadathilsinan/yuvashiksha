const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

let Subjects = mongoose.model("Subject", SubjectSchema);
module.exports = Subjects;
