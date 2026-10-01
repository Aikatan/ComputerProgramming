/* ============================================================
   core.js - namespace, registry, helpers
   ============================================================ */
window.App = window.App || {};
App.TOPICS = [];
App._byLesson = {};   // "t02.variables" -> {topic, lesson, ti, li}

App.registerTopic = function (topic) {
  App.TOPICS.push(topic);
};

/* ---- finalize indexes after all content scripts load ---- */
App.buildIndex = function () {
  App.TOPICS.sort((a, b) => a.id.localeCompare(b.id));
  App.TOPICS.forEach((t, ti) => {
    t.lessons.forEach((l, li) => {
      App._byLesson[t.id + "." + l.id] = { topic: t, lesson: l, ti, li };
    });
  });
};

App.getLesson = function (key) { return App._byLesson[key]; };

App.flatLessons = function () {
  const out = [];
  App.TOPICS.forEach((t) => t.lessons.forEach((l) => out.push({ topic: t, lesson: l, key: t.id + "." + l.id })));
  return out;
};

/* ---------- DOM helper ---------- */
App.h = function (tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    if (k === "class") el.className = attrs[k];
    else if (k === "html") el.innerHTML = attrs[k];
    else if (k.startsWith("on") && typeof attrs[k] === "function") el.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
  }
  kids.flat().forEach((c) => { if (c == null) return; el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
  return el;
};

App.esc = function (s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
};

/* ---------- Progress (localStorage) ---------- */
App.progress = {
  _k: "pcl_progress_v1",
  _load() { try { return JSON.parse(localStorage.getItem(this._k)) || {}; } catch (e) { return {}; } },
  _save(o) { try { localStorage.setItem(this._k, JSON.stringify(o)); } catch (e) {} },
  isDone(key) { return !!this._load()[key]; },
  setDone(key, v) { const o = this._load(); if (v) o[key] = 1; else delete o[key]; this._save(o); },
  topicPct(t) {
    const o = this._load();
    const total = t.lessons.length || 1;
    const done = t.lessons.filter((l) => o[t.id + "." + l.id]).length;
    return Math.round((done / total) * 100);
  },
};

/* ---------- Instructor mode ----------
   The lecturer signs in (top bar); answer controls then appear on the slides:
   the "Show answer" button, Run / Step Run on the programs of exercise slides,
   and the reveal buttons of a blank trace table. The state lasts until the tab
   closes (sessionStorage). It only hides: the answers stay in the page source.
   App.INSTRUCTOR_SALT and App.INSTRUCTOR_HASH are set in js/instructor.js. */
App.instructor = false;
try { App.instructor = sessionStorage.getItem("pcl_instructor") === "1"; } catch (e) {}
if (document.body) document.body.classList.toggle("instructor-mode", App.instructor);

App.setInstructor = function (on) {
  on = !!on;
  const changed = on !== App.instructor;
  App.instructor = on;
  try { if (on) sessionStorage.setItem("pcl_instructor", "1"); else sessionStorage.removeItem("pcl_instructor"); } catch (e) {}
  document.body.classList.toggle("instructor-mode", on);
  // app.js listens: it updates the top-bar button and renders the current slide again
  if (changed) document.dispatchEvent(new CustomEvent("instructorchange", { detail: { on } }));
};

// Resolves to "ok", "wrong", "unset" (no hash in js/instructor.js) or "nocrypto".
App.checkInstructorLogin = async function (username, password) {
  const want = String(App.INSTRUCTOR_HASH || "").trim().toLowerCase();
  if (!want) return "unset";
  if (!window.crypto || !crypto.subtle) return "nocrypto";   // Web Crypto needs https or localhost
  const text = String(username) + ":" + String(password) + ":" + String(App.INSTRUCTOR_SALT || "");
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  const hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === want ? "ok" : "wrong";
};

/* ---------- tiny static syntax highlighter for Python ---------- */
(function () {
  const KW = new Set(("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield").split(" "));
  const BUILTIN = new Set(("print input int float str bool list dict tuple set range len type abs round pow sum min max sorted open enumerate zip map filter id help complex frozenset").split(" "));
  App.highlight = function (code, lang) {
    if (lang === "c") return highlightC(code);
    const out = [];
    const re = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)|([\s\S])/g;
    let m;
    while ((m = re.exec(code))) {
      if (m[1]) out.push('<span class="tok-com">' + App.esc(m[1]) + "</span>");
      else if (m[2]) out.push('<span class="tok-str">' + App.esc(m[2]) + "</span>");
      else if (m[3]) out.push('<span class="tok-num">' + App.esc(m[3]) + "</span>");
      else if (m[4]) {
        const w = m[4];
        const after = code[re.lastIndex];
        if (KW.has(w)) out.push('<span class="tok-kw">' + w + "</span>");
        else if (BUILTIN.has(w)) out.push('<span class="tok-builtin">' + w + "</span>");
        else if (after === "(") out.push('<span class="tok-fn">' + w + "</span>");
        else out.push(App.esc(w));
      } else out.push(App.esc(m[5]));
    }
    return out.join("");
  };

  // the same token classes for C: line and block comments, #include lines, strings, chars
  const C_KW = new Set(("int double float char void bool long short unsigned signed const if else switch case default break continue for while do return sizeof true false struct").split(" "));
  const C_LIB = new Set(("printf scanf fgets puts strlen strcpy strcmp strcat main").split(" "));
  function highlightC(code) {
    const out = [];
    const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(^[ \t]*#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+\.?\d*[fF]?\b)|([A-Za-z_]\w*)|([\s\S])/gm;
    let m;
    while ((m = re.exec(code))) {
      if (m[1]) out.push('<span class="tok-com">' + App.esc(m[1]) + "</span>");
      else if (m[2]) out.push('<span class="tok-kw">' + App.esc(m[2]) + "</span>");
      else if (m[3]) out.push('<span class="tok-str">' + App.esc(m[3]) + "</span>");
      else if (m[4]) out.push('<span class="tok-num">' + App.esc(m[4]) + "</span>");
      else if (m[5]) {
        const w = m[5];
        if (C_KW.has(w)) out.push('<span class="tok-kw">' + w + "</span>");
        else if (C_LIB.has(w)) out.push('<span class="tok-builtin">' + w + "</span>");
        else if (code[re.lastIndex] === "(") out.push('<span class="tok-fn">' + w + "</span>");
        else out.push(App.esc(w));
      } else out.push(App.esc(m[6]));
    }
    return out.join("");
  }
})();
