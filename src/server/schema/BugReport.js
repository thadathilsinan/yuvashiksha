const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BugReportSchema = new Schema({
  userEmail: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Reply: {
    type: string,
    required: true,
  },
});
let BugReport = mongoose.model("BugReport", BugReportSchema);
module.exports = BugReport;
