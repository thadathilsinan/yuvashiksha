import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row, Col, Form } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";

function Home() {
  return (
    <div>
      <div className="container  col-md-6 mt-5">
        <Jumbotron className="bg-secondary">
          <h1 className="text-light">Change password</h1>
          <Form>
            <Form.Group as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="2">
                New Password
              </Form.Label>
              <Col sm="10">
                <Form.Control type="password" placeholder="Password" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="2">
                Confirm Password
              </Form.Label>
              <Col sm="10">
                <Form.Control type="password" placeholder="Password" />
              </Col>
            </Form.Group>
          </Form>

          <p className="ml-2 text-right">
            <Button className="ml-7" variant="primary">
              Save
            </Button>
          </p>
        </Jumbotron>
      </div>
    </div>
  );
}

export default Home;
