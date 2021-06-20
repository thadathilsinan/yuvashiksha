var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bcaproject2021@gmail.com",
    pass: "yuvashiksha1234",
  },
});

console.log("Starting");
let sendMail = (destination, subject, body) => {
  let mailOptions = {
    from: "bcaproject2021@gmail.com",
    to: destination,
    subject: subject,
    html: body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendMail;
