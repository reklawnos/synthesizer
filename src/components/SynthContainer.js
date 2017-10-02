import React from 'react';

class SynthContainer extends React.Component {
  constructor(props) {
    super(props);

    const ctx = new AudioContext();

    const vco = ctx.createOscillator();
    vco.type = 'sine';
    vco.frequency.value = 110; // value in hertz
    vco.start();

    const vcAmp = ctx.createGain();
    vcAmp.gain.value = 0.1;
    vco.connect(vcAmp);


    const fltLowPass = ctx.createBiquadFilter();
    const freq = 4000;

    fltLowPass.type = "lowpass";
    fltLowPass.frequency.value = freq;
    fltLowPass.gain.value = 25;



    const fltRes = ctx.createBiquadFilter();

    fltRes.type = "peaking";
    fltRes.frequency.value = freq;
    fltRes.gain.value = 25;


    vcAmp.connect(fltLowPass);
    fltLowPass.connect(fltRes);




    this.state = {
      
    };
  }


  render() {
  
  }
}

export default SynthContainer;
