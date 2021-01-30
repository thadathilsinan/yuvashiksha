const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  Message: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
  },
  Email: {
    type: String,
    required: true,
  },
  Resolved: {
    type: Boolean,
  },
  Reply: {
    type: string,
    required: true,
  },
});
let Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
