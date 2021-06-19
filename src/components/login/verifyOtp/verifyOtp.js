import { Component } from "react";
import "./verifyOtp.css";

import http from "../../../shared/http";
class VerifyOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: {},
      seconds: 20,
      resendEnable: false,
      otp: "",
      otpError: null,
    };
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

  resetTimer() {
    let timeLeftVar = this.secondsToTime(20);
    this.setState({ time: timeLeftVar, resendEnable: false });
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
    http("POST", "/register/resendotp", {}, (res) => {
      if (res.status == 200) {
        console.log("OTP resend");
        this.resetTimer();
      } else {
        alert(
          `Error ${res.status} during otp resend\nError message logged in console.`
        );
        console.log(res);
      }
    });
  };

  showAlert = () => {};

  proceed = () => {
    if (this.state.otp.length > 0) {
      this.setState({ otpError: null });

      http(
        "POST",
        "/register/otp",
        {
          otp: this.state.otp,
        },
        (res) => {
          console.log("OTP Sent to server");
          if (res.status == 203) {
            console.log(res.data);
            alert("OTP Not verified: " + res.data);
          } else {
            console.log("OTP verification Success");
            this.props.otpVerified();
          }
        }
      );
    } else {
      this.setState({ otpError: <p>Please enter OTP</p> });
    }
  };

  otpChange = (event) => {
    if (this.state.otp.length > 0) {
      this.setState({ otpError: null });
    }
    this.setState({ otp: event.target.value });
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
            value={this.state.otp}
            onChange={this.otpChange}
          />
          {this.state.otpError}
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
          <button
            type="button"
            className="btn btn-success"
            id="proceed"
            onClick={this.proceed}
          >
            PROCEED
          </button>
        </div>
      </form>
    );
  }
}

export default VerifyOtp;
