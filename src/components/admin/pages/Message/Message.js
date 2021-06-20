import React from "react";
import { withRouter } from "react-router-dom";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { connect } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import http from "../../../../shared/http";
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

  //delete message
  deleteMessage = (e) => {
    e.stopPropagation();
    http(
      "POST",
      "/admin/messages/delete",
      { message: this.props.message._id },
      (res) => {
        alert(res.data);
        this.props.refresh();
      }
    );
  };

  render() {
    return (
      <div onClick={this.storeMessage}>
        <ListItem height="120px" green={this.props.replayed ? true : undefined}>
          {{
            left: (
              <span>
                <p class="text-left"> FROM : {this.props.message.userEmail}</p>
                <p class="text-left">DATE : {this.props.message.date}</p>
              </span>
            ),
            right: (
              <>
                <button
                  className="btn-delete btn-lg"
                  onClick={this.deleteMessage}
                >
                  <AiOutlineDelete />
                </button>
              </>
            ),
            // right: <>{this.props.replayed ? <p>REPLAYED</p> : null}</>,
          }}
        </ListItem>
      </div>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Message));
