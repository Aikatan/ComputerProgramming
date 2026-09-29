/* ===================== Topic 06 - Strings, Lists and Dictionaries =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: strings (building on Topic 02) -> lists -> list methods -> dictionaries -> practice.
   Python level: t02-t05 material plus lists, dictionaries and their methods. No f-strings, no try.
   ====================================================================================== */
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
  const TT = (trace, rows) => W("traceTable", rows ? { trace, rows } : { trace });

  /* ---------- traces ---------- */
  const T_slice = {
    code: ['s = "Python"', "r = s[::-1]", "part = s[-3:-1]", "print(r, part)"],
    steps: [
      { line: 0, note: "The string has the indexes 0 to 5 (or -6 to -1).", set: { s: "'Python'" } },
      { line: 1, note: "Step -1 goes from the end to the start: the reversed string.", set: { r: "'nohtyP'" } },
      { line: 2, note: "From index -3 up to (not including) -1: 'h' and 'o'.", set: { part: "'ho'" } },
      { line: 3, note: "Both new strings are displayed. s is unchanged.", print: "nohtyP ho" },
    ],
  };
  const T_list = {
    code: ["readings = [20, 22, 21, 23]", "first = readings[0]", "last = readings[-1]", "middle = readings[1:3]", "print(first, last, middle)"],
    steps: [
      { line: 0, note: "A list of 4 elements, with the indexes 0 to 3.", set: { readings: "[20, 22, 21, 23]" } },
      { line: 1, note: "Index 0 is the first element.", set: { first: "20" } },
      { line: 2, note: "Index -1 is the last element.", set: { last: "23" } },
      { line: 3, note: "A slice is a new list: the elements 1 and 2.", set: { middle: "[22, 21]" } },
      { line: 4, note: "Two numbers and a list are displayed.", print: "20 23 [22, 21]" },
    ],
  };
  const T_pop = {
    code: ["stack = [5, 7, 9]", "top = stack.pop()", "stack.remove(5)", "print(stack, top)"],
    steps: [
      { line: 0, note: "A list of three elements.", set: { stack: "[5, 7, 9]" } },
      { line: 1, note: "pop() removes the last element and returns it: 9 is stored in top.", set: { stack: "[5, 7]", top: "9" } },
      { line: 2, note: "remove(5) removes the element equal to 5. It returns nothing.", set: { stack: "[7]" } },
      { line: 3, note: "The list and the popped value are displayed.", print: "[7] 9" },
    ],
  };
  const T_dict = {
    code: ['d = {"name": "Pump", "voltage": 220}', 'v = d["voltage"]', 'c = d.get("current", 0)', "print(v, c)"],
    steps: [
      { line: 0, note: "Two key-value pairs.", set: { d: "{'name': 'Pump', 'voltage': 220}" } },
      { line: 1, note: "The value of the key \"voltage\".", set: { v: "220" } },
      { line: 2, note: "The key \"current\" does not exist: get returns the default 0.", set: { c: "0" } },
      { line: 3, note: "Both values are displayed.", print: "220 0" },
    ],
  };

  App.registerTopic({
    id: "t06",
    title: "Strings, Lists and Dictionaries",
    short: "Strings, Lists & Dicts",
    blurb: "More string operations, lists and their methods, and dictionaries.",
    intro: "This chapter covers the data structures that store and process many values: strings, lists, and dictionaries. Each lesson uses only what the lessons before it have explained:<br>strings → lists → list methods → dictionaries → practice.",
    lessons: [
      /* =============================== 1. STRINGS =============================== */
      {
        id: "strings",
        title: "Strings: more operations",
        sub: "Multi-line strings, slicing in both directions, and methods for processing text.",
        slides: "06:4–12",
        keywords: "string triple quotes slicing reverse strip find count startswith endswith isdigit loop",
        deck: [
          { kind: "overview", title: "Strings: more operations", blocks: [
            T("Topic 02 introduced strings: indexing, slicing, <code>len()</code>, <code>+</code>, <code>*</code>, <code>in</code>, <code>upper()</code>, <code>lower()</code>, <code>replace()</code>, and immutability. This lesson adds the operations that process text data."),
            L(["Multi-line strings", "Slicing in both directions", "strip() and find()", "count() and checking methods", "Processing a string with a loop"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Multi-line strings", title: "Triple quotes", blocks: [
            L([
              "A string in triple quotes, <code>\"\"\"...\"\"\"</code> or <code>'''...'''</code>, can span several lines.",
              "The line breaks are part of the string.",
              "Triple quotes are also used for docstrings (Topic 05).",
            ]),
            CODE('note = """Line 1\nLine 2"""\nprint(note)', "Line 1\nLine 2", "example"),
          ] },
          { kind: "concept", part: "Slicing in both directions", title: "Slicing rules", blocks: [
            T("<code>s[start:end:step]</code>: start is included, end is excluded (Topic 02)."),
            TB(["Slice of s = \"Python\"", "Result", "Rule"], [
              ["<code>s[::2]</code>", "<code>'Pto'</code>", "every second character"],
              ["<code>s[::-1]</code>", "<code>'nohtyP'</code>", "a negative step goes backward: reversed"],
              ["<code>s[-3:-1]</code>", "<code>'ho'</code>", "negative indexes count from the end"],
              ["<code>s[0:10]</code>", "<code>'Python'</code>", "an end beyond the string is not an error"],
              ["<code>s[4:1]</code>", "<code>''</code>", "start after end (step 1): an empty string"],
            ]),
          ] },
          { kind: "code", part: "Slicing in both directions", title: "First example: execution step by step", blocks: [W("codeTrace", T_slice)] },
          { kind: "trace", part: "Slicing in both directions", title: "Trace table", blocks: [TT(T_slice)] },
          { kind: "concept", part: "strip() and find()", title: "strip() and find()", blocks: [
            TB(["Method", "Result", "Example"], [
              ["<code>s.strip()</code>", "a copy without spaces at the start and the end", "<code>\"  hi  \".strip()</code> → <code>'hi'</code>"],
              ["<code>s.find(x)</code>", "the index of the first match of x", "<code>\"sensor\".find(\"n\")</code> → <code>2</code>"],
              ["<code>s.find(x)</code>", "<code>-1</code> when x is not found", "<code>\"sensor\".find(\"x\")</code> → <code>-1</code>"],
            ]),
            T("<code>lstrip()</code> and <code>rstrip()</code> remove spaces only at the start or only at the end."),
          ] },
          { kind: "code", part: "strip() and find()", title: "Example: cleaning a sensor message", blocks: [
            EX('msg = "  TEMP=25  "\nclean = msg.strip()\nprint(clean)\nprint(clean.find("="))\nprint(clean.find("#"))', "strip, then search", [
              { c: "msg.strip()", e: "<code>TEMP=25</code>: the spaces are removed" },
              { c: 'find("=")', e: "\"=\" is at index <code>4</code>" },
              { c: 'find("#")', e: "Not found: <code>-1</code>" },
            ]),
          ] },
          { kind: "concept", part: "count() and checking methods", title: "count() and checking methods", blocks: [
            TB(["Method", "Result"], [
              ["<code>s.count(x)</code>", "the number of times x appears"],
              ["<code>s.startswith(x)</code>", "True if s starts with x"],
              ["<code>s.endswith(x)</code>", "True if s ends with x"],
              ["<code>s.isdigit()</code>", "True if s is not empty and contains only digits"],
            ]),
            T("String methods return new values. The original string does not change."),
          ] },
          { kind: "code", part: "count() and checking methods", title: "Example: checking a device code", blocks: [
            EX('code = "PUMP-2026-07"\nprint(code.count("2"))\nprint(code.startswith("PUMP"))\nprint(code.endswith(".txt"))\nprint("2026".isdigit())', "counting and checking", [
              { c: 'count("2")', e: "Two 2s: <code>2</code>" },
              { c: "startswith, endswith", e: "<code>True</code>, <code>False</code>" },
              { c: '"2026".isdigit()', e: "Only digits: <code>True</code>" },
            ]),
          ] },
          { kind: "concept", part: "Processing a string with a loop", title: "A loop over the characters", blocks: [
            L([
              "<code>for ch in s:</code> visits each character (Topic 03).",
              "To count characters with a property, use a counter and an if.",
              "To build a new string, start with <code>\"\"</code> and add characters with <code>+</code>.",
            ]),
          ] },
          { kind: "code", part: "Processing a string with a loop", title: "Example: counting a letter", blocks: [
            EX('text = "Engineering"\ncount = 0\nfor ch in text:\n    if ch == "e" or ch == "E":\n        count = count + 1\nprint(count)', "a counter with a condition", [
              { c: 'ch == "e" or ch == "E"', e: "True for E, e, e" },
              { c: "print(count)", e: "<code>3</code>" },
            ]),
          ] },
          { kind: "code", part: "Processing a string with a loop", title: "Example: building a new string", blocks: [
            EX('word = "sensor"\nresult = ""\nfor ch in word:\n    result = ch + result\nprint(result)', "each character goes in front", [
              { c: "result = ch + result", e: "s → es → nes → … → the reversed word" },
              { c: "print(result)", e: "<code>rosnes</code>, the same as <code>word[::-1]</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Triple quotes make multi-line strings.",
              "<code>s[::-1]</code> reverses; an end beyond the string is not an error.",
              "<code>strip()</code> removes outer spaces; <code>find()</code> gives an index or -1.",
              "<code>count()</code>, <code>startswith()</code>, <code>endswith()</code>, <code>isdigit()</code> check text.",
              "A for loop counts or builds strings character by character.",
            ]),
            NEXT("<b>Lists</b>. A list stores several values of any type in one variable."),
          ] },
          { kind: "exercise", title: "Determine the output: slicing", cols: [
            [T("Write the output of each line on paper.<br>Then run the program and compare.")],
            [RUN('s = "Programming"\nprint(s[::-1])\nprint(s[-4:])\nprint(s[2:100])\nprint(s[::3])')],
          ] },
          { kind: "exercise", title: "Determine the output: methods", cols: [
            [T("Write the output of each line on paper.<br>Then run the program and compare.")],
            [RUN('s = "  a-b-c  "\nprint(s.strip())\nprint(s.find("b"))\nprint(s.find("z"))\nprint(s.count("-"))')],
          ] },
          { kind: "exercise", title: "Write a program: find a character", blocks: [
            PQ("Read an e-mail address with the prompt <code>E-mail: </code>. Display the index of \"@\", or not found when there is no \"@\". Test input: user.name@kmutnb.ac.th.",
              "E-mail: user.name@kmutnb.ac.th\n9", "# Write your program here\n", ["user.name@kmutnb.ac.th"], "pos = email.find(\"@\"); if pos == -1: ..."),
          ] },
          { kind: "exercise", title: "Write a program: count digits", blocks: [
            PQ("Count the digits in the string \"A1B22C\" with a loop and <code>isdigit()</code>, and display the count.",
              "3", 'code = "A1B22C"\n# Write the loop here\n', null, "if ch.isdigit(): count = count + 1"),
          ] },
          { kind: "exercise", title: "Write a program: clean a message", blocks: [
            PQ("Remove the outer spaces of <code>\"  motor ok  \"</code>, change it to capital letters, and display it.",
              "MOTOR OK", 'msg = "  motor ok  "\n', null, "print(msg.strip().upper())"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: '`"sensor".find("x")` returns…', choices: ["0", "-1", "None", "an error"], answer: 1, explain: "find returns -1 when the text is not found." },
            { q: '`"Python"[::-1]` is…', choices: ["Python", "nohtyP", "P", "an error"], answer: 1, explain: "Step -1 reverses the string." },
          ])] },
        ],
      },

      /* =============================== 2. LISTS =============================== */
      {
        id: "lists",
        title: "Lists",
        sub: "Creating lists, indexing, slicing, changing elements, loops, and sum, max and min.",
        slides: "06:14–16, 21",
        keywords: "list element index slice mutable len in loop sum max min average",
        deck: [
          { kind: "overview", title: "Lists", blocks: [
            T("A <b>list</b> stores several values in one variable, in order. The values are called <b>elements</b>."),
            L(["Creating a list", "Indexing and slicing", "Changing an element", "Looping over a list", "sum(), max(), min(), and averages"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Creating a list", title: "Creating a list", blocks: [
            L([
              "Square brackets, with the elements separated by commas: <code>readings = [20, 22, 21, 23]</code>.",
              "A list can be empty, <code>[]</code>, and can hold different types: <code>[1, \"A\", 3.5]</code>.",
              "A list is ordered and may contain the same value twice.",
              "<code>len(readings)</code> is the number of elements: 4.",
            ]),
          ] },
          { kind: "concept", part: "Indexing and slicing", title: "Indexes of a list", blocks: [
            TB(["Element", "20", "22", "21", "23"], [["Index", "0", "1", "2", "3"], ["Negative index", "-4", "-3", "-2", "-1"]], "<code>readings = [20, 22, 21, 23]</code>", "center"),
            L([
              "Indexing and slicing work as for strings (Topic 02).",
              "A slice is a new list: <code>readings[1:3]</code> is <code>[22, 21]</code>.",
              "An index outside the list causes an IndexError.",
            ]),
          ] },
          { kind: "code", part: "Indexing and slicing", title: "First example: execution step by step", blocks: [W("codeTrace", T_list)] },
          { kind: "trace", part: "Indexing and slicing", title: "Trace table", blocks: [TT(T_list)] },
          { kind: "concept", part: "Changing an element", title: "Lists are mutable", blocks: [
            L([
              "An element can be replaced: <code>readings[1] = 25</code>.",
              "A list is <b>mutable</b>; a string is immutable (Topic 02).",
              "The length stays the same when an element is replaced.",
            ]),
          ] },
          { kind: "code", part: "Changing an element", title: "Example: replacing a reading", blocks: [
            EX("readings = [20, 22, 21]\nreadings[1] = 25\nprint(readings)\nprint(len(readings))", "assignment to an index", [
              { c: "readings[1] = 25", e: "The second element becomes 25: <code>[20, 25, 21]</code>" },
              { c: "len(readings)", e: "Still <code>3</code>" },
            ]),
          ] },
          { kind: "concept", part: "Looping over a list", title: "Looping over a list", blocks: [
            L([
              "<code>for r in readings:</code> visits each element.",
              "<code>for i in range(len(readings)):</code> visits each index; <code>readings[i]</code> is the element.",
              "<code>x in readings</code> is True when x is an element.",
            ]),
          ] },
          { kind: "code", part: "Looping over a list", title: "Example: readings above 21", blocks: [
            EX("readings = [20, 22, 21, 23]\nfor r in readings:\n    if r > 21:\n        print(r)\nprint(22 in readings)", "a loop with a condition", [
              { c: "for r in readings", e: "r is 20, 22, 21, 23 in turn; 22 and 23 are displayed" },
              { c: "22 in readings", e: "<code>True</code>" },
            ]),
          ] },
          { kind: "concept", part: "sum(), max(), min(), and averages", title: "Functions for lists of numbers", blocks: [
            TB(["Expression", "Result for [20, 22, 21, 23]"], [
              ["<code>sum(readings)</code>", "86"],
              ["<code>max(readings)</code>", "23"],
              ["<code>min(readings)</code>", "20"],
              ["<code>sum(readings) / len(readings)</code>", "21.5: the average (/ gives a float)"],
            ]),
          ] },
          { kind: "code", part: "sum(), max(), min(), and averages", title: "Example: grade statistics", blocks: [
            EX("grades = [85, 90, 78, 92]\nprint(max(grades), min(grades))\nprint(sum(grades) / len(grades))", "from the lecture", [
              { c: "max, min", e: "<code>92 78</code>" },
              { c: "sum / len", e: "341 / 4 → <code>85.25</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A list stores ordered elements: <code>[20, 22, 21]</code>.",
              "Indexing and slicing work as for strings; a slice is a new list.",
              "Lists are mutable: <code>readings[1] = 25</code>.",
              "<code>for x in list</code> visits the elements; <code>in</code> checks membership.",
              "<code>sum()</code>, <code>max()</code>, <code>min()</code>, and <code>sum() / len()</code> summarize numbers.",
            ]),
            NEXT("<b>List methods</b>. Methods add, remove, and reorder the elements of a list."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output of each line on paper.<br>Then run the program and compare.")],
            [RUN("nums = [10, 20, 30, 40, 50]\nprint(nums[1])\nprint(nums[-2])\nprint(nums[1:3])\nprint(nums[::2])")],
          ] },
          { kind: "exercise", title: "Complete the code", blocks: [
            PQ("Complete line 2, so that the program displays the average of the readings.",
              "21.5", "readings = [20, 22, 21, 23]\naverage = \nprint(average)\n", null, "average = sum(readings) / len(readings)"),
          ] },
          { kind: "exercise", title: "Write a program: count values", blocks: [
            PQ("Count the readings above 25 in the list, and display the count.",
              "3", "readings = [24, 26, 25, 30, 28, 22]\n# Write the loop here\n", null, "if r > 25: count = count + 1"),
          ] },
          { kind: "exercise", title: "Write a program: the largest without max()", blocks: [
            PQ("Find the largest reading with a loop, without <code>max()</code>, and display it.",
              "31", "readings = [24, 31, 25, 30]\n# Write the loop here\n", null, "largest = readings[0]; for r in readings: if r > largest: largest = r"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`nums = [10, 20, 30]`. What is `nums[-1]`?", choices: ["10", "20", "30", "an error"], answer: 2, explain: "Index -1 is the last element." },
            { q: "`sum([1, 2, 3, 4]) / 4` is…", choices: ["2", "2.5", "10", "an error"], answer: 1, explain: "10 / 4 = 2.5; / always gives a float." },
          ])] },
        ],
      },

      /* =============================== 3. LIST METHODS =============================== */
      {
        id: "list-methods",
        title: "Changing lists: methods",
        sub: "append, insert, extend, remove, pop, del, sort, reverse, split, and join.",
        slides: "06:17–20",
        keywords: "append insert extend remove pop del sort reverse split join list method",
        deck: [
          { kind: "overview", title: "Changing lists: methods", blocks: [
            T("List methods change a list <b>in place</b>: they add, remove, and reorder its elements."),
            L(["append() and insert()", "extend() and append()", "remove(), pop(), and del", "sort() and reverse()", "Strings and lists: split() and join()"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "append() and insert()", title: "Adding one element", blocks: [
            TB(["Method", "Effect", "nums = [10, 20, 30]"], [
              ["<code>nums.append(x)</code>", "adds x at the end", "<code>nums.append(40)</code> → <code>[10, 20, 30, 40]</code>"],
              ["<code>nums.insert(i, x)</code>", "inserts x at index i; later elements move right", "<code>nums.insert(1, 99)</code> → <code>[10, 99, 20, 30]</code>"],
            ]),
          ] },
          { kind: "visual", part: "append() and insert()", title: "append and insert, step by step", blocks: [
            W("boxTrain", { title: "nums", name: "nums", code: ["nums = [10, 20, 30]", "nums.append(40)", "nums.insert(1, 99)"], steps: [
              { items: [10, 20, 30], line: 0, enter: [0, 1, 2], caption: "Three elements." },
              { items: [10, 20, 30, 40], line: 1, enter: [3], caption: "append(40): 40 is added at the end." },
              { items: [10, 99, 20, 30, 40], line: 2, enter: [1], caption: "insert(1, 99): 99 goes to index 1; 20, 30, 40 move right." },
            ] }),
          ] },
          { kind: "concept", part: "append() and insert()", title: "The list after each statement", blocks: [
            TB(["Statement", "nums after the statement", "len(nums)"], [
              ["<code>nums = [10, 20, 30]</code>", "<code>[10, 20, 30]</code>", "3"],
              ["<code>nums.append(40)</code>", "<code>[10, 20, 30, 40]</code>", "4"],
              ["<code>nums.insert(1, 99)</code>", "<code>[10, 99, 20, 30, 40]</code>", "5"],
            ]),
          ] },
          { kind: "concept", part: "extend() and append()", title: "extend() adds several elements", blocks: [
            L([
              "<code>a.extend([4, 5])</code> adds each element: <code>[1, 2, 3, 4, 5]</code>.",
              "<code>a.append([4, 5])</code> adds one element, the list itself: <code>[1, 2, 3, [4, 5]]</code>.",
              "<code>len()</code> shows the difference: 5 and 4.",
            ]),
          ] },
          { kind: "code", part: "extend() and append()", title: "Example: extend compared with append", blocks: [
            EX("a = [1, 2, 3]\nb = [1, 2, 3]\na.extend([4, 5])\nb.append([4, 5])\nprint(a, len(a))\nprint(b, len(b))", "two methods, two results", [
              { c: "a.extend([4, 5])", e: "<code>[1, 2, 3, 4, 5] 5</code>" },
              { c: "b.append([4, 5])", e: "<code>[1, 2, 3, [4, 5]] 4</code>" },
            ]),
          ] },
          { kind: "concept", part: "remove(), pop(), and del", title: "Removing elements", blocks: [
            TB(["Statement", "Effect"], [
              ["<code>a.remove(x)</code>", "removes the <b>first</b> element equal to x (ValueError if x is missing)"],
              ["<code>a.pop()</code>", "removes the last element and <b>returns</b> it"],
              ["<code>a.pop(i)</code>", "removes the element at index i and returns it"],
              ["<code>del a[i]</code>", "removes the element at index i; returns nothing"],
            ]),
          ] },
          { kind: "code", part: "remove(), pop(), and del", title: "First example: execution step by step", blocks: [W("codeTrace", T_pop)] },
          { kind: "trace", part: "remove(), pop(), and del", title: "Trace table", blocks: [TT(T_pop)] },
          { kind: "code", part: "remove(), pop(), and del", title: "Example: remove takes the first match", blocks: [
            EX("values = [3, 1, 3, 2]\nvalues.remove(3)\nprint(values)\ndel values[0]\nprint(values)", "remove, then del", [
              { c: "values.remove(3)", e: "Only the first 3 is removed: <code>[1, 3, 2]</code>" },
              { c: "del values[0]", e: "The element at index 0 is removed: <code>[3, 2]</code>" },
            ]),
          ] },
          { kind: "concept", part: "sort() and reverse()", title: "Reordering a list", blocks: [
            L([
              "<code>a.sort()</code> arranges the elements in increasing order.",
              "<code>a.sort(reverse=True)</code> arranges them in decreasing order.",
              "<code>a.reverse()</code> reverses the current order.",
              "Both methods change the list and return <code>None</code>. Write <code>a.sort()</code>, not <code>a = a.sort()</code>.",
            ]),
          ] },
          { kind: "code", part: "sort() and reverse()", title: "Example: sorting readings", blocks: [
            EX("data = [23, 20, 25, 21]\ndata.sort()\nprint(data)\ndata.reverse()\nprint(data)", "in place", [
              { c: "data.sort()", e: "<code>[20, 21, 23, 25]</code>" },
              { c: "data.reverse()", e: "<code>[25, 23, 21, 20]</code>" },
            ]),
          ] },
          { kind: "concept", part: "Strings and lists: split() and join()", title: "split() and join()", blocks: [
            TB(["Expression", "Result"], [
              ["<code>\"a b  c\".split()</code>", "<code>['a', 'b', 'c']</code>: split at spaces"],
              ["<code>\"2025-10-15\".split(\"-\")</code>", "<code>['2025', '10', '15']</code>: split at each -"],
              ["<code>\"/\".join(['2025', '10', '15'])</code>", "<code>'2025/10/15'</code>: join with / between"],
            ]),
            T("<code>split()</code> returns a list of strings. <code>join()</code> needs a list of strings."),
          ] },
          { kind: "code", part: "Strings and lists: split() and join()", title: "Example: a date", blocks: [
            EX('date = "2025-10-15"\nparts = date.split("-")\nprint(parts)\nprint(parts[1])\nprint("/".join(parts))', "split, index, join", [
              { c: 'date.split("-")', e: "<code>['2025', '10', '15']</code>" },
              { c: "parts[1]", e: "<code>10</code>" },
              { c: '"/".join(parts)', e: "<code>2025/10/15</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>append(x)</code> adds one element; <code>extend(list)</code> adds each element of a list.",
              "<code>insert(i, x)</code> inserts at an index.",
              "<code>remove(x)</code> removes the first match; <code>pop()</code> removes and returns; <code>del a[i]</code> removes by index.",
              "<code>sort()</code> and <code>reverse()</code> change the list and return None.",
              "<code>split()</code> turns a string into a list; <code>join()</code> turns a list into a string.",
            ]),
            NEXT("<b>Dictionaries</b>. Values stored under names (keys) instead of positions."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output of each line on paper.<br>Then run the program and compare.")],
            [RUN("a = [5, 7]\na.append(9)\na.insert(0, 1)\nprint(a)\nx = a.pop()\nprint(x, a)\na.remove(7)\nprint(a)")],
          ] },
          { kind: "exercise", title: "Write a program: a filtered list", blocks: [
            PQ("Build a new list that contains only the readings above 25, with <code>append()</code>, and display it.",
              "[26, 30, 28]", "readings = [24, 26, 25, 30, 28, 22]\nhigh = []\n# Write the loop here\nprint(high)\n", null, "if r > 25: high.append(r)"),
          ] },
          { kind: "exercise", title: "Write a program: the top three", blocks: [
            PQ("Sort the scores in decreasing order and display the three highest as a list.",
              "[95, 91, 88]", "scores = [72, 95, 88, 64, 91]\n", null, "scores.sort(reverse=True), then print(scores[:3])"),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program should display the sorted list, but it displays None. Correct line 2.",
              "[1, 2, 3]", "data = [3, 1, 2]\ndata = data.sort()\nprint(data)\n", null, "sort() changes the list and returns None: write data.sort()."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`a = [1, 2]`, then `a.append([3, 4])`. What is `len(a)`?", choices: ["2", "3", "4", "an error"], answer: 1, explain: "append adds the list [3, 4] as one element." },
            { q: "`v = [3, 1, 3]`, then `v.remove(3)`. What is v?", choices: ["[1, 3]", "[3, 1]", "[1]", "[3, 1, 3]"], answer: 0, explain: "remove deletes only the first 3." },
          ])] },
        ],
      },

      /* =============================== 4. DICTIONARIES =============================== */
      {
        id: "dictionaries",
        title: "Dictionaries",
        sub: "Key-value pairs: reading, changing, removing, looping, and counting.",
        slides: "06:23–34",
        keywords: "dictionary key value get keyerror del pop popitem keys values items count frequency list vs dictionary",
        deck: [
          { kind: "overview", title: "Dictionaries", blocks: [
            T("A <b>dictionary</b> stores <b>key-value pairs</b>. A value is found by its key, not by a position."),
            L(["Creating a dictionary", "Reading values: [] and get()", "Adding, changing, and removing pairs", "Looping over a dictionary", "Counting with a dictionary", "Lists or dictionaries"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Creating a dictionary", title: "Creating a dictionary", blocks: [
            L([
              "Curly braces with <code>key: value</code> pairs: <code>device = {\"name\": \"Pump\", \"voltage\": 220}</code>.",
              "Each key is unique. Values may repeat.",
              "Keys are usually strings or numbers. <code>{}</code> is an empty dictionary.",
              "<code>len(device)</code> is the number of pairs; <code>\"name\" in device</code> checks a key.",
            ]),
          ] },
          { kind: "concept", part: "Reading values: [] and get()", title: "Reading a value", blocks: [
            TB(["Expression (d = {\"name\": \"Pump\", \"voltage\": 220})", "Result"], [
              ["<code>d[\"voltage\"]</code>", "<code>220</code>"],
              ["<code>d[\"current\"]</code>", "KeyError: the key does not exist"],
              ["<code>d.get(\"current\")</code>", "<code>None</code>"],
              ["<code>d.get(\"current\", 0)</code>", "<code>0</code>: the default"],
              ["<code>d.get(\"voltage\", 0)</code>", "<code>220</code>: the default is used only for a missing key"],
            ]),
          ] },
          { kind: "code", part: "Reading values: [] and get()", title: "First example: execution step by step", blocks: [W("codeTrace", T_dict)] },
          { kind: "trace", part: "Reading values: [] and get()", title: "Trace table", blocks: [TT(T_dict)] },
          { kind: "concept", part: "Adding, changing, and removing pairs", title: "Changing a dictionary", blocks: [
            TB(["Statement", "Effect"], [
              ["<code>d[key] = value</code>", "changes the value of an existing key, or adds a new pair"],
              ["<code>del d[key]</code>", "removes the pair"],
              ["<code>d.pop(key)</code>", "removes the pair and returns its value"],
              ["<code>d.popitem()</code>", "removes the pair added last and returns it as <code>(key, value)</code>"],
            ]),
          ] },
          { kind: "visual", part: "Adding, changing, and removing pairs", title: "Changes step by step", blocks: [
            W("dictTrain", { title: "device", name: "device",
              code: ["device = {'name': 'Pump', 'voltage': 220}", "device['voltage'] = 230", "device['phase'] = 3", "del device['name']"],
              steps: [
                { pairs: [["name", "Pump"], ["voltage", 220]], line: 0, caption: "Two pairs." },
                { pairs: [["name", "Pump"], ["voltage", 230]], line: 1, flash: ["voltage"], caption: "An existing key: its value changes." },
                { pairs: [["name", "Pump"], ["voltage", 230], ["phase", 3]], line: 2, flash: ["phase"], caption: "A new key: a new pair is added." },
                { pairs: [["voltage", 230], ["phase", 3]], line: 3, caption: "del removes the pair with the key 'name'." },
              ] }),
          ] },
          { kind: "code", part: "Adding, changing, and removing pairs", title: "Example: pop and popitem", blocks: [
            EX('d = {"name": "Pump", "voltage": 220}\nd["phase"] = 3\nv = d.pop("voltage")\nprint(v, d)\nprint(d.popitem())\nprint(d)', "removing and returning", [
              { c: 'd.pop("voltage")', e: "Returns 220: <code>220 {'name': 'Pump', 'phase': 3}</code>" },
              { c: "d.popitem()", e: "The last pair added: <code>('phase', 3)</code>" },
            ]),
          ] },
          { kind: "concept", part: "Looping over a dictionary", title: "Looping over keys, values, and pairs", blocks: [
            TB(["Loop", "The loop variable takes"], [
              ["<code>for key in d:</code>", "each key (the same as <code>d.keys()</code>)"],
              ["<code>for value in d.values():</code>", "each value"],
              ["<code>for key, value in d.items():</code>", "each pair: two variables per iteration"],
            ]),
          ] },
          { kind: "code", part: "Looping over a dictionary", title: "Example: keys and values", blocks: [
            EX('voltages = {"pump": 220, "fan": 110, "heater": 230}\nfor name in voltages:\n    print(name)\ntotal = 0\nfor v in voltages.values():\n    total = total + v\nprint(total)', "keys, then values", [
              { c: "for name in voltages", e: "The keys: pump, fan, heater" },
              { c: "voltages.values()", e: "220 + 110 + 230 → <code>560</code>" },
            ]),
          ] },
          { kind: "code", part: "Looping over a dictionary", title: "Example: pairs with items()", blocks: [
            EX('voltages = {"pump": 220, "fan": 110}\nfor name, v in voltages.items():\n    print(name, v, "V")', "two variables per pair", [
              { c: "for name, v in voltages.items()", e: "<code>pump 220 V</code>, then <code>fan 110 V</code>" },
            ]),
          ] },
          { kind: "concept", part: "Counting with a dictionary", title: "Counting how often a value appears", blocks: [
            L([
              "A dictionary can count occurrences: the key is the value, the dictionary value is its count.",
              "<code>counts[x] = counts.get(x, 0) + 1</code>: get gives 0 for a key that is not there yet.",
            ]),
          ] },
          { kind: "code", part: "Counting with a dictionary", title: "Example: counting words", blocks: [
            EX('text = "a b a c a b"\ncounts = {}\nfor w in text.split():\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)', "a frequency table", [
              { c: "text.split()", e: "The words: a, b, a, c, a, b" },
              { c: "counts.get(w, 0) + 1", e: "<code>{'a': 3, 'b': 2, 'c': 1}</code>" },
            ]),
          ] },
          { kind: "concept", part: "Lists or dictionaries", title: "Lists or dictionaries", blocks: [
            TB(["Feature", "List", "Dictionary"], [
              ["Access", "by position: 0, 1, 2, …", "by key: \"name\", \"voltage\", …"],
              ["Duplicates", "allowed", "keys are unique"],
              ["Order", "ordered", "keeps insertion order (Python 3.7 and later)"],
              ["Use for", "a sequence of values, such as readings", "named values, such as device settings"],
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A dictionary stores key-value pairs; keys are unique.",
              "<code>d[key]</code> reads a value (KeyError if missing); <code>d.get(key, default)</code> never fails.",
              "<code>d[key] = value</code> adds or changes; <code>del</code>, <code>pop()</code>, <code>popitem()</code> remove.",
              "Loop over keys, <code>values()</code>, or <code>items()</code>.",
              "<code>counts.get(x, 0) + 1</code> counts occurrences.",
            ]),
            NEXT("<b>Chapter practice</b>. Complete problems with strings, lists, and dictionaries."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output of each line on paper.<br>Then run the program and compare.")],
            [RUN('d = {"a": 1, "b": 2}\nprint(d.get("a", 0))\nprint(d.get("c", 0))\nprint(d.get("c"))\nd["c"] = 5\nprint(len(d), d.pop("a"))')],
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program stops with a KeyError, because the key \"current\" does not exist. Correct line 2 with get(), so that a missing current is 0.",
              "0", 'device = {"name": "Pump", "voltage": 220}\nprint(device["current"])\n', null, 'print(device.get("current", 0))'),
          ] },
          { kind: "exercise", title: "Write a program: a lookup with a default", blocks: [
            PQ("Read a device name with the prompt <code>Device: </code>, and display its voltage from the dictionary, or 0 when the device is unknown. Test input: lamp.",
              "Device: lamp\n0", 'voltages = {"pump": 220, "fan": 110}\n', ["lamp"], "print(voltages.get(name, 0))"),
          ] },
          { kind: "exercise", title: "Write a program: count characters", blocks: [
            PQ("Count how often each character appears in \"banana\" with a dictionary, and display the dictionary.",
              "{'b': 1, 'a': 3, 'n': 2}", 'word = "banana"\ncounts = {}\n# Write the loop here\nprint(counts)\n', null, "counts[ch] = counts.get(ch, 0) + 1"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: '`d = {"a": 1}`. What is `d.get("b")`?', choices: ["0", "None", "a KeyError", "1"], answer: 1, explain: "get returns None for a missing key when no default is given." },
            { q: '`d = {"a": 1}`. What does `d["b"]` do?', choices: ["returns None", "returns 0", "raises a KeyError", "adds the key b"], answer: 2, explain: "Reading a missing key with [] raises a KeyError." },
          ])] },
        ],
      },

      /* =============================== 5. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete problems with strings, lists, and dictionaries.",
        slides: "06:36",
        keywords: "practice count words even sum longest word frequency readings",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("For each problem, decide first:"),
            L([
              "the <b>data structure</b>: a string, a list, or a dictionary",
              "the <b>operation</b>: index, slice, method, or a loop over the elements",
              "then write the program and check the output with the test data",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: count the words", blocks: [
            T("Read a sentence and display the number of words. Words are separated by spaces."),
            IPO([["Input", "a sentence (str)"], ["Output", "the number of words"], ["Processing", "<code>len(sentence.split())</code>"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Use the prompt <code>Sentence: </code>. Test input: the motor runs at full speed.", "Sentence: the motor runs at full speed\n6", "# Write your program here\n", ["the motor runs at full speed"], "print(len(sentence.split()))"),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: sum of the even numbers", blocks: [
            T("Sum the even numbers of a list."),
            IPO([["Input", "a list of integers"], ["Output", "the sum of its even elements"], ["Processing", "for each element: if it is even, add it"]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("Use the list in the starter.", "30", "numbers = [3, 8, 5, 12, 7, 10]\n# Write your program here\n", null, "if n % 2 == 0: total = total + n"),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: the longest word", blocks: [
            T("Read a sentence and display its longest word. If two words have the same length, keep the first."),
            IPO([["Input", "a sentence"], ["Output", "the longest word"], ["Processing", "split, then keep the word with the largest len()"]]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Use the prompt <code>Sentence: </code>. Test input: check the pressure sensor today.", "Sentence: check the pressure sensor today\npressure", "# Write your program here\n", ["check the pressure sensor today"], "if len(w) > len(longest): longest = w"),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: readings from the keyboard", blocks: [
            T("Read 4 readings into a list. Display the list, the average rounded to 2 decimal places, and the largest reading."),
            IPO([["Input", "4 readings (float)"], ["Output", "the list, the average, the maximum"], ["Processing", "append each reading; sum / len; max"]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", blocks: [
            PQ("Use the prompt <code>Reading: </code>. Test input: 20.5, 22, 21.5, 23.",
              "Reading: 20.5\nReading: 22\nReading: 21.5\nReading: 23\n[20.5, 22.0, 21.5, 23.0]\n21.75\n23.0", "readings = []\n# Write your program here\n", ["20.5", "22", "21.5", "23"], "readings.append(float(input(\"Reading: \")))"),
          ] },
          { kind: "problem", part: "Problem 5", title: "Problem 5: word frequency", blocks: [
            T("Count how often each word appears in a sentence, and display each word with its count."),
            IPO([["Input", "a sentence"], ["Output", "one line per word: word count"], ["Processing", "a dictionary: counts[w] = counts.get(w, 0) + 1, then loop over items()"]]),
          ] },
          { kind: "exercise", part: "Problem 5", title: "Problem 5: write the program", blocks: [
            PQ("Use the sentence in the starter.", "on 2\noff 1\nfault 1", 'sentence = "on off on fault"\n# Write your program here\n', null, "for w, c in counts.items(): print(w, c)"),
          ] },
          { kind: "problem", part: "Problem 6", title: "Problem 6: settings from text", blocks: [
            T("A device sends its settings as text: \"mode=auto;speed=3\". Store them in a dictionary and display the value of speed."),
            IPO([["Input", "a settings string"], ["Output", "the value of speed"], ["Processing", "split at \";\", then split each part at \"=\"; store key and value"]]),
          ] },
          { kind: "exercise", part: "Problem 6", title: "Problem 6: write the program", blocks: [
            PQ("Use the string in the starter.", "3", 'text = "mode=auto;speed=3"\nsettings = {}\n# Write your program here\n', null, 'for part in text.split(";"): key, value = part.split("="); settings[key] = value'),
          ] },
          { kind: "summary", title: "Chapter summary", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1. Strings", "<code>[::-1]</code>, <code>strip()</code>, <code>find()</code> (-1 if missing), <code>count()</code>; strings are immutable."],
              ["2. Lists", "Ordered, mutable elements; indexing and slicing; <code>sum</code>, <code>max</code>, <code>min</code>."],
              ["3. List methods", "<code>append</code>, <code>extend</code>, <code>insert</code>, <code>remove</code>, <code>pop</code>, <code>sort</code>; <code>split</code> and <code>join</code>."],
              ["4. Dictionaries", "Key-value pairs; <code>get(key, default)</code>; loop over <code>items()</code>; count with <code>get</code>."],
            ]),
            N("<b>Topic 07: Data visualization and exceptions</b>. Plotting lists of values, and handling errors with try and except.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
