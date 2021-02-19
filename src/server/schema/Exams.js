const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ExamsSchema = new Schema({
  examName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
  },
  date: {
    type: Date,
  },
  from: {
    type: Date,
  },
  to: {
    type: Date,
  },
  class: {
    type: Schema.Types.ObjectId,
    res: classes,
  },
  totalMarks: {
    type: Number,
  },
  questionpaper: {
    type: Array,
  },
});
let Exam = mongoose.model("Exam", ExamsSchema);
module.exports = Exam;
