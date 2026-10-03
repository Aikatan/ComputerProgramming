/* ============================================================
   scenes-t02.js - scenes and static diagrams of Topic 02
   (Basic programming with Python). The engine and the drawing
   helpers are in scenes.js. Values use the shared colours of the
   site: int blue, float teal, str amber (token classes int, float, str).
   The text of every scene comes from the topic file.
   ============================================================ */
(function () {
  const h = App.h;
  const { sv, g, rect, line, circle, wait, ICON } = App.sceneKit;

  const CW = 14.4;                                   // stage units of one monospace character (24px text)
  const isNum = (t) => /^-?[\d.]+$/.test(t);
  const numCls = (t) => (t.indexOf(".") >= 0 ? "float" : "int");
  const tokW = (t) => t.length * CW + (isNum(t) ? 30 : 6);
  // a code line with the marker ▸ before the current line
  const codeLines = (S, lines, x, y0, dy) => {
    lines.forEach((ln, k) => S.text(App.esc(ln), x, y0 + k * dy, "mono", "l"));
    S.label("mark", "▸", x - 24, y0, { cls: "hot", o: 0 });
  };
  const markAt = (y) => ({ mark: { y, o: 1 } });

  /* ============================================================
     sceneExpr - the evaluation of expressions, step by step. The part
     that is evaluated next is marked; it shrinks into its value, and
     the rest of the expression closes up.
     config: { rows: [[tokens]], steps: [{ row, rule, reduce: [[start, count, value]], note }] }
       start and count refer to the tokens of the row at that moment.
     ============================================================ */
  App.widgets.sceneExpr = function (cfg) {
    const W = 1140, GAP = 16, Y = [78, 192];
    const layout = (toks) => {
      const ws = toks.map((t) => tokW(t.text)), tot = ws.reduce((a, b) => a + b, 0) + GAP * (toks.length - 1);
      let x = 380 + (W - 380 - tot) / 2;
      return toks.map((t, k) => { const c = x + ws[k] / 2; x += ws[k] + GAP; return c; });
    };
    // simulate every reduction first: every token that ever exists becomes a part
    const parts = [], rows = cfg.rows.map((start, ri) => {
      const toks = start.map((text, k) => ({ id: "r" + ri + "t" + k, text }));
      const xs = layout(toks);
      toks.forEach((t, k) => parts.push({ id: t.id, text: t.text, x: xs[k], y: Y[ri], o: 1 }));
      return toks;
    });
    let made = 0;
    const steps = cfg.steps.map((st) => {
      const ri = st.row, toks = rows[ri], y = Y[ri], phases = [wait(0, { ["rule" + ri]: { text: st.rule, cls: "hot" } })];
      (st.reduce || []).forEach(([a, n, value]) => {
        const xs = layout(toks), ids = toks.slice(a, a + n).map((t) => t.id);
        const left = xs[a] - tokW(toks[a].text) / 2, right = xs[a + n - 1] + tokW(toks[a + n - 1].text) / 2, cx = (left + right) / 2;
        const nid = "v" + (made++);
        parts.push({ id: nid, text: value, x: cx, y, o: 0 });
        const hot = {}, gone = {};
        ids.forEach((id) => { hot[id] = { cls: "hot" }; gone[id] = { x: cx, o: 0, s: 0.5 }; });
        phases.push({ set: Object.assign({ ["hl" + ri]: { hx: left - 10, hw: right - left + 20, o: 1 } }, hot), dur: 380 });
        phases.push(wait(320));
        phases.push({ set: Object.assign(gone, { [nid]: { o: 1, s: 1.35 } }), dur: 420 });
        toks.splice(a, n, { id: nid, text: value });
        const xs2 = layout(toks), move = { ["hl" + ri]: { o: 0 }, [nid]: { s: 1 } };
        toks.forEach((t, k) => { move[t.id] = Object.assign(move[t.id] || {}, { x: xs2[k] }); });
        phases.push({ set: move, dur: 420 });
      });
      return { note: st.note, phases };
    });
    return App.widgets.animStepper({
      w: W, h: 262, label: "Expressions that are evaluated one operation at a time",
      build(S) {
        cfg.rows.forEach((r, ri) => {
          S.part("hl" + ri, rect(0, Y[ri] - 30, 0, 60, "sn-hl", 14), { hx: 0, hw: 0, o: 0 }, (n, p) => { n.setAttribute("x", p.hx); n.setAttribute("width", Math.max(0, p.hw)); });
          S.label("rule" + ri, "Start", 24, Y[ri], { anchor: "l", cls: "b" });
        });
        if (cfg.rows.length > 1) S.add(line(24, (Y[0] + Y[1]) / 2, 1116, (Y[0] + Y[1]) / 2, "sn-dash"));
        parts.forEach((p) => {
          if (isNum(p.text)) S.token(p.id, p.text, p.x, p.y, { cls: numCls(p.text), o: p.o });
          else S.label(p.id, App.esc(p.text), p.x, p.y, { cls: "mono b", o: p.o });
        });
      },
      steps,
    });
  };

  /* ============================================================
     sceneDivMod - floor division and remainder. a items are put into
     groups of b: the number of full groups is a // b, the items left
     over are a % b.
     config: { a, b, notes: [4] }
     ============================================================ */
  App.widgets.sceneDivMod = function (cfg) {
    const a = cfg.a, b = cfg.b, q = Math.floor(a / b), r = a % b, notes = cfg.notes;
    const X0 = 1140 / 2 - (a - 1) * 29, DX = 58, BOXW = b * 44 + 24, BY = 175;
    const BX = (gi) => 40 + gi * (BOXW + 26), RX = BX(q);
    const item = (k) => "i" + k;
    const intoGroup = (gi) => { const o = {}; for (let j = 0; j < b; j++) o[item(gi * b + j)] = { x: BX(gi) + 34 + j * 44, y: BY }; o["box" + gi] = { cls: "on" }; return o; };
    const left = () => { const o = {}; for (let j = 0; j < r; j++) o[item(q * b + j)] = { x: RX + 34 + j * 44, y: BY }; return o; };
    return App.widgets.animStepper({
      w: 1140, h: 290, label: "Items that are put into groups: full groups and the items left over",
      build(S) {
        for (let gi = 0; gi < q; gi++) S.part("box" + gi, g("sn-cardg", rect(0, 0, BOXW, 70, "sn-card", 12)), { x: BX(gi), y: BY - 35 });
        S.add(rect(RX, BY - 35, Math.max(BOXW, 150), 70, "sn-boxd", 12));
        for (let k = 0; k < a; k++) S.part(item(k), circle(0, 0, 15, "sn-item"), { x: X0 + k * DX, y: 66, o: 0, s: 0.4 });
        S.label("qt", a + " // " + b, BX(0) + (q * (BOXW + 26) - 26) / 2, 252, { cls: "mono b" });
        S.label("rt", a + " % " + b, RX + Math.max(BOXW, 150) / 2, 252, { cls: "mono b" });
        S.label("check", q + " × " + b + " + " + r + " = " + a, 570, 66, { cls: "mono b good", o: 0 });
      },
      steps: [
        { note: notes[0], phases: Array.from({ length: a }, (_, k) => ({ set: { [item(k)]: { o: 1, s: 1 } }, dur: 45 })) },
        { note: notes[1], phases: Array.from({ length: q }, (_, gi) => [
          { set: intoGroup(gi), dur: 700 },
          { set: { qt: { text: a + " // " + b + " = " + (gi + 1), s: 1.3, cls: "hot" } }, dur: 0 }, { set: { qt: { s: 1 } }, dur: 300 },
        ]).flat() },
        { note: notes[2], phases: [
          { set: left(), dur: 700 },
          { set: { rt: { text: a + " % " + b + " = " + r, s: 1.3, cls: "hot" } }, dur: 0 }, { set: { rt: { s: 1 } }, dur: 300 },
        ] },
        { note: notes[3], phases: [{ set: { check: { o: 1, s: 1.3 } }, dur: 250 }, { set: { check: { s: 1 } }, dur: 300 }] },
      ],
    });
  };

  /* ============================================================
     sceneInput - input() and int(). The user types the digits; input()
     returns them as a str; int() converts the str to an int; the
     assignment stores the int.
     config: { code, prompt, typed, notes: [5] }
     ============================================================ */
  App.widgets.sceneInput = function (cfg) {
    const notes = cfg.notes, typed = cfg.typed, prompt = cfg.prompt, Y = 196;
    const TERM = [180, 84], INP = [510, Y], INT = [735, Y], VAR = [980, Y], KEYS = [100, 236];
    const term = (s, cursor) => App.esc(prompt + s) + (cursor ? '<span class="sn-cursor">▌</span>' : "");
    const keyPhases = typed.split("").flatMap((ch, k) => [
      { set: { key: { x: KEYS[0], y: KEYS[1], o: 0, s: 0.6, text: ch } }, dur: 0 },
      { set: { key: { o: 1, s: 1 } }, dur: 150 },
      { set: { key: { x: TERM[0] + 40, y: TERM[1] } }, dur: 450 },
      { set: { key: { o: 0 }, term: { text: term(typed.slice(0, k + 1), true) } }, dur: 120 },
    ]);
    return App.widgets.animStepper({
      w: 1140, h: 290, label: "A keyboard, the terminal, input(), int() and the variable",
      build(S) {
        S.text(App.esc(cfg.code), 760, 30, "mono b");
        S.add(rect(30, 44, 300, 80, "sn-term", 10));
        S.label("term", term("", false), 50, 84, { cls: "mono", anchor: "l" });
        S.part("kb", ICON.keyboard(), { x: KEYS[0], y: KEYS[1] });
        S.add(line(330, Y, 1080, Y, "sn-wire"));
        [["inp", INP, "input()"], ["cnv", INT, "int()"]].forEach(([id, p, txt]) => {
          S.part(id, g("sn-cardg", rect(-80, -40, 160, 80, "sn-card", 12)), { x: p[0], y: p[1] });
          S.text(txt, p[0], p[1] + 62, "mono b");
        });
        S.part("var", g("sn-cardg", rect(-90, -40, 180, 80, "sn-card", 12)), { x: VAR[0], y: VAR[1] });
        S.text("age", VAR[0], VAR[1] + 62, "mono b");
        S.token("key", "", 0, 0, { cls: "sq", o: 0 });
        S.token("val", "", 0, 0, { o: 0 });
      },
      steps: [
        { note: notes[0], phases: [{ set: { term: { text: term("", true) }, inp: { cls: "on" } }, dur: 300 }] },
        { note: notes[1], phases: keyPhases.concat([
          { set: { key: { x: KEYS[0], y: KEYS[1], o: 0, s: 0.6, text: "Enter" } }, dur: 0 },
          { set: { key: { o: 1, s: 1 } }, dur: 150 },
          { set: { key: { x: TERM[0] + 60, y: TERM[1] } }, dur: 450 },
          { set: { key: { o: 0 }, term: { text: term(typed, false) } }, dur: 150 },
        ]) },
        { note: notes[2], phases: [
          { set: { val: { x: TERM[0] + 40, y: TERM[1], o: 0, s: 0.6, text: "'" + typed + "'", cls: "str" } }, dur: 0 },
          { set: { val: { o: 1, s: 1 } }, dur: 200 },
          { set: { val: { x: INP[0], y: INP[1] } }, via: { val: [[TERM[0] + 40, Y], [INP[0] - 120, Y]] }, dur: 900 },
        ] },
        { note: notes[3], phases: [
          wait(0, { inp: { cls: "" }, cnv: { cls: "on" } }),
          { set: { val: { x: INT[0] } }, dur: 650 },
          { set: { val: { text: typed, cls: "int", s: 1.35 } }, dur: 0 }, { set: { val: { s: 1 } }, dur: 320 },
        ] },
        { note: notes[4], phases: [
          wait(0, { cnv: { cls: "" }, var: { cls: "on" } }),
          { set: { val: { x: VAR[0] } }, dur: 700 },
        ] },
      ],
    });
  };

  /* ============================================================
     sceneAssign - two assignments. The right side is evaluated first,
     then the value is stored under the name. In the second statement
     the name total is replaced by its value.
     config: { lines: [2], a, op1, b, op2, c, notes: [5] }   (total = a op1 b; double = total op2 c)
     ============================================================ */
  App.widgets.sceneAssign = function (cfg) {
    const notes = cfg.notes, Y = 228, L1 = 66, L2 = 112;
    const v1 = String(cfg.v1), v2 = String(cfg.v2);
    const BOX = { total: [720, 160], double: [980, 160] };
    const appear = (ids) => ids.map((id) => ({ set: { [id]: { o: 1, s: 1 } }, dur: 160 }));
    const reduce = (ids, cx, nid) => [
      { set: Object.assign({ hl: { hx: 104, hw: 290, o: 1 } }, ...ids.map((id) => ({ [id]: { cls: "hot" } }))), dur: 380 }, wait(300),
      { set: Object.assign({ [nid]: { o: 1, s: 1.35 } }, ...ids.map((id) => ({ [id]: { x: cx, o: 0, s: 0.5 } }))), dur: 420 },
      { set: { [nid]: { s: 1 }, hl: { o: 0 } }, dur: 300 },
    ];
    return App.widgets.animStepper({
      w: 1140, h: 290, label: "Two assignments: the right side is evaluated, then the value is stored under a name",
      build(S) {
        S.add(rect(20, 30, 470, 120, "sn-term", 12));
        codeLines(S, cfg.lines, 56, L1, L2 - L1);
        S.part("hl", rect(0, Y - 30, 0, 60, "sn-hl", 14), { hx: 0, hw: 0, o: 0 }, (n, p) => { n.setAttribute("x", p.hx); n.setAttribute("width", Math.max(0, p.hw)); });
        S.text("right side", 250, Y + 46, "dim");
        Object.keys(BOX).forEach((nm) => {
          S.part("b_" + nm, g("sn-cardg", rect(-100, -36, 200, 72, "sn-card", 12)), { x: BOX[nm][0], y: BOX[nm][1] });
          S.label("n_" + nm, nm, BOX[nm][0], BOX[nm][1] - 62, { cls: "mono b", o: 0.35 });
        });
        // statement 1: a op1 b
        S.token("e0", String(cfg.a), 180, Y, { cls: numCls(String(cfg.a)), o: 0 });
        S.label("e1", App.esc(cfg.op1), 250, Y, { cls: "mono b", o: 0 });
        S.token("e2", String(cfg.b), 320, Y, { cls: numCls(String(cfg.b)), o: 0 });
        S.token("r1", v1, 250, Y, { cls: numCls(v1), o: 0 });
        // statement 2: total op2 c
        S.label("f0", "total", 170, Y, { cls: "mono b", o: 0 });
        S.label("f1", App.esc(cfg.op2), 250, Y, { cls: "mono b", o: 0 });
        S.token("f2", String(cfg.c), 320, Y, { cls: numCls(String(cfg.c)), o: 0 });
        S.token("cp", v1, 0, 0, { cls: numCls(v1), o: 0 });
        S.token("r2", v2, 250, Y, { cls: numCls(v2), o: 0 });
      },
      steps: [
        { note: notes[0], phases: [wait(0, markAt(L1))].concat(appear(["e0", "e1", "e2"]), reduce(["e0", "e1", "e2"], 250, "r1")) },
        { note: notes[1], phases: [
          { set: { r1: { x: BOX.total[0], y: BOX.total[1] } }, via: { r1: [[250, BOX.total[1] + 60]] }, dur: 900 },
          { set: { b_total: { cls: "on" }, n_total: { o: 1, s: 1.3 } }, dur: 0 }, { set: { n_total: { s: 1 } }, dur: 300 },
        ] },
        { note: notes[2], phases: [wait(0, Object.assign(markAt(L2), { b_total: { cls: "" } }))].concat(appear(["f0", "f1", "f2"]), [
          { set: { cp: { x: BOX.total[0], y: BOX.total[1], o: 0, s: 0.6 } }, dur: 0 },
          { set: { cp: { o: 1, s: 1 }, f0: { cls: "hot" } }, dur: 200 },
          { set: { cp: { x: 180, y: Y } }, via: { cp: [[BOX.total[0], Y]] }, dur: 900 },
          { set: { f0: { o: 0 } }, dur: 200 },
        ]) },
        { note: notes[3], phases: reduce(["cp", "f1", "f2"], 250, "r2") },
        { note: notes[4], phases: [
          { set: { r2: { x: BOX.double[0], y: BOX.double[1] } }, via: { r2: [[250, BOX.double[1] + 60], [BOX.double[0], BOX.double[1] + 60]] }, dur: 1000 },
          { set: { b_double: { cls: "on" }, n_double: { o: 1, s: 1.3 } }, dur: 0 }, { set: { n_double: { s: 1 } }, dur: 300 },
        ] },
      ],
    });
  };

  /* ============================================================
     sceneBinary - decimal to binary by repeated division by 2. Each
     quotient moves down to become the next number; at the end the
     remainders are read from the last to the first.
     A tall stage for a half column. config: { n, notes, rest, minw }
       notes: one per division, and one for the reading.
     ============================================================ */
  App.widgets.sceneBinary = function (cfg) {
    const rows = []; for (let v = cfg.n; v > 0; v = Math.floor(v / 2)) rows.push([v, Math.floor(v / 2), v % 2]);
    const XN = 70, XQ = 250, XR = 420, Y0 = 70, DY = 50, YB = Y0 + rows.length * DY + 18;
    const bits = rows.map((r) => r[2]).reverse(), XB = (k) => 280 + (k - (bits.length - 1) / 2) * 46;
    return App.widgets.animStepper({
      w: 560, h: YB + 34, rest: cfg.rest, minw: cfg.minw, label: "Repeated division by 2 with the remainders, read from the last to the first",
      build(S) {
        S.text("number", XN, 22, "dim"); S.text("quotient", XQ, 22, "dim"); S.text("remainder", XR, 22, "dim");
        rows.forEach((r, k) => {
          const y = Y0 + k * DY;
          S.token("n" + k, String(r[0]), XN, y, { cls: "int", o: k ? 0 : 1 });
          S.label("d" + k, "÷ 2 =", (XN + XQ) / 2 + 6, y, { cls: "mono dim", o: 0 });
          S.token("q" + k, String(r[1]), XQ, y, { cls: "int", o: 0 });
          S.token("r" + k, String(r[2]), XR, y, { cls: "sq", state: "ghost", o: 0 });
          if (k) S.token("c" + k, String(r[0]), XQ, y - DY, { cls: "int", o: 0 });   // the quotient above, copied down
        });
        S.part("up", g("sn-uparrow", line(486, Y0 + (rows.length - 1) * DY + 10, 486, Y0 - 10), sv("polygon", { points: "478," + (Y0 - 6) + " 494," + (Y0 - 6) + " 486," + (Y0 - 22) })), { o: 0 });
        S.label("bl", "binary", 120, YB, { cls: "b", o: 0 });
        bits.forEach((b, k) => S.token("b" + k, String(b), XB(k), YB, { cls: "sq", state: "info", o: 0 }));
      },
      steps: rows.map((r, k) => {
        const y = Y0 + k * DY, ph = [];
        if (k) ph.push({ set: { ["c" + k]: { o: 1 } }, dur: 120 }, { set: { ["c" + k]: { x: XN, y } }, via: { ["c" + k]: [[XQ, y]] }, dur: 650 }, wait(0, { ["c" + k]: { o: 0 }, ["n" + k]: { o: 1 } }));
        ph.push({ set: { ["d" + k]: { o: 1 } }, dur: 250 });
        ph.push({ set: { ["q" + k]: { o: 1, s: 1.3 }, ["r" + k]: { o: 1, s: 1.3 } }, dur: 250 }, { set: { ["q" + k]: { s: 1 }, ["r" + k]: { s: 1 } }, dur: 250 });
        return { note: cfg.notes[k], phases: ph };
      }).concat([{ note: cfg.notes[rows.length], phases: [{ set: { up: { o: 1 }, bl: { o: 1 } }, dur: 350 }].concat(
        bits.map((b, k) => ({ set: { ["r" + (rows.length - 1 - k)]: { cls: "info" }, ["b" + k]: { o: 1 } }, dur: 380 }))) }]),
    });
  };

  /* ============================================================
     sceneSepEnd - print() with sep and end. The output line is built
     piece by piece: the values, sep between them, end after the last
     value; the next print() continues the same line.
     config: { lines: [2], line1: [[kind, text, x]], line2: [[kind, text, x]], notes: [4] }
       kind: "v" (a value) or "s" (sep or end text); x: the column of the text in the code line.
     ============================================================ */
  App.widgets.sceneSepEnd = function (cfg) {
    const notes = cfg.notes, L1 = 52, L2 = 98, OY = 196, X0 = 70, DX = 50, CX = 56;
    const all = cfg.line1.map((p) => p.concat([L1])).concat(cfg.line2.map((p) => p.concat([L2])));
    const fly = (k) => {
      const [kind, text, col, ly] = all[k], id = "o" + k, from = [CX + (col + 0.5) * CW, ly];
      return [
        { set: { [id]: { x: from[0], y: from[1], o: 0, s: 0.6 } }, dur: 0 },
        { set: { [id]: { o: 1, s: 1 } }, dur: 160 },
        { set: { [id]: { x: X0 + k * DX, y: OY } }, dur: kind === "v" ? 700 : 600 },
      ];
    };
    const range = (a, b) => Array.from({ length: b - a }, (_, k) => a + k);
    const n1 = cfg.line1.length, nv = cfg.line1.filter((p) => p[0] === "v").length;
    return App.widgets.animStepper({
      w: 1140, h: 262, label: "Two print statements and the output line that they write",
      build(S) {
        S.add(rect(20, 22, 1100, 106, "sn-term", 12));
        codeLines(S, cfg.lines, CX, L1, L2 - L1);
        S.text("output", 36, 147, "dim", "l");
        S.add(rect(30, OY - 30, 1080, 60, "sn-term", 10));
        all.forEach(([kind, text], k) => {
          if (kind === "v") S.token("o" + k, App.esc(text), 0, 0, { cls: "str", o: 0 });
          else S.label("o" + k, App.esc(text), 0, 0, { cls: "mono hot", o: 0 });
        });
        S.label("nl", "↵", X0 + all.length * DX, OY, { cls: "mono dim", o: 0 });
      },
      steps: [
        { note: notes[0], phases: [wait(0, markAt(L1))].concat(fly(0)) },
        { note: notes[1], phases: range(1, 2 * nv - 1).flatMap(fly) },
        { note: notes[2], phases: range(2 * nv - 1, n1).flatMap(fly) },
        { note: notes[3], phases: [wait(0, markAt(L2))].concat(range(n1, all.length).flatMap(fly), [{ set: { nl: { o: 1 } }, dur: 300 }]) },
      ],
    });
  };

  /* ============================================================
     sceneImmutable - a str cannot be changed. The assignment to one
     character fails; a new string is built from a new first letter and
     a slice, and the name is moved to the new string.
     config: { lines: [3], word, first, notes: [4] }
     ============================================================ */
  App.widgets.sceneImmutable = function (cfg) {
    const notes = cfg.notes, w = cfg.word, nw = cfg.first + w.slice(1);
    const X = (k) => 690 + k * 62, YO = 96, YN = 230, L = [60, 110, 160];
    return App.widgets.animStepper({
      w: 1140, h: 290, label: "A name, the old string and a new string",
      build(S) {
        S.add(rect(20, 30, 470, 160, "sn-term", 12));
        codeLines(S, cfg.lines, 56, L[0], L[1] - L[0]);
        S.label("tag", "word", 560, YO, { cls: "mono b sn-tag", o: 0 });
        S.part("arrow", line(606, YO, 650, YO, "sn-arrowln"), { ty: YO, o: 0 }, (n, p) => { n.setAttribute("x2", 652); n.setAttribute("y2", p.ty); n.setAttribute("y1", YO); });
        for (let k = 0; k < w.length; k++) {
          S.part("oc" + k, g("sn-cellg", rect(-28, -28, 56, 56, "sn-cell", 8)), { x: X(k), y: YO, o: 0 });
          S.label("ot" + k, w[k], X(k), YO, { cls: "mono b", o: 0 });
          S.part("nc" + k, g("sn-cellg", rect(-28, -28, 56, 56, "sn-cell", 8)), { x: X(k), y: YN, o: 0 });
          S.label("nt" + k, nw[k], X(k), YN, { cls: "mono b", o: 0 });
        }
        S.token("try", App.esc(cfg.first), 0, 0, { cls: "str", o: 0 });
        S.label("err", "TypeError", X(w.length - 1) + 110, YO, { cls: "bad", o: 0 });
      },
      steps: [
        { note: notes[0], phases: [wait(0, markAt(L[0]))].concat(
          Array.from({ length: w.length }, (_, k) => ({ set: { ["oc" + k]: { o: 1 }, ["ot" + k]: { o: 1 } }, dur: 90 })),
          [{ set: { tag: { o: 1 }, arrow: { o: 1 } }, dur: 300 }]) },
        { note: notes[1], phases: [
          wait(0, Object.assign(markAt(L[1]), { oc0: { cls: "hot" } })),
          { set: { try: { x: 560, y: L[1] + 60, o: 0, s: 0.6 } }, dur: 0 },
          { set: { try: { o: 1, s: 1 } }, dur: 200 },
          { set: { try: { x: X(0) - 6, y: YO + 46 } }, dur: 600 },
          { set: { try: { x: X(0) + 6, cls: "err" } }, dur: 70 }, { set: { try: { x: X(0) - 6 } }, dur: 70 },
          { set: { try: { x: X(0) + 6 } }, dur: 70 }, { set: { try: { x: X(0) } }, dur: 70 },
          { set: { err: { o: 1, s: 1.3 } }, dur: 250 }, { set: { err: { s: 1 }, try: { o: 0 } }, dur: 350 },
        ] },
        { note: notes[2], phases: [wait(0, Object.assign(markAt(L[2]), { oc0: { cls: "" }, err: { o: 0 } }))].concat(
          Array.from({ length: w.length - 1 }, (_, j) => j + 1).map((k) => ({ set: { ["oc" + k]: { cls: "on" } }, dur: 120 })),
          Array.from({ length: w.length - 1 }, (_, j) => j + 1).map((k) => ({ set: { ["nc" + k]: { o: 1 }, ["nt" + k]: { o: 1 } }, dur: 150 })),
          [{ set: { nc0: { o: 1, cls: "on" }, nt0: { o: 1, s: 1.3 } }, dur: 250 }, { set: { nt0: { s: 1 } }, dur: 250 }]) },
        { note: notes[3], phases: [
          wait(0, Object.fromEntries(Array.from({ length: w.length }, (_, k) => ["oc" + k, { cls: "" }]))),
          { set: { arrow: { ty: YN } }, dur: 700 },
          { set: Object.assign({ nc0: { cls: "" } }, ...Array.from({ length: w.length }, (_, k) => ({ ["oc" + k]: { o: 0.35 }, ["ot" + k]: { o: 0.35 } }))), dur: 500 },
        ] },
      ],
    });
  };

  /* ============================================================
     static diagrams
     ============================================================ */

  /* byteRows - the size of each type as a row of bytes.
     config: { rows: [{ type, n, size, range, cls: "str" | "int" | "float" }] } */
  App.widgets.byteRows = function (cfg) {
    return h("div", { class: "widget br" }, ...cfg.rows.flatMap((r) => [
      h("code", { class: "br-type" }, r.type),
      h("div", { class: "br-cells", style: "--br-n:8" }, ...Array.from({ length: r.n }, () => h("span", { class: "br-cell " + (r.cls || "int") }))),
      h("b", { class: "br-size" }, r.size),
      h("span", { class: "br-range", html: r.range }),
    ]));
  };

  /* errorTimeline - when each kind of error is found.
     config: { stages: [4 html], cards: [{ col (1-3), title, text, cls }] } */
  App.widgets.errorTimeline = function (cfg) {
    const cards = [h("div")];
    for (let c = 1; c < cfg.stages.length; c++) {
      const card = cfg.cards.find((k) => k.col === c);
      cards.push(card ? h("div", { class: "et-card " + card.cls }, h("b", null, card.title), h("span", { html: card.text })) : h("div"));
    }
    return h("div", { class: "widget et" },
      ...cfg.stages.map((s, k) => h("div", { class: "et-stage" + (k < cfg.stages.length - 1 ? " et-next" : ""), html: s })), ...cards);
  };

  /* codeMarks - a read-only listing with numbered marks at the end of some lines.
     config: { caption, lang, lines: [text], marks: { lineIndex: n } } */
  App.widgets.codeMarks = function (cfg) {
    return h("div", { class: "codeblock cm" },
      h("div", { class: "codeblock-head" }, h("span", { class: "lang" }, cfg.lang || "text"), cfg.caption ? h("span", null, " · " + cfg.caption) : null),
      h("pre", null, ...cfg.lines.map((ln, k) => h("div", { class: "cm-line" }, ln,
        cfg.marks[k] != null ? h("span", { class: "vsm-mark" }, String(cfg.marks[k])) : null))));
  };
})();
