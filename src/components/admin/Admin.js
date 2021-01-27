import { Component } from "react";
import "./Admin.css";
//import React from "react";

import Navbar from "./Component/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Institutionstructure from "./pages/Institutionstructure";
import Messagelist from "./pages/Message";
import Report from "./pages/Report";
import UserMangamenet from "./pages/UserMangamenet";
import VerifyAccount from "./pages/VerifyAccounts";
class Admin extends Component {
  render() {
    return (
      <>
        <Router>
          <Navbar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route
              path="/Institutionstructure"
              component={Institutionstructure}
            />
            <Route path="/Message" component={Messagelist} />
            <Route path="/Report" component={Report} />
            <Route path="/UserMangamenet" component={UserMangamenet} />
            <Route path="/VerifyAccounts" component={VerifyAccount} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default Admin;
