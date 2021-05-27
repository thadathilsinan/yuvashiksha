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
        this.parseDepartmentOptions();
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

  //Parse the department <option>
  parseDepartmentOptions = () => {
    let departments = [];

    for (let department of this.state.formData.departments) {
      let option = (
        <option key={department.id} value={department.id}>
          {department.name}
        </option>
      );

      departments.push(option);
    }

    this.setState({ departments });
  };

  //Parse the class options
  parseClassOptions = () => {
    let department = this.departmentRef.current.value;
    let Classes = [];
    let parsedClass = [];

    //Get classes of currently selected department
    for (let dept of this.state.formData.departments) {
      if (dept.id == department) {
        Classes = dept.Classes;
      }
    }

    //Parsing options
    for (let i in Classes) {
      let option = (
        <option key={Classes[i].id} value={Classes[i].name}>
          {Classes[i].name}
        </option>
      );

      parsedClass.push(option);
    }

    this.setState({ Classes: parsedClass });
  };

  //Parse the batches options
  parseBatchOptions = () => {
    let department = this.departmentRef.current.value;
    let Class = this.ClassRef.current.value;
    let batches = [];
    let parsedBatches = [];

    if (!Class) {
      this.setState({ batches: null });
      return;
    }

    //Get batches of currently selected department and class
    for (let dept of this.state.formData.departments) {
      if (dept.id == department) {
        batches = dept.Classes[Class].batches;
      }
    }

    //parsing
    for (let batch of batches) {
      let option = (
        <option key={batch} value={batch}>
          {batch}
        </option>
      );

      parsedBatches.push(option);
    }

    this.setState({ batches: parsedBatches });
  };

  //When the GET DETAILS Button is clicked
  getDetails = () => {
    let dateFrom = this.dateFromRef.current.value;
    let dateTo = this.dateToRef.current.value;

    if (this.state.selectionType == "range") {
      let department = this.departmentRef.current.value;
      let Class = this.ClassRef.current.value;
      let batch = this.batchRef.current.value;

      if (!department) {
        alert("Please select atleast the department option");
        return;
      }

      http(
        "POST",
        "/admin/report/getdetails",
        {
          mode: this.state.selectionType,
          department,
          Class,
          batch,
          dateFrom,
          dateTo,
        },
        (res) => {
          console.log(res.data);
        }
      );
    } else {
      let registerNo = this.registerNoRef.current.value;

      if (!registerNo) {
        alert("Please enter the register number");
      }
    }
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
            <select
              className="form-control"
              ref={this.departmentRef}
              onChange={this.parseClassOptions}
            >
              <option value="">--SELECT--</option>
              {this.state.departments}
            </select>
          </div>

          <div class="input-group input-group-lg">
            <div class="input-group-prepend">
              <span class="input-group-text">CLASS</span>
            </div>
            <select
              className="form-control"
              ref={this.ClassRef}
              onChange={this.parseBatchOptions}
            >
              <option value="">--SELECT--</option>
              {this.state.Classes}
            </select>
          </div>

          <div class="input-group input-group-lg">
            <div class="input-group-prepend">
              <span class="input-group-text">BATCH</span>
            </div>
            <select className="form-control" ref={this.batchRef}>
              <option value="">--SELECT--</option>
              {this.state.batches}
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
          <Button
            className=" mr-3  p-2 btn btn-light mt-3"
            onClick={this.getDetails}
          >
            GET DETAILS
          </Button>
        </div>
      </div>
    );
  }
}

export default Report;
