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
import { withRouter } from "react-router-dom";

class NewExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [
        {
          id: 1,
          type: "text",
          text: "YOU CAN INSERT SOME INFORMATION TEXT LIKE THIS",
        },
        {
          id: 2,
          type: "mcq",
          question: "YOUR MULTIPLE CHOICE QUESTION HERE",
          marks: 1,
          image: null,
          canvas: null,
          options: [
            {
              name: "OPTION 1",
              correct: true,
            },
            {
              name: "OPTION 2",
              correct: false,
            },
            {
              name: "OPTION 3",
              correct: false,
            },
          ],
        },
        {
          id: 3,
          type: "short",
          marks: 2,
          question: "YOUR SHORT ANSWER TYPE QUESTION HERE",
          image: null,
          canvas: null,
        },
        {
          id: 4,
          type: "essay",
          question: "YOUR ESSAY TYPE QUESTION HERE",
          marks: 10,
          canvas: null,
          image: null,
        },
      ],
      selectedQuestion: null,
      editSelected: false,
      mcqModalOptions: [],
      image: "",
      canvas: "",
      showCanvas: false,
      lastOpenModal: null,
      classList: {},
      classOptions: null,
      batchOptions: null,
    };
  }

  //Creating required refs
  newTextRef = React.createRef();

  mcqQuestionRef = React.createRef();
  mcqMarksRef = React.createRef();
  mcqNewOption = React.createRef();

  shortMarksRef = React.createRef();
  shortQuestionRef = React.createRef();

  essayMarksRef = React.createRef();
  essayQuestionRef = React.createRef();

  //When scheduling exam
  examNameRef = React.createRef();
  subjectRef = React.createRef();
  timeFromRef = React.createRef();
  timeToRef = React.createRef();
  dateRef = React.createRef();
  marksRef = React.createRef();
  classRef = React.createRef();
  batchRef = React.createRef();

  //This is used when editiong an existing exam that is already scheduled
  setUpProps = () => {
    if (this.props.exam) {
      this.classRef.current.value = this.props.Class;
      this.setState({ questions: this.props.exam.questionPaper }, () => {
        this.examNameRef.current.value = this.props.exam.examName;
        this.subjectRef.current.value = this.props.exam.subject;
        this.timeFromRef.current.value = this.props.exam.from;
        this.timeToRef.current.value = this.props.exam.to;
        this.dateRef.current.value = this.props.exam.date;
        this.marksRef.current.value = this.props.exam.totalMarks;
      });
    }
  };

  //Add a new Text into questions
  addNewText = () => {
    let text = this.newTextRef.current.value;
    console.log(text);
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
    } else if (questionType == "essay") {
      this.essayMarksRef.current.value = selectedQuestion.marks;
      this.essayQuestionRef.current.value = selectedQuestion.question;
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

  //Add a new Essay question
  addEssay = () => {
    let question = this.essayQuestionRef.current.value;
    let marks = this.essayMarksRef.current.value;
    let id = Date.now();
    let type = "essay";

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

        this.essayMarksRef.current.value = "";
        this.essayQuestionRef.current.value = "";
        this.setState({ image: "", canvas: "" });

        window.$("#essayModal").modal("hide");
      } else {
        alert("Please enter marks");
      }
    } else {
      alert("Please enter question");
    }
  };

  //Edit existing essay question
  editEssay = () => {
    let question = this.essayQuestionRef.current.value;
    let marks = this.essayMarksRef.current.value;
    let id = Date.now();
    let type = "essay";

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
        window.$("#essayModal").modal("toggle");

        this.essayMarksRef.current.value = "";
        this.essayQuestionRef.current.value = "";
      } else {
        alert("Please enter marks");
      }
    } else {
      alert("Please enter question");
    }
  };

  //Open the schedule exam modal
  openScheduleExam = () => {
    //Checking if editExam mode or not
    if (this.props.exam) {
      this.classRef.current.value = this.props.Class;
      this.batchRef.current.value = this.props.batch;
    }

    if (this.state.questions.length > 0) {
      let marks = 0;

      //Setting total marks automatically
      for (let question of this.state.questions) {
        if (question.marks) {
          marks += parseInt(question.marks);
        }
      }

      this.marksRef.current.value = marks;
      window.$("#scheduleexam").modal("toggle");
    } else {
      alert("Please insert atleast one question");
    }
  };

  //Get Class data from the database (SCHEDULE EXAM)
  getClasses = () => {
    http("GET", "/login/getclasses", {}, (res) => {
      if (res.status == 200) {
        this.setState({ classList: res.data }, () => {
          this.setupClassOptions();
          this.setUpProps();
        });
      }
    });
  };

  //Setup the options for the <select> for classes (SCHEDULE EXAM)
  setupClassOptions = () => {
    //Options JSX
    let options = [];

    options = Object.keys(this.state.classList).map((key, array) => {
      return (
        <>
          <option value={key}>{key}</option>
        </>
      );
    });

    //Setting class list options to display
    this.setState({ classOptions: options }, () => {
      this.setUpProps();
      this.setupBatchOptions();
    });
  };

  //Setup the options for the <select> for batches based on the selected Class (SCHEDULE EXAM)
  setupBatchOptions = () => {
    //Currently selected class
    let Class = this.classRef.current.value;

    if (!Class) return;

    //Getting batches of the selected class
    let batches = this.state.classList[Class].batches;

    let options = batches.map((batch, index, array) => {
      return (
        <>
          <option value={batch}>{batch}</option>
        </>
      );
    });

    //Setting options as state to diaplay it in screen
    this.setState({ batchOptions: options });
  };

  //Schedule a new Exam
  scheduleExam = () => {
    let examName = this.examNameRef.current.value;
    let subject = this.subjectRef.current.value;
    let timeFrom = this.timeFromRef.current.value;
    let timeTo = this.timeToRef.current.value;
    let date = this.dateRef.current.value;
    let marks = this.marksRef.current.value;
    let Class = this.classRef.current.value;
    let batch = this.batchRef.current.value;

    if (!examName) {
      return alert("Please Enter exam name");
    }

    if (!subject) {
      return alert("Please Enter subject name");
    }

    if (!timeFrom) {
      return alert("Please Enter exam start time");
    }

    if (!timeTo) {
      return alert("Please Enter exam end time");
    }

    if (!date) {
      return alert("Please Enter date of exam");
    }

    if (!marks || marks == 0) {
      return alert("Invalid total marks");
    }

    if (!Class || !batch) {
      return alert("Class or batch data incorrect");
    }

    //Validate time
    let timeFromObject = new Date("1970-01-01 " + timeFrom);
    let timeToObject = new Date("1970-01-01 " + timeTo);

    if (timeFromObject.getTime() >= timeToObject.getTime()) {
      return alert("Invalid time!");
    }

    //Validate date
    let dateObject = new Date(date + " " + timeFrom);
    let now = new Date();

    if (dateObject.getTime() <= now.getTime()) {
      return alert("Invalid date");
    }

    //VALIDATION SUCCESS

    if (this.props.exam) {
      //EDIT MODE==EDIT EXISTING EXAM
      console.log(this.props.exam);
      http(
        "POST",
        "/teacher/editexam",
        {
          examName,
          subject,
          timeFrom,
          timeTo,
          date,
          marks,
          Class,
          batch,
          questions: this.state.questions,
          id: this.props.exam._id,
        },
        (res) => {
          alert(res.data);

          if (res.status == 200) {
            window.$(".modal.show").modal("hide");
            this.props.history.push("/teacher");
          }
        }
      );
    } else {
      //CREATE NEW EXAM
      //Send data to server
      http(
        "POST",
        "/teacher/newexam",
        {
          examName,
          subject,
          timeFrom,
          timeTo,
          date,
          marks,
          Class,
          batch,
          questions: this.state.questions,
        },
        (res) => {
          alert(res.data);

          if (res.status == 200) {
            window.$(".modal.show").modal("hide");
            this.props.history.push("/teacher");
          }
        }
      );
    }
  };

  componentDidMount() {
    this.getClasses();
  }

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
          <div id="submit">
            <Row className="mt-4">
              <Col className="mt-2">
                <Form.Label className="text-dark">EXAM NAME</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  ref={this.examNameRef}
                  className="text-box"
                  type="text"
                  placeholder="Exam name"
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col className="mt-2">
                <Form.Label className="text-dark">SUBJECT</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  ref={this.subjectRef}
                  className="text-box"
                  type="text"
                  placeholder="Subject"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col className="mt-2">
                <Form.Label className="text-dark">TIME</Form.Label>
              </Col>
            </Row>
            <Row>
              <Col className="mt-2">
                <Form.Label className="text-dark">From</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  ref={this.timeFromRef}
                  className="text-box"
                  type="time"
                  placeholder="FROM"
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="mt-2">
                <Form.Label className="text-dark">To</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  ref={this.timeToRef}
                  className="text-box"
                  type="time"
                  placeholder="TO"
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col className="mt-2">
                <Form.Label className="text-dark">DATE</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  ref={this.dateRef}
                  className="text-box"
                  type="date"
                  placeholder="Date"
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col className="mt-2">
                <Form.Label className="text-dark">TOTAL MARKS</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  ref={this.marksRef}
                  className="text-box"
                  type="number"
                  placeholder="Marks"
                  disabled
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col className="mt-2">
                <Form.Label className="text-dark">CLASS</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  ref={this.classRef}
                  as="select"
                  className="my-1 mr-sm-2 text-box"
                  id="inlineFormCustomSelectPref"
                  onChange={() => {
                    //Setup batch details based on the selected class
                    this.setupBatchOptions();
                  }}
                  custom
                >
                  <option value="" selected>
                    --CLASS--
                  </option>
                  {this.state.classOptions}
                </Form.Control>
              </Col>
              <Col className="mt-2">
                <Form.Label className="text-dark">BATCH</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  ref={this.batchRef}
                  as="select"
                  className="mr-1 mr-sm-2 text-box"
                  id="inlineFormCustomSelectPref"
                  custom
                >
                  <option value="" selected>
                    --BATCH--
                  </option>
                  {this.state.batchOptions}
                </Form.Control>
              </Col>
            </Row>
          </div>,
          <>
            <button className="create-btn" onClick={this.scheduleExam}>
              {this.props.exam ? "EDIT EXAM" : "CREATE EXAM"}
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
              className="create-btn"
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
            <form className="mcq-form">
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
            <button className="create-btn" onClick={this.addMcqOption}>
              Add option
            </button>
            <button className="create-btn" onClick={this.openCanvas}>
              Canvas{" "}
            </button>
            <button
              className="create-btn"
              onClick={() => {
                window.$("#uploadImage").modal("show");
              }}
            >
              Upload
            </button>
            <button
              className="create-btn"
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
              <textarea
                type="text"
                name="short"
                id="short"
                ref={this.shortQuestionRef}
                className="mr-3 form-control from-control-lg"
              ></textarea>
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
            <button className="create-btn" onClick={this.openCanvas}>
              Canvas{" "}
            </button>
            <button
              className="create-btn"
              onClick={() => {
                window.$("#uploadImage").modal("show");
              }}
            >
              Upload
            </button>
            <button
              className="create-btn"
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
                Enter Question:
              </label>
              <textarea
                type="text"
                name="short"
                id="short"
                ref={this.essayQuestionRef}
                className="mr-3 form-control from-control-lg"
              ></textarea>
              <br />
              <label className="black" for="mcq">
                Mark:
              </label>
              <input
                ref={this.essayMarksRef}
                type="number"
                name="mark"
                id="mark"
                className="ml-3 "
              ></input>
              <br />
            </form>
          </>,
          <>
            <button className="create-btn" onClick={this.openCanvas}>
              Canvas
            </button>
            <button
              className="create-btn"
              onClick={() => {
                window.$("#uploadImage").modal("show");
              }}
            >
              Upload
            </button>
            <button
              className="create-btn"
              onClick={this.state.editSelected ? this.editEssay : this.addEssay}
            >
              OK
            </button>
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
                  id="navBack"
                  size="sm"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Go back"
                  onClick={() => {
                    this.props.history.push("/teacher");
                  }}
                >
                  {"<"}
                </Button>
                <h5>
                  {this.props.exam
                    ? "EDIT QUESTION PAPER"
                    : "CREATE QUESTION PAPER"}
                </h5>
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
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Move question to bottom"
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
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Move Question to top"
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
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Edit Question"
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
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Delete Question"
                      disabled={this.state.selectedQuestion ? undefined : true}
                      onClick={this.removeQuestion}
                    >
                      <BsDash />
                    </button>
                  </Col>
                  <Col>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        id="dropdown-basic"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="Add Question"
                      >
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
                        <div class="dropdown-divider"></div>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#mcqModal"
                          onClick={() => {
                            this.setState({ editSelected: false, image: "" });
                          }}
                        >
                          Multiple Choice question
                        </Dropdown.Item>
                        <div class="dropdown-divider"></div>
                        <Dropdown.Item
                          data-toggle="modal"
                          data-target="#shortModal"
                          onClick={() => {
                            this.setState({ editSelected: false, image: "" });
                          }}
                        >
                          Short answer
                        </Dropdown.Item>
                        <div class="dropdown-divider"></div>
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
                  <Button
                    className="btn btn-success ml-3"
                    id="navSuccess"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Finish"
                    onClick={this.openScheduleExam}
                  >
                    <BsCheck />
                  </Button>
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

export default withRouter(NewExam);
