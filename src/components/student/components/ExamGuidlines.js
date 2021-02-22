import React, { Component } from "react";
import NavBar from "../../ui-elements/navBar/NavBar";
import { Button } from "react-bootstrap";
export default class ExamGuidlines extends Component {
  render() {
    return (
      <div className>
        <NavBar>
          {{
            left: (
              <h5>
                Class Test
                <br />
                Html
              </h5>
            ),
          }}
        </NavBar>
        <div className="root">
          <div>
            <h3 className="text-center">EXAM GUIDELNIES</h3>
            <ul className="mt-3">
              <li className="mt-3">
                Participants must have an active internet connction throughout
                the exam
              </li>
              <li className="mt-3">
                You must allow the permission to access camera and microphone
              </li>
              <li className="mt-3">
                Participants are under the survillance. Any kind of malpractice
                detected by the system will lead to disqualification of your
                exam
              </li>
              <li className="mt-3">
                Participants must stay in the examination window till the exam
                is finished.
              </li>
              <li className="mt-3">
                Participants must be seated in a good lighting condition
              </li>
              <li className="mt-3">
                Participants must NOT use any kind of communication devices
                during examination.
              </li>
            </ul>
          </div>
          <div className="text-right mr-3">
            {" "}
            <Button className="text-right" variant="light">
              Start Exam
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
