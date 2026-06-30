/* ===================== Topic 05 — Functions & Modules ===================== */
(function () {
  // Build a call-stack stepper for factorial(3) using the generic stepper widget.
  function recursionWidget() {
    const frames = [
      { caption: "Call factorial(3). It needs factorial(2) first — push a new frame.", stack: ["factorial(3)  n=3  waiting…"] },
      { caption: "Inside factorial(3) we call factorial(2). Push it on top.", stack: ["factorial(3)  n=3  waiting…", "factorial(2)  n=2  waiting…"] },
      { caption: "factorial(2) calls factorial(1). Push again.", stack: ["factorial(3)  n=3  waiting…", "factorial(2)  n=2  waiting…", "factorial(1)  n=1  waiting…"] },
      { caption: "factorial(1) calls factorial(0).", stack: ["factorial(3)  n=3", "factorial(2)  n=2", "factorial(1)  n=1", "factorial(0)  n=0  BASE CASE"] },
      { caption: "Base case! factorial(0) returns 1. Pop its frame.", stack: ["factorial(3)  n=3", "factorial(2)  n=2", "factorial(1)  →  1 * 1 = 1"] },
      { caption: "factorial(1) returns 1. factorial(2) computes 2 * 1.", stack: ["factorial(3)  n=3", "factorial(2)  →  2 * 1 = 2"] },
      { caption: "factorial(2) returns 2. factorial(3) computes 3 * 2.", stack: ["factorial(3)  →  3 * 2 = 6"] },
      { caption: "factorial(3) returns 6. The stack is empty. Answer = 6.", stack: ["(returned 6)"] },
    ];
    return App.widgets.stepper({
      title: "Recursion: the call stack growing and unwinding — factorial(3)",
      steps: frames,
      render: (s) => {
        const out = App.h("div");
        const stack = App.h("div", { class: "mem-col" }, App.h("h5", null, "Call stack (top = most recent)"));
        s.stack.slice().reverse().forEach((f, i) => {
          stack.appendChild(App.h("div", { class: "cell" + (i === 0 ? " frame" : "") }, App.h("span", null, f)));
        });
        out.appendChild(stack);
        out.appendChild(App.h("div", { class: "step-log", style: "margin-top:8px" }, s.caption));
        return out;
      },
    });
  }

  App.registerTopic({
    id: "t05",
    title: "Functions & Modules",
    short: "Functions & Modules",
    blurb: "Reusable blocks of code: defining, calling, scope, recursion, arguments, and importing modules.",
    intro: "Functions let you name a task once and reuse it everywhere — the key to readable, maintainable programs. Modules let you reuse code across files and tap into Python's huge library ecosystem.",
    lessons: [
      {
        id: "defining",
        title: "Defining & calling functions",
        sub: "def, parameters, return, and why functions help.",
        slides: "05:4–6",
        keywords: "function def call parameter return docstring reusable modular",
        learn: [
          { type: "text", html: "A <span class='term'>function</span> is a reusable block of code that performs one task. Define it with <span class='kw'>def</span>, then <i>call</i> it by name. Functions give you <b>modularity</b>, <b>reusability</b>, and <b>maintainability</b>." },
          { type: "example", caption: "anatomy of a function", code:
"def greet(name):\n    \"\"\"Return a greeting for the given name.\"\"\"\n    message = f\"Hello, {name}!\"\n    return message\n\nanswer = greet(\"Pokpong\")\nprint(answer)   # Hello, Pokpong!",
            annot: [
              { c: "def greet(name):", e: "<code>def</code> + a name + parameters in parentheses." },
              { c: "\"\"\"…\"\"\"", e: "A docstring — documentation for whoever reads the code." },
              { c: "return message", e: "Sends a value back to the caller. Without it, the function returns <code>None</code>." },
              { c: "greet(\"Pokpong\")", e: "The call. <code>\"Pokpong\"</code> becomes <code>name</code> inside." },
            ] },
          { type: "note", variant: "warn", title: "Define before you call", html: "Python reads top to bottom — a function must be defined <i>above</i> the line that calls it." },
        ],
        live: [
          { title: "Write once, call many times", code: "def concessions():\n    print(\"Popcorn: $8-10\")\n    print(\"Candy: $3-5\")\n\nconcessions()\nconcessions()  # reuse — no rewriting" },
        ],
        quiz: [
          { q: "What does a function return if it has no return statement?", choices: ["0", "Empty string", "None", "An error"], answer: 2, explain: "With no explicit return, a function returns None." },
          { q: "Which keyword defines a function?", choices: ["function", "def", "func", "lambda"], answer: 1, explain: "Python uses 'def' to define a function." },
        ],
      },
      {
        id: "scope",
        title: "Scope: local vs global",
        sub: "Where a variable lives and who can see it.",
        slides: "05:9–11",
        keywords: "scope local global keyword variable visibility",
        learn: [
          { type: "text", html: "A variable created <b>inside</b> a function is <span class='term'>local</span> — it exists only during that call and can't be seen outside. A variable created <b>outside</b> all functions is <span class='term'>global</span>." },
          { type: "widget", name: "memoryModel", config: { title: "Two scopes, two regions of memory", columns: [
            { head: "Global scope", cells: [
              { name: "x", val: "20", note: "Visible everywhere in the file." },
            ] },
            { head: "Local scope (inside a call)", cells: [
              { name: "y", val: "10", kind: "frame", note: "Created on call, destroyed when the function returns." },
            ] },
          ], note: "Keeping variables local avoids accidental clashes — a big reason functions make code safer." } },
          { type: "note", variant: "danger", title: "The global keyword", html: "To <i>modify</i> a global from inside a function you must declare <code>global x</code> first. Use it sparingly — too many globals make bugs hard to trace." },
        ],
        live: [
          { title: "Local stays local", code: "x = 20            # global\n\ndef show():\n    y = 10        # local — only exists here\n    print(\"inside:\", x, y)\n\nshow()\nprint(\"outside:\", x)\n# print(y)  # would raise NameError" },
        ],
        quiz: [
          { q: "A variable defined inside a function is…", choices: ["Global", "Local to that function", "Visible everywhere", "Permanent"], answer: 1, explain: "It's local — it exists only while the function runs." },
        ],
      },
      {
        id: "recursion",
        title: "Recursion",
        sub: "A function that calls itself — watch the stack.",
        slides: "05:7–8",
        keywords: "recursion base case stack factorial fibonacci",
        learn: [
          { type: "text", html: "<span class='term'>Recursion</span> is when a function calls itself to solve a smaller version of the same problem. Every recursion needs a <b>base case</b> that stops it — otherwise it recurses forever." },
          { type: "example", caption: "factorial via recursion", code:
"def factorial(n):\n    if n == 0:        # base case\n        return 1\n    return n * factorial(n - 1)   # smaller subproblem",
            annot: [
              { c: "if n == 0: return 1", e: "The base case — without it, infinite recursion." },
              { c: "n * factorial(n-1)", e: "Each call waits for a smaller call to finish." },
            ] },
          { type: "widget", name: "stepper", config: {} /* replaced below */ },
          { type: "deepdive", title: "The call stack is real memory (and it can overflow)", html: "<p>Each function call pushes a <b>stack frame</b> holding its local variables and where to return to. Deep recursion piles up frames; in C this region is the literal 'stack', and overrunning it is a <i>stack overflow</i>. Python guards against this with a recursion limit (~1000) and raises <code>RecursionError</code> instead of crashing — try a huge number below to see it.</p>" },
          { type: "subhead", text: "Step through it line by line" },
          { type: "text", html: "Step through real execution. Watch it dive deeper into <code>factorial</code> on the way down (each call shows <i>inside factorial()</i> with its own <code>n</code>), hit the base case, then unwind back up — multiplying as each call returns." },
          { type: "steprun", title: "factorial(3) — step into each recursive call", code: "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n\nanswer = factorial(3)\nprint(answer)" },
        ],
        live: [
          { title: "Run factorial and push it too far", code: "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))     # 120\nprint(factorial(20))    # works — Python has big ints\n# print(factorial(5000))  # uncomment to trigger RecursionError" },
        ],
        quiz: [
          { q: "What must every recursive function have?", choices: ["A loop", "A base case", "A global variable", "Two parameters"], answer: 1, explain: "A base case stops the recursion; without it you recurse forever." },
          { q: "Each function call uses a…", choices: ["Stack frame", "Disk sector", "ROM chip", "GPU core"], answer: 0, explain: "Calls push stack frames; too many cause a stack overflow / RecursionError." },
        ],
      },
      {
        id: "arguments",
        title: "Arguments: positional, keyword, *args, **kwargs",
        sub: "Flexible ways to pass data into functions.",
        slides: "05:12–16",
        keywords: "argument positional keyword default args kwargs return multiple",
        learn: [
          { type: "list", title: "Four ways to pass arguments", items: [
            "<b>Positional</b>: order matters — <code>greet(\"Pok\", 18)</code> sets name then age.",
            "<b>Keyword</b>: name them, order-free — <code>describe_pet(animal_type=\"cat\", pet_name=\"Whiskers\")</code>.",
            "<b>Default values</b>: <code>def describe_pet(pet_name, animal_type=\"dog\")</code> — optional with a fallback.",
            "<b>*args</b>: any number of positional args, collected into a tuple. <b>**kwargs</b>: any number of named args, collected into a dict.",
          ] },
          { type: "example", caption: "*args and **kwargs", code:
"def sum_numbers(*args):\n    return sum(args)\n\ndef print_info(**kwargs):\n    for key, value in kwargs.items():\n        print(f\"{key}: {value}\")\n\nprint(sum_numbers(1, 2, 3))   # 6\nprint_info(a=1, b=2)          # a: 1 / b: 2" },
          { type: "note", html: "A function can return multiple values at once: <code>return 10, 20</code>, then <code>x, y = get_coords()</code>." },
        ],
        live: [
          { title: "Mix them", code: "def order(item, qty=1, *extras, **notes):\n    print(f\"{qty} x {item}\")\n    if extras: print(\"  extras:\", extras)\n    if notes:  print(\"  notes :\", notes)\n\norder(\"coffee\", 2, \"sugar\", \"milk\", size=\"large\")" },
        ],
        quiz: [
          { q: "`*args` collects extra positional arguments into a…", choices: ["list", "tuple", "dict", "set"], answer: 1, explain: "*args is a tuple; **kwargs is a dict." },
          { q: "With keyword arguments, the order…", choices: ["Must match the definition", "Doesn't matter", "Must be alphabetical", "Must be reversed"], answer: 1, explain: "Keyword arguments are matched by name, so order is free." },
        ],
      },
      {
        id: "modules",
        title: "Modules & pip",
        sub: "Reuse code across files and install third-party libraries.",
        slides: "05:18–21",
        keywords: "module import from pip pypi standard library help",
        learn: [
          { type: "text", html: "A <span class='term'>module</span> is just a <code>.py</code> file you can <span class='kw'>import</span> into another. Python ships 200+ standard modules (<code>math</code>, <code>random</code>, <code>os</code>, <code>datetime</code>), and you can install thousands more from <b>PyPI</b> with <code>pip install &lt;name&gt;</code>." },
          { type: "example", caption: "two ways to import", code:
"import math\nprint(math.sqrt(25))   # 5.0  — use module.name\n\nfrom math import pi, sqrt\nprint(pi, sqrt(16))    # 3.1415… 4.0  — names imported directly",
            annot: [
              { c: "import math", e: "Brings in the whole module; access members as <code>math.x</code>." },
              { c: "from math import pi", e: "Pulls specific names into your file directly." },
            ] },
          { type: "note", html: "Use <code>import numpy as np</code> to give a module a short alias — the convention you'll use constantly in Topics 07–08." },
        ],
        live: [
          { title: "Standard library sampler", code: "import math, random\nprint(\"sqrt :\", math.sqrt(2))\nprint(\"pi   :\", math.pi)\nprint(\"dice :\", random.randint(1, 6))\nprint(\"pick :\", random.choice(['red','green','blue']))" },
        ],
        quiz: [
          { q: "How do you install a third-party library?", choices: ["import install x", "pip install x", "download x.exe", "python new x"], answer: 1, explain: "pip install <name> fetches packages from PyPI." },
          { q: "`from math import pi` lets you write…", choices: ["math.pi", "pi", "import.pi", "Math.PI"], answer: 1, explain: "Importing the name directly means you use it bare: pi." },
        ],
      },
      {
        id: "practice",
        title: "Practice problems",
        sub: "Build your own functions and modules.",
        slides: "05:23",
        keywords: "practice kwargs temperature converter module",
        learn: [
          { type: "list", title: "Try these (from the slides)", items: [
            "<code>print_profile(**kwargs)</code> — print each key/value pair.",
            "<code>generate_random_sqrt(n)</code> — random int 1..n, return its square root.",
            "<code>time_to_seconds(h, m, s)</code> — total seconds.",
            "Celsius↔Fahrenheit converters, driven by a menu in main.py.",
            "Modules <code>texttools.py</code> (count vowels/consonants, reverse text) and <code>geometry.py</code> (triangle/rectangle area).",
          ] },
        ],
        live: [
          { title: "Temperature converters (solved)", code: "def c_to_f(c):\n    return c * 9/5 + 32\n\ndef f_to_c(f):\n    return (f - 32) * 5/9\n\nprint(\"100C =\", c_to_f(100), \"F\")\nprint(\"32F  =\", f_to_c(32), \"C\")" },
          { title: "time_to_seconds (your turn)", code: "def time_to_seconds(hours, minutes, seconds):\n    return hours*3600 + minutes*60 + seconds\n\nprint(time_to_seconds(1, 30, 15))   # 5415" },
        ],
      },
    ],
  });

  // Inject the live recursion widget into the recursion lesson (replaces placeholder).
  const t = App.TOPICS.find((x) => x.id === "t05");
  const rec = t.lessons.find((l) => l.id === "recursion");
  rec.learn = rec.learn.map((b) => (b.type === "widget" && b.name === "stepper" ? { type: "widget", name: "__recursion__", config: {} } : b));
  App.widgets.__recursion__ = recursionWidget;
})();
