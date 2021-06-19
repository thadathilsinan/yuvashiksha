import React, { Component } from "react";
import "./Text.css";
export default class Text extends Component {
  render() {
    return <div className="text-question">{this.props.question.text}</div>;
  }
}
