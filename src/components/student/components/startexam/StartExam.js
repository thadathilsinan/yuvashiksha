import React, { Component } from "react";
import NavBar from "../../../ui-elements/navBar/NavBar";
import { withRouter, Route, Redirect } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaRegCheckCircle } from "react-icons/fa";
import "./startexam.css";
import $ from "jquery";
import Question from "../../../teacher/Question/Question";
import Canvas from "../../../ui-elements/Canvas/Canvas";
import http from "../../../../shared/http";

//For camera purposes
let imageCapture = null;
let stream = null;

class StartExam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: {},
      seconds: 0,
      showCanvas: false,
      canvasQuestion: null,
      answers: {},
      images: [],
      completed: false,
    };

    //For time left functionality
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);

    //For the qestion Paper header
    this.timeDuration = 0;

    this.timeOutId = null;

    this.capturedImage = "initial";
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

  //Get user camera privillage
  getMediaStream = async () => {
    let flag = false;

    await window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (mediaStream) {
        stream = mediaStream;
        let mediaStreamTrack = mediaStream.getVideoTracks()[0];
        imageCapture = new ImageCapture(mediaStreamTrack);

        flag = true;
      })
      .catch((error) => {
        alert("Camera not accessible");
        console.log("Error getting camera : " + error);
        flag = false;
      });

    return flag;
  };

  //Take photo with camera
  takePhoto = async () => {
    return await imageCapture
      .takePhoto()
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            var reader = new FileReader();

            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              resolve(reader.result);
            };

            // window.URL.revokeObjectURL(url);
          })
      )
      .catch((err) => {
        console.log("Error capture photo  : " + err);
      });
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
    this.setState(
      {
        time: this.secondsToTime(seconds),
        seconds: seconds,
      },
      () => {
        // Check if we're at zero.
        if (seconds <= 0) {
          clearInterval(this.timer);
          this.examTimeOut();
        }
      }
    );
  }

  //Set the inital setup for the timer
  setUpTimer = () => {
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
  };

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

    this.setState({ answers, showCanvas: false, canvasQuestion: null }, () => {
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }

      this.uploadAnswers();
    });
  };

  //When the options of the MCQ changes
  mcqOptionChanged = (question, value) => {
    let answers = { ...this.state.answers };

    if (answers[question.id]) answers[question.id].answer = value;
    else answers[question.id] = { answer: value };

    this.setState({ answers }, () => {
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }

      this.timeOutId = setTimeout(this.uploadAnswers, 2000);
    });
  };

  //When the text of the SHORT , ESSAY question value changes
  textChange = (question, value) => {
    let answers = { ...this.state.answers };

    if (answers[question.id]) answers[question.id].answer = value;
    else answers[question.id] = { answer: value };

    this.setState({ answers }, () => {
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }

      this.timeOutId = setTimeout(this.uploadAnswers, 2000);
    });
  };

  //save changes to the db
  uploadAnswers = () => {
    http(
      "POST",
      "/student/saveanswers",
      {
        exam: this.props.exam._id,
        answers: this.state.answers,
        completed: this.state.completed,
      },
      (res) => {
        console.log(res.data);
      }
    );
  };

  //Check if the user data already present in the db, if true then restore data
  restoreExamData = () => {
    if (!this.props.exam) return;

    http(
      "POST",
      "/student/restoreexam",
      { exam: this.props.exam._id },
      (res) => {
        if (res.status == 200) {
          this.setState(
            {
              answers: res.data.answers,
              images: res.data.images,
            },
            () => {
              //Change the value of the input fields with the restore exam data
              let answers = this.state.answers;
              let questionType = null;

              for (let i in answers) {
                //Getting the type of question
                for (let question in this.props.exam.questionPaper) {
                  if (this.props.exam.questionPaper[question].id == i) {
                    questionType = this.props.exam.questionPaper[question].type;
                  }
                }

                if (questionType == "mcq") {
                  //Selecting the previosly selected option
                  window
                    .$(`#${i} input[value="${answers[i].answer}"]`)
                    .attr("checked", "true");
                } else if (questionType == "short") {
                  //Changing the value of the text field
                  window
                    .$(`#${i} input[type="text"]`)
                    .attr("value", answers[i].answer);
                } else if (questionType == "essay") {
                  //Changing the value of the textarea
                  $(`#${i} textarea`).html(answers[i].answer);
                }
              }
            }
          );
        }
      }
    );
  };

  //Check the camera of the user
  checkCamera = () => {
    this.getMediaStream().then((result) => {
      if (result) {
        //Camera access granted
        this.props.history.push("/student/exam");
        this.setUpFocusListeners();

        this.randomImageCapture();
      } else {
        //Camera access failed
        this.props.history.push("/student");
      }
    });
  };

  //Get random number in a particular range
  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //random image capture and save into the images state
  randomImageCapture = () => {
    //Time gap to capture next image
    let nextCall = this.getRandomInt(60 * 5, 60 * 10); //Time between 5 - 10 minutes (in seconds)

    this.takePhoto().then((image) => {
      //Saving changes to db
      this.uploadImage(image);

      //Setting the next photo capture
      setTimeout(this.randomImageCapture, nextCall * 1000);
    });
  };

  //Upload image to the db
  uploadImage = (image) => {
    http(
      "POST",
      "/student/uploadimage",
      { image, exam: this.props.exam._id },
      (res) => {
        if (res.status == 200) {
          let newImages = [...this.state.images];
          newImages.push(res.data.image);

          this.setState({ images: newImages }, () => {
            if (this.timeOutId) {
              clearTimeout(this.timeOutId);
            }

            this.uploadAnswers();
          });
        }
      }
    );
  };

  //type the value of the equation picker into the textfields
  typeEquation = (event) => {
    let equationSelected = event.target.innerHTML;

    if (this.lastfocusedInput) this.lastfocusedInput.value += equationSelected;
  };

  //used for knowing the last selected input field
  setUpFocusListeners = () => {
    let inputElements = window.$("input[type=text], textarea");

    inputElements.on("focus", (event) => {
      this.lastfocusedInput = event.target;
    });
  };

  //Called when click the finish button in the exam page
  finishExam = () => {
    if (
      window.confirm("You have some more time, Are you sure to finish exam ? ")
    ) {
      //Turn off camera
      const tracks = stream.getTracks();

      tracks.forEach(function (track) {
        track.stop();
      });

      this.setState({ completed: true }, () => {
        this.uploadAnswers();

        alert("Exam Completed successfully");
        this.props.history.push("/student");
      });
    }
  };

  //Called when exam time completes
  examTimeOut = () => {
    this.setState({ completed: true }, () => {
      this.uploadAnswers();

      //Turn off camera
      const tracks = stream.getTracks();

      tracks.forEach(function (track) {
        track.stop();
      });

      alert("Exam time out! Exam data save successfully");
      this.props.history.push("/student");
    });
  };

  componentDidMount() {
    this.preventPageRefresh();

    this.setUpTimer();

    this.restoreExamData();

    this.checkCamera();

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
                  <Button className="btn btn-success" onClick={this.finishExam}>
                    <FaRegCheckCircle size={28} />
                  </Button>
                </div>
              ),
            }}
          </NavBar>
          <div id="equationsBar">
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              π
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              Δ
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              ∞
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              ∑
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              φ
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              μ
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              σ
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              λ
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              Ø
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              ^
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              ε
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              ∫
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              θ
            </div>
            <div
              className="equationItem text-center"
              onClick={this.typeEquation}
            >
              Ω
            </div>
          </div>
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
        <Route path="/student/exam/checkcamera" exact>
          <div
            className="d-flex align-items-center justify-content-center"
            id="check-camera"
          >
            <h5>CHECKING YOUR WEBCAM ...</h5>
          </div>
        </Route>
      </div>
    );
  }
}

export default withRouter(StartExam);
