/* ============================================================
   present.js - Slide / lecture mode. Auto-segments a lesson into
   one-idea-per-slide and shows a navigable deck (arrows / click).
   ============================================================ */
(function () {
  const h = App.h;

  const KICK = { example: "Example", deepdive: "Deep dive", steprun: "Step by step", livecode: "Try it", tabs: "Reference", widget: "Visual" };

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
    (L.live || []).forEach((lv) => slides.push({ kicker: "Try it", title: lv.title || "Try it", blocks: [{ type: "livecode", code: lv.code, title: lv.title }] }));
    (L.quiz || []).forEach((q, i) => slides.push({ kicker: "Question " + (i + 1), title: "Check yourself", blocks: [{ __quiz: q }] }));
    return slides;
  }

  const render1 = (b) => (b.__quiz ? App.renderQuizItem(b.__quiz) : App.renderBlock(b));
  const isText = (b) => !b.__quiz && (b.type === "text" || b.type === "note" || b.type === "list");

  function renderSlide(s) {
    const el = h("div", { class: "slide" + (s.cover ? " slide-cover" : "") });
    el.appendChild(h("div", { class: "slide-kicker" }, s.kicker));
    if (s.title) el.appendChild(h("h2", { class: "slide-title" }, s.title));
    if (s.sub) el.appendChild(h("p", { class: "slide-sub" }, s.sub));
    const texts = s.blocks.filter(isText);
    const feats = s.blocks.filter((b) => !isText(b));
    // Side-by-side: explanation on the left, the visual/example on the right.
    if (!s.cover && texts.length && feats.length) {
      const left = h("div", { class: "slide-col" }); texts.forEach((b) => left.appendChild(render1(b)));
      const right = h("div", { class: "slide-col" }); feats.forEach((b) => right.appendChild(render1(b)));
      el.appendChild(h("div", { class: "slide-split" }, left, right));
    } else {
      s.blocks.forEach((b) => el.appendChild(render1(b)));
    }
    return el;
  }

  App._deckNav = null; // {prev, next} while a deck is active

  App.renderDeck = function (key, index) {
    const rec = App.getLesson(key);
    const view = document.getElementById("view");
    view.innerHTML = "";
    if (!rec) { view.appendChild(h("div", { class: "note danger" }, "Lesson not found: " + key)); return; }
    const slides = buildSlides(rec);
    const cache = [];
    let i = Math.max(0, Math.min(slides.length - 1, index || 0));

    const bc = h("div", { class: "lesson-bc" }, h("a", { href: "#/" }, "Home"), " / ",
      h("a", { href: "#/t/" + rec.topic.id }, rec.topic.short || rec.topic.title));
    const stage = h("div", { class: "deck-stage" });
    const prev = h("button", { class: "btn ghost" }, "‹ Prev");
    const next = h("button", { class: "btn" }, "Next ›");
    const outlineBtn = h("button", { class: "btn ghost", title: "Outline (Esc)" }, "☰ Outline");
    const counter = h("span", { class: "deck-counter" });
    const progress = h("div", { class: "deck-progress" }, h("span"));
    const nav = h("div", { class: "deck-nav" }, prev, outlineBtn, progress, counter, next);

    function draw() {
      if (!cache[i]) cache[i] = renderSlide(slides[i]);
      stage.replaceChildren(cache[i]);
      // CodeMirror needs a refresh when its slide is (re)attached
      cache[i].querySelectorAll(".live").forEach((el) => el._cm && setTimeout(() => el._cm.refresh(), 0));
      counter.textContent = (i + 1) + " / " + slides.length;
      progress.firstChild.style.width = ((i + 1) / slides.length * 100) + "%";
      prev.disabled = false; next.disabled = false;
      history.replaceState(null, "", "#/l/" + key + "/" + i);
      if (i === slides.length - 1) App.progress.setDone(key, true), App.buildSidebar && App.buildSidebar();
      window.scrollTo(0, 0);
    }
    function goNext() {
      if (i < slides.length - 1) { i++; draw(); return; }
      const flat = App.flatLessons(), idx = flat.findIndex((f) => f.key === key);
      if (idx < flat.length - 1) location.hash = "#/l/" + flat[idx + 1].key + "/0";
    }
    function goPrev() {
      if (i > 0) { i--; draw(); return; }
      // Cross-topic back-nav lands on the PREVIOUS lesson's LAST slide (finish the
      // thought), not slide 1. renderDeck clamps a large index down to the last slide.
      const flat = App.flatLessons(), idx = flat.findIndex((f) => f.key === key);
      if (idx > 0) location.hash = "#/l/" + flat[idx - 1].key + "/9999";
    }
    prev.addEventListener("click", goPrev);
    next.addEventListener("click", goNext);
    outlineBtn.addEventListener("click", () => openOutline(slides, i, (n) => { i = n; draw(); }));
    App._deckNav = { prev: goPrev, next: goNext };

    const root = h("div", { class: "deck" }, bc, stage, nav);
    view.appendChild(root);
    draw();
  };

  function openOutline(slides, cur, jump) {
    const panel = h("div", { class: "panel" }, h("div", { class: "widget-title", style: "padding:4px 10px" }, "Slides - click to jump"));
    slides.forEach((s, n) => {
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
    if (document.querySelector(".deck-outline")) return;
    const t = e.target;
    if (t && (t.closest(".CodeMirror") || t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); App._deckNav.next(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); App._deckNav.prev(); }
    else if (e.key === " " && !e.shiftKey) { e.preventDefault(); App._deckNav.next(); }
  });
})();
