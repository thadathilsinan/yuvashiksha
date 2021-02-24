import React, { Component } from "react";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin/AdminLogin";
import http from "../../shared/http";

export default class AdminMain extends Component {
  constructor(props) {
    super(props);

    this.state = { component: null };
  }

  checkAuthentication = () => {
    http(
      "POST",
      "/login/checkAdmin",
      null,
      (res) => {
        if (res.status == 200) {
          this.setState({ component: <Admin /> });
        } else {
          alert(res.data);
          this.setState({ component: null });
        }
      },
      (err) => {
        alert("Authentication Failed! Please login again");
        this.setState({ component: null });
      }
    );
  };
  componentDidMount() {
    this.checkAuthentication();
  }

  render() {
    return <>{this.state.component ? this.state.component : <AdminLogin />}</>;
  }
}
