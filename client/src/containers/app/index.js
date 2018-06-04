import React from 'react';
import { Route } from 'react-router-dom';
import MetroMap from 'containers/MetroMap';

const App = () => (
  <div>
    <main>
      <Route exact path="/" component={MetroMap} />
    </main>
  </div>
);

export default App;
