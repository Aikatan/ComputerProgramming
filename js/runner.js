/* ============================================================
   runner.js — in-browser Python via Pyodide
   Lazy-loaded on first Run. Supports stdin (input), stdout,
   matplotlib (PNG capture) and pandas/numpy.
   ============================================================ */
App.py = {
  _pyodide: null,
  _loading: null,
  _pkgsLoaded: new Set(),

  setStatus(state, label) {
    const el = document.getElementById("pyStatus");
    if (!el) return;
    el.className = "py-status " + (state || "");
    el.querySelector(".label").textContent = "Python: " + label;
  },

  async ensure() {
    if (this._pyodide) return this._pyodide;
    if (this._loading) return this._loading;
    this.setStatus("loading", "loading…");
    this._loading = (async () => {
      const pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" });
      // capture print() into JS callback. Pyodide's batched callback delivers
      // one line at a time WITHOUT its trailing newline. We join chunks with a
      // deferred newline so the final (possibly partial) line has no extra blank
      // line, while still flushing partials (see the newline write in run()).
      pyodide.setStdout({ batched: (s) => { if (App.py._pendingNL) App.py._emit("\n"); App.py._emit(s); App.py._pendingNL = true; } });
      pyodide.setStderr({ batched: (s) => { if (App.py._pendingNL) { App.py._emit("\n"); App.py._pendingNL = false; } App.py._emit(s + "\n", true); } });
      this._pyodide = pyodide;
      this.setStatus("ready", "ready");
      return pyodide;
    })();
    return this._loading;
  },

  _emit(text, isErr) {
    if (this._sink) this._sink(text, isErr);
  },

  async _loadPkgs(code) {
    const needs = [];
    if (/\b(import|from)\s+numpy/.test(code) && !this._pkgsLoaded.has("numpy")) needs.push("numpy");
    if (/\b(import|from)\s+pandas/.test(code) && !this._pkgsLoaded.has("pandas")) needs.push("pandas");
    if (/\b(import|from)\s+matplotlib/.test(code) && !this._pkgsLoaded.has("matplotlib")) needs.push("matplotlib");
    if (needs.length) {
      this.setStatus("loading", "loading " + needs.join(", ") + "…");
      await this._pyodide.loadPackage(needs);
      needs.forEach((n) => this._pkgsLoaded.add(n));
    }
  },

  /* run code; opts: { sink(text,isErr), inputs:[...]|prompt-fn, onImage(dataURL) } */
  async run(code, opts) {
    opts = opts || {};
    const py = await this.ensure();
    await this._loadPkgs(code);
    this._sink = opts.sink || (() => {});
    this._pendingNL = false;
    this.setStatus("busy", "running…");

    // queued inputs for input()
    const inputs = Array.isArray(opts.inputs) ? opts.inputs.slice() : null;
    py.globals.set("__js_input__", (promptText) => {
      const p = promptText || "";
      let val;
      if (inputs && inputs.length) val = inputs.shift();
      else val = window.prompt(p) ?? "";
      if (p) App.py._emit(p + String(val) + "\n");
      return String(val);
    });

    const hasPlot = /matplotlib|pyplot|plt\./.test(code);
    let wrapped =
      "import builtins as __b\n" +
      "__b.input = lambda prompt='': __js_input__(prompt)\n";
    if (hasPlot) {
      wrapped +=
        "import warnings as __w; __w.filterwarnings('ignore')\n" +
        "import matplotlib\nmatplotlib.use('AGG')\n" +
        "import matplotlib.pyplot as __plt_capture\n" +
        "__plt_capture.show = lambda *a, **k: None\n";
    }
    wrapped += "import sys as __sys\n__user_ns = {}\n";
    // We exec user code in a fresh namespace each run
    py.globals.set("__user_code__", code);
    wrapped +=
      "exec(__user_code__, __user_ns)\n";
    if (hasPlot) {
      wrapped +=
        "import io as __io, base64 as __b64\n" +
        "for __i in __plt_capture.get_fignums():\n" +
        "    __f = __plt_capture.figure(__i)\n" +
        "    __buf = __io.BytesIO(); __f.savefig(__buf, format='png', bbox_inches='tight', dpi=110)\n" +
        "    __png = __b64.b64encode(__buf.getvalue()).decode()\n" +
        "    __js_image__('data:image/png;base64,' + __png)\n" +
        "__plt_capture.close('all')\n";
      py.globals.set("__js_image__", (url) => { if (opts.onImage) opts.onImage(url); });
    }

    // Force Pyodide to emit any buffered partial line (e.g. print(..., end=" ")
    // with no trailing newline). A newline write triggers the batched callback;
    // the deferred-newline handler keeps this from adding a visible blank line.
    wrapped += "__sys.stdout.write('\\n')\n";

    try {
      await py.runPythonAsync(wrapped);
      this.setStatus("ready", "ready");
      return { ok: true };
    } catch (e) {
      // Pyodide wraps Python tracebacks in the message
      let msg = String(e.message || e);
      // trim the JS-side wrapper lines, keep the python traceback tail
      const idx = msg.indexOf("Traceback (most recent call last)");
      if (idx >= 0) msg = msg.slice(idx);
      // strip references to our wrapper file lines
      msg = msg.replace(/\n\s*File "<exec>".*\n.*\n/g, "\n");
      this._sink(msg, true);
      this.setStatus("ready", "ready");
      return { ok: false, error: msg };
    }
  },

  /* Trace code line-by-line. Returns { steps:[{line,scope,vars,out}], final_out, error, truncated } */
  async trace(code, opts) {
    opts = opts || {};
    const py = await this.ensure();
    await this._loadPkgs(code);
    this.setStatus("busy", "tracing…");
    const inputs = Array.isArray(opts.inputs) ? opts.inputs.slice() : [];
    py.globals.set("__js_input__", (p) => (inputs.length ? String(inputs.shift()) : ""));
    py.globals.set("__user_src__", code);
    const driver = [
      "import sys, io, json, builtins, contextlib, types as __types",
      "builtins.input = lambda prompt='': __js_input__(prompt)",
      "__src = __user_src__",
      "__steps = []",
      "__out = io.StringIO()",
      "__MAX = 1000",
      "__SKIP = (__types.ModuleType, __types.FunctionType, __types.BuiltinFunctionType, __types.MethodType, type)",
      "def __snap(frame):",
      "    d = {}",
      "    for k, v in list(frame.f_locals.items()):",
      "        if k.startswith('__'):",
      "            continue",
      "        if isinstance(v, __SKIP):",
      "            continue",
      "        try:",
      "            r = repr(v)",
      "        except Exception:",
      "            r = '<?>'",
      "        r = r.replace(chr(10), ' ').replace(chr(13), ' ')",
      "        if len(r) > 80:",
      "            r = r[:77] + '...'",
      "        d[k] = r",
      "    return d",
      "def __tracer(frame, event, arg):",
      "    if frame.f_code.co_filename != '<user>':",
      "        return None",
      "    if event == 'line' and len(__steps) < __MAX:",
      "        __steps.append({'line': frame.f_lineno, 'scope': frame.f_code.co_name, 'vars': __snap(frame), 'out': __out.getvalue()})",
      "    return __tracer",
      "__err = None",
      "try:",
      "    __code_obj = compile(__src, '<user>', 'exec')",
      "    sys.settrace(__tracer)",
      "    with contextlib.redirect_stdout(__out):",
      "        exec(__code_obj, {'__name__': '__main__'})",
      "except Exception as e:",
      "    __err = repr(e)",
      "finally:",
      "    sys.settrace(None)",
      "__trace_json = json.dumps({'steps': __steps, 'final_out': __out.getvalue(), 'error': __err, 'truncated': len(__steps) >= __MAX})",
    ].join("\n");
    try {
      await py.runPythonAsync(driver);
      const data = JSON.parse(py.globals.get("__trace_json"));
      this.setStatus("ready", "ready");
      return data;
    } catch (e) {
      this.setStatus("ready", "ready");
      return { steps: [], final_out: "", error: String(e.message || e), truncated: false };
    }
  },
};
