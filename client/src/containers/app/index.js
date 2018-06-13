import React from 'react';
import MetroMap from 'containers/MetroMap';
import RailAlerts from 'containers/RailAlerts';
import SideMenu from 'containers/SideMenu';
import RailPredictions from 'containers/RailPredictions';

const App = () => (
  <div>
    <main>
      <SideMenu />
      <MetroMap />
      <RailAlerts />
      <RailPredictions />
    </main>
  </div>
);

export default App;
