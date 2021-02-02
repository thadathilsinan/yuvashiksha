import React from "react";
import Message from "./Message";
import Messagecontent from "./Messagecontent";
import { Link, Route } from "react-router-dom";
class Messagelist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          messageId: "1",
          from: "abc@mail.com",
          date: "123",
          time: "9:30",
          message: "hi",
        },
        {
          messageId: "2",
          from: "ajsjc@mail.com",
          date: "12992",
          time: "9:20",
          message: "hello",
        },
        {
          messageId: "3",
          from: "ksdlc@mail.com",
          date: "102923",
          time: "7:30",
          message: "heyyy",
        },
      ],
    };
  }
  render() {
    let messages = this.state.messages.map((k) => {
      return <Message message={k} />;
    });
    return <div>{messages}</div>;
  }
}

export default Messagelist;
