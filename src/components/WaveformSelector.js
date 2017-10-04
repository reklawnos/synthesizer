import React from 'react';

function WaveformSelector({
  value,
  onChange,
}) {

  return (
    <select
      value={value}
      onChange={(e) => {
        onChange(e.target.options[e.target.selectedIndex].value);
      }}
    >
      <option value="sine">Sine</option>
      <option value="triangle">Triangle</option>
      <option value="square">Square</option>
      <option value="sawtooth">Sawtooth</option>
    </select>
  );
}

export default WaveformSelector;
