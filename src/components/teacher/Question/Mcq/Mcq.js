import React, { Component } from "react";
import "./Mcq.css";

export default class Mcq extends Component {
  render() {
    let optionsList = this.props.question.options.map((option, index) => {
      return (
        <>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="options"
              id={this.props.question.id + option.name}
              key={this.props.question.id + option.name}
              value={option.correct}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
            <label
              class="form-check-label"
              for="options"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {option.name}
            </label>
          </div>
        </>
      );
    });

    return (
      <div>
        <div className="text-right">{this.props.question.marks} Mark(s)</div>
        {this.props.index ? this.props.index + ". " : null}
        {this.props.question.question}

        <div className="questionCanvas">CANVAS HERE</div>
        <div className="questionImage">IMAGE HERE</div>

        <div>{optionsList}</div>
      </div>
    );
  }
}
