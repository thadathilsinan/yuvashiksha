import React, { Component } from "react";
import "./ReportPreview.css";

import NavBar from "../navBar/NavBar";
import { IoClose } from "react-icons/io5";
import { BiPrinter } from "react-icons/bi";

import $ from "jquery";

class ReportPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
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

        <div id="reportPreviewBody"></div>
      </div>
    );
  }
}

export default ReportPreview;
