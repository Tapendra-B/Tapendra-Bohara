
export const initAudio = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return null;
  
  const ctx = new AudioContext();
  return ctx;
};

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

const getCtx = () => {
    if (!audioCtx) {
        audioCtx = initAudio();
        if (audioCtx) {
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 0.3; // Master volume
            
            // Compressor to keep levels consistent and punchy
            const compressor = audioCtx.createDynamicsCompressor();
            compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
            compressor.knee.setValueAtTime(30, audioCtx.currentTime);
            compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
            compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
            compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

            masterGain.connect(compressor);
            compressor.connect(audioCtx.destination);
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return { ctx: audioCtx, master: masterGain };
};

export const vibrate = (ms: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(ms);
    }
};

// Helper: ADSR Envelope
const applyEnvelope = (param: AudioParam, now: number, duration: number, peak: number = 1) => {
    param.cancelScheduledValues(now);
    param.setValueAtTime(0, now);
    param.linearRampToValueAtTime(peak, now + 0.01); // Fast Attack
    param.exponentialRampToValueAtTime(0.001, now + duration); // Decay
};

export const playMoveSound = (player: 'X' | 'O') => {
    try {
        const { ctx, master } = getCtx();
        if (!ctx || !master) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (player === 'O') {
            // "Neon Bubble" - Pure Sine with pitch drop
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
            
            // Add a harmonic for glassiness
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(1600, now);
            osc2.frequency.exponentialRampToValueAtTime(800, now + 0.15);
            gain2.gain.setValueAtTime(0.1, now);
            gain2.gain.linearRampToValueAtTime(0, now + 0.1);
            
            osc2.connect(gain2);
            gain2.connect(master);
            osc2.start(now);
            osc2.stop(now + 0.15);

            applyEnvelope(gain.gain, now, 0.15, 0.4);
        } else {
            // "Electric Zap" - Sawtooth with filter sweep
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.1);
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.linearRampToValueAtTime(4000, now + 0.1);
            filter.Q.value = 8;
            
            osc.disconnect();
            osc.connect(filter);
            filter.connect(gain);
            applyEnvelope(gain.gain, now, 0.12, 0.25);
        }

        if (player === 'O') osc.connect(gain);
        gain.connect(master);
        
        osc.start(now);
        osc.stop(now + 0.2);

    } catch (e) { console.error(e); }
};

export const playWinSound = () => {
    try {
        const { ctx, master } = getCtx();
        if (!ctx || !master) return;
        const now = ctx.currentTime;

        // Synthwave Major 7th Arpeggio
        // Notes: C4, E4, G4, B4, C5 (Neon style)
        const notes = [261.63, 329.63, 392.00, 493.88, 523.25]; 
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            // Rich detuned sawtooth
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            
            // Filter for softness
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.linearRampToValueAtTime(3000, now + 0.1 + (i*0.1));
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(master);
            
            const start = now + (i * 0.08); // Staggered entry
            const duration = 0.8;
            
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
            
            osc.start(start);
            osc.stop(start + duration);
        });

    } catch (e) { console.error(e); }
};

export const playDrawSound = () => {
    try {
        const { ctx, master } = getCtx();
        if (!ctx || !master) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Mechanical power down
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.linearRampToValueAtTime(100, now + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        applyEnvelope(gain.gain, now, 0.4, 0.2);

        osc.start(now);
        osc.stop(now + 0.4);

    } catch (e) { console.error(e); }
};

export const playClickSound = () => {
    try {
        const { ctx, master } = getCtx();
        if (!ctx || !master) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // High-tech UI blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

        gain.connect(master);
        applyEnvelope(gain.gain, now, 0.04, 0.1);

        osc.start(now);
        osc.stop(now + 0.05);

    } catch (e) { console.error(e); }
};

export const playStartGameSound = () => {
    try {
        const { ctx, master } = getCtx();
        if (!ctx || !master) return;
        const now = ctx.currentTime;

        // "Power Up" Sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

        osc.connect(gain);
        gain.connect(master);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.35);

    } catch (e) { console.error(e); }
};
