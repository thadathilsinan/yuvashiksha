import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import { BsPencil, BsDash } from "react-icons/bs";
import { Row, Col, Button } from "react-bootstrap";
export class questionpaperpreview extends Component {
  render() {
    return (
      <div>
        <NavBar>
          {{
            left: (
              <h5>
                <span id="navBarBackButton">{"<"}</span>
                Question paper preview
              </h5>
            ),
            right: (
              <h5>
                <Row>
                  <Col>
                    <Button className="btn btn-light ml-3 ">
                      <BsPencil />
                    </Button>
                  </Col>
                  <Col>
                    <Button className="btn btn-light ml-3 ">
                      <BsDash />
                    </Button>
                  </Col>
                </Row>
              </h5>
            ),
          }}
        </NavBar>
        <h1>question paper here</h1>
      </div>
    );
  }
}

export default questionpaperpreview;
