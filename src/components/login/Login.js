import { Component } from "react";
import "./login.css";

import Signin from "./signin/signin";
import Signup from "./sigup/signup";
import VerifyOtp from "./verifyOtp/verifyOtp";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signin: false,
      signup: false,
      showVerifyOtp: true,
    };
  }

  changeTabToSignup = () => {
    this.setState({
      signin: false,
      signup: true,
    });
  };

  changeTabToSignin = () => {
    this.setState({
      signin: true,
      signup: false,
    });
  };

  showVerifyOtp = () => {
    this.setState({ showVerifyOtp: true });
  };

  render() {
    let style = {
      "background-color": "rgb(37, 35, 34)",
      color: "white",
    };
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
                  onClick={this.changeTabToSignin}
                  style={this.state.signin ? style : null}
                >
                  SIGN IN
                </a>
                <a
                  className="nav-item nav-link"
                  href="#"
                  id="signup-tab"
                  onClick={this.changeTabToSignup}
                  style={this.state.signin ? null : style}
                >
                  SIGN UP
                </a>
              </nav>
              {this.state.signin ? <Signin /> : null}
              {this.state.signup ? (
                <Signup otpSent={this.showVerifyOtp} />
              ) : null}
              {this.state.showVerifyOtp ? <VerifyOtp /> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
