import React from "react";
import PropTypes from "prop-types";
import DemoComponent from "components/DemoComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setDisplayMode } from "actions/controls";
import { DARK, LIGHT } from "common/constants/theme";
import { withStyles } from "@material-ui/core/styles";
import "./app.scss";

const styles = {
  root: {
    backgroundColor: "grey"
  }
};

class App extends React.Component {
  handleDisplayModeChange = () => {
    const { displayMode, setDisplayMode } = this.props;
    setDisplayMode(displayMode === LIGHT ? DARK : LIGHT);
  };

  render() {
    const { displayMode, classes } = this.props;
    return (
      <div className={`App ${displayMode} ${classes.root}`}>
        <DemoComponent
          onClick={this.handleDisplayModeChange}
          theme={displayMode}
        />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  displayMode: state.displayMode
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setDisplayMode
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
