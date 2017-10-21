import React from 'react';
import * as qs from 'qs';
import { debounce } from 'lodash';

import LabeledKnob from './LabeledKnob';
import WaveformSelector from './WaveformSelector';
import Keyboard from './Keyboard';
import Sequencer from './Sequencer';
import Oscilloscope from './Oscilloscope';

import {
  keyToDegree,
  getDegreeForKey,
  degreeToFrequency,
} from '../utils/KeyboardUtils';

import createSynthesizer, { defaultConfig } from '../Synthesizer';

function convertToNumericConfig(config) {
  const res = Object.entries(config).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: isNaN(value) ? value : Number(value),
    };
  }, {});
  return res;
}

class SynthContainer extends React.Component {
  constructor(props) {
    super(props);

    const queryString = window.location.search.slice(1);
    const synthConfig = {
      ...defaultConfig,
      ...convertToNumericConfig(qs.parse(queryString)),
    };

    const audioCtx = new AudioContext();

    this.synthesizer = createSynthesizer(synthConfig, audioCtx);

    this.keysHeld = [];
    this.keyIsHeld = false;

    this.audioCtx = audioCtx;

    this.state = {
      synthConfig,
      vco1Freq: 440,
      vco2Freq: 440,
    };

    this.onConfigChange = this.onConfigChange.bind(this);
    this.onPatternChange = this.onPatternChange.bind(this);
    this.pushHistoryUpdateDebounced = debounce(
      this.pushHistoryUpdate.bind(this),
      1000,
      { trailing: true },
    );
  }

  componentDidMount() {
    document.body.addEventListener('keydown', (e) => {
      if (!this.keysHeld.includes(e.key) && e.key in keyToDegree) {
        this.keysHeld.push(e.key);
      }
      this.onKeysChanged();
    });

    document.body.addEventListener('keyup', (e) => {
      this.keysHeld.splice(this.keysHeld.indexOf(e.key), 1);
      this.onKeysChanged();
    });

    window.addEventListener('popstate', (e) => {
      const queryString = window.location.search.slice(1);
      const synthConfig = {
        ...defaultConfig,
        ...convertToNumericConfig(qs.parse(queryString)),
      };

      this.synthesizer.updateConfig(synthConfig);
      this.setState({ synthConfig });
    });

    this.pattern = {
      activeSettings: {},
      degreeSettings: {},
    };

    const tempo = 100;
    const NOTE_SCHEDULING_INTERVAL_MS = 100;
    const NOTE_SCHEDULING_RANGE_MS = 150;

    this.lastScheduledTime = -1;

    const scheduleNotes = () => {
      const startTime = this.audioCtx.currentTime;
      const endTime = startTime + NOTE_SCHEDULING_RANGE_MS / 1000;

      const secondsPerBeat = (60 / (tempo * 4));

      let nextAttackIndex = Math.ceil(this.audioCtx.currentTime / secondsPerBeat);

      const attacks = [];

      while (nextAttackIndex * secondsPerBeat < endTime) {
        if (this.pattern.activeSettings[nextAttackIndex % 16]) {
          attacks.push([nextAttackIndex, this.pattern.degreeSettings[nextAttackIndex % 16]]);
        }
        nextAttackIndex += 1;
      }

      attacks.forEach(([attackIndex, degree]) => {
        this.scheduleAttack({ startTime, endTime, nextAttackTime: attackIndex * secondsPerBeat, timeToRelease: secondsPerBeat * 0.9, degree });
      });

      this.lastScheduledTime = endTime;

      setTimeout(scheduleNotes, NOTE_SCHEDULING_INTERVAL_MS);
    };

    setTimeout(scheduleNotes, NOTE_SCHEDULING_INTERVAL_MS);
  }

  scheduleAttack({
    startTime,
    endTime,
    nextAttackTime,
    timeToRelease,
    degree,
  }) {
    if (
      nextAttackTime > startTime &&
      nextAttackTime < endTime &&
      nextAttackTime > this.lastScheduledTime
    ) {
      if (this.keysHeld.length < 1) {
        const frequency = degreeToFrequency(degree);

        this.synthesizer.setVcoFrequencyAtTime(frequency, nextAttackTime);
      }

      this.synthesizer.scheduleAttackAtTime(nextAttackTime);

      // Also do release, since we already know when it's going to be and there
      // won't be another attack between this one and the release
      // TODO: this will need to be changed at some point as this ^^^ shouldn't be guaranteed
      this.synthesizer.scheduleReleaseAtTime(nextAttackTime + timeToRelease);
    }
  }

  pushHistoryUpdate(state) {
    const stateDiff = Object.entries(state).reduce((acc, [key, value]) => {
      if (defaultConfig[key] !== value) {
        return {
          ...acc,
          [key]: value,
        };
      }
      return acc;
    }, {});
    window.history.pushState({}, '', `?${qs.stringify(stateDiff)}`);
  }

  onKeysChanged() {
    if (this.keysHeld.length === 0) {
      if (this.keyIsHeld) {
        this.onReleaseTrigger();
        this.keyIsHeld = false;
      }
    } else {
      if (!this.keyIsHeld) {
        this.onAttackTrigger();
        this.keyIsHeld = true;
      }
      this.setVcoFreq();
    }
  }

  onAttackTrigger() {
    const currentTime = this.audioCtx.currentTime;
    this.synthesizer.scheduleAttackAtTime(currentTime);
  }

  onReleaseTrigger() {
    const currentTime = this.audioCtx.currentTime;

    this.synthesizer.scheduleReleaseAtTime(currentTime);
  }

  onPatternChange(pattern) {
    this.pattern = pattern;
  }

