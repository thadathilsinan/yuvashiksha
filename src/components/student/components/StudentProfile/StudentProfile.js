import React, { Component } from "react";
import NavBar from "../../../ui-elements/navBar/NavBar";
import { Button, Form, Row, Col } from "react-bootstrap";
import http from "../../../../shared/http";
import "./StudentProfile.css";
import configuireDialogBox from "../../../../shared/dailogBox";

import config from "../../../../config";
export class StudentProfile extends Component {
  constructor(props) {
    super(props);

    this.state = { otpDisabled: true };
  }

  //Creating necessary reference object
  newEmailRef = React.createRef();
  otpRef = React.createRef();
  passwordRef = React.createRef();
  confirmRef = React.createRef();

  //Logout user
  logout = () => {
    http("GET", "/login/logout", {}, (res) => {
      alert(res.data);
      if (res.status == 200) {
        window.location.href = config.clientUrl;
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
        http("POST", "/student/profile/save", { password }, (res) => {
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

  componentDidMount() {}

  render() {
    return (
      <div>
        {/* Configure the change email modal */}
        {configuireDialogBox(
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
                {this.props.user.name}
              </h5>
            ),
            right: (
              <h5>
                <Button
                  variant="danger"
                  className="btn bg-danger"
                  id="logoutBtn"
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
                id="changeBtn"
                className="btn btn-primary mb-2"
                data-toggle="modal"
                data-target="#change-email"
                onClick={this.resetModal}
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
                <Form.Control
                  type="password"
                  placeholder="Password"
                  ref={this.passwordRef}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Confirm Password
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="password"
                  ref={this.confirmRef}
                  placeholder="Confirm"
                />
              </Col>
            </Form.Group>
            <p className="ml-2 text-right">
              <Button
                id="changeBtn"
                className="ml-7"
                variant="primary"
                onClick={this.saveUserAccount}
              >
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
