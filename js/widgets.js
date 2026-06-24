/* ============================================================
   widgets.js — interactive visuals & animations
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
   infocards — always-visible reading cards (NOT interactive)
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
   cpuCycle — animated fetch/decode/execute/store
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
      caption.textContent = (i + 1) + ". " + stages[i].k + " — " + stages[i].d;
    }, 1100);
  });
  return widgetShell("The CPU instruction cycle", h("div", null, stRow, h("div", { class: "w-row", style: "margin-top:12px" }, play), caption));
};

/* ============================================================
   binaryConverter — char/number <-> 8-bit binary + ASCII
   ============================================================ */
App.widgets.binaryConverter = function () {
  let value = 65; // 'A'
  const bitsEl = h("div", { class: "bits" });
  const info = h("div", { class: "step-log" });
  const input = h("input", { class: "w-input mono", type: "text", maxlength: "3", value: "A", style: "width:70px" });
  const numIn = h("input", { class: "w-input mono", type: "number", min: "0", max: "255", value: "65", style: "width:90px" });

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
      "</b> &nbsp;=&nbsp; hex <b>0x" + value.toString(16).toUpperCase().padStart(2, "0") +
      "</b> &nbsp;=&nbsp; char <b>'" + ch + "'</b>  (click bits to flip)";
  }
  function sync() { value &= 0xff; input.value = value >= 32 && value < 127 ? String.fromCharCode(value) : ""; numIn.value = value; render(); }
  input.addEventListener("input", () => { if (input.value.length) { value = input.value.charCodeAt(0) & 0xff; numIn.value = value; render(); } });
  numIn.addEventListener("input", () => { value = (parseInt(numIn.value, 10) || 0) & 0xff; input.value = value >= 32 && value < 127 ? String.fromCharCode(value) : ""; render(); });
  render();
  return widgetShell("Binary / ASCII explorer",
    h("div", null,
      h("div", { class: "w-row" }, h("span", { class: "mono" }, "char:"), input, h("span", { class: "mono" }, "decimal:"), numIn),
      h("div", { style: "margin:12px 0" }, bitsEl), info));
};

/* ============================================================
   truthTable — interactive, with operator selector
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
  return widgetShell("Truth table — pick an operator", h("div", null, sel, h("div", { style: "margin-top:12px" }, tableHost)));
};

/* ============================================================
   stepper — generic previous/next state machine
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
  return widgetShell(cfg.title || "Step through it",
    h("div", null, stage, h("div", { class: "w-row", style: "margin-top:12px" }, prev, next, reset, counter)));
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

/* loopViz — convenience over stepper for line+vars+log traces
   config: { title, code:[lines], trace:[{line, vars, log}] } */
App.widgets.loopViz = function (cfg) {
  return App.widgets.stepper({
    title: cfg.title || "Loop tracer",
    steps: cfg.trace,
    render: (s) => {
      const out = h("div");
      out.appendChild(App.widgets.codeLines(cfg.code, s.line));
      out.appendChild(App.widgets.varChips(s.vars || {}));
      if (s.log != null) out.appendChild(h("div", { class: "step-log" }, "output so far:\n" + s.log));
      return out;
    },
  });
};

/* ============================================================
   memoryModel — stack frames / pointers (C-style illustration)
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
   flowchart — SVG flowchart with code sync
   config: { nodes:[{id,type,text,x,y,w,h}], edges:[{from,to,label}],
             code:[lines], map:{ nodeId:[lineIdx...] } }
   types: terminator | process | decision | io | call
   ============================================================ */
