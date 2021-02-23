import { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./signup.css";

import Student from "./student/student";
import Teacher from "./teacher/teacher";

import http from "../../../shared/http";
import parseCookie from "../../../shared/parseCookie";

const mapStateToProps = (state) => {
  return {
    signupData: state.login.signupData,
    validSignupData: state.login.validSignupData,
  };
};
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

  verifyEmail = () => {
    if (this.props.validSignupData) {
      http("POST", "/register", this.props.signupData, (res) => {
        if (res.status === 200) {
          this.props.otpSent();
        } else {
          alert(res.data);
        }
      });
    }
  };

  googleSignup = () => {
    document.location.href = "http://localhost:4000/register/google";
  };

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
            disabled={!this.props.validSignupData}
          >
            VERIFY EMAIL
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-danger"
            id="google-login-btn"
            onClick={this.googleSignup}
          >
            SIGN UP WITH GOOGLE
          </button>
        </div>
      </form>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Signup));
