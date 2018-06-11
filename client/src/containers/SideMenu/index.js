import React from 'react';
import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import './style.scss';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import { setVisibleRailLines } from 'actions/controls';

class MenuWrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const sideChanged =
      this.props.children.props.right !== nextProps.children.props.right;

    if (sideChanged) {
      this.setState({ hidden: true });

      setTimeout(() => {
        this.show();
      }, this.props.wait);
    }
  }

  show() {
    this.setState({ hidden: false });
  }

  render() {
    let style;

    if (this.state.hidden) {
      style = { display: 'none' };
    }

    return (
      <div style={style} className={this.props.side}>
        {this.props.children}
      </div>
    );
  }
}

var styles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '36px',
    height: '36px',
    left: '10px',
    top: '10px'
  },
  bmBurgerBars: {
    background: 'white'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenu: {
    background: '#2b2b2b',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: 'white',
    padding: '0.8em'
  },
  bmOverlay: {
    display: 'none',
    background: 'rgba(0, 0, 0, 0.3)'
  }
};

class SideMenu extends React.Component {
  state = {
    checked: true
  };

  toggleRailLineVisibility = railLineName => {
    const { visibleRailLines, setVisibleRailLines } = this.props;
    const index = visibleRailLines.indexOf(railLineName);
    if (index > -1) {
      const newVisibleLines = [].concat(visibleRailLines);
      newVisibleLines.splice(index, 1);
      setVisibleRailLines(newVisibleLines);
    } else {
      setVisibleRailLines([].concat(visibleRailLines, railLineName));
    }
  };

  render() {
    const { visibleRailLines } = this.props;
    return (
      <div className="SideMenu">
        <MenuWrap wait={20}>
          <Menu styles={styles}>
            {LINE_NAMES.map(name => (
              <div className="toggle-wrapper" key={name}>
                <label>
                  <Toggle
                    icons={false}
                    className={`custom-toggle ${name}`}
                    checked={visibleRailLines.includes(name)}
                    onChange={() => this.toggleRailLineVisibility(name)}
                  />
                  <span className="toggle-label">
                    {LINE_PROPERTIES[name]['trackLineID']}
                  </span>
                </label>
              </div>
            ))}
          </Menu>
        </MenuWrap>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visibleRailLines: state.visibleRailLines
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setVisibleRailLines
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
