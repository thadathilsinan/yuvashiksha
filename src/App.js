import { Provider } from "react-redux";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import "./App.css";

import LoginRoute from "./components/login/LoginRoute";
import Student from "./components/student/Student";
import TeacherMain from "./components/teacher/TeacherMain";
import AdminMain from "./components/admin/AdminMain";

import { store } from "./store/store";
import React from "react";

import $ from "jquery";
import Canvas from "./components/ui-elements/Canvas/Canvas";
import StudentMain from "./components/student/StudentMain";

import { FaPowerOff } from "react-icons/fa";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      text: "INITIALIZING YUVASHIKSHA ...",
      textHint: "",
    };
  }

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
            this.setState({ show: true });
          } else {
            this.setState({ text: "OPEN YUVASHIKSHA USING THE LAUNCHER" });
          }
        })
        .catch((err) => {
          this.setState({
            text: "CANNOT START YUVASHIKSHA, 'CLIPBOARD' PERMISSION BLOCKED",
            textHint: "(RESTART LAUNCHER AND ALLOW PERMISSION)",
          });
        });
    } else {
      this.setState({ text: "OPEN YUVASHIKSHA USING THE LAUNCHER" });
    }
  };

  componentDidMount() {
    //Disabling right click menu
    this.preventRightClick();

    //Prevent cut copy paste features
    this.preventCopyPaste();

    //Replacing system default alert with custom alert
    window.alert = (text) => {
      $("body").append(
        `<div class="alert alert-info alert-dismissible" role="alert" id="systemAlert">
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>${text}
        </div>`
      );
    };

    this.preventKeys();

    this.checkKiosk();
  }

  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          {this.state.show ? (
            <div>
              {/* Routes of the app */}
              <Route path="/" component={LoginRoute} />
              <Route path="/student" component={StudentMain} />
              <Route path="/teacher" component={TeacherMain} />
              <Route path="/admin" component={AdminMain} />

              {/* //Test route for development purposes */}
              <Route path="/test"></Route>
            </div>
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "100vh", flexDirection: "column" }}
            >
              {/* EXIT BUTTON */}
              <div id="yuvashikshaExit">
                <button
                  className="btn btn-danger"
                  title="Exit Yuvashiksha"
                  onClick={() => {
                    navigator.clipboard.writeText("close-yuvashiksha");
                  }}
                >
                  <FaPowerOff />
                </button>
              </div>

              <h2>{this.state.text}</h2>
              {this.state.textHint ? <h5>{this.state.textHint}</h5> : null}
            </div>
          )}
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
