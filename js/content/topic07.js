/* ===================== Topic 07 - Data Visualization and Exceptions =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: line plots -> other chart types -> handling exceptions -> exceptions in functions, raise and assert -> trace challenges -> practice.
   Python level: t02-t06 material plus matplotlib.pyplot and try / except / else / finally, raise, assert.
   ======================================================================================== */
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
  /* exercise slides (instructor mode, see CHAPTER-IMPROVEMENT-PROMPT.md §6):
     RUNS: a program that the students write and run themselves (a chart cannot be checked automatically).
     HIDE: the block is hidden while the answer of its slide is shown.
     OUT : the expected output of a "Determine the output" exercise, for `answer`. */
  const RUNS = (code, title, inputs) => Object.assign(RUN(code, title, inputs), { studentRun: true });
  const HIDE = (block) => Object.assign({}, block, { hideOnAnswer: true });
  const OUT = (text) => CODE(text, null, "output", "text");
  const PAPER = "Write the output of the program on paper, line by line.";

  /* ---------- traces ---------- */
  const T_try = {
    code: ['for text in ["12", "4x"]:', "    try:", "        value = int(text)", '        print("Value:", value)', "    except ValueError:", '        print("Not a number:", text)', 'print("Done")'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "text takes the first value, \"12\".", set: { text: "'12'" } },
      { line: 1, note: "try: the following block is watched for errors." },
      { line: 2, note: "int('12') → 12. No error occurs.", set: { value: "12" } },
      { line: 3, note: "The try block completes.", print: "Value: 12" },
      { line: 0, note: "No error occurred, so the except block was skipped. text takes \"4x\".", set: { text: "'4x'" } },
      { line: 1, note: "try: the block is watched again." },
      { line: 2, note: "int('4x') raises a ValueError. value keeps 12. The rest of the try block is skipped." },
      { line: 4, note: "The error type matches except ValueError: its block runs." },
      { line: 5, note: "The except block displays a message.", print: "Not a number: 4x" },
      { line: 6, note: "The loop has ended. The program continues normally. Result check: \"12\" converts to 12; \"4x\" does not.", print: "Done" },
    ],
  };
  const T_func = {
    code: ["def divide(a, b):", "    return a / b", "def safe_divide(a, b):", "    try:", "        return divide(a, b)", "    except ZeroDivisionError:", "        return None", "print(safe_divide(8, 0))"],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "def creates divide. It has no try statement." },
      { line: 2, note: "def creates safe_divide. It calls divide inside a try block." },
      { line: 7, note: "print needs safe_divide(8, 0): the call starts.", set: { "a (safe_divide)": "8", "b (safe_divide)": "0" } },
      { line: 3, note: "try: the following block is watched for errors." },
      { line: 4, note: "divide(a, b) is called with 8 and 0.", set: { "a (divide)": "8", "b (divide)": "0" } },
      { line: 1, note: "8 / 0 raises a ZeroDivisionError. divide ends at once and returns no value.", unset: ["a (divide)", "b (divide)"] },
      { line: 4, note: "The error passes to the caller: this line of safe_divide, inside its try block." },
      { line: 5, note: "The error type matches except ZeroDivisionError: the error is handled here." },
      { line: 6, note: "safe_divide returns None. Its variables disappear.", unset: ["a (safe_divide)", "b (safe_divide)"] },
      { line: 7, note: "The program continues. Result check: 8 / 0 has no result, so None is displayed. With b = 2, line 5 returns 4.0.", print: "None" },
    ],
  };
  /* tryFlow config: the program of "Example: all four blocks" with three inputs.
     out is the whole output so far; every step matches a real run. */
  const TF_blocks = {
    title: "One program, three inputs: 4, 0, and abc",
    blocks: [
      { id: "try", label: "try:", code: '    r = 10 / int(input("Divisor: "))' },
      { id: "except", label: "except ZeroDivisionError:", code: '    print("Division by zero")' },
      { id: "else", label: "else:", code: '    print("Result:", r)' },
      { id: "finally", label: "finally:", code: '    print("Finished")' },
    ],
    scenarios: [
      { label: "Input: 4", steps: [
        { active: "try", note: "int(\"4\") → 4 and 10 / 4 → 2.5: r is 2.5. The try block completes without an error.", out: "Divisor: 4" },
        { active: "else", note: "No error occurred: the except block is skipped, and the else block runs.", out: "Divisor: 4\nResult: 2.5" },
        { active: "finally", note: "The finally block runs last, as always.", out: "Divisor: 4\nResult: 2.5\nFinished" },
      ] },
      { label: "Input: 0", steps: [
        { active: "try", note: "int(\"0\") → 0. 10 / 0 raises a ZeroDivisionError: r receives no value.", out: "Divisor: 0", badge: "ZeroDivisionError", raised: true },
        { active: "except", note: "The error type matches except ZeroDivisionError: the except block runs.", out: "Divisor: 0\nDivision by zero" },
        { active: "finally", note: "An error occurred, so the else block is skipped. The finally block runs last.", out: "Divisor: 0\nDivision by zero\nFinished" },
      ] },
      { label: "Input: abc", steps: [
        { active: "try", note: "int(\"abc\") raises a ValueError. The division does not run.", out: "Divisor: abc", badge: "ValueError", raised: true },
        { active: "finally", note: "No except block matches a ValueError, and else is skipped. The finally block still runs.", out: "Divisor: abc\nFinished", badge: "no match", badgeOn: "except" },
        { active: "", note: "The error was not handled: the program stops. The last line of its traceback is shown.", out: "Divisor: abc\nFinished\nValueError: invalid literal for int() with base 10: 'abc'" },
      ] },
    ],
  };
  const T_raise = {
    code: ["def check_voltage(v):", "    if v < 0:", '        raise ValueError("voltage < 0")', "    return v", "try:", "    check_voltage(-5)", "except ValueError as e:", '    print("Error:", e)'],
    steps: [
      { line: 0, note: "def creates the function." },
      { line: 5, note: "Inside try: check_voltage(-5) is called.", set: { "v (check_voltage)": "-5" } },
      { line: 1, note: "-5 &lt; 0 is True." },
      { line: 2, note: "raise creates a ValueError with the message \"voltage &lt; 0\". The rest of the function is skipped; Python goes to the matching except.", unset: ["v (check_voltage)"] },
      { line: 6, note: "except ValueError matches. e holds the exception object, not a string.", set: { e: { v: "ValueError('voltage < 0')", t: "obj" } } },
      { line: 7, note: "print(e) displays the message of the exception. Result check: -5 &lt; 0, so the message is displayed.", print: "Error: voltage < 0" },
    ],
  };

  /* ---------- trace challenges (generated: edit tools/traces/t07.py, then run "python tools/make-trace.py t07") ---------- */
  // Level 1. x gets 3 values and y gets 2: plt.plot(x, y) stops with a ValueError.
  const C_points = {
    side: true,
    code: ["raw = [21, -1, 26]", "x = []", "y = []", "for i in range(3):", "    x.append(i * 2)", "    if raw[i] > 0:", "        y.append(raw[i])", "print(x)", "print(y)"],
    steps: [
      { line: 0 },
      { line: 1, set: { x: "[]" } },
      { line: 2, set: { y: "[]" } },
      { line: 3, set: { i: "0" } },
      { line: 4, set: { x: "[0]" } },
      { line: 5, test: "True" },
      { line: 6, set: { y: "[21]" } },
      { line: 3, set: { i: "1" } },
      { line: 4, set: { x: "[0, 2]" } },
      { line: 5, test: "False" },
      { line: 3, set: { i: "2" } },
      { line: 4, set: { x: "[0, 2, 4]" } },
      { line: 5, test: "True" },
      { line: 6, set: { y: "[21, 26]" } },
      { line: 3 },
      { line: 7, print: "[0, 2, 4]" },
      { line: 8, print: "[21, 26]" },
    ],
  };

  // Level 1. The bin counts of plt.hist(data, bins=3): a value on a bin edge, and the largest value.
  const C_bins = {
    side: true,
    code: ["counts = [0, 0, 0]", "for v in [13, 16, 10, 14]:", "    i = (v - 10) // 2", "    if i == 3:", "        i = 2", "    counts[i] += 1", "print(counts)"],
    steps: [
      { line: 0, set: { counts: "[0, 0, 0]" } },
      { line: 1, set: { v: "13" } },
      { line: 2, set: { i: "1" } },
      { line: 3, test: "False" },
      { line: 5, set: { counts: "[0, 1, 0]" } },
      { line: 1, set: { v: "16" } },
      { line: 2, set: { i: "3" } },
      { line: 3, test: "True" },
      { line: 4, set: { i: "2" } },
      { line: 5, set: { counts: "[0, 1, 1]" } },
      { line: 1, set: { v: "10" } },
      { line: 2, set: { i: "0" } },
      { line: 3, test: "False" },
      { line: 5, set: { counts: "[1, 1, 1]" } },
      { line: 1, set: { v: "14" } },
      { line: 2, set: { i: "2" } },
      { line: 3, test: "False" },
      { line: 5, set: { counts: "[1, 1, 2]" } },
      { line: 1 },
      { line: 6, print: "[1, 1, 2]" },
    ],
  };

  // Level 2. Line 4 completes, line 5 fails, line 6 is skipped; the second except block matches.
  const C_count = {
    side: true,
    code: ["total = 30", "count = 0", "try:", "    count = int(input(\"Count: \"))", "    total = total / (count - 3)", "    count = count + 1", "except ValueError:", "    total = -1", "except ZeroDivisionError:", "    total = total + count", "print(total, count)"],
    steps: [
      { line: 0, set: { total: "30" } },
      { line: 1, set: { count: "0" } },
      { line: 2 },
      { line: 3, set: { count: "3" }, print: "Count: 3" },
      { line: 4 },
      { line: 6 },
      { line: 8 },
      { line: 9, set: { total: "33" } },
      { line: 10, print: "33 3" },
    ],
  };

  // Level 2. No error: else, then finally. The same statement fails later; except Exception matches.
  const C_volts = {
    side: true,
    code: ["cells = 4", "volts = 12", "try:", "    volts = volts / cells", "except ZeroDivisionError:", "    volts = 0", "else:", "    cells = cells - 4", "finally:", "    volts = volts + 1", "try:", "    volts = volts / cells", "except Exception:", "    print(volts, cells)"],
    steps: [
      { line: 0, set: { cells: "4" } },
      { line: 1, set: { volts: "12" } },
      { line: 2 },
      { line: 3, set: { volts: "3.0" } },
      { line: 7, set: { cells: "0" } },
      { line: 9, set: { volts: "4.0" } },
      { line: 10 },
      { line: 11 },
      { line: 12 },
      { line: 13, print: "4.0 0" },
    ],
  };

  // Level 2. The key exists, the index does not: IndexError. else is skipped, finally runs.
  const C_pins = {
    side: true,
    code: ["pins = {\"led\": 2, \"fan\": 5}", "levels = [0, 1, 1]", "state = -1", "try:", "    pin = pins[\"fan\"]", "    state = levels[pin]", "except KeyError:", "    print(\"no pin\")", "except IndexError:", "    print(\"no level\")", "else:", "    state = state + 1", "finally:", "    print(pin, state)"],
    steps: [
      { line: 0 },
      { line: 1 },
      { line: 2, set: { state: "-1" } },
      { line: 3 },
      { line: 4, set: { pin: "5" } },
      { line: 5 },
      { line: 6 },
      { line: 8 },
      { line: 9, print: "no level" },
      { line: 13, print: "5 -1" },
    ],
  };

  // Level 3. The loop continues after each handled error; r keeps the value of the last valid text.
  const C_texts = {
    side: true,
    code: ["total = 0", "r = 1", "for text in [\"8\", \"x\", \"0\", \"4\"]:", "    try:", "        r = int(text)", "        total = total + 24 // r", "    except ValueError:", "        total = total + r", "    except ZeroDivisionError:", "        r = 2", "print(total, r)"],
    steps: [
      { line: 0, set: { total: "0" } },
      { line: 1, set: { r: "1" } },
      { line: 2, set: { text: "'8'" } },
      { line: 3 },
      { line: 4, set: { r: "8" } },
      { line: 5, set: { total: "3" } },
      { line: 2, set: { text: "'x'" } },
      { line: 3 },
      { line: 4 },
      { line: 6 },
      { line: 7, set: { total: "11" } },
      { line: 2, set: { text: "'0'" } },
      { line: 3 },
      { line: 4, set: { r: "0" } },
      { line: 5 },
      { line: 6 },
      { line: 8 },
      { line: 9, set: { r: "2" } },
      { line: 2, set: { text: "'4'" } },
      { line: 3 },
      { line: 4, set: { r: "4" } },
      { line: 5, set: { total: "17" } },
      { line: 2 },
      { line: 10, print: "17 4" },
    ],
  };

  // Level 3. else and finally in a loop. The third error matches no except block: finally runs, then the program stops.
  const C_stock = {
    side: true,
    code: ["stock = {\"r1\": 5, \"c1\": 0}", "used = 0", "for part in [\"r1\", \"d1\", \"c1\"]:", "    try:", "        n = 10 // stock[part]", "    except KeyError:", "        print(\"no\", part)", "    else:", "        used = used + n", "    finally:", "        print(part, n)", "print(\"used\", used)"],
    steps: [
      { line: 0 },
      { line: 1, set: { used: "0" } },
      { line: 2, set: { part: "'r1'" } },
      { line: 3 },
      { line: 4, set: { n: "2" } },
      { line: 8, set: { used: "2" } },
      { line: 10, print: "r1 2" },
      { line: 2, set: { part: "'d1'" } },
      { line: 3 },
      { line: 4 },
      { line: 5 },
      { line: 6, print: "no d1" },
      { line: 10, print: "d1 2" },
      { line: 2, set: { part: "'c1'" } },
      { line: 3 },
      { line: 4 },
      { line: 5 },
      { line: 10, print: "c1 2\nZeroDivisionError" },
    ],
  };

  // Level 4. An error passes through two functions to the try statement of the main program.
  const C_chain = {
    side: true,
    code: ["def cell(c):", "    return 12 // c", "def show(n):", "    v = cell(n)", "    print(\"cell\", v)", "    return v", "total = 0", "try:", "    total += show(4)", "    total += show(0)", "    total += show(2)", "except ZeroDivisionError:", "    total = total - 1", "print(total)"],
    steps: [
      { line: 0 },
      { line: 2 },
      { line: 6, set: { total: "0" } },
      { line: 7 },
      { line: 8, set: { "n (show)": "4" } },
      { line: 3, set: { "c (cell)": "4" } },
      { line: 1, unset: ["c (cell)"], set: { "v (show)": "3" } },
      { line: 4, print: "cell 3" },
      { line: 5, unset: ["n (show)", "v (show)"], set: { total: "3" } },
      { line: 9, set: { "n (show)": "0" } },
      { line: 3, set: { "c (cell)": "0" } },
      { line: 1, unset: ["c (cell)"] },
      { line: 3, unset: ["n (show)"] },
      { line: 11 },
      { line: 12, set: { total: "2" } },
      { line: 13, print: "2" },
    ],
  };

  // Level 4. 20 > 20 is False; raise ends the function, so level keeps 30. The loop continues after the handled error.
  const C_step = {
    side: true,
    code: ["def step(v):", "    if v > 20:", "        raise ValueError(\"high\")", "    return v + 10", "level = 10", "while level < 40:", "    try:", "        level = step(level)", "    except ValueError as e:", "        print(e, level)", "        level = level * 2", "print(level)"],
    steps: [
      { line: 0 },
      { line: 4, set: { level: "10" } },
      { line: 5, test: "True" },
      { line: 6 },
      { line: 7, set: { "v (step)": "10" } },
      { line: 1, test: "False" },
      { line: 3, unset: ["v (step)"], set: { level: "20" } },
      { line: 5, test: "True" },
      { line: 6 },
      { line: 7, set: { "v (step)": "20" } },
      { line: 1, test: "False" },
      { line: 3, unset: ["v (step)"], set: { level: "30" } },
      { line: 5, test: "True" },
      { line: 6 },
      { line: 7, set: { "v (step)": "30" } },
      { line: 1, test: "True" },
      { line: 2, unset: ["v (step)"] },
      { line: 8 },
      { line: 9, print: "high 30" },
      { line: 10, set: { level: "60" } },
      { line: 5, test: "False" },
      { line: 11, print: "60" },
    ],
  };

  // Level 4. The function handles its own error; assert passes twice, then stops the program on line 9.
  const C_assert = {
    side: true,
    code: ["def num(t):", "    try:", "        return int(t)", "    except ValueError:", "        return 0", "total = 0", "for text in [\"5\", \"2a\", \"-3\"]:", "    n = num(text)", "    assert n >= 0, \"negative\"", "    total = total + n", "print(total)"],
    steps: [
      { line: 0 },
      { line: 5, set: { total: "0" } },
      { line: 6, set: { text: "'5'" } },
      { line: 7, set: { "t (num)": "'5'" } },
      { line: 1 },
      { line: 2, unset: ["t (num)"], set: { n: "5" } },
      { line: 8 },
      { line: 9, set: { total: "5" } },
      { line: 6, set: { text: "'2a'" } },
      { line: 7, set: { "t (num)": "'2a'" } },
      { line: 1 },
      { line: 2 },
      { line: 3 },
      { line: 4, unset: ["t (num)"], set: { n: "0" } },
      { line: 8 },
      { line: 9, set: { total: "5" } },
      { line: 6, set: { text: "'-3'" } },
      { line: 7, set: { "t (num)": "'-3'" } },
      { line: 1 },
      { line: 2, unset: ["t (num)"], set: { n: "-3" } },
      { line: 8, print: "AssertionError" },
    ],
  };
  /* ---------- end of the generated traces ---------- */

  // the task text of a trace challenge (Lesson 5)
  const TRACE = "Complete the trace table on paper. The first row is complete.<br>1. Before the trace, write the output that you expect. Then complete the rows in order.";
  // rows: "two" or "three": the first rows hold no value (a def line, or a list that has no column)
  const TRACE_ROWS = (rows) => TRACE.replace("The first row is", "The first " + rows + " rows are");
  // side: the program is beside the table, and a blank row does not show which line runs
  // given: the number of rows that are complete (default 1)
  const CH = (trace, given) => W("traceTable", { trace, blank: true, given: given || 1, showCode: !!trace.side, hideLines: !!trace.side });

  App.registerTopic({
    id: "t07",
    title: "Data Visualization and Exceptions",
    short: "Visualization & Exceptions",
    blurb: "Line plots, bar charts, scatter plots and histograms with Matplotlib, and handling errors with try, except, raise and assert.",
    intro: "This chapter covers two topics: drawing data with Matplotlib, and handling errors so that a program does not stop. Each lesson uses only what the lessons before it have explained:<br>line plots → other chart types → handling exceptions → raise and assert → trace challenges → practice.",
    lessons: [
      /* =============================== 1. LINE PLOTS =============================== */
      {
        id: "matplotlib-basics",
        title: "Line plots with Matplotlib",
        sub: "Importing Matplotlib, plot(), labels, title, legend, line styles, saving a figure, and plotting computed values.",
        slides: "07:4–7",
        keywords: "matplotlib pyplot plot show xlabel ylabel title legend color linestyle marker format string grid savefig current figure computed values loop",
        deck: [
          { kind: "overview", title: "Line plots with Matplotlib", blocks: [
            T("<b>Matplotlib</b> is a Python library that draws charts from data. Its module <code>pyplot</code> provides one function for each chart part."),
            L(["Importing Matplotlib", "A line plot", "Labels, title, and grid", "Several lines and a legend", "Line styles", "Saving a figure", "Plotting computed values"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Importing Matplotlib", title: "Importing Matplotlib", blocks: [
            L([
              "Matplotlib is a third-party module: <code>pip install matplotlib</code> in a terminal (Topic 05). Google Colab and this site already include it.",
              "<code>import matplotlib.pyplot as plt</code> imports pyplot with the short name plt.",
              "All drawing functions are then called as <code>plt.name(...)</code>.",
            ]),
          ] },
          { kind: "concept", part: "A line plot", title: "plot() and show()", blocks: [
            L([
              "<code>plt.plot(x, y)</code> draws a line through the points (x[0], y[0]), (x[1], y[1]), …",
              "x and y must have the same number of values. With 3 and 2 values, the program stops: <code>ValueError: x and y must have same first dimension, but have shapes (3,) and (2,)</code>",
              "<code>plt.show()</code> displays the figure. Without show(), a program run in VS Code or Thonny displays no chart. On this site the figure appears in the output area.",
            ]),
          ] },
          { kind: "code", part: "A line plot", title: "First example: temperature during a day", blocks: [
            EX("import matplotlib.pyplot as plt\n\nhours = [0, 4, 8, 12, 16, 20]\ntemps = [22, 21, 25, 31, 29, 24]\nplt.plot(hours, temps)\nplt.show()", "run it to see the plot", [
              { c: "hours, temps", e: "Six points: the x values and the y values." },
              { c: "plt.plot(hours, temps)", e: "Draws a line through the six points." },
              { c: "plt.show()", e: "Displays the figure." },
            ]),
          ] },
          { kind: "concept", part: "Labels, title, and grid", title: "Labels, title, and grid", blocks: [
            TB(["Function", "Effect"], [
              ["<code>plt.xlabel(\"Hour\")</code>", "the label of the x axis"],
              ["<code>plt.ylabel(\"Temperature (C)\")</code>", "the label of the y axis"],
              ["<code>plt.title(\"Room temperature\")</code>", "the title above the chart"],
              ["<code>plt.grid(True)</code>", "grid lines that help to read values"],
            ]),
            T("An engineering chart always has labelled axes with units."),
          ] },
          { kind: "code", part: "Labels, title, and grid", title: "Example: a labelled chart", blocks: [
            EX('import matplotlib.pyplot as plt\nhours = [0, 4, 8, 12, 16, 20]\ntemps = [22, 21, 25, 31, 29, 24]\nplt.plot(hours, temps)\nplt.xlabel("Hour")\nplt.ylabel("Temperature (C)")\nplt.title("Room temperature")\nplt.grid(True)\nplt.show()', "the same data with labels, a title, and grid lines", null),
          ] },
          { kind: "concept", part: "Several lines and a legend", title: "Several lines and a legend", blocks: [
            L([
              "Every <code>plt.plot()</code> call draws on the <b>current figure</b> until <code>plt.show()</code> displays it. Several plot() calls therefore give several lines in one chart, and <code>plt.savefig()</code> (later in this lesson) comes before show().",
              "<code>label=\"...\"</code> in plot() names a line.",
              "<code>plt.legend()</code> displays the names in a box. It needs <code>label=</code> in plot(): without a label, the box is empty.",
            ]),
          ] },
          { kind: "code", part: "Several lines and a legend", title: "Example: two sensors", blocks: [
            EX('import matplotlib.pyplot as plt\n\nhours = [0, 6, 12, 18]\nroom = [22, 24, 31, 26]\nroof = [18, 20, 34, 23]\nplt.plot(hours, room, label="Room")\nplt.plot(hours, roof, label="Roof")\nplt.legend()\nplt.show()', "two sensors, two lines in one chart", [
              { c: 'label="Room"', e: "The name of the first line." },
              { c: "plt.legend()", e: "Shows both names with their colors." },
            ]),
          ] },
          { kind: "concept", part: "Line styles", title: "Colors, line styles, and markers", blocks: [
            TB(["Argument", "Examples", "Effect"], [
              ["<code>color=</code>", "<code>\"red\"</code>, <code>\"blue\"</code>", "the color of the line, by name"],
              ["<code>color=</code>", "<code>\"r\"</code>, <code>\"g\"</code>, <code>\"b\"</code>, <code>\"k\"</code>", "by short code: red, green, blue, black"],
              ["<code>linestyle=</code>", "<code>\"-\"</code>, <code>\"--\"</code>, <code>\":\"</code>", "solid, dashed, dotted"],
              ["<code>marker=</code>", "<code>\"o\"</code>, <code>\"s\"</code>, <code>\"x\"</code>", "a symbol at each point"],
              ["<code>linewidth=</code>", "<code>2</code>", "the thickness of the line"],
            ]),
            T("A <b>format string</b> as the third argument combines color, marker and line style: <code>plt.plot(x, y, \"ro--\")</code> is the short form of <code>color=\"red\", marker=\"o\", linestyle=\"--\"</code>."),
          ] },
          { kind: "code", part: "Line styles", title: "Example: a styled line", blocks: [
            EX('import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4]\ny = [3, 5, 4, 6]\nplt.plot(x, y, color="red",\n         linestyle="--", marker="o")\nplt.show()', "a red dashed line with circles", null),
          ] },
          { kind: "concept", part: "Saving a figure", title: "Saving a figure", blocks: [
            L([
              "<code>plt.savefig(\"chart.png\")</code> saves the figure as an image file.",
              "Call savefig before <code>plt.show()</code>.",
              "In VS Code or Thonny, show() opens a window. Closing the window clears the figure, so a savefig after show() saves an empty image.",
              "The file type follows the name: <code>.png</code>, <code>.pdf</code>, <code>.jpg</code>.",
            ]),
            CODE('plt.plot(hours, temps)\nplt.savefig("temperature.png")\nplt.show()', null, "example"),
          ] },
          { kind: "code", part: "Plotting computed values", title: "Example: power computed in a loop", blocks: [
            EX('import matplotlib.pyplot as plt\ncurrents = [0, 1, 2, 3, 4, 5]\np12 = []\np24 = []\nfor current in currents:\n    p12.append(12 * current)\n    p24.append(24 * current)\nplt.plot(currents, p12, label="12 V")\nplt.plot(currents, p24, label="24 V")\nplt.xlabel("Current (A)")\nplt.ylabel("Power (W)")\nplt.legend()\nplt.show()', "P = V × I at 12 V and at 24 V", [
              { c: "p12.append(12 * current)", e: "The loop computes P = V × I for each current: p12 becomes [0, 12, 24, 36, 48, 60]." },
              { c: 'plt.plot(currents, p12, label="12 V")', e: "The computed list is the y data. Check one point by hand: 12 V × 2 A = 24 W." },
              { c: 'plt.ylabel("Power (W)")', e: "Both axes name the quantity and its unit." },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>import matplotlib.pyplot as plt</code>, then <code>plt.plot(x, y)</code> and <code>plt.show()</code>. x and y have the same number of values.",
              "<code>xlabel</code>, <code>ylabel</code>, <code>title</code>, and <code>grid</code> make a chart readable.",
              "Every plot() call draws on the current figure until show(): several calls give several lines, which <code>label=</code> and <code>legend()</code> name, and <code>savefig()</code> comes before show().",
              "<code>color</code>, <code>linestyle</code>, <code>marker</code>, or a format string such as <code>\"ro--\"</code>, style a line.",
              "The lists for plot() can be computed in a loop.",
            ]),
            NEXT("<b>Other chart types</b>. Bar charts, scatter plots, and histograms."),
          ] },
          { kind: "exercise", title: "Write a program: a labelled plot", blocks: [
            T("Write a program that draws a line plot of the battery level over time.<br>1. Use these values: minutes 0, 10, 20, 30 and battery levels 100, 82, 65, 47.<br>2. Add the x-axis label \"Time (min)\" and the y-axis label \"Battery (%)\".<br>3. Add a title."),
            T("Expected chart: one blue line through 4 points. The line falls from 100 at 0 min to 47 at 30 min."),
            RUNS("import matplotlib.pyplot as plt\n\n# Write your program here\n"),
          ] },
          { kind: "exercise", title: "Modify the plot", cols: [
            [T("Change line 5 of the program: <code>plt.plot(x, y)</code>.<br>1. Change the color of the line to green.<br>2. Change the line style to dotted.<br>3. Add a square marker at each point.<br>Expected chart: one green dotted line with a square at each of the 4 points.")],
            [RUNS('import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4]\ny = [3, 5, 4, 6]\nplt.plot(x, y)\nplt.show()')],
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which function adds the names of the lines to a chart?", choices: ["plt.title()", "plt.legend()", "plt.xlabel()", "plt.grid()"], answer: 1, explain: "legend() displays the label of each line." },
            { q: "When should `plt.savefig()` be called?", choices: ["before plt.show()", "after plt.show()", "before import", "never"], answer: 0, explain: "Closing the show() window clears the figure, so a later savefig saves an empty image." },
          ])] },
        ],
      },

      /* =============================== 2. CHART TYPES =============================== */
      {
        id: "chart-types",
        title: "Bar charts, scatter plots, and histograms",
        sub: "Choosing and drawing the right chart for the data.",
        slides: "07:8–11",
        keywords: "bar scatter hist histogram bins chart type categories distribution",
        deck: [
          { kind: "overview", title: "Bar charts, scatter plots, and histograms", blocks: [
            T("Each chart type answers a different question about data."),
            L(["Bar charts", "Scatter plots", "Histograms", "Choosing a chart"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Bar charts", title: "Bar charts", blocks: [
            L([
              "<code>plt.bar(categories, values)</code> draws one bar for each category.",
              "Use it to compare values between named groups, such as the energy of each machine.",
              "categories is a list of strings; values is a list of numbers.",
            ]),
          ] },
          { kind: "code", part: "Bar charts", title: "Example: energy per machine", blocks: [
            EX('import matplotlib.pyplot as plt\n\nmachines = ["Pump", "Fan", "Heater"]\nenergy = [12, 5, 20]\nplt.bar(machines, energy)\nplt.ylabel("Energy (kWh)")\nplt.show()', "one bar per machine", null),
          ] },
          { kind: "concept", part: "Scatter plots", title: "Scatter plots", blocks: [
            L([
              "<code>plt.scatter(x, y)</code> draws one point for each pair, without lines.",
              "Use it to see whether two measured quantities are related, such as voltage and current.",
            ]),
          ] },
          { kind: "code", part: "Scatter plots", title: "Example: voltage and current", blocks: [
            EX('import matplotlib.pyplot as plt\n\nvoltage = [1, 2, 3, 4, 5]\ncurrent = [0.21, 0.39, 0.62,\n           0.80, 1.01]\nplt.scatter(voltage, current)\nplt.xlabel("Voltage (V)")\nplt.ylabel("Current (A)")\nplt.show()', "points close to a straight line", null),
          ] },
          { kind: "concept", part: "Histograms", title: "Histograms", blocks: [
            L([
              "<code>plt.hist(data, bins=5)</code> divides the range of the data into intervals (bins) and draws how many values fall into each.",
              "Use it to see the <b>distribution</b> of many measurements: where most values are, and how far they spread.",
              "data is one list of numbers, not x and y.",
            ]),
          ] },
          { kind: "code", part: "Histograms", title: "Example: distribution of resistor values", blocks: [
            EX('import matplotlib.pyplot as plt\n\nohms = [98, 101, 100, 99, 103,\n        100, 97, 102, 100, 101]\nplt.hist(ohms, bins=4)\nplt.xlabel("Resistance (ohm)")\nplt.ylabel("Count")\nplt.show()', "ten measurements in 4 bins", [
              { c: "bins=4", e: "97 to 103 is divided into 4 intervals, each 1.5 ohm wide." },
              { c: "plt.hist(ohms, bins=4)", e: "Bar heights 2, 1, 5, 2: most values are close to 100 ohm." },
            ]),
          ] },
          { kind: "concept", part: "Histograms", title: "How the values fall into the bins", blocks: [
            TB(["Bin", "Range (ohm)", "Values", "Count"], [
              ["1", "97 ≤ value &lt; 98.5", "97, 98", "2"],
              ["2", "98.5 ≤ value &lt; 100", "99", "1"],
              ["3", "100 ≤ value &lt; 101.5", "100, 100, 100, 101, 101", "5"],
              ["4", "101.5 ≤ value ≤ 103", "102, 103", "2"],
            ], "The previous example: bins=4, each (103 − 97) / 4 = 1.5 ohm wide", "center"),
            T("A value on a bin edge belongs to the bin on its right: 100 is in bin 3. The largest value, 103, is in the last bin."),
          ] },
          { kind: "concept", part: "Choosing a chart", title: "Choosing a chart", blocks: [
            TB(["Question", "Chart", "Function"], [
              ["How does a value change over time?", "line plot", "<code>plt.plot(x, y)</code>"],
              ["How do named groups compare?", "bar chart", "<code>plt.bar(names, values)</code>"],
              ["Are two quantities related?", "scatter plot", "<code>plt.scatter(x, y)</code>"],
              ["How are many values distributed?", "histogram", "<code>plt.hist(data, bins)</code>"],
            ]),
            T("<code>bar()</code> takes values that are already counted or measured, one for each category. <code>hist()</code> takes the raw data and counts the values in each bin itself."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>bar()</code> compares named groups: one given value for each group.",
              "<code>scatter()</code> shows points to reveal a relation.",
              "<code>hist()</code> counts raw data and shows how many values fall into each interval.",
              "Choose the chart by the question that the data should answer.",
            ]),
            NEXT("<b>Handling exceptions</b>. A program can react to errors instead of stopping."),
          ] },
          { kind: "exercise", title: "Choose the chart", blocks: [
            T("Write the best chart type for each data set on paper."),
            HIDE(TB(["Data", "Chart"], [
              ["The power consumption of 5 departments", ""],
              ["The motor temperature every minute for one hour", ""],
              ["200 measured cable lengths", ""],
              ["Speed and fuel consumption of 30 test drives", ""],
            ])),
          ], answer: [
            TB(["Data", "Chart", "Reason"], [
              ["The power consumption of 5 departments", "bar chart", "named groups are compared"],
              ["The motor temperature every minute for one hour", "line plot", "a value changes over time"],
              ["200 measured cable lengths", "histogram", "the distribution of many values"],
              ["Speed and fuel consumption of 30 test drives", "scatter plot", "the relation of two quantities"],
            ]),
          ] },
          { kind: "exercise", title: "Write a program: a bar chart", cols: [
            [T("Write a program that draws a bar chart of the monthly production.<br>1. Use these values: Jan 120, Feb 135, Mar 128 units.<br>2. Add a y-axis label.<br>3. Add a title.<br>Expected chart: three bars with heights 120, 135, 128.")],
            [RUNS("import matplotlib.pyplot as plt\n\n# Write your program here\n")],
          ] },
          { kind: "exercise", title: "Write a program: a histogram", cols: [
            [T("Complete the program, so that it draws a histogram of the test scores in the list <code>scores</code>.<br>Use 3 bins.<br>Expected chart: three bars with heights 2, 5, 3.")],
            [RUNS("import matplotlib.pyplot as plt\n\nscores = [55, 62, 68, 70, 71,\n          75, 78, 80, 85, 92]\n# Write the histogram here\n")],
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which chart shows how many values fall into each interval?", choices: ["bar", "scatter", "hist", "plot"], answer: 2, explain: "A histogram counts values per interval (bin)." },
            { q: "Which function draws points without connecting lines?", choices: ["plt.plot()", "plt.scatter()", "plt.bar()", "plt.hist()"], answer: 1, explain: "scatter draws only the points." },
          ])] },
        ],
      },

      /* =============================== 3. HANDLING EXCEPTIONS =============================== */
      {
        id: "exceptions",
        title: "Handling exceptions",
        sub: "try and except, several except blocks, else, and finally.",
        slides: "07:13–20",
        keywords: "exception try except else finally valueerror zerodivisionerror indexerror keyerror typeerror handling except exception as e traceback",
        deck: [
          { kind: "overview", title: "Handling exceptions", blocks: [
            T("An <b>exception</b> is an error that occurs while a program runs (a runtime error, Topic 02). Without handling, it stops the program. With <code>try</code> and <code>except</code>, the program reacts and continues."),
            L(["Built-in exceptions", "try and except", "Several except blocks", "else and finally"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Built-in exceptions", title: "Common built-in exceptions", blocks: [
            TB(["Exception", "Cause", "Example"], [
              ["<code>ValueError</code>", "an unsuitable value", "<code>int(\"abc\")</code>"],
              ["<code>ZeroDivisionError</code>", "division by zero", "<code>10 / 0</code>"],
              ["<code>TypeError</code>", "incompatible types", "<code>\"a\" + 1</code>"],
              ["<code>IndexError</code>", "an index outside a list or string", "<code>[1, 2][5]</code>"],
              ["<code>KeyError</code>", "a missing dictionary key", "<code>{}[\"x\"]</code>"],
              ["<code>FileNotFoundError</code>", "a file that does not exist (Topic 08)", "<code>open(\"no.txt\")</code>"],
            ]),
            T("The last line of a traceback starts with the name of the exception (Topic 02). That name is written after <code>except</code>."),
          ] },
          { kind: "concept", part: "try and except", title: "try and except", blocks: [
            CODE("try:\n    statements that may fail\nexcept ErrorType:\n    statements that handle the error", null, "syntax"),
            L([
              "Python runs the try block. If no error occurs, the except block is skipped.",
              "If an error occurs, the rest of the try block is skipped. If the error type matches, the except block runs.",
              "After the try statement, the program continues normally.",
              "If no except block matches the error type, the error is not handled: the program stops with a traceback (Topic 02).",
            ]),
          ] },
          { kind: "code", part: "try and except", title: "First example: execution step by step", blocks: [W("codeTrace", T_try)] },
          { kind: "code", part: "try and except", title: "Example: safe input", blocks: [
            EX('try:\n    n = int(input("Number: "))\n    print("Double:", n * 2)\nexcept ValueError:\n    print("Enter a whole number.")', "test input: abc", [
              { c: 'int(input("Number: "))', e: "\"abc\" raises a ValueError." },
              { c: "except ValueError", e: "The message is displayed; the program does not stop." },
            ], ["abc"]),
          ] },
          { kind: "concept", part: "Several except blocks", title: "Several except blocks", blocks: [
            L([
              "A try statement can have several except blocks, one for each error type. Python checks them from top to bottom: the first matching block runs, and the others are skipped.",
              "<code>except (ValueError, TypeError):</code> handles two types in one block.",
              "<code>except ValueError as e:</code> stores the error in e; <code>print(e)</code> shows its message.",
              "<code>except Exception as e:</code> catches any remaining error. It must be the last except block: placed first, it matches every error, and the specific blocks never run.",
              "Catching every error also hides programming mistakes, such as a misspelled variable name (NameError). Name the expected types when they are known.",
            ]),
          ] },
          { kind: "code", part: "Several except blocks", title: "Example: division with two possible errors", blocks: [
            EX('try:\n    a = int(input("a: "))\n    b = int(input("b: "))\n    print(a / b)\nexcept ValueError:\n    print("Not a number")\nexcept ZeroDivisionError as e:\n    print("Error:", e)', "test input: 10 and 0", [
              { c: "a / b", e: "b is 0: a ZeroDivisionError" },
              { c: "except ZeroDivisionError as e", e: "The second block matches. e holds the error." },
              { c: 'print("Error:", e)', e: "Displays the message of Python itself: <code>Error: division by zero</code>" },
            ], ["10", "0"]),
          ] },
          { kind: "concept", part: "else and finally", title: "else and finally", blocks: [
            TB(["Block", "Runs when"], [
              ["<code>try</code>", "always first"],
              ["<code>except</code>", "an error of its type occurred in try"],
              ["<code>else</code>", "no error occurred in try"],
              ["<code>finally</code>", "always, last, with or without an error"],
            ]),
            T("Statements that depend on the success go into else, not into try: the except blocks then handle only the errors of the statement that can fail."),
            T("finally is used for work that must always happen, such as closing a file (Topic 08). It also runs when no except block matches; the program then stops with the traceback."),
          ] },
          { kind: "code", part: "else and finally", title: "Example: all four blocks", blocks: [W("tryFlow", TF_blocks)] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "try runs the statements that can fail; after an error, the rest of the try block is skipped.",
              "The first matching except block runs. <code>except Exception</code> catches any remaining error and comes last.",
              "else runs only without an error; finally always runs.",
            ]),
            TB(["Divisor", "try", "except", "else", "finally", "Output"], [
              ["4", "completes", "skipped", "runs", "runs", "Result: 2.5, Finished"],
              ["0", "ZeroDivisionError", "runs", "skipped", "runs", "Division by zero, Finished"],
              ["abc", "ValueError", "no match", "skipped", "runs", "Finished, then the traceback"],
            ], "The example with all four blocks (except ZeroDivisionError) and three inputs", "center"),
            NEXT("<b>raise and assert</b>. Errors inside functions, and errors that a program creates on purpose."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T(PAPER)],
            [RUN('values = [4, 8]\ntry:\n    print(values[1])\n    print(values[5])\n    print("end of try")\nexcept IndexError:\n    print("bad index")')],
          ], answerCol: 0, answer: [OUT("8\nbad index")] },
          { kind: "exercise", title: "Determine the output: else", cols: [
            [T("Determine the output of the program.<br>1. Decide which blocks of the try statement run.<br>2. Write the output on paper, line by line.")],
            [RUN('try:\n    x = int("25")\nexcept ValueError:\n    print("error")\nelse:\n    print("ok", x)\nfinally:\n    print("end")')],
          ], answerCol: 0, answer: [
            T("The try block, the else block, and the finally block run. The except block is skipped."),
            OUT("ok 25\nend"),
          ] },
          { kind: "exercise", title: "Write a program: safe division", blocks: [
            PQ("Write a program that reads two integers and displays a / b.<br>1. Use the prompts <code>a: </code> and <code>b: </code>.<br>2. For a ValueError, display \"Not a number\".<br>3. For a ZeroDivisionError, display \"Cannot divide by zero\".<br>Test input: 7 and 0.",
              "a: 7\nb: 0\nCannot divide by zero", "# Write your program here\n", ["7", "0"], "Use one try statement with two except blocks, one for each error type."),
          ] },
          { kind: "exercise", title: "Correct the error type", blocks: [
            PQ("The program stops with a KeyError. Correct line 4 (the <code>except</code> line), so that the program displays the target output.",
              "missing", 'd = {"a": 1}\ntry:\n    print(d["b"])\nexcept IndexError:\n    print("missing")\n', null, "The except line names the wrong error type. A missing dictionary key raises a KeyError."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "When does the else block of a try statement run?", choices: ["always", "when an error occurs", "when no error occurs", "never"], answer: 2, explain: "else runs only if the try block completed without an error." },
            { q: "Which block runs whether an error occurs or not?", choices: ["try", "except", "else", "finally"], answer: 3, explain: "finally always runs." },
          ])] },
        ],
      },

      /* =============================== 4. RAISE AND ASSERT =============================== */
      {
        id: "raise-assert",
        title: "raise and assert",
        sub: "Errors inside functions, creating errors on purpose, and checking conditions while testing.",
        slides: "07:21–24",
        keywords: "raise assert assertionerror valueerror validation message function caller safe_divide return none",
        deck: [
          { kind: "overview", title: "raise and assert", blocks: [
            T("An error inside a function passes to the code that called the function. A program can also create an error on purpose when data is invalid."),
            L(["Exceptions and functions", "raise", "assert"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Exceptions and functions", title: "An error inside a function", blocks: [
            L([
              "An error that a function does not handle ends the function at once: the function returns no value.",
              "The error passes to the <b>caller</b>, the statement that called the function. A try statement around the call handles it.",
              "If the caller does not handle the error, it passes on in the same way. When no code handles it, the program stops with a traceback (Topic 02).",
              "A function can also handle its own error: a try statement inside the function, with a <code>return</code> in the try block and in the except block. The caller then receives a value in both cases.",
            ]),
          ] },
          { kind: "code", part: "Exceptions and functions", title: "First example: execution step by step", blocks: [W("codeTrace", T_func)] },
          { kind: "concept", part: "raise", title: "raise creates an exception", blocks: [
            L([
              "<code>raise ValueError(\"message\")</code> creates a ValueError with a message.",
              "A value can be valid for Python but wrong for the problem: a battery level of 150 %, a negative resistance. Python reports no error for it, so the program raises the error itself.",
              "A raised error behaves as any other error: the rest of the block is skipped, and the error passes to the nearest matching except, also in the caller.",
              "The caller catches it with <code>except ValueError as e:</code>; <code>print(e)</code> displays the message.",
            ]),
          ] },
          { kind: "code", part: "raise", title: "First example: execution step by step", blocks: [W("codeTrace", T_raise)] },
          { kind: "concept", part: "assert", title: "assert checks a condition", blocks: [
            CODE('assert condition, "message"', null, "syntax"),
            L([
              "If the condition is True, nothing happens.",
              "If it is False, Python raises an <code>AssertionError</code> with the message.",
              "assert is used while developing and testing, to check what must always be true. Use raise for invalid input from users.",
            ]),
          ] },
          { kind: "code", part: "assert", title: "Example: a checked division", blocks: [
            EX('def divide(a, b):\n    assert b != 0, "b must not be 0"\n    return a / b\n\nprint(divide(10, 2))\nprint(divide(1, 0))', "the second call fails the check", [
              { c: "divide(10, 2)", e: "b != 0 is True: <code>5.0</code>" },
              { c: "divide(1, 0)", e: "AssertionError: b must not be 0" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "An error inside a function passes to the caller. A try statement around the call, or inside the function, handles it.",
              "<code>raise ErrorType(\"message\")</code> creates an error on purpose, for a value that Python accepts but the problem does not.",
              "The caller handles it with try and except; <code>as e</code> gives the message.",
              "<code>assert condition, \"message\"</code> raises an AssertionError when the condition is False.",
            ]),
            NEXT("<b>Trace challenges</b>. Ten programs to trace by hand. They use the rules of all lessons of this chapter."),
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            T(PAPER),
            HIDE(RUN('def check_age(age):\n    if age < 0:\n        raise ValueError("age cannot be negative")\n    return age\ntry:\n    print(check_age(20))\n    print(check_age(-1))\nexcept ValueError as e:\n    print("Error:", e)')),
          ], answer: [OUT("20\nError: age cannot be negative")] },
          { kind: "exercise", title: "Write a function with raise", blocks: [
            PQ("Write the function <code>set_speed(rpm)</code>. Then call the function.<br>1. The function raises <code>ValueError(\"speed too high\")</code> when rpm is above 3000.<br>2. Otherwise, the function returns rpm.<br>3. Call <code>set_speed(3500)</code> inside try.<br>4. In except, display \"Error:\" and the error message.",
              "Error: speed too high", "# Write your program here\n", null, 'Use except ValueError as e: and then print("Error:", e).'),
          ] },
          { kind: "exercise", title: "Write an assert", blocks: [
            PQ("Add an assert statement as the first statement of the function <code>area()</code>.<br>1. The assert checks that length is positive.<br>2. The message is <code>\"length must be positive\"</code>.",
              "length must be positive", 'def area(length):\n    return length * length\ntry:\n    area(-3)\nexcept AssertionError as e:\n    print(e)', null, 'Use this statement: assert length > 0, "length must be positive"'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`assert x > 0` with x = -1 raises…", choices: ["ValueError", "AssertionError", "TypeError", "nothing"], answer: 1, explain: "A false assert condition raises an AssertionError." },
            { q: "What does `except ValueError as e:` give?", choices: ["the error, whose message print(e) shows", "the value that caused it", "the line number", "True or False"], answer: 0, explain: "e is the exception object; printing it shows its message." },
          ])] },
        ],
      },

      /* =============================== 5. TRACE CHALLENGES =============================== */
      {
        id: "trace",
        title: "Trace challenges",
        sub: "Ten programs to execute by hand, in four levels.",
        keywords: "trace table trace the code execute by hand variable values output challenge try except else finally raise assert",
        deck: [
          { kind: "overview", title: "Trace challenges", blocks: [
            T("A <b>trace</b> executes a program by hand, one line at a time. Each program in this lesson has at least one line that is easy to trace wrongly. The program is beside the table."),
            L([
              "Write one row for each line that runs, with its number in the column <b>Line</b>. A <code>for</code> line gets a row each time it runs, also when the loop ends.",
              "On an <code>if</code> or <code>while</code> line, write True or False in the column <b>Condition</b>.",
              "A <code>try:</code> line gets a row. An <code>except</code> line gets a row only when Python tests it after an error. The lines <code>else:</code> and <code>finally:</code> get no row.",
              "Functions are traced as in Topic 05. The row of a call holds the parameters, such as <code>v (step)</code>. On the row where the function ends, its variables disappear (<code>–</code>); the same row holds the value that the call line stores.",
              "After each line, write the value of every variable and the output of the line. If the program stops with an error, write the name of the error in the column <b>Output</b> of the last row.",
            ], "Rules of a trace", true),
          ] },
          { kind: "concept", title: "The four levels", blocks: [
            T("Each level uses only the lessons that it names. A level can be done when its lessons are complete."),
            TB(["Level", "Lessons", "Programs", "Subject"], [
              ["1", "1 and 2", "1 and 2", "the data of a line plot and of a histogram"],
              ["2", "3", "3 to 5", "<code>try</code>, several <code>except</code> blocks, <code>else</code>, <code>finally</code>"],
              ["3", "3", "6 and 7", "a try statement inside a loop"],
              ["4", "4", "8 to 10", "errors in functions, <code>raise</code>, <code>assert</code>, and a program that stops"],
            ]),
            T("A trace table cannot show a chart. The programs of Level 1 build the lists that a chart receives, and the task asks one question about the chart."),
          ] },
          { kind: "exercise", title: "Level 1: the points of a line plot", blocks: [
            T(TRACE_ROWS("two") + "<br>2. The list <code>raw</code> does not change, so the table has no column for <code>raw</code>.<br>3. After line 9, the program calls <code>plt.plot(x, y)</code>. Write the number of points that the call draws."),
            CH(C_points, 2),
          ], answer: [
            T("Line 5 runs in every iteration, but line 7 runs only when line 6 is True. For the reading <code>-1</code>, line 6 is False: <code>x</code> gets 3 values, and <code>y</code> gets 2 values."),
            T("<code>plt.plot(x, y)</code> needs the same number of values in x and y. With 3 and 2 values, the program stops with a ValueError: the call draws no point. With line 5 inside the if block, x is <code>[0, 4]</code>, and the plot has 2 points."),
          ] },
          { kind: "exercise", title: "Level 1: the bins of a histogram", blocks: [
            T(TRACE + "<br>2. <code>counts</code> holds the bar heights of <code>plt.hist([13, 16, 10, 14], bins=3)</code>. Write the values that are in the last bin."),
            CH(C_bins),
          ], answer: [
            L([
              "The values go from 10 to 16, so each of the 3 bins is 2 wide. Line 3 computes the index of the bin: <code>(13 - 10) // 2</code> → <code>1</code>.",
              "16 gives the index 3, which does not exist. The largest value belongs to the last bin: lines 4 and 5 change the index to 2.",
              "14 is on a bin edge. It belongs to the bin on its right: index 2. The last bin holds 16 and 14, so the third bar is the highest.",
            ]),
          ] },
          { kind: "exercise", title: "Level 2: a count from the keyboard", blocks: [
            T(TRACE + "<br>2. Test input: 3."),
            CH(C_count),
          ], answer: [
            L([
              "Line 4 completes: <code>count</code> is 3. Line 5 fails with a ZeroDivisionError, <code>30 / 0</code>. The assignment does not happen: <code>total</code> keeps 30.",
              "The rest of the try block is skipped: line 6 does not run, so <code>count</code> stays 3.",
              "Python tests the except lines from top to bottom. Line 7 does not match; line 9 matches. Line 10: <code>30 + 3</code> → <code>33</code>.",
            ]),
          ] },
          { kind: "exercise", title: "Level 2: two try statements", blocks: [
            T(TRACE),
            CH(C_volts),
          ], answer: [
            L([
              "Line 4: <code>/</code> gives a float, <code>3.0</code>. No error occurred: the except block is skipped, the else block runs (line 8), and then the finally block (line 10).",
              "Line 12 is the same statement as line 4, but <code>cells</code> is now 0: a ZeroDivisionError. <code>volts</code> keeps <code>4.0</code>.",
              "<code>except Exception</code> matches every error type, so line 14 runs.",
            ]),
          ] },
          { kind: "exercise", title: "Level 2: a pin and its level", blocks: [
            T(TRACE_ROWS("three") + "<br>2. The dictionary <code>pins</code> and the list <code>levels</code> do not change, so the table has no column for them."),
            CH(C_pins, 3),
          ], answer: [
            L([
              'Line 5 completes: the key <code>"fan"</code> exists, so <code>pin</code> is 5.',
              "Line 6 fails: <code>levels</code> has the indexes 0 to 2. An index outside a list raises an IndexError, not a KeyError. <code>state</code> keeps <code>-1</code>.",
              "Line 7 does not match; line 9 matches. An error occurred, so the else block is skipped. The finally block runs last: <code>5 -1</code>.",
            ]),
          ] },
          { kind: "exercise", title: "Level 3: four texts", blocks: [
            T(TRACE),
            CH(C_texts),
          ], answer: [
            L([
              '<code>"x"</code>: line 5 fails with a ValueError. <code>r</code> keeps 8, the value of iteration 1. Line 6 is skipped. Line 8: <code>3 + 8</code> → <code>11</code>.',
              '<code>"0"</code>: line 5 completes, so <code>r</code> is 0. Line 6 fails with a ZeroDivisionError: <code>total</code> keeps 11. Line 7 does not match; line 9 matches.',
              'After a handled error, the loop continues with the next text. <code>"4"</code>: <code>11 + 24 // 4</code> → <code>17</code>.',
            ]),
          ] },
          { kind: "exercise", title: "Level 3: three parts", blocks: [
            T(TRACE_ROWS("two") + "<br>2. The dictionary <code>stock</code> does not change, so the table has no column for <code>stock</code>."),
            CH(C_stock, 2),
          ], answer: [
            L([
              '<code>"r1"</code>: no error occurs. The else block runs (line 9), and then the finally block (line 11).',
              '<code>"d1"</code>: the key does not exist: a KeyError. <code>n</code> keeps 2. The except block runs, and then the finally block: <code>d1 2</code>.',
              '<code>"c1"</code>: <code>10 // 0</code> raises a ZeroDivisionError. Line 6 does not match, so the error is not handled. The finally block still runs. Then the program stops: line 12 does not run.',
            ]),
          ] },
          { kind: "exercise", title: "Level 4: two functions", blocks: [
            T(TRACE_ROWS("three") + "<br>2. An error can end a function on the line of a call. Write one more row for that line: the variables of the function disappear on that row."),
            CH(C_chain, 3),
          ], answer: [
            L([
              "<code>show(0)</code>: line 2 fails with a ZeroDivisionError. <code>cell</code> has no try statement: the function ends at once and returns no value.",
              "The error passes to line 4 of <code>show</code>, which has no try statement either: <code>show</code> ends on line 4. Lines 5 and 6 do not run.",
              "The error passes to line 10, inside the try block: <code>total</code> keeps 3, and line 11 is skipped. Line 12 matches. Line 13: <code>3 - 1</code> → <code>2</code>.",
            ]),
          ] },
          { kind: "exercise", title: "Level 4: steps of 10", blocks: [
            T(TRACE_ROWS("two")),
            CH(C_step, 2),
          ], answer: [
            L([
              "Iteration 2: <code>20 &gt; 20</code> is False, so line 4 returns 30.",
              "Iteration 3: <code>30 &gt; 20</code> is True. <code>raise</code> ends the function without a return value, so line 8 stores nothing: <code>level</code> keeps 30.",
              "Line 9 matches. Line 10 displays the message of the error and the level: <code>high 30</code>. Line 11: <code>30 * 2</code> → <code>60</code>.",
              "The error is handled, so the loop continues: line 6 tests <code>60 &lt; 40</code>, which is False.",
            ]),
          ] },
          { kind: "exercise", title: "Level 4: the program stops", blocks: [
            T("The program stops with an error message before its last line.<br>1. Complete the trace table on paper. The first two rows are complete.<br>2. In the column Line, write the number of the line that runs.<br>3. In the last row, write the name of the error in the column Output."),
            CH(C_assert, 2),
          ], answer: [
            L([
              '<code>"2a"</code>: line 3 fails with a ValueError. The function handles its own error: line 5 returns 0. The main program receives a value, not an error.',
              "Line 9 with 0: <code>0 &gt;= 0</code> is True, so nothing happens.",
              '<code>"-3"</code>: <code>int("-3")</code> is valid: <code>-3</code>. Line 9: <code>-3 &gt;= 0</code> is False: an <b>AssertionError</b>. No try statement handles the error: the program stops, and lines 10 and 11 do not run.',
            ]),
          ] },
        ],
      },

      /* =============================== 6. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete problems with charts and error handling.",
        slides: "07:26",
        keywords: "practice validation raise battery level error handling chart plot",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Solve every problem with the five steps:"),
            L([
              "<b>Understand</b>: the input and the output; list the inputs that can be invalid, and the exception each one raises.",
              "<b>Design</b>: one except block for each exception. For a chart: the chart type, and labels with units for both axes.",
              "<b>Code</b>: write the program.",
              "<b>Test</b>: run it with valid and with invalid input.",
              "<b>Correct</b>: if the output differs, find the wrong step, correct it, and test again.",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: validate a battery level", blocks: [
            T("Read a battery level in percent and display the level. A level below 0 or above 100 is a valid number in Python, but it is not a possible battery level. For such a level, the program raises an error."),
            IPO([
              ["Input", "a battery level (float), valid from 0 to 100"],
              ["Output", "the level, or \"Error:\" and the message of the error"],
              ["Processing", "<code>check_level(level)</code> raises <code>ValueError(\"level must be 0 to 100\")</code> outside the range; otherwise it returns level. The main program calls it inside try."],
              ["Errors", "ValueError from float(): not a number. ValueError from check_level(): outside the range. One except block with <code>as e</code> handles both."],
            ]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Write the program of Problem 1.<br>1. Use the prompt <code>Battery (%): </code>.<br>2. Display a valid level in this form: <code>Level: 80.0 %</code>.<br>3. For an error, display \"Error:\" and the message of the error.<br>Test input: 150.",
              "Battery (%): 150\nError: level must be 0 to 100", "# Write your program here\n", ["150"], "In check_level, raise ValueError(\"level must be 0 to 100\") when level < 0 or level > 100. In try, use level = check_level(float(input(\"Battery (%): \"))). Then use except ValueError as e: and print(\"Error:\", e)."),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: read until valid", blocks: [
            T("Read a temperature until the user enters a valid number. Then display the temperature."),
            IPO([["Input", "text, repeated"], ["Output", "\"Try again\" after each invalid entry, then the value"], ["Processing", "a while loop with try inside; break after a valid conversion"]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("Write the program of Problem 2. The output must match the target output.<br>Use the prompt <code>Temperature: </code>.<br>Test input: warm, 2x, 25.5.",
              "Temperature: warm\nTry again\nTemperature: 2x\nTry again\nTemperature: 25.5\n25.5", "# Write your program here\n", ["warm", "2x", "25.5"], "Use while True: with a try statement inside. In try, use t = float(input(...)) and then break. In except ValueError:, display \"Try again\"."),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: safe list access", blocks: [
            T("A list holds the readings of 4 sensors. The sensors have the numbers 1 to 4: sensor n is <code>readings[n - 1]</code>.<br>Read a sensor number and display the reading of that sensor. For an invalid number, display \"No such sensor\"."),
            IPO([
              ["Input", "a sensor number (int), valid from 1 to 4"],
              ["Output", "the reading, or \"No such sensor\""],
              ["Processing", "index = number − 1. A number below 1 gives a negative index, which Python accepts: check it with if and raise an IndexError."],
              ["Errors", "IndexError: number below 1 or above 4; ValueError: not an integer"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Write the program of Problem 3. The output must match the target output.<br>Use the prompt <code>Sensor: </code>.<br>Test input: 7.",
              "Sensor: 7\nNo such sensor", "readings = [21.5, 22.0, 23.1, 20.8]\n# Write your program here\n", ["7"], "In try: when number < 1, raise IndexError(\"no such sensor\"); otherwise display readings[number - 1]. Use except (IndexError, ValueError): for the message."),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: plot measured data", blocks: [
            T("A motor test gives the current at four speeds. Show how the current changes with the speed."),
            IPO([
              ["Input", "speed 500, 1000, 1500, 2000 rpm; current 1.2, 2.0, 2.9, 3.7 A"],
              ["Output", "a line plot with a circle marker at each point, both axes labelled with units, and a title"],
              ["Processing", "<code>plt.plot(speed, current, marker=\"o\")</code>, <code>xlabel</code>, <code>ylabel</code>, <code>title</code>, <code>show</code>"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", cols: [
            [T("Write the program of Problem 4.<br>Expected chart: one line through 4 points, with a circle at each point. The line rises from 1.2 A at 500 rpm to 3.7 A at 2000 rpm.")],
            [RUNS("import matplotlib.pyplot as plt\n\n# Write your program here\n")],
          ] },
          { kind: "summary", title: "Chapter summary", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1. Line plots", "<code>plt.plot(x, y)</code> draws on the current figure until <code>show()</code>: labels, title, legend, styles, <code>savefig()</code> before show()."],
              ["2. Chart types", "bar: given values of groups; scatter: relations; hist: raw data counted into bins."],
              ["3. Exceptions", "try / except (first match) / else (no error) / finally (always)."],
              ["4. raise and assert", "An error in a function passes to the caller; raise creates an error on purpose; assert checks a condition."],
            ]),
            N("<b>Topic 08: Data processing</b>. Reading and writing files, CSV and JSON data, NumPy arrays, and pandas tables.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
