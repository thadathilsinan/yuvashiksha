/**
 * CONTENT OF THE SIGNIN TAB
 */

import { Component } from "react";
import { withRouter } from "react-router-dom";
import "./signin.css";

import http from "../../../shared/http";
import configureDialogBox from "../../../shared/dailogBox";
import $ from "jquery";

import config from "../../../config";
class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "", //USERNAME entered in the login form
      password: "", //PASSWORD entered in the login form
      erroMessage: null, //Error messsage if any (These are displayed bottom side of the login form)
      reportEmail: "", //Email id of the user (REPORT form)
      reportContent: "", //Content of the report (REPORT from)
      reportError: null,
    };
  }

  showPassword = () => {
    let password = document.getElementById("password");

    if (password.type == "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  //Setting form data into the component state
  inputChange = (event) => {
    let newState = {};
    newState[event.target.name] = event.target.value;

    this.setState(newState);
  };

  /**
   * When LOGIN button clicked
   */

  login = () => {
    if (this.state.username.length > 0 && this.state.password.length > 0) {
      this.setState({ erroMessage: null });
      //Loading Screen
      window.showLoading();
      http(
        "POST",
        "/login",
        { username: this.state.username, password: this.state.password },
        (res) => {
          //hiding loadingScreen
          window.hideLoading();
          if (res.status == 200) {
            alert("Login Successful");

            if (res.data.accountType === "teacher") {
              document.location.href = config.clientUrl + "/teacher";
            } else if (res.data.accountType === "student") {
              document.location.href = config.clientUrl + "/student";
            }
          } else {
            this.setState({
              erroMessage: <p>{res.data}</p>,
            });
          }
        }
      );
    } else {
      this.setState({ erroMessage: <p>Please fill all fields</p> });
    }
  };

  // When googleSignin button clicked
  googleSignin = () => {
    document.location.href = config.serverUrl + "/register/google";
  };

  //Validate Email ID
  validateEmail = (email) => {
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      return true;
    } else {
      return false;
    }
  };

  reportFormChange = (e) => {
    let newState = {};

    newState[e.target.name] = e.target.value;
    this.setState(newState);

    this.validateReportForm();
  };

  validateReportForm = () => {
    if (this.validateEmail(this.state.reportEmail)) {
      if (this.state.reportContent === "") {
        this.setState({ reportError: "Content is empty" });
        return false;
      } else {
        this.setState({ reportError: null });
        return true;
      }
    } else {
      this.setState({ reportError: "Email not valid" });
      return false;
    }
  };

  //When clicking Send in report form
  sendReport = (e) => {
    e.preventDefault();
    if (this.validateReportForm()) {
      http(
        "POST",
        "/login/report",
        {
          email: this.state.reportEmail,
          message: this.state.reportContent,
        },
        (res) => {
          if (res.status == 200) {
            alert("Report sent Successfully. We will Contact you later");

            window.$("#reportModal").modal("hide");
            window.$("#content").val("");
            this.setState({
              reportEmail: "",
              reportContent: "",
              reportError: null,
            });
          } else {
            alert(res.data);
          }
        }
      );
    }
  };

  render() {
    return (
      <form>
        {/* Configuring The reportModal */}
        {configureDialogBox(
          "reportModal",
          "Report an Issue",
          <>
            <form>
              <label className="black" for="email">
                Enter your email:{" "}
              </label>
              <input
                onChange={this.reportFormChange}
                type="email"
                name="reportEmail"
                id="email"
                className="m-3"
                value={this.state.reportEmail}
              ></input>
              <br />

              <label className="black" for="content">
                Enter content:{" "}
              </label>
              <textarea
                onChange={this.reportFormChange}
                rows="10"
                name="reportContent"
                id="content"
                className="m-3"
              ></textarea>
            </form>
            {this.state.reportError ? <p>{this.state.reportError}</p> : null}
          </>,
          <>
            <button className="btn btn-primary" onClick={this.sendReport}>
              Send
            </button>
          </>
        )}

        <div className="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={this.state.username}
            onChange={this.inputChange}
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            name="password"
            value={this.state.password}
            onChange={this.inputChange}
            placeholder="Password"
          />
        </div>
        {this.state.erroMessage}
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="showPassword"
            name="showPassword"
            onClick={this.showPassword}
          />
          <label className="form-check-label" for="showPassword">
            Show Password
          </label>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-success"
            id="login-btn"
            onClick={this.login}
          >
            LOGIN
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-danger"
            id="google-login-btn"
            onClick={this.googleSignin}
          >
            SIGN IN WITH GOOGLE
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <p style={{ "margin-top": "8px", color: "white" }}>
            Need help?{" "}
            <a
              href="#"
              data-toggle="modal"
              data-target="#reportModal"
              style={{ color: "white" }}
            >
              Report
            </a>
          </p>
        </div>
      </form>
    );
  }
}

export default withRouter(Signin);
