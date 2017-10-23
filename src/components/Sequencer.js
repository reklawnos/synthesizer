import React from 'react';
import { range } from 'lodash'

import { keyToDegree } from '../utils/KeyboardUtils';

import './Sequencer.css';

import DegreeKnob from './DegreeKnob';

const noteDegrees = Object.values(keyToDegree);
const minNoteDegree = Math.min(...noteDegrees);
const maxNoteDegree = Math.max(...noteDegrees);

class Sequencer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      beatIndex: 0,
    };

    this.onKnobChanged = this.onKnobChanged.bind(this);
  }

  componentDidMount() {
    const { getCurrentTime, tempo } = this.props;
    const doFrame = () => {
      this.setState(({ beatIndex }) => {
        const secondsPerBeat = (60 / (tempo * 4));
        const currentBeatIndex = Math.floor(getCurrentTime() / secondsPerBeat) % 16;
        if (currentBeatIndex === beatIndex) {
          return null;
        }

        return { beatIndex: currentBeatIndex };
      });
      this.animationFrame = requestAnimationFrame(doFrame);
    };

    doFrame();
  }

  componentWillUnmount() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
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

    const { beatIndex } = this.state;

    const mergedDegreeSettings = {
      ...range(16).reduce((acc, i) => ({
        ...acc,
        [i]: 0,
      }), {}),
      ...degreeSettings,
    };

    return (
      <div className="sequencer__container">
        {range(16).map(i => {
          const wrapperClasses = 'sequencer-note' + (beatIndex === i ? ' sequencer-note--current' : '');
          return (
            <div key={i} className={wrapperClasses}>
              <DegreeKnob
                valueKey={i}
                min={minNoteDegree}
                max={maxNoteDegree}
                step={1}
                onChange={this.onKnobChanged}
                config={mergedDegreeSettings}
              />
              <div>
                <input
                  id={`note-active-${i}`}
                  className="sequencer-note__checkbox"
                  type="checkbox"
                  checked={Boolean(activeSettings[i])}
                  onChange={(e) => this.onNoteSelected(i, e.target.checked)}
                />
                <label
                  htmlFor={`note-active-${i}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Sequencer;
