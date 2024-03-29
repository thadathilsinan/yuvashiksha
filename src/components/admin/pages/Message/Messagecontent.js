import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import http from "../../../../shared/http";
import "./Message.css";
let mapStateToProps = (state) => {
  return {
    message: state.admin.message,
  };
};

class Messagecontent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //Creating needed refs
  replayMessage = React.createRef();

  //Replay to a message
  replay = (event) => {
    event.preventDefault();

    let message = this.replayMessage.current.value;

    if (message) {
      http(
        "POST",
        "/admin/messages/replay",
        { message, messageId: this.props.message._id },
        (res) => {
          alert(res.data);
        }
      );
    } else {
      alert("Please enter some replay message");
    }
  };

  render() {
    return (
      <div className="container col-md-6">
        <div className="row">
          <table className="table  table-borderless">
            <th scope="col"></th>
            <tr>
              <td>FROM:</td>
              <td>
                {this.props.message ? this.props.message.userEmail : null}
              </td>
            </tr>
            <tr>
              <td>DATE:</td>
              <td>{this.props.message ? this.props.message.date : null}</td>
            </tr>
          </table>
          <div className="mt-4">
            Message : <br />
            {this.props.message ? this.props.message.message : null}
          </div>
          <form>
            <textarea
              className="mt-4"
              id="msg"
              name="msg"
              rows="10"
              cols="90"
              ref={this.replayMessage}
            >
              {this.props.message ? this.props.message.reply : null}
            </textarea>
            <div className="text-right">
              <Button
                id="btn-replay"
                type="submit"
                className=" btn btn-success"
                onClick={this.replay}
              >
                Reply
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Messagecontent);
