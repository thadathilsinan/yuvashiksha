import React, { Component } from "react";
import NavBar from "../../../ui-elements/navBar/NavBar";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { Button } from "react-bootstrap";
import { AiOutlineCheck } from "react-icons/ai";
export class StartExam extends Component {
  render() {
    return (
      <div className="root">
        <NavBar>
          {{
            left: (
              <div>
                <h5>TIME LEFT:HH:MM:SS</h5>
              </div>
            ),
            right: (
              <div>
                <Button className="btn btn-success">
                  <AiOutlineCheck />
                </Button>
              </div>
            ),
          }}
        </NavBar>
        <ListItem height="100px">
          {{
            left: (
              <div id="leftListItem">
                <p></p>
              </div>
            ),
            right: (
              <div id="rightListItem">
                <p></p>
              </div>
            ),
          }}
        </ListItem>
      </div>
    );
  }
}

export default StartExam;
