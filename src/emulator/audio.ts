export class Audio {
  audioCtx: AudioContext;
  gainNode: GainNode;
  volume: number;
  finish: AudioDestinationNode;
  oscillator?: OscillatorNode | null;

  constructor() {
    const AudioContext = window.AudioContext;
    this.audioCtx = new AudioContext();

    // Gain enables volume control
    this.gainNode = this.audioCtx.createGain();
    this.volume = this.gainNode.gain.value = 0.05;
    this.finish = this.audioCtx.destination;

    // Connect the gain to the audio context
    this.gainNode.connect(this.finish);
  }

  play(frequency: number): void {
    if (this.audioCtx && !this.oscillator) {
      this.oscillator = this.audioCtx.createOscillator();

      // Set the frequency
      this.oscillator.frequency.setValueAtTime(
        frequency || 440,
        this.audioCtx.currentTime,
      );

      // Square wave
      this.oscillator.type = 'square';

      // Connect the gain and start the sound
      this.oscillator.connect(this.gainNode);
      this.oscillator.start();
    }
  }

  stop(): void {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
  }
}
