import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";

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
  render() {
    return (
      <div className="container col-md-6">
        <div className="row">
          <table className="table  table-borderless">
            <th scope="col"></th>
            <tr>
              <td>FROM:</td>
              <td>{this.props.message.from}</td>
            </tr>
            <tr>
              <td>DATE:</td>
              <td>{this.props.message.date}</td>
            </tr>
            <tr>
              <td>TIME:</td>
              <td>{this.props.message.time}</td>
            </tr>
          </table>
          <div className="mt-4">
            Message : <br />
            {this.props.message.message}
          </div>
          <form>
            <textarea
              className="mt-4"
              id="msg"
              name="msg"
              rows="10"
              cols="90"
            ></textarea>
            <div className="text-right">
              <Button type="submit" className="mt-4 mr-3 btn btn-success">
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
