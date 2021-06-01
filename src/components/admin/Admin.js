import { Component } from "react";
import $ from "jquery";
import "./Admin.css";

import NavBar from "../ui-elements/navBar/NavBar";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import Home from "./pages/Home/Home";
import Institutionstructure from "./pages/Institutionstructure/Institutionstructure";
import Messagelist from "./pages/Message/Messagelist";
import Report from "./pages/Report/Report";
import UserMangamenet from "./pages/UserManagment/UserMangamenet";
import VerifyAccount from "./pages/VerifyAccounts/VerifyAccounts";
import Messagecontent from "./pages/Message/Messagecontent";

import http from "../../shared/http";

import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: $("#adminSidebar .active").attr("name"),
    };
  }

  changePage = (event) => {
    //Get active item
    let activeItem = $("#adminSidebar .active");
    //Clicked tab
    let clickedItem = $(event.target);

    //Remove "active" class from the active item
    activeItem.removeClass("active");

    //Add active class to the clicked item
    clickedItem.addClass("active");

    //Changing the browser Route
    this.props.history.push("/admin/" + clickedItem.attr("name"));

    //Setting the states correctly
    this.setState({ activeItem: clickedItem.attr("name") });
  };

  logout = () => {
    http("GET", "/login/logout", {}, (res) => {
      alert(res.data);
      if (res.status == 200) {
        window.location.href = "http://localhost:3000/";
      }
    });
  };

  componentDidMount() {
    $(
      ".list-group-item[name=" +
        this.props.history.location.pathname.split("/")[2] +
        "]"
    ).addClass("active");

    this.setState({ activeItem: $("#adminSidebar .active").attr("name") });
  }

  render() {
    //Target modal to open when InstitutionStructure + button clicked
    let targetModal = "#adddept";

    //Check if the path is in the /class inside /Institutionstructure
    let path = this.props.history.location.pathname.split("/")[3];

    if (path == "class") {
      targetModal = "#addclass";
    }

    //The content of the right side of the navBar
    let navBarRight = {
      home: (
        <Button id="logoutBtn" className="mr-4" onClick={this.logout}>
          Logout
        </Button>
      ),
      institutionStructure: (
        <Button className="mr-4" data-toggle="modal" data-target={targetModal}>
          <FaPlus />
        </Button>
      ),
      message: null,
      report: null,
      verifyAccount: null,
      userManagement: null,
    };

    return (
      <div className="root">
        <NavBar>
          {{
            left: <h3>ADMIN</h3>,
            right: navBarRight[this.state.activeItem],
          }}
        </NavBar>
        <div id="adminBody">
          <div id="adminSidebar">
            <div class="list-group">
              <a class="list-group-item" onClick={this.changePage} name="home">
                Home
              </a>
              <a
                class="list-group-item"
                onClick={this.changePage}
                name="institutionStructure"
              >
                Institution Structure
              </a>
              <a
                class="list-group-item"
                onClick={this.changePage}
                name="message"
              >
                Messages
              </a>
              <a
                class="list-group-item"
                onClick={this.changePage}
                name="report"
              >
                Report
              </a>
              <a
                class="list-group-item"
                onClick={this.changePage}
                name="verifyAccount"
              >
                Verify Account
              </a>
              <a
                class="list-group-item"
                onClick={this.changePage}
                name="userManagement"
              >
                User Management
              </a>
            </div>
          </div>
          <div id="adminContent">
            <Switch>
              <Route
                path="/admin/message/messagecontent"
                exact
                component={Messagecontent}
              />
              <Route path="/admin/home" exact>
                <Home />
              </Route>

              <Route path="/admin/institutionstructure">
                <Institutionstructure />
              </Route>

              <Route path="/admin/message" exact>
                <Messagelist />
              </Route>

              <Route path="/admin/report" exact>
                <Report />
              </Route>

              <Route path="/admin/usermanagement" exact>
                <UserMangamenet />
              </Route>

              <Route path="/admin/verifyaccount" exact>
                <VerifyAccount />
              </Route>
              <Route path="/admin">
                <Redirect to="/admin/home" />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Admin);
