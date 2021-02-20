const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
  examName: {
    type: String,
    required: true,
  },
  subject: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  questionpaper: {
    type: Array,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
let Exam = mongoose.model("Exam", ExamsSchema);
module.exports = Exam;
