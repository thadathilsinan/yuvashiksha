import React, { Component } from "react";
import "./Essay.css";
import CanvasPreview from "../../../ui-elements/Canvas/CanvasPreview/CanvasPreview";

class Essay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canvasPreview: false,
    };
  }

  //Show the canvas preview
  showCanvasPreview = () => {
    this.setState({ canvasPreview: true });
  };

  //Hide the canvasPreview component
  hideCanvasPreview = () => {
    this.setState({ canvasPreview: false });
  };

  render() {
    return (
      <div>
        {/* CANVAS PREVIEW */}
        {this.state.canvasPreview ? (
          <CanvasPreview
            img={this.props.canvas}
            close={this.hideCanvasPreview}
          />
        ) : null}

        <div className="text-right">{this.props.question.marks} Mark(s)</div>
        {this.props.index ? this.props.index + ". " : null}
        {this.props.question.question}

        {this.props.question.canvas ? (
          <div className="questionCanvas">
            <img src={this.props.question.canvas}></img>
          </div>
        ) : null}

        {this.props.question.image ? (
          <div className="questionImage">
            <img src={this.props.question.image}></img>
          </div>
        ) : null}

        {/* Display the exam wring system if the question is in examMode */}
        {this.props.examMode ? (
          <>
            <br />
            <hr />
            <div className="container">
              <div className="row">
                <div className="col-sm-10">
                  <textarea
                    placeholder="Your answer here"
                    name="essayQuestionAnswer"
                    rows="15"
                    onChange={(e) => {
                      this.props.textChange(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="col-sm-2">
                  <input
                    type="button"
                    value="CANVAS"
                    className="btn btn-primary"
                    onClick={this.props.canvasClick}
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Evalution Mode - Display the answer */}
        {this.props.evaluationMode ? (
          <>
            <br />
            <hr />
            <div className="container">
              <div className="row">
                <div className="col-sm-10">
                  <textarea name="essayQuestionAnswer" rows="15" disabled>
                    {this.props.answer}
                  </textarea>
                </div>
                <div className="col-sm-2">
                  <input
                    type="button"
                    value="CANVAS"
                    className="btn btn-primary"
                    onClick={this.showCanvasPreview}
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  }
}

export default Essay;
