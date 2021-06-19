import React, { Component } from "react";
import "./Mcq.css";

class Mcq extends Component {
  //Reference for marks input
  marksRef = React.createRef();

  //Trigger when changing the marks in evaluation mode
  marksChange = (event) => {
    if (parseInt(event.target.value) > this.props.question.marks) {
      event.target.value = this.props.question.marks;
    }

    if (parseInt(event.target.value) < 0) {
      event.target.value = 0;
    }

    if (!Number.isInteger(parseInt(event.target.value))) {
      event.target.value = 0;
    }

    //Execute the passed onMarksChange function
    this.props.onMarksChange(event.target.value, this.props.question.id);
  };

  componentDidMount() {
    if (this.props.marks) this.marksRef.current.value = this.props.marks;
  }

  render() {
    let optionsList = this.props.question.options.map((option, index) => {
      return (
        <div class="form-check" key={this.props.question.id + option.name}>
          <input
            class="form-check-input"
            type="radio"
            name={`options${this.props.question.id}`}
            value={option.name}
            checked={
              option.correct &&
              !this.props.examMode &&
              !this.props.evaluationMode
                ? true
                : this.props.evaluationMode && option.name == this.props.answer
                ? true
                : undefined
            }
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
        <div className="text-right">
          {this.props.evaluationMode ? (
            <>
              <input
                type="number"
                className="mr-1"
                min="0"
                max={this.props.question.marks}
                step="1"
                ref={this.marksRef}
                onChange={this.marksChange}
                disabled={!this.props.answer ? true : undefined}
              ></input>
              /
            </>
          ) : null}
          {this.props.question.marks} Mark(s)
        </div>

        <div className="text-question">
          {this.props.index ? this.props.index + ". " : null}
          {this.props.question.question}
        </div>

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

export default Mcq;
