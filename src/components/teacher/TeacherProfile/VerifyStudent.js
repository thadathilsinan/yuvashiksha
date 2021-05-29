import React, { Component } from "react";
import ListItem from "../../ui-elements/ListItem/ListItem";
import NavBar from "../../ui-elements/navBar/NavBar";
import { Row, Col, Button } from "react-bootstrap";

import "./VerifyStudent.css";
import http from "../../../shared/http";

class VerifyStudent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      studentData: [],
    };
  }

  //Get the list of students in the class
  getStudentData = () => {
    http("GET", "/teacher/profile/verifystudents", {}, (res) => {
      if (res.status == 200) {
        this.setState({ studentData: res.data }, () => {
          this.setUpStudentList();
        });
      } else {
        alert("Error in fetching student account details");
      }
    });
  };

  //Setup the list items for the students
  setUpStudentList = () => {
    return this.state.studentData.map((student, index, array) => {
      return (
        <div key={student.id} id={student.id}>
          <ListItem height="180px">
            {{
              left: (
                <div>
                  <span>
                    <Row>
                      <Col>
                        <p class="text-left">Name : {student.name} </p>
                      </Col>
                    </Row>
                    <p class="text-left">Email: {student.email}</p>
                    <p class="text-left">Class: {student.Class}</p>
                    <p class="text-left">Batch: {student.batch}</p>
                  </span>{" "}
                  <Col>
                    <Button
                      type="submit"
                      className=" mr-3 btn btn-danger"
                      onClick={() => this.rejectStudent(student)}
                    >
                      Reject
                    </Button>
                  </Col>
                </div>
              ),
              right: (
                <div>
                  <p>Admision Number: {student.registerNumber}</p>
                  <p>Parentemail: {student.parentEmail}</p>
                  <br />
                  <br />
                  <div className="text-right">
                    <Button
                      type="submit"
                      className=" mr-3 btn btn-success"
                      onClick={() => this.acceptStudent(student)}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ),
            }}
          </ListItem>
        </div>
      );
    });
  };

  //Reject a student account
  rejectStudent = (item) => {
    let confirmation = window.confirm("Are you sure you want to reject?");

    if (confirmation) {
      http(
        "POST",
        "/teacher/profile/verifystudents/reject",
        { userId: item.id },
        (res) => {
          if (res.status == 200) {
            alert("Account Rejected Successfully");
            document.getElementById(item.id).style.display = "none";
          } else {
            alert("Error during account rejection");
          }
        }
      );
    }
  };

  //Accept a student account
  acceptStudent = (item) => {
    let confirmation = window.confirm("Are you sure you want to Accept?");

    if (confirmation) {
      http(
        "POST",
        "/teacher/profile/verifystudents/accept",
        { userId: item.id },
        (res) => {
          if (res.status == 200) {
            alert("Account Accepted Successfully");
            document.getElementById(item.id).style.display = "none";
          } else {
            alert("Error during account verification");
          }
        }
      );
    }
  };

  componentDidMount() {
    this.getStudentData();
  }

  render() {
    return (
      <div>
        <NavBar>
          {{
            left: (
              <h5>
                <Button
                  variant="primary"
                  className="btn btn-primary mr-3"
                  id="navBack"
                  size="sm"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Go back"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  {"<"}
                </Button>
                Verify Students
              </h5>
            ),
          }}
        </NavBar>
        <div id="verifyStudentBody">{this.setUpStudentList()}</div>
      </div>
    );
  }
}

export default VerifyStudent;
