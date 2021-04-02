import React, { Component } from "react";
import "./QuestionPaperPreview.css";

import NavBar from "../../ui-elements/navBar/NavBar";
import { BsPencil, BsDash } from "react-icons/bs";
import { Row, Col, Button } from "react-bootstrap";
import Question from "../Question/Question";

class QuestionPaperPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  //Parse the questions to display it
  parseQuestions = () => {
    return this.props.exam.questionPaper.map((question, index) => {
      return (
        <Question
          question={question}
          click={this.selectQuestion}
          key={question.id}
        />
      );
    });
  };

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <div>
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
                <h5>PREVIEW QUESTION PAPER</h5>
              </div>
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
        {/* Body of the question paper */}
        <div id="previewExamBody">
          <Question question={{ type: "header" }} />
          {this.parseQuestions()}
        </div>
      </div>
    );
  }
}

export default QuestionPaperPreview;
