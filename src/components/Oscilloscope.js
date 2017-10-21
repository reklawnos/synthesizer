import React from 'react';

class Oscilloscope extends React.Component {

  componentDidMount() {
    const { analyser } = this.props;
    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);

    const WIDTH = 300;
    const HEIGHT = 150;

    const canvasCtx = this.canvasRef.getContext('2d');

    const onAnimationFrame = () => {
      const { vco1Octave, vco2Octave, freq, sampleRate } = this.props;
      // Code here adapted from:
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
      const oscPeriod = 1 / (Math.min(freq * (2 ** vco1Octave), freq * (2 ** vco2Octave)) || 440);
      const timeInSamples = Math.round(4 * oscPeriod * sampleRate);
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

  render() {
    return (
      <canvas ref={(ref) => { this.canvasRef = ref; }} style={{ width: 300, height: 150 }} />
    );
  }
}

export default Oscilloscope;
