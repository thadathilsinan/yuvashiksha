import { Component } from "react";
import "./signin.css";

class Signin extends Component {
  showPassword = () => {
    let password = document.getElementById("password");

    if (password.type == "password") {
      password.type = "text";
    } else {
      password.type = "password";
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
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="Password"
          />
        </div>
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
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="remember-me"
          />
          <label className="form-check-label" for="remember-me">
            Remember me
          </label>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button type="button" className="btn btn-success" id="login-btn">
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
