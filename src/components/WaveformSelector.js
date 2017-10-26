import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './WaveformSelector.css';
import SineWaveIcon from './icon/SineWaveIcon';
import TriangleWaveIcon from './icon/TriangleWaveIcon';
import SquareWaveIcon from './icon/SquareWaveIcon';
import SawtoothWaveIcon from './icon/SawtoothWaveIcon';

const options = [
  { value: 'sine', label: <span><SineWaveIcon />Sine</span> },
  { value: 'triangle', label: <span><TriangleWaveIcon />Triangle</span> },
  { value: 'square', label: <span><SquareWaveIcon />Square</span> },
  { value: 'sawtooth', label: <span><SawtoothWaveIcon />Sawtooth</span> },
];


function WaveformSelector({
  value,
  onChange,
}) {
  return (
    <Select
      className="waveform-selector"
      options={options}
      value={value}
      onChange={({ value }) => onChange(value)}
      clearable={false}
      searchable={false}
    />
  );
}

export default WaveformSelector;
