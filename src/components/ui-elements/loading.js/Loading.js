import React, { Component } from "react";
import "./Loading.css";

class Loading extends Component {
  render() {
    return (
      <>
        <div className="loadingScreen">
          <iframe src="../preloader/preload.html"></iframe>
        </div>
      </>
    );
  }
}

export default Loading;
