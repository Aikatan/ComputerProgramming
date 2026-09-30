/* ============================================================
   widgets.js - interactive visuals & animations
   Each function returns a DOM element. Driven by declarative
   config so content files stay readable.
   ============================================================ */
App.widgets = {};
const h = App.h;

/* ---- shell ---- */
function widgetShell(title, body) {
  return h("div", { class: "widget" },
    title ? h("div", { class: "widget-title" }, title) : null, body);
}

/* ============================================================
   infocards - always-visible reading cards (NOT interactive)
   config: { title, layout:'row'|'col', boxes:[{title, body}] }
   ============================================================ */
App.widgets.diagram = function (cfg) {
  const rowCls = cfg.layout === "row" ? "dia-row" : "diagram";
  const box = h("div", { class: rowCls });
  cfg.boxes.forEach((b) => {
    box.appendChild(h("div", { class: "dia-box static on" },
      h("h5", null, b.title),
      h("p", { html: b.body })));
  });
  return widgetShell(cfg.title || null, box);
};
App.widgets.infocards = App.widgets.diagram;

/* ============================================================
   cpuCycle - animated fetch/decode/execute/store
   ============================================================ */
App.widgets.cpuCycle = function (cfg) {
  const stages = (cfg && cfg.stages) || [
    { k: "Fetch", d: "Get next instruction from memory (using the Program Counter)." },
    { k: "Decode", d: "Control Unit interprets what the instruction means." },
    { k: "Execute", d: "ALU performs the arithmetic/logic operation." },
    { k: "Store", d: "Write the result back to a register or memory." },
  ];
  const stRow = h("div", { class: "cpu-stage" });
  const els = stages.map((s) => {
    const el = h("div", { class: "st" }, h("b", null, s.k), s.d);
    stRow.appendChild(el); return el;
  });
  const caption = h("div", { class: "step-log" }, "Press Play to watch one instruction move through the CPU.");
  let timer = null, i = -1;
  const play = h("button", { class: "w-btn on" }, "▶ Play cycle");
  play.addEventListener("click", () => {
    if (timer) { clearInterval(timer); timer = null; play.textContent = "▶ Play cycle"; els.forEach((e) => e.classList.remove("on")); return; }
    play.textContent = "⏸ Stop"; i = -1;
    timer = setInterval(() => {
      els.forEach((e) => e.classList.remove("on"));
      i = (i + 1) % stages.length;
      els[i].classList.add("on");
      caption.textContent = (i + 1) + ". " + stages[i].k + " - " + stages[i].d;
    }, 1100);
  });
  return widgetShell("The CPU instruction cycle", h("div", null, stRow, h("div", { class: "w-row", style: "margin-top:12px" }, play), caption));
};

/* ============================================================
   binaryConverter - char/number <-> 8-bit binary + ASCII
   ============================================================ */
App.widgets.binaryConverter = function (cfg) {
  let value = cfg && cfg.value != null ? cfg.value & 0xff : 65; // 'A'
  const chOf = (v) => (v >= 32 && v < 127 ? String.fromCharCode(v) : "");
  const bitsEl = h("div", { class: "bits" });
  const info = h("div", { class: "step-log" });
  const input = h("input", { class: "w-input mono", type: "text", maxlength: "3", value: chOf(value), style: "width:70px" });
  const numIn = h("input", { class: "w-input mono", type: "number", min: "0", max: "255", value: String(value), style: "width:90px" });

  function render() {
    bitsEl.innerHTML = "";
    for (let b = 7; b >= 0; b--) {
      const on = (value >> b) & 1;
      const bit = h("div", { class: "bit" + (on ? " one" : "") }, String(on), h("small", null, String(1 << b)));
      bit.addEventListener("click", () => { value ^= (1 << b); sync(); });
      bitsEl.appendChild(bit);
    }
    const ch = value >= 32 && value < 127 ? String.fromCharCode(value) : "·";
    info.innerHTML = "decimal <b>" + value + "</b> &nbsp;=&nbsp; binary <b>" + value.toString(2).padStart(8, "0") +
      "</b> &nbsp;=&nbsp; ASCII character <b>'" + ch + "'</b>";
  }
  function sync() { value &= 0xff; input.value = value >= 32 && value < 127 ? String.fromCharCode(value) : ""; numIn.value = value; render(); }
  input.addEventListener("input", () => { if (input.value.length) { value = input.value.charCodeAt(0) & 0xff; numIn.value = value; render(); } });
  numIn.addEventListener("input", () => { value = (parseInt(numIn.value, 10) || 0) & 0xff; input.value = value >= 32 && value < 127 ? String.fromCharCode(value) : ""; render(); });
  render();
  return widgetShell((cfg && cfg.title) || "Binary converter: one byte (8 bits)",
    h("div", null,
      h("div", { class: "w-row" }, h("span", { class: "mono" }, "character:"), input, h("span", { class: "mono" }, "decimal:"), numIn),
      h("div", { style: "margin:12px 0" }, bitsEl), info));
};

/* ============================================================
   truthTable - interactive, with operator selector
   ============================================================ */
App.widgets.truthTable = function (cfg) {
  const ops = (cfg && cfg.ops) || [
    { k: "and", f: (p, q) => p && q, label: "P and Q" },
    { k: "or", f: (p, q) => p || q, label: "P or Q" },
    { k: "not", f: (p) => !p, label: "not P", unary: true },
    { k: "xor", f: (p, q) => p !== q, label: "P != Q  (xor)" },
  ];
  let cur = 0;
  const sel = h("div", { class: "w-row" });
  const tableHost = h("div");
  ops.forEach((o, idx) => {
    const b = h("button", { class: "w-btn" + (idx === 0 ? " on" : "") }, o.label);
    b.addEventListener("click", () => { cur = idx; [...sel.children].forEach((c) => c.classList.remove("on")); b.classList.add("on"); render(); });
    sel.appendChild(b);
  });
  function render() {
    const o = ops[cur];
    const rows = [];
    const combos = o.unary ? [[false], [true]] : [[false, false], [false, true], [true, false], [true, true]];
    const head = h("tr", null, h("th", null, "P"), o.unary ? null : h("th", null, "Q"), h("th", null, o.label));
    combos.forEach((c) => {
      const r = o.f(...c);
      rows.push(h("tr", null,
        h("td", { class: c[0] ? "T" : "F" }, c[0] ? "True" : "False"),
        o.unary ? null : h("td", { class: c[1] ? "T" : "F" }, c[1] ? "True" : "False"),
        h("td", { class: r ? "T" : "F" }, r ? "True" : "False")));
    });
    tableHost.innerHTML = "";
    tableHost.appendChild(h("table", { class: "tt" }, head, ...rows));
  }
  render();
  return widgetShell((cfg && cfg.title) || "Truth table", h("div", null, sel, h("div", { style: "margin-top:12px" }, tableHost)));
};

/* ============================================================
   stepper - generic previous/next state machine
   config: { title, steps:[...], render(step, idx)->node/html, autoLabel }
   ============================================================ */
App.widgets.stepper = function (cfg) {
  let i = 0;
  const stage = h("div");
  const counter = h("span", { class: "mono", style: "color:var(--text-dim)" });
  const prev = h("button", { class: "w-btn" }, "‹ Prev");
  const next = h("button", { class: "w-btn on" }, "Next ›");
  const reset = h("button", { class: "w-btn" }, "⟲");
  function draw() {
    stage.innerHTML = "";
    const node = cfg.render(cfg.steps[i], i);
    if (typeof node === "string") stage.innerHTML = node; else stage.appendChild(node);
    counter.textContent = " step " + (i + 1) + " / " + cfg.steps.length;
    prev.disabled = i === 0; next.disabled = i === cfg.steps.length - 1;
  }
  prev.addEventListener("click", () => { if (i > 0) { i--; draw(); } });
  next.addEventListener("click", () => { if (i < cfg.steps.length - 1) { i++; draw(); } });
  reset.addEventListener("click", () => { i = 0; draw(); });
  draw();
  const shell = widgetShell(cfg.title || "Step through it",
    h("div", null, stage, h("div", { class: "w-row", style: "margin-top:12px" }, prev, next, reset, counter)));
  // used by the deck: keyboard steps the widget before changing slide
  shell.classList.add("kstep");
  shell._step = (dir) => { const j = i + dir; if (j < 0 || j >= cfg.steps.length) return false; i = j; draw(); return true; };
  shell._goto = (where) => { i = where === "end" ? cfg.steps.length - 1 : 0; draw(); };
  return shell;
};

/* helper: render variable chips */
App.widgets.varChips = function (vars) {
  const row = h("div", { class: "step-vars" });
  Object.keys(vars).forEach((k) => row.appendChild(h("span", { class: "var-chip" }, h("b", null, k), " = " + vars[k])));
  return row;
};

/* helper: render code with one highlighted line */
App.widgets.codeLines = function (lines, hlIndex) {
  const box = h("div", { class: "step-code" });
  lines.forEach((ln, idx) => box.appendChild(h("span", { class: "ln" + (idx === hlIndex ? " hl" : ""), html: App.highlight(ln) || "&nbsp;" })));
  return box;
};

/* loopViz - convenience over stepper for line+vars+log traces
   config: { title, code:[lines], trace:[{line, vars, log}] } */
App.widgets.loopViz = function (cfg) {
  return App.widgets.stepper({
    title: cfg.title || "Loop tracer",
    steps: cfg.trace,
    render: (s) => {
      // left: code with a ▸ marker on the current line
      const codeBox = h("div", { class: "step-code" });
      cfg.code.forEach((ln, idx) => {
        const hl = idx === s.line;
        codeBox.appendChild(h("span", { class: "ln" + (hl ? " hl" : "") },
          h("span", { class: "marker" }, hl ? "▸ " : "  "),
          h("span", { html: App.highlight(ln) || "&nbsp;" })));
      });
      // right: variables (memory) then output
      const vars = s.vars || {};
      const right = h("div");
      right.appendChild(h("div", { class: "widget-title" }, "Variables now"));
      if (Object.keys(vars).length) right.appendChild(App.widgets.varChips(vars));
      else right.appendChild(h("span", { style: "color:var(--text-dim)" }, "(no variables yet)"));
      if (s.log != null) {
        right.appendChild(h("div", { class: "widget-title", style: "margin-top:10px" }, "Output so far"));
        right.appendChild(h("div", { class: "step-out" }, s.log || "(no output yet)"));
      }
      return h("div", { class: "steprun-grid" },
        h("div", null, h("div", { class: "widget-title" }, "Code (▸ = current line)"), codeBox),
        right);
    },
  });
};

/* ============================================================
   Code traces - one authored trace object drives two views:
   - codeTrace  : step-by-step execution (current line, variables, output)
   - traceTable : the same trace as a static table (all rows visible)
   trace = { code:[lines], steps:[{ line, note, set:{name:"py literal"|{v,t}}, print }] }
   - line  : 0-based index into code; -1 = before the program starts
   - set   : only the variables that change on this step (values accumulate)
   - print : text this step adds to the output (may contain \n)
   ============================================================ */
