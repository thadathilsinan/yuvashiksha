import { Component } from "react";
import { withRouter, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import "./GoogleSignup.css";

import Student from "../student/student";
import Teacher from "../teacher/teacher";

import http from "../../../../shared/http";

const mapStateToProps = (state) => {
  return {
    signupData: state.login.signupData,
    validSignupData: state.login.validSignupData,
  };
};

let GOOGLE_DATA = {};

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountType: "student",
      googleData: {},
    };
  }

  query = null;

  selectAccountType = (event) => {
    this.setState({ accountType: event.target.value });
  };

  finishSignup = () => {
    http(
      "POST",
      "/register/googlesignup",
      { ...this.props.signupData, ...GOOGLE_DATA },
      (res) => {
        if (res.status == 200) {
          alert("Signup Completed");
          document.location.href = "http://localhost:3000/signin";
        } else {
          alert("Error During Signup. May be accoount already exist");
        }
      }
    );
  };

  useQuery = () => {
    let query = new URLSearchParams(this.props.location.search);
    return query;
  };

  getGoogleData = () => {
    this.query = this.useQuery();

    if (this.query.get("name")) GOOGLE_DATA.name = this.query.get("name");
    if (this.query.get("email")) GOOGLE_DATA.email = this.query.get("email");
    if (this.query.get("id")) GOOGLE_DATA.googleId = this.query.get("id");
  };

  render() {
    this.getGoogleData();
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
              data={{
                name: GOOGLE_DATA.name,
                email: GOOGLE_DATA.email,
                id: GOOGLE_DATA.id,
              }}
            />
          ) : null}
          {this.state.accountType == "teacher" ? (
            <Teacher
              google
              data={{
                name: GOOGLE_DATA.name,
                email: GOOGLE_DATA.email,
                id: GOOGLE_DATA.id,
              }}
            />
          ) : null}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-success"
            id="login-btn"
            onClick={this.finishSignup}
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
