/* ============================================================
   editor.js — runnable code block (CodeMirror + Pyodide).
   Every editor has BOTH "Run" (output) and "Step Run" (line-by-line).
   ============================================================ */
App.makeLive = function (code, opts) {
  opts = opts || {};
  const h = App.h;
  const wrap = h("div", { class: "live" });
  const head = h("div", { class: "live-head" }, h("span", { class: "title" }, opts.title || "Edit and run real Python"));
  const spacer = h("span", { class: "spacer" });
  const resetBtn = h("button", { class: "btn ghost", title: "Reset code" }, "Reset");
  const stepBtn = h("button", { class: "btn ghost" }, "▶ Step Run");
  const runBtn = h("button", { class: "btn" }, "▶ Run");
  head.append(spacer, resetBtn, stepBtn, runBtn);

  const taHost = h("div");
  const out = h("div", { class: "live-out muted" }, "Run the code, or Step Run to walk it line by line.");

  // step-through stage (hidden until Step Run)
  const stage = h("div", { class: "steprun-stage hidden" });
  const codeView = h("div", { class: "step-code" });
  const varsView = h("div", { class: "step-vars-wrap" });
  const outView = h("div", { class: "step-out" });
  const ctrl = h("div", { class: "steprun-ctrl" });
  const prev = h("button", { class: "w-btn" }, "‹ Prev");
  const play = h("button", { class: "w-btn on" }, "▶ Play");
  const next = h("button", { class: "w-btn" }, "Next ›");
  const counter = h("span", { class: "mono", style: "color:var(--text-dim)" });
  ctrl.append(prev, play, next, counter);
  stage.append(
    h("div", { class: "steprun-grid" },
      h("div", null, h("div", { class: "widget-title" }, "Code (▸ = current line)"), codeView),
      h("div", null, h("div", { class: "widget-title" }, "Variables now"), varsView,
        h("div", { class: "widget-title", style: "margin-top:10px" }, "Output so far"), outView)),
    ctrl);

  wrap.append(head, taHost, out, stage);

  let cm, steps = [], finalOut = "", i = 0, timer = null, lines = [];
  requestAnimationFrame(() => {
    cm = CodeMirror(taHost, {
      value: code, mode: "python",
      theme: document.body.dataset.theme === "light" ? "default" : "material-darker",
      lineNumbers: true, indentUnit: 4, viewportMargin: Infinity,
      extraKeys: { "Shift-Enter": () => doRun(), Tab: (c) => c.replaceSelection("    ") },
    });
    wrap._cm = cm;
  });

  /* ---- Run ---- */
  async function doRun() {
    if (!cm) return;
    stopPlay(); stage.classList.add("hidden");
    out.classList.remove("hidden");
    runBtn.disabled = stepBtn.disabled = true; runBtn.textContent = "Running…";
    out.className = "live-out"; out.textContent = "";
    let printed = false;
    const res = await App.py.run(cm.getValue(), {
      inputs: opts.inputs,
      sink: (t, e) => { printed = true; out.appendChild(h("span", { class: e ? "err" : "" }, t)); out.scrollTop = out.scrollHeight; },
      onImage: (url) => { printed = true; out.appendChild(h("img", { src: url, alt: "plot output" })); },
    });
    if (!printed && res.ok) out.appendChild(h("span", { class: "muted" }, "(ran with no output)"));
    runBtn.disabled = stepBtn.disabled = false; runBtn.textContent = "▶ Run";
  }

  /* ---- Step Run ---- */
  function draw() {
    const s = steps[i];
    codeView.innerHTML = "";
    lines.forEach((ln, idx) => {
      const hl = idx === s.line - 1;
      codeView.appendChild(h("span", { class: "ln" + (hl ? " hl" : "") },
        h("span", { class: "marker" }, hl ? "▸ " : "  "),
        h("span", { html: App.highlight(ln) || "&nbsp;" })));
    });
    varsView.innerHTML = "";
    const keys = Object.keys(s.vars);
    if (!keys.length) varsView.appendChild(h("span", { style: "color:var(--text-dim)" }, "(no variables yet)"));
    else { const row = h("div", { class: "step-vars" }); keys.forEach((k) => row.appendChild(h("span", { class: "var-chip" }, h("b", null, k), " = " + s.vars[k]))); varsView.appendChild(row); }
    const scopeNote = s.scope && s.scope !== "<module>" ? "  (inside " + s.scope + "())" : "";
    const shownOut = i === steps.length - 1 ? finalOut : s.out;
    outView.textContent = (shownOut || "(no output yet)") + scopeNote;
    counter.textContent = " line " + s.line + "  ·  step " + (i + 1) + " / " + steps.length;
    prev.disabled = i === 0; next.disabled = i === steps.length - 1;
  }
  function go(n) { i = Math.max(0, Math.min(steps.length - 1, n)); draw(); if (i === steps.length - 1) stopPlay(); }
  function stopPlay() { if (timer) { clearInterval(timer); timer = null; play.textContent = "▶ Play"; } }
  prev.addEventListener("click", () => { stopPlay(); go(i - 1); });
  next.addEventListener("click", () => { stopPlay(); go(i + 1); });
  play.addEventListener("click", () => {
    if (timer) { stopPlay(); return; }
    if (i === steps.length - 1) i = 0;
    play.textContent = "⏸ Pause";
    timer = setInterval(() => { if (i >= steps.length - 1) stopPlay(); else go(i + 1); }, 750);
  });
  async function doStep() {
    if (!cm) return;
    stopPlay(); out.classList.add("hidden");
    stepBtn.disabled = runBtn.disabled = true; stepBtn.textContent = "Tracing…";
    const data = await App.py.trace(cm.getValue(), { inputs: opts.inputs });
    stepBtn.disabled = runBtn.disabled = false; stepBtn.textContent = "▶ Step Run";
    lines = cm.getValue().split("\n");
    steps = data.steps || [];
    finalOut = data.final_out || "";
    stage.classList.remove("hidden");
    if (!steps.length) {
      codeView.innerHTML = ""; varsView.innerHTML = ""; ctrl.classList.add("hidden");
      outView.innerHTML = '<span class="err">' + App.esc(data.error || "Nothing to trace.") + "</span>";
      return;
    }
    ctrl.classList.remove("hidden");
    if (data.error) finalOut += "\n" + data.error;
    if (data.truncated) finalOut += "\n[trace stopped after 1000 steps]";
    i = 0; draw();
  }

  runBtn.addEventListener("click", doRun);
  stepBtn.addEventListener("click", doStep);
  resetBtn.addEventListener("click", () => {
    stopPlay(); if (cm) cm.setValue(code);
    stage.classList.add("hidden"); out.classList.remove("hidden");
    out.className = "live-out muted"; out.textContent = "Run the code, or Step Run to walk it line by line.";
  });
  return wrap;
};