function pyLitType(text) {
  const s = String(text).trim();
  if (/^(['"]).*\1$/s.test(s)) return "str";
  if (s === "True" || s === "False") return "bool";
  if (s === "None") return "none";
  if (/^-?\d+$/.test(s)) return "int";
  if (/^-?(\d+\.\d*|\.\d+|\d+(\.\d*)?[eE][-+]?\d+)$/.test(s)) return "float";
  return "obj";
}
function traceVal(x) {
  if (x && typeof x === "object") return { text: String(x.v), type: x.t || pyLitType(x.v) };
  return { text: String(x), type: pyLitType(x) };
}
App.traceStates = function (cfg) {
  const names = [], vars = {}, out = [];
  const states = cfg.steps.map((st) => {
    const changed = [];
    // unset: local variables that disappear when their function returns
    if (st.unset) st.unset.forEach((k) => { delete vars[k]; });
    if (st.set) Object.keys(st.set).forEach((k) => {
      if (!names.includes(k)) names.push(k);
      vars[k] = traceVal(st.set[k]); changed.push(k);
    });
    let printed = null;
    if (st.print != null) { printed = String(st.print); printed.split("\n").forEach((ln) => out.push(ln)); }
    return { line: st.line, note: st.note || "", vars: Object.assign({}, vars), changed, out: out.slice(), printed };
  });
  return { names, states, maxOut: out.length };
};

/* codeTrace - config: a trace object (+ optional title) */
App.widgets.codeTrace = function (cfg) {
  const T = App.traceStates(cfg);
  const n = T.states.length;
  let i = 0;

  // program with line numbers and a marker on the current line
  const codeBox = h("div", { class: "step-code ct-code" });
  const lineEls = cfg.code.map((ln, idx) => {
    const el = h("span", { class: "ln" },
      h("span", { class: "ct-no" }, String(idx + 1)),
      h("span", { class: "marker" }, "  "),
      h("span", { html: App.highlight(ln, cfg.lang) || "&nbsp;" }));
    codeBox.appendChild(el);
    return el;
  });

  // one reserved slot per variable, so the layout never jumps
  const varsBox = h("div", { class: "ct-vars" });
  const varEls = {};
  T.names.forEach((nm) => {
    const ball = h("span", { class: "bt-ball" });
    const el = h("div", { class: "ct-var" }, h("span", { class: "ct-name" }, nm), h("span", { class: "ct-eq" }, "="), ball);
    el._ball = ball;
    varEls[nm] = el;
    varsBox.appendChild(el);
  });
  const noVars = h("div", { class: "ct-empty" }, "No variables yet.");
  const outBox = h("div", { class: "step-out ct-out" });
  outBox.style.setProperty("--ct-out-lines", Math.max(1, T.maxOut));
  const note = h("div", { class: "ct-note" });
  // reserve space for the longest note (1 or 2 lines), so the buttons do not move
  const longNote = T.states.some((s) => s.note.replace(/<[^>]+>/g, "").length > 80);
  note.style.minHeight = longNote ? "2.9em" : "1.5em";
  const count = h("span", { class: "ct-count" });
  const first = h("button", { class: "w-btn", title: "First step" }, "⟲");
  const prev = h("button", { class: "w-btn" }, "‹ Prev");
  const next = h("button", { class: "w-btn on" }, "Next ›");

  function draw() {
    const s = T.states[i];
    lineEls.forEach((el, idx) => {
      const cur = idx === s.line;
      el.classList.toggle("hl", cur);
      el.children[1].textContent = cur ? "▸ " : "  ";
    });
    let any = false;
    T.names.forEach((nm) => {
      const el = varEls[nm], v = s.vars[nm];
      el.classList.toggle("ct-pending", !v);
      el.classList.toggle("ct-set", s.changed.includes(nm));
      if (v) { any = true; el._ball.className = "bt-ball bt-" + v.type; el._ball.textContent = v.text; }
    });
    noVars.style.display = any ? "none" : "";
    outBox.replaceChildren(...(s.out.length ? s.out.map((ln, k) =>
      h("div", { class: k >= s.out.length - (s.printed != null ? s.printed.split("\n").length : 0) ? "ct-new" : "" }, ln || " "))
      : [h("div", { class: "ct-dim" }, "(no output yet)")]));
    const where = s.line >= 0 ? "Line " + (s.line + 1) + ": " : (i === 0 ? "Start: " : "End: ");
    note.innerHTML = "<b>" + where + "</b>" + s.note;
    count.textContent = "Step " + (i + 1) + " of " + n;
    first.disabled = prev.disabled = i === 0;
    next.disabled = i === n - 1;
  }
  function go(k) { const j = Math.max(0, Math.min(n - 1, k)); if (j === i) return false; i = j; draw(); return true; }
  first.addEventListener("click", () => go(0));
  prev.addEventListener("click", () => go(i - 1));
  next.addEventListener("click", () => go(i + 1));

  const hasVars = T.names.length > 0; // a print-only program shows no variables panel
  // A long program (more than 8 lines) keeps the note and the buttons in the right
  // column, under the output, so that the trace is no taller than its code.
  const side = cfg.code.length > 8;
  const ctrl = h("div", { class: "w-row ct-ctrl" }, first, prev, next, count);
  const wrap = h("div", { class: "widget ctrace" + (side ? " ct-side" : "") },
    cfg.title ? h("div", { class: "widget-title" }, cfg.title) : null,
    h("div", { class: "ct-grid" },
      codeBox,
      h("div", { class: "ct-state" },
        hasVars ? h("div", { class: "ct-label" }, "Variables") : null, hasVars ? noVars : null, hasVars ? varsBox : null,
        h("div", { class: "ct-label" }, "Output"), outBox,
        side ? note : null, side ? ctrl : null)),
    side ? null : note,
    side ? null : ctrl);
  // used by the deck: keyboard steps the trace before changing slide
  wrap._step = (dir) => go(i + dir);
  wrap._goto = (where) => { i = where === "end" ? n - 1 : 0; draw(); };
  draw();
  return wrap;
};

/* traceTable - config: { trace, blank?, given?, rows?:[from,to] }
   Normal: Line | What happens | one column per variable | Output
   Blank : Line | Code | empty boxes to fill in (rows before `given` stay filled) */
App.widgets.traceTable = function (cfg) {
  // flowchart mode: the rows name the shape instead of a code line
  const flow = cfg.flow;
  const trace = flow
    ? { code: flow.nodes.map((n) => n.text), steps: flow.trace.map((s) => Object.assign({}, s, { line: flow.nodes.findIndex((n) => n.id === s.node) })) }
    : cfg.trace;
  const T = App.traceStates(trace);
  const code = trace.code;
  let rows = T.states.map((s, k) => ({ s, k })).filter((r) => r.s.line >= 0);
  if (cfg.rows) rows = rows.slice(cfg.rows[0], cfg.rows[1]);
  const given = cfg.blank ? (cfg.given || 0) : Infinity;
  const lead = flow ? (cfg.blank ? ["Shape"] : ["Shape", "What happens"]) : ["Line", cfg.blank ? "Code" : "What happens"];
  const head = lead.concat(T.names, ["Output"]);
  const thead = h("thead", null, h("tr", null, ...head.map((c, ci) =>
    h("th", { class: ci >= lead.length && ci < lead.length + T.names.length ? "tt-var" : "" }, c))));
  const tbody = h("tbody");
  rows.forEach((r, ri) => {
    const s = r.s, fill = ri < given;
    const tr = h("tr");
    if (flow) {
      tr.appendChild(h("td", { class: "tt-code", "data-label": "Shape" }, code[s.line] || ""));
      if (!cfg.blank) tr.appendChild(h("td", { class: "tt-note", "data-label": "What happens", html: s.note }));
    } else {
      tr.appendChild(h("td", { class: "tt-line", "data-label": "Line" }, String(s.line + 1)));
      if (cfg.blank) tr.appendChild(h("td", { class: "tt-code", "data-label": "Code", html: App.highlight(code[s.line] || "", trace.lang) }));
      else tr.appendChild(h("td", { class: "tt-note", "data-label": "What happens", html: s.note }));
    }
    T.names.forEach((nm) => {
      const v = s.vars[nm];
      const td = h("td", { class: "tt-var", "data-label": nm });
      if (!fill) td.appendChild(h("span", { class: "tt-box" }));
      else if (v && s.changed.includes(nm)) td.appendChild(h("span", { class: "tt-val bt-ball bt-" + v.type }, v.text));
      else if (v) td.appendChild(h("span", { class: "tt-same" }, v.text));
      else td.appendChild(h("span", { class: "tt-dim" }, "–"));
      tr.appendChild(td);
    });
    const outTd = h("td", { class: "tt-out", "data-label": "Output" });
    if (!fill) outTd.appendChild(h("span", { class: "tt-box" }));
    else outTd.textContent = s.printed != null ? s.printed : "";
    tr.appendChild(outTd);
    tbody.appendChild(tr);
  });
  return h("div", { class: "ttab-wrap" + (cfg.blank ? " tt-blank" : "") },
    cfg.title ? h("div", { class: "widget-title" }, cfg.title) : null,
    h("table", { class: "ttab" }, thead, tbody));
};

/* ============================================================
   memoryModel - stack frames / pointers (C-style illustration)
   config: { title, columns:[{ head, cells:[{addr,name,val,kind,note}] }], note }
   ============================================================ */
App.widgets.memoryModel = function (cfg) {
  const mem = h("div", { class: "mem" });
  cfg.columns.forEach((col) => {
    const c = h("div", { class: "mem-col" }, h("h5", null, col.head));
    col.cells.forEach((cell) => {
      const cls = "cell" + (cell.kind === "ptr" ? " ptr" : "") + (cell.kind === "frame" ? " frame" : "");
      c.appendChild(h("div", { class: cls },
        h("span", null, cell.addr ? h("span", { class: "addr" }, cell.addr + " ") : null, cell.name ? cell.name + ":" : ""),
        h("span", { class: "val" }, String(cell.val))));
      if (cell.note) c.appendChild(h("div", { class: "step-log", style: "margin:2px 0 8px" }, cell.note));
    });
    mem.appendChild(c);
  });
  return widgetShell(cfg.title || "How it sits in memory",
    h("div", null, mem, cfg.note ? h("div", { class: "step-log", style: "margin-top:10px" }, cfg.note) : null));
};

/* ============================================================
   flowchart - a flowchart drawn at 1:1 scale, so its text is exactly
   24px on slides. Shapes sit on a grid; arrows are routed automatically.
   config: {
     nodes: [{ id, type, text, col, row }],
       type: terminator | process | io | decision | predefined | connector
     cols:  [x offsets of the columns] (default [0])
     edges: [{ from, to, port, lane, laneIndex, label }]
       port: bottom (default) | left | right   (where the arrow leaves)
       lane: left | right  (go around through a side lane: loop back, exit)
     code:  [python lines]           (optional, shown beside the chart)
     map:   { nodeId: [line indices] }
     trace: [{ node, note, set, print }]   (optional: step-by-step mode)
   }
   ============================================================ */
const FC = { fs: 24, h: 40, hDec: 64, gap: 16, gapDec: 32, lane: 30, pad: 22, margin: 8 };
let fcMeasureCtx = null;
function fcTextW(text) {
  if (!fcMeasureCtx) fcMeasureCtx = document.createElement("canvas").getContext("2d");
  fcMeasureCtx.font = FC.fs + 'px -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  return fcMeasureCtx.measureText(text).width;
}
function fcLayout(cfg) {
  const cols = cfg.cols || [0];
  const nodes = {};
  cfg.nodes.forEach((n) => {
    const tw = fcTextW(n.text);
    let w, hh = FC.h;
    if (n.type === "decision") { w = Math.max(180, tw * 1.65 + 40); hh = FC.hDec; }
    else if (n.type === "io") w = Math.max(150, tw + 2 * FC.pad + 24);
    else if (n.type === "predefined") w = Math.max(150, tw + 2 * FC.pad + 20);
    else if (n.type === "connector") { w = Math.max(FC.h, tw + 24); }
    else w = Math.max(130, tw + 2 * FC.pad);
    nodes[n.id] = Object.assign({}, n, { w, h: hh, tw });
  });
  // rows: each row as tall as its tallest shape
  const maxRow = Math.max(...cfg.nodes.map((n) => n.row));
  const rowH = [];
  for (let r = 0; r <= maxRow; r++) rowH[r] = FC.h;
  Object.values(nodes).forEach((n) => { rowH[n.row] = Math.max(rowH[n.row], n.h); });
  // below a row with a decision there is room for its True/False label
  const hasDec = []; Object.values(nodes).forEach((n) => { if (n.type === "decision") hasDec[n.row] = true; });
  const rowY = []; let y = FC.margin, lastGap = 0;
  for (let r = 0; r <= maxRow; r++) { rowY[r] = y; lastGap = hasDec[r] ? FC.gapDec : FC.gap; y += rowH[r] + lastGap; }
  Object.values(nodes).forEach((n) => {
    n.cx = cols[n.col || 0];
    n.x = n.cx - n.w / 2;
    n.y = rowY[n.row] + (rowH[n.row] - n.h) / 2;
    n.cy = n.y + n.h / 2;
  });
  // lanes left and right of all shapes; shift everything so the left lane is inside
  const minX = Math.min(...Object.values(nodes).map((n) => n.x));
  const maxX = Math.max(...Object.values(nodes).map((n) => n.x + n.w));
  const lanesL = Math.max(0, ...(cfg.edges || []).filter((e) => e.lane === "left").map((e) => (e.laneIndex || 0) + 1));
  const lanesR = Math.max(0, ...(cfg.edges || []).filter((e) => e.lane === "right").map((e) => (e.laneIndex || 0) + 1));
  const labelRoom = 70;
  const shift = labelRoom + lanesL * FC.lane - minX;
  Object.values(nodes).forEach((n) => { n.x += shift; n.cx += shift; });
  const laneX = (side, k) => side === "left" ? minX + shift - (k + 1) * FC.lane : maxX + shift + (k + 1) * FC.lane;
  const width = Math.ceil(maxX + shift + lanesR * FC.lane + labelRoom);
  const height = Math.ceil(y - lastGap + FC.margin);
  return { nodes, laneX, width, height };
}
function fcShape(svgNS, n) {
  const g = document.createElementNS(svgNS, "g");
  g.setAttribute("class", "fc-node fc-" + n.type);
  let s;
  if (n.type === "decision") {
    s = document.createElementNS(svgNS, "polygon");
    s.setAttribute("points", `${n.cx},${n.y} ${n.x + n.w},${n.cy} ${n.cx},${n.y + n.h} ${n.x},${n.cy}`);
  } else if (n.type === "io") {
    s = document.createElementNS(svgNS, "polygon");
    const k = 14;
    s.setAttribute("points", `${n.x + k},${n.y} ${n.x + n.w},${n.y} ${n.x + n.w - k},${n.y + n.h} ${n.x},${n.y + n.h}`);
  } else if (n.type === "connector") {
    s = document.createElementNS(svgNS, "circle");
    s.setAttribute("cx", n.cx); s.setAttribute("cy", n.cy); s.setAttribute("r", n.h / 2);
  } else {
    s = document.createElementNS(svgNS, "rect");
    s.setAttribute("x", n.x); s.setAttribute("y", n.y); s.setAttribute("width", n.w); s.setAttribute("height", n.h);
    s.setAttribute("rx", n.type === "terminator" ? n.h / 2 : 4);
  }
  s.setAttribute("class", "fc-box");
  g.appendChild(s);
  if (n.type === "predefined") {
    [n.x + 10, n.x + n.w - 10].forEach((lx) => {
      const l = document.createElementNS(svgNS, "line");
      l.setAttribute("x1", lx); l.setAttribute("x2", lx); l.setAttribute("y1", n.y); l.setAttribute("y2", n.y + n.h);
      l.setAttribute("class", "fc-box");
      g.appendChild(l);
    });
  }
  const t = document.createElementNS(svgNS, "text");
  t.setAttribute("x", n.cx); t.setAttribute("y", n.cy + 8);
  t.setAttribute("text-anchor", "middle");
  t.setAttribute("class", "fc-text");
  t.textContent = n.text;
  g.appendChild(t);
  return g;
}
let fcIds = 0;
function fcSvg(cfg) {
  const L = fcLayout(cfg);
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  const mid = "fc-arrow-" + (++fcIds);
  svg.setAttribute("viewBox", "0 0 " + L.width + " " + L.height);
  svg.setAttribute("width", L.width); svg.setAttribute("height", L.height);
  svg.setAttribute("class", "fc-svg");
  svg.innerHTML = `<defs><marker id="${mid}" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L9,4 L0,8 Z" class="fc-head"/></marker></defs>`;
  const port = (n, p) => p === "left" ? [n.x, n.cy] : p === "right" ? [n.x + n.w, n.cy] : [n.cx, n.y + n.h];
  (cfg.edges || []).forEach((e) => {
    const a = L.nodes[e.from], b = L.nodes[e.to];
    if (!a || !b) return;
    const p = e.port || "bottom";
    const [sx, sy] = port(a, p);
    const tx = b.cx, ty = b.y;
    let pts;
    if (b.row === a.row && !e.lane) {
      // same row: straight into the side of the target
      pts = [[sx, sy], [b.cx > a.cx ? b.x : b.x + b.w, sy]];
    } else if (e.lane) {
      const lx = L.laneX(e.lane, e.laneIndex || 0);
      pts = p === "bottom" ? [[sx, sy], [sx, sy + 14], [lx, sy + 14], [lx, ty - 14], [tx, ty - 14], [tx, ty]]
                           : [[sx, sy], [lx, sy], [lx, ty - 14], [tx, ty - 14], [tx, ty]];
    } else if (p === "left" || p === "right") pts = [[sx, sy], [tx, sy], [tx, ty]];
    else if (Math.abs(sx - tx) < 1) pts = [[sx, sy], [tx, ty]];
    else pts = [[sx, sy], [sx, ty - 14], [tx, ty - 14], [tx, ty]];
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M" + pts.map((q) => q[0] + "," + q[1]).join(" L"));
    path.setAttribute("class", "fc-line");
    path.setAttribute("marker-end", "url(#" + mid + ")");
    svg.appendChild(path);
    if (e.label) {
      const t = document.createElementNS(svgNS, "text");
      const side = p === "left" ? "end" : "start";
      t.setAttribute("x", p === "left" ? sx - 6 : sx + 6);
      t.setAttribute("y", p === "bottom" ? sy + 26 : sy - 8);
      t.setAttribute("text-anchor", side);
      t.setAttribute("class", "fc-label");
      t.textContent = e.label;
      svg.appendChild(t);
    }
  });
  const els = {};
  cfg.nodes.forEach((n) => { els[n.id] = fcShape(svgNS, L.nodes[n.id]); svg.appendChild(els[n.id]); });
  return { svg, els };
}

App.widgets.flowchart = function (cfg) {
  const { svg, els } = fcSvg(cfg);
  const chart = h("div", { class: "fc-chart" }, svg);
  const lineEls = [];
  const codeBox = cfg.code ? h("div", { class: "step-code fc-code" }) : null;
  if (cfg.code) cfg.code.forEach((ln) => {
    const el = h("span", { class: "ln" }, h("span", { class: "marker" }, "  "), h("span", { html: App.highlight(ln) || "&nbsp;" }));
    codeBox.appendChild(el); lineEls.push(el);
  });
  if (!cfg.trace) {
    const body = codeBox ? h("div", { class: "fc-grid" }, chart, h("div", { class: "fc-panel" }, h("div", { class: "ct-label" }, "Python"), codeBox)) : chart;
    return widgetShell(cfg.title || null, body);
  }
  // step-by-step mode: the active shape, its code line, variables, output
  const T = App.traceStates({ code: cfg.nodes.map((n) => n.text), steps: cfg.trace.map((s) => Object.assign({}, s, { line: cfg.nodes.findIndex((n) => n.id === s.node) })) });
  const n = T.states.length;
  let i = 0;
  const varsBox = h("div", { class: "ct-vars" });
  const varEls = {};
  T.names.forEach((nm) => {
    const ball = h("span", { class: "bt-ball" });
    const el = h("div", { class: "ct-var" }, h("span", { class: "ct-name" }, nm), h("span", { class: "ct-eq" }, "="), ball);
    el._ball = ball; varEls[nm] = el; varsBox.appendChild(el);
  });
  const outBox = h("div", { class: "step-out ct-out" });
  outBox.style.setProperty("--ct-out-lines", Math.max(1, T.maxOut));
  const note = h("div", { class: "ct-note" });
  note.style.minHeight = T.states.some((s) => s.note.replace(/<[^>]+>/g, "").length > 60) ? "2.9em" : "1.5em";
  const count = h("span", { class: "ct-count" });
  const first = h("button", { class: "w-btn", title: "First step" }, "⟲");
  const prev = h("button", { class: "w-btn" }, "‹ Prev");
  const next = h("button", { class: "w-btn on" }, "Next ›");
  function draw() {
    const s = T.states[i], id = cfg.trace[i].node;
    Object.keys(els).forEach((k) => els[k].classList.toggle("fc-active", k === id));
    const lines = (cfg.map && cfg.map[id]) || [];
    lineEls.forEach((el, k) => { const on = lines.includes(k); el.classList.toggle("hl", on); el.children[0].textContent = on ? "▸ " : "  "; });
    T.names.forEach((nm) => {
      const el = varEls[nm], v = s.vars[nm];
      el.classList.toggle("ct-pending", !v);
      el.classList.toggle("ct-set", s.changed.includes(nm));
      if (v) { el._ball.className = "bt-ball bt-" + v.type; el._ball.textContent = v.text; }
    });
    outBox.replaceChildren(...(s.out.length ? s.out.map((ln) => h("div", null, ln || " ")) : [h("div", { class: "ct-dim" }, "(no output yet)")]));
    note.innerHTML = s.note;
    count.textContent = "Step " + (i + 1) + " of " + n;
    first.disabled = prev.disabled = i === 0;
    next.disabled = i === n - 1;
  }
  function go(k) { const j = Math.max(0, Math.min(n - 1, k)); if (j === i) return false; i = j; draw(); return true; }
  first.addEventListener("click", () => go(0));
  prev.addEventListener("click", () => go(i - 1));
  next.addEventListener("click", () => go(i + 1));
  const panel = h("div", { class: "fc-panel" },
    h("div", { class: "w-row ct-ctrl fc-ctrl" }, first, prev, next, count),
    note,
    codeBox ? h("div", { class: "ct-label" }, "Python") : null, codeBox,
    h("div", { class: "fc-state" },
      T.names.length ? h("div", null, h("div", { class: "ct-label" }, "Variables"), varsBox) : null,
      h("div", null, h("div", { class: "ct-label" }, "Output"), outBox)));
  const wrap = widgetShell(cfg.title || null, h("div", { class: "fc-grid" }, chart, panel));
  wrap.classList.add("ctrace");                       // deck keyboard steps it like a codeTrace
  wrap._step = (dir) => go(i + dir);
  wrap._goto = (where) => { i = where === "end" ? n - 1 : 0; draw(); };
  draw();
  return wrap;
};

/* ============================================================
   listViz - animate a sequence of list/dict states
   config: { title, steps:[{ items:[...]|obj, caption, flash:[idx] }], kind:'list'|'dict' }
   ============================================================ */
App.widgets.listViz = function (cfg) {
  return App.widgets.stepper({
    title: cfg.title || "Watch the structure change",
    steps: cfg.steps,
    render: (s) => {
      const out = h("div");
      const box = h("div", { class: "lv-items" });
      if (cfg.kind === "dict") {
        const obj = s.items;
        Object.keys(obj).forEach((k, idx) => {
          const it = h("div", { class: "lv-item" + (s.flash && s.flash.includes(k) ? " flash" : "") },
            App.esc(k) + ": " + App.esc(String(obj[k])), h("small", null, "key"));
          box.appendChild(it);
        });
        if (!Object.keys(obj).length) box.appendChild(h("div", { class: "lv-item" }, "{ }", h("small", null, "empty")));
      } else {
        (s.items || []).forEach((v, idx) => {
          box.appendChild(h("div", { class: "lv-item" + (s.flash && s.flash.includes(idx) ? " flash" : "") },
            App.esc(String(v)), h("small", null, "[" + idx + "]")));
        });
        if (!(s.items || []).length) box.appendChild(h("div", { class: "lv-item" }, "[ ]", h("small", null, "empty")));
      }
      out.appendChild(box);
      if (s.caption) out.appendChild(h("div", { class: "step-log" }, s.caption));
      return out;
    },
  });
};

/* ============================================================
   funcCall - animated "function machine": argument balls fly into
   parameter slots, the body computes, the result returns to (or is
   discarded by) the caller. Click-stepped with animated ball flight.
   ============================================================ */
App.widgets.funcCall = function () {
  // fixed stage coordinates (centres for balls, boxes by top-left)
  const stage = h("div", { class: "fa-stage" });

  function box(left, top, w, hh, label) {
    const b = h("div", { class: "fa-box", style: `left:${left}px;top:${top}px;width:${w}px;height:${hh}px;` });
    if (label) b.appendChild(h("span", { class: "fa-lbl" }, label));
    b.__c = [left + w / 2, top + hh / 2];
    return b;
  }
  function ball(v) {
    const b = h("div", { class: "fa-ball" }, String(v));
    b.__put = (cx, cy) => { b.classList.remove("hidden"); b.style.left = cx - 19 + "px"; b.style.top = cy - 19 + "px"; };
    b.__hide = (cx, cy) => { if (cx != null) { b.style.left = cx - 19 + "px"; b.style.top = cy - 19 + "px"; } b.classList.add("hidden"); };
    return b;
  }

  const boxA = box(30, 20, 84, 44, "caller: a");
  const expr = h("div", { class: "fa-expr", style: "left:130px;top:30px;" }, "a = area(10, 20)");
  const head = h("div", { class: "fa-head" }, "area(x, y)");
  const body = h("div", { class: "fa-body" }, "return x + 2*y");
  const machine = h("div", { class: "fa-machine", style: "left:175px;top:108px;width:210px;" }, head, body);
  machine.__c = [280, 150];
  const slotX = box(190, 250, 74, 44, "x");
  const slotY = box(300, 250, 74, 44, "y");
  const boxRet = box(420, 145, 100, 44, "return box (z)");
  const b10 = ball(10), b20 = ball(20), bRes = ball(50);
  stage.append(boxA, expr, machine, slotX, slotY, boxRet, b10, b20, bRes);

  const CALL10 = [250, 86], CALL20 = [300, 86];
  let receive = true;

  // step definitions (functions apply the target state; safe to re-run for Prev)
  function steps() {
    return [
      { cap: "You call <b>area(10, 20)</b>. The two argument values wait at the call site.", f() {
        b10.__put(...CALL10); b20.__put(...CALL20); bRes.__hide(...boxRet.__c);
        clearFill(); body.textContent = "return x + 2*y"; machine.classList.remove("hl");
      } },
      { cap: "The <b>first</b> value 10 drops into the <b>first</b> slot <code>x</code> - arguments match parameters <b>by position</b>.", f() {
        b10.__put(...slotX.__c); b20.__put(...CALL20); bRes.__hide(...boxRet.__c);
        fill(slotX, true); hlOnly(slotX); body.textContent = "return x + 2*y";
      } },
      { cap: "The <b>second</b> value 20 drops into the <b>second</b> slot <code>y</code>.", f() {
        b10.__put(...slotX.__c); b20.__put(...slotY.__c); bRes.__hide(...boxRet.__c);
        fill(slotX, true); fill(slotY, true); hlOnly(slotY);
      } },
      { cap: "The body runs using the slot values: <code>10 + 2*20 = 50</code>.", f() {
        b10.__put(...slotX.__c); b20.__put(...slotY.__c); bRes.__hide(...boxRet.__c);
        fill(slotX, true); fill(slotY, true); clearHl(); machine.classList.add("hl");
        body.innerHTML = "10 + 2*20 = <b>50</b>";
      } },
      { cap: "<code>return 50</code> - the result is placed in the return box.", f() {
        b10.__put(...slotX.__c); b20.__put(...slotY.__c); bRes.__put(...boxRet.__c);
        machine.classList.remove("hl"); fill(boxRet, true); hlOnly(boxRet);
      } },
      { cap: receive
          ? "The caller <b>catches</b> it: <code>a = 50</code>."
          : "Nothing catches the result, so <b>50 is discarded</b> (the return box is thrown away).",
        f() {
          b10.__put(...slotX.__c); b20.__put(...slotY.__c);
          if (receive) { bRes.__put(...boxA.__c); fill(boxA, true); hlOnly(boxA); }
          else { bRes.__hide(boxRet.__c[0], boxRet.__c[1] + 130); clearHl(); fill(boxRet, false); }
        } },
    ];
  }
  function fill(bx, on) { bx.classList.toggle("filled", on); }
  function clearFill() { [slotX, slotY, boxRet, boxA].forEach((b) => b.classList.remove("filled")); }
  function clearHl() { [slotX, slotY, boxRet, boxA, machine].forEach((b) => b.classList.remove("hl")); }
  function hlOnly(bx) { clearHl(); bx.classList.add("hl"); }

  // controls
  const caption = h("div", { class: "step-log", style: "text-align:center;min-height:20px" });
  const prev = h("button", { class: "w-btn" }, "‹ Prev");
  const play = h("button", { class: "w-btn on" }, "▶ Play");
  const next = h("button", { class: "w-btn" }, "Next ›");
  const reset = h("button", { class: "w-btn" }, "⟲");
  const counter = h("span", { class: "mono", style: "color:var(--text-dim)" });
  const recBtn = h("button", { class: "w-btn on" }, "a = area(10, 20)");
  const disBtn = h("button", { class: "w-btn" }, "area(10, 20)");
  const toggle = h("div", { class: "w-row", style: "justify-content:center;margin-bottom:8px" },
    h("span", { style: "color:var(--text-dim);font-size:12px" }, "Caller:"), recBtn, disBtn);

  let i = 0, timer = null, S = steps();
  function draw() {
    S = steps();
    S[i].f();
    caption.innerHTML = (i + 1) + ". " + S[i].cap;
    counter.textContent = " step " + (i + 1) + " / " + S.length;
    prev.disabled = i === 0; next.disabled = i === S.length - 1;
  }
  function go(n) { i = Math.max(0, Math.min(steps().length - 1, n)); draw(); if (i === steps().length - 1) stop(); }
  function stop() { if (timer) { clearInterval(timer); timer = null; play.textContent = "▶ Play"; } }
  prev.addEventListener("click", () => { stop(); go(i - 1); });
  next.addEventListener("click", () => { stop(); go(i + 1); });
  reset.addEventListener("click", () => { stop(); go(0); });
  play.addEventListener("click", () => {
    if (timer) { stop(); return; }
    if (i === S.length - 1) i = 0;
    play.textContent = "⏸ Pause";
    draw();
    timer = setInterval(() => { if (i >= steps().length - 1) stop(); else go(i + 1); }, 1400);
  });
  function setMode(r) { receive = r; recBtn.classList.toggle("on", r); disBtn.classList.toggle("on", !r); expr.textContent = r ? "a = area(10, 20)" : "area(10, 20)"; boxA.style.opacity = r ? "1" : ".4"; stop(); go(0); }
  recBtn.addEventListener("click", () => setMode(true));
  disBtn.addEventListener("click", () => setMode(false));

  const controls = h("div", { class: "w-row", style: "justify-content:center;margin-top:10px" }, prev, play, next, reset, counter);
  requestAnimationFrame(draw); // first paint with correct initial positions
  return widgetShell("How a function call works - press Play",
    h("div", null, toggle, h("div", { class: "fa-wrap" }, stage), caption, controls));
};

/* ============================================================
   Shared helpers + funcNested / funcArgs / funcScope animations
   ============================================================ */
(function () {
  const CLR = { blue: "#4dabf7", green: "#3bc9a4", amber: "#ffb454" };
  function mkBox(x, y, w, hh, label, color) {
    const b = h("div", { class: "fa-box", style: `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;` });
    if (color) b.style.borderColor = color;
    if (label) b.appendChild(h("span", { class: "fa-lbl", style: color ? "color:" + color : "" }, label));
    b.__c = [x + w / 2, y + hh / 2];
    b.__fill = (on) => { b.classList.toggle("filled", on); b.style.background = on && color ? color + "22" : ""; if (color) b.style.borderColor = color; };
    b.__hl = (on) => b.classList.toggle("hl", on);
    b.__show = (on) => (b.style.display = on ? "" : "none");
    return b;
  }
  function mkBall(v, color, wide) {
    const b = h("div", { class: "fa-ball" + (wide ? " wide" : "") }, String(v));
    if (color) b.style.background = color;
    b.__put = (cx, cy) => { b.classList.remove("hidden"); b.style.left = cx - 19 + "px"; b.style.top = cy - 19 + "px"; };
    b.__hide = (cx, cy) => { if (cx != null) { b.style.left = cx - 19 + "px"; b.style.top = cy - 19 + "px"; } b.classList.add("hidden"); };
    b.__set = (t) => (b.textContent = t);
    return b;
  }
  function faScene(title, stage, getSteps, buildToggles) {
    const caption = h("div", { class: "step-log", style: "text-align:center;min-height:20px" });
    const prev = h("button", { class: "w-btn" }, "‹ Prev");
    const play = h("button", { class: "w-btn on" }, "▶ Play");
    const next = h("button", { class: "w-btn" }, "Next ›");
    const reset = h("button", { class: "w-btn" }, "⟲");
    const counter = h("span", { class: "mono", style: "color:var(--text-dim)" });
    let i = 0, timer = null;
    function draw() { const S = getSteps(); S[i].f(); caption.innerHTML = (i + 1) + ". " + S[i].cap; counter.textContent = " step " + (i + 1) + " / " + S.length; prev.disabled = i === 0; next.disabled = i === S.length - 1; }
    function go(n) { const L = getSteps().length; i = Math.max(0, Math.min(L - 1, n)); draw(); if (i === L - 1) stop(); }
    function stop() { if (timer) { clearInterval(timer); timer = null; play.textContent = "▶ Play"; } }
    prev.addEventListener("click", () => { stop(); go(i - 1); });
    next.addEventListener("click", () => { stop(); go(i + 1); });
    reset.addEventListener("click", () => { stop(); go(0); });
    play.addEventListener("click", () => { if (timer) { stop(); return; } if (i === getSteps().length - 1) i = 0; play.textContent = "⏸ Pause"; draw(); timer = setInterval(() => { if (i >= getSteps().length - 1) stop(); else go(i + 1); }, 1500); });
    const ctrls = h("div", { class: "w-row", style: "justify-content:center;margin-top:10px" }, prev, play, next, reset, counter);
    const restart = () => { stop(); go(0); };
    const toggleRow = buildToggles ? buildToggles(restart) : null;
    requestAnimationFrame(draw);
    const parts = [];
    if (toggleRow) parts.push(toggleRow);
    parts.push(h("div", { class: "fa-wrap" }, stage), caption, ctrls);
    return widgetShell(title, h("div", null, ...parts));
  }

  /* ---- funcNested: outer() calls inner(); colour = which function owns the box ---- */
  App.widgets.funcNested = function () {
    const stage = h("div", { class: "fa-stage", style: "height:400px" });
    const G = CLR.green, B = CLR.blue;
    const boxR = mkBox(30, 14, 84, 38, "caller: r");
    const expr = h("div", { class: "fa-expr", style: "left:130px;top:22px" }, "r = outer(3, 4)");
    const outM = h("div", { class: "fa-machine", style: "left:120px;top:56px;width:210px" },
      h("div", { class: "fa-head", style: "background:" + G }, "outer(a, b)"),
      h("div", { class: "fa-body small" }, "z = inner(a, b)"), h("div", { class: "fa-body small", style: "padding-top:0" }, "return z * 2"));
    const oa = mkBox(150, 150, 60, 38, "a", G), ob = mkBox(235, 150, 60, 38, "b", G);
    const oz = mkBox(360, 92, 74, 38, "z", G), oret = mkBox(450, 150, 95, 38, "returns", G);
    const inM = h("div", { class: "fa-machine", style: "left:120px;top:236px;width:210px;border-color:" + B },
      h("div", { class: "fa-head", style: "background:" + B }, "inner(a, b)"),
      h("div", { class: "fa-body small" }, "return a + b"));
    const ia = mkBox(150, 312, 60, 38, "a", B), ib = mkBox(235, 312, 60, 38, "b", B);
    const iret = mkBox(360, 268, 90, 38, "return", B);
    const o3 = mkBall(3, G), o4 = mkBall(4, G), i3 = mkBall(3, B), i4 = mkBall(4, B), r7 = mkBall(7, B), r14 = mkBall(14, G);
    stage.append(boxR, expr, outM, oa, ob, oz, oret, inM, ia, ib, iret, o3, o4, i3, i4, r7, r14);
    const CALL = [[210, 46], [255, 46]];
    function base() { [i3, i4, r7, r14].forEach((b) => b.__hide()); [oa, ob, oz, oret, ia, ib, iret, boxR].forEach((b) => { b.__fill(false); b.__hl(false); }); inM.classList.remove("hl"); }
    const steps = [
      { cap: "Call <b>outer(3, 4)</b>. The two values wait at the call site.", f() { base(); o3.__put(...CALL[0]); o4.__put(...CALL[1]); } },
      { cap: "3 and 4 fill <b>outer</b>'s slots <code>a</code>, <code>b</code> (green).", f() { base(); o3.__put(...oa.__c); o4.__put(...ob.__c); oa.__fill(true); ob.__fill(true); } },
      { cap: "outer calls <b>inner(a, b)</b>. inner gets its <b>own</b> a, b (blue) - <b>same names, different boxes</b>.", f() { o3.__put(...oa.__c); o4.__put(...ob.__c); oa.__fill(true); ob.__fill(true); i3.__put(...ia.__c); i4.__put(...ib.__c); ia.__fill(true); ib.__fill(true); inM.classList.add("hl"); } },
      { cap: "inner computes <code>3 + 4 = 7</code> and returns it.", f() { o3.__put(...oa.__c); o4.__put(...ob.__c); oa.__fill(true); ob.__fill(true); ia.__fill(true); ib.__fill(true); r7.__put(...iret.__c); iret.__fill(true); iret.__hl(true); } },
      { cap: "7 flies back into <b>outer</b>'s <code>z</code> (green scope).", f() { oa.__fill(true); ob.__fill(true); r7.__put(...oz.__c); oz.__fill(true); oz.__hl(true); } },
      { cap: "outer computes <code>z * 2 = 14</code> and returns it.", f() { oa.__fill(true); ob.__fill(true); oz.__fill(true); r14.__put(...oret.__c); oret.__fill(true); oret.__hl(true); } },
      { cap: "The caller catches it: <code>r = 14</code>.", f() { r14.__put(...boxR.__c); boxR.__fill(true); boxR.__hl(true); } },
    ];
    return faScene("A function calling a function - colour shows the owner", stage, () => steps);
  };

  /* ---- funcArgs: positional / keyword / default ---- */
  App.widgets.funcArgs = function () {
    let mode = "pos";
    const B = CLR.blue;
    const stage = h("div", { class: "fa-stage", style: "height:240px" });
    const expr = h("div", { class: "fa-expr", style: "left:150px;top:14px" }, "");
    const body = h("div", { class: "fa-body small" }, "");
    const mach = h("div", { class: "fa-machine", style: "left:150px;top:44px;width:240px;border-color:" + B },
      h("div", { class: "fa-head", style: "background:" + B }, "describe(pet, kind)"), body);
    const sPet = mkBox(165, 150, 100, 40, "pet", B), sKind = mkBox(295, 150, 100, 40, "kind", B);
    const bPet = mkBall("Rex", B, true), bKind = mkBall("cat", B, true), bDef = mkBall("dog", "#888", true);
    bDef.classList.add("ghost");
    stage.append(expr, mach, sPet, sKind, bPet, bKind, bDef);
    function base() { [sPet, sKind].forEach((b) => { b.__fill(false); b.__hl(false); }); [bPet, bKind, bDef].forEach((b) => b.__hide()); body.textContent = ""; }
    function getSteps() {
      if (mode === "pos") return [
        { cap: "Call <code>describe(\"Rex\", \"cat\")</code>. Two values wait, in order.", f() { base(); bPet.__set("Rex"); bKind.__set("cat"); bPet.__put(210, 34); bKind.__put(320, 34); } },
        { cap: "<b>By position:</b> the 1st value → <code>pet</code>, the 2nd → <code>kind</code>.", f() { base(); bPet.__set("Rex"); bKind.__set("cat"); bPet.__put(...sPet.__c); bKind.__put(...sKind.__c); sPet.__fill(true); sKind.__fill(true); body.textContent = 'pet="Rex", kind="cat"'; } },
      ];
      if (mode === "kw") return [
        { cap: "Call <code>describe(kind=\"cat\", pet=\"Rex\")</code> - order is swapped, but each is <b>named</b>.", f() { base(); bKind.__set("kind=cat"); bPet.__set("pet=Rex"); bKind.__put(210, 34); bPet.__put(330, 34); } },
        { cap: "<b>By name:</b> each value goes to <b>its own</b> slot - <code>kind=\"cat\"</code>→kind, <code>pet=\"Rex\"</code>→pet, crossing over.", f() { base(); bKind.__set("cat"); bPet.__set("Rex"); bPet.__put(...sPet.__c); bKind.__put(...sKind.__c); sPet.__fill(true); sKind.__fill(true); body.textContent = 'pet="Rex", kind="cat"'; } },
      ];
      return [ // default
        { cap: "<code>def describe(pet, kind=\"dog\")</code>. The <code>kind</code> slot has a <b>default</b> ball preloaded (faint).", f() { base(); bDef.__set("dog"); bDef.__put(...sKind.__c); } },
        { cap: "Call <code>describe(\"Rex\")</code> - only <code>pet</code> is supplied.", f() { bDef.__set("dog"); bDef.__put(...sKind.__c); bPet.__set("Rex"); bPet.__put(210, 34); } },
        { cap: "\"Rex\" → <code>pet</code>. Nothing given for <code>kind</code>, so the <b>default \"dog\" stays</b>.", f() { bDef.__set("dog"); bDef.__put(...sKind.__c); sKind.__fill(true); bPet.__set("Rex"); bPet.__put(...sPet.__c); sPet.__fill(true); body.textContent = 'pet="Rex", kind="dog"'; } },
      ];
    }
    function buildToggles(restart) {
      function b(m, label) { const btn = h("button", { class: "w-btn" + (mode === m ? " on" : "") }, label); btn.addEventListener("click", () => { mode = m; row.querySelectorAll(".w-btn").forEach((x) => x.classList.remove("on")); btn.classList.add("on"); restart(); }); return btn; }
      const row = h("div", { class: "w-row", style: "justify-content:center;margin-bottom:8px" }, h("span", { style: "color:var(--text-dim);font-size:12px" }, "Style:"), b("pos", "Positional"), b("kw", "Keyword"), b("def", "Default"));
      return row;
    }
    return faScene("How arguments reach the slots", stage, getSteps, buildToggles);
  };

  /* ---- funcScope: local vs global ---- */
  App.widgets.funcScope = function () {
    let mode = "local";
    const G = CLR.amber, L = CLR.blue;
    const stage = h("div", { class: "fa-stage", style: "height:260px" });
    const gx = mkBox(390, 24, 130, 44, "global  x", G);
    const gxBall = mkBall(10, G); gxBall.__put(...gx.__c);
    const out = h("div", { class: "fa-tag", style: "left:390px;top:110px;color:var(--accent-2)" }, "");
    const body = h("div", { class: "fa-body small" }, "");
    const mach = h("div", { class: "fa-machine", style: "left:40px;top:40px;width:210px;border-color:" + L },
      h("div", { class: "fa-head", style: "background:" + L }, "f()"), body);
    const lx = mkBox(90, 150, 110, 44, "local  x", L);
    const lxBall = mkBall(5, L);
    stage.append(gx, gxBall, mach, lx, lxBall, out);
    function getSteps() {
      if (mode === "local") return [
        { cap: "A <b>global</b> <code>x = 10</code> lives in the amber box.", f() { gxBall.__set(10); gxBall.__put(...gx.__c); gx.__fill(true); gx.__hl(false); lx.__show(false); lxBall.__hide(); out.textContent = ""; body.innerHTML = "x = 5<br>print(x)"; } },
        { cap: "Call <code>f()</code>. A new <b>local</b> frame gets its <b>own</b> <code>x</code> (blue) - same name, different box.", f() { gx.__fill(true); lx.__show(true); lx.__fill(true); lx.__hl(true); lxBall.__set(5); lxBall.__put(...lx.__c); } },
        { cap: "Inside f, <code>print(x)</code> reads the <b>local</b> x = 5 (blue).", f() { gx.__fill(true); lx.__show(true); lx.__fill(true); lx.__hl(true); lxBall.__put(...lx.__c); out.textContent = "output: 5"; } },
        { cap: "<code>f()</code> returns - the local frame is <b>destroyed</b>.", f() { gx.__fill(true); lx.__hl(false); lx.__show(false); lxBall.__hide(); out.textContent = ""; } },
        { cap: "Outside, <code>print(x)</code> reads the <b>global</b> x = 10 (amber) - untouched.", f() { gx.__fill(true); gx.__hl(true); out.style.color = CLR.amber; out.textContent = "output: 10"; } },
      ];
      return [ // global keyword
        { cap: "Global <code>x = 10</code>. This time f() declares <code>global x</code>.", f() { gxBall.__set(10); gxBall.__put(...gx.__c); gx.__fill(true); gx.__hl(false); lx.__show(false); lxBall.__hide(); out.textContent = ""; body.innerHTML = "global x<br>x = 5"; } },
        { cap: "Call <code>f()</code>. <code>global x</code> means <b>no new box</b> - it targets the amber global.", f() { gx.__fill(true); gx.__hl(true); lx.__show(false); } },
        { cap: "<code>x = 5</code> writes into the <b>global</b> box: 10 → 5.", f() { gx.__fill(true); gx.__hl(true); gxBall.__set(5); gxBall.__put(...gx.__c); } },
        { cap: "Outside, <code>print(x)</code> is now <b>5</b> - the global was changed. Use <code>global</code> sparingly!", f() { gx.__fill(true); gx.__hl(true); out.style.color = CLR.amber; out.textContent = "output: 5"; } },
      ];
    }
    function buildToggles(restart) {
      function b(m, label) { const btn = h("button", { class: "w-btn" + (mode === m ? " on" : "") }, label); btn.addEventListener("click", () => { mode = m; row.querySelectorAll(".w-btn").forEach((x) => x.classList.remove("on")); btn.classList.add("on"); restart(); }); return btn; }
      const row = h("div", { class: "w-row", style: "justify-content:center;margin-bottom:8px" }, h("span", { style: "color:var(--text-dim);font-size:12px" }, "Inside f:"), b("local", "local x = 5"), b("global", "global x; x = 5"));
      return row;
    }
    return faScene("Local vs global - colour shows the scope", stage, getSteps, buildToggles);
  };
})();

/* ============================================================
   stringIndex - show a string with positive & negative indices,
   highlight s[i] as you change i. (interactive process demo)
   config: { text }
   ============================================================ */
App.widgets.stringIndex = function (cfg) {
  let text = (cfg && cfg.text) || "Python";
  let i = 0;
  const charsEl = h("div", { class: "sgrid" });
  const out = h("div", { class: "step-log" });
  const textIn = h("input", { class: "w-input mono", value: text, style: "width:160px" });
  const idxIn = h("input", { class: "w-input mono", type: "number", value: "0", style: "width:80px" });

  function norm(idx) { return idx < 0 ? idx + text.length : idx; }
  function render() {
    charsEl.innerHTML = "";
    const sel = norm(i);
    [...text].forEach((ch, p) => {
      const cell = h("div", { class: "scell" + (p === sel ? " sel" : "") },
        h("small", { class: "pi" }, String(p)),
        h("span", { class: "sch" }, ch === " " ? "␣" : ch),
        h("small", { class: "ni" }, String(p - text.length)));
      cell.addEventListener("click", () => { i = p; idxIn.value = p; render(); });
      charsEl.appendChild(cell);
    });
    if (sel >= 0 && sel < text.length)
      out.innerHTML = "<b>text[" + i + "]</b> &rarr; <b>'" + (text[sel] === " " ? "␣" : text[sel]) + "'</b>" +
        (i < 0 ? "  (negative index counts from the right)" : "");
    else out.innerHTML = "<span style='color:var(--danger)'>text[" + i + "] &rarr; IndexError: index out of range</span>";
  }
  textIn.addEventListener("input", () => { text = textIn.value || " "; render(); });
  idxIn.addEventListener("input", () => { i = parseInt(idxIn.value, 10) || 0; render(); });
  render();
  return widgetShell("String indexing: text[i]. Top number: index. Bottom number: negative index.",
    h("div", null,
      h("div", { class: "w-row" }, h("span", { class: "mono" }, "text ="), textIn, h("span", { class: "mono" }, "index"), idxIn),
      h("div", { style: "margin:14px 0" }, charsEl), out));
};

/* ============================================================
   stringSlice - interactive start:end:step, highlights selection
   config: { text }
   ============================================================ */
App.widgets.stringSlice = function (cfg) {
  let text = (cfg && cfg.text) || "Programming";
  const charsEl = h("div", { class: "sgrid" });
  const out = h("div", { class: "step-log" });
  const pre = (v) => (v == null ? "" : String(v));
  const sIn = h("input", { class: "w-input mono", value: pre(cfg && cfg.start), placeholder: "start", style: "width:74px" });
  const eIn = h("input", { class: "w-input mono", value: pre(cfg && cfg.end), placeholder: "end", style: "width:74px" });
  const stIn = h("input", { class: "w-input mono", value: pre(cfg && cfg.step), placeholder: "step", style: "width:74px" });
  const textIn = h("input", { class: "w-input mono", value: text, style: "width:160px" });

  function pyslice() {
    const n = text.length;
    let step = stIn.value === "" ? 1 : parseInt(stIn.value, 10);
    if (!step) step = 1;
    let start = sIn.value === "" ? (step > 0 ? 0 : n - 1) : parseInt(sIn.value, 10);
    let end = eIn.value === "" ? (step > 0 ? n : -n - 1) : parseInt(eIn.value, 10);
    if (start < 0) start += n; if (end < 0 && eIn.value !== "") end += n;
    const picked = []; const res = [];
    if (step > 0) { for (let k = Math.max(0, start); k < Math.min(n, end); k += step) { picked.push(k); res.push(text[k]); } }
    else { let from = Math.min(n - 1, start); let to = eIn.value === "" ? -1 : end; for (let k = from; k > to; k += step) { if (k >= 0 && k < n) { picked.push(k); res.push(text[k]); } } }
    return { picked, res: res.join("") };
  }
  function render() {
    const { picked, res } = pyslice();
    charsEl.innerHTML = "";
    [...text].forEach((ch, p) => {
      const order = picked.indexOf(p);
      charsEl.appendChild(h("div", { class: "scell" + (order >= 0 ? " sel" : "") },
        h("small", { class: "pi" }, String(p)),
        h("span", { class: "sch" }, ch === " " ? "␣" : ch),
        h("small", { class: "ni" }, order >= 0 ? "#" + (order + 1) : "")));
    });
    const a = sIn.value === "" ? "" : sIn.value, b = eIn.value === "" ? "" : eIn.value, c = stIn.value === "" ? "" : ":" + stIn.value;
    out.innerHTML = "<b>text[" + a + ":" + b + c + "]</b> &rarr; <b>'" + res + "'</b>";
  }
  [sIn, eIn, stIn].forEach((el) => el.addEventListener("input", render));
  textIn.addEventListener("input", () => { text = textIn.value || " "; render(); });
  render();
  return widgetShell("String slicing: text[start:end:step]. An empty box uses the default.",
    h("div", null,
      h("div", { class: "w-row" }, h("span", { class: "mono" }, "text ="), textIn),
      h("div", { class: "w-row", style: "margin-top:8px" }, h("span", { class: "mono" }, "text ["), sIn, h("span", { class: "mono" }, ":"), eIn, h("span", { class: "mono" }, ":"), stIn, h("span", { class: "mono" }, "]")),
      h("div", { style: "margin:14px 0" }, charsEl), out));
};

/* ============================================================
   stringShift - Caesar cipher: shift each letter by x, animated
   config: { text, shift }
   ============================================================ */
App.widgets.stringShift = function (cfg) {
  let text = (cfg && cfg.text) || "HELLO";
  let shift = (cfg && cfg.shift) || 3;
  const mapEl = h("div", { class: "sgrid" });
  const out = h("div", { class: "step-log" });
  const textIn = h("input", { class: "w-input mono", value: text, style: "width:160px" });
  const range = h("input", { type: "range", min: "0", max: "25", value: String(shift), style: "flex:1;min-width:140px" });
  const lbl = h("span", { class: "mono" }, "shift = " + shift);

  function shiftChar(ch, k) {
    const c = ch.charCodeAt(0);
    if (c >= 65 && c <= 90) return String.fromCharCode(((c - 65 + k) % 26) + 65);
    if (c >= 97 && c <= 122) return String.fromCharCode(((c - 97 + k) % 26) + 97);
    return ch;
  }
  function render() {
    mapEl.innerHTML = "";
    let result = "";
    [...text].forEach((ch) => {
      const to = shiftChar(ch, shift);
      result += to;
      const isLetter = /[a-z]/i.test(ch);
      mapEl.appendChild(h("div", { class: "scell shiftcell" + (isLetter && to !== ch ? " sel" : "") },
        h("span", { class: "sch" }, ch === " " ? "␣" : ch),
        h("small", { class: "arrowdown" }, isLetter ? "↓+" + shift : ""),
        h("span", { class: "sch to" }, to === " " ? "␣" : to)));
    });
    out.innerHTML = "<b>'" + text + "'</b> shifted by <b>" + shift + "</b> &rarr; <b>'" + result + "'</b>" +
      "<br><span style='color:var(--text-dim)'>Letters past 'Z' wrap around to 'A' (modulo 26). This is the Caesar cipher.</span>";
  }
  range.addEventListener("input", () => { shift = parseInt(range.value, 10); lbl.textContent = "shift = " + shift; render(); });
  textIn.addEventListener("input", () => { text = textIn.value || " "; render(); });
  render();
  return widgetShell("String shift - each letter moves forward x places in the alphabet",
    h("div", null,
      h("div", { class: "w-row" }, h("span", { class: "mono" }, "text ="), textIn),
      h("div", { class: "w-row", style: "margin-top:8px" }, range, lbl),
      h("div", { style: "margin:14px 0" }, mapEl), out));
};

/* ============================================================
   flowExec - animate execution flowing through a flowchart
   config: { nodes, edges (as flowchart), trace:[{node, vars, note}] }
   ============================================================ */
App.widgets.flowExec = function (cfg) {
  const W = cfg.width || 320, Hh = cfg.height || 420;
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 " + W + " " + Hh);
  svg.innerHTML = '<defs><marker id="arrow2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="currentColor"/></marker></defs>';
  const nodeById = {}; cfg.nodes.forEach((n) => (nodeById[n.id] = n));
  (cfg.edges || []).forEach((e) => {
    const a = nodeById[e.from], b = nodeById[e.to]; if (!a || !b) return;
    const x1 = a.x + a.w / 2, x2 = b.x + b.w / 2, y2 = b.y;
    const path = document.createElementNS(svgNS, "path");
    let d;
    if (e.side === "right") d = `M${a.x + a.w},${a.y + a.h / 2} H${x2 + 40} V${y2} H${x2}`;
    else if (e.side === "left") d = `M${a.x},${a.y + a.h / 2} H${b.x - 40} V${y2} H${x2}`;
    else d = `M${x1},${a.y + a.h} V${y2}`;
    path.setAttribute("d", d); path.setAttribute("class", "fline"); path.style.markerEnd = "url(#arrow2)";
    svg.appendChild(path);
    if (e.label) { const t = document.createElementNS(svgNS, "text"); t.setAttribute("x", (e.side === "right" ? a.x + a.w + 4 : e.side === "left" ? a.x - 36 : x1 + 6)); t.setAttribute("y", a.y + a.h + 12); t.setAttribute("class", "flbl"); t.textContent = e.label; svg.appendChild(t); }
  });
  const nodeEls = {};
  cfg.nodes.forEach((n) => {
    const g = document.createElementNS(svgNS, "g"); g.setAttribute("class", "fnode");
    let shape;
    if (n.type === "decision") { shape = document.createElementNS(svgNS, "polygon"); const cx = n.x + n.w / 2, cy = n.y + n.h / 2; shape.setAttribute("points", `${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}`); }
    else if (n.type === "io") { shape = document.createElementNS(svgNS, "polygon"); const sk = 14; shape.setAttribute("points", `${n.x + sk},${n.y} ${n.x + n.w},${n.y} ${n.x + n.w - sk},${n.y + n.h} ${n.x},${n.y + n.h}`); }
    else { shape = document.createElementNS(svgNS, "rect"); shape.setAttribute("x", n.x); shape.setAttribute("y", n.y); shape.setAttribute("width", n.w); shape.setAttribute("height", n.h); shape.setAttribute("rx", n.type === "terminator" ? n.h / 2 : 4); }
    shape.setAttribute("class", "fbox"); g.appendChild(shape);
    const t = document.createElementNS(svgNS, "text"); t.setAttribute("x", n.x + n.w / 2); t.setAttribute("y", n.y + n.h / 2 + 4); t.setAttribute("text-anchor", "middle"); t.textContent = n.text; g.appendChild(t);
    svg.appendChild(g); nodeEls[n.id] = g;
  });

  const stepper = App.widgets.stepper({
    title: null,
    steps: cfg.trace,
    render: (s) => {
      Object.keys(nodeEls).forEach((k) => nodeEls[k].classList.toggle("hl", k === s.node));
      const box = h("div");
      if (s.vars) box.appendChild(App.widgets.varChips(s.vars));
      box.appendChild(h("div", { class: "step-log" }, s.note || ""));
      return box;
    },
  });
  const grid = h("div", { class: "flow-wrap" }, h("div", { class: "flow" }, svg), h("div", null, stepper));
  return widgetShell(cfg.title || "Run the flowchart step by step", grid);
};

/* ============================================================
   tryFlow - animate try / except / finally control flow.
   Pick an input; step through and watch control jump to the
   matching except, then always land in finally.
   config: {
     title,
     blocks:   [{ id, label, code }],   // stacked boxes, top to bottom
     scenarios:[{ label, steps:[{ active, note, out, badge, badgeOn, raised }] }]
   }
   ============================================================ */
App.widgets.tryFlow = function (cfg) {
  let sc = 0, i = 0;
  const boxes = {};
  const boxWrap = h("div", { class: "tryflow" });
  cfg.blocks.forEach((b) => {
    const badge = h("span", { class: "tf-badge" });
    const box = h("div", { class: "tf-box tf-" + b.id.split(":")[0] },
      h("div", { class: "tf-head" }, h("span", null, b.label), badge),
      h("pre", { class: "tf-code", html: App.highlight(b.code) }));
    boxes[b.id] = { box, badge };
    boxWrap.appendChild(box);
  });

  const note = h("div", { class: "tf-note" });
  const out = h("div", { class: "step-out" });
  const counter = h("span", { class: "mono", style: "color:var(--text-dim)" });
  const prev = h("button", { class: "w-btn" }, "‹ Prev");
  const next = h("button", { class: "w-btn on" }, "Next ›");
  const reset = h("button", { class: "w-btn" }, "⟲");

  const scRow = h("div", { class: "w-row", style: "margin-bottom:12px" });
  cfg.scenarios.forEach((s, idx) => {
    const btn = h("button", { class: "w-btn" + (idx === 0 ? " on" : "") }, s.label);
    btn.addEventListener("click", () => {
      sc = idx; i = 0;
      scRow.querySelectorAll(".w-btn").forEach((x) => x.classList.remove("on"));
      btn.classList.add("on"); draw();
    });
    scRow.appendChild(btn);
  });

  function draw() {
    const steps = cfg.scenarios[sc].steps, st = steps[i];
    Object.values(boxes).forEach((o) => { o.box.classList.remove("on", "raised"); o.badge.textContent = ""; o.badge.className = "tf-badge"; });
    // Re-apply badges from every step up to now, so an error mark stays visible.
    for (let k = 0; k <= i; k++) {
      const s = steps[k];
      if (!s.badge) continue;
      const o = boxes[s.badgeOn || s.active]; if (!o) continue;
      o.badge.textContent = s.badge; o.badge.classList.add("show");
      if (s.raised) o.box.classList.add("raised");
    }
    const cur = boxes[st.active]; if (cur) cur.box.classList.add("on");
    note.innerHTML = st.note || "";
    out.textContent = st.out != null ? st.out : "";
    counter.textContent = " step " + (i + 1) + " / " + steps.length;
    prev.disabled = i === 0; next.disabled = i === steps.length - 1;
  }
  prev.addEventListener("click", () => { if (i > 0) { i--; draw(); } });
  next.addEventListener("click", () => { if (i < cfg.scenarios[sc].steps.length - 1) { i++; draw(); } });
  reset.addEventListener("click", () => { i = 0; draw(); });
  draw();

  return widgetShell(cfg.title || "try / except / finally flow",
    h("div", null, scRow, boxWrap, note,
      h("div", { class: "widget-title", style: "margin-top:10px" }, "Output"), out,
      h("div", { class: "w-row", style: "margin-top:12px" }, prev, next, reset, counter)));
};

/* ============================================================
   fileFlow - animate a file's life: open, write/read, close.
   config: {
     title, filename, code:[lines],
     steps:[{ line, mode, status:'open'|'closed', content:[lines],
              flow:'write'|'read', exists, note, out }]
   }
   ============================================================ */
App.widgets.fileFlow = function (cfg) {
  const code = cfg.code || [];
  return App.widgets.stepper({
    title: cfg.title || "Watch a file open, fill, and close",
    steps: cfg.steps,
    render: (s) => {
      const codeBox = h("div", { class: "step-code" });
      code.forEach((ln, idx) => {
        const hl = idx === s.line;
        codeBox.appendChild(h("span", { class: "ln" + (hl ? " hl" : "") },
          h("span", { class: "marker" }, hl ? "▸ " : "  "),
          h("span", { html: App.highlight(ln) || "&nbsp;" })));
      });
      const dotCls = s.status === "open" ? "open" : s.status === "closed" ? "closed" : "";
      const body = (s.content && s.content.length)
        ? h("div", null, ...s.content.map((l) => h("div", { class: "ff-line" }, l)))
        : h("div", { class: "ff-empty" }, s.exists === false ? "(no file yet)" : "(empty)");
      const fhead = h("div", { class: "ff-fhead" },
        h("span", { class: "ff-dot " + dotCls }),
        h("span", { class: "mono" }, cfg.filename || "file.txt"),
        s.mode ? h("span", { class: "ff-mode" }, "'" + s.mode + "'") : null,
        h("span", { class: "ff-status" }, s.status || ""));
      const fileBox = h("div", { class: "ff-file" + (s.flow ? " flow-" + s.flow : "") }, fhead, h("div", { class: "ff-body" }, body));
      const arrow = h("div", { class: "ff-arrow" }, s.flow === "write" ? "write →" : s.flow === "read" ? "← read" : "·");
      const cols = h("div", { class: "ff-cols" },
        h("div", { class: "ff-prog" }, h("div", { class: "widget-title" }, "Program"), codeBox),
        arrow, fileBox);
      const wrap = h("div", { class: "fileflow" }, cols, h("div", { class: "tf-note", html: s.note || "" }));
      if (s.out != null) {
        wrap.appendChild(h("div", { class: "widget-title", style: "margin-top:10px" }, "Output"));
        wrap.appendChild(h("div", { class: "step-out" }, s.out));
      }
      return wrap;
    },
  });
};

/* ============================================================
   arrayOp - animate a NumPy element-wise op (and broadcasting).
   config: { title, a:[nums], b:[nums]|number, op:'+'|'-'|'*'|'/' }
   ============================================================ */
App.widgets.arrayOp = function (cfg) {
  const a = cfg.a, opSym = cfg.op || "+", n = a.length;
  const scalar = typeof cfg.b === "number";
  const b = scalar ? a.map(() => cfg.b) : cfg.b;
  const f = (x, y) => (opSym === "-" ? x - y : opSym === "*" ? x * y : opSym === "/" ? x / y : x + y);
  const result = a.map((x, i) => f(x, b[i]));
  const steps = []; for (let k = 0; k <= n; k++) steps.push({ k });
  const row = (label, vals, k, faded) => {
    const r = h("div", { class: "ao-row" }, h("span", { class: "ao-label" }, label));
    vals.forEach((v, i) => r.appendChild(h("div", {
      class: "ao-cell" + (i < k ? " done" : "") + (i === k ? " cur" : "") + (faded ? " faded" : "")
    }, String(v))));
    return r;
  };
  return App.widgets.stepper({
    title: cfg.title || "Element-wise on the whole array at once",
    steps,
    render: (s) => {
      const k = s.k;
      const box = h("div", { class: "arrayop" },
        row("a", a, k),
        h("div", { class: "ao-op" }, opSym + (scalar ? "   " + cfg.b + "  (broadcast to every element)" : "")),
        row(scalar ? String(cfg.b) : "b", b, k, scalar),
        h("div", { class: "ao-eq" }, "="),
        row("", a.map((_, i) => (i < k ? result[i] : "·")), k));
      const note = k < n
        ? ("Position " + k + ":  " + a[k] + " " + opSym + " " + b[k] + " = " + result[k])
        : "Done. One line of code, every element computed together, no loop.";
      box.appendChild(h("div", { class: "tf-note" }, note));
      return box;
    },
  });
};

/* ============================================================
   dfFilter - animate a pandas DataFrame filter / sort.
   config: {
     title, columns:[names], rows:[[...]],
     scenarios:[{ label, filter:{col,op,value} } | { label, sort:{col,dir} }]
   }
   ============================================================ */
App.widgets.dfFilter = function (cfg) {
  const cols = cfg.columns, rows = cfg.rows;
  const ci = (name) => cols.indexOf(name);
  const cmp = (v, op, val) => op === ">" ? v > val : op === ">=" ? v >= val : op === "<" ? v < val : op === "<=" ? v <= val : op === "==" ? v == val : false;
  const idAll = rows.map((_, idx) => idx);

  function buildSteps(s) {
    if (s.filter) {
      const c = ci(s.filter.col), steps = [];
      for (let k = 0; k <= rows.length; k++) {
        const marks = rows.map((r, idx) => idx < k ? (cmp(r[c], s.filter.op, s.filter.value) ? "keep" : "drop") : (idx === k ? "test" : ""));
        const testing = k < rows.length;
        const note = testing
          ? (s.filter.col + " = " + rows[k][c] + ".  Is " + rows[k][c] + " " + s.filter.op + " " + s.filter.value + " ? " + (cmp(rows[k][c], s.filter.op, s.filter.value) ? "keep" : "drop"))
          : "Kept only the rows where " + s.filter.col + " " + s.filter.op + " " + s.filter.value + ".";
        steps.push({ order: idAll, marks, finalKeepOnly: !testing, note });
      }
      return steps;
    }
    if (s.sort) {
      const c = ci(s.sort.col), dir = s.sort.dir === "desc" ? -1 : 1;
      const order = idAll.slice().sort((x, y) => (rows[x][c] > rows[y][c] ? 1 : rows[x][c] < rows[y][c] ? -1 : 0) * dir);
      return [
        { order: idAll, marks: rows.map(() => ""), note: "Before: original row order.", sortedCol: c },
        { order, marks: rows.map(() => ""), note: "After: sorted by " + s.sort.col + " (" + (s.sort.dir || "asc") + ").", sortedCol: c },
      ];
    }
    return [{ order: idAll, marks: rows.map(() => ""), note: "" }];
  }

  let sc = 0, i = 0, steps = buildSteps(cfg.scenarios[0]);
  const table = h("table", { class: "dftbl" });
  const note = h("div", { class: "tf-note" });
  const counter = h("span", { class: "mono", style: "color:var(--text-dim)" });
  const prev = h("button", { class: "w-btn" }, "‹ Prev");
  const next = h("button", { class: "w-btn on" }, "Next ›");
  const reset = h("button", { class: "w-btn" }, "⟲");

  const scRow = h("div", { class: "w-row", style: "margin-bottom:12px" });
  cfg.scenarios.forEach((s, idx) => {
    const btn = h("button", { class: "w-btn" + (idx === 0 ? " on" : "") }, s.label);
    btn.addEventListener("click", () => { sc = idx; i = 0; steps = buildSteps(s); scRow.querySelectorAll(".w-btn").forEach((x) => x.classList.remove("on")); btn.classList.add("on"); draw(); });
    scRow.appendChild(btn);
  });

  function draw() {
    const st = steps[i];
    table.innerHTML = "";
    table.appendChild(h("tr", null, h("th", null, ""), ...cols.map((c, idx) => h("th", { class: st.sortedCol === idx ? "sortcol" : "" }, c))));
    st.order.forEach((ri) => {
      const mark = st.marks[ri];
      if (st.finalKeepOnly && mark !== "keep") return;
      const tr = h("tr", { class: "df-" + (mark || "none") },
        h("td", { class: "df-mark" }, mark === "keep" ? "✓" : mark === "drop" ? "✗" : mark === "test" ? "→" : ""));
      cols.forEach((c, k) => tr.appendChild(h("td", { class: st.sortedCol === k ? "sortcol" : "" }, String(rows[ri][k]))));
      table.appendChild(tr);
    });
    note.textContent = st.note || "";
    counter.textContent = " step " + (i + 1) + " / " + steps.length;
    prev.disabled = i === 0; next.disabled = i === steps.length - 1;
  }
  prev.addEventListener("click", () => { if (i > 0) { i--; draw(); } });
  next.addEventListener("click", () => { if (i < steps.length - 1) { i++; draw(); } });
  reset.addEventListener("click", () => { i = 0; draw(); });
  draw();
  return widgetShell(cfg.title || "Filter and sort a DataFrame",
    h("div", null, scRow, table, note, h("div", { class: "w-row", style: "margin-top:12px" }, prev, next, reset, counter)));
};

/* ============================================================
   csvFlow - animate CSV round-trip: a table becomes comma-
   separated text (write), then text is split back into rows (read).
   config: { title, columns:[names], rows:[[...]] }
   ============================================================ */
App.widgets.csvFlow = function (cfg) {
  const columns = cfg.columns, rows = cfg.rows;
  const header = columns.join(",");
  const dataLines = rows.map((r) => r.join(","));
  const allLines = [header].concat(dataLines);
  const steps = [];
  steps.push({ phase: "write", tableActive: "header", textLines: [header], textActive: 0, arrow: "write", note: "writerow(header): the column names become one comma-separated line." });
  rows.forEach((r, i) => steps.push({ phase: "write", tableActive: i, textLines: [header].concat(dataLines.slice(0, i + 1)), textActive: i + 1, arrow: "write", note: "writerow(row " + i + "): its values join with commas." }));
  allLines.forEach((ln, j) => steps.push({ phase: "read", textLines: allLines, textActive: j, arrow: "read", readRows: j, tableActive: j === 0 ? "header" : j - 1, note: j === 0 ? "reader reads the header line, split on commas." : "reader splits line " + j + " back into a list of values." }));

  return App.widgets.stepper({
    title: cfg.title || "CSV: a table becomes text, and back",
    steps,
    render: (s) => {
      const tbl = h("table", { class: "dftbl" });
      tbl.appendChild(h("tr", null, ...columns.map((c) => h("th", { class: s.tableActive === "header" ? "df-test" : "" }, c))));
      const nRows = s.phase === "read" ? s.readRows : rows.length;
      for (let i = 0; i < nRows; i++) {
        const tr = h("tr", { class: s.tableActive === i ? "df-test" : "" });
        columns.forEach((c, k) => tr.appendChild(h("td", null, String(rows[i][k]))));
        tbl.appendChild(tr);
      }
      const txt = h("div", { class: "ff-body csvtext" });
      s.textLines.forEach((ln, idx) => txt.appendChild(h("div", { class: "ff-line" + (idx === s.textActive ? " cur" : "") }, ln)));
      const fileBox = h("div", { class: "ff-file flow-" + s.arrow },
        h("div", { class: "ff-fhead" }, h("span", { class: "ff-dot open" }), h("span", { class: "mono" }, cfg.filename || "data.csv")), txt);
      const arrow = h("div", { class: "ff-arrow" }, s.arrow === "write" ? "write →" : "← read");
      const cols = h("div", { class: "ff-cols" },
        h("div", null, h("div", { class: "widget-title" }, s.phase === "write" ? "Table in memory" : "Table rebuilt from text"), tbl),
        arrow, fileBox);
      return h("div", { class: "fileflow" }, cols, h("div", { class: "tf-note", html: s.note || "" }));
    },
  });
};

/* ============================================================
   bigOViz - animate how each complexity class grows as n rises.
   config: { title, ns:[input sizes] }
   ============================================================ */
App.widgets.bigOViz = function (cfg) {
  const ns = cfg.ns || [1, 2, 4, 8, 16, 32, 64];
  const l2 = (n) => Math.max(1, Math.round(Math.log2(n)) || 0);
  const classes = [
    { key: "O(1)", f: () => 1, color: "var(--accent-2)" },
    { key: "O(log n)", f: (n) => l2(n), color: "var(--accent)" },
    { key: "O(n)", f: (n) => n, color: "#82aaff" },
    { key: "O(n log n)", f: (n) => Math.max(n, n * l2(n)), color: "var(--warn)" },
    { key: "O(n²)", f: (n) => n * n, color: "var(--danger)" },
  ];
  return App.widgets.stepper({
    title: cfg.title || "How work grows as the input grows",
    steps: ns.map((n) => ({ n })),
    render: (s) => {
      const n = s.n;
      const vals = classes.map((c) => ({ key: c.key, color: c.color, v: c.f(n) }));
      const max = Math.max.apply(null, vals.map((v) => v.v));
      const box = h("div", { class: "bigo" }, h("div", { class: "bigo-n" }, "n = " + n));
      vals.forEach((v) => {
        box.appendChild(h("div", { class: "bigo-row" },
          h("span", { class: "bigo-key" }, v.key),
          h("div", { class: "bigo-track" }, h("div", { class: "bigo-bar", style: "width:" + Math.max(2, v.v / max * 100) + "%;background:" + v.color })),
          h("span", { class: "bigo-val" }, v.v.toLocaleString())));
      });
      box.appendChild(h("div", { class: "tf-note" }, "At n = " + n + ": O(1) stays at 1 while O(n²) needs " + (n * n).toLocaleString() + " operations."));
      return box;
    },
  });
};

/* ============================================================
   ptrViz - animate a C pointer: p holds x's address (an arrow),
   and *p follows the arrow to read or write x.
   config: { title, code:[lines], target:{addr,name}, pointer:{addr,name},
             steps:[{ line, xval, pval, arrow, deref:'read'|'write', note }] }
   ============================================================ */
App.widgets.ptrViz = function (cfg) {
  const code = cfg.code || [], T = cfg.target, P = cfg.pointer;
  return App.widgets.stepper({
    title: cfg.title || "A pointer holds an address; * follows it",
    steps: cfg.steps,
    render: (s) => {
      const codeBox = h("div", { class: "step-code" });
      code.forEach((ln, idx) => codeBox.appendChild(h("span", { class: "ln" + (idx === s.line ? " hl" : "") },
        h("span", { class: "marker" }, idx === s.line ? "▸ " : "  "),
        h("span", { html: App.highlight(ln) || "&nbsp;" }))));
      const pcell = h("div", { class: "pv-cell pv-ptr" + (s.deref ? " deref" : "") },
        h("div", { class: "pv-name" }, P.name), h("div", { class: "pv-addr" }, P.addr),
        h("div", { class: "pv-val" }, s.pval != null ? s.pval : "?"));
      const xcell = h("div", { class: "pv-cell" + (s.deref ? " hit" : "") },
        h("div", { class: "pv-name" }, T.name), h("div", { class: "pv-addr" }, T.addr),
        h("div", { class: "pv-val" + (s.deref === "write" ? " flash" : "") }, String(s.xval)));
      const arrow = h("div", { class: "pv-arrow" + (s.arrow ? " on" : "") + (s.deref ? " deref" : "") }, s.arrow ? "─▶" : "");
      const diagram = h("div", { class: "pv-diagram" }, pcell, arrow, xcell);
      return h("div", { class: "fileflow" },
        h("div", { class: "steprun-grid" },
          h("div", null, h("div", { class: "widget-title" }, "Code"), codeBox),
          h("div", null, h("div", { class: "widget-title" }, "Memory"), diagram)),
        h("div", { class: "tf-note", html: s.note || "" }));
    },
  });
};

/* ============================================================
   heapViz - animate the stack vs heap: frames push/pop, malloc
   adds a heap block, free() releases it (dangling afterwards).
   config: { title, steps:[{ stack:[{name,val,active}],
             heap:[{addr,label,active,freed}], note }] }
   ============================================================ */
App.widgets.heapViz = function (cfg) {
  return App.widgets.stepper({
    title: cfg.title || "Stack frames and heap blocks over time",
    steps: cfg.steps,
    render: (s) => {
      const stackCol = h("div", { class: "hv-col" }, h("h5", null, "Stack (automatic)"));
      if (!s.stack || !s.stack.length) stackCol.appendChild(h("div", { class: "hv-empty" }, "(empty)"));
      (s.stack || []).forEach((fr) => stackCol.appendChild(h("div", { class: "hv-frame" + (fr.active ? " active" : "") },
        h("div", { class: "hv-name" }, fr.name), h("div", { class: "hv-val" }, fr.val || ""))));
      const heapCol = h("div", { class: "hv-col" }, h("h5", null, "Heap (manual)"));
      if (!s.heap || !s.heap.length) heapCol.appendChild(h("div", { class: "hv-empty" }, "(nothing allocated)"));
      (s.heap || []).forEach((bl) => heapCol.appendChild(h("div", { class: "hv-block" + (bl.active ? " active" : "") + (bl.freed ? " freed" : "") },
        bl.addr ? h("div", { class: "hv-addr" }, bl.addr) : null, h("div", { class: "hv-val" }, bl.label || ""))));
      return h("div", { class: "fileflow" },
        h("div", { class: "hv-cols" }, stackCol, heapCol),
        h("div", { class: "tf-note", html: s.note || "" }));
    },
  });
};

/* ============================================================
   arrViz - animate a contiguous array/string: each cell's address
   is base + i*size; step across it. NUL-terminator aware for strings.
   config: { title, base, elemSize, cells:[{val, nul}] }
   ============================================================ */
App.widgets.arrViz = function (cfg) {
  const base = cfg.base || 0, size = cfg.elemSize || 1, cells = cfg.cells;
  const hex = (n) => "0x" + n.toString(16).toUpperCase();
  return App.widgets.stepper({
    title: cfg.title || "Contiguous memory, addressed by index",
    steps: cells.map((c, i) => ({ i })),
    render: (s) => {
      const row = h("div", { class: "av-row" });
      cells.forEach((c, i) => row.appendChild(h("div", { class: "av-cell" + (i === s.i ? " cur" : "") + (c.nul ? " nul" : "") },
        h("div", { class: "av-val" }, c.val),
        h("div", { class: "av-ix" }, "[" + i + "]"),
        h("div", { class: "av-addr" }, hex(base + i * size)))));
      const i = s.i, c = cells[i];
      const note = c.nul
        ? "Index " + i + ": the hidden <code>'\\0'</code> NUL terminator marks the end of the string."
        : "Index " + i + ": address = base + " + i + "×" + size + " = " + hex(base + i * size) + ". One calculation, so <code>arr[" + i + "]</code> is O(1).";
      return h("div", { class: "arrviz" }, row, h("div", { class: "tf-note", html: note }));
    },
  });
};

/* ============================================================
   Shared "value-ball language": type -> color class + display label.
   int=blue, float=teal, str=amber, bool=purple, None=grey.
   Used by boxTrain (lists/arrays) and dictTrain (dicts).
   ============================================================ */
function btType(v) {
  if (typeof v === "boolean") return "bool";
  if (v === null || v === undefined) return "none";
  if (typeof v === "number") return Number.isInteger(v) ? "int" : "float";
  return "str";
}
function btLabel(v) {
  if (v === null || v === undefined) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "string") return "'" + v + "'";
  return String(v);
}

/* Shared: the whole program on the right, current line marked (so the
   reader sees the lines already run and the lines still to come). */
function btCodePanel(code, line) {
  const right = h("div", { class: "bt-code" });
  code.forEach((ln, idx) => right.appendChild(h("div", { class: "bt-codeline" + (idx === line ? " bt-cur" : "") },
    h("span", { class: "bt-marker" }, idx === line ? "▸" : " "),
    h("span", { html: App.highlight(ln) || "&nbsp;" }))));
  return right;
}
/* Wrap a step's visual (left) beside the whole-program panel (right). */
function btTwoCol(left, code, line) {
  const grid = h("div", { class: "bt-2col" });
  grid.appendChild(left);
  if (code && code.length) grid.appendChild(btCodePanel(code, line));
  return grid;
}

/* ============================================================
   boxTrain - a list as a train of coupled cars, each car holding a
   value ball (colored by type). Under each car an odometer shows the
   positive index (top) and negative index (bottom). Reused for arrays
   (addresses under each car) and later stack/queue.
   config: {
     title, mode:'list'|'array', base, elemSize,
     steps:[{
       items:[v,...],          // full state this step (numbers or strings)
       caption,                // html; describes the op (use <code>…</code>)
       enter:[i,...],          // cars that just arrived -> arrive bounce
       lift:[i,...],           // cars to lift+pulse -> "we read it"
       flash:[i,...],          // cars whose ball changed -> color flash
       leave:{value},          // a car rolling off the end (pop/remove) -> ghost
       returned                // value returned by the op, shown in a tray
     }]
   }
   ============================================================ */
App.widgets.boxTrain = function (cfg) {
  const mode = cfg.mode || "list";
  const code = cfg.code || [];
  return App.widgets.stepper({
    title: cfg.title || "List operations",
    steps: cfg.steps,
    render: (s, i) => {
      const grid = h("div", { class: "bt-2col" });

      /* LEFT: the boxes, the variables assigned so far, a short description */
      const left = h("div", { class: "bt-left" });
      if (cfg.name) left.appendChild(h("div", { class: "bt-listname" }, cfg.name));
      const track = h("div", { class: "bt-track bt-" + mode });
      const items = s.items || [], n = items.length;
      items.forEach((v, idx) => {
        const cls = ["bt-car"];
        if (s.enter && s.enter.includes(idx)) cls.push("bt-enter");
        if (s.lift && s.lift.includes(idx)) cls.push("bt-lift");
        if (s.flash && s.flash.includes(idx)) cls.push("bt-flash");
        const car = h("div", { class: cls.join(" ") },
          h("div", { class: "bt-ball bt-" + btType(v) }, btLabel(v)),
          h("div", { class: "bt-odo" },
            h("span", { class: "bt-ix" }, "[" + idx + "]"),
            h("span", { class: "bt-nix" }, "[" + (idx - n) + "]")));
        if (mode === "array" && cfg.base != null)
          car.appendChild(h("div", { class: "bt-addr" }, "0x" + (cfg.base + idx * (cfg.elemSize || 4)).toString(16).toUpperCase()));
        track.appendChild(car);
      });
      if (!n && !s.leave) track.appendChild(h("div", { class: "bt-empty" }, mode === "list" ? "[ ]" : "empty"));
      if (s.leave) {
        const v = s.leave.value;
        track.appendChild(h("div", { class: "bt-car bt-leave" },
          h("div", { class: "bt-ball bt-" + btType(v) }, btLabel(v)),
          h("div", { class: "bt-odo" }, h("span", { class: "bt-ix" }, "off"))));
      }
      left.appendChild(track);

      // variable boxes: values returned into names (a = nums[1], b = nums.pop()), persisting
      const assigns = {};
      for (let k = 0; k <= i; k++) { const a = cfg.steps[k].assign; if (a) assigns[a.name] = { value: a.value, set: k === i }; }
      const names = Object.keys(assigns);
      if (names.length) {
        const vars = h("div", { class: "bt-vars" });
        names.forEach((nm) => {
          const a = assigns[nm];
          vars.appendChild(h("div", { class: "bt-var" + (a.set ? " bt-var-set" : "") },
            h("div", { class: "bt-varname" }, nm),
            h("div", { class: "bt-ball bt-" + btType(a.value) }, btLabel(a.value))));
        });
        left.appendChild(vars);
      }
      if (s.caption) left.appendChild(h("div", { class: "bt-cap", html: s.caption }));

      /* RIGHT: the whole program, current line marked (see past and upcoming lines) */
      grid.appendChild(left);
      if (code.length) {
        const right = h("div", { class: "bt-code" });
        code.forEach((ln, idx) => right.appendChild(h("div", { class: "bt-codeline" + (idx === s.line ? " bt-cur" : "") },
          h("span", { class: "bt-marker" }, idx === s.line ? "▸" : " "),
          h("span", { html: App.highlight(ln) || "&nbsp;" }))));
        grid.appendChild(right);
      }
      return grid;
    },
  });
};

/* ============================================================
   dictTrain - a dictionary as a wall of labeled lockers. Each locker
   has a key plate (amber) on the door and a value ball inside. A set
   flashes the swapped ball; get(missing) draws a ghost locker; a
   lookup jumps straight to a locker (the fast-lookup lesson).
   config: {
     title, steps:[{
       pairs:[[k,v],...],       // full state this step
       caption,                 // html
       flash:[k,...],           // keys whose value just changed
       probe:k,                 // key we jumped straight to (lookup)
       miss:k,                  // a missing key -> ghost locker appended
       returned                 // value returned, shown in a tray
     }]
   }
   ============================================================ */
App.widgets.dictTrain = function (cfg) {
  const code = cfg.code || [];
  return App.widgets.stepper({
    title: cfg.title || "Dictionary operations",
    steps: cfg.steps,
    render: (s, i) => {
      const grid = h("div", { class: "bt-2col" });

      /* LEFT: the lockers, variables assigned so far, a short description */
      const left = h("div", { class: "bt-left" });
      if (cfg.name) left.appendChild(h("div", { class: "bt-listname" }, cfg.name));
      const wall = h("div", { class: "dt-wall" });
      const pairs = s.pairs || [];
      pairs.forEach(([k, v]) => {
        const cls = ["dt-locker"];
        if (s.flash && s.flash.includes(k)) cls.push("dt-flash");
        if (s.probe === k) cls.push("dt-probe");
        wall.appendChild(h("div", { class: cls.join(" ") },
          h("div", { class: "dt-key" }, "'" + k + "'"),
          h("div", { class: "dt-ball bt-" + btType(v) }, btLabel(v))));
      });
      if (!pairs.length && !s.miss) wall.appendChild(h("div", { class: "dt-locker dt-empty" }, "{ }"));
      if (s.miss)
        wall.appendChild(h("div", { class: "dt-locker dt-ghost dt-probe" },
          h("div", { class: "dt-key" }, "'" + s.miss + "'"),
          h("div", { class: "dt-ball bt-none" }, "?")));
      left.appendChild(wall);

      const assigns = {};
      for (let k = 0; k <= i; k++) { const a = cfg.steps[k].assign; if (a) assigns[a.name] = { value: a.value, set: k === i }; }
      const names = Object.keys(assigns);
      if (names.length) {
        const vars = h("div", { class: "bt-vars" });
        names.forEach((nm) => {
          const a = assigns[nm];
          vars.appendChild(h("div", { class: "bt-var" + (a.set ? " bt-var-set" : "") },
            h("div", { class: "bt-varname" }, nm),
            h("div", { class: "bt-ball bt-" + btType(a.value) }, btLabel(a.value))));
        });
        left.appendChild(vars);
      }
      if (s.caption) left.appendChild(h("div", { class: "bt-cap", html: s.caption }));

      /* RIGHT: the whole program, current line marked */
      grid.appendChild(left);
      if (code.length) {
        const right = h("div", { class: "bt-code" });
        code.forEach((ln, idx) => right.appendChild(h("div", { class: "bt-codeline" + (idx === s.line ? " bt-cur" : "") },
          h("span", { class: "bt-marker" }, idx === s.line ? "▸" : " "),
          h("span", { html: App.highlight(ln) || "&nbsp;" }))));
        grid.appendChild(right);
      }
      return grid;
    },
  });
};

/* ============================================================
   rebindViz - a name is a reference. Reassigning binds the same
   name to a new value; the type can change (dynamic typing). Each
   step adds the new value; the name points at the current one, older
   values are shown unreferenced.
   config: { title, name, steps:[{ value, note, flash }] }
   ============================================================ */
App.widgets.rebindViz = function (cfg) {
  const nm = cfg.name || "x", code = cfg.code || [];
  return App.widgets.stepper({
    title: cfg.title || "One name, reassigned",
    steps: cfg.steps,
    render: (s, i) => {
      const out = h("div", { class: "rb-wrap" });
      const row = h("div", { class: "rb-objs" });
      for (let j = 0; j <= i; j++) {
        const st = cfg.steps[j], v = st.value, cur = j === i;
        // JS can't distinguish 10.0 from 10, so allow explicit type/display overrides.
        const t = st.type || btType(v), lbl = st.display != null ? st.display : btLabel(v);
        row.appendChild(h("div", { class: "rb-obj" + (cur ? " rb-cur" : "") + (cur && s.flash ? " rb-flash" : "") },
          h("div", { class: "rb-name" + (cur ? "" : " rb-hide") }, nm),
          h("div", { class: "rb-arrow" + (cur ? "" : " rb-hide") }, "↓"),
          h("div", { class: "rb-ball bt-" + t + (cur ? "" : " rb-dim") }, lbl),
          h("div", { class: "rb-type" }, cur ? "type: " + (t === "none" ? "NoneType" : t) : "unreferenced")));
      }
      out.appendChild(row);
      if (s.note) out.appendChild(h("div", { class: "bt-cap", html: s.note }));
      return btTwoCol(out, code, s.line != null ? s.line : i);
    },
  });
};

/* ============================================================
   aliasViz - two names can reference the SAME object. Mutating the
   object through one name is visible through the other. copy() makes
   a separate object. Compares identity (is) vs value (==).
   config: { title, steps:[{
     objects:[{ id, list:[...] }],   // objects on the heap this step
     names:{ name: objId },          // which object each name references
     flash:objId,                    // object just mutated
     enter:objId,                    // object just created
     compare:[[expr, boolean], ...], // is/== results to show
     note
   }] }
   ============================================================ */
App.widgets.aliasViz = function (cfg) {
  return App.widgets.stepper({
    title: cfg.title || "Two names can share one object",
    steps: cfg.steps,
    render: (s) => {
      const out = h("div", { class: "al-wrap" });
      const objs = h("div", { class: "al-objs" });
      const names = s.names || {};
      (s.objects || []).forEach((o) => {
        const tags = Object.keys(names).filter((n) => names[n] === o.id);
        const box = h("div", { class: "al-obj" + (s.flash === o.id ? " al-flash" : "") + (s.enter === o.id ? " al-enter" : "") });
        const tagRow = h("div", { class: "al-tags" });
        tags.forEach((n) => tagRow.appendChild(h("span", { class: "al-tag" }, n)));
        if (!tags.length) tagRow.appendChild(h("span", { class: "al-tag al-none" }, "no name"));
        box.appendChild(tagRow);
        const cells = h("div", { class: "al-list" });
        o.list.forEach((v) => cells.appendChild(h("span", { class: "al-cell bt-" + btType(v) }, btLabel(v))));
        box.appendChild(cells);
        box.appendChild(h("div", { class: "al-id" }, "list object " + o.id));
        objs.appendChild(box);
      });
      out.appendChild(objs);
      if (s.compare) {
        const cmp = h("div", { class: "al-cmp" });
        s.compare.forEach(([expr, val]) => cmp.appendChild(
          h("span", { class: "al-chip " + (val ? "al-true" : "al-false") }, expr + " → " + (val ? "True" : "False"))));
        out.appendChild(cmp);
      }
      if (s.note) out.appendChild(h("div", { class: "bt-cap", html: s.note }));
      return out;
    },
  });
};

/* ============================================================
   searchViz - linear search and binary search on the same sorted
   data, advanced one comparison per step so their step counts can be
   compared directly. Linear scans left to right; binary keeps a
   low..high range and checks the middle, discarding half each step.
   config: { title, data:[sorted numbers], target }
   ============================================================ */
App.widgets.searchViz = function (cfg) {
  const data = cfg.data, target = cfg.target;
  const lin = [];
  for (let i = 0; i < data.length; i++) { lin.push(i); if (data[i] === target) break; }
  const bin = [];
  { let lo = 0, hi = data.length - 1;
    while (lo <= hi) { const mid = (lo + hi) >> 1; bin.push({ lo, hi, mid });
      if (data[mid] === target) break; else if (data[mid] < target) lo = mid + 1; else hi = mid - 1; } }
  const total = Math.max(lin.length, bin.length);
  const steps = []; for (let k = 0; k < total; k++) steps.push({ k });

  function section(name, big, count, row) {
    return h("div", { class: "sv-sect" },
      h("div", { class: "sv-label" }, name + " ",
        h("span", { class: "sv-big" }, big), h("span", { class: "sv-count" }, "steps: " + count)), row);
  }

  return App.widgets.stepper({
    title: cfg.title || "Linear vs binary search",
    steps,
    render: (s) => {
      const k = s.k, out = h("div", { class: "sv-wrap" });
      out.appendChild(h("div", { class: "sv-head" }, "target = ", h("b", null, String(target))));

      const li = Math.min(k, lin.length - 1), linActive = lin[li], linDone = k >= lin.length - 1;
      const linRow = h("div", { class: "sv-row" });
      data.forEach((v, idx) => {
        let cls = "sv-cell";
        if (linDone && idx === lin[lin.length - 1]) cls += " sv-found";
        else if (idx === linActive) cls += " sv-active";
        else if (idx < linActive) cls += " sv-checked";
        linRow.appendChild(h("div", { class: cls }, String(v)));
      });
      out.appendChild(section("Linear", "O(n)", Math.min(k + 1, lin.length), linRow));

      const bi = Math.min(k, bin.length - 1), st = bin[bi], binDone = k >= bin.length - 1;
      const binRow = h("div", { class: "sv-row" });
      data.forEach((v, idx) => {
        let cls = "sv-cell";
        if (binDone && idx === bin[bin.length - 1].mid) cls += " sv-found";
        else if (idx < st.lo || idx > st.hi) cls += " sv-out";
        else if (idx === st.mid) cls += " sv-active";
        binRow.appendChild(h("div", { class: cls }, String(v)));
      });
      out.appendChild(section("Binary", "O(log n)", Math.min(k + 1, bin.length), binRow));

      if (k === total - 1)
        out.appendChild(h("div", { class: "bt-cap" }, "Result - linear: " + lin.length + " steps, binary: " + bin.length + " steps"));
      return out;
    },
  });
};

/* ============================================================
   bubbleViz - bubble sort as bars (height = value). Each step is one
   comparison of a neighbouring pair; a swap is highlighted; after
   each pass the largest remaining value settles at the end and locks.
   config: { title, data:[numbers] }
   ============================================================ */
App.widgets.bubbleViz = function (cfg) {
  const src = cfg.data, n = src.length, max = Math.max.apply(null, src);
  const a = src.slice(), trace = [];
  let comparisons = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++;
      const swap = a[j] > a[j + 1];
      trace.push({ arr: a.slice(), j, swap, lockedFrom: n - i, comparisons });
      if (swap) { const tmp = a[j]; a[j] = a[j + 1]; a[j + 1] = tmp; }
    }
  }
  trace.push({ arr: a.slice(), j: -1, swap: false, lockedFrom: 0, comparisons, done: true });

  return App.widgets.stepper({
    title: cfg.title || "Bubble sort",
    steps: trace,
    render: (s) => {
      const out = h("div", { class: "bv-wrap" });
      const bars = h("div", { class: "bv-bars" });
      s.arr.forEach((v, idx) => {
        let cls = "bv-bar";
        if (idx >= s.lockedFrom) cls += " bv-locked";
        else if (idx === s.j || idx === s.j + 1) cls += s.swap ? " bv-swap" : " bv-cmp";
        bars.appendChild(h("div", { class: cls, style: "height:" + (v / max * 100) + "%" },
          h("span", { class: "bv-val" }, String(v))));
      });
      out.appendChild(bars);
      const state = s.done ? "sorted" : s.swap ? "swap (left > right)" : "in order, no swap";
      out.appendChild(h("div", { class: "bv-info" }, "comparisons: " + s.comparisons + " · " + state));
      return out;
    },
  });
};

