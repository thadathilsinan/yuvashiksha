import React from "react";
import { Form, Col } from "react-bootstrap";

import {
  Button,
  ButtonGroup,
  DropdownButton,
  MenuItem,
  Dropdown,
} from "react-bootstrap";
function Report() {
  return (
    <div className="container  col-md-6 mt-5 bg-secondary">
      <Form className="">
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Department" />
          <Form.Control as="select" defaultValue="Department">
            <option>cs</option>
            <option>hm</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <Form>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Class" />
          <Form.Control as="select" defaultValue="Class">
            <option>bca</option>
            <option>cs</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <Form>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Batch" />
          <Form.Control as="select" defaultValue="Batch">
            <option>2018-21</option>
            <option>2019-22</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <Form>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Admission number" />
          <Form.Control as="select" defaultValue="Admission number">
            <option>1</option>
            <option>2</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <Form>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Id number" />
          <Form.Control as="select" defaultValue="Admission number">
            <option>1</option>
            <option>2</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <Form>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Date from" />
          <Form.Control type="date" placeholder="date"></Form.Control>
        </Form.Group>
      </Form>
      <Form>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Date to" />
          <Form.Control type="date" placeholder="date"></Form.Control>
        </Form.Group>
      </Form>
      <div className="text-right">
        <Button type="submit" className=" mr-3  p-2 btn btn-success">
          Report
        </Button>
      </div>
    </div>
  );
}

export default Report;
