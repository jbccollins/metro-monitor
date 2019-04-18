import React from 'react';
import { Popup } from 'react-leaflet';
import './style.scss';

class TrainPopup extends React.Component {
  state = {
    open: false
  };
  handlePopupOpen = () => {
    this.setState({
      open: true
    });
  };
  handlePopupClose = () => {
    this.setState({
      open: false
    });
  };
  render() {
    const openClass = this.state.open ? 'open' : 'closed';
    return (
      <Popup
        {...this.props}
        className={`${
          this.props.className
            ? this.props.className + ' ' + openClass
            : openClass
        }`}
        onOpen={this.handlePopupOpen}
        onClose={this.handlePopupClose}
      />
    );
  }
}

export default TrainPopup;