/* ============================================================
   cycleFlow - the information processing cycle: Input → Processing →
   Storage → Output. Each step activates one stage; the data value is
   shown at each stage it has reached (data transforms at Processing).
   config: { title, stages:[{ name, data, note }] }
   ============================================================ */
App.widgets.cycleFlow = function (cfg) {
  const stages = cfg.stages || [
    { name: "Input", data: "key 'A'", note: "Data enters: keyboard, mouse, scanner, microphone." },
    { name: "Processing", data: "'A' → 65", note: "The CPU transforms the data with instructions." },
    { name: "Storage", data: "65 saved", note: "The result is kept in memory or on disk." },
    { name: "Output", data: "show 'A'", note: "Information leaves: monitor, printer, speaker." },
  ];
  return App.widgets.stepper({
    title: cfg.title || "The information processing cycle",
    steps: stages,
    render: (s, i) => {
      const out = h("div", { class: "cf-wrap" });
      const row = h("div", { class: "cf-row" });
      stages.forEach((st, idx) => {
        if (idx) row.appendChild(h("div", { class: "cf-arrow" + (idx <= i ? " cf-on" : "") }, "→"));
        row.appendChild(h("div", { class: "cf-stage" + (idx === i ? " cf-active" : idx < i ? " cf-done" : "") },
          h("div", { class: "cf-name" }, st.name),
          h("div", { class: "cf-data" }, idx <= i ? st.data : "")));
      });
      out.appendChild(row);
      out.appendChild(h("div", { class: "bt-cap", html: stages[i].note }));
      return out;
    },
  });
};

