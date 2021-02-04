import React, { Component } from "react";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Button, Row, Col, Form } from "react-bootstrap";

import http from "../../../shared/http";
export default class VerifyAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
    };
  }
  getUserData = () => {
    http("GET", "/admin/verifyaccount", null, (res) => {
      this.setState({ userData: res.data.data });
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
        { username: item.username },
        (res) => {
          if (res.status == 200) {
            alert("Account Verified Successfully");
            document.getElementById(item._id).style.display = "none";
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
        { username: item.username },
        (res) => {
          if (res.status == 200) {
            alert("Account Rejected Successfully");
            document.getElementById(item._id).style.display = "none";
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
        <div className="container  col-md-10 mt-1 " id={item._id}>
          <ListItem height="180px">
            {{
              left: (
                <div>
                  <span>
                    <Row>
                      <Col>
                        <p class="text-left">{item.name}</p>
                      </Col>
                    </Row>
                    <p class="text-left">{item.email}</p>
                    <p class="text-left">{item.department}</p>
                  </span>{" "}
                  <Col className="text-left">
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
                  <p class="text-right">{item.idNumber}</p>
                  <br />
                  <br />
                  <br />
                  <Button
                    type="submit"
                    className=" mr-3 btn btn-success"
                    onClick={() => this.acceptUser(item)}
                  >
                    Accept
                  </Button>
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
