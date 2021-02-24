import { Component } from "react";
import $ from "jquery";
import "./Admin.css";

import NavBar from "../ui-elements/navBar/NavBar";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Institutionstructure from "./pages/Institutionstructure/Institutionstructure";
import Messagelist from "./pages/Message/Messagelist";
import Report from "./pages/Report";
import UserMangamenet from "./pages/UserManagment/UserMangamenet";
import VerifyAccount from "./pages/VerifyAccounts";
import Messagecontent from "./pages/Message/Messagecontent";
import { SidebarData } from "./Component/Sidebardata";

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
  };

  render() {
    return (
      <div className="root">
        <Router>
          <NavBar>
            {{
              left: <h3>ADMIN</h3>,
              right: this.navBarRight,
            }}
          </NavBar>
          <div id="adminBody">
            <div id="adminSidebar">
              <div class="list-group">
                <a class="list-group-item active" onClick={this.changePage}>
                  Home
                </a>
                <a class="list-group-item" onClick={this.changePage}>
                  Institution Structure
                </a>
                <a class="list-group-item" onClick={this.changePage}>
                  Messages
                </a>
                <a class="list-group-item" onClick={this.changePage}>
                  Report
                </a>
                <a class="list-group-item" onClick={this.changePage}>
                  Verify Accoint
                </a>
                <a class="list-group-item" onClick={this.changePage}>
                  User Management
                </a>
              </div>
            </div>
            <div>Body</div>
          </div>

          {/* <div className="container-fluid">
            <div className="row">
              <div className="col-md-2" id="admin-sidebar">
                {SidebarData.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={item.cName}
                      onClick={this.setHomeNavBar}
                    >
                      <Link to={item.path}>
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </div>
              <div className="col-lg-10" id="adminContent">
                <Switch>
                  <Route
                    path="/admin/message/messagecontent"
                    exact
                    component={Messagecontent}
                  />
                  <Route path="/admin" exact>
                    <Home />
                  </Route>
                  <Route
                    path="/admin/institutionstructure"
                    component={Institutionstructure}
                  />
                  <Route path="/admin/message" component={Messagelist} exact />
                  <Route path="/admin/report" component={Report} exact />
                  <Route
                    path="/admin/usermangamenet"
                    component={UserMangamenet}
                    exact
                  />
                  <Route
                    path="/admin/verifyaccounts"
                    component={VerifyAccount}
                    exact
                  />
                </Switch>
              </div>
            </div>
          </div> */}
        </Router>
      </div>
    );
  }
}

export default Admin;
