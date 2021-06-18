import React, { Component } from "react";
import http from "../../../../shared/http";
import NavBar from "../../../ui-elements/navBar/NavBar";
import "./Images.css";
import { Button } from "react-bootstrap";
import Loading from "../../../ui-elements/loading.js/Loading";
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
            //hiding loadingScreen
            window.hideLoading();

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
            left: (
              <div id="left-nav-image">
                {" "}
                <Button
                  variant="primary"
                  className="btn btn-primary mr-3"
                  id="navBack"
                  size="sm"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Go back"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  {"<"}
                </Button>
                <span id="nav-image">IMAGES</span>
              </div>
            ),
            right: (
              <button className="btn-close" onClick={this.props.close}>
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
