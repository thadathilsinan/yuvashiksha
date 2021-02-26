import { Component } from "react";
import { connect } from "react-redux";

import http from "../../../../shared/http";

import "./student.css";

const mapDispatchToProps = (dispatch) => {
  return {
    updateData: (payload) => dispatch({ type: "updateSignupData", payload }),
    clearData: () => dispatch({ type: "clearSignupData" }),
  };
};
class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      parentEmailError: null,
      emailError: null,
      classList: null,
      classOptions: null,
      batchOptions: null,
    };
  }

  inputValues = {};

  validateEmail = (email) => {
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      return true;
    } else {
      return false;
    }
  };

  validateForm = () => {
    if (
      this.inputValues.name &&
      this.inputValues.registerNumber &&
      this.inputValues.class &&
      this.inputValues.batch &&
      this.inputValues.email &&
      this.inputValues.parentEmail
    ) {
      this.setState({ error: null });
      if (this.validateEmail(this.inputValues.email)) {
        this.setState({ emailError: null });
      } else {
        this.setState({ emailError: <p>Enter a valid email address</p> });
      }

      if (this.validateEmail(this.inputValues.parentEmail)) {
        this.setState({ parentEmailError: null });
      } else {
        this.setState({ parentEmailError: <p>Enter a valid email address</p> });
      }

      if (
        this.validateEmail(this.inputValues.email) &&
        this.validateEmail(this.inputValues.parentEmail)
      ) {
        //Successful validation
        return true;
      } else {
        return false;
      }
    } else {
      this.setState({
        error: <p style={{ color: "black" }}>PLEASE FILL ALL DATA</p>,
      });
      return false;
    }
  };

  onValueChange = (event) => {
    this.inputValues[event.target.name] = event.target.value;
    let valid = this.validateForm();

    if (valid) {
      this.props.updateData({ accountType: "student", ...this.inputValues });
    } else {
      this.props.clearData();
    }

    if (event.target.name == "class") {
      //Setup batch details based on the selected class
      this.setupBatchOptions();
    }
  };

  setView = () => {
    if (this.props.google) {
      document
        .getElementById("email")
        .setAttribute("value", this.props.data.email);
      document
        .getElementById("name")
        .setAttribute("value", this.props.data.name);

      document.getElementById("email").setAttribute("disabled", "true");
      document.getElementById("name").setAttribute("disabled", "true");
    }
  };

  //Get Class data from the database
  getClasses = () => {
    http("GET", "/login/getclasses", {}, (res) => {
      if (res.status == 200) {
        this.setState({ classList: res.data });
        this.setupClassOptions();
      }
    });
  };

  //Setup the options for the <select> for classes
  setupClassOptions = () => {
    //Options JSX
    let options = [];

    options = Object.keys(this.state.classList).map((key, array) => {
      return (
        <>
          <option value={key}>{key}</option>
        </>
      );
    });

    //Setting class list options to display
    this.setState({ classOptions: options });
  };

  //Setup the options for the <select> for batches based on the selected Class
  setupBatchOptions = () => {
    //Currently selected class
    let Class = this.inputValues.class;

    //Getting batches of the selected class
    let batches = this.state.classList[Class].batches;

    let options = batches.map((batch, index, array) => {
      return (
        <>
          <option value={batch}>{batch}</option>
        </>
      );
    });

    //Setting options as state to diaplay it in screen
    this.setState({ batchOptions: options });
  };

  componentDidMount() {
    this.props.clearData();
    this.setView();

    //Get class info
    this.getClasses();
  }

  render() {
    if (this.props.google) {
      this.inputValues.name = this.props.data.name;
      this.inputValues.email = this.props.data.email;
    }

    return (
      <div>
        {this.state.error}
        <input
          type="text"
          class="form-control"
          id="name"
          name="name"
          placeholder="Name"
          onChange={this.onValueChange}
        />
        <input
          type="text"
          className="form-control mt-3"
          id="admission-number"
          name="registerNumber"
          placeholder="Admission Number"
          onChange={this.onValueChange}
        />
        <select
          className="form-select mt-3"
          aria-label="Default select example"
          id="class"
          name="class"
          onChange={this.onValueChange}
        >
          <option value="" selected>
            --CLASS--
          </option>
          {this.state.classOptions}
        </select>
        <select
          className="form-select mt-3"
          aria-label="Default select example"
          id="batch"
          onChange={this.onValueChange}
          name="batch"
        >
          <option value="" selected>
            --BATCH--
          </option>
          {this.state.batchOptions}
        </select>
        <input
          type="email"
          className="form-control mt-3"
          id="email"
          name="email"
          placeholder="Email"
          onChange={this.onValueChange}
        />
        {this.state.emailError}
        <input
          type="email"
          className="form-control mt-3"
          id="parent-email"
          name="parentEmail"
          placeholder="Parent Email"
          onChange={this.onValueChange}
        />
        {this.state.parentEmailError}
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Student);
