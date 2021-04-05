import React, { Component } from "react";
import NavBar from "../../../ui-elements/navBar/NavBar";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import { AiOutlineCheck } from "react-icons/ai";
import $ from "jquery";

class StartExam extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  //Check if all props are correctly available
  checkProps = () => {
    if (!this.props.exam) {
      alert("Reloading the page will return you to the homepage");
      window.history.back();
    }
  };

  //Prevent user page refresh
  preventPageRefresh = () => {
    window.onbeforeunload = function () {
      alert("Reloading the page will return you to the homepage");

      return "Reloading the page will stop the current examination. Are you sure ?";
    };
  };

  componentDidMount() {
    this.preventPageRefresh();
    console.log(this.props);
  }

  render() {
    //Check the props availability
    this.checkProps();

    $(document).ready(function () {
      // Disables ctrl+v, ctrl+x, ctrl+c.
      $("textarea").on("cut", function (e) {
        $("#d2").text("cut. not allowed!");
        e.preventDefault();
      });
      $("textarea").on("copy", function (e) {
        $("#d2").text("copy. not allowed!");
        e.preventDefault();
      });
      $("textarea").on("paste", function (e) {
        $("#d2").text("paste. not allowed!");
        e.preventDefault();
      });

      // Above all three can be combined into one, above is
      // executed separately for understanding purposes.
      /* $('textarea').on("cut copy paste", function(e) { 
        $("#d2").text('right-click is disabled!'); 
        e.preventDefault(); 
        }); */

      // Disables right-click.
      $("textarea").mousedown(function (e) {
        if (e.button == 2) {
          e.preventDefault();
          alert("right-click is disabled!");
        }
      });
    });

    return (
      <div className="root">
        <NavBar>
          {{
            left: (
              <div>
                <h5>TIME LEFT:HH:MM:SS</h5>
              </div>
            ),
            right: (
              <div>
                <Button className="btn btn-success">
                  <AiOutlineCheck />
                </Button>
              </div>
            ),
          }}
        </NavBar>
        <ListItem height="100px">
          {{
            left: (
              <div id="leftListItem">
                <p>DATE:DD-MM-YYYY</p>
                <p>TIME:HH:MM:SS</p>
                <p>Name of Examination:</p>
              </div>
            ),
            right: (
              <div id="rightListItem">
                <p>Subject:</p>
                <p>MARK:80</p>
              </div>
            ),
          }}
        </ListItem>
        <ListItem height="150px">
          {{
            left: (
              <div id="leftListItem">
                <p>What is computer</p>
                <p>
                  <textarea
                    cols="150"
                    rows="5"
                    type="textbox"
                    id="ans"
                    oncut="return false"
                    oncopy="return false"
                    onpaste="return false"
                  ></textarea>{" "}
                  <p id="d1"></p>
                  <p id="d2"></p>
                  <Button className="btn btn-secondary ml-3">canavs</Button>
                </p>
              </div>
            ),
            right: (
              <div id="rightListItem">
                <p></p>
              </div>
            ),
          }}
        </ListItem>
      </div>
    );
  }
}

export default withRouter(StartExam);
