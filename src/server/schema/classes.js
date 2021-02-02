const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ClassesSchema = new Schema({
  Department: {
    type: String,
    required: true,
  },
  ClassName: {
    type: String,
    required: true,
  },
  Batch: {
    type: String,
    required: true,
  },
  Mentor: {
    type: String,
    required: true,
  },
  Subjects: {
    type: String,
    required: true,
  },
});
let Classes = mongoose.model("Classes", ClassesSchema);
module.exports = Students;
