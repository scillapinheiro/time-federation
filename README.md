# Time Federation

Official website of **Time Federation**, an electronic music trio whose identity mixes 80s synthesizers, synthwave aesthetics and time travel. The site is the band's hub for fans and event bookers: videos, music, photos, merch, tour dates and booking.

> **Em português:** site oficial do trio Time Federation. Feito com Eleventy (HTML, CSS e JavaScript puro), conteúdo gerenciado no Sanity e publicado na Netlify. Bilíngue (inglês e português), mobile first, com animações inspiradas em mídias dos anos 80: fitas VHS, fitas cassete e painéis de aeroporto.

## Highlights

- **Home:** a time tunnel that never stops moving, with the official hourglass drawing itself on load and a 1980 to NOW timeline.
- **Watch:** every video is a VHS tape. Pick one and it flies into the VCR, the CRT TV turns on with static and the video plays with custom controls (YouTube IFrame API).
- **Music:** every release is a cassette. It drops into the boombox and plays through Spotify's official embed, with spinning reels and a live equalizer driven by playback state.
- **Gallery:** mosaic with a keyboard and swipe friendly lightbox.
- **Live:** a split-flap departures board that flips into place when it comes into view, with upcoming and past shows.
- **Store:** product page that hands checkout over to Shopify.
- **Booking:** WhatsApp or a form handled by Netlify Forms.

Only one player plays at a time, and video or music pauses when its section leaves the screen. Long racks of tapes become carousels that always show a slice of what comes next.

## Stack

| Layer | Choice |
| --- | --- |
| Site | [Eleventy 3](https://www.11ty.dev/) with Nunjucks, plain CSS and vanilla JavaScript (ES modules), no framework |
| Content | [Sanity](https://www.sanity.io/) (Studio in `studio/`) with local JSON fallback |
| Hosting | Netlify (builds, deploy previews, forms) |
| Media | YouTube IFrame API, Spotify iFrame API, Sanity image CDN (WebP, resized per screen) |

## How content flows

```
Editor publishes in Sanity Studio
  > Sanity webhook calls a Netlify build hook
  > Eleventy fetches all content in one GROQ query at build time
  > static pages for /en/ and /pt/ are published
```

If Sanity cannot be reached, the build falls back to the JSON files in `src/content/`, so the site never breaks.

## Design and engineering decisions

- **Mobile first,** with dedicated layouts for tablet (768px) and desktop (1200px). Desktop sections fit the viewport; content-heavy ones grow naturally.
- **Bilingual by URL** (`/en/`, `/pt/`), with the visitor's language detected at the root.
- **Performance:** no framework runtime, players load only on first play, images come resized and in WebP from the CDN, background art is lightweight SVG.
- **Accessibility:** semantic HTML, keyboard support, visible focus, labelled controls, and `prefers-reduced-motion` respected without removing the storytelling animations (looping, pulsing and flashing effects are turned off; tape insertion and the hourglass drawing stay).
- **Feature flags:** Store and Live can be switched on or off from the CMS. Netlify deploy previews always show them for review.

## Project structure

```
src/
  _data/         data files (read Sanity, fall back to src/content)
  _includes/     layout and one partial per section
  assets/        css, js modules, images and background svgs
  content/       local fallback content (JSON)
studio/          Sanity Studio: schemas and desk structure
lib/cms.js       Sanity query and helpers
netlify.toml     build, redirects and deploy contexts
```

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev        # http://localhost:8080/en/
npm run preview    # also shows sections switched off in production
npm run build      # production build in _site/
```

Set `SANITY_DISABLED=1` to build from the local JSON content only.

Sanity Studio:

```bash
cd studio
npm install
npm run dev        # http://localhost:3333
npm run deploy     # publish the Studio after schema changes
```

## Environments

| Branch | Purpose |
| --- | --- |
| `main` | Production |
| `hml` | Staging, mirrors production |
| feature branches | Pull requests into `hml` get a Netlify deploy preview |

Secrets (Spotify credentials) live in Netlify environment variables, never in the repository.

## Credits

Design and development by Priscilla Pinheiro for Time Federation.

## License

The source code is released under the [MIT License](LICENSE).

The Time Federation name, logo, photography, music and other brand assets are © Time Federation, all rights reserved, and are **not** covered by the MIT License.