/* ============================================================
   powerToggle - RAM is volatile, ROM is non-volatile. Toggle power:
   OFF clears the RAM cells; ROM cells keep their contents.
   config: { title, ram:[values], rom:[values] }
   ============================================================ */
App.widgets.powerToggle = function (cfg) {
  const ram = cfg.ram || ["x = 25", "name = 'Sophia'", "score = 90"];
  const rom = cfg.rom || ["BIOS", "bootloader", "firmware"];
  let on = true;
  const stage = h("div");
  const btn = h("button", { class: "w-btn on" });
  function draw() {
    btn.textContent = on ? "Power: ON" : "Power: OFF";
    btn.classList.toggle("on", on);
    stage.innerHTML = "";
    const cols = h("div", { class: "pt-cols" });
    const mk = (label, vals, volatile_) => {
      const col = h("div", { class: "pt-col" }, h("div", { class: "pt-head" }, label));
      vals.forEach((v) => {
        const cleared = volatile_ && !on;
        col.appendChild(h("div", { class: "pt-cell" + (cleared ? " pt-empty" : "") }, cleared ? "" : v));
      });
      return col;
    };
    cols.appendChild(mk("RAM (volatile)", ram, true));
    cols.appendChild(mk("ROM (non-volatile)", rom, false));
    stage.appendChild(cols);
    stage.appendChild(h("div", { class: "bt-cap" }, on
      ? "Power ON - RAM and ROM both hold data."
      : "Power OFF - RAM is cleared. ROM keeps its data."));
  }
  btn.addEventListener("click", () => { on = !on; draw(); });
  draw();
  return widgetShell(cfg.title || "Cut the power: RAM vs ROM",
    h("div", null, h("div", { class: "w-row", style: "margin-bottom:12px" }, btn), stage));
};

