import React, { Component } from "react";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Row, Col, Button } from "react-bootstrap";
export default class Teachers extends Component {
  render() {
    return (
      <div>
        <ListItem height="180px">
          {{
            left: (
              <div>
                <span>
                  <Row>
                    <Col>
                      <p class="text-left">name</p>
                    </Col>
                  </Row>
                  <p class="text-left">email</p>
                  <p class="text-left">department</p>
                </span>{" "}
                <Col className="text-left">
                  <Button type="submit" className=" mr-3 btn btn-danger">
                    Delete
                  </Button>
                </Col>
              </div>
            ),
            right: (
              <div>
                <p class="text-right">idNumber</p>
                <br />
                <br />
                <br />
                <Button type="submit" className=" mr-3 btn btn-warning">
                  Disable
                </Button>
              </div>
            ),
          }}
        </ListItem>
      </div>
    );
  }
}
