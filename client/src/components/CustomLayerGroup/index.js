import { LayerGroup } from 'react-leaflet';

class CustomLayerGroup extends LayerGroup {
  componentDidMount() {
    const { onReady } = this.props;
    super.componentDidMount();
    if (onReady) {
      onReady(this.leafletElement);
    }
  }
}

export default CustomLayerGroup;
