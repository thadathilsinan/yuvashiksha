import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Button } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
export class Evaluation extends Component {
  render() {
    return (
      <div>
        <NavBar>
          {{
            left: (
              <h5>
                <span id="navBarBackButton">{"<"}</span>
                Student Name
                <br />
                Roll No
              </h5>
            ),
            right: (
              <h5>
                TOTAL MARKS:0
                <Button className="btn btn-light ml-5">IMAGES</Button>
              </h5>
            ),
          }}
        </NavBar>
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
        <Pagination className="mt-4 ml-3">
          <Pagination.Prev className="ml-3 mr-4 align-items-left"></Pagination.Prev>

          <Pagination.Next className="ml-3 mr-4 align-items-right"></Pagination.Next>
        </Pagination>
      </div>
    );
  }
}

export default Evaluation;
