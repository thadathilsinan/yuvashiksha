import React, { Component } from "react";
import NavBar from "../../../ui-elements/navBar/NavBar";
import { withRouter, Route } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaRegCheckCircle } from "react-icons/fa";
import "./startexam.css";
import $ from "jquery";
import Question from "../../../teacher/Question/Question";
import Canvas from "../../../ui-elements/Canvas/Canvas";

class StartExam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: {},
      seconds: 0,
      showCanvas: false,
      canvasQuestion: null,
      answers: {},
    };

    //For time left functionality
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);

    //For the qestion Paper header
    this.timeDuration = 0;
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

  //Parse the questions to display it
  parseQuestions = () => {
    let questionNumber = 0;

    if (!this.props.exam) return;

    return this.props.exam.questionPaper.map((question, index) => {
      //Count the question Number
      if (question.type != "header" && question.type != "text") {
        questionNumber++;
      }

      return (
        <Question
          question={question}
          index={questionNumber}
          key={question.id}
          canvasClick={
            question.type == "short" || question.type == "essay"
              ? () => {
                  this.openCanvas(question);
                }
              : null
          }
          optionChange={
            question.type == "mcq"
              ? (value) => this.mcqOptionChanged(question, value)
              : null
          }
          textChange={
            question.type == "short" || question.type == "essay"
              ? (value) => {
                  this.textChange(question, value);
                }
              : null
          }
          examMode //Indicate that the question is in the startExam component
        />
      );
    });
  };

  //Convert milliseconds to time format string
  msToTime = (s) => {
    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
      z = z || 2;
      return ("00" + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
  };

  //Calculate time duration of the exam
  calculateTimeDuration = () => {
    if (!this.props.exam) return;

    let to = new Date(`${this.props.exam.date},${this.props.exam.to}`);
    let from = new Date(`${this.props.exam.date},${this.props.exam.from}`);

    let differenceInMilliSeconds = to.getTime() - from.getTime();

    this.timeDuration = this.msToTime(differenceInMilliSeconds);
  };

  //Open the canvas
  openCanvas = (question) => {
    this.setState({ canvasQuestion: question, showCanvas: true });
  };

  //Close canvas
  closeCanvas = () => {
    this.setState({ showCanvas: false, canvasQuestion: null });
  };

  //Save Canvas
  saveCanvas = (image) => {
    //Saving image to the answers array
    let answers = { ...this.state.answers };

    if (answers[this.state.canvasQuestion.id])
      answers[this.state.canvasQuestion.id].canvas = image;
    else answers[this.state.canvasQuestion.id] = { canvas: image };

    this.setState({ answers, showCanvas: false, canvasQuestion: null });
  };

  //When the options of the MCQ changes
  mcqOptionChanged = (question, value) => {
    let answers = { ...this.state.answers };

    if (answers[question.id]) answers[question.id].answer = value;
    else answers[question.id] = { answer: value };

    this.setState({ answers });
  };

  //When the text of the SHORT , ESSAY question value changes
  textChange = (question, value) => {
    let answers = { ...this.state.answers };

    if (answers[question.id]) answers[question.id].answer = value;
    else answers[question.id] = { answer: value };

    this.setState({ answers });
  };

  componentDidMount() {
    this.preventPageRefresh();

    if (this.props.exam) {
      //Setting the inital value of the timer
      let currentTime = new Date();
      let examFinishTime = new Date(
        `${this.props.exam ? this.props.exam.date : ""},${
          this.props.exam ? this.props.exam.to : ""
        }`
      );

      let timeDiffrence = examFinishTime.getTime() - currentTime.getTime();

      this.setState({ seconds: timeDiffrence / 1000 }, () => {
        //Counting time left initial value setup
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });
      });
    }

    console.log(this.props);
  }

  render() {
    //Check the props availability
    this.checkProps();

    //Starting the couter of time left
    this.startTimer();

    //Calculate time duration of the exam
    this.calculateTimeDuration();

    return (
      <div>
        <Route path="/student/exam" exact>
          {/**SHOW CANVAS */}
          {this.state.showCanvas ? (
            <Canvas
              close={this.closeCanvas}
              save={this.saveCanvas}
              image={
                this.state.answers[this.state.canvasQuestion.id]
                  ? this.state.answers[this.state.canvasQuestion.id].canvas
                  : undefined
              }
            />
          ) : null}
          <NavBar>
            {{
              left: (
                <div>
                  Time left:{" "}
                  <h5>
                    {this.state.time.h}h {this.state.time.m}m{" "}
                    {this.state.time.s}s
                  </h5>
                </div>
              ),
              right: (
                <div>
                  <Button className="btn btn-success">
                    <FaRegCheckCircle size={28} />
                  </Button>
                </div>
              ),
            }}
          </NavBar>
          <div id="examBody">
            {this.props.exam ? (
              <Question
                question={{
                  type: "header",
                  examName: this.props.exam.examName,
                  subject: this.props.exam.subject,
                  date: this.props.exam.date,
                  Class: this.props.Class,
                  batch: this.props.batch,
                  marks: this.props.exam.totalMarks,
                  time: this.timeDuration,
                }}
              />
            ) : null}

            {this.parseQuestions()}
          </div>
        </Route>
      </div>
    );
  }
}

export default withRouter(StartExam);
