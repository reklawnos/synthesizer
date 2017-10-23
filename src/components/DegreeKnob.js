import React from 'react';
import './DegreeKnob.css';

import { degreeToNote } from '../utils/KeyboardUtils';


import Knob from './Knob';

const defaultProps = {
  min: 0,
  max: 1,
  step: 'any',
};

function DegreeKnob({
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
      <Knob
        min={min}
        max={max}
        step={step}
        value={config[valueKey]}
        onChange={(value) => onChange(valueKey, value)}
      />
      <div className="degree-knob__value">
        {degreeToNote[config[valueKey]]}
      </div>
    </div>
  );
}

DegreeKnob.defaultProps = defaultProps;

export default DegreeKnob;
