import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import { Button, Form, Row, Col } from "react-bootstrap";
import http from "../../../shared/http";
import $ from "jquery";

import "./TeacherProfile.css";

export class TeacherProfile extends Component {
  //Creating required refs
  emailRef = React.createRef();
  passwordRef = React.createRef();
  confirmRef = React.createRef();

  //Set initial Value of the form
  setFormaData = () => {
    $(this.emailRef.current).attr("value", this.props.user.user.email);
  };

  componentDidMount() {
    this.setFormaData();
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

  //email validation
  validateEmail = (email) => {
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      return true;
    } else {
      return false;
    }
  };

  //Save changes to user account
  saveUserAccount = () => {
    let email = this.emailRef.current.value;
    let password = this.passwordRef.current.value;
    let confirm = this.confirmRef.current.value;

    if (this.validateEmail(email)) {
      if (password == confirm) {
        http("POST", "/teacher/profile/save", { password, email }, (res) => {
          alert(res.data);
        });
      } else {
        alert("Passwords does not match");
      }
    } else {
      alert("Email is invalid");
    }
  };

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
                <span id="username">{this.props.user.user.name}</span>
              </h5>
            ),
            right: (
              <h5>
                <Row className="mt-2">
                  <Col>
                    <Button
                      variant="primary"
                      ClassName="btn bg-light"
                      size="sm"
                    >
                      Verify Accounts
                    </Button>
                  </Col>
                  <Col>
                    {" "}
                    <Button
                      variant="danger"
                      lassName="btn bg-danger"
                      size="md"
                      onClick={this.logout}
                    >
                      Logout
                    </Button>
                  </Col>
                </Row>
              </h5>
            ),
          }}
        </NavBar>
        <div
          className="d-flex align-items-center justify-content-center"
          id="userProfileBody"
        >
          {/* <img src="..." alt="..." class="rounded-circle mt-5"></img> */}

          <Form className="col-sm-4" id="userProfileForm">
            <Form.Group as={Row} controlId="formPlaintextEmail">
              <Form.Label column sm="12">
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="Email"
                  ref={this.emailRef}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="12">
                New Password
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  ref={this.passwordRef}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="12">
                Confirm Password
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  ref={this.confirmRef}
                />
              </Col>
            </Form.Group>
            <p className="ml-2 text-right">
              <Button
                className="ml-7"
                variant="primary"
                onClick={this.saveUserAccount}
              >
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
