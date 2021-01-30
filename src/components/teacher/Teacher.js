import { Component } from "react";
import "./Teacher.css";

import NavBar from "../ui-elements/navBar/NavBar";

class Teacher extends Component {
  render() {
    return (
      <NavBar>
        {{
          left: <h5>HOME</h5>,
          right: (
            <div className="container" id="NavBarRight">
              <div className="row">
                <div className="col-sm-4 align-self-center" id="NavBarInfoText">
                  <p>Select Class and Batch : </p>
                </div>
                <div className="col-sm-4">
                  <select className="form-select mt-3" name="class" id="class">
                    <option value="">Class</option>
                    <option value="CS">CS</option>
                    <option value="Commerce">Commerce</option>
                  </select>
                </div>
                <div className="col-sm-4">
                  <select className="form-select mt-3" name="batch" id="batch">
                    <option value="">Batch</option>
                    <option value="2018-21">2018-21</option>
                    <option value="2019-22">2019-22</option>
                  </select>
                </div>
              </div>
            </div>
          ),
        }}
      </NavBar>
    );
  }
}

export default Teacher;
