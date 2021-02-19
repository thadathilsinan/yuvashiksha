const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OtpSchema = new Schema({
  UserId: {
    type: Schema.Types.ObjectId,
    res: Users,
    required: true,
    unique: true,
  },
  otp: {
    type: number,
  },
  expiry: {
    type: date,
    required: true,
  },
});
let Otp = mongoose.modal("Otp", OtpSchema);
module.exports = Otp;
