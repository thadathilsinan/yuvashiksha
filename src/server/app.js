var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
let cors = require("cors");

let loginRouter = require("./routes/login");
let registerRouter = require("./routes/register");
let adminRouter = require("./routes/admin");
let teacherRoute = require("./routes/teacher");
let uploadRouter = require("./routes/upload");
const studentRouter = require("./routes/student");
const appRouter = require("./routes/app");
const bodyParser = require("body-parser");
const startNotification = require("./functions/notification");

const config = require("./config");

mongoose.connect(config.dbConnectionString, {
  //mongodb://localhost:27017/yuvashiksha
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Connecting to the db
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("Connected to Database server successfully");
});

//Setting express app
var app = express();

// view engine setup
app.set("view engine", "jade");

app.use(
  cors({
    origin: config.clientUrl, // <-- location of the react app were connecting to
    credentials: true,
  })
);

app.use(cookieParser(/*"secretcode"*/));

//Configure Session Storage
app.use(
  cookieSession({
    name: "user-session",
    keys: ["key1", "key2"],
  })
);

//Setting the local strategy in passport
require("./passport/localStrategy")(passport);

//Setting the google srtategy for passport authentication
require("./passport/googleStrategy")(passport);

//Configure Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.urlencoded({ limit: "1000kb", extended: true }));
app.use(express.json({ limit: "10000kb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/admin", adminRouter);
app.use("/teacher", teacherRoute);
app.use("/upload", uploadRouter);
app.use("/student", studentRouter);
app.use("/app", appRouter);

//license file
console.log(`YUVASHIKSHA Copyright (C) 2021  Team YUVASHIKSHA
This program comes with ABSOLUTELY NO WARRANTY; for details type \`show w'.
This is free software, and you are welcome to redistribute it
under certain conditions; type \`show c' for details.
`);


//System notifiaction
startNotification();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

