import React from "react";
import DemoComponent from "components/DemoComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setDisplayMode } from "actions/controls";

import "./app.scss";

class App extends React.Component {
  render() {
    const { displayMode } = this.props;
    return (
      <div>
        <main>
          <DemoComponent displayMode={displayMode} />
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
