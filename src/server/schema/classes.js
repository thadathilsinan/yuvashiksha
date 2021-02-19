const mongoose = require("mongoose");
const Users = require("./Users");
const Schema = mongoose.Schema;
const ClassesSchema = new Schema({
  Department: {
    type: Schema.Types.ObjectId,
    res: Department,
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
    res: Users,
    required: true,
    unique: true,
  },
});
let Classes = mongoose.model("Classes", ClassesSchema);
module.exports = Classes;
