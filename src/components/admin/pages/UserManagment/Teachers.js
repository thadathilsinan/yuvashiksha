import React, { Component } from "react";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { Row, Col, Button } from "react-bootstrap";
import http from "../../../../shared/http";
export default class Teachers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
    };
  }

  deleteClickListener = (item) => {
    let confirmation = window.confirm("Are you sure to want to delete?");

    if (confirmation) {
      http(
        "POST",
        "/admin/usermanagement/teacher/delete",
        { teacher: item },
        (res) => {
          if (res.status == 200) {
            alert("Teacher account deleted successfully");

            document.getElementById(item._id).style.display = "none";
          } else {
            alert("Error deleting teacher account");
          }
        }
      );
    }
  };

  disableClickListener = (event, item) => {
    if (event.target.value == "Disable") {
      let confirmation = window.confirm("Are sure to Disable account?");

      if (confirmation) {
        http(
          "POST",
          "/admin/usermanagement/teacher/disable",
          { teacher: item },
          (res) => {
            if (res.status == 200) {
              alert("Teacher Account disabled Successfully");
              this.changeToEnable(event);
            } else {
              alert("Error disabling teacher account");
            }
          }
        );
      }
    } else {
      let confirmation = window.confirm("Are you sure to Enable account?");

      if (confirmation) {
        this.changeToDisable(event);
      }
    }
  };

  changeToDisable = (event) => {
    event.target.setAttribute("value", "Disable");
    event.target.classList.remove("btn-success");
    event.target.classList.add("btn-warning");
  };

  changeToEnable = (event) => {
    event.target.setAttribute("value", "Enable");
    event.target.classList.remove("btn-warning");
    event.target.classList.add("btn-success");
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
                    <Button
                      type="submit"
                      className=" mr-3 btn btn-danger"
                      onClick={() => this.deleteClickListener(item)}
                    >
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

  getUserData = () => {
    http("GET", "/admin/usermanagement/teacher", null, (res) => {
      if (res.status == 200) {
        this.setState({ userData: res.data.data });
      } else {
        alert("Error during fetching teacher data from server");
      }
    });
  };

  componentDidMount() {
    this.getUserData();
  }

  render() {
    return <>{this.getTeacherList()}</>;
  }
}
