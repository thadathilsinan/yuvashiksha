import React from "react";
import { Button } from "react-bootstrap";
import "./Report.css";

import http from "../../../../shared/http";

class Report extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: null,
      departments: null,
      batches: null,
      Classes: null,
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

  //Parse department Data
  parseDepartmentOptions = () => {
    let departmentsList = [];

    for (let department of this.state.formData.departments) {
      let option = (
        <option key={department.id} value={department.id}>
          {department.name}
        </option>
      );

      departmentsList.push(option);
    }

    this.setState({ departments: departmentsList });
  };

  //Parse the Classes options
  parseClassOptions = () => {
    let ClassList = [];

    let Classes = this.state.formData.Classes;

    for (let i in Classes) {
      let classOption = (
        <option key={Classes[i].id} value={Classes[i].name}>
          {Classes[i].name}
        </option>
      );

      ClassList.push(classOption);
    }

    this.setState({ Classes: ClassList });
  };

  //Parse batch options
  parseBatchOptions = () => {
    let Class = this.ClassRef.current.value;
    let batches = [];

    console.log(Class);

    for (let batch of this.state.formData.Classes[Class].batches) {
      let batchOption = (
        <option key={batch} value={batch}>
          {batch}
        </option>
      );

      batches.push(batchOption);
    }

    this.setState({ batches });
  };

  //Parse the form data
  parseFormData = () => {
    //Parse the Class and Batch options
    let ClassList = [];
    let batches = {};

    let Classes = this.state.formData.Classes;

    for (let i in Classes) {
      let classOption = (
        <option key={Classes[i].id} value={Classes[i].name}>
          {Classes[i].name}
        </option>
      );

      batches[Classes[i].name] = [];

      for (let batch of Classes[i].batches) {
        let batchOption = (
          <option key={Classes[i].id + batch} value={batch}>
            {batch}
          </option>
        );

        batches[Classes[i].name].push(batchOption);
      }

      ClassList.push(classOption);
    }

    this.setState({
      batches: batches,
      Classes: ClassList,
    });
  };

  //When the check boxes in the form changes
  chechBoxChanged = (event) => {
    let checked = event.target.checked;
    let element = event.target.id;

    switch (element) {
      case "departmentCheck":
        if (checked) {
          document.getElementById("classCheck").disabled = true;
          document.getElementById("batchCheck").disabled = true;
          this.ClassRef.current.disabled = true;
          this.batchRef.current.disabled = true;
          document.getElementById("registerNoCheck").disabled = true;
          this.registerNoRef.current.disabled = true;

          //parse departments
          this.parseDepartmentOptions();
        } else {
          document.getElementById("classCheck").disabled = false;
          document.getElementById("batchCheck").disabled = false;
          this.ClassRef.current.disabled = false;
          this.batchRef.current.disabled = false;
          document.getElementById("registerNoCheck").disabled = false;
          this.registerNoRef.current.disabled = false;

          //Reset the department values
          this.setState({ departments: null });
        }
        break;
      case "classCheck":
        if (checked) {
          document.getElementById("departmentCheck").disabled = true;
          this.departmentRef.current.disabled = true;
          document.getElementById("registerNoCheck").disabled = true;
          this.registerNoRef.current.disabled = true;

          //Parse class options
          this.parseClassOptions();
        } else {
          //Reset the parsed list values
          this.setState({ Classes: null });

          if (
            !document.getElementById("batchCheck").checked &&
            !document.getElementById("classCheck").checked
          ) {
            document.getElementById("departmentCheck").disabled = false;
            this.departmentRef.current.disabled = false;
          }

          if (
            !document.getElementById("batchCheck").checked &&
            !document.getElementById("classCheck").checked &&
            !document.getElementById("departmentCheck").checked
          ) {
            document.getElementById("registerNoCheck").disabled = false;
            this.registerNoRef.current.disabled = false;
          }
        }
        break;
      case "batchCheck":
        if (checked) {
          document.getElementById("departmentCheck").disabled = true;
          this.departmentRef.current.disabled = true;
          document.getElementById("registerNoCheck").disabled = true;
          this.registerNoRef.current.disabled = true;

          //parse batch options
          if (this.ClassRef.current.value) {
            this.parseBatchOptions();
          } else {
            alert("Please select a Class first");
          }
        } else {
          if (
            !document.getElementById("batchCheck").checked &&
            !document.getElementById("classCheck").checked
          ) {
            document.getElementById("departmentCheck").disabled = false;
            this.departmentRef.current.disabled = false;
          }

          if (
            !document.getElementById("batchCheck").checked &&
            !document.getElementById("classCheck").checked &&
            !document.getElementById("departmentCheck").checked
          ) {
            document.getElementById("registerNoCheck").disabled = false;
            this.registerNoRef.current.disabled = false;
          }
        }
        break;
      case "registerNoCheck":
        if (checked) {
          document.getElementById("departmentCheck").disabled = true;
          document.getElementById("classCheck").disabled = true;
          document.getElementById("batchCheck").disabled = true;

          this.ClassRef.current.disabled = true;
          this.batchRef.current.disabled = true;
          this.departmentRef.current.disabled = true;
        } else {
          document.getElementById("departmentCheck").disabled = false;
          document.getElementById("classCheck").disabled = false;
          document.getElementById("batchCheck").disabled = false;

          this.ClassRef.current.disabled = false;
          this.batchRef.current.disabled = false;
          this.departmentRef.current.disabled = false;
        }
        break;
      case "dateFromCheck":
        console.log("dateFrom");
        break;
      case "dateToCheck":
        console.log("dateTo");
        break;
    }
  };

  componentDidMount() {
    this.getFormData();

    console.log(this.props);
  }

  render() {
    return (
      <div className="container mt-5 mb-5">
        <div className="form-container">
          <input
            type="checkbox"
            id="departmentCheck"
            onChange={this.chechBoxChanged}
          />{" "}
          DEPARTMENT
          <select id="department" ref={this.departmentRef}>
            <option value="">--DEPARTMENT--</option>
            {this.state.departments}
          </select>
        </div>

        <div className="form-container">
          <input
            type="checkbox"
            id="classCheck"
            onChange={this.chechBoxChanged}
          />{" "}
          CLASS
          <select id="class" ref={this.ClassRef}>
            <option value="">--CLASS--</option>
            {this.state.Classes}
          </select>
        </div>

        <div className="form-container">
          <input
            type="checkbox"
            id="batchCheck"
            onChange={this.chechBoxChanged}
          />{" "}
          BATCH
          <select id="batch" ref={this.batchRef}>
            <option value="">--BATCH--</option>
            {this.state.batches}
          </select>
        </div>

        <div className="form-container">
          <input
            type="checkbox"
            id="registerNoCheck"
            onChange={this.chechBoxChanged}
          />{" "}
          REGISTER NUMBER
          <input
            className="form-control"
            type="text"
            placeholder="Register Number"
            id="registerNo"
            ref={this.registerNoRef}
          />
        </div>

        <div className="form-container">
          <input
            type="checkbox"
            id="dateFromCheck"
            onChange={this.chechBoxChanged}
          />{" "}
          DATE FROM
          <input
            className="form-control"
            type="date"
            id="dateFrom"
            ref={this.dateFromRef}
          />
        </div>

        <div className="form-container">
          <input
            type="checkbox"
            id="dateToCheck"
            onChange={this.chechBoxChanged}
          />{" "}
          DATE TO
          <input
            className="form-control"
            type="date"
            id="dateTo"
            ref={this.dateToRef}
          />
        </div>

        <div className="text-center">
          <Button className=" mr-3  p-2 btn btn-light mt-3">GET DETAILS</Button>
        </div>
      </div>
    );
  }
}

export default Report;
