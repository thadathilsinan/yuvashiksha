import { Component } from "react";
import "./TabView.css";

let rightTab = null,
  leftTab = null;

class TabView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: null,
    };
  }

  changeToLeftTab = () => {
    this.setState({ selectedTab: 1 });

    document.getElementById("leftTab").setAttribute("class", "selectedTab");
    document.getElementById("rightTab").removeAttribute("class");
  };

  changeToRightTab = () => {
    this.setState({ selectedTab: 2 });

    document.getElementById("rightTab").setAttribute("class", "selectedTab");
    document.getElementById("leftTab").removeAttribute("class");
  };

  componentDidMount() {
    this.changeToLeftTab();
  }

  render() {
    if (this.props.children) {
      if (this.props.children.rightTab) {
        rightTab = this.props.children.rightTab;
      }
      if (this.props.children.leftTab) {
        leftTab = this.props.children.leftTab;
      }
    }

    return (
      <div id="tabViewContainer">
        <div id="tabViewRow">
          <div id="leftTab" onClick={this.changeToLeftTab}>
            <span>{rightTab}</span>
          </div>
          <div id="rightTab" onClick={this.changeToRightTab}>
            <span>{leftTab}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default TabView;
