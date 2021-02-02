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
  render() {
    return (
      <div className="root">
        <Router>
          <NavBar>
            {{
              left: <h3>ADMIN</h3>,
            }}
          </NavBar>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2" id="admin-sidebar">
                {SidebarData.map((item, index) => {
                  return (
                    <li key={index} className={item.cName}>
                      <Link to={item.path}>
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </div>
              <div className="col-lg-10" id="adminContent">
                <Switch>
                  <Route path="/messagecontent" component={Messagecontent} />
                  <Route path="/admin" exact component={Home} />
                  <Route
                    path="/Institutionstructure"
                    component={Institutionstructure}
                  />
                  <Route path="/Message" component={Messagelist} />
                  <Route path="/Report" component={Report} />
                  <Route path="/UserMangamenet" component={UserMangamenet} />
                  <Route path="/VerifyAccounts" component={VerifyAccount} />
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
