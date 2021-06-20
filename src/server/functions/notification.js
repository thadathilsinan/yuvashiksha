const Exams = require("../schema/Exams");
const Users = require("../schema/Users");

const sendMail = require("./sendMail");
//notification
let startNotification = async () => {
  let allExams = await Exams.find({});
  let subject = "Exam Reminder | YUVASHIKSHA ";

  for (let exam of allExams) {
    let currentTime = new Date();
    let examTime = new Date(`${exam.date} ${exam.from}`);
    let timeDiffrence = examTime.getTime() - currentTime.getTime();
    let offSet = 60 * 60 * 60 * 1000; /* 1 hour */

    if (timeDiffrence > 0 && timeDiffrence <= offSet) {
      let students = await Users.find({ class: exam.Class });

      for (let student of students) {
        let body = `Dear ${student.name},
            Your ${exam.subject}  ${exam.examName} has been scheduled on ${exam.date} from ${exam.from} to ${exam.to},
            Be prepared for your exam ! All  the very best ${student.name}`;
        sendMail(student.email, subject, body);
      }
    }
  }

  //reaptedly send email notification
  setTimeout(startNotification, 65 * 60 * 60 * 1000);
};

module.exports = startNotification;
