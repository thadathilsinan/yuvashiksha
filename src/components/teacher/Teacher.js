import { Component } from "react";
import "./Teacher.css";

import NavBar from "../ui-elements/navBar/NavBar";
import TabView from "../ui-elements/TabView/TabView";
import ListItem from "../ui-elements/ListItem/ListItem";
import NewExam from "./newExam/NewExam";
import TeacherProfile from "./TeacherProfile/TeacherProfile";

import { Route, withRouter } from "react-router-dom";

class Teacher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      examData: [
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
      ],
      examList: [],
      previousExamList: [],
    };
  }

  setExamData = () => {
    let currentTime = new Date();
    let previousExamList = [...this.state.previousExamList];
    let examList = [...this.state.examList];

    for (let item of this.state.examData) {
      console.log("triggered");
      let examDate = new Date(`${item.date},${item.to}`);

      let newItem = (
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

      if (currentTime.getTime() > examDate.getTime()) {
        previousExamList.push(newItem);

        console.log("prev", previousExamList);
      } else {
        examList.push(newItem);

        console.log("sch", examList);
      }
    }
    this.setState({
      previousExamList,
      examList,
    });
  };

  newExam = () => {
    this.props.history.push("/teacher/newexam");
  };

  //Opens the teacher profile view
  openProfile = () => {
    this.props.history.push("/teacher/profile");
  };

  componentDidMount() {
    this.setExamData();
  }

  render() {
    return (
      <div>
        <Route path="/teacher" exact>
          <NavBar>
            {{
              left: <h5 onClick={this.openProfile}>{this.props.user.name}</h5>,
              right: (
                <div className="container" id="NavBarRight">
                  <div className="row">
                    <div
                      className="col-sm-4 align-self-center"
                      id="NavBarInfoText"
                    >
                      <p>Select Class and Batch : </p>
                    </div>
                    <div className="col-sm-4">
                      <select
                        className="form-select mt-3"
                        name="class"
                        id="class"
                      >
                        <option value="">Class</option>
                        <option value="CS">CS</option>
                        <option value="Commerce">Commerce</option>
                      </select>
                    </div>
                    <div className="col-sm-4">
                      <select
                        className="form-select mt-3"
                        name="batch"
                        id="batch"
                      >
                        <option value="">Batch</option>
                        <option value="2018-21">2018-21</option>
                        <option value="2019-22">2019-22</option>
                      </select>
                    </div>
                  </div>
                </div>
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
          <div id="new-exam" onClick={this.newExam}>
            <div id="floatButtonText">+</div>
          </div>
        </Route>
        <Route path="/teacher/newexam">
          <NewExam />
        </Route>
        <Route path="/teacher/profile">
          <TeacherProfile user={this.props.user} />
        </Route>
      </div>
    );
  }
}

export default withRouter(Teacher);
