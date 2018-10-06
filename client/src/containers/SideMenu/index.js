import React from 'react';
import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import './style.scss';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';
import {
  setVisibleRailLines,
  setShowTiles,
  setDisplayMode
} from 'actions/controls';
import {
  setSelectedDestinationRailStations,
  setSelectedRailStations
} from 'actions/metro';
import Select from 'react-select';
import Collapsible from 'react-collapsible';
import { DARK, LIGHT } from 'common/constants/controls';

const TRANSITION_TIME = 100;

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
    display: 'none',
    height: '24px',
    width: '24px',
    marginRight: '15px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenu: {
    background: '#2b2b2b',
    padding: '12px 12px 12px 12px',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: 'white'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.7)'
  }
};

const selectStyles = {
  control: styles => ({
    ...styles,
    color: 'white',
    minHeight: '20px',
    backgroundColor: '#2b2b2b',
    //height: '20px',
    //maxHeight: '20px',
    fontSize: '12px'
    //marginBottom: '10px'
  }),
  input: styles => ({
    ...styles,
    color: 'white'
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
      // If a station is selected and then every rail line associated with that station is toggled off
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
      [line]: selectedStations.map(({ value }) => value)
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
      showTiles,
      displayMode
    } = this.props;
    return (
      <div className="SideMenu">
        <MenuWrap wait={20}>
          <Menu styles={styles}>
            <Collapsible
              open
              transitionTime={TRANSITION_TIME}
              trigger={
                <div className="menu-trigger-wrapper">
                  <div className="menu-icon settings" />
                  <div className="menu-title">Settings</div>
                </div>
              }>
              <div>
                <div className="filters-wrapper">
                  <div className="section-title">
                    <div className="section-icon filter" />
                    <div className="section-title-label">Filters</div>
                    <div
                      className="description-icon"
                      data-tip="Filter out any trains going to destinations that you don't care about. These filters also
                      affect alerts and arrival predictions."
                    />
                  </div>
                  <div className="section-body">
                    {LINE_NAMES.map(name => (
                      <div
                        className={`toggle-wrapper line-toggle${
                          visibleRailLines.includes(name) ? ' active' : ''
                        }`}
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
                              visibleRailLines.includes(name)
                                ? 'visible'
                                : 'hidden'
                            }`}>
                            <Select
                              isMulti
                              styles={selectStyles}
                              placeholder={`All destinations...`}
                              value={selectedDestinationRailStations[name].map(
                                s => ({
                                  value: s,
                                  label: railStations.find(
                                    ({ Code }) => Code === s
                                  )['Name']
                                })
                              )}
                              closeOnSelect={false}
                              closeMenuOnSelect={false}
                              onSelectResetsInput={false}
                              formatGroupLabel={this.formatGroupLabel}
                              onChange={s =>
                                this.handleDestinationStationChange(name, s)
                              }
                              options={[
                                {
                                  label: 'Destination Stations',
                                  options: railStations
                                    .filter(
                                      ({
                                        LineCode1,
                                        LineCode2,
                                        LineCode3,
                                        Code
                                      }) =>
                                        [
                                          LineCode1,
                                          LineCode2,
                                          LineCode3
                                        ].includes(
                                          LINE_PROPERTIES[name]['code']
                                        ) &&
                                        LINE_PROPERTIES[name][
                                          'commonDestinationStationCodes'
                                        ].includes(Code)
                                    )
                                    .sort((a, b) =>
                                      a.Name.localeCompare(b.Name)
                                    )
                                    .map(({ Code, Name }) => ({
                                      value: Code,
                                      label: Name
                                    }))
                                } /*, // TODO; People find these super confusing... maybe better UI would help
                                {
                                  label: (
                                    <div>
                                      Other Destinations <br /> (Only relevant
                                      when there are station closures)
                                    </div>
                                  ),
                                  options: railStations
                                    .filter(
                                      ({
                                        LineCode1,
                                        LineCode2,
                                        LineCode3,
                                        Code
                                      }) =>
                                        [
                                          LineCode1,
                                          LineCode2,
                                          LineCode3
                                        ].includes(
                                          LINE_PROPERTIES[name]['code']
                                        ) &&
                                        !LINE_PROPERTIES[name][
                                          'commonDestinationStationCodes'
                                        ].includes(Code)
                                    )
                                    .sort((a, b) =>
                                      a.Name.localeCompare(b.Name)
                                    )
                                    .map(({ Code, Name }) => ({
                                      value: Code,
                                      label: Name
                                    }))
                                }*/
                              ]}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="section-title">
                    <div className="section-icon display-options" />
                    <div className="section-title-label">Display Options</div>
                  </div>
                  <div className="section-body">
                    <div className="toggle-wrapper">
                      <label>
                        <span className="toggle-label">Show Map Tiles</span>
                        <Toggle
                          icons={false}
                          className={`custom-toggle neutral`}
                          checked={showTiles}
                          onChange={() => this.props.setShowTiles(!showTiles)}
                        />
                      </label>
                    </div>
                    <div className="toggle-wrapper">
                      <label>
                        <span className="toggle-label">Dark Mode</span>
                        <Toggle
                          icons={false}
                          className={`custom-toggle neutral`}
                          checked={displayMode === DARK}
                          onChange={() =>
                            this.props.setDisplayMode(
                              displayMode === DARK ? LIGHT : DARK
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Collapsible>
            <Collapsible
              transitionTime={TRANSITION_TIME}
              trigger={
                <div className="menu-trigger-wrapper">
                  <div className="menu-icon about" />
                  <div className="menu-title">About</div>
                </div>
              }>
              <div className="section-title">
                <div className="section-icon attribution" />
                <div className="section-title-label">Attribution</div>
              </div>
              <div className="section-body description">
                Built and maintained with{' '}
                <span role="img" aria-label="heart">
                  ❤️
                </span>{' '}
                by James Collins. You can contact me at{' '}
                <b>james@dcmetromonitor.com</b>
              </div>
              <div className="section-title">
                <div className="section-icon faq" />
                <div className="section-title-label">FAQ</div>
              </div>
              <div className="section-body description">
                <ul className="faq-list">
                  <li className="question">1. Why does this exist?</li>
                  <li className="answer">
                    Other Metro tools shove so much stuff in your face that it's
                    difficult to parse out the information you care about. This
                    tool shows alerts, station arrival predictions and live
                    train positions on one screen while also letting you filter
                    out alerts, station arrival predictions and live train
                    positions that you don't care about.
                  </li>
                  <li className="question">
                    2. Where does the data come from?
                  </li>
                  <li className="answer">
                    WMATA gives developers access to a limited set of Metro
                    related data via their API which you can find{' '}
                    <a
                      href="https://developer.wmata.com/"
                      target="_blank"
                      rel="noopener noreferrer">
                      here
                    </a>. The live train positions come from an undocumented API
                    that is used by WMATA's version of this site which you can
                    take a look at{' '}
                    <a
                      href="https://gis.wmata.com/metrotrain/index.html"
                      target="_blank"
                      rel="noopener noreferrer">
                      here
                    </a>.
                  </li>
                  <li className="question">3. How accurate is the data?</li>
                  <li className="answer">
                    <span style={{ margin: '4px 0 4px 4px', display: 'block' }}>
                      ¯\_(ツ)_/¯
                    </span>
                    But seriously. I don't have access to anything other that
                    the very limited set of data WMATA lets developers get their
                    hands on. I make no guarantees about the accuracy of any
                    information on this site.
                  </li>
                  <li className="question">4. Is this project open-source?</li>
                  <li className="answer">
                    Yes! It's on{' '}
                    <a
                      rel="noopener noreferrer"
                      href="https://github.com/jbccollins/metro-monitor"
                      target="_blank">
                      Github
                    </a>
                  </li>
                </ul>
              </div>
              <div className="section-title">
                <div className="section-icon bugs" />
                <div className="section-title-label">Known Issues</div>
              </div>
              <div className="section-body description">
                <ul className="bugs-list">
                  <li>
                    Trains sometimes fly in from the middle of the Atlantic
                    Ocean
                  </li>
                  <li>Trains sometimes switch directions</li>
                  <li>Trains sometimes disappear and re-appear</li>
                  <li>
                    Prediction data for stations at the ends of lines is wonky
                  </li>
                </ul>
              </div>
            </Collapsible>
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
  selectedRailStations: state.selectedRailStations,
  displayMode: state.displayMode
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setVisibleRailLines,
      setSelectedDestinationRailStations,
      setSelectedRailStations,
      setShowTiles,
      setDisplayMode
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
