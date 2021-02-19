const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AnswersSchema = new Schema({
  exam: {
    type: Schema.Types.ObjectId,
    res: exam,
    required: true,
    unique: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    res: users,
    required: true,
  },
  answers: {
    type: Array,
  },
  images: {
    type: Array,
  },
});
let Answer = mongoose.model("Answer", AnswersSchema);
module.exports = Answer;
