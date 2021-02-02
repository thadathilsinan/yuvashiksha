import React, { Component } from "react";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Button, Row, Col, Form } from "react-bootstrap";
export default class VerifyAccounts extends Component {
  render() {
    return (
      <div className="container  col-md-10 mt-1 ">
        <ListItem height="160px">
          {{
            left: (
              <div>
                {" "}
                <span>
                  <Row>
                    <Col>
                      <p class="text-left">Name of teacher</p>
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
                {" "}
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
        {/* <ListItem height="250px">
          {{
            left: (
              <span>
                <Row>
                  <Col>
                    <p class="text-left">Name of teacher</p>
                  </Col>
                  <Col>
                    <p class="text-right">80309</p>
                  </Col>
                </Row>

                <p class="text-left">Email</p>
                <p class="text-left">Department</p>

                <Row>
                  <Col className="text-left">
                    <Button type="submit" className=" mr-3 btn btn-danger">
                      Reject
                    </Button>
                  </Col>

                  <Col className="text-right">
                    <Button type="submit" className=" mr-3 btn btn-success">
                      Accept
                    </Button>
                  </Col>
                </Row>
              </span>
            ),
          }}
        </ListItem> */}
      </div>
    );
  }
}
