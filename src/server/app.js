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

mongoose.connect(
  "mongodb+srv://yuvashiksha:yuvashiksha@yuvashilsha.y1gzh.mongodb.net/yuvashiksha?retryWrites=true&w=majority",
  {
    //mongodb://localhost:27017/yuvashiksha
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

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
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/admin", adminRouter);

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
