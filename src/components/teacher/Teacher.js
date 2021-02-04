import { Component } from "react";
import "./Teacher.css";

import NavBar from "../ui-elements/navBar/NavBar";
import TabView from "../ui-elements/TabView/TabView";
import ListItem from "../ui-elements/ListItem/ListItem";

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

class Teacher extends Component {
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
        console.log("Pushed to scheduled");
      }
    });
  };

  componentDidMount() {
    this.setExamData();
  }

  render() {
    return (
      <div>
        <NavBar>
          {{
            left: <h5>HOME</h5>,
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
            leftTabBody: <div id="leftTabBody">{this.examList}</div>,
            rightTabBody: <div id="rightTabBody">{this.previousExamList}</div>,
          }}
        </TabView>
        <div id="new-exam">
          <div id="floatButtonText">+</div>
        </div>
      </div>
    );
  }
}

export default Teacher;
