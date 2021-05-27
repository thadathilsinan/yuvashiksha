import React from "react";
import { Button } from "react-bootstrap";
import "./Report.css";

import http from "../../../../shared/http";
import $ from "jquery";

class Report extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: null,
      departments: null,
      batches: null,
      Classes: null,
      selectionType: "range",
      dateFilter: false,
    };
  }

  //REF Objects
  departmentRef = React.createRef();
  ClassRef = React.createRef();
  batchRef = React.createRef();
  registerNoRef = React.createRef();
  dateFromRef = React.createRef();
  dateToRef = React.createRef();

  //Get the form input data from DB
  getFormData = () => {
    http("GET", "/admin/report/formdata", {}, (res) => {
      console.log(res.data);

      this.setState({ formData: res.data }, () => {
        // this.parseFormData();
      });
    });
  };

  //Change the selection type
  changeSelectionType = (event) => {
    if (event.target.id == "singleSelectionRadio") {
      this.toSingleSelection();
    } else {
      this.toRangeSelection();
    }
  };

  //Change to range selection
  toRangeSelection = () => {
    this.setState({ selectionType: "range" }, () => {
      window
        .$("#singleSelectionDiv input,#singleSelectionDiv select")
        .prop("disabled", true);

      window
        .$("#rangeSelectionDiv input,#rangeSelectionDiv select")
        .prop("disabled", false);
    });
  };

  //Change to single selection
  toSingleSelection = () => {
    this.setState({ selectionType: "single" }, () => {
      window
        .$("#rangeSelectionDiv input,#rangeSelectionDiv select")
        .prop("disabled", true);

      window
        .$("#singleSelectionDiv input,#singleSelectionDiv select")
        .prop("disabled", false);
    });
  };

  //When the date filter check box changes
  toggleDateFilter = (event) => {
    if (event.target.checked) {
      this.onDateFilter();
    } else {
      this.offDateFilter();
    }
  };

  //Off the dateFilter
  offDateFilter = () => {
    this.setState({ dateFilter: false });
    window.$("#dateFilterDiv input").prop("disabled", true);
  };

  //On the date filter
  onDateFilter = () => {
    this.setState({ dateFilter: true });
    window.$("#dateFilterDiv input").prop("disabled", false);
  };

  componentDidMount() {
    this.getFormData();

    //UI default configuration
    this.toRangeSelection();
    this.offDateFilter();

    console.log(this.props);
  }

  render() {
    return (
      <div className="container mt-5 mb-5">
        <input
          type="radio"
          name="selectionType"
          onChange={this.changeSelectionType}
          id="rangeSelectionRadio"
          defaultChecked
        />
        <span>
          <b> RANGE SELECTION</b>
        </span>
        <div className="inputGroup" id="rangeSelectionDiv">
          <div class="input-group input-group-lg">
            <div class="input-group-prepend">
              <span class="input-group-text">DEPARTMENT</span>
            </div>
            <select className="form-control" ref={this.departmentRef}>
              <option>--SELECT--</option>
            </select>
          </div>

          <div class="input-group input-group-lg">
            <div class="input-group-prepend">
              <span class="input-group-text">CLASS</span>
            </div>
            <select className="form-control" ref={this.ClassRef}>
              <option>--SELECT--</option>
            </select>
          </div>

          <div class="input-group input-group-lg">
            <div class="input-group-prepend">
              <span class="input-group-text">BATCH</span>
            </div>
            <select className="form-control" ref={this.batchRef}>
              <option>--SELECT--</option>
            </select>
          </div>
        </div>

        <input
          type="radio"
          name="selectionType"
          id="singleSelectionRadio"
          onChange={this.changeSelectionType}
        />
        <span>
          <b> SINGLE SELECTION</b>
        </span>
        <div className="inputGroup" id="singleSelectionDiv">
          <div class="input-group input-group-lg">
            <div class="input-group-prepend">
              <span class="input-group-text">REGISTER NO.</span>
            </div>
            <input
              className="form-control"
              type="text"
              ref={this.registerNoRef}
            />
          </div>
        </div>

        <input
          type="checkbox"
          id="dateFilterCheck"
          onChange={this.toggleDateFilter}
        />
        <span>
          <b> DATE FILTER</b>
        </span>
        <div className="inputGroup" id="dateFilterDiv">
          <div class="input-group input-group-lg">
            <div class="input-group-prepend">
              <span class="input-group-text">DATE FROM</span>
            </div>
            <input
              className="form-control"
              type="date"
              ref={this.dateFromRef}
            />

            <div class="input-group-prepend">
              <span class="input-group-text">DATE TO</span>
            </div>
            <input className="form-control" type="date" ref={this.dateToRef} />
          </div>
        </div>

        <div className="text-center">
          <Button className=" mr-3  p-2 btn btn-light mt-3">GET DETAILS</Button>
        </div>
      </div>
    );
  }
}

export default Report;
