const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  mentor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

let Classes = mongoose.model("Class", ClassSchema);
module.exports = Classes;
