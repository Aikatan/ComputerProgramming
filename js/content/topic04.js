/* ===================== Topic 04 — Flowchart & Pseudocode ===================== */
App.registerTopic({
  id: "t04",
  title: "Flowchart & Pseudocode",
  short: "Flowchart & Pseudocode",
  blurb: "Plan programs visually with flowcharts and in plain language with pseudocode — then map them to Python.",
  intro: "Before coding, designers sketch the logic. Flowcharts show it as a diagram; pseudocode writes it as plain steps. Both translate directly into the if/else and loops you already know.",
  lessons: [
    {
      id: "flowchart-symbols",
      title: "Flowchart symbols",
      sub: "The standard shapes and what they mean.",
      slides: "04:4–5",
      keywords: "flowchart symbol terminator process decision io connector",
      learn: [
        { type: "text", html: "A <span class='term'>flowchart</span> is a diagram of an algorithm's steps. Each shape has a fixed meaning, so anyone can read the logic at a glance." },
        { type: "widget", name: "diagram", config: { title: "The core flowchart symbols", boxes: [
          { title: "⬭ Terminator", body: "Rounded shape = Start / Stop." },
          { title: "▭ Process", body: "Rectangle = an action or calculation, e.g. <code>x = x + 2</code>." },
          { title: "◇ Decision", body: "Diamond = a yes/no question that branches (True/False)." },
          { title: "▱ Input / Output", body: "Parallelogram = read input or display output." },
          { title: "▢ Predefined Process", body: "A call to a function defined elsewhere." },
          { title: "→ Flowline & Connectors", body: "Arrows show the order; connectors join parts of the chart." },
        ] } },
      ],
      live: [
        { title: "The simplest 'flowchart' as code", code: "# START -> x = 1 -> x = x + 2 -> DISPLAY x -> END\nx = 1\nx = x + 2\nprint(x)   # 3" },
      ],
      quiz: [
        { q: "Which shape represents a yes/no decision?", choices: ["Rectangle", "Rounded terminator", "Diamond", "Parallelogram"], answer: 2, explain: "The diamond is the decision symbol — it branches into True/False paths." },
      ],
    },
    {
      id: "flowchart-to-code",
      title: "Flowcharts ↔ Python",
      sub: "See how a diagram becomes if-statements and loops.",
      slides: "04:8–15",
      keywords: "flowchart condition loop while for code mapping",
      learn: [
        { type: "text", html: "Every flowchart maps to code. Hover the diagram or the code below to see the connection." },
        { type: "subhead", text: "A condition" },
        { type: "widget", name: "flowchart", config: {
          width: 320, height: 360,
          title: "if x > 10: print(x)",
          nodes: [
            { id: "start", type: "terminator", text: "START", x: 100, y: 10, w: 120, h: 32 },
            { id: "input", type: "io", text: "INPUT x", x: 100, y: 74, w: 120, h: 32 },
            { id: "dec", type: "decision", text: "x > 10 ?", x: 90, y: 138, w: 140, h: 64 },
            { id: "disp", type: "process", text: "DISPLAY x", x: 100, y: 234, w: 120, h: 32 },
            { id: "end", type: "terminator", text: "END", x: 100, y: 298, w: 120, h: 32 },
          ],
          edges: [
            { from: "start", to: "input" },
            { from: "input", to: "dec" },
            { from: "dec", to: "disp", label: "True" },
            { from: "disp", to: "end" },
            { from: "dec", to: "end", side: "right", label: "False" },
          ],
          code: ["x = int(input())", "if x > 10:", "    print(x)"],
          map: { input: [0], dec: [1], disp: [2] },
        } },
        { type: "subhead", text: "A loop" },
        { type: "widget", name: "flowchart", config: {
          width: 320, height: 330,
          title: "while not (x > 10): keep asking",
          nodes: [
            { id: "start", type: "terminator", text: "START", x: 100, y: 10, w: 120, h: 32 },
            { id: "input", type: "io", text: "INPUT x", x: 100, y: 74, w: 120, h: 32 },
            { id: "dec", type: "decision", text: "x > 10 ?", x: 90, y: 138, w: 140, h: 64 },
            { id: "disp", type: "process", text: "DISPLAY x", x: 100, y: 240, w: 120, h: 32 },
          ],
          edges: [
            { from: "start", to: "input" },
            { from: "input", to: "dec" },
            { from: "dec", to: "disp", label: "True" },
            { from: "dec", to: "input", side: "left", label: "False (loop)" },
          ],
          code: ["x = int(input())", "while not (x > 10):", "    x = int(input())", "print(x)"],
          map: { input: [0, 2], dec: [1], disp: [3] },
        } },
        { type: "subhead", text: "▶ Run the flowchart step by step" },
        { type: "text", html: "Hovering shows which code matches which shape — but a flowchart's real job is to show <i>execution order</i>. Press <b>Next</b> to follow the arrows for the input <code>x = 12</code> and watch the active shape light up, with the variable state at each step." },
        { type: "widget", name: "flowExec", config: {
          width: 320, height: 360,
          title: "Tracing if x > 10 with x = 12",
          nodes: [
            { id: "start", type: "terminator", text: "START", x: 100, y: 10, w: 120, h: 32 },
            { id: "input", type: "io", text: "INPUT x", x: 100, y: 74, w: 120, h: 32 },
            { id: "dec", type: "decision", text: "x > 10 ?", x: 90, y: 138, w: 140, h: 64 },
            { id: "disp", type: "process", text: "DISPLAY x", x: 100, y: 234, w: 120, h: 32 },
            { id: "end", type: "terminator", text: "END", x: 100, y: 298, w: 120, h: 32 },
          ],
          edges: [
            { from: "start", to: "input" },
            { from: "input", to: "dec" },
            { from: "dec", to: "disp", label: "True" },
            { from: "disp", to: "end" },
            { from: "dec", to: "end", side: "right", label: "False" },
          ],
          trace: [
            { node: "start", vars: {}, note: "START — the program begins." },
            { node: "input", vars: { x: 12 }, note: "Read input. The user enters 12, so x = 12." },
            { node: "dec", vars: { x: 12 }, note: "Decision: is x > 10? 12 > 10 is True, so follow the 'True' arrow." },
            { node: "disp", vars: { x: 12 }, note: "DISPLAY x → prints 12. (If x had been ≤ 10, we'd have skipped straight to END.)" },
            { node: "end", vars: { x: 12 }, note: "END — finished. Output was: 12" },
          ],
        } },
        { type: "note", title: "Same result, two ways", html: "The slides note logical equivalences: <code>A &gt;= B</code> is the same as <code>not (A &lt; B)</code>, and <code>A == B</code> is <code>not (A != B)</code>. Useful when a flowchart phrases a condition the opposite way to your code." },
        { type: "note", variant: "danger", title: "Bad flowcharts to avoid", html: "An <b>unreachable condition</b> (checking <code>x &gt; 15</code> only after you already handled <code>x &gt; 10</code>) and an <b>infinite loop</b> (a counter that never advances) are classic logic bugs the slides warn about." },
      ],
      live: [
        { title: "Multiple conditions — elif mirrors a nested decision", code: "x = 17\nif x > 15:\n    print(\"Hi-value\")\nelif x > 10:\n    print(x)\nelse:\n    print(\"low\")" },
      ],
      quiz: [
        { q: "A diamond with a 'False' arrow looping back to an earlier step is…", choices: ["An if statement", "A while loop", "A function call", "Output"], answer: 1, explain: "Looping back on a condition is exactly what a while loop does." },
        { q: "`A >= B` is equivalent to…", choices: ["not (A < B)", "not (A > B)", "A < B", "A == B"], answer: 0, explain: "Greater-or-equal is the negation of less-than." },
      ],
    },
    {
      id: "pseudocode",
      title: "Pseudocode",
      sub: "Plan logic in plain language, free of syntax.",
      slides: "04:18–22",
      keywords: "pseudocode plain language plan if while structure",
      learn: [
        { type: "list", title: "What makes good pseudocode", items: [
          "<b>Simple</b>: plain language, not any specific language's syntax.",
          "<b>Structured</b>: still follows IF / ELSE / WHILE / FOR logic.",
          "Goal: easy for a human to read <i>and</i> easy to turn into code.",
        ] },
        { type: "example", lang: "text", caption: "even-or-odd in pseudocode", code:
"Start\n  Get number\n  If number modulo 2 equals 0\n      Display \"Number is even\"\n  Else\n      Display \"Number is odd\"\nEnd" },
        { type: "note", html: "Notice how each line drops almost unchanged into Python — that's the point of pseudocode." },
      ],
      live: [
        { title: "The pseudocode above, now in Python", code: "number = int(input(\"Enter a number: \"))\nif number % 2 == 0:\n    print(\"Number is even\")\nelse:\n    print(\"Number is odd\")" },
      ],
      quiz: [
        { q: "Pseudocode is bound to one programming language's syntax.", choices: ["True", "False"], answer: 1, explain: "False — pseudocode is deliberately language-independent plain text." },
      ],
    },
    {
      id: "practice",
      title: "Practice problems",
      sub: "Design then implement.",
      slides: "04:24–26",
      keywords: "practice rectangle area even odd average factorial",
      learn: [
        { type: "list", title: "Try these (from the slides)", items: [
          "Rectangle area: read length & width, output area.",
          "Even or odd: read an integer, print which it is.",
          "Average of 3 subjects: read A, B, C; print the average and Pass/Fail (≥ 50).",
          "Sum 1..N: read N, output the total.",
          "Max of 5 numbers; and Factorial n! using a sub-procedure (function).",
        ] },
      ],
      live: [
        { title: "Average of 3 + Pass/Fail (solved)", code: "a = float(input(\"A: \"))\nb = float(input(\"B: \"))\nc = float(input(\"C: \"))\navg = (a + b + c) / 3\nprint(\"Average:\", avg)\nprint(\"Pass\" if avg >= 50 else \"Fail\")" },
        { title: "Factorial with a sub-procedure (your turn to extend)", code: "def factorial(n):\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result\n\nprint(factorial(5))   # 120" },
      ],
    },
  ],
});
