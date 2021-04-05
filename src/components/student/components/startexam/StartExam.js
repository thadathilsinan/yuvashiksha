import React, { Component } from "react";
import NavBar from "../../../ui-elements/navBar/NavBar";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import { AiOutlineCheck } from "react-icons/ai";
import "./startexam.css";
import $ from "jquery";

class StartExam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: {},
      seconds: 0,
    };

    //For time left functionality
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  //Check if all props are correctly available
  checkProps = () => {
    if (!this.props.exam) {
      alert("Reloading the page will return you to the homepage");
      window.history.back();
    }
  };

  //Prevent user page refresh
  preventPageRefresh = () => {
    window.onbeforeunload = function () {
      alert("Reloading the page will return you to the homepage");

      return "Reloading the page will stop the current examination. Are you sure ?";
    };
  };

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

  componentDidMount() {
    this.preventPageRefresh();

    //Setting the inital value of the timer
    let currentTime = new Date();
    let examFinishTime = new Date(
      `${this.props.exam ? this.props.exam.date : ""},${
        this.props.exam ? this.props.exam.to : ""
      }`
    );

    let timeDiffrence = examFinishTime.getTime() - currentTime.getTime();

    console.log(timeDiffrence);

    this.setState({ seconds: timeDiffrence / 1000 }, () => {
      //Counting time left initial value setup
      let timeLeftVar = this.secondsToTime(this.state.seconds);
      this.setState({ time: timeLeftVar });
    });

    console.log(this.props);
  }

  render() {
    //Check the props availability
    this.checkProps();

    //Starting the couter of time left
    this.startTimer();

    return (
      <div>
        <NavBar>
          {{
            left: (
              <div>
                <h5>
                  TIME LEFT: {this.state.time.h}h {this.state.time.m}m{" "}
                  {this.state.time.s}s
                </h5>
              </div>
            ),
            right: (
              <div>
                <Button className="btn btn-success">
                  <AiOutlineCheck />
                </Button>
              </div>
            ),
          }}
        </NavBar>
        <div id="examBody"></div>
      </div>
    );
  }
}

export default withRouter(StartExam);
