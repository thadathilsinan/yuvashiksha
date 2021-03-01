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
import http from "../../../shared/http";
import Question from "../Question/Question";
import Canvas from "../../ui-elements/Canvas/Canvas";

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
      mcqModalOptions: [],
      image: "",
      canvas: "",
      showCanvas: false,
      lastOpenModal: null,
    };
  }

  //Creating required refs
  newTextRef = React.createRef();

  mcqQuestionRef = React.createRef();
  mcqMarksRef = React.createRef();
  mcqNewOption = React.createRef();

  shortMarksRef = React.createRef();
  shortQuestionRef = React.createRef();

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
      window.$("#textModal").modal("toggle");
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
    } else if (questionType == "mcq") {
      this.mcqMarksRef.current.value = selectedQuestion.marks;
      this.mcqQuestionRef.current.value = selectedQuestion.question;
      this.setState({
        mcqModalOptions: selectedQuestion.options,
        image: selectedQuestion.image,
        canvas: selectedQuestion.canvas,
      });
    } else if (questionType == "short") {
      this.shortMarksRef.current.value = selectedQuestion.marks;
      this.shortQuestionRef.current.value = selectedQuestion.question;
      this.setState({
        image: selectedQuestion.image,
        canvas: selectedQuestion.canvas,
      });
    }
  };

  //Render options list in mcqModal
  renderMcqModalOptions = () => {
    return this.state.mcqModalOptions.map((option, index) => {
      return (
        <tr key={option.name}>
          <td>
            <input
              className="ml-3"
              type="radio"
              name="mcqModalOptions"
              value={option.name}
              checked={option.correct ? true : undefined}
              onChange={(e) => {
                this.mcqSelectCorrectOption();
              }}
            />
          </td>

          <td
            onClick={(e) => {
              this.removeMcqOption(e.target.getAttribute("name"));
            }}
            name={option.name}
          >
            <label
              name={option.name}
              class="form-check-label"
              for="mcqModalOptions"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {option.name}
            </label>
          </td>
        </tr>
      );
    });
  };

  //Add new option to mcq
  addMcqOption = () => {
    let newOption = this.mcqNewOption.current.value;

    if (newOption) {
      this.setState({
        mcqModalOptions: [
          ...this.state.mcqModalOptions,
          { name: newOption, correct: false },
        ],
      });

      //Reset form value
      this.mcqNewOption.current.value = "";
    } else {
      alert("Enter option to add");
    }
  };

  //Remove option in mcq
  removeMcqOption = (name) => {
    let confirmation = window.confirm("Are you sure to remove option?");

    if (confirmation) {
      let options = [...this.state.mcqModalOptions];

      for (let i in options) {
        if (options[i].name == name) {
          options.splice(i, 1);
        }
      }

      this.setState({ mcqModalOptions: [...options] });
    }
  };

  //Add MCQ Question
  addMcqQuestion = () => {
    let question = this.mcqQuestionRef.current.value;
    let marks = this.mcqMarksRef.current.value;
    let options = [...this.state.mcqModalOptions];
    let id = Date.now();
    let type = "mcq";

    if (question) {
      if (marks) {
        if (options.length > 0) {
          //Validation success

          //Adding new Question
          this.setState({
            questions: [
              ...this.state.questions,
              {
                question,
                marks,
                options,
                id,
                type,
                image: this.state.image,
                canvas: this.state.canvas,
              },
            ],
            mcqModalOptions: [],
          });

          this.mcqMarksRef.current.value = "";
          this.mcqQuestionRef.current.value = "";
          this.setState({ image: "", canvas: "", editCanvas: "" });

          window.$("#mcqModal").modal("hide");
        } else {
          alert("No options inserted for the question");
        }
      } else {
        alert("Please enter marks");
      }
    } else {
      alert("Please enter question");
    }
  };

  //When selecting MCQ correct option
  mcqSelectCorrectOption = () => {
    let correctOption = window.$('input[name="mcqModalOptions"]:checked').val();

    let options = [...this.state.mcqModalOptions];

    for (let i in options) {
      if (options[i].name == correctOption) {
        options[i].correct = true;
      } else {
        options[i].correct = false;
      }
    }

    this.setState({ mcqModalOptions: [...options] });
  };

  //Edit an existing MCQ
  editMcq = () => {
    let question = this.mcqQuestionRef.current.value;
    let marks = this.mcqMarksRef.current.value;
    let options = [...this.state.mcqModalOptions];
    let id = Date.now();
    let type = "mcq";

    let questions = [...this.state.questions];

    if (question) {
      if (marks) {
        if (options.length > 0) {
          //Validation success

          //Editing Question
          let i = 0;
          for (i in questions) {
            if (questions[i].id == this.state.selectedQuestion) {
              questions.splice(i, 1);

              break;
            }
          }

          questions.splice(i, 0, {
            question,
            marks,
            options,
            id,
            type,
            image: this.state.image,
            canvas: this.state.canvas,
          });

          this.setState({
            questions: [...questions],
            mcqModalOptions: [],
            editSelected: false,
            selectedQuestion: null,
            image: "",
            canvas: "",
            editCanvas: "",
          });
          window.$("#mcqModal").modal("toggle");

          this.mcqMarksRef.current.value = "";
          this.mcqQuestionRef.current.value = "";
        } else {
          alert("No options inserted for the question");
        }
      } else {
        alert("Please enter marks");
      }
    } else {
      alert("Please enter question");
    }
  };

  //File upload
  uploadFile = () => {
    let imageFile = document.getElementById("imageUpload").files[0];
    let formData = new FormData();

    if (!imageFile) {
      return alert("Please select an image");
    }

    formData.append("image", imageFile);

    $.ajax({
      url: "http://localhost:4000/upload",
      cache: false,
      contentType: false,
      processData: false,
      data: formData,
      type: "POST",
      success: (response) => {
        this.setState({ image: response });
        window.$("#uploadImage").modal("hide");
      },
      error: function (error) {
        alert("File upload error. Check file type and size");
      },
    });
  };

  //Clear uploaded image
  clearUpload = () => {
    this.setState({ image: "" });
    window.$("#uploadImage").modal("hide");
  };

  //Open canvas
  openCanvas = () => {
    this.setState({
      showCanvas: true,
      lastOpenModal: window.$(".modal.show"),
    });

    window.$(".modal").modal("hide");
  };

  //Close canvas
  closeCanvas = () => {
    this.state.lastOpenModal.modal("show");

    this.setState({ showCanvas: false, lastOpenModal: null });
  };

  //Save Canvas
  saveCanvas = (image) => {
    this.state.lastOpenModal.modal("show");

    this.setState({ showCanvas: false, canvas: image, lastOpenModal: null });
  };

  //Add a new Short question
  addShort = () => {
    let question = this.shortQuestionRef.current.value;
    let marks = this.shortMarksRef.current.value;
    let id = Date.now();
    let type = "short";

    if (question) {
      if (marks) {
        //Validation success

        //Adding new Question
        this.setState({
          questions: [
            ...this.state.questions,
            {
              question,
              marks,
              id,
              type,
              image: this.state.image,
              canvas: this.state.canvas,
            },
          ],
        });

        this.shortQuestionRef.current.value = "";
        this.shortMarksRef.current.value = "";
        this.setState({ image: "", canvas: "", editCanvas: "" });

        window.$("#shortModal").modal("hide");
      } else {
        alert("Please enter marks");
      }
    } else {
      alert("Please enter question");
    }
  };

  //Edit existing short question
  editShort = () => {
    let question = this.shortQuestionRef.current.value;
    let marks = this.shortMarksRef.current.value;
    let id = Date.now();
    let type = "short";

    let questions = [...this.state.questions];

    if (question) {
      if (marks) {
        //Validation success

        //Editing Question
        let i = 0;
        for (i in questions) {
          if (questions[i].id == this.state.selectedQuestion) {
            questions.splice(i, 1);

            break;
          }
        }

        questions.splice(i, 0, {
          question,
          marks,
          id,
          type,
          image: this.state.image,
          canvas: this.state.canvas,
        });

        this.setState({
          questions: [...questions],
          editSelected: false,
          selectedQuestion: null,
          image: "",
          canvas: "",
        });
        window.$("#shortModal").modal("toggle");

        this.shortMarksRef.current.value = "";
        this.shortQuestionRef.current.value = "";
      } else {
        alert("Please enter marks");
      }
    } else {
      alert("Please enter question");
    }
  };

  componentDidMount() {}

  render() {
    return (
      <div>
        {/**SHOW CANVAS */}
        {this.state.showCanvas ? (
          <Canvas
            close={this.closeCanvas}
            save={this.saveCanvas}
            image={this.state.editSelected ? this.state.canvas : undefined}
          />
        ) : null}
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
              <textarea
                name="mcq"
                ref={this.mcqQuestionRef}
                id="mcq"
                className="  mr-3 form-control from-control-lg"
              ></textarea>
              <br />
              <label className="black" for="mcq">
                Mark:{" "}
              </label>
              <input
                type="number"
                name="mark"
                id="mark"
                ref={this.mcqMarksRef}
                className="ml-3 "
              ></input>
              <br />
              <div className="mcqOptionsContainer">
                <table>
                  <tr>
                    <td>Correct</td>
                    <td>Choice</td>
                  </tr>
                  {this.renderMcqModalOptions()}
                  <tr>
                    <td></td>
                    <td>
                      <input
                        type="text"
                        name="mcqNewOption"
                        placeholder="New Option"
                        ref={this.mcqNewOption}
                      ></input>
                    </td>
                  </tr>
                </table>
              </div>
            </form>
          </>,
          <>
            <button className="btn btn-primary" onClick={this.addMcqOption}>
              Add option
            </button>
            <button className="btn btn-primary" onClick={this.openCanvas}>
              Canvas{" "}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                window.$("#uploadImage").modal("show");
              }}
            >
              Upload
            </button>
            <button
              className="btn btn-primary"
              onClick={
                this.state.editSelected ? this.editMcq : this.addMcqQuestion
              }
            >
              OK
            </button>
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
                Enter Question:
              </label>
              <input
                type="text"
                name="short"
                id="short"
                ref={this.shortQuestionRef}
                className="mr-3 form-control from-control-lg"
              ></input>
              <br />
              <label className="black" for="mcq">
                Mark:
              </label>
              <input
                type="number"
                name="mark"
                id="mark"
                ref={this.shortMarksRef}
                className="ml-3 "
              ></input>
              <br />
            </form>
          </>,
          <>
            <button className="btn btn-primary" onClick={this.openCanvas}>
              Canvas{" "}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                window.$("#uploadImage").modal("show");
              }}
            >
              Upload
            </button>
            <button
              className="btn btn-primary"
              onClick={this.state.editSelected ? this.editShort : this.addShort}
            >
              OK
            </button>
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
        <div>
          {configureDialogBox(
            "uploadImage",
            "Upload Image",
            <>
              <form
                // action="http://localhost:4000/upload"
                enctype="multipart/form-data"
                // method="post"
              >
                <p>MAX FILE SIZE (5MB)</p>
                <p>Only .jpg, .jpeg, .png files supported</p>
                <input type="file" id="imageUpload" name="image" />
                <input
                  type="button"
                  value="UPLOAD"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    this.uploadFile();
                  }}
                />
                <input
                  type="button"
                  value="CLEAR"
                  className="btn btn-danger ml-1"
                  onClick={(e) => {
                    e.preventDefault();
                    this.clearUpload();
                  }}
                />
              </form>
            </>
          )}
        </div>
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
                            this.setState({ editSelected: false, image: "" });
                          }}
                        >
                          Text
                        </Dropdown.Item>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#mcqModal"
                          onClick={() => {
                            this.setState({ editSelected: false, image: "" });
                          }}
                        >
                          Multiple Choice question
                        </Dropdown.Item>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#shortModal"
                          onClick={() => {
                            this.setState({ editSelected: false, image: "" });
                          }}
                        >
                          Short answer
                        </Dropdown.Item>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#essayModal"
                          onClick={() => {
                            this.setState({ editSelected: false, image: "" });
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
