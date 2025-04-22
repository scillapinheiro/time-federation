let currentIndex = 0;
const playerIds = ["player1", "player2", "player3"];
const players = {};

function onYouTubeIframeAPIReady() {
  playerIds.forEach((id) => {
    players[id] = new YT.Player(id);
  });
}

function pauseAllVideos() {
  for (let id in players) {
    const player = players[id];
    if (player.pauseVideo) {
      player.pauseVideo();
    }
  }
}

function updateCarousel() {
  const carousel = document.querySelector(".carousel");
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  pauseAllVideos();
}

function nextVideo() {
  const totalVideos = playerIds.length;
  if (currentIndex < totalVideos - 1) {
    currentIndex++;
    updateCarousel();
  }
}

function prevVideo() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
}
