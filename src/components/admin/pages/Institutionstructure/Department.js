import React from "react";
import { Button, Form, Col, Row, Container, Modal } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import { FaMinus, FaPencilAlt, FaPlus } from "react-icons/fa";
import ListItem from "../../../ui-elements/ListItem/ListItem";
class Departments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHide: false,
    };
  }
  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide });
  }
  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  render() {
    return (
      <div className="container  col-md-8 mt-1 ">
        <div className="text-right">
          <Button onClick={this.handleShow} className="mr-4">
            <FaPlus />
          </Button>
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
                <Button
                  className="btn btn-secondary"
                  onClick={() => this.handleModalShowHide()}
                >
                  <FaPencilAlt />
                </Button>
              </div>
            ),
          }}
        </ListItem>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Department</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control size="lg" type="text" placeholder="Department name" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showHide}>
          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title>Edit Department</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control size="lg" type="text" placeholder="Department name" />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.handleModalShowHide()}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => this.handleModalShowHide()}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Departments;
