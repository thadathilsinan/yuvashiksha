import React, { Component } from "react";
import { Button, Row, Form, Col, Modal } from "react-bootstrap";

import "./ClassBatch.css";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import configureDialogBox from "../../../../shared/dailogBox";
import { withRouter } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import http from "../../../../shared/http";

class ClassBatch extends Component {
  constructor(props) {
    super(props);
    this.state = { classList: null };
  }

  //Global member variables
  classToEdit = "";

  //Creating necessary ref objects
  newClassName = React.createRef();
  newBatchName = React.createRef();
  classNewName = React.createRef(); //for editing class name
  batchNewName = React.createRef();

  getClasses = () => {
    //getting class data from db
    http(
      "POST",
      "/admin/institutionstructure/class",
      { department: this.props.match.params.departmentId },
      async (res) => {
        let classes = [...res.data];

        //This will return options for the <select> to select HOD for each department
        let getTeacherOptions = (cls) => {
          //Get teachers in department options
          let teacherOptions = [];
          if (cls.teachers) {
            teacherOptions = cls.teachers.map((teacher, index, array) => {
              return <option value={teacher._id}>{teacher.name}</option>;
            });
          }

          return (
            <>
              {/* //Setting Mentor option */}
              {cls.assignedMentor ? (
                <option value={cls.assignedMentor._id} selected>
                  {cls.assignedMentor.name}
                </option>
              ) : (
                <option selected>NO MENTOR</option>
              )}
              {teacherOptions}
            </>
          );
        };

        let classList = classes.map((Class, index) => {
          // let Class = classes[key];

          return (
            <ListItem height="120px">
              {{
                left: (
                  <div className="p-1 ">
                    <Form className="md-6">
                      <Form.Group controlId="formBasicCheckbox">
                        <Row>
                          <Col>
                            <Form.Label className="text-dark">
                              {Class.name}
                            </Form.Label>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Label className="text-dark">
                              {Class.batch}
                            </Form.Label>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Label className="text-dark">
                              Mentor:
                            </Form.Label>
                          </Col>
                          <Col>
                            <Form.Control
                              as="select"
                              defaultValue="Class Mentor"
                              placeholder="Class Mentor"
                              style={{ width: "200px" }}
                              onChange={(event) => {
                                this.changeMentor(event, Class.id);
                              }}
                            >
                              {getTeacherOptions(Class)}
                            </Form.Control>
                          </Col>
                        </Row>
                      </Form.Group>
                    </Form>
                  </div>
                ),
                right: (
                  <div>
                    <a
                      href="#"
                      data-toggle="modal"
                      data-target="#editclass"
                      style={{ color: "white" }}
                    >
                      <Button
                        className="btn-edit"
                        onClick={() => {
                          this.setEditingClass(Class.id);
                        }}
                      >
                        <AiOutlineEdit />
                      </Button>{" "}
                      <Button
                        className="btn-delete"
                        onClick={() => {
                          this.removeClass(Class.id);
                        }}
                      >
                        <AiOutlineDelete />
                      </Button>
                    </a>
                  </div>
                ),
              }}
            </ListItem>
          );
        });
        this.setState({ classList });
      }
    );
  };

  //To add a new class
  addClass = () => {
    let className = this.newClassName.current.value;
    let batchName = this.newBatchName.current.value;

    if (className == "" || batchName == "") {
      alert("Please fill all data");
    } else {
      http(
        "POST",
        "/admin/institutionstructure/class/add",
        {
          className,
          batchName,
          department: this.props.match.params.departmentId,
        },
        (res) => {
          if (res.status == 200) {
            alert("Class addedd successfully");
          } else {
            alert(res.data);
          }
        }
      );
    }
  };

  setEditingClass = (classId) => {
    this.classToEdit = classId;
  };

  //Edit an existing class
  editClass = () => {
    let newName = this.classNewName.current.value; //Getting new name
    let newBatch = this.batchNewName.current.value;

    if (newName == "" || newBatch == "") {
      alert("Please enter all data");
    } else {
      http(
        "POST",
        "/admin/institutionstructure/class/edit",
        { classId: this.classToEdit, newName, newBatch },
        (res) => {
          alert(res.data);
        }
      );
    }
  };

  //Remove a class
  removeClass = (classId) => {
    let confirm = window.confirm("Are you sure to delete the Class");
    if (confirm) {
      http(
        "POST",
        "/admin/institutionstructure/class/remove",
        { classId },
        (res) => {
          alert(res.data);
        }
      );
    }
  };

  //Change Mentor of a department
  changeMentor = (event, classId) => {
    http(
      "POST",
      "/admin/institutionstructure/class/changementor",
      {
        classId,
        mentor: event.target.value,
      },
      (res) => {
        alert(res.data);
      }
    );
  };

  componentDidMount() {
    this.getClasses();
  }

  render() {
    return (
      <div>
        <div>
          {/* Configuring The add department */}
          {configureDialogBox(
            "addclass",
            "ADD CLASS",
            <>
              <form>
                <label className="black" for="class">
                  Class Name:{" "}
                </label>
                <input
                  type="text"
                  name="class"
                  id="class"
                  ref={this.newClassName}
                ></input>
                <label className="black" for="batch">
                  Batch:{" "}
                </label>
                <input
                  type="text"
                  name="batch"
                  id="batch"
                  ref={this.newBatchName}
                ></input>
              </form>
            </>,
            <>
              <button className="btn btn-primary" onClick={this.addClass}>
                OK
              </button>
            </>
          )}
          {/* Configuring The edit class */}
          {configureDialogBox(
            "editclass",
            "EDIT CLASS",
            <>
              <form>
                <label className="black" for="className">
                  Class Name:{" "}
                </label>
                <input
                  type="text"
                  name="className"
                  id="className"
                  ref={this.classNewName}
                ></input>
                <label className="black" for="batch">
                  Batch:{" "}
                </label>
                <input
                  type="text"
                  name="batch"
                  id="batch"
                  ref={this.batchNewName}
                ></input>
              </form>
            </>,
            <>
              <button className="btn btn-primary" onClick={this.editClass}>
                EDIT
              </button>
            </>
          )}
        </div>
        {this.state.classList}
      </div>
    );
  }
}

export default withRouter(ClassBatch);
