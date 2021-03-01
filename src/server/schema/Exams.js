const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
  examName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  Class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  questionPaper: {
    type: Array,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
let Exam = mongoose.model("Exam", ExamSchema);
module.exports = Exam;
