import { Component } from "react";
import "./Teacher.css";

import NavBar from "../ui-elements/navBar/NavBar";

class Teacher extends Component {
  render() {
    return (
      <div>
        <NavBar>
          {{
            left: <p>Left content</p>,
            center: <p>Center Content</p>,
            right: <p>Right Content</p>,
          }}
        </NavBar>
      </div>
    );
  }
}

export default Teacher;
