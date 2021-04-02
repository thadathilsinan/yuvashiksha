import React, { Component } from "react";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div>
        <center>
          <h2>{this.props.question.examName}</h2>
          <h4>{this.props.question.subject}</h4>
        </center>
        <br />
        <div
          className="d-flex flex-row justify-content-between align-items-center"
          id="navBarContainer"
        >
          <div id="left">
            <p>DATE : {this.props.question.date}</p>
            <p>TIME : {this.props.question.time}</p>
          </div>
          <div id="right">
            <p>MARKS : {this.props.question.marks}</p>
            <p>CLASS : {this.props.question.Class}</p>
            <p>BATCH : {this.props.question.batch}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
