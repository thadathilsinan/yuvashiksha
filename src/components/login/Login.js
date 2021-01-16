import { Component } from "react";
import "./login.css";

class Login extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div className="card" id="login-card" style={{ width: "25rem" }}>
            <div className="card-body">
              <nav class="nav nav-pills nav-fill">
                <a
                  className="nav-item nav-link active"
                  href="#"
                  id="signin-tab"
                >
                  SIGN IN
                </a>
                <a className="nav-item nav-link" href="#" id="signup-tab">
                  SIGN UP
                </a>
              </nav>
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
                    id="remember-me"
                  />
                  <label className="form-check-label" for="remember-me">
                    Remember me
                  </label>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    type="button"
                    className="btn btn-success"
                    id="login-btn"
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
