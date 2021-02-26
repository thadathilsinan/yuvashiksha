import React, { Component } from "react";
import Department from "./Department";
import ClassBatch from "./ClassBatch";
import Subject from "./Subjects";

import { Route, Switch, withRouter } from "react-router-dom";

class Institutionstructure extends Component {
  //Change route to class
  departmentSelected = (departmentId) => {
    this.props.history.push(
      "/admin/institutionStructure/class/" + departmentId
    );
  };

  render() {
    return (
      <div style={{ width: "100%" }}>
        <Switch>
          <Route path="/admin/institutionstructure/" exact>
            <Department departmentSelected={this.departmentSelected} />
          </Route>

          <Route path="/admin/institutionstructure/class/:departmentId" exact>
            <ClassBatch />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default withRouter(Institutionstructure);
