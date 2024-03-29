import React, { Component } from "react";
import Mcq from "./Mcq/Mcq";
import "./Question.css";
import Text from "./Text/Text";
import Short from "./Short/Short";
import Essay from "./Essay/Essay";
import Header from "./Header/Header";

export default class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      component: null,
    };
  }

  componentDidMount() {
    //Selecting question type
    if (this.props.question.type == "text") {
      this.setState({ component: <Text question={this.props.question} /> });
    } else if (this.props.question.type == "mcq") {
      this.setState({
        component: (
          <Mcq
            question={this.props.question}
            index={this.props.index}
            examMode={this.props.examMode}
            optionChange={this.props.optionChange}
            evaluationMode={this.props.evaluationMode}
            answer={this.props.answer}
            onMarksChange={this.props.onMarksChange}
            marks={this.props.marks}
          />
        ),
      });
    } else if (this.props.question.type == "short") {
      this.setState({
        component: (
          <Short
            question={this.props.question}
            index={this.props.index}
            examMode={this.props.examMode}
            canvasClick={this.props.canvasClick}
            textChange={this.props.textChange}
            evaluationMode={this.props.evaluationMode}
            answer={this.props.answer}
            canvas={this.props.canvas}
            onMarksChange={this.props.onMarksChange}
            marks={this.props.marks}
          />
        ),
      });
    } else if (this.props.question.type == "essay") {
      this.setState({
        component: (
          <Essay
            question={this.props.question}
            index={this.props.index}
            examMode={this.props.examMode}
            canvasClick={this.props.canvasClick}
            textChange={this.props.textChange}
            evaluationMode={this.props.evaluationMode}
            answer={this.props.answer}
            canvas={this.props.canvas}
            onMarksChange={this.props.onMarksChange}
            marks={this.props.marks}
          />
        ),
      });
    } else if (this.props.question.type == "header") {
      this.setState({
        component: <Header question={this.props.question} />,
      });
    }
  }

  render() {
    return (
      <div
        id={this.props.question.id}
        onClick={this.props.click}
        className="question list-group-item list-group-item-action"
        data-toggle={this.props.examMode ? undefined : "list"}
      >
        {this.state.component}
      </div>
    );
  }
}
