const videos = [
  {
    id: "player1",
    src: "https://www.youtube.com/embed/mDSPfOSdiv8?enablejsapi=1",
  },
  {
    id: "player2",
    src: "https://www.youtube.com/embed/U9acjGKBoSc?enablejsapi=1",
  },
  {
    id: "player3",
    src: "https://www.youtube.com/embed/97XBzjk8Tkw?enablejsapi=1",
  },
];

function renderVideos() {
  const carousel = document.querySelector(".carousel");
  carousel.innerHTML = "";
  videos.forEach((video) => {
    const iframe = document.createElement("iframe");
    iframe.id = video.id;
    iframe.src = video.src;
    iframe.title = "YouTube video player";
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    iframe.width = "100%";
    iframe.height = "100%";
    carousel.appendChild(iframe);
  });
}

document.addEventListener("DOMContentLoaded", renderVideos);
