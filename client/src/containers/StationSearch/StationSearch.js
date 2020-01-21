import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useState } from 'react';
import './StationSearch.scss';
import { Dropdown } from 'semantic-ui-react'
import {
  DUPLICATE_STATION_CODES,
} from 'common/constants/lines';

const countryOptions = [
  { key: 'af', value: 'af', flag: 'af', text: 'Afghanistan' },
  { key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' },
  { key: 'al', value: 'al', flag: 'al', text: 'Albania' },
  { key: 'dz', value: 'dz', flag: 'dz', text: 'Algeria' },
  { key: 'as', value: 'as', flag: 'as', text: 'American Samoa' },
  { key: 'ad', value: 'ad', flag: 'ad', text: 'Andorra' },
  { key: 'ao', value: 'ao', flag: 'ao', text: 'Angola' },
  { key: 'ai', value: 'ai', flag: 'ai', text: 'Anguilla' },
  { key: 'ag', value: 'ag', flag: 'ag', text: 'Antigua' },
  { key: 'ar', value: 'ar', flag: 'ar', text: 'Argentina' },
  { key: 'am', value: 'am', flag: 'am', text: 'Armenia' },
  { key: 'aw', value: 'aw', flag: 'aw', text: 'Aruba' },
  { key: 'au', value: 'au', flag: 'au', text: 'Australia' },
  { key: 'at', value: 'at', flag: 'at', text: 'Austria' },
  { key: 'az', value: 'az', flag: 'az', text: 'Azerbaijan' },
  { key: 'bs', value: 'bs', flag: 'bs', text: 'Bahamas' },
  { key: 'bh', value: 'bh', flag: 'bh', text: 'Bahrain' },
  { key: 'bd', value: 'bd', flag: 'bd', text: 'Bangladesh' },
  { key: 'bb', value: 'bb', flag: 'bb', text: 'Barbados' },
  { key: 'by', value: 'by', flag: 'by', text: 'Belarus' },
  { key: 'be', value: 'be', flag: 'be', text: 'Belgium' },
  { key: 'bz', value: 'bz', flag: 'bz', text: 'Belize' },
  { key: 'bj', value: 'bj', flag: 'bj', text: 'Benin' },
]

const StationSearch = props => {
  const { railStations } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchButtonClick = () => {
    setIsOpen(!isOpen);
  }

  const stationDropdownOptions = railStations ?
    railStations.filter(({Code}) => !DUPLICATE_STATION_CODES.includes(Code))
                .sort(({Name: Name1}, {Name: Name2}) => Name1.localeCompare(Name2))
                .map((station, index) => {
      const { Code, Name } = station;
      return {
        key: Code,
        text: Name,
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
          <Dropdown
            placeholder='Select Country'
            fluid
            search
            selection
            options={stationDropdownOptions}
          />
        </div>
      }
    </div>
  );
}

export default StationSearch;