/* ==========================================================================
   Shivam Gupta — Software Engineer · Full Stack & DevOps
   script.js · vanilla JS + GSAP/ScrollTrigger + Lenis (CDN)
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;

  // GSAP is required for the cinematic layer; without it the page stays a readable static document.
  if (!window.gsap || !window.ScrollTrigger) {
    root.className = 'no-js';
    document.getElementById('loader')?.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- 1. Config & helpers ---------- */
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = matchMedia('(hover: hover) and (pointer: fine)');
  const mqMobile = matchMedia('(max-width: 767px)');
  const reduced = () => mqReduce.matches;
  const isMobile = () => mqMobile.matches;
  const QUERIES = {
    full: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)',
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = {
    out3: (t) => 1 - Math.pow(1 - t, 3),
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outBack: (t) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2),
  };
  // deterministic PRNG so procedural scenes look the same on every load
  const prng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const toastEl = $('.toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2400);
  }

  /* ---------- 2. Text splitting ---------- */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = '';
    for (const ch of text) {
      const s = document.createElement('span');
      s.className = 'char';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(s);
    }
  }
  function splitWords(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement('span');
        s.className = 'w';
        s.textContent = part;
        frag.appendChild(s);
      });
      n.parentNode.replaceChild(frag, n);
    });
  }
  function initRoll() {
    $$('[data-roll]').forEach((a) => {
      const t = a.textContent.trim();
      const wrap = document.createElement('span');
      wrap.className = 'roll';
      const a1 = document.createElement('span');
      const a2 = document.createElement('span');
      a1.textContent = t; a2.textContent = t;
      a2.setAttribute('aria-hidden', 'true');
      wrap.append(a1, a2);
      a.textContent = '';
      a.appendChild(wrap);
    });
  }

  /* ---------- 3. Lenis smooth scroll ---------- */
  let lenis = null;
  function initLenis() {
    if (reduced() || !window.Lenis || !mqFine.matches) return;
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollLock = (on) => { if (lenis) on ? lenis.stop() : lenis.start(); };

  /* ---------- 4. Links: anchors, TODO socials, copy email ---------- */
  function initLinks() {
    document.addEventListener('click', (e) => {
      const todo = e.target.closest('[data-todo]');
      if (todo && todo.getAttribute('href') === '#') {
        e.preventDefault();
        toast(`${todo.dataset.todo} link coming soon`);
        return;
      }
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
    });

    $$('[data-copy]').forEach((el) => el.addEventListener('click', () => {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(el.dataset.copy).then(() => toast('copied ✓ — talk soon')).catch(() => {});
    }));
  }

  /* ---------- 5. Inspector cursor, magnetic buttons, glass glow ---------- */
  function describe(el) {
    if (el.dataset.inspect) return el.dataset.inspect;
    const tag = el.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return `${tag}[${el.name || el.type}]`;
    if (el.id) return `${tag}#${el.id}`;
    const cls = el.classList[0];
    return cls ? `${tag}.${cls}` : tag;
  }

  function initCursor() {
    if (!mqFine.matches) return;
    root.classList.add('has-cursor');
    const cur = $('.cursor');
    const ring = $('.cursor-ring');
    const box = $('.cursor-box');
    const tag = $('.cursor-tag');
    const SEL = 'a, button, input, textarea, select, label[for], [data-inspect]';
    let mx = -100, my = -100, rx = -100, ry = -100;
    let target = null;
    const b = { x: 0, y: 0, w: 0, h: 0 };

    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest(SEL);
      if (t === target) return;
      const was = !!target;
      target = t;
      if (!t) { cur.classList.remove('is-inspecting'); return; }
      tag.textContent = describe(t);
      if (!was) {
        const r = t.getBoundingClientRect();
        Object.assign(b, { x: r.left - 6, y: r.top - 6, w: r.width + 12, h: r.height + 12 });
      }
      cur.classList.add('is-inspecting');
    });
    document.documentElement.addEventListener('pointerleave', () => { mx = my = -100; });

    gsap.ticker.add(() => {
      rx = lerp(rx, mx, 0.25);
      ry = lerp(ry, my, 0.25);
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (!target) return;
      if (!target.isConnected) { target = null; cur.classList.remove('is-inspecting'); return; }
      const r = target.getBoundingClientRect();
      b.x = lerp(b.x, r.left - 6, 0.3);
      b.y = lerp(b.y, r.top - 6, 0.3);
      b.w = lerp(b.w, r.width + 12, 0.3);
      b.h = lerp(b.h, r.height + 12, 0.3);
      box.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
      box.style.width = `${b.w}px`;
      box.style.height = `${b.h}px`;
    });
  }

  function initMagnetic() {
    if (!mqFine.matches || reduced()) return;
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      const k = el.classList.contains('email-btn') ? 0.18 : 0.35;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * k);
        yTo((e.clientY - (r.top + r.height / 2)) * k);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  function initGlow() {
    $$('.glow-card').forEach((c) => c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${e.clientX - r.left}px`);
      c.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
  }

  /* ---------- 6. Navigation ---------- */
  const menuBtn = $('.nav-menu');
  const menu = $('#mobile-menu');
  function closeMenu() {
    if (menuBtn.getAttribute('aria-expanded') !== 'true') return;
    menuBtn.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
    scrollLock(false);
  }
  function initNav() {
    const nav = $('#nav');
    const bar = $('.nav-progress-bar');
    const label = $('.nav-progress-label b');
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      refreshPriority: -10,
      onUpdate(self) {
        bar.style.transform = `scaleX(${self.progress})`;
        label.textContent = Math.round(self.progress * 100);
        if (self.scroll() < 120 || self.direction === -1 || !menu.hidden) nav.classList.remove('is-hidden');
        else nav.classList.add('is-hidden');
      },
    });
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      scrollLock(open);
    });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- 7. Procedural scenes (stand-ins until the Seedance clips land) ---------- */
  const VW = 1600, VH = 900;
  const C = { violet: '123,92,255', soft: '168,144,255', signal: '61,255,154', defect: '255,77,46', amber: '255,181,71', bone: '238,237,242', white: '241,255,247' };
  const rgba = (rgb, a) => `rgba(${rgb},${a})`;

  function rr(ctx, x, y, w, h, r) {
    if (w <= 0 || h <= 0) { ctx.beginPath(); return; }
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function glow(ctx, x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  class SceneCanvas {
    constructor(canvas, kind) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.kind = kind;
      this.intro = kind === 'hero' ? 0 : 1;
      const rnd = prng(kind.length * 977);
      this.pts = Array.from({ length: 70 }, () => ({
        x: -400 + rnd() * 2400, y: rnd() * 1800, r: 0.8 + rnd() * 1.8,
        s: 0.2 + rnd() * 0.8, a: 0.12 + rnd() * 0.4, ph: rnd() * 6.28,
      }));
      this.heroPanels = [
        { x: 16, y: 14, w: 608, h: 30, type: 'nav' },
        { x: 16, y: 58, w: 380, h: 150, type: 'hero' },
        { x: 410, y: 58, w: 214, h: 150, type: 'img' },
        { x: 16, y: 222, w: 194, h: 118, type: 'card' },
        { x: 223, y: 222, w: 194, h: 118, type: 'card' },
        { x: 430, y: 222, w: 194, h: 118, type: 'card' },
        { x: 16, y: 352, w: 130, h: 32, type: 'btn' },
      ].map((P, i) => {
        const ang = rnd() * Math.PI * 2;
        const dist = 420 + rnd() * 380;
        return { ...P, dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist * 0.7, rot: (rnd() - 0.5) * 0.9, st: 0.2 + i * 0.04 };
      });
      this.workPanels = Array.from({ length: 7 }, (_, i) => ({
        a: (i / 7) * Math.PI * 2, R: 400 + rnd() * 80, y: 250 + (i % 3) * 140 + rnd() * 30,
        fail: i === 2, lines: Array.from({ length: 5 }, () => 0.35 + rnd() * 0.65),
      }));
      this.resize();
      new ResizeObserver(() => this.resize()).observe(canvas);
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      this.w = this.c.clientWidth || 1;
      this.h = this.c.clientHeight || 1;
      this.dpr = dpr;
      this.c.width = Math.round(this.w * dpr);
      this.c.height = Math.round(this.h * dpr);
    }
    begin() {
      const { ctx, w, h, dpr } = this;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#06060A';
      ctx.fillRect(0, 0, this.c.width, this.c.height);
      const s = Math.min(Math.max(w / VW, h / VH), w / 1000);
      ctx.setTransform(dpr * s, 0, 0, dpr * s, (dpr * (w - VW * s)) / 2, (dpr * (h - VH * s)) / 2);
    }
    particles(t) {
      const ctx = this.ctx;
      for (const q of this.pts) {
        const y = (((q.y - t * 0.012 * q.s) % 1800) + 1800) % 1800 - 450;
        const x = q.x + Math.sin(t * 0.0003 * q.s + q.ph) * 24;
        ctx.fillStyle = rgba(C.soft, q.a);
        ctx.fillRect(x, y, q.r, q.r);
      }
    }
    draw(p, t) {
      if (this.kind === 'hero') this.drawHero(p, t);
      else if (this.kind === 'work') this.drawWork(p, t);
      else this.drawContact(p, t);
    }

    /* Scene 1 — laptop opens, glass UI assembles, camera pushes into the screen */
    drawHero(p, t) {
      const ctx = this.ctx;
      const I = ease.out3(this.intro);
      this.begin();
      glow(ctx, 800, 470, 780, rgba(C.violet, 0.3 * I));
      this.particles(t);

      const zp = ease.inOut(seg(p, 0.55, 1));
      const z = 1 + zp * 1.9;
      ctx.save();
      ctx.translate(800, 430); ctx.scale(z, z); ctx.translate(-800, -430);
      ctx.globalAlpha = I;
      ctx.translate(0, (1 - I) * 220);

      const open = 0.32 + 0.68 * ease.out3(seg(p, 0.02, 0.22));
      // base
      ctx.beginPath();
      ctx.moveTo(430, 630); ctx.lineTo(1170, 630); ctx.lineTo(1230, 664);
      ctx.quadraticCurveTo(1232, 672, 1220, 672); ctx.lineTo(380, 672);
      ctx.quadraticCurveTo(368, 672, 370, 664); ctx.closePath();
      const bg = ctx.createLinearGradient(0, 630, 0, 672);
      bg.addColorStop(0, '#1b1a28'); bg.addColorStop(1, '#0b0b12');
      ctx.fillStyle = bg; ctx.fill();
      ctx.strokeStyle = rgba(C.soft, 0.28); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = rgba(C.soft, 0.18); ctx.fillRect(740, 633, 120, 3);

      // lid
      const lh = Math.max(6, 410 * open);
      glow(ctx, 800, 630 - lh / 2, 560, rgba(C.violet, 0.2 * open * I));
      rr(ctx, 468, 630 - lh, 664, lh, 14);
      ctx.fillStyle = '#0c0c14'; ctx.fill();
      ctx.strokeStyle = rgba(C.soft, 0.38); ctx.stroke();
      if (open > 0.05) {
        const sy = 630 - lh + 10, sh = lh - 14;
        const sg = ctx.createLinearGradient(480, sy, 1120, sy + sh);
        sg.addColorStop(0, '#171035'); sg.addColorStop(1, '#07070d');
        rr(ctx, 480, sy, 640, sh, 6);
        ctx.fillStyle = sg; ctx.fill();
      }

      // glass panels fly in and lock into a website layout
      if (open > 0.9) {
        for (const P of this.heroPanels) {
          const e = ease.out3(seg(p, P.st, P.st + 0.12));
          if (e <= 0) continue;
          const end = P.st + 0.12;
          const sp = seg(p, end, end + 0.05);
          const cp = ease.outBack(seg(p, end + 0.04, end + 0.08));
          const px = 480 + P.x + P.dx * (1 - e);
          const py = 230 + P.y + P.dy * (1 - e);
          ctx.save();
          ctx.globalAlpha = e * I;
          ctx.translate(px + P.w / 2, py + P.h / 2);
          ctx.rotate(P.rot * (1 - e));
          ctx.translate(-P.w / 2, -P.h / 2);
          this.heroPanel(P, sp, cp);
          ctx.restore();
        }
      }
      if (zp > 0) {
        rr(ctx, 480, 230, 640, 396, 6);
        ctx.fillStyle = rgba(C.soft, 0.1 * zp); ctx.fill();
      }
      ctx.restore();
    }
    heroPanel(P, sp, cp) {
      const ctx = this.ctx;
      const { w, h, type } = P;
      rr(ctx, 0, 0, w, h, type === 'btn' ? h / 2 : 8);
      ctx.fillStyle = type === 'btn' ? rgba(C.bone, 0.88) : rgba(C.bone, 0.06);
      ctx.fill();
      ctx.strokeStyle = rgba(C.soft, 0.55); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = rgba(C.bone, 0.75);
      if (type === 'nav') {
        ctx.beginPath(); ctx.arc(16, h / 2, 6, 0, 7); ctx.fill();
        ctx.fillStyle = rgba(C.bone, 0.3);
        [0, 1, 2].forEach((i) => ctx.fillRect(w - 200 + i * 52, h / 2 - 2, 38, 4));
      } else if (type === 'hero') {
        ctx.fillRect(18, 22, w * 0.78, 22);
        ctx.fillRect(18, 52, w * 0.55, 22);
        ctx.fillStyle = rgba(C.bone, 0.25);
        ctx.fillRect(18, 92, w * 0.62, 6); ctx.fillRect(18, 106, w * 0.48, 6);
        ctx.fillStyle = rgba(C.soft, 0.7); ctx.fillRect(18, 124, 70, 14);
      } else if (type === 'img') {
        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, rgba(C.violet, 0.45)); g.addColorStop(1, rgba(C.signal, 0.25));
        rr(ctx, 10, 10, w - 20, h - 20, 6); ctx.fillStyle = g; ctx.fill();
      } else if (type === 'card') {
        rr(ctx, 14, 14, 30, 30, 6); ctx.fillStyle = rgba(C.soft, 0.45); ctx.fill();
        ctx.fillStyle = rgba(C.bone, 0.55); ctx.fillRect(14, 58, w * 0.6, 8);
        ctx.fillStyle = rgba(C.bone, 0.22); ctx.fillRect(14, 76, w * 0.75, 5); ctx.fillRect(14, 88, w * 0.5, 5);
      }
      if (sp > 0 && sp < 1) {
        ctx.save();
        ctx.shadowColor = rgba(C.signal, 0.9); ctx.shadowBlur = 14;
        ctx.fillStyle = rgba(C.signal, 0.95);
        ctx.fillRect(sp * w - 1, -4, 2, h + 8);
        ctx.restore();
      }
      if (cp > 0) {
        ctx.save();
        ctx.translate(w - 2, 2);
        ctx.scale(cp, cp);
        ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7);
        ctx.fillStyle = rgba(C.signal, 1); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(-1, 3); ctx.lineTo(4, -3);
        ctx.strokeStyle = '#04120a'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
        ctx.restore();
      }
    }

    /* Scene 2 — orbit around the engineer at his desk, test panels floating */
    drawWork(p, t) {
      const ctx = this.ctx;
      this.begin();
      glow(ctx, 800, 560, 820, rgba(C.violet, 0.26));
      this.particles(t);
      const orbit = p * Math.PI + t * 0.00004;
      const drift = ease.inOut(seg(p, 0.74, 1));
      const F = 1100;
      const items = this.workPanels.map((P) => {
        const a = P.a + orbit;
        const z = -Math.cos(a) * P.R;
        const x = Math.sin(a) * P.R;
        const s = (F / (F + z)) * (1 + drift * 1.6);
        return {
          P, z, s, a,
          sx: 800 + x * s * (1 + drift * 0.6),
          sy: 430 + (P.y - 430) * s,
          face: 0.3 + 0.7 * Math.abs(Math.cos(a)),
          alpha: (0.35 + 0.65 * (1 - (z + P.R) / (2 * P.R))) * (1 - drift * 0.92),
        };
      }).sort((m, n) => n.z - m.z);
      items.filter((o) => o.z > 0).forEach((o) => this.workPanel(o, p, t));
      this.person(orbit, 1 - drift * 0.5);
      items.filter((o) => o.z <= 0).forEach((o) => this.workPanel(o, p, t));
    }
    person(orbit, alpha) {
      const ctx = this.ctx;
      const side = Math.sin(orbit);
      ctx.save();
      ctx.globalAlpha = alpha;
      glow(ctx, 800, 420, 280, rgba(C.violet, 0.28));
      const rim = ctx.createLinearGradient(640, 0, 960, 0);
      rim.addColorStop(0, rgba(C.soft, 0.15 + 0.75 * Math.max(0, -side)));
      rim.addColorStop(0.5, rgba(C.soft, 0.06));
      rim.addColorStop(1, rgba(C.soft, 0.15 + 0.75 * Math.max(0, side)));
      ctx.fillStyle = '#0a0a11';
      ctx.strokeStyle = rim; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(640, 606); ctx.bezierCurveTo(642, 540, 700, 500, 800, 496);
      ctx.bezierCurveTo(900, 500, 958, 540, 960, 606); ctx.closePath();
      ctx.fill(); ctx.stroke();
      rr(ctx, 780, 440, 40, 64, 12); ctx.fill();
      ctx.beginPath(); ctx.ellipse(800, 410, 48, 58, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // desk + laptop
      rr(ctx, 730, 548, 140, 54, 6); ctx.fillStyle = '#14141f'; ctx.fill();
      ctx.strokeStyle = rgba(C.soft, 0.25); ctx.lineWidth = 1; ctx.stroke();
      glow(ctx, 800, 575, 70, rgba(C.signal, 0.18));
      rr(ctx, 520, 600, 560, 16, 8); ctx.fillStyle = '#101019'; ctx.fill();
      ctx.fillStyle = rgba(C.soft, 0.4); ctx.fillRect(540, 600, 520, 1.5);
      ctx.fillStyle = '#0c0c14'; ctx.fillRect(560, 616, 10, 120); ctx.fillRect(1030, 616, 10, 120);
      ctx.restore();
    }
    workPanel(o, p, t) {
      const ctx = this.ctx;
      const { P, sx, sy, s, face, alpha } = o;
      if (alpha <= 0.01) return;
      let status = C.signal;
      let failing = false;
      if (P.fail) {
        if (p < 0.3) status = C.amber;
        else if (p < 0.52) { status = C.defect; failing = true; }
      }
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(sx, sy);
      ctx.scale(s * face, s);
      rr(ctx, -110, -69, 220, 138, 10);
      ctx.fillStyle = failing ? rgba(C.defect, 0.1 + 0.06 * Math.sin(t * 0.012)) : rgba(C.bone, 0.055);
      ctx.fill();
      ctx.strokeStyle = failing ? rgba(C.defect, 0.9) : rgba(C.soft, 0.5);
      ctx.lineWidth = 1.2 / s; ctx.stroke();
      ctx.fillStyle = rgba(status, 1);
      ctx.beginPath(); ctx.arc(-96, -55, 4, 0, 7); ctx.fill();
      ctx.fillStyle = rgba(C.bone, 0.3); ctx.fillRect(-84, -57, 60, 4);
      P.lines.forEach((lw, k) => {
        const ly = -34 + k * 20;
        const bad = failing && k === 2;
        ctx.fillStyle = rgba(bad ? C.defect : (P.fail && p < 0.3 && k > 2 ? C.amber : C.signal), 0.9);
        ctx.fillRect(-96, ly - 3, 6, 6);
        ctx.fillStyle = rgba(C.bone, 0.2);
        ctx.fillRect(-82, ly - 2, 170 * lw, 4);
      });
      ctx.restore();
    }

    /* Scene 3 — a laptop is handed over, the rack lights turn green, the screen blooms */
    drawContact(p, t) {
      const ctx = this.ctx;
      this.begin();
      glow(ctx, 800, 450, 760, rgba(C.violet, 0.22));
      this.particles(t);
      const zp = ease.inOut(seg(p, 0.68, 1));
      const z = 1 + zp * 3.2;
      ctx.save();
      ctx.translate(800, 440); ctx.scale(z, z); ctx.translate(-800, -440);

      const fg = ctx.createLinearGradient(0, 520, 0, 900);
      fg.addColorStop(0, rgba(C.violet, 0.1)); fg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fg; ctx.fillRect(-800, 520, 3200, 600);

      for (let k = 11; k >= 0; k--) {
        const sc = 1 / (1 + k * 0.42);
        const on = p > 0.04 + ((11 - k) / 11) * 0.5;
        for (const side of [-1, 1]) {
          const cx = 800 + side * 740 * sc;
          const w = 110 * sc;
          const top = 440 - 420 * sc;
          const bot = 440 + 300 * sc;
          rr(ctx, cx - w / 2, top, w, bot - top, 6 * sc);
          ctx.fillStyle = '#0b0b12'; ctx.fill();
          ctx.strokeStyle = rgba(C.bone, 0.06); ctx.lineWidth = 1; ctx.stroke();
          for (let d = 0; d < 5; d++) {
            const dy = top + (bot - top) * (0.14 + d * 0.17);
            const dx = cx - w * 0.25;
            const col = on ? C.signal : C.amber;
            const flick = on ? 1 : 0.55 + 0.45 * Math.sin(t * 0.004 + k + d);
            if (on) glow(ctx, dx, dy, 20 * sc + 4, rgba(col, 0.35));
            ctx.fillStyle = rgba(col, 0.9 * flick);
            ctx.beginPath(); ctx.arc(dx, dy, 4 * sc + 0.6, 0, 7); ctx.fill();
            ctx.fillStyle = rgba(C.bone, 0.07);
            ctx.fillRect(cx - w * 0.08, dy - 1.5 * sc, w * 0.45, 3 * sc);
          }
        }
      }

      const ap = ease.out3(seg(p, 0, 0.4));
      const ls = 0.55 + 0.45 * ap;
      const open = ease.out3(seg(p, 0.18, 0.45));
      const g = seg(p, 0.38, 0.7);
      ctx.save();
      ctx.translate(800, 470);
      ctx.scale(ls, ls);
      const lh = Math.max(8, 360 * open);
      glow(ctx, 0, 150 - lh / 2, 520, rgba(C.signal, 0.3 * g));
      rr(ctx, -300, 150, 600, 26, 10);
      ctx.fillStyle = '#16161f'; ctx.fill();
      ctx.strokeStyle = rgba(C.soft, 0.3); ctx.stroke();
      rr(ctx, -290, 150 - lh, 580, lh, 14);
      ctx.fillStyle = '#0c0c14'; ctx.fill();
      ctx.strokeStyle = rgba(C.soft, 0.38); ctx.stroke();
      if (open > 0.05) {
        rr(ctx, -278, 150 - lh + 12, 556, lh - 20, 6);
        ctx.fillStyle = '#08080e'; ctx.fill();
        ctx.fillStyle = rgba(C.signal, 0.06 + 0.55 * g); ctx.fill();
        const cp = ease.out3(seg(p, 0.48, 0.66));
        if (cp > 0) {
          ctx.save();
          ctx.translate(0, 150 - lh / 2);
          ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.strokeStyle = 'rgba(255,255,255,0.95)';
          ctx.setLineDash([220 * cp, 400]);
          ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-20, 50); ctx.lineTo(80, -55); ctx.stroke();
          ctx.restore();
        }
      }
      ctx.restore();
      if (zp > 0) {
        ctx.fillStyle = rgba(C.white, 0.85 * zp * zp);
        ctx.fillRect(-1600, -900, 4800, 2700);
      }
      ctx.restore();
    }
  }

  /* ---------- 8. Stage: scroll-scrubbed video with procedural fallback ---------- */
  const LOOP_RANGE = { hero: 0.62, work: 0.7, contact: 0.66 };
  class Stage {
    constructor(el, kind) {
      this.el = el;
      this.kind = kind;
      this.video = $('.scene-video', el);
      this.scene = new SceneCanvas($('.scene-canvas', el), kind);
      this.p = 0;
      this.drawP = 0;
      this.vt = 0;
      this.mode = 'scrub';
      this.visible = false;
      this.hasVideo = false;
      new IntersectionObserver(([e]) => {
        this.visible = e.isIntersecting;
        if (this.hasVideo && this.mode === 'loop') e.isIntersecting ? this.video.play().catch(() => {}) : this.video.pause();
      }).observe(el);
      new IntersectionObserver(([e], io) => {
        if (e.isIntersecting) { io.disconnect(); this.load(); }
      }, { rootMargin: '100% 0px' }).observe(el);
    }
    load() {
      const v = this.video;
      if (!v || document.body.dataset.videos !== 'on') return;
      v.addEventListener('loadeddata', () => {
        this.hasVideo = true;
        this.el.classList.add('has-video');
        if (this.mode === 'loop' && this.visible && !reduced()) v.play().catch(() => {});
      }, { once: true });
      v.src = isMobile() ? v.dataset.srcMobile : v.dataset.src;
      v.preload = 'auto';
      v.load();
    }
    setMode(mode) {
      this.mode = mode;
      if (!this.hasVideo) return;
      if (mode === 'loop' && !reduced()) this.video.play().catch(() => {});
      else this.video.pause();
    }
    set progress(p) { this.p = p; }
    tick(t) {
      if (!this.visible) return;
      if (this.hasVideo) {
        const v = this.video;
        if (this.mode !== 'scrub' || !v.duration) return;
        const target = this.p * (v.duration - 0.05);
        this.vt = lerp(this.vt, target, 0.15);
        if (Math.abs(v.currentTime - this.vt) > 1 / 60) v.currentTime = this.vt;
        return;
      }
      let p;
      if (reduced()) { p = LOOP_RANGE[this.kind]; t = 0; }
      else if (this.mode === 'loop') p = LOOP_RANGE[this.kind] * (0.5 - 0.5 * Math.cos((t / 14000) * Math.PI * 2));
      else { this.drawP = lerp(this.drawP, this.p, 0.14); p = this.drawP; }
      this.scene.draw(p, t);
    }
  }

  /* ---------- 9. Bug Board physics playground ---------- */
  class Playground {
    constructor(el) {
      this.el = el;
      this.cards = $$('.pcard', el);
      this.bodies = [];
      this.enabled = false;
      this.running = false;
      this.inView = false;
      this.drag = null;
      this.suppress = false;
      this.acc = 0;
      this.last = 0;
      this.onDown = this.onDown.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onUp = this.onUp.bind(this);
      this.onResize = this.onResize.bind(this);
      new IntersectionObserver(([e]) => { this.inView = e.isIntersecting; }).observe(el);
    }
    enable() {
      if (this.enabled) return;
      this.enabled = true;
      this.running = false;
      this.el.classList.add('is-physics');
      this.W = this.el.clientWidth;
      this.H = this.el.clientHeight;
      const rnd = prng(42);
      const n = this.cards.length;
      this.bodies = this.cards.map((el, i) => {
        const w = el.offsetWidth, h = el.offsetHeight;
        const x = clamp((this.W / n) * (i + 0.5) - w / 2 + (rnd() - 0.5) * 60, 0, this.W - w);
        return { el, w, h, x, y: -h - 80 - i * 110, vx: (rnd() - 0.5) * 160, vy: 0, a: (rnd() - 0.5) * 0.5, va: 0, rest: (rnd() - 0.5) * 0.16, inside: false };
      });
      this.render();
      this.el.addEventListener('pointerdown', this.onDown);
      addEventListener('resize', this.onResize);
    }
    disable() {
      if (!this.enabled) return;
      this.enabled = false;
      this.el.classList.remove('is-physics');
      this.el.removeEventListener('pointerdown', this.onDown);
      removeEventListener('resize', this.onResize);
      this.cards.forEach((c) => { c.style.transform = ''; c.classList.remove('is-dragging'); });
    }
    start() { this.running = true; }
    onResize() {
      this.W = this.el.clientWidth;
      this.H = this.el.clientHeight;
      this.bodies.forEach((b) => {
        b.w = b.el.offsetWidth; b.h = b.el.offsetHeight;
        b.x = clamp(b.x, 0, this.W - b.w);
        if (b.inside) b.y = clamp(b.y, 0, this.H - b.h);
      });
      this.render();
    }
    consumeClick() { const s = this.suppress; this.suppress = false; return s; }
    local(e) { const r = this.el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    onDown(e) {
      const card = e.target.closest('.pcard');
      if (!card || !this.enabled || e.button > 0) return;
      const b = this.bodies.find((o) => o.el === card);
      const pt = this.local(e);
      card.setPointerCapture(e.pointerId);
      card.classList.add('is-dragging');
      this.drag = { b, id: e.pointerId, ox: pt.x - b.x, oy: pt.y - b.y, sx: e.clientX, sy: e.clientY, moved: false, samples: [{ x: b.x, y: b.y, t: performance.now() }] };
      b.vx = b.vy = 0;
      b.inside = true;
      this.start();
      card.addEventListener('pointermove', this.onMove);
      card.addEventListener('pointerup', this.onUp);
      card.addEventListener('pointercancel', this.onUp);
    }
    onMove(e) {
      const d = this.drag;
      if (!d || e.pointerId !== d.id) return;
      const pt = this.local(e);
      const b = d.b;
      if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 6) d.moved = true;
      const nx = clamp(pt.x - d.ox, 0, this.W - b.w);
      const ny = clamp(pt.y - d.oy, 0, this.H - b.h);
      b.va += (nx - b.x) * 0.012;
      b.x = nx; b.y = ny;
      const now = performance.now();
      d.samples.push({ x: nx, y: ny, t: now });
      while (d.samples.length > 2 && now - d.samples[0].t > 90) d.samples.shift();
    }
    onUp(e) {
      const d = this.drag;
      if (!d || e.pointerId !== d.id) return;
      const b = d.b;
      const s0 = d.samples[0], s1 = d.samples[d.samples.length - 1];
      const dt = Math.max(16, s1.t - s0.t) / 1000;
      const MAX = 2600;
      b.vx = clamp((s1.x - s0.x) / dt, -MAX, MAX);
      b.vy = clamp((s1.y - s0.y) / dt, -MAX, MAX);
      b.va += b.vx * 0.0009;
      this.suppress = d.moved;
      b.el.classList.remove('is-dragging');
      b.el.removeEventListener('pointermove', this.onMove);
      b.el.removeEventListener('pointerup', this.onUp);
      b.el.removeEventListener('pointercancel', this.onUp);
      this.drag = null;
    }
    step(dt) {
      const { W, H } = this;
      const dragged = this.drag?.b;
      for (const b of this.bodies) {
        b.va += (b.rest - b.a) * 60 * dt;
        b.va *= 0.88;
        b.a = clamp(b.a + b.va * dt, -0.45, 0.45);
        if (b === dragged) continue;
        b.vy += 1900 * dt;
        b.vx *= 0.996;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * 0.5; b.va -= b.vy * 0.0004; }
        if (b.x + b.w > W) { b.x = W - b.w; b.vx = -Math.abs(b.vx) * 0.5; b.va += b.vy * 0.0004; }
        if (b.y + b.h > H) {
          b.y = H - b.h;
          b.vy = b.vy > 160 ? -b.vy * 0.38 : 0;
          b.vx *= 0.9;
          b.va += b.vx * 0.0005;
        }
        if (b.y > 0) b.inside = true;
        if (b.inside && b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy) * 0.4; }
      }
      for (let it = 0; it < 3; it++) {
        for (let i = 0; i < this.bodies.length; i++) {
          for (let j = i + 1; j < this.bodies.length; j++) this.collide(this.bodies[i], this.bodies[j], dragged);
        }
      }
    }
    collide(A, B, dragged) {
      if (!A.inside || !B.inside) return;
      const ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
      const oy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
      if (ox <= 0 || oy <= 0) return;
      const ia = A === dragged ? 0 : 1;
      const ib = B === dragged ? 0 : 1;
      const sum = ia + ib;
      if (!sum) return;
      if (ox < oy) {
        const dir = A.x + A.w / 2 < B.x + B.w / 2 ? -1 : 1;
        A.x += (dir * ox * ia) / sum;
        B.x -= (dir * ox * ib) / sum;
        const rv = A.vx - B.vx;
        if (rv * dir < 0) {
          const j = (-(1 + 0.35) * rv) / sum;
          A.vx += j * ia; B.vx -= j * ib;
          A.va += j * 0.0006 * ia; B.va -= j * 0.0006 * ib;
        }
      } else {
        const dir = A.y + A.h / 2 < B.y + B.h / 2 ? -1 : 1;
        A.y += (dir * oy * ia) / sum;
        B.y -= (dir * oy * ib) / sum;
        const rv = A.vy - B.vy;
        if (rv * dir < 0) {
          const j = (-(1 + 0.2) * rv) / sum;
          A.vy += j * ia; B.vy -= j * ib;
        }
        const tv = A.vx - B.vx;
        A.vx -= (tv * 0.12 * ia) / sum;
        B.vx += (tv * 0.12 * ib) / sum;
      }
      A.x = clamp(A.x, 0, this.W - A.w);
      B.x = clamp(B.x, 0, this.W - B.w);
    }
    render() {
      for (const b of this.bodies) b.el.style.transform = `translate3d(${b.x.toFixed(2)}px, ${b.y.toFixed(2)}px, 0) rotate(${b.a.toFixed(4)}rad)`;
    }
    tick(time) {
      if (!this.enabled || !this.running || !this.inView) { this.last = time; return; }
      const dt = Math.min(0.05, (time - this.last) / 1000);
      this.last = time;
      this.acc += dt;
      const h = 1 / 60;
      while (this.acc >= h) { this.step(h); this.acc -= h; }
      this.render();
    }
  }

  /* ---------- 10. Test reports (dialog) ---------- */
  function initReports(playground) {
    const dlg = $('#report');
    const body = $('#report-body');
    const url = $('#report-url');
    let closing = false;
    let lastCard = null;
    const open = (card) => {
      const tpl = document.getElementById(card.dataset.report);
      if (!tpl) return;
      body.replaceChildren(tpl.content.cloneNode(true));
      url.textContent = `https://shivam.gupta/work/${card.dataset.report.replace('rep-', '')}`;
      lastCard = card;
      root.classList.add('modal-open');
      scrollLock(true);
      dlg.showModal();
      body.scrollTop = 0;
      $('.report-close', dlg).focus({ preventScroll: true });
      if (!reduced()) gsap.fromTo(dlg, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'expo.out' });
    };
    const close = () => {
      if (!dlg.open || closing) return;
      if (reduced()) { dlg.close(); return; }
      closing = true;
      gsap.to(dlg, { opacity: 0, y: 24, scale: 0.97, duration: 0.25, ease: 'power2.in', onComplete: () => { closing = false; dlg.close(); } });
    };
    dlg.addEventListener('close', () => {
      root.classList.remove('modal-open');
      scrollLock(false);
      gsap.set(dlg, { clearProps: 'opacity,transform' });
      lastCard?.focus({ preventScroll: true });
    });
    // Escape + scrim also close it if the browser didn't promote the dialog to the top layer
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && dlg.open) { e.preventDefault(); close(); } });
    $('.report-scrim').addEventListener('click', close);
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
    $('.report-close', dlg).addEventListener('click', close);
    $$('.pcard').forEach((c) => c.addEventListener('click', (e) => {
      if (playground.consumeClick()) { e.preventDefault(); return; }
      open(c);
    }));
  }

  /* ---------- 11. Live test-runner terminal ---------- */
  const TERM = [
    { k: 'cmd', text: 'git push origin main' },
    { k: 'dim', text: '→ pipeline #128 triggered · github actions' },
    { k: 'blank' },
    { k: 'test', text: 'build   docker build compilehub', r: 'PASSED' },
    { k: 'test', text: 'test    pytest -q (32 tests)', r: 'FAILED' },
    { k: 'note', text: '  → 1 failing: test_exec_timeout_boundary', cls: 't-amber' },
    { k: 'note', text: '  → fix pushed · re-running…', cls: 't-dim' },
    { k: 'test', text: 'test    pytest -q (32 tests)', r: 'PASSED' },
    { k: 'test', text: 'infra   terraform apply', r: 'PASSED' },
    { k: 'test', text: 'deploy  kubectl rollout → eks', r: 'PASSED' },
    { k: 'test', text: 'monitor prometheus · grafana', r: 'HEALTHY' },
    { k: 'blank' },
    { k: 'sum', text: '=========== pipeline green in 4m 12s ===========' },
    { k: 'prompt' },
  ];
  const PROMPT = 'shivam@ci:~$ ';
  class Terminal {
    constructor(el) {
      this.code = $('code', el);
      this.token = 0;
      $('.terminal-rerun', el).addEventListener('click', () => this.run());
      new IntersectionObserver(([e], io) => {
        if (e.isIntersecting) { io.disconnect(); this.run(); }
      }, { threshold: 0.35 }).observe(el);
    }
    async run() {
      const tok = ++this.token;
      const alive = () => tok === this.token;
      const wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));
      const code = this.code;
      code.textContent = '';
      const line = () => { const d = document.createElement('span'); d.className = 't-line'; code.appendChild(d); return d; };
      const span = (parent, cls, txt) => { const s = document.createElement('span'); if (cls) s.className = cls; s.textContent = txt; parent.appendChild(s); return s; };
      for (const L of TERM) {
        if (!alive()) return;
        const el = line();
        if (L.k === 'cmd') {
          span(el, 't-prompt', PROMPT);
          const s = span(el, 't-cmd', '');
          for (const ch of L.text) { if (!alive()) return; s.textContent += ch; await wait(60); }
          await wait(320);
        } else if (L.k === 'blank') {
          el.textContent = ' ';
        } else if (L.k === 'dim') {
          span(el, 't-dim', L.text); await wait(420);
        } else if (L.k === 'test') {
          span(el, '', `${L.text} `);
          const dots = span(el, 't-dim', '');
          const n = Math.max(3, 40 - L.text.length);
          for (let i = 3; i < n; i += 4) { if (!alive()) return; dots.textContent = '.'.repeat(i); await wait(14); }
          dots.textContent = '.'.repeat(n);
          const fail = L.r === 'FAILED';
          await wait(fail ? 460 : 80);
          if (!alive()) return;
          span(el, fail ? 't-fail' : 't-pass', ` ${L.r}  ${fail ? '✗' : '✓'}`);
          await wait(fail ? 520 : 130);
        } else if (L.k === 'note') {
          span(el, L.cls, L.text); await wait(560);
        } else if (L.k === 'sum') {
          span(el, 't-sum', L.text);
        } else if (L.k === 'prompt') {
          span(el, 't-prompt', PROMPT);
          span(el, 't-cursor', '');
        }
      }
    }
  }

  /* ---------- 12. Contact form → pre-filled email ---------- */
  function initForm() {
    const form = $('#ticket');
    const submit = $('.ticket-submit', form);
    const label = $('.ticket-submit-label', form);
    const rules = {
      name: (v) => v.trim().length >= 2 || 'assert name.length ≥ 2',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'assert email is valid',
      message: (v) => v.trim().length >= 10 || 'assert message.length ≥ 10',
    };
    const check = (input) => {
      const rule = rules[input.name];
      if (!rule) return true;
      const res = rule(input.value);
      const ok = res === true;
      const field = input.closest('.field');
      field.classList.toggle('is-valid', ok);
      field.classList.toggle('is-invalid', !ok);
      $('.field-msg', field).textContent = ok ? '✓ pass' : `✗ ${res}`;
      input.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    const inputs = Object.keys(rules).map((n) => form.elements[n]);
    inputs.forEach((input) => {
      input.addEventListener('blur', () => { if (input.value || input.closest('.is-invalid')) check(input); });
      input.addEventListener('input', () => { if (input.closest('.is-invalid, .is-valid')) check(input); });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = inputs.map(check);
      const firstBad = inputs[results.indexOf(false)];
      if (firstBad) { firstBad.focus(); toast('✗ build failed: check the fields'); return; }
      const d = new FormData(form);
      const name = d.get('name').trim();
      const type = d.get('type');
      const subject = `[Portfolio] ${type} — ${name}`;
      const body = [
        `Name: ${name}`,
        `Email: ${d.get('email').trim()}`,
        `Company: ${d.get('company').trim() || '—'}`,
        `Type: ${type}`,
        '',
        d.get('message').trim(),
      ].join('\n');
      window.location.href = `mailto:shivamgupt4880@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      submit.classList.add('is-done');
      label.textContent = '✓ Request ready';
      toast('message ready in your email app ✓');
    });
  }

  /* ---------- 13. Footer ---------- */
  function initFooter() {
    const clock = $('#clock');
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
    const tickClock = () => { clock.textContent = fmt.format(new Date()); };
    tickClock();
    setInterval(tickClock, 15000);
  }
  function fitMark() {
    const mark = $('.footer-mark');
    const span = $('span', mark);
    mark.style.fontSize = '100px';
    const w = span.getBoundingClientRect().width;
    if (w) mark.style.fontSize = `${(100 * root.clientWidth * 0.96) / w}px`;
  }

  /* ---------- 14. Easter egg: type "ship" ---------- */
  function initEgg() {
    let buf = '';
    addEventListener('keydown', (e) => {
      if (e.target.closest?.('input, textarea') || e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-4);
      if (buf !== 'ship') return;
      buf = '';
      const egg = document.createElement('div');
      egg.className = 'egg';
      egg.setAttribute('role', 'status');
      egg.textContent = 'Shipped to production ✓';
      document.body.appendChild(egg);
      gsap.timeline({ onComplete: () => egg.remove() })
        .from(egg, { opacity: 0, duration: 0.3 })
        .from(egg, { scale: 1.08, duration: 0.6, ease: 'expo.out' }, 0)
        .to(egg, { opacity: 0, duration: 0.4 }, 1.4);
    });
  }

  /* ---------- 15. Preloader & intro ---------- */
  function preloader() {
    return new Promise((resolve) => {
      const loader = $('#loader');
      if (!loader) { resolve(); return; }
      const count = $('.loader-count', loader);
      const line = $('.loader-line', loader);
      const pill = $('.loader-pill', loader);
      const o = { v: 0 };
      const tl = gsap.timeline({ paused: true });
      tl.to(o, {
        v: 100, duration: reduced() ? 0.3 : 1.6, ease: 'power2.inOut',
        onUpdate() {
          const v = Math.round(o.v);
          count.textContent = String(v).padStart(3, '0');
          if (v >= 55 && v < 100) line.textContent = 'stages ready';
          if (v >= 100) { line.textContent = 'all systems go ✓'; pill.classList.add('is-ready'); }
        },
      })
        .to('.loader-scan', { scaleX: 1, duration: 0.6, ease: 'expo.inOut' }, '+=0.15')
        .to(pill, { opacity: 0, scale: 0.92, duration: 0.35, ease: 'power2.in' }, '<')
        .to(loader, { clipPath: 'inset(50% 0% 50% 0%)', duration: 0.9, ease: 'expo.inOut' })
        .add(resolve, '-=0.5')
        .add(() => { loader.remove(); root.classList.remove('is-loading'); });
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))]).then(() => tl.play());
    });
  }

  /* ==========================================================================
     Boot
     ========================================================================== */
  initRoll();
  $$('[data-split]').forEach(splitChars);
  $$('[data-words]').forEach(splitWords);
  initLenis();
  scrollLock(true);

  const stages = {
    hero: new Stage($('[data-scene="hero"]'), 'hero'),
    work: new Stage($('[data-scene="work"]'), 'work'),
    contact: new Stage($('[data-scene="contact"]'), 'contact'),
  };
  const playground = new Playground($('#playground'));
  gsap.ticker.add((time) => {
    const t = time * 1000;
    stages.hero.tick(t);
    stages.work.tick(t);
    stages.contact.tick(t);
    playground.tick(t);
  });

  initLinks();
  initCursor();
  initMagnetic();
  initGlow();
  initNav();
  initReports(playground);
  new Terminal($('.terminal'));
  initForm();
  initFooter();
  initEgg();

  /* ---------- Scroll choreography (rebuilt automatically on breakpoint / motion changes) ---------- */
  const mm = gsap.matchMedia();
  mm.add(QUERIES, (ctx) => {
    const { full, reduce } = ctx.conditions;
    root.classList.toggle('is-full', !!full);
    root.classList.toggle('is-lite', !full);
    Object.values(stages).forEach((s) => s.setMode(full ? 'scrub' : 'loop'));

    if (full) {
      /* Act 1 · Hero — scene scrub → match cut into the live site */
      const win = $('.hero-window');
      const chars = $$('.hero-name .char');
      const rest = [$('.hero-window .win-bar'), $('.hero .eyebrow'), $('.hero-sub'), $('.hero-chips'), $('.hero-actions'), $('.hero-status')];
      const caps = $$('.hero-captions span');
      const st = { p: 0 };
      gsap.set(win, { opacity: 0, scale: 0.78 });
      gsap.set(chars, { yPercent: 115 });
      gsap.set(rest, { opacity: 0, y: 24 });
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=260%', pin: '.hero-pin', scrub: true, anticipatePin: 1 },
      })
        .to(st, { p: 1, duration: 0.8, onUpdate: () => { stages.hero.progress = st.p; } }, 0)
        .to('.hero-intro', { opacity: 0, y: 20, duration: 0.06 }, 0.02)
        .fromTo(caps[0], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.05 }, 0.05)
        .to(caps[0], { opacity: 0, y: -10, duration: 0.05 }, 0.2)
        .fromTo(caps[1], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.05 }, 0.25)
        .to(caps[1], { opacity: 0, y: -10, duration: 0.05 }, 0.42)
        .fromTo(caps[2], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.05 }, 0.46)
        .to(caps[2], { opacity: 0, y: -10, duration: 0.05 }, 0.58)
        .to(win, { opacity: 1, duration: 0.1, ease: 'power1.out' }, 0.62)
        .to(win, { scale: 1, duration: 0.24, ease: 'power2.inOut' }, 0.62)
        .to(stages.hero.el, { scale: 1.6, opacity: 0.25, duration: 0.26, ease: 'power2.in' }, 0.62)
        .to(chars, { yPercent: 0, duration: 0.14, stagger: 0.008, ease: 'power3.out' }, 0.78)
        .to(rest, { opacity: 1, y: 0, duration: 0.1, stagger: 0.02, ease: 'power2.out' }, 0.84)
        .to({}, { duration: 0.06 });

      /* Act 3 · Mission — film title card */
      const words = $$('.mission-text .w');
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.mission', start: 'top top', end: '+=170%', pin: '.mission-pin', scrub: true },
      })
        .to('.letterbox', { scaleY: 1, duration: 0.08 }, 0)
        .fromTo(words, { opacity: 0.12, textShadow: '0 0 0px rgba(123,92,255,0)' }, { opacity: 1, textShadow: '0 0 40px rgba(123,92,255,0.55)', stagger: 0.05, duration: 0.08 }, 0.06)
        .to('.mission-flip', { color: '#FF4D2E', duration: 0.03 })
        .to('.mission-flip', { color: '#3DFF9A', duration: 0.05 }, '+=0.04')
        .fromTo('.mission-caption', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08 })
        .to({}, { duration: 0.1 });

      /* Act 5 · Story — headshot inspection + chapter crossfades */
      const story = $('.story');
      story.classList.add('is-pinned');
      const chapters = $$('.chapter');
      gsap.set(chapters.slice(1), { opacity: 0, y: 40 });
      const stl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: story, start: 'top top', end: '+=300%', pin: '.story-pin', scrub: true },
      });
      stl.fromTo('.story-rail span', { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
        .fromTo('.headshot-scan', { top: '2%', opacity: 1 }, { top: '97%', duration: 0.16 }, 0)
        .to('.headshot-scan', { opacity: 0, duration: 0.03 }, 0.16)
        .fromTo('.headshot .corner', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.06, stagger: 0.01 }, 0.02)
        .fromTo('.headshot figcaption', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.15);
      chapters.forEach((c, i) => {
        if (!i) return;
        const at = i * 0.25;
        stl.to(chapters[i - 1], { opacity: 0, y: -40, duration: 0.06 }, at - 0.05)
          .to(c, { opacity: 1, y: 0, duration: 0.06 }, at);
      });

      /* Act 7 · Work — Scene 2 scrub, then cards drop into the bug board */
      const wst = { p: 0 };
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.work-pin', start: 'top top', end: '+=180%', pin: true, scrub: true },
      })
        .to(wst, { p: 1, duration: 1, onUpdate: () => { stages.work.progress = wst.p; } }, 0)
        .from('.work-title .line-inner', { yPercent: 115, duration: 0.14, stagger: 0.05, ease: 'power3.out' }, 0.04)
        .from('.work-title .eyebrow, .work-caption', { opacity: 0, duration: 0.08 }, 0.12)
        .to('.work-title', { opacity: 0, y: -60, duration: 0.14 }, 0.7)
        .to(stages.work.el, { opacity: 0, duration: 0.12 }, 0.88);
      playground.enable();
      ScrollTrigger.create({ trigger: '#playground', start: 'top 70%', once: true, onEnter: () => playground.start() });

      /* Act 8 · Contact — Scene 3 scrub, bloom into the panel */
      const cst = { p: 0 };
      const ccaps = $$('.contact-caption span');
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.contact-pin', start: 'top top', end: '+=200%', pin: true, scrub: true },
      })
        .to(cst, { p: 1, duration: 0.86, onUpdate: () => { stages.contact.progress = cst.p; } }, 0)
        .fromTo(ccaps[0], { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.05)
        .to(ccaps[0], { opacity: 0, duration: 0.05 }, 0.34)
        .fromTo(ccaps[1], { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.4)
        .to(ccaps[1], { opacity: 0, duration: 0.05 }, 0.64)
        .to('.bloom', { opacity: 1, duration: 0.16, ease: 'power2.in' }, 0.78)
        .to({}, { duration: 0.06 });
      gsap.fromTo('.bloom', { opacity: 1 }, {
        opacity: 0, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: '.contact-panel-wrap', start: 'top 60%', end: 'top 15%', scrub: true },
      });
    } else {
      /* Lite: mobile or reduced motion — no pins, looping/static scenes */
      playground.disable();
      if (!reduce) {
        gsap.from('.hero-name .char', { yPercent: 115, duration: 1.1, stagger: 0.03, ease: 'expo.out', delay: 0.3 });
        gsap.fromTo($$('.mission-text .w'), { opacity: 0.12 }, {
          opacity: 1, stagger: 0.05, ease: 'none',
          scrollTrigger: { trigger: '.mission-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
        });
        gsap.timeline({ scrollTrigger: { trigger: '.headshot', start: 'top 75%', once: true } })
          .fromTo('.headshot-scan', { top: '2%', opacity: 1 }, { top: '97%', duration: 1.1, ease: 'power2.inOut' })
          .to('.headshot-scan', { opacity: 0, duration: 0.2 });
        gsap.fromTo('.story-rail span', { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: '.story-chapters', start: 'top 75%', end: 'bottom 60%', scrub: true },
        });
      }
    }

    /* Shared reveals + counters (motion allowed) */
    if (!reduce) {
      const revealSel = '[data-reveal], .stats-grid, .pillar, .service, .browser, .contact-panel, .footer-cols > div'
        + (full ? '' : ', .chapter');
      gsap.set(revealSel, { opacity: 0, y: 60 });
      ScrollTrigger.batch(revealSel, {
        start: 'top 88%',
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', overwrite: 'auto' }),
      });
      gsap.from('.pillar', {
        rotateX: 18, transformOrigin: '50% 100%', duration: 1.2, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.pillars-grid', start: 'top 85%', once: true },
      });
      $$('[data-count]').forEach((el) => {
        const end = +el.dataset.count;
        const o = { v: 0 };
        el.textContent = '0';
        ScrollTrigger.create({
          trigger: el, start: 'top 90%', once: true,
          onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } }),
        });
      });
      gsap.from('.footer-mark span', {
        yPercent: 45, ease: 'none',
        scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
    }

    requestAnimationFrame(() => { if (ScrollTrigger.sort) ScrollTrigger.sort(); ScrollTrigger.refresh(); });

    return () => {
      $('.story').classList.remove('is-pinned');
      $$('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
    };
  });

  /* ---------- Go ---------- */
  preloader().then(() => {
    scrollLock(false);
    if (!reduced()) {
      gsap.to(stages.hero.scene, { intro: 1, duration: 2.2, ease: 'expo.out' });
      gsap.from('.hero-intro > *', { opacity: 0, y: 20, duration: 1, stagger: 0.12, ease: 'expo.out', delay: 0.2 });
    } else {
      stages.hero.scene.intro = 1;
    }
    ScrollTrigger.refresh();
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { fitMark(); ScrollTrigger.refresh(); });
  let resizeT;
  addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(fitMark, 150); });
})();
