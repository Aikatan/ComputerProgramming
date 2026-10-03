/* ============================================================
   scenes-t01.js - scenes and static diagrams of Topic 01
   (Computer Operation and Architecture). The engine and the drawing
   helpers are in scenes.js. The text of every scene comes from the
   topic file (notes, names, captions).
   ============================================================ */
(function () {
  const h = App.h;
  const { sv, g, rect, line, circle, path, fly, pop, wait, chips, ICON } = App.sceneKit;

  /* ============================================================
     sceneCycle - the information processing cycle. One value travels
     Input -> Processing -> Storage -> Output: it enters the CPU as data
     and leaves it as information, a copy stays in storage, and the
     monitor shows it.
     config: { raw, info, stages: [{ name, device, note }] x 4 }
     ============================================================ */
  App.widgets.sceneCycle = function (cfg) {
    const st = cfg.stages, raw = cfg.raw, info = cfg.info;
    const X = [150, 430, 710, 990], CY = 128, RAIL = 286, icons = ["sensor", "cpu", "store", "monitor"];
    return App.widgets.animStepper({
      title: cfg.title, w: 1140, h: 330, label: "The information processing cycle: input, processing, storage, output",
      build(S) {
        S.add(line(60, RAIL, 1080, RAIL, "sn-rail"));
        S.part("fill", line(60, RAIL, 60, RAIL, "sn-railfill"), { len: 0 }, (node, p) => node.setAttribute("x2", 60 + p.len));
        X.forEach((x, k) => {
          if (k) S.part("a" + k, g("sn-chev", path("M -9 -14 L 9 0 L -9 14")), { x: x - 140, y: CY - 10 });
          S.part("c" + k, g("sn-cardg", rect(-110, -110, 220, 216, "sn-card", 16)), { x, y: CY });
          S.part("i" + k, ICON[icons[k]](), { x, y: CY - 4 });
          S.text(st[k].name, x, 44, "b");
          S.text(st[k].device, x, 208, "dim");
          S.add(circle(x, RAIL, 8, "sn-node"));
        });
        S.token("ghost", raw, X[0], RAIL, { cls: "ghost", o: 0 });
        S.token("copy", info, X[2], RAIL, { cls: "info", o: 0 });
        S.token("tok", raw, X[0], CY, { cls: "raw", o: 0, s: 0.4 });
      },
      steps: [
        { note: st[0].note, phases: [
          { set: { c0: { cls: "on" }, tok: { o: 1, s: 1 } }, dur: 350 },
          { set: { tok: { y: RAIL }, fill: { len: X[0] - 60 } }, dur: 700 },
        ] },
        { note: st[1].note, phases: [
          { set: { c0: { cls: "" }, ghost: { o: 1 }, a1: { cls: "on" }, tok: { x: X[1] }, fill: { len: X[1] - 60 } }, dur: 1000 },
          { set: { c1: { cls: "on" }, tok: { y: CY, s: 0.9 } }, dur: 500 },
          { set: { i1: { s: 1.18 } }, dur: 260 },
          { set: { i1: { s: 1 }, tok: { text: info, cls: "info" } }, dur: 260 },
          { set: { tok: { y: RAIL, s: 1 } }, dur: 500 },
        ] },
        { note: st[2].note, phases: [
          { set: { c1: { cls: "" }, a2: { cls: "on" }, tok: { x: X[2] }, fill: { len: X[2] - 60 } }, dur: 1000 },
          { set: { c2: { cls: "on" }, copy: { o: 1 } }, dur: 200 },
          { set: { copy: { y: CY + 2, s: 0.82 } }, dur: 700 },
        ] },
        { note: st[3].note, phases: [
          { set: { c2: { cls: "" }, a3: { cls: "on" }, tok: { x: X[3] }, fill: { len: X[3] - 60 } }, dur: 1000 },
          { set: { c3: { cls: "on" }, tok: { y: CY - 12, s: 0.9 } }, dur: 700 },
        ] },
      ],
    });
  };

  /* ============================================================
     sceneDatapath - a short assembly program through the instruction
     cycle. The memory holds the instructions at addresses 1, 2, ...;
     the CPU holds PC, IR, the registers R1 and R2, and the ALU.
     Instructions: "LOAD Rn, value" and "ADD Ra, Rb" (Ra = Ra + Rb).
     config: { code: [lines], notes: [...] }
       notes, in the order of the steps: the start; for each LOAD: fetch,
       then decode-execute-store; for each ADD: fetch, decode, execute,
       store; the end.
     ============================================================ */
  App.widgets.sceneDatapath = function (cfg) {
    const code = cfg.code, notes = cfg.notes.slice();
    const STAGES = ["Fetch", "Decode", "Execute", "Store"];
    const rowY = (k) => 84 + k * 52;
    const PC = [565, 128], IR = [643, 190], REG = { R1: [901, 124], R2: [1038, 124] };
    const val = { R1: null, R2: null };
    const stage = (name) => ({ stage: { text: chips(STAGES, name) } });
    const rowsOff = () => { const o = {}; code.forEach((c, k) => { o["row" + k] = { cls: "" }; }); return o; };
    const steps = [{ note: notes.shift(), phases: pop("pc", "1") }];
    code.forEach((ins, k) => {
      const m = /^(LOAD|ADD)\s+(R\d),\s*(\S+)$/.exec(ins);
      if (!m) throw new Error("sceneDatapath: unknown instruction " + ins);
      // fetch: the address goes to the memory, the instruction comes back, the PC increases
      steps.push({ note: notes.shift(), phases: [
        wait(0, Object.assign(rowsOff(), stage("Fetch"), { cu: { cls: "on" }, regs: { cls: "" }, alu: { cls: "" }, op: { text: "" }, r1: { cls: "" }, r2: { cls: "" } })),
      ].concat(
        fly("addr", PC, [318, rowY(k)], { text: String(k + 1), via: [[450, 136], [340, 136]], dur: 800 }),
        [wait(0, { ["row" + k]: { cls: "on" } })],
        fly("ins", [196, rowY(k)], IR, { text: ins, via: [[330, 136], [450, 136]], dur: 1100 }),
        pop("ir", ins), pop("pc", String(k + 2))) });
      if (m[1] === "LOAD") {
        const r = m[2], v = m[3], id = r.toLowerCase();
        val[r] = Number(v);
        steps.push({ note: notes.shift(), phases: [
          wait(650, stage("Decode")),
          wait(0, Object.assign(stage("Execute"), { cu: { cls: "" }, regs: { cls: "on" } })),
        ].concat(
          fly("val", [706, 190], REG[r], { text: v, via: [[785, 190], [785, 176], [REG[r][0], 176]], dur: 900 }),
          [wait(0, stage("Store"))], pop(id, v, "hot")) });
      } else {
        const a = m[2], b = m[3], sum = val[a] + val[b];
        steps.push({ note: notes.shift(), phases: [wait(700, Object.assign(stage("Decode"), { sig: { o: 1 }, alu: { cls: "on" } }))] });
        steps.push({ note: notes.shift(), phases: [
          wait(0, Object.assign(stage("Execute"), { cu: { cls: "" }, sig: { o: 0 } })),
          { set: { a: { x: REG[a][0], y: REG[a][1], o: 0, s: 0.6, text: String(val[a]) }, b: { x: REG[b][0], y: REG[b][1], o: 0, s: 0.6, text: String(val[b]) } }, dur: 0 },
          { set: { a: { o: 1, s: 1 }, b: { o: 1, s: 1 } }, dur: 200 },
          { set: { a: { y: 196 }, b: { y: 196 } }, dur: 600 },
          { set: { a: { x: 906, y: 228 }, b: { x: 994, y: 228 } }, dur: 450 },
          { set: { a: { o: 0, x: 930 }, b: { o: 0, x: 970 } }, dur: 200 },
        ].concat(pop("op", val[a] + " + " + val[b]), [wait(700)], pop("op", String(sum), "hot")) });
        val[a] = sum;
        steps.push({ note: notes.shift(), phases: [
          wait(0, Object.assign(stage("Store"), { alu: { cls: "" }, regs: { cls: "on" }, op: { text: "", cls: "" } })),
        ].concat(
          fly("res", [950, 300], REG[a], { text: String(sum), via: [[950, 320], [826, 320], [826, 176], [REG[a][0], 176]], dur: 1300 }),
          pop(a.toLowerCase(), String(sum), "hot")) });
      }
    });
    steps.push({ note: notes.shift(), phases: [wait(300, Object.assign(rowsOff(), stage(""), { cu: { cls: "" }, regs: { cls: "" } }))] });

    return App.widgets.animStepper({
      title: cfg.title, w: 1140, h: 350, label: "The CPU and the memory: the program counter, the instruction register, two registers and the ALU",
      build(S) {
        // memory
        S.text("Memory (RAM)", 175, 22, "b");
        S.add(rect(20, 44, 310, 196, "sn-box", 14));
        code.forEach((c, k) => {
          S.text(String(k + 1), 50, rowY(k), "mono dim");
          S.part("row" + k, g("sn-cellg", rect(-120, -21, 240, 42, "sn-cell", 8)), { x: 196, y: rowY(k) });
          S.text(App.esc(c), 196, rowY(k), "mono");
        });
        S.label("stage", chips(STAGES, ""), 232, 296, { cls: "sn-chips" });
        // bus
        S.add(line(330, 136, 450, 136, "sn-bus"));
        S.text("bus", 390, 104, "dim");
        // CPU
        S.add(rect(450, 14, 670, 322, "sn-box sn-box2", 18));
        S.text("CPU", 492, 37, "b");
        S.add(path("M 756 190 H 785 V 176 H 1038 M 901 145 V 196 M 1038 145 V 196 M 950 300 V 320 H 826 V 176", "sn-wire"));
        S.part("sig", g("", path("M 770 214 H 850 V 248 H 872", "sn-wire sn-wire-on")), { o: 0 });
        S.part("cu", g("sn-cardg", rect(0, 0, 300, 180, "sn-card", 12)), { x: 470, y: 58 });
        S.text("Control unit", 620, 82, "b");
        S.text("PC", 500, 128, "mono b"); S.add(rect(530, 107, 70, 42, "sn-cell", 8));
        S.text("IR", 500, 190, "mono b"); S.add(rect(530, 169, 226, 42, "sn-cell", 8));
        S.part("regs", g("sn-cardg", rect(0, 0, 300, 100, "sn-card", 12)), { x: 800, y: 58 });
        S.text("Registers", 950, 80, "b");
        S.text("R1", 832, 124, "mono b"); S.add(rect(856, 103, 90, 42, "sn-cell", 8));
        S.text("R2", 972, 124, "mono b"); S.add(rect(996, 103, 84, 42, "sn-cell", 8));
        S.part("alu", g("sn-cardg", sv("polygon", { points: "-90,-52 -25,-52 0,-30 25,-52 90,-52 55,52 -55,52", class: "sn-card" })), { x: 950, y: 248 });
        S.text("ALU", 950, 280, "b");
        S.label("pc", "", PC[0], PC[1], { cls: "mono b" });
        S.label("ir", "", IR[0], IR[1], { cls: "mono" });
        S.label("r1", "", REG.R1[0], REG.R1[1], { cls: "mono b" });
        S.label("r2", "", REG.R2[0], REG.R2[1], { cls: "mono b" });
        S.label("op", "", 950, 238, { cls: "mono b" });
        S.token("addr", "", 0, 0, { o: 0 });
        S.token("ins", "", 0, 0, { o: 0, cls: "info" });
        S.token("val", "", 0, 0, { o: 0, cls: "raw" });
        S.token("a", "", 0, 0, { o: 0, cls: "raw" });
        S.token("b", "", 0, 0, { o: 0, cls: "raw" });
        S.token("res", "", 0, 0, { o: 0, cls: "raw" });
      },
      steps,
    });
  };

  /* ============================================================
     sceneSeek - reading one block. HDD: the platter rotates all the
     time; the arm moves the head to the track (seek), then the head
     waits until the sector rotates under it (rotational latency).
     SSD: the controller addresses the cell electronically.
     The bars under the two drives use one time scale.
     config: { seek: 9, latency: 4, ssd: 0.1 }   (ms; defaults shown)
     ============================================================ */
  App.widgets.sceneSeek = function (cfg) {
    const num = (v, d) => (typeof v === "number" && isFinite(v) ? v : d);
    const seek = num(cfg.seek, 9), lat = num(cfg.latency, 4), ssd = num(cfg.ssd, 0.1), acc = seek + lat;
    const f = (x) => String(Math.round(x * 100) / 100);
    const rad = Math.PI / 180;
    const C = [176, 161], R = 104, TR = 70;            // platter: centre, radius; radius of the target track
    const P = [372, 250], ARM = 166;                   // arm: pivot, length
    const dPC = Math.hypot(C[0] - P[0], C[1] - P[1]), dir = Math.atan2(C[1] - P[1], C[0] - P[0]) / rad;
    const swing = (d) => dir + Math.acos((dPC * dPC + ARM * ARM - d * d) / (2 * dPC * ARM)) / rad;   // arm angle for a head at distance d from the centre
    const PARK = swing(R + 16), ON = swing(TR);
    const head = [P[0] + ARM * Math.cos(ON * rad), P[1] + ARM * Math.sin(ON * rad)];
    const headAng = Math.atan2(head[1] - C[1], head[0] - C[0]) / rad;
    const SEC = 150, SPEED = 0.15;                     // sector angle on the platter; degrees per ms (one turn in 2.4 s)
    const BAR = [40, 420], K = (BAR[1] - BAR[0]) / acc; // the time scale of the bars: px per ms
    let rot = 0, platter = null, sector = null;
    const turn = () => platter.setAttribute("transform", "translate(" + C[0] + " " + C[1] + ") rotate(" + rot.toFixed(2) + ")");
    const arc = (r, a0, a1) => "M " + (r * Math.cos(a0 * rad)).toFixed(1) + " " + (r * Math.sin(a0 * rad)).toFixed(1) +
      " A " + r + " " + r + " 0 0 1 " + (r * Math.cos(a1 * rad)).toFixed(1) + " " + (r * Math.sin(a1 * rad)).toFixed(1);
    const time = (node, p) => { node.textContent = p.show || (f(Math.round(p.ms * 10) / 10) + " ms"); };
    const width = (node, p) => node.setAttribute("width", Math.max(0, p.w));
    return App.widgets.animStepper({
      title: cfg.title, w: 1140, h: 350, label: "A hard disk drive with a rotating platter and a moving arm, beside a solid state drive with memory cells",
      build(S) {
        // HDD
        S.text("HDD: moving parts", 230, 18, "b");
        S.add(rect(30, 40, 400, 242, "sn-case", 20));
        platter = S.add(g("",
          circle(0, 0, R, "sn-platter"),
          ...[40, 55, 70, 85].map((r) => circle(0, 0, r, "sn-track")),
          path(arc(R - 8, 200, 250), "sn-shine"), path(arc(R - 8, 20, 70), "sn-shine")));
        sector = S.add(path(arc(TR, SEC - 14, SEC + 14), "sn-sector"), platter);
        turn();
        S.add(circle(C[0], C[1], 18, "sn-hub")); S.add(circle(C[0], C[1], 6, "sn-hubdot"));
        S.part("sec", g(""), {}, (node, p) => sector.setAttribute("class", "sn-sector" + (p.cls ? " " + p.cls : "")));
        S.add(sv("rect", { x: -34, y: -22, width: 50, height: 44, rx: 8, class: "sn-coil", transform: "translate(" + P[0] + " " + P[1] + ") rotate(" + ((PARK + ON) / 2).toFixed(1) + ")" }));
        S.part("arm", g("sn-armg",
          path("M 0 -10 L " + (ARM - 14) + " -4 L " + ARM + " 0 L " + (ARM - 14) + " 4 L 0 10 Z", "sn-arm"),
          circle(0, 0, 13, "sn-pivot"), circle(ARM, 0, 6, "sn-head")), { x: P[0], y: P[1], r: PARK });
        S.add(rect(BAR[0], 326, BAR[1] - BAR[0], 12, "sn-bar", 6));
        S.part("barS", rect(BAR[0], 326, 0, 12, "sn-bar-seek", 6), { w: 0 }, width);
        S.part("barL", rect(BAR[0] + seek * K, 326, 0, 12, "sn-bar-lat", 6), { w: 0 }, width);
        S.label("hddT", "", 230, 303, { cls: "mono b", ms: 0, show: "", apply: time });
        // SSD
        S.text("SSD: no moving parts", 860, 18, "b");
        S.add(rect(620, 40, 480, 242, "sn-board", 16));
        S.add(path("M 756 161 H 780 M 780 78 V 228 " + [78, 128, 178, 228].map((y) => "M 780 " + y + " H 800").join(" "), "sn-wire"));
        S.add(g("sn-ic", rect(644, 112, 112, 98, "sn-chipbody", 8),
          ...[130, 150, 170, 190].flatMap((y) => [line(634, y, 644, y), line(756, y, 766, y)])));
        S.text("controller", 700, 240, "dim");
        for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
          const cell = rect(-20, -18, 40, 36, "sn-cell", 6);
          if (r === 1 && c === 3) S.part("hit", g("sn-cellg", cell), { x: 820 + c * 49, y: 78 + r * 50 });
          else S.add(sv("g", { transform: "translate(" + (820 + c * 49) + " " + (78 + r * 50) + ")" }, cell));
        }
        S.text("flash memory cells", 942, 262, "dim");
        S.part("pulse", circle(0, 0, 9, "sn-pulse"), { x: 756, y: 161, o: 0 });
        S.add(rect(640, 326, 460, 12, "sn-bar", 6));
        S.part("barD", rect(640, 326, Math.max(3, ssd * K), 12, "sn-bar-ssd", 2), { o: 0 });
        S.label("ssdT", "", 860, 303, { cls: "mono b" });
      },
      loops: [(S, dt) => { rot = (rot + SPEED * dt) % 360; turn(); }],
      after(S, i, instant) { if (instant && i >= 1) { rot = headAng - SEC; turn(); } },
      steps: [
        { note: "<b>Seek.</b> The arm moves the head to the track: " + f(seek) + " ms. The SSD has already read its cell.", phases: [
          { set: { pulse: { o: 1 } }, dur: 0 },
          { set: { pulse: { x: 820 + 3 * 49, y: 128 } }, via: { pulse: [[780, 161], [780, 128]] }, dur: 380 },
          { set: { pulse: { o: 0 }, hit: { cls: "on" }, barD: { o: 1 }, ssdT: { text: f(ssd) + " ms · done" } }, dur: 0 },
          { set: { arm: { r: ON }, hddT: { ms: seek }, barS: { w: seek * K } }, dur: 1700 },
          { set: { hddT: { show: "seek: " + f(seek) + " ms" } }, dur: 0 },
        ] },
        { note: "<b>Rotational latency.</b> The head waits for the sector to rotate under it: " + f(lat) + " ms. Then it reads.", phases: [
          { set: { hddT: { show: "", ms: acc }, barL: { w: lat * K } }, linear: true,
            dur: () => { const d = (((headAng - SEC - rot) % 360) + 360) % 360; return (d < 80 ? d + 360 : d) / SPEED; } },
          { set: { sec: { cls: "read" }, arm: { cls: "on" }, hddT: { show: f(seek) + " + " + f(lat) + " = " + f(acc) + " ms" } }, dur: 0 },
        ] },
        { note: "<b>Access time.</b> HDD: " + f(seek) + " + " + f(lat) + " = " + f(acc) + " ms. SSD: " + f(ssd) + " ms. The HDD takes " + f(Math.round(acc / ssd)) + " times as long.", phases: [
          { set: { arm: { cls: "" }, hddT: { show: f(acc) + " ms · done", s: 1.25 }, ssdT: { s: 1.25 } }, dur: 300 },
          { set: { hddT: { s: 1 }, ssdT: { s: 1 } }, dur: 300 },
        ] },
      ],
    });
  };

  /* ============================================================
     sceneStored - the stored program. The program file is loaded from
     storage into RAM; RAM holds it as binary numbers at addresses; the
     bus carries each instruction to the CPU; input and output devices
     exchange data over the bus.
     config: { rows: [binary strings; the last one is data], notes: [5] }
     ============================================================ */
  App.widgets.sceneStored = function (cfg) {
    const rows = cfg.rows, notes = cfg.notes;
    const BUS = 218, CELLX = 535, rowY = (k) => 40 + k * 38;
    const CPU = [175, 100], STO = [980, 100], KB = [330, 292], MON = [810, 286];
    const fetch = (k, dur) => [wait(0, { ["row" + k]: { cls: "on" } })].concat(
      fly("ins", [CELLX, rowY(k)], CPU, { text: rows[k], via: [[590, 196], [590, BUS], [175, BUS]], dur }),
      [{ set: { cpuIc: { s: 0.96 } }, dur: 160 }, { set: { cpuIc: { s: 0.8 }, ["row" + k]: { cls: "" } }, dur: 160 }]);
    return App.widgets.animStepper({
      w: 1140, h: 336, label: "A CPU, the memory, a storage device, a keyboard and a monitor, connected by a bus",
      build(S) {
        S.add(line(60, BUS, 1080, BUS, "sn-bus"));
        S.part("busOn", line(60, BUS, 1080, BUS, "sn-bus-on"), { o: 0 });
        S.add(path("M 175 160 V " + BUS + " M 590 181 V " + BUS + " M 980 160 V " + BUS + " M 330 " + BUS + " V 268 M 810 " + BUS + " V 248", "sn-wire"));
        S.text("Bus", 570, BUS + 28, "b");
        S.part("cpu", g("sn-cardg", rect(-115, -60, 230, 120, "sn-card", 14)), { x: CPU[0], y: CPU[1] });
        S.part("cpuIc", ICON.cpu(), { x: 122, y: 100, s: 0.8 });
        S.text("CPU", 224, 100, "b");
        S.part("ram", g("sn-cardg", rect(-200, -84, 400, 168, "sn-card", 14)), { x: 590, y: 97 });
        S.text("RAM", 340, 40, "b");
        rows.forEach((r, k) => {
          S.text(String(k + 1), 420, rowY(k), "mono dim");
          S.part("row" + k, g("sn-cellg", rect(-85, -16, 170, 32, "sn-cell", 6)), { x: CELLX, y: rowY(k) });
          S.label("bits" + k, r, CELLX, rowY(k), { cls: "mono", o: 0 });
          S.text(k < rows.length - 1 ? "instruction" : "data", 706, rowY(k), "dim");
        });
        S.part("sto", g("sn-cardg", rect(-115, -60, 230, 120, "sn-card", 14)), { x: STO[0], y: STO[1] });
        S.add(sv("g", { transform: "translate(922 100) scale(0.8)" }, ICON.store()));
        S.text("Storage", 1024, 100, "b");
        S.part("kb", ICON.keyboard(), { x: KB[0], y: KB[1], s: 0.8 });
        S.text("keyboard", 448, KB[1], "dim");
        S.part("mon", ICON.monitor(), { x: MON[0], y: MON[1], s: 0.8 });
        S.text("monitor", 920, MON[1], "dim");
        S.token("prog", "", 0, 0, { o: 0, cls: "sq" });
        S.token("ins", "", 0, 0, { o: 0 });
        S.token("io", "", 0, 0, { o: 0 });
      },
      steps: [
        { note: notes[0], phases: [wait(0, { sto: { cls: "on" } })].concat(
          fly("prog", STO, [590, 100], { text: "program", cls: "info", via: [[980, BUS], [590, BUS]], dur: 1400 }),
          [wait(0, { sto: { cls: "" }, ram: { cls: "on" } })],
          rows.map((r, k) => ({ set: { ["bits" + k]: { o: 1 } }, dur: 170 }))) },
        { note: notes[1], phases: rows.flatMap((r, k) => [wait(340, { ["row" + k]: { cls: "on" } }), wait(0, { ["row" + k]: { cls: "" } })]) },
        { note: notes[2], phases: [wait(0, { ram: { cls: "" }, busOn: { o: 1 } })].concat(fetch(0, 1400)) },
        { note: notes[3], phases: [wait(0, { busOn: { o: 0 }, cpu: { cls: "on" } })].concat(fetch(1, 1000), fetch(2, 1000)) },
        { note: notes[4], phases: [wait(0, { cpu: { cls: "" }, kb: { cls: "on" } })].concat(
          fly("io", KB, CPU, { text: "A", cls: "raw", via: [[330, BUS], [175, BUS]], dur: 1000 }),
          [wait(0, { kb: { cls: "" }, mon: { cls: "on" } })],
          fly("io", CPU, [MON[0], MON[1] - 6], { text: "A", cls: "info", via: [[175, BUS], [810, BUS]], dur: 1200, keep: true })) },
      ],
    });
  };

  /* ============================================================
     scenePower - volatile and non-volatile memory. When the power is
     switched off, the charge of the RAM cells drains away; the ROM
     cells keep their data.
     config: { ram: [2 values], rom: [2 values], notes: [3], rest }
     ============================================================ */
  App.widgets.scenePower = function (cfg) {
    const notes = cfg.notes, TOP = [62, 148];
    const level = (node, p) => node.setAttribute("width", Math.max(0, 340 * p.lvl));
    const power = (on) => ({ sw: { cls: on ? "on" : "" }, knob: { x: on ? 132 : 88 }, pw: { text: on ? "ON" : "OFF", cls: on ? "good" : "bad" }, wire: { cls: on ? "on" : "" } });
    return App.widgets.animStepper({
      w: 1140, h: 262, rest: cfg.rest, label: "A power switch, a RAM chip and a ROM chip, each with two memory cells",
      build(S) {
        S.text("Power", 110, 70, "b");
        S.part("wire", g("sn-powerg", path("M 156 130 H 280 M 218 130 V 252 H 700 V 130 H 730", "sn-power")), {});
        S.part("sw", g("sn-swg", rect(-46, -24, 92, 48, "sn-sw", 24)), { x: 110, y: 130 });
        S.part("knob", circle(0, 0, 18, "sn-knob"), { x: 88, y: 130 });
        S.label("pw", "OFF", 110, 186, { cls: "mono", state: "bad" });
        [[280, "RAM (volatile)", cfg.ram, "r"], [730, "ROM (non-volatile)", cfg.rom, "o"]].forEach(([x, title, vals, id]) => {
          S.text(title, x + 190, 20, "b");
          S.add(g("sn-pins", ...[0, 1, 2, 3, 4, 5, 6, 7].flatMap((j) => [rect(x + 26 + j * 44, 34, 20, 10, null, 2), rect(x + 26 + j * 44, 236, 20, 10, null, 2)])));
          S.add(rect(x, 44, 380, 192, "sn-chipbox", 14));
          vals.forEach((v, k) => {
            S.add(rect(x + 20, TOP[k], 340, 70, "sn-cell", 10));
            S.part(id + "c" + k, rect(x + 20, TOP[k], 340, 70, "sn-charge" + (id === "o" ? " rom" : ""), 10), { lvl: id === "o" ? 1 : 0 }, level);
            S.label(id + "t" + k, v, x + 190, TOP[k] + 35, { cls: "mono b", o: id === "o" ? 1 : 0 });
          });
        });
      },
      steps: [
        { note: notes[0], phases: [
          { set: power(true), dur: 350 },
          { set: { rc0: { lvl: 1 }, rc1: { lvl: 1 }, rt0: { o: 1 }, rt1: { o: 1 } }, dur: 900 },
        ] },
        { note: notes[1], phases: [
          { set: power(false), dur: 350 },
          { set: { rc0: { lvl: 0 }, rc1: { lvl: 0 }, rt0: { o: 0 }, rt1: { o: 0 } }, dur: 1900 },
        ] },
        { note: notes[2], phases: [
          { set: power(true), dur: 350 },
          { set: { oc0: { cls: "on" }, oc1: { cls: "on" } }, dur: 400 },
        ] },
      ],
    });
  };

  /* ============================================================
     sceneRamCell - how DRAM and SRAM store one bit. DRAM: a capacitor
     loses its charge and is refreshed. SRAM: a flip-flop (two inverters
     in a loop) holds the bit while it has power.
     config: { notes: [4] }
     ============================================================ */
  App.widgets.sceneRamCell = function (cfg) {
    const notes = cfg.notes, TOP = 96, BOT = 236, FULL = BOT - TOP;
    const charge = (node, p) => { const hh = Math.max(0, FULL * p.lvl); node.setAttribute("y", BOT - hh); node.setAttribute("height", hh); };
    // the charge falls from `from` to `to`, with n drops
    const leak = (from, to, n, ms) => {
      const out = [];
      for (let j = 1; j <= n; j++) {
        out.push({ set: { drip: { y: BOT + 8, o: 1 } }, dur: 0 });
        out.push({ set: { q: { lvl: from + (to - from) * j / n }, drip: { y: BOT + 62, o: 0 } }, dur: ms / n, linear: true });
      }
      return out.concat([wait(0, { dbit: { cls: "raw" } })]);
    };
    const refresh = () => [
      { set: { rf: { y: 50, o: 1 }, rfT: { o: 1 } }, dur: 0 },
      { set: { rf: { y: TOP } }, dur: 380 },
      { set: { rf: { o: 0 }, q: { lvl: 1 }, dbit: { cls: "info" } }, dur: 450 },
      { set: { rfT: { o: 0 } }, dur: 250 },
    ];
    const LOOP = "M 836 122 H 990 V 236 H 944 M 870 236 H 710 V 122 H 756";
    return App.widgets.animStepper({
      w: 1140, h: 320, label: "A capacitor that loses its charge, beside two inverters that form a loop",
      build(S) {
        // DRAM
        S.text("DRAM: one capacitor", 280, 22, "b");
        S.add(line(280, 54, 280, TOP, "sn-wire"));
        S.add(rect(206, TOP, 148, FULL, "sn-tank", 0));
        S.part("q", rect(206, BOT, 148, 0, "sn-chargeq", 0), { lvl: 0 }, charge);
        S.add(line(192, TOP, 368, TOP, "sn-plate")); S.add(line(192, BOT, 368, BOT, "sn-plate"));
        S.add(line(182, (TOP + BOT) / 2, 378, (TOP + BOT) / 2, "sn-dash"));
        S.text("1", 400, 131, "mono dim"); S.text("0", 400, 201, "mono dim");
        S.add(path("M 280 " + BOT + " V 264 M 256 264 H 304 M 265 275 H 295 M 274 286 H 286", "sn-wire"));
        S.part("drip", circle(0, 0, 7, "sn-drip"), { x: 378, y: BOT + 8, o: 0 });
        S.part("rf", circle(0, 0, 9, "sn-pulse"), { x: 280, y: 50, o: 0 });
        S.label("rfT", "refresh", 356, 62, { cls: "hot", o: 0 });
        S.text("bit", 104, 134, "dim");
        S.token("dbit", "0", 104, 176, { cls: "sq", state: "ghost" });
        S.add(line(570, 40, 570, 300, "sn-dash"));
        // SRAM
        S.text("SRAM: one flip-flop", 850, 22, "b");
        S.add(path(LOOP, "sn-wire"));
        S.part("loop", path(LOOP, "sn-wire sn-wire-on"), { o: 0 });
        S.add(g("sn-ic sn-gatefill", path("M 756 94 L 812 122 L 756 150 Z"), circle(824, 122, 10)));
        S.add(g("sn-ic sn-gatefill", path("M 944 208 L 888 236 L 944 264 Z"), circle(880, 236, 10)));
        S.label("q0", "1", 686, 178, { cls: "mono b" });
        S.label("q1", "0", 1014, 178, { cls: "mono b" });
        S.text("bit", 1084, 134, "dim");
        S.token("sbit", "0", 1084, 176, { cls: "sq", state: "ghost" });
      },
      steps: [
        { note: notes[0], phases: [{ set: { q: { lvl: 1 }, loop: { o: 1 } }, dur: 900 }].concat(
          pop("dbit", "1", "info"), [wait(0, { q0: { text: "0" } })], pop("q1", "1", "good"), pop("sbit", "1", "info")) },
        { note: notes[1], phases: leak(1, 0.58, 3, 2400) },
        { note: notes[2], phases: refresh() },
        { note: notes[3], phases: leak(1, 0.6, 2, 1300).concat(refresh(), leak(1, 0.6, 2, 1300), refresh()) },
      ],
    });
  };

  /* ============================================================
     sceneRom - PROM, EPROM, EEPROM. Each chip holds eight bits. PROM:
     fixed. EPROM: ultraviolet light through the window erases every
     bit. EEPROM: electrical signals rewrite a part of the bits.
     config: { names: [3], subs: [3], notes: [4] }
     ============================================================ */
  App.widgets.sceneRom = function (cfg) {
    const notes = cfg.notes, X = [200, 570, 940];
    const A = [1, 0, 1, 1, 0, 1, 0, 1], B = [0, 1, 1, 0, 1, 0, 0, 1], PART = [1, 6];
    const cx = (k, j) => X[k] - 105 + (j % 4) * 70, cy = (j) => (j < 4 ? 168 : 226);
    const bit = (k, j, v) => ({ ["c" + k + "_" + j]: { cls: v == null ? "" : v ? "one" : "zero" }, ["d" + k + "_" + j]: { text: v == null ? "" : String(v), cls: v ? "onbit" : "" } });
    const bits = (ks, js, f) => Object.assign({}, ...ks.flatMap((k) => js.map((j) => bit(k, j, f(j)))));
    const all = [0, 1, 2, 3, 4, 5, 6, 7];
    const write = (ks, pat, ms) => all.map((j) => ({ set: bits(ks, [j], () => pat[j]), dur: ms }));
    return App.widgets.animStepper({
      w: 1140, h: 290, label: "Three memory chips with eight bits each: PROM, EPROM with a window and an ultraviolet lamp, and EEPROM",
      build(S) {
        X.forEach((x, k) => {
          S.text(cfg.names[k], x, 20, "b"); S.text(cfg.subs[k], x, 52, "dim");
          S.add(g("sn-ic", ...[-110, -66, -22, 22, 66, 110].flatMap((dx) => [line(x + dx, 118, x + dx, 132), line(x + dx, 262, x + dx, 276)])));
          S.part("chip" + k, g("sn-cardg", rect(-150, -65, 300, 130, "sn-card", 12)), { x, y: 197 });
          if (k === 1) S.add(rect(x - 138, 140, 276, 114, "sn-window", 57));
          all.forEach((j) => {
            S.part("c" + k + "_" + j, g("sn-bitg", rect(-23, -20, 46, 40, "sn-bit", 6)), { x: cx(k, j), y: cy(j) });
            S.label("d" + k + "_" + j, "", cx(k, j), cy(j), { cls: "mono b" });
          });
        });
        S.part("uv", g("", sv("polygon", { points: "-60,6 60,6 128,52 -128,52", class: "sn-uvbeam" }), rect(-64, -8, 128, 14, "sn-uvlamp", 7)), { x: X[1], y: 88, o: 0 });
        S.part("lock", g("sn-ic sn-lock", rect(-13, -4, 26, 22, null, 4), path("M -8 -4 V -11 a 8 8 0 0 1 16 0 V -4")), { x: X[0], y: 92, o: 0, s: 1.3 });
        S.part("zap", path("M 4 -16 L -8 2 H 2 L -4 16 L 10 -2 H 0 Z", "sn-zap"), { x: X[2], y: 92, o: 0, s: 1.4 });
      },
      steps: [
        { note: notes[0], phases: write([0, 1, 2], A, 110) },
        { note: notes[1], phases: [wait(0, { chip0: { cls: "on" } }), { set: { lock: { o: 1 } }, dur: 350 }] },
        { note: notes[2], phases: [
          wait(0, { chip0: { cls: "" }, chip1: { cls: "on" } }),
          { set: { uv: { o: 1 } }, dur: 350 }, wait(500),
          wait(700, bits([1], all, () => null)),
          { set: { uv: { o: 0 } }, dur: 350 }, wait(250),
        ].concat(write([1], B, 110)) },
        { note: notes[3], phases: [
          wait(0, { chip1: { cls: "" }, chip2: { cls: "on" } }),
          { set: { zap: { o: 1 } }, dur: 250 },
          wait(450, Object.assign({}, ...PART.map((j) => ({ ["c2_" + j]: { cls: "hot" } })))),
          wait(450, bits([2], PART, () => null)),
          wait(400, bits([2], PART, (j) => 1 - A[j])),
          { set: { zap: { o: 0 } }, dur: 250 },
        ] },
      ],
    });
  };

  /* ============================================================
     sceneGates - AND, OR and NOT gates. The inputs change; the signal
     passes the gate and sets the output.
     config: { captions: [3], note(a, b, and, or, not) -> html }
     ============================================================ */
  App.widgets.sceneGates = function (cfg) {
    const X = [200, 570, 940], Y = 150, combos = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const SHAPE = ["M -40 -44 H 0 A 44 44 0 0 1 0 44 H -40 Z", "M -46 -44 Q 2 -44 44 0 Q 2 44 -46 44 Q -26 0 -46 -44 Z", "M -40 -38 L 32 0 L -40 38 Z"];
    const tk = (v, big) => ({ text: String(v), cls: v ? "info" : "ghost", s: big ? 1.4 : 1 });
    const wr = (v) => ({ cls: v ? "one" : "" });
    const calm = (ids) => Object.assign({}, ...ids.map((id) => ({ [id]: { s: 1 } })));
    return App.widgets.animStepper({
      w: 1140, h: 290, label: "Three logic gates with their input and output signals: AND, OR, NOT",
      build(S) {
        cfg.names.forEach((nm, k) => {
          const x = X[k], two = k < 2;
          S.text(nm, x, 22, "b"); S.text(cfg.captions[k], x, 262, "dim");
          S.part("wa" + k, line(x - 104, two ? Y - 28 : Y, x - 38, two ? Y - 28 : Y, "sn-sigw"), {});
          if (two) S.part("wb" + k, line(x - 104, Y + 28, x - 38, Y + 28, "sn-sigw"), {});
          S.part("wo" + k, line(x + (two ? 44 : 48), Y, x + 104, Y, "sn-sigw"), {});
          S.part("g" + k, g("sn-gate", path(SHAPE[k]), two ? null : circle(40, 0, 8)), { x, y: Y });
          S.token("a" + k, "0", x - 128, two ? Y - 28 : Y, { cls: "sq", state: "ghost" });
          if (two) S.token("b" + k, "0", x - 128, Y + 28, { cls: "sq", state: "ghost" });
          S.token("o" + k, "0", x + 128, Y, { cls: "sq", state: "ghost" });
        });
      },
      steps: combos.map(([a, b]) => {
        const out = [a & b, a | b, 1 - a];
        return { note: cfg.note(a, b, out[0], out[1], out[2]), phases: [
          { set: { a0: tk(a, 1), b0: tk(b, 1), a1: tk(a, 1), b1: tk(b, 1), a2: tk(a, 1), wa0: wr(a), wb0: wr(b), wa1: wr(a), wb1: wr(b), wa2: wr(a) }, dur: 0 },
          { set: calm(["a0", "b0", "a1", "b1", "a2"]), dur: 320 },
          wait(380, { g0: { cls: "on" }, g1: { cls: "on" }, g2: { cls: "on" } }),
          { set: { o0: tk(out[0], 1), o1: tk(out[1], 1), o2: tk(out[2], 1), wo0: wr(out[0]), wo1: wr(out[1]), wo2: wr(out[2]), g0: { cls: "" }, g1: { cls: "" }, g2: { cls: "" } }, dur: 0 },
          { set: calm(["o0", "o1", "o2"]), dur: 320 },
        ] };
      }),
    });
  };

  /* ============================================================
     sceneAsm - the assembler. Each part of an assembly instruction
     passes the assembler and leaves it as a binary code.
     config: { left, right, machine, when, example, parts: [3], codes: [3], notes: [3], rest }
     ============================================================ */
  App.widgets.sceneAsm = function (cfg) {
    const src = cfg.parts, bin = cfg.codes, notes = cfg.notes;
    const LX = [118, 200, 278], RX = [846, 940, 1034], Y = 122;
    return App.widgets.animStepper({
      w: 1140, h: 226, rest: cfg.rest, label: "An assembly instruction passes the assembler and becomes machine code",
      build(S) {
        S.text(cfg.left, 200, 30, "b"); S.text(cfg.right, 940, 30, "b");
        S.part("lbox", g("sn-cardg", rect(-170, -50, 340, 100, "sn-card", 14)), { x: 200, y: Y });
        S.part("asm", g("sn-cardg", rect(-104, -50, 208, 100, "sn-card", 14)), { x: 570, y: Y });
        S.part("rbox", g("sn-cardg", rect(-170, -50, 340, 100, "sn-card", 14)), { x: 940, y: Y });
        S.part("ar1", g("sn-chev", path("M -9 -14 L 9 0 L -9 14")), { x: 418, y: Y });
        S.part("ar2", g("sn-chev", path("M -9 -14 L 9 0 L -9 14")), { x: 722, y: Y });
        S.text(cfg.machine, 570, Y, "b");
        src.forEach((t, j) => S.label("s" + j, t, LX[j], Y, { cls: "mono b" }));
        bin.forEach((t, j) => S.label("r" + j, t, RX[j], Y, { cls: "mono b", o: 0 }));
        S.text(cfg.when, 570, 202, "dim"); S.text(cfg.example, 940, 202, "dim");
        S.token("t", "", 0, 0, { o: 0 });
      },
      steps: [
        { note: notes[0], phases: [wait(0, { lbox: { cls: "on" } })].concat(
          src.flatMap((t, j) => [{ set: { ["s" + j]: { cls: "hot", s: 1.3 } }, dur: 200 }, { set: { ["s" + j]: { s: 1 } }, dur: 260 }])) },
        { note: notes[1], phases: [wait(0, { lbox: { cls: "" }, asm: { cls: "on" }, ar1: { cls: "on" }, ar2: { cls: "on" } })].concat(
          src.flatMap((t, j) => [
            { set: { t: { x: LX[j], y: Y, o: 0, s: 0.6, text: t, cls: "raw" } }, dur: 0 },
            { set: { t: { o: 1, s: 1 } }, dur: 160 },
            { set: { t: { x: 570 } }, dur: 560 },
            { set: { t: { text: bin[j], cls: "info", s: 1.3 } }, dur: 0 },
            { set: { t: { s: 1 } }, dur: 220 },
            { set: { t: { x: RX[j] } }, dur: 560 },
            { set: { t: { o: 0 }, ["r" + j]: { o: 1 } }, dur: 140 },
          ])) },
        { note: notes[2], phases: [wait(0, { asm: { cls: "" }, ar1: { cls: "" }, ar2: { cls: "" }, rbox: { cls: "on" } })].concat(
          bin.flatMap((t, j) => [{ set: { ["r" + j]: { cls: "good", s: 1.3 } }, dur: 200 }, { set: { ["r" + j]: { s: 1 } }, dur: 260 }])) },
      ],
    });
  };

  /* ============================================================
     sceneLevels - one statement travels down the levels of a computer
     system. At each level the token shows what the statement has become.
     config: { title, enter (the token arrives from above), rest,
               levels: [{ n, name, token, desc, out }] }
     ============================================================ */
  App.widgets.sceneLevels = function (cfg) {
    const lv = cfg.levels, RH = 58, GAP = 8, TX = 860;
    const yc = (k) => RH / 2 + k * (RH + GAP);
    return App.widgets.animStepper({
      title: cfg.title, w: 1140, h: lv.length * (RH + GAP) - GAP, rest: cfg.rest, label: "The levels of a computer system as a stack; one statement moves down the stack",
      build(S) {
        lv.forEach((l, k) => {
          S.part("b" + k, g("sn-cardg", rect(0, -RH / 2, 1100, RH, "sn-card", 10)), { x: 20, y: yc(k) });
          S.text("L" + l.n, 64, yc(k), "mono hot");
          S.text(l.name, 112, yc(k), "b", "l");
        });
        S.token("tok", lv[0].token, TX, cfg.enter ? -34 : yc(0), { cls: "sq", o: 0, s: 0.6 });
      },
      steps: lv.map((l, k) => ({ note: l.desc, phases: [
        k ? { set: { tok: { s: 0.8 }, ["b" + (k - 1)]: { cls: "done" } }, dur: 160 } : { set: { tok: { o: 1, s: cfg.enter ? 0.8 : 1 } }, dur: 300 },
        { set: { tok: { y: yc(k) } }, dur: k || cfg.enter ? 650 : 0 },
        { set: { tok: { text: l.token, s: 1.25, cls: l.out ? "info" : "" }, ["b" + k]: { cls: "on" } }, dur: 0 },
        { set: { tok: { s: 1 } }, dur: 320 },
      ] })),
    });
  };

  /* ============================================================
     static diagrams (HTML, no stepping)
     ============================================================ */

  /* unitChain - 8 bits = 1 byte; each larger unit is `factor` times the unit before it.
     config: { bits: "01000001", bit, byte, factor, units: [[symbol, name]] } */
  App.widgets.unitChain = function (cfg) {
    const chain = h("div", { class: "uc-chain" });
    cfg.units.forEach((u, k) => {
      if (k) chain.appendChild(h("div", { class: "uc-arrow" }, "× " + cfg.factor));
      chain.appendChild(h("div", { class: "uc-unit" }, h("b", null, u[0]), h("span", null, u[1])));
    });
    return h("div", { class: "widget uc" },
      h("div", { class: "uc-top" },
        h("div", { class: "uc-bits" }, ...cfg.bits.split("").map((b) => h("span", { class: "uc-bit" + (b === "1" ? " one" : "") }, b))),
        h("div", { class: "uc-eq" }, h("div", { html: cfg.byte }), h("div", { class: "uc-dim", html: cfg.bit }))),
      chain);
  };

  /* memPyramid - the memory hierarchy: the fastest, smallest memory at the top.
     config: { top, bottom, keyV, keyNV, tiers: [{ name, where, size, nv }] } */
  App.widgets.memPyramid = function (cfg) {
    const n = cfg.tiers.length, nv = cfg.tiers.filter((t) => t.nv).length;
    const key = h("div", { class: "mp-key" },
      h("div", { class: "mp-brace", style: "flex:" + (n - nv) }, cfg.keyV),
      h("div", { class: "mp-brace nv", style: "flex:" + nv }, cfg.keyNV));
    return h("div", { class: "widget mp" },
      h("div", { class: "mp-side" }, h("span", null, cfg.top), h("span", { class: "mp-arrow" }), h("span", null, cfg.bottom)),
      h("div", { class: "mp-tiers" }, ...cfg.tiers.map((t, k) => h("div", { class: "mp-tier" + (t.nv ? " nv" : ""), style: "width:" + (56 + 44 * k / (n - 1)).toFixed(1) + "%" },
        h("b", null, t.name), h("span", null, t.where), h("span", { class: "mp-size" }, t.size)))),
      key);
  };

  /* levelStack - the levels of a computer system, in groups.
     config: { groups: [{ label, cls: "sw" | "hw", rows: [[number, name, components]] }] } */
  App.widgets.levelStack = function (cfg) {
    return h("div", { class: "widget ls" }, ...cfg.groups.map((gp) => h("div", { class: "ls-group " + gp.cls },
      h("div", { class: "ls-side" }, gp.label),
      h("div", { class: "ls-rows" }, ...gp.rows.map((r) => h("div", { class: "ls-row" },
        h("span", { class: "ls-n" }, String(r[0])), h("b", null, r[1]), h("span", { class: "ls-parts" }, r[2])))))));
  };

  /* tbIcon(name) - a small icon for a table cell (HTML string). */
  const TB_ICON = {
    keyboard: '<rect x="4" y="8" width="40" height="20" rx="3"/><path d="M10 14h2M17 14h2M24 14h2M31 14h2M38 14h1M10 19h2M17 19h2M24 19h2M31 19h2M38 19h1M15 24h18"/>',
    mouse: '<rect x="16" y="3" width="16" height="30" rx="8"/><path d="M24 3v11"/>',
    scanner: '<rect x="5" y="19" width="38" height="12" rx="2"/><path d="M6 19L37 5M12 25h16"/>',
    microphone: '<rect x="19" y="3" width="10" height="18" rx="5"/><path d="M14 17a10 10 0 0 0 20 0M24 27v5M18 32h12"/>',
    webcam: '<circle cx="24" cy="15" r="11"/><circle cx="24" cy="15" r="4"/><path d="M17 33h14l-3-7h-8z"/>',
    monitor: '<rect x="5" y="4" width="38" height="24" rx="3"/><path d="M24 28v5M16 33h16"/>',
    printer: '<rect x="6" y="13" width="36" height="14" rx="2"/><path d="M13 13V4h22v9M13 23v10h22V23"/>',
    speakers: '<rect x="15" y="3" width="18" height="30" rx="3"/><circle cx="24" cy="11" r="3"/><circle cx="24" cy="23" r="5"/>',
    projector: '<rect x="4" y="11" width="40" height="16" rx="3"/><circle cx="16" cy="19" r="5"/><path d="M10 27v5M38 27v5M28 17h10M28 21h6"/>',
  };
  App.tbIcon = (name) => '<svg class="tb-icon" viewBox="0 0 48 36" aria-hidden="true">' + (TB_ICON[name] || "") + "</svg>";
})();
