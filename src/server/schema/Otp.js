const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OtpSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});

let otp = mongoose.model("Otp", OtpSchema);
module.exports = otp;
