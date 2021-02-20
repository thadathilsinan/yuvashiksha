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
  date: {
    type: Date,
    required: true,
  },
  reply: {
    type: String,
  },
});

let BugReports = mongoose.model("BugReport", BugReportSchema);
module.exports = BugReports;
