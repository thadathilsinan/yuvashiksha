import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row, Col, Form } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";

import http from "../../../../shared/http";

import "./Home.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  //Creating ref to the form input
  password = React.createRef();
  confirm = React.createRef();

  changePassword = () => {
    //Getting the form values
    let passwordValue = this.password.current.value;
    let confirmValue = this.confirm.current.value;

    //Validating password
    if (passwordValue != "" && confirmValue != "") {
      if (passwordValue === confirmValue)
        http(
          "POST",
          "/admin/changepassword",
          { password: passwordValue },
          (res) => {
            if (res.status === 200) {
              alert("Password changed successfully");
            } else {
              alert(res.data);
            }
          }
        );
      else alert("Password does not match");
    } else {
      alert("Please fill all data");
    }
  };

  render() {
    return (
      <div>
        <div className="container mt-5">
          <Jumbotron className="bg-secondary" id="changePasswordDiv">
            <h1 className="text-light">Change password</h1>
            <Form>
              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label column>New Password</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    ref={this.password}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label column>Confirm Password</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="password"
                    placeholder="Confirm"
                    ref={this.confirm}
                  />
                </Col>
              </Form.Group>
            </Form>

            <p className="ml-2 text-right">
              <Button
                id="save-btn"
                className="ml-7"
                variant="primary"
                onClick={this.changePassword}
              >
                Save
              </Button>
            </p>
          </Jumbotron>
        </div>
      </div>
    );
  }
}

export default Home;
