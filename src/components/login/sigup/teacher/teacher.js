import { Component } from "react";
import "./teacher.css";

class Teacher extends Component {
  render() {
    return (
      <div>
        <input type="text" class="form-control" id="name" placeholder="Name" />
        <input
          type="number"
          className="form-control mt-3"
          id="id-number"
          placeholder="ID Number"
        />
        <select
          className="form-select mt-3"
          aria-label="Default select example"
          id="department"
        >
          <option value="CS" selected>
            CS
          </option>
          <option value="Commerce">Commerce</option>
        </select>
        <input
          type="email"
          className="form-control mt-3"
          id="email"
          placeholder="Email"
        />
      </div>
    );
  }
}

export default Teacher;
