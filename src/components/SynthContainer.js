import React from 'react';
import * as qs from 'qs';
import { debounce, omit } from 'lodash';

import LabeledKnob from './LabeledKnob';
import WaveformSelector from './WaveformSelector';
import Keyboard from './Keyboard';
import Sequencer from './Sequencer';
import Oscilloscope from './Oscilloscope';
import SpectrumAnalyser from './SpectrumAnalyser';
import VisibilitySettings from './VisibilitySettings'

import {
  keyToDegree,
  getDegreeForKey,
  degreeToFrequency,
} from '../utils/KeyboardUtils';

import createSynthesizer, { defaultConfig } from '../Synthesizer';

import connect from '../webRtcConnection';

function convertToBooleanConfig(config) {
  const res = Object.entries(config).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value === 'true',
    };
  }, {});
  return res;
}

function convertToNumericConfig(config) {
  const res = Object.entries(config).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: isNaN(value) ? value : Number(value),
    };
  }, {});
  return res;
}

const defaultSectionsShown = {
  keyboard: true,
  sequencer: false,
  filter: true,
  modulation: true,
};


class SynthContainer extends React.Component {
  constructor(props) {
    super(props);

    const queryString = window.location.search.slice(1);
    const queryParams = qs.parse(queryString, { arrayLimit: 0 });

    const synthConfig = {
      ...defaultConfig,
      ...convertToNumericConfig(omit(queryParams, 'na', 'nd', 'ss')),
    };

    const pattern = {
      activeSettings: convertToBooleanConfig(queryParams.na || {}),
      degreeSettings: convertToNumericConfig(queryParams.nd || {}),
    };

    const sectionsShown = {
      ...defaultSectionsShown,
      ...convertToBooleanConfig(queryParams.ss || {}),
    };

    const audioCtx = new AudioContext();

    this.synthesizer = createSynthesizer(synthConfig, audioCtx);

    this.keysHeld = [];
    this.keyIsHeld = false;

    this.tempo = 100;

    this.audioCtx = audioCtx;

    this.state = {
      synthConfig,
      vco1Freq: 440,
      vco2Freq: 440,
      isLeader: false,
      peerId: undefined,
      connectedPeerId: undefined,
      sectionsShown,
      pattern,
    };

    this.onConfigChange = this.onConfigChange.bind(this);
    this.onNoteDegreeChange = this.onNoteDegreeChange.bind(this);
    this.onNoteActiveChange = this.onNoteActiveChange.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.connectToPeer = this.connectToPeer.bind(this);
    this.becomeLeader = this.becomeLeader.bind(this);
    this.getCurrentTime = this.getCurrentTime.bind(this);
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
      const queryParams = qs.parse(queryString, { arrayLimit: 0 });

      const synthConfig = {
        ...defaultConfig,
        ...convertToNumericConfig(omit(queryParams, 'na', 'nd')),
      };

      const pattern = {
        activeSettings: convertToBooleanConfig(queryParams.na || {}),
        degreeSettings: convertToNumericConfig(queryParams.nd || {}),
      };

      this.synthesizer.updateConfig(synthConfig);
      this.setState({ synthConfig, pattern });
    });

    const NOTE_SCHEDULING_INTERVAL_MS = 100;
    const NOTE_SCHEDULING_RANGE_MS = 150;

    this.lastScheduledTime = -1;;

    const scheduleNotes = () => {
      const currentTime = this.getCurrentTime();
      const startTime = currentTime;
      const endTime = startTime + NOTE_SCHEDULING_RANGE_MS / 1000;

      const secondsPerBeat = (60 / (this.tempo * 4));

      let nextAttackIndex = Math.ceil(currentTime / secondsPerBeat);

      const attacks = [];

      const {
        pattern: {
          activeSettings,
          degreeSettings,
        },
      } = this.state;

      while (nextAttackIndex * secondsPerBeat < endTime) {
        if (activeSettings[nextAttackIndex % 16]) {
          attacks.push([nextAttackIndex, degreeSettings[nextAttackIndex % 16] || 0]);
        }
        nextAttackIndex += 1;
      }

      attacks.forEach(([attackIndex, degree]) => {
        this.scheduleAttack({ startTime, endTime, nextAttackTime: attackIndex * secondsPerBeat, timeToRelease: secondsPerBeat * 0.9, degree });
      });

      this.lastScheduledTime = endTime;

      setTimeout(scheduleNotes, NOTE_SCHEDULING_INTERVAL_MS);
    };

    scheduleNotes();

    // Fix taken from https://github.com/peers/peerjs/issues/278#issuecomment-107276110
    const pingPeer = () => {
      if (this.peer) {
        this.peer.socket.send({type: 'ping'});
      }

      setTimeout(pingPeer, 20000);
    };

    setTimeout(pingPeer, 20000);
  }

  connectToPeer() {
    const { connectedPeerId } = this.state;
    const { peer, ts } = connect(
      connectedPeerId ? [connectedPeerId] : [],
      this.audioCtx,
      (peer) => {
        this.setState({ peerId: peer.id });
      },
    );

    this.peer = peer;
    this.timesync = ts;
  }

  becomeLeader() {
    this.setState(
      {
        connectedPeerId: '',
        isLeader: true,
      },
      () => this.connectToPeer(),
    );
  };

  getCurrentTime() {
    if (!this.timesync) {
      return this.audioCtx.currentTime;
    }

    return this.timesync.now();
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
      const offset = this.timesync ? this.timesync.offset : 0;
      if (this.keysHeld.length < 1) {
        const frequency = degreeToFrequency(degree);

        this.synthesizer.setVcoFrequencyAtTime(frequency, nextAttackTime - offset);
      }

      this.synthesizer.scheduleAttackAtTime(nextAttackTime - offset);

      // Also do release, since we already know when it's going to be and there
      // won't be another attack between this one and the release
      // TODO: this will need to be changed at some point as this ^^^ shouldn't be guaranteed
      this.synthesizer.scheduleReleaseAtTime(nextAttackTime + timeToRelease - offset);
    }
  }

  pushHistoryUpdate() {
    const {
      synthConfig,
      pattern: {
        activeSettings,
        degreeSettings,
      },
      sectionsShown,
    }= this.state;

    const configDiff = Object.entries(synthConfig).reduce((acc, [key, value]) => {
      if (defaultConfig[key] !== value) {
        return {
          ...acc,
          [key]: value,
        };
      }
      return acc;
    }, {});

    const na = Object.entries(activeSettings).reduce((acc, [key, value]) => {
      if (value) {
        return {
          ...acc,
          [key]: value,
        };
      }
      return acc;
    }, {});

    const nd = Object.entries(degreeSettings).reduce((acc, [key, value]) => {
      if (value !== 0) {
        return {
          ...acc,
          [key]: value,
        };
      }
      return acc;
    }, {});

    const ss = Object.entries(sectionsShown).reduce((acc, [key, value]) => {
      if (defaultSectionsShown[key] !== value) {
        return {
          ...acc,
          [key]: value,
        };
      }
      return acc;
    }, {});

    const diff = {
      ...configDiff,
      na,
      nd,
      ss,
    };
    window.history.pushState({}, '', `?${qs.stringify(diff)}`);
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

  onNoteDegreeChange(note, degree) {
    this.setState(({ pattern }) => ({
      pattern: {
        ...pattern,
        degreeSettings: {
          ...pattern.degreeSettings,
          [note]: degree,
        },
      },
    }),
    () => {
      this.pushHistoryUpdateDebounced();
    });
  }

  onNoteActiveChange(note, active) {
    this.setState(({ pattern }) => ({
      pattern: {
        ...pattern,
        activeSettings: {
          ...pattern.activeSettings,
          [note]: active,
        },
      },
    }),
    () => {
      this.pushHistoryUpdateDebounced();
    });
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
      this.pushHistoryUpdateDebounced();
    });
  }

  onVisibilityChange(sectionsShown) {
    this.setState({ sectionsShown }, () => this.pushHistoryUpdateDebounced());
  }

  render() {
    const {
      synthConfig: config,
      vco1Freq,
      peerId,
      connectedPeerId,
      pattern,
      isLeader,
      sectionsShown,
    } = this.state;
    return (
      <div>
        <VisibilitySettings
          sectionsShown={sectionsShown}
          onChange={this.onVisibilityChange}
        />
        <div>
          {sectionsShown.keyboard &&
            <Keyboard
              pattern={pattern}
              getCurrentTime={this.getCurrentTime}
              tempo={this.tempo}
            />
          }
        </div>
        <div>
          {sectionsShown.sequencer &&
            <Sequencer
              pattern={pattern}
              onNoteActiveChange={this.onNoteActiveChange}
              onNoteDegreeChange={this.onNoteDegreeChange}
              getCurrentTime={this.getCurrentTime}
              tempo={this.tempo}
            />
          }
        </div>
        <div className="inline-container">
          <div className="section-container">
            <h3>Oscillator 1</h3>
            <div>
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
            <h3>Oscillator 2</h3>
            <div>
              <WaveformSelector
                value={config.vco2Waveform}
                onChange={(value) => {
                  console.log(value);
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
                label="Volume"
                valueKey="noiseVolume"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
          </div>
          {sectionsShown.modulation &&
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
          }
        </div>
        {sectionsShown.filter &&
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
              {sectionsShown.modulation &&
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
              }
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
              {sectionsShown.modulation &&
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
              }
            </div>
          </div>
        }
        <div className="inline-container">
          {sectionsShown.modulation &&
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
          }
          {sectionsShown.modulation &&
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
          }
          <div className="section-container">
            <h3>Oscilloscope</h3>
            <Oscilloscope
              vco1Octave={config.vco1Octave}
              vco2Octave={config.vco2Octave}
              freq={vco1Freq}
              sampleRate={this.audioCtx.sampleRate}
              analyser={this.synthesizer.analyser}
            />
            <h3>Spectrum Analyser</h3>
            <SpectrumAnalyser
              analyser={this.synthesizer.analyser}
            />
          </div>
        </div>
        <div className="inline-container">
          <div className="section-container">
            <h3>Beat Connection</h3>
            {!isLeader &&
              <label>
                {'Leader ID:\u00A0'}
                <input type="text" value={connectedPeerId} onChange={(e) => this.setState({ connectedPeerId: e.target.value })} />
              </label>
            }
            {!isLeader &&
              <button onClick={this.connectToPeer}>Connect to leader</button>
            }
            {!isLeader && !peerId &&
              <div style={{ marginTop: 10 }}>
                <button onClick={this.becomeLeader}>Become leader</button>
              </div>
            }
            {peerId &&
              <div>ID: {peerId}</div>
            }
            <div id="systemTime" />
            <div id="syncTime" />
            <div id="offset" />
            <div id="syncing" />
          </div>
        </div>
      </div>
    );
  }
}

export default SynthContainer;
