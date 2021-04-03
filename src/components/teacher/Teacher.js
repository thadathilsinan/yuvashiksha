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
import QuestionPaperPreview from "./questionpaperpreview/QuestionpaperPreview";

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
      editExam: null,
    };

    this.userRole = "teacher";
  }

  //Creating ref objects
  batchRef = React.createRef();
  classRef = React.createRef();

  //Set list view of the exams
  setExamData = () => {
    let currentTime = new Date();
    let previousExamList = [];
    let examList = [];

    for (let item of this.state.examData) {
      let examDate = new Date(`${item.date},${item.to}`);

      let newItem = (
        <ListItem
          height="100px"
          key={item._id}
          onClick={() => {
            this.examListClickListener(item._id);
          }}
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
        this.setState({ classes: res.data }, () => {
          this.getTeacherData();
          this.setupClassOptions();
        });
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
    if (
      this.classRef.current &&
      this.classRef.current.value &&
      this.batchRef.current.value
    ) {
      this.setState({ showEmpty: false });
      this.getExamData();
    } else {
      this.setState({ showEmpty: true });
    }
  };

  //When an exam list item is clicked
  examListClickListener = (examId) => {
    let examItem;

    //Get exam data of the selected list item
    for (let exam of this.state.examData) {
      if (exam._id === examId) {
        examItem = exam;
      }
    }

    //Checking previous or scheduled exam
    let examDate = new Date(`${examItem.date},${examItem.to}`);
    let currentTime = new Date();

    if (currentTime.getTime() > examDate.getTime()) {
      console.log("Previous Exam");
    } else {
      this.openEditExam(examItem);
    }
  };

  //Open edit exam page
  openEditExam = (examData) => {
    this.setState({ editExam: examData }, () => {
      this.props.history.push("/teacher/previewexam");
    });
  };

  //Get the data of other teachers in case of MENTOR or HOD user
  getTeacherData = () => {
    if (this.userRole == "hod") {
      http("GET", "/teacher/hod", {}, (res) => {
        console.log(res.data);
      });
    }
  };

  componentDidMount() {
    this.checkClassSelected();
    this.getClasses();

    console.log(this.props);
  }

  render() {
    //Checking HOD or MENTOR priveillege of thee user
    let hodOrMentor = null;

    if (this.props.hod) {
      this.userRole = "hod";

      hodOrMentor = (
        <div className="col-sm-2" id="teacher-select">
          <select className="form-select mt-3" name="teacher" id="teacher">
            <option value="">--TEACHER--</option>
          </select>
        </div>
      );
    } else if (this.props.mentor) {
      this.userRole = "mentor";

      hodOrMentor = (
        <div className="col-sm-2" id="teacher-select">
          <select className="form-select mt-3" name="teacher" id="teacher">
            <option value="">--TEACHER--</option>
          </select>
        </div>
      );
    }

    return (
      <div>
        <Route path="/teacher" exact>
          <NavBar>
            {{
              left: (
                <h5 onClick={this.openProfile}>{this.props.user.user.name}</h5>
              ),
              right: (
                <div className="container" id="NavBarRight">
                  <div className="row">
                    <div
                      className="col-sm-4 align-self-center"
                      id="NavBarInfoText"
                    >
                      <p>Select Class and Batch : </p>
                    </div>
                    <div className="col-sm-3">
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
                    <div className="col-sm-3">
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

                    {hodOrMentor}
                  </div>
                </div>
              ),
            }}
          </NavBar>
          {/* Check if the BATCH and Class are selected or not */}
          {this.state.showEmpty ||
          this.batchRef.current == null ||
          this.batchRef.current.value == null ? (
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
        <Route path="/teacher/previewexam">
          {this.state.editExam ? (
            <QuestionPaperPreview
              exam={this.state.editExam}
              Class={this.classRef.current ? this.classRef.current.value : null}
              batch={this.classRef.current ? this.batchRef.current.value : null}
            />
          ) : null}
        </Route>
        <Route path="/teacher/profile">
          <TeacherProfile user={this.props.user} />
        </Route>
      </div>
    );
  }
}

export default withRouter(Teacher);
