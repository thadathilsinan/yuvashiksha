import React, { Component } from "react";

export default class Question extends Component {
  render() {
    return <div className="question">{this.props.text}</div>;
  }
}
