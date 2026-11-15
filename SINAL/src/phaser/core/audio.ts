export class AudioBus {
  context?: AudioContext; music = false; effects = true; private timer?: ReturnType<typeof setInterval>;
  unlock() { this.context ??= new AudioContext(); void this.context.resume(); }
  tone(f = 520, duration = 0.09, volume = 0.025) {
    if (!this.effects || !this.context) return;
    const o = this.context.createOscillator(), g = this.context.createGain(); o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(volume, this.context.currentTime); g.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    o.connect(g); g.connect(this.context.destination); o.start(); o.stop(this.context.currentTime + duration);
  }
  setMusic(on: boolean) { this.music = on; clearInterval(this.timer); if (on) this.timer = setInterval(() => { if (this.context?.state !== 'running') return; const saved = this.effects; this.effects = true; this.tone([220, 261.63, 329.63, 293.66][Math.floor(Date.now() / 1800) % 4], 1.5, 0.008); this.effects = saved; }, 1800); }
  destroy() { clearInterval(this.timer); void this.context?.close(); }
}
