const TOTAL_MARKERS = 3;
const foundMarkers = new Set();

const countEl = document.getElementById("count");
const cluesEl = document.getElementById("clues");
const markerHintEl = document.getElementById("markerHint");
const progressBar = document.getElementById("progressBar");
const finalOverlay = document.getElementById("finalOverlay");

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioContext;

function ensureAudioContext() {
  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function playPing() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
}

function playCheer() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const frequencies = [523.25, 659.25, 783.99];

  frequencies.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = index === 0 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35 / frequencies.length, now + 0.05);
    gain.gain.linearRampToValueAtTime(0, now + 1.2);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.25);
  });
}

const CLUES = {
  "marker-1": {
    message: "¡Bien! Has encontrado el punto de partida. Busca el siguiente marcador.",
    hint: "Mira cerca de las áreas comunes"
  },
  "marker-2": {
    message: "¡Excelente! La llave mágica te acerca al tesoro.",
    hint: "Revisa cerca de los espacios de estudio"
  },
  "marker-3": {
    message: "¡TESORO ENCONTRADO! Has completado la misión.",
    hint: ""
  }
};

const MARKER_NAMES = {
  "marker-1": "Punto de Inicio",
  "marker-2": "Llave Mágica",
  "marker-3": "Tesoro Final"
};

let audioContext;
let audioUnlocked = false;
let finalPlayed = false;

window.addEventListener("DOMContentLoaded", () => {
  initializeGame();
});

[
  "click",
  "touchstart"
].forEach(eventName => {
  window.addEventListener(eventName, () => {
    ensureAudioContext();
  }, { once: true, passive: true });
});

function initializeGame() {
  const markers = document.querySelectorAll("a-marker");

  markers.forEach((marker) => {
    const id = marker.id;

    marker.addEventListener("markerFound", () => {
      if (!foundMarkers.has(id)) {
        foundMarkers.add(id);
        console.log(`✅ Marcador detectado: ${id}`);

        playPing();
        playPing();
        flashFeedback();
        showMarkerMessage(id);
        updateUI();

        if (foundMarkers.size === TOTAL_MARKERS) {
          setTimeout(showFinalFeedback, 1000);
        }
      }
    });

    marker.addEventListener("markerLost", () => {
      console.log(`👋 Marcador perdido: ${id}`);
    });
  });

  document.getElementById("closeFinal").addEventListener("click", resetGame);

  setupAudioUnlock();
  updateUI();
}

function setupAudioUnlock() {
  if (!audioPrompt) {
    return;
  }

  const unlockAudio = () => {
    if (!audioContext) {
      audioContext = createAudioContext();
    }

    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    audioUnlocked = true;
    audioPrompt.classList.remove("show");

    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };

  window.addEventListener("click", unlockAudio);
  window.addEventListener("touchstart", unlockAudio);

  setTimeout(() => {
    if (!audioUnlocked) {
      audioPrompt.classList.add("show");
    }
  }, 600);
}

function createAudioContext() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    return Ctx ? new Ctx() : null;
  } catch (error) {
    console.warn("No se pudo inicializar AudioContext", error);
    return null;
  }
}

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = createAudioContext();
  }

  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function playTone({ frequency, duration, type = "sine", volume = 0.2, delay = 0 }) {
  const ctx = ensureAudioContext();
  if (!ctx || !audioUnlocked) {
    return;
  }

  const startTime = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function playPing() {
  playTone({ frequency: 880, duration: 0.25, type: "triangle", volume: 0.3 });
  playTone({ frequency: 1320, duration: 0.2, type: "sine", volume: 0.15, delay: 0.05 });
}

function playCelebrationTune() {
  const melody = [
    { frequency: 659, duration: 0.25 },
    { frequency: 784, duration: 0.25 },
    { frequency: 880, duration: 0.3 },
    { frequency: 988, duration: 0.35 },
    { frequency: 1175, duration: 0.45 }
  ];

  melody.forEach((note, index) => {
    playTone({
      frequency: note.frequency,
      duration: note.duration,
      type: "sine",
      volume: 0.25,
      delay: index * 0.2
    });
  });
}

function showMarkerMessage(markerId) {
  const clue = CLUES[markerId];
  if (clue) {
    cluesEl.textContent = clue.message;
    markerHintEl.textContent = clue.hint;

    cluesEl.style.animation = "none";
    requestAnimationFrame(() => {
      cluesEl.style.animation = "highlight 0.6s ease";
    });
  }
}

function updateUI() {
  countEl.textContent = foundMarkers.size;

  const progress = (foundMarkers.size / TOTAL_MARKERS) * 100;
  progressBar.style.width = `${progress}%`;

  if (foundMarkers.size === 0) {
    cluesEl.textContent = "Escanea el marcador inicial para comenzar la aventura...";
    markerHintEl.textContent = "";
  } else {
    const foundNames = Array.from(foundMarkers).map((id) => MARKER_NAMES[id]);
    markerHintEl.textContent = `Encontrados: ${foundNames.join(", ")}`;
  }
}

function flashFeedback() {
  const ui = document.getElementById("ui");
  ui.style.background = "rgba(76, 175, 80, 0.7)";
  setTimeout(() => {
    ui.style.background = "rgba(0, 0, 0, 0.7)";
  }, 300);
}

function showFinalFeedback() {
  if (finalPlayed) return;
  finalPlayed = true;


  finalOverlay.classList.add("show");
  playCheer();

  createCelebrationEffects();
}

function createCelebrationEffects() {
  const overlay = document.getElementById("finalOverlay");
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const emoji = document.createElement('div');
      emoji.textContent = ['🎉', '✨', '⭐', '🎊', '💫'][Math.floor(Math.random() * 5)];
      emoji.classList.add('emoji');
      emoji.style.position = 'absolute';
      emoji.style.left = Math.random() * 100 + 'vw';
      emoji.style.top = '-50px';
      emoji.style.fontSize = (Math.random() * 30 + 20) + 'px';
      emoji.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
      overlay.appendChild(emoji);

      setTimeout(() => emoji.remove(), 5000);
    }, i * 200);
  }
}

function resetGame() {
  foundMarkers.clear();
  finalPlayed = false;
  finalOverlay.classList.remove("show");

  finalOverlay.querySelectorAll('.emoji').forEach(el => el.remove());

  updateUI();
  cluesEl.textContent = "¡Nueva partida! Encuentra el marcador inicial...";
  markerHintEl.textContent = "";
}

const style = document.createElement("style");
style.textContent = `
  @keyframes highlight {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
