/* THORE — hero animation: drifting storm fog, procedural lightning, embers. Optional video overlay via THORE_CONFIG.heroVideo. */
(function () {
  const cvs = document.getElementById('hero-canvas'); if (!cvs) return;
  const hero = cvs.closest('.hero'), ctx = cvs.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, dpr, last = performance.now(), flash = 0, nextBolt = 1400, bolts = [], running = true;

  const video = document.getElementById('hero-video');
  if (video && window.THORE_CONFIG.heroVideo) { video.src = window.THORE_CONFIG.heroVideo; video.hidden = false; video.play().catch(() => {}); }

  const fog = Array.from({ length: 6 }, (_, i) => ({ x: Math.random(), y: 0.2 + Math.random() * 0.6, r: 0.35 + Math.random() * 0.35, s: (0.004 + Math.random() * 0.008) * (i % 2 ? 1 : -1), hue: 215 + Math.random() * 25 }));
  const embers = Array.from({ length: 70 }, () => ember(true));
  function ember(init) { return { x: Math.random(), y: init ? Math.random() : 1.05, r: 0.5 + Math.random() * 1.6, vy: 0.012 + Math.random() * 0.03, vx: (Math.random() - 0.5) * 0.01, a: 0.15 + Math.random() * 0.5, ph: Math.random() * 6.28 }; }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2); W = hero.clientWidth; H = hero.clientHeight;
    cvs.width = W * dpr; cvs.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener('resize', resize); resize();

  // midpoint-displacement lightning with branches
  function bolt(x1, y1, x2, y2, spread, depth = 0) {
    let pts = [[x1, y1], [x2, y2]], d = spread;
    for (let i = 0; i < 7; i++) {
      const n = [pts[0]];
      for (let j = 1; j < pts.length; j++) {
        const a = pts[j - 1], b = pts[j], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2, o = (Math.random() - 0.5) * d;
        n.push([mx + Math.cos(ang) * o, my + Math.sin(ang) * o], b);
      }
      pts = n; d *= 0.55;
    }
    const out = [{ pts, w: depth ? 1 : 2.4 }];
    if (depth < 2) pts.forEach((p, i) => {
      if (i > 8 && i < pts.length - 8 && Math.random() < 0.035) {
        const L = (80 + Math.random() * 220) / (depth + 1), a = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.5;
        out.push(...bolt(p[0], p[1], p[0] + Math.cos(a) * L, p[1] + Math.sin(a) * L, L * 0.4, depth + 1));
      }
    });
    return out;
  }
  function strike() {
    const x = W * (0.12 + Math.random() * 0.76), tx = x + (Math.random() - 0.5) * W * 0.3;
    bolts.push({ segs: bolt(x, -10, tx, H * (0.45 + Math.random() * 0.4), 160), t: 0, ttl: 520 });
    flash = 1;
  }

  function drawFog(t) {
    ctx.globalCompositeOperation = 'lighter';
    fog.forEach((f) => {
      const x = ((f.x + t * f.s * 0.05) % 1.4 + 1.4) % 1.4 - 0.2, g = ctx.createRadialGradient(x * W, f.y * H, 0, x * W, f.y * H, f.r * Math.max(W, H));
      g.addColorStop(0, `hsla(${f.hue},35%,${14 + flash * 22}%,${0.5})`); g.addColorStop(1, 'hsla(220,30%,5%,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
  }
  function drawBolts(dt) {
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    bolts = bolts.filter((b) => (b.t += dt) < b.ttl);
    bolts.forEach((b) => {
      const k = b.t / b.ttl, flick = k < 0.14 ? 1 : k < 0.24 ? 0.25 : k < 0.36 ? 0.9 : Math.max(0, 0.7 * (1 - (k - 0.36) / 0.64));
      b.segs.forEach((s) => {
        const path = () => { ctx.beginPath(); s.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); };
        ctx.strokeStyle = `rgba(110,150,255,${0.16 * flick})`; ctx.lineWidth = s.w * 14; path();
        ctx.strokeStyle = `rgba(170,200,255,${0.4 * flick})`; ctx.lineWidth = s.w * 5; path();
        ctx.strokeStyle = `rgba(255,255,255,${0.95 * flick})`; ctx.lineWidth = s.w; path();
      });
    });
  }
  function drawEmbers(dt, t) {
    ctx.globalCompositeOperation = 'lighter';
    embers.forEach((e, i) => {
      e.y -= e.vy * dt / 1000; e.x += (e.vx + Math.sin(t / 1400 + e.ph) * 0.004) * dt / 1000;
      if (e.y < -0.05) embers[i] = ember(false);
      const tw = 0.6 + 0.4 * Math.sin(t / 400 + e.ph);
      ctx.fillStyle = `rgba(215,200,160,${e.a * tw})`; ctx.beginPath(); ctx.arc(e.x * W, e.y * H, e.r, 0, 6.283); ctx.fill();
    });
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(64, now - last); last = now;
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#050608'; ctx.fillRect(0, 0, W, H);
    flash *= Math.pow(0.0025, dt / 1000);
    drawFog(now); drawEmbers(dt, now);
    if (!reduce) { nextBolt -= dt; if (nextBolt <= 0) { strike(); if (Math.random() < 0.3) setTimeout(strike, 140); nextBolt = 2800 + Math.random() * 4200; } }
    drawBolts(dt);
    hero.style.setProperty('--flash', flash.toFixed(3));
    requestAnimationFrame(frame);
  }
  new IntersectionObserver((e) => { const v = e[0].isIntersecting; if (v && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); } running = v; }).observe(hero);
  requestAnimationFrame(frame);
})();
