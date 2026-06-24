/* ============================================================
   core.js — namespace, registry, helpers
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

/* ---------- tiny static syntax highlighter for Python ---------- */
(function () {
  const KW = new Set(("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield").split(" "));
  const BUILTIN = new Set(("print input int float str bool list dict tuple set range len type abs round pow sum min max sorted open enumerate zip map filter id help complex frozenset").split(" "));
  App.highlight = function (code) {
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
})();
