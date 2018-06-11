import { fetchRailAlerts } from 'actions/metro';
import React from 'react';
import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './style.scss';
import ReactDOMServer from 'react-dom/server';
const KNOWN_ALERT_TYPES = ['Alert', 'Delay'];

const PHRASES = [];

LINE_NAMES.forEach(n => {
  PHRASES.push({
    phrase: `${n} line`,
    style: { backgroundColor: LINE_PROPERTIES[n]['color'] }
  });
  PHRASES.push({
    phrase: n,
    style: { backgroundColor: LINE_PROPERTIES[n]['color'] }
  });
});

const getAffectedLineCodes = linesAffected =>
  linesAffected.split(/;[\s]?/).filter(l => l !== '');

class RailAlert extends React.Component {
  state = {
    htmlDescription: ''
  };

  componentWillMount() {
    const { Description } = this.props;
    let htmlDescription = Description;
    PHRASES.forEach(({ phrase, style }) => {
      htmlDescription = htmlDescription.replace(
        new RegExp(phrase, 'gi'),
        ReactDOMServer.renderToStaticMarkup(<span style={style}>{phrase}</span>)
      );
    });
    this.setState({ htmlDescription });
  }

  getIndicesOf = (searchStr, str, caseSensitive) => {
    const searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
      return [];
    }
    let startIndex = 0;
    let index = 0;
    const indices = [];
    if (!caseSensitive) {
      str = str.toLowerCase();
      searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      startIndex = index + searchStrLen;
      indices.push([index, startIndex]);
    }
    return indices;
  };

  render() {
    const {
      IncidentID,
      Description,
      IncidentType,
      LinesAffected,
      DateUpdated
    } = this.props;
    const { htmlDescription } = this.state;
    const affectedLines = getAffectedLineCodes(LinesAffected);
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
        {/* <div dangerouslySetInnerHTML={{ __html: htmlDescription }} className="description"/> */}
        <div className="description">{Description}</div>
      </div>
    );
  }
}

class RailAlerts extends React.Component {
  state = {
    expanded: false,
    manuallyControlled: false, //has the user interacted with the alerts button?
    hasNewUnreadAlerts: false
  };
  componentWillMount() {
    const { fetchRailAlerts } = this.props;
    fetchRailAlerts();
    setInterval(fetchRailAlerts, 12000);
  }

  componentWillReceiveProps(nextProps) {
    const { railAlerts } = nextProps;
    const { manuallyControlled, expanded, hasNewUnreadAlerts } = this.state;
    if (!railAlerts || railAlerts.length === 0) {
      this.setState({ hasNewUnreadAlerts: false });
    } else if (!manuallyControlled && railAlerts !== this.props.railAlerts) {
      this.setState({ expanded: true });
    } else if (
      railAlerts !== this.props.railAlerts &&
      !expanded &&
      !hasNewUnreadAlerts
    ) {
      const newAlertIDs = railAlerts.map(({ IncidentID }) => IncidentID);
      const oldAlertIDs = this.props.railAlerts.map(
        ({ IncidentID }) => IncidentID
      );
      this.setState({
        hasNewUnreadAlerts: !newAlertIDs.every(a => oldAlertIDs.includes(a))
      });
    }
  }

  render() {
    const { railAlerts } = this.props;
    const { expanded, hasNewUnreadAlerts } = this.state;

    return (
      <div className="RailAlerts">
        <div>
          <div
            className={`expand-button${expanded ? ' expanded' : ' closed'}`}
            onClick={() =>
              this.setState({
                expanded: !expanded,
                manuallyControlled: true,
                hasNewUnreadAlerts: false
              })
            }
          />
          <div
            className="alerts-container"
            style={{
              maxHeight: expanded ? '' : '0px',
              width: expanded ? '' : '0px'
            }}>
            {railAlerts &&
              railAlerts.length > 0 &&
              railAlerts.map((alert, index) => (
                <RailAlert {...alert} key={alert['IncidentID']} />
              ))}
            {(!railAlerts || railAlerts.length === 0) && (
              <div className="no-alerts">
                WMATA is not reporting any problems at this time :)
              </div>
            )}
          </div>
          <div
            className={`expand-button-shadow${
              hasNewUnreadAlerts ? ' new-alerts' : ''
            }`}
          />
        </div>
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
