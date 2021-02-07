import React, { Component } from "react";
import Department from "./Department";
import ClassBatch from "./ClassBatch";
import Subject from "./Subjects";
export default class Institutionstructure extends Component {
  render() {
    return (
      <div>
        <Department></Department>
        <ClassBatch></ClassBatch>
        <Subject></Subject>
      </div>
    );
  }
}
