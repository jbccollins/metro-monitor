import React from "react";
import PropTypes from "prop-types";
import DemoComponent from "components/DemoComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setDisplayMode, fetchData } from "actions/controls";
import { DARK, LIGHT } from "common/constants/theme";
import "./DemoContainer.scss";

class DemoContainer extends React.Component {

  componentDidMount() {
    this.props.fetchData();
  }

  handleDisplayModeChange = () => {
    const { displayMode, setDisplayMode } = this.props;
    setDisplayMode(displayMode === LIGHT ? DARK : LIGHT);
  };

  render() {
    const { displayMode, data } = this.props;
    return (
      <div className={`DemoContainer ${displayMode}`}>
        <DemoComponent
          data={data}
          onClick={this.handleDisplayModeChange}
          theme={displayMode}
        />
      </div>
    );
  }
}

DemoContainer.propTypes = {
  displayMode: PropTypes.oneOf([DARK, LIGHT]).isRequired,
  setDisplayMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  displayMode: state.displayMode,
  data: state.data
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setDisplayMode,
      fetchData,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DemoContainer);