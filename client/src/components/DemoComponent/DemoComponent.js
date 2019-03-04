import React from "react";
import PropTypes from "prop-types";
import "./DemoComponent.scss";

class DemoComponent extends React.Component {
  render() {
    return (
      <div className="DemoComponent" onClick={this.props.onClick}>
        DemoComponent
      </div>
    );
  }
}

DemoComponent.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default DemoComponent;
