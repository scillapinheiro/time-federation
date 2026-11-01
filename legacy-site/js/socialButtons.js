const links = [
  {
    href: "https://open.spotify.com/intl-pt/artist/7xo7nFvxIFTkg5A1AxYA1j?si=qLXETqfSQkCZGvDyAv_9Eg",
    icon: "../assets/img/spotify.svg",
    label: "Spotify",
  },
  {
    href: "https://www.instagram.com/timefederation",
    icon: "../assets/img/instagram.svg",
    label: "Instagram",
  },
  {
    href: "https://soundcloud.com/timefederationlive",
    icon: "../assets/img/soundcloud.svg",
    label: "SoundCloud",
  },
  {
    href: "https://www.youtube.com/@Timefederation",
    icon: "../assets/img/youtube.svg",
    label: "YouTube",
  },
];

function renderLinks() {
  const container = document.querySelector(".social-links");
  container.innerHTML = "";

  links.forEach((link) => {
    const a = document.createElement("a");
    a.className = "btn";
    a.href = link.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    const img = document.createElement("img");
    img.src = link.icon;
    img.alt = link.label;

    const span = document.createElement("span");
    span.textContent = link.label;

    a.appendChild(img);
    a.appendChild(span);
    container.appendChild(a);
  });
}

document.addEventListener("DOMContentLoaded", renderLinks);
