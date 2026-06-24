/* ===================== Topic 02 — Basic Programming with Python ===================== */
App.registerTopic({
  id: "t02",
  title: "Basic Programming with Python",
  short: "Basics",
  blurb: "Errors, input/output, variables and types, strings, and numbers — the core toolkit.",
  intro: "This is the heart of getting productive: reading errors calmly, talking to the user, storing data in variables, and working with text and numbers.",
  lessons: [
    {
      id: "errors",
      title: "Errors & debugging",
      sub: "Syntax, runtime, and logical errors — and how to read them.",
      slides: "02:3–9",
      keywords: "error syntax runtime logical nameerror typeerror valueerror zerodivision debug",
      learn: [
        { type: "list", title: "Three kinds of error", items: [
          "<b>Syntax error</b> — invalid grammar; the code won't even start (e.g. a missing <code>)</code>).",
          "<b>Runtime error</b> — it starts, then crashes mid-run (e.g. dividing by zero).",
          "<b>Logical error</b> — it runs fine but gives the <i>wrong</i> answer. The hardest to find — Python can't warn you.",
        ] },
        { type: "example", caption: "common runtime errors and their fixes", code:
"print(age)            # NameError: 'age' is not defined  -> define it first\nprint(\"Age: \" + 25)   # TypeError -> use str(25)\nint(\"abc\")            # ValueError -> string isn't a number\nprint(10 / 0)         # ZeroDivisionError -> check the divisor",
          annot: [
            { c: "NameError", e: "You used a variable that was never created. Fix: assign it before use." },
            { c: "TypeError", e: "An operation between incompatible types (str + int). Fix: convert with <code>str()</code> or <code>int()</code>." },
            { c: "ValueError", e: "Right type, impossible value — <code>\"abc\"</code> can't become an int. Fix: validate input." },
            { c: "ZeroDivisionError", e: "Division by zero. Fix: check the divisor first." },
          ] },
        { type: "note", variant: "warn", title: "Read the last line first", html: "A Python traceback's most useful line is usually the <b>bottom</b> one: the error type and message. Then look at the line number it points to." },
      ],
      live: [
        { title: "Trigger an error on purpose, then fix it", code: "# Run this to SEE the error, then fix line 2 to: print(\"Age: \" + str(25))\nprint(\"Age: \" + 25)" },
        { title: "A logical error — looks fine, wrong answer", code: "# Meant to average 10 and 20. Why is the answer 20, not 15?\nresult = 10 + 20 / 2   # operator precedence bug!\nprint(result)\n# Fix: (10 + 20) / 2" },
      ],
      quiz: [
        { q: "Which error happens before the program runs at all?", choices: ["Runtime error", "Logical error", "Syntax error", "ValueError"], answer: 2, explain: "A syntax error means the grammar is invalid, so Python refuses to start." },
        { q: "`print(\"Age: \" + 25)` raises…", choices: ["NameError", "TypeError", "ZeroDivisionError", "Nothing"], answer: 1, explain: "You can't concatenate a string with an int — that's a TypeError. Use str(25)." },
      ],
    },
    {
      id: "input-output",
      title: "Input & output",
      sub: "Talking to the user with input() and print().",
      slides: "02:10–16",
      keywords: "input print output sep end fstring prompt",
      learn: [
        { type: "text", html: "<span class='kw'>input(prompt)</span> reads text from the user and <b>always returns a string</b>. <span class='kw'>print(...)</span> displays values, with two handy options: <code>sep</code> (what goes between items) and <code>end</code> (what goes after)." },
        { type: "example", caption: "controlling print with sep and end", code:
"print(\"Today\", \"is\", \"Monday\")              # Today is Monday\nprint(\"Today\", \"is\", \"Monday\", sep=\"...\")    # Today...is...Monday\nprint(\"Hi, \", end=\"\")\nprint(\"there\")                               # Hi, there",
          output: "Today is Monday\nToday...is...Monday\nHi, there" },
        { type: "note", title: "Strings in, numbers out", html: "Because <code>input()</code> gives a string, wrap it in <code>int()</code> or <code>float()</code> to do maths: <code>age = int(input(\"Age: \"))</code>." },
        { type: "note", variant: "warn", title: "f-strings are your friend", html: "An f-string lets you drop variables straight into text: <code>f\"Hello, {name}! You are {age}.\"</code> — far cleaner than gluing strings with <code>+</code>." },
      ],
      live: [
        { title: "Interactive — it will pop up a prompt for input()", code: "name = input(\"Enter your name: \")\nage = int(input(\"Enter your age: \"))\nprint(\"Next year, you will be\", age + 1)\nprint(f\"Hello, {name}! You are {age} years old.\")" },
        { title: "No prompt needed — experiment with sep and end", code: "print(\"a\", \"b\", \"c\", sep=\" | \")\nprint(\"line1\", end=\" --> \")\nprint(\"line2\")" },
      ],
      quiz: [
        { q: "What type does input() always return?", choices: ["int", "float", "str", "bool"], answer: 2, explain: "input() always returns a string; convert it if you need a number." },
        { q: "`print('a','b',sep='-')` prints…", choices: ["a b", "a-b", "ab", "a--b"], answer: 1, explain: "sep replaces the default space between the items." },
      ],
    },
    {
      id: "variables",
      title: "Variables & how they're stored",
      sub: "Names for data — and what bits, bytes, and addresses really are.",
      slides: "02:17–28",
      keywords: "variable memory bit byte binary address assignment naming snake case",
      learn: [
        { type: "text", html: "A <span class='term'>variable</span> is a name that refers to a value stored in memory. In Python you don't declare a type — it's <b>inferred</b> from the value, and a name can even point to a different type later." },
        { type: "example", caption: "Python infers and can re-bind types", code:
"x = 5        # int\ny = \"Hello\"  # str\nz = 3.14     # float\nx = \"Ten\"    # now x is a str — totally allowed in Python",
          annot: [
            { c: "x = 5", e: "Python sees an integer literal, so <code>x</code> refers to an int." },
            { c: "x = \"Ten\"", e: "Re-binding <code>x</code> to a string is allowed — Python is dynamically typed." },
          ] },
        { type: "subhead", text: "What's actually happening in memory" },
        { type: "widget", name: "binaryConverter", config: {} },
        { type: "list", title: "The building blocks", items: [
          "<b>Bit</b> — a single 0 or 1.",
          "<b>Byte</b> — 8 bits; the smallest addressable unit. One byte holds 0–255.",
          "<b>Memory is byte-addressable</b> — every byte has its own numeric <i>address</i>.",
          "Text uses <b>ASCII</b>: <code>'A'</code> is stored as the number <code>65</code> (try it above).",
        ] },
        { type: "deepdive", title: "C view: variables, addresses & types you must declare", html:
"<p>In Python a variable is a <i>label</i> attached to an object somewhere in memory. In <b>C</b>, a variable <i>is</i> a fixed chunk of memory whose size you choose up front by declaring a type:</p>" +
"<p style='font-family:monospace;background:var(--code-bg);padding:10px;border-radius:8px'>int age = 25;&nbsp;&nbsp;// reserves 4 bytes<br>char grade = 'A';&nbsp;// reserves 1 byte, stores 65</p>" +
"<p>If <code>age</code> starts at address <code>0x1000</code> and takes 4 bytes, the next free address is <code>0x1004</code>. Python hides all of this — convenient, but it's why Python uses more memory per number and is slower than C for tight numeric loops.</p>",
          widget: { name: "memoryModel", config: { title: "C: two variables laid out in memory", columns: [
            { head: "Address → value", cells: [
              { addr: "0x1000", name: "age (int, 4B)", val: "25" },
              { addr: "0x1004", name: "grade (char,1B)", val: "65 ('A')" },
              { addr: "0x1005", name: "(next free)", val: "…" },
            ] },
          ], note: "Each variable occupies a fixed, contiguous block whose size is fixed by its type." } } },
        { type: "subhead", text: "Naming rules & style" },
        { type: "list", items: [
          "Use descriptive <code>snake_case</code>: <code>user_name</code>, <code>total_score</code>.",
          "Names are <b>case-sensitive</b>: <code>Name</code> and <code>name</code> are different.",
          "Don't use reserved keywords (<code>if</code>, <code>for</code>, <code>print</code>, <code>class</code>, …).",
          "Multiple assignment: <code>x, y, z = 1, 2, 3</code> and <code>a = b = c = 0</code>.",
        ] },
      ],
      live: [
        { title: "Watch a name change type", code: "x = 5\nprint(x, type(x))\nx = \"Ten\"\nprint(x, type(x))\nx = 10.0\nprint(x, type(x))" },
        { title: "ASCII in action", code: "print(ord('A'))      # 65 — the stored number\nprint(chr(65))       # 'A' — back to a character\nprint(ord('a'))      # 97\nprint(bin(65))       # 0b1000001 — the bits" },
      ],
      quiz: [
        { q: "How many values can a single byte represent?", choices: ["8", "64", "256", "1024"], answer: 2, explain: "8 bits → 2^8 = 256 distinct values (0–255)." },
        { q: "In Python, can a variable change type after assignment?", choices: ["No, never", "Yes — it's dynamically typed", "Only between int and float", "Only inside functions"], answer: 1, explain: "Python is dynamically typed; a name can be re-bound to any type." },
        { q: "'A' is stored as which number (ASCII)?", choices: ["41", "65", "97", "26"], answer: 1, explain: "Uppercase 'A' is ASCII 65; lowercase 'a' is 97." },
      ],
    },
    {
      id: "data-types",
      title: "Built-in data types",
      sub: "Numbers, text, booleans, and the collection types.",
      slides: "02:29–33",
      keywords: "int float complex str bool list tuple dict set none type checking",
      learn: [
        { type: "list", title: "The main types", items: [
          "<b>Numeric</b>: <code>int</code> (10), <code>float</code> (3.14), <code>complex</code> (1+2j).",
          "<b>Text</b>: <code>str</code> (\"Hello\").  <b>Boolean</b>: <code>bool</code> (True/False).",
          "<b>Sequence</b>: <code>list</code> [1,2,3] (mutable), <code>tuple</code> (1,2,3) (immutable), <code>range</code>.",
          "<b>Mapping</b>: <code>dict</code> {\"key\": \"value\"}.  <b>Set</b>: <code>set</code> {1,2,3} (unique items).",
          "<b>None</b>: represents 'no value'.",
        ] },
        { type: "note", html: "Check any value's type with <code>type(value)</code>. You'll meet lists and dicts in depth in Topic 06." },
      ],
      live: [
        { title: "Inspect the types", code: "samples = [42, 3.14, 1+2j, \"hi\", True, [1,2], (1,2), {\"a\":1}, {1,2}, None]\nfor s in samples:\n    print(repr(s), \"->\", type(s).__name__)" },
      ],
      quiz: [
        { q: "Which is immutable?", choices: ["list", "dict", "tuple", "set"], answer: 2, explain: "A tuple cannot be changed after creation; lists, dicts and sets can." },
        { q: "type(42) returns…", choices: ["<class 'float'>", "<class 'int'>", "<class 'str'>", "42"], answer: 1, explain: "42 is an integer, so type() reports <class 'int'>." },
      ],
    },
    {
      id: "strings-numbers",
      title: "Strings & numbers",
      sub: "Indexing, slicing, methods, operators, and the math module.",
      slides: "02:34–46",
      keywords: "string index slice immutable concatenate len upper lower replace operators math sqrt round precedence",
      learn: [
        { type: "text", html: "A <span class='term'>string</span> is a sequence of characters in quotes. It's <b>immutable</b> — you can read characters but not change them in place. Indexing starts at <b>0</b>." },
        { type: "example", caption: "indexing and slicing", code:
"text = \"Programming\"\nprint(text[0])     # P\nprint(text[-1])    # g  (negative = from the end)\nprint(text[0:6])   # Progra  (start inclusive, end exclusive)\nprint(text[3:])    # gramming\nprint(text[::-1])  # reverse",
          output: "P\ng\nProgra\ngramming\ngnimmargorP" },
        { type: "note", variant: "danger", title: "Strings can't be edited in place", html: "<code>text[0] = \"h\"</code> raises <code>TypeError: 'str' object does not support item assignment</code>. Instead build a new string." },
        { type: "list", title: "Handy string tools", items: [
          "<code>len(s)</code> — length.  <code>+</code> — concatenate.  <code>*</code> — repeat.",
          "<code>s.upper()</code>, <code>s.lower()</code>, <code>s.replace(old,new)</code>.",
          "<code>\"Py\" in \"Python\"</code> → True.  Escapes: <code>\\n</code> newline, <code>\\t</code> tab.",
        ] },
        { type: "subhead", text: "🔵 See indexing in action" },
        { type: "text", html: "Indices start at 0 on the left; negatives count from the right. Change the text or index below — the highlighted box is what <code>text[i]</code> returns." },
        { type: "widget", name: "stringIndex", config: { text: "Python" } },
        { type: "subhead", text: "🟢 See slicing in action" },
        { type: "text", html: "<code>text[start:end:step]</code> — start included, end excluded. Drag the values and watch which characters get picked (a negative step reverses)." },
        { type: "widget", name: "stringSlice", config: { text: "Programming" } },
        { type: "note", html: "Want to go deeper on strings (methods, formatting, the Caesar cipher)? See <a href='#/l/t06.strings'>Topic 06 → Strings in depth</a>." },
        { type: "subhead", text: "Numbers & arithmetic" },
        { type: "example", caption: "operators and precedence", code:
"print(10 / 3)    # 3.333...  true division\nprint(10 // 3)   # 3         floor division\nprint(10 % 3)    # 1         remainder (modulus)\nprint(2 ** 3)    # 8         exponent\nprint(2 + 3 * 4) # 14        * before +\nprint((2+3)*4)   # 20        parentheses win",
          annot: [
            { c: "/", e: "Always gives a float, even <code>10/2 == 5.0</code>." },
            { c: "//", e: "Floor division — drops the fractional part." },
            { c: "%", e: "Modulus — the remainder. Great for 'is it even?': <code>n % 2 == 0</code>." },
            { c: "**", e: "Exponentiation; <code>2 ** 3 == 8</code>." },
          ] },
        { type: "list", title: "The math module & rounding", items: [
          "<code>import math</code> then <code>math.sqrt(16)</code> → 4.0, <code>math.pi</code>.",
          "<code>abs(-7)</code> → 7,  <code>pow(2,3)</code> → 8,  <code>round(3.14159, 2)</code> → 3.14.",
          "Python integers never overflow: <code>10 ** 100</code> just works.",
        ] },
      ],
      live: [
        { title: "Slice and dice a string", code: "text = \"Programming\"\nprint(text[:4])\nprint(text[-4:])\nprint(text[::-1])\nprint(text.upper())\nprint(\"gram\" in text)" },
        { title: "Arithmetic & math module", code: "import math\nprint(\"floor div:\", 17 // 5)\nprint(\"remainder:\", 17 % 5)\nprint(\"sqrt(144):\", math.sqrt(144))\nprint(\"round    :\", round(3.14159, 2))\nprint(\"big int  :\", 2 ** 100)" },
      ],
      quiz: [
        { q: "`\"Python\"[-1]` is…", choices: ["P", "n", "o", "Error"], answer: 1, explain: "Index -1 is the last character: 'n'." },
        { q: "`17 % 5` equals…", choices: ["3", "3.4", "2", "12"], answer: 2, explain: "17 = 3×5 + 2, so the remainder is 2." },
        { q: "Why does `text[0] = 'h'` fail?", choices: ["Index 0 doesn't exist", "Strings are immutable", "You need text[0.0]", "It doesn't fail"], answer: 1, explain: "Strings can't be modified in place — they're immutable." },
      ],
    },
    {
      id: "practice",
      title: "Practice problems",
      sub: "Apply input, output, strings and numbers.",
      slides: "02:48",
      keywords: "practice exercises uppercase float age",
      learn: [
        { type: "list", title: "Try these (from the course slides)", items: [
          "Read text from the user and print its first 3 characters in uppercase.",
          "Read a number, add 2, multiply the total by 3.33, and print with 2 decimal places.",
          "Read a Name and Age, then print “Name อายุ: Age” (e.g. “Pokpong อายุ: 25”).",
        ] },
        { type: "note", html: "Edit the starter code below to solve each one. The first is solved as an example." },
      ],
      live: [
        { title: "Problem 1 (solved) — first 3 chars uppercase", code: "text = input(\"Enter some text: \")\nprint(text[:3].upper())" },
        { title: "Problem 2 — (n + 2) * 3.33 to 2 decimals", code: "n = float(input(\"Enter a number: \"))\nresult = (n + 2) * 3.33\nprint(f\"{result:.2f}\")" },
        { title: "Problem 3 — your turn: name and age", code: "name = input(\"Name: \")\nage = input(\"Age: \")\n# TODO: print f\"{name} อายุ: {age}\"\n" },
      ],
    },
  ],
});
