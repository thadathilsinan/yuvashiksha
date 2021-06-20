var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  pool: true, // This is the field you need to add
  auth: {
      user: 'bcaproject2021@gmail.com',
      pass: 'yuvashiksha1234' 
}});


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
