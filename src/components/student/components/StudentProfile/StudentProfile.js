import React, { Component } from "react";
import NavBar from "../../../../ui-elements/navBar/NavBar";
import { Button, Form, Row, Col } from "react-bootstrap";
export class StudentProfile extends Component {
  render() {
    return (
      <div>
        <NavBar>
          {{
            left: (
              <h5>
                {" "}
                <span id="navBarBackButton" className="mr-3">
                  {"<"}
                </span>
                Username
              </h5>
            ),
            right: (
              <h5>
                <Button variant="light" ClassName="btn bg-light">
                  logout
                </Button>
              </h5>
            ),
          }}
        </NavBar>
        <div className="text-center  align-items-center mt-5 col-md-8 ">
          <img src="..." alt="..." class="rounded-circle mt-5"></img>
          <Form className="col-md-6">
            <Form.Group as={Row} controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="Email" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextAdmissionNumber">
              <Form.Label column sm="2">
                Admission Number
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="Admission  Number" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextClass">
              <Form.Label column sm="2">
                Class
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="Class" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextBatch">
              <Form.Label column sm="2">
                Batch
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="Batch" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextDepartment">
              <Form.Label column sm="2">
                Department
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="Department" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextParentEmail">
              <Form.Label column sm="2">
                Parent's Email
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="Parent's Email" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="2">
                New Password
              </Form.Label>
              <Col sm="10">
                <Form.Control type="password" placeholder="Password" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="2">
                Confirm Password
              </Form.Label>
              <Col sm="10">
                <Form.Control type="password" placeholder="Password" />
              </Col>
            </Form.Group>
            <p className="ml-2 text-right">
              <Button className="ml-7" variant="primary">
                Save
              </Button>
            </p>
          </Form>
        </div>
      </div>
    );
  }
}

export default StudentProfile;
