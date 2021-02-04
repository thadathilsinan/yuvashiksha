import React, { Component } from "react";
import { Button, Row, Form, Col, Modal } from "react-bootstrap";

import { FaMinus, FaPencilAlt, FaPlus } from "react-icons/fa";
import ListItem from "../../ui-elements/ListItem/ListItem";
export default class ClassBatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      modalShow: false,
    };
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
                        <Form.Label className="text-dark">Mentor</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          as="select"
                          defaultValue="Class Mentor"
                          placeholder="Class Mentor"
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
                <Button className="btn btn-danger mr-3">
                  <FaMinus />
                </Button>
                <Button
                  className="btn btn-secondary"
                  onClick={() => this.setState({ modalShow: true })}
                >
                  <FaPencilAlt />
                </Button>
              </div>
            ),
          }}
        </ListItem>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Classbatch</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <Form.Control
                className="pt-2"
                size="lg"
                type="text"
                placeholder="Class"
              />
            </p>
            <p>
              <Form.Control
                className="pt-2"
                size="lg"
                type="text"
                placeholder="Batch"
              />
            </p>
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
        <Modal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Classbatch</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <Form.Control
                className="pt-2"
                size="lg"
                type="text"
                placeholder="Class"
              />
            </p>
            <p>
              <Form.Control
                className="pt-2"
                size="lg"
                type="text"
                placeholder="Batch"
              />
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onHide}>
              Close
            </Button>
            <Button variant="primary" onClick={this.props.onHide}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
