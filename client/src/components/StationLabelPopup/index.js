import { Popup } from 'react-leaflet';

class StationLabelPopup extends Popup {
  componentDidMount() {
    super.componentDidMount();
    console.log('mount', this.leafletElement);
    this.leafletElement.openOn(this.props.map);
  }
}

export default StationLabelPopup;
