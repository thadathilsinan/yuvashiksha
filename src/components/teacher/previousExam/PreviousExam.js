import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Button } from "react-bootstrap";
import { BiPrinter } from "react-icons/bi";

class PreviousExam extends Component {
  render() {
    return (
      <div>
        <NavBar>
          {{
            left: (
              <h5>
                Class Test
                <br />
                Html
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
    );
  }
}

export default PreviousExam;
