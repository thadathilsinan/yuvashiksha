import { Component } from "react";
import { connect } from "react-redux";
import "./verifyOtp.css";

import { serverDomain } from "../../../config";
import axios from "axios";

const mapStateToProps = (state) => {
  return {
    signupData: state.login.signupData,
    validSignupData: state.login.validSignupData,
  };
};

class VerifyOtp extends Component {
  constructor(props) {
    super(props);
    this.state = { time: {}, seconds: 1 * 5, resendEnable: false };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);
      this.setState({ resendEnable: true });
    }
  }

  resendOtp = () => {
    console.log(this.props);
    if (this.props.validSignupData) {
      axios({
        method: "POST",
        url: "http://localhost:4000/register",
        data: this.props.signupData,
      })
        .then((response) => {
          console.log(`POST request send to ${serverDomain}/register`);
          console.log("Response from server: ", response);
        })
        .catch((err) => {
          alert("Error occured during signup. \n Check console for log data");
          console.log(err);
        });
    }
  };

  render() {
    this.startTimer();

    return (
      <form>
        <center>
          <p id="info-text">An OTP has been sent to your email</p>
        </center>
        <div className="form-group">
          <label for="otp">Enter OTP</label>
          <br />
          <input
            type="text"
            name="otp"
            id="otp"
            placeholder="OTP"
            className="form-control mt-3"
          />
          <p>
            Resend OTP: {this.state.time.m}:{this.state.time.s}
          </p>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-secondary"
            id="resend-otp"
            disabled={!this.state.resendEnable}
            onClick={this.resendOtp}
          >
            RESEND OTP
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button type="button" className="btn btn-success" id="proceed">
            PROCEED
          </button>
        </div>
      </form>
    );
  }
}

export default connect(mapStateToProps)(VerifyOtp);
