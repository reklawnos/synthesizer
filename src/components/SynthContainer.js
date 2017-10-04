import React from 'react';
import * as qs from 'qs';
import { debounce } from 'lodash';

import LabeledKnob from './LabeledKnob';
import WaveformSelector from './WaveformSelector';
import Keyboard from './Keyboard';

import {
  createNoiseSource,
} from '../utils/AudioUtils';

import {
  keyToDegree,
  getDegreeForKey,
  degreeToFrequency,
} from '../utils/KeyboardUtils';

const defaultConfig = {
  // Sources
  vco1Volume: 1,
  vco1Waveform: 'sine',
  vco1Detune: 0,
  vco1Octave: 0,

  vco2Volume: 1,
  vco2Waveform: 'sine',
  vco2Detune: 0,
  vco2Octave: 0,

  noiseVolume: 0,

  // Filters
  fltHighPassFreq: 0,
  fltHighPassRes: 0,

  fltLowPassFreq: 10000,
  fltLowPassRes: 0,

  // Global
  globalVolume: 0.3,

  // Modulation
  lfoFreq: 2,

  vcoFreqEnvMod: 0,
  vcoFreqLfoMod: 0,

  fltHpEnvMod: 0,
  fltHpLfoMod: 0,
  fltLpEnvMod: 0,
  fltLpLfoMod: 0,

  envAttack: 0.0004,
  envDecay: 0,
  envSustain: 0.5,
  envRelease: 0.0004,
};

function convertToNumericConfig(config) {
  const res = Object.entries(config).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: isNaN(value) ? value : Number(value),
    };
  }, {});
  console.log(res);
  return res;
}

