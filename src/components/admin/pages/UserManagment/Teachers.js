import React, { Component } from "react";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { Row, Col, Button } from "react-bootstrap";
export default class Teachers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [
        {
          name: "Teacher name",
          idNumber: "12345",
          department: "CS",
          email: "hkjhksd@njdsf.fsd",
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

  getTeacherList = () => {
    let teachers = this.state.userData.map((item) => {
      return (
        <div className="container  col-md-10 mt-1 " id={item._id}>
          <ListItem height="180px">
            {{
              left: (
                <div>
                  <span>
                    <Row>
                      <Col>
                        <p class="text-left">{item.name}d</p>
                      </Col>
                    </Row>
                    <p class="text-left">{item.email}</p>
                    <p class="text-left">{item.department}</p>
                  </span>{" "}
                  <Col className="text-left">
                    <Button type="submit" className=" mr-3 btn btn-danger">
                      Delete
                    </Button>
                  </Col>
                </div>
              ),
              right: (
                <div>
                  <p class="text-right">{item.idNumber}</p>
                  <br />
                  <br />
                  <br />
                  <input
                    type="button"
                    className=" mr-3 btn btn-warning"
                    onClick={(event) => this.disableClickListener(event, item)}
                    value="Disable"
                  ></input>
                </div>
              ),
            }}
          </ListItem>
        </div>
      );
    });

    return teachers;
  };

  render() {
    return <>{this.getTeacherList()}</>;
  }
}
