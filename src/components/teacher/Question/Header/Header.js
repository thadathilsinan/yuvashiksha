import React, { Component } from "react";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div>
        <center>
          <h2>EXAM NAME</h2>
          <h4>SUBJECT</h4>
        </center>
        <br />
        <div
          className="d-flex flex-row justify-content-between align-items-center"
          id="navBarContainer"
        >
          <div id="left">
            <p>DATE : </p>
            <p>TIME : </p>
          </div>
          <div id="right">
            <p>MARKS :</p>
            <p>CLASS: </p>
            <p>BATCH : </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
