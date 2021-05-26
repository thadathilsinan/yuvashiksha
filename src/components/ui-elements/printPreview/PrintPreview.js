import React, { Component } from "react";
import NavBar from "../navBar/NavBar";
import "./PrintPreview.css";

import { IoClose } from "react-icons/io5";
import { BiPrinter } from "react-icons/bi";

import $ from "jquery";

class PrintPreview extends Component {
  constructor(props) {
    super(props);

    this.state = { examData: null };
  }

  //parse examData
  parseExamData = () => {
    let examData = [];

    for (let key in this.props.data) {
      let newLine = (
        <p key={Date.now() + key}>
          {key} : {this.props.data[key]}
        </p>
      );

      examData.push(newLine);
    }

    this.setState({ examData });
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
      <title>Print Exam Data</title>
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
        document.addEventListener("DOMContentLoaded", function(event) {
            window.print();
        });
      </script>
      </html>
      `);
      //   printWindow.document.close();
      //   printWindow.print();
      //   printWindow.close();
    }
  };

  componentDidMount() {
    this.parseExamData();

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
            <h3 className="text-center">EXAMINATION DETAILS</h3>
            <br />
            <br />
            {this.state.examData}
          </div>
        </div>
      </>
    );
  }
}

export default PrintPreview;
