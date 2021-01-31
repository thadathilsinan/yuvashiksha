const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DepartmentSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  hod: {
    type: String,
    required: true,
  },
  Classes: {
    type: Array,
    required: true,
  },
});
