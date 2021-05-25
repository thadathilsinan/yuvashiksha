import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import Question from "../Question/Question";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./Evaluation.css";
import http from "../../../shared/http";
import Images from "./Images/Images";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";

class Evaluation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: {},
      questionsParsed: null,
      showImages: false,
      total: 0,
    };
  }

  //Check if all props available
  checkProps = () => {
    if (!this.props.exam || !this.props.student) {
      document.location.href = "http://localhost:3000/teacher";
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
          if (this.state.answers.answers) {
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
            key={question.id}
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
      this.setState({ total });
    });
  };

  //Get answers from DB
  getAnswers = () => {
    http(
      "POST",
      "/teacher/previousexam/evaluate/getanswers",
      {
        exam: this.props.exam._id,
        student: this.props.student.id,
      },
      (res) => {
        if (res.status == 200) {
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
      { answers: this.state.answers.answers, id: this.state.answers._id },
      (res) => {
        alert(res.data);
      }
    );
  };

  componentDidMount() {
    this.getAnswers();

    console.log(this.props);
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
              <h5 style={{ display: "flex" }}>
                <Button
                  variant="primary"
                  className="btn btn-primary mr-3"
                  size="sm"
                  onClick={() => {
                    window.history.back();
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
                <Button
                  className="btn btn-light ml-5"
                  onClick={this.openImages}
                >
                  IMAGES
                </Button>
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

          {/* Footer */}
          {!this.state.showImages ? (
            <div id="evaluationFooter">
              <button className="btn btn-light">
                <GrLinkPrevious color="white" />
              </button>
              <button className="btn btn-light" onClick={this.saveMarks}>
                SAVE
              </button>
              <button className="btn btn-light">
                <GrLinkNext />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withRouter(Evaluation);