class SynthContainer extends React.Component {
  constructor(props) {
    super(props);

    const queryString = window.location.search.slice(1);
    const config = {
      ...defaultConfig,
      ...convertToNumericConfig(qs.parse(queryString)),
    };

    console.log(config);

    const audioCtx = new AudioContext();

    // Sound sources ------------------------
    const vco1 = audioCtx.createOscillator();
    vco1.type = config.vco1Waveform;
    vco1.frequency.value = 440;
    vco1.detune.value = config.vco1Detune
    vco1.start();

    const vco2 = audioCtx.createOscillator();
    vco2.type = config.vco2Waveform;
    vco2.frequency.value = 440; // value in hertz
    vco1.detune.value = config.vco2Detune
    vco2.start();

    const noiseSource = createNoiseSource(audioCtx);


    // Source amps --------------------------
    const vco1Amp = audioCtx.createGain();
    vco1Amp.gain.value = config.vco1Volume;

    const vco2Amp = audioCtx.createGain();
    vco2Amp.gain.value = config.vco2Volume;

    const noiseAmp = audioCtx.createGain();
    noiseAmp.gain.value = config.noiseVolume;

    const vcoOverallAmp = audioCtx.createGain();
    vcoOverallAmp.gain.value = 0;


    // Filters ------------------------------
    const fltHighPass = audioCtx.createBiquadFilter();
    fltHighPass.type = 'highpass';
    fltHighPass.frequency.value = config.fltHighPassFreq;

    const fltHpRes = audioCtx.createBiquadFilter();
    fltHpRes.type = 'peaking';
    fltHpRes.frequency.value = config.fltHighPassFreq;
    fltHpRes.gain.value = config.fltHighPassRes;

    const fltLowPass = audioCtx.createBiquadFilter();
    fltLowPass.type = 'lowpass';
    fltLowPass.frequency.value = config.fltLowPassFreq;

    const fltLpRes = audioCtx.createBiquadFilter();
    fltLpRes.type = 'peaking';
    fltLpRes.frequency.value = config.fltLowPassFreq;
    fltLpRes.gain.value = config.fltLowPassRes;


    // Global effects -----------------------
    const volume = audioCtx.createGain();
    volume.gain.value = config.globalVolume;


    // Modulation generators ----------------
    const envelopeSource = audioCtx.createConstantSource();
    envelopeSource.offset.value = 1;
    envelopeSource.start();

    const envelopeGain = audioCtx.createGain();
    envelopeGain.gain.value = 0;
    envelopeSource.connect(envelopeGain);

    const lfo = audioCtx.createOscillator();
    lfo.type = 'triangle';
    lfo.frequency.value = config.lfoFreq;
    lfo.start();


    // Modulation gains ---------------------
    const vcoFreqEnvMod = audioCtx.createGain();
    vcoFreqEnvMod.gain.value = config.vcoFreqEnvMod;

    const vcoFreqLfoMod = audioCtx.createGain();
    vcoFreqLfoMod.gain.value = config.vcoFreqLfoMod;

    const fltHpEnvMod = audioCtx.createGain();
    fltHpEnvMod.gain.value = config.fltHpEnvMod;

    const fltHpLfoMod = audioCtx.createGain();
    fltHpLfoMod.gain.value = config.fltHpLfoMod;

    const fltLpEnvMod = audioCtx.createGain();
    fltLpEnvMod.gain.value = config.fltLpEnvMod;

    const fltLpLfoMod = audioCtx.createGain();
    fltLpLfoMod.gain.value = config.fltLpLfoMod;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;


    // Basic wiring
    vco1.connect(vco1Amp);
    vco2.connect(vco2Amp);
    noiseSource.connect(noiseAmp);

    vco1Amp.connect(vcoOverallAmp);
    vco2Amp.connect(vcoOverallAmp);
    noiseAmp.connect(vcoOverallAmp);

    vcoOverallAmp.connect(fltHighPass);
    fltHighPass.connect(fltHpRes);

    fltHpRes.connect(fltLowPass);
    fltLowPass.connect(fltLpRes);

    fltLpRes.connect(volume);
    fltLpRes.connect(analyser);
    volume.connect(audioCtx.destination);


    // Modulation connections
    envelopeGain.connect(vcoOverallAmp.gain);
    envelopeGain.connect(vcoFreqEnvMod);
    envelopeGain.connect(fltHpEnvMod);
    envelopeGain.connect(fltLpEnvMod);

    fltHpEnvMod.connect(fltLowPass.detune);
    fltHpEnvMod.connect(fltLpRes.detune);
    fltHpLfoMod.connect(fltLowPass.detune);
    fltHpLfoMod.connect(fltLpRes.detune);

    fltLpEnvMod.connect(fltLowPass.detune);
    fltLpEnvMod.connect(fltLpRes.detune);
    fltLpLfoMod.connect(fltLowPass.detune);
    fltLpLfoMod.connect(fltLpRes.detune);

    lfo.connect(vcoFreqLfoMod);
    lfo.connect(fltHpLfoMod);
    lfo.connect(fltLpLfoMod);

    vcoFreqLfoMod.connect(vco1.detune);
    vcoFreqLfoMod.connect(vco2.detune);

    this.configToUpdater = {
      vco1Volume(v = 1) { vco1Amp.gain.value = v; },
      vco1Waveform(v = 'sine') { vco1.type = v; },
      vco1Detune(v = 0)  { vco1.detune.value = v; },
      vco1Octave: (v = 0) => { this.setVcoFreq(); },

      vco2Volume(v = 1) { vco2Amp.gain.value = v; },
      vco2Waveform(v = 'sine') { vco2.type = v; },
      vco2Detune(v = 0)  { vco2.detune.value = v; },
      vco2Octave: (v = 0) => { this.setVcoFreq(); },

      noiseVolume(v = 0) { noiseAmp.gain.value = v; },

      // Filters
      fltHighPassFreq(v = 0) { fltHighPass.frequency.value = v; },
      fltHighPassRes(v = 0) { fltHpRes.gain.value = v; },

      fltLowPassFreq(v = 0) { fltLowPass.frequency.value = v; },
      fltLowPassRes(v = 0) { fltLpRes.gain.value = v; },

      // Global
      globalVolume(v = 0.3) { volume.gain.value = v; },

      // Modulation
      lfoFreq(v = 2) { lfo.frequency.value = v; },

      vcoFreqEnvMod(v = 0) { vcoFreqEnvMod.gain.value = v; },
      vcoFreqLfoMod(v = 0) { vcoFreqLfoMod.gain.value = v; },

      fltHpEnvMod(v = 0) { fltHpEnvMod.gain.value = v; },
      fltHpLfoMod(v = 0) { fltHpLfoMod.gain.value = v; },
      fltLpEnvMod(v = 0) { fltLpEnvMod.gain.value = v; },
      fltLpLfoMod(v = 0) { fltLpLfoMod.gain.value = v; },
    };

    this.keysHeld = [];
    this.keyIsHeld = false;

    this.audioCtx = audioCtx;
    this.envelopeGain = envelopeGain;
    this.vco1 = vco1;
    this.vco2 = vco2;

    this.analyser = analyser;

    this.state = {
      ...config,
    };

    // this.updateSynth();

    this.onConfigChange = this.onConfigChange.bind(this);
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
      const config = {
        ...defaultConfig,
        ...convertToNumericConfig(qs.parse(queryString)),
      };

      this.updateConfig(config);
      this.setState(config);
    });


    const analyser = this.analyser;
    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);

    const WIDTH = 300;
    const HEIGHT = 150;

    const canvasCtx = this.canvasRef.getContext('2d');

    const onAnimationFrame = () => {
      // Code here adapted from:
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
      const oscPeriod = 1 / (Math.min(this.vco1Freq, this.vco2Freq) || 440);
      const timeInSamples = Math.round(4 * oscPeriod * this.audioCtx.sampleRate);
      analyser.getFloatTimeDomainData(dataArray);

      let firstCross;
      for (let i = 0; i < dataArray.length -1; i += 1) {
        if (dataArray[i] > 0 && dataArray[i + 1] <= 0) {
          firstCross = i;
          break;
        }
      }

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      let sliceWidth = WIDTH * 1.0 / (Math.min(timeInSamples / 2, bufferLength));
      let x = 0;

      for(let i = firstCross; i < Math.min(timeInSamples, bufferLength); i++) {

        let v = dataArray[i];
        let y = v * 0.5 * HEIGHT/2 + HEIGHT / 2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(this.canvasRef.width, this.canvasRef.height/2);
      canvasCtx.stroke();

      requestAnimationFrame(onAnimationFrame);
    };

    requestAnimationFrame(onAnimationFrame);
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
      // vcoOverallAmp.gain.value = 0;
    } else {
      if (!this.keyIsHeld) {
        this.onAttackTrigger();
        this.keyIsHeld = true;
      }
      // vcoOverallAmp.gain.value = 1;
      this.setVcoFreq();
    }
  }

  onAttackTrigger() {
    const {
      envAttack,
      envDecay,
      envSustain,
    } = this.state;

    const currentTime = this.audioCtx.currentTime;
    this.envelopeGain.gain.cancelAndHoldAtTime(0);
    this.envelopeGain.gain.linearRampToValueAtTime(1, currentTime + envAttack);
    this.envelopeGain.gain.linearRampToValueAtTime(envSustain, currentTime + envAttack + envDecay);
  }

  onReleaseTrigger() {
    const { envRelease } = this.state;

    const currentTime = this.audioCtx.currentTime;
    this.envelopeGain.gain.cancelAndHoldAtTime(0);
    this.envelopeGain.gain.linearRampToValueAtTime(0, currentTime + envRelease);
  }

  setVcoFreq() {
    const { vco1Octave, vco2Octave } = this.state;

    if (this.keysHeld.length < 1) {
      return;
    }

    const degree = getDegreeForKey(this.keysHeld[this.keysHeld.length - 1]);

    const vco1Frequency = degreeToFrequency(degree + vco1Octave * 12)
    const vco2Frequency = degreeToFrequency(degree + vco2Octave * 12)

    this.vco1Freq = vco1Frequency;
    this.vco2Freq = vco1Frequency;

    this.vco1.frequency.setValueAtTime(vco1Frequency, 0);
    this.vco2.frequency.setValueAtTime(vco2Frequency, 0);
  }

  updateConfig(config) {
    Object.entries(config).forEach(([key, value]) => {
      const updater = this.configToUpdater[key];
      if (updater) {
        updater(value);
      }
    });
  }

  onConfigChange(key, value) {
    this.updateConfig({ [key]: value });
    this.setState({ [key]: value }, () => {
      this.pushHistoryUpdateDebounced(this.state);
    });
  }

  render() {
    const config = this.state;
    return (
      <div>
        <div>
          <Keyboard />
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
                max={10}
                valueKey="envAttack"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
            <div className="inline-container">
              <LabeledKnob
                label="Decay"
                min={0}
                max={10}
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
                max={10}
                valueKey="envRelease"
                onChange={this.onConfigChange}
                config={config}
              />
            </div>
          </div>
          <div className="section-container">
            <h3>Oscilloscope</h3>
            <canvas ref={(ref) => { this.canvasRef = ref; }} style={{ width: 300, height: 150 }} />
          </div>
        </div>
      </div>
    );
  }
}

export default SynthContainer;
