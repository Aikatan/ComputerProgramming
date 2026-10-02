/* ===================== Topic 05 - Functions and Modules =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: defining -> parameters and return -> arguments -> scope -> nested calls and recursion -> modules -> trace challenges -> practice.
   Python level: t02-t04 material plus def, return, import. No lists, dicts, or try. *args appears only with a for loop;
   **kwargs needs dictionary access and is taught in Topic 06.
   Local variables in traces are named "name (function)" and are removed when the function returns.
   ============================================================================ */
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
  // the expected output of a paper exercise: the answer of the slide (instructor mode)
  const OUT = (text) => CODE(text, null, "output", "text");

  /* ---------- traces ---------- */
  const T_line = {
    code: ["def line():", '    print("----------")', "", "line()", 'print("Motor report")', "line()"],
    steps: [
      { line: 0, note: "def creates the function <code>line</code>. Its body does not run now." },
      { line: 3, note: "Call: the program jumps into the function." },
      { line: 1, note: "The body runs.", print: "----------" },
      { line: 3, note: "The body has ended. The program returns to the call and continues after it." },
      { line: 4, note: "The next statement displays Motor report.", print: "Motor report" },
      { line: 5, note: "Second call: the program jumps into the function again." },
      { line: 1, note: "The body runs again.", print: "----------" },
      { line: -1, note: "The program ends. The body (line 2) ran once for each call; line 1 only created the function. Result check: 2 calls → 2 separator lines." },
    ],
  };

  const T_power = {
    code: ["def power(v, i):", "    p = v * i", "    return p", "", "result = power(12, 2)", 'print("Power =", result, "W")'],
    steps: [
      { line: 0, note: "def creates the function <code>power</code> with the parameters v and i. In the Variables panel, v (power) means the variable v inside power." },
      { line: 4, note: "Call power(12, 2): the parameters receive the arguments.", set: { "v (power)": "12", "i (power)": "2" } },
      { line: 1, note: "v * i → 24, stored in the local variable p.", set: { "p (power)": "24" } },
      { line: 2, note: "return sends 24 back. The local variables disappear.", unset: ["v (power)", "i (power)", "p (power)"] },
      { line: 4, note: "The call is replaced by 24, which is stored in result.", set: { result: "24" } },
      { line: 5, note: "result is displayed. The local variables existed only during the call. Result check: 12 × 2 = 24.", print: "Power = 24 W" },
    ],
  };

  // exercise "Trace the code": two calls; the result of the first call is an argument of the second call.
  // One row for each line that runs (the 8 lines of a real line-by-line run), so that the blank table fits on
  // one slide: the row of return also holds the value that the call line stores (x, then y).
  const T_area = {
    code: ["def area(w, h):", "    a = w * h", "    return a", "", "x = area(3, 4)", "y = area(x, 2)", "print(x, y)"],
    steps: [
      { line: 0, note: "def creates the function <code>area</code> with the parameters w and h." },
      { line: 4, note: "Call area(3, 4): the parameters receive the arguments.", set: { "w (area)": "3", "h (area)": "4" } },
      { line: 1, note: "3 * 4 → 12, stored in the local variable a.", set: { "a (area)": "12" } },
      { line: 2, note: "return sends 12 back, and the local variables disappear. Line 5 stores 12 in x.", unset: ["w (area)", "h (area)", "a (area)"], set: { x: "12" } },
      { line: 5, note: "Call area(x, 2): w receives the value of x, 12.", set: { "w (area)": "12", "h (area)": "2" } },
      { line: 1, note: "12 * 2 → 24, stored in the local variable a.", set: { "a (area)": "24" } },
      { line: 2, note: "return sends 24 back, and the local variables disappear. Line 6 stores 24 in y.", unset: ["w (area)", "h (area)", "a (area)"], set: { y: "24" } },
      { line: 6, note: "x and y are displayed. Result check: 3 × 4 = 12 and 12 × 2 = 24.", print: "12 24" },
    ],
  };

  // return inside a loop: the loop stops at the return
  const T_divisor = {
    code: ["def smallest_divisor(n):", "    for d in range(2, n + 1):", "        if n % d == 0:", "            return d", "", "print(smallest_divisor(35))"],
    steps: [
      { line: 0, note: "def creates the function <code>smallest_divisor</code>." },
      { line: 5, note: "print needs smallest_divisor(35): the call starts with n = 35.", set: { "n (smallest_divisor)": "35" } },
      { line: 1, note: "The loop starts with d = 2.", set: { "d (smallest_divisor)": "2" } },
      { line: 2, note: "35 % 2 → 1. 1 == 0 is False: the return is skipped." },
      { line: 1, note: "The next value: d = 3.", set: { "d (smallest_divisor)": "3" } },
      { line: 2, note: "35 % 3 → 2. 2 == 0 is False." },
      { line: 1, note: "The next value: d = 4.", set: { "d (smallest_divisor)": "4" } },
      { line: 2, note: "35 % 4 → 3. 3 == 0 is False." },
      { line: 1, note: "The next value: d = 5.", set: { "d (smallest_divisor)": "5" } },
      { line: 2, note: "35 % 5 → 0. 0 == 0 is True." },
      { line: 3, note: "return 5 ends the function at once. The loop does not continue with d = 6.", unset: ["n (smallest_divisor)", "d (smallest_divisor)"] },
      { line: 5, note: "The call is replaced by 5, which is displayed. Result check: 35 = 5 × 7.", print: "5" },
    ],
  };

  const T_default = {
    code: ["def motor(name, voltage=220):", '    print(name, voltage, "V")', "", 'motor("Pump")', 'motor("Fan", 110)'],
    steps: [
      { line: 0, note: "def creates motor. voltage has the default value 220." },
      { line: 3, note: "One argument: name = 'Pump'. voltage uses its default, 220.", set: { "name (motor)": "'Pump'", "voltage (motor)": "220" } },
      { line: 1, note: "The body displays both values.", print: "Pump 220 V" },
      { line: 4, note: "Two arguments: 110 replaces the default.", unset: ["name (motor)", "voltage (motor)"], set: { "name (motor)": "'Fan'", "voltage (motor)": "110" } },
      { line: 1, note: "The body displays both values.", print: "Fan 110 V" },
      { line: -1, note: "Result check: Pump used the default 220; Fan gave 110.", unset: ["name (motor)", "voltage (motor)"] },
    ],
  };

  const T_scope = {
    code: ["value = 1", "def show():", "    value = 2", "    print(value)", "", "show()", "print(value)"],
    steps: [
      { line: 0, note: "A global variable: value = 1.", set: { value: "1" } },
      { line: 1, note: "def creates the function show." },
      { line: 5, note: "Call show()." },
      { line: 2, note: "Assignment inside a function creates a new <b>local</b> value. The global value does not change.", set: { "value (show)": "2" } },
      { line: 3, note: "Inside show, the name value means the local variable.", print: "2" },
      { line: 6, note: "show has ended; its local value is gone. The global value is still 1. Result check: 2 inside show, 1 outside.", unset: ["value (show)"], print: "1" },
    ],
  };

  // a parameter receives a copy of the value; a return value that is not stored is lost
  const T_copy = {
    code: ["def add_ten(count):", "    count = count + 10", "    return count", "", "count = 5", "add_ten(count)", "print(count)"],
    steps: [
      { line: 0, note: "def creates the function <code>add_ten</code> with the parameter count." },
      { line: 4, note: "A global variable: count = 5.", set: { count: "5" } },
      { line: 5, note: "Call add_ten(count): the parameter count receives a copy of the value 5. It is a separate, local variable.", set: { "count (add_ten)": "5" } },
      { line: 1, note: "5 + 10 → 15, assigned to the parameter. The caller's variable, the global count, is still 5.", set: { "count (add_ten)": "15" } },
      { line: 2, note: "return sends 15 back. The local count disappears.", unset: ["count (add_ten)"] },
      { line: 5, note: "The call is replaced by 15, but this statement does not store it: the returned value is lost." },
      { line: 6, note: "The global count was never changed. To keep the result, store it: <code>count = add_ten(count)</code>. Result check: 5 is displayed, not 15.", print: "5" },
    ],
  };

  const T_nested = {
    code: ["def add(a, b):", "    return a + b", "", "def double_sum(a, b):", "    return add(a, b) * 2", "", "print(double_sum(1, 2))"],
    steps: [
      { line: -1, note: "Two functions. Both have parameters named a and b." },
      { line: 6, note: "print needs double_sum(1, 2): the call starts.", set: { "a (double_sum)": "1", "b (double_sum)": "2" } },
      { line: 4, note: "add(a, b) is called with 1 and 2. add has its own a and b.", set: { "a (add)": "1", "b (add)": "2" } },
      { line: 1, note: "add returns 1 + 2 → 3. Its variables disappear.", unset: ["a (add)", "b (add)"] },
      { line: 4, note: "double_sum returns 3 * 2 → 6. Its variables disappear.", unset: ["a (double_sum)", "b (double_sum)"] },
      { line: 6, note: "Result check: (1 + 2) × 2 = 6.", print: "6" },
    ],
  };

  // a function in a flowchart: the main chart (left) and the chart of the function (right)
  const F_func = {
    cols: [0, 380],
    nodes: [
      { id: "s", type: "terminator", text: "START", col: 0, row: 0 },
      { id: "i", type: "io", text: "INPUT r", col: 0, row: 1 },
      { id: "c", type: "predefined", text: "area = circle_area(r)", col: 0, row: 2 },
      { id: "d", type: "io", text: "DISPLAY area", col: 0, row: 3 },
      { id: "e", type: "terminator", text: "END", col: 0, row: 4 },
      { id: "f", type: "terminator", text: "circle_area(radius)", col: 1, row: 0 },
      { id: "p", type: "process", text: "a = 3.14 * radius * radius", col: 1, row: 1 },
      { id: "r", type: "terminator", text: "RETURN a", col: 1, row: 2 },
    ],
    edges: [{ from: "s", to: "i" }, { from: "i", to: "c" }, { from: "c", to: "d" }, { from: "d", to: "e" }, { from: "f", to: "p" }, { from: "p", to: "r" }],
  };

  const FACT_CODE = ["def factorial(n):", "    if n == 0:", "        return 1", "    return n * factorial(n - 1)", "", "print(factorial(3))"];
  const f = (n, state, ret) => ({ call: "factorial(" + n + ")", detail: "n = " + n, state, ret });

  /* ---------- trace challenges (generated: edit tools/traces/t05.py, then run "python tools/make-trace.py t05") ---------- */
  // Level 1. One function returns a value, the other only displays: the call line stores None.
  const C_two = {
    side: true,
    code: ["def half(v):", "    return v / 2", "", "def show(v):", "    print(\"V =\", v)", "", "a = half(9)", "b = show(a)", "a = half(a)", "print(a, b)"],
    steps: [
      { line: 0 },
      { line: 3 },
      { line: 6, set: { "v (half)": "9" } },
      { line: 1, unset: ["v (half)"], set: { a: "4.5" } },
      { line: 7, set: { "v (show)": "4.5" } },
      { line: 4, unset: ["v (show)"], set: { b: "None" }, print: "V = 4.5" },
      { line: 8, set: { "v (half)": "4.5" } },
      { line: 1, unset: ["v (half)"], set: { a: "2.25" } },
      { line: 9, print: "2.25 None" },
    ],
  };

  // Level 1. Two return values; a return in an if ends the function; the targets of line 7 are y, x.
  const C_low = {
    side: true,
    code: ["def low(a, b):", "    if a > b:", "        return b, a", "    return a, b", "", "x, y = low(7, 3)", "y, x = low(x, y + 1)", "x, y = low(x, y)", "print(x, y)"],
    steps: [
      { line: 0 },
      { line: 5, set: { "a (low)": "7", "b (low)": "3" } },
      { line: 1, test: "True" },
      { line: 2, unset: ["a (low)", "b (low)"], set: { x: "3", y: "7" } },
      { line: 6, set: { "a (low)": "3", "b (low)": "8" } },
      { line: 1, test: "False" },
      { line: 3, unset: ["a (low)", "b (low)"], set: { x: "8", y: "3" } },
      { line: 7, set: { "a (low)": "8", "b (low)": "3" } },
      { line: 1, test: "True" },
      { line: 2, unset: ["a (low)", "b (low)"], set: { x: "3", y: "8" } },
      { line: 8, print: "3 8" },
    ],
  };

  // Level 1. A return inside a loop ends the function; the second call ends the loop and returns 0.
  const C_heat = {
    side: true,
    code: ["def heat(t):", "    for n in range(1, 3):", "        t = t + 10", "        if t >= 40:", "            return n", "    return 0", "", "a = heat(30)", "print(a, heat(a))"],
    steps: [
      { line: 0 },
      { line: 7, set: { "t (heat)": "30" } },
      { line: 1, set: { "n (heat)": "1" } },
      { line: 2, set: { "t (heat)": "40" } },
      { line: 3, test: "True" },
      { line: 4, unset: ["t (heat)", "n (heat)"], set: { a: "1" } },
      { line: 8, set: { "t (heat)": "1" } },
      { line: 1, set: { "n (heat)": "1" } },
      { line: 2, set: { "t (heat)": "11" } },
      { line: 3, test: "False" },
      { line: 1, set: { "n (heat)": "2" } },
      { line: 2, set: { "t (heat)": "21" } },
      { line: 3, test: "False" },
      { line: 1 },
      { line: 5, unset: ["t (heat)", "n (heat)"], print: "1 0" },
    ],
  };

  // Level 2. A default that is replaced by position, keyword arguments in another order, a default that is kept.
  const C_drop = {
    side: true,
    code: ["def drop(v, r=10, i=2):", "    return v - r * i", "", "x = drop(60)", "x = drop(100, x)", "print(x)", "x = drop(i=1, v=x)", "x = drop(x * 9, i=x // 2)", "print(x)"],
    steps: [
      { line: 0 },
      { line: 3, set: { "v (drop)": "60", "r (drop)": "10", "i (drop)": "2" } },
      { line: 1, unset: ["v (drop)", "r (drop)", "i (drop)"], set: { x: "40" } },
      { line: 4, set: { "v (drop)": "100", "r (drop)": "40", "i (drop)": "2" } },
      { line: 1, unset: ["v (drop)", "r (drop)", "i (drop)"], set: { x: "20" } },
      { line: 5, print: "20" },
      { line: 6, set: { "v (drop)": "20", "r (drop)": "10", "i (drop)": "1" } },
      { line: 1, unset: ["v (drop)", "r (drop)", "i (drop)"], set: { x: "10" } },
      { line: 7, set: { "v (drop)": "90", "r (drop)": "10", "i (drop)": "5" } },
      { line: 1, unset: ["v (drop)", "r (drop)", "i (drop)"], set: { x: "40" } },
      { line: 8, print: "40" },
    ],
  };

  // Level 2. *args with 2, 0, and 2 arguments: with no argument the loop does not run; hi starts at 0.
  const C_top = {
    side: true,
    code: ["def top(*temps):", "    hi = 0", "    for t in temps:", "        if t > hi:", "            hi = t", "    return hi", "", "a = top(35, 28)", "print(top())", "b = top(-4, -a)", "print(a, b)"],
    steps: [
      { line: 0 },
      { line: 7 },
      { line: 1, set: { "hi (top)": "0" } },
      { line: 2, set: { "t (top)": "35" } },
      { line: 3, test: "True" },
      { line: 4, set: { "hi (top)": "35" } },
      { line: 2, set: { "t (top)": "28" } },
      { line: 3, test: "False" },
      { line: 2 },
      { line: 5, unset: ["hi (top)", "t (top)"], set: { a: "35" } },
      { line: 8 },
      { line: 1, set: { "hi (top)": "0" } },
      { line: 2 },
      { line: 5, unset: ["hi (top)"], print: "0" },
      { line: 9 },
      { line: 1, set: { "hi (top)": "0" } },
      { line: 2, set: { "t (top)": "-4" } },
      { line: 3, test: "False" },
      { line: 2, set: { "t (top)": "-35" } },
      { line: 3, test: "False" },
      { line: 2 },
      { line: 5, unset: ["hi (top)", "t (top)"], set: { b: "0" } },
      { line: 10, print: "35 0" },
    ],
  };

  // Level 3. A parameter with the name of a global variable; a returned value that is lost; a global variable that is read.
  const C_boost = {
    side: true,
    code: ["gain = 2", "level = 10", "", "def boost(level):", "    level = level * gain", "    return level", "", "boost(level)", "print(level)", "gain = boost(gain + 1)", "level = boost(level)", "print(level, gain)"],
    steps: [
      { line: 0, set: { gain: "2" } },
      { line: 1, set: { level: "10" } },
      { line: 3 },
      { line: 7, set: { "level (boost)": "10" } },
      { line: 4, set: { "level (boost)": "20" } },
      { line: 5, unset: ["level (boost)"] },
      { line: 8, print: "10" },
      { line: 9, set: { "level (boost)": "3" } },
      { line: 4, set: { "level (boost)": "6" } },
      { line: 5, unset: ["level (boost)"], set: { gain: "6" } },
      { line: 10, set: { "level (boost)": "10" } },
      { line: 4, set: { "level (boost)": "60" } },
      { line: 5, unset: ["level (boost)"], set: { level: "60" } },
      { line: 11, print: "60 6" },
    ],
  };

  // Level 3. global changes the global variable; without global the assignment is local; add() returns None.
  const C_total = {
    side: true,
    code: ["total = 10", "def add(n):", "    global total", "    total = total + n", "", "def clear():", "    total = 0", "    return total", "", "add(5)", "x = clear()", "print(total, x)", "x = add(x + 2)", "print(total, x)"],
    steps: [
      { line: 0, set: { total: "10" } },
      { line: 1 },
      { line: 5 },
      { line: 9, set: { "n (add)": "5" } },
      { line: 3, unset: ["n (add)"], set: { total: "15" } },
      { line: 10 },
      { line: 6, set: { "total (clear)": "0" } },
      { line: 7, unset: ["total (clear)"], set: { x: "0" } },
      { line: 11, print: "15 0" },
      { line: 12, set: { "n (add)": "2" } },
      { line: 3, unset: ["n (add)"], set: { total: "17", x: "None" } },
      { line: 13, print: "17 None" },
    ],
  };

  // Level 4. Each call has its own v; math.sqrt returns a float; in line 12, diff(9) runs before root.
  const C_nested = {
    side: true,
    code: ["import math", "", "def root(v):", "    v = v + 7", "    return math.sqrt(v)", "", "def diff(v):", "    w = root(v * 2)", "    return w - v", "", "print(diff(1))", "x = root(diff(9) + 6)", "print(x)"],
    steps: [
      { line: 0 },
      { line: 2 },
      { line: 6 },
      { line: 10, set: { "v (diff)": "1" } },
      { line: 7, set: { "v (root)": "2" } },
      { line: 3, set: { "v (root)": "9" } },
      { line: 4, unset: ["v (root)"], set: { "w (diff)": "3.0" } },
      { line: 8, unset: ["v (diff)", "w (diff)"], print: "2.0" },
      { line: 11, set: { "v (diff)": "9" } },
      { line: 7, set: { "v (root)": "18" } },
      { line: 3, set: { "v (root)": "25" } },
      { line: 4, unset: ["v (root)"], set: { "w (diff)": "5.0" } },
      { line: 8, unset: ["v (diff)", "w (diff)"], set: { "v (root)": "2.0" } },
      { line: 3, set: { "v (root)": "9.0" } },
      { line: 4, unset: ["v (root)"], set: { x: "3.0" } },
      { line: 12, print: "3.0" },
    ],
  };

  // Level 4. An unnamed program: n + n // 2 + n // 4 + ... + 1. The calls return in reverse order: 1, then 4, then 10.
  const C_recur = {
    side: true,
    code: ["def f(n):", "    if n > 1:", "        n = n + f(n // 2)", "    return n", "", "print(f(6))"],
    steps: [
      { line: 0 },
      { line: 5, set: { "n (f)": "6" } },
      { line: 1, test: "True" },
      { line: 2, set: { "n (f #2)": "3" } },
      { line: 1, test: "True" },
      { line: 2, set: { "n (f #3)": "1" } },
      { line: 1, test: "False" },
      { line: 3, unset: ["n (f #3)"], set: { "n (f #2)": "4" } },
      { line: 3, unset: ["n (f #2)"], set: { "n (f)": "10" } },
      { line: 3, unset: ["n (f)"], print: "10" },
    ],
  };

  // Level 4. Lines 10 to 12 look wrong but run (None, a name without parentheses); line 13 stops with a NameError.
  const C_stop = {
    side: true,
    code: ["from math import floor", "", "def half(n):", "    return floor(n / 2)", "", "def show(n):", "    h = half(n)", "    print(\"half:\", h)", "", "a = show(9)", "half", "print(a)", "b = math.floor(4.5)", "print(b)"],
    steps: [
      { line: 0 },
      { line: 2 },
      { line: 5 },
      { line: 9, set: { "n (show)": "9" } },
      { line: 6, set: { "n (half)": "9" } },
      { line: 3, unset: ["n (half)"], set: { "h (show)": "4" } },
      { line: 7, unset: ["n (show)", "h (show)"], set: { a: "None" }, print: "half: 4" },
      { line: 10 },
      { line: 11, print: "None" },
      { line: 12, print: "NameError" },
    ],
  };
  /* ---------- end of the generated traces ---------- */

  // the task text of a trace challenge (Lesson 7). n: the number of rows that are complete
  const TRACE = (n) => "Complete the trace table on paper. The first " + n + " rows are complete.<br>1. Before the trace, write the output that you expect. Then complete the rows in order.";
  // side: the program is beside the table, and a blank row does not show which line runs
  // given: the number of rows that are complete (the rows of the def lines hold no value, so more than one row is given)
  const CH = (trace, given) => W("traceTable", { trace, blank: true, given: given || 1, showCode: !!trace.side, hideLines: !!trace.side });

  App.registerTopic({
    id: "t05",
    title: "Functions and Modules",
    short: "Functions & Modules",
    blurb: "Defining and calling functions, parameters and return values, arguments, scope, recursion, and modules.",
    intro: "This chapter covers functions, named blocks of code that can be reused, and modules, files that group functions. Each lesson uses only what the lessons before it have explained:<br>defining → parameters and return → arguments → scope → nested calls and recursion → modules → trace challenges → practice.",
    lessons: [
      /* =============================== 1. DEFINING =============================== */
      {
        id: "defining",
        title: "Defining and calling functions",
        sub: "What a function is, def, calling a function, and docstrings.",
        slides: "05:4–6",
        keywords: "function def call body docstring reuse modularity",
        deck: [
          { kind: "overview", title: "Defining and calling functions", blocks: [
            T("A <b>function</b> is a named, reusable block of code that performs one task. It is written once and can be used many times."),
            L(["Why functions", "Defining a function", "Calling a function", "Docstrings"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Why functions", title: "Why functions", blocks: [
            TB(["Benefit", "Meaning"], [
              ["Modularity", "a program is divided into small tasks, one function each"],
              ["Reusability", "one definition can be called many times"],
              ["Readability", "a descriptive name explains what a block of code does"],
              ["Easier testing", "each function can be checked on its own"],
            ]),
            T("Functions are already in use: <code>print()</code>, <code>input()</code>, <code>len()</code>, and <code>round()</code> are built-in functions."),
          ] },
          { kind: "concept", part: "Defining a function", title: "The def statement", blocks: [
            CODE('def function_name(parameters):\n    """Docstring: what the function does."""\n    statements\n    return value   # optional (Lesson 2)', null, "syntax"),
            L([
              "<code>def</code> starts the definition. The name follows the variable naming rules.",
              "The parentheses hold the parameters (Lesson 2). They may be empty.",
              "The indented body is the code of the function. <code>return</code> is optional.",
            ]),
          ] },
          { kind: "concept", part: "Calling a function", title: "Calling a function", blocks: [
            L([
              "A <b>call</b> is the function name followed by parentheses: <code>line()</code>.",
              "<code>def</code> only creates the function. Its body runs when the function is called.",
              "At a call, the program jumps into the function, runs the body, and returns to the line after the call.",
              "A function must be defined before the line that calls it runs.",
              "The parentheses are required. The name alone, <code>line</code>, is not a call: it causes no error, and the body does not run.",
            ]),
          ] },
          { kind: "code", part: "Calling a function", title: "First example: execution step by step", blocks: [W("codeTrace", T_line)] },
          { kind: "code", part: "Calling a function", title: "Example: a function that displays a menu", blocks: [
            EX('def concessions():\n    print("Food and drink options:")\n    print("Popcorn: 8 to 10 dollars")\n    print("Soft drink: 5 to 7 dollars")\n\nconcessions()', "from the lecture", [
              { c: "def concessions():", e: "Creates the function. Nothing is displayed yet." },
              { c: "concessions()", e: "The call runs the three print statements." },
            ]),
          ] },
          { kind: "concept", part: "Docstrings", title: "Docstrings", blocks: [
            L([
              "A <b>docstring</b> is a string in triple quotes on the first line of the body.",
              "It describes what the function does, for the people who read or use it.",
              "<code>help(function_name)</code> displays the docstring.",
            ]),
            CODE('def line():\n    """Display a separator line."""\n    print("----------")', null, "example"),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A function is a named, reusable block of code for one task.",
              "<code>def name():</code> creates the function; the indented body is its code.",
              "The body runs only when the function is called: <code>name()</code>.",
              "After the body, the program continues after the call.",
              "A docstring describes the function.",
            ]),
            NEXT("<b>Parameters and return values</b>. A function can receive values and send a result back."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Write the output of the program on paper, line by line.<br>First, count how many times each line of the program runs.")],
            [RUN('def beep():\n    print("beep")\n\nprint("start")\nbeep()\nbeep()\nprint("end")')],
          ], answer: [OUT("start\nbeep\nbeep\nend")] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program stops with a NameError.<br>Change the order of the lines, so that the program displays the target output.",
              "Hello", 'greet()\n\ndef greet():\n    print("Hello")\n', null, "The function is called before it is defined: move the call below the definition."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Write a program that displays the target output.<br>1. Define a function <code>header()</code> that displays the two lines of the target output.<br>2. Call the function <code>header()</code> one time.",
              "Sensor report\n=============", "# Write your program here\n", null, 'The body of header() has two statements: print("Sensor report") and print("=" * 13).'),
          ] },
          { kind: "exercise", title: "Modify the code", blocks: [
            PQ("Call the function three times, so that the output has three lines.",
              "ready\nready\nready", 'def status():\n    print("ready")\n\nstatus()\n', null, "Add two more calls."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "When does the body of a function run?", choices: ["When def is executed", "When the function is called", "At the start of the program", "Never"], answer: 1, explain: "def only creates the function. A call runs the body." },
            { q: "Which keyword defines a function?", choices: ["function", "def", "fun", "define"], answer: 1, explain: "def starts a function definition." },
          ])] },
        ],
      },

      /* =============================== 2. PARAMETERS AND RETURN =============================== */
      {
        id: "parameters",
        title: "Parameters and return values",
        sub: "Passing values into a function and sending a result back.",
        slides: "05:5, 12",
        keywords: "parameter argument return value none local variable result",
        deck: [
          { kind: "overview", title: "Parameters and return values", blocks: [
            T("Parameters let a function work with different values. A return value sends the result of the function back to the line that called it."),
            L(["Parameters and arguments", "Return values", "return and print", "Returning two values", "A function in a flowchart"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Parameters and arguments", title: "Parameters and arguments", blocks: [
            TB(["Term", "Meaning", "Example"], [
              ["Parameter", "a variable in the definition that receives a value", "<code>def power(v, i):</code>"],
              ["Argument", "the value given in the call", "<code>power(12, 2)</code>"],
            ]),
            L([
              "At a call, each parameter is assigned its argument: <code>v = 12</code>, <code>i = 2</code>.",
              "Parameters are <b>local variables</b>: variables that exist only inside the function, while it runs (Lesson 4).",
            ]),
          ] },
          { kind: "concept", part: "Return values", title: "return sends a value back", blocks: [
            L([
              "<code>return value</code> ends the function at once and sends the value back to the call.",
              "The call is then replaced by the returned value: <code>result = power(12, 2)</code> stores 24.",
              "Statements after return in the same block do not run.",
              "A function can have several return statements. The first one that runs ends the function, also when it is inside a loop.",
            ]),
          ] },
          { kind: "code", part: "Return values", title: "First example: execution step by step", blocks: [W("codeTrace", T_power)] },
          { kind: "code", part: "Return values", title: "Example: temperature conversion", blocks: [
            EX("def c_to_f(c):\n    return c * 9 / 5 + 32\n\nprint(c_to_f(25))\nprint(c_to_f(100))", "one function, two calls", [
              { c: "c_to_f(25)", e: "c = 25: returns <code>77.0</code>" },
              { c: "c_to_f(100)", e: "c = 100: returns <code>212.0</code>" },
            ]),
          ] },
          { kind: "code", part: "Return values", title: "Example: a return in each branch", blocks: [
            EX('def status(level):\n    if level >= 80:\n        return "Full"\n    elif level >= 20:\n        return "Normal"\n    else:\n        return "Low"\n\nprint(status(65))\nprint(status(10))', "one return runs in each call", [
              { c: "status(65)", e: "The second condition is True: the function ends there and returns <code>Normal</code>." },
              { c: "status(10)", e: "Both conditions are False: the else branch returns <code>Low</code>." },
            ]),
          ] },
          { kind: "code", part: "Return values", title: "Example: a return inside a loop", blocks: [W("codeTrace", T_divisor)] },
          { kind: "concept", part: "return and print", title: "return is not print", blocks: [
            TB(["Statement", "Effect"], [
              ["<code>print(x)</code>", "displays x on the screen; the program cannot use the displayed text"],
              ["<code>return x</code>", "sends x back to the caller, which can store it, calculate with it, or display it"],
            ]),
            T("A function without return returns <code>None</code>, the value that means \"no value\"."),
          ] },
          { kind: "code", part: "return and print", title: "Example: a missing return", blocks: [
            EX('def show_power(v, i):\n    print(v * i)\n\nresult = show_power(12, 2)\nprint("result =", result)\nprint(show_power(12, 2))', "print instead of return", [
              { c: "print(v * i)", e: "Displays 24, but returns nothing." },
              { c: "result", e: "The function returned None: <code>result = None</code>" },
              { c: "print(show_power(12, 2))", e: "The function displays <code>24</code>. Then print displays the returned value: <code>None</code>" },
            ]),
          ] },
          { kind: "concept", part: "Returning two values", title: "Returning two values", blocks: [
            L([
              "<code>return a, b</code> sends two values back.",
              "The call can assign them to two variables: <code>h, m = split_time(125)</code> (multiple assignment, Topic 02).",
            ]),
          ] },
          { kind: "code", part: "Returning two values", title: "Example: minutes to hours and minutes", blocks: [
            EX('def split_time(total):\n    return total // 60, total % 60\n\nh, m = split_time(125)\nprint(h, "h", m, "min")', "two results from one function", [
              { c: "return total // 60, total % 60", e: "Returns 2 and 5." },
              { c: "h, m = split_time(125)", e: "h = 2 and m = 5. Output: <code>2 h 5 min</code>" },
            ]),
          ] },
          { kind: "visual", part: "A function in a flowchart", title: "A function in a flowchart", blocks: [
            W("flowchart", F_func),
            T("The main chart (left) calls the function with a <b>predefined process</b> symbol (Topic 04). The function has its own chart (right): it starts with the function name and its parameters, and it ends with RETURN. In Python: <code>def circle_area(radius):</code> … <code>return a</code>."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Parameters are in the definition; arguments are in the call.",
              "<code>return</code> ends the function at once, also inside a branch or a loop, and sends a value back to the call.",
              "print displays a value; return gives it to the program. A function without return returns <code>None</code>.",
              "<code>return a, b</code> returns two values.",
              "In a flowchart, a predefined process symbol calls a function. The function has its own chart, which ends with RETURN.",
            ]),
            NEXT("<b>Arguments</b>. Arguments can be given by position or by name, and parameters can have default values."),
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("Complete the trace table on paper. The first row is complete: write the other rows."),
            W("traceTable", { trace: T_area, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Complete the code", blocks: [
            PQ("Complete the function, so that it returns the current I = V ÷ R.",
              "3.0", "def current(v, r):\n    return \n\nprint(current(12, 4))\n", null, "return v / r"),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program displays <code>None</code>, not the energy.<br>Correct the function <code>energy()</code>, so that the program displays the target output.",
              "Energy = 500 Wh", 'def energy(p, hours):\n    print(p * hours)\n\ne = energy(100, 5)\nprint("Energy =", e, "Wh")\n', null, "Use return instead of print."),
          ] },
          { kind: "exercise", title: "Write a function", blocks: [
            PQ("Write a program that displays the area and the perimeter of a rectangle.<br>1. Define a function <code>rect(w, h)</code> that returns the area and the perimeter.<br>2. Use these values: w = 5, h = 3.<br>3. Display the two results on one line.",
              "15 16", "# Write your program here\n", null, "Return both values with return w * h, 2 * (w + h), and store them with a, p = rect(5, 3)."),
          ] },
          { kind: "exercise", title: "Design and write", blocks: [
            PQ("Write a program that displays the average of three numbers.<br>1. First complete the three comments.<br>2. Define a function <code>average(a, b, c)</code> that returns the average.<br>3. Use these values: 20, 22, 26.<br>4. Display the result, rounded to 2 decimal places.",
              "22.67", "# Input:\n# Output:\n# Processing:\n\n", null, "The function returns (a + b + c) / 3, and the main program displays round(average(20, 22, 26), 2)."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "In `def power(v, i):`, v and i are…", choices: ["arguments", "parameters", "return values", "global variables"], answer: 1, explain: "The names in the definition are parameters." },
            { q: "A function has no return statement. It returns…", choices: ["0", "an empty string", "None", "an error"], answer: 2, explain: "Without return, a function returns None." },
          ])] },
        ],
      },

      /* =============================== 3. ARGUMENTS =============================== */
      {
        id: "arguments",
        title: "Positional, keyword, and default arguments",
        sub: "The order of arguments, arguments by name, default values, and a variable number of arguments.",
        slides: "05:13–16",
        keywords: "positional keyword default argument args variable length typeerror missing argument",
        deck: [
          { kind: "overview", title: "Positional, keyword, and default arguments", blocks: [
            T("A call can give its arguments by position or by name, and a parameter can have a default value. These options make functions flexible and calls readable."),
            L(["Positional arguments", "Keyword arguments", "Default values", "A variable number of arguments"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Positional arguments", title: "Positional arguments", blocks: [
            L([
              "Positional arguments are matched to the parameters in order: the first argument to the first parameter, and so on.",
              "The order matters: <code>describe(\"Pump\", 220)</code> and <code>describe(220, \"Pump\")</code> give different results.",
              "Each parameter without a default value must receive exactly one argument: too few or too many arguments cause a TypeError. A parameter with a default value (later in this lesson) may receive one.",
            ]),
          ] },
          { kind: "code", part: "Positional arguments", title: "Example: the order matters", blocks: [
            EX('def describe(name, voltage):\n    print(name, "at", voltage, "V")\n\ndescribe("Pump", 220)\ndescribe(220, "Pump")', "the same arguments, two orders", [
              { c: 'describe("Pump", 220)', e: "<code>Pump at 220 V</code>" },
              { c: 'describe(220, "Pump")', e: "The values are swapped: <code>220 at Pump V</code>" },
            ]),
          ] },
          { kind: "concept", part: "Keyword arguments", title: "Keyword arguments", blocks: [
            L([
              "A keyword argument names its parameter: <code>describe(voltage=220, name=\"Pump\")</code>.",
              "With keyword arguments, the order does not matter, and the call is easier to read.",
              "Positional arguments must come before keyword arguments in a call.",
            ]),
            CODE('describe(voltage=220, name="Pump")\ndescribe("Pump", voltage=220)', "Pump at 220 V\nPump at 220 V", "two calls with the same result"),
          ] },
          { kind: "concept", part: "Default values", title: "Default parameter values", blocks: [
            L([
              "A parameter can have a default value: <code>def motor(name, voltage=220):</code>.",
              "If the call gives no argument for it, the default is used.",
              "Parameters with a default must come after the parameters without one.",
            ]),
          ] },
          { kind: "code", part: "Default values", title: "First example: execution step by step", blocks: [W("codeTrace", T_default)] },
          { kind: "code", part: "Default values", title: "Example: defaults and positions together", blocks: [
            EX("def calc(a, b=2, c=3):\n    return a + b * c\n\nprint(calc(1))\nprint(calc(1, 3))\nprint(calc(1, c=10))", "which default is replaced", [
              { c: "calc(1)", e: "a = 1, b = 2, c = 3: 1 + 2 * 3 → <code>7</code>" },
              { c: "calc(1, 3)", e: "b = 3 (second position): 1 + 3 * 3 → <code>10</code>" },
              { c: "calc(1, c=10)", e: "b keeps 2: 1 + 2 * 10 → <code>21</code>" },
            ]),
          ] },
          { kind: "code", part: "Default values", title: "Example: a missing argument", blocks: [
            EX("def area(length, width):\n    return length * width\n\nprint(area(5, 3))\nprint(area(5))", "a wrong number of arguments", [
              { c: "area(5)", e: "The last line: <code>TypeError: area() missing 1 required positional argument: 'width'</code> The message names the parameter that received no argument." },
              { c: "Correction", e: "<code>area(5, 3)</code>, or a default value for width." },
            ]),
          ] },
          { kind: "concept", part: "A variable number of arguments", title: "The *args parameter", blocks: [
            L([
              "A parameter with a star, <code>*args</code>, receives any number of positional arguments. Any name can follow the star: <code>*values</code>.",
              "Inside the function, the name without the star holds the values in order. It is a tuple: a sequence that cannot be changed (Topic 06).",
              "Here it is used only with a for loop: <code>for r in values:</code>.",
              "<code>**kwargs</code> receives any number of keyword arguments. It needs a dictionary and is explained in Topic 06.",
            ]),
          ] },
          { kind: "code", part: "A variable number of arguments", title: "Example: *args", blocks: [
            EX("def total_resistance(*values):\n    total = 0\n    for r in values:\n        total = total + r\n    return total\n\nprint(total_resistance(100, 220, 330))", "resistors in series", [
              { c: "*values", e: "Receives 100, 220, and 330." },
              { c: "for r in values", e: "Adds each value: <code>650</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Positional arguments are matched in order.",
              "Keyword arguments name their parameter; their order does not matter.",
              "A default value is used when the call gives no argument for that parameter. Without a default value, a missing argument causes a TypeError.",
              "In a call: positional arguments first, then keyword arguments.",
              "<code>*args</code> accepts any number of positional arguments.",
            ]),
            NEXT("<b>Variable scope</b>. Which variables a function can see and change."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Write the output of each call of <code>show()</code> on paper.")],
            [RUN('def show(a, b=5, c="V"):\n    print(a + b, c)\n\nshow(1)\nshow(1, 2)\nshow(1, c="A")\nshow(b=10, a=0)')],
          ], answer: [OUT("6 V\n3 V\n6 A\n10 V")] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Line 1 of the program causes a SyntaxError.<br>Correct line 1, so that the program displays the target output.",
              "Fan 110 V", 'def motor(voltage=220, name):\n    print(name, voltage, "V")\n\nmotor("Fan", 110)\n', null, "A parameter with a default value must come after the parameters without one: def motor(name, voltage=220):"),
          ] },
          { kind: "exercise", title: "Write a function with a default value", blocks: [
            PQ("Write a program that displays the target output.<br>1. Define a function <code>power(v, i, efficiency=1.0)</code> that returns v × i × efficiency.<br>2. Display <code>power(12, 2)</code> and <code>power(12, 2, efficiency=0.75)</code> on one line.",
              "24.0 18.0", "# Write your program here\n", null, "return v * i * efficiency"),
          ] },
          { kind: "exercise", title: "Write a function with *args", blocks: [
            PQ("Write a program that displays the target output.<br>1. Define a function <code>average(*values)</code> that returns the average of its arguments.<br>2. In the function, use a <code>for</code> loop to add the values and to count the values.<br>3. Display <code>average(3, 17, 9, 12)</code>.",
              "10.25", "# Write your program here\n", null, "In the loop, write total = total + v and count = count + 1; after the loop, return total / count."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`def calc(a, b=2, c=3): return a + b * c`. What is `calc(1, 3)`?", choices: ["7", "10", "12", "Error"], answer: 1, explain: "3 goes to b (the second position): 1 + 3 * 3 = 10." },
            { q: "Which call is valid for `def f(a, b):`?", choices: ["f(a=1, 2)", "f(1, b=2)", "f(b=2, 1)", "f(1)"], answer: 1, explain: "Positional arguments must come first, and b has no default value, so it needs an argument." },
          ])] },
        ],
      },

      /* =============================== 4. SCOPE =============================== */
      {
        id: "scope",
        title: "Variable scope",
        sub: "Local and global variables, and the global keyword.",
        slides: "05:9–11",
        keywords: "scope local global variable global keyword parameter copy unboundlocalerror",
        deck: [
          { kind: "overview", title: "Variable scope", blocks: [
            T("The <b>scope</b> of a variable is the part of the program where the variable can be used. A function has its own local variables, separate from the variables of the main program."),
            L(["Local variables", "Global variables", "The same name: local and global", "The global keyword"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Local variables", title: "Local variables", blocks: [
            L([
              "A variable assigned inside a function is <b>local</b>. Parameters are local too.",
              "It exists only while the function runs, and only the function can use it.",
              "Local variables keep functions independent: two functions can use the same names without conflict.",
              "Using a local variable outside its function causes a NameError.",
            ]),
          ] },
          { kind: "code", part: "Local variables", title: "Example: a local variable outside its function", blocks: [
            EX("def calc():\n    x = 10\n    print(x)\n\ncalc()\nprint(x)", "x is local to calc", [
              { c: "calc()", e: "Displays <code>10</code>." },
              { c: "print(x)", e: "NameError: x does not exist outside calc." },
            ]),
          ] },
          { kind: "concept", part: "Global variables", title: "Global variables", blocks: [
            L([
              "A variable assigned outside every function is <b>global</b>.",
              "A function can read a global variable.",
              "Many global variables make a program hard to follow. Prefer parameters and return values.",
            ]),
          ] },
          { kind: "code", part: "Global variables", title: "Example: reading a global variable", blocks: [
            EX("rate = 4.5\n\ndef cost(kwh):\n    return kwh * rate\n\nprint(cost(10))", "rate is global", [
              { c: "rate = 4.5", e: "Assigned outside every function: a global variable." },
              { c: "kwh * rate", e: "cost reads the global rate: 10 * 4.5 → <code>45.0</code>" },
            ]),
          ] },
          { kind: "concept", part: "The same name: local and global", title: "The same name inside and outside", blocks: [
            L([
              "An assignment inside a function creates a <b>new local variable</b>, even if a global variable has the same name.",
              "Inside the function, the name means the local variable. Outside, it means the global one.",
              "The global variable is not changed.",
            ]),
          ] },
          { kind: "code", part: "The same name: local and global", title: "First example: execution step by step", blocks: [W("codeTrace", T_scope)] },
          { kind: "concept", part: "The same name: local and global", title: "A parameter receives a copy of the value", blocks: [
            L([
              "A parameter is a local variable. At a call, it receives a copy of the argument's value.",
              "Assigning to a parameter does not change the caller's variable, even when both have the same name.",
              "A return value that is not stored is lost. To keep it, store it: <code>count = add_ten(count)</code>.",
              "Topic 06 explains what changes when the argument is a list.",
            ]),
          ] },
          { kind: "code", part: "The same name: local and global", title: "Example: assigning to a parameter", blocks: [W("codeTrace", T_copy)] },
          { kind: "code", part: "The global keyword", title: "Example: UnboundLocalError", blocks: [
            EX("count = 0\n\ndef add_one():\n    count = count + 1\n\nadd_one()\nprint(count)", "a function assigns to a global name", [
              { c: "count = count + 1", e: "The assignment makes count local. The right side reads it before it has a value." },
              { c: "add_one()", e: "<code>UnboundLocalError: cannot access local variable 'count' …</code>" },
            ]),
          ] },
          { kind: "concept", part: "The global keyword", title: "The global keyword", blocks: [
            L([
              "Without <code>global</code>, a function can read a global variable but cannot assign to it.",
              "<code>global x</code> inside a function means: x in this function is the global variable.",
              "An assignment to x then changes the global variable.",
              "Use it rarely. A return value is usually clearer.",
            ]),
          ] },
          { kind: "code", part: "The global keyword", title: "Example: changing a global variable", blocks: [
            EX("x = 5\n\ndef modify():\n    global x\n    x = 10\n\nmodify()\nprint(x)", "global x", [
              { c: "global x", e: "x in modify is the global x." },
              { c: "print(x)", e: "The global x was changed: <code>10</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Variables assigned inside a function, and parameters, are local: they exist only during the call.",
              "A function can read global variables.",
              "An assignment inside a function creates a local variable, even with a global name.",
              "Assigning to a parameter does not change the caller's variable. A return value must be stored to be kept.",
              "<code>global x</code> lets a function change the global x.",
            ]),
            NEXT("<b>Nested calls and recursion</b>. A function can call another function, or itself."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Write the output of the program on paper, line by line.<br>First, decide for each <code>n</code> in the program: local variable or global variable.")],
            [RUN('n = 3\n\ndef test():\n    n = 7\n    print("inside:", n)\n\ntest()\nprint("outside:", n)')],
          ], answer: [OUT("inside: 7\noutside: 3")] },
          { kind: "exercise", title: "Determine the output: global", answerCol: 0, cols: [
            [T("Write the output of the program on paper, line by line.")],
            [RUN("count = 0\ndef add_one():\n    global count\n    count = count + 1\nadd_one()\nadd_one()\nprint(count)")],
          ], answer: [OUT("2")] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Line 5 of the program causes a NameError.<br>Correct the program, so that it displays the target output.<br>1. In the function <code>add()</code>, add a statement that returns <code>total</code>.<br>2. In line 4 of the program, store the returned value in the variable <code>total</code>.",
              "Total = 30", 'def add(a, b):\n    total = a + b\n\nadd(10, 20)\nprint("Total =", total)\n', null, "The variable total is local to add(): write return total in the function, and total = add(10, 20) in line 4."),
          ] },
          { kind: "exercise", title: "Rewrite without global", blocks: [
            PQ("Change the program, so that it displays the target output without <code>global</code>.<br>1. The function <code>charge()</code> receives the level as a parameter.<br>2. The function returns the new level.<br>3. The main program stores the returned value in <code>level</code>.",
              "70", "level = 40\ndef charge():\n    global level\n    level = level + 30\ncharge()\nprint(level)\n", null, "Define charge(level) with return level + 30, and call the function with level = charge(level)."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`value = 1`, then `def show(): value = 2; print(value, end=\" \")`, then `show()` and `print(value)`. The output is…", choices: ["1 1", "1 2", "2 1", "2 2"], answer: 2, explain: "show displays its local value 2. The global value is still 1." },
            { q: "A local variable exists…", choices: ["for the whole program", "only while its function runs", "only before the function is called", "in every function"], answer: 1, explain: "It is created during the call and removed when the function returns." },
          ])] },
        ],
      },

      /* =============================== 5. NESTED CALLS AND RECURSION =============================== */
      {
        id: "recursion",
        title: "Nested calls and recursion",
        sub: "A function that calls another function, and a function that calls itself.",
        slides: "05:7–8",
        keywords: "nested call function calls function recursion base case factorial call stack",
        deck: [
          { kind: "overview", title: "Nested calls and recursion", blocks: [
            T("A function can call another function. It can also call itself; this is <b>recursion</b>."),
            L(["Nested calls", "Recursion", "The base case"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Nested calls", title: "A function that calls a function", blocks: [
            L([
              "Inside its body, a function can call another function.",
              "The calling function waits until the called function returns, then continues.",
              "Each call has its own local variables, even when the parameter names are the same.",
            ]),
          ] },
          { kind: "code", part: "Nested calls", title: "First example: execution step by step", blocks: [W("codeTrace", T_nested)] },
          { kind: "code", part: "Nested calls", title: "Example: power from voltage and resistance", blocks: [
            EX("def current(v, r):\n    return v / r\n\ndef power(v, r):\n    return v * current(v, r)\n\nprint(power(12, 4))", "power calls current", [
              { c: "current(v, r)", e: "12 / 4 → 3.0" },
              { c: "v * current(v, r)", e: "12 * 3.0 → <code>36.0</code>" },
            ]),
          ] },
          { kind: "concept", part: "Recursion", title: "Recursion", blocks: [
            L([
              "A <b>recursive</b> function calls itself with a smaller problem.",
              "Example: n! = n × (n − 1)!, and 0! = 1.",
              "Each call waits for the call inside it. The calls are stored on the <b>call stack</b>: the most recent call on top.",
            ]),
            CODE("def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)", null, "from the lecture"),
          ] },
          { kind: "visual", part: "Recursion", title: "factorial(3) on the call stack", blocks: [
            W("callStack", { title: "factorial(3)", code: FACT_CODE, steps: [
              { line: 5, frames: [f(3, "call")], note: "The first call: n = 3." },
              { line: 3, frames: [f(3, "wait"), f(2, "call")], note: "3 is not 0: factorial(2) is called. factorial(3) waits." },
              { line: 3, frames: [f(3, "wait"), f(2, "wait"), f(1, "call")], note: "factorial(1) is called." },
              { line: 3, frames: [f(3, "wait"), f(2, "wait"), f(1, "wait"), f(0, "call")], note: "factorial(0) is called." },
              { line: 2, frames: [f(3, "wait"), f(2, "wait"), f(1, "wait"), f(0, "base", "1")], note: "n == 0: the base case returns 1." },
              { line: 3, frames: [f(3, "wait"), f(2, "wait"), f(1, "return", "1")], note: "factorial(1) returns 1 * 1 → 1." },
              { line: 3, frames: [f(3, "wait"), f(2, "return", "2")], note: "factorial(2) returns 2 * 1 → 2." },
              { line: 3, frames: [f(3, "return", "6")], note: "factorial(3) returns 3 * 2 → 6." },
              { line: 5, frames: [], note: "The calls went down to the base case; the results came back up. Result check: 3 × 2 × 1 = 6.", returned: "6" },
            ] }),
          ] },
          { kind: "concept", part: "The base case", title: "The base case", blocks: [
            L([
              "The <b>base case</b> is the condition where the function returns without calling itself.",
              "Every recursive call must move toward the base case.",
              "Without a reachable base case, the calls never stop. Python then stops the program with a RecursionError.",
            ]),
          ] },
          { kind: "code", part: "The base case", title: "Example: the sum 1 to n", blocks: [
            EX("def sum_to(n):\n    if n == 1:\n        return 1\n    return n + sum_to(n - 1)\n\nprint(sum_to(4))", "base case n == 1", [
              { c: "sum_to(4)", e: "4 + sum_to(3) → 4 + 3 + sum_to(2) → …" },
              { c: "n == 1", e: "The base case ends the calls: 4 + 3 + 2 + 1 = <code>10</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A function can call another function; the caller waits for the result.",
              "Each call has its own local variables.",
              "A recursive function calls itself with a smaller problem.",
              "The base case returns without a recursive call; every call must move toward it.",
            ]),
            NEXT("<b>Modules</b>. Functions can be stored in a file and used in other programs."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Write the output of the program on paper, line by line.")],
            [RUN("def square(x):\n    return x * x\n\ndef sum_squares(a, b):\n    return square(a) + square(b)\n\nprint(sum_squares(3, 4))")],
          ], answer: [OUT("25")] },
          { kind: "exercise", title: "Trace the recursion", answerCol: 0, cols: [
            [T("Complete the table on paper.<br>1. <b>Waits for</b>: write the call that each call waits for.<br>2. <b>Returns</b>: write the value that each call returns."),
              { type: "table", hideOnAnswer: true, head: ["Call", "Waits for", "Returns"], rows: [["power2(3)", "", ""], ["power2(2)", "", ""], ["power2(1)", "", ""], ["power2(0)", "", ""]], cls: "center" }],
            [RUN("def power2(n):\n    if n == 0:\n        return 1\n    return 2 * power2(n - 1)\n\nprint(power2(3))")],
          ], answer: [
            TB(["Call", "Waits for", "Returns"], [["power2(3)", "power2(2)", "8"], ["power2(2)", "power2(1)", "4"], ["power2(1)", "power2(0)", "2"], ["power2(0)", "no call (base case)", "1"]], null, "center"),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program stops with a RecursionError.<br>Correct the recursive call in line 4, so that the program displays the target output.",
              "15", "def sum_to(n):\n    if n == 1:\n        return 1\n    return n + sum_to(n + 1)\n\nprint(sum_to(5))\n", null, "The recursion never reaches the base case n == 1: the call must be sum_to(n - 1)."),
          ] },
          { kind: "exercise", title: "Write a recursive function", blocks: [
            PQ("Define a recursive function <code>countdown(n)</code>.<br>1. The function displays n, n − 1, …, 1, and then <code>Go</code>.<br>2. Call <code>countdown(3)</code>.",
              "3\n2\n1\nGo", "# Write your program here\n", null, 'When n == 0, display "Go"; in the else branch, display n and then call countdown(n - 1).'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "What stops a recursive function?", choices: ["The global keyword", "The base case", "A second function", "print"], answer: 1, explain: "The base case returns without calling the function again." },
            { q: "`factorial(3)` with `return n * factorial(n - 1)` and `factorial(0) = 1` returns…", choices: ["3", "6", "9", "0"], answer: 1, explain: "3 × 2 × 1 × 1 = 6." },
          ])] },
        ],
      },

      /* =============================== 6. MODULES =============================== */
      {
        id: "modules",
        title: "Modules",
        sub: "Using functions from other files, the standard library, and third-party packages.",
        slides: "05:18–21",
        keywords: "module import from as math sqrt pow pi ceil floor random pip install help",
        deck: [
          { kind: "overview", title: "Modules", blocks: [
            T("A <b>module</b> is a <code>.py</code> file that contains functions and variables. Other programs can import it and use its functions."),
            L(["Modules and import", "from … import", "The standard library", "Third-party modules and pip"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Modules and import", title: "A module is a file", blocks: [
            L([
              "The module name is the file name without <code>.py</code>: the file <code>tools.py</code> is the module <code>tools</code>.",
              "<code>import tools</code> loads the module. Its functions are then used with the module name: <code>tools.add(4, 9)</code>.",
              "The module file must be in the same folder as the program (or installed).",
            ]),
          ] },
          { kind: "code", part: "Modules and import", title: "Example: two files", cols: [
            [CODE("def add(a, b):\n    return a + b\n\ndef sub(a, b):\n    return a - b", null, "tools.py")],
            [CODE("import tools\n\nx, y = 4, 9\nprint(tools.sub(x, y), tools.add(y, x))", "-5 13", "main.py")],
          ] },
          { kind: "concept", part: "from … import", title: "from … import and as", blocks: [
            TB(["Statement", "Use in the program"], [
              ["<code>import tools</code>", "<code>tools.add(1, 2)</code>; a bare <code>add(1, 2)</code> causes a NameError"],
              ["<code>from tools import add</code>", "<code>add(1, 2)</code>; only add is imported, and the name tools is not defined"],
              ["<code>import math as m</code>", "<code>m.sqrt(16)</code>: a short alias"],
            ]),
            T("After <code>from tools import add</code>, the call <code>tools.sub(x, y)</code> causes a NameError."),
          ] },
          { kind: "code", part: "from … import", title: "Example: three import forms", blocks: [
            EX("import math\nfrom math import sqrt\nimport math as m\n\nprint(math.sqrt(25))\nprint(sqrt(25))\nprint(m.pi)", "the same module, three ways", [
              { c: "math.sqrt(25)", e: "Module name and function: <code>5.0</code>" },
              { c: "sqrt(25)", e: "Imported directly: <code>5.0</code>" },
              { c: "m.pi", e: "The alias m: <code>3.141592653589793</code>" },
            ]),
          ] },
          { kind: "concept", part: "The standard library", title: "The standard library", blocks: [
            T("Python includes more than 200 modules, the <b>standard library</b>. They need no installation."),
            TB(["Module", "Example", "Result"], [
              ["<code>math</code>", "<code>math.sqrt(9)</code>", "<code>3.0</code>: the square root"],
              ["<code>math</code>", "<code>math.pow(2, 3)</code>", "<code>8.0</code>: 2 to the power 3"],
              ["<code>math</code>", "<code>math.pi</code>", "<code>3.141592653589793</code>: the constant π"],
              ["<code>math</code>", "<code>math.ceil(2.1)</code>, <code>math.floor(2.9)</code>", "<code>3</code> (round up), <code>2</code> (round down)"],
              ["<code>random</code>", "<code>random.randint(1, 10)</code>", "a random integer from 1 to 10"],
            ]),
            T("<code>help(math.sqrt)</code> displays the documentation of a function: its docstring (Lesson 1)."),
          ] },
          { kind: "code", part: "The standard library", title: "Example: math and random", blocks: [
            EX("import math\nimport random\n\nprint(math.pow(2, 3))\nprint(math.sqrt(2))\nprint(random.randint(1, 10))", "the last value is random", [
              { c: "math.pow(2, 3)", e: "<code>8.0</code>: pow always returns a float" },
              { c: "math.sqrt(2)", e: "<code>1.4142135623730951</code>" },
              { c: "random.randint(1, 10)", e: "An integer from 1 to 10; it changes from run to run." },
            ]),
          ] },
          { kind: "concept", part: "Third-party modules and pip", title: "Third-party modules and pip", blocks: [
            L([
              "Other modules are published on PyPI, the Python Package Index.",
              "<code>pip install numpy</code>, typed in a terminal (not in Python), installs a module.",
              "After the installation, the module is imported like any other: <code>import numpy as np</code>.",
              "Topic 08 uses the third-party modules NumPy and pandas.",
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A module is a .py file; its name is the file name without .py.",
              "<code>import m</code> → <code>m.f()</code>. <code>from m import f</code> → <code>f()</code>. <code>import m as a</code> → <code>a.f()</code>.",
              "The standard library (math, random) needs no installation. <code>help()</code> displays its documentation.",
              "<code>pip install name</code> installs a third-party module.",
            ]),
            NEXT("<b>Trace challenges</b>. Ten programs to trace by hand. They use the rules of all lessons of this chapter."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Write the output of the program on paper, line by line.")],
            [RUN("import math\nfrom math import floor\n\nprint(math.ceil(4.2))\nprint(floor(4.8))\nprint(math.pow(3, 2))")],
          ], answer: [OUT("5\n4\n9.0")] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program stops with a NameError in line 3.<br>Correct line 3, so that the program displays the target output.",
              "4.0", "from math import sqrt\n\nprint(math.sqrt(16))\n", null, "After from math import sqrt, the name math is not defined: call sqrt(16) without math."),
          ] },
          { kind: "exercise", title: "Write a program with math", blocks: [
            PQ("Write a program that displays the target output.<br>1. Define a function <code>hypotenuse(a, b)</code> that returns √(a² + b²).<br>2. Use <code>math.sqrt()</code> in the function.<br>3. Display <code>hypotenuse(3, 4)</code>.",
              "5.0", "import math\n\n# Write the function here\n", null, "return math.sqrt(a ** 2 + b ** 2)"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "The file `area.py` is imported with…", choices: ["import area.py", "import area", "include area", "from area.py"], answer: 1, explain: "The module name is the file name without .py." },
            { q: "After `from tools import add`, the call `tools.sub(4, 9)` gives…", choices: ["-5", "5", "13", "a NameError"], answer: 3, explain: "Only add was imported; the name tools is not defined." },
          ])] },
        ],
      },

      /* =============================== 7. TRACE CHALLENGES =============================== */
      {
        id: "trace",
        title: "Trace challenges",
        sub: "Ten programs to execute by hand, in four levels.",
        keywords: "trace table trace the code execute by hand function call parameter return local variable scope recursion challenge",
        deck: [
          { kind: "overview", title: "Trace challenges", blocks: [
            T("Each program in this lesson has at least one line that is easy to trace wrongly."),
            L([
              "Write one row for each line that runs, with its number in the column <b>Line</b>. A <code>def</code> line only creates the function: its row holds no value.",
              "The row of a call line holds the parameters. The next row is the first line inside the function.",
              "A column such as <code>v (half)</code> is the variable <code>v</code> inside <code>half</code>. Write <code>–</code> for a variable that does not exist.",
              "On the row where a function ends, its variables disappear. The same row holds the value that the call line stores or displays: <code>None</code> for a function without <code>return</code>.",
              "In the column <b>Condition</b>, write True or False on a line that tests a condition. A <code>for</code> line gets one more row when its loop ends.",
            ], "Rules of a trace", true),
          ] },
          { kind: "concept", title: "The four levels", blocks: [
            T("Each level uses only the lessons that it names. A level can be done when its lessons are complete."),
            TB(["Level", "Lessons", "Programs", "Subject"], [
              ["1", "1 and 2", "1 to 3", "calls, parameters, <code>return</code>, <code>None</code>, a return in a branch or a loop"],
              ["2", "3", "4 and 5", "positional and keyword arguments, default values, <code>*args</code>"],
              ["3", "4", "6 and 7", "local and global variables, the same name inside and outside, <code>global</code>"],
              ["4", "5 and 6", "8 to 10", "nested calls, recursion, <code>math</code>, and a program that stops"],
            ]),
          ] },
          { kind: "exercise", title: "Level 1: two functions", blocks: [
            T(TRACE(3)),
            CH(C_two, 3),
          ], answer: [
            T("<code>show()</code> displays a value, but it has no <code>return</code>: the function returns <code>None</code>, and line 8 stores None in <code>b</code>. Line 2: <code>/</code> gives a float: <code>4.5</code>, then <code>2.25</code>. Each call creates a new local <code>v</code>, which disappears when the function ends."),
          ] },
          { kind: "exercise", title: "Level 1: two return values", blocks: [
            T(TRACE(2)),
            CH(C_low, 2),
          ], answer: [
            L([
              "Lines 6 and 8: <code>a &gt; b</code> is True. Line 3 returns and ends the function: line 4 does not run.",
              "Line 7: the arguments are evaluated first: <code>low(3, 8)</code>. The condition is False, so line 4 returns 3 and 8.",
              "Line 7 assigns the two values in order to <code>y, x</code>: <code>y</code> receives 3, and <code>x</code> receives 8.",
            ]),
          ] },
          { kind: "exercise", title: "Level 1: heating steps", blocks: [
            T(TRACE(2)),
            CH(C_heat, 2),
          ], answer: [
            L([
              "Line 8: in the first pass, <code>40 &gt;= 40</code> is True. Line 5 returns 1 and ends the function at once: the loop does not continue with <code>n = 2</code>.",
              "Line 9: <code>heat(a)</code> is <code>heat(1)</code>. The values 11 and 21 are less than 40, so the loop ends, and line 6 returns 0.",
              "Line 9 displays when the call has returned: the output <code>1 0</code> is in the row of line 6.",
            ]),
          ] },
          { kind: "exercise", title: "Level 2: a voltage drop", blocks: [
            T(TRACE(2)),
            CH(C_drop, 2),
          ], answer: [
            L([
              "Line 4: one argument. <code>r</code> and <code>i</code> use the default values: <code>60 - 10 * 2</code> → <code>40</code>.",
              "Line 5: the second position is <code>r</code>, so 40 replaces the default 10: <code>100 - 40 * 2</code> → <code>20</code>.",
              "Line 7: a keyword argument names its parameter, so the order does not matter: v = 20, i = 1. <code>r</code> keeps 10.",
              "Line 8: the arguments are evaluated first: v = 90, i = 5. <code>r</code> keeps 10: <code>90 - 10 * 5</code> → <code>40</code>.",
            ]),
          ] },
          { kind: "exercise", title: "Level 2: the highest temperature", blocks: [
            T(TRACE(3) + "<br>2. The parameter <code>temps</code> has no column in the table."),
            CH(C_top, 3),
          ], answer: [
            L([
              "Line 9: <code>top()</code> receives no argument, so the loop of line 3 does not run. The function returns the start value of <code>hi</code>: 0.",
              "Line 10: the arguments are -4 and -35. No value is greater than 0, so <code>hi</code> stays 0: <code>b</code> is 0, not -4.",
              "The function returns the highest value only when at least one argument is greater than 0.",
            ]),
          ] },
          { kind: "exercise", title: "Level 3: gain and level", blocks: [
            T(TRACE(3)),
            CH(C_boost, 3),
          ], answer: [
            L([
              "The parameter <code>level</code> is a local variable. Line 5 changes the local variable, not the global <code>level</code>.",
              "Line 8 does not store the returned value 20: the value is lost, and line 9 displays 10.",
              "Line 5 reads the global <code>gain</code> when it runs: 2 in the calls of lines 8 and 10, and 6 in the call of line 11.",
            ]),
          ] },
          { kind: "exercise", title: "Level 3: a running total", blocks: [
            T(TRACE(3) + "<br>2. Line 3, <code>global total</code>, has no row in the table."),
            CH(C_total, 3),
          ], answer: [
            L([
              "Line 4 changes the global <code>total</code>, because line 3 names it with <code>global</code>.",
              "Line 7 is in a function without <code>global</code>: it creates a local <code>total</code>. The global <code>total</code> is still 15, and <code>clear()</code> returns 0.",
              "Line 13: <code>add()</code> has no <code>return</code>, so it returns <code>None</code>: <code>x</code> becomes None. The global <code>total</code> is 17.",
            ]),
          ] },
          { kind: "exercise", title: "Level 4: a call inside a call", blocks: [
            T(TRACE(4) + "<br>2. Line 12 has two calls: the row of the <code>return</code> of the first call also holds the parameter of the second call."),
            CH(C_nested, 4),
          ], answer: [
            L([
              "<code>root</code> and <code>diff</code> each have their own <code>v</code>. Line 4 changes only the <code>v</code> of <code>root</code>: in line 9, the <code>v</code> of <code>diff</code> is still 1, and later 9.",
              "<code>math.sqrt()</code> returns a float: <code>3.0</code> and <code>5.0</code>. Line 9: <code>3.0 - 1</code> → <code>2.0</code>, and <code>5.0 - 9</code> → <code>-4.0</code>.",
              "Line 12: the argument is evaluated first, so <code>diff(9)</code> runs before <code>root</code>. Then <code>-4.0 + 6</code> → <code>2.0</code> is passed to <code>root</code>: the row of the return of <code>diff</code> holds <code>v (root)</code> = 2.0.",
            ]),
          ] },
          { kind: "exercise", title: "Level 4: a program without a name", blocks: [
            T(TRACE(2) + "<br>2. The column <code>n (f #2)</code> is the variable <code>n</code> inside the second active call of <code>f</code>.<br>3. Write in one sentence what <code>f(n)</code> returns."),
            CH(C_recur, 2),
          ], answer: [
            L([
              "Each call has its own <code>n</code>: 6, 3, and 1. Each call waits in line 3 for the call inside it.",
              "The last call, with n = 1, is the base case: the condition is False, and line 4 returns 1.",
              "The calls return in reverse order. Line 3 of each waiting call then stores its sum: <code>3 + 1</code> → <code>4</code>, then <code>6 + 4</code> → <code>10</code>.",
              "<code>f(n)</code> returns n + n // 2 + n // 4 + … down to 1: 6 + 3 + 1 = 10.",
            ]),
          ] },
          { kind: "exercise", title: "Level 4: the program stops", blocks: [
            T("The program stops with an error message before its last line.<br>1. Complete the trace table on paper. The first 4 rows are complete.<br>2. In the last row, write the name of the error in the column Output.<br>3. Write the number of the line that stops, and the corrected line."),
            CH(C_stop, 4),
          ], answer: [
            L([
              "Line 10 does not stop: <code>show()</code> has no <code>return</code>, so <code>a</code> is None. Line 12 displays <code>None</code>.",
              "Line 11 does not stop: the name <code>half</code> without parentheses is not a call, and the body does not run.",
              "Line 13 stops with a <b>NameError</b>: line 1 imports only <code>floor</code>, so the name <code>math</code> is not defined. Line 14 does not run.",
            ]),
            CODE("b = floor(4.5)", null, "line 13, corrected"),
          ] },
        ],
      },

      /* =============================== 8. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete problems solved with functions.",
        slides: "05:23",
        keywords: "practice function time to seconds random sqrt prime input battery recursion",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Solve every problem with a function, in the five steps:"),
            L([
              "<b>Understand</b>: the <b>parameters</b>, the values the function needs, and the <b>return value</b>, the result it gives back.",
              "<b>Design</b>: the processing, the steps inside the function.",
              "<b>Code</b>: write the function and the call.",
              "<b>Test</b>: call the function with the test values and check the output.",
              "<b>Correct</b>: if the output differs, find the wrong step, correct it, and test again.",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: time to seconds", blocks: [
            T("Define <code>time_to_seconds(hours, minutes, seconds)</code> that returns the total number of seconds."),
            IPO([["Parameters", "hours, minutes, seconds"], ["Return value", "the total in seconds"], ["Processing", "hours × 3600 + minutes × 60 + seconds"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the function", blocks: [
            PQ("Write the program of Problem 1.<br>1. Define the function <code>time_to_seconds(hours, minutes, seconds)</code>.<br>2. Display <code>time_to_seconds(1, 2, 5)</code>.", "3725", "# Write your program here\n", null, "return hours * 3600 + minutes * 60 + seconds"),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: square root of a random number", blocks: [
            T("Define <code>generate_random_sqrt(n)</code> that picks a random integer from 1 to n and returns its square root."),
            IPO([["Parameter", "n"], ["Return value", "the square root of a random integer from 1 to n"], ["Processing", "random.randint(1, n), then math.sqrt"]]),
            N("<code>random.seed(1)</code> makes the random numbers repeat, so that the output can be checked."),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the function", blocks: [
            PQ("Write the program of Problem 2.<br>1. Write your code below line 4, <code>random.seed(1)</code>.<br>2. Define the function <code>generate_random_sqrt(n)</code>.<br>3. Display <code>round(generate_random_sqrt(100), 3)</code>.", "4.243", "import math\nimport random\n\nrandom.seed(1)\n# Write the function and the call here\n", null, "return math.sqrt(random.randint(1, n))"),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: a prime test", blocks: [
            T("Define <code>is_prime(n)</code> that returns True if n is a prime number, otherwise False."),
            IPO([["Parameter", "n (int, greater than 1)"], ["Return value", "True or False"], ["Processing", "return False at the first divisor from 2 to n − 1; return True after the loop"]]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the function", blocks: [
            PQ("Write the program of Problem 3.<br>1. Define the function <code>is_prime(n)</code>.<br>2. Display <code>is_prime(13)</code> and <code>is_prime(15)</code> on one line.", "True False", "# Write your program here\n", null, "In a loop for i in range(2, n), return False when n % i == 0; after the loop, return True."),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: temperature conversion with a default", blocks: [
            T("Define <code>convert(t, unit=\"F\")</code> that converts a temperature t in °C.<br>1. When unit is \"F\", the function returns °F: F = C × 9 / 5 + 32.<br>2. When unit is \"K\", the function returns kelvin: K = C + 273.15."),
            IPO([["Parameters", "t, and unit with the default \"F\""], ["Return value", "the converted temperature"], ["Decision", "unit == \"F\" or unit == \"K\""]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the function", blocks: [
            PQ("Write the program of Problem 4.<br>1. Define the function <code>convert(t, unit=\"F\")</code>.<br>2. Display <code>convert(25)</code> and <code>convert(25, unit=\"K\")</code> on one line.", "77.0 298.15", "# Write your program here\n", null, 'When unit == "F", return t * 9 / 5 + 32; in the else branch, return t + 273.15.'),
          ] },
          { kind: "problem", part: "Problem 5", title: "Problem 5: battery run time from input", blocks: [
            T("Compute the run time of a battery with a function. The main program has three steps:<br>1. Read the capacity of the battery (mAh) and the load current (mA).<br>2. Call the function.<br>3. Display the run time in hours."),
            IPO([
              ["Input", "capacity and current (float), read with input() in the main program"],
              ["Function", "<code>run_time(capacity, current)</code> returns capacity ÷ current"],
              ["Output", "the run time, displayed with print() in the main program"],
              ["Rule", "the function itself uses no input() and no print()"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 5", title: "Problem 5: write the program", blocks: [
            PQ("Write the program of Problem 5.<br>1. Line 1 of the program: define <code>run_time(capacity, current)</code>.<br>2. Line 5 of the program: call the function.<br>3. Then display the 3rd line of the target output.<br>Test input: 2000 and 250.",
              "Capacity (mAh): 2000\nCurrent (mA): 250\nRun time = 8.0 h",
              '# Write the function here\n\ncapacity = float(input("Capacity (mAh): "))\ncurrent = float(input("Current (mA): "))\n# Call the function and display the result\n',
              ["2000", "250"], 'Store the result with hours = run_time(capacity, current), then write print("Run time =", hours, "h").'),
          ] },
          { kind: "problem", part: "Problem 6", title: "Problem 6: recursive sum of digits", blocks: [
            T("Define a recursive <code>digit_sum(n)</code> that returns the sum of the digits of a positive integer n."),
            IPO([["Parameter", "n"], ["Return value", "the sum of the digits"], ["Base case", "n &lt; 10: return n"], ["Recursive case", "the last digit (n % 10) + digit_sum(n // 10)"]]),
          ] },
          { kind: "exercise", part: "Problem 6", title: "Problem 6: write the function", blocks: [
            PQ("Write the program of Problem 6.<br>1. Define the recursive function <code>digit_sum(n)</code>.<br>2. Display <code>digit_sum(2026)</code>.", "10", "# Write your program here\n", null, "When n < 10, return n; in the other case, return n % 10 + digit_sum(n // 10)."),
          ] },
          { kind: "summary", title: "Chapter summary", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1–2. Functions", "<code>def</code> defines; a call runs the body. <code>return</code> sends a result back."],
              ["3. Arguments", "Positional in order, keyword by name, defaults when omitted."],
              ["4. Scope", "Local variables exist only during the call; <code>global</code> is rarely needed."],
              ["5–6. Calls and modules", "Functions call functions and themselves (base case). <code>import</code> uses other files."],
            ]),
            N("<b>Topic 06: Strings, lists, and dictionaries</b>. Data structures that store many values in one variable.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
