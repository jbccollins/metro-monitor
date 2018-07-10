import React from "react";
import "./DemoComponent.scss";

class DemoComponent extends React.Component {
  render() {
    return (
      <div className="DemoComponent" onClick={this.props.onClick}>
        Demo Component
      </div>
    );
  }
}

export default DemoComponent;
