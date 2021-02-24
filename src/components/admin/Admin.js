import { Component } from "react";
import $ from "jquery";
import "./Admin.css";

import NavBar from "../ui-elements/navBar/NavBar";
import { Switch, Route, withRouter } from "react-router-dom";

import Home from "./pages/Home";
import Institutionstructure from "./pages/Institutionstructure/Institutionstructure";
import Messagelist from "./pages/Message/Messagelist";
import Report from "./pages/Report";
import UserMangamenet from "./pages/UserManagment/UserMangamenet";
import VerifyAccount from "./pages/VerifyAccounts";
import Messagecontent from "./pages/Message/Messagecontent";

class Admin extends Component {
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
  };

  render() {
    return (
      <div className="root">
        <NavBar>
          {{
            left: <h3>ADMIN</h3>,
            right: this.navBarRight,
          }}
        </NavBar>
        <div id="adminBody">
          <div id="adminSidebar">
            <div class="list-group">
              <a
                class="list-group-item active"
                onClick={this.changePage}
                name="home"
              >
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
                Verify Accoint
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

              <Route path="/admin/usermangamenet" exact>
                <UserMangamenet />
              </Route>

              <Route path="/admin/verifyaccounts" exact>
                <VerifyAccount />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Admin);
