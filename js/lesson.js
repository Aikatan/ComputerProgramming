/* ============================================================
   lesson.js - render a lesson into the two-section layout
   lesson = { id, title, sub, slides,
              learn:[blocks], live:[{code,title}], quiz:[{q,choices,answer,explain}] }
   ============================================================ */
(function () {
  const h = App.h;

  function block(b) {
    switch (b.type) {
      case "subhead":
        return h("h4", { style: "margin:22px 0 6px;font-size:18px" }, b.text);
      case "text":
        return h("div", { class: "card", html: b.html });
      case "note": {
        const v = b.variant || "info";
        return h("div", { class: "note " + (v === "info" ? "" : v) },
          h("span", { class: "nt" }, b.title || (v === "danger" ? "Watch out" : v === "warn" ? "Note" : "Key idea")),
          h("span", { html: b.html }));
      }
      case "list":
        return h("div", { class: "card" },
          b.title ? h("h4", null, b.title) : null,
          h(b.ordered ? "ol" : "ul", null, ...b.items.map((it) => h("li", { html: it }))));
      case "deflist":
        // term on its own line, meaning indented below (avoids "label: value" on one line)
        return h("div", { class: "card deflist" },
          b.title ? h("h4", null, b.title) : null,
          ...b.items.map((it) => h("div", { class: "def" },
            h("div", { class: "dt", html: it.t }),
            h("div", { class: "dd", html: it.d }))));
      case "deepdive":
        return h("details", { class: "deepdive" },
          h("summary", null, b.title || "Under the hood (C / memory view)"),
          h("div", { html: b.html }),
          ...(b.widget ? [App.widgets[b.widget.name](b.widget.config)] : []));
      case "widget":
        if (!App.widgets[b.name]) return h("div", { class: "note danger" }, "Unknown widget: " + b.name);
        return App.widgets[b.name](b.config || {});
      case "tabs":
        return tabsBlock(b);
      case "steprun":
        return App.makeStepRun(b.code, { title: b.title, inputs: b.inputs });
      case "livecode":
        return App.makeLive(b.code, { title: b.title, lang: b.lang, inputs: b.inputs });
      case "practiceq":
        return App.makePractice(b);
      case "example":
        return staticExample(b);
      case "code":
        return staticExampleReadonly(b);
      case "table":
        return tableBlock(b);
      case "quiz":
        return quizBlock(b.items, b.start || 0);
      default:
        return h("div", { class: "note danger" }, "Unknown block: " + b.type);
    }
  }

  function tabsBlock(b) {
    const wrap = h("div", { class: "subtabs" });
    const bar = h("div", { class: "subtab-bar" });
    const panels = h("div", { class: "subtab-panels" });
    b.tabs.forEach((tab, ti) => {
      const btn = h("button", { class: "subtab-btn" + (ti === 0 ? " on" : "") }, tab.label);
      const panel = h("div", { class: "subtab-panel" + (ti === 0 ? " on" : "") });
      tab.blocks.forEach((blk) => panel.appendChild(block(blk)));
      btn.addEventListener("click", () => {
        [...bar.children].forEach((c) => c.classList.remove("on"));
        [...panels.children].forEach((c) => c.classList.remove("on"));
        btn.classList.add("on"); panel.classList.add("on");
      });
      bar.appendChild(btn); panels.appendChild(panel);
    });
    wrap.append(bar, panels);
    return wrap;
  }

  // A code example. By default it is now a RUNNABLE editor (Run in the browser,
  // no local compiler needed). When it also has line-by-line notes (annot), those
  // sit beside the editor as an explanation column that stacks under it on a
  // narrow screen / zoom / slide column (see .example-split container query).
  // Set norun:true for code the in-browser engine can't run (e.g. C malloc/free)
  // to keep the old read-only static block.
  function staticExample(b) {
    if (b.norun) return staticExampleReadonly(b);
    const editor = App.makeLive(b.code, { title: b.caption, lang: b.lang, inputs: b.inputs });
    if (!(b.annot && b.annot.length)) return editor;
    const list = h("ul", { class: "annot" });
    b.annot.forEach((a) => list.appendChild(h("li", null, h("code", null, a.c), h("span", { class: "ex", html: a.e }))));
    const expl = h("div", { class: "ex-explain" }, h("div", { class: "widget-title" }, "Line by line"), list);
    return h("div", { class: "example-run" }, h("div", { class: "example-split" }, expl, editor));
  }

  // Read-only rendering (kept for examples the engine cannot execute).
  function staticExampleReadonly(b) {
    const head = h("div", { class: "codeblock-head" },
      h("span", { class: "lang" }, b.lang || "python"),
      b.caption ? h("span", null, " · " + b.caption) : null);
    // Python highlighter only fits Python; show other languages as plain escaped text
    const isPy = !b.lang || b.lang === "python";
    const pre = h("pre", { html: isPy ? App.highlight(b.code) : App.esc(b.code) });
    const parts = [head, pre];
    if (b.output != null) {
      parts.push(h("div", { class: "code-out" }, h("span", { class: "ot" }, "Output"), b.output));
    }
    const cb = h("div", { class: "codeblock" }, ...parts);
    if (!b.annot) return cb;
    const list = h("ul", { class: "annot" });
    b.annot.forEach((a) => list.appendChild(h("li", null, h("code", null, a.c), h("span", { class: "ex", html: a.e }))));
    return h("div", null, cb, h("div", { class: "card" }, h("h4", null, "Line by line"), list));
  }

  // A plain, always-visible table. Cells may hold HTML. Each td carries its
  // column heading in data-label so a narrow container can show rows as cards.
  // cfg: { head:[...], rows:[[...]], caption?, cls? }
  function tableBlock(b) {
    const head = b.head || [];
    const table = h("table", { class: "dtab" + (b.cls ? " " + b.cls : "") },
      head.length ? h("thead", null, h("tr", null, ...head.map((c) => h("th", { html: String(c) })))) : null,
      h("tbody", null, ...b.rows.map((r) => h("tr", null,
        ...r.map((c, ci) => h("td", { "data-label": head[ci] != null ? String(head[ci]).replace(/<[^>]+>/g, "") : "", html: String(c) }))))));
    return h("div", { class: "dtab-wrap" },
      b.caption ? h("div", { class: "dtab-cap", html: b.caption }) : null, table);
  }

  function quizBlock(items, start) {
    const wrap = h("div");
    items.forEach((q, qi) => {
      // question text is escaped; `backticks` become inline code
      const qHtml = App.esc(q.q).replace(/`([^`]+)`/g, "<code>$1</code>");
      const card = h("div", { class: "quiz-q" }, h("div", { class: "q", html: ((start || 0) + qi + 1) + ". " + qHtml }));
      const explain = h("div", { class: "quiz-explain" }, q.explain || "");
      let answered = false;
      q.choices.forEach((c, ci) => {
        const opt = h("button", { class: "quiz-opt" }, c);
        opt.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          [...card.querySelectorAll(".quiz-opt")].forEach((o, oi) => {
            if (oi === q.answer) o.classList.add("correct");
            else if (oi === ci) o.classList.add("wrong");
            o.disabled = true;
          });
          explain.classList.add("show");
        });
        card.appendChild(opt);
      });
      card.appendChild(explain);
      wrap.appendChild(card);
    });
    return wrap;
  }

  // exposed for the slide/presentation renderer
  App.renderBlock = block;
  App.renderQuizItem = function (q) { return quizBlock([q]); };

  /* ---- authored decks (lesson.deck) ----
     deck: [{ kind, part?, title, blocks? , cols?:[[left blocks],[right blocks]] }]
     Shared by the slide view (present.js) and the scroll view below. */
  const KIND = { overview: "Overview", concept: "Concept", problem: "Problem", code: "Example",
    visual: "Illustration", trace: "Trace table", summary: "Summary", exercise: "Exercise", check: "Check" };
  App.deckKickers = function (lesson) {
    const deck = lesson.deck || [];
    const nEx = deck.filter((s) => s.kind === "exercise").length;
    let ex = 0;
    return deck.map((s) => {
      let k = KIND[s.kind] || "Slide";
      if (s.kind === "exercise") { ex++; k += " " + ex + " of " + nEx; }
      return s.part ? k + " · " + s.part : k;
    });
  };
  App.deckBlocks = function (s) {
    return s.cols ? s.cols[0].concat(s.cols[1] || []) : (s.blocks || []);
  };
  App.lessonPos = function (rec) {
    return "Lesson " + (rec.li + 1) + " of " + rec.topic.lessons.length;
  };

  function renderDeckScroll(rec, root) {
    const L = rec.lesson, kick = App.deckKickers(L);
    let part = null;
    L.deck.forEach((s, n) => {
      if (s.part && s.part !== part && s.kind !== "summary") {
        root.appendChild(h("h2", { class: "deck-part" }, s.part));
      }
      if (s.part) part = s.part;
      const sec = h("section", { class: "deck-sec kind-" + s.kind },
        h("div", { class: "deck-sec-kicker" }, kick[n]),
        s.title ? h("h3", { class: "deck-sec-title" }, s.title) : null);
      App.deckBlocks(s).forEach((b) => sec.appendChild(block(b)));
      root.appendChild(sec);
    });
  }

  App.renderLesson = function (key) {
    const rec = App.getLesson(key);
    const view = document.getElementById("view");
    view.innerHTML = "";
    if (!rec) { view.appendChild(h("div", { class: "note danger" }, "Lesson not found: " + key)); return; }
    const { topic, lesson } = rec;

    const root = h("div", { class: "lesson" });
    root.appendChild(h("div", { class: "lesson-bc" },
      h("a", { href: "#/" }, "Home"), " / ",
      h("a", { href: "#/t/" + topic.id }, topic.title)));
    if (lesson.deck) root.appendChild(h("div", { class: "lesson-pos" }, App.lessonPos(rec)));
    root.appendChild(h("h1", { class: "lesson-title" }, lesson.title));
    if (lesson.sub) root.appendChild(h("p", { class: "lesson-sub" }, lesson.sub));

    /* --- Authored deck: every slide in order, as reading sections --- */
    if (lesson.deck) renderDeckScroll(rec, root);

    /* --- Section 1: Concept & Visuals --- */
    if (lesson.learn && lesson.learn.length) {
      root.appendChild(h("div", { class: "section-tag tag-learn" }, "Concept"));
      lesson.learn.forEach((b) => root.appendChild(block(b)));
    }

    /* --- Section 2: Try it Live --- */
    if (lesson.live && lesson.live.length) {
      root.appendChild(h("div", { class: "section-tag tag-live" }, "Try it Live"));
      lesson.live.forEach((lv) => root.appendChild(App.makeLive(lv.code, { title: lv.title, lang: lv.lang, inputs: lv.inputs })));
    }

    /* --- Section 3: Quiz --- */
    if (lesson.quiz && lesson.quiz.length) {
      root.appendChild(h("div", { class: "section-tag tag-quiz" }, "Check yourself"));
      root.appendChild(quizBlock(lesson.quiz));
    }

    /* --- mark done --- */
    const cb = h("input", { type: "checkbox" });
    cb.checked = App.progress.isDone(key);
    cb.addEventListener("change", () => { App.progress.setDone(key, cb.checked); App.buildSidebar && App.buildSidebar(); });
    root.appendChild(h("label", { class: "mark-done" }, cb, " Mark this lesson complete"));

    /* --- prev / next --- */
    const flat = App.flatLessons();
    const idx = flat.findIndex((f) => f.key === key);
    const foot = h("div", { class: "lesson-foot" });
    if (idx > 0) {
      const p = flat[idx - 1];
      foot.appendChild(h("a", { href: "#/l/" + p.key }, h("div", { class: "dir" }, "‹ Previous"), h("div", null, p.lesson.title)));
    } else foot.appendChild(h("span"));
    if (idx < flat.length - 1) {
      const n = flat[idx + 1];
      foot.appendChild(h("a", { class: "nxt", href: "#/l/" + n.key }, h("div", { class: "dir" }, "Next ›"), h("div", null, n.lesson.title)));
    } else foot.appendChild(h("span"));
    root.appendChild(foot);

    view.appendChild(root);
    window.scrollTo(0, 0);
  };
})();