  setVcoFreq() {
    if (this.keysHeld.length < 1) {
      return;
    }

    const degree = getDegreeForKey(this.keysHeld[this.keysHeld.length - 1]);

    const frequency = degreeToFrequency(degree);

    this.synthesizer.setVcoFrequencyAtTime(frequency, 0);

    this.setState({ vco1Freq: frequency, vco2Freq: frequency });
  }

  onConfigChange(key, value) {
    this.synthesizer.updateConfig({ [key]: value });
    this.setState(({ synthConfig }) => ({
      synthConfig: {
        ...synthConfig,
        [key]: value,
      },
    }),
    () => {
      this.pushHistoryUpdateDebounced(this.state.synthConfig);
    });
  }

  render() {
    const { synthConfig: config, vco1Freq } = this.state;
    return (
      <div>
        <div>
          <Keyboard />
        </div>
        <div>
          <Sequencer onPatternChange={this.onPatternChange} />
        </div>
        <div className="inline-container">
          <div className="section-container">
            <h3>VCO 1</h3>
            <div className="inline-container">
              <WaveformSelector
                value={config.vco1Waveform}
                onChange={(value) => {
                  this.onConfigChange('vco1Waveform', value);
                }}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="Volume"
                valueKey="vco1Volume"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="Detune"
                min={-1200}
                max={1200}
                valueKey="vco1Detune"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="Octave"
                valueKey="vco1Octave"
                min={-4}
                max={2}
                step={1}
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
          </div>
          <div className="section-container">
            <h3>VCO 2</h3>
            <div className="inline-container">
              <WaveformSelector
                value={config.vco2Waveform}
                onChange={(value) => {
                  this.onConfigChange('vco2Waveform', value);
                }}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="Volume"
                valueKey="vco2Volume"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="Detune"
                min={-1200}
                max={1200}
                valueKey="vco2Detune"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="Octave"
                valueKey="vco2Octave"
                min={-4}
                max={2}
                step={1}
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
          </div>
          <div className="section-container">
            <h3>Noise</h3>
            <div className="inline-container">
              <LabeledKnob
                label="Noise"
                valueKey="noiseVolume"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
          </div>
          <div className="section-container">
            <h3>Frequency Modulation</h3>
            <div className="inline-container">
              <LabeledKnob
                label="Envelope"
                max={1200}
                valueKey="vcoFreqEnvMod"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="LFO"
                max={600}
                valueKey="vcoFreqLfoMod"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
          </div>
        </div>
        <div className="inline-container">
          <div className="section-container">
            <h3>High Pass Filter</h3>
            <div>
              <div className="inline-container">
                <LabeledKnob
                  label="Frequency"
                  min={0}
                  max={10000}
                  valueKey="fltHighPassFreq"
                  onChange={this.onConfigChange}
                  config={config}
                />
              </div>
              <div className="inline-container">
                <LabeledKnob
                  label="Resonance"
                  min={0}
                  max={40}
                  valueKey="fltHighPassRes"
                  onChange={this.onConfigChange}
                  config={config}
                />
              </div>
            </div>
            <div>
              <div className="inline-container">
                <LabeledKnob
                  label="Envelope Mod"
                  min={0}
                  max={10000}
                  valueKey="fltHpEnvMod"
                  onChange={this.onConfigChange}
                  config={config}
                />
              </div>
              <div className="inline-container">
                <LabeledKnob
                  label="LFO Mod"
                  min={0}
                  max={10000}
                  valueKey="fltHpLfoMod"
                  onChange={this.onConfigChange}
                  config={config}
                />
              </div>
            </div>
          </div>
          <div className="section-container">
            <h3>Low Pass Filter</h3>
            <div>
              <div className="inline-container">
                <LabeledKnob
                  label="Frequency"
                  min={0}
                  max={10000}
                  valueKey="fltLowPassFreq"
                  onChange={this.onConfigChange}
                  config={config}
                />
              </div>
              <div className="inline-container">
                <LabeledKnob
                  label="Resonance"
                  min={0}
                  max={40}
                  valueKey="fltLowPassRes"
                  onChange={this.onConfigChange}
                  config={config}
                />
              </div>
            </div>
            <div>
              <div className="inline-container">
                <LabeledKnob
                  label="Envelope Mod"
                  min={0}
                  max={10000}
                  valueKey="fltLpEnvMod"
                  onChange={this.onConfigChange}
                  config={config}
                />
              </div>
              <div className="inline-container">
                <LabeledKnob
                  label="LFO Mod"
                  min={0}
                  max={10000}
                  valueKey="fltLpLfoMod"
                  onChange={this.onConfigChange}
                  config={config}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="inline-container">
          <div className="section-container">
            <h3>LFO</h3>
            <div className="inline-container">
              <LabeledKnob
                label="Frequency"
                min={0}
                max={20}
                valueKey="lfoFreq"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
          </div>
          <div className="section-container">
            <h3>Envelope</h3>
            <div className="inline-container">
              <LabeledKnob
                label="Attack"
                min={0.004}
                max={5}
                valueKey="envAttack"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="Decay"
                min={0.004}
                max={5}
                valueKey="envDecay"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="Sustain"
                valueKey="envSustain"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="Release"
                min={0.004}
                max={5}
                valueKey="envRelease"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
          </div>
          <div className="section-container">
            <h3>Oscilloscope</h3>
            <Oscilloscope
              vco1Octave={config.vco1Octave}
              vco2Octave={config.vco2Octave}
              freq={vco1Freq}
              sampleRate={this.audioCtx.sampleRate}
              analyser={this.synthesizer.analyser}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SynthContainer;
