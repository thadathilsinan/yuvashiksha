import React, { Component } from "react";
import ListItem from "../../ui-elements/ListItem/ListItem";
import NavBar from "../../ui-elements/navBar/NavBar";
import { Row, Col, Button } from "react-bootstrap";
export class VerifyStudent extends Component {
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
                Verify Accounts
              </h5>
            ),
          }}
        </NavBar>
        <ListItem height="180px">
          {{
            left: (
              <div>
                <span>
                  <Row>
                    <Col>
                      <p class="text-left">Name : item.name </p>
                    </Col>
                  </Row>
                  <p class="text-left">Email: item.email</p>
                  <p class="text-left">Class: item.class</p>
                  <p class="text-left">Batch: item.batch</p>
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
                <p class="text-right">AdmmisionNumber: item.admmissionNumber</p>
                <p class="text-left">Parentemail: item.parentEmail</p>
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
  }
}

export default VerifyStudent;
