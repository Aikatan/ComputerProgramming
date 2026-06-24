/* ============================================================
   app.js — boot, router, sidebar, home, theme, search
   ============================================================ */
(function () {
  const h = App.h;
  App.buildIndex();

  /* ---------- Sidebar ---------- */
  App.buildSidebar = function () {
    const nav = document.getElementById("sidebarNav");
    nav.innerHTML = "";
    const curKey = (location.hash.match(/#\/l\/(.+)$/) || [])[1];
    const curTopic = (location.hash.match(/#\/t\/(.+)$/) || [])[1];
    App.TOPICS.forEach((t) => {
      const open = (curKey && curKey.startsWith(t.id + ".")) || curTopic === t.id;
      const wrap = h("div", { class: "nav-topic" + (open ? " open" : "") });
      const head = h("div", { class: "nav-topic-head" },
        h("span", { class: "tnum" }, t.id.toUpperCase()),
        h("span", { style: "flex:1" }, t.short || t.title),
        h("span", { class: "caret" }, "›"));
      head.addEventListener("click", () => wrap.classList.toggle("open"));
      const lessons = h("div", { class: "nav-lessons" });
      t.lessons.forEach((l) => {
        const key = t.id + "." + l.id;
        const a = h("a", { class: "nav-lesson" + (key === curKey ? " active" : "") + (App.progress.isDone(key) ? " done" : ""), href: "#/l/" + key }, l.title);
        lessons.appendChild(a);
      });
      wrap.append(head, lessons);
      nav.appendChild(wrap);
    });
  };

  /* ---------- Home ---------- */
  function renderHome() {
    const view = document.getElementById("view");
    view.innerHTML = "";
    const hero = h("div", { class: "home-hero" },
      h("h1", null, "Computer Programming with Python"),
      h("p", null, "An interactive companion to the 010711301 course. Every lesson pairs a visual, animated explanation with a real Python playground that runs in your browser — no install needed."),
      h("p", { style: "color:var(--text-dim);font-size:13.5px" }, "Pick a topic to begin. Your progress is saved on this device."));
    view.appendChild(hero);
    const grid = h("div", { class: "topic-grid" });
    App.TOPICS.forEach((t) => {
      const pct = App.progress.topicPct(t);
      const card = h("a", { class: "topic-card", href: "#/t/" + t.id },
        h("span", { class: "tc-num" }, "Topic " + t.id.replace(/^t/, "")),
        h("h3", null, t.title),
        h("p", null, t.blurb || ""),
        h("div", { class: "progress" }, h("span", { style: "width:" + pct + "%" })),
        h("div", { class: "tc-meta" }, h("span", null, t.lessons.length + " lessons"), h("span", null, pct + "% done")));
      grid.appendChild(card);
    });
    view.appendChild(grid);
    window.scrollTo(0, 0);
  }

  /* ---------- Topic overview ---------- */
  function renderTopic(id) {
    const t = App.TOPICS.find((x) => x.id === id);
    const view = document.getElementById("view");
    view.innerHTML = "";
    if (!t) { view.appendChild(h("div", { class: "note danger" }, "Topic not found")); return; }
    const root = h("div", { class: "lesson" });
    root.appendChild(h("div", { class: "lesson-bc" }, h("a", { href: "#/" }, "Home")));
    root.appendChild(h("h1", { class: "lesson-title" }, t.title));
    if (t.blurb) root.appendChild(h("p", { class: "lesson-sub" }, t.blurb));
    if (t.intro) root.appendChild(h("div", { class: "card", html: t.intro }));
    const grid = h("div", { class: "topic-grid", style: "margin-top:18px" });
    t.lessons.forEach((l, i) => {
      const key = t.id + "." + l.id;
      const card = h("a", { class: "topic-card", href: "#/l/" + key },
        h("span", { class: "tc-num" }, "Lesson " + (i + 1) + (App.progress.isDone(key) ? "  ✓" : "")),
        h("h3", null, l.title),
        h("p", null, l.sub || ""));
      grid.appendChild(card);
    });
    root.appendChild(grid);
    view.appendChild(root);
    window.scrollTo(0, 0);
  }

  /* ---------- Router ---------- */
  function route() {
    const hash = location.hash || "#/";
    let m;
    if ((m = hash.match(/^#\/l\/(.+)$/))) App.renderLesson(m[1]);
    else if ((m = hash.match(/^#\/t\/(.+)$/))) renderTopic(m[1]);
    else renderHome();
    App.buildSidebar();
    document.body.classList.remove("nav-open");
  }
  window.addEventListener("hashchange", route);

  /* ---------- Theme ---------- */
  const savedTheme = localStorage.getItem("pcl_theme");
  if (savedTheme) document.body.dataset.theme = savedTheme;
  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = document.body.dataset.theme === "light" ? "dark" : "light";
    document.body.dataset.theme = next;
    localStorage.setItem("pcl_theme", next);
    // refresh any open editors' theme
    document.querySelectorAll(".live").forEach((el) => { if (el._cm) el._cm.setOption("theme", next === "light" ? "default" : "material-darker"); });
  });

  /* ---------- Nav toggle (mobile) ---------- */
  document.getElementById("navToggle").addEventListener("click", () => document.body.classList.toggle("nav-open"));

  /* ---------- Search ---------- */
  const box = document.getElementById("searchBox");
  const results = document.getElementById("searchResults");
  function doSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) { results.classList.add("hidden"); return; }
    const hits = [];
    App.flatLessons().forEach((f) => {
      const hay = (f.lesson.title + " " + (f.lesson.sub || "") + " " + (f.lesson.keywords || "")).toLowerCase();
      if (hay.includes(q)) hits.push(f);
    });
    results.innerHTML = "";
    if (!hits.length) results.appendChild(h("div", { class: "sr-empty" }, "No lessons match “" + App.esc(q) + "”."));
    else hits.slice(0, 30).forEach((f) => {
      const a = h("a", { class: "sr-item", href: "#/l/" + f.key },
        f.lesson.title, h("small", null, f.topic.title));
      a.addEventListener("click", () => { results.classList.add("hidden"); box.value = ""; });
      results.appendChild(a);
    });
    results.classList.remove("hidden");
  }
  box.addEventListener("input", () => doSearch(box.value));
  document.addEventListener("click", (e) => { if (!results.contains(e.target) && e.target !== box) results.classList.add("hidden"); });

  /* ---------- go ---------- */
  route();
})();
