import React, { Component } from "react";
import "./Question.css";
import Text from "./Text";

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
    }
  }

  render() {
    return (
      <div
        id={this.props.question.id}
        onClick={this.props.click}
        className="question list-group-item list-group-item-action"
        data-toggle="list"
      >
        {this.state.component}
      </div>
    );
  }
}
