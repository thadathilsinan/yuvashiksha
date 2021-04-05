import React, { Component } from "react";
import NavBar from "../../../ui-elements/navBar/NavBar";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import "./examguidliness.css";

class ExamGuidlines extends Component {
  //Check if all props are correclty available
  checkProps = () => {
    if (!this.props.exam) {
      window.history.back();
    }
  };

  componentDidMount() {
    this.checkProps();

    console.log(this.props);
  }

  render() {
    return (
      <>
        <NavBar>
          {{
            left: (
              <h5>
                <div id="navBarTitleContainer">
                  <Button
                    variant="primary"
                    className="btn btn-primary mr-3"
                    size="sm"
                    onClick={() => {
                      window.history.back();
                    }}
                  >
                    {"<"}
                  </Button>
                  EXAM GUIDELINES
                </div>
              </h5>
            ),
          }}
        </NavBar>
        <div id="examguidelines">
          <div className="col-sm-8 offset-sm-2" id="guidlinesContainer">
            <h3 className="text-center ml-4">EXAM GUIDELINES</h3>
            <br />
            <div>
              <h6>
                EXAM NAME: {this.props.exam.examName}
                <br />
                SUBJECT: {this.props.exam.subject}
              </h6>
            </div>
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
            <Button className="text-right" variant="success">
              START EXAM
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ExamGuidlines);
