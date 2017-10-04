import React from 'react';
import { pull } from 'lodash';
import './Keyboard.css';
import {
  keyToPosition,
} from '../utils/KeyboardUtils';

class Keyboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keysHeld: [],
    };
  }

  componentDidMount() {
    document.body.addEventListener('keydown', (e) => {
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
    });

    document.body.addEventListener('keyup', (e) => {
      this.setState(({ keysHeld }) => {
        return {
          keysHeld: pull(keysHeld, e.key),
        };
      });
    });
  }

  render() {
    const { keysHeld } = this.state;
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
