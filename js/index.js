let title = document.getElementById("title");

// Button variables
let play_btn = document.getElementById("play-btn");
let pause_btn = document.getElementById("pause-btn");
let next_btn = document.getElementById("next-btn");
let previous_btn = document.getElementById("previous-btn");

// Music element
let music = document.getElementById("music");

// Song info
let currentTimeText = document.getElementById("current-time");
let durationTxt = document.getElementById("duration");
let songTitle = document.getElementById("song-title");
let songArtist = document.getElementById("song-artist");
let songCover = document.getElementById("song-cover");
let currentSong = NaN; // Current song object
let songIndex = 0; // Current song index

// Timebar
let timeBar = document.getElementById("time-bar");
let timerPressed = false;
let currentTime = 0;

let getRandomSong = () => {
  let randomSong = Math.floor(Math.random() * musicInfo.length);
  currentSong = musicInfo[randomSong];
  songIndex = randomSong;
  music.src = currentSong.src;
};

let segundosAMinutos = (segundos) => {
  let minutos = Math.floor(segundos / 60);
  let segundosRestantes = Math.floor(segundos % 60);

  // Agrega ceros delante si es necesario
  if (segundosRestantes < 10) {
    segundosRestantes = "0" + segundosRestantes;
  }

  return `${minutos}:${segundosRestantes}`;
};

let nextSong = () => {
  if (songIndex === musicInfo.length - 1) {
    songIndex = 0;
  } else {
    songIndex++;
  }

  currentSong = musicInfo[songIndex];
  music.src = currentSong.src;
  music.play();
};

// Button listeners
play_btn.addEventListener("click", () => {
  music.play();
});
pause_btn.addEventListener("click", () => {
  music.pause();
});
next_btn.addEventListener("click", nextSong);
previous_btn.addEventListener("click", () => {
  if (music.currentTime < 3) {
    if (songIndex === 0) {
      songIndex = musicInfo.length - 1;
    } else {
      songIndex--;
    }

    currentSong = musicInfo[songIndex];
    music.src = currentSong.src;
    music.play();
  } else {
    music.currentTime = 0;
  }
});

// Music listeners
music.addEventListener("timeupdate", () => {
  currentTimeText.textContent = segundosAMinutos(music.currentTime);
  if (!timerPressed) {
    timeBar.value = music.currentTime;
  }
});
music.addEventListener("loadedmetadata", () => {
  currentTimeText.textContent = segundosAMinutos(music.currentTime);
  durationTxt.textContent = segundosAMinutos(music.duration);

  title.textContent = currentSong.song + " - " + currentSong.artist;
  songTitle.textContent = currentSong.song;
  songArtist.textContent = currentSong.artist;
  songCover.src = currentSong.img;
  timeBar.max = Math.floor(music.duration);
});
music.addEventListener("ended", nextSong);
music.addEventListener("play", () => {
  pause_btn.classList.remove("hide");
  play_btn.classList.add("hide");
});
music.addEventListener("pause", () => {
  pause_btn.classList.add("hide");
  play_btn.classList.remove("hide");
});

// Timebar listeners and functions
let updateTimerPosition = (event) => {
  const posicionX = event.clientX - timeBar.offsetLeft;
  currentTime = (posicionX * music.duration) / timeBar.offsetWidth;
  currentTime = currentTime > music.duration ? music.duration : currentTime;

  timeBar.value = currentTime;
};

timeBar.addEventListener("mousedown", (event) => {
  timerPressed = true;
  updateTimerPosition(event);
});

document.addEventListener("mouseup", () => {
  if (timerPressed) {
    music.currentTime = currentTime;
    timerPressed = false;
  }
});

document.addEventListener("mousemove", (event) => {
  if (timerPressed) {
    updateTimerPosition(event);
  }
});

getRandomSong();
