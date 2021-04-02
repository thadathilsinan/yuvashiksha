import React, { Component } from "react";
import "./QuestionPaperPreview.css";

import NavBar from "../../ui-elements/navBar/NavBar";
import { BsPencil, BsDash } from "react-icons/bs";
import { Row, Col, Button } from "react-bootstrap";
import Question from "../Question/Question";
import { Route, withRouter, Switch } from "react-router-dom";
import NewExam from "../newExam/NewExam";

class QuestionPaperPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.timeDuration = 0;
  }

  //Parse the questions to display it
  parseQuestions = () => {
    let questionNumber = 0;

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
    let to = new Date(`${this.props.exam.date},${this.props.exam.to}`);
    let from = new Date(`${this.props.exam.date},${this.props.exam.from}`);

    let differenceInMilliSeconds = to.getTime() - from.getTime();

    this.timeDuration = this.msToTime(differenceInMilliSeconds);
  };

  //Open edit exam page
  openEditExam = () => {
    console.log(this.props);
    this.Class = this.props.Class;
    this.batch = this.props.batch;

    this.props.history.push("/teacher/previewexam/editexam");
  };

  render() {
    //Calculate time duration of the exam
    this.calculateTimeDuration();

    return (
      <>
        <Switch>
          <Route path="/teacher/previewexam/editexam">
            <NewExam
              exam={this.props.exam}
              Class={this.Class}
              batch={this.batch}
            />
          </Route>
          <Route path="/teacher/previewexam" exact>
            <div>
              <NavBar>
                {{
                  left: (
                    <div>
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
                      <h5>PREVIEW QUESTION PAPER</h5>
                    </div>
                  ),
                  right: (
                    <h5>
                      <Row>
                        <Col>
                          <Button
                            className="btn btn-light ml-3 "
                            onClick={this.openEditExam}
                          >
                            <BsPencil />
                          </Button>
                        </Col>
                        <Col>
                          <Button className="btn btn-light ml-3 ">
                            <BsDash />
                          </Button>
                        </Col>
                      </Row>
                    </h5>
                  ),
                }}
              </NavBar>
              {/* Body of the question paper */}
              <div id="previewExamBody">
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
                {this.parseQuestions()}
              </div>
            </div>
          </Route>
        </Switch>
      </>
    );
  }
}

export default withRouter(QuestionPaperPreview);
