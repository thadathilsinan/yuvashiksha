import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Button } from "react-bootstrap";
import { BiPrinter } from "react-icons/bi";
import { Route, withRouter } from "react-router-dom";
import Evaluation from "../Evaluation/Evaluation";
import "./PreviousExam.css";
import http from "../../../shared/http";
import PrintPreview from "../../ui-elements/printPreview/PrintPreview";

class PreviousExam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      studentData: null,
      studentList: null,
      restrictAccess: false,
      showPrint: false,
      printData: null,
    };
  }

  checkProps = () => {
    if (!this.props.exam) {
      document.location.href = "http://localhost:3000/teacher";
    }
  };

  //Get the list of student who attended the exam
  getStudentList = () => {
    //Loading Screen
    window.showLoading();

    http(
      "POST",
      "/teacher/previousexam/getstudents",
      { exam: this.props.exam._id },
      (res) => {
        if (res.status == 200) {
          //hiding loadingScreen
          window.hideLoading();

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
                <p>
                  Marks: {student.marks}{" "}
                  {isNaN(student.marks)
                    ? null
                    : `/ ${this.props.exam.totalMarks}`}
                </p>
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

  //Next Button click in Evaluation Component
  nextStudent = () => {
    let students = this.state.studentData;

    for (let i in students) {
      if (this.state.selectedStudent == students[i]) {
        if (students[parseInt(i) + 1]) {
          this.setState({ selectedStudent: students[parseInt(i) + 1] });
        } else {
          alert("This is the last student");
        }
      }
    }
  };

  //Previous Button click in Evaluation Component
  prevStudent = () => {
    let students = this.state.studentData;

    for (let i in students) {
      if (this.state.selectedStudent == students[i]) {
        if (students[parseInt(i) - 1]) {
          this.setState({ selectedStudent: students[parseInt(i) - 1] });
        } else {
          alert("This is the first student");
        }
      }
    }
  };

  //Check Teacher access to evaluate the exam
  checkTeacherAccess = () => {
    if (!(this.props.exam.teacher == this.props.user)) {
      this.setState({ restrictAccess: true });
    }
  };

  //Publish the exam result
  publishResult = () => {
    if (window.confirm("Are you sure to publish exam result?")) {
      http(
        "POST",
        "/teacher/previousexam/publish",
        { exam: this.props.exam._id },
        (res) => {
          alert(res.data);
        }
      );
    }
  };

  //Print the exam result
  printResult = () => {
    if (window.confirm("Are you sure print the exam result?")) {
      http(
        "POST",
        "/teacher/previousexam/print",
        { exam: this.props.exam._id },
        (res) => {
          this.setState({ printData: res.data }, () => {
            this.openPrintPreview();
          });
        }
      );
    }
  };

  //open PrintPreviw component
  openPrintPreview = () => {
    this.setState({ showPrint: true });
  };

  //Close the printPreview component
  closePrintPreview = () => {
    this.setState({ showPrint: false });
  };

  componentDidMount() {
    this.getStudentList();
    this.checkTeacherAccess();

    console.log(this.props);
  }

  render() {
    this.checkProps();

    return (
      <>
        <Route path="/teacher/previousexam" exact>
          {/* PRINT PREVIEW  */}
          {this.state.showPrint ? (
            <PrintPreview
              data={this.state.printData}
              close={this.closePrintPreview}
            />
          ) : null}

          <div>
            <NavBar>
              {{
                left: (
                  <h5 style={{ display: "flex" }}>
                    <Button
                      variant="primary"
                      className="btn btn-primary mr-3"
                      id="navBack"
                      size="sm"
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Go back"
                      onClick={() => {
                        localStorage.setItem("back", "true");
                        localStorage.setItem("right", "true");
                        window.history.back();
                      }}
                    >
                      {"<"}
                    </Button>
                    <div>
                      {this.props.exam ? this.props.exam.examName : null}
                      <br />
                      {this.props.exam ? this.props.exam.subject : null}
                    </div>
                  </h5>
                ),
                right: (
                  <h4>
                    <Button
                      id="btn-print"
                      onClick={this.printResult}
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Print"
                    >
                      <BiPrinter />
                    </Button>
                    {this.state.restrictAccess ? null : (
                      <Button id="btn-publish" onClick={this.publishResult}>
                        PUBLISH
                      </Button>
                    )}
                  </h4>
                ),
              }}
            </NavBar>
            <div id="studentListContainer">{this.state.studentList}</div>
          </div>
        </Route>
        <Route path="/teacher/previousexam/evaluate">
          <Evaluation
            exam={this.props.exam}
            student={this.state.selectedStudent}
            studentList={this.state.studentData}
            next={this.nextStudent}
            prev={this.prevStudent}
            user={this.props.user}
            back={this.getStudentList}
          />
        </Route>
      </>
    );
  }
}

export default withRouter(PreviousExam);
