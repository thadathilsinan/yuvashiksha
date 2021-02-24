import React, { Component } from "react";
import { Button } from "react-bootstrap";
import DialogBox from "../DialogBox/DialogBox";

export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = { alertShow: false };
  }

  componentDidMount() {}

  render() {
    return (
      <>
        <DialogBox
          show={this.props.show ? true : undefined}
          title="Message"
          closeButton
        >
          {{
            body: <p>{this.props.children}</p>,
            footer: (
              <Button variant="secondary" onClick={this.props.hide}>
                Close
              </Button>
            ),
          }}
        </DialogBox>
      </>
    );
  }
}
