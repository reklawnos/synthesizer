import React, { Component } from 'react';
import './App.css';
import SynthContainer from './components/SynthContainer';


class App extends Component {
  render() {
    return (
      <div style={{ padding: 30 }}>
        <SynthContainer />
      </div>
    );
  }
}

export default App;
