import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useState } from 'react';
import './StationSearch.scss';
import Select from 'react-select';
import {
  DUPLICATE_STATION_CODES,
} from 'common/constants/lines';
import {
  getStationCodesList
} from 'utilities/metro.js';
import { DARK } from 'common/constants/controls';
import {
  setSelectedRailStations,
  receiveRailPredictions,
} from 'actions/metro';

import { setMapPosition } from 'actions/persistence';

import PropTypes from 'prop-types';

const propTypes = {
  railStations: PropTypes.array,
};

const StationSearch = props => {
  const { railStations } = props;
  const [isOpen, setIsOpen] = useState(false);

  const getSelectStyles = () => {
    const { displayMode } = props;
    return({
      control: styles => ({
        ...styles,
        color: 'white',
        minHeight: '20px',
        backgroundColor: displayMode === DARK ? '#2b2b2b' : 'white',
        fontSize: '12px'
      }),
      input: styles => ({
        ...styles,
        color:  displayMode === DARK ? 'white' : 'black'
      }),
      option: styles => ({
        ...styles,
        color: 'black',
        minHeight: '20px',
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
    });
  }

  const handleSearchButtonClick = () => {
    setIsOpen(!isOpen);
  }

  const handleBlur = () => {
    setIsOpen(false);
  }

  const handleChange = ({ value: stationCode }) => {
    const {
      railStations,
      setSelectedRailStations,
      receiveRailPredictions
    } = props;
    const stationCodes = getStationCodesList(stationCode, railStations);
    //TODO: Is this null check necessary? Shouldn't the fetchRailPredictions safegaurds make this not so
    receiveRailPredictions(null);
    setSelectedRailStations(stationCodes);
    const station = railStations.find(({Code}) => Code === stationCode);
    props.leafletMapElt.flyTo(
      [station.Lat, station.Lon],
      15
    );
  }

  if (!railStations) {
    return false;
  }

  const stationDropdownOptions = railStations ?
    railStations.filter(({Code}) => !DUPLICATE_STATION_CODES.includes(Code))
                .sort(({Name: Name1}, {Name: Name2}) => Name1.localeCompare(Name2))
                .map((station, index) => {
      const { Code, Name } = station;
      return {
        key: Code,
        label: Name,
        value: Code,
      };
    }) : [];

  return (
    <div className="StationSearch">
      {!isOpen &&
        <label title="Find the nearest station to me">
          <div className="station-search-button" onClick={() => handleSearchButtonClick()}/>
        </label>
      }
      {isOpen &&
        <div className="station-search-dropdown-wrapper">
          <Select
            onBlur={handleBlur}
            autoFocus
            menuIsOpen
            styles={getSelectStyles()}
            menuPlacement="auto"
            placeholder={`Select a station`}
            onChange={s =>
              handleChange(s)
            }
            options={stationDropdownOptions} />
        </div>
      }
    </div>
  );
}

StationSearch.propTypes = propTypes;

const mapStateToProps = state => ({
  railStations: state.railStations.railStations,
  displayMode: state.displayMode,
  leafletMapElt: state.leafletMapElt,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSelectedRailStations,
      receiveRailPredictions,
      setMapPosition,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StationSearch);
