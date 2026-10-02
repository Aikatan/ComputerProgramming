/* Trace steps of the C programs of a "Trace challenges" lesson, made with the site's own C engine.
   Python traces come from tools/make-trace.py; C has no compiler on the lecturer's machine, so the
   steps come from the engine that also runs the C programs of the site (js/crunner.js).

   1. python tools/make-trace.py t10 --c-programs     writes tools/traces/t10.programs.json
   2. Open the site from a local server, and run in the browser console:
        await new Promise((r) => { const s = document.createElement("script"); s.src = "tools/c-trace.js?" + Date.now(); s.onload = r; document.head.appendChild(s); });
        await cTraceAll("t10")          // downloads t10.steps.json: save it in tools/traces/
   3. python tools/make-trace.py t10                  writes the trace objects into the topic file

   A step: { line (0-based line of the shown code), set, unset, print, end, test }.
   - one step each time execution reaches a new line (lines that hold only a brace have no step)
   - set: the variables that the line changes. An array is one name for each element (a[0]), a
     struct one name for each member (p.x), a string (char array) one name, a pointer the name of
     its target (&n, &a[1]). A local variable of a function other than main is "v (twice)".
   - a function returns: its local variables are removed on the row of its last line, and the line
     of the call gets a row of its own that holds what the call line stores or displays
   - test: "true" or "false" on an if, else if, while, do-while, or for line
   The format is the one of js/widgets.js (codeTrace, traceTable). */
