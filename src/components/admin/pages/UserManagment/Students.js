import React, { Component } from "react";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { Button } from "react-bootstrap";
import http from "../../../../shared/http";
import $ from "jquery";
import Search from "../../../ui-elements/Search/Search";

export default class Students extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
    };
  }

  //Delete a user account
  deleteClickListener = (item) => {
    let confirmation = window.confirm("Are you sure to want to delete?");

    if (confirmation) {
      http(
        "POST",
        "/admin/usermanagement/delete",
        { userId: item.id },
        (res) => {
          if (res.status == 200) {
            alert("Student account deleted successfully");

            document.getElementById(item.id).style.display = "none";
          } else {
            alert(res.data);
          }
        }
      );
    }
  };

  //Disable / Enable account
  disableClickListener = (event, item) => {
    if (event.target.value == "Disable") {
      let confirmation = window.confirm("Are sure to Disable account?");

      if (confirmation) {
        http(
          "POST",
          "/admin/usermanagement/disable",
          { userId: item.id },
          (res) => {
            if (res.status == 200) {
              alert("Student Account disabled Successfully");
              this.changeToEnable(item);
            } else {
              alert(res.data);
            }
          }
        );
      }
    } else {
      let confirmation = window.confirm("Are you sure to Enable account?");

      if (confirmation) {
        http(
          "POST",
          "/admin/usermanagement/enable",
          { userId: item.id },
          (res) => {
            if (res.status == 200) {
              alert("Student Account enabled Successfully");
              this.changeToDisable(item);
            } else {
              alert(res.data);
            }
          }
        );
      }
    }
  };

  //Change style of button
  changeToDisable = (student) => {
    let button = $("#" + student.id + " input[name='changestatus']");
    button.attr("value", "Disable");
    button.removeClass("btn-success");
    button.addClass("btn-warning");
  };

  changeToEnable = (student) => {
    let button = $("#" + student.id + " input[name='changestatus']");
    button.attr("value", "Enable");
    button.removeClass("btn-warning");
    button.addClass("btn-success");
  };

  getStudentList = () => {
    let students = this.state.userData.map((item) => {
      console.log(item);
      return (
        <div className="mt-1" id={item.id}>
          <ListItem height="180px">
            {{
              left: (
                <div>
                  <p>Name: {item.name}</p>

                  <p>Email: {item.email}</p>
                  <p>Parent Email: {item.parentEmail}</p>
                  <p>Register Number: {item.registerNumber}</p>

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
                <div class="text-right">
                  <p>Class: {item.class}</p>
                  <p>Batch: {item.batch}</p>
                  <br />
                  <br />
                  <input
                    type="button"
                    className={
                      item.accountStatus == "disabled"
                        ? "mr-3 btn btn-success"
                        : "mr-3 btn btn-warning"
                    }
                    onClick={(event) => this.disableClickListener(event, item)}
                    value={
                      item.accountStatus == "disabled" ? "Enable" : "Disable"
                    }
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
    //Loading Screen
    window.showLoading();
    http("GET", "/admin/usermanagement/student", null, (res) => {
      if (res.status == 200) {
        //hiding loadingScreen
        window.hideLoading();
        this.setState({ userData: res.data });
      } else {
        alert("Error during fetching student data from server");
      }
    });
  };

  //Search
  search = (searchText) => {
    if (searchText) {
      http(
        "POST",
        "/admin/usermanagement/student/search",
        { searchString: searchText },
        (res) => {
          this.setState({ userData: res.data });
        }
      );
    } else {
      //Return all users without filtering
      this.getUserData();
    }
  };

  componentDidMount() {
    this.getUserData();
  }

  render() {
    return (
      <>
        <Search click={this.search} />
        {this.getStudentList()}
      </>
    );
  }
}
