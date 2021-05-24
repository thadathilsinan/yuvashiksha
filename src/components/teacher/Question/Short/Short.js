import React, { Component } from "react";
import "./Short.css";

import CanvasPreview from "../../../ui-elements/Canvas/CanvasPreview/CanvasPreview";

class Short extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canvasPreview: false,
    };
  }

  //Trigger when changing the marks in evaluation mode
  marksChange = (event) => {
    if (event.target.value > this.props.question.marks) {
      event.target.value = this.props.question.marks;
    }

    if (event.target.value < 0) {
      event.target.value = 0;
    }

    if (!Number.isInteger(parseInt(event.target.value))) {
      event.target.value = 0;
    }

    //Execute the passed onMarksChange function
    this.props.onMarksChange(event.target.value, this.props.question.id);
  };

  //Show the canvas preview
  showCanvasPreview = () => {
    this.setState({ canvasPreview: true });
  };

  //Hide the canvasPreview component
  hideCanvasPreview = () => {
    this.setState({ canvasPreview: false });

    //Reset the zIndex of the elements
    let allElements = document.getElementsByTagName("*");
    for (let i = 0, len = allElements.length; i < len; i++) {
      let element = allElements[i];
      element.style.zIndex = "initial";
    }
  };

  render() {
    console.log(this.props);
    return (
      <div>
        {/* CANVAS PREVIEW */}
        {this.state.canvasPreview ? (
          <CanvasPreview
            img={this.props.canvas}
            close={this.hideCanvasPreview}
          />
        ) : null}

        <div className="text-right">
          <input
            type="number"
            className="mr-1"
            min="0"
            max={this.props.question.marks}
            step="1"
            onChange={this.marksChange}
          ></input>
          /{this.props.question.marks} Mark(s)
        </div>

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
                  <input
                    type="text"
                    placeholder="Your answer here"
                    name="shortQuestionAnswer"
                    onChange={(e) => {
                      this.props.textChange(e.target.value);
                      this.forceUpdate();
                    }}
                  />
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
                <div className="col-sm-12">
                  <input
                    type="text"
                    name="shortQuestionAnswer"
                    value={this.props.answer}
                    disabled
                  />
                </div>
              </div>
              {this.props.canvas ? (
                <div className="mt-3 text-right mb-3">
                  <input
                    type="button"
                    value="CANVAS"
                    className="btn btn-primary"
                    onClick={this.showCanvasPreview}
                  />
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    );
  }
}

export default Short;
