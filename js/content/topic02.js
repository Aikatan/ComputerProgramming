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
        { type: "note", html: "But what <i>is</i> a value underneath — how is it stored, and what limits does that put on your code? The next two lessons, <b>How values are stored in memory</b> and <b>How Python stores variables</b>, answer exactly that. They sit right here because understanding storage is what lets you reason about memory and speed." },
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
      id: "values-in-memory",
      title: "How values are stored in memory",
      sub: "Bits, bytes, addresses — and the constraints that shape efficient code.",
      keywords: "memory bit byte word address binary two's complement overflow ascii storage constraint",
      learn: [
        { type: "text", html: "Knowing <i>how</i> a value sits in memory isn't trivia — it's what lets you reason about <b>limits and efficiency</b>. Memory is one long row of <span class='term'>bytes</span>, each with a numeric <span class='term'>address</span>. Every value is ultimately a pattern of bits in some of those bytes." },
        { type: "list", title: "The units", items: [
          "<b>Bit</b> — one 0 or 1.",
          "<b>Byte</b> — 8 bits; holds 0–255. The smallest <i>addressable</i> unit.",
          "<b>Word</b> — the CPU's natural chunk (4 bytes on 32-bit, 8 on 64-bit machines).",
          "Memory is <b>byte-addressable</b>: every byte has its own address (like <code>0x1000</code>).",
        ] },
        { type: "subhead", text: "Play with the bits" },
        { type: "text", html: "Type a character or a number and watch its 8-bit pattern. Text uses <b>ASCII</b>: <code>'A'</code> is the number 65, which is <code>01000001</code>." },
        { type: "widget", name: "binaryConverter", config: {} },
        { type: "subhead", text: "Negative numbers: two's complement" },
        { type: "text", html: "With only 0s and 1s, how do you store <code>-5</code>? The standard trick is <span class='term'>two's complement</span>: to negate, flip every bit and add 1; the top bit becomes a sign. This lets one ADD circuit handle both positive and negative numbers." },
        { type: "subhead", text: "Why this matters for your code" },
        { type: "text", html: "A typed value has a <b>fixed width</b>, so it has a hard range — and exceeding it <b>overflows</b> (wraps around). In a fixed-size language this is a real bug source. Python sidesteps it by letting integers grow without limit — convenient, but each int is a full heap object, which costs memory and speed. That trade-off is the whole reason NumPy uses fixed-size C numbers for big data." },
        { type: "widget", name: "memoryModel", config: { title: "Two fixed-size values laid out in memory (C-style)", columns: [
          { head: "Address → value", cells: [
            { addr: "0x1000", name: "age (int, 4 bytes)", val: "25" },
            { addr: "0x1004", name: "grade (char, 1 byte)", val: "65 ('A')" },
            { addr: "0x1005", name: "(next free byte)", val: "…", note: "Each value takes a fixed, contiguous block decided by its type — so the next value starts right after." },
          ] },
        ] } },
        { type: "note", title: "Takeaway", html: "Smaller types use less memory and fit more per cache line (faster); fixed types can overflow; Python's flexible ints trade speed for never overflowing. Choosing representations <i>is</i> performance work." },
      ],
      live: [
        { title: "See the bits, the wrap, and Python's big integers", code: "x = 13\nprint(\"13 in binary :\", bin(x))            # 0b1101\nprint(\"'A' is        :\", ord('A'), bin(ord('A')))\n# two's complement of -5 in a single byte:\nprint(\"-5 as a byte  :\", format((-5) & 0xFF, '08b'))\n# a fixed 8-bit value would wrap; Python ints never do:\nprint(\"255 + 1 (8-bit):\", (255 + 1) & 0xFF)   # 0  (simulated wrap)\nprint(\"Python big int :\", 2 ** 200)\nprint(\"floats inexact :\", 0.1 + 0.2)" },
      ],
      quiz: [
        { q: "How many distinct values fit in one byte?", choices: ["8", "16", "256", "1024"], answer: 2, explain: "8 bits → 2^8 = 256 values (0–255 unsigned)." },
        { q: "A fixed 8-bit unsigned value at 255, plus 1, becomes…", choices: ["256", "0 (it wraps)", "-1", "an error"], answer: 1, explain: "Fixed-width integers wrap on overflow — 255 + 1 → 0." },
        { q: "Why can choosing a smaller numeric type make code faster?", choices: ["It can't", "Less memory, more values per cache line", "It uses the GPU", "Smaller numbers compute faster intrinsically"], answer: 1, explain: "Compact data is more cache-friendly, so the CPU streams it faster — a key efficiency lever." },
      ],
    },
    {
      id: "python-memory",
      title: "How Python stores variables",
      sub: "Names, objects, references — and the bugs that hide there.",
      keywords: "reference object id is equality mutable immutable interning aliasing memory model getsizeof",
      learn: [
        { type: "text", html: "Now the Python-specific picture. A Python variable is not a box holding a value — it's a <b>name bound to an object</b> that lives on the heap. The name is effectively a managed pointer. <code>id(x)</code> reveals the object's identity. This one idea explains a whole class of surprising bugs." },
        { type: "example", caption: "names vs objects", code:
"a = [1, 2, 3]\nb = a          # b points at the SAME list object\nc = a.copy()   # c points at a NEW list with the same values\nprint(a is b)  # True  — same object\nprint(a is c)  # False — different objects\nprint(a == c)  # True  — == compares values, 'is' compares identity",
          annot: [
            { c: "a is b", e: "<code>is</code> asks 'same object/address?' — True, they're aliases." },
            { c: "a == c", e: "<code>==</code> asks 'same value?' — True even for different objects." },
          ] },
        { type: "note", variant: "warn", title: "Aliasing bug", html: "Because <code>b = a</code> shares the object, mutating through one name is visible through the other. To get an independent copy, use <code>a.copy()</code> (or <code>list(a)</code>, <code>dict(a)</code>, etc.)." },
        { type: "note", variant: "danger", title: "The mutable default trap", html: "A mutable default argument (<code>def f(x, items=[])</code>) is created <b>once</b> and reused across every call, so it accumulates between calls — a famous bug. Use <code>None</code> and create a fresh container inside." },
        { type: "subhead", text: "Mutable vs immutable, and memory cost" },
        { type: "list", items: [
          "<b>Immutable</b> (int, float, str, tuple): can't be changed in place — operations make new objects.",
          "<b>Mutable</b> (list, dict, set): can change in place, which is why aliasing matters.",
          "<code>sys.getsizeof(x)</code> shows an object's byte cost — handy when memory matters.",
        ] },
        { type: "deepdive", title: "Small-int & string interning", html: "<p>For speed, CPython pre-creates the small integers <b>−5 to 256</b> and reuses them, so a freshly built 256 <code>is</code> the cached one while a freshly built 257 is a separate object. (Writing both as literals on one line can fool you — the compiler folds equal constants — so build them with <code>int(\"257\")</code> to really see it.) Lesson: use <code>==</code> for values; reserve <code>is</code> for identity, typically <code>x is None</code>.</p>" },
      ],
      live: [
        { title: "Identity vs equality — inspect with id()", code: "a = [1, 2, 3]\nb = a\nc = list(a)\nprint(\"id(a):\", id(a))\nprint(\"id(b):\", id(b), \"-> a is b:\", a is b)\nprint(\"id(c):\", id(c), \"-> a is c:\", a is c, \" a == c:\", a == c)\n\nsmall = 256\nx = int(\"256\")\nprint(\"256 cached?\", x is small)   # True\nbig = 257\ny = int(\"257\")\nprint(\"257 cached?\", y is big)     # False" },
        { title: "The mutable-default trap (and the fix)", code: "def buggy(item, bag=[]):      # created ONCE, reused every call\n    bag.append(item)\n    return bag\nprint(buggy(\"a\"))   # ['a']\nprint(buggy(\"b\"))   # ['a', 'b']  <-- surprise!\n\ndef fixed(item, bag=None):\n    if bag is None:\n        bag = []\n    bag.append(item)\n    return bag\nprint(fixed(\"a\"))   # ['a']\nprint(fixed(\"b\"))   # ['b']  correct" },
      ],
      quiz: [
        { q: "What does `is` compare?", choices: ["Values", "Object identity (same object)", "Types", "Lengths"], answer: 1, explain: "`is` checks identity — same object. Use `==` for values." },
        { q: "After `b = a` (a is a list), `b.append(9)`…", choices: ["Leaves a unchanged", "Also changes a — same object", "Raises an error", "Copies the list first"], answer: 1, explain: "b and a reference the same list, so the change shows through both names." },
        { q: "Why is a mutable default argument dangerous?", choices: ["It's slow", "It's created once and shared across calls", "It raises an error", "It can't be changed"], answer: 1, explain: "The default object is made a single time at definition and reused, so mutations persist." },
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
