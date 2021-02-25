import React from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { FaMinus, FaPencilAlt } from "react-icons/fa";
import ListItem from "../../../ui-elements/ListItem/ListItem";
import configureDialogBox from "../../../../shared/dailogBox";
import "./Department.css";
import http from "../../../../shared/http";
import $ from "jquery";

class Departments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentList: null,
    };
  }

  //Creating necessary ref objects
  newDepartmentName = React.createRef();

  getDepartments = () => {
    //getting department data from db
    http("GET", "/admin/institutionstructure/department", {}, async (res) => {
      let departments = { ...res.data };
      console.log(departments);

      //This will return options for the <select> to select HOD for each department
      let getHodOptions = (department) => {
        //Get teachers in department options
        let teacherOptions = [];
        if (department.teachers) {
          teacherOptions = department.teachers.map((teacher, index, array) => {
            return <option id={teacher._id}>{teacher.name}</option>;
          });
        }

        return (
          <>
            {/* //Setting HOD option */}
            {department.assignedHod ? (
              <option id={department.assignedHod._id} selected>
                {department.assignedHod.name}
              </option>
            ) : (
              <option selected>NO HOD</option>
            )}
            {teacherOptions}
          </>
        );
      };

      let departmentList = Object.keys(departments).map(function (key, index) {
        let department = departments[key];

        return (
          <ListItem height="90px">
            {{
              left: (
                <Form className="md-6">
                  <Form.Group controlId="formBasicCheckbox">
                    <Row>
                      <Col>
                        <Form.Label className="text-dark">{key}</Form.Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label className="text-dark">
                          Head of the department:
                        </Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          as="select"
                          defaultValue="Department"
                          placeholder="Department"
                          style={{ width: "200px" }}
                        >
                          {getHodOptions(department)}
                        </Form.Control>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              ),
              right: (
                <div>
                  <Button className="btn btn-danger mr-3">
                    <FaMinus />
                  </Button>
                  <a
                    href="#"
                    data-toggle="modal"
                    data-target="#editdept"
                    style={{ color: "white" }}
                  >
                    <Button className="btn btn-secondary">
                      <FaPencilAlt />
                    </Button>
                  </a>
                </div>
              ),
            }}
          </ListItem>
        );
      });
      this.setState({ departmentList });
    });
  };

  //To add a new department
  addDepartment = () => {
    let departmentName = this.newDepartmentName.current.value;

    if (departmentName == "") {
      alert("Please fill department name");
    } else {
      http(
        "POST",
        "/admin/institutionstructure/department/add",
        { departmentName },
        (res) => {
          if (res.status == 200) {
            alert("Department addedd successfully");
          } else {
            alert(res.data);
          }
        }
      );
    }
  };

  componentDidMount() {
    //get department data from server
    this.getDepartments();
  }

  render() {
    return (
      <div id="departmentList">
        <div>
          {/* Configuring The add department */}
          {configureDialogBox(
            "adddept",
            "ADD DEPARTMENT",
            <>
              <label className="black" for="dept">
                Name of department:{" "}
              </label>
              <input
                type="text"
                name="dept"
                id="dept"
                ref={this.newDepartmentName}
              ></input>
            </>,
            <>
              <button className="btn btn-primary" onClick={this.addDepartment}>
                ADD
              </button>
            </>
          )}
          {/* Configuring The edit department */}
          {configureDialogBox(
            "editdept",
            "EDIT DEPARTMENT",
            <>
              <form>
                <label className="black" for="dept">
                  Name of department:{" "}
                </label>
                <input type="text" name="dept" id="dept"></input>
                <br />
              </form>
            </>,
            <>
              <button className="btn btn-primary">OK</button>
            </>
          )}
        </div>

        {this.state.departmentList}
      </div>
    );
  }
}

export default Departments;
