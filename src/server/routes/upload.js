/**
 * ROUTER FOR /upload
 *
 */

var express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

let router = express.Router();

router.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    req.session.uploadedFileName = Date.now() + file.originalname;
    cb(null, Date.now() + file.originalname);
  },
});

// multer options
const upload = multer({
  storage,
  limits: {
    fileSize: 5000000, //5 MB max size of file
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(new Error("Please upload an image."));
    }
    cb(undefined, true);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  if (req.file) {
    res.statusCode = 200;
    res.end("http://localhost:4000/images/" + req.session.uploadedFileName);
  } else {
    res.statusCode = 203;
    res.end("Upload Error");
  }
});

module.exports = router;
