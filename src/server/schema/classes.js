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
    unique: true,
  },
  batch: {
    type: String,
    required: true,
  },
  mentor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

let Classes = mongoose.model("Class", ClassSchema);
module.exports = Classes;
