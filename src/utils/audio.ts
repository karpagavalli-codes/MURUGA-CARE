/**
 * Web Audio API synthesizer for Muruga Care.
 * Provides rich temple bell chimes with overtones, water drop sounds,
 * victory fanfares, and continuous ambient soundscapes for the Focus Studio.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Authentic South Indian Temple Bell chime with metallic harmonic overtones and long resonant decay
 */
export function playTempleBell(volume = 0.4) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(ctx.destination);

    // Fundamental and harmonic partial frequencies for a bronze temple bell
    const partials = [
      { freq: 432, gain: 0.6, decay: 2.8 },
      { freq: 864, gain: 0.4, decay: 2.2 },
      { freq: 1296, gain: 0.25, decay: 1.6 },
      { freq: 1728, gain: 0.15, decay: 1.1 },
      { freq: 2400, gain: 0.08, decay: 0.8 },
    ];

    partials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(gain, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * Gentle water droplet sound for logging hydration
 */
export function playWaterDrop(volume = 0.35) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency sweeps upward rapidly then drops
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.07);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.18);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (err) {
    console.warn('Water audio error:', err);
  }
}

/**
 * Triumphant golden fanfare chime when completing tasks or streak milestones
 */
export function playVictoryChime(volume = 0.35) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
    const notes = [
      { f: 523.25, time: 0 },
      { f: 659.25, time: 0.09 },
      { f: 783.99, time: 0.18 },
      { f: 1046.5, time: 0.28 },
    ];

    notes.forEach(({ f, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(volume, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + 0.75);
    });
  } catch (err) {
    console.warn('Victory audio error:', err);
  }
}

/**
 * Murugan "Parandhu Vaa" swoosh + bell jump chime
 */
export function playParandhuVaaSwoosh(volume = 0.3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);

    setTimeout(() => {
      playTempleBell(volume * 0.7);
    }, 180);
  } catch (err) {
    console.warn('Swoosh audio error:', err);
  }
}

// Soundscape controller for Focus Studio
let soundscapeNodes: {
  stop: () => void;
} | null = null;

export function stopSoundscape() {
  if (soundscapeNodes) {
    soundscapeNodes.stop();
    soundscapeNodes = null;
  }
}

export function startSoundscape(type: 'temple_bell' | 'soft_rain' | 'flute_drone' | 'brown_noise', volume = 0.2) {
  stopSoundscape();

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, now);
  masterGain.connect(ctx.destination);

  let intervalId: number | null = null;

  if (type === 'temple_bell') {
    // Gentle periodic bell strike every 12 seconds with low warm drone
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(108, now); // Sacret 108Hz drone
    droneGain.gain.setValueAtTime(0.06, now);
    drone.connect(droneGain);
    droneGain.connect(masterGain);
    drone.start(now);

    playTempleBell(volume * 0.6);
    intervalId = window.setInterval(() => {
      playTempleBell(volume * 0.5);
    }, 12000);

    soundscapeNodes = {
      stop: () => {
        drone.stop();
        if (intervalId) clearInterval(intervalId);
      },
    };
  } else if (type === 'flute_drone') {
    // Warm meditative Tanpura/flute acoustic drone (Sa - Pa - Sa chord)
    const freqs = [216, 324, 432];
    const oscs = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = i === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.08 / (i + 1), now);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now);
      return osc;
    });

    soundscapeNodes = {
      stop: () => {
        oscs.forEach((o) => o.stop());
      },
    };
  } else {
    // Brown / Rain noise simulation with filtered noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = type === 'soft_rain' ? 'bandpass' : 'lowpass';
    filter.frequency.setValueAtTime(type === 'soft_rain' ? 800 : 350, now);
    filter.Q.setValueAtTime(1.0, now);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    whiteNoise.start(now);

    soundscapeNodes = {
      stop: () => {
        whiteNoise.stop();
      },
    };
  }
}
