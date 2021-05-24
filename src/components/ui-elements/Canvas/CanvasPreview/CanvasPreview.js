import React, { Component } from "react";
import "./CanvasPreview.css";

import NavBar from "../../navBar/NavBar";

class CanvasPreview extends Component {
  render() {
    return (
      <div id="canvasPreview">
        <NavBar>
          {{
            left: <h4>CANVAS</h4>,
            right: (
              <>
                <button
                  className="btn btn-danger mr-3"
                  onClick={this.props.close}
                >
                  CLOSE
                </button>
              </>
            ),
          }}
        </NavBar>
        <div id="canvasDiv">
          <img src={this.props.img} />
        </div>
      </div>
    );
  }
}

export default CanvasPreview;
