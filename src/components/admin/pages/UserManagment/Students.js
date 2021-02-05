import React, { Component } from "react";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { Row, Col, Button } from "react-bootstrap";
import { event } from "jquery";
export default class Students extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StudentData: [
        {
          admissionNumber: 12321,
          name: "Nadfdsfd",
          class: "BCA",
          batch: "209823",
          email: "dsfsfds",
          parentEmail: "hdfdfkjfj",
        },
      ],
    };
  }

  disableClickListener = (event, item) => {
    if (event.target.value == "Disable") {
      event.target.setAttribute("value", "Enable");
      event.target.classList.remove("btn-warning");
      event.target.classList.add("btn-success");
    } else {
      event.target.setAttribute("value", "Disable");
      event.target.classList.remove("btn-success");
      event.target.classList.add("btn-warning");
    }
  };

  getStudentList = () => {
    let studentList = [];

    this.state.StudentData.map((item) => {
      studentList.push(
        <ListItem height="230px">
          {{
            left: (
              <div>
                <span>
                  <Row>
                    <Col>
                      <p class="text-left">{item.name}</p>
                    </Col>
                  </Row>
                  <p class="text-left">{item.email}</p>
                  <p class="text-left">{item.parentEmail}</p>
                  <p class="text-right">{item.admissionNumber}</p>
                </span>

                <Col className="text-left">
                  <Button type="submit" className=" mr-3 btn btn-danger">
                    Delete
                  </Button>
                </Col>
              </div>
            ),
            right: (
              <div>
                <p class="text-left">{item.class}</p>
                <p class="text-left">{item.batch}</p>

                <input
                  type="button"
                  className="mt-3 mr-3 btn btn-warning"
                  onClick={(event) => this.disableClickListener(event, item)}
                  value="Disable"
                ></input>
              </div>
            ),
          }}
        </ListItem>
      );
    });

    return studentList;
  };
  render() {
    return <div>{this.getStudentList()}</div>;
  }
}
