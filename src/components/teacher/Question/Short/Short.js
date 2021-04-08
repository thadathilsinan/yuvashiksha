import React, { Component } from "react";
import "./Short.css";

export default class Short extends Component {
  render() {
    return (
      <div>
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
      </div>
    );
  }
}
