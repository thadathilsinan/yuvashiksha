import { Component } from "react";
import { connect } from "react-redux";

import "./teacher.css";

const mapDispatchToProps = (dispatch) => {
  return {
    updateData: (payload) => dispatch({ type: "updateSignupData", payload }),
    clearData: () => dispatch({ type: "clearSignupData" }),
  };
};
class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      emailValidation: null,
    };
  }

  inputValues = {};

  validateForm = () => {
    if (
      this.inputValues.name &&
      this.inputValues.registerNumber &&
      this.inputValues.department &&
      this.inputValues.email
    ) {
      this.setState({ error: null });
      if (
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.inputValues.email)
      ) {
        this.setState({ emailValidation: null });

        //Successful validation
        return true;
      } else {
        this.setState({ emailValidation: <p>Enter a valid email address</p> });
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
      this.props.updateData({ accountType: "teacher", ...this.inputValues });
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
          placeholder="Name"
          name="name"
          onChange={this.onValueChange}
        />
        <input
          type="text"
          className="form-control mt-3"
          id="id-number"
          name="registerNumber"
          onChange={this.onValueChange}
          placeholder="ID Number"
        />
        <select
          className="form-select mt-3"
          aria-label="Default select example"
          name="department"
          onChange={this.onValueChange}
          id="department"
        >
          <option value="CS" selected>
            CS
          </option>
          <option value="Commerce">Commerce</option>
        </select>
        <input
          type="email"
          className="form-control mt-3"
          id="email"
          name="email"
          onChange={this.onValueChange}
          placeholder="Email"
        />
        {this.state.emailValidation}
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Teacher);
