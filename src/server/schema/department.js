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
    res: Users,
    required: true,
    unique: true,
  },
});
let Department = mongoose.model("Department", DepartmentSchema);
module.exports = Department;
