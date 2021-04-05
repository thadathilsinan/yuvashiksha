const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  exam: {
    type: Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: {
    type: Array,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

let Answers = mongoose.model("Answer", AnswerSchema);
module.exports = Answers;
