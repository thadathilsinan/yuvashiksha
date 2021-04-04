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

class Student extends Component {
  constructor(props) {
    super(props);

    this.state = {
      examData: [],
      examList: [],
      previousExamList: [],
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
      }
    });

    //Changing the state
    this.setState({ examList, previousExamList });
  };

  //Open the profile of the student account
  openProfile = () => {
    this.props.history.push("/student/profile");
  };

  componentDidMount() {
    this.getExamData();

    console.log(this.props);
  }
  render() {
    return (
      <>
        <Route path="/student/profile">
          <StudentProfile
            user={this.props.user.user}
            Class={this.props.user.Class}
            batch={this.props.user.batch}
            department={this.props.user.department}
          />
        </Route>
        <Route path="/student">
          <div>
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
            {/* <ExamGuidlines/> */}
          </div>
        </Route>
      </>
    );
  }
}

export default withRouter(Student);
