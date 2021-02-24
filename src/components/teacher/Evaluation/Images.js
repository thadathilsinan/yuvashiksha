import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import ListItem from "../../ui-elements/ListItem/ListItem";
import { Button, Card, Row, Col } from "react-bootstrap";
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
        <div>
          <Row>
            <Col>
              <Card
                className="mt-3 mb-3 mr-2 ml-3"
                style={{ width: "28rem", height: "20rem" }}
              >
                <Card.Title>Image 1</Card.Title>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                className="mt-3 mb-3 mr-2 ml-3"
                style={{ width: "28rem", height: "20rem" }}
              >
                <Card.Title>Image 2</Card.Title>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body></Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card
                className="mt-3 mb-3 mr-2 ml-3"
                style={{ width: "28rem", height: "20rem" }}
              >
                <Card.Title>Image 3</Card.Title>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                className="mt-3 mb-3 mr-2 ml-3"
                style={{ width: "28rem", height: "20rem" }}
              >
                <Card.Title>Image 4</Card.Title>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body></Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Images;
