import { Provider } from "react-redux";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import "./App.css";

import LoginRoute from "./components/login/LoginRoute";
import Student from "./components/student/Student";
import Teacher from "./components/teacher/Teacher";
import Admin from "./components/admin/Admin";

import { store } from "./store/store";
import { Modal } from "react-bootstrap";
import React from "react";

import $ from "jquery";

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
          <div id="root">
            {/* Replacing system alert with custom modal */}
            {/* <Modal
              show={this.state.alertShow}
              onHide={this.closeAlert}
              className="modal-body"
            >
              <Modal.Header closeButton>
                <Modal.Title>Message</Modal.Title>
              </Modal.Header>
              <Modal.Body>{this.state.alertText}</Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal> */}

            {/* Routes of the app */}
            <Route path="/" component={LoginRoute} />
            <Route path="/student" component={Student} />
            <Route path="/teacher" component={Teacher} />
            <Route path="/admin" component={Admin} />

            {/* //Test route for development purposes */}
            <Route path="/test">
              <></>
            </Route>
          </div>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
