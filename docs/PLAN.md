# SABBIR — Portfolio Plan (research → decisions)

> Video Editor × Motion Designer. Orange-accented, editorial-cinematic portfolio with a real admin panel.
> Status: decisions locked, build in progress.

---

## 1. What the research says (2026)

Sources reviewed: [Envato — Portfolio design trends 2026](https://elements.envato.com/learn/portfolio-trends),
[Studio portfolio conversion review of 400 sites](https://d1s1.com/blog/portfolio-best-practices-for-studios),
[Portfoliobox — features of a high-converting portfolio](https://www.portfoliobox.com/magazine/online-portfolio-website-general),
plus current award-site patterns (headless motion reels, dark editorial layouts, kinetic type).

**Signals that matter for a video/motion portfolio**

| Trend | What it means for Sabbir |
| --- | --- |
| Motion-first, cinematic UX | Video must be *the* interface: hover-preview loops, a reel lightbox, poster frames that look graded. |
| Quiet minimalism + rich detail | Restrained layout, hairlines and micro-details, micro-interactions, and immaculate type do the talking. |
| Dark mode as default | Work reads better on dark; light mode still required for client comfort → dual theme, both fully designed (not inverted). |
| Colour branding over decoration | One accent (ember orange) used sparingly and consistently — logo, active states, CTA, playhead. |
| Personal branding / editorial layout | Name as wordmark, oversized type, serif-italic accents, Swiss grid, generous whitespace. |
| Performance = craft | Creatives judge sites by feel. Cheap bundles, pre-rendered HTML, filesize discipline. |
| Case-study depth beats image dumps | Project pages with role, tools, outcome, and a next-project link convert better than a grid alone. |

**Insight:** most video portfolios are either beautiful-but-static (no previews) or heavy template sites. The gap: a
*cinematic, near-instant* site with a genuinely usable CMS behind it.

---

## 2. Decisions

### Stack
- **Next.js 16 (App Router) + React 19 + TypeScript** — static-rendered public pages, server routes only for the admin.
- **Tailwind CSS v4** with an OKLCH-free, warm semantic token layer (`--bg`, `--ink`, `--accent`…) so theming is one file.
- **Zero animation libraries.** No Framer Motion, no GSAP, no Lenis. Motion is CSS transitions/keyframes driven by a single
  1 KB IntersectionObserver — 60 fps, no main-thread work, no bundle cost.
- **Self-hosted fonts** (Inter Tight variable + Instrument Serif, latin subset, `woff2`, ~136 KB total, `font-display: swap`).
- **No icon library.** A hand-drawn 16-icon stroke set (1.5px, 24px grid) = consistent, zero KB.
- **Content = `data/content.json`** read/written on the server, atomic writes. No database to install, no native deps;
  the whole site is portable and diff-able. Admin panel is a thin, typed CRUD layer over it.

### Visual direction — "Ember Editorial"
- **Palette (orange)**
  - Ember `#FF5A1A` (dark) / `#E5450B` (light) — the only saturated colour.
  - Warm black `#0B0A09`, warm paper `#F8F5F0`, not pure `#000/#FFF` — feels graded, not template-ish.
  - Accent ink is near-black on orange buttons (AA in both themes).
- **Type**
  - Display/UI: **Inter Tight** 600, tracking −0.045em, line-height 0.92 — tight, modern, Swiss.
  - Accent: **Instrument Serif italic** for one or two words per section — the "editorial wink".
  - Micro-labels: system monospace, 11px, letter-spacing .18em, uppercase — timecode/technical texture.
- **Layout**
  - 1320px max container, `clamp()` gutters, centered hero + centered section headers, hairline 1px rules.
  - 12-column grid; asymmetric bento work grid (7/5, 5/7, 6/6) so it never looks like a template.
  - Every centred block uses `mx-auto` + `text-wrap: balance` so optical alignment is exact.
- **Texture**: hairline rules, radial ember glow, soft card shadows — richness with no image cost.

### Signature elements
1. **Logo** — a bold signature "S" (Instrument Serif italic, outlined to one filled path) paired with
   the `SABBIR` wordmark, an em-dash `PORTFOLIO` label and `EDIT / MOTION`. Favicon = the same S. (SVG, theme-aware.)
2. **Preloader** — 0.9 s, session-only: counter + logo draw + curtain wipe. Never blocks the paint of content.
3. **Hero** — oversized centred statement, serif-italic accent word, ember spotlight following the pointer,
   availability pill, dual CTA, then a full-bleed reel strip.
4. **Hover-preview work cards** — muted looping clips load *only on hover* (`preload=none`), poster-first otherwise.
5. **Reel lightbox** — lazy video/YouTube/Vimeo embed, ESC + backdrop close, scroll lock, focus return.
6. **Marquee bands** — tools/skills, CSS transform-only, opposite directions, hairline framed.
7. **Project pages** — poster hero, meta grid, chapters, gallery, "next project" card.

### Site map
`/` Home (hero, reel, work, services, process, stats, testimonials, about, contact) · `/work` archive ·
`/work/[slug]` case study · `/admin` CMS.

### Admin panel (`/admin`)
Password → signed HttpOnly cookie (HMAC, 7 days). Sections:
**Overview** (counters, recent messages) · **Projects** (full editor: title, slug, category, client, year, tools,
summary, body, video URL, poster, gallery, featured, reorder) · **Services** · **Testimonials** ·
**Messages** (contact inbox, read/delete) · **Media library** (upload, copy path, delete) · **Settings**
(identity, role, tagline, availability, socials, SEO, accent presets).
Edits persist to `data/content.json` + `public/uploads/`, then `revalidatePath` refreshes the public site instantly.

### Performance budget
- Public page JS ≈ 30–40 KB gzip total (React + Next runtime + a few KB of interaction code).
- LCP target < 1.5 s on broadband; images `loading="lazy"` + `decoding="async"` with fixed aspect ratios (no CLS).
- Hero copy is server HTML; animations never gate content. `prefers-reduced-motion` disables all transforms.
- Videos: poster-first, `preload="none"`, hover-only, < 600 KB loops.

### Accessibility & craft
WCAG AA colour pairs in both themes · visible focus rings · semantic landmarks · keyboard-navigable lightbox/menu ·
`aria-label`s on icon buttons · both themes remember choice and respect `prefers-color-scheme`.

---

## 3. Build order

1. Tokens, fonts, logo, icons.
2. Legacy-free layout shell: theme boot script, preloader, nav, footer.
3. Home sections + shared motion primitives.
4. Work archive, case-study pages, SEO/metadata, OG image.
5. Content store, auth, API routes, upload handling.
6. Admin UI (7 screens) + forms + validation + toasts.
7. Motion assets (procedural mp4 loops via ffmpeg), posters.
8. Build, Lighthouse-style checks, real-browser screenshots (dark/light/mobile/admin), README.

**Customisation promise:** one JSON file, one CSS token block, one logo SVG — change those and the brand changes.
Credentials and secret live in `.env.local`, never in code.

---

## Revision 2 — portrait-led redesign (reference-aligned)

After the first build the client supplied a portrait poster and a reference layout. Decisions:

**Adopted from the reference**
- Hero with the person on stage: left copy, portrait card right, floating pill tags, a rotating
  circular availability badge, "Open for work" caption, and a rating + avatar trust row.
- Bold inverted marquee band (capabilities with orange `+` separators) — black band on light,
  cream band on dark.
- Numbered services accordion: one dark expanded card (tags, description, image, CTA) and quiet
  collapsed rows, replacing the hover-expand list.
- Circular about portrait with an ember blob, a floating "50+ happy clients" card and the
  "Who is Sabbir?" headline.
- Split section headers (title left, description right) for services and testimonials.

**Portrait treatment**
The supplied image is a poster with baked-in typography, and the client asked that skin and hair
stay natural rather than being tinted. Final approach: cut the subject out with `rembg`
(u2net), keep the original colour with a light contrast pass, and composite him onto a warm
charcoal studio backdrop with a soft ember halo. The theme is carried by the frame, not the face.
Two crops are produced (4:5 hero, square about). `scripts/cutout_portrait.py` is reproducible.

**Corrected / hardened**
- Content aligned with the real poster: 2+ years, 50+ clients; bio and hero copy updated.
- Accent reset to ember (a stale `coral` value was still in the content store).
- Mobile hero rebuilt: message → actions → portrait (no longer split mid-sentence), shorter intro
  on small screens, compact frosted nav pill, theme switch moved into the menu, left-aligned
  section headers, horizontally scrolling filters, client table, toolkit grid, two-column footer.
- Header pill made near-opaque with a stronger backdrop blur (requested).
- Fixed badge ring text overflow (two-arc text paths), removed a floating chip that collided with
  the portrait CTA, hid marquee dividers that wrapped badly on mobile, fixed the admin login glow
  causing 96px horizontal overflow, and stopped the logo sub-label wrapping at 360px.
- Verified no horizontal overflow at 360/390/480/768/1024/1280/1440/1920 on home, work, case
  study and admin login; light-mode button contrast confirmed (near-black on ember).

---

## Revision 3 — AMOLED revert, performance, final polish

- **Cinematic layer removed.** The ambient page wash, lens vignette, gradient text, gradient
  buttons/panels and hero light leaks were reverted; the dark theme is now true AMOLED black
  (`#000000`) with flat `#0A0A0A` surfaces and solid ember accents. Light mode untouched.
- **Scroll performance fixed.** Removed `background-attachment: fixed`, the animated full-screen
  grain layer, all decorative `filter: blur()` layers and backdrop blurs. Merged the grain
  into a flat surface layer, dropped permanent `will-change`, and reduced the nav glass to a
  14px blur (none below 768px). Measured 60 fps (p95 16.8 ms) at 4× CPU throttle.
- **Portrait edges.** `rembg` + alpha matting (isnet model), edge decontamination and a corner
  fade remove poster remnants; skin and hair stay natural, the background becomes a clean studio
  backdrop.
- **Reel band.** Four stills + the capability ticker now share one dark band; the ticker sits in a
  symmetrically padded footer strip so the band no longer looks bottom-heavy.
- **Contact** rebuilt as a split panel: message + direct line + studio facts on the left, a brief
  form with project-type chips on the right, submit row anchored to the bottom.
- Availability dots now use the ember accent instead of green.