App.widgets.flowchart = function (cfg) {
  const W = cfg.width || 320, Hh = cfg.height || 420;
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 " + W + " " + Hh);
  svg.innerHTML = '<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="currentColor"/></marker></defs>';

  const nodeById = {};
  cfg.nodes.forEach((n) => (nodeById[n.id] = n));

  // edges first
  (cfg.edges || []).forEach((e) => {
    const a = nodeById[e.from], b = nodeById[e.to];
    if (!a || !b) return;
    const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y;
    const path = document.createElementNS(svgNS, "path");
    let d;
    if (e.side === "right") {
      const mx = a.x + a.w;
      d = `M${mx},${a.y + a.h / 2} H${x2 + 40} V${y2} H${x2}`;
    } else if (e.side === "left") {
      d = `M${a.x},${a.y + a.h / 2} H${b.x - 40} V${y2} H${x2}`;
    } else {
      d = `M${x1},${y1} V${y2}`;
    }
    path.setAttribute("d", d);
    path.setAttribute("class", "fline");
    svg.appendChild(path);
    if (e.label) {
      const t = document.createElementNS(svgNS, "text");
      t.setAttribute("x", (e.side === "right" ? a.x + a.w + 4 : e.side === "left" ? a.x - 36 : x1 + 6));
      t.setAttribute("y", a.y + a.h + 12);
      t.setAttribute("class", "flbl");
      t.textContent = e.label;
      svg.appendChild(t);
    }
  });

  const nodeEls = {};
  cfg.nodes.forEach((n) => {
    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("class", "fnode");
    let shape;
    if (n.type === "decision") {
      shape = document.createElementNS(svgNS, "polygon");
      const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
      shape.setAttribute("points", `${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}`);
    } else if (n.type === "io") {
      shape = document.createElementNS(svgNS, "polygon");
      const sk = 14;
      shape.setAttribute("points", `${n.x + sk},${n.y} ${n.x + n.w},${n.y} ${n.x + n.w - sk},${n.y + n.h} ${n.x},${n.y + n.h}`);
    } else {
      shape = document.createElementNS(svgNS, "rect");
      shape.setAttribute("x", n.x); shape.setAttribute("y", n.y);
      shape.setAttribute("width", n.w); shape.setAttribute("height", n.h);
      shape.setAttribute("rx", n.type === "terminator" ? n.h / 2 : 4);
    }
    shape.setAttribute("class", "fbox");
    g.appendChild(shape);
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", n.x + n.w / 2); t.setAttribute("y", n.y + n.h / 2 + 4);
    t.setAttribute("text-anchor", "middle");
    t.textContent = n.text;
    g.appendChild(t);
    g.addEventListener("mouseenter", () => highlight(n.id));
    g.addEventListener("mouseleave", () => highlight(null));
    svg.appendChild(g);
    nodeEls[n.id] = g;
  });

  // code side
  const codeBox = h("div", { class: "step-code" });
  const lineEls = [];
  cfg.code.forEach((ln, idx) => {
    const el = h("span", { class: "ln", html: App.highlight(ln) || "&nbsp;" });
    el.addEventListener("mouseenter", () => highlightFromLine(idx));
    el.addEventListener("mouseleave", () => highlight(null));
    codeBox.appendChild(el); lineEls.push(el);
  });

  function highlight(id) {
    Object.keys(nodeEls).forEach((k) => nodeEls[k].classList.toggle("hl", k === id));
    lineEls.forEach((e) => e.classList.remove("hl"));
    if (id && cfg.map && cfg.map[id]) cfg.map[id].forEach((li) => lineEls[li] && lineEls[li].classList.add("hl"));
  }
  function highlightFromLine(li) {
    let id = null;
    if (cfg.map) for (const k in cfg.map) if (cfg.map[k].includes(li)) { id = k; break; }
    highlight(id);
  }

  const grid = h("div", { class: "flow-wrap" },
    h("div", { class: "flow" }, svg),
    h("div", null, h("div", { class: "widget-title" }, "Equivalent Python — hover to link"), codeBox));
  return widgetShell(cfg.title || "Flowchart ↔ code (hover to connect)", grid);
};

/* ============================================================
   listViz — animate a sequence of list/dict states
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
   stringIndex — show a string with positive & negative indices,
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
  return widgetShell("String indexing — top number is the index, bottom is the negative index",
    h("div", null,
      h("div", { class: "w-row" }, h("span", { class: "mono" }, "text ="), textIn, h("span", { class: "mono" }, "index"), idxIn,
        h("span", { style: "color:var(--text-dim);font-size:12px" }, "(or click a box)")),
      h("div", { style: "margin:14px 0" }, charsEl), out));
};

/* ============================================================
   stringSlice — interactive start:end:step, highlights selection
   config: { text }
   ============================================================ */
App.widgets.stringSlice = function (cfg) {
  let text = (cfg && cfg.text) || "Programming";
  const charsEl = h("div", { class: "sgrid" });
  const out = h("div", { class: "step-log" });
  const sIn = h("input", { class: "w-input mono", value: "", placeholder: "start", style: "width:74px" });
  const eIn = h("input", { class: "w-input mono", value: "", placeholder: "end", style: "width:74px" });
  const stIn = h("input", { class: "w-input mono", value: "", placeholder: "step", style: "width:74px" });
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
  return widgetShell("String slicing — try start, end, step (leave blank for default; negatives allowed)",
    h("div", null,
      h("div", { class: "w-row" }, h("span", { class: "mono" }, "text ="), textIn),
      h("div", { class: "w-row", style: "margin-top:8px" }, h("span", { class: "mono" }, "text ["), sIn, h("span", { class: "mono" }, ":"), eIn, h("span", { class: "mono" }, ":"), stIn, h("span", { class: "mono" }, "]")),
      h("div", { style: "margin:14px 0" }, charsEl), out));
};

/* ============================================================
   stringShift — Caesar cipher: shift each letter by x, animated
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
  return widgetShell("String shift — each letter moves forward x places in the alphabet",
    h("div", null,
      h("div", { class: "w-row" }, h("span", { class: "mono" }, "text ="), textIn),
      h("div", { class: "w-row", style: "margin-top:8px" }, range, lbl),
      h("div", { style: "margin:14px 0" }, mapEl), out));
};

/* ============================================================
   flowExec — animate execution flowing through a flowchart
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
