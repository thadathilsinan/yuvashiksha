import React, { Component } from "react";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Row, Col, Button } from "react-bootstrap";
export default class Students extends Component {
  render() {
    return (
      <div>
        <ListItem height="230px">
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
                  <p class="text-left">Parents email</p>
                  <p class="text-right">Admission Number</p>
                </span>

                <Col className="text-left">
                  <Button type="submit" className=" mr-3 btn btn-danger">
                    Delete
                  </Button>
                </Col>
              </div>
            ),
            right: (
              <div>
                <p class="text-left">Class</p>
                <p class="text-left">Batch</p>
                <p class="text-left">department</p>

                <Button type="submit" className="mt-3 mr-3 btn btn-warning">
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
