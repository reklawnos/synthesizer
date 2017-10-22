import React from 'react';
import { range } from 'lodash'

import { keyToDegree } from '../utils/KeyboardUtils';

import './Sequencer.css';

import LabeledKnob from './LabeledKnob';

const noteDegrees = Object.values(keyToDegree);
const minNoteDegree = Math.min(...noteDegrees);
const maxNoteDegree = Math.max(...noteDegrees);

class Sequencer extends React.Component {
  constructor(props) {
    super(props);

    this.onKnobChanged = this.onKnobChanged.bind(this);
  }

  onKnobChanged(key, value) {
    const { onNoteDegreeChange } = this.props;
    onNoteDegreeChange(key, value);
  }

  onNoteSelected(degree, selected) {
    const { onNoteActiveChange } = this.props;
    onNoteActiveChange(degree, selected);
  }

  render() {
    const {
      pattern: {
        degreeSettings,
        activeSettings,
      },
    } = this.props;

    const mergedDegreeSettings = {
      ...range(16).reduce((acc, i) => ({
        ...acc,
        [i]: 0,
      }), {}),
      ...degreeSettings,
    };

    return (
      <div className="sequencer__container">
        {range(16).map(i => (
          <div key={i} className="sequencer-note">
            <LabeledKnob
              label=""
              valueKey={i}
              min={minNoteDegree}
              max={maxNoteDegree}
              step={1}
              onChange={this.onKnobChanged}
              config={mergedDegreeSettings}
            />
            <div>
              <input
                type="checkbox"
                checked={activeSettings[i]}
                onChange={(e) => this.onNoteSelected(i, e.target.checked)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Sequencer;
