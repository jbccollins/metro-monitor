import React from 'react';
import L from 'leaflet';
import AnimatedMarker from 'components/AnimatedMarker';
import './style.scss';

class TrainMarker extends React.Component {
  render() {
    const { children, color, direction, borderColor, ...rest } = this.props;
    return (
      <AnimatedMarker
        icon={L.divIcon({
          className: `TrainMarker ${color}`,
          iconSize: [12, 12],
          //html: `<div class='${direction}'/>`
          html: `<svg width="100%" viewbox="0 0 30 42" ${
            direction === 'backward' ? 'transform="rotate(180)"' : ''
          }>
                  <path fill="${color}" stroke="${borderColor}" stroke-width="2"
                        d="M15 3
                          Q16.5 6.8 25 18
                          A12.8 12.8 0 1 1 5 18
                          Q13.5 6.8 15 3z" />
                </svg>`
        })}
        {...rest}>
        {children}
      </AnimatedMarker>
    );
  }
}

export default TrainMarker;
