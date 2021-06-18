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
import StudentMain from "./components/student/StudentMain";
import Images from "./components/teacher/Evaluation/Images/Images";
import Loading from "./components/ui-elements/loading.js/Loading";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  loadingRef = React.createRef();

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
