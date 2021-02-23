import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Button, Card } from "react-bootstrap";
export class Images extends Component {
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
            right: <h5>TOTAL MARKS:0</h5>,
          }}
        </NavBar>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>Image 1</Card.Title>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Images;
