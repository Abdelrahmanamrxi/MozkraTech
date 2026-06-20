// utils/timerSounds.js

let ambientAudio = null;

// ─────────────────────────────
// AUDIO CONTEXT (for beeps)
// ─────────────────────────────
let ctx = null;

function ac() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  return ctx;
}

function beep(freq, vol, duration, delay = 0) {
  const c = ac();

  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(c.destination);

  const t = c.currentTime + delay;

  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.start(t);
  osc.stop(t + duration);
}

// ─────────────────────────────
// UI SOUNDS
// ─────────────────────────────

export function playStartSound() {
  beep(440, 0.15, 0.2);
  beep(660, 0.15, 0.2, 0.15);
}

export function playStopSound() {
  beep(660, 0.15, 0.2);
  beep(440, 0.15, 0.2, 0.15);
}

export function playResetSound() {
  beep(330, 0.15, 0.35);
}

export function playCompleteSound() {
  beep(523, 0.2, 0.3);
  beep(659, 0.2, 0.3, 0.2);
  beep(784, 0.2, 0.3, 0.4);
}

// ─────────────────────────────
// AMBIENT MUSIC (REAL AUDIO FILE)
// ─────────────────────────────

export function startAmbientMusic() {
  stopAmbientMusic();

  ambientAudio = new Audio("/focus-ambient.mp3"); // 👈 IMPORTANT
  ambientAudio.loop = true;
  ambientAudio.volume = 0.35;

  const playPromise = ambientAudio.play();

  // handle autoplay restrictions
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.log(
        "Audio blocked until user interaction:",
        err
      );
    });
  }
}

export function stopAmbientMusic() {
  if (!ambientAudio) return;

  ambientAudio.pause();
  ambientAudio.currentTime = 0;
  ambientAudio = null;
}