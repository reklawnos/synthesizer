import * as EnvGen from 'fastidious-envelope-generator';

import {
  createNoiseSource,
} from './utils/AudioUtils';


export const defaultConfig = {
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
  envDecay: 0.0004,
  envSustain: 0.5,
  envRelease: 0.0004,
};


export default function createSynthesizer(config, audioCtx) {
  // Sound sources ------------------------
  const vco1 = audioCtx.createOscillator();
  vco1.type = config.vco1Waveform;
  vco1.frequency.value = 440;
  vco1.detune.value = config.vco1Detune
  vco1.start();
  const vco1OctaveDetune = audioCtx.createConstantSource();
  vco1OctaveDetune.offset.value = config.vco1Octave * 1200;
  vco1OctaveDetune.start();

  const vco2 = audioCtx.createOscillator();
  vco2.type = config.vco2Waveform;
  vco2.frequency.value = 440; // value in hertz
  vco1.detune.value = config.vco2Detune
  vco2.start();
  const vco2OctaveDetune = audioCtx.createConstantSource();
  vco2OctaveDetune.offset.value = config.vco2Octave * 1200;
  vco2OctaveDetune.start();

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
  fltHighPass.Q.value = config.fltHighPassRes;
  fltHighPass.frequency.value = config.fltHighPassFreq;

  const fltLowPass = audioCtx.createBiquadFilter();
  fltLowPass.type = 'lowpass';
  fltLowPass.Q.value = config.fltLowPassRes;
  fltLowPass.frequency.value = config.fltLowPassFreq;


  // Global effects -----------------------
  const volume = audioCtx.createGain();
  volume.gain.value = config.globalVolume;


  // Modulation generators ----------------
  const envelopeSource = audioCtx.createConstantSource();
  envelopeSource.offset.value = 1;
  envelopeSource.start();

  const envelopeGain = audioCtx.createGain();
  envelopeGain.gain.setValueAtTime(0, 0);
  envelopeSource.connect(envelopeGain);

  const envelopeGenerator = new EnvGen(audioCtx, envelopeGain.gain);
  envelopeGenerator.mode = 'ADSR';
  envelopeGenerator.attackTime = config.envAttack;
  envelopeGenerator.decayTime = config.envDecay;
  envelopeGenerator.sustainLevel = config.envSustain;
  envelopeGenerator.releaseTime = config.envRelease;

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
  analyser.fftSize = 4096;


  // Basic wiring
  vco1.connect(vco1Amp);
  vco2.connect(vco2Amp);
  noiseSource.connect(noiseAmp);

  vco1Amp.connect(vcoOverallAmp);
  vco2Amp.connect(vcoOverallAmp);
  noiseAmp.connect(vcoOverallAmp);

  vcoOverallAmp.connect(fltHighPass);

  fltHighPass.connect(fltLowPass);

  fltLowPass.connect(volume);
  fltLowPass.connect(analyser);
  volume.connect(audioCtx.destination);


  // Modulation connections
  envelopeGain.connect(vcoOverallAmp.gain);
  envelopeGain.connect(vcoFreqEnvMod);
  envelopeGain.connect(fltHpEnvMod);
  envelopeGain.connect(fltLpEnvMod);

  fltHpEnvMod.connect(fltHighPass.detune);
  fltHpLfoMod.connect(fltHighPass.detune);

  fltLpEnvMod.connect(fltLowPass.detune);
  fltLpLfoMod.connect(fltLowPass.detune);

  lfo.connect(vcoFreqLfoMod);
  lfo.connect(fltHpLfoMod);
  lfo.connect(fltLpLfoMod);

  vcoFreqEnvMod.connect(vco1.detune);
  vcoFreqEnvMod.connect(vco2.detune);
  vcoFreqLfoMod.connect(vco1.detune);
  vcoFreqLfoMod.connect(vco2.detune);
  vco1OctaveDetune.connect(vco1.detune);
  vco2OctaveDetune.connect(vco2.detune);

  const configToUpdater = {
    vco1Volume(v = 1) { vco1Amp.gain.value = v; },
    vco1Waveform(v = 'sine') { vco1.type = v; },
    vco1Detune(v = 0)  { vco1.detune.value = v; },
    vco1Octave(v = 0) { vco1OctaveDetune.offset.value = v * 1200 },

    vco2Volume(v = 1) { vco2Amp.gain.value = v; },
    vco2Waveform(v = 'sine') { vco2.type = v; },
    vco2Detune(v = 0)  { vco2.detune.value = v; },
    vco2Octave(v = 0) { vco2OctaveDetune.offset.value = v * 1200 },

    noiseVolume(v = 0) { noiseAmp.gain.value = v; },

    // Filters
    fltHighPassFreq(v = 0) { fltHighPass.frequency.value = v; },
    fltHighPassRes(v = 0) { fltHighPass.Q.value = v; },

    fltLowPassFreq(v = 0) { fltLowPass.frequency.value = v; },
    fltLowPassRes(v = 0) { fltLowPass.Q.value = v; },

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
    envAttack(v) { envelopeGenerator.attackTime = config.envAttack; },
    envDecay(v) { envelopeGenerator.decayTime = config.envDecay; },
    envSustain(v) { envelopeGenerator.sustainLevel = config.envSustain; },
    envRelease(v) { envelopeGenerator.releaseTime = config.envRelease; },
  };

  function scheduleAttackAtTime(time) {
    envelopeGenerator.gateOn(time);
  }

  function scheduleReleaseAtTime(time) {
    envelopeGenerator.gateOff(time);
  }

  function setVcoFrequencyAtTime(frequency, time) {
    vco1.frequency.setValueAtTime(frequency, time);
    vco2.frequency.setValueAtTime(frequency, time);
  }

  function updateConfig(configUpdates) {
    config = {
      ...config,
      ...configUpdates,
    };

    Object.entries(configUpdates).forEach(([key, value]) => {
      const updater = configToUpdater[key];
      if (updater) {
        updater(value);
      }
    });
  }

  return {
    scheduleAttackAtTime,
    scheduleReleaseAtTime,
    setVcoFrequencyAtTime,
    updateConfig,
    analyser,
  };
}
