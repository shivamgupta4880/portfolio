# BUILD-PLAN.md — Shivam Gupta · Personal Brand Website

> **Master Build Plan.** Part I is the creative brief. Parts II–IV have the copy, design system, and implementation instructions for Claude Code.
> Source material: `Shivam_gupta5.pdf` (résumé, updated Oct 2026). It replaced the earlier QA-focused résumé, so the site was **repositioned to Software Engineer · Full Stack · DevOps**. There is also a structural reference Shivam supplied: a cinematic glass-UI portfolio where the hero video becomes the site, with a physics project playground and a contact form.
> Where Shivam left a detail open, the creative director made the call, and each call is labeled **[CD decision]**.

---

# PART I — CREATIVE BRIEF

## 1. Website Overview

| | |
|---|---|
| **Client** | Shivam Gupta |
| **Site type** | Personal brand + portfolio (career launch) |
| **Primary audience** | Engineering managers, tech recruiters, and founders hiring SDE, full-stack, or DevOps/cloud engineers |
| **Secondary audience** | Contract platforms (Turing and similar), peers, collaborators |
| **Primary goal** | Turn a visit into a message, i.e. an interview |
| **Secondary goals** | Live demo clicks, résumé download, GitHub / LinkedIn visits |
| **Location** | New Delhi, India. Open to remote work and relocation |
| **Links** | GitHub `github.com/shivamgupta4880` · LinkedIn `linkedin.com/in/shivam-5-gupta` · `shivamgupt4880@gmail.com` |
| **Format** | Cinematic one-page static site: `index.html`, `style.css`, `script.js`, `/assets` |

**The big idea [CD decision]: "Every scroll is a deploy."**
The site is staged as a CI/CD pipeline: it builds, it's tested, it ships, and it stays green. Shivam writes the code, the pipeline, and the monitoring, so the site proves the pitch by being a polished, fast, fully "deployed" product.

---

## 2. Core Positioning

**Positioning statement**
> For teams that need software built *and* running, Shivam Gupta is a software engineer who covers the full path from React UI to Kubernetes cluster. He builds full-stack apps, ships them through automated pipelines, and keeps them healthy in the cloud.

**Hero line**
> **I build it, ship it, and keep it running.**

**What I help people do**
> I help teams go from idea to production: full-stack features, CI/CD pipelines, and cloud infrastructure that stays green.

**Differentiators**
1. **Full path ownership.** Frontend (React), backend (Node, Express, Python), data (MongoDB, PostgreSQL, Redis), and infrastructure (Docker, Kubernetes, AWS, Terraform).
2. **Real production reps.** He's a Software Engineer at Turing, building Python backends that replicate Slack, Jira, Linear, Notion, and Gmail, each verified by 30+ automated tests per problem.
3. **Shipped, not just built.** Three projects are live: CompileHub (on EKS), DevChat (real-time), and a Nomad cluster on AWS.

---

## 3. Brand Personality

| Is | Is not |
|---|---|
| Builder-minded, calm, systematic | Cold or robotic |
| Confident, ships things | Arrogant or "rockstar ninja" |
| Technical, credible | Buzzword soup |
| Cinematic, premium, modern | Gimmicky or cluttered |
| Curious, a fast learner | Junior-sounding or apologetic |

**Voice:** short declarative lines in terminal rhythm, with dry wit and an occasional `monospace` aside such as `// pipeline: green`.
**Archetype:** The Engineer-Operator, someone who builds the machine and keeps it running.

---

## 4. Visual Direction

**Mood [CD decision]: "Midnight control room."** A dark void with a **deep violet ambient glow**, **Apple-style rounded glass UI**, film grain, and **huge kinetic typography**. Color carries meaning:
- **Violet glow** = the brand atmosphere.
- **Signal green** = healthy, passed, deployed.
- **Defect red-orange** = a failing build. It appears only at the three "fail → fixed" moments.

**Surfaces:** frosted glass panels (`backdrop-filter: blur(24px) saturate(160%)`), 1px light borders, 20–32px radii, like macOS / visionOS windows in a dark room.
**Texture:** animated film grain, faint scanlines on video, blurred violet light orbs.
**References:** Apple Pro product films, visionOS UI, Linear.app, Vercel / Railway dashboards, Awwwards SOTD portfolios.

