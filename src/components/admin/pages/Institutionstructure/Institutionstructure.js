import React, { Component } from "react";
import Department from "./Department";
import ClassBatch from "./ClassBatch";
import Subject from "./Subjects";

import { Route, Switch, withRouter } from "react-router-dom";

export default class Institutionstructure extends Component {
  render() {
    return (
      <div style={{ width: "100%" }}>
        <Switch>
          <Route path="/admin/institutionstructure/" exact>
            <Department />
          </Route>

          <Route path="/admin/institutionstructure/class" exact>
            <ClassBatch />
          </Route>
        </Switch>
      </div>
    );
  }
}