/* ============================================================
   seekViz - reading a block. HDD moves a head to the track, waits for
   the sector to rotate under it, then reads (milliseconds). SSD
   addresses the cell electronically and reads at once (microseconds).
   config: { title }
   ============================================================ */
App.widgets.seekViz = function (cfg) {
  const cx = 95, cy = 95;
  const pt = (r, aDeg) => { const a = aDeg * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const phases = [
    { label: "HDD: move the head to the track", ms: 9.0, headR: 80, secA: 150, read: false },
    { label: "HDD: wait for the sector to rotate under the head", ms: 13.0, headR: 45, secA: 20, read: false },
    { label: "HDD: read the sector", ms: 13.1, headR: 45, secA: -90, read: true },
  ];
  return App.widgets.stepper({
    title: cfg.title || "Reading a block: HDD vs SSD",
    steps: phases,
    render: (s) => {
      const [hx, hy] = pt(s.headR, -90), [sx, sy] = pt(45, s.secA);
      const secColor = s.read ? "var(--accent-2)" : "var(--warn)";
      const hdd =
        '<svg viewBox="0 0 190 190" class="sk-svg">' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="80" style="fill:var(--bg-2);stroke:var(--border)"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="45" stroke-dasharray="4 4" style="fill:none;stroke:var(--border)"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="10" style="fill:var(--border)"/>' +
        '<circle cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="9" style="fill:' + secColor + '"/>' +
        '<line x1="178" y1="10" x2="' + hx.toFixed(1) + '" y2="' + hy.toFixed(1) + '" style="stroke:var(--accent);stroke-width:4"/>' +
        '<circle cx="' + hx.toFixed(1) + '" cy="' + hy.toFixed(1) + '" r="6" style="fill:var(--accent)"/>' +
        '</svg>';
      let cells = "";
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++)
        cells += '<div class="sk-ssd-cell' + (r === 1 && c === 2 ? " sk-hit" : "") + '"></div>';
      return '<div class="sk-grid">' +
        '<div class="sk-panel"><div class="sk-ptitle">HDD - moving parts</div>' + hdd +
        '<div class="sk-time">' + s.ms.toFixed(1) + ' ms</div></div>' +
        '<div class="sk-panel"><div class="sk-ptitle">SSD - no moving parts</div>' +
        '<div class="sk-ssd">' + cells + '</div><div class="sk-time">0.1 ms</div></div>' +
        '</div><div class="bt-cap">' + s.label + ' &nbsp;·&nbsp; SSD: cell addressed directly, read now.</div>';
    },
  });
};

