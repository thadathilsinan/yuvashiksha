import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import http from "../../shared/http";
import Student from "./Student";
import { FaPowerOff } from "react-icons/fa";
import $ from "jquery";

class StudentMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      component: null,
      show: true,
      text: "PLEASE WAIT ...",
      textHint: "",
      showCloseButton: false,
    };
  }

  checkAuthentication = () => {
    http(
      "POST",
      "/login/checkStudent",
      null,
      (res) => {
        if (res.status == 200) {
          this.setState({
            component: <Student user={res.data} />,
          });
        } else {
          alert(res.data);
          this.setState({ component: null });
          this.props.history.push("/");
        }
      },
      (err) => {
        alert("Authentication Failed! Please login again");
        this.setState({ component: null });
        this.props.history.push("/");
      }
    );
  };

  //Check if running in kiosk mode or not
  checkKiosk = () => {
    if (
      (window.screen.availHeight || window.screen.height - 30) <=
      window.innerHeight
    ) {
      navigator.clipboard
        .readText()
        .then((text) => {
          if (
            text ===
            "hjafjbsfmnzcbfisfhbjkadbnjkfgouidh;OHIDYR985r89wyrwqfpawis8uy89uy9f8fc5ra8eu9565qafusiug238q478"
          ) {
            this.setState({ show: true, showCloseButton: true });
          } else {
            this.setState({ text: "OPEN YUVASHIKSHA USING THE LAUNCHER" });
          }
        })
        .catch((err) => {
          this.setState({
            text: "CANNOT START YUVASHIKSHA, 'CLIPBOARD' PERMISSION BLOCKED",
            textHint: "(RESTART LAUNCHER AND ALLOW PERMISSION)",
            showCloseButton: true,
          });
        });
    } else {
      this.setState({ text: "OPEN YUVASHIKSHA USING THE LAUNCHER" });
    }
  };

  //disable right click
  preventRightClick = () => {
    document.addEventListener("contextmenu", (event) => event.preventDefault());
  };

  //Prevent COPY ,PASTE
  preventCopyPaste = () => {
    $(document).ready(() => {
      // Disables ctrl+v, ctrl+x, ctrl+c.
      $(document).on("cut copy paste", function (e) {
        alert("Cut, Copy, Paste are NOT allowed.");
        e.preventDefault();
      });
    });
  };

  //Prevent keys for security in KIOSK mode
  preventKeys = () => {
    $(document).ready(() => {
      $(document).keydown((event) => {
        let key = event.which;

        //Disabling keys
        if (
          key === 17 ||
          key === 18 ||
          key === 91 ||
          key === 92 ||
          key === 93 ||
          key === 112 ||
          key === 113 ||
          key === 114 ||
          key === 115 ||
          key === 116 ||
          key === 117 ||
          key === 118 ||
          key === 119 ||
          key === 120 ||
          key === 121 ||
          key === 122 ||
          key === 123 ||
          key === 44 ||
          event.ctrlKey ||
          event.altKey
        ) {
          event.preventDefault();
        }
      });
    });
  };

  componentDidMount() {
    // this.checkKiosk();

    //Disabling right click menu
    this.preventRightClick();

    //Prevent cut copy paste features
    this.preventCopyPaste();

    this.preventKeys();

    this.checkAuthentication();
  }

  render() {
    return (
      <>
        {this.state.show ? (
          this.state.component ? (
            this.state.component
          ) : null
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "100vh", flexDirection: "column" }}
          >
            {/* EXIT BUTTON */}
            {this.state.showCloseButton ? (
              <div id="yuvashikshaExit">
                <button
                  className="btn btn-danger"
                  title="Exit Yuvashiksha"
                  onClick={() => {
                    if (window.confirm("Are you sure to exit Yuvashiksha?"))
                      navigator.clipboard.writeText("close-yuvashiksha");
                  }}
                >
                  <FaPowerOff />
                </button>
              </div>
            ) : null}

            <h2>{this.state.text}</h2>
            {this.state.textHint ? <h5>{this.state.textHint}</h5> : null}
          </div>
        )}
      </>
    );
  }
}

export default withRouter(StudentMain);
