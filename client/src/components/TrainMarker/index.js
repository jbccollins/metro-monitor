import React from 'react';
import L from 'leaflet';
import AnimatedMarker from 'components/AnimatedMarker';
import './style.scss';

class TrainMarker extends React.Component {
  render() {
    const { children, color, ...rest } = this.props;
    return (
      <AnimatedMarker
        icon={L.divIcon({
          className: `TrainMarker ${color}`,
          iconSize: [8, 20]
        })}
        {...rest}>
        {children}
      </AnimatedMarker>
    );
  }
}

export default TrainMarker;
