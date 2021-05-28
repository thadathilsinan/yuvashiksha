import React, { Component } from "react";
import "./ReportPreview.css";

import NavBar from "../navBar/NavBar";
import { IoClose } from "react-icons/io5";
import { BiPrinter } from "react-icons/bi";

import $ from "jquery";

class ReportPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      header: null,
    };
  }

  //Parse the header informations
  parseHeader = () => {
    let header = this.props.data.header;
    let parsedHeader = [];

    for (let i in header) {
      if (header[i]) {
        let item = (
          <tr key={i}>
            <th width="150px">{i}</th>
            <td>: {header[i]}</td>
          </tr>
        );

        parsedHeader.push(item);
      }
    }

    this.setState({ header: parsedHeader });
  };

  //Parse the exams section of the page
  parseExams = () => {
    let exams = this.props.data.exams;
    let parsedExams = [];
    let count = 1;

    for (let exam of exams) {
      let studentDetails = [];
      let sNo = 1;

      for (let i in exam.studentData) {
        let studentRow = (
          <tr key={i}>
            <td>{sNo}</td>
            <td>{exam.studentData[i].name}</td>
            <td>{i}</td>
            <td>{exam.studentData[i].email}</td>
            <td>
              {exam.studentData[i].marks ? exam.studentData[i].marks : "---"}
            </td>
          </tr>
        );

        sNo++;
        studentDetails.push(studentRow);
      }

      let item = (
        <div key={count}>
          <h5>EXAM NO: {count}</h5>
          <table className="table table-striped">
            <tr className="table-info">
              <th colSpan="2">Exam Name</th>
              <td colSpan="3">{exam.examData["EXAM NAME"]}</td>
            </tr>
            <tr className="table-info">
              <th colSpan="2">Subject</th>
              <td colSpan="3">{exam.examData.SUBJECT}</td>
            </tr>
            <tr className="table-info">
              <th colSpan="2">Date</th>
              <td colSpan="3">{exam.examData.DATE}</td>
            </tr>
            <tr className="table-info">
              <th colSpan="2">Class</th>
              <td colSpan="3">{exam.examData.CLASS}</td>
            </tr>
            <tr className="table-info">
              <th colSpan="2">Teacher</th>
              <td colSpan="3">{exam.examData.TEACHER}</td>
            </tr>
            <tr className="table-info">
              <th colSpan="2">Time</th>
              <td colSpan="3">{exam.examData.TIME}</td>
            </tr>
            <tr className="table-info">
              <th colSpan="2">Total Marks</th>
              <td colSpan="3">{exam.examData["TOTAL MARKS"]}</td>
            </tr>
            {this.props.data.student ? (
              <tr className="table-info">
                <th colSpan="2">Marks Obtained</th>
                <td colSpan="3">
                  {exam.examData["MARKS OBTAINED"]
                    ? exam.examData["MARKS OBTAINED"]
                    : "---"}
                </td>
              </tr>
            ) : null}
            <tr>
              <td></td>
              <td></td>
            </tr>
            {this.props.data.student ? null : (
              <>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Register No.</th>
                  <th>Email</th>
                  <th>Marks</th>
                </tr>
                {studentDetails}
              </>
            )}
          </table>
        </div>
      );

      count++;
      parsedExams.push(item);
    }

    this.setState({ exams: parsedExams });
  };

  //Print button clicked
  printData = () => {
    let element = window.$(".a4-paper").html();

    let printWindow = window.open("", "", "");

    if (printWindow) {
      printWindow.document.write(`
      <html>
      <head>
      <!-- CSS only -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
      <title>Report Print</title>
      <style>
      body {
        width: 21cm;
        height: 29.7cm;
      
        overflow: auto;
      
        padding: 60px;
      }

      p {
          line-height: 0.6;
      }
      </style>
      `);
      printWindow.document.write("</head><body >");
      printWindow.document.write(element);
      printWindow.document.write(`
      </body>
      <script>
      window.print();
      window.close();
      </script>
      </html>
      `);
    }
  };

  componentDidMount() {
    this.parseHeader();
    this.parseExams();

    console.log(this.props);
  }

  render() {
    return (
      <div id="reportPreviewDiv">
        <NavBar>
          {{
            left: <h4>REPORT PREVIEW</h4>,
            right: (
              <>
                <button className="btn btn-light mr-3" onClick={this.printData}>
                  <BiPrinter />
                </button>
                <button className="btn btn-danger" onClick={this.props.close}>
                  <IoClose />
                </button>
              </>
            ),
          }}
        </NavBar>

        <div id="reportPreviewBody">
          <div className="a4-paper">
            <center>
              <b>
                <u>
                  <h4>EXAM REPORT</h4>
                </u>
              </b>
            </center>
            <br />

            <p>FILTERS ADDED :</p>
            <table>{this.state.header}</table>
            <hr />
            <br />

            <p>RESULT : </p>
            <table>
              {this.props.data.student ? (
                <>
                  <tr>
                    <th width="150px">Name</th>
                    <td>: {this.props.data.student.NAME}</td>
                  </tr>
                  <tr>
                    <th width="150px">Register.No</th>
                    <td>: {this.props.data.student["REGISTER NUMBER"]}</td>
                  </tr>
                  <tr>
                    <th width="150px">Email</th>
                    <td>: {this.props.data.student.EMAIL}</td>
                  </tr>
                  <tr>
                    <th width="150px">Parent Email</th>
                    <td>: {this.props.data.student["PARENT EMAIL"]}</td>
                  </tr>
                </>
              ) : null}
              <tr>
                <th width="150px">Total Exams</th>
                <td>: {this.props.data.exams.length}</td>
              </tr>
            </table>
            <hr />
            <br />

            {this.state.exams}
          </div>
        </div>
      </div>
    );
  }
}

export default ReportPreview;
