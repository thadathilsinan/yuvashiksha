import React, { Component } from "react";
import TabView from "../../../ui-elements/TabView/TabView";
import Students from "./Students";
import Teachers from "./Teachers";
class UserMangamenet extends Component {
  render() {
    return (
      <div>
        <TabView>
          {{
            leftTab: <span>TEACHER</span>,
            rightTab: <span>STUDENT</span>,
            leftTabBody: <Teachers />,
            rightTabBody: <Students />,
          }}
        </TabView>
      </div>
    );
  }
}

export default UserMangamenet;
