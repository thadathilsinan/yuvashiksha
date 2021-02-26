const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  hod: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

let Departments = mongoose.model("Department", DepartmentSchema);
module.exports = Departments;
