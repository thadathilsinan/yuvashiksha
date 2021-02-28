// [
// 	{
// 		id: 123,
// 		type: “text”,
// 		text: “Content here”
// 	},
// 	{
// 		id: 345,
// 		type: “mcq”,
// 		question: “question text here”,
// 		marks: 1,
// 		allowMultipleSelection: true,
// 		image: ObjectId(ASSETS),
// 		canvas: ObjectId(ASSETS),
// 		options: [
// 			{
// 				name: “option 1”,
// 				correct: true
// 			}
// 		]
// 	},
// 	{
// 		id: 211,
// 		type: “short”,
// 		marks: 2,
// 		question: “Question here”,
// 		image: ObjectId(ASSETS),
// 		canvas: ObjectId(ASSETS)
// 	},
// 	{
// 		id: 1212,
// 		type: “essay”,
// 		question: “Question Here”,
// 		marks: 10,
// 		canvas: ObjectId(ASSETS),
// 		image: ObjectId(ASSETS)
// 	}
// ]

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
import Question from "../Question/Question";

class NewExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [
        {
          id: 123,
          type: "text",
          text: "Content here",
        },
        {
          id: 345,
          type: "mcq",
          question: "question text here",
          marks: 1,
          allowMultipleSelection: true,
          image: null, //ObjectId(ASSETS),
          canvas: null, //ObjectId(ASSETS),
          options: [
            {
              name: "option 1",
              correct: true,
            },
            {
              name: "option 2",
              correct: false,
            },
            {
              name: "option 3",
              correct: false,
            },
          ],
        },
        {
          id: 211,
          type: "short",
          marks: 2,
          question: "Question here",
          image: null, //ObjectId(ASSETS),
          canvas: null, //ObjectId(ASSETS)
        },
        {
          id: 1212,
          type: "essay",
          question: "Question Here",
          marks: 10,
          canvas: null, //ObjectId(ASSETS),
          image: null, //ObjectId(ASSETS)
        },
      ],
      selectedQuestion: null,
      editSelected: false,
    };
  }

  //Creating required refs
  newTextRef = React.createRef();

  //Add a new Text into questions
  addNewText = () => {
    let text = this.newTextRef.current.value;

    if (text) {
      this.setState({
        questions: [
          ...this.state.questions,
          { type: "text", id: Date.now(), text },
        ],
      });
    } else {
      alert("Please enter some text");
    }
  };

  //Edit an existing Text
  editText = () => {
    let text = this.newTextRef.current.value;
    let questions = [...this.state.questions];

    if (text) {
      //Getting the the question that is selected
      let i = 0;
      for (i in questions) {
        if (questions[i].id == this.state.selectedQuestion) {
          questions.splice(i, 1);

          break;
        }
      }

      questions.splice(i, 0, { type: "text", text, id: Date.now() });

      this.setState({
        questions: [...questions],
        editSelected: false,
        selectedQuestion: null,
      });
      window.$("#textModal").modal("toggle");
    } else {
      alert("Please enter some text");
    }
  };

  //Parse the questions to display it
  parseQuestions = () => {
    return this.state.questions.map((question, index) => {
      return (
        <Question
          question={question}
          click={this.selectQuestion}
          key={question.id}
        />
      );
    });
  };

  //select a particular question (Called inside <Question/>)
  selectQuestion = (event) => {
    let questionElement = null;

    //SELECTING PARENT QUESTION ELEMENT
    for (let element of event.nativeEvent.path) {
      if ($(element).hasClass("question")) questionElement = element;
    }

    this.setState({ selectedQuestion: questionElement.id });
  };

  //Remove question from array
  removeQuestion = () => {
    let questions = [...this.state.questions];
    for (let i in questions) {
      if (questions[i].id == this.state.selectedQuestion) {
        questions.splice(i, 1);
        this.setState({ questions });
      }
    }
    this.forceUpdate();
    this.state.selectedQuestion = null;
    $("#questionsList .active").removeClass("active");
  };

  //Change order -1
  questionDown = () => {
    let questions = [...this.state.questions];
    const max = questions.length - 1;

    for (let i in questions) {
      if (questions[i].id == this.state.selectedQuestion) {
        if (i >= max) {
          alert("This is the last question, Cannot move down");
        } else {
          //Swapping down
          questions.splice(parseInt(i) + 1, 0, questions.splice(i, 1)[0]);

          break;
        }
      }
    }
    this.setState({ questions });
  };

  //Change order +1
  questionUp = () => {
    let questions = [...this.state.questions];

    for (let i in questions) {
      if (questions[i].id == this.state.selectedQuestion) {
        if (i <= 0) {
          alert("This is the first question, Cannot move up");
        } else {
          //Swapping up
          questions.splice(parseInt(i) - 1, 0, questions.splice(i, 1)[0]);

          break;
        }
      }
    }
    this.setState({ questions });
  };

  //Edit currently selected Question
  editSelectedQuestion = () => {
    let selectedQuestion = null;
    this.setState({ editSelected: true });

    //Getting the type of the question that is selected
    let questionType = "";
    for (let question of this.state.questions) {
      if (question.id == this.state.selectedQuestion) {
        selectedQuestion = question;
        questionType = question.type;
      }
    }

    window.$("#" + questionType + "Modal").modal("toggle");

    if (questionType == "text") {
      this.newTextRef.current.value = selectedQuestion.text;
    }
  };

  componentDidMount() {}

  render() {
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
          this.state.editSelected ? "EDIT TEXT" : "ADD TEXT",
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
                ref={this.newTextRef}
              ></textarea>
            </form>
          </>,
          <>
            <button
              className="btn btn-primary"
              onClick={
                this.state.editSelected ? this.editText : this.addNewText
              }
            >
              OK
            </button>
          </>
        )}
        {/* Configuring The add mcq */}
        {configureDialogBox(
          "mcqModal",
          this.state.editSelected
            ? "EDIT MULTIPLE CHOICE QUESTION"
            : "ADD MULTIPLE CHOICE QUESTION",
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
            <button className="btn btn-primary">OK</button>
          </>
        )}
        {/* Configuring The add SHORT */}
        {configureDialogBox(
          "shortModal",
          this.state.editSelected
            ? "EDIT SHORT ANSWER QUESTION"
            : "ADD SHORT ANSWER QUESTION",
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
            <button className="btn btn-primary">OK</button>
          </>
        )}
        {/* Configuring The add SHORT */}
        {configureDialogBox(
          "essayModal",
          this.state.editSelected
            ? "EDIT ESSAY QUESTION"
            : "ADD ESSAY QUESTION",
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
            <button className="btn btn-primary">OK</button>
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
                    <button
                      className="btn btn-light "
                      id="navBarDown"
                      disabled={this.state.selectedQuestion ? undefined : true}
                      onClick={this.questionDown}
                    >
                      <BsFillCaretDownFill />
                    </button>
                  </Col>
                  <Col>
                    <button
                      className="btn btn-light ml-3 "
                      id="navBarUp"
                      disabled={this.state.selectedQuestion ? undefined : true}
                      onClick={this.questionUp}
                    >
                      <BsFillCaretUpFill />
                    </button>
                  </Col>
                  <Col>
                    <button
                      className="btn btn-light ml-3 "
                      id="navBarEdit"
                      disabled={this.state.selectedQuestion ? undefined : true}
                      onClick={this.editSelectedQuestion}
                    >
                      <BsPencil />
                    </button>
                  </Col>
                  <Col>
                    <button
                      className="btn btn-light ml-3 "
                      id="navBarDelete"
                      disabled={this.state.selectedQuestion ? undefined : true}
                      onClick={this.removeQuestion}
                    >
                      <BsDash />
                    </button>
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
                          onClick={() => {
                            this.setState({ editSelected: false });
                          }}
                        >
                          Text
                        </Dropdown.Item>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#mcqModal"
                          onClick={() => {
                            this.setState({ editSelected: false });
                          }}
                        >
                          Multiple Choice question
                        </Dropdown.Item>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#shortModal"
                          onClick={() => {
                            this.setState({ editSelected: false });
                          }}
                        >
                          Short answer
                        </Dropdown.Item>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#essayModal"
                          onClick={() => {
                            this.setState({ editSelected: false });
                          }}
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
        <div id="newExamBody">
          {this.state.questions.length == 0 ? (
            <div
              id="emptyQuestion"
              className="d-flex align-items-center justify-content-center"
            >
              <p>NO QUESTIONS INSERTED</p>
            </div>
          ) : (
            <div className="list-group" id="questionsList">
              {this.parseQuestions()}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default NewExam;
