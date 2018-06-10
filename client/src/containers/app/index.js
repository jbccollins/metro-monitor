import React from 'react';
import MetroMap from 'containers/MetroMap';
import RailAlerts from 'containers/RailAlerts';
import SideMenu from 'containers/SideMenu';

const App = () => (
  <div>
    <main>
      <SideMenu />
      <MetroMap />
      <RailAlerts />
    </main>
  </div>
);

export default App;
