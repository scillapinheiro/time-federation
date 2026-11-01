import { announcePlay, formatTime, loadScript, pauseWhenHidden, reduceMotion } from "./util.js";

// Cassette rack + boombox. Playback uses Spotify's official embed and its iFrame API.
export function initMusic() {
  const root = document.querySelector("[data-music]");
  if (!root) return;

  const box = root.querySelector("[data-boombox]");
  const door = root.querySelector("[data-bb-door]");
  const tapeSlot = root.querySelector("[data-bb-tape]");
  const stateEl = root.querySelector("[data-bb-state]");
  const titleEl = root.querySelector("[data-bb-title]");
  const timeEl = root.querySelector("[data-bb-time]");
  const tapes = [...root.querySelectorAll("[data-tape]")];

  let current = tapes.find((t) => t.classList.contains("is-playing")) || tapes[0];
  let controller = null;
  let ready = null;
  let position = 0;
  let busy = false;
  let playing = false;

  const uri = (tape) => `spotify:track:${tape.dataset.spotify}`;

  function typeTitle(text) {
    if (reduceMotion) return (titleEl.textContent = text);
    titleEl.textContent = "";
    [...text].forEach((ch, i) => setTimeout(() => (titleEl.textContent += ch), i * 35));
  }

  function ensureController() {
    if (ready) return ready;
    ready = new Promise((resolve) => {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        box.classList.add("has-embed");
        IFrameAPI.createController(
          document.getElementById("spotify-embed"),
          { uri: uri(current), width: "100%", height: 80, theme: "dark" },
          (c) => {
            controller = c;
            c.addListener("playback_update", (e) => {
              const { isPaused, position: pos, duration } = e.data;
              position = pos / 1000;
              timeEl.textContent = formatTime(position);
              const nowPlaying = !isPaused && pos > 0;
              if (nowPlaying && !playing) announcePlay("music");
              playing = nowPlaying;
              box.classList.toggle("is-playing", nowPlaying);
              stateEl.textContent = isPaused ? (pos === 0 ? "STOP" : "PAUSE") : "PLAY";
              if (duration && pos >= duration) stateEl.textContent = "STOP";
            });
            c.addListener("ready", () => resolve(c));
          }
        );
      };
      loadScript("https://open.spotify.com/embed/iframe-api/v1");
    });
    return ready;
  }

  async function play(tape) {
    stateEl.textContent = "LOAD";
    const c = await ensureController();
    c.loadUri(uri(tape));
    c.play();
  }

  const lid = root.querySelector("[data-bb-lid]");
  const anim = (el, frames, duration, easing = "ease-out") =>
    el.animate(frames, { duration, easing, fill: "forwards" }).finished;

  // Lid opens, the old cassette lifts out, the new one flies over the deck,
  // drops into the compartment and the lid closes.
  async function swapAnimation(svg) {
    await anim(lid, [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-70deg)" }], 260);
    await anim(tapeSlot, [{ transform: "none", opacity: 1 }, { transform: "translateY(-115%)", opacity: 1 }], 360, "ease-in");
    tapeSlot.style.opacity = "0";

    const from = svg.getBoundingClientRect();
    const to = tapeSlot.getBoundingClientRect();
    const scale = to.width / from.width;
    const tx = to.left - from.left;
    const ty = to.top - from.top;
    const lift = to.height * 1.25;

    const ghost = document.createElement("div");
    ghost.className = "flying-tape";
    ghost.style.cssText = `left:${from.left}px;top:${from.top}px;width:${from.width}px;transform-origin:0 0;`;
    ghost.append(svg.cloneNode(true));
    document.body.append(ghost);
    await anim(
      ghost,
      [
        { transform: "translate(0, 0) scale(1) rotate(0deg)" },
        { transform: `translate(${tx * 0.5}px, ${Math.min(ty, 0) - 80}px) scale(${(1 + scale) / 2}) rotate(4deg)`, offset: 0.5 },
        { transform: `translate(${tx}px, ${ty - lift}px) scale(${scale}) rotate(0deg)` },
      ],
      760,
      "cubic-bezier(.45,.05,.3,1)"
    );
    await anim(ghost, [{ transform: `translate(${tx}px, ${ty - lift}px) scale(${scale})` }, { transform: `translate(${tx}px, ${ty}px) scale(${scale})` }], 380, "cubic-bezier(.55,0,.8,.2)");

    tapeSlot.replaceChildren(svg.cloneNode(true));
    tapeSlot.getAnimations().forEach((a) => a.cancel());
    tapeSlot.style.opacity = "";
    ghost.remove();

    await anim(lid, [{ transform: "rotateX(-70deg)" }, { transform: "rotateX(0deg)" }], 220, "ease-in");
    lid.getAnimations().forEach((a) => a.cancel());
    box.animate([{ transform: "none" }, { transform: "translateY(3px)" }, { transform: "translateY(-1px)" }, { transform: "none" }], { duration: 220, easing: "ease-out" });
  }

  async function insert(tape) {
    if (busy) return;
    if (tape === current) return play(tape);
    busy = true;
    controller?.pause();
    box.classList.remove("is-playing");
    stateEl.textContent = "EJECT";
    const svg = tape.querySelector("svg");
    const previous = current;
    tape.classList.add("is-playing");

    if (!reduceMotion) await swapAnimation(svg);
    else tapeSlot.replaceChildren(svg.cloneNode(true));

    previous.classList.remove("is-playing");
    previous.removeAttribute("aria-current");
    if (!reduceMotion) previous.querySelector("svg").animate([{ opacity: 0, transform: "translateY(-14px)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "ease-out" });
    tape.classList.add("is-playing");
    tape.setAttribute("aria-current", "true");
    current = tape;
    typeTitle(tape.dataset.label);
    timeEl.textContent = "00:00";
    busy = false;
    await play(tape);
  }

  pauseWhenHidden(root, () => playing && controller?.pause(), "music");

  tapes.forEach((t) => t.addEventListener("click", () => insert(t)));

  root.querySelectorAll(".boombox [data-cmd]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const cmd = btn.dataset.cmd;
      if (cmd === "play") {
        if (controller) return controller.resume();
        return play(current);
      }
      if (!controller) return;
      if (cmd === "pause") controller.pause();
      if (cmd === "stop") {
        controller.pause();
        controller.seek(0);
      }
      if (cmd === "rew") controller.seek(Math.max(0, position - 10));
      if (cmd === "ff") controller.seek(position + 10);
    })
  );
}
