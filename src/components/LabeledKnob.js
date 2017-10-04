import React from 'react';
import './LabeledKnob.css';

import Knob from './Knob';

const defaultProps = {
  min: 0,
  max: 1,
  step: 'any',
};

function LabeledKnob({
  label,
  min,
  max,
  step,
  valueKey,
  config,
  onChange,
}) {
  return (
    <div>
      <div className="labeled-knob__label">
        {label}
      </div>
      <Knob
        min={min}
        max={max}
        step={step}
        value={config[valueKey]}
        onChange={(value) => onChange(valueKey, value)}
      />
      <div className="labeled-knob__value">
        {Number(config[valueKey]).toFixed(1)}
      </div>
    </div>
  );
}

LabeledKnob.defaultProps = defaultProps;

export default LabeledKnob;
