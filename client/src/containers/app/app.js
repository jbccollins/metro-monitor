import React from "react";
import DemoComponent from "components/DemoComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setDisplayMode } from "actions/controls";
import { DARK, LIGHT } from "common/constants/theme";

import "./app.scss";

class App extends React.Component {
  handleDisplayModeChange = () => {
    const { displayMode } = this.props;
    this.props.setDisplayMode(displayMode === LIGHT ? DARK : LIGHT);
  };

  render() {
    const { displayMode } = this.props;
    return (
      <div className={displayMode}>
        <main>
          <DemoComponent
            onClick={this.handleDisplayModeChange}
            theme={displayMode}
          />
        </main>
      </div>
    );
  }
}

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
)(App);
