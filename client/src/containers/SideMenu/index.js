import React from 'react';
import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import './style.scss';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import { setVisibleRailLines, setShowTiles } from 'actions/controls';
import { setSelectedDestinationRailStations } from 'actions/metro';
import Select from 'react-select';

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
    width: '30px',
    height: '28px',
    left: '12px',
    top: '12px',
    background: '#2b2b2b'
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
    background: 'rgba(0, 0, 0, 0.3)'
  }
};

const selectStyles = {
  control: styles => ({
    ...styles,
    color: 'black',
    minHeight: '20px',
    //height: '20px',
    //maxHeight: '20px',
    fontSize: '12px'
    //marginBottom: '10px'
  }),
  option: styles => ({
    ...styles,
    color: 'black',
    minHeight: '20px',
    //maxHeight: '20px',
    fontSize: '12px',
    lineHeight: '12px',
    paddingTop: '4px',
    paddingBottom: '4px',
    wordWrap: 'nowrap',
    textOverflow: 'ellipsis'
  }),
  multiValue: styles => ({ ...styles, color: 'black', maxWidth: '100px' }),
  multiValueLabel: styles => ({ ...styles, color: 'black' }),
  multiValueRemove: styles => ({ ...styles, color: 'black' })
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

  handleDestinationStationChange = (line, selectedStations) => {
    const {
      setSelectedDestinationRailStations,
      selectedDestinationRailStations
    } = this.props;
    setSelectedDestinationRailStations({
      ...selectedDestinationRailStations,
      [line]: selectedStations
    });
    console.log(line, selectedStations);
  };

  render() {
    const {
      visibleRailLines,
      railStations,
      selectedDestinationRailStations,
      showTiles
    } = this.props;
    return (
      <div className="SideMenu">
        <MenuWrap wait={20}>
          <Menu styles={styles}>
            <div>
              {LINE_NAMES.map(name => (
                <div
                  className="toggle-wrapper"
                  key={name}
                  style={{ borderColor: LINE_PROPERTIES[name]['color'] }}>
                  <label>
                    <span className="toggle-label">
                      {LINE_PROPERTIES[name]['trackLineID']}
                    </span>
                    <Toggle
                      icons={false}
                      className={`custom-toggle ${name}`}
                      checked={visibleRailLines.includes(name)}
                      onChange={() => this.toggleRailLineVisibility(name)}
                    />
                  </label>
                  {railStations && (
                    <div
                      className={`select-container ${
                        visibleRailLines.includes(name) ? 'visible' : 'hidden'
                      }`}>
                      <Select
                        isMulti
                        styles={selectStyles}
                        placeholder={`All destinations...`}
                        value={selectedDestinationRailStations[name]}
                        onChange={s =>
                          this.handleDestinationStationChange(name, s)
                        }
                        options={railStations
                          .filter(({ LineCode1, LineCode2, LineCode3 }) =>
                            [LineCode1, LineCode2, LineCode3].includes(
                              LINE_PROPERTIES[name]['code']
                            )
                          )
                          .sort((a, b) => a.Name.localeCompare(b.Name))
                          .map(({ Code, Name }) => ({
                            value: Code,
                            label: Name
                          }))}
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className="toggle-wrapper">
                <label>
                  <span className="toggle-label">Show Map Tiles</span>
                  <Toggle
                    icons={false}
                    className={`custom-toggle show-tiles`}
                    checked={showTiles}
                    onChange={() => this.props.setShowTiles(!showTiles)}
                  />
                </label>
              </div>
            </div>
          </Menu>
        </MenuWrap>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visibleRailLines: state.visibleRailLines,
  railStations: state.railStations.railStations,
  selectedDestinationRailStations: state.selectedDestinationRailStations,
  showTiles: state.showTiles
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setVisibleRailLines,
      setSelectedDestinationRailStations,
      setShowTiles
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