---

## 5. Higgsfield Seedance 2.0 — Asset Generation

### 5.1 Identity reference
- **Reference image:** `Media/shivam-reference.jpg` (supplied, also used as the Story headshot at `assets/img/shivam.jpg`).
- Use it as the **identity reference for every generation with Shivam in it** (Scenes 2 and 3).
- **Wardrobe lock (matches the reference photo):** tailored navy two-piece suit, light blue shirt, dark navy patterned tie, short dark wavy hair, full trimmed beard. The same in every shot.

### 5.2 Global settings
| Setting | Value |
|---|---|
| Model | Higgsfield **Seedance 2.0** (image-to-video; identity reference for Scenes 2 & 3) |
| Resolution | **1080p** (1920×1080, 16:9) |
| Duration | **8–12 s** per clip (target 10 s) |
| Frame rate | 24 fps |
| Camera | Smooth, slow, motivated moves only. No handheld shake, cuts, or whip pans |
| Audio | None |
| Grade | Crushed blacks, deep violet ambient light (#7B5CFF family), emerald-green "healthy" accents (#3DFF9A), cool white key |
| Negative prompt | `text, captions, watermark, logos, brand names, extra fingers, distorted face, face morphing, cartoon, oversaturated, fast motion, camera shake, cuts, crowd` |

### 5.3 Format [CD decision]
**Three separate clips in one shared world.** Each is scrubbed by scroll in its own pinned act and **hands off into live HTML** (a match cut), so the video seems to become the website.

---

## 6. Three Cinematic Scenes

### Scene 1 — "THE BUILD" (Hero) → `assets/video/scene-1-hero-1080.mp4`
> A pitch-black void with a soft deep-violet glow. A sleek matte-black laptop glides in and opens toward the viewer. Glowing frosted-glass UI panels float in and assemble in mid-air into a clean website layout: a navigation bar, a headline block, cards, buttons. A thin emerald-green scan line sweeps across each panel as it locks into place, and a small green check mark blooms on each one. The camera slowly pushes into the laptop screen until it fills the center of the frame, straight-on and still. Premium Apple-product-film lighting, shallow depth of field, violet and emerald accents, 24fps, 1080p. Final 1.5 seconds: locked, straight-on shot of the glowing screen.

*Hand-off:* the real HTML hero (a glass browser window with **SHIVAM GUPTA**) sits exactly over the screen and expands to full viewport.

### Scene 2 — "THE OPERATOR" (into Featured Work) → `assets/video/scene-2-desk-orbit-1080.mp4`
> Night. Shivam (identity reference, navy suit) sits at a minimal dark desk in a violet-lit void, surrounded by floating frosted-glass panels showing CI/CD pipeline stages, Kubernetes pod dashboards, Grafana-style graphs, scrolling deploy logs, and API JSON. One pipeline panel flashes red-orange with a failed stage. He leans in, makes a small precise gesture, and it turns green. Camera does one slow, smooth 180° orbit around him and the desk, ending on a front view where the floating panels drift forward toward the lens. Cinematic, focused, calm confidence, 24fps, 1080p.

*Hand-off:* the drifting panels give way to the real HTML **project cards**, which drop into the glass browser "Deploy Board".

### Scene 3 — "ALL SYSTEMS GREEN" (Final CTA) → `assets/video/scene-3-handoff-1080.mp4`
> Shivam (identity reference, navy suit) walks slowly toward the camera down a long dark corridor of tall server racks with a glossy black floor. Every rack's status lights start amber and flip to green one by one as he passes. He stops, faces the camera with a slight warm smile, and holds out an opening laptop whose screen glows emerald green with a large check mark. The camera pushes slowly into the glowing screen until green light fills the frame. Welcoming, confident, premium, 24fps, 1080p.

*Hand-off:* the screen glow "blooms" (white-green radial flash) into the contact panel.

### 6.1 Post-processing pipeline (local ffmpeg)
```bash
# Desktop scrub version: every frame a keyframe for smooth seeking
ffmpeg -i in.mp4 -an -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 22 -g 1 -pix_fmt yuv420p -movflags +faststart scene-N-1080.mp4
# Mobile version: 720p, plays as a muted loop
ffmpeg -i in.mp4 -an -vf "scale=1280:-2" -c:v libx264 -crf 26 -g 48 -pix_fmt yuv420p -movflags +faststart scene-N-720.mp4
# Poster
ffmpeg -i in.mp4 -vframes 1 -q:v 3 scene-N-poster.jpg
```
Then set `<body data-videos="on">` in `index.html`.

---

# PART II — SITE ARCHITECTURE & COPY

## 7. Website Structure — the journey (9 acts)

| # | Act | ID | Media | Pin |
|---|---|---|---|---|
| — | Preloader: "Booting pipeline" | `#loader` | — | — |
| 1 | Hero: video becomes the site | `#top` | Scene 1 scrub → HTML | 260% |
| 2 | Stats strip | `.stats` | — | — |
| 3 | Mission: film title card | `#mission` | — | 170% |
| 4 | Three pillars | `.pillars` | — | — |
| 5 | Story: headshot + "Code → Cloud" | `#story` | headshot | 300% |
| 6 | Services: 2 cards + "Full Pipeline" bridge card | `#services` | live CI terminal | — |
| 7 | Featured work: Scene 2 → **Deploy Board** playground | `#work` | Scene 2 scrub → physics | 180% |
| 8 | Final CTA: Scene 3 blooms into contact | `#contact` | Scene 3 scrub → form | 200% |
| 9 | Footer | `footer` | — | — |

**Navigation:** a floating **glass pill nav** with `SG` · Work · Story · Services · Contact · **Hire me** (green status dot). It hides on scroll down and returns on scroll up. A progress line is labeled `deploy: NN%`.

---

## 8. Act 1 — Hero
1. **Scrub (0–60%):** Scene 1 plays with scroll. Captions: `// building…` → `// running 32 tests…` → `// deployed to production ✓`.
2. **Match cut (62–86%):** the glass window grows from the screen to full viewport while the stage scales up and fades.
3. **Live hero:** eyebrow `// Software Engineer · Full Stack · DevOps — New Delhi, IN`; **SHIVAM / GUPTA** (outline second line) at ~16.5vw; sub *"I **build it,** ship it, and keep it running."*; chips `react ✓ docker ✓ aws ✓`; buttons **See the work** / **Hire me**; status `● Open to SDE / DevOps roles — 2026`; window bar shows `pipeline: green`.
4. Intro row: `Shivam Gupta — Software Engineer · Full Stack & DevOps` · `scroll to deploy ▌`.

## 9. Act 2 — Stats Strip
| Value | Label |
|---|---|
| **6** | SaaS backends built at Turing (Slack · Jira · Linear · Notion · Gmail · Wiki) |
| **30+** | Automated tests per problem, verified in Docker |
| **3** | Projects live in production (CompileHub · DevChat · Nomad) |
| **3** | Certifications (SAP · Oracle AI · NPTEL) |

Ticker behind: `BUILD ✓ TEST ✓ DEPLOY ✓ FAIL ✗ → FIXED ✓ MONITOR ✓ …`

## 10. Act 3 — Mission
> **Software isn't done when it works on your machine.**
> ***It's done when it ships and stays up.***

Caption: `I write the code, the pipeline that ships it, and the dashboards that prove it's still healthy at 3 a.m.` The word "up." flickers red, then settles green.

## 11. Act 4 — Three Pillars
- **01 Build it right.** Clean full-stack code from the React UI to the REST API to the database, with auth that holds up: JWT, RBAC, sandboxed execution.
- **02 Ship it automatically.** If it's deployed twice, it should be a pipeline. Docker, GitHub Actions, Jenkins, and Terraform, so every push can reach production.
- **03 Keep it green.** Tests before merge, monitoring after deploy. 30+ test cases per problem, plus Prometheus, Grafana, and CloudWatch watching production.

## 12. Act 5 — Story: "Code → Cloud"
Headshot in a glass frame with a green scan line, corner ticks, and the caption `user: shivam.gupta ✓ authenticated`.
- **`2022` The Foundation:** B.Tech in CSE at LPU. DSA, OOP, OS, networks, system design.
- **`2026 · Jan` Real-Time:** DevChat on Socket.IO + JWT, containerized behind Nginx with CI/CD.
- **`2026 · Mar` Cloud-Native:** CompileHub with sandboxed execution, RBAC, EKS, Terraform/Ansible, Grafana/CloudWatch.
- **`2026 · Aug → now` In Production:** a Nomad cluster on AWS, then Software Engineer at Turing (Python backends replicating Slack, Jira, Linear, Notion, and Gmail, with 30+ tests each).

## 13. Act 6 — Services ("What you get when you hire me.")
- **S/01 Full-Stack Development:** React, Node/Express, Python, REST, Socket.IO, JWT · MongoDB, PostgreSQL, Redis.
- **S/02 DevOps & Cloud:** Docker, Kubernetes, AWS EC2/EKS, Terraform, Ansible, Nomad, Nginx, Jenkins, GitHub Actions.
- **The Full Pipeline** (bridge card): `Code → Build → Test → Deploy → Monitor`, plus four checks and a **live CI terminal** that runs `git push` → build ✓ → tests ✗ (bug found) → fix → tests ✓ → terraform ✓ → kubectl rollout to EKS ✓ → monitoring HEALTHY ✓ → `pipeline green in 4m 12s`. It has a **↻ re-run** button and is labeled `// demo run`.

## 14. Act 7 — Featured Work: the "Deploy Board"
Scene 2 scrubs under **SHIPPED / *& running.*** Then 5 physics cards drop into a glass browser (`https://shivam.gupta/work`, tab `Deploy Board`, hint `drag · throw · click to inspect`, watermark *"Go ahead, stress-test it."*):

| Card | Report contents | Links |
|---|---|---|
| **CompileHub** (Mar–May 2026) | Monaco + MERN, Docker sandboxing, JWT + RBAC, EKS microservices, GitHub Actions + Jenkins, Terraform + Ansible, Prometheus/Grafana/CloudWatch | [Live demo](https://compile-hub-psi.vercel.app/) · GitHub |
| **DevChat** (Jan–Mar 2026) | Socket.IO messaging, Express REST, JWT, optimized MongoDB, Docker + Nginx reverse proxy, CI/CD | [Live demo](https://dev-chat-wine.vercel.app/) · GitHub |
| **AWS Nomad Cluster** (Aug 2026) | Terraform on EC2 with tag-based auto-discovery, ACLs, Docker driver, CNI, security groups, Redis + web jobs via HCL | Nomad UI (`http://15.207.16.158:4646/ui`) · GitHub |
| **Turing** (Sep 2026 → now) | Python SaaS backends, REST and integrations, 30+ tests per problem in Docker, algorithm validation, CoT for LLM training data, problem statement curation | — |
| **Stack & Credentials** | Full skills list · SAP Data Analyst (Mar 2026) · Oracle AI (Aug 2026) · NPTEL Cloud Computing (Apr 2025), each linking to its certificate · B.Tech CSE, LPU 2022–26 | Certificate links |

Click → a glass "build report" dialog (bottom sheet on mobile). It's fixed-positioned with its own scrim, so it overlays correctly even if the browser doesn't promote it to the top layer. Mobile → snap carousel.

## 15. Act 8 — Final CTA
Scene 3 scrubs (racks flip green, the laptop is handed over), captions `// rolling out to production…` → `// all services healthy ✓`, then a bloom into the contact panel:
- **All systems green. *Let's ship something.***
- Email button (copies + opens `mailto:`) · **Download résumé** · **GitHub** · **LinkedIn**
- Form "// open a request" (Name, Email, Company, Type: Full-time role / Contract / Just saying hi, Message) → validates in-browser → opens a pre-filled email `[Portfolio] {Type} — {Name}`. No backend.

## 16. Act 9 — Footer
Giant fitted `SHIVAM GUPTA` wordmark, Navigate / Elsewhere / Status (live IST clock), the line ***"Built, shipped & monitored by me. Obviously."*** with `pipeline: green · uptime: ✓`. Easter egg: type `ship` and a `Shipped to production ✓` toast appears.

---

# PART III — DESIGN SYSTEM

## 17. Complete Visual Style Guide

### Color tokens
| Token | Value | Use |
|---|---|---|
| `--void` | `#06060A` | Page background |
| `--ink-900` | `#0D0D14` | Solid panels |
| `--ink-500` | `#6B6B7B` | Muted text |
| `--bone` | `#EEEDF2` | Primary text |
| `--violet` | `#7B5CFF` | Brand glow, orbs, focus rings |
| `--violet-soft` | `#A890FF` | Glass edge highlights, accent text |
| `--violet-deep` | `#2A1B6B` | Glow falloff |
| `--signal` | `#3DFF9A` | PASS: checks, status dots, success |
| `--defect` | `#FF4D2E` | FAIL: rare "bug caught" beats only |
| `--amber` | `#FFB547` | Pending states |
| `--glass-bg` | `rgba(255,255,255,0.055)` | Glass fill |
| `--glass-border` | `rgba(255,255,255,0.12)` | Glass 1px border |
| `--glass-hi` | `inset 0 1px 0 rgba(255,255,255,0.14)` | Glass top highlight |

Ratio: ~80% void and ink, ~12% bone, ~6% violet glow, ~2% signal; defect less than 0.5%.

### Glass recipe
```css
.glass{background:var(--glass-bg);border:1px solid var(--glass-border);
  backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);
  box-shadow:var(--glass-hi),0 30px 80px -20px rgba(0,0,0,.6);border-radius:28px}
```
Radii: windows 28px · cards 22px · chips/buttons 999px · inputs 14px.

### Atmosphere
- 2–3 blurred violet orbs (`filter: blur(120px)`) drift slowly behind content, with parallax tied to scroll.
- **Grain:** fixed full-screen animated noise overlay at 6–7% opacity, `pointer-events:none`.
- Scanlines on video sections at 3% opacity; a radial vignette on pinned acts.

### Layout
Base 8px · section padding `clamp(96px,14vw,220px)` · max width 1440px · gutters `clamp(16px,4vw,56px)` · 12-column grid.

---

## 18. Typography

| Role | Font (Google Fonts) | Settings |
|---|---|---|
| **Display** | **Inter Tight** 700/800 | `clamp(64px,17vw,300px)`, line-height .86, tracking −.045em, uppercase |
| **Editorial accent** | **Instrument Serif** Italic | Single emphasized words |
| **Body** | **Inter** 400/500 | 17–19px, line-height 1.55 |
| **Mono** | **JetBrains Mono** 400/500 | 12–14px labels (uppercase, +.08em), terminal 14px |

Scale: `display-xl 17vw · display-l 10vw · h2 clamp(40px,6vw,96px) · h3 clamp(22px,2.4vw,36px) · body 18px · mono 13px`.

**Kinetic rules:** a vanilla JS splitter for chars, words, and lines; line masks with `yPercent 110→0`, stagger .02, `expo.out`; scroll-scrubbed word illumination; letter-roll hover on links; the hero name tightens its tracking as it scales.

---

## 19. Animation Direction

- **Eases:** `expo.out` reveals · `power3.inOut` transitions · `none` for scrub timelines.
- **Durations:** micro .25s · UI .6s · reveals 1.1–1.4s · intro ~2.2s.
- **Preloader:** glass pill centered, mono counter `000→100`, lines `booting test suite…` → `24 checks ready` → the pill expands into a full-screen flash and reveals the hero.
- **Match cuts:** video→HTML hand-offs in Acts 1, 7, and 8 are the signature transitions.
- **Scan line motif:** a 2px green line with glow, used in the preloader, headshot inspection, and section dividers.
- **Bug→fix beats:** only three (mission word, terminal, Scene 2), so the motif stays special.
- **Reduced motion:** no pinning or scrubbing; posters replace video; instant fades; physics cards become a static grid.

---

## 20. Interaction Design

- **Inspector cursor:** a small ring with lerp follow. Over interactive elements it morphs into a **dashed bounding box** around the element with a mono tag (`button`, `card#compilehub`, `input[email]`). Disabled on touch.
- **Magnetic buttons** (strength .35), with a cursor-tracked violet glow on glass cards (`--mx/--my` radial gradient).
- **Physics playground:** drag, throw, and collisions; click to inspect; the mini-preview opens.
- **Terminal:** typed output, re-run.
- **Copy email** toast; **ticket form** with live validation (red ✗ → green ✓ per field).
- **Glass pill nav** with letter-roll links.
- **Easter egg:** typing `test` shows a full-screen `ALL 24 TESTS PASSED ✓` toast.

---

## 21. Scroll Behavior

- **Lenis** (`lerp .09`, desktop only) synced to GSAP: `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t=>lenis.raf(t*1000))`; `gsap.ticker.lagSmoothing(0)`.
- **Video scrubbing:** ScrollTrigger progress → target time; a rAF loop lerps `video.currentTime` toward it (factor .15) to avoid seek thrash.
- **Hero image sequence (optional):** if `assets/frames/hero/` exists, draw frames to canvas instead.
- **Progress meter** in the nav pill: `deploy: NN%`.
- **Anchor links:** `lenis.scrollTo(target,{duration:1.6})`.
- The physics loop runs only while `#work` is in view (IntersectionObserver).

---

## 22. Mobile Behavior (< 768px)

- Native scroll (no Lenis). Use `100svh` units.
- **Videos:** no scrubbing. 720p muted autoplay loops while in view; the match cuts become simple crossfades. Pin lengths drop to ~150vh.
- **Playground becomes a snap carousel:** horizontal `scroll-snap` glass cards; tapping one opens the mini-preview as a bottom sheet.
- Pillars and services stack vertically; the nav pill collapses to `SG` + menu button → full-screen glass menu.
- No custom cursor or tilt; tap targets ≥ 44px; grain 4%; violet orbs reduced to one.

---

# PART IV — TECHNICAL IMPLEMENTATION (for Claude Code)

## 23. File Structure
```
porfolio/
├── BUILD-PLAN.md
├── index.html
├── style.css
├── script.js
├── Media/
│   └── shivam-reference.jpg          # identity reference + headshot (from Shivam)
└── assets/
    ├── video/
    │   ├── scene-1-hero-1080.mp4        scene-1-hero-720.mp4        scene-1-poster.jpg
    │   ├── scene-2-desk-orbit-1080.mp4  scene-2-desk-orbit-720.mp4  scene-2-poster.jpg
    │   └── scene-3-handoff-1080.mp4     scene-3-handoff-720.mp4     scene-3-poster.jpg
    ├── frames/hero/                     # optional WebP sequence
    ├── img/ shivam.jpg  og-image.jpg
    ├── Shivam_Gupta_Resume.pdf
    └── favicon.svg
```

## 24. CDN Dependencies
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="script.js" defer></script>
```
One Google Fonts `<link>` (Inter, Inter Tight, Instrument Serif italic, JetBrains Mono) with `preconnect` + `display=swap`. **Physics is hand-written vanilla JS** (no Matter.js).

## 25. Video-Missing Fallback (required)
Videos don't exist yet, so the site must look finished without them:
- Each video act includes a `<canvas class="scene-fallback">` with a **procedural scene** in the brand palette, driven by the same scroll progress:
  - Scene 1: glass rectangles fly in and assemble a wireframe site, a scan line sweeps, check marks pop, and the camera "pushes in" (scale).
  - Scene 2: orbiting glass panels in 3D (projected), log lines, one red→green flip, and the panels drift toward camera.
  - Scene 3: a rectangle "screen" opens, a green glow grows, and a bloom.
- The `VideoScrubber` listens for `loadeddata` / `error`. On success, the video fades in over the canvas and the canvas loop stops. Video loading is gated by `<body data-videos="off|on">` so there are no 404s before the clips exist. To upgrade the site, drop the MP4s into `/assets/video/` and flip it to `on`.
- The headshot falls back to an SVG monogram avatar if `assets/img/shivam.jpg` is missing.

## 26. Physics Playground Spec (vanilla)
- Bodies are rectangles `{x,y,vx,vy,angle,av,w,h,el}` positioned via `transform: translate3d() rotate()`.
- Integration: gravity 1800px/s², linear damping .995/frame, angular damping .98, fixed timestep 1/60 with accumulator.
- Walls: restitution .45 with friction on the floor; card-card collisions use oriented bounding circles + a positional correction pass (2 iterations), which looks good and is cheap.
- Drag: pointer events with `setPointerCapture`. The body follows the pointer via a spring; on release, velocity comes from the last 80ms of pointer samples (clamped 2500px/s).
- Click (less than 6px movement and less than 250ms) opens a FLIP-animated mini-preview.
- Pause the simulation when offscreen or the tab is hidden; `prefers-reduced-motion` → static grid.

## 27. `script.js` Module Layout (single IIFE, commented sections)
1. config & feature detection (`isTouch`, `isMobile`, `reducedMotion`)
2. `splitText()`
3. `preloader()` → `intro()`
4. `initLenis()`
5. `initCursor()` (inspector), `initMagnetic()`, `initGlassGlow()`
6. `VideoScrubber` class + `SceneCanvas` class (3 procedural variants)
7. `initHero()` (scrub + match cut + kinetic name)
8. `initStats()`, `initMission()`, `initPillars()`
9. `initStory()` (headshot inspection + chapters)
10. `initServices()` + `Terminal` class
11. `initWork()` (Scene 2 scrub → `Playground` class / mobile carousel + `Preview` modal)
12. `initContact()` (Scene 3 scrub + bloom + copy email + ticket form → mailto)
13. `initNav()` (glass pill, hide/show, progress), `initFooter()` (IST clock, parallax)
14. Easter egg; `ScrollTrigger.refresh()` after fonts load and on debounced resize

## 28. Performance Budget
- HTML + CSS + JS (excluding CDN libraries and media) ≤ 140 KB. LCP = hero text/frame, **LCP < 2.0s**.
- Videos: `preload="metadata"`, upgraded to `auto` when one viewport away. Scene 1 1080p ≤ 8 MB, mobile ≤ 3 MB.
- Animate only `transform`, `opacity`, `clip-path`, `filter` (sparingly). Limit `backdrop-filter` to ≤ 6 large surfaces visible at once.
- Pause all rAF loops (canvases, physics, grain) when offscreen.
- Lazy-load images with explicit dimensions.

## 29. SEO, Accessibility, Sharing
- Title `Shivam Gupta — Software Engineer · Full Stack & DevOps`, meta description, OG/Twitter card, JSON-LD `Person`.
- Semantic landmarks; split text keeps `aria-label` with char spans `aria-hidden`; decorative video and canvas are `aria-hidden`.
- The playground is keyboard-accessible: cards are `<button>`s (Tab to focus, Enter to open the preview), and the preview is an accessible dialog (focus trap, Esc).
- Form fields have labels and `aria-live` error messages. Focus rings are violet, 2px with offset. Includes a skip link.
- No-JS: all content visible as plain stacked sections.

## 30. Open Items for Shivam
1. **Seedance clips:** generate Scenes 1–3 from §6 with `Media/shivam-reference.jpg`, run §6.1, then set `data-videos="on"`.
2. **Repo links:** each project report links to the GitHub profile. Swap in per-repo URLs when they're available.
3. **Nomad UI link** is a raw `http://` IP. Replace it with a domain/HTTPS, or remove it if the cluster is shut down.
4. **Phone number** is intentionally not shown on the site (it's still inside the downloadable résumé PDF).

## 31. Build Order
1. `index.html`: all acts with final copy, semantic, readable without JS.
2. `style.css`: tokens → base → glass system → acts → components → mobile → reduced-motion.
3. `script.js`: Lenis + GSAP → preloader + hero → acts in order → playground → contact.
4. Procedural fallback canvases for Scenes 1–3 and the SVG monogram avatar.
5. Test pass: desktop + 375px mobile, 0 console errors, keyboard navigation, reduced motion, videos missing vs. present, physics stress test.
6. When Seedance clips arrive: run the ffmpeg pipeline (§6.1), drop the files into `/assets/video/`, and tune the match-cut timing.
