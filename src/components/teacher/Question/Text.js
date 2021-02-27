import React, { Component } from "react";

export default class Text extends Component {
  render() {
    return <div>{this.props.question.text}</div>;
  }
}
