import React from "react";
import PropTypes from "prop-types";
import DemoContainer from "containers/DemoContainer";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import "./app.scss";

const styles = {
  root: {
    boxShadow: "inset 0 0 10px red"
  }
};

class App extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={`App ${classes.root}`}>
        <DemoContainer />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {

    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
