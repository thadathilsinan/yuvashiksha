import { Component } from "react";
import "./signin.css";

import http from "../../../shared/http";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      erroMessage: null,
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

  inputChange = (event) => {
    let newState = {};
    newState[event.target.name] = event.target.value;

    this.setState(newState);
  };

  login = () => {
    if (this.state.username.length > 0 && this.state.password.length > 0) {
      this.setState({ erroMessage: null });
      http(
        "POST",
        "/login",
        { username: this.state.username, password: this.state.password },
        (res) => {
          if (res.status == 200) {
            let cookies = res.data.split(" %split% ");
            document.cookie = cookies[0];
            document.cookie = cookies[1];
          } else {
            this.setState({
              erroMessage: <p>Username or password incorrect</p>,
            });
          }
        }
      );
    } else {
      this.setState({ erroMessage: <p>Please fill all fields</p> });
    }
  };

  render() {
    return (
      <form>
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
          >
            SIGN IN WITH GOOGLE
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <p style={{ "margin-top": "8px", color: "white" }}>
            Need help?{" "}
            <a href="#" style={{ color: "white" }}>
              Report
            </a>
          </p>
        </div>
      </form>
    );
  }
}

export default Signin;
