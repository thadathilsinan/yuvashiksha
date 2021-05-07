import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import { Button, Form, Row, Col } from "react-bootstrap";
import http from "../../../shared/http";
import configureDialogBox from "../../../shared/dailogBox";
import $ from "jquery";

import "./TeacherProfile.css";
import { Route, withRouter } from "react-router-dom";
import VerifyStudent from "./VerifyStudent";

class TeacherProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otpDisabled: true,
    };
  }

  //Creating required refs
  emailRef = React.createRef();
  passwordRef = React.createRef();
  confirmRef = React.createRef();
  newEmailRef = React.createRef();
  otpRef = React.createRef();

  //Set initial Value of the form
  setFormaData = () => {
    $(this.emailRef.current).attr("value", this.props.user.user.email);
  };

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
    let password = this.passwordRef.current.value;
    let confirm = this.confirmRef.current.value;

    if (password) {
      if (password == confirm) {
        http("POST", "/teacher/profile/save", { password }, (res) => {
          alert(res.data);
        });
      } else {
        alert("Passwords does not match");
      }
    } else {
      alert("Enter new Password!");
    }
  };

  //When click GET OTP button in change email modal
  getOtpClickListener = () => {
    let newEmail = this.newEmailRef.current.value;

    if (newEmail && this.validateEmail(newEmail)) {
      http(
        "POST",
        "/register/changeemail/sendotp",
        { email: newEmail },
        (res) => {
          alert(res.data);
          if (res.status == 200) {
            this.otpSentSuccess();
          }
        }
      );
    } else {
      alert("New Email is not valid");
    }
  };

  //Called when OTP is send successfully
  otpSentSuccess = () => {
    this.setState({ otpDisabled: false });
  };

  //Reset the modal to change email
  resetModal = () => {
    this.newEmailRef.current.value = "";

    this.setState({ otpDisabled: true });
  };

  //Verify the OTP
  verifyOtp = () => {
    let otp = this.otpRef.current.value;
    let email = this.newEmailRef.current.value;

    if (otp) {
      http("POST", "/register/changeemail/verify", { otp, email }, (res) => {
        alert(res.data);

        if (res.status == 200) {
          window.$("#change-email").modal("toggle");
        }
      });
    } else {
      alert("Please enter OTP");
    }
  };

  //Verify Students button click listener
  verifyStudents = () => {
    this.props.history.push("/teacher/profile/verifystudents");
  };

  componentDidMount() {
    this.setFormaData();
  }

  render() {
    return (
      <>
        <Route path="/teacher/profile/verifystudents">
          <VerifyStudent />
        </Route>
        <Route path="/teacher/profile" exact>
          <div>
            {/* Configure the change email modal */}
            {configureDialogBox(
              "change-email",
              "Change Email",
              <>
                <div>
                  Email:
                  <br />
                  <input
                    type="text"
                    name="new-email"
                    placeholder="New Email"
                    id="new-email"
                    ref={this.newEmailRef}
                    disabled={!this.state.otpDisabled}
                  ></input>
                  <br />
                  <div className="text-right">
                    <input
                      type="button"
                      className="btn btn-primary mt-3"
                      value="GET OTP"
                      onClick={this.getOtpClickListener}
                    />
                  </div>
                  OTP:
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    name="otp"
                    id="otp"
                    disabled={this.state.otpDisabled}
                    ref={this.otpRef}
                  />
                </div>
              </>,
              <>
                <input
                  type="button"
                  className="btn btn-primary"
                  value="VERIFY"
                  disabled={this.state.otpDisabled}
                  onClick={this.verifyOtp}
                />
              </>
            )}
            <NavBar>
              {{
                left: (
                  <h5>
                    <Button
                      variant="primary"
                      className="btn btn-primary mr-3"
                      id="backBtn"
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
                      {this.props.user.mentor ? (
                        <Col>
                          <Button
                            variant="primary"
                            ClassName="btn bg-light"
                            id="verifyStudentsBtn"
                            size="sm"
                            onClick={this.verifyStudents}
                          >
                            VERIFY STUDENTS
                          </Button>
                        </Col>
                      ) : null}
                      <Col>
                        {" "}
                        <Button
                          variant="danger"
                          className="btn bg-danger"
                          id="logoutBtn"
                          size="md"
                          onClick={this.logout}
                        >
                          LOGOUT
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
                      disabled
                      ref={this.emailRef}
                    />
                    <input
                      type="button"
                      value="CHANGE"
                      id="changeBtn"
                      className="btn btn-primary mt-3"
                      data-toggle="modal"
                      data-target="#change-email"
                      onClick={this.resetModal}
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
                    id="saveBtn"
                    variant="primary"
                    onClick={this.saveUserAccount}
                  >
                    SAVE
                  </Button>
                </p>
              </Form>
            </div>
          </div>
        </Route>
      </>
    );
  }
}

export default withRouter(TeacherProfile);
