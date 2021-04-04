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
        <ListItem height="180px" key={student.id}>
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
                  <Button type="submit" className=" mr-3 btn btn-danger">
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
                  <Button type="submit" className=" mr-3 btn btn-success">
                    Accept
                  </Button>
                </div>
              </div>
            ),
          }}
        </ListItem>
      );
    });
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
                  size="sm"
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
