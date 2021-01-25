const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SigninSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

let Signin = mongoose.model("Signin", SigninSchema);
export default Signin;
