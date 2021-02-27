import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import "./NewExam.css";
import {
  BsFillCaretDownFill,
  BsFillCaretUpFill,
  BsPencil,
  BsDash,
  BsCheck,
  BsPlus,
} from "react-icons/bs";
import { Button, Modal, Form, Row, Col, Dropdown } from "react-bootstrap";
import configureDialogBox from "../../../shared/dailogBox";
import $ from "jquery";

class NewExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedQuestion: null,
      questions: [],
      component: null,
    };
  }

  //Set the component to show
  setComponentView = () => {
    if (this.state.questions.length == 0) {
      //Setting empty questions view
      this.setState({
        component: (
          <div
            id="emptyQuestion"
            className="d-flex align-items-center justify-content-center"
          >
            <p>NO QUESTIONS INSERTED</p>
          </div>
        ),
      });
    }
  };

  componentDidMount() {
    this.setComponentView();
  }

  render() {
    //Check if any element selected or not
    if (!this.state.selectedQuestion) {
      $("#navBarDown, #navBarUp, #navBarEdit, #navBarDelete").attr(
        "disabled",
        "true"
      );
    }

    return (
      <div>
        {/* Configuring The scheduleexam */}
        {configureDialogBox(
          "scheduleexam",
          "SCHEDULE EXAM",
          <>
            <Row>
              <Col>
                <Form.Label className="text-dark">Exam name</Form.Label>
              </Col>
              <Col>
                <Form.Control size="lg" type="text" placeholder="Exam name" />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Label className="text-dark">Subject</Form.Label>
              </Col>
              <Col>
                <Form.Control size="lg" type="text" placeholder="Subject" />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Label className="text-dark">Time</Form.Label>
              </Col>

              <Col>
                <Form.Label className="text-dark">FROM</Form.Label>
              </Col>
              <Col>
                <Form.Control size="lg" type="text" placeholder="FROM" />
              </Col>
              <Col>
                <Form.Label className="text-dark">TO</Form.Label>
              </Col>
              <Col>
                <Form.Control size="lg" type="text" placeholder="TO" />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Label className="text-dark">Date</Form.Label>
              </Col>
              <Col>
                <Form.Control size="lg" type="text" placeholder="Date" />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Label className="text-dark">Mark</Form.Label>
              </Col>
              <Col>
                <Form.Control size="lg" type="text" placeholder="Mark" />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Label className="text-dark">Class</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  id="inlineFormCustomSelectPref"
                  custom
                >
                  <option value="0">Choose...</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Control>
              </Col>
              <Col>
                <Form.Label className="text-dark">Batch</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  id="inlineFormCustomSelectPref"
                  custom
                >
                  <option value="0">Choose...</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Control>
              </Col>
            </Row>
          </>,
          <>
            {" "}
            <button variant="light" className="btn btn-primary">
              Cancel
            </button>
            <button variant="light" className="btn btn-primary">
              Ok
            </button>
          </>
        )}
        {/* Configuring The add text */}
        {configureDialogBox(
          "textModal",
          "ADD TEXT",
          <>
            <form>
              <label className="black" for="text">
                Enter text:{" "}
              </label>
              <textarea
                rows="10"
                name="text"
                id="text"
                className="m-3"
              ></textarea>
            </form>
          </>,
          <>
            <button className="btn btn-primary">Cancel</button>
            <button className="btn btn-primary">Add</button>
          </>
        )}
        {/* Configuring The add mcq */}
        {configureDialogBox(
          "mcqModal",
          "ADD MULTIPLE CHOICE QUESTION",
          <>
            <form>
              <label className="black" for="mcq">
                Enter Question:{" "}
              </label>
              <input
                type="text"
                name="mcq"
                id="mcq"
                className="  mr-3 form-control from-control-lg"
              ></input>
              <br />
              <label className="black" for="mcq">
                Mark:{" "}
              </label>
              <input
                type="number"
                name="mark"
                id="mark"
                className="ml-3 "
              ></input>
              <br />
              <input
                className="form-check-input ml-3"
                type="checkbox"
                value=""
                id="defaultCheck1"
              ></input>
              <label
                className="black form-check-label ml-5"
                for="defaultCheck1"
              >
                Allow Multiple Selctions
              </label>
              <br />
            </form>
          </>,
          <>
            <button className="btn btn-primary">Add option</button>
            <button className="btn btn-primary">Canvas </button>
            <button className="btn btn-primary">Upload</button>
            <button className="btn btn-primary">Cancel</button>
            <button className="btn btn-primary">Add</button>
          </>
        )}
        {/* Configuring The add SHORT */}
        {configureDialogBox(
          "shortModal",
          "ADD SHORT ANSWER QUESTION",
          <>
            <form>
              <label className="black mr-3" for="mcq">
                Enter Question:{" "}
              </label>
              <input
                type="text"
                name="short"
                id="short"
                className="mr-3 form-control from-control-lg"
              ></input>
              <br />
              <label className="black" for="mcq">
                Mark:{" "}
              </label>
              <input
                type="number"
                name="mark"
                id="mark"
                className="ml-3 "
              ></input>
              <br />
            </form>
          </>,
          <>
            <button className="btn btn-primary">Canvas </button>
            <button className="btn btn-primary">Upload</button>
            <button className="btn btn-primary">Cancel</button>
            <button className="btn btn-primary">Add</button>
          </>
        )}
        {/* Configuring The add SHORT */}
        {configureDialogBox(
          "essayModal",
          "ADD ESSAY QUESTION",
          <>
            <form>
              <label className="black mr-3" for="mcq">
                Enter Question:{" "}
              </label>
              <input
                type="text"
                name="short"
                id="short"
                className="mr-3 form-control from-control-lg"
              ></input>
              <br />
              <label className="black" for="mcq">
                Mark:{" "}
              </label>
              <input
                type="number"
                name="mark"
                id="mark"
                className="ml-3 "
              ></input>
              <br />
            </form>
          </>,
          <>
            <button className="btn btn-primary">Canvas </button>
            <button className="btn btn-primary">Upload</button>
            <button className="btn btn-primary">Cancel</button>
            <button className="btn btn-primary">Add</button>
          </>
        )}
        <NavBar>
          {{
            left: (
              <div>
                <Button
                  variant="primary"
                  className="btn btn-primary mr-3"
                  size="sm"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  {"<"}
                </Button>
                <h5>CREATE QUESTION PAPER</h5>
              </div>
            ),
            right: (
              <div>
                <Row>
                  <Col>
                    {" "}
                    <Button className="btn btn-light " id="navBarDown">
                      <BsFillCaretDownFill />
                    </Button>
                  </Col>
                  <Col>
                    <Button className="btn btn-light ml-3 " id="navBarUp">
                      <BsFillCaretUpFill />
                    </Button>
                  </Col>
                  <Col>
                    <Button className="btn btn-light ml-3 " id="navBarEdit">
                      <BsPencil />
                    </Button>
                  </Col>
                  <Col>
                    <Button className="btn btn-light ml-3 " id="navBarDelete">
                      <BsDash />
                    </Button>
                  </Col>
                  <Col>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" id="dropdown-basic">
                        <BsPlus />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#textModal"
                        >
                          Text
                        </Dropdown.Item>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#mcqModal"
                        >
                          Multiple Choice question
                        </Dropdown.Item>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#shortModal"
                        >
                          Short answer
                        </Dropdown.Item>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#essayModal"
                        >
                          Essay Question
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <a
                    href="#"
                    data-toggle="modal"
                    data-target="#scheduleexam"
                    style={{ color: "white" }}
                  >
                    <Button className="btn btn-success ml-3">
                      <BsCheck />
                    </Button>
                  </a>
                </Row>
              </div>
            ),
          }}
        </NavBar>
        <div id="newExamBody">{this.state.component}</div>
      </div>
    );
  }
}

export default NewExam;
