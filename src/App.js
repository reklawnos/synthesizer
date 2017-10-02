import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Knob from './components/Knob';

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
      <div style={{ padding: 300 }}>
        <Knob
          value={value}
          onChange={(value) => {
            this.setState({
              value,
            });
          }}
        />
      </div>
    );
  }
}

export default App;
