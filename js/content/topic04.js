/* ===================== Topic 04 - Flowcharts and Pseudocode =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: symbols and sequence -> decisions -> loops -> pseudocode -> practice.
   Python level: t02-t03 material (if, while, for, range, break). No lists, dicts, functions, or try.
   Flowcharts use the "flowchart" widget: shapes on a grid (col, row), drawn at 1:1 scale.
   ================================================================================= */
(function () {
  /* ---------- block helpers ---------- */
  const T = (html) => ({ type: "text", html });
  const L = (items, title, ordered) => ({ type: "list", items, title, ordered });
  const N = (html, title, variant) => ({ type: "note", html, title, variant });
  const TB = (head, rows, caption, cls) => ({ type: "table", head, rows, caption, cls });
  const CODE = (code, output, caption, lang) => ({ type: "code", code, output, caption, lang });
  const PSEUDO = (code, caption) => CODE(code, null, caption || "pseudocode", "text");
  const EX = (code, caption, annot, inputs) => ({ type: "example", code, caption, annot, inputs });
  const RUN = (code, title, inputs) => ({ type: "livecode", code, title: title || "Program", inputs });
  const PQ = (prompt, expected, starter, inputs, hint) => ({ type: "practiceq", prompt, expected, starter, inputs, hint });
  const W = (name, config) => ({ type: "widget", name, config });
  const QZ = (items) => ({ type: "quiz", items });
  const NEXT = (html) => N(html, "Next lesson");
  const IPO = (rows) => TB(["Step", "Result"], rows);
  const FLOW = (f) => W("flowchart", f);
  const STATIC = (f) => W("flowchart", Object.assign({}, f, { trace: null }));
  const CHART = (f) => W("flowchart", Object.assign({}, f, { trace: null, code: null }));
  const FTT = (f, rows, blank) => W("traceTable", Object.assign({ flow: f }, rows ? { rows } : {}, blank ? { blank: true, given: 1 } : {}));

  /* ---------- flowchart shapes ---------- */
  const ST = (id, text, col, row) => ({ id, type: "terminator", text, col, row });
  const PR = (id, text, col, row) => ({ id, type: "process", text, col, row });
  const IO = (id, text, col, row) => ({ id, type: "io", text, col, row });
  const DE = (id, text, col, row) => ({ id, type: "decision", text, col, row });
  const PP = (id, text, col, row) => ({ id, type: "predefined", text, col, row });
  const CN = (id, text, col, row) => ({ id, type: "connector", text, col, row });
  const E = (from, to, opt) => Object.assign({ from, to }, opt || {});

  /* ---------- symbol icons for the tables ---------- */
  const ICON = {
    terminator: '<rect x="4" y="6" width="72" height="28" rx="14" class="fc-box"/>',
    process: '<rect x="4" y="6" width="72" height="28" rx="3" class="fc-box"/>',
    io: '<polygon points="16,6 76,6 64,34 4,34" class="fc-box"/>',
    decision: '<polygon points="40,2 78,20 40,38 2,20" class="fc-box"/>',
    predefined: '<rect x="4" y="6" width="72" height="28" class="fc-box"/><line x1="12" y1="6" x2="12" y2="34" class="fc-box"/><line x1="68" y1="6" x2="68" y2="34" class="fc-box"/>',
    connector: '<circle cx="40" cy="20" r="15" class="fc-box"/>',
    offpage: '<polygon points="24,4 56,4 56,26 40,36 24,26" class="fc-box"/>',
    document: '<path d="M4,6 H76 V30 Q58,22 40,30 T4,30 Z" class="fc-box"/>',
    flowline: '<line x1="6" y1="20" x2="66" y2="20" class="fc-line"/><path d="M64,14 L76,20 L64,26 Z" class="fc-head"/>',
  };
  const icon = (k) => '<svg class="fc-icon" width="80" height="40" viewBox="0 0 80 40">' + ICON[k] + "</svg>";

  /* ================= flowcharts ================= */
  const F_seq = {
    nodes: [ST("s", "START", 0, 0), PR("a", "x = 1", 0, 1), PR("b", "x = x + 2", 0, 2), IO("d", "DISPLAY x", 0, 3), ST("e", "END", 0, 4)],
    edges: [E("s", "a"), E("a", "b"), E("b", "d"), E("d", "e")],
    code: ["x = 1", "x = x + 2", "print(x)"], map: { a: [0], b: [1], d: [2] },
    trace: [
      { node: "s", note: "START: the algorithm begins." },
      { node: "a", note: "Process: 1 is stored in x.", set: { x: "1" } },
      { node: "b", note: "Process: x + 2 → 3. 3 is stored in x.", set: { x: "3" } },
      { node: "d", note: "Output: the value of x is displayed.", print: "3" },
      { node: "e", note: "END: the algorithm ends." },
    ],
  };
  const F_area = {
    nodes: [ST("s", "START", 0, 0), IO("i1", "INPUT length", 0, 1), IO("i2", "INPUT width", 0, 2), PR("p", "area = length * width", 0, 3), IO("d", "DISPLAY area", 0, 4), ST("e", "END", 0, 5)],
    edges: [E("s", "i1"), E("i1", "i2"), E("i2", "p"), E("p", "d"), E("d", "e")],
    code: ["length = float(input())", "width = float(input())", "area = length * width", "print(area)"],
  };
  const F_conn = {
    cols: [0, 330],
    nodes: [ST("s", "START", 0, 0), IO("i1", "INPUT x", 0, 1), PR("p1", "x = x + 2", 0, 2), CN("c1", "A", 0, 3),
      CN("c2", "A", 1, 0), IO("i2", "INPUT y", 1, 1), PR("p2", "z = x + y", 1, 2), IO("d", "DISPLAY z", 1, 3), ST("e", "END", 1, 4)],
    edges: [E("s", "i1"), E("i1", "p1"), E("p1", "c1"), E("c2", "i2"), E("i2", "p2"), E("p2", "d"), E("d", "e")],
  };
  const F_ex1 = {
    nodes: [ST("s", "START", 0, 0), PR("a", "a = 5", 0, 1), PR("b", "b = a * 3", 0, 2), PR("c", "a = b - 4", 0, 3), IO("d", "DISPLAY a, b", 0, 4), ST("e", "END", 0, 5)],
    edges: [E("s", "a"), E("a", "b"), E("b", "c"), E("c", "d"), E("d", "e")],
  };
  const F_circle = {
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT r", 0, 1), PR("p", "area = 3.14 * r * r", 0, 2), IO("d", "DISPLAY area", 0, 3), ST("e", "END", 0, 4)],
    edges: [E("s", "i"), E("i", "p"), E("p", "d"), E("d", "e")],
  };
  const F_temp = {
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT c", 0, 1), PR("p", "f = c * 9 / 5 + 32", 0, 2), IO("d", "DISPLAY f", 0, 3), ST("e", "END", 0, 4)],
    edges: [E("s", "i"), E("i", "p"), E("p", "d"), E("d", "e")],
  };

  const F_if = {
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT x", 0, 1), DE("q", "x > 10 ?", 0, 2), IO("d", "DISPLAY x", 0, 3), ST("e", "END", 0, 4)],
    edges: [E("s", "i"), E("i", "q"), E("q", "d", { label: "True" }), E("d", "e"), E("q", "e", { port: "right", lane: "right", label: "False" })],
    code: ["x = int(input())", "if x > 10:", "    print(x)"], map: { i: [0], q: [1], d: [2] },
    trace: [
      { node: "s", note: "START. Test value: the user enters 12." },
      { node: "i", note: "Input: 12 is stored in x.", set: { x: "12" } },
      { node: "q", note: "12 > 10 is True: follow the True arrow." },
      { node: "d", note: "Output: x is displayed.", print: "12" },
      { node: "e", note: "END." },
    ],
  };
  const F_ifelse = {
    cols: [0, -170, 170],
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT n", 0, 1), DE("q", "n % 2 == 0 ?", 0, 2), IO("y", 'DISPLAY "even"', 1, 3), IO("n", 'DISPLAY "odd"', 2, 3), ST("e", "END", 0, 4)],
    edges: [E("s", "i"), E("i", "q"), E("q", "y", { port: "left", label: "True" }), E("q", "n", { port: "right", label: "False" }), E("y", "e"), E("n", "e")],
    code: ["n = int(input())", "if n % 2 == 0:", '    print("even")', "else:", '    print("odd")'],
  };
  const F_alt = {
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT x", 0, 1), DE("q", "x <= 10 ?", 0, 2), IO("d", "DISPLAY x", 0, 3), ST("e", "END", 0, 4)],
    edges: [E("s", "i"), E("i", "q"), E("q", "d", { label: "False" }), E("d", "e"), E("q", "e", { port: "right", lane: "right", label: "True" })],
    code: ["x = int(input())", "if x <= 10:", "    pass", "else:", "    print(x)"],
  };
  const F_nested = {
    cols: [0, 330],
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT x", 0, 1), DE("q1", "x > 15 ?", 0, 2), IO("h", 'DISPLAY "Hi-value"', 1, 2), DE("q2", "x > 10 ?", 0, 3), IO("d", "DISPLAY x", 0, 4), ST("e", "END", 0, 5)],
    edges: [E("s", "i"), E("i", "q1"), E("q1", "h", { port: "right", label: "True" }), E("q1", "q2", { label: "False" }), E("q2", "d", { label: "True" }), E("d", "e"),
      E("q2", "e", { port: "left", lane: "left", label: "False" }), E("h", "e")],
    code: ["x = int(input())", "if x > 15:", '    print("Hi-value")', "elif x > 10:", "    print(x)"],
  };
  const F_bad = {
    cols: [0, 330],
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT x", 0, 1), DE("q1", "x > 10 ?", 0, 2), IO("h", 'DISPLAY "Hi-value"', 1, 2), DE("q2", "x > 15 ?", 0, 3), IO("d", "DISPLAY x", 0, 4), ST("e", "END", 0, 5)],
    edges: [E("s", "i"), E("i", "q1"), E("q1", "h", { port: "right", label: "True" }), E("q1", "q2", { label: "False" }), E("q2", "d", { label: "True" }), E("d", "e"),
      E("q2", "e", { port: "left", lane: "left", label: "False" }), E("h", "e")],
    code: ["x = int(input())", "if x > 10:", '    print("Hi-value")', "elif x > 15:", "    print(x)   # never runs"],
  };
  const F_hot = {
    cols: [0, 300],
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT t", 0, 1), DE("q1", "t > 30 ?", 0, 2), IO("h", 'DISPLAY "HOT"', 1, 2), DE("q2", "t > 20 ?", 0, 3), IO("w", 'DISPLAY "WARM"', 1, 3), IO("c", 'DISPLAY "COLD"', 0, 4), ST("e", "END", 0, 5)],
    edges: [E("s", "i"), E("i", "q1"), E("q1", "h", { port: "right", label: "True" }), E("q1", "q2", { label: "False" }), E("q2", "w", { port: "right", label: "True" }),
      E("q2", "c", { label: "False" }), E("c", "e"), E("h", "e", { lane: "right", laneIndex: 1 }), E("w", "e", { lane: "right" })],
  };
  const F_pos = {
    cols: [0, -170, 170],
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT n", 0, 1), DE("q", "n > 0 ?", 0, 2), IO("y", 'DISPLAY "positive"', 1, 3), IO("n", 'DISPLAY "not positive"', 2, 3), ST("e", "END", 0, 4)],
    edges: [E("s", "i"), E("i", "q"), E("q", "y", { port: "left", label: "True" }), E("q", "n", { port: "right", label: "False" }), E("y", "e"), E("n", "e")],
  };
  const F_batt = {
    cols: [0, -170, 170],
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT level", 0, 1), DE("q", "level < 20 ?", 0, 2), IO("y", 'DISPLAY "Charge now"', 1, 3), IO("n", 'DISPLAY "OK"', 2, 3), ST("e", "END", 0, 4)],
    edges: [E("s", "i"), E("i", "q"), E("q", "y", { port: "left", label: "True" }), E("q", "n", { port: "right", label: "False" }), E("y", "e"), E("n", "e")],
  };

  const F_while = {
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT x", 0, 1), DE("q", "x > 10 ?", 0, 2), IO("d", "DISPLAY x", 0, 3), ST("e", "END", 0, 4)],
    edges: [E("s", "i"), E("i", "q"), E("q", "d", { label: "True" }), E("d", "e"), E("q", "i", { port: "left", lane: "left", label: "False" })],
    code: ["x = int(input())", "while not (x > 10):", "    x = int(input())", "print(x)"], map: { i: [0, 2], q: [1], d: [3] },
    trace: [
      { node: "s", note: "START. Test values: the user enters 5, then 12." },
      { node: "i", note: "Input: 5 is stored in x.", set: { x: "5" } },
      { node: "q", note: "5 > 10 is False: the arrow goes back to INPUT." },
      { node: "i", note: "Input again: 12 is stored in x.", set: { x: "12" } },
      { node: "q", note: "12 > 10 is True: the loop ends." },
      { node: "d", note: "Output: x is displayed.", print: "12" },
      { node: "e", note: "END." },
    ],
  };
  const F_count = {
    nodes: [ST("s", "START", 0, 0), PR("a", "x = 1", 0, 1), DE("q", "x < 4 ?", 0, 2), PR("b", "x = x + 1", 0, 3), IO("d", "DISPLAY x", 0, 4), ST("e", "END", 0, 5)],
    edges: [E("s", "a"), E("a", "q"), E("q", "b", { label: "True" }), E("b", "q", { lane: "left" }), E("q", "d", { port: "right", lane: "right", label: "False" }), E("d", "e")],
    code: ["x = 1", "while x < 4:", "    x = x + 1", "print(x)"], map: { a: [0], q: [1], b: [2], d: [3] },
    trace: [
      { node: "s", note: "START." },
      { node: "a", note: "Initialize the counter: x = 1.", set: { x: "1" } },
      { node: "q", note: "1 < 4 is True: into the loop." },
      { node: "b", note: "Update: x becomes 2. Back to the decision.", set: { x: "2" } },
      { node: "q", note: "2 < 4 is True." },
      { node: "b", note: "x becomes 3.", set: { x: "3" } },
      { node: "q", note: "3 < 4 is True." },
      { node: "b", note: "x becomes 4.", set: { x: "4" } },
      { node: "q", note: "4 < 4 is False: leave the loop." },
      { node: "d", note: "Output: x is displayed.", print: "4" },
      { node: "e", note: "END." },
    ],
  };
  const F_step2 = {
    nodes: [ST("s", "START", 0, 0), PR("a", "x = 1", 0, 1), DE("q", "x < 10 ?", 0, 2), PR("b", "x = x + 2", 0, 3), IO("d", "DISPLAY x", 0, 4), ST("e", "END", 0, 5)],
    edges: [E("s", "a"), E("a", "q"), E("q", "b", { label: "True" }), E("b", "q", { lane: "left" }), E("q", "d", { port: "right", lane: "right", label: "False" }), E("d", "e")],
    code: ["x = 1", "while x < 10:", "    x = x + 2", "print(x)"],
  };
  const F_inf = {
    cols: [0, 260],
    nodes: [ST("s", "START", 0, 0), PR("a", "x = 1", 0, 1), DE("q", "x < 10 ?", 0, 2), PR("b", "x = x + 2", 0, 3), PR("r", "x = 1", 1, 3), IO("d", "DISPLAY x", 0, 4), ST("e", "END", 0, 5)],
    edges: [E("s", "a"), E("a", "q"), E("q", "b", { label: "True" }), E("b", "r"), E("r", "q", { lane: "right", laneIndex: 1 }), E("q", "d", { port: "left", lane: "left", label: "False" }), E("d", "e")],
    code: ["x = 1", "while x < 10:", "    x = x + 2", "    x = 1      # resets x", "print(x)     # never reached"],
  };
  const F_break = {
    cols: [0, 290],
    nodes: [ST("s", "START", 0, 0), PR("a", "n = 51", 0, 1), DE("q1", "n < 100 ?", 0, 2), DE("q2", "n % 7 == 0 ?", 0, 3), IO("d", "DISPLAY n", 1, 3), PR("b", "n = n + 1", 0, 4), ST("e", "END", 1, 4)],
    edges: [E("s", "a"), E("a", "q1"), E("q1", "q2", { label: "True" }), E("q2", "d", { port: "right", label: "True" }), E("q2", "b", { label: "False" }), E("b", "q1", { lane: "left" }),
      E("d", "e"), E("q1", "e", { port: "right", lane: "right", label: "False" })],
    code: ["n = 51", "while n < 100:", "    if n % 7 == 0:", "        print(n)", "        break", "    n = n + 1"],
  };
  const F_exLoop = {
    cols: [0, 290],
    nodes: [ST("s", "START", 0, 0), PR("a", "total = 0, k = 1", 0, 1), DE("q", "k <= 2 ?", 0, 2), PR("b", "total = total + k", 0, 3), PR("c", "k = k + 1", 0, 4), IO("d", "DISPLAY total", 1, 3), ST("e", "END", 1, 4)],
    edges: [E("s", "a"), E("a", "q"), E("q", "b", { label: "True" }), E("b", "c"), E("c", "q", { lane: "left" }), E("q", "d", { port: "right", label: "False" }), E("d", "e")],
    trace: [
      { node: "a", note: "total = 0, k = 1", set: { total: "0", k: "1" } },
      { node: "q", note: "1 <= 2 is True" },
      { node: "b", note: "total = 0 + 1", set: { total: "1" } },
      { node: "c", note: "k = 2", set: { k: "2" } },
      { node: "q", note: "2 <= 2 is True" },
      { node: "b", note: "total = 1 + 2", set: { total: "3" } },
      { node: "c", note: "k = 3", set: { k: "3" } },
      { node: "q", note: "3 <= 2 is False" },
      { node: "d", note: "display total", print: "3" },
    ],
  };
  const F_exam = {
    cols: [0, -210, 210, 290],
    nodes: [ST("s", "START", 0, 0), PR("a", "a = 2, b = 11", 0, 1), DE("q1", "a < b ?", 0, 2), ST("e", "END", 3, 2), DE("q2", "a % 2 == 0 ?", 0, 3),
      PR("t", "a = a + 3", 1, 4), PR("f", "b = b - 2, a = a + 1", 2, 4), IO("d", "DISPLAY a, b", 0, 5)],
    edges: [E("s", "a"), E("a", "q1"), E("q1", "e", { port: "right", label: "False" }), E("q1", "q2", { label: "True" }), E("q2", "t", { port: "left", label: "True" }),
      E("q2", "f", { port: "right", label: "False" }), E("t", "d"), E("f", "d"), E("d", "q1", { lane: "left" })],
  };
  const F_sum = {
    cols: [0, 300],
    nodes: [ST("s", "START", 0, 0), IO("i", "INPUT n", 0, 1), PR("a", "total = 0, i = 1", 0, 2), DE("q", "i <= n ?", 0, 3), PR("b", "total = total + i", 0, 4), PR("c", "i = i + 1", 0, 5),
      IO("d", "DISPLAY total", 1, 4), ST("e", "END", 1, 5)],
    edges: [E("s", "i"), E("i", "a"), E("a", "q"), E("q", "b", { label: "True" }), E("b", "c"), E("c", "q", { lane: "left" }), E("q", "d", { port: "right", label: "False" }), E("d", "e")],
  };

  App.registerTopic({
    id: "t04",
    title: "Flowcharts and Pseudocode",
    short: "Flowchart & Pseudocode",
    blurb: "Designing algorithms with flowcharts and pseudocode, and converting them to Python and back.",
    intro: "This chapter covers the two design tools used before coding: flowcharts and pseudocode. Each lesson uses only what the lessons before it have explained:<br>symbols and sequence → decisions → loops → pseudocode → practice.",
    lessons: [
      /* =============================== 1. SYMBOLS AND SEQUENCE =============================== */
      {
        id: "flowchart-symbols",
        title: "Flowcharts and their symbols",
        sub: "What a flowchart is, the standard symbols, drawing rules, and a sequence of steps.",
        slides: "04:4–7, 16–17",
        keywords: "algorithm flowchart symbol terminator process input output decision connector predefined sequence",
        deck: [
          { kind: "overview", title: "Flowcharts and their symbols", blocks: [
            T("An <b>algorithm</b> is a finite sequence of steps that solves a problem. A <b>flowchart</b> draws an algorithm as connected symbols. Pseudocode (Lesson 4) writes it as structured text. Both are used to design a program before it is coded."),
            L(["Flowcharts", "Flowchart symbols", "Rules for drawing flowcharts", "Sequence: steps in order", "Connectors and predefined processes"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Flowcharts", title: "What a flowchart shows", blocks: [
            L([
              "A flowchart shows the steps of an algorithm and the order in which they run.",
              "A <b>program flowchart</b> shows the logic of one program. A <b>system flowchart</b> shows how the parts of a system (programs, files, devices) work together.",
              "This course uses program flowcharts.",
              "Each symbol has a fixed meaning, so that any engineer can read the chart.",
            ]),
          ] },
          { kind: "concept", part: "Flowchart symbols", title: "The main symbols", blocks: [
            TB(["Symbol", "Name", "Meaning", "Python"], [
              [icon("terminator"), "Terminator", "START or END of the algorithm", "(none)"],
              [icon("process"), "Process", "a calculation or an assignment", "<code>x = x + 2</code>"],
              [icon("io"), "Input / Output", "read a value or display a value", "<code>input()</code>, <code>print()</code>"],
              [icon("decision"), "Decision", "a condition with a True exit and a False exit", "<code>if</code>, <code>while</code>"],
            ]),
          ] },
          { kind: "concept", part: "Flowchart symbols", title: "More symbols", blocks: [
            TB(["Symbol", "Name", "Meaning"], [
              [icon("flowline"), "Flowline", "the order of the steps"],
              [icon("connector"), "On-page connector", "joins two parts of a chart on the same page"],
              [icon("offpage"), "Off-page connector", "continues the chart on another page"],
              [icon("predefined"), "Predefined process", "a named sub-process with its own flowchart"],
              [icon("document"), "Document", "a printed report or a file"],
            ]),
          ] },
          { kind: "concept", part: "Rules for drawing flowcharts", title: "Rules for drawing flowcharts", blocks: [
            L([
              "One START and one END terminator.",
              "The flow goes from top to bottom. Arrows show the order of the steps.",
              "A process or input/output symbol has one arrow in and one arrow out.",
              "A decision has one arrow in and two arrows out, labelled True and False.",
              "Keep the text in a symbol short: one statement or one condition.",
            ]),
          ] },
          { kind: "concept", part: "Sequence: steps in order", title: "A sequence of steps", blocks: [
            L([
              "In a <b>sequence</b>, the steps run one after another, along the arrows.",
              "Each process or input/output symbol becomes one Python statement.",
              "The order of the symbols is the order of the statements.",
            ]),
          ] },
          { kind: "code", part: "Sequence: steps in order", title: "First example: execution step by step", blocks: [FLOW(F_seq)] },
          { kind: "trace", part: "Sequence: steps in order", title: "Trace table", blocks: [
            FTT(F_seq),
            T("The value of x after each shape is the value that the Python program has after the matching line."),
          ] },
          { kind: "code", part: "Sequence: steps in order", title: "Example: area of a rectangle", blocks: [STATIC(F_area)] },
          { kind: "concept", part: "Connectors and predefined processes", title: "Connectors and predefined processes", blocks: [
            L([
              "A <b>connector</b> is a circle with a letter. It joins two parts of a flowchart that are drawn apart. Both ends use the same letter.",
              "An <b>off-page connector</b> continues the chart on another page.",
              "A <b>predefined process</b> is a named sub-process that has its own flowchart. In Python it is a function (Topic 05).",
            ]),
          ] },
          { kind: "visual", part: "Connectors and predefined processes", title: "Example: a chart in two parts", blocks: [
            CHART(F_conn),
            T("Connector A at the bottom of the left part continues at connector A at the top of the right part."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A flowchart draws an algorithm as symbols connected by arrows.",
              "Terminator: START / END. Process: a calculation. Parallelogram: input or output. Diamond: a decision.",
              "The flow goes from top to bottom. A decision has a True exit and a False exit.",
              "In a sequence, each symbol becomes one Python statement, in the same order.",
              "Connectors join the parts of a large chart.",
            ]),
            NEXT("<b>Decisions in flowcharts</b>. A diamond with two exits is the flowchart form of if and else."),
          ] },
          { kind: "exercise", title: "Name the symbols", blocks: [
            T("Write the name of each symbol, and the Python statement that it can become, on paper. Check with the symbol tables of this lesson."),
            TB(["Symbol", "Name", "Python"], [[icon("io"), "", ""], [icon("decision"), "", ""], [icon("process"), "", ""], [icon("terminator"), "", ""]]),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [CHART(F_ex1)],
            [T("Trace the flowchart on paper and write its output. Then run the matching Python program and compare."), RUN("a = 5\nb = a * 3\na = b - 4\nprint(a, b)")],
          ] },
          { kind: "problem", title: "Problem: the area of a circle", blocks: [
            T("The flowchart computes the area of a circle from its radius r, with π ≈ 3.14. The next exercise converts it into Python."),
            CHART(F_circle),
          ] },
          { kind: "exercise", title: "Write the program for the flowchart", blocks: [
            PQ("Write the Python program for the flowchart on the previous slide. Use the prompt <code>Radius: </code> and read r as a float. Test input: 2.",
              "Radius: 2\n12.56", "# Write your program here\n", ["2"], 'r = float(input("Radius: "))'),
          ] },
          { kind: "exercise", title: "Draw a flowchart", blocks: [
            T("Draw the flowchart of this program on paper. Then compare it with the model answer on the next slide."),
            CODE("c = float(input())\nf = c * 9 / 5 + 32\nprint(f)", null, "program"),
          ] },
          { kind: "visual", title: "Model answer", blocks: [CHART(F_temp)] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which symbol represents a decision?", choices: ["Rectangle", "Rounded rectangle", "Diamond", "Parallelogram"], answer: 2, explain: "A diamond holds a condition and has a True exit and a False exit." },
            { q: "Which symbol is used for `print(x)`?", choices: ["Terminator", "Process", "Input / Output (parallelogram)", "Connector"], answer: 2, explain: "Displaying a value is output, drawn as a parallelogram." },
          ])] },
        ],
      },

      /* =============================== 2. DECISIONS =============================== */
      {
        id: "flowchart-decisions",
        title: "Decisions in flowcharts",
        sub: "The decision symbol, if and else, several conditions, and unreachable conditions.",
        slides: "04:8–11",
        keywords: "decision diamond if else elif nested condition flowchart unreachable",
        deck: [
          { kind: "overview", title: "Decisions in flowcharts", blocks: [
            T("A <b>decision</b> symbol holds a condition. The flow continues along the True arrow or the False arrow. It is the flowchart form of if."),
            L(["The decision symbol and if", "if and else", "The same logic, written two ways", "Several conditions", "Unreachable conditions"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The decision symbol and if", title: "The decision symbol", blocks: [
            L([
              "A decision holds one condition, such as <code>x &gt; 10</code>. It has two exits: True and False.",
              "A decision with steps only on one exit is an if statement. The steps on the True exit are the indented block.",
              "Both paths meet again at the next common step.",
            ]),
          ] },
          { kind: "code", part: "The decision symbol and if", title: "First example: execution step by step", blocks: [FLOW(F_if)] },
          { kind: "trace", part: "The decision symbol and if", title: "Trace table", blocks: [
            FTT(F_if),
            T("With the input 7, <code>7 &gt; 10</code> is False: the False arrow goes directly to END, and nothing is displayed."),
          ] },
          { kind: "concept", part: "if and else", title: "Two branches: if and else", blocks: [
            L([
              "When both exits have their own steps, the flowchart has two branches.",
              "In Python this is <code>if … else</code>. Exactly one branch runs.",
              "The two branches join again before the next step.",
            ]),
          ] },
          { kind: "code", part: "if and else", title: "Example: even or odd", blocks: [STATIC(F_ifelse)] },
          { kind: "concept", part: "The same logic, written two ways", title: "Opposite conditions", blocks: [
            T("A condition can be written in the opposite form, with the True and False exits exchanged. The result is the same."),
            TB(["Condition", "Same result as"], [
              ["<code>A &gt;= B</code>", "<code>not (A &lt; B)</code>"],
              ["<code>A == B</code>", "<code>not (A != B)</code>"],
              ["<code>A &gt; B</code>", "<code>not (A &lt;= B)</code>"],
            ], null, "center"),
          ] },
          { kind: "code", part: "The same logic, written two ways", title: "Example: the condition x <= 10", blocks: [
            STATIC(F_alt),
            T("This chart displays x only when <code>x &gt; 10</code>, like the first example. The True branch is empty, so the Python code uses <code>pass</code>."),
          ] },
          { kind: "concept", part: "Several conditions", title: "A decision after a decision", blocks: [
            L([
              "A second decision can follow an exit of the first decision.",
              "A second decision on the False exit is <code>elif</code> in Python.",
              "The conditions are checked in order. The first True condition decides the path.",
            ]),
          ] },
          { kind: "code", part: "Several conditions", title: "Example: two decisions", blocks: [STATIC(F_nested)] },
          { kind: "concept", part: "Several conditions", title: "All paths of the example", blocks: [
            TB(["x", "x &gt; 15", "x &gt; 10", "Output"], [
              ["20", "True", "not checked", "Hi-value"],
              ["12", "False", "True", "12"],
              ["5", "False", "False", "(nothing)"],
            ], null, "center"),
          ] },
          { kind: "concept", part: "Unreachable conditions", title: "Unreachable conditions", blocks: [
            T("A condition that can never be True on its path is an <b>unreachable condition</b>. Its branch never runs."),
            L([
              "Example: <code>x &gt; 10</code> is checked first. On its False exit, x is at most 10, so <code>x &gt; 15</code> can never be True.",
              "Correction: check the stricter condition (<code>x &gt; 15</code>) first.",
            ]),
          ] },
          { kind: "visual", part: "Unreachable conditions", title: "Example: a wrong order", blocks: [STATIC(F_bad)] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A decision has one condition and two exits: True and False.",
              "Steps on one exit: <code>if</code>. Steps on both exits: <code>if … else</code>.",
              "An opposite condition with exchanged exits gives the same result.",
              "A decision on the False exit of another decision is <code>elif</code>.",
              "Check the stricter condition first, or the other branch is unreachable.",
            ]),
            NEXT("<b>Loops in flowcharts</b>. An arrow that goes back to a decision repeats steps."),
          ] },
          { kind: "exercise", title: "Determine the output for t = 35, 25, 12", blocks: [CHART(F_hot)] },
          { kind: "exercise", title: "Check your answers", cols: [
            [T("This program follows the flowchart. Run it three times, and enter 35, 25, and 12.")],
            [RUN('t = int(input("t: "))\nif t > 30:\n    print("HOT")\nelif t > 20:\n    print("WARM")\nelse:\n    print("COLD")')],
          ] },
          { kind: "exercise", title: "Draw a flowchart", blocks: [
            T("Draw the flowchart of this program on paper. Then compare it with the model answer on the next slide."),
            CODE('n = int(input())\nif n > 0:\n    print("positive")\nelse:\n    print("not positive")', null, "program"),
          ] },
          { kind: "visual", title: "Model answer", blocks: [CHART(F_pos)] },
          { kind: "problem", title: "Problem: battery warning", blocks: [
            T("The flowchart checks a battery level. The next exercise converts it into Python."),
            CHART(F_batt),
          ] },
          { kind: "exercise", title: "Write the program for the flowchart", blocks: [
            PQ("Write the Python program for the flowchart on the previous slide. Use the prompt <code>Level: </code>. Test input: 15.",
              "Level: 15\nCharge now", "# Write your program here\n", ["15"], 'if level < 20: print("Charge now") else: print("OK")'),
          ] },
          { kind: "exercise", title: "Correct the unreachable condition", blocks: [
            PQ("For x = 70 the program should display high, but the high branch is unreachable. Correct the order of the conditions. Test input: 70.",
              "x: 70\nhigh", 'x = int(input("x: "))\nif x > 10:\n    print("medium")\nelif x > 50:\n    print("high")\nelse:\n    print("low")\n', ["70"], "Check x > 50 first."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "How many exits does a decision symbol have?", choices: ["1", "2", "3", "Any number"], answer: 1, explain: "A decision has a True exit and a False exit." },
            { q: "`A >= B` gives the same result as…", choices: ["not (A < B)", "not (A > B)", "A < B", "A == B"], answer: 0, explain: "A is at least B exactly when A is not less than B." },
          ])] },
        ],
      },

      /* =============================== 3. LOOPS =============================== */
      {
        id: "flowchart-loops",
        title: "Loops in flowcharts",
        sub: "Loops with a condition, counting loops, infinite loops, and break.",
        slides: "04:12–15",
        keywords: "loop flowchart while for counter infinite break back arrow",
        deck: [
          { kind: "overview", title: "Loops in flowcharts", blocks: [
            T("A loop in a flowchart is an arrow that goes back to an earlier symbol. A decision decides whether the loop repeats or ends."),
            L(["A loop with a condition", "A counting loop", "Infinite loops", "Leaving a loop early"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "A loop with a condition", title: "A decision with an arrow back", blocks: [
            L([
              "The decision is checked before each repetition.",
              "One exit leads into the loop. The last arrow of the loop goes back to the decision, or to a step before it.",
              "The other exit leaves the loop. In Python this is a while loop.",
            ]),
          ] },
          { kind: "code", part: "A loop with a condition", title: "First example: execution step by step", blocks: [FLOW(F_while)] },
          { kind: "trace", part: "A loop with a condition", title: "Trace table", blocks: [
            FTT(F_while),
            T("The input step runs again after every False result, so the program asks until the value is above 10."),
          ] },
          { kind: "concept", part: "A counting loop", title: "A counting loop", blocks: [
            L([
              "A counting loop has three steps: initialize the counter, test it in the decision, update it in the loop.",
              "<code>for x in range(1, 4)</code> uses the values 1, 2, 3, the same values as the chart.",
              "After the loop, the while version has x = 4, the value that ended the loop. After the for version, x is 3, the last value used.",
            ]),
          ] },
          { kind: "code", part: "A counting loop", title: "Example: execution step by step", blocks: [FLOW(F_count)] },
          { kind: "trace", part: "A counting loop", title: "Trace table (part 1 of 2)", blocks: [FTT(F_count, [0, 6])] },
          { kind: "trace", part: "A counting loop", title: "Trace table (part 2 of 2)", blocks: [FTT(F_count, [6, 10])] },
          { kind: "code", part: "A counting loop", title: "Example: a step of 2", blocks: [
            STATIC(F_step2),
            T("x takes 1, 3, 5, 7, 9, and then 11. 11 &lt; 10 is False, so 11 is displayed."),
          ] },
          { kind: "concept", part: "Infinite loops", title: "Infinite loops", blocks: [
            L([
              "If no step in the loop moves the value toward the exit, the decision always gives the same result, and the loop never ends.",
              "Example: <code>x = 1</code> inside the loop resets x in every iteration.",
              "Check every loop: its steps must change the value that the decision tests, toward the exit.",
            ]),
          ] },
          { kind: "visual", part: "Infinite loops", title: "Example: an infinite loop (do not run)", blocks: [STATIC(F_inf)] },
          { kind: "concept", part: "Leaving a loop early", title: "break in a flowchart", blocks: [
            L([
              "<code>break</code> is an arrow from inside the loop directly to the first step after the loop.",
              "The loop then has two exits: the normal exit of the decision, and the break exit.",
              "In the example, the search stops at the first multiple of 7.",
            ]),
          ] },
          { kind: "code", part: "Leaving a loop early", title: "Example: the first multiple of 7 from 51", blocks: [STATIC(F_break)] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A loop is an arrow back to a decision (or to a step before it).",
              "A counting loop: initialize, test, update.",
              "The loop must change the tested value toward the exit, or it never ends.",
              "break is an arrow from inside the loop to the first step after it.",
            ]),
            NEXT("<b>Pseudocode</b>. The same algorithms written as structured text."),
          ] },
          { kind: "exercise", title: "Trace the flowchart", blocks: [
            T("Follow this flowchart step by step. The next exercise records each step in a trace table."),
            CHART(F_exLoop),
          ] },
          { kind: "exercise", title: "Complete the trace table (part 1 of 2)", blocks: [
            T("Complete the table on paper. The first row is done."),
            W("traceTable", { flow: F_exLoop, blank: true, given: 1, rows: [0, 5] }),
          ] },
          { kind: "exercise", title: "Complete the trace table (part 2 of 2)", blocks: [
            T("Continue the table. The next exercise checks it."),
            W("traceTable", { flow: F_exLoop, blank: true, given: 0, rows: [5, 9] }),
          ] },
          { kind: "exercise", title: "Check your trace", cols: [
            [T("This program follows the flowchart. Run it with <b>Step Run</b> and compare with your table.")],
            [RUN("total = 0\nk = 1\nwhile k <= 2:\n    total = total + k\n    k = k + 1\nprint(total)")],
          ] },
          { kind: "exercise", title: "Draw a flowchart", blocks: [
            T("Draw the flowchart of this program on paper. Then compare it with the model answer on the next slide."),
            CODE("a = 2\nb = 11\nwhile a < b:\n    if a % 2 == 0:\n        a = a + 3\n    else:\n        b = b - 2\n        a = a + 1\n    print(a, b)", null, "program"),
          ] },
          { kind: "visual", title: "Model answer", blocks: [CHART(F_exam)] },
          { kind: "exercise", title: "Determine the output of the model flowchart", blocks: [
            RUN("a = 2\nb = 11\nwhile a < b:\n    if a % 2 == 0:\n        a = a + 3\n    else:\n        b = b - 2\n        a = a + 1\n    print(a, b)", "Trace the model flowchart on paper first. Then run this program."),
          ] },
          { kind: "problem", title: "Problem: the sum 1 to n", blocks: [
            T("The flowchart adds the numbers from 1 to n. The next exercise converts it into Python."),
            CHART(F_sum),
          ] },
          { kind: "exercise", title: "Write the program for the flowchart", blocks: [
            PQ("Write the Python program for the flowchart on the previous slide, with a while loop. Use the prompt <code>n: </code>. Test input: 5.",
              "n: 5\n15", "# Write your program here\n", ["5"], "while i <= n: total = total + i; i = i + 1"),
          ] },
          { kind: "exercise", title: "Modify the loop", blocks: [
            PQ("The program displays 1 to 10. Change the update, so that it displays 1, 4, 7, and 10.",
              "1\n4\n7\n10", "x = 1\nwhile x <= 10:\n    print(x)\n    x = x + 1\n", null, "x = x + 3"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "In a flowchart, a loop is shown by…", choices: ["a second START", "an arrow back to a decision", "a connector", "a document symbol"], answer: 1, explain: "The arrow back makes the steps repeat." },
            { q: "A loop never ends when…", choices: ["it uses a decision", "no step changes the tested value toward the exit", "it has two exits", "it uses break"], answer: 1, explain: "The decision then always gives the same result." },
          ])] },
        ],
      },

      /* =============================== 4. PSEUDOCODE =============================== */
      {
        id: "pseudocode",
        title: "Pseudocode",
        sub: "Structured plain language for algorithms, and its conversion to Python.",
        slides: "04:19–22",
        keywords: "pseudocode keywords input set display if else while for design algorithm",
        deck: [
          { kind: "overview", title: "Pseudocode", blocks: [
            T("<b>Pseudocode</b> describes an algorithm in structured plain language. It has no strict syntax, but it uses the same structures as a program: sequence, decisions, and loops."),
            L(["Characteristics of pseudocode", "Keywords", "Decisions in pseudocode", "Loops in pseudocode", "From problem to pseudocode to Python"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Characteristics of pseudocode", title: "Characteristics of pseudocode", blocks: [
            TB(["Characteristic", "Meaning"], [
              ["Simple", "plain language that people can read"],
              ["Language-independent", "not bound to the syntax of Python or any other language"],
              ["Structured", "the same structures as code: sequence, IF, WHILE, FOR, with indentation"],
            ]),
            T("Good pseudocode is easy to read and easy to convert into code."),
          ] },
          { kind: "concept", part: "Keywords", title: "Common keywords", blocks: [
            TB(["Pseudocode", "Meaning", "Python"], [
              ["<code>START</code> / <code>END</code>", "the beginning and the end", "(none)"],
              ["<code>INPUT x</code>", "read a value", "<code>x = int(input())</code>"],
              ["<code>SET x TO 1</code>", "assign a value", "<code>x = 1</code>"],
              ["<code>DISPLAY x</code>", "show a value", "<code>print(x)</code>"],
              ["<code>IF … ELSE … END IF</code>", "a decision", "<code>if … else:</code>"],
              ["<code>WHILE … END WHILE</code>", "a loop with a condition", "<code>while …:</code>"],
            ]),
          ] },
          { kind: "code", part: "Keywords", title: "First example: pseudocode and Python", cols: [
            [TB(["Pseudocode", "Python"], [
              ["<code>INPUT length</code>", "<code>length = float(input())</code>"],
              ["<code>INPUT width</code>", "<code>width = float(input())</code>"],
              ["<code>SET area TO length × width</code>", "<code>area = length * width</code>"],
              ["<code>DISPLAY area</code>", "<code>print(area)</code>"],
            ])],
            [T("Each pseudocode line becomes one Python line. Test input: 4 and 2.5."), RUN("length = float(input())\nwidth = float(input())\narea = length * width\nprint(area)", "Program", ["4", "2.5"])],
          ] },
          { kind: "concept", part: "Decisions in pseudocode", title: "IF … ELSE … END IF", blocks: [
            PSEUDO("IF condition THEN\n    steps\nELSE IF condition THEN\n    steps\nELSE\n    steps\nEND IF", "structure"),
            L(["Indentation shows which steps belong to each branch.", "<code>ELSE IF</code> is <code>elif</code> in Python. ELSE IF and ELSE are optional."]),
          ] },
          { kind: "code", part: "Decisions in pseudocode", title: "Example: even or odd", blocks: [
            TB(["Pseudocode", "Python"], [
              ["<code>INPUT number</code>", "<code>number = int(input())</code>"],
              ["<code>IF number modulo 2 equals 0 THEN</code>", "<code>if number % 2 == 0:</code>"],
              ["<code>&nbsp;&nbsp;&nbsp;&nbsp;DISPLAY \"Number is even\"</code>", "<code>&nbsp;&nbsp;&nbsp;&nbsp;print(\"Number is even\")</code>"],
              ["<code>ELSE</code>", "<code>else:</code>"],
              ["<code>&nbsp;&nbsp;&nbsp;&nbsp;DISPLAY \"Number is odd\"</code>", "<code>&nbsp;&nbsp;&nbsp;&nbsp;print(\"Number is odd\")</code>"],
              ["<code>END IF</code>", "(the end of the indented block)"],
            ]),
          ] },
          { kind: "concept", part: "Loops in pseudocode", title: "WHILE and FOR", blocks: [
            PSEUDO("WHILE condition\n    steps\nEND WHILE\n\nFOR i FROM 1 TO n\n    steps\nEND FOR", "structures"),
            L(["WHILE repeats while the condition is True.", "FOR i FROM 1 TO n uses i = 1, 2, …, n. In Python: <code>for i in range(1, n + 1)</code>."]),
          ] },
          { kind: "code", part: "Loops in pseudocode", title: "Example: WHILE", cols: [
            [TB(["Pseudocode", "Python"], [
              ["<code>SET x TO 1</code>", "<code>x = 1</code>"],
              ["<code>WHILE x is less than or equal to 5</code>", "<code>while x &lt;= 5:</code>"],
              ["<code>&nbsp;&nbsp;&nbsp;&nbsp;DISPLAY x</code>", "<code>&nbsp;&nbsp;&nbsp;&nbsp;print(x)</code>"],
              ["<code>&nbsp;&nbsp;&nbsp;&nbsp;INCREMENT x BY 1</code>", "<code>&nbsp;&nbsp;&nbsp;&nbsp;x = x + 1</code>"],
              ["<code>END WHILE</code>", ""],
            ])],
            [RUN("x = 1\nwhile x <= 5:\n    print(x)\n    x = x + 1")],
          ] },
          { kind: "code", part: "Loops in pseudocode", title: "Example: FOR", cols: [
            [TB(["Pseudocode", "Python"], [
              ["<code>INPUT n</code>", "<code>n = int(input(\"n: \"))</code>"],
              ["<code>SET total TO 0</code>", "<code>total = 0</code>"],
              ["<code>FOR i FROM 1 TO n</code>", "<code>for i in range(1, n + 1):</code>"],
              ["<code>&nbsp;&nbsp;&nbsp;&nbsp;SET total TO total + i</code>", "<code>&nbsp;&nbsp;&nbsp;&nbsp;total = total + i</code>"],
              ["<code>END FOR</code>", ""],
              ["<code>DISPLAY total</code>", "<code>print(total)</code>"],
            ])],
            [RUN('n = int(input("n: "))\ntotal = 0\nfor i in range(1, n + 1):\n    total = total + i\nprint(total)', "Program (test input: 4)", ["4"])],
          ] },
          { kind: "concept", part: "From problem to pseudocode to Python", title: "Easy to read and easy to code", blocks: [
            T("Pseudocode for a person can be informal. Pseudocode for a programmer uses the program structures, so that each line becomes code."),
          ] },
          { kind: "code", part: "From problem to pseudocode to Python", title: "Example: checking a lamp", cols: [
            [PSEUDO("Check if the lamp is working.\nIf yes, stop.\nIf no, check if it is plugged in.\nIf not, plug it in and stop.\nIf yes, check the bulb.\nIf it is burned out, replace it.\nOtherwise, repair the lamp.", "easy to read")],
            [PSEUDO("IF lamp is working THEN\n    END\nELSE IF lamp is not plugged in THEN\n    Plug in lamp\nELSE IF bulb is burned out THEN\n    Replace bulb\nELSE\n    Repair lamp\nEND IF", "easy to code")],
          ] },
          { kind: "concept", part: "From problem to pseudocode to Python", title: "From a problem to a program", blocks: [
            L([
              "Analyse the problem: input, output, and processing.",
              "Write the pseudocode with the structures that the processing needs.",
              "Check the pseudocode by tracing it with test values.",
              "Convert each line into Python, then run the program with the same test values.",
            ], null, true),
          ] },
          { kind: "problem", part: "From problem to pseudocode to Python", title: "Problem: a prime number", blocks: [
            T("Read an integer n greater than 1. Display Prime if n has no divisor from 2 to n − 1, otherwise Not Prime."),
            IPO([["Input", "n (int)"], ["Output", "Prime or Not Prime"], ["Processing", "test every i from 2 to n − 1: is n % i == 0?"], ["Repetition", "FOR i FROM 2 TO n − 1"]]),
          ] },
          { kind: "code", part: "From problem to pseudocode to Python", title: "The pseudocode", blocks: [
            PSEUDO("INPUT n\nSET is_prime TO True\nFOR i FROM 2 TO n - 1\n    IF n modulo i equals 0 THEN\n        SET is_prime TO False\n    END IF\nEND FOR\nIF is_prime THEN DISPLAY \"Prime\"\nELSE DISPLAY \"Not Prime\""),
            T("<code>is_prime</code> records whether a divisor was found."),
          ] },
          { kind: "code", part: "From problem to pseudocode to Python", title: "The Python program", blocks: [
            RUN('n = int(input("n: "))\nis_prime = True\nfor i in range(2, n):\n    if n % i == 0:\n        is_prime = False\nif is_prime:\n    print("Prime")\nelse:\n    print("Not Prime")', "Program (test input: 13)", ["13"]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Pseudocode is structured plain language, independent of any programming language.",
              "Keywords: INPUT, SET, DISPLAY, IF … END IF, WHILE … END WHILE, FOR … END FOR.",
              "Indentation shows the steps inside a decision or a loop.",
              "Design order: analyse the problem, write pseudocode, trace it, convert it to Python.",
            ]),
            NEXT("<b>Chapter practice</b>. Complete problems: design with a flowchart or pseudocode, then write the program."),
          ] },
          { kind: "problem", title: "Problem: power check", blocks: [
            T("The next exercise converts this pseudocode into Python."),
            PSEUDO("INPUT voltage\nINPUT current\nSET power TO voltage × current\nIF power > 100 THEN\n    DISPLAY \"Overload\"\nELSE\n    DISPLAY power\nEND IF"),
          ] },
          { kind: "exercise", title: "Write the program for the pseudocode", blocks: [
            PQ("Write the Python program for the pseudocode on the previous slide. Use the prompts <code>Voltage: </code> and <code>Current: </code> and read floats. Test input: 12 and 10.",
              "Voltage: 12\nCurrent: 10\nOverload", "# Write your program here\n", ["12", "10"], "if power > 100:"),
          ] },
          { kind: "exercise", title: "Write pseudocode", blocks: [
            T("Write the pseudocode for this program on paper. Then compare it with the model answer on the next slide."),
            CODE("total = 0\nfor i in range(1, 6):\n    if i % 2 == 1:\n        total = total + i\nprint(total)", null, "program"),
          ] },
          { kind: "visual", title: "Model answer", blocks: [
            PSEUDO("START\nSET total TO 0\nFOR i FROM 1 TO 5\n    IF i modulo 2 equals 1 THEN\n        SET total TO total + i\n    END IF\nEND FOR\nDISPLAY total\nEND"),
          ] },
          { kind: "exercise", title: "Design and write: sum of even numbers", blocks: [
            PQ("First write the pseudocode as comments. Then write the program: read n and display the sum of the even numbers from 1 to n. Use the prompt <code>n: </code>. Test input: 10.",
              "n: 10\n30", "# Pseudocode:\n\n", ["10"], "for i in range(1, n + 1): if i % 2 == 0: total = total + i"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Pseudocode is bound to the syntax of one programming language.", choices: ["True", "False"], answer: 1, explain: "Pseudocode is language-independent plain language." },
            { q: "`FOR i FROM 1 TO n` in Python is…", choices: ["for i in range(n)", "for i in range(1, n)", "for i in range(1, n + 1)", "while i < n"], answer: 2, explain: "range stops before its stop value, so the stop value is n + 1." },
          ])] },
        ],
      },

      /* =============================== 5. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Design with a flowchart or pseudocode, then write and test the program.",
        slides: "04:24–26",
        keywords: "practice rectangle even odd average sum maximum factorial design",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Solve every problem in the same order:"),
            L([
              "Identify the input, the output, and the processing.",
              "Draw the flowchart, or write the pseudocode, on paper.",
              "Trace the design with the test input.",
              "Write the Python program and check it against the target output.",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: area of a rectangle", blocks: [
            T("Read the length and the width of a rectangle, and display its area."),
            IPO([["Input", "length, width (float)"], ["Output", "the area"], ["Processing", "area = length × width"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Use the prompts <code>Length: </code> and <code>Width: </code>. Test input: 4 and 2.5.", "Length: 4\nWidth: 2.5\nArea = 10.0", "# Write your program here\n", ["4", "2.5"], 'print("Area =", length * width)'),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: even or odd", blocks: [
            T("Read an integer, and display even or odd."),
            IPO([["Input", "an integer"], ["Output", "even or odd"], ["Decision", "number % 2 == 0"]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("Use the prompt <code>Number: </code>. Test input: 7.", "Number: 7\nodd", "# Write your program here\n", ["7"], 'if number % 2 == 0: print("even") else: print("odd")'),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: average of three subjects", blocks: [
            T("Read the scores of subjects A, B, and C. Display the average, rounded to 2 decimal places, and ผ่าน if the average is at least 50, otherwise ไม่ผ่าน."),
            IPO([["Input", "three scores (float)"], ["Output", "the average, then ผ่าน or ไม่ผ่าน"], ["Processing", "(A + B + C) ÷ 3"], ["Decision", "average &gt;= 50"]]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Use the prompts <code>A: </code>, <code>B: </code>, <code>C: </code>. Test input: 45, 60, 52.", "A: 45\nB: 60\nC: 52\nAverage = 52.33\nผ่าน", "# Write your program here\n", ["45", "60", "52"], 'print("Average =", round(average, 2))'),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: sum from 1 to N", blocks: [
            T("Read N, and display the sum 1 + 2 + … + N."),
            IPO([["Input", "N (int)"], ["Output", "the sum"], ["Repetition", "FOR i FROM 1 TO N: add i to the total"]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", blocks: [
            PQ("Use the prompt <code>N: </code>. Test input: 10.", "N: 10\nSum = 55", "# Write your program here\n", ["10"], "for i in range(1, n + 1):"),
          ] },
          { kind: "problem", part: "Problem 5", title: "Problem 5: the largest of five numbers", blocks: [
            T("Read 5 integers, and display the largest one. Keep the largest value so far in a variable."),
            IPO([["Input", "5 integers"], ["Output", "the largest"], ["Processing", "the first number is the largest so far; each next number that is larger replaces it"], ["Repetition", "for the remaining 4 numbers"]]),
          ] },
          { kind: "exercise", part: "Problem 5", title: "Problem 5: write the program", blocks: [
            PQ("Use the prompt <code>Number: </code>. Test input: 7, 3, 12, 9, 5.", "Number: 7\nNumber: 3\nNumber: 12\nNumber: 9\nNumber: 5\nMax = 12", "# Write your program here\n", ["7", "3", "12", "9", "5"], "largest = first number; for k in range(4): if x > largest: largest = x"),
          ] },
          { kind: "problem", part: "Problem 6", title: "Problem 6: factorial", blocks: [
            T("Read a positive integer n, and display n! = 1 × 2 × … × n. The course practice uses a predefined process (a function) for this calculation; functions come in Topic 05, so this program uses a loop."),
            IPO([["Input", "n (int)"], ["Output", "n!"], ["Repetition", "result = result × i for i from 1 to n, starting with result = 1"]]),
          ] },
          { kind: "exercise", part: "Problem 6", title: "Problem 6: write the program", blocks: [
            PQ("Use the prompt <code>n: </code> and display the result as in the target. Test input: 5.", "n: 5\n5! = 120", "# Write your program here\n", ["5"], 'print(str(n) + "! =", result)'),
          ] },
          { kind: "summary", title: "Chapter summary", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1. Symbols", "Terminator, process, input/output, decision; the flow goes from top to bottom."],
              ["2. Decisions", "A diamond with True and False exits: if, if … else, elif."],
              ["3. Loops", "An arrow back to a decision. The loop must move toward its exit."],
              ["4. Pseudocode", "INPUT, SET, DISPLAY, IF, WHILE, FOR, with indentation."],
            ]),
            N("<b>Topic 05: Functions and modules</b>. A predefined process becomes a function: a named block of code with its own inputs and result.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
