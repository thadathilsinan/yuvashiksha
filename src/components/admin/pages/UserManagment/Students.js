import React, { Component } from "react";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { Button } from "react-bootstrap";
import { event } from "jquery";
import http from "../../../../shared/http";
export default class Students extends Component {
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
        "/admin/usermanagement/student/delete",
        { student: item },
        (res) => {
          if (res.status == 200) {
            alert("Student account deleted successfully");

            document.getElementById(item._id).style.display = "none";
          } else {
            alert("Error deleting Student account");
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
          "/admin/usermanagement/student/disable",
          { student: item },
          (res) => {
            if (res.status == 200) {
              alert("Student Account disabled Successfully");
              this.changeToEnable(event);
            } else {
              alert("Error disabling student account");
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

  getStudentList = () => {
    let students = this.state.userData.map((item) => {
      console.log(item);
      return (
        <div className="container  col-md-10 mt-1 " id={item._id}>
          <ListItem height="180px">
            {{
              left: (
                <div>
                  <p>{item.name}</p>

                  <p>{item.email}</p>
                  <p>{item.parentEmail}</p>
                  <p>{item.admissionNumber}</p>

                  <Button
                    type="submit"
                    className=" mr-3 btn btn-danger"
                    onClick={() => this.deleteClickListener(item)}
                  >
                    Delete
                  </Button>
                </div>
              ),
              right: (
                <div>
                  <p>{item.class}</p>
                  <p>{item.batch}</p>
                  <br />
                  <br />
                  <input
                    type="button"
                    className=" btn btn-warning"
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
    return students;
  };
  getUserData = () => {
    http("GET", "/admin/usermanagement/student", null, (res) => {
      if (res.status == 200) {
        this.setState({ userData: res.data.data });
      } else {
        alert("Error during fetching student data from server");
      }
    });
  };
  componentDidMount() {
    this.getUserData();
  }
  render() {
    return <>{this.getStudentList()}</>;
  }
}
