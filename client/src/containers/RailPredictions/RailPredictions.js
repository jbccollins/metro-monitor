import React from 'react';
import PropTypes from "prop-types";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './RailPredictions.scss';
import { fetchRailPredictions, setSelectedRailStations } from 'actions/metro';
import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';
import StationSearch from 'containers/StationSearch';

class RailPredictions extends React.Component {
  state = {
    stationRefreshInterval: null
  };

  componentWillReceiveProps(nextProps) {
    const { selectedRailStations, fetchRailPredictions } = nextProps;
    if (!selectedRailStations) {
      clearInterval(this.state.stationRefreshInterval);
      this.setState({ stationRefreshInterval: null });
    } else if (selectedRailStations !== this.props.selectedRailStations) {
      clearInterval(this.state.stationRefreshInterval);
      fetchRailPredictions(selectedRailStations);
      this.setState({
        stationRefreshInterval: setInterval(
          () => fetchRailPredictions(selectedRailStations),
          5000
        )
      });
    }
  }

  render() {
    const {
      railPredictionsState: { railPredictions, fetching },
      selectedRailStations,
      railStations,
      visibleRailLines,
      selectedDestinationRailStations,
      activeOutages,
    } = this.props;
    let name = '';
    if (railStations && selectedRailStations) {
      name = railStations.find(({ Code }) => Code === selectedRailStations[0])
        .Name;
    }
    const groups = railPredictions
      ? Object.keys(railPredictions['groups']).sort((a, b) =>
          a.localeCompare(b)
        )
      : [];

    const selectedRailLineCodes = visibleRailLines.map(
      l => LINE_PROPERTIES[l]['code']
    );
    return (
      <div className="RailPredictions">
        {!(railPredictions || fetching) &&
          <StationSearch />
        }
        {(railPredictions || fetching) && (
          <div className="predictions-container">
            <label title={name}>
              <div className="station-name">{name}</div>
            </label>
            <div
              className="close-button"
              onClick={() => {
                this.props.setSelectedRailStations(null);
              }}
            />
            {activeOutages && activeOutages.length > 0 && false &&
              <div>
                <div className="section-header">Outages:</div>
                <div className="outages-list">
                  {activeOutages.map(({LocationDescription, SymptomDescription, UnitType, DateOutOfServ, DateUpdated, EstimatedReturnToService, UnitName}) => {
                    return (
                      <div className="outages-list-item" key={UnitName}>
                        <div className="item-type">
                          <span className="item-label">Type:</span>{UnitType}
                        </div>
                        <div className="item-description">
                          <span className="item-label">Description:</span>{SymptomDescription}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
            {activeOutages && activeOutages.length > 0 && false &&
              <div className="section-header">Next Trains:</div>
            }
            <div className="table-header">
              <div className="line-cell cell">Line</div>
              <div className="destination-cell cell">Destination</div>
              <div className="minutes-cell cell">Minutes</div>
              <div className="car-cell cell">Cars</div>
            </div>
            <div className="table-body">
              {fetching &&
                !railPredictions && <div className="loading">Loading...</div>}
              {(!fetching || railPredictions) && (
                <div>
                  {groups.map(g => {
                    // TODO: Find a better way to fix https://github.com/jbccollins/metro-monitor/issues/51
                    let indexOffset = 0;
                    return railPredictions['groups'][g].map(
                      (
                        { Car, Destination, DestinationCode, Line, Min },
                        index
                      ) => {
                        const line = LINE_NAMES.find(
                          l => LINE_PROPERTIES[l]['code'] === Line
                        );
                        if (
                          !line ||
                          !selectedRailLineCodes.includes(Line) ||
                          (selectedDestinationRailStations[line].length > 0 &&
                            !selectedDestinationRailStations[line].includes(
                              DestinationCode
                            ))
                        ) {
                          indexOffset++;
                          return false;
                        }
                        return (
                          <div
                            key={`${g}-${index}`}
                            className={`table-row${
                              index === indexOffset ? ' first-row' : ''
                            }`}>
                            <div className="line-cell cell">
                              <div
                                className="line-indicator"
                                style={{
                                  background: LINE_PROPERTIES[line]['color'],
                                  color:
                                    LINE_PROPERTIES[line]['complementColor']
                                }}>
                                {LINE_PROPERTIES[line]['code']}
                              </div>
                            </div>
                            <div className="destination-cell cell">
                              {Destination}
                            </div>
                            <div className="minutes-cell cell">
                              {Min === '' ? '---' : Min}
                            </div>
                            <div className="car-cell cell">{Car}</div>
                          </div>
                        );
                      }
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

RailPredictions.propTypes = {
  activeOutages: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  railPredictionsState: state.railPredictions,
  railStations: state.railStations.railStations,
  selectedRailStations: state.selectedRailStations,
  visibleRailLines: state.visibleRailLines,
  selectedDestinationRailStations: state.selectedDestinationRailStations
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchRailPredictions,
      setSelectedRailStations
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RailPredictions);
