import React, { Component } from "react";
import "./AdminLogin.css";

export default class AdminLogin extends Component {
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
                type="email"
                class="form-control"
                id="username"
                placeholder="Enter username"
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"
              />
            </div>
            <button type="submit" class="btn btn-success">
              LOGIN
            </button>
          </form>
        </div>
      </>
    );
  }
}
