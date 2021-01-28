import { Component } from "react";
import { withRouter, useLocation } from "react-router-dom";
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

let GOOGLE_DATA = {};

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountType: "student",
      googleData: {},
    };
  }

  selectAccountType = (event) => {
    this.setState({ accountType: event.target.value });
  };

  useQuery = () => {
    let query = new URLSearchParams(this.props.location.search);
    return query;
  };

  getGoogleData = () => {
    let query = this.useQuery();

    if (query.get("name")) GOOGLE_DATA.name = query.get("name");
    if (query.get("email")) GOOGLE_DATA.email = query.get("email");
    if (query.get("id")) GOOGLE_DATA.id = query.get("id");
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
