import React, { Component } from "react";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { Button, Row, Col, Form } from "react-bootstrap";
import "./verifyAccounts.css";

import http from "../../../../shared/http";
export default class VerifyAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
    };
  }

  //Get users data from the server
  getUserData = () => {
    http("GET", "/admin/verifyaccount", null, (res) => {
      if (res.status == 200) {
        this.setState({ userData: res.data });
      } else {
        alert("Users data return failed");
      }
    });
  };

  componentDidMount() {
    this.getUserData();
  }

  acceptUser = (item) => {
    let confirmation = window.confirm("Are you sure you want to accept?");

    if (confirmation) {
      http(
        "POST",
        "/admin/verifyaccount/accept",
        { userId: item.id },
        (res) => {
          if (res.status == 200) {
            alert("Account Verified Successfully");
            document.getElementById(item.id).style.display = "none";
          } else {
            alert("Error during account verification");
          }
        }
      );
    }
  };

  rejectUser = (item) => {
    let confirmation = window.confirm("Are you sure you want to reject?");

    if (confirmation) {
      http(
        "POST",
        "/admin/verifyaccount/reject",
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

  getTeacherList = () => {
    let teachers = this.state.userData.map((item) => {
      return (
        <div className=" mt-1 " id={item.id}>
          <ListItem height="180px">
            {{
              left: (
                <div>
                  <span>
                    <Row>
                      <Col>
                        <p class="text-left">Name: {item.name}</p>
                      </Col>
                    </Row>
                    <p class="text-left">Email: {item.email}</p>
                    <p class="text-left">Department: {item.department}</p>
                  </span>
                  <Col>
                    <br />
                    <Button
                      type="submit"
                      className=" mr-3 btn btn-danger"
                      onClick={() => this.rejectUser(item)}
                    >
                      Reject
                    </Button>
                  </Col>
                </div>
              ),
              right: (
                <div>
                  <p class="text-right">
                    RegisterNumber: {item.registerNumber}
                  </p>
                  <br />
                  <br />
                  <br />
                  <div className="text-right">
                    <Button
                      type="submit"
                      className=" mr-3 btn btn-success"
                      onClick={() => this.acceptUser(item)}
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

    return teachers;
  };

  render() {
    return <>{this.getTeacherList()}</>;
  }
}
