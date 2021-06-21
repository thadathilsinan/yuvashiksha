import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import Question from "../Question/Question";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./Evaluation.css";
import http from "../../../shared/http";
import Images from "./Images/Images";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";
import $ from "jquery";
import { BsImages } from "react-icons/bs";
import { IoIosSave } from "react-icons/io";

import config from "../../../config";
class Evaluation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: {},
      questionsParsed: null,
      showImages: false,
      total: 0,
      restrictAccess: false,
    };
  }

  //Check if all props available
  checkProps = () => {
    if (!this.props.exam || !this.props.student) {
      document.location.href = config.clientUrl + "/teacher";
    }
  };

  //Parse the questions to display it
  parseQuestions = () => {
    let questionNumber = 0;

    if (!this.props.exam) return;

    let questionsParsed = this.props.exam.questionPaper.map(
      (question, index) => {
        let answer = null;
        let canvas = null;
        let marks = null;

        //Count the question Number
        if (question.type != "header" && question.type != "text") {
          questionNumber++;

          //Getting the answer written by the student
          if (
            this.state.answers.answers &&
            this.state.answers.answers[question.id]
          ) {
            answer = this.state.answers.answers[question.id].answer;
            if (this.state.answers.answers[question.id].canvas) {
              canvas = this.state.answers.answers[question.id].canvas;
            }

            marks = this.state.answers.answers[question.id].marks;
          }
        }

        return (
          <Question
            question={question}
            index={questionNumber}
            key={`${Date.now()}${question.id}`}
            answer={answer}
            canvas={canvas}
            onMarksChange={this.changeMarks}
            marks={marks}
            evaluationMode //Indicate that the Question is contained in the Evaluation Component
          />
        );
      }
    );

    this.setState({ questionsParsed }, () => {
      //Calculate total marks
      let total = this.calcTotalMarks();
      this.setState({ total }, () => {
        if (this.state.restrictAccess) {
          let inputs = window.$("input[type=number]");
          inputs.attr("disabled", "disabled");
        }
      });
    });
  };

  //Get answers from DB
  getAnswers = () => {
    //Loading Screen
    window.showLoading();

    http(
      "POST",
      "/teacher/previousexam/evaluate/getanswers",
      {
        exam: this.props.exam._id,
        student: this.props.student.id,
      },
      (res) => {
        if (res.status == 200) {
          //hiding loadingScreen
          window.hideLoading();

          this.setState({ answers: res.data }, () => {
            this.parseQuestions();
          });
        }
      }
    );
  };

  //Open images captured
  openImages = () => {
    this.setState({ showImages: true });
    //Loading Screen
    window.showLoading();
  };

  //Close images
  closeImages = () => {
    this.setState({ showImages: false });
  };

  //Change marks
  changeMarks = (marks, questionId) => {
    let answers = this.state.answers;

    answers.answers[questionId].marks = marks;
    this.setState({ answers }, () => {
      let total = this.calcTotalMarks();
      this.setState({ total });
    });
  };

  //Calculate total marks
  calcTotalMarks = () => {
    let answers = this.state.answers.answers;
    let total = 0;

    for (let i in answers) {
      if (answers[i].marks) total += parseInt(answers[i].marks);
    }

    return total;
  };

  //Save the marks to the DB
  saveMarks = () => {
    http(
      "POST",
      "/teacher/previousexam/evaluate/savemarks",
      {
        answers: this.state.answers.answers,
        id: this.state.answers._id,
        total: this.state.total,
      },
      (res) => {
        alert(res.data);
      }
    );
  };

  //Check Teacher access to evaluate the exam
  checkTeacherAccess = () => {
    if (!(this.props.exam.teacher == this.props.user)) {
      this.setState({ restrictAccess: true });
    }
  };

  //student previous exam mode
  checkStudentMode = () => {
    if (this.props.studentMode) {
      this.setState({ restrictAccess: true });
    }
  };

  componentDidMount() {
    this.getAnswers();
    this.checkTeacherAccess();

    console.log(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.student.id != prevProps.student.id) {
      this.getAnswers();
    }
  }

  render() {
    this.checkProps();

    return (
      <div>
        {/* IMAGES  */}
        {this.state.showImages ? (
          <Images close={this.closeImages} images={this.state.answers.images} />
        ) : null}

        <NavBar>
          {{
            left: (
              <h5 style={{ display: "flex" }} className="evalution">
                <Button
                  variant="primary"
                  className="btn btn-primary mr-3"
                  id="navBack"
                  size="sm"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Go back"
                  onClick={() => {
                    window.history.back();
                    if (this.props.back) {
                      this.props.back();
                    }
                  }}
                >
                  {"<"}
                </Button>
                <div>
                  Student Name: {this.props.student.name}
                  <br />
                  Reg. No: {this.props.student.registerNumber}
                </div>
              </h5>
            ),
            right: (
              <h5>
                TOTAL MARKS: {this.state.total} / {this.props.exam.totalMarks}
                {this.props.studentMode ? null : (
                  <>
                    <button
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Previous answer"
                      className="btn"
                      onClick={this.props.prev}
                    >
                      <GrLinkPrevious color="white" />
                    </button>
                    <button
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Next answer"
                      className="btn"
                      id="btn-next"
                      onClick={this.props.next}
                    >
                      <GrLinkNext />
                    </button>
                    <Button
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Images Captured at Exam time"
                      id="btn-img"
                      onClick={this.openImages}
                    >
                      <BsImages />
                    </Button>{" "}
                  </>
                )}
                {this.state.restrictAccess ? null : (
                  <button
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Save Marks"
                    className="btn "
                    onClick={this.saveMarks}
                  >
                    <IoIosSave />
                  </button>
                )}
              </h5>
            ),
          }}
        </NavBar>
        <div id="bodyContainer">
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
          {this.state.questionsParsed}
        </div>
      </div>
    );
  }
}

export default withRouter(Evaluation);
