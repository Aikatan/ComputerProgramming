/* ===================== Topic 03 — Decisions & Boolean Logic ===================== */
App.registerTopic({
  id: "t03",
  title: "Decisions & Boolean Logic",
  short: "Decisions & Loops",
  blurb: "Booleans, comparisons, if/elif/else, and loops with break/continue/pass/else.",
  intro: "Programs make choices and repeat work. This topic gives you both: boolean logic to decide, and loops to repeat — with interactive truth tables and a step-by-step loop tracer.",
  lessons: [
    {
      id: "boolean",
      title: "Booleans & truthiness",
      sub: "True / False, and what counts as true.",
      slides: "03:4",
      keywords: "bool true false truthy falsy none empty",
      learn: [
        { type: "text", html: "A <span class='term'>boolean</span> is either <span class='kw'>True</span> or <span class='kw'>False</span> — note the capital letters. Other values are <i>truthy</i> or <i>falsy</i> when used in a condition." },
        { type: "list", title: "The rules", items: [
          "<b>Falsy</b>: <code>0</code>, <code>0.0</code>, <code>\"\"</code> (empty string), <code>None</code>, empty collections.",
          "<b>Truthy</b>: any non-zero number, any non-empty string, etc.",
          "Booleans are numbers underneath: <code>int(True)</code> is 1, <code>int(False)</code> is 0.",
        ] },
      ],
      live: [
        { title: "Test truthiness", code: "print(bool(0))      # False\nprint(bool(0.01))   # True\nprint(bool(\"\"))     # False\nprint(bool(\" \"))    # True (a space is non-empty!)\nprint(bool(None))   # False\nprint(int(True) + int(True))  # 2" },
      ],
      quiz: [
        { q: "Which of these is truthy?", choices: ["0", "\"\" (empty string)", "\" \" (a space)", "None"], answer: 2, explain: "A string with a space is non-empty, so it's truthy. Empty string, 0 and None are falsy." },
      ],
    },
    {
      id: "operators",
      title: "Logical & comparison operators",
      sub: "and / or / not, and ==, !=, <, >, <=, >=.",
      slides: "03:5–7",
      keywords: "and or not comparison equal truth table operator",
      learn: [
        { type: "text", html: "<b>Comparison operators</b> ask yes/no questions and return a boolean: <code>==</code> equal, <code>!=</code> not equal, <code>&lt; &gt; &lt;= &gt;=</code>. <b>Logical operators</b> combine booleans: <code>and</code>, <code>or</code>, <code>not</code>." },
        { type: "widget", name: "truthTable", config: {} },
        { type: "note", variant: "warn", title: "= vs ==", html: "One equals sign <code>=</code> <i>assigns</i> (<code>x = 5</code>). Two <code>==</code> <i>compares</i> (<code>x == 5</code>). Mixing them up is a classic bug." },
      ],
      live: [
        { title: "Combine conditions", code: "is_raining = True\nis_sun_rising = False\nprint(not is_raining)                       # False\nprint(is_raining and not is_sun_rising)     # True\nprint(2 <= 3 <= 4)                          # chained: True" },
      ],
      quiz: [
        { q: "`True and False` is…", choices: ["True", "False", "Error", "None"], answer: 1, explain: "'and' is only True when both sides are True." },
        { q: "Which operator compares for equality?", choices: ["=", "==", ":=", "=>"], answer: 1, explain: "== compares; a single = assigns a value." },
      ],
    },
    {
      id: "if-elif-else",
      title: "if / elif / else",
      sub: "Branching: run code only when a condition holds.",
      slides: "03:8–10",
      keywords: "if elif else condition indentation branch nested",
      learn: [
        { type: "text", html: "An <span class='kw'>if</span> statement runs its block only when the condition is <code>True</code>. Add <span class='kw'>elif</span> for more cases and <span class='kw'>else</span> for the fallback. <b>Indentation (4 spaces) defines the block</b> — Python has no curly braces." },
        { type: "example", caption: "first matching branch wins", code:
"age = 6\nif age > 20:\n    message = \"You are an ADULT!\"\nelif age > 10:\n    message = \"You are a TEENAGER!\"\nelse:\n    message = \"You are a CHILD!\"\nprint(message)   # You are a CHILD!",
          annot: [
            { c: "if age > 20", e: "False (6 is not > 20), so skip this block." },
            { c: "elif age > 10", e: "Also False, skip." },
            { c: "else", e: "Nothing matched, so the else block runs." },
          ] },
        { type: "note", variant: "danger", title: "Indentation matters", html: "Inconsistent indentation raises <code>IndentationError</code>. Pick 4 spaces and stick with it." },
      ],
      live: [
        { title: "Grade classifier — change the score", code: "score = 73\nif score >= 80:\n    grade = \"A\"\nelif score >= 70:\n    grade = \"B\"\nelif score >= 60:\n    grade = \"C\"\nelif score >= 50:\n    grade = \"D\"\nelse:\n    grade = \"F\"\nprint(\"Score\", score, \"=> grade\", grade)" },
      ],
      quiz: [
        { q: "In if/elif/else, how many blocks run for one pass?", choices: ["All of them", "At most one", "Exactly two", "None"], answer: 1, explain: "Only the first matching branch runs; the rest are skipped." },
        { q: "What defines a block in Python?", choices: ["Curly braces { }", "Semicolons", "Indentation", "The 'end' keyword"], answer: 2, explain: "Python uses indentation (commonly 4 spaces) to mark a block." },
      ],
    },
    {
      id: "loops",
      title: "while & for loops",
      sub: "Repeat work — with a live step-by-step tracer.",
      slides: "03:12–14",
      keywords: "while for loop range iterate nested counter",
      learn: [
        { type: "text", html: "A <span class='kw'>while</span> loop repeats <i>as long as</i> a condition is true. A <span class='kw'>for</span> loop iterates over a sequence (a string, list, or <code>range</code>)." },
        { type: "subhead", text: "Step through a while loop" },
        { type: "widget", name: "loopViz", config: {
          title: "while value < 5 — press Next to advance",
          code: ["value = 0", "while value < 5:", "    print(value)", "    value = value + 1"],
          trace: [
            { line: 0, vars: { value: 0 }, log: "" },
            { line: 1, vars: { value: 0 }, log: "" },
            { line: 2, vars: { value: 0 }, log: "0" },
            { line: 3, vars: { value: 1 }, log: "0" },
            { line: 1, vars: { value: 1 }, log: "0" },
            { line: 2, vars: { value: 1 }, log: "0\n1" },
            { line: 3, vars: { value: 2 }, log: "0\n1" },
            { line: 1, vars: { value: 2 }, log: "0\n1" },
            { line: 2, vars: { value: 2 }, log: "0\n1\n2" },
            { line: 3, vars: { value: 5 }, log: "0\n1\n2\n3\n4" },
            { line: 1, vars: { value: 5 }, log: "0\n1\n2\n3\n4  (5 < 5 is False — loop ends)" },
          ],
        } },
        { type: "example", caption: "for with range(start, stop, step)", code:
"for i in range(0, 20, 5):\n    print(i)        # 0 5 10 15",
          annot: [
            { c: "range(0, 20, 5)", e: "Counts from 0, stops <i>before</i> 20, stepping by 5 → 0,5,10,15." },
          ] },
        { type: "subhead", text: "Step through a for loop" },
        { type: "widget", name: "loopViz", config: {
          title: "for i in range(1, 4): total = total + i",
          code: ["total = 0", "for i in range(1, 4):", "    total = total + i", "print(total)"],
          trace: [
            { line: 0, vars: { total: 0 }, log: "" },
            { line: 1, vars: { total: 0, i: 1 }, log: "" },
            { line: 2, vars: { total: 1, i: 1 }, log: "" },
            { line: 1, vars: { total: 1, i: 2 }, log: "" },
            { line: 2, vars: { total: 3, i: 2 }, log: "" },
            { line: 1, vars: { total: 3, i: 3 }, log: "" },
            { line: 2, vars: { total: 6, i: 3 }, log: "" },
            { line: 1, vars: { total: 6, i: "—" }, log: "(range exhausted — loop ends)" },
            { line: 3, vars: { total: 6 }, log: "6" },
          ],
        } },
        { type: "subhead", text: "▶ Run it yourself — line by line" },
        { type: "text", html: "The tracer above is hand-drawn. This one runs your <b>real</b> code: press <b>Step Run</b>, then <b>Next</b> (or <b>Play</b>) to execute one line at a time. The current line is marked <code>▸</code>, and you see every variable update and the output as it happens. Edit the loop and step through your own version." },
        { type: "steprun", title: "for loop — step through real execution", code: "total = 0\nfor i in range(1, 4):\n    total = total + i\n    print(\"i =\", i, \"-> total =\", total)\nprint(\"final total:\", total)" },
        { type: "tabs", tabs: [
          { label: "while vs for", blocks: [
            { type: "list", items: [
              "Use <b>for</b> when you know the sequence to walk (a range, a list, a string).",
              "Use <b>while</b> when you repeat until some condition changes and you don't know how many times (e.g. 'keep asking until the password is right').",
              "Any for loop can be rewritten as a while loop with a manual counter — for is just shorter and safer.",
            ] },
          ] },
          { label: "Accumulator pattern", blocks: [
            { type: "text", html: "A hugely common pattern: start a variable at 0 (or an empty list/string), then update it each iteration." },
            { type: "example", caption: "summing and collecting", code:
"total = 0\nfor n in [4, 8, 15, 16]:\n    total += n          # accumulate a sum\nprint(total)            # 43\n\nsquares = []\nfor n in range(1, 5):\n    squares.append(n*n) # accumulate a list\nprint(squares)          # [1, 4, 9, 16]" },
          ] },
          { label: "Looping with index", blocks: [
            { type: "text", html: "Sometimes you need both the position and the value. <code>enumerate()</code> gives you both at once — cleaner than managing a counter by hand." },
            { type: "example", caption: "enumerate", code:
"colors = ['red', 'green', 'blue']\nfor index, color in enumerate(colors):\n    print(index, color)",
              output: "0 red\n1 green\n2 blue" },
          ] },
        ] },
        { type: "note", variant: "danger", title: "Beware infinite loops", html: "<code>while True:</code> never stops on its own. Make sure something inside changes the condition (or use <code>break</code>)." },
      ],
      live: [
        { title: "for over a range", code: "for i in range(1, 6):\n    print(\"i =\", i, \" square =\", i*i)" },
        { title: "Nested loops — a tiny clock", code: "for hour in range(8, 10):\n    for minute in range(0, 60, 30):\n        print(f\"{hour}:{minute:02d}\")" },
      ],
      quiz: [
        { q: "`range(0, 20, 5)` produces…", choices: ["0 5 10 15 20", "0 5 10 15", "5 10 15 20", "0 to 20"], answer: 1, explain: "The stop value (20) is excluded: 0, 5, 10, 15." },
        { q: "A for loop is best when…", choices: ["You don't know how many times to repeat", "You iterate over a known sequence", "You never want to stop", "You only need one run"], answer: 1, explain: "for shines when iterating a sequence or a known range; while suits unknown counts." },
      ],
    },
    {
      id: "loop-control",
      title: "break, continue, pass & loop-else",
      sub: "Fine control over how loops behave.",
      slides: "03:15–19",
      keywords: "break continue pass else loop control placeholder",
      learn: [
        { type: "list", title: "The four tools", items: [
          "<b>break</b> — exit the loop immediately.",
          "<b>continue</b> — skip the rest of this iteration, jump to the next.",
          "<b>pass</b> — do nothing; a placeholder where code is syntactically required.",
          "<b>loop else</b> — runs only if the loop finished <i>without</i> hitting a break.",
        ] },
        { type: "example", caption: "continue skips even numbers", code:
"for i in range(10):\n    if i % 2 == 0:\n        continue      # skip evens\n    print(i)          # 1 3 5 7 9",
          annot: [
            { c: "i % 2 == 0", e: "True for even numbers." },
            { c: "continue", e: "Jumps straight to the next iteration, so print is skipped for evens." },
          ] },
        { type: "example", caption: "loop-else for a search", code:
"numbers = [2, 5, 7, 11, 12]\nfor i in numbers:\n    if i == 10:\n        print(\"Found 10!\")\n        break\nelse:\n    print(\"10 is not in the list.\")",
          output: "10 is not in the list." },
      ],
      live: [
        { title: "break out early", code: "i = 10\nwhile i >= 0:\n    i -= 1\n    if i == 5:\n        break\n    print(i)   # 9 8 7 6" },
        { title: "FizzBuzz-style with continue", code: "for n in range(1, 31):\n    if n % 3 == 0:\n        print(n, \"-> Go\")\n        continue\n    print(n)" },
      ],
      quiz: [
        { q: "What does `continue` do?", choices: ["Exit the loop", "Skip to the next iteration", "Do nothing", "Restart the program"], answer: 1, explain: "continue abandons the current iteration and moves to the next." },
        { q: "A loop's `else` runs when…", choices: ["The loop body errors", "The loop ends without a break", "Always", "Never"], answer: 1, explain: "Loop-else runs only if no break occurred." },
      ],
    },
    {
      id: "practice",
      title: "Practice problems",
      sub: "Conditions and loops together.",
      slides: "03:21",
      keywords: "practice grade password sum divisible",
      learn: [
        { type: "list", title: "Try these (from the slides)", items: [
          "Read an age; print “ยังไม่บรรลุนิติภาวะ” if &lt; 18 else “บรรลุนิติภาวะแล้ว”.",
          "Read a score 0–100 and print the grade (A ≥ 80, B 70–79, C 60–69, D 50–59, F &lt; 50).",
          "Keep asking for a password until it equals \"1234\".",
          "Read 5 integers and print their sum.",
          "Print 1–30, but for multiples of 3 print “Go”.",
        ] },
      ],
      live: [
        { title: "Problem 3 (solved) — password loop", code: "while True:\n    pw = input(\"Password: \")\n    if pw == \"1234\":\n        print(\"เข้าสู่ระบบสำเร็จ\")\n        break\n    print(\"รหัสผิด กรุณาลองใหม่\")" },
        { title: "Problem 4 — sum of 5 numbers (your turn)", code: "total = 0\nfor _ in range(5):\n    total += int(input(\"Number: \"))\nprint(\"Sum =\", total)" },
        { title: "Problem 5 — 1..30 with 'Go' for multiples of 3", code: "for n in range(1, 31):\n    if n % 3 == 0:\n        print(\"Go\")\n    else:\n        print(n)" },
      ],
    },
  ],
});
