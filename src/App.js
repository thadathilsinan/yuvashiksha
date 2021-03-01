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

class App extends React.Component {
  componentDidMount() {
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
            <Route path="/student" component={Student} />
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
