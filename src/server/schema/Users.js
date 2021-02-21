const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  accountType: {
    type: String,
    required: true,
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
    // unique: true,
  },
  photo: {
    type: String,
  },
  class: {
    //type: Schema.Types.ObjectId,
    type: String,
    //ref: "Class",
  },
  parentEmail: {
    type: String,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    // unique: true,
  },
  department: {
    // type: Schema.Types.ObjectId,
    // ref: "Department",
    type: String,
  },
});

let Users = mongoose.model("User", UserSchema);
module.exports = Users;
