import React from "react";
import { withRouter } from "react-router-dom";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { connect } from "react-redux";

let mapDispatchToProps = (dispatch) => {
  return {
    storeMessage: (payload) =>
      dispatch({
        type: "storeMessage",
        payload: payload,
      }),
  };
};
class Message extends React.Component {
  storeMessage = () => {
    this.props.storeMessage(this.props.message);

    this.props.history.push("/admin/message/messagecontent");
  };
  render() {
    return (
      <div onClick={this.storeMessage}>
        <ListItem height="120px">
          {{
            left: (
              <span>
                <p class="text-left"> FROM : {this.props.message.userEmail}</p>
                <p class="text-left">DATE : {this.props.message.date}</p>
              </span>
            ),
            right: <>{this.props.replayed ? <p>REPLAYED</p> : null}</>,
          }}
        </ListItem>
      </div>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Message));
