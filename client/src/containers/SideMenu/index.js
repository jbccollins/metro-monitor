import React from 'react';
import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import './style.scss';

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
    height: '30px',
    left: '36px',
    top: '36px'
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
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
};

class SideMenu extends React.Component {
  render() {
    console.log(this.props.visibleRailLines);
    return (
      <div className="SideMenu">
        <MenuWrap wait={20}>
          <Menu styles={styles}>
            <a id="home" className="menu-item" href="/">
              Home
            </a>
            <a id="about" className="menu-item" href="/about">
              About
            </a>
            <a id="contact" className="menu-item" href="/contact">
              Contact
            </a>
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
      //fetchSideMenu,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