/* ============================================================
   levelDrop - one line of code travels down the levels of a computer
   system (User → … → Digital Logic). Each step activates one level and
   shows what the line has become there; at Level 0 the gates output it.
   config: { title, levels:[{ n, name, token, desc, out }] }
   ============================================================ */
App.widgets.levelDrop = function (cfg) {
  const levels = cfg.levels || [
    { n: 6, name: "User", token: 'run print("Hi")', desc: "You run the program." },
    { n: 5, name: "High-Level Language", token: 'print("Hi")', desc: "Python source code - your code lives here." },
    { n: 4, name: "Assembly", token: "CALL print", desc: "Human-readable mnemonics." },
    { n: 3, name: "Operating System", token: "write() syscall", desc: "The OS handles the request." },
    { n: 2, name: "Machine (ISA)", token: "10110100 …", desc: "Binary instructions the CPU runs." },
    { n: 1, name: "Control", token: "micro-ops", desc: "Control signals drive the logic." },
    { n: 0, name: "Digital Logic", token: "Hi", desc: "Gates switch and output the result.", out: true },
  ];
  return App.widgets.stepper({
    title: cfg.title || 'One line down the levels: print("Hi")',
    steps: levels,
    render: (s, i) => {
      const out = h("div", { class: "ld-wrap" });
      const col = h("div", { class: "ld-levels" });
      levels.forEach((lv, idx) => {
        col.appendChild(h("div", { class: "ld-level" + (idx === i ? " ld-active" : idx < i ? " ld-passed" : "") },
          h("span", { class: "ld-num" }, "L" + lv.n),
          h("span", { class: "ld-name" }, lv.name),
          idx === i ? h("span", { class: "ld-token" + (lv.out ? " ld-outtok" : "") }, lv.token) : null));
      });
      out.appendChild(col);
      out.appendChild(h("div", { class: "bt-cap" }, levels[i].desc));
      return out;
    },
  });
};

