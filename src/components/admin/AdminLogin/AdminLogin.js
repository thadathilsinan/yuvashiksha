import React, { Component } from "react";
import "./AdminLogin.css";
import httml from "../../../shared/http";
import http from "../../../shared/http";

export default class AdminLogin extends Component {
  //Creating ref for the input fields
  username = React.createRef();
  password = React.createRef();

  //Login button Click listener
  login = (e) => {
    e.preventDefault();

    //Getting form values
    let username = this.username.current.value;
    let password = this.password.current.value;

    if (password != "" && username != "") {
      http(
        "POST",
        "/login/admin",
        { username: { username }, password },
        (res) => {
          if (res.status == 200) {
            alert("Login Success");
          } else {
            alert(res.data);
          }
        }
      );
    } else {
      alert("Please fill all data");
    }
  };

  render() {
    return (
      <>
        <div
          className="container col-md-3 mt-5 p-3"
          style={{
            backgroundColor: "white",
            border: "2px solid grey",
            borderRadius: "10px",
          }}
        >
          <form>
            <div class="form-group">
              <h4>ADMIN LOGIN</h4>
              <label for="username">Username</label>
              <input
                ref={this.username}
                type="email"
                class="form-control"
                id="username"
                placeholder="Enter username"
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                ref={this.password}
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"
              />
            </div>
            <button type="submit" class="btn btn-success" onClick={this.login}>
              LOGIN
            </button>
          </form>
        </div>
      </>
    );
  }
}
