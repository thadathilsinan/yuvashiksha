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
    http("GET", "/admin", null, (res) => {
      this.setState({ userData: res.data.data });
    });
  };

  componentDidMount() {
    this.getUserData();
  }

  getTeacherList = () => {
    let teachers = this.state.userData.map((item) => {
      return (
        <div className="container  col-md-10 mt-1 ">
          <ListItem height="180px">
            {{
              left: (
                <div>
                  <span>
                    <Row>
                      <Col>
                        <p class="text-left">{}</p>
                      </Col>
                    </Row>
                    <p class="text-left">Email</p>
                    <p class="text-left">Department</p>
                  </span>{" "}
                  <Col className="text-left">
                    <Button type="submit" className=" mr-3 btn btn-danger">
                      Reject
                    </Button>
                  </Col>
                </div>
              ),
              right: (
                <div>
                  <p class="text-right">ID Number</p>
                  <br />
                  <br />
                  <br />
                  <Button type="submit" className=" mr-3 btn btn-success">
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
