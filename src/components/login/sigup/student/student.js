import { Component } from "react";
import { connect } from "react-redux";

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

  componentDidMount() {
    this.props.clearData();
    this.setView();
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
          <option value="BCA" selected>
            BCA
          </option>
          <option value="BSC">BSC</option>
        </select>
        <select
          className="form-select mt-3"
          aria-label="Default select example"
          id="batch"
          onChange={this.onValueChange}
          name="batch"
        >
          <option value="2020-21" selected>
            2018-21
          </option>
          <option value="2019-22">2019-22</option>
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
