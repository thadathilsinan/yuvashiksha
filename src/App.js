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

class App extends React.Component {
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
  }

  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <div>
            {/* Routes of the app */}
            <Route path="/" component={LoginRoute} />
            <Route path="/student" component={StudentMain} />
            <Route path="/teacher" component={TeacherMain} />
            <Route path="/admin" component={AdminMain} />

            {/* //Test route for development purposes */}
            <Route path="/test">
              <>
                <Canvas />
              </>
            </Route>
          </div>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
