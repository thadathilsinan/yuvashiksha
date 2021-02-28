import React, { Component } from "react";
import "./Mcq.css";

export default class Mcq extends Component {
  render() {
    let optionsList = this.props.question.options.map((option, index) => {
      return (
        <div class="form-check" key={this.props.question.id + option.name}>
          <input
            class="form-check-input"
            type="radio"
            name="options"
            value={option.name}
            checked={option.correct ? true : undefined}
            disabled
          />
          <label class="form-check-label" for="options">
            {option.name}
          </label>
        </div>
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
