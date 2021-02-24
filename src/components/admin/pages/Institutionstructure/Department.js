import React from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { FaMinus, FaPencilAlt } from "react-icons/fa";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import configureDialogBox from "../../../../shared/dailogBox";
import "./Department.css";

class Departments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="departmentList">
        <div>
          {/* Configuring The add department */}
          {configureDialogBox(
            "adddept",
            "ADD DEPARTMENT",
            <>
              <label className="black" for="dept">
                Name of department:{" "}
              </label>
              <input type="text" name="dept" id="dept"></input>
            </>,
            <>
              <button className="btn btn-primary">OK</button>
            </>
          )}
          {/* Configuring The edit department */}
          {configureDialogBox(
            "editdept",
            "EDIT DEPARTMENT",
            <>
              <form>
                <label className="black" for="dept">
                  Name of department:{" "}
                </label>
                <input type="text" name="dept" id="dept"></input>
                <br />
              </form>
            </>,
            <>
              <button className="btn btn-primary">OK</button>
            </>
          )}
        </div>
        <ListItem height="90px">
          {{
            left: (
              <Form className="md-6">
                <Form.Group controlId="formBasicCheckbox">
                  <Row>
                    <Col>
                      <Form.Label className="text-dark">
                        Department Name
                      </Form.Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label className="text-dark">
                        Head of the department:
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        as="select"
                        defaultValue="Department"
                        placeholder="Department"
                        style={{ width: "200px" }}
                      >
                        <option>HOD</option>
                        <option>Teacher name</option>
                        <option>Teacher name</option>
                      </Form.Control>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            ),
            right: (
              <div>
                <Button className="btn btn-danger mr-3">
                  <FaMinus />
                </Button>
                <a
                  href="#"
                  data-toggle="modal"
                  data-target="#editdept"
                  style={{ color: "white" }}
                >
                  <Button className="btn btn-secondary">
                    <FaPencilAlt />
                  </Button>
                </a>
              </div>
            ),
          }}
        </ListItem>
      </div>
    );
  }
}

export default Departments;
