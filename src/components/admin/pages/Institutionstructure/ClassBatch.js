import React, { Component } from "react";
import { Button, Row, Form, Col, Modal } from "react-bootstrap";

import { FaMinus, FaPencilAlt, FaPlus } from "react-icons/fa";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import configureDialogBox from "../../../../shared/dailogBox";
export default class ClassBatch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div>
          {/* Configuring The add department */}
          {configureDialogBox(
            "addclass",
            "ADD CLASS",
            <>
              <form>
                <label className="black" for="class">
                  Class Name:{" "}
                </label>
                <input type="text" name="class" id="class"></input>
                <label className="black" for="batch">
                  Batch:{" "}
                </label>
                <input type="text" name="batch" id="batch"></input>
              </form>
            </>,
            <>
              <button className="btn btn-primary">OK</button>
            </>
          )}
          {/* Configuring The edit class */}
          {configureDialogBox(
            "editclass",
            "EDIT CLASS",
            <>
              <form>
                <label className="black" for="class">
                  class Name:{" "}
                </label>
                <input
                  type="text"
                  size="lg"
                  name="class name"
                  id="class name"
                  className="m-3"
                ></input>
                <br />
                <label className="black" for="batch">
                  Batch:{" "}
                </label>
                <input
                  type="text"
                  name="batch"
                  id="batch"
                  className="m-3"
                ></input>
                <br />
              </form>
            </>,
            <>
              <button className="btn btn-primary">Ok</button>
            </>
          )}
        </div>
        <ListItem height="120px">
          {{
            left: (
              <div className="p-1 ">
                <Form className="md-6">
                  <Form.Group controlId="formBasicCheckbox">
                    <Row>
                      <Col>
                        <Form.Label className="text-dark">Class</Form.Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label className="text-dark">Batch</Form.Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label className="text-dark">Mentor:</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          as="select"
                          defaultValue="Class Mentor"
                          placeholder="Class Mentor"
                          style={{ width: "200px" }}
                        >
                          <option>Class Mentor</option>
                          <option>Teacher name</option>
                          <option>Teacher name</option>
                        </Form.Control>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              </div>
            ),
            right: (
              <div>
                <Button className="mr-4 btn btn-danger">
                  <FaMinus />
                </Button>

                <a
                  href="#"
                  data-toggle="modal"
                  data-target="#editclass"
                  style={{ color: "white" }}
                >
                  <Button className="btn btn-secondary">
                    <FaPencilAlt />
                  </Button>{" "}
                </a>
              </div>
            ),
          }}
        </ListItem>
      </div>
    );
  }
}
