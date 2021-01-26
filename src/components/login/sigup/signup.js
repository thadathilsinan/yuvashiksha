import { Component } from "react";
import "./signup.css";

import Student from "./student/student";
import Teacher from "./teacher/teacher";

import { serverDomain } from "../../../config";
import axios from "axios";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountType: "student",
    };
  }

  selectAccountType = (event) => {
    this.setState({ accountType: event.target.value });
  };

  verifyEmail = () => {};

  render() {
    return (
      <form>
        <div className="form-group">
          <label for="account-type">Select Account Type</label>
          <br />
          <select
            className="form-select"
            aria-label="Default select example"
            id="account-type"
            onChange={this.selectAccountType}
          >
            <option value="student" selected>
              Student
            </option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <div className="form-group">
          <label>Enter your details</label>
          {this.state.accountType == "student" ? <Student /> : null}
          {this.state.accountType == "teacher" ? <Teacher /> : null}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-success"
            id="login-btn"
            onClick={this.verifyEmail}
          >
            VERIFY EMAIL
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-danger"
            id="google-login-btn"
          >
            SIGN UP WITH GOOGLE
          </button>
        </div>
      </form>
    );
  }
}

export default Signup;
