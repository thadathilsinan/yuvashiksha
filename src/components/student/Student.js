import React, { Component } from "react";
import NavBar from "../ui-elements/navBar/NavBar";
import TabView from "../ui-elements/TabView/TabView";
import ExamGuidlines from "./components/examguidelines/ExamGuidlines";
import ListItem from "../ui-elements/ListItem/ListItem";
import StartExam from "./components/startexam/StartExam";
import { Link, BrowserRouter, Route, withRouter } from "react-router-dom";
import StudentProfile from "./components/StudentProfile/StudentProfile";
import { FaUserCircle } from "react-icons/fa";
import "./Student.css";
import http from "../../shared/http";
import configuireDialogBox from "../../shared/dailogBox";

class Student extends Component {
  constructor(props) {
    super(props);

    this.state = {
      examData: [],
      examList: [],
      previousExamList: [],
      selectedExam: null,
    };
  }

  //Get exam data from the server
  getExamData = () => {
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
          <ListItem height="100px" key={item._id}>
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
                  <p>{item.marks} Marks</p>
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
                  <p>{item.marks} Marks</p>
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

      if (currentTime.getTime() > startTime.getTime()) {
        //Exam start time reached
        alert("CAN OPEN EXAM");
      } else {
        // window.$("#warning").modal("show");
        this.openExamGuidlines();
      }
    });
  };

  //Open the exam guidlines page
  openExamGuidlines = () => {
    this.props.history.push("/student/startexam");
  };

  componentDidMount() {
    this.openWelcomDialog();
    this.getExamData();

    //Refersh the exam list every minute
    setInterval(() => {
      this.getExamData();
    }, 60 * 1000);

    console.log(this.props);
  }
  render() {
    return (
      <>
        <Route path="/student/profile" exact>
          <StudentProfile
            user={this.props.user.user}
            Class={this.props.user.Class}
            batch={this.props.user.batch}
            department={this.props.user.department}
          />
        </Route>
        <Route path="/student/startexam" exact>
          <ExamGuidlines exam={this.state.selectedExam} />
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
