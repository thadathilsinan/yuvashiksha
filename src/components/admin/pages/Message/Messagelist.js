import React from "react";
import Message from "./Message";

import http from "../../../../shared/http";

class Messagelist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      replayedMessages: [],
    };
  }

  //Get messages form server
  getMessages = () => {
    //Loading Screen
    window.showLoading();
    http("GET", "/admin/messages", {}, (res) => {
      if (res.status == 200) {
        //hiding loadingScreen
        window.hideLoading();
        let replayedMessages = [];
        let messages = [];

        //Setting replayed messages
        for (let message of res.data) {
          console.log(message);
          if (message.reply && message.reply != "") {
            //Replayed message
            replayedMessages.push(message);
          } else {
            //message not replayed
            messages.push(message);
          }
        }
        this.setState({ messages, replayedMessages });
      } else alert(res.data);
    });
  };

  componentDidMount() {
    this.getMessages();
  }

  render() {
    let messages = this.state.messages.map((message) => {
      return <Message message={message} refresh={this.getMessages} />;
    });

    let replayed = this.state.replayedMessages.map((message) => {
      return <Message message={message} refresh={this.getMessages} replayed />;
    });

    return (
      <>
        <div>{messages}</div>
        <div>{replayed}</div>
      </>
    );
  }
}

export default Messagelist;
