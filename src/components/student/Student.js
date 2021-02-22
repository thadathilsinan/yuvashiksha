import React, { Component } from "react";
import NavBar from "../ui-elements/navBar/NavBar";
import TabView from "../ui-elements/TabView/TabView";
import ExamGuidlines from "./components/ExamGuidlines";
import ListItem from "../ui-elements/ListItem/ListItem";
import StartExam from "./components/startexam/StartExam";
import { Link, BrowserRouter, Route } from "react-router-dom";
import "./Student.css";
let examData = [
  {
    name: "Name of Exam",
    subject: "Subject",
    from: "9:00:00",
    to: "12:00:00",
    marks: 80,
    date: "12-01-2021", //mm-dd-yyyy
  },
  {
    name: "Name of Exam",
    subject: "Subject",
    from: "9:00:00",
    to: "12:00:00",
    marks: 80,
    date: "08-01-2021", //mm-dd-yyyy
  },
  {
    name: "Name of Exam",
    subject: "Subject",
    from: "9:00:00",
    to: "12:00:00",
    marks: 80,
    date: "01-01-2021", //mm-dd-yyyy
  },
];

export default class Student extends Component {
  examList = [];
  previousExamList = [];

  setExamData = () => {
    console.log("CAlled");
    let currentTime = new Date();

    examData.map((item) => {
      let examDate = new Date(`${item.date},${item.to}`);

      if (currentTime.getTime() > examDate.getTime()) {
        this.previousExamList.push(
          <ListItem height="100px">
            {{
              left: (
                <div id="leftListItem">
                  <p>{item.name}</p>
                  <p>{item.subject}</p>
                  <p>{item.date}</p>
                </div>
              ),
              right: (
                <div id="rightListItem">
                  <p>
                    {item.from} - {item.to}
                  </p>
                  <p>{item.marks} Marks</p>
                </div>
              ),
            }}
          </ListItem>
        );
        console.log("pushed to prev");
      } else {
        this.examList.push(
          <ListItem height="100px">
            {{
              left: (
                <div id="leftListItem">
                  <p>{item.name}</p>
                  <p>{item.subject}</p>
                  <p>{item.date}</p>
                </div>
              ),
              right: (
                <div id="rightListItem">
                  <p>
                    {item.from} - {item.to}
                  </p>
                  <p>{item.marks} Marks</p>
                </div>
              ),
            }}
          </ListItem>
        );
      }
    });
  };

  componentDidMount() {
    this.setExamData();
    this.forceUpdate();
  }
  render() {
    return (
      <div className="root">
        <div>
          <BrowserRouter>
            <Route path="/student" exact>
              <NavBar>
                {{
                  left: <h5>HOME</h5>,
                }}
              </NavBar>
              <TabView>
                {{
                  leftTab: <span>SCHEDULED EXAMS</span>,
                  rightTab: <span>PREVIOUS EXAMS</span>,
                  leftTabBody: <div id="leftTabBody">{this.examList}</div>,
                  rightTabBody: (
                    <div id="rightTabBody">{this.previousExamList}</div>
                  ),
                }}
              </TabView>
            </Route>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}
