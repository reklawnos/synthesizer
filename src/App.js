import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LabeledKnob from './components/LabeledKnob';
import SynthContainer from './components/SynthContainer';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };
  }

  render() {
    const { value } = this.state;
    return (
      <div style={{ padding: 30 }}>
        <SynthContainer />
      </div>
    );
  }
}

export default App;
