import { Modal } from "react-bootstrap";

import React, { Component } from "react";

class DialogBox extends Component {
  constructor(props) {
    super(props);

    this.state = { show: false };
  }

  componentDidMount() {
    if (this.props.show) {
      this.showModal();
    }
  }

  closeModal = () => {
    this.setState({ show: false });
  };

  showModal = () => {
    this.setState({ show: true });
  };

  render() {
    return (
      <Modal
        show={this.state.show}
        onHide={this.closeModal}
        className="modal-body"
        backdrop={this.props.restrictClose ? "static" : undefined}
        keyboard={this.props.restrictClose ? false : undefined}
        size={this.props.size}
      >
        <Modal.Header closeButton={this.props.closeButton}>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.children ? this.props.children.body : null}
        </Modal.Body>
        <Modal.Footer>
          {this.props.children ? this.props.children.footer : null}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DialogBox;
