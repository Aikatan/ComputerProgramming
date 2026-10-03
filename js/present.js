/* ============================================================
   present.js - Slide / lecture mode.
   Two sources of slides:
   - lesson.deck  : authored slides, one purpose each (see lesson.js)
   - learn/live/quiz : auto-segmented into one-idea-per-slide (older topics)
   ============================================================ */
(function () {
  const h = App.h;

  const KICK = { example: "Example", deepdive: "Deep dive", steprun: "Step by step", livecode: "Try it", tabs: "Reference", widget: "Visual" };

  /* ---- auto-segmented slides (lessons without a deck) ---- */
  function buildSlides(rec) {
    const L = rec.lesson, slides = [];
    slides.push({ cover: true, kicker: "Lesson", title: L.title, sub: L.sub, blocks: [] });
    let curTitle = null, group = [];
    const flush = () => { if (group.length) { slides.push({ kicker: "Definition", title: curTitle, blocks: group }); group = []; } };
    (L.learn || []).forEach((b) => {
      if (b.type === "subhead") { flush(); curTitle = b.text; return; }
      if (b.type === "text" || b.type === "note" || b.type === "list") { group.push(b); return; }
      const blocks = group.concat([b]); group = [];
      slides.push({ kicker: KICK[b.type] || "Detail", title: curTitle, blocks });
    });
    flush();
    (L.live || []).forEach((lv) => slides.push({ kicker: "Try it", title: lv.title || "Try it", blocks: [{ type: "livecode", code: lv.code, title: lv.title, lang: lv.lang, inputs: lv.inputs }] }));
    (L.quiz || []).forEach((q, i) => slides.push({ kicker: "Question " + (i + 1), title: "Check yourself", blocks: [{ __quiz: q }] }));
    return slides;
  }

  /* ---- authored slides (lesson.deck) ---- */
  function buildDeckSlides(rec) {
    const L = rec.lesson, kick = App.deckKickers(L);
    const slides = [{ cover: true, map: true, kicker: App.lessonPos(rec), title: L.title, sub: L.sub, blocks: [] }];
    L.deck.forEach((s, n) => slides.push({ authored: true, kind: s.kind, part: s.part, kicker: kick[n], title: s.title, blocks: s.blocks || [], cols: s.cols, colw: s.colw, top: s.top, answer: s.answer, answerCol: s.answerCol }));
    return slides;
  }

  // Numbered list of the topic's lessons; the current one is marked.
  function chapterMap(rec) {
    const list = h("ol", { class: "chap-map" });
    rec.topic.lessons.forEach((l, j) => {
      const key = rec.topic.id + "." + l.id;
      const cls = (j === rec.li ? "cur" : "") + (App.progress.isDone(key) ? " done" : "");
      list.appendChild(h("li", { class: cls.trim() }, h("a", { href: "#/l/" + key + "/0" }, l.title)));
    });
    return h("div", { class: "chap-map-wrap" }, h("div", { class: "chap-map-head" }, rec.topic.title), list);
  }

  // s: the slide (authored decks); some blocks depend on the kind of their slide
  const render1 = (b, s) => (b.__quiz ? App.renderQuizItem(b.__quiz) : App.renderBlock(b, s));
  const isText = (b) => !b.__quiz && (b.type === "text" || b.type === "note" || b.type === "list");

  function renderSlide(s, rec) {
    const el = h("div", { class: "slide" + (s.cover ? " slide-cover" : "") + (s.map ? " has-map" : "") + (s.authored ? " slide-authored kind-" + s.kind : "") });
    const kicker = h("div", { class: "slide-kicker" }, s.kicker);
    el.appendChild(kicker);
    if (s.title) el.appendChild(h("h2", { class: "slide-title" }, s.title));
    if (s.sub) el.appendChild(h("p", { class: "slide-sub" }, s.sub));
    if (s.map) { el.appendChild(chapterMap(rec)); return el; }
    if (s.authored) {
      let colEls = null;
      (s.top || []).forEach((b) => el.appendChild(render1(b, s)));   // full width, above the columns
      if (s.cols) {
        const left = h("div", { class: "slide-col" }); s.cols[0].forEach((b) => left.appendChild(render1(b, s)));
        const right = h("div", { class: "slide-col" }); (s.cols[1] || []).forEach((b) => right.appendChild(render1(b, s)));
        const split = h("div", { class: "slide-split" }, left, right);
        if (s.colw) { split.style.setProperty("--col-a", s.colw[0] + "fr"); split.style.setProperty("--col-b", s.colw[1] + "fr"); }
        el.appendChild(split);
        colEls = [left, right];
      } else s.blocks.forEach((b) => el.appendChild(render1(b, s)));
      // Instructor controls sit beside the kicker, so that they add no height to the slide:
      // the reveal buttons of a blank trace table (when the slide has one such table) ...
      const tools = [];
      const ctrls = el.querySelectorAll(".tt-ctrl");
      if (ctrls.length === 1) {
        if (ctrls[0].closest(".hide-on-answer")) ctrls[0].classList.add("hide-on-answer");
        tools.push(ctrls[0]);
      }
      // ... and the "Show answer" button. The answer itself is hidden; it is placed full
      // width below the content, or at the end of column answerCol (0 or 1).
      const ans = App.slideAnswer(s, el);
      if (ans) {
        ((colEls && colEls[s.answerCol]) || el).appendChild(ans.box);
        if (ans.btn) tools.push(ans.btn);
      }
      if (tools.length) {
        const head = h("div", { class: "slide-head" });
        kicker.replaceWith(head);
        head.append(kicker, h("div", { class: "slide-tools" }, ...tools));
      }
      return el;
    }
    const texts = s.blocks.filter(isText);
    const feats = s.blocks.filter((b) => !isText(b));
    // A runnable example that carries its own line-by-line explanation lays itself
    // out side-by-side, so give it the full slide width instead of squeezing it
    // into a right-hand column next to the intro text.
    const selfExplains = feats.some((b) => !b.__quiz && b.type === "example" && !b.norun && b.annot && b.annot.length);
    // Side-by-side: explanation on the left, the visual/example on the right.
    if (!s.cover && texts.length && feats.length && !selfExplains) {
      const left = h("div", { class: "slide-col" }); texts.forEach((b) => left.appendChild(render1(b)));
      const right = h("div", { class: "slide-col" }); feats.forEach((b) => right.appendChild(render1(b)));
      el.appendChild(h("div", { class: "slide-split" }, left, right));
    } else {
      s.blocks.forEach((b) => el.appendChild(render1(b)));
    }
    return el;
  }

  App._deckNav = null; // {prev, next, key} while a deck is active

  App.renderDeck = function (key, index) {
    const rec = App.getLesson(key);
    const view = document.getElementById("view");
    view.innerHTML = "";
    if (!rec) { view.appendChild(h("div", { class: "note danger" }, "Lesson not found: " + key)); return; }
    const slides = rec.lesson.deck ? buildDeckSlides(rec) : buildSlides(rec);
    const cache = [];
    let i = Math.max(0, Math.min(slides.length - 1, index || 0));
    const topicName = rec.topic.short || rec.topic.title;
    const lessonName = (rec.li + 1) + ". " + rec.lesson.title;

    const bc = h("div", { class: "lesson-bc" }, h("a", { href: "#/" }, "Home"), " / ",
      h("a", { href: "#/t/" + rec.topic.id }, topicName), " / ", lessonName);
    const stage = h("div", { class: "deck-stage" });
    const prev = h("button", { class: "btn ghost" }, "‹ Prev");
    const next = h("button", { class: "btn" }, "Next ›");
    const outlineBtn = h("button", { class: "btn ghost", title: "Outline (Esc)" }, "☰ Outline");
    const counter = h("span", { class: "deck-counter" });
    const progress = h("div", { class: "deck-progress" }, h("span"));
    const loc = h("span", { class: "deck-loc" });
    const nav = h("div", { class: "deck-nav" }, prev, outlineBtn, loc, progress, counter, next);

    // dir > 0: arrived moving forward (a trace starts at its first step);
    // dir < 0: arrived moving back (a trace shows its last step).
    function draw(dir) {
      if (!cache[i]) cache[i] = renderSlide(slides[i], rec);
      if (cache[i]._setAnswer) cache[i]._setAnswer(false);   // the answer is hidden again on every visit
      stage.replaceChildren(cache[i]);
      const theme = document.body.dataset.theme === "light" ? "default" : "material-darker";
      // CodeMirror needs a refresh (and the current theme) when its slide is (re)attached
      cache[i].querySelectorAll(".live").forEach((el) => {
        if (!el._cm) return;
        if (el._cm.getOption("theme") !== theme) el._cm.setOption("theme", theme);
        setTimeout(() => el._cm.refresh(), 0);
      });
      cache[i].querySelectorAll(".ctrace, .kstep").forEach((t) => t._goto && t._goto(dir < 0 ? "end" : 0));
      fitHead(true);
      counter.textContent = (i + 1) + " / " + slides.length;
      progress.firstChild.style.width = ((i + 1) / slides.length * 100) + "%";
      const part = slides[i].part;
      loc.textContent = topicName + " › " + lessonName + (part ? " › " + part : "");
      prev.disabled = false; next.disabled = false;
      history.replaceState(null, "", "#/l/" + key + "/" + i);
      if (i === slides.length - 1) App.progress.setDone(key, true), App.buildSidebar && App.buildSidebar();
      window.scrollTo(0, 0);
    }
    // the height of the kicker row (with the instructor buttons): a long trace table keeps
    // its head row below this row while the page scrolls (styles.css, tt-long). The row is
    // observed, because its height also changes without a window resize (the sidebar closes).
    const headWatch = window.ResizeObserver ? new ResizeObserver(() => fitHead(false)) : null;
    function fitHead(watch) {
      const head = cache[i] && cache[i].querySelector(".slide-head");
      if (cache[i]) cache[i].style.setProperty("--slide-head-h", (head ? head.offsetHeight : 0) + "px");
      if (watch && headWatch) { headWatch.disconnect(); if (head) headWatch.observe(head); }
    }
    function goNext() {
      if (i < slides.length - 1) { i++; draw(1); return; }
      const flat = App.flatLessons(), idx = flat.findIndex((f) => f.key === key);
      if (idx < flat.length - 1) location.hash = "#/l/" + flat[idx + 1].key + "/0";
    }
    function goPrev() {
      if (i > 0) { i--; draw(-1); return; }
      // Cross-topic back-nav lands on the PREVIOUS lesson's LAST slide (finish the
      // thought), not slide 1. renderDeck clamps a large index down to the last slide.
      const flat = App.flatLessons(), idx = flat.findIndex((f) => f.key === key);
      if (idx > 0) location.hash = "#/l/" + flat[idx - 1].key + "/9999";
    }
    // Keyboard / presenter clicker: a code trace on the slide steps first,
    // the deck moves on only when the trace is at its end (or start).
    function keyStep(dir) {
      // the first stepper that is visible (one inside a hidden answer does not count)
      const tr = cache[i] && [...cache[i].querySelectorAll(".ctrace, .kstep")].find((t) => t.offsetParent !== null);
      if (tr && tr._step && tr._step(dir)) return;
      if (dir > 0) goNext(); else goPrev();
    }
    prev.addEventListener("click", goPrev);
    next.addEventListener("click", goNext);
    outlineBtn.addEventListener("click", () => openOutline(slides, i, (n) => { i = n; draw(1); }));
    // redraw: build the current slide again (instructor mode was switched on or off)
    App._deckNav = { prev: goPrev, next: goNext, key: keyStep, redraw: () => { cache.length = 0; draw(1); } };

    const root = h("div", { class: "deck" }, bc, stage, nav);
    view.appendChild(root);
    draw(index >= 9999 ? -1 : 1);
  };

  function openOutline(slides, cur, jump) {
    const panel = h("div", { class: "panel" }, h("div", { class: "widget-title", style: "padding:4px 10px" }, "Slides - click to jump"));
    let part = null;
    slides.forEach((s, n) => {
      if (s.part && s.part !== part) { part = s.part; panel.appendChild(h("div", { class: "opart" }, s.part)); }
      const label = (s.cover ? s.title : (s.title ? s.title : s.kicker));
      const it = h("div", { class: "oitem" + (n === cur ? " cur" : "") },
        h("span", { style: "color:var(--text-dim)" }, (n + 1) + ". "),
        h("span", { class: "okick" }, s.kicker + "  "), label || "");
      it.addEventListener("click", () => { close(); jump(n); });
      panel.appendChild(it);
    });
    const overlay = h("div", { class: "deck-outline" }, panel);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    function close() { overlay.remove(); document.removeEventListener("keydown", esc); }
    function esc(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", esc);
    document.body.appendChild(overlay);
  }

  // keyboard navigation (ignored while typing in an editor/input)
  document.addEventListener("keydown", (e) => {
    if (!App._deckNav) return;
    if (document.querySelector(".deck-outline, .instr-overlay")) return;   // outline or sign-in dialog is open
    const t = e.target;
    if (t && t.closest && (t.closest(".CodeMirror") || t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    if (e.key === " " && t && t.id === "instructorBtn") return;   // Space presses the focused Instructor button
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); App._deckNav.key(1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); App._deckNav.key(-1); }
    else if (e.key === " " && !e.shiftKey) { e.preventDefault(); App._deckNav.key(1); }
  });
})();
