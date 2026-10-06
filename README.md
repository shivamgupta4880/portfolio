# portfolio

Personal portfolio of **Shivam Gupta**, a Software Engineer working across full stack and DevOps.

A cinematic, single-page static site built with HTML, CSS, and vanilla JavaScript, with GSAP, ScrollTrigger, and Lenis loaded from a CDN:

- A scroll-scrubbed hero that turns into the live site
- A kinetic mission title card
- A live CI/CD terminal demo
- A draggable, physics-driven "Deploy Board" of projects
- A contact form that opens a pre-filled email

## Run locally

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Structure

```
index.html      markup + copy
style.css       design system + layout
script.js       animation, physics, interactions
assets/         images, résumé, (future) videos
Media/          identity reference for video generation
BUILD-PLAN.md   creative brief + implementation plan
```

The cinematic scenes are currently rendered procedurally on `<canvas>`. To switch to video, drop the Higgsfield Seedance clips into `assets/video/` (see `BUILD-PLAN.md` §6) and set `<body data-videos="on">`.
