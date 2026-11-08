import { announcePlay, formatTime, loadScript, pauseWhenHidden, reduceMotion, wait } from "./util.js";

// VHS rack + CRT TV. The YouTube player is created only after the first play.
export function initWatch() {
  const root = document.querySelector("[data-watch]");
  if (!root) return;

  const screen = root.querySelector("[data-tv-screen]");
  const tv = root.querySelector(".tv");
  const poster = root.querySelector("[data-tv-poster]");
  const playBtn = root.querySelector("[data-tv-play]");
  const spine = root.querySelector("[data-vcr-spine]");
  const label = root.querySelector("[data-vcr-label]");
  const slot = root.querySelector("[data-vcr-slot]");
  const osdState = root.querySelector("[data-osd-state]");
  const osdTime = root.querySelector("[data-osd-time]");
  const vcrState = root.querySelector("[data-vcr-state]");
  const vcrTime = root.querySelector("[data-vcr-time]");
  const tapes = [...root.querySelectorAll("[data-tape]")];

  let current = tapes.find((t) => t.classList.contains("is-playing")) || tapes[0];
  let player = null;
  let ready = null;
  let timer = null;
  let busy = false;

  const setState = (text) => {
    osdState.textContent = text;
    vcrState.textContent = text;
  };

  const tick = () => {
    if (!player?.getCurrentTime) return;
    const state = player.getPlayerState?.();
    if (state === 1) setState("PLAY");
    else if (state === 2) setState("PAUSE");
    else if (state === 3) setState("LOAD");
    const t = player.getCurrentTime();
    osdTime.textContent = formatTime(t, true);
    vcrTime.textContent = formatTime(t, true).replace(/^0/, "");
  };

  function ensurePlayer(videoId) {
    if (ready) return ready;
    ready = new Promise((resolve) => {
      window.onYouTubeIframeAPIReady = () => {
        player = new window.YT.Player("yt-player", {
          videoId,
          playerVars: { controls: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1 },
          events: {
            onReady: () => resolve(player),
            onStateChange: (e) => {
              const S = window.YT.PlayerState;
              if (e.data === S.PLAYING) {
                announcePlay("watch");
                setState("PLAY");
                clearInterval(timer);
                timer = setInterval(tick, 500);
              } else if (e.data === S.PAUSED) {
                setState("PAUSE");
              } else if (e.data === S.ENDED) {
                setState("STOP");
                clearInterval(timer);
              }
            },
          },
        });
      };
      loadScript("https://www.youtube.com/iframe_api");
    });
    return ready;
  }

  async function powerOn() {
    tv.classList.add("is-on");
    if (reduceMotion) return;
    screen.classList.add("is-static");
    await wait(450);
    screen.classList.remove("is-static");
    screen.classList.add("is-poweron");
    setTimeout(() => screen.classList.remove("is-poweron"), 600);
  }

  async function play(videoId) {
    setState("LOAD");
    const p = await ensurePlayer(videoId);
    if (p.getVideoData?.().video_id !== videoId) p.loadVideoById(videoId);
    else p.playVideo();
    await powerOn();
  }

  // The tape flies to just above the VCR, then slides down into the slot
  // and disappears behind the front panel (clipped at the slot line).
  async function insertAnimation(svg) {
    const from = svg.getBoundingClientRect();
    const slotBox = slot.getBoundingClientRect();
    const width = Math.min(slotBox.width - 24, 300);
    const scale = width / from.width;
    const height = from.height * scale;
    const tx = slotBox.left + (slotBox.width - width) / 2 - from.left;
    const ty = slotBox.top + slotBox.height / 2 - height - from.top;

    const ghost = document.createElement("div");
    ghost.className = "flying-tape";
    ghost.style.cssText = `left:${from.left}px;top:${from.top}px;width:${from.width}px;transform-origin:0 0;`;
    ghost.append(svg.cloneNode(true));
    document.body.append(ghost);

    const above = `translate(${tx}px, ${ty}px) scale(${scale})`;
    await ghost.animate(
      [
        { transform: "translate(0, 0) scale(1) rotate(0deg)" },
        { transform: `translate(${tx * 0.55}px, ${Math.min(ty, 0) - 70}px) scale(${(1 + scale) / 2}) rotate(-5deg)`, offset: 0.5 },
        { transform: `translate(${tx}px, ${ty - 14}px) scale(${scale}) rotate(0deg)`, offset: 0.85 },
        { transform: above },
      ],
      { duration: 820, easing: "cubic-bezier(.45,.05,.3,1)", fill: "forwards" }
    ).finished;

    await ghost.animate(
      [
        { transform: above, clipPath: "inset(0 0 0 0)" },
        { transform: `translate(${tx}px, ${ty + height}px) scale(${scale})`, clipPath: `inset(0 0 ${from.height}px 0)` },
      ],
      { duration: 520, easing: "cubic-bezier(.55,0,.8,.2)", fill: "forwards" }
    ).finished;
    ghost.remove();

    // Mechanical thunk when the tape seats
    slot.closest(".vcr").animate(
      [{ transform: "none" }, { transform: "translateY(3px)" }, { transform: "translateY(-1px)" }, { transform: "none" }],
      { duration: 220, easing: "ease-out" }
    );
  }

  async function insert(tape) {
    if (busy) return;
    if (tape === current) return play(tape.dataset.youtube);
    busy = true;
    const svg = tape.querySelector("svg");
    const previous = current;
    player?.pauseVideo?.();
    setState("EJECT");

    // Eject: the inserted tape pops up out of the slot and returns to the rack
    await spine.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(-140%)", opacity: 0 }], { duration: 320, easing: "ease-in", fill: "forwards" }).finished;
    previous.classList.remove("is-playing");
    previous.removeAttribute("aria-current");
    previous.querySelector("svg").animate([{ opacity: 0, transform: "translateY(-14px)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "ease-out" });

    tape.classList.add("is-playing");
    tape.setAttribute("aria-current", "true");
    current = tape;
    label.textContent = tape.dataset.label;
    poster.src = `https://i.ytimg.com/vi/${tape.dataset.youtube}/maxresdefault.jpg`;

    await insertAnimation(svg);
    spine.animate([{ transform: "translateY(-60%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 200, easing: "ease-out", fill: "forwards" });
    busy = false;
    await play(tape.dataset.youtube);
  }

  pauseWhenHidden(root, () => player?.getPlayerState?.() === 1 && player.pauseVideo(), "watch");

  tapes.forEach((t) => t.addEventListener("click", () => insert(t)));
  playBtn.addEventListener("click", () => play(current.dataset.youtube));

  root.querySelectorAll(".vcr [data-cmd]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const cmd = btn.dataset.cmd;
      if (cmd === "play") return play(current.dataset.youtube);
      if (!player) return;
      if (cmd === "pause") player.pauseVideo();
      if (cmd === "stop") {
        player.stopVideo();
        tv.classList.remove("is-on");
        setState("STOP");
        osdTime.textContent = "00:00:00";
        vcrTime.textContent = "0:00:00";
      }
      if (cmd === "rew") player.seekTo(Math.max(0, player.getCurrentTime() - 10), true);
      if (cmd === "ff") player.seekTo(player.getCurrentTime() + 10, true);
      tick();
    })
  );
}
