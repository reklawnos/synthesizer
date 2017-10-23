import React from 'react';
import { pull } from 'lodash';
import './Keyboard.css';
import {
  keyToPosition,
  keyToDegree,
} from '../utils/KeyboardUtils';

class Keyboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keysHeld: [],
      sequencedNote: null,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.onKeyDown);
    document.body.addEventListener('keyup', this.onKeyUp);

    const doFrame = () => {
      this.setState(({ sequencedNote }) => {
        const { getCurrentTime, tempo, pattern } = this.props;
        const secondsPerBeat = (60 / (tempo * 4));
        const currentBeatIndex = Math.floor(getCurrentTime() / secondsPerBeat) % 16;

        const currentNote = pattern.activeSettings[currentBeatIndex]
          ? (pattern.degreeSettings[currentBeatIndex] || 0)
          : null;

        if (sequencedNote === currentNote) {
          return null;
        }

        return { sequencedNote: currentNote };
      });
      this.animationFrame = requestAnimationFrame(doFrame);
    };

    doFrame();
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeyDown);
    document.body.removeEventListener('keyup', this.onKeyUp);

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  onKeyDown(e) {
    this.setState(({ keysHeld }) => {
      if (!keysHeld.includes(e.key) && e.key in keyToPosition) {
        return {
          keysHeld: [
            ...keysHeld,
            e.key,
          ],
        };
      }
    });
  }

  onKeyUp(e) {
    this.setState(({ keysHeld }) => {
      return {
        keysHeld: pull(keysHeld, e.key),
      };
    });
  }

  render() {
    const { keysHeld, sequencedNote } = this.state;
    const whiteKeys = Object.entries(keyToPosition)
      .filter(([key, position]) => position % 1 === 0)
      .sort(([, positionA], [, positionB]) => positionA - positionB);
    const blackKeys = Object.entries(keyToPosition)
      .filter(([key, position]) => position % 1 !== 0)
      .sort(([, positionA], [, positionB]) => positionA - positionB);

    return (
      <div style={{ height: 70, position: 'relative', padding: 10 }}>
        <div>
          {blackKeys.map(([key, position]) => {
            let className = 'key key--black';
            if (keysHeld.includes(key)) {
              className += ' key--pressed';
            } else if (sequencedNote === keyToDegree[key]) {
              className += ' key--sequenced';
            }

            return (
              <div
                key={key}
                className={className}
                style={{
                  position: 'absolute',
                  left: position * 45,
                }}
              >
                {key}
              </div>
            );
          })}
        </div>
        <div style={{ paddingTop: 35 }}>
          {whiteKeys.map(([key, position]) => {
            let className = 'key key--white';
            if (keysHeld.includes(key)) {
              className += ' key--pressed';
            } else if (sequencedNote === keyToDegree[key]) {
              className += ' key--sequenced';
            }
            return (
              <div
                key={key}
                className={className}
                style={{
                  position: 'absolute',
                  left: position * 45,
                }}
              >
                {key}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Keyboard;
