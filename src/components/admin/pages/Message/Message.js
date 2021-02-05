import React from "react";
import { Container, Button } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Link, Route, withRouter } from "react-router-dom";
import Messagecontent from "./Messagecontent";
import Messagelist from "./Messagelist";
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
      <div className="container  col-md-10 mt-1 " onClick={this.storeMessage}>
        <ListItem height="120px">
          {{
            left: (
              <span>
                <p class="text-left"> FROM : {this.props.message.from}</p>
                <p class="text-left">DATE : {this.props.message.date}</p>
                <p class="text-left">TIME : {this.props.message.time}</p>
              </span>
            ),
          }}
        </ListItem>
      </div>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Message));
