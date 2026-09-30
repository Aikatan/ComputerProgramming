/* ===================== Topic 05 - Functions and Modules =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: defining -> parameters and return -> arguments -> scope -> functions that call functions -> modules -> practice.
   Python level: t02-t04 material plus def, return, import. No lists, dicts (except *args/**kwargs with a for loop), or try.
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

  /* ---------- traces ---------- */
  const T_line = {
    code: ["def line():", '    print("----------")', "", "line()", 'print("Motor report")', "line()"],
    steps: [
      { line: 0, note: "def creates the function <code>line</code>. Its body does not run now." },
      { line: 3, note: "Call: the program jumps into the function." },
      { line: 1, note: "The body runs.", print: "----------" },
      { line: 4, note: "The function ends. The program continues after the call.", print: "Motor report" },
      { line: 5, note: "Second call: the program jumps into the function again." },
      { line: 1, note: "The body runs again.", print: "----------" },
      { line: -1, note: "The program ends: one definition, two calls. The body (line 2) ran twice, once for each call. Line 1 only created the function." },
    ],
  };

  const T_power = {
    code: ["def power(v, i):", "    p = v * i", "    return p", "", "result = power(12, 2)", 'print("Power =", result, "W")'],
    steps: [
      { line: 0, note: "def creates the function <code>power</code> with the parameters v and i." },
      { line: 4, note: "Call power(12, 2): the parameters receive the arguments.", set: { "v (power)": "12", "i (power)": "2" } },
      { line: 1, note: "v * i → 24, stored in the local variable p.", set: { "p (power)": "24" } },
      { line: 2, note: "return sends 24 back. The local variables disappear.", unset: ["v (power)", "i (power)", "p (power)"] },
      { line: 4, note: "The call is replaced by 24, which is stored in result.", set: { result: "24" } },
      { line: 5, note: "result is displayed. The local variables exist only during the call.", print: "Power = 24 W" },
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
      { line: -1, note: "The program ends.", unset: ["name (motor)", "voltage (motor)"] },
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
      { line: 6, note: "show has ended; its local value is gone. The global value is still 1.", unset: ["value (show)"], print: "1" },
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
      { line: 6, note: "print displays the returned value.", print: "6" },
    ],
  };

  const FACT_CODE = ["def factorial(n):", "    if n == 0:", "        return 1", "    return n * factorial(n - 1)", "", "print(factorial(3))"];
  const f = (n, state, ret) => ({ call: "factorial(" + n + ")", detail: "n = " + n, state, ret });

  App.registerTopic({
    id: "t05",
    title: "Functions and Modules",
    short: "Functions & Modules",
    blurb: "Defining and calling functions, parameters and return values, arguments, scope, recursion, and modules.",
    intro: "This chapter covers functions, named blocks of code that can be reused, and modules, files that group functions. Each lesson uses only what the lessons before it have explained:<br>defining → parameters and return → arguments → scope → functions that call functions → modules → practice.",
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
            CODE('def function_name(parameters):\n    """Docstring: what the function does."""\n    statements\n    return value', null, "syntax"),
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
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output on paper. Count how many times each line runs.<br>Then run the program and compare.")],
            [RUN('def beep():\n    print("beep")\n\nprint("start")\nbeep()\nbeep()\nprint("end")')],
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program stops with a NameError, because the function is called before it is defined. Reorder the lines.",
              "Hello", 'greet()\n\ndef greet():\n    print("Hello")\n', null, "Move the call below the definition."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Define a function <code>header()</code> that displays the two lines of the target. Call it once.",
              "Sensor report\n=============", "# Write your program here\n", null, 'def header(): print("Sensor report") and print("=" * 13)'),
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
            L(["Parameters and arguments", "Return values", "return and print", "Returning two values"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Parameters and arguments", title: "Parameters and arguments", blocks: [
            TB(["Term", "Meaning", "Example"], [
              ["Parameter", "a variable in the definition that receives a value", "<code>def power(v, i):</code>"],
              ["Argument", "the value given in the call", "<code>power(12, 2)</code>"],
            ]),
            L([
              "At a call, each parameter is assigned its argument: <code>v = 12</code>, <code>i = 2</code>.",
              "Parameters are local variables: they exist only while the function runs.",
            ]),
          ] },
          { kind: "concept", part: "Return values", title: "return sends a value back", blocks: [
            L([
              "<code>return value</code> ends the function and sends the value back to the call.",
              "The call is then replaced by the returned value: <code>result = power(12, 2)</code> stores 24.",
              "Statements after return in the same block do not run.",
            ]),
          ] },
          { kind: "code", part: "Return values", title: "First example: execution step by step", blocks: [W("codeTrace", T_power)] },
          { kind: "code", part: "Return values", title: "Example: temperature conversion", blocks: [
            EX("def c_to_f(c):\n    return c * 9 / 5 + 32\n\nprint(c_to_f(25))\nprint(c_to_f(100))", "one function, two calls", [
              { c: "c_to_f(25)", e: "c = 25: returns <code>77.0</code>" },
              { c: "c_to_f(100)", e: "c = 100: returns <code>212.0</code>" },
            ]),
          ] },
          { kind: "concept", part: "return and print", title: "return is not print", blocks: [
            TB(["Statement", "Effect"], [
              ["<code>print(x)</code>", "displays x on the screen; the program cannot use the displayed text"],
              ["<code>return x</code>", "sends x back to the caller, which can store it, calculate with it, or display it"],
            ]),
            T("A function without return returns <code>None</code>, the value that means \"no value\"."),
          ] },
          { kind: "code", part: "return and print", title: "Example: a missing return", blocks: [
            EX('def show_power(v, i):\n    print(v * i)\n\nresult = show_power(12, 2)\nprint("result =", result)', "print instead of return", [
              { c: "print(v * i)", e: "Displays 24, but returns nothing." },
              { c: "result", e: "The function returned None: <code>result = None</code>" },
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
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Parameters are in the definition; arguments are in the call.",
              "<code>return</code> ends the function and sends a value back to the call.",
              "print displays a value; return gives it to the program.",
              "A function without return returns <code>None</code>.",
              "<code>return a, b</code> returns two values.",
            ]),
            NEXT("<b>Arguments</b>. Arguments can be given by position or by name, and parameters can have default values."),
          ] },
          { kind: "exercise", title: "Trace the code", cols: [
            [T("Write the value of each variable after every line on paper.<br>Then use <b>Step Run</b> to check.")],
            [RUN("def area(w, h):\n    a = w * h\n    return a\n\nx = area(3, 4)\ny = area(x, 2)\nprint(x, y)")],
          ] },
          { kind: "exercise", title: "Complete the code", blocks: [
            PQ("Complete the function, so that it returns the current I = V ÷ R.",
              "3.0", "def current(v, r):\n    return \n\nprint(current(12, 4))\n", null, "return v / r"),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program should display Energy = 500 Wh, but it displays None. Correct the function.",
              "Energy = 500 Wh", 'def energy(p, hours):\n    print(p * hours)\n\ne = energy(100, 5)\nprint("Energy =", e, "Wh")\n', null, "Use return instead of print."),
          ] },
          { kind: "exercise", title: "Write a function", blocks: [
            PQ("Define <code>rect(w, h)</code> that returns the area and the perimeter of a rectangle. Display both for w = 5 and h = 3.",
              "15 16", "# Write your program here\n", null, "return w * h, 2 * (w + h); then a, p = rect(5, 3)"),
          ] },
          { kind: "exercise", title: "Design and write", blocks: [
            PQ("First write the input, output, and processing as comments. Then define <code>average(a, b, c)</code> that returns the average, and display it rounded to 2 decimal places for 20, 22, and 27.",
              "23.0", "# Input:\n# Output:\n# Processing:\n\n", null, "return (a + b + c) / 3"),
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
        keywords: "positional keyword default argument args kwargs variable length",
        deck: [
          { kind: "overview", title: "Positional, keyword, and default arguments", blocks: [
            T("A call can give its arguments by position or by name, and a parameter can have a default value. These options make functions flexible and calls readable."),
            L(["Positional arguments", "Keyword arguments", "Default values", "A variable number of arguments"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Positional arguments", title: "Positional arguments", blocks: [
            L([
              "Positional arguments are matched to the parameters in order: the first argument to the first parameter, and so on.",
              "The order matters: <code>describe(\"Pump\", 220)</code> and <code>describe(220, \"Pump\")</code> give different results.",
              "The number of arguments must equal the number of parameters without a default value.",
            ]),
          ] },
          { kind: "code", part: "Positional arguments", title: "Example: the order matters", blocks: [
            EX('def describe(name, voltage):\n    print(name, "runs at", voltage, "V")\n\ndescribe("Pump", 220)\ndescribe(220, "Pump")', "the same arguments, two orders", [
              { c: 'describe("Pump", 220)', e: "<code>Pump runs at 220 V</code>" },
              { c: 'describe(220, "Pump")', e: "The values are swapped: <code>220 runs at Pump V</code>" },
            ]),
          ] },
          { kind: "concept", part: "Keyword arguments", title: "Keyword arguments", blocks: [
            L([
              "A keyword argument names its parameter: <code>describe(voltage=220, name=\"Pump\")</code>.",
              "With keyword arguments, the order does not matter, and the call is easier to read.",
              "Positional arguments must come before keyword arguments in a call.",
            ]),
            CODE('describe(voltage=220, name="Pump")\ndescribe("Pump", voltage=220)', "Pump runs at 220 V\nPump runs at 220 V", "two calls with the same result"),
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
          { kind: "concept", part: "A variable number of arguments", title: "*args and **kwargs", blocks: [
            TB(["Parameter", "Receives", "Use in the body"], [
              ["<code>*args</code>", "any number of positional arguments", "<code>for value in args:</code>"],
              ["<code>**kwargs</code>", "any number of keyword arguments", "<code>for key in kwargs:</code>, and the value is <code>kwargs[key]</code>"],
            ]),
            T("<code>args</code> is a tuple and <code>kwargs</code> is a dictionary. Topic 06 explains both. Here they are only used with a for loop."),
          ] },
          { kind: "code", part: "A variable number of arguments", title: "Example: *args", blocks: [
            EX("def total_resistance(*values):\n    total = 0\n    for r in values:\n        total = total + r\n    return total\n\nprint(total_resistance(100, 220, 330))", "resistors in series", [
              { c: "*values", e: "Receives 100, 220, and 330." },
              { c: "for r in values", e: "Adds each value: <code>650</code>" },
            ]),
          ] },
          { kind: "code", part: "A variable number of arguments", title: "Example: **kwargs", blocks: [
            EX('def print_profile(**info):\n    for key in info:\n        print(key, "=", info[key])\n\nprint_profile(name="Pump", voltage=220)', "keyword arguments with any names", [
              { c: "**info", e: "Receives name and voltage with their values." },
              { c: "info[key]", e: "The value of each keyword. Output: <code>name = Pump</code>, <code>voltage = 220</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Positional arguments are matched in order.",
              "Keyword arguments name their parameter; their order does not matter.",
              "A default value is used when the call gives no argument for that parameter.",
              "In a call: positional arguments first, then keyword arguments.",
              "<code>*args</code> and <code>**kwargs</code> accept any number of arguments.",
            ]),
            NEXT("<b>Variable scope</b>. Which variables a function can see and change."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output of each call on paper.<br>Then run the program and compare.")],
            [RUN('def show(a, b=5, c="V"):\n    print(a + b, c)\n\nshow(1)\nshow(1, 2)\nshow(1, c="A")\nshow(b=10, a=0)')],
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The definition causes a SyntaxError: a parameter with a default value comes before one without. Correct line 1.",
              "Fan 110 V", 'def motor(voltage=220, name):\n    print(name, voltage, "V")\n\nmotor("Fan", 110)\n', null, "def motor(name, voltage=220):"),
          ] },
          { kind: "exercise", title: "Write a function with a default value", blocks: [
            PQ("Define <code>power(v, i, efficiency=1.0)</code> that returns v × i × efficiency. Display power(12, 2) and power(12, 2, efficiency=0.8).",
              "24.0 19.200000000000003", "# Write your program here\n", null, "return v * i * efficiency"),
          ] },
          { kind: "exercise", title: "Write a function with *args", blocks: [
            PQ("Define <code>largest(*values)</code> that returns the largest argument. Display largest(3, 17, 9, 12).",
              "17", "# Write your program here\n", null, "Start with the first value, then compare in a for loop."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`def calc(a, b=2, c=3): return a + b * c`. What is `calc(1, 3)`?", choices: ["7", "10", "12", "Error"], answer: 1, explain: "3 goes to b (the second position): 1 + 3 * 3 = 10." },
            { q: "Which call is valid for `def f(a, b):`?", choices: ["f(a=1, 2)", "f(1, b=2)", "f(b=2, 1)", "f(1, a=2)"], answer: 1, explain: "Positional arguments must come first, and each parameter gets one value." },
          ])] },
        ],
      },

      /* =============================== 4. SCOPE =============================== */
      {
        id: "scope",
        title: "Variable scope",
        sub: "Local and global variables, and the global keyword.",
        slides: "05:9–11",
        keywords: "scope local global variable global keyword",
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
          { kind: "concept", part: "The global keyword", title: "The global keyword", blocks: [
            L([
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
              "Variables assigned inside a function (and parameters) are local.",
              "Local variables exist only during the call.",
              "A function can read global variables.",
              "An assignment inside a function creates a local variable, even with a global name.",
              "<code>global x</code> lets a function change the global x.",
            ]),
            NEXT("<b>Functions that call functions</b>. A function can call another function, or itself."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output on paper. Decide for each name whether it is local or global.<br>Then run the program and compare.")],
            [RUN('n = 3\n\ndef test():\n    n = 7\n    print("inside:", n)\n\ntest()\nprint("outside:", n)')],
          ] },
          { kind: "exercise", title: "Determine the output: global", cols: [
            [T("Write the output on paper.<br>Then run the program and compare.")],
            [RUN("count = 0\ndef add_one():\n    global count\n    count = count + 1\nadd_one()\nadd_one()\nprint(count)")],
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The last line causes a NameError, because total is local. Change the function to return total, and store the result in the main program.",
              "Total = 30", 'def add(a, b):\n    total = a + b\n\nadd(10, 20)\nprint("Total =", total)\n', null, "return total, then total = add(10, 20)"),
          ] },
          { kind: "exercise", title: "Rewrite without global", blocks: [
            PQ("Rewrite the program without <code>global</code>: the function receives the level and returns the new level.",
              "70", "level = 40\ndef charge():\n    global level\n    level = level + 30\ncharge()\nprint(level)\n", null, "def charge(level): return level + 30, then level = charge(level)"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`value = 1`, then `def show(): value = 2; print(value, end=\" \")`, then `show()` and `print(value)`. The output is…", choices: ["1 1", "1 2", "2 1", "2 2"], answer: 2, explain: "show displays its local value 2. The global value is still 1." },
            { q: "A local variable exists…", choices: ["for the whole program", "only while its function runs", "only before the function is called", "in every function"], answer: 1, explain: "It is created during the call and removed when the function returns." },
          ])] },
        ],
      },

      /* =============================== 5. FUNCTIONS THAT CALL FUNCTIONS =============================== */
      {
        id: "recursion",
        title: "Functions that call functions",
        sub: "Nested calls and recursion.",
        slides: "05:7–8",
        keywords: "nested call function calls function recursion base case factorial call stack",
        deck: [
          { kind: "overview", title: "Functions that call functions", blocks: [
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
              { line: 5, frames: [], note: "print displays the result.", returned: "6" },
            ] }),
          ] },
          { kind: "concept", part: "Recursion", title: "The calls and their results", blocks: [
            TB(["Call", "Waits for", "Returns"], [
              ["factorial(3)", "factorial(2)", "3 × 2 = 6"],
              ["factorial(2)", "factorial(1)", "2 × 1 = 2"],
              ["factorial(1)", "factorial(0)", "1 × 1 = 1"],
              ["factorial(0)", "(base case)", "1"],
            ], null, "center"),
            T("The calls go down to the base case; the results come back up in the opposite order."),
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
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output on paper.<br>Then run the program and compare.")],
            [RUN("def square(x):\n    return x * x\n\ndef sum_squares(a, b):\n    return square(a) + square(b)\n\nprint(sum_squares(3, 4))")],
          ] },
          { kind: "exercise", title: "Trace the recursion", cols: [
            [T("Complete the table on paper: each call, what it waits for, and what it returns. Then run the program to check the result."),
              TB(["Call", "Waits for", "Returns"], [["power2(3)", "", ""], ["power2(2)", "", ""], ["power2(1)", "", ""], ["power2(0)", "", ""]], null, "center")],
            [RUN("def power2(n):\n    if n == 0:\n        return 1\n    return 2 * power2(n - 1)\n\nprint(power2(3))")],
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The recursion never reaches its base case and stops with a RecursionError. Correct the recursive call.",
              "15", "def sum_to(n):\n    if n == 1:\n        return 1\n    return n + sum_to(n + 1)\n\nprint(sum_to(5))\n", null, "The call must move toward n == 1: sum_to(n - 1)."),
          ] },
          { kind: "exercise", title: "Write a recursive function", blocks: [
            PQ("Define a recursive <code>countdown(n)</code> that displays n, n − 1, …, 1 and then Go. Call countdown(3).",
              "3\n2\n1\nGo", "# Write your program here\n", null, 'if n == 0: print("Go") else: print(n) and countdown(n - 1)'),
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
        keywords: "module import from as math random os datetime pip install help",
        deck: [
          { kind: "overview", title: "Modules", blocks: [
            T("A <b>module</b> is a <code>.py</code> file that contains functions and variables. Other programs can import it and use its functions."),
            L(["Modules and import", "from … import", "The standard library", "Third-party modules and pip", "help()"], "Subtopics in this lesson", true),
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
              ["<code>import tools</code>", "<code>tools.add(1, 2)</code>"],
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
              ["<code>math</code>", "<code>math.pow(2, 3)</code>", "<code>8.0</code>"],
              ["<code>random</code>", "<code>random.randint(1, 10)</code>", "a random integer from 1 to 10"],
              ["<code>os</code>", "<code>os.getcwd()</code>", "the current folder"],
              ["<code>datetime</code>", "<code>datetime.now()</code> (from datetime import datetime)", "the current date and time"],
            ]),
          ] },
          { kind: "code", part: "The standard library", title: "Example: math and random", blocks: [
            EX("import math\nimport random\n\nprint(math.pow(2, 3))\nprint(math.sqrt(2))\nprint(random.randint(1, 10))", "run it twice: the last line changes", [
              { c: "math.pow(2, 3)", e: "<code>8.0</code>" },
              { c: "random.randint(1, 10)", e: "A different integer from 1 to 10 on most runs." },
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
          { kind: "concept", part: "help()", title: "help() shows the documentation", blocks: [
            L([
              "<code>help(module)</code> or <code>help(module.function)</code> displays the documentation.",
              "The documentation includes the docstrings of the functions (Lesson 1).",
            ]),
            CODE("import math\nhelp(math.sqrt)", "Help on built-in function sqrt in module math:\n\nsqrt(x, /)\n    Return the square root of x.", "example"),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A module is a .py file; its name is the file name without .py.",
              "<code>import m</code> → <code>m.f()</code>. <code>from m import f</code> → <code>f()</code>. <code>import m as a</code> → <code>a.f()</code>.",
              "The standard library (math, random, os, datetime) needs no installation.",
              "<code>pip install name</code> installs a third-party module.",
              "<code>help()</code> displays documentation.",
            ]),
            NEXT("<b>Chapter practice</b>. Complete problems solved with functions."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output on paper.<br>Then run the program and compare.")],
            [RUN("import math\nfrom math import floor\n\nprint(math.ceil(4.2))\nprint(floor(4.8))\nprint(math.pow(3, 2))")],
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program stops with a NameError: after <code>from math import sqrt</code>, the name math is not defined. Correct line 3.",
              "4.0", "from math import sqrt\n\nprint(math.sqrt(16))\n", null, "Call sqrt(16) directly."),
          ] },
          { kind: "exercise", title: "Write a program with math", blocks: [
            PQ("Define <code>hypotenuse(a, b)</code> that returns √(a² + b²) with <code>math.sqrt</code>. Display hypotenuse(3, 4).",
              "5.0", "import math\n\n# Write the function here\n", null, "return math.sqrt(a ** 2 + b ** 2)"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "The file `area.py` is imported with…", choices: ["import area.py", "import area", "include area", "from area.py"], answer: 1, explain: "The module name is the file name without .py." },
            { q: "After `from tools import add`, the call `tools.sub(4, 9)` gives…", choices: ["-5", "5", "13", "a NameError"], answer: 3, explain: "Only add was imported; the name tools is not defined." },
          ])] },
        ],
      },

      /* =============================== 7. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete problems solved with functions.",
        slides: "05:23",
        keywords: "practice function time to seconds profile random sqrt prime recursion",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Solve every problem with a function. For each function, decide first:"),
            L([
              "the <b>parameters</b>: the values the function needs",
              "the <b>return value</b>: the result it gives back",
              "the <b>processing</b>: the steps inside it",
              "then write the function, call it with the test values, and check the output",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: time to seconds", blocks: [
            T("Define <code>time_to_seconds(hours, minutes, seconds)</code> that returns the total number of seconds."),
            IPO([["Parameters", "hours, minutes, seconds"], ["Return value", "the total in seconds"], ["Processing", "hours × 3600 + minutes × 60 + seconds"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the function", blocks: [
            PQ("Write the function and display <code>time_to_seconds(1, 2, 5)</code>.", "3725", "# Write your program here\n", null, "return hours * 3600 + minutes * 60 + seconds"),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: a device profile", blocks: [
            T("Define <code>print_profile(**info)</code> that displays each keyword and its value on its own line."),
            IPO([["Parameters", "any keyword arguments"], ["Output", "one line for each: key = value"], ["Processing", "for key in info: display key and info[key]"]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the function", blocks: [
            PQ("Write the function and call <code>print_profile(name=\"Pump\", voltage=220, phase=3)</code>.", "name = Pump\nvoltage = 220\nphase = 3", "# Write your program here\n", null, 'for key in info: print(key, "=", info[key])'),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: square root of a random number", blocks: [
            T("Define <code>generate_random_sqrt(n)</code> that picks a random integer from 1 to n and returns its square root."),
            IPO([["Parameter", "n"], ["Return value", "the square root of a random integer from 1 to n"], ["Processing", "random.randint(1, n), then math.sqrt"]]),
            N("<code>random.seed(1)</code> makes the random numbers repeat, so that the output can be checked."),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the function", blocks: [
            PQ("Write the function. After <code>random.seed(1)</code>, display <code>round(generate_random_sqrt(100), 3)</code>.", "4.243", "import math\nimport random\n\nrandom.seed(1)\n# Write the function and the call here\n", null, "return math.sqrt(random.randint(1, n))"),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: a prime test", blocks: [
            T("Define <code>is_prime(n)</code> that returns True if n is a prime number, otherwise False."),
            IPO([["Parameter", "n (int, greater than 1)"], ["Return value", "True or False"], ["Processing", "return False at the first divisor from 2 to n − 1; return True after the loop"]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the function", blocks: [
            PQ("Write the function and display <code>is_prime(13), is_prime(15)</code> on one line.", "True False", "# Write your program here\n", null, "for i in range(2, n): if n % i == 0: return False; return True"),
          ] },
          { kind: "problem", part: "Problem 5", title: "Problem 5: temperature conversion with a default", blocks: [
            T("Define <code>convert(t, unit=\"F\")</code> that converts a temperature t in °C: to °F when unit is \"F\" (F = C × 9 / 5 + 32), to kelvin when unit is \"K\" (K = C + 273.15)."),
            IPO([["Parameters", "t, and unit with the default \"F\""], ["Return value", "the converted temperature"], ["Decision", "unit == \"F\" or unit == \"K\""]]),
          ] },
          { kind: "exercise", part: "Problem 5", title: "Problem 5: write the function", blocks: [
            PQ("Write the function and display <code>convert(25), convert(25, unit=\"K\")</code> on one line.", "77.0 298.15", "# Write your program here\n", null, 'if unit == "F": return t * 9 / 5 + 32 else: return t + 273.15'),
          ] },
          { kind: "problem", part: "Problem 6", title: "Problem 6: power with two functions", blocks: [
            T("Define <code>current(v, r)</code> that returns V ÷ R, and <code>power(v, r)</code> that returns V × I, using current()."),
            IPO([["Parameters", "v, r"], ["Return values", "the current; the power"], ["Processing", "power calls current"]]),
          ] },
          { kind: "exercise", part: "Problem 6", title: "Problem 6: write the functions", blocks: [
            PQ("Write both functions and display <code>round(power(12, 4.7), 2)</code>.", "30.64", "# Write your program here\n", null, "return v * current(v, r)"),
          ] },
          { kind: "problem", part: "Problem 7", title: "Problem 7: recursive sum of digits", blocks: [
            T("Define a recursive <code>digit_sum(n)</code> that returns the sum of the digits of a positive integer n."),
            IPO([["Parameter", "n"], ["Return value", "the sum of the digits"], ["Base case", "n &lt; 10: return n"], ["Recursive case", "the last digit (n % 10) + digit_sum(n // 10)"]]),
          ] },
          { kind: "exercise", part: "Problem 7", title: "Problem 7: write the function", blocks: [
            PQ("Write the function and display <code>digit_sum(2026)</code>.", "10", "# Write your program here\n", null, "if n < 10: return n; return n % 10 + digit_sum(n // 10)"),
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
