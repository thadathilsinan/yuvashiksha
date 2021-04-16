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
            name={`options${this.props.question.id}`}
            value={option.name}
            checked={option.correct && !this.props.examMode ? true : undefined}
            onChange={(e) => {
              this.props.optionChange(e.target.value);
            }}
            disabled={!this.props.examMode}
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

        <div>{optionsList}</div>
      </div>
    );
  }
}
