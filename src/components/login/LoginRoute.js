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
      <BrowserRouter>
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
      </BrowserRouter>
    );
  }
}

export default withRouter(LoginRoute);
