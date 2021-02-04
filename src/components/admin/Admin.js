import { Component } from "react";
import "./Admin.css";

import NavBar from "../ui-elements/navBar/NavBar";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Institutionstructure from "./pages/Institutionstructure";
import Messagelist from "./pages/Messagelist";
import Report from "./pages/Report";
import UserMangamenet from "./pages/UserMangamenet";
import VerifyAccount from "./pages/VerifyAccounts";
import Messagecontent from "./pages/Messagecontent";
import { SidebarData } from "./Component/Sidebardata";
class Admin extends Component {
  isHome = () => {
    console.log(this.props);
    if (this.props.location.pathname === "/admin") {
      return true;
    } else {
      return false;
    }
  };

  navBarRight = null;

  setHomeNavBar = () => {
    if (this.isHome()) {
      this.navBarRight = <p>IN HOME</p>;
    } else {
      this.navBarRight = null;
    }
    console.log(this.isHome());
    console.log(this.navBarRight);
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
          <div className="container-fluid">
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
          </div>
        </Router>
      </div>
    );
  }
}

export default Admin;
