/**
 * MAIN SIGNIN/SIGNUP COMPONENT
 */
import { Component } from "react";
import { connect } from "react-redux";
import "./login.css";

import Signin from "./signin/signin";
import Signup from "./sigup/signup";
import VerifyOtp from "./verifyOtp/verifyOtp";
import SetPassword from "./setPassword/SetPassword";
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import GoogleSignup from "./sigup/googleSignup/GoogleSignup";

//DISPATH ACTIONS TO CHANGE REDUX STORE DATA (USED FOR SIGNUP PROCEDURE)
const mapDispatchToProps = (dispatch) => {
  return {
    updateData: (payload) => dispatch({ type: "updateSignupData", payload }),
    clearData: () => dispatch({ type: "clearSignupData" }),
  };
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signin: true, //IF SIGNIN TAB ACTIVE
      signup: false, //IF SIGNUP TAB ACTIVE

      googleSignup: false, //IF GOOGLE SIGNUP WINDOW VISIBLE
      showVerifyOtp: false, //IF OTP VERIFICATION SCREEN IS VISIBLE (DURING SIGNUP)
      showSetPassword: false, //IF PASSWORD ENTRY SCREEN IS VISIBLE (DURING SIGNUP)
    };
  }

  changeTabToSignup = () => {
    this.setState({
      signin: false,
      signup: true,

      googleSignup: false,
      showVerifyOtp: false,
      showSetPassword: false,
    });

    this.props.history.push("/signup");
  };

  changeTabToSignin = () => {
    this.setState({
      signin: true,
      signup: false,

      googleSignup: false,
      showVerifyOtp: false,
      showSetPassword: false,
    });
    this.props.history.push("/signin");
  };

  showVerifyOtp = () => {
    this.setState({ showVerifyOtp: true, signin: false, signup: false });
  };

  otpVerified = () => {
    this.setState({
      showVerifyOtp: false,
      signin: false,
      signup: false,
      googleSignup: false,
      showSetPassword: true,
    });
  };

  /**
   * INITIALLY SETTING THE VIEW OF THE COMPONENT BASED ON THE RECIEVED PROPS
   * PROPS CAN BE EITHER: signin, signup or googleSignup
   */
  setView = () => {
    if (this.props.signin) {
      this.changeTabToSignin();
    } else if (this.props.signup) {
      this.changeTabToSignup();
    } else if (this.props.googleSignup) {
      this.setState({
        signin: false,
        signup: false,
        showSetPassword: false,
        showVerifyOtp: false,
        googleSignup: true,
      });
    }
  };

  componentDidMount() {
    //Setting initial view of the component base on the props
    this.setView();
  }

  render() {
    //CSS Style to apply for the active tab SIGNIN or SIGNUP
    let style = {
      "background-color": "rgb(37, 35, 34)",
      color: "white",
    };

    return (
      <BrowserRouter>
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
                {this.state.showVerifyOtp ? (
                  <VerifyOtp otpVerified={this.otpVerified} />
                ) : null}
                {this.state.showSetPassword ? <SetPassword /> : null}
                {this.state.googleSignup ? <GoogleSignup /> : null}
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Login));
