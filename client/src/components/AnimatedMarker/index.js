import { Marker } from 'react-leaflet';
import RotatedMarker from 'react-leaflet-rotatedmarker';

const ANIMATION_STYLE = 'transform 1s';

const translate3dRegex = /translate3d\(.*\)/;
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

export default AnimatedMarker;
