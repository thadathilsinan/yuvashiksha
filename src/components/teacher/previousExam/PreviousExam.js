import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Button } from "react-bootstrap";
import { BiPrinter } from "react-icons/bi";
import { Route, withRouter } from "react-router-dom";
import Evaluation from "../Evaluation/Evaluation";
import "./PreviousExam.css";
import http from "../../../shared/http";

class PreviousExam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      studentData: null,
      studentList: null,
    };
  }

  checkProps = () => {
    if (!this.props.exam) {
      window.history.back();
    }
  };

  //Get the list of student who attended the exam
  getStudentList = () => {
    http(
      "POST",
      "/teacher/previousexam/getstudents",
      { exam: this.props.exam._id },
      (res) => {
        if (res.status == 200) {
          this.setState({ studentData: res.data }, () => {
            this.setupStudentList();
          });
        }
      }
    );
  };

  //Setup the list of students
  setupStudentList = () => {
    let studentList = this.state.studentData.map((student, index, array) => {
      return (
        <ListItem
          height="100px"
          key={student.id}
          onClick={() => this.openEvaluation(student)}
        >
          {{
            left: (
              <div id="leftListItem">
                <p>Name: {student.name}</p>
                <p>Register Number: {student.registerNumber}</p>
              </div>
            ),
            right: (
              <div id="rightListItem">
                <p>Marks: {student.marks}</p>
              </div>
            ),
          }}
        </ListItem>
      );
    });

    this.setState({ studentList });
  };

  //Open evaluation window
  openEvaluation = (student) => {
    this.setState({ selectedStudent: student }, () => {
      this.props.history.push("/teacher/previousexam/evaluate");
    });
  };

  componentDidMount() {
    this.getStudentList();

    console.log(this.props);
  }

  render() {
    this.checkProps();

    return (
      <>
        <Route path="/teacher/previousexam" exact>
          <div>
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
                      {this.props.exam.examName}
                      <br />
                      {this.props.exam.subject}
                    </div>
                  </h5>
                ),
                right: (
                  <h4>
                    <Button className="btn btn-light">
                      <BiPrinter />
                    </Button>
                    <Button className="btn btn-success ml-2">PUBLISH</Button>
                  </h4>
                ),
              }}
            </NavBar>
            <div id="studentListContainer">{this.state.studentList}</div>
          </div>
        </Route>
        <Route path="/teacher/previousexam/evaluate">
          <Evaluation
            exam={this.props.exam._id}
            student={this.state.selectedStudent}
          />
        </Route>
      </>
    );
  }
}

export default withRouter(PreviousExam);
