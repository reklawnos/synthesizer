import React from 'react';
import './Knob.css';

const KNOB_RANGE_DEGREES = 270;
const KNOB_START_DEGREES = -1 * (360 - KNOB_RANGE_DEGREES) / 2;

const SLIDER_WIDTH_PX = 250;

const defaultProps = {
  min: 0,
  max: 1,
};

class Knob extends React.Component {
  constructor(props) {
    super(props);

    const {
      min,
      max,
      value,
    } = props;

    this.state = {
      hideOverflow: true,
      inputTranslationFraction: (value - min) / (max - min),
    };
  }


  render() {
    const {
      min,
      max,
      value,
      onChange,
    } = this.props;

    const {
      hideOverflow,
    } = this.state;

    const { inputTranslationFraction } = this.state;

    const rotationFraction = (value - min) / (max - min);
    const rotationDegrees = KNOB_START_DEGREES + KNOB_RANGE_DEGREES * rotationFraction;

    return (
      <div
        className="knob__container"
        style={{
          overflow: hideOverflow ? 'hidden' : 'visible',
        }}
      >
        <div
          className="knob__spinner"
          style={{
            transform: `rotate(${rotationDegrees}deg)`
          }}
        >
          <div className="knob__marker"></div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step="any"
          value={value}
          onChange={(e) => { onChange(e.target.value); }}
          onMouseDown={() => {
            this.setState({
              hideOverflow: false,
            });
          }}
          onMouseUp={() => {
            this.setState({
              hideOverflow: true,
              inputTranslationFraction: rotationFraction
            });
          }}
          className="knob__input"
          style={{
            transform: `translate(${-inputTranslationFraction * SLIDER_WIDTH_PX}px, 0)`,
          }}
        />
      </div>
    );
  }
}

Knob.defaultProps = defaultProps;

export default Knob;
