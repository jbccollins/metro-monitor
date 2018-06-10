import { fetchRailAlerts } from 'actions/metro';
import React from 'react';
import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './style.scss';

const KNOWN_ALERT_TYPES = ['Alert', 'Delay'];

const filterAffectedLines = linesAffected =>
  linesAffected.split(/;[\s]?/).filter(l => l !== '');
class RailAlert extends React.Component {
  render() {
    const {
      IncidentID,
      Description,
      IncidentType,
      LinesAffected,
      DateUpdated
    } = this.props;
    const affectedLines = filterAffectedLines(LinesAffected);
    const desc = Description.toLowerCase();
    const alert = {
      lines: LINE_NAMES.filter(l =>
        affectedLines.includes(LINE_PROPERTIES[l]['code'])
      )
    };

    return (
      <div className="RailAlert">
        <div className="alert-header">
          {KNOWN_ALERT_TYPES.includes(IncidentType) && (
            <div className={`alert-type-icon ${IncidentType.toLowerCase()}`} />
          )}
          <div className="alert-type">{IncidentType}</div>
          <div className="line-indicators">
            {alert.lines.map(line => (
              <div
                key={line}
                className="line-indicator"
                style={{
                  background: LINE_PROPERTIES[line]['color'],
                  color: LINE_PROPERTIES[line]['complementColor']
                }}>
                {LINE_PROPERTIES[line]['code']}
              </div>
            ))}
          </div>
          <div className="date">
            {'(' + moment(DateUpdated).fromNow() + ')'}
          </div>
        </div>
        <div className="description">{Description}</div>
      </div>
    );
  }
}

class RailAlerts extends React.Component {
  componentWillMount() {
    const { fetchRailAlerts } = this.props;
    fetchRailAlerts();
    setInterval(fetchRailAlerts, 12000);
  }

  render() {
    const { railAlerts } = this.props;
    return (
      <div className="RailAlerts">
        {railAlerts &&
          railAlerts.length > 0 &&
          railAlerts.map((alert, index) => (
            <RailAlert {...alert} key={alert['IncidentID']} index={index} />
          ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  railAlerts: state.railAlerts.railAlerts
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchRailAlerts
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RailAlerts);
