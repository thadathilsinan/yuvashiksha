import React, { Component } from "react";
import NavBar from "../navBar/NavBar";
import "./Canvas.css";

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvas = false;
    this.ctx = false;
    this.flag = false;

    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;
    this.dot_flag = false;

    this.x = "black";
    this.y = 2;
  }

  init = () => {
    this.canvas = document.getElementById("can");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    this.w = this.canvas.width;
    this.h = this.canvas.height;

    this.canvas.addEventListener(
      "mousemove",
      (e) => {
        this.findxy("move", e);
      },
      false
    );

    this.canvas.addEventListener(
      "mousedown",
      (e) => {
        this.findxy("down", e);
      },
      false
    );

    this.canvas.addEventListener(
      "mouseup",
      (e) => {
        this.findxy("up", e);
      },
      false
    );

    this.canvas.addEventListener(
      "mouseout",
      (e) => {
        this.findxy("out", e);
      },
      false
    );
  };

  color = (obj) => {
    switch (obj.id) {
      case "green":
        this.x = "green";
        break;
      case "blue":
        this.x = "blue";
        break;
      case "red":
        this.x = "red";
        break;
      case "yellow":
        this.x = "yellow";
        break;
      case "orange":
        this.x = "orange";
        break;
      case "black":
        this.x = "black";
        break;
      case "white":
        this.x = "white";
        break;
    }
    if (this.x == "white") this.y = 14;
    else this.y = 2;
  };

  draw = () => {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.x;
    this.ctx.lineWidth = this.y;
    this.ctx.stroke();
    this.ctx.closePath();
  };

  erase = () => {
    var m = window.confirm("Are you sure to clear?");
    if (m) {
      this.ctx.clearRect(0, 0, this.w, this.h);
    }
  };

  //Check if acanvas is empty
  isCanvasBlank = (canvas) => {
    const context = canvas.getContext("2d");

    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );

    return !pixelBuffer.some((color) => color !== 0);
  };

  save = () => {
    var dataURL = this.canvas.toDataURL();
    if (this.props.save) {
      if (this.isCanvasBlank(this.canvas)) {
        this.props.save("");
      } else this.props.save(dataURL);
    }
  };

  findxy = (res, e) => {
    if (res == "down") {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = e.clientX - this.canvas.getBoundingClientRect().left;
      this.currY = e.clientY - this.canvas.getBoundingClientRect().top;

      this.flag = true;
      this.dot_flag = true;
      if (this.dot_flag) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.x;
        this.ctx.fillRect(this.currX, this.currY, 2, 2);
        this.ctx.closePath();
        this.dot_flag = false;
      }
    }
    if (res == "up" || res == "out") {
      this.flag = false;
    }
    if (res == "move") {
      if (this.flag) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - this.canvas.getBoundingClientRect().left;
        this.currY = e.clientY - this.canvas.getBoundingClientRect().top;
        this.draw();
      }
    }
  };

  componentDidMount() {
    this.init();

    //Load previous image if exist
    if (this.props.image) {
      let ctx = this.canvas.getContext("2d");

      var image = new Image();
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
      };
      image.src = this.props.image;
    }
  }

  render() {
    return (
      <>
        <div style={{ zIndex: 1000000 }}>
          <NavBar>
            {{
              left: <h4>CANVAS</h4>,
              center: (
                <div style={{ display: "flex" }}>
                  <div className="mr-3">
                    <div>Choose Color</div>
                    <div style={{ display: "flex" }}>
                      <div
                        id="green"
                        className="colorBox"
                        onClick={(e) => {
                          this.color(e.target);
                        }}
                        style={{ backgroundColor: "green" }}
                      ></div>
                      <div
                        style={{ backgroundColor: "blue" }}
                        id="blue"
                        className="colorBox"
                        onClick={(e) => {
                          this.color(e.target);
                        }}
                      ></div>
                      <div
                        style={{ backgroundColor: "red" }}
                        id="red"
                        className="colorBox"
                        onClick={(e) => {
                          this.color(e.target);
                        }}
                      ></div>
                      <div
                        id="yellow"
                        style={{ backgroundColor: "yellow" }}
                        onClick={(e) => {
                          this.color(e.target);
                        }}
                        className="colorBox"
                      ></div>
                      <div
                        id="orange"
                        style={{ backgroundColor: "orange" }}
                        onClick={(e) => {
                          this.color(e.target);
                        }}
                        className="colorBox"
                      ></div>
                      <div
                        id="black"
                        style={{ backgroundColor: "black" }}
                        onClick={(e) => {
                          this.color(e.target);
                        }}
                        className="colorBox"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div>Eraser</div>
                    <div
                      id="white"
                      style={{ backgroundColor: "white" }}
                      className="colorBox"
                      onClick={(e) => {
                        this.color(e.target);
                      }}
                    ></div>
                  </div>
                  {/* <img
                  id="canvasimg"
                /> */}
                </div>
              ),
              right: (
                <>
                  <button id="btn-close" onClick={this.props.close}>
                    CLOSE
                  </button>

                  <button type="button" id="btn-clear" onClick={this.erase}>
                    CLEAR
                  </button>
                  <button id="btn-save" onClick={this.save}>
                    SAVE
                  </button>
                </>
              ),
            }}
          </NavBar>
          <div id="canvasDiv">
            <canvas id="can"></canvas>
          </div>
        </div>
      </>
    );
  }
}