/* ============================================================
   branchViz - if / elif / else. Conditions are checked top to bottom;
   the first True branch runs, the rest are skipped. Switch the input
   scenario to see a different branch light up.
   config: {
     title, var,
     branches:[{ kw, cond, label, else }],   // last one is the else
     scenarios:[{ value, evals:[bool per condition] }]
   }
   ============================================================ */
App.widgets.branchViz = function (cfg) {
  const branches = cfg.branches, varName = cfg.var || "x";
  const condCount = branches.filter((b) => !b.else).length;

  function buildStates(scn) {
    let taken = scn.evals.findIndex((v) => v === true);
    if (taken === -1) taken = branches.length - 1;               // the else
    const varLine = varName + " = " + btLabel(scn.value);
    const states = [];
    const stop = (taken < condCount) ? taken : condCount - 1;
    for (let k = 0; k <= stop; k++) {
      const gates = branches.map((b, idx) => idx < k ? "false" : idx === k ? (scn.evals[k] ? "true" : "false") : "pending");
      states.push({ varLine, gates, note: branches[k].cond + " → " + (scn.evals[k] ? "True" : "False") });
    }
    const gates = branches.map((b, idx) => idx < taken ? "false" : idx === taken ? "run" : "skip");
    const tb = branches[taken];
    states.push({ varLine, gates, note: (tb.else ? "else" : tb.cond) + " → runs: " + tb.label, done: true });
    return states;
  }

  let i = 0, states = buildStates(cfg.scenarios[0]);
  const stage = h("div");
  const note = h("div", { class: "brv-note" });
  const counter = h("span", { class: "mono", style: "color:var(--text-dim)" });
  const prev = h("button", { class: "w-btn" }, "‹ Prev");
  const next = h("button", { class: "w-btn on" }, "Next ›");
  const reset = h("button", { class: "w-btn" }, "⟲");

  const scRow = h("div", { class: "w-row", style: "margin-bottom:12px" });
  cfg.scenarios.forEach((scn, idx) => {
    const btn = h("button", { class: "w-btn" + (idx === 0 ? " on" : "") }, varName + " = " + btLabel(scn.value));
    btn.addEventListener("click", () => {
      i = 0; states = buildStates(scn);
      scRow.querySelectorAll(".w-btn").forEach((x) => x.classList.remove("on"));
      btn.classList.add("on"); draw();
    });
    scRow.appendChild(btn);
  });

  function draw() {
    const st = states[i];
    stage.innerHTML = "";
    stage.appendChild(h("div", { class: "brv-var" }, st.varLine));
    const list = h("div", { class: "brv-gates" });
    branches.forEach((b, idx) => {
      const gs = st.gates[idx];
      const badge = gs === "true" ? "True" : gs === "false" ? "False" : "";
      list.appendChild(h("div", { class: "brv-gate brv-" + gs },
        h("span", { class: "brv-kw" }, b.kw || (b.else ? "else" : "if")),
        h("span", { class: "brv-cond" }, b.else ? "" : b.cond),
        badge ? h("span", { class: "brv-badge brv-b-" + gs }, badge) : null,
        h("span", { class: "brv-body" }, b.label)));
    });
    stage.appendChild(list);
    note.innerHTML = st.note;
    counter.textContent = " step " + (i + 1) + " / " + states.length;
    prev.disabled = i === 0; next.disabled = i === states.length - 1;
  }
  prev.addEventListener("click", () => { if (i > 0) { i--; draw(); } });
  next.addEventListener("click", () => { if (i < states.length - 1) { i++; draw(); } });
  reset.addEventListener("click", () => { i = 0; draw(); });
  draw();

  return widgetShell(cfg.title != null ? cfg.title : "if / elif / else",
    h("div", null, scRow, stage, note,
      h("div", { class: "w-row", style: "margin-top:12px" }, prev, next, reset, counter)));
};

