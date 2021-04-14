import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Button } from "react-bootstrap";
import { BiPrinter } from "react-icons/bi";
import { withRouter } from "react-router-dom";
import "./PreviousExam.css";

class PreviousExam extends Component {
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
                  {this.props.exam.examName}
                  <br />
                  {this.props.exam.subject}
                </div>
              </h5>
            ),
            right: (
              <h4>
                <Button className="btn btn-light">
                  <BiPrinter />
                </Button>
                <Button className="btn btn-success ml-2">PUBLISH</Button>
              </h4>
            ),
          }}
        </NavBar>
        <div id="studentListContainer">
          <ListItem height="100px">
            {{
              left: (
                <div id="leftListItem">
                  <p>Student name</p>
                  <p>Roll Number</p>
                </div>
              ),
              right: (
                <div id="rightListItem">
                  <p>Mark :0</p>
                </div>
              ),
            }}
          </ListItem>
        </div>
      </div>
    );
  }
}

export default withRouter(PreviousExam);
