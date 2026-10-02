/* ===================== Topic 03 - Decisions and Boolean Logic =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: each lesson uses only what the lessons before it taught.
   Booleans -> Logical operators -> if/elif/else -> while -> for -> Nested loops -> Loop control -> Practice
   Python level: t02 material plus if, while, for, range(). No lists, dicts, functions, or try.
   ================================================================================== */
(function () {
  /* ---------- block helpers ---------- */
  const T = (html) => ({ type: "text", html });
  const L = (items, title, ordered) => ({ type: "list", items, title, ordered });
  const N = (html, title, variant) => ({ type: "note", html, title, variant });
  const TB = (head, rows, caption, cls) => ({ type: "table", head, rows, caption, cls });
  const CODE = (code, output, caption, lang) => ({ type: "code", code, output, caption, lang });
  const EX = (code, caption, annot, inputs) => ({ type: "example", code, caption, annot, inputs });
  const RUN = (code, title, inputs) => ({ type: "livecode", code, title: title || "Program", inputs });
  const PQ = (prompt, expected, starter, inputs, hint) => ({ type: "practiceq", prompt, expected, starter, inputs, hint });
  const W = (name, config) => ({ type: "widget", name, config });
  const QZ = (items) => ({ type: "quiz", items });
  const NEXT = (html) => N(html, "Next lesson");
  const IPO = (rows) => TB(["Step", "Result"], rows);
  /* ---------- exercises: the answer is on the same slide (instructor mode) ---------- */
  const PAPER = "Write the output of the program on paper, line by line.";
  const OUT = (text) => CODE(text, null, "output", "text");            // the real output of the program
  const HIDE = (b) => Object.assign(b, { hideOnAnswer: true });        // the block that the answer replaces

  /* ---------- traces: one object drives codeTrace and traceTable ---------- */
  const T_cmp = {
    code: ["temperature = 72", "too_hot = temperature > 70", "too_cold = temperature < 5", "print(too_hot, too_cold)"],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "72 is stored in <code>temperature</code>.", set: { temperature: "72" } },
      { line: 1, note: "<code>72 &gt; 70</code> is True. The result True is stored in <code>too_hot</code>.", set: { too_hot: "True" } },
      { line: 2, note: "<code>72 &lt; 5</code> is False. The result False is stored in <code>too_cold</code>.", set: { too_cold: "False" } },
      { line: 3, note: "Both bool values are displayed. A comparison does not change any variable; it produces a new bool value. Result check: 72 is above 70 and not below 5.", print: "True False" },
    ],
  };

  const T_and = {
    code: ["voltage = 230", "closed = False", "ok = voltage == 230 and closed", 'print("Start:", ok)', "closed = True", "ok = voltage == 230 and closed", 'print("Start:", ok)'],
    steps: [
      { line: -1, note: "Rule: a motor may start when the voltage is 230 V and the door is closed." },
      { line: 0, note: "230 is stored in <code>voltage</code>.", set: { voltage: "230" } },
      { line: 1, note: "The door is open: <code>closed</code> is False.", set: { closed: "False" } },
      { line: 2, note: "<code>voltage == 230</code> is True. <code>True and False</code> is False: both sides must be True.", set: { ok: "False" } },
      { line: 3, note: "The result is displayed.", print: "Start: False" },
      { line: 4, note: "The door is now closed.", set: { closed: "True" } },
      { line: 5, note: "The same expression: <code>True and True</code> is True.", set: { ok: "True" } },
      { line: 6, note: "Result check: both conditions are True, so the motor may start.", print: "Start: True" },
    ],
  };

  const T_if = {
    code: ["temperature = 75", "if temperature > 70:", '    print("Warning: too hot")', 'print("Reading:", temperature)', "temperature = 60", "if temperature > 70:", '    print("Warning: too hot")', 'print("Reading:", temperature)'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "First reading: 75 is stored in <code>temperature</code>.", set: { temperature: "75" } },
      { line: 1, note: "<code>75 &gt; 70</code> is True, so the indented block runs." },
      { line: 2, note: "The block displays the warning.", print: "Warning: too hot" },
      { line: 3, note: "Not indented: this line runs in every case.", print: "Reading: 75" },
      { line: 4, note: "Second reading: 60 replaces 75.", set: { temperature: "60" } },
      { line: 5, note: "<code>60 &gt; 70</code> is False, so the indented block (line 7) is skipped." },
      { line: 7, note: "Not indented: this line runs in every case.", print: "Reading: 60" },
      { line: -1, note: "Result check: only the reading above 70 °C displayed a warning. A loop (Lesson 4) repeats lines without writing them twice." },
    ],
  };

  const T_elif = {
    code: ["t = 25", "if t > 30:", '    print("HOT")', "elif t > 20:", '    print("WARM")', "else:", '    print("COLD")'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "25 is stored in <code>t</code>.", set: { t: "25" } },
      { line: 1, note: "<code>25 > 30</code> is False: the if block is skipped." },
      { line: 3, note: "<code>25 > 20</code> is True: this block runs." },
      { line: 4, note: "The elif block displays WARM.", print: "WARM" },
      { line: -1, note: "The else block is skipped, because one block has already run. Result check: 25 is not above 30 but above 20, so WARM is displayed." },
    ],
  };

  const T_while = {
    code: ["count = 1", "while count <= 3:", "    print(count)", "    count = count + 1", 'print("Done")'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "Initialization: count = 1.", set: { count: "1" } },
      { line: 1, note: "1 <= 3 is True: iteration 1 starts." },
      { line: 2, note: "The current value is displayed.", print: "1" },
      { line: 3, note: "Update: count becomes 2.", set: { count: "2" } },
      { line: 1, note: "2 <= 3 is True: iteration 2 starts." },
      { line: 2, note: "The current value is displayed.", print: "2" },
      { line: 3, note: "Update: count becomes 3.", set: { count: "3" } },
      { line: 1, note: "3 <= 3 is True: iteration 3 starts." },
      { line: 2, note: "The current value is displayed.", print: "3" },
      { line: 3, note: "Update: count becomes 4.", set: { count: "4" } },
      { line: 1, note: "4 <= 3 is False: the loop ends." },
      { line: 4, note: "After the loop. Result check: 3 iterations; the condition was checked 4 times.", print: "Done" },
    ],
  };

  const T_sum = {
    code: ["total = 0", "n = 1", "while n <= 5:", "    total = total + n", "    n = n + 1", 'print("Sum =", total)'],
    steps: [
      { line: -1, note: "<code>total</code> is the accumulator. <code>n</code> is the counter." },
      { line: 0, note: "The accumulator starts at 0, before the loop.", set: { total: "0" } },
      { line: 1, note: "The counter starts at 1.", set: { n: "1" } },
      { line: 2, note: "1 <= 5 is True: iteration 1 starts." },
      { line: 3, note: "0 + 1 → 1. total becomes 1.", set: { total: "1" } },
      { line: 4, note: "Update: n becomes 2.", set: { n: "2" } },
      { line: 2, note: "2 <= 5 is True: iteration 2 starts." },
      { line: 3, note: "1 + 2 → 3. total becomes 3.", set: { total: "3" } },
      { line: 4, note: "Update: n becomes 3.", set: { n: "3" } },
      { line: 2, note: "3 <= 5 is True: iteration 3 starts." },
      { line: 3, note: "3 + 3 → 6. total becomes 6.", set: { total: "6" } },
      { line: 4, note: "Update: n becomes 4.", set: { n: "4" } },
      { line: 2, note: "4 <= 5 is True: iteration 4 starts." },
      { line: 3, note: "6 + 4 → 10. total becomes 10.", set: { total: "10" } },
      { line: 4, note: "Update: n becomes 5.", set: { n: "5" } },
      { line: 2, note: "5 <= 5 is True: iteration 5 starts." },
      { line: 3, note: "10 + 5 → 15. total becomes 15.", set: { total: "15" } },
      { line: 4, note: "Update: n becomes 6.", set: { n: "6" } },
      { line: 2, note: "6 <= 5 is False: the loop ends." },
      { line: 5, note: "After the loop: displayed once. Result check: 1 + 2 + 3 + 4 + 5 = 15.", print: "Sum = 15" },
    ],
  };

  const T_forStr = {
    code: ['word = "AMP"', "for c in word:", "    print(c)", 'print("Done")'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "The string is stored in <code>word</code>.", set: { word: "'AMP'" } },
      { line: 1, note: "c takes the first character: 'A'.", set: { c: "'A'" } },
      { line: 2, note: "The block displays c.", print: "A" },
      { line: 1, note: "c takes the next character: 'M'.", set: { c: "'M'" } },
      { line: 2, note: "The block displays c.", print: "M" },
      { line: 1, note: "c takes the next character: 'P'.", set: { c: "'P'" } },
      { line: 2, note: "The block displays c.", print: "P" },
      { line: 1, note: "No character is left: the loop ends." },
      { line: 3, note: "After the loop. Result check: 3 characters, so 3 iterations.", print: "Done" },
    ],
  };

  const T_forSum = {
    code: ['n = int(input("n: "))', "total = 0", "for i in range(1, n + 1):", "    total = total + i", 'print("Sum =", total)'],
    steps: [
      { line: -1, note: "Test input: 3. The program adds the integers from 1 to n." },
      { line: 0, note: "The user types 3. <code>int()</code> converts <code>'3'</code> to 3.", set: { n: "3" }, print: "n: 3" },
      { line: 1, note: "The accumulator starts at 0, before the loop.", set: { total: "0" } },
      { line: 2, note: "n + 1 is 4: range(1, 4) gives 1, 2, 3. i takes the first value: 1.", set: { i: "1" } },
      { line: 3, note: "0 + 1 → 1. total becomes 1.", set: { total: "1" } },
      { line: 2, note: "i takes the next value: 2. No update statement is needed.", set: { i: "2" } },
      { line: 3, note: "1 + 2 → 3. total becomes 3.", set: { total: "3" } },
      { line: 2, note: "i takes the last value: 3.", set: { i: "3" } },
      { line: 3, note: "3 + 3 → 6. total becomes 6.", set: { total: "6" } },
      { line: 2, note: "No value is left: the loop ends. The stop value 4 is never used." },
      { line: 4, note: "After the loop. Result check: 1 + 2 + 3 = 6.", print: "Sum = 6" },
    ],
  };

  const T_nest = {
    code: ["for i in range(1, 3):", "    for j in range(1, 3):", "        print(i, j)"],
    steps: [
      { line: -1, note: "The outer loop uses i, the inner loop uses j." },
      { line: 0, note: "Outer loop: i = 1.", set: { i: "1" } },
      { line: 1, note: "Inner loop starts: j = 1.", set: { j: "1" } },
      { line: 2, note: "Display i and j.", print: "1 1" },
      { line: 1, note: "Inner loop: j = 2.", set: { j: "2" } },
      { line: 2, note: "Display i and j.", print: "1 2" },
      { line: 1, note: "Inner range finished: back to the outer loop." },
      { line: 0, note: "Outer loop: i = 2.", set: { i: "2" } },
      { line: 1, note: "The inner loop starts again: j = 1.", set: { j: "1" } },
      { line: 2, note: "Display i and j.", print: "2 1" },
      { line: 1, note: "Inner loop: j = 2.", set: { j: "2" } },
      { line: 2, note: "Display i and j.", print: "2 2" },
      { line: 1, note: "Inner range finished: back to the outer loop." },
      { line: 0, note: "The loop ends. Result check: 2 values of i × 2 values of j = 4 lines." },
    ],
  };

  const T_mul = {
    code: ["for i in range(1, 3):", "    for j in range(1, 4):", '        print(i * j, end=" ")', "    print()"],
    steps: [
      { line: -1, note: "i is the row and j is the column. Each value is i * j." },
      { line: 0, note: "Outer loop: row i = 1.", set: { i: "1" } },
      { line: 1, note: "Inner loop starts: j = 1.", set: { j: "1" } },
      { line: 2, note: '1 * 1 → 1. <code>end=" "</code> keeps the output on the same line.', print: "1", end: " " },
      { line: 1, note: "Inner loop: j = 2.", set: { j: "2" } },
      { line: 2, note: "1 * 2 → 2, on the same line.", print: "2", end: " " },
      { line: 1, note: "Inner loop: j = 3.", set: { j: "3" } },
      { line: 2, note: "1 * 3 → 3, on the same line.", print: "3", end: " " },
      { line: 1, note: "Inner range finished: the inner loop ends." },
      { line: 3, note: "<code>print()</code> belongs to the outer block: it ends the row, once for each i.", print: "" },
      { line: 0, note: "Outer loop: row i = 2.", set: { i: "2" } },
      { line: 1, note: "The inner loop starts again: j = 1.", set: { j: "1" } },
      { line: 2, note: "2 * 1 → 2, at the start of the new line.", print: "2", end: " " },
      { line: 1, note: "Inner loop: j = 2.", set: { j: "2" } },
      { line: 2, note: "2 * 2 → 4, on the same line.", print: "4", end: " " },
      { line: 1, note: "Inner loop: j = 3.", set: { j: "3" } },
      { line: 2, note: "2 * 3 → 6, on the same line.", print: "6", end: " " },
      { line: 1, note: "Inner range finished: the inner loop ends." },
      { line: 3, note: "<code>print()</code> ends the second row.", print: "" },
      { line: 0, note: "No value is left: the loop ends. Result check: 2 rows × 3 values = 6 values." },
    ],
  };

  const T_break = {
    code: ["for n in range(1, 6):", "    if n == 3:", "        break", "    print(n)", 'print("After the loop")'],
    steps: [
      { line: -1, note: "range(1, 6) gives 1, 2, 3, 4, 5." },
      { line: 0, note: "n = 1.", set: { n: "1" } },
      { line: 1, note: "1 == 3 is False: break is skipped." },
      { line: 3, note: "Display n.", print: "1" },
      { line: 0, note: "n = 2.", set: { n: "2" } },
      { line: 1, note: "2 == 3 is False: break is skipped." },
      { line: 3, note: "Display n.", print: "2" },
      { line: 0, note: "n = 3.", set: { n: "3" } },
      { line: 1, note: "3 == 3 is True." },
      { line: 2, note: "break: the loop ends now. 4 and 5 are never used." },
      { line: 4, note: "After the loop. Result check: break at 3, so only 1 and 2 were displayed.", print: "After the loop" },
    ],
  };

  const T_nbreak = {
    code: ["for i in range(1, 3):", "    for j in range(1, 4):", "        if j == 2:", "            break", "        print(i, j)", 'print("end")'],
    steps: [
      { line: -1, note: "break ends only the loop that contains it: here, the inner loop." },
      { line: 0, note: "Outer loop: i = 1.", set: { i: "1" } },
      { line: 1, note: "Inner loop starts: j = 1.", set: { j: "1" } },
      { line: 2, note: "1 == 2 is False: break is skipped." },
      { line: 4, note: "Display i and j.", print: "1 1" },
      { line: 1, note: "Inner loop: j = 2.", set: { j: "2" } },
      { line: 2, note: "2 == 2 is True." },
      { line: 3, note: "break: the inner loop ends. j = 3 is never used. The outer loop continues." },
      { line: 0, note: "Outer loop: i = 2.", set: { i: "2" } },
      { line: 1, note: "The inner loop starts again: j = 1.", set: { j: "1" } },
      { line: 2, note: "1 == 2 is False: break is skipped." },
      { line: 4, note: "Display i and j.", print: "2 1" },
      { line: 1, note: "Inner loop: j = 2.", set: { j: "2" } },
      { line: 2, note: "2 == 2 is True." },
      { line: 3, note: "break: the inner loop ends again." },
      { line: 0, note: "No value is left: the outer loop ends normally." },
      { line: 5, note: "After both loops. Result check: break ended the inner loop twice, not the outer.", print: "end" },
    ],
  };

  const T_cont = {
    code: ["for n in range(1, 5):", "    if n % 2 == 0:", "        continue", "    print(n)"],
    steps: [
      { line: -1, note: "range(1, 5) gives 1, 2, 3, 4." },
      { line: 0, note: "n = 1.", set: { n: "1" } },
      { line: 1, note: "1 % 2 == 0 is False." },
      { line: 3, note: "Display n.", print: "1" },
      { line: 0, note: "n = 2.", set: { n: "2" } },
      { line: 1, note: "2 % 2 == 0 is True." },
      { line: 2, note: "continue: print is skipped; go to the next value." },
      { line: 0, note: "n = 3.", set: { n: "3" } },
      { line: 1, note: "3 % 2 == 0 is False." },
      { line: 3, note: "Display n.", print: "3" },
      { line: 0, note: "n = 4.", set: { n: "4" } },
      { line: 1, note: "4 % 2 == 0 is True." },
      { line: 2, note: "continue: print is skipped; go to the next value." },
      { line: 0, note: "No value is left: the loop ends. Result check: only the odd values 1 and 3." },
    ],
  };

  const T_contW = {
    code: ["sensor = 0", "while sensor < 4:", "    sensor += 1", "    if sensor == 3:", "        continue", '    print("Reading sensor", sensor)'],
    steps: [
      { line: -1, note: "Sensor 3 is offline: the program skips it with continue." },
      { line: 0, note: "Initialization: sensor = 0.", set: { sensor: "0" } },
      { line: 1, note: "0 < 4 is True: iteration 1 starts." },
      { line: 2, note: "Update: sensor becomes 1. The update comes before continue.", set: { sensor: "1" } },
      { line: 3, note: "1 == 3 is False: continue is skipped." },
      { line: 5, note: "The reading is displayed.", print: "Reading sensor 1" },
      { line: 1, note: "1 < 4 is True: iteration 2 starts." },
      { line: 2, note: "Update: sensor becomes 2.", set: { sensor: "2" } },
      { line: 3, note: "2 == 3 is False: continue is skipped." },
      { line: 5, note: "The reading is displayed.", print: "Reading sensor 2" },
      { line: 1, note: "2 < 4 is True: iteration 3 starts." },
      { line: 2, note: "Update: sensor becomes 3.", set: { sensor: "3" } },
      { line: 3, note: "3 == 3 is True." },
      { line: 4, note: "continue: line 6 is skipped. Execution returns to the condition in line 2." },
      { line: 1, note: "3 < 4 is True: iteration 4. With the update after continue: an infinite loop." },
      { line: 2, note: "Update: sensor becomes 4.", set: { sensor: "4" } },
      { line: 3, note: "4 == 3 is False: continue is skipped." },
      { line: 5, note: "The reading is displayed.", print: "Reading sensor 4" },
      { line: 1, note: "4 < 4 is False: the loop ends. Result check: sensors 1, 2, and 4 are read." },
    ],
  };

  const T_else = {
    code: ["n = 5","if n < 2:", '    print("Not prime")', "else:", "    for i in range(2, n):", "        if n % i == 0:", '            print("Not prime")', "            break", "    else:", '        print("Prime")'],
    steps: [
      { line: -1, note: "A number below 2 is not prime. Otherwise, search for a divisor from 2 to n - 1." },
      { line: 0, note: "5 is stored in n.", set: { n: "5" } },
      { line: 1, note: "5 < 2 is False: the else block of the if runs. It holds the for loop." },
      { line: 4, note: "i = 2.", set: { i: "2" } },
      { line: 5, note: "5 % 2 == 0 is False: 2 is not a divisor." },
      { line: 4, note: "i = 3.", set: { i: "3" } },
      { line: 5, note: "5 % 3 == 0 is False." },
      { line: 4, note: "i = 4.", set: { i: "4" } },
      { line: 5, note: "5 % 4 == 0 is False." },
      { line: 4, note: "No value is left: the for loop ends without break." },
      { line: 9, note: "No break: the else of the for runs. Result check: no divisor from 2 to 4.", print: "Prime" },
    ],
  };

  const T_exCmp = {
    code: ["x = 4", "y = x * 2", "big = y > 5", "same = x == y", "print(big, same)"],
    steps: [
      { line: 0, note: "4 is stored in x.", set: { x: "4" } },
      { line: 1, note: "4 * 2 → 8.", set: { y: "8" } },
      { line: 2, note: "8 > 5 is True.", set: { big: "True" } },
      { line: 3, note: "4 == 8 is False.", set: { same: "False" } },
      { line: 4, note: "Display both values.", print: "True False" },
    ],
  };

  const T_exLogic = {
    code: ["x = 6", "p = x > 5", "q = x % 2 == 1", "r = p and not q", "print(p, q, r)"],
    steps: [
      { line: 0, note: "6 is stored in x.", set: { x: "6" } },
      { line: 1, note: "6 > 5 is True.", set: { p: "True" } },
      { line: 2, note: "6 % 2 is 0, so 0 == 1 is False.", set: { q: "False" } },
      { line: 3, note: "True and not False → True and True → True.", set: { r: "True" } },
      { line: 4, note: "Display the three values.", print: "True False True" },
    ],
  };

  const T_exElif = {
    code: ["v = 11.5", "if v < 11:", '    state = "LOW"', "elif v > 13:", '    state = "HIGH"', "else:", '    state = "OK"', "print(state)"],
    steps: [
      { line: 0, note: "11.5 is stored in v.", set: { v: "11.5" } },
      { line: 1, note: "11.5 < 11 is False." },
      { line: 3, note: "11.5 > 13 is False." },
      { line: 6, note: "No condition is True: the else block runs.", set: { state: "'OK'" } },
      { line: 7, note: "Display state.", print: "OK" },
    ],
  };

  App.registerTopic({
    id: "t03",
    title: "Decisions and Boolean Logic",
    short: "Decisions & Loops",
    blurb: "Boolean values, comparisons, logical operators, if statements, while and for loops, nested loops, and loop control.",
    intro: "This chapter has two parts. Each lesson uses only what the lessons before it have explained.<br><b>Decisions (Lessons 1 to 3):</b> booleans → logical operators → if / elif / else.<br><b>Loops (Lessons 4 to 7):</b> while → for → nested loops → loop control.<br>Lesson 8 is the chapter practice.",
    lessons: [
      /* =============================== 1. BOOLEANS =============================== */
      {
        id: "boolean",
        title: "Boolean values and comparisons",
        sub: "True and False, comparison operators, and the truth value of other types.",
        slides: "03:4, 7",
        keywords: "bool true false comparison == != < > <= >= chained truthy falsy float round TypeError",
        deck: [
          { kind: "overview", title: "Boolean values and comparisons", blocks: [
            T("A <b>condition</b> is an expression whose result is <code>True</code> or <code>False</code>. Programs use conditions to make decisions (Lesson 3) and to control loops (Lessons 4 to 7)."),
            L(["The bool values True and False", "Comparison operators", "= and ==", "Chained comparisons", "The truth value of other types"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The bool values", title: "True and False", blocks: [
            L([
              "The type <code>bool</code> has exactly two values: <code>True</code> and <code>False</code>.",
              "Both start with a capital letter. <code>true</code> is not a Python value (NameError).",
              "A bool can be stored in a variable: <code>is_running = True</code>.",
              "A bool is usually the <b>result of a comparison</b>.",
            ]),
          ] },
          { kind: "concept", part: "Comparison operators", title: "Six comparison operators", blocks: [
            TB(["Operator", "Meaning", "Example (v = 12)", "Result"], [
              ["<code>==</code>", "equal to", "<code>v == 12</code>", "<code>True</code>"],
              ["<code>!=</code>", "not equal to", "<code>v != 12</code>", "<code>False</code>"],
              ["<code>&gt;</code>", "greater than", "<code>v &gt; 15</code>", "<code>False</code>"],
              ["<code>&lt;</code>", "less than", "<code>v &lt; 15</code>", "<code>True</code>"],
              ["<code>&gt;=</code>", "greater than or equal to", "<code>v &gt;= 12</code>", "<code>True</code>"],
              ["<code>&lt;=</code>", "less than or equal to", "<code>v &lt;= 5</code>", "<code>False</code>"],
            ]),
            T("Arithmetic is done before a comparison: <code>v + 3 == 15</code> computes 12 + 3 first."),
          ] },
          { kind: "code", part: "Comparison operators", title: "First example: execution step by step", blocks: [W("codeTrace", T_cmp)] },
          { kind: "code", part: "Comparison operators", title: "Example: comparing numbers and text", blocks: [
            EX('temperature = 25.0\nprint(temperature == 25)\nprint(temperature != 30)\nprint("A" == "a")', "comparisons with int, float and str", [
              { c: "temperature == 25", e: "25.0 and 25 are equal numbers: <code>True</code>" },
              { c: '"A" == "a"', e: "Strings are compared exactly; capital letters matter: <code>False</code>" },
            ]),
          ] },
          { kind: "code", part: "Comparison operators", title: "Example: a string compared with a number", blocks: [
            EX('level = "10"\nprint(level == 10)\nprint(int(level) == 10)\nprint(level > 5)', "input() returns a str: convert it first", [
              { c: "level == 10", e: "A str and an int are never equal: <code>False</code>. With <code>int(level)</code>: <code>True</code>" },
              { c: "level > 5", e: "<code>TypeError: '&gt;' not supported between instances of 'str' and 'int'</code>" },
            ]),
          ] },
          { kind: "concept", part: "= and ==", title: "Assignment and comparison", blocks: [
            TB(["Symbol", "Meaning", "Example"], [
              ["<code>=</code>", "assignment: store a value in a variable", "<code>x = 5</code>"],
              ["<code>==</code>", "comparison: test equality; the result is True or False", "<code>x == 5</code>"],
            ]),
            T("A comparison always uses <code>==</code>. A single <code>=</code> inside an expression is an error:"),
            CODE("level = 100\nis_full = (level = 100)", "SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?", "the last line of the error message"),
          ] },
          { kind: "concept", part: "Chained comparisons", title: "Checking a range with one expression", blocks: [
            T("A range check needs two comparisons. Python can chain them:"),
            TB(["Expression", "Meaning"], [
              ["<code>20 &lt;= t &lt;= 30</code>", "t is from 20 to 30, both included"],
              ["<code>0 &lt; level &lt; 100</code>", "level is between 0 and 100, both excluded"],
            ]),
            T("A chain is True only when every comparison in it is True."),
          ] },
          { kind: "code", part: "Chained comparisons", title: "Example: temperature in range", blocks: [
            EX("t = 26\nprint(20 <= t <= 30)\nt = 31\nprint(20 <= t <= 30)", "one chained comparison, two values", [
              { c: "t = 26", e: "20 <= 26 and 26 <= 30: <code>True</code>" },
              { c: "t = 31", e: "31 <= 30 is False, so the chain is <code>False</code>" },
            ]),
          ] },
          { kind: "code", part: "Chained comparisons", title: "Example: comparing float values", blocks: [
            EX("x = 0.1 + 0.2\nprint(x == 0.3)\nprint(0.29 < x < 0.31)\nprint(round(x, 2) == 0.3)", "do not use == on a float result", [
              { c: "x == 0.3", e: "x is <code>0.30000000000000004</code> (Topic 02): <code>False</code>" },
              { c: "0.29 < x < 0.31", e: "A range check accepts the small error: <code>True</code>" },
              { c: "round(x, 2) == 0.3", e: "Rounded first, then compared: <code>True</code>" },
            ]),
          ] },
          { kind: "concept", part: "The truth value of other types", title: "Truthy and falsy values", blocks: [
            T("<code>bool(value)</code> converts any value to True or False. A value that converts to False is <b>falsy</b>; every other value is <b>truthy</b>."),
            TB(["False (falsy)", "True (truthy)"], [
              ["<code>0</code>, <code>0.0</code>", "any other number: <code>5</code>, <code>-1</code>, <code>0.01</code>"],
              ["<code>\"\"</code> (empty string)", "any non-empty string: <code>\" \"</code>, <code>\"0\"</code>, <code>\"False\"</code>"],
              ["<code>False</code>, <code>None</code>", "<code>True</code>"],
            ]),
            T("<code>None</code> is a special value that means \"no value\". A condition (Lesson 3) uses the same rule."),
          ] },
          { kind: "code", part: "The truth value of other types", title: "Example: bool() of different values", blocks: [
            EX('print(bool(0))\nprint(bool(0.01))\nprint(bool(""))\nprint(bool(" "))\nprint(bool("0"))', "falsy and truthy values", [
              { c: 'bool(" ")', e: "A space is a character, so the string is not empty: <code>True</code>" },
              { c: 'bool("0")', e: "A non-empty string: <code>True</code>, although it contains the digit 0" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>== != &lt; &gt; &lt;= &gt;=</code> compare two values and give a bool: <code>True</code> or <code>False</code>.",
              "<code>=</code> stores a value. <code>==</code> compares two values.",
              "Convert a str with <code>int()</code> or <code>float()</code> before comparing it with a number.",
              "<code>a &lt;= x &lt;= b</code> checks a range. Compare float results with a range or with <code>round()</code>.",
              "<code>False</code>, <code>0</code>, <code>0.0</code>, <code>\"\"</code>, and <code>None</code> are falsy. Other values are truthy.",
            ]),
            NEXT("<b>Logical operators</b>. <code>and</code>, <code>or</code>, and <code>not</code> combine several conditions into one."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T(PAPER)],
            [RUN("a = 7\nb = 10\nprint(a > b)\nprint(a != b)\nprint(a + 3 == b)\nprint(5 <= a <= 7)")],
          ], answer: [OUT("False\nTrue\nTrue\nTrue")] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("Complete the trace table on paper.<br>1. The first row is complete. Write the other rows."),
            W("traceTable", { trace: T_exCmp, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Complete the code", blocks: [
            PQ("Complete line 2 of the program, so that the program displays the target output.<br>1. Line 2 must store True in <code>is_low</code> when <code>level</code> is below 20.",
              "True", "level = 15\nis_low = \nprint(is_low)\n", null, "Use the comparison level < 20 in line 2."),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Correct the SyntaxError in line 2, so that the program displays the target output.<br>1. Line 2 must store True in <code>is_five</code> when <code>x</code> is equal to 5.",
              "True", "x = 5\nis_five = (x = 5)\nprint(is_five)\n", null, "A comparison uses ==."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Write a program that displays the target output.<br>1. Use this value: voltage 229.5.<br>2. Use a chained comparison: the voltage is from 220 to 240, both included.<br>3. Display the text <code>In range:</code> and the result of the comparison.",
              "In range: True", "# Write your program here\n", null, 'Use print("In range:", 220 <= v <= 240), where v is the voltage.'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`5 != 5` is…", choices: ["True", "False", "5", "Error"], answer: 1, explain: "5 is equal to 5, so 'not equal' is False." },
            { q: "Which value is False when converted with `bool()`?", choices: ["0.5", "\"0\"", "0.0", "\" \""], answer: 2, explain: "0.0 is zero, so it is falsy. \"0\" and \" \" are non-empty strings." },
          ])] },
        ],
      },

      /* =============================== 2. LOGICAL OPERATORS =============================== */
      {
        id: "operators",
        title: "Logical operators",
        sub: "and, or, not, and combining comparisons.",
        slides: "03:5–6, 10",
        keywords: "and or not logical operator truth table precedence short-circuit combine conditions",
        deck: [
          { kind: "overview", title: "Logical operators", blocks: [
            T("A <b>logical operator</b> combines conditions. The result is again True or False."),
            L(["and", "or", "not", "The order of logical operators", "Short-circuit evaluation", "Combining comparisons"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "and", title: "and: both conditions must be True", blocks: [
            T("<code>A and B</code> is True only when <b>both</b> A and B are True."),
            TB(["A", "B", "A and B"], [["True", "True", "True"], ["True", "False", "False"], ["False", "True", "False"], ["False", "False", "False"]], null, "center"),
            T("Example: a motor may start when the voltage is correct <b>and</b> the door is closed."),
          ] },
          { kind: "code", part: "and", title: "First example: execution step by step", blocks: [W("codeTrace", T_and)] },
          { kind: "concept", part: "or", title: "or: at least one condition must be True", blocks: [
            T("<code>A or B</code> is True when at least one of A and B is True. It is False only when both are False."),
            TB(["A", "B", "A or B"], [["True", "True", "True"], ["True", "False", "True"], ["False", "True", "True"], ["False", "False", "False"]], null, "center"),
            T("Example: an alarm sounds when the temperature is too high <b>or</b> the pressure is too high."),
          ] },
          { kind: "code", part: "or", title: "Example: an alarm with two causes", blocks: [
            EX('temp = 85\npressure = 3.0\nalarm = temp > 80 or pressure > 5.0\nprint("Alarm:", alarm)', "one True side is enough", [
              { c: "temp > 80", e: "85 > 80: True" },
              { c: "pressure > 5.0", e: "3.0 > 5.0: False" },
              { c: "True or False", e: "<code>True</code>. Output: <code>Alarm: True</code>" },
            ]),
          ] },
          { kind: "concept", part: "not", title: "not: the opposite value", blocks: [
            T("<code>not A</code> reverses a truth value."),
            TB(["A", "not A"], [["True", "False"], ["False", "True"]], null, "center"),
            CODE("door_open = False\nprint(not door_open)", "True", "example"),
          ] },
          { kind: "concept", part: "The order of logical operators", title: "Which operator is evaluated first", blocks: [
            TB(["Priority", "Operators"], [
              ["1 (first)", "arithmetic (Topic 02): <code>** * / // % + -</code>"],
              ["2", "comparisons: <code>== != &lt; &gt; &lt;= &gt;=</code>"],
              ["3", "<code>not</code>"],
              ["4", "<code>and</code>"],
              ["5 (last)", "<code>or</code>"],
            ]),
            T("Parentheses change the order and make the intention clear: <code>(a or b) and c</code>."),
          ] },
          { kind: "code", part: "The order of logical operators", title: "Example: parentheses change the result", blocks: [
            EX("a = True\nb = False\nc = False\nprint(a or b and c)\nprint((a or b) and c)", "and before or", [
              { c: "a or b and c", e: "and first: b and c → False. Then True or False → <code>True</code>" },
              { c: "(a or b) and c", e: "Parentheses first: True and False → <code>False</code>" },
            ]),
          ] },
          { kind: "code", part: "Short-circuit evaluation", title: "Short-circuit evaluation", blocks: [
            T("<code>and</code> stops at the first False; <code>or</code> stops at the first True. The rest of the expression is not evaluated."),
            EX("count = 0\ntotal = 0\nok = count > 0 and total / count > 50\nprint(ok)\nok = total / count > 50 and count > 0", "the check that protects the division comes first", [
              { c: "line 3", e: "<code>count &gt; 0</code> is False: <code>and</code> stops. The division is not evaluated: <code>False</code>" },
              { c: "line 5", e: "The division is evaluated first: <code>ZeroDivisionError: division by zero</code>" },
            ]),
          ] },
          { kind: "concept", part: "Combining comparisons", title: "Range checks with and and or", blocks: [
            L([
              "Each comparison gives a bool. <code>and</code> and <code>or</code> combine them.",
              "Inside a range: <code>t &gt;= 20 and t &lt;= 30</code>, the same as <code>20 &lt;= t &lt;= 30</code>.",
              "Outside a range: <code>t &lt; 20 or t &gt; 30</code>.",
              "Each side must be a complete comparison. <code>x == 1 or 2</code> is wrong: <code>2</code> alone is truthy (Lesson 1), so the result is truthy for every x. Write <code>x == 1 or x == 2</code>.",
            ]),
          ] },
          { kind: "code", part: "Combining comparisons", title: "Example: inside and outside a range", blocks: [
            EX("t = 35\nin_range = t >= 20 and t <= 30\nout_range = t < 20 or t > 30\nprint(in_range, out_range)", "the two range checks", [
              { c: "t >= 20 and t <= 30", e: "True and False → <code>False</code>" },
              { c: "t < 20 or t > 30", e: "False or True → <code>True</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>and</code> is True only when both sides are True. <code>or</code> is True when at least one side is True.",
              "<code>not</code> reverses a truth value.",
              "Order: arithmetic, comparisons, <code>not</code>, <code>and</code>, then <code>or</code>. Parentheses come first.",
              "Short-circuit: <code>and</code> stops at the first False, <code>or</code> at the first True.",
              "Inside a range: <code>and</code>. Outside a range: <code>or</code>. Each side is a complete comparison.",
            ]),
            NEXT("<b>if statements</b>. A condition decides whether a block of statements runs."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T(PAPER)],
            [RUN("a = 5\nb = 12\nprint(a > 3 and b > 10)\nprint(a > 8 or b > 20)\nprint(not a == 5)\nprint(a < 10 and not b < 10)")],
          ], answer: [OUT("True\nFalse\nFalse\nTrue")] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("Complete the trace table on paper.<br>1. The first row is complete. Write the other rows."),
            W("traceTable", { trace: T_exLogic, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Complete the code", blocks: [
            PQ("Complete line 3 of the program, so that the program displays the target output.<br>1. Line 3 must store True in <code>ok</code> when both conditions are True.<br>2. Condition 1: <code>voltage</code> is from 220 to 240.<br>3. Condition 2: <code>temp</code> is below 60.",
              "Start: True", 'voltage = 230\ntemp = 45\nok = \nprint("Start:", ok)\n', null, "Join the two conditions with and: 220 <= voltage <= 240 and temp < 60."),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Correct the operator in line 2, so that the program displays the target output.<br>1. Line 2 must store True in <code>alarm</code> when <code>pressure</code> is below 2 or above 8.",
              "Alarm: True", 'pressure = 9\nalarm = pressure < 2 and pressure > 8\nprint("Alarm:", alarm)\n', null, "Use or, because a value cannot be below 2 and above 8 at the same time."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Write a program that displays the target output.<br>1. Store the reading 105 in a variable.<br>2. A reading is valid when it is not negative and not above 100.<br>3. Display the text <code>Valid:</code> and the result of the check.",
              "Valid: False", "# Write your program here\n", null, "Use and to join two comparisons: reading >= 0 and reading <= 100."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`True and False` is…", choices: ["True", "False", "Error", "None"], answer: 1, explain: "and needs both sides to be True." },
            { q: "`not (3 > 5)` is…", choices: ["True", "False", "3", "Error"], answer: 0, explain: "3 > 5 is False, and not False is True." },
          ])] },
        ],
      },

      /* =============================== 3. IF / ELIF / ELSE =============================== */
      {
        id: "if-elif-else",
        title: "Decisions: if, else, and elif",
        sub: "Running a block only when a condition is True, and choosing one of several blocks.",
        slides: "03:8–10",
        keywords: "if else elif condition block indentation branch decision nested if truthy",
        deck: [
          { kind: "overview", title: "Decisions: if, else, and elif", blocks: [
            T("An <b>if statement</b> runs a block of statements only when its condition is True. With <code>else</code> and <code>elif</code>, a program chooses exactly one of several blocks."),
            L(["if", "Blocks and indentation", "if and else", "if, elif, and else", "Nested if", "Values and logical operators as conditions"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "if", title: "The if statement", blocks: [
            CODE("if condition:\n    statement\n    statement", null, "syntax"),
            L([
              "Python evaluates the condition.",
              "If it is True, the indented block runs. If it is False, the block is skipped.",
              "The program then continues with the first line after the block.",
            ]),
          ] },
          { kind: "problem", part: "if", title: "Problem: over-temperature warning", blocks: [
            T("A temperature sensor sends two readings: 75 °C and then 60 °C. For each reading:<br>1. The program displays a warning when the temperature is above 70 °C.<br>2. The program always displays the reading."),
            IPO([
              ["Input", "temperature = 75, then temperature = 60"],
              ["Output", "for each reading: a warning (only above 70 °C), then the reading"],
              ["Condition", "temperature &gt; 70"],
              ["Algorithm", "1. Store the reading.<br>2. If it is above 70, display the warning.<br>3. Display the reading.<br>4. Repeat steps 2 and 3 for the second reading."],
            ]),
          ] },
          { kind: "code", part: "if", title: "First example: execution step by step", blocks: [W("codeTrace", T_if)] },
          { kind: "concept", part: "Blocks and indentation", title: "A block is defined by indentation", blocks: [
            L([
              "The block of an if is the group of lines indented under it.",
              "Use 4 spaces for each level. All lines of one block have the same indentation.",
              "The colon <code>:</code> at the end of the if line is required.",
              "Wrong indentation causes an IndentationError, or it changes which lines belong to the block.",
            ]),
          ] },
          { kind: "code", part: "Blocks and indentation", title: "Example: two lines in one block", blocks: [
            EX('level = 60\nif level > 80:\n    print("Battery high")\n    print("Charging stops")\nprint("Check done")', "indentation decides the block", [
              { c: "lines 3 and 4", e: "Both are indented, so both belong to the if block. 60 > 80 is False: both are skipped together." },
              { c: 'print("Check done")', e: "Not indented: it runs in every case. Output: <code>Check done</code>" },
            ]),
          ] },
          { kind: "concept", part: "if and else", title: "Two alternatives: if and else", blocks: [
            CODE("if condition:\n    block A\nelse:\n    block B", null, "syntax"),
            L([
              "If the condition is True, block A runs. Otherwise block B runs.",
              "Exactly one of the two blocks runs.",
              "<code>else</code> has no condition.",
            ]),
          ] },
          { kind: "code", part: "if and else", title: "Example: battery low or OK", blocks: [
            EX('level = 15\nif level < 20:\n    print("Battery low: charge now")\nelse:\n    print("Battery OK")', "one of two blocks runs", [
              { c: "level < 20", e: "15 < 20 is True: the if block runs." },
              { c: "else", e: "Skipped, because the if block ran." },
            ]),
          ] },
          { kind: "concept", part: "if, elif, and else", title: "Several alternatives: elif", blocks: [
            CODE("if condition1:\n    block A\nelif condition2:\n    block B\nelse:\n    block C", null, "syntax"),
            L([
              "The conditions are checked from top to bottom.",
              "The first True condition runs its block. The remaining conditions are not checked, and all other blocks are skipped.",
              "<code>else</code> runs only when no condition is True. elif can be repeated.",
            ]),
          ] },
          { kind: "code", part: "if, elif, and else", title: "First example: execution step by step", blocks: [W("codeTrace", T_elif)] },
          { kind: "visual", part: "if, elif, and else", title: "Which block runs", blocks: [
            W("branchViz", { title: "", var: "t",
              branches: [
                { kw: "if", cond: "t > 30", label: "print('HOT')" },
                { kw: "elif", cond: "t > 20", label: "print('WARM')" },
                { kw: "else", else: true, label: "print('COLD')" },
              ],
              scenarios: [
                { value: 35, evals: [true] },
                { value: 25, evals: [false, true] },
                { value: 12, evals: [false, false] },
              ] }),
          ] },
          { kind: "code", part: "if, elif, and else", title: "Example: several elif, no else", blocks: [
            T("For 45, only <code>level >= 20</code> is True: <code>Low</code> is displayed. Without else, nothing is displayed when no condition is True, for example for 10."),
            RUN('level = 45\nif level >= 80:\n    print("Full")\nelif level >= 50:\n    print("Good")\nelif level >= 20:\n    print("Low")'),
          ] },
          { kind: "code", part: "if, elif, and else", title: "Example: the order of the conditions matters", blocks: [
            EX('level = 90\nif level >= 20:\n    print("Low")\nelif level >= 80:\n    print("Full")', "a wrong order", [
              { c: "level >= 20", e: "90 >= 20 is True, so <code>Low</code> is displayed." },
              { c: "level >= 80", e: "Never checked. Put the highest threshold first." },
            ]),
          ] },
          { kind: "code", part: "if, elif, and else", title: "Example: separate if statements are not elif", blocks: [
            EX('level = 90\nif level >= 80:\n    print("Full")\nif level >= 50:\n    print("Good")\nprint("---")\nif level >= 80:\n    print("Full")\nelif level >= 50:\n    print("Good")', "two if statements, then one if / elif", [
              { c: "lines 2 to 5", e: "Two separate statements: each condition is checked. Both are True: <code>Full</code> and <code>Good</code>" },
              { c: "lines 7 to 10", e: "One statement: after <code>Full</code>, the elif is not checked. Only <code>Full</code>" },
            ]),
          ] },
          { kind: "concept", part: "Nested if", title: "An if inside an if", blocks: [
            CODE("if condition1:\n    if condition2:\n        block A\nelse:\n    block B", null, "syntax"),
            L([
              "An if statement inside the block of another if or else is a <b>nested if</b>.",
              "The inner condition is checked only when the outer block runs.",
              "Each level of nesting is indented by 4 more spaces.",
              "Here, block A runs only when both conditions are True, as with <code>and</code>.",
            ]),
          ] },
          { kind: "code", part: "Nested if", title: "Example: a pump with a power switch", blocks: [
            EX('power_on = True\nlevel = 15\nif power_on:\n    if level < 20:\n        print("Pump ON")\n    else:\n        print("Pump OFF")\nelse:\n    print("No power")', "the level is checked only with power", [
              { c: "if power_on:", e: "True: the inner if (lines 4 to 7) is checked." },
              { c: "if level < 20:", e: "15 < 20 is True: <code>Pump ON</code>" },
              { c: "power_on = False", e: "The outer else runs: <code>No power</code>. Lines 4 to 7 are skipped as one block." },
            ]),
          ] },
          { kind: "code", part: "Values and logical operators as conditions", title: "Example: a value as the condition", blocks: [
            T("The condition of an if can be any value, not only a comparison. Python uses its truth value (Lesson 1): a falsy value counts as False, and a truthy value counts as True."),
            EX('error_code = 3\nif error_code:\n    print("Error", error_code)\nelse:\n    print("No error")', "an int as the condition", [
              { c: "if error_code:", e: "3 is not zero, so it is truthy: <code>Error 3</code>" },
              { c: "error_code = 0", e: "0 is falsy: the else block runs. <code>No error</code>" },
            ]),
          ] },
          { kind: "concept", part: "Values and logical operators as conditions", title: "Combined conditions in if", blocks: [
            T("A condition in if can combine comparisons with <code>and</code>, <code>or</code>, and <code>not</code> (Lesson 2)."),
            CODE('if 20 <= t <= 30 and humidity < 70:\n    print("Comfortable")', null, "example"),
          ] },
          { kind: "code", part: "Values and logical operators as conditions", title: "Example: a pump controller", blocks: [
            EX('level = 15\npower_on = True\nif level < 20 and power_on:\n    print("Pump ON")\nelse:\n    print("Pump OFF")', "two conditions for one decision", [
              { c: "level < 20 and power_on", e: "True and True → True: <code>Pump ON</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>if condition:</code> runs its indented block (4 spaces) only when the condition is True. The colon is required.",
              "<code>if</code> / <code>else</code>: exactly one of two blocks runs.",
              "<code>if</code> / <code>elif</code> / <code>else</code>: the first True condition runs, so the order matters. Separate <code>if</code> statements are each checked.",
              "A nested if is checked only when the outer block runs.",
              "A condition can be any truthy or falsy value. It can use <code>and</code>, <code>or</code>, and <code>not</code>.",
            ]),
            NEXT("<b>while loops</b>. A condition can also decide how many times a block repeats."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Find the output of the program on paper.<br>1. Compute the result of each condition: True or False.<br>2. Write the output.")],
            [RUN('x = 8\ny = 3\nif x % y == 2 and x // y == 2:\n    print("P")\nelif x % y == 2 or x // y == 3:\n    print("Q")\nelse:\n    print("R")')],
          ], answer: [
            OUT("P"),
            T("Line 3: <code>8 % 3 == 2</code> is True, and <code>8 // 3 == 2</code> is True. The <code>elif</code> condition is not checked."),
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("Complete the trace table on paper.<br>1. The first row is complete. Write the other rows."),
            W("traceTable", { trace: T_exElif, blank: true, given: 1, showCode: true }),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Correct the program, so that the program displays the target output.<br>1. Change the order of the two conditions.<br>2. For the temperature 95, the output must be Overheat, not Warm.",
              "Overheat", 't = 95\nif t > 50:\n    print("Warm")\nelif t > 90:\n    print("Overheat")\n', null, "Check the higher threshold first."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Write a program that displays the state of a voltage, as in the target output.<br>1. Read the voltage as a float with the prompt <code>Voltage: </code>.<br>2. Below 210: display Undervoltage.<br>3. Above 250: display Overvoltage.<br>4. Otherwise: display Normal.<br>Test input: 255.",
              "Voltage: 255\nOvervoltage", "# Write your program here\n", ["255"], "Use if for below 210, elif for above 250, and else for Normal."),
          ] },
          { kind: "exercise", title: "Design and write: even or odd", blocks: [
            PQ("Write a program that displays even or odd.<br>1. Complete the three comments first.<br>2. Read an integer with the prompt <code>Number: </code>.<br>3. Display the integer and the text <code>is even</code> or <code>is odd</code>.<br>Test input: 17.",
              "Number: 17\n17 is odd", "# Input:\n# Output:\n# Algorithm:\n\n", ["17"], 'Use if n % 2 == 0 with print(n, "is even"), and else with print(n, "is odd").'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "In an if / elif / else statement, how many blocks run?", choices: ["All of them", "Exactly one", "At most two", "None"], answer: 1, explain: "The first True condition runs its block, or else runs. Exactly one block runs." },
            { q: "What marks the lines of a block in Python?", choices: ["Curly braces", "Semicolons", "Indentation", "The word end"], answer: 2, explain: "Python uses indentation, usually 4 spaces." },
          ])] },
        ],
      },

      /* =============================== 4. WHILE =============================== */
      {
        id: "while-loop",
        title: "while loops",
        sub: "Repeating a block while a condition is True.",
        slides: "03:12, 19",
        keywords: "while loop iteration condition counter accumulator sum product factorial sentinel infinite loop update",
        deck: [
          { kind: "overview", title: "while loops", blocks: [
            T("A <b>loop</b> repeats a block of statements. A <b>while loop</b> repeats its block as long as its condition is True. It is used when the number of repetitions depends on a condition."),
            L(["The while statement", "The three parts of a loop", "Counting", "Accumulating a total", "Repeating until a condition changes", "Infinite loops"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The while statement", title: "The while statement", blocks: [
            CODE("while condition:\n    statement\n    statement", null, "syntax"),
            L([
              "Python evaluates the condition. If it is True, the block runs, and Python returns to the condition.",
              "If it is False, the loop ends. The program continues after the block.",
              "One run of the block is called an <b>iteration</b>.",
            ]),
          ] },
          { kind: "concept", part: "The three parts of a loop", title: "Initialization, condition, and update", blocks: [
            TB(["Part", "Purpose", "Example"], [
              ["Initialization", "give the loop variable its first value, before the loop", "<code>count = 1</code>"],
              ["Condition", "decide whether another iteration runs", "<code>count &lt;= 3</code>"],
              ["Update", "change the loop variable inside the block", "<code>count = count + 1</code>"],
            ]),
            T("Without the update, the condition never becomes False."),
          ] },
          { kind: "code", part: "The three parts of a loop", title: "First example: execution step by step", blocks: [W("codeTrace", T_while)] },
          { kind: "concept", part: "Counting", title: "Counting up and down", blocks: [
            L([
              "A <b>counter</b> is the loop variable. The update decides the step: <code>+ 1</code>, <code>- 1</code>, <code>+ 5</code>.",
              "The condition decides the last value: <code>count &lt;= 3</code> stops after 3.",
              "To count down, start high, subtract in the update, and stop at the lowest value.",
            ]),
          ] },
          { kind: "code", part: "Counting", title: "Example: a countdown", blocks: [
            EX('seconds = 5\nwhile seconds > 0:\n    print(seconds)\n    seconds = seconds - 1\nprint("Start")', "counting down to 1", [
              { c: "seconds > 0", e: "True for 5, 4, 3, 2, 1. False for 0." },
              { c: "seconds - 1", e: "The update counts down. Output: 5 4 3 2 1, then Start" },
            ]),
          ] },
          { kind: "concept", part: "Accumulating a total", title: "The accumulator pattern", blocks: [
            T("An <b>accumulator</b> is a variable that collects a result over the iterations. It gets its start value before the loop, and each iteration updates it. After the loop, it holds the final result."),
            TB(["Result", "Start value", "Update", "Example: 1 to 5"], [
              ["Sum", "<code>0</code>", "<code>total = total + n</code>", "1 + 2 + 3 + 4 + 5 = 15"],
              ["Product", "<code>1</code>", "<code>fact = fact * n</code>", "factorial: 1 × 2 × 3 × 4 × 5 = 120"],
            ]),
            T("A product that starts at 0 stays 0, because 0 × n is 0."),
          ] },
          { kind: "code", part: "Accumulating a total", title: "Example: the sum of 1 to 5", blocks: [W("codeTrace", T_sum)] },
          { kind: "code", part: "Accumulating a total", title: "Two common mistakes with an accumulator", cols: [
            [T("<b>Start value inside the loop.</b> <code>total = 0</code> runs in every iteration, so only the last value remains: <code>Sum = 5</code>."),
              RUN('n = 1\nwhile n <= 5:\n    total = 0\n    total = total + n\n    n = n + 1\nprint("Sum =", total)', "Mistake 1")],
            [T("<b>print inside the loop.</b> The indented <code>print</code> runs in every iteration: five lines, <code>Sum = 1</code>, then 3, 6, 10, and 15."),
              RUN('total = 0\nn = 1\nwhile n <= 5:\n    total = total + n\n    n = n + 1\n    print("Sum =", total)', "Mistake 2")],
          ] },
          { kind: "concept", part: "Repeating until a condition changes", title: "When the number of iterations is not known", blocks: [
            L([
              "A while loop can stop because of a result, not a counter.",
              "Example: halve a number until it reaches 0, and count the steps.",
              "Example: ask for a value again until it is valid.",
              "Example: read values until a stop value is entered. The stop value is called a <b>sentinel</b>.",
            ]),
          ] },
          { kind: "code", part: "Repeating until a condition changes", title: "Example: counting halvings", blocks: [
            EX('num = 20\ncount = 0\nwhile num > 0:\n    num = num // 2\n    count = count + 1\nprint("Count =", count)', "stop when the number reaches 0", [
              { c: "num = num // 2", e: "20 → 10 → 5 → 2 → 1 → 0" },
              { c: "count", e: "Five halvings: <code>Count = 5</code>" },
            ]),
          ] },
          { kind: "code", part: "Repeating until a condition changes", title: "Example: ask again until the value is valid", blocks: [
            EX('level = int(input("Level: "))\nwhile level > 100:\n    print("Invalid, try again")\n    level = int(input("Level: "))\nprint("Level =", level)', "test input: 150, then 80", [
              { c: "while level > 100", e: "150 is invalid: the block asks again." },
              { c: "second input", e: "80 is valid: the loop ends. Output: <code>Level = 80</code>" },
            ], ["150", "80"]),
          ] },
          { kind: "code", part: "Repeating until a condition changes", title: "Example: read values until a stop value", blocks: [
            EX('total = 0\nvalue = int(input("Value: "))\nwhile value != -1:\n    total = total + value\n    value = int(input("Value: "))\nprint("Total =", total)', "test input: 12, 7, 20, then -1", [
              { c: "while value != -1:", e: "-1 is the sentinel. It ends the loop, and it is not part of the data." },
              { c: "value = int(input(...))", e: "Before the loop: the first value. Last line of the block: the next value." },
              { c: "print(...)", e: "After the loop. 12 + 7 + 20: <code>Total = 39</code>" },
            ], ["12", "7", "20", "-1"]),
          ] },
          { kind: "concept", part: "Infinite loops", title: "Infinite loops", blocks: [
            L([
              "If the condition never becomes False, the loop never ends. This is an <b>infinite loop</b>.",
              "Common cause: the update is missing, or it moves the variable away from the stop value.",
              "<code>while True:</code> repeats until a <code>break</code> ends it (Lesson 7).",
              "The editor stops such a program after 5 million steps and displays: <code>The program was stopped after 5 million steps. Check the loop conditions: a loop may never end.</code>",
            ]),
            CODE("count = 1\nwhile count <= 3:\n    print(count)\n# missing: count = count + 1", null, "an infinite loop (do not run): the update is missing"),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>while condition:</code> repeats the block as long as the condition is True.",
              "A loop needs initialization, a condition, and an update.",
              "A counter counts iterations. An accumulator starts before the loop: a sum at 0, a product at 1.",
              "A while loop can also stop on a result: a valid input, or a stop value (sentinel).",
              "A condition that never becomes False gives an infinite loop.",
            ]),
            NEXT("<b>for loops</b>. When the values to go through are known, such as the numbers 1 to 10, a for loop is shorter and cannot forget the update."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T(PAPER)],
            [RUN('x = 1\nwhile x < 20:\n    print(x)\n    x = x * 3\nprint("End:", x)')],
          ], answer: [OUT("1\n3\n9\nEnd: 27")] },
          { kind: "exercise", title: "Trace the iterations", answerCol: 0, cols: [
            [T("Complete the table on paper.<br>1. Write one row for each iteration of the loop."),
              HIDE(TB(["Iteration", "n before", "total after", "n after"], [["1", "3", "", ""], ["2", "", "", ""], ["3", "", "", ""]], null, "center"))],
            [RUN("n = 3\ntotal = 0\nwhile n > 0:\n    total = total + n\n    n = n - 1\nprint(total)")],
          ], answer: [
            TB(["Iteration", "n before", "total after", "n after"], [["1", "3", "3", "2"], ["2", "2", "5", "1"], ["3", "1", "6", "0"]], null, "center"),
          ] },
          { kind: "exercise", title: "Complete the code", blocks: [
            PQ("Complete lines 2 and 4, so that the program displays the target output.<br>1. Line 2: complete the condition of the loop.<br>2. Line 4: complete the update of <code>x</code>.",
              "10\n20\n30\n40\n50", "x = 10\nwhile x <= :\n    print(x)\n    x = \n", null, "The condition is x <= 50, and the update is x = x + 10."),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Correct the condition in line 2, so that the program displays the target output.<br>1. The program must display the numbers from 5 down to 1.",
              "5\n4\n3\n2\n1", "count = 5\nwhile count < 3:\n    print(count)\n    count = count - 1\n", null, "The loop must run while count is greater than 0."),
          ] },
          { kind: "exercise", title: "Write a program: charging", blocks: [
            PQ("Write a <code>while</code> loop, so that the program displays the target output.<br>1. The loop runs while <code>level</code> is below 100.<br>2. Each iteration adds 15 to <code>level</code>.<br>3. Each iteration then displays <code>level</code>.",
              "55\n70\n85\n100", "level = 40\n# Write the loop here\n", null, "Use while level < 100, with level = level + 15 and then print(level) in the loop."),
          ] },
          { kind: "exercise", title: "Design and write: countdown", blocks: [
            PQ("Write a countdown program. Test input: 3.<br>1. Write the algorithm as comments first.<br>2. Read the seconds with the prompt <code>Seconds: </code>.<br>3. Display each number down to 1, then Go.",
              "Seconds: 3\n3\n2\n1\nGo", "# Algorithm:\n\n", ["3"], 'Read the seconds with s = int(input("Seconds: ")).'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`x` starts at 0 and increases by 1. How many times does the block of `while x < 3:` run?", choices: ["2", "3", "4", "It never ends"], answer: 1, explain: "The block runs for x = 0, 1, 2. At x = 3 the condition is False." },
            { q: "A while loop ends when…", choices: ["its condition becomes False", "its block has run once", "the variable is 0", "the program reaches else"], answer: 0, explain: "The condition is checked before every iteration." },
          ])] },
        ],
      },

      /* =============================== 5. FOR =============================== */
      {
        id: "for-loop",
        title: "for loops and range()",
        sub: "Repeating a block once for each value of a sequence.",
        slides: "03:13, 19",
        keywords: "for loop range start stop step string character accumulator maximum largest while or for",
        deck: [
          { kind: "overview", title: "for loops and range()", blocks: [
            T("A <b>for loop</b> runs its block once for each value in a sequence, such as the characters of a string or the numbers produced by <code>range()</code>. The number of iterations is known before the loop starts."),
            L(["The for statement", "range()", "Accumulating with a for loop", "Choosing for or while"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The for statement", title: "The for statement", blocks: [
            CODE("for variable in sequence:\n    statement", null, "syntax"),
            L([
              "In each iteration, the loop variable takes the next value of the sequence.",
              "The block runs once for each value.",
              "The loop ends after the last value. No update statement is needed.",
            ]),
          ] },
          { kind: "code", part: "The for statement", title: "First example: execution step by step", blocks: [W("codeTrace", T_forStr)] },
          { kind: "code", part: "The for statement", title: "Example: counting the characters", blocks: [
            EX('text = "A string"\ncount = 0\nfor c in text:\n    count = count + 1\nprint(count)', "one iteration for each character", [
              { c: "for c in text", e: "8 characters, including the space: 8 iterations" },
              { c: "print(count)", e: "Output: <code>8</code>, the same result as <code>len(text)</code>" },
            ]),
          ] },
          { kind: "concept", part: "range()", title: "range() produces a sequence of integers", blocks: [
            TB(["Call", "Values", "Rule"], [
              ["<code>range(5)</code>", "0, 1, 2, 3, 4", "from 0 to stop - 1"],
              ["<code>range(1, 6)</code>", "1, 2, 3, 4, 5", "from start to stop - 1"],
              ["<code>range(0, 20, 5)</code>", "0, 5, 10, 15", "from start, adding step each time"],
              ["<code>range(5, 0, -2)</code>", "5, 3, 1", "a negative step counts down"],
              ["<code>range(1, n + 1)</code>", "1, 2, …, n", "stop can be an expression; n can come from <code>input()</code>"],
            ]),
            T("The stop value is never included. To include n, the stop value is <code>n + 1</code>."),
          ] },
          { kind: "code", part: "range()", title: "Example: range() with a step", blocks: [
            EX('for i in range(0, 20, 5):\n    print(i, end=" ")\nprint()\nfor i in range(5, 0, -2):\n    print(i, end=" ")', "counting up and counting down", [
              { c: "range(0, 20, 5)", e: "0 5 10 15: the stop value 20 is excluded" },
              { c: "range(5, 0, -2)", e: "5 3 1: 3 iterations" },
            ]),
          ] },
          { kind: "concept", part: "Accumulating with a for loop", title: "The accumulator pattern with for", blocks: [
            L([
              "The accumulator pattern from Lesson 4 works in a for loop too.",
              "The loop variable provides the values; no counter update is needed.",
              "An if inside the loop can select which values are added.",
              "The same structure finds the largest value: a variable keeps the largest value seen so far, and a larger value replaces it.",
            ]),
          ] },
          { kind: "code", part: "Accumulating with a for loop", title: "Example: the sum of 1 to n", blocks: [W("codeTrace", T_forSum)] },
          { kind: "code", part: "Accumulating with a for loop", title: "Example: adding only selected values", blocks: [
            EX('total = 0\nfor i in range(1, 11):\n    if i % 3 == 0 or i % 5 == 0:\n        total = total + i\nprint("Total =", total)', "multiples of 3 or 5 from 1 to 10", [
              { c: "i % 3 == 0 or i % 5 == 0", e: "True for 3, 5, 6, 9, 10" },
              { c: "print(...)", e: "3 + 5 + 6 + 9 + 10: <code>Total = 33</code>" },
            ]),
          ] },
          { kind: "code", part: "Accumulating with a for loop", title: "Example: the largest value so far", blocks: [
            EX('largest = int(input("Reading: "))\nfor k in range(3):\n    value = int(input("Reading: "))\n    if value > largest:\n        largest = value\nprint("Largest =", largest)', "test input: 42, 57, 39, 51", [
              { c: "largest = int(input(...))", e: "The first reading is the largest value seen so far." },
              { c: "if value > largest:", e: "A larger reading replaces it: 57 replaces 42. 39 and 51 do not." },
              { c: "print(...)", e: "Output: <code>Largest = 57</code>. For the smallest value, use <code>&lt;</code>." },
            ], ["42", "57", "39", "51"]),
          ] },
          { kind: "concept", part: "Choosing for or while", title: "for or while", blocks: [
            TB(["Loop", "Use it when", "Example"], [
              ["<code>for</code>", "the values, or the number of iterations, are known", "<code>for i in range(1, 11):</code>"],
              ["<code>while</code>", "the loop stops when a condition changes", "<code>while level &gt; 100:</code>"],
            ]),
            T("Every for loop can be written as a while loop with a counter. The for loop is shorter, and it cannot forget the update."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>for x in sequence:</code> runs the block once for each value.",
              "<code>range(stop)</code>, <code>range(start, stop)</code>, <code>range(start, stop, step)</code>. The stop value is excluded. A negative step counts down.",
              "<code>range(1, n + 1)</code> gives 1 to n.",
              "Accumulators work in for loops too. An if selects the values. A \"largest so far\" variable finds the maximum.",
              "Use for when the values are known. Use while when a condition decides.",
            ]),
            NEXT("<b>Nested loops</b>. A loop can contain another loop, for example to go through rows and columns."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T(PAPER)],
            [RUN('for i in range(2, 11, 4):\n    print(i)\nfor c in "OK":\n    print(c + c)')],
          ], answer: [OUT("2\n6\n10\nOO\nKK")] },
          { kind: "exercise", title: "Determine the values of range()", answerCol: 0, cols: [
            [T("Complete the table on paper. Each row is one loop of the program.<br>1. Values: write the values that the loop displays.<br>2. Iterations: write the number of iterations."),
              HIDE(TB(["Call", "Values", "Iterations"], [["<code>range(4)</code>", "", ""], ["<code>range(3, 8)</code>", "", ""], ["<code>range(10, 0, -3)</code>", "", ""]], null, "center"))],
            [RUN('for i in range(4):\n    print(i, end=" ")\nprint()\nfor i in range(3, 8):\n    print(i, end=" ")\nprint()\nfor i in range(10, 0, -3):\n    print(i, end=" ")')],
          ], answer: [
            TB(["Call", "Values", "Iterations"], [["<code>range(4)</code>", "0 1 2 3", "4"], ["<code>range(3, 8)</code>", "3 4 5 6 7", "5"], ["<code>range(10, 0, -3)</code>", "10 7 4 1", "4"]], null, "center"),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Correct line 1, so that the program displays the target output.<br>1. The program must display the numbers 1 to 5.",
              "1\n2\n3\n4\n5", "for i in range(1, 5):\n    print(i)\n", null, "The stop value of range() is excluded, so range(1, 5) ends at 4."),
          ] },
          { kind: "exercise", title: "Write a program: multiplication table", blocks: [
            PQ("Write a program that displays the 7 multiplication table.<br>1. Use a <code>for</code> loop for the numbers 1 to 5.<br>2. Each line must match the target output.",
              "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35", "# Write your program here\n", null, 'Use for i in range(1, 6) with print(7, "x", i, "=", 7 * i).'),
          ] },
          { kind: "exercise", title: "Write a program: counting multiples", blocks: [
            PQ("Write a program that counts the numbers from 1 to 50 that are divisible by 7.<br>1. Use a <code>for</code> loop to check each number from 1 to 50.<br>2. Display only the count, as in the target output.",
              "7", "# Write your program here\n", null, "Start with count = 0, and add 1 to count when i % 7 == 0 is True."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`for i in range(5, 0, -2):` runs how many times?", choices: ["2", "3", "4", "5"], answer: 1, explain: "The values are 5, 3, and 1." },
            { q: "`range(0, 20, 5)` produces…", choices: ["0 5 10 15 20", "0 5 10 15", "5 10 15 20", "0 to 20"], answer: 1, explain: "The stop value 20 is excluded." },
          ])] },
        ],
      },

      /* =============================== 6. NESTED LOOPS =============================== */
      {
        id: "nested-loops",
        title: "Nested loops",
        sub: "A loop inside another loop.",
        slides: "03:14, 19",
        keywords: "nested loop inner outer rows columns clock table pattern",
        deck: [
          { kind: "overview", title: "Nested loops", blocks: [
            T("A <b>nested loop</b> is a loop inside the block of another loop. The inner loop runs completely for each iteration of the outer loop."),
            L(["The structure of a nested loop", "Counting the iterations", "Nested while loops"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The structure of a nested loop", title: "Outer loop and inner loop", blocks: [
            CODE("for i in range(3):        # outer loop\n    for j in range(2):    # inner loop\n        statement", null, "syntax"),
            L([
              "The outer loop starts its first iteration.",
              "The inner loop then runs all its iterations.",
              "The outer loop moves to its next value, and the inner loop starts again from its first value.",
            ]),
          ] },
          { kind: "code", part: "The structure of a nested loop", title: "First example: execution step by step", blocks: [W("codeTrace", T_nest)] },
          { kind: "concept", part: "Counting the iterations", title: "How often the inner block runs", blocks: [
            L([
              "If the outer loop runs m times and the inner loop runs n times, the inner block runs <b>m × n</b> times.",
              "Example: <code>range(1, 4)</code> inside <code>range(1, 3)</code>: 2 × 3 = 6 runs.",
              "The inner range may depend on the outer variable, for example <code>range(1, i + 1)</code>. Then each outer iteration has a different count.",
            ]),
          ] },
          { kind: "code", part: "Counting the iterations", title: "Example: a multiplication table", blocks: [W("codeTrace", T_mul)] },
          { kind: "code", part: "Counting the iterations", title: "Example: an inner range that depends on i", blocks: [
            EX('for i in range(1, 4):\n    for j in range(1, i + 1):\n        print(j, end=" ")\n    print()', "row i has i values", [
              { c: "range(1, i + 1)", e: "i = 1: j is 1. i = 2: j is 1, 2. i = 3: j is 1, 2, 3." },
              { c: "print()", e: "Ends each row. Output: 3 rows of 1, 2, and 3 values" },
            ]),
          ] },
          { kind: "concept", part: "Nested while loops", title: "Nested while loops", blocks: [
            L([
              "A while loop can also contain another loop.",
              "The inner loop variable must be reset before the inner loop starts again.",
              "A for loop resets its variable automatically; a while loop does not.",
            ]),
          ] },
          { kind: "code", part: "Nested while loops", title: "Example: a clock with while loops", blocks: [
            T("The program displays four times: 8 : 0, 8 : 30, 9 : 0, and 9 : 30. The first line of the outer block, <code>minute = 0</code>, resets the inner variable before the inner loop starts again."),
            RUN('hour = 8\nwhile hour <= 9:\n    minute = 0\n    while minute <= 59:\n        print(hour, ":", minute)\n        minute += 30\n    hour += 1'),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "The inner loop runs completely for each iteration of the outer loop.",
              "The inner block runs m × n times.",
              "<code>end=\" \"</code> keeps values on one line; <code>print()</code> ends the line.",
              "In nested while loops, reset the inner variable.",
            ]),
            NEXT("<b>Loop control</b>. <code>break</code>, <code>continue</code>, <code>pass</code>, and <code>else</code> change the normal flow of a loop."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T(PAPER)],
            [RUN('for i in range(3):\n    for j in range(2):\n        print("*", end="")\n    print()')],
          ], answer: [OUT("**\n**\n**")] },
          { kind: "exercise", title: "Count the iterations", answerCol: 0, cols: [
            [T("Count the iterations of the program on paper.<br>1. Compute the number of times that line 4 runs.<br>2. Write the value that the program displays.")],
            [RUN("count = 0\nfor i in range(1, 5):\n    for j in range(1, 4):\n        count = count + 1\nprint(count)")],
          ], answer: [
            T("Line 4 runs 4 × 3 = 12 times."),
            OUT("12"),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Add one missing line, so that the program displays the target output.<br>1. The program must also display the times of hour 9.",
              "8 : 0\n8 : 30\n9 : 0\n9 : 30", 'hour = 8\nminute = 0\nwhile hour <= 9:\n    while minute <= 59:\n        print(hour, ":", minute)\n        minute += 30\n    hour += 1\n', null, "Store 0 in minute before the inner loop starts again."),
          ] },
          { kind: "exercise", title: "Write a program: a triangle", blocks: [
            PQ("Write a program that displays the triangle in the target output.<br>1. Use an outer loop for the rows 1 to 4.<br>2. Use an inner loop for the stars of a row.<br>3. The number of stars is the row number.",
              "*\n**\n***\n****", "# Write your program here\n", null, 'Use for j in range(1, i + 1) with print("*", end="") for row i, and print() after the inner loop.'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "The outer loop runs 4 times and the inner loop runs 3 times. How many times does the inner block run?", choices: ["3", "4", "7", "12"], answer: 3, explain: "4 × 3 = 12." },
            { q: "In a nested loop, the inner loop…", choices: ["runs once in total", "runs completely for each outer iteration", "runs only after the outer loop ends", "replaces the outer loop"], answer: 1, explain: "The inner loop starts again for every value of the outer loop." },
          ])] },
        ],
      },

      /* =============================== 7. LOOP CONTROL =============================== */
      {
        id: "loop-control",
        title: "break, continue, pass, and loop else",
        sub: "Ending a loop early, skipping an iteration, empty blocks, and else on a loop.",
        slides: "03:15–18",
        keywords: "break continue pass else loop control search prime flag nested break",
        deck: [
          { kind: "overview", title: "break, continue, pass, and loop else", blocks: [
            T("Four statements change the normal flow of a loop, or fill a block that has no action yet."),
            L(["break", "continue", "pass", "else on a loop"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "break", title: "break ends the loop", blocks: [
            L([
              "<code>break</code> ends the loop immediately.",
              "The rest of the block is skipped, and no further iterations run.",
              "The program continues after the loop.",
              "break is placed inside an if: the loop stops when a condition is met.",
            ]),
          ] },
          { kind: "code", part: "break", title: "First example: execution step by step", blocks: [W("codeTrace", T_break)] },
          { kind: "code", part: "break", title: "Example: while True with break", blocks: [
            EX('while True:\n    level = int(input("Level: "))\n    if level <= 100:\n        break\n    print("Invalid, try again")\nprint("Level =", level)', "test input: 150, then 80", [
              { c: "while True:", e: "The condition is always True. Only <code>break</code> ends the loop." },
              { c: "if level <= 100:", e: "150 is invalid: the loop asks again. 80 is valid: break. Output: <code>Level = 80</code>" },
              { c: "input(...)", e: "The Lesson 4 version wrote <code>input()</code> twice. With break, it is written once." },
            ], ["150", "80"]),
          ] },
          { kind: "code", part: "break", title: "Example: break in a nested loop", blocks: [W("codeTrace", T_nbreak)] },
          { kind: "concept", part: "continue", title: "continue skips to the next iteration", blocks: [
            L([
              "<code>continue</code> skips the rest of the current iteration.",
              "The loop continues with the next iteration: the next value in a for loop, or the condition check in a while loop.",
              "continue is placed inside an if: some values are skipped.",
            ]),
          ] },
          { kind: "code", part: "continue", title: "First example: execution step by step", blocks: [W("codeTrace", T_cont)] },
          { kind: "code", part: "continue", title: "Example: continue in a while loop", blocks: [W("codeTrace", T_contW)] },
          { kind: "concept", part: "pass", title: "pass does nothing", blocks: [
            L([
              "<code>pass</code> is a statement that does nothing.",
              "It is used where Python requires a statement, but no action is needed.",
              "Example: a block that is planned but not written yet.",
            ]),
          ] },
          { kind: "code", part: "pass", title: "Example: a block that is not written yet", blocks: [
            EX('for sensor in range(1, 4):\n    if sensor == 2:\n        pass  # to be written\n    print("Sensor", sensor, "read")', "pass does nothing", [
              { c: "pass", e: "No action: sensor 2 is still displayed. Output: Sensor 1, 2, and 3 read" },
              { c: "continue, break", e: "<code>continue</code> would skip sensor 2. <code>break</code> would stop the loop." },
              { c: "without pass", e: "The if block is empty: IndentationError." },
            ]),
          ] },
          { kind: "concept", part: "else on a loop", title: "else on a loop", blocks: [
            CODE("for x in sequence:\n    if found:\n        break\nelse:\n    statement   # runs only without break", null, "syntax"),
            L([
              "The else block of a loop runs once, after the loop, only if the loop ended normally.",
              "If the loop ended with break, the else block is skipped.",
              "Use: a search. break when the value is found; else reports that it was not found.",
            ]),
          ] },
          { kind: "code", part: "else on a loop", title: "First example: execution step by step", blocks: [W("codeTrace", T_else)] },
          { kind: "code", part: "else on a loop", title: "Example: a number that is not prime", blocks: [
            EX('n = 9\nif n < 2:\n    print("Not prime")\nelse:\n    for i in range(2, n):\n        if n % i == 0:\n            print("Not prime")\n            break\n    else:\n        print("Prime")', "a divisor is found", [
              { c: "if n < 2:", e: "False for 9. Without it, 1 would be Prime: <code>range(2, 1)</code> is empty." },
              { c: "n % i == 0", e: "9 % 3 is 0: 3 is a divisor. <code>Not prime</code>" },
              { c: "break", e: "The for loop ends with break, so its else block is skipped." },
            ]),
          ] },
          { kind: "code", part: "else on a loop", title: "Example: a flag variable instead of else", blocks: [
            EX('n = 9\nis_prime = True\nfor i in range(2, n):\n    if n % i == 0:\n        is_prime = False\n        break\nif is_prime and n >= 2:\n    print("Prime")\nelse:\n    print("Not prime")', "a flag replaces the else of the loop", [
              { c: "is_prime = True", e: "The <b>flag</b>: a bool that records a result." },
              { c: "is_prime = False", e: "9 % 3 is 0: the flag changes; break ends the loop." },
              { c: "is_prime and n >= 2", e: "The flag decides: <code>Not prime</code>. <code>n &gt;= 2</code> excludes 0 and 1." },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>break</code> ends the loop immediately. In a nested loop, it ends only the innermost loop.",
              "<code>continue</code> skips the rest of the current iteration.",
              "<code>pass</code> does nothing; it fills a required block.",
              "The else block of a loop runs only when the loop ends without break.",
              "A flag variable records what a loop found. An if after the loop uses it.",
            ]),
            NEXT("<b>Chapter practice</b>. Complete problems that combine decisions and loops."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Find the output of the program on paper.<br>1. Write the output.<br>2. Count the values in the output.")],
            [RUN('for i in range(1, 4):\n    for j in range(1, 4):\n        if i == j:\n            continue\n        print(i * j, end=" ")')],
          ], answer: [
            OUT("2 3 2 6 3 6"),
            T("The output has 6 values, on one line."),
          ] },
          { kind: "exercise", title: "Determine the output: break and else", answerCol: 0, cols: [
            [T("Find the output of the program on paper.<br>1. Decide whether the <code>else</code> block runs.<br>2. Write the output.")],
            [RUN('for c in "SENSOR":\n    if c == "N":\n        print("Found N")\n        break\n    print(c)\nelse:\n    print("No N")')],
          ], answer: [
            OUT("S\nE\nFound N"),
            T("The loop ends with <code>break</code>, so the <code>else</code> block does not run."),
          ] },
          { kind: "exercise", title: "Write a program: the first multiple", blocks: [
            PQ("Write a program that displays the target output.<br>1. Use a <code>for</code> loop to check each number from 51 to 99.<br>2. Display the first number that is divisible by 7.<br>3. Then end the loop with <code>break</code>.",
              "56", "# Write your program here\n", null, "Use for n in range(51, 100), and when n % 7 == 0 is True, use print(n) and then break."),
          ] },
          { kind: "exercise", title: "Write a program: skip invalid readings", blocks: [
            PQ("Write the loop. Test input: 5, -2, 10, 3.<br>1. Read 4 readings (int) with the prompt <code>Reading: </code>.<br>2. Skip a negative reading with <code>continue</code>.<br>3. Display the sum as in the target output.",
              "Reading: 5\nReading: -2\nReading: 10\nReading: 3\nSum = 18", "total = 0\n# Write the loop here\n", ["5", "-2", "10", "3"], "Use if r < 0 with continue, before the reading r is added to total."),
          ] },
          { kind: "exercise", title: "Write a program: prime check", blocks: [
            PQ("Write a program that displays Prime or Not prime for an integer.<br>1. Read the integer <code>n</code> with the prompt <code>n: </code>.<br>2. For <code>n</code> below 2, display Not prime.<br>3. Otherwise, use a <code>for</code> loop with <code>else</code>.<br>Test input: 13.",
              "n: 13\nPrime", "# Write your program here\n", ["13"], "In for i in range(2, n), display Not prime and use break when n % i == 0; display Prime in the else of the for loop."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "What does `continue` do?", choices: ["Ends the loop", "Skips to the next iteration", "Does nothing", "Restarts the program"], answer: 1, explain: "continue ends only the current iteration." },
            { q: "The else block of a loop runs when…", choices: ["the loop ends with break", "the loop ends without break", "the condition is True", "always"], answer: 1, explain: "break skips the else block." },
          ])] },
        ],
      },

      /* =============================== 8. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete problems that combine decisions and loops.",
        slides: "03:21",
        keywords: "practice grade password sum go alarm battery average threshold",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Each problem combines several lessons of this chapter. Solve every problem with the five steps:"),
            L([
              "<b>Understand</b>: the input and the output.",
              "<b>Design</b>: the processing; which steps depend on a condition, and which steps repeat; then the algorithm.",
              "<b>Code</b>: one Python statement for each step.",
              "<b>Test</b>: run the program with the test input.",
              "<b>Correct</b>: if the output differs, find the wrong step, correct it, and test again.",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: grade from a score", blocks: [
            T("Read a score from 0 to 100, and display the grade of the score.<br>Grades: A for 80 or more, B for 70 or more, C for 60 or more, D for 50 or more, otherwise F."),
            IPO([["Input", "score (int)"], ["Output", "the grade"], ["Condition", "if / elif / else, from the highest threshold down"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Write the program for Problem 1.<br>1. Read the score with the prompt <code>Score: </code>.<br>2. Display the text <code>Grade:</code> and the grade.<br>Test input: 73.", "Score: 73\nGrade: B", "# Write your program here\n", ["73"], "Use if, elif, and else from the highest grade down, for example elif score >= 70 for grade B."),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: password", blocks: [
            T("Read a password. Repeat until the password is \"1234\".<br>1. After each wrong password, display รหัสผิด กรุณาลองใหม่.<br>2. After the correct password, display เข้าสู่ระบบสำเร็จ."),
            IPO([["Input", "passwords (str), repeated"], ["Output", "a message after each password"], ["Repetition", "while the password is not \"1234\""]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("Write the program for Problem 2.<br>1. Use the prompt <code>Password: </code>.<br>2. The output must match the target output.<br>Test input: 1111, abcd, 1234.",
              "Password: 1111\nรหัสผิด กรุณาลองใหม่\nPassword: abcd\nรหัสผิด กรุณาลองใหม่\nPassword: 1234\nเข้าสู่ระบบสำเร็จ", "# Write your program here\n", ["1111", "abcd", "1234"], 'Use while pw != "1234" to repeat the message and the input.'),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: sum of five numbers", blocks: [
            T("Read 5 integers and display their sum."),
            IPO([["Input", "5 integers"], ["Output", "the sum"], ["Repetition", "for 5 times: read a number and add it to the total"]]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Write the program for Problem 3.<br>1. Use the prompt <code>Number: </code>.<br>2. Display <code>Sum =</code> and the sum.<br>Test input: 4, 8, 15, 16, 23.",
              "Number: 4\nNumber: 8\nNumber: 15\nNumber: 16\nNumber: 23\nSum = 66", "# Write your program here\n", ["4", "8", "15", "16", "23"], "Start with total = 0, and add int(input(\"Number: \")) to total in a for loop with range(5)."),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: Go for multiples of 3", blocks: [
            T("Display the numbers 1 to 15 on one line.<br>1. Separate the values with one space.<br>2. Replace every multiple of 3 with the text Go."),
            IPO([["Output", "1 2 Go 4 5 Go ..."], ["Repetition", "for i in range(1, 16)"], ["Condition", "i % 3 == 0 → Go, otherwise i"]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", blocks: [
            PQ("Write the program for Problem 4.<br>1. Use <code>end=\" \"</code> in each <code>print()</code>, so that all values are on one line.<br>2. The output must match the target output.", "1 2 Go 4 5 Go 7 8 Go 10 11 Go 13 14 Go", "# Write your program here\n", null, 'Use if i % 3 == 0 with print("Go", end=" "), and else with print(i, end=" ").'),
          ] },
          { kind: "problem", part: "Problem 5", title: "Problem 5: temperature alarm", blocks: [
            T("Read a motor temperature, and display the state of the motor.<br>1. Above 90 °C: display Shutdown.<br>2. Above 70 °C, up to 90 °C: display Warning.<br>3. Otherwise: display Normal."),
            IPO([["Input", "temperature (float)"], ["Output", "Shutdown, Warning, or Normal"], ["Condition", "if t &gt; 90 / elif t &gt; 70 / else"]]),
          ] },
          { kind: "exercise", part: "Problem 5", title: "Problem 5: write the program", blocks: [
            PQ("Write the program for Problem 5.<br>1. Read the temperature with the prompt <code>Temperature: </code>.<br>2. The output must match the target output.<br>Test input: 75.", "Temperature: 75\nWarning", "# Write your program here\n", ["75"], "Check the higher threshold first."),
          ] },
          { kind: "problem", part: "Problem 6", title: "Problem 6: charging steps", blocks: [
            T("Read the start level of a battery, and display the number of charging steps.<br>1. Each charging step adds 12 % to the level.<br>2. Count the steps until the level is 100 % or more."),
            IPO([["Input", "start level (int)"], ["Output", "the number of steps"], ["Repetition", "while level &lt; 100: add 12, count the step"]]),
          ] },
          { kind: "exercise", part: "Problem 6", title: "Problem 6: write the program", blocks: [
            PQ("Write the program for Problem 6.<br>1. Read the start level with the prompt <code>Start level: </code>.<br>2. Display <code>Steps:</code> and the number of steps.<br>Test input: 40. Hand calculation: 40 → 52 → 64 → 76 → 88 → 100 is 5 steps.",
              "Start level: 40\nSteps: 5", "# Write your program here\n", ["40"], "Start with steps = 0, and in while level < 100, add 12 to level and 1 to steps."),
          ] },
          { kind: "problem", part: "Problem 7", title: "Problem 7: average of sensor readings", blocks: [
            T("Display the average of several sensor readings.<br>1. Read the number of readings.<br>2. Read each reading.<br>3. Display the average, rounded to 2 decimal places."),
            IPO([["Input", "count (int), then the readings (float)"], ["Output", "the average"], ["Processing", "total of the readings ÷ count, then <code>round(…, 2)</code>"]]),
          ] },
          { kind: "exercise", part: "Problem 7", title: "Problem 7: write the program", blocks: [
            PQ("Write the program for Problem 7.<br>1. Use the prompts <code>Count: </code> and <code>Reading: </code>.<br>2. The output must match the target output.<br>Test input: 3, 20.5, 22, 21.5.",
              "Count: 3\nReading: 20.5\nReading: 22\nReading: 21.5\nAverage = 21.33", "# Write your program here\n", ["3", "20.5", "22", "21.5"], 'Display the average with print("Average =", round(total / count, 2)).'),
          ] },
          { kind: "problem", part: "Problem 8", title: "Problem 8: the first reading above a limit", blocks: [
            T("Read at most 5 readings, and find the first reading above 50.<br>1. At the first reading above 50, display the position of that reading (1 to 5).<br>2. Then stop: read no more readings.<br>3. If no reading is above 50, display All readings normal."),
            IPO([["Input", "up to 5 readings (int)"], ["Output", "Alarm at reading k, or All readings normal"], ["Repetition", "for k in range(1, 6), with break and else"]]),
          ] },
          { kind: "exercise", part: "Problem 8", title: "Problem 8: write the program", blocks: [
            PQ("Write the program for Problem 8.<br>1. Read each reading with the prompt <code>Reading: </code>.<br>2. The output must match the target output.<br>Test input: 30, 45, 55.",
              "Reading: 30\nReading: 45\nReading: 55\nAlarm at reading 3", "# Write your program here\n", ["30", "45", "55"], 'When r > 50, use print("Alarm at reading", k) and break; use the else of the for loop for "All readings normal".'),
          ] },
          { kind: "summary", title: "Chapter summary: decisions", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1. Booleans", "Comparisons give True or False. <code>==</code> compares; <code>=</code> stores."],
              ["2. Logical operators", "<code>and</code>: both. <code>or</code>: at least one. <code>not</code>: the opposite."],
              ["3. if / elif / else", "The first True condition runs its block. Indentation defines blocks."],
            ]),
          ] },
          { kind: "summary", title: "Chapter summary: loops", blocks: [
            TB(["Lesson", "Key rule"], [
              ["4. while", "Repeats while the condition is True: initialization, condition, update."],
              ["5. for", "One iteration for each value. <code>range()</code> excludes the stop value."],
              ["6. Nested loops", "The inner loop runs completely for each outer iteration."],
              ["7. Loop control", "<code>break</code> ends, <code>continue</code> skips, loop <code>else</code> runs without break."],
            ]),
            N("<b>Topic 04: Flowcharts and pseudocode</b>. The same decisions and loops are drawn as flowcharts and written as pseudocode before the code.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
