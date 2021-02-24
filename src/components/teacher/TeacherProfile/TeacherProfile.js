import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import { Button, Form, Row, Col } from "react-bootstrap";
export class TeacherProfile extends Component {
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
            <Form.Group as={Row} controlId="formPlaintextIdNumber">
              <Form.Label column sm="2">
                Id Number
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="Id  Number" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextDesignation">
              <Form.Label column sm="2">
                Designation
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" placeholder="Designation" />
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

export default TeacherProfile;
