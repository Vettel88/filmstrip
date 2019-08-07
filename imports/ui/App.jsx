import React from 'react';
import Hello from './components/Hello.jsx';
import Info from './components/Info.jsx';
import QueuesList from './components/QueuesList.jsx';

const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello />
    <Info />
    <QueuesList />
  </div>
);

export default App;