/* ============================================================
   callStack - each call pushes a frame (top = most recent). The base
   case stops the recursion; frames then return in reverse order. Reused
   for recursion and for C function frames.
   config: {
     title, steps:[{
       frames:[{ call, detail, state:'call'|'wait'|'base'|'return', ret }],
       note, returned
     }]
   }
   ============================================================ */
App.widgets.callStack = function (cfg) {
  const code = cfg.code || [];
  return App.widgets.stepper({
    title: cfg.title || "The call stack",
    steps: cfg.steps,
    render: (s) => {
      const left = h("div", { class: "cs-wrap" });
      left.appendChild(h("div", { class: "cs-head" }, "Call stack - top = most recent"));
      const stack = h("div", { class: "cs-stack" });
      const frames = s.frames || [];
      frames.slice().reverse().forEach((f) => {
        stack.appendChild(h("div", { class: "cs-frame cs-" + (f.state || "wait") },
          h("div", { class: "cs-line" },
            h("span", { class: "cs-fn" }, f.call),
            f.ret != null ? h("span", { class: "cs-ret" }, "→ " + f.ret) : null),
          f.detail ? h("div", { class: "cs-detail" }, f.detail) : null));
      });
      if (!frames.length) stack.appendChild(h("div", { class: "cs-empty" }, "(stack empty)"));
      left.appendChild(stack);
      if (s.note) left.appendChild(h("div", { class: "bt-cap", html: s.note }));
      if (s.returned != null) left.appendChild(h("div", { class: "bt-ret" }, "→ result ", h("b", null, s.returned)));
      return btTwoCol(left, code, s.line);
    },
  });
};

/* ============================================================
   pseudoMap - build an algorithm line by line, pseudocode on the left
   and the matching Python on the right. Each step reveals one row and
   highlights the pair.
   config: { title, rows:[{ pseudo, code, note }] }
   ============================================================ */
App.widgets.pseudoMap = function (cfg) {
  const rows = cfg.rows;
  return App.widgets.stepper({
    title: cfg.title || "Pseudocode → Python",
    steps: rows,
    render: (s, i) => {
      const out = h("div", { class: "pm-wrap" });
      const grid = h("div", { class: "pm-grid" });
      grid.appendChild(h("div", { class: "pm-colhead" }, "Pseudocode"));
      grid.appendChild(h("div", { class: "pm-colhead" }, "Python"));
      rows.forEach((r, idx) => {
        const shown = idx <= i, act = idx === i;
        grid.appendChild(h("div", { class: "pm-cell" + (shown ? "" : " pm-blank") + (act ? " pm-active" : "") }, shown ? r.pseudo : ""));
        grid.appendChild(h("div", { class: "pm-cell pm-py" + (shown ? "" : " pm-blank") + (act ? " pm-active" : "") }, shown ? r.code : ""));
      });
      out.appendChild(grid);
      if (rows[i].note) out.appendChild(h("div", { class: "pm-note", html: rows[i].note }));
      return out;
    },
  });
};

/* ============================================================
   buildPipeline - how a compiled C program is built and run: source →
   compile (object file) → link (executable) → run. Each step activates
   one stage and reveals the artifact it produces.
   config: { title, stages:[{ name, artifact, note }] }
   ============================================================ */
App.widgets.buildPipeline = function (cfg) {
  const stages = cfg.stages || [
    { name: "Source", artifact: "hello.c", note: "You write the C source code." },
    { name: "Compile (gcc)", artifact: "hello.o", note: "The compiler checks types and produces machine code (an object file). Not runnable yet." },
    { name: "Link", artifact: "hello", note: "The linker joins your object file with library code into one executable." },
    { name: "Run", artifact: '"Hello, World!"', note: "The CPU runs the executable directly. No interpreter." },
  ];
  return App.widgets.stepper({
    title: cfg.title || "From source to running program",
    steps: stages,
    render: (s, i) => {
      const out = h("div", { class: "bp-wrap" });
      const row = h("div", { class: "bp-row" });
      stages.forEach((st, idx) => {
        if (idx) row.appendChild(h("div", { class: "bp-arrow" + (idx <= i ? " bp-on" : "") }, "→"));
        row.appendChild(h("div", { class: "bp-stage" + (idx === i ? " bp-active" : idx < i ? " bp-done" : "") },
          h("div", { class: "bp-name" }, st.name),
          h("div", { class: "bp-artifact" }, idx <= i ? h("span", { class: "bp-file" }, st.artifact) : "")));
      });
      out.appendChild(row);
      out.appendChild(h("div", { class: "bt-cap", html: stages[i].note }));
      return out;
    },
  });
};

/* ============================================================
   predict - a "what will happen?" beat placed just before an animation.
   The student commits to a guess; picking one reveals which is right
   and a short explanation. In slide mode this is its own slide before
   the animation reveals the answer.
   config: { title, question, options:[{ label, correct }], explain }
   ============================================================ */
App.widgets.predict = function (cfg) {
  const wrap = h("div", { class: "pr-wrap" });
  wrap.appendChild(h("div", { class: "pr-kick" }, "Predict"));
  wrap.appendChild(h("div", { class: "pr-q", html: cfg.question }));
  const opts = h("div", { class: "pr-opts" });
  const explain = h("div", { class: "pr-explain", html: cfg.explain || "" });
  let answered = false;
  cfg.options.forEach((o) => {
    const btn = h("button", { class: "pr-opt" }, o.label);
    btn.addEventListener("click", () => {
      if (answered) return; answered = true;
      cfg.options.forEach((oo, k) => {
        const b = opts.children[k];
        b.disabled = true;
        if (oo.correct) b.classList.add("pr-correct");
        else if (b === btn) b.classList.add("pr-wrong");
      });
      explain.classList.add("show");
    });
    opts.appendChild(btn);
  });
  wrap.appendChild(opts);
  wrap.appendChild(explain);
  return widgetShell(cfg.title || "What will happen?", wrap);
};

/* ============================================================
   pyToC - the same concept in Python (left) and C (right), stepped
   construct by construct. Lets students carry Python knowledge into
   C syntax. Python column is syntax-highlighted; C column is plain.
   config: { title, pairs:[{ concept, py:[lines], c:[lines], note }] }
   ============================================================ */
App.widgets.pyToC = function (cfg) {
  return App.widgets.stepper({
    title: cfg.title || "Same logic - Python vs C",
    steps: cfg.pairs,
    render: (s) => {
      const col = (label, lines, cls, isPy) => {
        const box = h("div", { class: "bt-code" });
        (lines || []).forEach((ln) => box.appendChild(h("div", { class: "bt-codeline" },
          h("span", { html: App.highlight(ln, isPy ? "python" : "c") || "&nbsp;" }))));
        return h("div", { class: "p2c-col" }, h("div", { class: "p2c-lang " + cls }, label), box);
      };
      const grid = h("div", { class: "p2c-grid" },
        col("Python", s.py, "p2c-py", true), col("C", s.c, "p2c-c", false));
      return h("div", null,
        s.concept ? h("div", { class: "p2c-concept" }, s.concept) : null,
        grid,
        s.note ? h("div", { class: "bt-cap", html: s.note }) : null);
    },
  });
};

/* ============================================================
   jsonFlow - a dict becomes JSON text (dump) and back (load). Mirrors
   csvFlow so JSON reads as its own complete lesson.
   config: { title, data:{...} }
   ============================================================ */
App.widgets.jsonFlow = function (cfg) {
  const data = cfg.data || { name: "Alice", age: 30, skills: ["py", "sql"] };
  const text = JSON.stringify(data);
  const disp = (v) => Array.isArray(v) ? "[" + v.map(btLabel).join(", ") + "]" : btLabel(v);
  const typ = (v) => Array.isArray(v) ? "str" : btType(v);
  const steps = [
    { dir: "", flashDict: true, note: "A Python <b>dict</b> in memory." },
    { dir: "dump", flashText: true, note: "<code>json.dump(data, f)</code> writes the dict as <b>text</b>." },
    { dir: "load", flashDict: true, note: "<code>json.load(f)</code> reads the text back into a <b>dict</b>." },
  ];
  return App.widgets.stepper({
    title: cfg.title || "dict to JSON text and back",
    steps: steps,
    render: (s) => {
      const wall = h("div", { class: "dt-wall" });
      Object.keys(data).forEach((k) => wall.appendChild(
        h("div", { class: "dt-locker" + (s.flashDict ? " dt-flash" : "") },
          h("div", { class: "dt-key" }, "'" + k + "'"),
          h("div", { class: "dt-ball bt-" + typ(data[k]) }, disp(data[k])))));
      const arrow = h("div", { class: "jf-arrow" }, s.dir === "dump" ? "dump →" : s.dir === "load" ? "← load" : "·");
      const textBox = h("div", { class: "bt-code" + (s.flashText ? " bt-cur" : "") },
        h("div", { class: "bt-codeline" }, h("span", { class: "jf-file" }, "data.json: "), h("span", { html: App.esc(text) })));
      return h("div", null,
        h("div", { class: "jf-grid" }, wall, arrow, textBox),
        h("div", { class: "bt-cap", html: s.note }));
    },
  });
};
