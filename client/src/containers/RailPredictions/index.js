import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './style.scss';
import { fetchRailPredictions, setSelectedRailStations } from 'actions/metro';
import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';

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
      railStations
    } = this.props;
    let name = '';
    if (railStations && selectedRailStations) {
      name = railStations.find(({ Code }) => Code === selectedRailStations[0])
        .Name;
    }
    const groups = railPredictions
      ? Object.keys(railPredictions).sort(g => g)
      : [];
    return (
      <div className="RailPredictions">
        {(railPredictions || fetching) && (
          <div className="predictions-container">
            <div className="station-name">{name}</div>
            <div
              className="close-button"
              onClick={() => {
                this.props.setSelectedRailStations(null);
              }}
            />
            <div className="table-header">
              <div className="line-cell cell">Line</div>
              <div className="destination-cell cell">Destination</div>
              <div className="minutes-cell cell">Minutes</div>
              <div className="car-cell cell">Cars</div>
            </div>
            <div className="table-body">
              {fetching && !railPredictions && <div>loading</div>}
              {(!fetching || railPredictions) && (
                <div>
                  {groups.map((g, groupIndex) => {
                    return railPredictions[g].map(
                      ({ Car, Destination, Line, Min }, index) => {
                        const line = LINE_NAMES.find(
                          l => LINE_PROPERTIES[l]['code'] === Line
                        );
                        if (!line) {
                          return false;
                        }
                        return (
                          <div
                            //key={`${g}-${index}`}
                            key={Math.random()}
                            className={`table-row${
                              index === 0 && groupIndex > 0 ? ' first-row' : ''
                            }`}>
                            <div className="line-cell cell">
                              <div
                                className="line-indicator"
                                style={{
                                  background: LINE_PROPERTIES[line]['color'],
                                  color:
                                    LINE_PROPERTIES[line]['complementColor']
                                }}>
                                {/*LINE_PROPERTIES[line]['code']*/}
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

const mapStateToProps = state => ({
  railPredictionsState: state.railPredictions,
  railStations: state.railStations.railStations,
  selectedRailStations: state.selectedRailStations
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
