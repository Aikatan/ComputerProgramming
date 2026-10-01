/* ============================================================
   app.js - boot, router, sidebar, home, theme, search
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
      h("p", null, "An interactive companion to the 010711301 course. Every lesson pairs a visual, animated explanation with a real Python playground that runs in your browser - no install needed."),
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
    App._deckNav = null;
    let m, isDeck = false;
    if ((m = hash.match(/^#\/l\/([^\/]+)(?:\/(\d+))?$/))) {
      const key = m[1], si = m[2] ? +m[2] : 0;
      if ((localStorage.getItem("pcl_view") || "slides") === "slides" && App.renderDeck) { App.renderDeck(key, si); isDeck = true; }
      else App.renderLesson(key);
    }
    else if ((m = hash.match(/^#\/t\/(.+)$/))) renderTopic(m[1]);
    else renderHome();
    App.buildSidebar();
    document.body.classList.remove("nav-open");
    // Slide mode fills the screen: mark the body and hide the sidebar by default
    // (reopen it any time with the ☰ button). Scroll view keeps the sidebar.
    document.body.classList.toggle("slide-mode", isDeck);
    document.body.classList.toggle("nav-collapsed", isDeck);
  }
  window.addEventListener("hashchange", route);

  /* ---------- Slides / Scroll view toggle ---------- */
  const viewBtn = document.getElementById("viewToggle");
  function syncViewBtn() { const v = localStorage.getItem("pcl_view") || "slides"; viewBtn.textContent = v === "slides" ? "▤" : "▦"; viewBtn.title = v === "slides" ? "Switch to scroll view" : "Switch to slide view"; }
  viewBtn.addEventListener("click", () => {
    const v = (localStorage.getItem("pcl_view") || "slides") === "slides" ? "scroll" : "slides";
    localStorage.setItem("pcl_view", v); syncViewBtn();
    // strip any slide index from the hash, then re-render
    const key = (location.hash.match(/^#\/l\/([^\/]+)/) || [])[1];
    if (key) {
      App._deckNav = null;
      if (v === "slides") App.renderDeck(key, 0); else App.renderLesson(key);
      document.body.classList.toggle("slide-mode", v === "slides" && !!key);
      document.body.classList.toggle("nav-collapsed", v === "slides" && !!key);
    }
  });
  syncViewBtn();

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

  /* ---------- Instructor mode: top-bar button and sign-in dialog ----------
     Signed out: the button "Instructor" opens the dialog. Signed in: the button
     reads "Instructor: on", and a click signs out. See core.js (App.setInstructor). */
  const instrBtn = h("button", { id: "instructorBtn", class: "icon-btn instr-btn", type: "button" },
    h("span", { class: "instr-ico", "aria-hidden": "true" }), h("span", { class: "instr-label" }));
  document.getElementById("themeToggle").after(instrBtn);
  function syncInstrBtn() {
    const on = App.instructor;
    instrBtn.classList.toggle("on", on);
    // a lock: closed when signed out, open when the mode is on
    instrBtn.firstChild.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="' + (on ? "M8 11V7a4 4 0 0 1 7.6-1.7" : "M8 11V7a4 4 0 0 1 8 0v4") + '"/></svg>';
    instrBtn.lastChild.textContent = on ? "Instructor: on" : "Instructor";
    instrBtn.title = on ? "Instructor mode is on. Click to sign out." : "Instructor sign-in";
    instrBtn.setAttribute("aria-label", on ? "Instructor mode is on. Sign out" : "Instructor sign-in");
  }
  function openInstrDialog() {
    if (document.querySelector(".instr-overlay")) return;
    const user = h("input", { id: "instrUser", class: "instr-input", type: "text", autocomplete: "username", autocapitalize: "none", spellcheck: "false" });
    const pass = h("input", { id: "instrPass", class: "instr-input", type: "password", autocomplete: "current-password" });
    const msg = h("div", { class: "instr-msg", role: "alert" });
    const signIn = h("button", { class: "btn", type: "submit" }, "Sign in");
    const cancel = h("button", { class: "btn ghost", type: "button" }, "Cancel");
    const form = h("form", { class: "instr-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "instrTitle", novalidate: "" },
      h("h2", { id: "instrTitle", class: "instr-title" }, "Instructor sign-in"),
      h("label", { class: "instr-field", for: "instrUser" }, "Username"), user,
      h("label", { class: "instr-field", for: "instrPass" }, "Password"), pass,
      msg,
      h("div", { class: "instr-actions" }, cancel, signIn));
    const overlay = h("div", { class: "instr-overlay" }, form);
    function close(keepFocus) {
      overlay.remove();
      document.removeEventListener("keydown", onKey, true);
      // after a sign-in the focus leaves the button, so that Space moves the deck again
      if (keepFocus) instrBtn.focus(); else instrBtn.blur();
    }
    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); close(true); return; }
      if (e.key !== "Tab") return;
      // keep the focus inside the dialog
      const items = [...form.querySelectorAll("input, button")].filter((x) => !x.disabled);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1];
      if (!form.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey, true);
    overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) close(true); });
    cancel.addEventListener("click", () => close(true));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      signIn.disabled = true;
      let res = "wrong";
      try { res = await App.checkInstructorLogin(user.value.trim(), pass.value); } catch (err) { res = "nocrypto"; }
      signIn.disabled = false;
      if (res === "ok") { close(false); App.setInstructor(true); return; }
      msg.textContent = res === "nocrypto" ? "This page cannot check the login. Open the site with https or on localhost."
        : res === "unset" ? "The instructor login is not set. Run tools/set-instructor-login.py."
        : "The username or the password is not correct.";
      pass.value = ""; pass.focus();
    });
    document.body.appendChild(overlay);
    // no hash in js/instructor.js: the dialog cannot unlock the mode
    if (!String(App.INSTRUCTOR_HASH || "").trim()) {
      msg.textContent = "The instructor login is not set. Run tools/set-instructor-login.py.";
      user.disabled = pass.disabled = signIn.disabled = true;
      cancel.textContent = "Close"; cancel.focus();
    } else user.focus();
  }
  instrBtn.addEventListener("click", () => {
    if (App.instructor) { App.setInstructor(false); instrBtn.blur(); }
    else openInstrDialog();
  });
  // the mode changed: the answer controls appear or disappear without a page reload
  document.addEventListener("instructorchange", () => {
    syncInstrBtn();
    const key = (location.hash.match(/^#\/l\/([^\/]+)/) || [])[1];
    if (!key) return;
    if (App._deckNav && App._deckNav.redraw) App._deckNav.redraw();   // slides: the current slide again
    else { const y = window.scrollY; App.renderLesson(key); setTimeout(() => window.scrollTo(0, y), 60); }   // scroll view: same place
  });
  syncInstrBtn();

  /* ---------- Nav toggle: slide-in on mobile, collapse on desktop ---------- */
  document.getElementById("navToggle").addEventListener("click", () => {
    if (window.matchMedia("(max-width: 820px)").matches) document.body.classList.toggle("nav-open");
    else document.body.classList.toggle("nav-collapsed");
  });

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
