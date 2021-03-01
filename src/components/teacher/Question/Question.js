import React, { Component } from "react";
import Mcq from "./Mcq/Mcq";
import "./Question.css";
import Text from "./Text/Text";
import Short from "./Short/Short";

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
          <Mcq question={this.props.question} index={this.props.index} />
        ),
      });
    } else if (this.props.question.type == "short") {
      this.setState({
        component: (
          <Short question={this.props.question} index={this.props.index} />
        ),
      });
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
