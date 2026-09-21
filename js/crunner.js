/* ============================================================
   crunner.js - in-browser C via JSCPP.
   Lazy-loaded from CDN on first C Run. Captures stdout/stderr,
   feeds stdin from opts.inputs. Mirrors App.py.run's contract so
   editor.js can call either engine the same way.
   ============================================================ */
App.c = {
  _loading: null,
  _url: "https://cdn.jsdelivr.net/npm/JSCPP@2.0.6/dist/JSCPP.es5.min.js",

  /* Work around two JSCPP quirks without changing what the learner sees:
     1. JSCPP rejects the empty-parameter idiom `main(void)`; it wants `main()`.
     2. JSCPP tokenises string contents, so a space next to a comma or a
        parenthesis inside a string literal is dropped ("Hello, World!" prints
        as "Hello,World!"). Rewrite every space inside a double-quoted string
        literal as the \x20 escape so they all survive. Char literals and
        already-escaped characters are left untouched. */
  _prep(code) {
    code = code.replace(/main\s*\(\s*void\s*\)/g, "main()");
    let out = "", i = 0;
    const n = code.length;
    while (i < n) {
      const ch = code[i];
      if (ch === '"') {
        out += ch; i++;
        while (i < n) {
          const c = code[i];
          if (c === "\\") { out += c + (code[i + 1] || ""); i += 2; continue; }
          if (c === '"') { out += c; i++; break; }
          if (c === " ") { out += "\\x20"; i++; continue; }
          out += c; i++;
        }
        continue;
      }
      if (ch === "'") {
        out += ch; i++;
        while (i < n) {
          const c = code[i];
          if (c === "\\") { out += c + (code[i + 1] || ""); i += 2; continue; }
          out += c; i++;
          if (c === "'") break;
        }
        continue;
      }
      out += ch; i++;
    }
    return out;
  },

  /* load JSCPP once; resolves to the global JSCPP object */
  ensure() {
    if (window.JSCPP) return Promise.resolve(window.JSCPP);
    if (this._loading) return this._loading;
    this._loading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = this._url;
      s.onload = () => (window.JSCPP ? resolve(window.JSCPP) : reject(new Error("C engine loaded but not available.")));
      s.onerror = () => { this._loading = null; reject(new Error("Could not load the C engine (check your connection).")); };
      document.head.appendChild(s);
    });
    return this._loading;
  },

  /* run C source. opts: { sink(text,isErr), inputs:[...] }. Returns { ok, error }. */
  async run(code, opts) {
    opts = opts || {};
    const sink = opts.sink || (() => {});
    let JS;
    try {
      JS = await this.ensure();
    } catch (e) {
      sink(String(e.message || e), true);
      return { ok: false, error: String(e.message || e) };
    }
    // JSCPP reads all of stdin as one string; join queued inputs by newline.
    const stdin = Array.isArray(opts.inputs) && opts.inputs.length ? opts.inputs.join("\n") + "\n" : "";
    const config = {
      stdio: { write: (s) => sink(s, false) },
      unsigned_overflow: "silent",
    };
    try {
      // JSCPP.run is synchronous; small course programs finish instantly.
      const exit = JS.run(this._prep(code), stdin, config);
      return { ok: true, exitCode: exit };
    } catch (e) {
      // JSCPP error messages carry the offending line.
      sink(String(e.message || e), true);
      return { ok: false, error: String(e.message || e) };
    }
  },
};
