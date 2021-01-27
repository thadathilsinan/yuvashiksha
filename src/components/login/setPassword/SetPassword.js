import { Component } from "react";
import "./SetPassword.css";

import http from "../../../shared/http";
class SetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirm: "",
      errorMessage: null,
    };
  }

  validatePassword = () => {
    if (this.state.password === this.state.confirm) {
      console.log("Password Validation Success");
      this.setState({ errorMessage: null });

      http(
        "POST",
        "/register/finish",
        { password: this.state.password },
        (res) => {
          window.location.href = "http://localhost:3000";
        }
      );
    } else {
      this.setState({ errorMessage: <p>Passwords do not match</p> });
    }
  };

  onValueChange = (event) => {
    let newSate = {};
    newSate[event.target.name] = event.target.value;
    this.setState(newSate);
  };

  showPassword = () => {
    let password = document.getElementById("password");
    let confirm = document.getElementById("confirm");

    if (password.type == "password" && confirm.type == "password") {
      password.type = "text";
      confirm.type = "text";
    } else {
      password.type = "password";
      confirm.type = "password";
    }
  };

  render() {
    return (
      <form>
        <center>
          <p id="info-text">Setup a new Password</p>
        </center>
        <div className="form-group">
          <input
            type="password"
            name="password"
            id="password"
            value={this.state.password}
            onChange={this.onValueChange}
            placeholder="Password"
            className="form-control mt-3"
          />
          <input
            type="password"
            name="confirm"
            id="confirm"
            value={this.state.confirm}
            onChange={this.onValueChange}
            placeholder="Confirm Password"
            className="form-control mt-3"
          />
          {this.state.errorMessage}
          <br />
          <input
            type="checkbox"
            name="showPassword"
            id="showPassword"
            onClick={this.showPassword}
          />
          <span style={{ color: "white" }}>Show Password</span>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-success"
            id="finish"
            onClick={this.validatePassword}
          >
            FINISH
          </button>
        </div>
      </form>
    );
  }
}

export default SetPassword;
