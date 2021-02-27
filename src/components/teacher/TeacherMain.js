import React, { Component } from "react";
import Teacher from "./Teacher";
import http from "../../shared/http";
import { withRouter } from "react-router-dom";

class TeacherMain extends Component {
  constructor(props) {
    super(props);

    this.state = { component: null };
  }

  checkAuthentication = () => {
    http(
      "POST",
      "/login/checkTeacher",
      null,
      (res) => {
        if (res.status == 200) {
          this.setState({ component: <Teacher user={res.data} /> });
        } else {
          alert(res.data);
          this.setState({ component: null });
          this.props.history.push("/");
        }
      },
      (err) => {
        alert("Authentication Failed! Please login again");
        this.setState({ component: null });
        this.props.history.push("/");
      }
    );
  };

  componentDidMount() {
    this.checkAuthentication();
  }

  render() {
    return <>{this.state.component ? this.state.component : null}</>;
  }
}

export default withRouter(TeacherMain);
