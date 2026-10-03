/* ============================================================
   scenes.js - animated scenes (see CHAPTER-IMPROVEMENT-PROMPT.md).
   A scene keeps ONE stage for all its steps: SVG shapes plus HTML
   labels. A step changes the pose of some parts, and the engine
   tweens between the poses.
   Text is never drawn in the SVG. Labels are HTML, so their size is
   the text size of the slide at every screen width; only the shapes
   scale with the stage.
   ============================================================ */
(function () {
  const h = App.h;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, ...kids) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs || {}) if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    kids.flat().forEach((c) => c && el.appendChild(c));
    return el;
  };
  const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const noMotion = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const ANCHOR = { c: "translate(-50%,-50%)", l: "translate(0,-50%)", r: "translate(-100%,-50%)" };

  // the point at fraction k of the polyline pts, by length
  function along(pts, k) {
    const len = []; let total = 0;
    for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); len.push(d); total += d; }
    let want = k * total;
    for (let j = 0; j < len.length; j++) {
      if (want <= len[j] || j === len.length - 1) {
        const f = len[j] ? Math.min(1, want / len[j]) : 1;
        return [pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f];
      }
      want -= len[j];
    }
    return pts[pts.length - 1];
  }

  /* ---- the stage ----
     Coordinates are user units of the viewBox (0..w, 0..h) for shapes and labels alike.
     A part has a pose: { x, y, r (degrees), s (scale), o (opacity), cls, text, ...numbers }.
     apply(node, pose) draws the extra numbers of a pose (a fill level, a line length). */
  App.animStage = function (o) {
    const W = o.w, H = o.h;
    const svg = sv("svg", { viewBox: "0 0 " + W + " " + H, class: "sn-svg", "aria-hidden": "true" });
    const ov = h("div", { class: "sn-ov" });
    const el = h("div", { class: "sn-stage", role: "img", "aria-label": o.label || "", style: "--sn-ar:" + (W / H).toFixed(4) }, svg, ov);
    const S = { el, root: svg, ov, W, H, parts: {}, sv };
    S.draw = function (p) {
      const s = p.pose;
      if (p.html) {
        p.node.style.left = (s.x / W * 100) + "%";
        p.node.style.top = (s.y / H * 100) + "%";
        p.node.style.transform = p.anchor + (s.s !== 1 ? " scale(" + s.s + ")" : "");
        if (s.text !== p.text) { p.text = s.text; p.node.innerHTML = s.text; }
      } else {
        p.node.setAttribute("transform", "translate(" + s.x + " " + s.y + ") rotate(" + s.r + ") scale(" + s.s + ")");
      }
      p.node.style.opacity = s.o;
      if (s.cls !== p.cls) { p.cls = s.cls; p.node.setAttribute("class", p.base + (s.cls ? " " + s.cls : "")); }
      if (p.apply) p.apply(p.node, s, S);
    };
    function reg(id, p, pose) {
      if (S.parts[id]) throw new Error("scene: part " + id + " is defined twice");
      p.pose = Object.assign({ x: 0, y: 0, r: 0, s: 1, o: 1, cls: "" }, pose);
      S.parts[id] = p; S.draw(p);
      return p.node;
    }
    // a static shape
    S.add = function (node, parent) { (parent || svg).appendChild(node); return node; };
    // an SVG part: draw the node around its own origin; the pose moves it
    S.part = function (id, node, pose, apply) {
      svg.appendChild(node);
      return reg(id, { node, base: node.getAttribute("class") || "", apply }, pose);
    };
    // a static HTML label
    S.text = function (html, x, y, cls, anchor) {
      const node = h("div", { class: "sn-label" + (cls ? " " + cls : ""), html });
      node.style.left = (x / W * 100) + "%"; node.style.top = (y / H * 100) + "%"; node.style.transform = ANCHOR[anchor || "c"];
      ov.appendChild(node); return node;
    };
    // an HTML part: opts { cls (fixed classes), state (the first pose.cls), anchor: "c" | "l" | "r", ...pose }
    S.label = function (id, html, x, y, opts) {
      opts = opts || {};
      const base = "sn-label" + (opts.cls ? " " + opts.cls : "");
      const node = h("div", { class: base });
      ov.appendChild(node);
      const pose = Object.assign({ x, y, text: html }, opts); delete pose.cls; delete pose.anchor; delete pose.state; delete pose.apply;
      if (opts.state) pose.cls = opts.state;
      return reg(id, { node, html: true, base, anchor: ANCHOR[opts.anchor || "c"], apply: opts.apply }, pose);
    };
    S.token = function (id, html, x, y, opts) {
      opts = Object.assign({}, opts); opts.cls = "sn-token" + (opts.cls ? " " + opts.cls : "");
      return S.label(id, html, x, y, opts);
    };
    return S;
  };

  /* ---- animStepper ----
     config: {
       title, w, h, label (aria), rest (px: the height of everything else on the slide),
       build(S),                       // draws the stage; this pose is the base (before step 1)
       steps: [{ note, set, via, dur } | { note, phases: [{ set, via, dur, linear, frame }] }],
       loops: [fn(S, dtMs, stepIndex)], // continuous motion; runs only while the widget is visible
       after(S, stepIndex, instant),    // called when a step has reached its end pose
       static, still                    // static: true -> one still frame (step `still`) and all notes
     }
     set: { partId: { pose changes } }. Numbers tween; cls and text change at the start of the phase.
     via: { partId: [[x, y], ...] } way-points between the old and the new position.
     dur: ms, or a function (S) -> ms.
     A step is reached instantly by Prev, _goto and with reduced motion: its end pose is the
     base plus the set of every phase up to it. */
  App.widgets.animStepper = function (cfg) {
    const S = App.animStage({ w: cfg.w || 1140, h: cfg.h || 350, label: cfg.label });
    cfg.build(S);
    const ids = Object.keys(S.parts);
    const clone = (st) => { const o = {}; for (const id in st) o[id] = Object.assign({}, st[id]); return o; };
    const base = {}; ids.forEach((id) => { base[id] = Object.assign({}, S.parts[id].pose); });
    const steps = cfg.steps.map((st) => ({ note: st.note || "", phases: st.phases || [{ set: st.set || {}, via: st.via, dur: st.dur }] }));
    const n = steps.length, ends = [];
    let cur = base;
    steps.forEach((st, k) => {
      cur = clone(cur);
      st.phases.forEach((ph) => { for (const id in ph.set) { if (!cur[id]) throw new Error("scene: step " + (k + 1) + " sets the unknown part " + id); Object.assign(cur[id], ph.set[id]); } });
      ends.push(cur);
    });
    const loops = cfg.loops || [];
    const put = (state) => ids.forEach((id) => { const p = S.parts[id]; p.pose = Object.assign({}, state[id]); S.draw(p); });

    const wrap = h("div", { class: "sn-wrap" }, S.el);
    if (cfg.static) {
      put(ends[cfg.still == null ? n - 1 : cfg.still]);
      if (cfg.after) cfg.after(S, cfg.still == null ? n - 1 : cfg.still, true);
      return h("div", { class: "widget sn sn-static" }, cfg.title ? h("div", { class: "widget-title" }, cfg.title) : null, wrap,
        h("ol", { class: "sn-notes" }, ...steps.map((st) => h("li", { html: st.note }))));
    }

    const noteIn = h("div");
    const note = h("div", { class: "sn-note" }, noteIn);
    const prev = h("button", { class: "w-btn", type: "button" }, "‹ Prev");
    const next = h("button", { class: "w-btn on", type: "button" }, "Next ›");
    const play = h("button", { class: "w-btn sn-play", type: "button" }, "▶ Play");
    const reset = h("button", { class: "w-btn", type: "button", title: "Start again", "aria-label": "Start again" }, "⟲");
    const count = h("span", { class: "sn-count" });
    const shell = h("div", { class: "widget sn kstep" + (cfg.cls ? " " + cfg.cls : "") },
      cfg.title ? h("div", { class: "widget-title" }, cfg.title) : null, wrap,
      h("div", { class: "sn-foot" }, note, h("div", { class: "w-row sn-ctrl" }, prev, next, play, reset, count)));
    if (cfg.rest) shell.style.setProperty("--sn-rest", cfg.rest + "px");
    if (cfg.minw) shell.style.setProperty("--sn-minw", cfg.minw + "px");   // a narrow stage (a half column)

    let i = 0, tw = null, queue = [], playing = false, hold = 0, vis = true, raf = 0, last = 0, frozen = false;

    function tween(k) {
      const e = tw.ph.linear ? k : ease(k);
      for (const id in tw.to) {
        const p = S.parts[id], a = tw.from[id], b = tw.to[id], via = tw.ph.via && tw.ph.via[id];
        for (const key in b) p.pose[key] = (typeof b[key] === "number" && typeof a[key] === "number") ? a[key] + (b[key] - a[key]) * e : b[key];
        if (via) { const pt = along([[a.x, a.y]].concat(via, [[b.x, b.y]]), e); p.pose.x = pt[0]; p.pose.y = pt[1]; }
        S.draw(p);
      }
      if (tw.ph.frame) tw.ph.frame(S, e);
    }
    function nextPhase() {
      for (;;) {
        const ph = queue.shift();
        if (!ph) {                                   // the step is complete
          tw = null; put(ends[i]);
          if (cfg.after) cfg.after(S, i, false);
          if (playing) { if (i < n - 1) hold = 900 + 30 * noteIn.textContent.length; else setPlaying(false); }
          return;
        }
        const from = {}, to = {};
        for (const id in ph.set) { from[id] = Object.assign({}, S.parts[id].pose); to[id] = Object.assign({}, from[id], ph.set[id]); }
        const dur = typeof ph.dur === "function" ? ph.dur(S) : (ph.dur == null ? 900 : ph.dur);
        tw = { ph, from, to, dur, t: 0 };
        if (dur > 0) { tween(0); return; }
        tween(1);
      }
    }
    function go(j, animate) {
      i = j; tw = null; queue = []; hold = 0;
      noteIn.innerHTML = steps[i].note;
      count.textContent = (i + 1) + " / " + n;
      prev.disabled = i === 0; next.disabled = i === n - 1;
      if (animate && !noMotion()) {
        put(i ? ends[i - 1] : base);
        queue = steps[i].phases.slice();
        nextPhase(); kick();
      } else {
        put(ends[i]);
        if (cfg.after) cfg.after(S, i, true);
        if (playing) { if (i < n - 1) hold = 900 + 30 * noteIn.textContent.length; else setPlaying(false); }
      }
    }
    function frame(dt) {
      if (tw) { tw.t += dt; const k = Math.min(1, tw.t / tw.dur); tween(k); if (k >= 1) nextPhase(); }
      else if (playing && hold > 0) { hold -= dt; if (hold <= 0) go(i + 1, true); }
      if (loops.length && !noMotion()) loops.forEach((f) => f(S, dt, i));
    }
    function tick(now) {
      raf = 0;
      if (!shell.isConnected) { tw = null; queue = []; setPlaying(false); return; }
      const dt = Math.max(0, Math.min(50, now - last)); last = now;
      if (!frozen) frame(dt);
      kick(true);
    }
    // the clock runs only while something moves and the widget is on the screen
    function kick(fromTick) {
      if (raf || !vis) return;
      if (!(tw || playing || (loops.length && !noMotion()))) return;
      if (!fromTick) last = performance.now();
      raf = window.requestAnimationFrame(tick);      // looked up at call time (the audit replaces it)
    }
    function setPlaying(on) { playing = on; hold = 0; play.textContent = on ? "⏸ Pause" : "▶ Play"; play.classList.toggle("on", on); }
    function step(dir) {
      if (dir > 0) {
        if (i >= n - 1) { if (!tw) return false; go(i, false); return true; }   // the last step finishes first
        go(i + 1, true); return true;
      }
      if (i === 0) return false;
      go(i - 1, false); return true;
    }
    const press = (btn, fn) => btn.addEventListener("click", () => { fn(); btn.blur(); });   // blur: Space steps the deck again
    press(prev, () => { setPlaying(false); step(-1); });
    press(next, () => { setPlaying(false); step(1); });
    press(reset, () => { setPlaying(false); go(0, true); });
    press(play, () => {
      if (playing) { setPlaying(false); return; }
      setPlaying(true);
      if (!tw) go(i >= n - 1 ? 0 : i + 1, true);
      kick();
    });
    if (window.IntersectionObserver) new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) kick(); }).observe(shell);

    go(0, false);
    // the deck: the keyboard steps the scene before it changes the slide
    shell._step = (dir) => { setPlaying(false); vis = true; frozen = false; return step(dir); };
    shell._goto = (where) => { setPlaying(false); vis = true; frozen = false; if (where === "end") go(n - 1, false); else go(0, true); };
    shell._state = () => JSON.stringify(ids.map((id) => { const p = S.parts[id].pose, o = {}; for (const k in p) o[k] = typeof p[k] === "number" ? Math.round(p[k] * 100) / 100 : p[k]; return [id, o]; }));
    shell._busy = () => !!tw;
    // tests: move the clock by ms without waiting (a hidden browser pane slows the timers down),
    // and stop the real clock until the next step (for a picture of one moment)
    shell._advance = (ms) => { for (let t = 0; t < ms; t += 16) frame(Math.min(16, ms - t)); };
    shell._freeze = () => { frozen = true; };
    return shell;
  };

  /* ============================================================
     shared drawing helpers
     ============================================================ */
  const g = (cls, ...kids) => sv("g", { class: cls || null }, ...kids);
  const rect = (x, y, w, hh, cls, rx) => sv("rect", { x, y, width: w, height: hh, rx: rx == null ? 12 : rx, class: cls });
  const line = (x1, y1, x2, y2, cls) => sv("line", { x1, y1, x2, y2, class: cls });
  const circle = (cx, cy, r, cls) => sv("circle", { cx, cy, r, class: cls });
  const path = (d, cls) => sv("path", { d, class: cls });

  /* phases that many scenes use */
  // a token appears at `from`, travels to `to` (along opts.via), and disappears (opts.keep: it stays)
  const fly = (id, from, to, opts) => {
    opts = opts || {};
    const start = { x: from[0], y: from[1], o: 0, s: 0.6 };
    if (opts.text != null) start.text = opts.text;
    if (opts.cls != null) start.cls = opts.cls;
    const via = opts.via ? { [id]: opts.via } : null;
    return [
      { set: { [id]: start }, dur: 0 },
      { set: { [id]: { o: 1, s: 1 } }, dur: 200 },
      { set: { [id]: { x: to[0], y: to[1] } }, via, dur: opts.dur || 900 },
    ].concat(opts.keep ? [] : [{ set: { [id]: { o: 0, s: 0.6 } }, dur: 180 }]);
  };
  // a label shows a new text, and grows for a moment
  const pop = (id, text, cls) => [
    { set: { [id]: Object.assign({ text, s: 1.4 }, cls != null ? { cls } : {}) }, dur: 0 },
    { set: { [id]: { s: 1 } }, dur: 340 },
  ];
  const wait = (ms, set) => ({ set: set || {}, dur: ms });
  // the row of stage names; the current one is marked
  const chips = (names, cur) => names.map((nm) => '<span class="sn-chip' + (nm === cur ? " on" : "") + '">' + nm + "</span>").join("");

  /* icons, drawn around (0, 0), about 90 units high */
  const ICON = {
    sensor: () => g("sn-ic",
      path("M -9 -40 a 9 9 0 0 1 18 0 v 46 a 20 20 0 1 1 -18 0 z"),
      line(0, -22, 0, 18, "sn-ic-hot"), circle(0, 24, 11, "sn-ic-hotfill"),
      line(18, -34, 28, -34), line(18, -20, 28, -20), line(18, -6, 28, -6)),
    cpu: () => g("sn-ic",
      rect(-34, -34, 68, 68, null, 8), rect(-16, -16, 32, 32, "sn-ic-core", 4),
      ...[-20, 0, 20].flatMap((k) => [line(k, -34, k, -46), line(k, 34, k, 46), line(-34, k, -46, k), line(34, k, 46, k)])),
    store: () => g("sn-ic",
      path("M -34 -28 v 56 a 34 12 0 0 0 68 0 v -56"), sv("ellipse", { cx: 0, cy: -28, rx: 34, ry: 12 }),
      path("M -34 -9 a 34 12 0 0 0 68 0"), path("M -34 10 a 34 12 0 0 0 68 0")),
    monitor: () => g("sn-ic",
      rect(-56, -44, 112, 72, null, 8), line(0, 28, 0, 42), line(-26, 44, 26, 44)),
    keyboard: () => g("sn-ic",
      rect(-56, -26, 112, 52, null, 8),
      ...[-36, -18, 0, 18, 36].flatMap((x) => [rect(x - 5, -15, 10, 8, "sn-ic-key", 2), rect(x - 5, -3, 10, 8, "sn-ic-key", 2)]),
      rect(-28, 10, 56, 8, "sn-ic-key", 2)),
  };
  // the scene files (scenes-t01.js) draw with these
  App.sceneKit = { sv, g, rect, line, circle, path, fly, pop, wait, chips, ICON };
})();
