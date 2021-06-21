import { Provider } from "react-redux";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import "./App.css";

import LoginRoute from "./components/login/LoginRoute";
import Student from "./components/student/Student";
import TeacherMain from "./components/teacher/TeacherMain";
import AdminMain from "./components/admin/AdminMain";

import { store } from "./store/store";
import React from "react";
import http from "./shared/http";
import $ from "jquery";
import StudentMain from "./components/student/StudentMain";
import Images from "./components/teacher/Evaluation/Images/Images";

import config from "./config";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  loadingRef = React.createRef();

  //check if system time is correct or notifier
  checkSystemTime = () => {
    http("GET", "/app/time", {}, (res) => {
      let currentTime = new Date();
      let offsetTime = 300000;
      let serverTime = new Date(res.data);

      let timeDiffrence = currentTime.getTime() - serverTime.getTime();

      if (timeDiffrence >= offsetTime) {
        this.setState(
          {
            errorMessage:
              "Cannot launch the application please ensure  your System Time is correct.",
          },
          () => {
            if (window.location.href != config.clientUrl + "/error")
              window.location.href = config.clientUrl + "/error";
          }
        );
      }
    });
  };

  componentDidMount() {
    //Replacing system default alert with custom alert
    window.alert = (text) => {
      $("body").append(
        `<div class="alert alert-info alert-dismissible " role="alert" id="systemAlert">
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

    //Loading Screen
    window.showLoading = () => {
      this.loadingRef.current.style.display = "block";
    };
    window.hideLoading = () => {
      this.loadingRef.current.style.display = "none";
    };

    //check timer
    this.checkSystemTime();
  }

  render() {
    return (
      <div>
        <div
          ref={this.loadingRef}
          style={{ display: "none", height: "100vh", position: "absolute" }}
        >
          <iframe
            src="../preloader/preload.html"
            style={{
              height: "100vh",
              width: "100vw",
              position: "absolute",
              "z-index": "100000",
            }}
          />
        </div>

        <BrowserRouter>
          <Provider store={store}>
            <div>
              {/* Routes of the app */}
              <Route path="/" component={LoginRoute} />
              <Route path="/student" component={StudentMain} />
              <Route path="/teacher" component={TeacherMain} />
              <Route path="/admin" component={AdminMain} />
              <Route path="/error">
                <h1>
                  <center>{this.state.errorMessage}</center>
                </h1>
              </Route>

              {/* //Test route for development purposes */}
              <Route path="/test"></Route>
            </div>
          </Provider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
