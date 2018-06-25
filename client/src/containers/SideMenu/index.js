import React from 'react';
import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import './style.scss';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import { setVisibleRailLines, setShowTiles } from 'actions/controls';
import {
  setSelectedDestinationRailStations,
  setSelectedRailStations
} from 'actions/metro';
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
    padding: '30px 30px 12px 12px',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: 'white'
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
    const {
      visibleRailLines,
      setVisibleRailLines,
      setSelectedRailStations,
      railStations,
      selectedRailStations
    } = this.props;
    const index = visibleRailLines.indexOf(railLineName);
    let newVisibleLines;
    if (index > -1) {
      newVisibleLines = [].concat(visibleRailLines);
      newVisibleLines.splice(index, 1);
    } else {
      newVisibleLines = [].concat(visibleRailLines, railLineName);
    }
    setVisibleRailLines(newVisibleLines);
    if (selectedRailStations) {
      const visibleRailLineCodes = newVisibleLines.map(
        l => LINE_PROPERTIES[l]['code']
      );
      const visibleRailStations = railStations
        .filter(({ LineCode1, LineCode2, LineCode3 }) => {
          return [LineCode1, LineCode2, LineCode3].some(c =>
            visibleRailLineCodes.includes(c)
          );
        })
        .map(({ Code }) => Code);
      // If a station is selected and then then every rail line associated with that station is toggled off
      // clear the station
      if (!selectedRailStations.some(s => visibleRailStations.includes(s))) {
        setSelectedRailStations(null);
      }
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
  };

  formatGroupLabel = data => (
    <div>
      <span style={{ fontSize: '10px' }}>{data.label}</span>
    </div>
  );

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
                        closeOnSelect={false}
                        closeMenuOnSelect={false}
                        onSelectResetsInput={false}
                        formatGroupLabel={this.formatGroupLabel}
                        onChange={s =>
                          this.handleDestinationStationChange(name, s)
                        }
                        options={[
                          {
                            label: 'Common Destinations',
                            options: railStations
                              .filter(
                                ({ LineCode1, LineCode2, LineCode3, Code }) =>
                                  [LineCode1, LineCode2, LineCode3].includes(
                                    LINE_PROPERTIES[name]['code']
                                  ) &&
                                  LINE_PROPERTIES[name][
                                    'commonDestinationStationCodes'
                                  ].includes(Code)
                              )
                              .sort((a, b) => a.Name.localeCompare(b.Name))
                              .map(({ Code, Name }) => ({
                                value: Code,
                                label: Name
                              }))
                          },
                          {
                            label: 'Other Destinations',
                            options: railStations
                              .filter(
                                ({ LineCode1, LineCode2, LineCode3, Code }) =>
                                  [LineCode1, LineCode2, LineCode3].includes(
                                    LINE_PROPERTIES[name]['code']
                                  ) &&
                                  !LINE_PROPERTIES[name][
                                    'commonDestinationStationCodes'
                                  ].includes(Code)
                              )
                              .sort((a, b) => a.Name.localeCompare(b.Name))
                              .map(({ Code, Name }) => ({
                                value: Code,
                                label: Name
                              }))
                          }
                        ]}
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
  showTiles: state.showTiles,
  selectedRailStations: state.selectedRailStations
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setVisibleRailLines,
      setSelectedDestinationRailStations,
      setSelectedRailStations,
      setShowTiles
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
