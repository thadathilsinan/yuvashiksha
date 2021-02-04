import React, { Component } from "react";
import TabView from "../../ui-elements/TabView/TabView";
import Students from "./Students";
import Teachers from "./Teachers";
export default class UserMangamenet extends Component {
  render() {
    return (
      <div>
        <TabView>
          {{
            leftTab: <span>Teacher</span>,
            rightTab: <span>Student</span>,
            leftTabBody: (
              <div id="leftTabBody">
                <Students />
              </div>
            ),
            rightTabBody: (
              <div id="rightTabBody">
                <Teachers />
              </div>
            ),
          }}
        </TabView>
      </div>
    );
  }
}
