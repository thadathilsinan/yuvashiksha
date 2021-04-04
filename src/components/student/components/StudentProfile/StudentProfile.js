import React, { Component } from "react";
import NavBar from "../../../ui-elements/navBar/NavBar";
import { Button, Form, Row, Col } from "react-bootstrap";
import http from "../../../../shared/http";
import "./StudentProfile.css";

export class StudentProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  //Logout user
  logout = () => {
    http("GET", "/login/logout", {}, (res) => {
      alert(res.data);
      if (res.status == 200) {
        window.location.href = "http://localhost:3000/";
      }
    });
  };

  componentDidMount() {}

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
                {this.props.user.name}
              </h5>
            ),
            right: (
              <h5>
                <Button
                  variant="danger"
                  className="btn bg-danger"
                  size="md"
                  onClick={this.logout}
                >
                  LOGOUT
                </Button>
              </h5>
            ),
          }}
        </NavBar>
        <div
          id="studentProfileBody"
          className="d-flex align-items-center justify-content-center"
        >
          {/* <img src="..." alt="..." class="rounded-circle mt-5"></img> */}

          <Form className="col-sm-6">
            <center className="mb-3">
              <h5>ACCOUNT DETAILS</h5>
            </center>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Email
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  disabled
                  value={this.props.user.email}
                />
              </Col>
            </Form.Group>
            <div className="text-right">
              <input
                type="button"
                value="CHANGE EMAIL"
                className="btn btn-primary mb-2"
              />
            </div>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Admission Number
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  value={this.props.user.registerNumber}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Class
              </Form.Label>
              <Col sm="8">
                <Form.Control type="text" value={this.props.Class} disabled />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Batch
              </Form.Label>
              <Col sm="8">
                <Form.Control type="text" value={this.props.batch} disabled />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Department
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  value={this.props.department}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Parent's Email
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  value={this.props.user.parentEmail}
                  disabled
                />
              </Col>
            </Form.Group>
            <center className="mb-3">
              <h5>CHANGE PASSWORD</h5>
            </center>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                New Password
              </Form.Label>
              <Col sm="8">
                <Form.Control type="password" placeholder="Password" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Confirm Password
              </Form.Label>
              <Col sm="8">
                <Form.Control type="password" placeholder="Confirm" />
              </Col>
            </Form.Group>
            <p className="ml-2 text-right">
              <Button className="ml-7" variant="primary">
                SAVE PASSWORD
              </Button>
            </p>
          </Form>
        </div>
      </div>
    );
  }
}

export default StudentProfile;
