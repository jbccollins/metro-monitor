// import React from 'react';
// import { Marker as LeafletMarker } from 'leaflet';
// import { LeafletProvider, withLeaflet, MapLayer, Marker } from 'react-leaflet';
// import 'leaflet-rotatedmarker';

// class AnimatedMarker extends React.Component {
//   render() {
//     return (
//       <Marker {...this.props}/>
//     );
//   }
// }

// export default AnimatedMarker;


//https://github.com/verdie-g/react-leaflet-rotatedmarker/issues/1
import React from 'react';
import { Marker as LeafletMarker } from 'leaflet';
import { LeafletProvider, withLeaflet, MapLayer } from 'react-leaflet';
import 'leaflet-rotatedmarker';

class RotatedMarker extends MapLayer {
  static defaultProps = {
    rotationOrigin: 'center',
  };

  createLeafletElement(props) {
    const el = new LeafletMarker(props.position, this.getOptions(props));
    this.contextValue = { ...props.leaflet, popupContainer: el };
    return el;
  }

  updateLeafletElement(fromProps, toProps) {
    if (toProps.position !== fromProps.position) {
      this.leafletElement.setLatLng(toProps.position);
    }
    if (toProps.icon !== fromProps.icon) {
      this.leafletElement.setIcon(toProps.icon);
    }
    if (toProps.zIndexOffset !== fromProps.zIndexOffset) {
      this.leafletElement.setZIndexOffset(toProps.zIndexOffset);
    }
    if (toProps.opacity !== fromProps.opacity) {
      this.leafletElement.setOpacity(toProps.opacity);
    }
    if (toProps.draggable !== fromProps.draggable) {
      if (toProps.draggable === true) {
        this.leafletElement.dragging.enable();
      } else {
        this.leafletElement.dragging.disable();
      }
    }
    if (toProps.rotationAngle !== fromProps.rotationAngle) {
      this.leafletElement.setRotationAngle(toProps.rotationAngle);
    }
    if (toProps.rotationOrigin !== fromProps.rotationOrigin) {
      this.leafletElement.setRotationOrigin(toProps.rotationOrigin);
    }
  }

  render() {
    const { children } = this.props;
    return children == null || this.contextValue == null ? null : (
      <LeafletProvider value={this.contextValue}>{children}</LeafletProvider>
    );
  }
}

//export default withLeaflet(RotatedMarker);



const ANIMATION_STYLE = 'transform 1s';

// const translate3dRegex = /translate3d\(.*\)/;
class AnimatedMarker extends RotatedMarker {
  componentDidMount() {
    super.componentDidMount();
    this.leafletElement._icon.style.transition = ANIMATION_STYLE;
    this.leafletElement._map.on('zoomstart', this.handleZoomStart);
    this.leafletElement._map.on('zoomend', this.handleZoomEnd);
  }

  handleZoomStart = () => {
    if (this.leafletElement._icon) {
      this.leafletElement._icon.style.transition = '';
    }
  };

  handleZoomEnd = () => {
    if (this.leafletElement._icon) {
      this.leafletElement._icon.style.transition = ANIMATION_STYLE;
    }
  };
}

export default withLeaflet(AnimatedMarker);

// export default AnimatedMarker;
