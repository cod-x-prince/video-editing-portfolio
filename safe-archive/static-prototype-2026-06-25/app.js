const greetings = [
  { text: "Hello", style: "" },
  { text: "Namaste", style: "style-soft" },
  { text: "Hola", style: "style-serif" },
  { text: "Bonjour", style: "style-condensed" },
  { text: "Ciao", style: "style-mono" },
  { text: "Hallo", style: "style-soft" },
  { text: "Konnichiwa", style: "style-serif" },
  { text: "Salaam", style: "style-condensed" },
  { text: "Olá", style: "style-mono" },
  { text: "Hello", style: "" },
];

const tracks = [
  {
    title: "Track 1 placeholder",
    status: "Add track-1.mp3",
    src: "./public/music/track-1.mp3",
  },
  {
    title: "Track 2 placeholder",
    status: "Add track-2.mp3",
    src: "./public/music/track-2.mp3",
  },
  {
    title: "Track 3 placeholder",
    status: "Add track-3.mp3",
    src: "./public/music/track-3.mp3",
  },
];

const intro = document.querySelector(".intro");
const siteShell = document.querySelector(".site-shell");
const helloStage = document.querySelector(".hello-stage");
const helloWord = document.querySelector("#helloWord");
const musicPlayer = document.querySelector("#musicPlayer");
const heroMedia = document.querySelector("#heroMedia");
const audioPlayer = document.querySelector("#audioPlayer");
const trackTitle = document.querySelector("#trackTitle");
const trackStatus = document.querySelector("#trackStatus");
const toggleMusic = document.querySelector("#toggleMusic");
const muteMusic = document.querySelector("#muteMusic");
const prevTrack = document.querySelector("#prevTrack");
const nextTrack = document.querySelector("#nextTrack");

let greetingIndex = 0;
let activeTrack = 0;
let fadeFrame = 0;
let isPlaying = false;

function updateGreeting() {
  const greeting = greetings[greetingIndex % greetings.length];
  helloWord.className = `hello-word is-switching ${greeting.style}`;

  window.setTimeout(() => {
    helloWord.textContent = greeting.text;
    helloWord.className = `hello-word ${greeting.style}`;
  }, 120);

  greetingIndex += 1;
}

function setTrack(index) {
  activeTrack = (index + tracks.length) % tracks.length;
  const track = tracks[activeTrack];
  audioPlayer.src = track.src;
  audioPlayer.volume = 0;
  trackTitle.textContent = track.title;
  trackStatus.textContent = track.status;
}

function fadeAudio(targetVolume = 0.46, duration = 2600) {
  window.cancelAnimationFrame(fadeFrame);
  const start = performance.now();
  const startVolume = audioPlayer.volume || 0;

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    audioPlayer.volume = startVolume + (targetVolume - startVolume) * eased;

    if (progress < 1) {
      fadeFrame = window.requestAnimationFrame(tick);
    }
  }

  fadeFrame = window.requestAnimationFrame(tick);
}

async function playMusic() {
  try {
    if (!audioPlayer.src) {
      setTrack(activeTrack);
    }

    audioPlayer.volume = 0;
    await audioPlayer.play();
    isPlaying = true;
    toggleMusic.textContent = "Ⅱ";
    toggleMusic.setAttribute("aria-label", "Pause music");
    trackStatus.textContent = "Now playing";
    fadeAudio();
  } catch (error) {
    isPlaying = false;
    toggleMusic.textContent = "▶";
    toggleMusic.setAttribute("aria-label", "Play music");
    trackStatus.textContent = "Tap to play";
  }
}

function pauseMusic() {
  audioPlayer.pause();
  isPlaying = false;
  toggleMusic.textContent = "▶";
  toggleMusic.setAttribute("aria-label", "Play music");
  trackStatus.textContent = "Paused";
}

function dockPlayer() {
  const mediaRect = heroMedia.getBoundingClientRect();
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const left = isMobile ? window.innerWidth / 2 : mediaRect.left + 24;
  const top = Math.max(72, mediaRect.top + 2);

  document.documentElement.style.setProperty("--player-left", `${left}px`);
  document.documentElement.style.setProperty("--player-top", `${top}px`);
  musicPlayer.classList.add("is-docked");
}

function revealSite() {
  siteShell.classList.add("is-ready");
  intro.classList.add("is-gone");

  window.setTimeout(() => {
    dockPlayer();
  }, 560);

  window.setTimeout(() => {
    playMusic();
  }, 3000);
}

function runIntro() {
  setTrack(0);
  const greetingTimer = window.setInterval(updateGreeting, 260);

  window.setTimeout(() => {
    window.clearInterval(greetingTimer);
    helloStage.classList.add("is-resolving");
  }, 2850);

  window.setTimeout(() => {
    musicPlayer.classList.add("is-born");
  }, 3180);

  window.setTimeout(revealSite, 4380);
}

toggleMusic.addEventListener("click", () => {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

muteMusic.addEventListener("click", () => {
  audioPlayer.muted = !audioPlayer.muted;
  muteMusic.textContent = audioPlayer.muted ? "Mute" : "Vol";
});

prevTrack.addEventListener("click", () => {
  const wasPlaying = isPlaying;
  setTrack(activeTrack - 1);
  if (wasPlaying) {
    playMusic();
  }
});

nextTrack.addEventListener("click", () => {
  const wasPlaying = isPlaying;
  setTrack(activeTrack + 1);
  if (wasPlaying) {
    playMusic();
  }
});

audioPlayer.addEventListener("ended", () => {
  setTrack(activeTrack + 1);
  playMusic();
});

window.addEventListener("resize", dockPlayer);
window.addEventListener("load", runIntro);
