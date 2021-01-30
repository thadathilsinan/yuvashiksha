import { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./NavBar.css";

class NavBar extends Component {
  render() {
    return (
      <div id="navBar">
        <div
          className="d-flex flex-row justify-content-between align-items-center"
          id="navBarContainer"
        >
          <div id="left">{this.props.children.left}</div>
          <div id="center">{this.props.children.center}</div>
          <div id="right">{this.props.children.right}</div>
        </div>
      </div>
    );
  }
}

export default NavBar;
