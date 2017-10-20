import React from 'react';
import { range } from 'lodash'

import { keyToDegree } from '../utils/KeyboardUtils';

import './Sequencer.css';

import LabeledKnob from './LabeledKnob';

class Sequencer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      degreeSettings: range(16).reduce((acc, index) => {
        return {
          ...acc,
          [index]: 0,
        };
      }, {}),
      activeSettings: range(16).reduce((acc, index) => {
        return {
          ...acc,
          [index]: false,
        };
      }, {}),
    };

    this.onKnobChanged = this.onKnobChanged.bind(this);
  }

  onKnobChanged(key, value) {
    const { onPatternChange } = this.props;
    this.setState(({ degreeSettings }) => ({
      degreeSettings: {
        ...degreeSettings,
        [key]: value,
      },
    }), () => onPatternChange(this.state));

  }

  onNoteSelected(degree, selected) {
    const { onPatternChange } = this.props;
    this.setState(({ activeSettings }) => ({
      activeSettings: {
        ...activeSettings,
        [degree]: selected,
      },
    }), () => onPatternChange(this.state));
  }

  render() {
    const { degreeSettings, activeSettings } = this.state;

    const noteDegrees = Object.values(keyToDegree);
    const minNoteDegree = Math.min(...noteDegrees);
    const maxNoteDegree = Math.max(...noteDegrees);

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
              config={degreeSettings}
            />
            <div>
              <input
                type="checkbox"
                value={activeSettings[i]}
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
