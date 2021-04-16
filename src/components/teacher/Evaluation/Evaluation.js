import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./Evaluation.css";

class Evaluation extends Component {
  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <NavBar>
          {{
            left: (
              <h5 style={{ display: "flex" }}>
                <Button
                  variant="primary"
                  className="btn btn-primary mr-3"
                  size="sm"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  {"<"}
                </Button>
                <div>
                  Student Name: {this.props.student.name}
                  <br />
                  Reg. No: {this.props.student.registerNumber}
                </div>
              </h5>
            ),
            right: (
              <h5>
                TOTAL MARKS: {this.props.student.marks}
                <Button className="btn btn-light ml-5">IMAGES</Button>
              </h5>
            ),
          }}
        </NavBar>
        <div id="bodyContainer">
          <ListItem height="100px">
            {{
              left: (
                <div id="leftListItem">
                  <p>DATE:DD-MM-YYYY</p>
                  <p>TIME:HH:MM:SS</p>
                  <p>Name of Examination:</p>
                </div>
              ),
              right: (
                <div id="rightListItem">
                  <p>Subject:</p>
                  <p>MARK:80</p>
                </div>
              ),
            }}
          </ListItem>
        </div>
      </div>
    );
  }
}

export default withRouter(Evaluation);
