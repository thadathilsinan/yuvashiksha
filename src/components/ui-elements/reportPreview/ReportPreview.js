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
            <td>{header[i]}</td>
          </tr>
        );

        parsedHeader.push(item);
      }
    }

    this.setState({ header: parsedHeader });
  };

  componentDidMount() {
    this.parseHeader();

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
          </div>
        </div>
      </div>
    );
  }
}

export default ReportPreview;
