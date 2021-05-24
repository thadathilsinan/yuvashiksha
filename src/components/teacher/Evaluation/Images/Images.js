import React, { Component } from "react";
import http from "../../../../shared/http";
import NavBar from "../../../ui-elements/navBar/NavBar";
import "./Images.css";

class Images extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      renderedImages: null,
    };
  }

  //Fetch images from DB
  getImages = () => {
    http(
      "POST",
      "/teacher/previousexam/evaluate/getimages",
      { images: this.props.images },
      (res) => {
        if (res.status == 200) {
          this.setState({ images: res.data }, () => {
            this.renderImages();
          });
        }
      }
    );
  };

  //Render Images
  renderImages = () => {
    let images = this.state.images.map((image, index, array) => {
      return <img src={image} className="student-image" />;
    });

    this.setState({ renderedImages: images });
  };

  componentDidMount() {
    this.getImages();
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <NavBar>
          {{
            left: <h4>IMAGES</h4>,
            right: (
              <button className="btn btn-danger" onClick={this.props.close}>
                CLOSE
              </button>
            ),
          }}
        </NavBar>
        <div id="imagesBody">
          <div className="container">{this.state.renderedImages}</div>
        </div>
      </div>
    );
  }
}

export default Images;