/* ============================================================
   makePractice — a "write code to…" question with Run + Check
   cfg: { prompt(html), starter, expected, inputs?, hint? }
   ============================================================ */
App.makePractice = function (cfg) {
  const wrap = App.h("div", { class: "practiceq" });
  wrap.appendChild(App.h("div", { class: "pq-prompt", html: cfg.prompt }));
  if (cfg.expected != null) {
    wrap.appendChild(App.h("div", { class: "pq-target" },
      App.h("span", { class: "pq-label" }, "Target output"),
      App.h("pre", null, cfg.expected)));
  }
  const editorWrap = App.h("div", { class: "live" });
  const head = App.h("div", { class: "live-head" }, App.h("span", { class: "title" }, "Your code"));
  const spacer = App.h("span", { class: "spacer" });
  const resetBtn = App.h("button", { class: "btn ghost" }, "Reset");
  const runBtn = App.h("button", { class: "btn ghost" }, "▶ Run");
  const checkBtn = App.h("button", { class: "btn" }, "✓ Check");
  head.append(spacer, resetBtn, runBtn, checkBtn);
  const taHost = App.h("div");
  const out = App.h("div", { class: "live-out muted" }, "Write your solution, then Run to test it or Check to grade it.");
  const badge = App.h("div", { class: "pq-badge hidden" });
  editorWrap.append(head, taHost, out);
  wrap.append(editorWrap, badge);

  const starter = cfg.starter != null ? cfg.starter : "# Write your code here\n";
  let cm;
  requestAnimationFrame(() => {
    cm = CodeMirror(taHost, {
      value: starter, mode: "python",
      theme: document.body.dataset.theme === "light" ? "default" : "material-darker",
      lineNumbers: true, indentUnit: 4, viewportMargin: Infinity,
      extraKeys: { "Shift-Enter": () => doRun(), Tab: (c) => c.replaceSelection("    ") },
    });
    editorWrap._cm = cm;
  });

  const norm = (s) => String(s).replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/^\n+|\n+$/g, "");

  async function collect() {
    let buf = "";
    const res = await App.py.run(cm.getValue(), { inputs: cfg.inputs, sink: (t) => { buf += t; }, onImage: () => {} });
    return { buf, ok: res.ok, error: res.error };
  }

  async function doRun() {
    if (!cm) return;
    runBtn.disabled = checkBtn.disabled = true; runBtn.textContent = "Running…";
    badge.className = "pq-badge hidden";
    const { buf } = await collect();
    out.className = "live-out";
    out.textContent = buf || "(no output)";
    runBtn.disabled = checkBtn.disabled = false; runBtn.textContent = "▶ Run";
  }

  async function doCheck() {
    if (!cm) return;
    runBtn.disabled = checkBtn.disabled = true; checkBtn.textContent = "Checking…";
    const { buf, ok, error } = await collect();
    out.className = "live-out"; out.textContent = buf || "(no output)";
    badge.classList.remove("hidden");
    if (ok && norm(buf) === norm(cfg.expected)) {
      badge.className = "pq-badge ok";
      badge.textContent = "✓ Correct! Your output matches the target.";
    } else {
      badge.className = "pq-badge no";
      badge.innerHTML = "✗ Not quite yet. Compare your output with the target above" + (error ? " (your code errored)" : "") + ".";
      if (cfg.hint) badge.appendChild(App.h("div", { style: "font-weight:400;margin-top:6px;color:var(--text)" }, "Hint: " + cfg.hint));
    }
    runBtn.disabled = checkBtn.disabled = false; checkBtn.textContent = "✓ Check";
  }

  runBtn.addEventListener("click", doRun);
  checkBtn.addEventListener("click", doCheck);
  resetBtn.addEventListener("click", () => { if (cm) cm.setValue(starter); out.className = "live-out muted"; out.textContent = "Write your solution, then Run to test it or Check to grade it."; badge.className = "pq-badge hidden"; });
  return wrap;
};

/* makeStepRun — the unified editor already has a Step Run button. */
App.makeStepRun = App.makeLive;
