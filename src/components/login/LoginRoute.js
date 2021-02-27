/**
 * This is the router in the client side to navigate user in the browser without page refresh
 * THIS IS THE ROUTER ONLY FOR THE LOGIN MODULE
 */
import { Component } from "react";
import {
  BrowserRouter,
  Route,
  withRouter,
  Switch,
  Redirect,
} from "react-router-dom";

import Login from "./Login";

class LoginRoute extends Component {
  render() {
    return (
      /**
       * DISPLAYING CORRESPONDING COMPONENTS IN DIFFERENT ROUTES
       */
      <Switch>
        <Route path="/" exact>
          <Redirect to="/signin" />
        </Route>
        <Route path="/signin" exact>
          <Login signin />
        </Route>
        <Route path="/signup" exact>
          <Login signup />
        </Route>
        <Route path="/signup/google" exact>
          <Login googleSignup />
        </Route>
      </Switch>
    );
  }
}

export default withRouter(LoginRoute);
