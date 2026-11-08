// Content comes from Sanity at build time. If Sanity is unreachable (or
// SANITY_DISABLED=1), the site falls back to the JSON files in src/content.
// SANITY_DATASET picks the panel: "production" (default) or "staging" (hml).
import { readFileSync } from "node:fs";

const PROJECT_ID = "ig03yas6";
const DATASET = process.env.SANITY_DATASET || "production";
const API_VERSION = "2025-01-01";

const QUERY = `{
  "settings": *[_id == "settings"][0]{ ..., "shareImage": shareImage.asset->url },
  "watch": *[_id == "watch"][0],
  "music": *[_id == "music"][0],
  "gallery": *[_id == "gallery"][0]{ photos[]{ alt, featured, hotspot, "url": asset->url } },
  "live": *[_id == "live"][0],
  "store": *[_id == "store"][0]{ ..., photos[]{ alt, framing, hotspot, "url": asset->url } },
  "storytelling": *[_id == "storytelling"][0]{ ..., members[]{ name, bio, "photo": photo{ alt, hotspot, "url": asset->url } } },
  "join": *[_id == "join"][0]
}`;

const local = (name) => JSON.parse(readFileSync(new URL(`../src/content/${name}.json`, import.meta.url)));

let cached;
export function getCMS() {
  cached ??= load();
  return cached;
}

async function load() {
  if (process.env.SANITY_DISABLED === "1") return null;
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { result } = await res.json();
    if (!result?.settings) throw new Error("no content published yet");
    return result;
  } catch (err) {
    console.warn(`[cms] Sanity unavailable (${err.message}); using local content.`);
    return null;
  }
}

export { local };

export const youtubeId = (url = "") =>
  (url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) || [])[1] || url;

export const spotifyId = (url = "") => (url.match(/track[/:]([A-Za-z0-9]{22})/) || [])[1] || url;

// Sanity image CDN: resized WebP
export const img = (url, width) => `${url}?w=${width}&fm=webp&q=80&fit=max`;

export const focal = (hotspot) => (hotspot ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%` : "");
