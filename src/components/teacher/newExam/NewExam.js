import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import "./NewExam.css";

class NewExam extends Component {
  render() {
    return (
      <div>
        <NavBar>
          {{
            left: (
              <div>
                <span id="navBarBackButton">{"<"}</span>
                <h3>CREATE QUESTION PAPER</h3>
              </div>
            ),
          }}
        </NavBar>
      </div>
    );
  }
}

export default NewExam;
