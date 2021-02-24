import React from "react";
import { Button, Form, Col, Row, Container, Modal } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import { FaMinus, FaPencilAlt, FaPlus } from "react-icons/fa";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import configureDialogBox from "../../../../shared/dailogBox";
class Departments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container  col-md-8 mt-1 ">
        <div className="text-right">
          {/* Configuring The add department */}
          {configureDialogBox(
            "adddept",
            "ADD DEPARTMENT",
            <>
              <form>
                <label className="black" for="dept">
                  Add Department:{" "}
                </label>
                <input
                  type="text"
                  size="lg"
                  name="department name"
                  id="department name"
                  className="m-3"
                ></input>
                <br />
              </form>
            </>,
            <>
              <button className="btn btn-primary">Ok</button>
            </>
          )}
          {/* Configuring The edit department */}
          {configureDialogBox(
            "editdept",
            "EDIT DEPARTMENT",
            <>
              <form>
                <label className="black" for="dept">
                  Add Department:{" "}
                </label>
                <input
                  type="text"
                  size="lg"
                  name="department name"
                  id="department name"
                  className="m-3"
                  placeholder="department old name"
                ></input>
                <br />
              </form>
            </>,
            <>
              <button className="btn btn-primary">Ok</button>
            </>
          )}

          <a
            href="#"
            data-toggle="modal"
            data-target="#adddept"
            style={{ color: "white" }}
          >
            <Button className="mr-4">
              <FaPlus />
            </Button>
          </a>
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
                        {" "}
                        Name of hod
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        as="select"
                        defaultValue="Department"
                        placeholder="Department"
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
