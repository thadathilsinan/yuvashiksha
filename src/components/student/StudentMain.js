import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import http from "../../shared/http";
import Student from "./Student";

class StudentMain extends Component {
  constructor(props) {
    super(props);

    this.state = { component: null };
  }

  checkAuthentication = () => {
    http(
      "POST",
      "/login/checkStudent",
      null,
      (res) => {
        if (res.status == 200) {
          this.setState({
            component: <Student user={res.data} />,
          });
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

export default withRouter(StudentMain);
