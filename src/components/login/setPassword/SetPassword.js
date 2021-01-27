import { Component } from "react";
import "./SetPassword.css";

class SetPassword extends Component {
  render() {
    return (
      <form>
        <center>
          <p id="info-text">Setup a new Password</p>
        </center>
        <div className="form-group">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="form-control mt-3"
          />
          <input
            type="password"
            name="confirm"
            id="confirm"
            placeholder="Confirm Password"
            className="form-control mt-3"
          />
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button type="button" className="btn btn-success" id="finish">
            FINISH
          </button>
        </div>
      </form>
    );
  }
}

export default SetPassword;
