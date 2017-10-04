export function createNoiseSource(audioCtx) {
  // Source: https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode

  const noiseBuf = audioCtx.createBuffer(2, audioCtx.sampleRate * 3, audioCtx.sampleRate);

  // Fill the buffer with white noise;
  //just random values between -1.0 and 1.0
  for (var channel = 0; channel < noiseBuf.numberOfChannels; channel++) {
    // This gives us the actual ArrayBuffer that contains the data
    var nowBuffering = noiseBuf.getChannelData(channel);
    for (var i = 0; i < noiseBuf.length; i++) {
      // Math.random() is in [0; 1.0]
      // audio needs to be in [-1.0; 1.0]
      nowBuffering[i] = Math.random() * 2 - 1;
    }
  }

  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  const noiseSource = audioCtx.createBufferSource();
  // set the buffer in the AudioBufferSourceNode
  noiseSource.buffer = noiseBuf;
  // start the source playing
  noiseSource.loop = true;
  noiseSource.start();

  return noiseSource;
}
