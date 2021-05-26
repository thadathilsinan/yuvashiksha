import React, { Component } from "react";
import NavBar from "../navBar/NavBar";
import "./PrintPreview.css";

import { IoClose } from "react-icons/io5";
import { BiPrinter } from "react-icons/bi";

import $ from "jquery";

class PrintPreview extends Component {
  constructor(props) {
    super(props);

    this.state = { examData: null, studentData: null };
  }

  //parse examData
  parseExamData = () => {
    let examData = [];

    for (let key in this.props.data.examData) {
      let newLine = (
        <tr key={key}>
          <td width="150px">{key}</td>
          <td>: {this.props.data.examData[key]}</td>
        </tr>
      );

      examData.push(newLine);
    }

    this.setState({ examData });
  };

  //Parse the student Data
  parseStudentData = () => {
    let studentData = [];
    let count = 1;

    let students = this.props.data.studentData;
    for (let key in students) {
      let newRow = (
        <tr key={key}>
          <td>{count}</td>
          <td>{students[key].name}</td>
          <td>{key}</td>
          <td>{students[key].email}</td>
          <td>{students[key].marks ? students[key].marks : "---"}</td>
        </tr>
      );

      count++;
      studentData.push(newRow);
    }

    this.setState({ studentData });
  };

  //Print the DOM as PDF
  printData = () => {
    let element = window.$("#print-data").html();

    let printWindow = window.open("", "", "");

    if (printWindow) {
      printWindow.document.write(`
      <html>
      <head>
      <!-- CSS only -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
      <title>Exam Data</title>
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
    this.parseExamData();
    this.parseStudentData();

    console.log(this.props);
  }

  render() {
    return (
      <>
        <NavBar>
          {{
            left: <h4>PRINT PREVIEW</h4>,
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
        <div id="printPreviewBody">
          <div className="a4-paper" id="print-data">
            <b>
              <u>
                <center>
                  <h4>EXAMINATION DETAILS</h4>
                </center>
              </u>
            </b>
            <br />
            <table>{this.state.examData}</table>
            <br />
            <br />

            <b>
              <u>
                <center>
                  <h4>EXAM RESULT</h4>
                </center>
              </u>
            </b>
            <br />

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Register No.</th>
                  <th>Email</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>{this.state.studentData}</tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

export default PrintPreview;
