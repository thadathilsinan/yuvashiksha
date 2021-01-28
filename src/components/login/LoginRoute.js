import { Component } from "react";
import {
  BrowserRouter,
  Route,
  withRouter,
  Switch,
  Redirect,
} from "react-router-dom";

import Login from "./Login";
import GoogleSignup from "./sigup/googleSignup/GoogleSignup";

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
            <GoogleSignup />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default withRouter(LoginRoute);
