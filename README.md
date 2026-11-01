# Time Federation

Official website of Time Federation. Static site built with [Eleventy](https://www.11ty.dev/) (HTML, CSS and vanilla JavaScript), published on Netlify. English at `/en/`, Portuguese at `/pt/`.

## Run locally

Requirements: Node.js 22 or newer.

```bash
npm install        # first time only
npm run dev        # http://localhost:8080/en/
npm run preview    # same, but also shows sections that are switched off (Store, Live)
npm run build      # production build in _site/
```

## Content

All content lives in `src/_data/`:

| File | What it controls |
| --- | --- |
| `watch.json` | Live set and documentary episodes (YouTube IDs, labels, titles) |
| `music.json` | Releases shown as cassettes (Spotify track IDs), newest first |
| `gallery.json` | Gallery photos (files in `src/assets/img/gallery/`) |
| `store.json` | Jacket product and Shopify link. `"enabled": false` hides the section |
| `live.json` | Shows. `"enabled": false` hides the section |
| `booking.json` | WhatsApp number and default message |
| `i18n.json` | Interface text in English and Portuguese |
| `site.json` | Social links and general info |

These files will later be filled by the Sanity CMS, using the same structure.

## Hosting notes

Only three parts depend on Netlify:

- Booking form: Netlify Forms (`data-netlify` in `src/_includes/partials/booking-form.njk`). Set the recipient email in Netlify → Forms → Notifications.
- Language redirect from `/`: `netlify.toml`.
- Build settings: `netlify.toml`.

The `legacy-site/` folder keeps the previous version of the site for reference. It is not published.
