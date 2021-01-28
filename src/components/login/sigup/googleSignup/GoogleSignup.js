import { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./GoogleSignup.css";

import Student from "../student/student";
import Teacher from "../teacher/teacher";

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
          {this.state.accountType == "student" ? (
            <Student
              google
              data={{ name: "Example", email: "exaple@123.com" }}
            />
          ) : null}
          {this.state.accountType == "teacher" ? (
            <Teacher
              google
              data={{ name: "Example", email: "exaple@123.com" }}
            />
          ) : null}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-success"
            id="login-btn"
            onClick={this.verifyEmail}
            disabled={!this.props.validSignupData}
          >
            FINISH
          </button>
        </div>
      </form>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Signup));
