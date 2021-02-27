import React, { Component } from "react";
import "./Search.css";

export default class Search extends Component {
  searchInput = React.createRef();

  render() {
    return (
      <div className="searchContainer">
        <input
          type="text"
          name="search"
          placeholder="Search"
          ref={this.searchInput}
        ></input>
        <input
          type="button"
          className="btn btn-success"
          value="SEARCH"
          onClick={() => this.props.click(this.searchInput.current.value)}
        ></input>
      </div>
    );
  }
}
