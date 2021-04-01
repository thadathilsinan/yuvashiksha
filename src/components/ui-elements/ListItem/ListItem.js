import { Component } from "react";
import "./ListItem.css";

class ListItem extends Component {
  render() {
    return (
      <div
        id="list-item-container"
        className="d-flex flex-row justify-content-between align-items-center"
        style={{ height: this.props.height }}
        onClick={this.props.onClick}
      >
        <div id="left-list-item-content">{this.props.children.left}</div>
        <div id="right-list-item-content">{this.props.children.right}</div>
      </div>
    );
  }
}

export default ListItem;