(function () {
  const isFloat = (t) => t.type === "primitive" && /float|double/.test(t.name);

  function number(text, t) {
    if (!isFloat(t)) return text;
    const x = Number(text);
    if (!isFinite(x)) return text;
    let s = String(parseFloat(x.toFixed(6)));
    if (/^-?\d+$/.test(s)) s += ".0";
    return s;
  }

  // every variable that is in scope -> { label: text }, in the order of the declarations
  function snapshot(rt, info) {
    const out = {};
    const owners = [];                     // [variable object, label] of the scalars and arrays, for pointers
    const vars = [];
    let fn = null;
    rt.scope.forEach((sc, depth) => {
      const m = /^function (\w+)/.exec(sc.$name || "");
      if (m) fn = m[1];
      Object.keys(sc).forEach((name) => {
        if (name[0] === "$") return;
        const v = sc[name];
        if (!v || !v.t || v.t.type === "function" || (depth === 0 && !info.globals.has(name))) return;
        const st = name.match(/^s__\w+?__(\w+)$/);      // a static local (see crunner.js)
        const label = st ? st[1] + " (static)" : (fn && fn !== "main" && depth > 0 ? name + " (" + fn + ")" : name);
        vars.push([name, label, v]);
      });
    });
    const put = (label, v) => {
      const t = v.t;
      if (t.type === "primitive") {
        if (v.v === undefined || v.v === null || (typeof v.v === "number" && isNaN(v.v))) return;   // declared, no value yet
        let text = rt.makeValueString(v);
        if (info.hex.has(label.replace(/[\[.( ].*$/, ""))) text = "0x" + (Number(v.v) >>> 0).toString(16).toUpperCase().padStart(2, "0");
        out[label] = number(String(text).replace(/\\x20/g, " "), t);
      } else if (t.type === "class") {
        Object.keys(v.v.members).forEach((k) => put(label + "." + k, v.v.members[k]));
      } else if (t.type === "pointer" && t.ptrType === "array" && !info.pointers.has(label.replace(/ \(.*$/, ""))) {
        owners.push([v.v.target, label]);
        if (t.eleType.type === "primitive" && t.eleType.name === "char") { out[label] = rt.makeValueString(v); return; }   // a string
        v.v.target.forEach((el, k) => put(label + "[" + k + "]", el));
      }
    };
    vars.forEach(([name, label, v]) => { if (v.t.type !== "pointer" || v.t.ptrType === "array") owners.push([v, label]); put(label, v); });
    // pointers: the name of the target
    vars.forEach(([name, label, v]) => {
      if (v.t.type !== "pointer" || !info.pointers.has(name)) return;
      if (!v.v || v.v.target === undefined || v.v.target === null) return;
      if (v.t.ptrType === "array") {
        const own = owners.find((o) => o[0] === v.v.target);
        out[label] = own ? "&" + own[1] + "[" + v.v.position + "]" : "?";
      } else {
        let found = null;
        const look = (obj, lb) => {
          if (found || !obj) return;
          if (obj === v.v.target) { found = lb; return; }
          if (obj.t && obj.t.type === "class") Object.keys(obj.v.members).forEach((k) => look(obj.v.members[k], lb + "." + k));
          if (obj.t && obj.t.type === "pointer" && obj.t.ptrType === "array" && obj.v && Array.isArray(obj.v.target)) obj.v.target.forEach((el, k) => look(el, lb + "[" + k + "]"));
        };
        vars.forEach(([n2, l2, v2]) => { if (v2 !== v) look(v2, l2); });
        out[label] = found ? "&" + found : "?";
      }
    });
    return out;
  }

  // the function of each line, the declared pointers and globals, from the text of the program
  function sourceInfo(full, opts) {
    const lines = full.split("\n");
    const fnOf = [];
    let cur = null, depth = 0;
    lines.forEach((ln, k) => {
      const head = depth === 0 && /^\s*[\w\s\*]+?\b(\w+)\s*\([^;]*\)\s*\{\s*$/.exec(ln);
      if (head) cur = head[1];
      fnOf[k + 1] = cur;
      depth += (ln.match(/\{/g) || []).length - (ln.match(/\}/g) || []).length;
      if (depth === 0 && /\}/.test(ln)) cur = null;
    });
    const pointers = new Set();
    const re = /\*\s*(\w+)\s*(?==|;|,|\))/g;
    let m;
    while ((m = re.exec(full))) pointers.add(m[1]);
    const globals = new Set();
    lines.forEach((ln, k) => { if (!fnOf[k + 1]) { const g = /^\s*(?:static\s+|const\s+|volatile\s+)*(?:unsigned\s+)?\w+\s+\**(\w+)\s*(?:\[[^\]]*\])*\s*(?:=|;)/.exec(ln); if (g) globals.add(g[1]); } });
    return { lines, fnOf, pointers, globals, hex: new Set(opts.hex || []) };
  }

  /* program: { pre, code, post, inputs, hex } -> { steps, output, error } */
  async function cTrace(program) {
    const pre = program.pre ? program.pre.replace(/\n$/, "").split("\n") : [];
    const shown = program.code.replace(/^\n+|\n+$/g, "").split("\n");
    const indent = program.indent === undefined ? (pre.some((l) => /main\s*\(/.test(l)) ? "    " : "") : program.indent;
    const full = pre.concat(shown.map((l) => (l ? indent + l : l)), (program.post || "").split("\n")).join("\n");
    const info = sourceInfo(full, program);
    const JS = await App.c.ensure();
    let out = "";
    App.c._io = { lines: Array.isArray(program.inputs) ? program.inputs.slice() : [], buf: "", sink: (s) => { out += s; }, echo: true };
    const visits = [];
    let error = null, lastLine = -1, lastSnap = {};
    try {
      const dbg = App.c._start(JS, full, (s) => { out += s; });
      const t0 = performance.now();
      for (let n = 1; ; n++) {
        const node = dbg.nextNode();
        const line = node ? node.sLine : -1;
        if (line > 0) {
          const snap = snapshot(dbg.rt, info);
          if (line !== lastLine) { visits.push({ line, first: snap, out: out.length }); lastLine = line; }
          visits[visits.length - 1].last = snap;
          lastSnap = snap;
        }
        dbg.next();
        if (dbg.done) break;
        if (visits.length > 600 || performance.now() - t0 > 4000) throw new Error("the trace is too long");
      }
    } catch (e) { error = String(e.message || e); }

    const first = pre.length + 1, lastShown = pre.length + shown.length;
    const steps = [];
    let pendingUnset = [];
    const testLine = (ln) => /^\s*(\}\s*else\s+)?if\s*\(|^\s*while\s*\(|^\s*for\s*\(/.test(ln) ? "head" : /^\s*\}\s*while\s*\(.*\)\s*;/.test(ln) ? "tail" : null;
    for (let k = 0; k < visits.length; k++) {
      const v = visits[k], nx = visits[k + 1];
      const before = v.first, after = nx ? nx.first : v.last, end = nx ? nx.out : out.length;
      const step = { line: v.line - first };
      const set = {}, unset = pendingUnset; pendingUnset = [];
      Object.keys(after).forEach((name) => { if (after[name] !== before[name]) set[name] = after[name]; });
      // a variable that leaves its scope on this line: its last value is shown here, and it is removed on the next row
      Object.keys(v.last).forEach((name) => {
        if (name in after) return;
        if (v.last[name] !== before[name]) { set[name] = v.last[name]; pendingUnset.push(name); } else unset.push(name);
      });
      Object.keys(before).forEach((name) => { if (!(name in after) && !(name in v.last) && !unset.includes(name)) unset.push(name); });
      const text = out.slice(v.out, end);
      const kind = testLine(info.lines[v.line - 1] || "");
      if (kind && nx) step.test = (kind === "head" ? nx.line === v.line + 1 : nx.line < v.line) ? "true" : "false";
      else if (kind === "head" && !nx) step.test = "false";
      const fnHere = info.fnOf[v.line], fnNext = nx ? info.fnOf[nx.line] : fnHere;
      // the function returns to its caller: the line of the call gets a row for what it stores or displays
      let resume = null;
      if (nx && fnHere && fnNext && fnHere !== fnNext && fnHere !== "main") {
        let call = null;
        for (let j = k - 1; j >= 0; j--) if (info.fnOf[visits[j].line] === fnNext) { call = visits[j].line; break; }
        const mine = (name) => name.endsWith(" (" + fnHere + ")");
        const callerSet = {};
        Object.keys(set).forEach((name) => { if (!mine(name)) { callerSet[name] = set[name]; delete set[name]; } });
        if (call !== null && (Object.keys(callerSet).length || text)) {
          resume = { line: call - first };
          if (Object.keys(callerSet).length) resume.set = callerSet;
          if (text) Object.assign(resume, printOf(text));
        } else Object.assign(set, callerSet);
      }
      if (unset.length) step.unset = unset;
      if (Object.keys(set).length) step.set = set;
      if (text && !resume) Object.assign(step, printOf(text));
      else if (text && resume && !resume.print && resume.print !== "") Object.assign(step, printOf(text));
      steps.push(step);
      if (resume) steps.push(resume);
    }
    if (error) {
      const lastStep = steps[steps.length - 1];
      if (lastStep) { lastStep.print = (lastStep.print ? lastStep.print + "\n" : "") + App.c._message(error); delete lastStep.end; }
    }
    const text = (s) => info.lines[s.line + first - 1] || "";
    const empty = (s) => !s.set && !s.unset && s.print === undefined;
    const label = (s) => /^\s*(case\b.*|default\s*):/.test(text(s));
    // a switch compares its cases from the top: the engine visits each case line until one matches.
    // Only the case that runs keeps its row.
    let scan = false;
    const kept = steps.filter((s, k) => {
      if (/^\s*switch\s*\(/.test(text(s))) { scan = true; return true; }
      const next = steps[k + 1];
      if (scan && label(s) && empty(s) && next && label(next)) return false;
      scan = false;
      // the last line of main, return 0, changes nothing: no row
      return !(empty(s) && /^\s*return 0;\s*$/.test(text(s)) && info.fnOf[s.line + first] === "main");
    });
    const inside = kept.filter((s) => s.line >= 0 && s.line < shown.length);
    return { name: program.name, steps: inside, dropped: steps.length - inside.length, output: out, error, full };
  }
  function printOf(text) {
    return text.endsWith("\n") ? { print: text.slice(0, -1) } : { print: text, end: "" };
  }

  window.cTrace = cTrace;
  /* all programs of a chapter -> one JSON text; also offered as a download */
  window.cTraceAll = async function (topic, download) {
    const programs = await (await fetch("tools/traces/" + topic + ".programs.json?" + Date.now())).json();
    const result = {};
    for (const p of programs) {
      const r = await cTrace(p);
      result[p.name] = { steps: r.steps, output: r.output, error: r.error, dropped: r.dropped };
    }
    const text = JSON.stringify(result);
    if (download !== false) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      a.download = topic + ".steps.json";
      a.click();
    }
    return text;
  };
})();
