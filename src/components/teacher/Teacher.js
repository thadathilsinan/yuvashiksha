import { Component } from "react";
import "./Teacher.css";

import NavBar from "../ui-elements/navBar/NavBar";
import TabView from "../ui-elements/TabView/TabView";
import ListItem from "../ui-elements/ListItem/ListItem";
import NewExam from "./newExam/NewExam";
import TeacherProfile from "./TeacherProfile/TeacherProfile";

import { Route, withRouter } from "react-router-dom";
import http from "../../shared/http";
import React from "react";

class Teacher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      examData: [],
      examList: [],
      previousExamList: [],
      classes: [],
      classOptions: null,
      batchOptions: null,
      showEmpty: true,
    };
  }

  //Creating ref objects
  batchRef = React.createRef();
  classRef = React.createRef();

  //Set list view of the exams
  setExamData = () => {
    console.log("triggered");

    let currentTime = new Date();
    let previousExamList = [];
    let examList = [];

    for (let item of this.state.examData) {
      let examDate = new Date(`${item.date},${item.to}`);

      let newItem = (
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
                <p>{item.totalMarks} Marks</p>
              </div>
            ),
          }}
        </ListItem>
      );

      if (currentTime.getTime() > examDate.getTime()) {
        previousExamList.push(newItem);
      } else {
        examList.push(newItem);
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

  //Get exam data from server
  getExamData = () => {
    http(
      "POST",
      "/teacher/getexams",
      {
        Class: this.classRef.current.value,
        batch: this.batchRef.current.value,
      },
      (res) => {
        this.setState({ examData: res.data }, this.setExamData);
      }
    );
  };

  //Get class informations
  getClasses = () => {
    http("GET", "/teacher/getclasses", {}, (res) => {
      if (res.status == 200) {
        this.setState({ classes: res.data });

        this.setupClassOptions();
      } else {
        //Error found
        alert(res.data);
      }
    });
  };

  //Setup the options for the <select> for classes
  setupClassOptions = () => {
    //Options JSX
    let options = [];

    options = Object.keys(this.state.classes).map((key, array) => {
      return (
        <option key={Date.now() + key} value={key}>
          {key}
        </option>
      );
    });

    //Setting class list options to display
    this.setState({ classOptions: options });
  };

  //Setup the options for the <select> for batches based on the selected Class
  setupBatchOptions = () => {
    //Currently selected class
    let Class = this.classRef.current.value;

    if (!Class) return;

    //Getting batches of the selected class
    let batches = this.state.classes[Class].batches;

    let options = batches.map((batch, index, array) => {
      return (
        <option key={Date.now() + batch} value={batch}>
          {batch}
        </option>
      );
    });

    //Setting options as state to diaplay it in screen
    this.setState({ batchOptions: options });
  };

  //onChange handler for class <select>
  classChanged = (event) => {
    this.batchRef.current.value = "";

    this.setupBatchOptions();

    this.checkClassSelected();
  };

  //onChange Listener for Batch <select>
  batchChanged = (event) => {
    this.checkClassSelected();
  };

  //Check if both class and batch is selected or not
  checkClassSelected = () => {
    if (this.classRef.current.value && this.batchRef.current.value) {
      this.setState({ showEmpty: false });
      this.getExamData();
    } else {
      this.setState({ showEmpty: true });
    }
  };

  componentDidMount() {
    this.checkClassSelected();
    this.getClasses();
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
                        ref={this.classRef}
                        id="class"
                        onChange={this.classChanged}
                      >
                        <option value="">--CLASS--</option>
                        {this.state.classOptions}
                      </select>
                    </div>
                    <div className="col-sm-4">
                      <select
                        className="form-select mt-3"
                        name="batch"
                        ref={this.batchRef}
                        id="batch"
                        onChange={this.batchChanged}
                      >
                        <option value="">--BATCH--</option>
                        {this.state.batchOptions}
                      </select>
                    </div>
                  </div>
                </div>
              ),
            }}
          </NavBar>
          {/* Check if the BATCH and Class are selected or not */}
          {this.state.showEmpty ? (
            <>
              <center style={{ color: "red" }}>
                PLEASE SELECT A CLASS AND BATCH
              </center>
            </>
          ) : (
            <>
              <TabView>
                {{
                  leftTab: <span>SCHEDULED EXAMS</span>,
                  rightTab: <span>PREVIOUS EXAMS</span>,
                  leftTabBody: (
                    <div id="leftTabBody">{this.state.examList}</div>
                  ),
                  rightTabBody: (
                    <div id="rightTabBody">{this.state.previousExamList}</div>
                  ),
                }}
              </TabView>
              <div id="new-exam" onClick={this.newExam}>
                <div id="floatButtonText">+</div>
              </div>
            </>
          )}
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
