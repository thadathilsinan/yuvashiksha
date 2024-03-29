import React, { Component } from "react";
import NavBar from "../ui-elements/navBar/NavBar";
import TabView from "../ui-elements/TabView/TabView";
import ExamGuidlines from "./components/examguidelines/ExamGuidlines";
import ListItem from "../ui-elements/ListItem/ListItem";
import StartExam from "./components/startexam/StartExam";
import { Link, BrowserRouter, Route, withRouter } from "react-router-dom";
import StudentProfile from "./components/StudentProfile/StudentProfile";
import { FaChessKing, FaUserCircle } from "react-icons/fa";
import "./Student.css";
import http from "../../shared/http";
import configuireDialogBox from "../../shared/dailogBox";

import Evaluation from "../teacher/Evaluation/Evaluation";
import { data } from "jquery";

class Student extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: {},
      examData: [],
      examList: [],
      previousExamList: [],
      selectedExam: null,
      webcam: { webcam: "webcam object here" },
      examListRefreshTimer: null,
    };
  }

  //Get exam data from the server
  getExamData = () => {
    console.log("Refreshed");
    http("GET", "/student/exams", {}, (res) => {
      if (res.status == 200) {
        this.setState({ examData: res.data }, () => {
          this.setExamData();
        });
      }
    });
  };

  //Setup the list items for the exams
  setExamData = () => {
    let examList = [];
    let previousExamList = [];

    let currentTime = new Date();

    this.state.examData.map((item) => {
      let examDate = new Date(`${item.date},${item.to}`);
      let startTime = new Date(`${item.date},${item.from}`);

      if (currentTime.getTime() > examDate.getTime()) {
        previousExamList.push(
          <ListItem
            height="100px"
            key={item._id}
            onClick={() => this.openPreviousExam(item)}
          >
            {{
              left: (
                <div id="leftListItem">
                  <p>Exam Name: {item.examName}</p>
                  <p>Subject: {item.subject}</p>
                  <p>Date: {item.date}</p>
                </div>
              ),
              right: (
                <div id="rightListItem">
                  <p>
                    Time: {item.from} - {item.to}
                  </p>
                  <p>{item.totalMarks} Marks</p>
                </div>
              ),
            }}
          </ListItem>
        );
      } else {
        examList.push(
          <ListItem
            height="100px"
            key={item._id}
            green={currentTime.getTime() > startTime.getTime() ? true : null}
            onClick={() => this.openScheduledExam(item)}
          >
            {{
              left: (
                <div id="leftListItem">
                  <p>Exam Name: {item.examName}</p>
                  <p>Subject: {item.subject}</p>
                  <p>Date: {item.date}</p>
                </div>
              ),
              right: (
                <div id="rightListItem">
                  <p>
                    Time: {item.from} - {item.to}
                  </p>
                  <p>{item.totalMarks} Marks</p>
                </div>
              ),
            }}
          </ListItem>
        );
      }
    });

    //Changing the state
    this.setState({ examList, previousExamList });
  };

  //Open the profile of the student account
  openProfile = () => {
    this.props.history.push("/student/profile");
  };

  //Open the welcome dialog box
  openWelcomDialog = () => {
    window.$("#welcome").modal("show");
  };

  //Open the scheduled exam
  openScheduledExam = (item) => {
    this.setState({ selectedExam: item }, () => {
      let startTime = new Date(`${item.date},${item.from}`);
      let currentTime = new Date();
      let stoptime = new Date(`${item.date},${item.to}`);

      if (currentTime.getTime() > stoptime.getTime()) {
        alert("Exam time ended! Cannot write exam");
        return;
      }

      if (currentTime.getTime() > startTime.getTime()) {
        //Exam start time reached
        this.openExamGuidlines();
      } else {
        window.$("#warning").modal("show");
      }
    });
  };

  //open previous exam
  openPreviousExam = (item) => {
    this.setState({ selectedExam: item }, () => {
      http(
        "POST",
        "/teacher/previousexam/getstudents",
        { exam: item._id },
        (res) => {
          if (res.status == 200) {
            for (const student of res.data) {
              console.log(student, this.props.user);
              if (student.id == this.props.user.user._id) {
                this.setState({ student }, () => {
                  this.props.history.push("/student/previousexam");
                });
                break;
              }
            }
          }
        }
      );
    });
  };

  //Open the exam guidlines page
  openExamGuidlines = () => {
    this.props.history.push("/student/guidelines");
  };

  //Refesh exam list
  refreshExamList = () => {
    let timer = setInterval(this.getExamData, 1000 * 30); //Refresh every 30 sec
    this.setState({ examListRefreshTimer: timer });
  };

  componentDidMount() {
    this.openWelcomDialog();
    this.getExamData();

    //Refresh exam List
    this.refreshExamList();

    console.log(this.props);
  }

  render() {
    return (
      <>
        <Route path="/student/previousexam" exact>
          <Evaluation
            exam={this.state.selectedExam}
            studentMode
            student={this.state.student}
          />
        </Route>
        <Route path="/student/profile" exact>
          <StudentProfile
            user={this.props.user.user}
            Class={this.props.user.Class}
            batch={this.props.user.batch}
            department={this.props.user.department}
          />
        </Route>

        <Route path="/student/guidelines" exact>
          <ExamGuidlines
            exam={this.state.selectedExam}
            webcam={this.state.webcam}
          />
        </Route>

        <Route path="/student/exam">
          <StartExam
            exam={this.state.selectedExam}
            webcam={this.state.webcam}
          />
        </Route>

        <Route path="/student" exact>
          <div>
            {/* Configure the welcome modal */}
            {configuireDialogBox(
              "welcome",
              "Welcome " + this.props.user.user.name,
              <>
                You can start writing the exams which are displayed in{" "}
                <span style={{ backgroundColor: "lightgreen" }}>
                  LIGHT GREEN
                </span>{" "}
                color.
                <br />
                You an use the PREVIOUS EXAMS tab to view your previous exam
                informations.
              </>,
              <input
                type="button"
                className="btn btn-primary"
                value="GOT IT"
                data-toggle="modal"
                data-target="#welcome"
              />
            )}
            {/* Configure the dialog box to show warning about the exam start timne */}
            {configuireDialogBox(
              "warning",
              "Information",
              <>
                Your exam is not yet started! Please check the examination time
                and try again after some time
              </>,
              <input
                type="button"
                className="btn btn-primary"
                value="OK"
                data-toggle="modal"
                data-target="#warning"
              />
            )}
            <NavBar>
              {{
                left: (
                  <h5 id="profileText" onClick={this.openProfile}>
                    <FaUserCircle className="mr-3 ml-3" size={40} />
                    {this.props.user.user.name}
                  </h5>
                ),
              }}
            </NavBar>
            <TabView>
              {{
                leftTab: <span>SCHEDULED EXAMS</span>,
                rightTab: <span>PREVIOUS EXAMS</span>,
                leftTabBody: <div id="leftTabBody">{this.state.examList}</div>,
                rightTabBody: (
                  <div id="rightTabBody">{this.state.previousExamList}</div>
                ),
              }}
            </TabView>
          </div>
        </Route>
      </>
    );
  }
}

export default withRouter(Student);
