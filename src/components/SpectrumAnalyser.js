import React from 'react';

class SpectrumAnalyser extends React.Component {
  componentDidMount() {
    const { analyser } = this.props;
    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);

    const WIDTH = 300;
    const HEIGHT = 150;

    const canvasCtx = this.canvasRef.getContext('2d');

    const onAnimationFrame = () => {
      // Code here adapted from:
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
      analyser.getFloatFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      const logScale = WIDTH * 1.0 / Math.log(bufferLength / 2);

      for(let i = 0; i < bufferLength / 2; i++) {

        const v = dataArray[i];
        const y = (0.4 - (v / 100)) * HEIGHT / 2;

        const x =  Math.log(i + 1) * logScale;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

      }

      canvasCtx.lineTo(this.canvasRef.width, this.canvasRef.height/2);
      canvasCtx.stroke();

      requestAnimationFrame(onAnimationFrame);
    };

    onAnimationFrame();
  }

  render() {
    return (
      <canvas ref={(ref) => { this.canvasRef = ref; }} style={{ width: 300, height: 150 }} />
    );
  }
}

export default SpectrumAnalyser;
