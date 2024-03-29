import { Component } from "react";
import "./Teacher.css";

import NavBar from "../ui-elements/navBar/NavBar";
import TabView from "../ui-elements/TabView/TabView";
import ListItem from "../ui-elements/ListItem/ListItem";
import NewExam from "./newExam/NewExam";
import PreviousExam from "./previousExam/PreviousExam";
import TeacherProfile from "./TeacherProfile/TeacherProfile";
import { FaUserCircle } from "react-icons/fa";
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
      teacherSelect: null,
      showEmpty: true,
      editExam: null,
      teacherData: {},
      restrictedExam: false,
      teacherSelectDisabled: true,
      selectedExam: null,
      rightTab: false,
    };

    this.userRole = "teacher";
  }

  //Creating ref objects
  batchRef = React.createRef();
  classRef = React.createRef();
  teacherRef = React.createRef();

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
          // this.getTeacherData();
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
    this.setState({ teacherSelectDisabled: true }, () =>
      this.setUpTeacherSelect()
    );

    this.setupBatchOptions();

    this.checkClassSelected();
  };

  //onChange Listener for Batch <select>
  batchChanged = (event) => {
    if (
      !this.props.mentor ||
      (this.classRef.current.value == this.props.mentor.name &&
        this.batchRef.current.value == this.props.mentor.batch)
    ) {
      this.setState({ teacherSelectDisabled: false }, () =>
        this.setUpTeacherSelect()
      );
    } else {
      this.setState({ teacherSelectDisabled: true }, () =>
        this.setUpTeacherSelect()
      );
    }

    this.checkClassSelected();
  };

  //Check if both class and batch is selected or not
  checkClassSelected = () => {
    if (
      this.classRef.current &&
      this.classRef.current.value &&
      this.batchRef.current.value &&
      this.teacherRef.current &&
      this.teacherRef.current.value
    ) {
      this.setState({ showEmpty: false });
      this.getTeacherExams();
    } else if (
      this.classRef.current &&
      this.classRef.current.value &&
      this.batchRef.current.value
    ) {
      this.setState({ showEmpty: false });
      this.getExamData();
    } else {
      this.setState({ showEmpty: true });
    }

    //SETTING LOCALSTORAGE VALUE
    localStorage.setItem(
      "class",
      this.classRef.current ? this.classRef.current.value : null
    );
    localStorage.setItem(
      "batch",
      this.batchRef.current ? this.batchRef.current.value : null
    );
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
      this.openPreviousExam(examItem);
    } else {
      this.openEditExam(examItem);
    }
  };

  //Open edit exam page
  openEditExam = (examData) => {
    let newState = { editExam: examData };

    //If Exam editing is not permitted
    if (this.teacherRef.current && this.teacherRef.current.value) {
      //HOD or MENTOR data exam is currently selected
      newState.restrictedExam = true;
    } else {
      newState.restrictedExam = false;
    }

    this.setState(newState, () => {
      this.props.history.push("/teacher/previewexam");
    });
  };

  //Get the data of other teachers in case of MENTOR or HOD user
  getTeacherData = () => {
    if (this.userRole == "hod") {
      http("GET", "/teacher/hod", {}, (res) => {
        if (res.status == 200)
          this.setState({ teacherData: res.data }, () => {
            this.setUpTeacherSelect();
          });
        else alert("Teachers data not found");
      });
    } else if (this.userRole == "mentor") {
      http("GET", "/teacher/mentor", {}, (res) => {
        if (res.status == 200)
          this.setState({ teacherData: res.data }, () => {
            this.setUpTeacherSelect();
          });
        else alert("Teachers data not found");
      });
    }
  };

  //Return the JSX for <option> for teacher select in Case of HOD or MENTOR user
  getTeacherOptions = () => {
    return Object.keys(this.state.teacherData).map((key, array) => {
      if (this.props.user.user._id != key)
        return (
          <option key={Date.now() + key} value={key}>
            {this.state.teacherData[key].name}
          </option>
        );
      else return null;
    });
  };

  //Teacher select change listener
  getTeacherExams = () => {
    let teacher = this.teacherRef.current.value;
    let Class = this.classRef.current.value;
    let batch = this.batchRef.current.value;

    if (teacher && Class && batch) {
      http(
        "POST",
        "/teacher/getexams/hod",
        { Class, batch, teacher },
        (res) => {
          if (res.status == 200) {
            this.setState({ examData: res.data }, () => {
              this.setExamData();
            });
          }
        }
      );
    }
  };

  //Check HOD or MENTOR
  checkUserRole = () => {
    if (this.props.hod) this.userRole = "hod";
    else if (this.props.mentor) this.userRole = "mentor";
  };

  //Setup HOD or MENTOR TEacher select
  setUpTeacherSelect = () => {
    //Checking HOD or MENTOR priveillege of thee user
    let hodOrMentor = null;

    if (this.props.hod) {
      hodOrMentor = (
        <div
          className="col-sm-3
        "
          id="teacher-select"
        >
          <div className="d-flex mt-1">
            <p className="selectedOption">Role </p>
            <select
              className="form-select "
              name="teacher"
              id="teacher"
              onChange={this.checkClassSelected}
              ref={this.teacherRef}
            >
              <option value="">--TEACHER--</option>
              {this.getTeacherOptions()}
            </select>
          </div>
        </div>
      );
    } else if (this.props.mentor) {
      hodOrMentor = (
        <div className="col-sm-2" id="teacher-select">
          <select
            className="form-select mt-1"
            name="teacher"
            id="teacher"
            ref={this.teacherRef}
            onChange={this.checkClassSelected}
            disabled={this.state.teacherSelectDisabled}
          >
            <option value="">--TEACHER--</option>
            {this.getTeacherOptions()}
          </select>
        </div>
      );
    }

    this.setState({ teacherSelect: hodOrMentor });
  };

  //When an previos exam is clicked
  openPreviousExam = (exam) => {
    // if (exam.teacher == this.props.user.user._id) {
    this.setState({ selectedExam: exam }, () => {
      this.props.history.push("/teacher/previousexam");
    });
    // } else {
    //   alert("You cannot evaluate this exam");
    //   console.log(exam.teacher, this.props.user.user._id);
    // }
  };

  //Restore the state of the app when coming back from other inner pages like previosExam
  restoreState = () => {
    if (localStorage.getItem("back") == "true") {
      localStorage.setItem("back", "false");

      this.classRef.current.value = localStorage.getItem("class");
      this.batchRef.current.value = localStorage.getItem("batch");

      this.checkClassSelected();

      if (localStorage.getItem("right") == "true") {
        localStorage.setItem("right", "false");
        this.setState({ rightTab: true });
      }
    }
  };

  componentDidMount() {
    this.getTeacherData();
    this.checkClassSelected();
    this.getClasses();

    console.log(this.props);
  }

  componentDidUpdate() {
    this.restoreState();
  }

  render() {
    this.checkUserRole();

    return (
      <div>
        <Route path="/teacher" exact>
          <NavBar>
            {{
              left: (
                <h5 id="profileText" onClick={this.openProfile}>
                  <FaUserCircle className="mr-3 ml-3" size={40} />
                  {this.props.user.user.name}
                </h5>
              ),
              right: (
                <div className="container" id="NavBarRight">
                  <div className="row">
                    <div className="col-sm-3">
                      <div className="d-flex mt-1">
                        <p className="selectedOption"> Class </p>

                        <select
                          className="form-select"
                          name="class"
                          ref={this.classRef}
                          id="class"
                          onChange={this.classChanged}
                        >
                          <option value="">--CLASS--</option>
                          {this.state.classOptions}
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="d-flex mt-1">
                        <p className="selectedOption"> Batch </p>

                        <select
                          className="form-select"
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

                    {this.state.teacherSelect}
                  </div>
                </div>
              ),
            }}
          </NavBar>
          {/* Check if the BATCH and Class are selected or not */}
          {this.state.showEmpty ||
          this.batchRef.current == null ||
          this.batchRef.current.value == null ? (
            <div
              id="emptyScreen"
              className="d-flex align-items-center justify-content-center"
            >
              <h4>PLEASE SELECT A CLASS AND BATCH</h4>
            </div>
          ) : (
            <>
              <TabView right={this.state.rightTab ? true : undefined}>
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
            </>
          )}
          <div id="new-exam" onClick={this.newExam}>
            <div id="floatButtonText">+</div>
          </div>
        </Route>
        <Route path="/teacher/newexam">
          <NewExam />
        </Route>
        <Route path="/teacher/previousexam">
          <PreviousExam
            exam={this.state.selectedExam}
            user={this.props.user.user._id}
          />
        </Route>
        <Route path="/teacher/previewexam">
          {this.state.editExam ? (
            <QuestionPaperPreview
              exam={this.state.editExam}
              Class={this.classRef.current ? this.classRef.current.value : null}
              batch={this.classRef.current ? this.batchRef.current.value : null}
              restricted={this.state.restrictedExam}
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
