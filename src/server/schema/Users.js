const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UsersSchema = new Schema({
  accountType: {
    type: String,
    required: true,
    unique: true,
  },
  accountStatus: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: String,
    required: true,
  },
  photo: {
    type: Schema.Types.ObjectId,
    res: Assets,
  },
  class: {
    type: Schema.Types.ObjectId,
    res: Classes,
  },
  parentEmail: {
    type: String,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    res: Departments,
  },
});
let Users = mongoose.model("Users", UsersSchema);
module.exports = Users;
