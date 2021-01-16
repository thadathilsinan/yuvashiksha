import { Component } from "react";
import "./student.css";

class Student extends Component {
  render() {
    return (
      <div>
        <input type="text" class="form-control" id="name" placeholder="Name" />
        <input
          type="number"
          className="form-control mt-3"
          id="admission-number"
          placeholder="Admission Number"
        />
        <select
          className="form-select mt-3"
          aria-label="Default select example"
          id="class"
        >
          <option value="BCA" selected>
            BCA
          </option>
          <option value="BSC">BSC</option>
        </select>
        <select
          className="form-select mt-3"
          aria-label="Default select example"
          id="batch"
        >
          <option value="2020-21" selected>
            2018-21
          </option>
          <option value="2019-22">2019-22</option>
        </select>
        <input
          type="email"
          className="form-control mt-3"
          id="email"
          placeholder="Email"
        />
        <input
          type="email"
          className="form-control mt-3"
          id="parent-email"
          placeholder="Parent Email"
        />
      </div>
    );
  }
}

export default Student;
