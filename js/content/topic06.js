/* ===================== Topic 06 - Strings, Lists and Dictionaries =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: strings (building on Topic 02) -> lists -> list methods -> tuples -> dictionaries
   -> sets -> trace challenges -> practice.
   Python level: t02-t05 material plus lists, tuples, dictionaries, sets and their methods.
   No f-strings, no try. Printed sets hold small integers only, so that their order is fixed.
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
  // the expected output of a paper exercise: the answer of the slide (instructor mode)
  const OUT = (text) => CODE(text, null, "output", "text");

  /* ---------- traces ---------- */
  const T_build = {
    code: ['word = "volt"', 'result = ""', "for ch in word:", "    result = ch + result", "print(result)"],
    steps: [
      { line: 0, note: "The word to reverse.", set: { word: "'volt'" } },
      { line: 1, note: "An empty string: the result is built from it.", set: { result: "''" } },
      { line: 2, note: "ch takes the first character: 'v'.", set: { ch: "'v'" } },
      { line: 3, note: "'v' + '' → 'v'.", set: { result: "'v'" } },
      { line: 2, note: "ch = 'o'.", set: { ch: "'o'" } },
      { line: 3, note: "'o' + 'v' → 'ov': the new character goes in front.", set: { result: "'ov'" } },
      { line: 2, note: "ch = 'l'.", set: { ch: "'l'" } },
      { line: 3, note: "'l' + 'ov' → 'lov'.", set: { result: "'lov'" } },
      { line: 2, note: "ch = 't'.", set: { ch: "'t'" } },
      { line: 3, note: "'t' + 'lov' → 'tlov'.", set: { result: "'tlov'" } },
      { line: 2, note: "No character is left: the loop ends." },
      { line: 4, note: "The reversed word is displayed. Result check: 'volt'[::-1] is 'tlov'.", print: "tlov" },
    ],
  };
  const T_loop = {
    code: ["readings = [24, 31, 27, 35]", "for r in readings:", "    if r > 30:", '        print("High:", r)', "print(27 in readings)"],
    steps: [
      { line: 0, note: "A list of 4 readings.", set: { readings: "[24, 31, 27, 35]" } },
      { line: 1, note: "r takes the first element: 24.", set: { r: "24" } },
      { line: 2, note: "24 > 30 is False: nothing is displayed." },
      { line: 1, note: "r takes the next element: 31.", set: { r: "31" } },
      { line: 2, note: "31 > 30 is True." },
      { line: 3, note: "The reading is displayed.", print: "High: 31" },
      { line: 1, note: "r = 27.", set: { r: "27" } },
      { line: 2, note: "27 > 30 is False." },
      { line: 1, note: "r = 35.", set: { r: "35" } },
      { line: 2, note: "35 > 30 is True." },
      { line: 3, note: "The reading is displayed.", print: "High: 35" },
      { line: 1, note: "No element is left: the loop ends." },
      { line: 4, note: "27 is an element of the list: True. Result check: only 31 and 35 are above 30.", print: "True" },
    ],
  };
  const T_pop = {
    code: ["stack = [5, 7, 9]", "while len(stack) > 0:", "    top = stack.pop()", "    print(top, stack)", 'print("Empty:", stack)'],
    steps: [
      { line: 0, note: "A list of three elements.", set: { stack: "[5, 7, 9]" } },
      { line: 1, note: "len(stack) is 3: 3 > 0 is True." },
      { line: 2, note: "pop() removes the last element, 9, and returns it: 9 is stored in top.", set: { stack: "[5, 7]", top: "9" } },
      { line: 3, note: "The returned value and the shorter list are displayed.", print: "9 [5, 7]" },
      { line: 1, note: "len(stack) is 2: True." },
      { line: 2, note: "pop() removes and returns 7.", set: { stack: "[5]", top: "7" } },
      { line: 3, note: "Display top and the list.", print: "7 [5]" },
      { line: 1, note: "len(stack) is 1: True." },
      { line: 2, note: "pop() removes and returns 5. The list is now empty.", set: { stack: "[]", top: "5" } },
      { line: 3, note: "Display top and the list.", print: "5 []" },
      { line: 1, note: "len(stack) is 0: 0 > 0 is False. The loop ends." },
      { line: 4, note: "Result check: the elements came out in reverse order: 9, 7, 5.", print: "Empty: []" },
    ],
  };
  const T_alias = {
    code: ["a = [20, 22]", "b = a", "b[0] = 25", "print(a, b)", "c = list(a)", "c[1] = 30", "print(a, c)"],
    steps: [
      { line: 0, note: "A list of two readings is created. a is a name for it.", set: { a: "[20, 22]" } },
      { line: 1, note: "No copy is made: b is a second name for the same list.", set: { b: "[20, 22]" } },
      { line: 2, note: "The list is changed through b. a is the same list: it shows the change too.", set: { a: "[25, 22]", b: "[25, 22]" } },
      { line: 3, note: "Both names display the same list.", print: "[25, 22] [25, 22]" },
      { line: 4, note: "list(a) creates a new list with the same elements: c is a copy.", set: { c: "[25, 22]" } },
      { line: 5, note: "Only the copy is changed. a and b keep [25, 22].", set: { c: "[25, 30]" } },
      { line: 6, note: "Result check: a changed with b (one list), but not with c (a copy).", print: "[25, 22] [25, 30]" },
    ],
  };
  const T_nested = {
    // Kept to 3 variables with one-line values and one-line notes, so that every step fits at 1280×720.
    code: ['logs = {"T1": [4, 6], "T2": [7, 9]}', "for name, data in logs.items():", "    print(name, sum(data) / len(data))", 'print(logs["T2"][1])'],
    steps: [
      { line: 0, note: "A dictionary with two keys. Each value is a list of two readings.", set: { logs: "{'T1': [4, 6], 'T2': [7, 9]}" } },
      { line: 1, note: "items() gives the first pair: name = 'T1', data = [4, 6].", set: { name: "'T1'", data: "[4, 6]" } },
      { line: 2, note: "sum is 10 and len is 2: 10 / 2 → 5.0. The key and the average are displayed.", print: "T1 5.0" },
      { line: 1, note: "The next pair: name = 'T2', data = [7, 9].", set: { name: "'T2'", data: "[7, 9]" } },
      { line: 2, note: "16 / 2 → 8.0. The second key and its average are displayed.", print: "T2 8.0" },
      { line: 1, note: "No pair is left: the loop ends." },
      { line: 3, note: "logs[\"T2\"] is [7, 9]; its index 1 is 9. Result check: (7 + 9) / 2 = 8.0.", print: "9" },
    ],
  };
  const T_seen = {
    code: ["alarms = [2, 5, 2, 6]", "seen = set()", "for sensor in alarms:", "    if sensor in seen:", '        print("Again:", sensor)', "    seen.add(sensor)", "print(seen)"],
    steps: [
      { line: 0, note: "The numbers of the sensors that sent an alarm, in order.", set: { alarms: "[2, 5, 2, 6]" } },
      { line: 1, note: "An empty set: no sensor is recorded yet.", set: { seen: "set()" } },
      { line: 2, note: "sensor takes the first element: 2.", set: { sensor: "2" } },
      { line: 3, note: "2 in seen is False: the set is empty." },
      { line: 5, note: "add(2): 2 becomes an element of the set.", set: { seen: "{2}" } },
      { line: 2, note: "sensor = 5.", set: { sensor: "5" } },
      { line: 3, note: "5 in seen is False." },
      { line: 5, note: "add(5): 5 is added.", set: { seen: "{2, 5}" } },
      { line: 2, note: "sensor = 2.", set: { sensor: "2" } },
      { line: 3, note: "2 in seen is True: sensor 2 sent an alarm before." },
      { line: 4, note: "The repeated sensor is displayed.", print: "Again: 2" },
      { line: 5, note: "add(2): 2 is already an element. The set does not change." },
      { line: 2, note: "sensor = 6.", set: { sensor: "6" } },
      { line: 3, note: "6 in seen is False." },
      { line: 5, note: "add(6): 6 is added.", set: { seen: "{2, 5, 6}" } },
      { line: 2, note: "No element is left: the loop ends." },
      { line: 6, note: "Result check: 4 alarms came from 3 different sensors: 2, 5, and 6.", print: "{2, 5, 6}" },
    ],
  };
  const T_count = {
    code: ['log = "ok fault ok ok"', "counts = {}", "for w in log.split():", "    counts[w] = counts.get(w, 0) + 1", "print(counts)"],
    steps: [
      { line: 0, note: "A status log with four words.", set: { log: "'ok fault ok ok'" } },
      { line: 1, note: "An empty dictionary: no word is counted yet.", set: { counts: "{}" } },
      { line: 2, note: "split() gives 'ok', 'fault', 'ok', 'ok'. w = 'ok'.", set: { w: "'ok'" } },
      { line: 3, note: "'ok' is not a key yet: get gives 0. 0 + 1 → 1.", set: { counts: "{'ok': 1}" } },
      { line: 2, note: "w = 'fault'.", set: { w: "'fault'" } },
      { line: 3, note: "'fault' is a new key: get gives 0. The pair 'fault': 1 is added.", set: { counts: "{'ok': 1, 'fault': 1}" } },
      { line: 2, note: "w = 'ok'.", set: { w: "'ok'" } },
      { line: 3, note: "'ok' is a key: get gives 1. 1 + 1 → 2.", set: { counts: "{'ok': 2, 'fault': 1}" } },
      { line: 2, note: "w = 'ok'.", set: { w: "'ok'" } },
      { line: 3, note: "get gives 2. 2 + 1 → 3.", set: { counts: "{'ok': 3, 'fault': 1}" } },
      { line: 2, note: "No word is left: the loop ends." },
      { line: 4, note: "The frequency table is displayed. Result check: 3 + 1 = 4 words.", print: "{'ok': 3, 'fault': 1}" },
    ],
  };

  /* ---------- trace challenges (generated: edit tools/traces/t06.py, then run "python tools/make-trace.py t06") ---------- */
  // strip() without assignment, find() on the old text, find() gives -1, index -1.
  const C_message = {
    code: ["msg = \" Temp:25C \"", "msg.strip()", "pos = msg.find(\":\")", "msg = msg.strip().lower()", "num = msg[pos:-1]", "low = msg.find(\"T\")", "unit = msg[low]", "print(msg[:pos], num[::-1])", "print(unit, num.isdigit())"],
    steps: [
      { line: 0, set: { msg: "' Temp:25C '" } },
      { line: 1 },
      { line: 2, set: { pos: "5" } },
      { line: 3, set: { msg: "'temp:25c'" } },
      { line: 4, set: { num: "'25'" } },
      { line: 5, set: { low: "-1" } },
      { line: 6, set: { unit: "'c'" } },
      { line: 7, print: "temp: 52" },
      { line: 8, print: "c True" },
    ],
  };

  // A loop over the characters: '.' is not a digit; ch + unit puts the character in front; a chain of methods.
  const C_unit = {
    side: true,
    code: ["num = \"\"", "unit = \"\"", "for ch in \"3.5k\":", "    if ch.isdigit():", "        num = num + ch", "    else:", "        unit = ch + unit", "print(num, unit.upper().find(\"k\"))"],
    steps: [
      { line: 0, set: { num: "''" } },
      { line: 1, set: { unit: "''" } },
      { line: 2, set: { ch: "'3'" } },
      { line: 3, test: "True" },
      { line: 4, set: { num: "'3'" } },
      { line: 2, set: { ch: "'.'" } },
      { line: 3, test: "False" },
      { line: 6, set: { unit: "'.'" } },
      { line: 2, set: { ch: "'5'" } },
      { line: 3, test: "True" },
      { line: 4, set: { num: "'35'" } },
      { line: 2, set: { ch: "'k'" } },
      { line: 3, test: "False" },
      { line: 6, set: { unit: "'k.'" } },
      { line: 2 },
      { line: 7, print: "35 -1" },
    ],
  };

  // insert and remove move the elements; append adds a list as one element; pop returns it.
  const C_levels = {
    code: ["levels = [4, 9, 6]", "levels.insert(1, levels[-1])", "levels.remove(6)", "top = levels.pop(1)", "levels.append([top, 1])", "n = len(levels)", "last = levels.pop()", "levels.extend(last)", "del levels[n - 4]", "print(levels, n)"],
    steps: [
      { line: 0, set: { levels: "[4, 9, 6]" } },
      { line: 1, set: { levels: "[4, 6, 9, 6]" } },
      { line: 2, set: { levels: "[4, 9, 6]" } },
      { line: 3, set: { levels: "[4, 6]", top: "9" } },
      { line: 4, set: { levels: "[4, 6, [9, 1]]" } },
      { line: 5, set: { n: "3" } },
      { line: 6, set: { levels: "[4, 6]", last: "[9, 1]" } },
      { line: 7, set: { levels: "[4, 6, 9, 1]" } },
      { line: 8, set: { levels: "[4, 6, 9]" } },
      { line: 9, print: "[4, 6, 9] 3" },
    ],
  };

  // Two names for one list, a slice is a copy, sort() returns None, a new list for an old name.
  const C_names = {
    code: ["data = [7, 3]", "view = data", "saved = data[:]", "view.append(5)", "saved.insert(0, data[-1])", "res = view.sort()", "view = view[1:]", "view[0] = saved[0] * 2", "data.reverse()", "print(data[0], view[0])", "print(res)"],
    steps: [
      { line: 0, set: { data: "[7, 3]" } },
      { line: 1, set: { view: "[7, 3]" } },
      { line: 2, set: { saved: "[7, 3]" } },
      { line: 3, set: { data: "[7, 3, 5]", view: "[7, 3, 5]" } },
      { line: 4, set: { saved: "[5, 7, 3]" } },
      { line: 5, set: { data: "[3, 5, 7]", view: "[3, 5, 7]", res: "None" } },
      { line: 6, set: { view: "[5, 7]" } },
      { line: 7, set: { view: "[10, 7]" } },
      { line: 8, set: { data: "[7, 5, 3]" } },
      { line: 9, print: "7 10" },
      { line: 10, print: "None" },
    ],
  };

  // Packing, unpacking, a list made from a tuple is a copy, (x) is not a tuple, a slice of a tuple.
  const C_limits = {
    code: ["lim = 2, 8", "low, high = lim", "low, high = high - low, low", "vals = list(lim)", "vals[0] = low", "one = (vals[1])", "lim = lim[:1]", "print(lim, one, high in lim)"],
    steps: [
      { line: 0, set: { lim: "(2, 8)" } },
      { line: 1, set: { low: "2", high: "8" } },
      { line: 2, set: { low: "6", high: "2" } },
      { line: 3, set: { vals: "[2, 8]" } },
      { line: 4, set: { vals: "[6, 8]" } },
      { line: 5, set: { one: "8" } },
      { line: 6, set: { lim: "(2,)" } },
      { line: 7, print: "(2,) 8 True" },
    ],
  };

  // get() adds no key, an existing key keeps its place, in tests the keys, pop() and popitem().
  const C_stock = {
    code: ["stock = {\"R\": 5, \"C\": 2}", "n = stock.get(\"L\", 9)", "stock[\"C\"] = stock[\"R\"] + n", "stock[\"L\"] = stock.pop(\"R\")", "found = 5 in stock", "key, n = stock.popitem()", "stock[key] = len(stock)", "print(stock[\"L\"], n, found)"],
    steps: [
      { line: 0, set: { stock: "{'R': 5, 'C': 2}" } },
      { line: 1, set: { n: "9" } },
      { line: 2, set: { stock: "{'R': 5, 'C': 14}" } },
      { line: 3, set: { stock: "{'C': 14, 'L': 5}" } },
      { line: 4, set: { found: "False" } },
      { line: 5, set: { stock: "{'C': 14}", n: "5", key: "'L'" } },
      { line: 6, set: { stock: "{'C': 14, 'L': 1}" } },
      { line: 7, print: "1 5 False" },
    ],
  };

  // A set stores a value once, an operator returns a new set, discard() of a missing element, set().
  const C_pins = {
    code: ["pins = [3, 5, 3, 1]", "used = set(pins)", "free = {2, 3, 4} - used", "used | free", "free.add(len(used))", "used.discard(4)", "both = used & free", "used = used - both", "both = used & free", "print(len(used), both)"],
    steps: [
      { line: 0, set: { pins: "[3, 5, 3, 1]" } },
      { line: 1, set: { used: "{1, 3, 5}" } },
      { line: 2, set: { free: "{2, 4}" } },
      { line: 3 },
      { line: 4, set: { free: "{2, 3, 4}" } },
      { line: 5 },
      { line: 6, set: { both: "{3}" } },
      { line: 7, set: { used: "{1, 5}" } },
      { line: 8, set: { both: "set()" } },
      { line: 9, print: "2 set()" },
    ],
  };

  // Missing lines 3 and 4: counting with get(). A new key starts at 0, and an existing key keeps its place.
  const C_bins = {
    side: true,
    missing: [2, 3],
    code: ["bins = {}", "for t in [24, 9, 27]:", "    b = t // 10", "    bins[b] = bins.get(b, 0) + 1", "print(bins)"],
    steps: [
      { line: 0, set: { bins: "{}" } },
      { line: 1, set: { t: "24" } },
      { line: 2, set: { b: "2" } },
      { line: 3, set: { bins: "{2: 1}" } },
      { line: 1, set: { t: "9" } },
      { line: 2, set: { b: "0" } },
      { line: 3, set: { bins: "{2: 1, 0: 1}" } },
      { line: 1, set: { t: "27" } },
      { line: 2, set: { b: "2" } },
      { line: 3, set: { bins: "{2: 2, 0: 1}" } },
      { line: 1 },
      { line: 4, print: "{2: 2, 0: 1}" },
    ],
  };
  /* ---------- end of the generated traces ---------- */

  // side: the program is beside the table, and a blank row does not show which line runs
  // given: the number of rows that are complete (default 1)
  const CH = (trace, given) => W("traceTable", { trace, blank: true, given: given || 1, showCode: !!trace.side, hideLines: !!trace.side });

  App.registerTopic({
    id: "t06",
    title: "Strings, Lists and Dictionaries",
    short: "Strings, Lists & Dicts",
    blurb: "More string operations, lists and their methods, tuples, dictionaries, and sets.",
    intro: "This chapter covers the data structures that store and process many values: strings, lists, tuples, dictionaries, and sets. Each lesson uses only what the lessons before it have explained:<br>strings → lists → list methods → tuples → dictionaries → sets → trace challenges → practice.",
    lessons: [
      /* =============================== 1. STRINGS =============================== */
      {
        id: "strings",
        title: "Strings: more operations",
        sub: "Multi-line strings, slicing in both directions, and methods for processing text.",
        slides: "06:4–12",
        keywords: "string triple quotes slicing reverse strip find count startswith endswith isdigit case-sensitive chaining loop vowels",
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
              ["<code>s[::-2]</code>", "<code>'nhy'</code>", "backward from the last character, every second character"],
              ["<code>s[-3:-1]</code>", "<code>'ho'</code>", "negative indexes count from the end"],
              ["<code>s[0:10]</code>", "<code>'Python'</code>", "an end beyond the string is not an error"],
              ["<code>s[4:1]</code>", "<code>''</code>", "start after end (step 1): an empty string"],
            ]),
            T("A missing start or end: with a positive step, the slice runs from the first character to the last. With a negative step, it runs from the last character to the first."),
          ] },
          { kind: "code", part: "Slicing in both directions", title: "Example: the bits of a byte", blocks: [
            EX('bits = "10110010"\nhigh = bits[:4]\nlow = bits[-4:]\nprint(high, low)\nprint(bits[::-1])', "the two halves of a byte", [
              { c: "bits[:4]", e: "From the start up to index 4: <code>1011</code>" },
              { c: "bits[-4:]", e: "The last 4 characters: <code>0010</code>" },
              { c: "bits[::-1]", e: "Step -1 reverses the string: <code>01001101</code>" },
            ]),
          ] },
          { kind: "concept", part: "strip() and find()", title: "strip() and find()", blocks: [
            TB(["Method", "Result", "Example"], [
              ["<code>s.strip()</code>", "a copy without spaces at the start and the end", "<code>\"  hi  \".strip()</code> → <code>'hi'</code>"],
              ["<code>s.find(x)</code>", "the index of the first match of x", "<code>\"sensor\".find(\"n\")</code> → <code>2</code>"],
              ["<code>s.find(x)</code>", "<code>-1</code> when x is not found", "<code>\"sensor\".find(\"x\")</code> → <code>-1</code>"],
            ]),
            T("<code>lstrip()</code> and <code>rstrip()</code> remove spaces only at the start or only at the end."),
            T("<code>find()</code> is case-sensitive: <code>\"Sensor\".find(\"s\")</code> → <code>3</code>, because <code>\"S\"</code> and <code>\"s\"</code> are different characters."),
          ] },
          { kind: "code", part: "strip() and find()", title: "Example: cleaning a sensor message", blocks: [
            EX('msg = "  TEMP=25  "\nclean = msg.strip()\npos = clean.find("=")\nprint(clean, pos)\nprint(clean[pos + 1:])\nprint(clean.find("#"))', "strip, find, then slice", [
              { c: "msg.strip()", e: "<code>TEMP=25</code>: the spaces are removed" },
              { c: "clean[pos + 1:]", e: "\"=\" is at index 4; the value starts after it: <code>25</code>" },
              { c: 'find("#")', e: "Not found: <code>-1</code>. Check <code>pos != -1</code> first: with -1, the slice gives the whole string." },
            ]),
          ] },
          { kind: "concept", part: "count() and checking methods", title: "count() and checking methods", blocks: [
            TB(["Method", "Result"], [
              ["<code>s.count(x)</code>", "the number of times x appears"],
              ["<code>s.startswith(x)</code>", "True if s starts with x"],
              ["<code>s.endswith(x)</code>", "True if s ends with x"],
              ["<code>s.isdigit()</code>", "True if s is not empty and contains only digits"],
            ]),
            T("String methods return new values. The original string does not change. Methods can be chained: in <code>msg.strip().upper()</code>, <code>upper()</code> is applied to the result of <code>strip()</code>."),
            T("<code>in</code>, <code>==</code>, <code>count()</code>, <code>startswith()</code>, and <code>endswith()</code> are case-sensitive: <code>\"pump\" in \"PUMP-2026\"</code> is <code>False</code>. Apply <code>lower()</code> first to ignore the case."),
          ] },
          { kind: "code", part: "count() and checking methods", title: "Example: checking a device code", blocks: [
            EX('code = "PUMP-2026-07"\nprint(code.count("-"))\nprint(code.startswith("PUMP"))\nprint(code.endswith("08"))\nyear = code[5:9]\nprint(year, year.isdigit())', "counting and checking", [
              { c: 'count("-")', e: "Two separators: <code>2</code>" },
              { c: "startswith, endswith", e: "<code>True</code>, <code>False</code>" },
              { c: "year.isdigit()", e: "<code>code[5:9]</code> is '2026', only digits: <code>2026 True</code>" },
            ]),
          ] },
          { kind: "concept", part: "Processing a string with a loop", title: "A loop over the characters", blocks: [
            L([
              "<code>for ch in s:</code> visits each character (Topic 03).",
              "To build a new string, start with <code>\"\"</code> and add characters with <code>+</code>.",
              "To count characters with a property, use a counter and an if.",
            ]),
          ] },
          { kind: "code", part: "Processing a string with a loop", title: "First example: execution step by step", blocks: [W("codeTrace", T_build)] },
          { kind: "code", part: "Processing a string with a loop", title: "Example: counting vowels", blocks: [
            EX('text = "Engineering"\ncount = 0\nfor ch in text.lower():\n    if ch in "aeiou":\n        count = count + 1\nprint(count)', "a counter with a condition", [
              { c: "text.lower()", e: "<code>'engineering'</code>: E and e are counted the same." },
              { c: 'ch in "aeiou"', e: "True for any vowel. <code>count()</code> finds one text only, so \"any vowel\" needs a loop." },
              { c: "print(count)", e: "<code>5</code>: e, i, e, e, i" },
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
          { kind: "exercise", title: "Determine the output: slicing", answerCol: 0, cols: [
            [T("Write the output of each <code>print()</code> statement on paper.")],
            [RUN('s = "Programming"\nprint(s[::-1])\nprint(s[-4:])\nprint(s[2:100])\nprint(s[::3])')],
          ], answer: [OUT("gnimmargorP\nming\nogramming\nPgmn")] },
          { kind: "exercise", title: "Determine the output: methods", answerCol: 0, cols: [
            [T("Write the output of each <code>print()</code> statement on paper.")],
            [RUN('s = "  a-b-c  "\nprint(s.strip())\nprint(s.find("b"))\nprint(s.find("z"))\nprint(s.count("-"))')],
          ], answer: [OUT("a-b-c\n4\n-1\n2")] },
          { kind: "exercise", title: "Write a program: find a character", blocks: [
            PQ("Write a program that reads an e-mail address and displays the index of \"@\".<br>1. Use the prompt <code>E-mail: </code>.<br>2. When the address has no \"@\", display <code>not found</code>.<br>Test input: user.name@kmutnb.ac.th.",
              "E-mail: user.name@kmutnb.ac.th\n9", "# Write your program here\n", ["user.name@kmutnb.ac.th"], "Store email.find(\"@\") in pos: find() returns -1 when the address has no \"@\"."),
          ] },
          { kind: "exercise", title: "Write a program: count digits", blocks: [
            PQ("Write a program that counts the digits in the string <code>\"A1B22C\"</code>.<br>1. Use a loop over the characters of <code>code</code>.<br>2. Use <code>isdigit()</code> to check each character.<br>3. Display the count.",
              "3", 'code = "A1B22C"\n# Write the loop here\n', null, "if ch.isdigit(): count = count + 1"),
          ] },
          { kind: "exercise", title: "Write a program: clean a message", blocks: [
            PQ("Write a program that displays the target output from the string <code>msg</code>.<br>1. Remove the spaces at the start and at the end of <code>msg</code>.<br>2. Change the letters to capital letters.<br>3. Display the result.",
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
        sub: "Creating lists, indexing, slicing, changing elements, copies, loops, and sum, max and min.",
        slides: "06:14–16, 21",
        keywords: "list element index slice mutable alias copy same list len in loop range sum max min average",
        deck: [
          { kind: "overview", title: "Lists", blocks: [
            T("A <b>list</b> stores several values in one variable, in order. The values are called <b>elements</b>."),
            L(["Creating a list", "Indexing and slicing", "Changing an element", "Two names for one list", "Looping over a list", "sum(), max(), min(), and averages"], "Subtopics in this lesson", true),
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
          { kind: "code", part: "Indexing and slicing", title: "Example: first, last, and slices", blocks: [
            EX("temps = [18.5, 21.0, 23.5, 22.0, 19.5]\nprint(temps[0], temps[-1])\nprint(temps[1:3])\nprint(temps[-2:])", "indexes and slices of a list", [
              { c: "temps[0], temps[-1]", e: "The first and the last element: <code>18.5 19.5</code>" },
              { c: "temps[1:3]", e: "A new list with the elements 1 and 2: <code>[21.0, 23.5]</code>" },
              { c: "temps[-2:]", e: "The last two elements: <code>[22.0, 19.5]</code>" },
            ]),
          ] },
          { kind: "concept", part: "Changing an element", title: "Lists are mutable", blocks: [
            L([
              "An element can be replaced: <code>readings[1] = 25</code>.",
              "A list is <b>mutable</b>; a string is immutable (Topic 02).",
              "The length stays the same when an element is replaced.",
              "Assignment cannot add an element: <code>readings[len(readings)] = 30</code> causes <code>IndexError: list assignment index out of range</code>. <code>append()</code> adds an element (next lesson).",
            ]),
          ] },
          { kind: "code", part: "Changing an element", title: "Example: replacing a reading", blocks: [
            EX("readings = [20, 22, 21]\nreadings[1] = 25\nprint(readings)\nprint(len(readings))", "assignment to an index", [
              { c: "readings[1] = 25", e: "The second element becomes 25: <code>[20, 25, 21]</code>" },
              { c: "len(readings)", e: "Still <code>3</code>" },
            ]),
          ] },
          { kind: "concept", part: "Two names for one list", title: "Two names for one list", blocks: [
            L([
              "Assignment does not copy a list. After <code>b = a</code>, a and b are two names for the <b>same</b> list.",
              "A change made through one name is seen through the other: <code>b[0] = 25</code> also changes <code>a[0]</code>.",
              "<code>c = list(a)</code> creates a new list with the same elements: a <b>copy</b>. A change to c does not change a.",
              "A list passed to a function (Topic 05) is not copied either: the parameter is a second name for the list of the caller, so the function can change that list.",
            ]),
          ] },
          { kind: "code", part: "Two names for one list", title: "First example: execution step by step", blocks: [W("codeTrace", T_alias)] },
          { kind: "concept", part: "Looping over a list", title: "Looping over a list", blocks: [
            L([
              "<code>for r in readings:</code> visits each element.",
              "<code>for i in range(len(readings)):</code> visits each index; <code>readings[i]</code> is the element.",
              "<code>x in readings</code> is True when x is an element.",
            ]),
          ] },
          { kind: "code", part: "Looping over a list", title: "First example: execution step by step", blocks: [W("codeTrace", T_loop)] },
          { kind: "code", part: "Looping over a list", title: "Example: changing elements by index", blocks: [
            EX("readings = [20, 22, 21]\nfor r in readings:\n    r = r * 2\nprint(readings)\nfor i in range(len(readings)):\n    readings[i] = readings[i] * 2\nprint(readings)", "the loop variable or the index", [
              { c: "r = r * 2", e: "r takes the value of each element. A new value for r does not change the list: <code>[20, 22, 21]</code>" },
              { c: "range(len(readings))", e: "i takes the indexes 0, 1, and 2." },
              { c: "readings[i] = readings[i] * 2", e: "Assignment to an index changes the element: <code>[40, 44, 42]</code>" },
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
            EX("grades = [85, 90, 78, 92]\nprint(max(grades), min(grades))\nprint(sum(grades) / len(grades))", "the highest, the lowest, and the average", [
              { c: "max, min", e: "<code>92 78</code>" },
              { c: "sum / len", e: "345 / 4 → <code>86.25</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A list stores ordered elements: <code>[20, 22, 21]</code>.",
              "Indexing and slicing work as for strings; a slice is a new list.",
              "Lists are mutable: <code>readings[1] = 25</code>. <code>b = a</code> is a second name for the same list; <code>list(a)</code> is a copy.",
              "<code>for x in list</code> visits the elements; <code>in</code> checks membership.",
              "<code>sum()</code>, <code>max()</code>, <code>min()</code>, and <code>sum() / len()</code> summarize numbers.",
            ]),
            NEXT("<b>List methods</b>. Methods add, remove, and reorder the elements of a list."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Write the output of each <code>print()</code> statement on paper.")],
            [RUN("nums = [10, 20, 30, 40, 50]\nprint(nums[1])\nprint(nums[-2])\nprint(nums[1:3])\nprint(nums[::2])")],
          ], answer: [OUT("20\n40\n[20, 30]\n[10, 30, 50]")] },
          { kind: "exercise", title: "Complete the code", blocks: [
            PQ("Complete line 2, so that the program displays the average of the readings.",
              "21.5", "readings = [20, 22, 21, 23]\naverage = \nprint(average)\n", null, "average = sum(readings) / len(readings)"),
          ] },
          { kind: "exercise", title: "Write a program: count values", blocks: [
            PQ("Write a program that counts the readings above 25 in the list <code>readings</code>.<br>1. Use a loop over the elements of the list.<br>2. Display the count.",
              "3", "readings = [24, 26, 25, 30, 28, 22]\n# Write the loop here\n", null, "if r > 25: count = count + 1"),
          ] },
          { kind: "exercise", title: "Write a program: the largest without max()", blocks: [
            PQ("Write a program that finds the largest reading in the list <code>readings</code>.<br>1. Use a loop over the elements of the list.<br>2. Do not use <code>max()</code>.<br>3. Display the largest reading.",
              "31", "readings = [24, 31, 25, 30]\n# Write the loop here\n", null, "Start with largest = readings[0]; in the loop, write if r > largest: largest = r."),
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
            T("List methods change a list <b>in place</b>: the same list is changed, and no new list is created. They add, remove, and reorder its elements. The last subtopic uses two string methods, <code>split()</code> and <code>join()</code>, which return new values instead."),
            L(["append() and insert()", "extend() and append()", "remove(), pop(), and del", "sort() and reverse()", "String methods and list methods", "Strings and lists: split() and join()"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "append() and insert()", title: "Adding one element", blocks: [
            TB(["Method", "Effect", "nums = [10, 20, 30]"], [
              ["<code>nums.append(x)</code>", "adds x at the end", "<code>nums.append(40)</code> → <code>[10, 20, 30, 40]</code>"],
              ["<code>nums.insert(i, x)</code>", "inserts x at index i; later elements move right", "<code>nums.insert(1, 99)</code> → <code>[10, 99, 20, 30]</code>"],
            ]),
          ] },
          { kind: "visual", part: "append() and insert()", title: "append and insert, step by step", blocks: [
            W("boxTrain", { title: "temps", name: "temps", code: ["temps = [21, 23]", "temps.append(25)", "temps.insert(0, 20)", "temps.insert(2, 22)"], steps: [
              { items: [21, 23], line: 0, enter: [0, 1], caption: "Two elements. len(temps) is 2." },
              { items: [21, 23, 25], line: 1, enter: [2], caption: "append(25): 25 is added at the end. len(temps) is 3." },
              { items: [20, 21, 23, 25], line: 2, enter: [0], caption: "insert(0, 20): 20 goes to index 0; 21, 23, 25 move right. len(temps) is 4." },
              { items: [20, 21, 22, 23, 25], line: 3, enter: [2], caption: "insert(2, 22): 22 goes to index 2; 23 and 25 move right. The list stays in increasing order. len(temps) is 5." },
            ] }),
          ] },
          { kind: "concept", part: "extend() and append()", title: "extend() adds several elements", blocks: [
            L([
              "<code>a.extend(other)</code> adds each element of the list <code>other</code> to the end of a.",
              "<code>a.append(other)</code> adds the whole list <code>other</code> as <b>one</b> element.",
              "After extend, <code>len(a)</code> grows by <code>len(other)</code>. After append, it grows by 1.",
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
              ["<code>del a[i]</code>", "removes the element at index i. <code>del</code> is a statement, not a method: it gives no value"],
            ]),
          ] },
          { kind: "code", part: "remove(), pop(), and del", title: "First example: execution step by step", blocks: [W("codeTrace", T_pop)] },
          { kind: "code", part: "remove(), pop(), and del", title: "Example: remove takes the first match", blocks: [
            EX("values = [3, 1, 3, 2]\nvalues.remove(3)\nprint(values)\nfirst = values.pop(0)\nprint(first, values)\ndel values[0]\nprint(values)", "remove, pop(0), then del", [
              { c: "values.remove(3)", e: "Only the first 3 is removed: <code>[1, 3, 2]</code>" },
              { c: "first = values.pop(0)", e: "The element at index 0 is removed and returned. The other elements move left: <code>1 [3, 2]</code>" },
              { c: "del values[0]", e: "The element at index 0 is removed, and no value is returned: <code>[2]</code>" },
            ]),
          ] },
          { kind: "code", part: "remove(), pop(), and del", title: "Example: removing inside a loop", blocks: [
            EX("v = [30, 31, 32, 20]\nfor x in v:\n    if x > 29:\n        v.remove(x)\nprint(v)\nkeep = []\nfor x in [30, 31, 32, 20]:\n    if x <= 29:\n        keep.append(x)\nprint(keep)", "a for loop must not remove elements from its own list", [
              { c: "v.remove(x)", e: "30 is removed, and the other elements move left. The loop continues at index 1, which is now 32: 31 is skipped. <code>[31, 20]</code>" },
              { c: "keep.append(x)", e: "Correct: build a new list from the elements to keep. <code>[20]</code>" },
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
          { kind: "concept", part: "String methods and list methods", title: "String methods and list methods", blocks: [
            TB(["Feature", "String method", "List method"], [
              ["The original", "does not change (a string is immutable)", "is changed in place, for every name of the list"],
              ["The method returns", "a new string", "<code>None</code>"],
              ["Correct", "<code>s = s.upper()</code>", "<code>a.sort()</code>"],
              ["Mistake", "<code>s.upper()</code> alone: the new string is lost", "<code>a = a.sort()</code>: a becomes None, and the list is lost"],
            ]),
            T("After <code>a = a.sort()</code>, the statement <code>a.append(5)</code> causes <code>AttributeError: 'NoneType' object has no attribute 'append'</code>."),
            T("<code>pop()</code> changes the list and also returns a value: the element that it removed."),
          ] },
          { kind: "concept", part: "Strings and lists: split() and join()", title: "split() and join()", blocks: [
            TB(["Expression", "Result"], [
              ["<code>\"a b  c\".split()</code>", "<code>['a', 'b', 'c']</code>: split at spaces"],
              ["<code>\"2025-10-15\".split(\"-\")</code>", "<code>['2025', '10', '15']</code>: split at each -"],
              ["<code>\"/\".join(['2025', '10', '15'])</code>", "<code>'2025/10/15'</code>: join with / between"],
            ]),
            T("<code>split()</code> returns a list of strings. <code>join()</code> needs a list of strings."),
          ] },
          { kind: "code", part: "Strings and lists: split() and join()", title: "Example: a line of sensor data", blocks: [
            EX('line = "12.5,0.8"\nparts = line.split(",")\nprint(parts)\nvoltage = float(parts[0])\ncurrent = float(parts[1])\nprint(voltage * current)\nprint(";".join(parts))', "split, convert, join", [
              { c: 'line.split(",")', e: "A list of two <b>strings</b>: <code>['12.5', '0.8']</code>" },
              { c: "float(parts[0])", e: "Each string is converted before the calculation: 12.5 * 0.8 → <code>10.0</code>" },
              { c: '";".join(parts)', e: "The strings joined with ; between: <code>12.5;0.8</code>" },
            ]),
          ] },
          { kind: "code", part: "Strings and lists: split() and join()", title: "Example: several numbers on one line", blocks: [
            EX('parts = input("Readings: ").split()\nvalues = []\nfor p in parts:\n    values.append(float(p))\nprint(values)\nprint(sum(values))', "one input line, several values", [
              { c: "input(...).split()", e: "The line <code>20.5 22 21.5</code> becomes three strings: <code>['20.5', '22', '21.5']</code>" },
              { c: "float(p)", e: "Each string becomes a float: <code>[20.5, 22.0, 21.5]</code>, sum <code>64.0</code>" },
            ], ["20.5 22 21.5"]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>append(x)</code> adds one element; <code>insert(i, x)</code> inserts at an index; <code>extend(list)</code> adds each element of a list.",
              "<code>remove(x)</code> removes the first match; <code>pop()</code> removes and returns; <code>del a[i]</code> removes by index.",
              "A for loop must not remove elements from its own list: build a new list.",
              "List methods change the list and return None: <code>a.sort()</code>. String methods return a new string: <code>s = s.upper()</code>.",
              "<code>split()</code> turns a string into a list of strings; <code>join()</code> turns a list of strings into a string.",
            ]),
            NEXT("<b>Tuples</b>. A tuple stores ordered values like a list, but it cannot be changed."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Write the output of each <code>print()</code> statement on paper.")],
            [RUN("a = [5, 7]\na.append(9)\na.insert(0, 1)\nprint(a)\nx = a.pop()\nprint(x, a)\na.remove(7)\nprint(a)")],
          ], answer: [OUT("[1, 5, 7, 9]\n9 [1, 5, 7]\n[1, 5]")] },
          { kind: "exercise", title: "Write a program: a filtered list", blocks: [
            PQ("Complete the program, so that it displays a list of the readings above 25.<br>1. Line 3 of the program: write a loop over the list <code>readings</code>.<br>2. In the loop, use <code>append()</code> to add each reading above 25 to the list <code>high</code>.",
              "[26, 30, 28]", "readings = [24, 26, 25, 30, 28, 22]\nhigh = []\n# Write the loop here\nprint(high)\n", null, "if r > 25: high.append(r)"),
          ] },
          { kind: "exercise", title: "Write a program: the top three", blocks: [
            PQ("Write a program that displays the three highest scores as a list.<br>1. Sort the list <code>scores</code> in decreasing order.<br>2. Display the first three elements of the sorted list as a list.",
              "[95, 91, 88]", "scores = [72, 95, 88, 64, 91]\n", null, "Write scores.sort(reverse=True), then display the slice scores[:3]."),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program displays <code>None</code>, not the sorted list.<br>Correct line 2, so that the program displays the target output.",
              "[1, 2, 3]", "data = [3, 1, 2]\ndata = data.sort()\nprint(data)\n", null, "sort() changes the list and returns None: write data.sort()."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`a = [1, 2]`, then `a.append([3, 4])`. What is `len(a)`?", choices: ["2", "3", "4", "an error"], answer: 1, explain: "append adds the list [3, 4] as one element." },
            { q: "`v = [3, 1, 3]`, then `v.remove(3)`. What is v?", choices: ["[1, 3]", "[3, 1]", "[1]", "[3, 1, 3]"], answer: 0, explain: "remove deletes only the first 3." },
          ])] },
        ],
      },

      /* =============================== 4. TUPLES =============================== */
      {
        id: "tuples",
        title: "Tuples",
        sub: "Creating tuples, indexing, immutability, packing and unpacking, returning several values, and tuples or lists.",
        keywords: "tuple parentheses one element comma immutable typeerror packing unpacking multiple assignment swap return several values list of tuples tuple vs list",
        deck: [
          { kind: "overview", title: "Tuples", blocks: [
            T("A <b>tuple</b> stores several values in order, like a list. Unlike a list, a tuple cannot be changed after it is created."),
            L(["Creating a tuple", "Tuples cannot be changed", "Packing and unpacking", "Returning several values", "Tuples or lists"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Creating a tuple", title: "Creating a tuple", blocks: [
            L([
              "Parentheses, with the elements separated by commas: <code>point = (3, 4)</code>.",
              "A tuple is ordered and can hold different types: <code>(\"R1\", 220, 0.25)</code>.",
              "<code>()</code> is an empty tuple. <code>len(point)</code> is the number of elements: 2.",
              "A tuple with one element needs a comma: <code>(5,)</code>. Without the comma, <code>(5)</code> is the integer 5.",
              "Indexing, slicing, <code>in</code>, and a for loop work as for lists: <code>point[0]</code> is 3, and a slice of a tuple is a new tuple.",
            ]),
          ] },
          { kind: "code", part: "Creating a tuple", title: "Example: the comma makes a tuple", blocks: [
            EX("point = (3, 4)\nsingle = (5,)\nnumber = (5)\nprint(point, len(point))\nprint(single, type(single))\nprint(number, type(number))", "tuples with two elements and one element", [
              { c: "point = (3, 4)", e: "Two elements: <code>(3, 4) 2</code>" },
              { c: "single = (5,)", e: "The comma makes a tuple: <code>(5,) &lt;class 'tuple'&gt;</code>" },
              { c: "number = (5)", e: "No comma: the integer <code>5 &lt;class 'int'&gt;</code>" },
            ]),
          ] },
          { kind: "concept", part: "Tuples cannot be changed", title: "Tuples are immutable", blocks: [
            L([
              "A tuple is <b>immutable</b>: an element cannot be replaced, added, or removed.",
              "Assignment to an element, such as <code>limits[1] = 120</code>, stops the program: <code>TypeError: 'tuple' object does not support item assignment</code>.",
              "A tuple has no <code>append()</code>, <code>remove()</code>, or <code>sort()</code>.",
              "To change the data, create a new tuple and assign it to the variable: <code>limits = (0, 120)</code>.",
            ]),
          ] },
          { kind: "concept", part: "Packing and unpacking", title: "Packing and unpacking", blocks: [
            L([
              "<b>Packing</b>: values separated by commas form a tuple, also without parentheses: <code>p = 3, 4</code>.",
              "<b>Unpacking</b>: the elements of a tuple are assigned to variables in order: <code>x, y = p</code>.",
              "The number of variables must equal the number of elements; otherwise a ValueError occurs.",
              "Multiple assignment (Topic 02), <code>x, y = 8, 3</code>, is packing followed by unpacking.",
            ]),
          ] },
          { kind: "code", part: "Packing and unpacking", title: "Example: unpacking and swapping", blocks: [
            EX('reading = "T1", 25.4, "C"\nprint(reading)\nname, value, unit = reading\nprint(name, "=", value, unit)\na = 12\nb = 5\na, b = b, a\nprint(a, b)', "one tuple, three variables", [
              { c: 'reading = "T1", 25.4, "C"', e: "Packing: <code>('T1', 25.4, 'C')</code>" },
              { c: "name, value, unit = reading", e: "Unpacking in order: <code>T1 = 25.4 C</code>" },
              { c: "a, b = b, a", e: "The right side is packed first, (5, 12), then unpacked into a and b: <code>5 12</code>. The values are swapped." },
            ]),
          ] },
          { kind: "code", part: "Packing and unpacking", title: "Example: a list of tuples", blocks: [
            EX("points = [(0, 0), (3, 4), (6, 8)]\nfor x, y in points:\n    dist = (x ** 2 + y ** 2) ** 0.5\n    print(x, y, dist)", "points (x, y) and their distance from (0, 0)", [
              { c: "for x, y in points", e: "Each element is a tuple. It is unpacked into x and y in every iteration." },
              { c: "dist = (x ** 2 + y ** 2) ** 0.5", e: "√(x² + y²): <code>0.0</code>, <code>5.0</code>, <code>10.0</code>" },
            ]),
          ] },
          { kind: "code", part: "Returning several values", title: "Example: a function returns a tuple", blocks: [
            EX('def low_high(values):\n    return min(values), max(values)\n\nresult = low_high([21, 25, 19, 23])\nprint(result, type(result))\nlow, high = low_high([21, 25, 19, 23])\nprint("Range:", high - low)', "return a, b (Topic 05) returns one tuple", [
              { c: "return min(values), max(values)", e: "Packing: the two values form one tuple." },
              { c: "print(result, type(result))", e: "The call gives one value, a tuple: <code>(19, 25) &lt;class 'tuple'&gt;</code>" },
              { c: "low, high = low_high(...)", e: "The returned tuple is unpacked into two variables: <code>Range: 6</code>" },
            ]),
          ] },
          { kind: "concept", part: "Tuples or lists", title: "Tuples or lists", blocks: [
            TB(["Feature", "List", "Tuple"], [
              ["Written as", "<code>[20, 22, 21]</code>", "<code>(20, 22, 21)</code>"],
              ["Elements can change", "yes: mutable", "no: immutable"],
              ["Methods that change it", "<code>append()</code>, <code>remove()</code>, <code>sort()</code>, …", "none"],
              ["Use for", "values that are collected or changed, such as a series of readings", "a fixed group of values, such as a point (x, y) or an RGB color"],
            ]),
            T("<code>tuple(a_list)</code> and <code>list(a_tuple)</code> convert between the two: <code>tuple([21.5, 22.0])</code> is <code>(21.5, 22.0)</code>."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A tuple stores ordered elements: <code>(3, 4)</code>. One element needs a comma: <code>(5,)</code>.",
              "Indexing, slicing, <code>len()</code>, <code>in</code>, and for loops work as for lists.",
              "A tuple is immutable: <code>t[0] = x</code> causes a TypeError.",
              "Packing: <code>p = 3, 4</code>. Unpacking: <code>x, y = p</code>. <code>return a, b</code> returns a tuple.",
              "A list holds data that changes; a tuple holds a fixed group of values.",
            ]),
            NEXT("<b>Dictionaries</b>. Values stored under names (keys) instead of positions."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Write the output of each <code>print()</code> statement on paper.")],
            [RUN("point = (4, 7, 2)\nprint(point[1], point[-1])\nprint(point[:2])\nprint(len(point), 7 in point)\nx, y, z = point\nprint(x + y + z)\nsingle = (9,)\nprint(single, len(single))")],
          ], answer: [OUT("7 2\n(4, 7)\n3 True\n13\n(9,) 1")] },
          { kind: "exercise", title: "Complete the code: swap two values", blocks: [
            PQ("Complete line 3, so that the values of first and second are swapped in one statement.",
              "fan pump", 'first = "pump"\nsecond = "fan"\nfirst, second = \nprint(first, second)\n', null, "first, second = second, first"),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program stops with a TypeError in line 2.<br>Correct line 2, so that the program displays the target output.<br>1. Assign a new tuple to <code>limits</code>.<br>2. The upper limit in the new tuple is 120.",
              "(0, 120)", "limits = (0, 100)\nlimits[1] = 120\nprint(limits)\n", null, "A tuple cannot be changed, so create a new tuple: limits = (limits[0], 120)."),
          ] },
          { kind: "exercise", title: "Write a program: a list of tuples", blocks: [
            PQ("Each tuple holds a resistor name and its resistance in ohms.<br>1. Display the name and the resistance of each resistor above 1000 ohms.<br>2. Then display <code>Total:</code> and the total resistance of all the resistors.",
              "R2 4700\nR3 10000\nTotal: 14920", 'resistors = [("R1", 220), ("R2", 4700), ("R3", 10000)]\n# Write your program here\n', null, "Use for name, ohms in resistors: in the loop, display the pair when ohms > 1000, and add ohms to a total."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`t = (5)`. What is the type of t?", choices: ["tuple", "int", "list", "str"], answer: 1, explain: "Without a comma, (5) is the integer 5. A tuple with one element is written (5,)." },
            { q: "`t = (1, 2, 3)`. What does `t[0] = 9` do?", choices: ["t becomes (9, 2, 3)", "it raises a TypeError", "it adds 9 to t", "t becomes (9,)"], answer: 1, explain: "A tuple is immutable: its elements cannot be replaced." },
          ])] },
        ],
      },

      /* =============================== 5. DICTIONARIES =============================== */
      {
        id: "dictionaries",
        title: "Dictionaries",
        sub: "Key-value pairs: reading, changing, removing, looping, counting, and nested data.",
        slides: "06:23–34",
        keywords: "dictionary key value get keyerror del pop popitem keys values items count frequency nested dictionary of lists list of dictionaries list vs dictionary kwargs keyword arguments",
        deck: [
          { kind: "overview", title: "Dictionaries", blocks: [
            T("A <b>dictionary</b> stores <b>key-value pairs</b>. A value is found by its key, not by a position."),
            L(["Creating a dictionary", "Reading values: [] and get()", "Adding, changing, and removing pairs", "Looping over a dictionary", "Counting with a dictionary", "Dictionaries and lists together", "Lists or dictionaries", "Keyword arguments: **kwargs"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Creating a dictionary", title: "Creating a dictionary", blocks: [
            L([
              "Curly braces with <code>key: value</code> pairs: <code>device = {\"name\": \"Pump\", \"voltage\": 220}</code>.",
              "Each key is unique. Values may repeat. <code>{}</code> is an empty dictionary.",
              "A key must be immutable: a string, a number, or a tuple. A list cannot be a key: <code>TypeError: unhashable type: 'list'</code>.",
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
          { kind: "code", part: "Reading values: [] and get()", title: "Example: reading settings", blocks: [
            EX('config = {"mode": "auto", "speed": 3}\nprint(config["speed"])\nprint(config.get("limit", 100))\nprint(config.get("mode", "manual"))', "[] and get() with a default", [
              { c: 'config["speed"]', e: "The value of the key speed: <code>3</code>" },
              { c: 'get("limit", 100)', e: "The key limit is missing: the default <code>100</code>" },
              { c: 'get("mode", "manual")', e: "The key mode exists: its value <code>auto</code>; the default is not used" },
            ]),
          ] },
          { kind: "concept", part: "Adding, changing, and removing pairs", title: "Changing a dictionary", blocks: [
            TB(["Statement", "Effect"], [
              ["<code>d[key] = value</code>", "changes the value of an existing key, or adds a new pair"],
              ["<code>del d[key]</code>", "removes the pair"],
              ["<code>d.pop(key)</code>", "removes the pair and returns its value"],
              ["<code>key, value = d.popitem()</code>", "removes the pair added last and returns it as a tuple (key, value)"],
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
            EX('d = {"name": "Pump", "voltage": 220}\nd["phase"] = 3\nv = d.pop("voltage")\nprint(v, d)\nkey, value = d.popitem()\nprint(key, value, d)', "removing and returning", [
              { c: 'd.pop("voltage")', e: "Returns 220: <code>220 {'name': 'Pump', 'phase': 3}</code>" },
              { c: "key, value = d.popitem()", e: "The last pair added: <code>phase 3 {'name': 'Pump'}</code>" },
            ]),
          ] },
          { kind: "concept", part: "Looping over a dictionary", title: "Looping over keys, values, and pairs", blocks: [
            TB(["Loop", "The loop variable takes"], [
              ["<code>for key in d:</code>", "each key (the same as <code>d.keys()</code>)"],
              ["<code>for value in d.values():</code>", "each value"],
              ["<code>for key, value in d.items():</code>", "each pair as a tuple (key, value), unpacked into two variables"],
            ]),
          ] },
          { kind: "code", part: "Looping over a dictionary", title: "Example: keys and values", blocks: [
            EX('power = {"pump": 750, "fan": 60}\nfor name in power:\n    print(name)\ntotal = 0\nfor p in power.values():\n    total = total + p\nprint(total, "W")', "keys, then values", [
              { c: "for name in power", e: "The keys: pump, fan" },
              { c: "power.values()", e: "750 + 60 → <code>810 W</code>, the total power" },
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
              "A value that appears for the first time is not a key yet: the statement must also work for a new key.",
            ]),
            TB(["Statement", "Result when w is a new key"], [
              ["<code>counts[w] = counts[w] + 1</code>", "<code>KeyError: 'ok'</code>: <code>counts[w]</code> cannot be read"],
              ["<code>counts[w] = counts.get(w) + 1</code>", "get gives None: <code>TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'</code>"],
              ["<code>counts[w] = counts.get(w, 0) + 1</code>", "get gives 0: 0 + 1 → 1, and the pair <code>'ok': 1</code> is added"],
            ], "<code>counts = {}</code> and <code>w = \"ok\"</code>"),
          ] },
          { kind: "code", part: "Counting with a dictionary", title: "First example: execution step by step", blocks: [W("codeTrace", T_count)] },
          { kind: "code", part: "Counting with a dictionary", title: "Example: the same count with if and in", blocks: [
            EX('log = "ok fault ok ok"\ncounts = {}\nfor w in log.split():\n    if w in counts:\n        counts[w] = counts[w] + 1\n    else:\n        counts[w] = 1\nprint(counts)', "the long form of get(w, 0) + 1", [
              { c: "if w in counts", e: "True when w is a key already: its count can be read and increased." },
              { c: "counts[w] = 1", e: "A new key: this is its first occurrence." },
              { c: "print(counts)", e: "The same result as with get: <code>{'ok': 3, 'fault': 1}</code>" },
            ]),
          ] },
          { kind: "concept", part: "Dictionaries and lists together", title: "Nested data", blocks: [
            L([
              "A value of a dictionary can be a list: <code>logs = {\"T1\": [4, 6], \"T2\": [7, 9]}</code>.",
              "An element of a list can be a dictionary: <code>devices = [{\"name\": \"pump\", \"power\": 750}, {\"name\": \"fan\", \"power\": 60}]</code>.",
            ]),
            TB(["Expression", "Result"], [
              ["<code>logs[\"T2\"]</code>", "<code>[7, 9]</code>: the value of the key T2, a list"],
              ["<code>logs[\"T2\"][1]</code>", "<code>9</code>: index 1 of that list"],
              ["<code>devices[1]</code>", "<code>{'name': 'fan', 'power': 60}</code>: the second element, a dictionary"],
              ["<code>devices[1][\"power\"]</code>", "<code>60</code>: the value of the key power in that dictionary"],
            ]),
            T("Read the brackets from the outside in: each bracket applies to the result of the one before it."),
          ] },
          { kind: "code", part: "Dictionaries and lists together", title: "First example: execution step by step", blocks: [W("codeTrace", T_nested)] },
          { kind: "code", part: "Dictionaries and lists together", title: "Example: a list of dictionaries", blocks: [
            EX('devices = [\n    {"name": "pump", "power": 750},\n    {"name": "fan", "power": 60},\n    {"name": "heater", "power": 1200},\n]\nbest = devices[0]\nfor d in devices:\n    if d["power"] > best["power"]:\n        best = d\nprint(best["name"], best["power"])', "the device with the largest power", [
              { c: "best = devices[0]", e: "best starts as the first dictionary; a larger power replaces it." },
              { c: "print(...)", e: "<code>heater 1200</code>" },
            ]),
          ] },
          { kind: "concept", part: "Lists or dictionaries", title: "Lists or dictionaries", blocks: [
            TB(["Feature", "List", "Dictionary"], [
              ["Access", "by position: 0, 1, 2, …", "by key: \"name\", \"voltage\", …"],
              ["Duplicates", "allowed", "keys are unique"],
              ["Order", "ordered", "keeps insertion order"],
              ["Use for", "a sequence of values, such as readings", "named values, such as device settings"],
            ]),
          ] },
          { kind: "concept", part: "Keyword arguments: **kwargs", title: "**kwargs is a dictionary", blocks: [
            L([
              "<code>*args</code> (Topic 05) receives any number of positional arguments as a tuple.",
              "<code>**kwargs</code> receives any number of keyword arguments as a dictionary: each keyword is a key (a string), and its argument is the value.",
              "The name after <code>**</code> is free, for example <code>**info</code>. In the body, <code>info</code> is an ordinary dictionary: <code>info[key]</code>, <code>info.items()</code>, <code>len(info)</code>.",
            ]),
          ] },
          { kind: "code", part: "Keyword arguments: **kwargs", title: "Example: **kwargs", blocks: [
            EX('def print_profile(**info):\n    print(info)\n    for key in info:\n        print(key, "=", info[key])\n\nprint_profile(name="Pump", phase=3)', "keyword arguments with any names", [
              { c: "**info", e: "The two keyword arguments of the call form one dictionary: <code>{'name': 'Pump', 'phase': 3}</code>" },
              { c: "for key in info", e: "The loop visits the keys, and <code>info[key]</code> is the value: <code>name = Pump</code>, <code>phase = 3</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A dictionary stores key-value pairs; keys are unique.",
              "<code>d[key]</code> reads a value (KeyError if missing); <code>d.get(key, default)</code> never fails.",
              "<code>d[key] = value</code> adds or changes; <code>del</code>, <code>pop()</code>, <code>popitem()</code> remove.",
              "Loop over keys, <code>values()</code>, or <code>items()</code>. <code>counts[w] = counts.get(w, 0) + 1</code> counts occurrences.",
              "Nested data is read from the outside in: <code>logs[\"T2\"][1]</code>. <code>**kwargs</code> receives keyword arguments as a dictionary.",
            ]),
            NEXT("<b>Sets</b>. A set stores unique values without order, like the keys of a dictionary without their values."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Write the output of each <code>print()</code> statement on paper.")],
            [RUN('d = {"a": 1, "b": 2}\nprint(d.get("a", 0))\nprint(d.get("c", 0))\nprint(d.get("c"))\nd["c"] = 5\nprint(len(d), d.pop("a"))')],
          ], answer: [OUT("1\n0\nNone\n3 1")] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("The program stops with a KeyError in line 2.<br>Correct line 2, so that the program displays the target output.<br>1. Use <code>get()</code> to read the value of the key <code>\"current\"</code>.<br>2. When the key does not exist, the value is 0.",
              "0", 'device = {"name": "Pump", "voltage": 220}\nprint(device["current"])\n', null, 'The key "current" does not exist, so use get() with the default 0: print(device.get("current", 0))'),
          ] },
          { kind: "exercise", title: "Write a program: a lookup with a default", blocks: [
            PQ("Write a program that displays the voltage of a device from the dictionary <code>voltages</code>.<br>1. Read the device name with the prompt <code>Device: </code>.<br>2. When the name is not a key of the dictionary, display 0.<br>Test input: lamp.",
              "Device: lamp\n0", 'voltages = {"pump": 220, "fan": 110}\n', ["lamp"], "print(voltages.get(name, 0))"),
          ] },
          { kind: "exercise", title: "Write a program: count characters", blocks: [
            PQ("Complete the program, so that it displays the count of each character in <code>\"banana\"</code>.<br>1. Line 3 of the program: write a loop over the characters of <code>word</code>.<br>2. In the loop, store the count of each character in the dictionary <code>counts</code>.",
              "{'b': 1, 'a': 3, 'n': 2}", 'word = "banana"\ncounts = {}\n# Write the loop here\nprint(counts)\n', null, "counts[ch] = counts.get(ch, 0) + 1"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: '`d = {"a": 1}`. What is `d.get("b")`?', choices: ["0", "None", "a KeyError", "1"], answer: 1, explain: "get returns None for a missing key when no default is given." },
            { q: '`d = {"a": 1}`. What does `d["b"]` do?', choices: ["returns None", "returns 0", "raises a KeyError", "adds the key b"], answer: 2, explain: "Reading a missing key with [] raises a KeyError." },
          ])] },
        ],
      },

      /* =============================== 6. SETS =============================== */
      {
        id: "sets",
        title: "Sets",
        sub: "Unique elements without order: creating sets, membership, adding and removing, set operations, and removing duplicates.",
        keywords: "set unique duplicates unordered empty set in not in add remove discard union intersection difference | & - remove duplicates set vs list",
        deck: [
          { kind: "overview", title: "Sets", blocks: [
            T("A <b>set</b> stores unique elements without order. Sets remove duplicates, check membership, and compare two groups of values."),
            L(["Creating a set", "Membership: in", "Adding and removing elements", "Set operations", "Removing duplicates from a list"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Creating a set", title: "Creating a set", blocks: [
            L([
              "Curly braces, with the elements separated by commas: <code>channels = {3, 1, 2}</code>.",
              "A set has no duplicates: a repeated value is stored once.",
              "A set has no order, so it has no index: <code>channels[0]</code> causes a TypeError.",
              "<code>set()</code> is an empty set. <code>{}</code> is an empty dictionary.",
              "<code>len(s)</code>, <code>x in s</code>, <code>x not in s</code>, and <code>for x in s:</code> work as for lists. The loop visits each element once, in no fixed order.",
            ]),
          ] },
          { kind: "code", part: "Creating a set", title: "Example: duplicates are stored once", blocks: [
            EX("channels = {30, 10, 20, 10, 30}\nprint(channels, len(channels))\nempty = set()\nprint(empty, len(empty))\nprint(type({}))", "channel numbers", [
              { c: "{30, 10, 20, 10, 30}", e: "10 and 30 are stored once: <code>{10, 20, 30} 3</code>. The set keeps its own order, not the written order." },
              { c: "empty = set()", e: "An empty set is displayed as <code>set() 0</code>" },
              { c: "type({})", e: "<code>{}</code> is an empty dictionary: <code>&lt;class 'dict'&gt;</code>" },
            ]),
          ] },
          { kind: "code", part: "Membership: in", title: "Example: accepting or rejecting a code", blocks: [
            EX('allowed = {"A1", "B2", "C3"}\ncode = input("Code: ")\nif code in allowed:\n    print("Accepted")\nelse:\n    print("Rejected")', "checking membership in a set of allowed codes", [
              { c: "code in allowed", e: "True when the code is an element of the set. <code>code not in allowed</code> is the opposite check." },
              { c: "input B2", e: "<code>Accepted</code>. With the input C9, the output is <code>Rejected</code>." },
            ], ["B2"]),
          ] },
          { kind: "concept", part: "Adding and removing elements", title: "Adding and removing elements", blocks: [
            TB(["Method", "Effect"], [
              ["<code>s.add(x)</code>", "adds x; nothing changes when x is already an element"],
              ["<code>s.remove(x)</code>", "removes x. When x is not an element, it causes a <b>KeyError</b>, the same error as a missing dictionary key"],
              ["<code>s.discard(x)</code>", "removes x when it is an element; no error otherwise"],
            ]),
            T("A set is mutable: these methods change the set in place."),
          ] },
          { kind: "code", part: "Adding and removing elements", title: "First example: execution step by step", blocks: [W("codeTrace", T_seen)] },
          { kind: "concept", part: "Set operations", title: "Union, intersection, and difference", blocks: [
            TB(["Operation", "Operator", "Method", "Result"], [
              ["union: in a or in b", "<code>a | b</code>", "<code>a.union(b)</code>", "<code>{1, 2, 3, 4}</code>"],
              ["intersection: in both", "<code>a &amp; b</code>", "<code>a.intersection(b)</code>", "<code>{2, 3}</code>"],
              ["difference: in a, not in b", "<code>a - b</code>", "<code>a.difference(b)</code>", "<code>{1}</code>"],
            ], "<code>a = {1, 2, 3}</code> and <code>b = {2, 3, 4}</code>"),
            T("Each operation returns a new set. The sets a and b do not change. A method gives the same result as its operator."),
          ] },
          { kind: "code", part: "Set operations", title: "Example: operators", blocks: [
            EX("due = {1, 2, 4, 6}\ndone = {2, 3, 6}\nprint(due - done)\nprint(due & done)\nprint(due | done)\nprint(done - due)", "machines due for service, and machines serviced", [
              { c: "due - done", e: "Due, but not serviced yet: <code>{1, 4}</code>" },
              { c: "due & done", e: "Due and serviced: <code>{2, 6}</code>" },
              { c: "done - due", e: "The order matters: serviced, but not due: <code>{3}</code>" },
            ]),
          ] },
          { kind: "code", part: "Removing duplicates from a list", title: "Example: different fault codes", blocks: [
            EX('codes = [12, 7, 12, 30, 7, 12]\nunique = list(set(codes))\nunique.sort()\nprint(unique)\nprint(len(codes), "entries")\nprint(len(unique), "different codes")', "set() removes the duplicates of a list", [
              { c: "set(codes)", e: "One copy of each value; the order of the list is lost." },
              { c: "list(...), sort()", e: "A list again, sorted: <code>[7, 12, 30]</code>" },
              { c: "len(...)", e: "<code>6 entries</code>, <code>3 different codes</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A set stores unique elements without order: <code>{1, 2, 3}</code>. <code>set()</code> is an empty set.",
              "<code>x in s</code> checks membership; <code>add()</code> adds; <code>remove()</code> fails for a missing element; <code>discard()</code> does not.",
              "<code>a | b</code>, <code>a &amp; b</code>, <code>a - b</code>: union, intersection, and difference, also as methods.",
              "<code>list(set(a_list))</code> removes duplicates; the order is lost.",
              "Sets or lists: a list keeps the order and the duplicates and has indexes, for values in order such as readings over time. A set has no order, no duplicates, and no index, for unique values, membership checks, and comparing two groups.",
            ]),
            NEXT("<b>Trace challenges</b>. Eight programs to trace by hand. They use the rules of all lessons of this chapter."),
          ] },
          { kind: "exercise", title: "Determine the output", answerCol: 0, cols: [
            [T("Write the output of each <code>print()</code> statement on paper.")],
            [RUN("s = {4, 2, 4, 1, 2}\nprint(len(s))\ns.add(3)\ns.add(4)\nprint(s)\ns.discard(9)\nprint(2 in s, 9 not in s)\nt = {1, 5}\nprint(s & t, s - t)")],
          ], answer: [OUT("3\n{1, 2, 3, 4}\nTrue True\n{1} {2, 3, 4}")] },
          { kind: "exercise", title: "Complete the code: common values", blocks: [
            PQ("Complete line 3, so that the program displays the fault codes that appear in both weeks.",
              "{3, 4}", "week1 = [1, 3, 4, 3]\nweek2 = [3, 6, 4]\ncommon = \nprint(common)\n", null, "common = set(week1) & set(week2)"),
          ] },
          { kind: "exercise", title: "Write a program: different words", blocks: [
            PQ("Write a program that reads a sentence and counts the words.<br>1. Use the prompt <code>Sentence: </code>.<br>2. Display the number of words.<br>3. Display the number of different words.<br>Test input: on off on on fault off.",
              "Sentence: on off on on fault off\n6 words\n3 different words", "# Write your program here\n", ["on off on on fault off"], "Write words = sentence.split(); the two numbers are len(words) and len(set(words))."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`s = {1, 2, 2, 3, 3, 3}`. What is `len(s)`?", choices: ["6", "3", "1", "an error"], answer: 1, explain: "A set stores each value once: {1, 2, 3}." },
            { q: "`{1, 2, 3} - {2, 3, 4}` is…", choices: ["{1}", "{4}", "{1, 4}", "{2, 3}"], answer: 0, explain: "The difference holds the elements of the first set that are not in the second." },
          ])] },
        ],
      },

      /* =============================== 7. TRACE CHALLENGES =============================== */
      {
        id: "trace",
        title: "Trace challenges",
        sub: "Eight programs to trace on paper: the value of every variable and the output, line by line.",
        keywords: "trace table trace the code execute by hand variable values output challenge string list tuple dictionary set",
        deck: [
          { kind: "exercise", title: "A temperature message", blocks: [CH(C_message)] },
          { kind: "exercise", title: "A number and a unit", blocks: [CH(C_unit)] },
          { kind: "exercise", title: "Tank levels", blocks: [CH(C_levels)] },
          { kind: "exercise", title: "Data, view, and saved", blocks: [CH(C_names)] },
          { kind: "exercise", title: "Two limits", blocks: [CH(C_limits)] },
          { kind: "exercise", title: "Parts in stock", blocks: [CH(C_stock)] },
          { kind: "exercise", title: "Pins in use", blocks: [CH(C_pins)] },
          { kind: "exercise", title: "Temperature groups", blocks: [T("Write lines 3 and 4 of the program."), CH(C_bins)], answer: [CODE("b = t // 10\nbins[b] = bins.get(b, 0) + 1", null, "lines 3 and 4")] },
        ],
      },

      /* =============================== 8. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete problems with strings, lists, tuples, dictionaries, and sets.",
        slides: "06:36",
        keywords: "practice count words even sum longest word frequency readings errors IndexError KeyError ValueError TypeError AttributeError",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Solve every problem with the five steps:"),
            L([
              "<b>Understand</b>: the input and the output.",
              "<b>Design</b>: choose the <b>data structure</b> (a string, a list, a tuple, a dictionary, or a set) and the <b>operation</b> (index, slice, method, or a loop over the elements).",
              "<b>Code</b>: write the program.",
              "<b>Test</b>: check the output with the test data.",
              "<b>Correct</b>: if the output differs, find the wrong step, correct it, and test again.",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: count the words", blocks: [
            T("Read a sentence and display the number of words. Words are separated by spaces."),
            IPO([["Input", "a sentence (str)"], ["Output", "the number of words"], ["Processing", "<code>len(sentence.split())</code>"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Write the program of Problem 1.<br>1. Read the sentence with the prompt <code>Sentence: </code>.<br>2. Display the number of words.<br>Test input: the motor runs at full speed.", "Sentence: the motor runs at full speed\n6", "# Write your program here\n", ["the motor runs at full speed"], "print(len(sentence.split()))"),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: sum of the even numbers", blocks: [
            T("Compute the sum of the even numbers of a list."),
            IPO([["Input", "a list of integers"], ["Output", "the sum of its even elements"], ["Processing", "for each element: if it is even, add it"]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("Write the program of Problem 2.<br>1. Use the list <code>numbers</code> in line 1 of the program.<br>2. Display the sum of the even numbers.", "30", "numbers = [3, 8, 5, 12, 7, 10]\n# Write your program here\n", null, "if n % 2 == 0: total = total + n"),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: the longest word", blocks: [
            T("Read a sentence and display the longest word of the sentence.<br>When two words have the same length, display the word that comes first."),
            IPO([["Input", "a sentence"], ["Output", "the longest word"], ["Processing", "split, then keep the word with the largest len()"]]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Write the program of Problem 3.<br>1. Read the sentence with the prompt <code>Sentence: </code>.<br>2. Display the longest word.<br>Test input: check the pressure sensor today.", "Sentence: check the pressure sensor today\npressure", "# Write your program here\n", ["check the pressure sensor today"], "if len(w) > len(longest): longest = w"),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: readings from the keyboard", blocks: [
            T("Read 4 readings and store the readings in a list. Then display three lines:<br>1. the list<br>2. the average, rounded to 2 decimal places<br>3. the largest reading"),
            IPO([["Input", "4 readings (float)"], ["Output", "the list, the average, the maximum"], ["Processing", "append each reading; sum / len; max"]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", blocks: [
            PQ("Write the program of Problem 4.<br>Use the prompt <code>Reading: </code>.<br>Test input: 20.5, 22, 21.5, 23.",
              "Reading: 20.5\nReading: 22\nReading: 21.5\nReading: 23\n[20.5, 22.0, 21.5, 23.0]\n21.75\n23.0", "readings = []\n# Write your program here\n", ["20.5", "22", "21.5", "23"], "readings.append(float(input(\"Reading: \")))"),
          ] },
          { kind: "problem", part: "Problem 5", title: "Problem 5: word frequency", blocks: [
            T("Count how often each word appears in a sentence, and display each word with its count."),
            IPO([["Input", "a sentence"], ["Output", "one line per word: word count"], ["Processing", "a dictionary: counts[w] = counts.get(w, 0) + 1, then loop over items()"]]),
          ] },
          { kind: "exercise", part: "Problem 5", title: "Problem 5: write the program", blocks: [
            PQ("Write the program of Problem 5.<br>1. Use the string <code>sentence</code> in line 1 of the program.<br>2. Display one line for each word: the word and the count.", "on 2\noff 1\nfault 1", 'sentence = "on off on fault"\n# Write your program here\n', null, "for w, c in counts.items(): print(w, c)"),
          ] },
          { kind: "problem", part: "Problem 6", title: "Problem 6: settings from text", blocks: [
            T("A device sends its settings as the text <code>\"mode=auto;speed=3\"</code>.<br>1. Store the settings in a dictionary.<br>2. Display the value of <code>speed</code>."),
            IPO([["Input", "a settings string"], ["Output", "the value of speed"], ["Processing", "split at \";\", then split each part at \"=\"; store key and value. The values are strings: <code>settings[\"speed\"]</code> is <code>'3'</code>, not the integer 3"]]),
          ] },
          { kind: "exercise", part: "Problem 6", title: "Problem 6: write the program", blocks: [
            PQ("Write the program of Problem 6.<br>1. Use the string <code>text</code> in line 1 of the program.<br>2. Store each setting in the dictionary <code>settings</code>.<br>3. Display the value of the key <code>\"speed\"</code>.", "3", 'text = "mode=auto;speed=3"\nsettings = {}\n# Write your program here\n', null, 'For each part of text.split(";"), write key, value = part.split("=") and settings[key] = value.'),
          ] },
          { kind: "summary", title: "Errors in this chapter", blocks: [
            TB(["Error", "Statement", "Message and cause"], [
              ["IndexError", "<code>a[3]</code>", "<code>list index out of range</code>: no such index"],
              ["KeyError", "<code>d[\"b\"]</code>", "<code>'b'</code>: no such key"],
              ["ValueError", "<code>a.remove(9)</code>", "<code>list.remove(x): x not in list</code>: no such element"],
              ["TypeError", "<code>t[0] = 9</code>", "<code>'tuple' object does not support item assignment</code>: a tuple is immutable"],
              ["AttributeError", "<code>t.append(3)</code>", "<code>'tuple' object has no attribute 'append'</code>: no such method"],
            ], "<code>a = [1, 2, 3]</code>, <code>d = {\"a\": 1}</code>, <code>t = (1, 2)</code>"),
            T("Each error stops the program at its statement. Topic 07 shows how a program handles such errors."),
          ] },
          { kind: "summary", title: "Chapter summary (part 1 of 2)", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1. Strings", "<code>[::-1]</code>, <code>strip()</code>, <code>find()</code> (-1 if missing), <code>count()</code>; strings are immutable."],
              ["2. Lists", "Ordered, mutable elements; indexing and slicing; <code>b = a</code> is the same list, <code>list(a)</code> is a copy; <code>sum</code>, <code>max</code>, <code>min</code>."],
              ["3. List methods", "<code>append</code>, <code>extend</code>, <code>insert</code>, <code>remove</code>, <code>pop</code>, <code>sort</code> change the list in place; <code>split</code> and <code>join</code> return new values."],
            ]),
          ] },
          { kind: "summary", title: "Chapter summary (part 2 of 2)", blocks: [
            TB(["Lesson", "Key rule"], [
              ["4. Tuples", "Ordered and immutable: <code>(3, 4)</code>, <code>(5,)</code>; packing and unpacking; <code>return a, b</code> returns a tuple."],
              ["5. Dictionaries", "Key-value pairs; <code>get(key, default)</code>; loop over <code>items()</code>; count with <code>get</code>; nested data; <code>**kwargs</code>."],
              ["6. Sets", "Unique elements without order; <code>add</code>, <code>discard</code>; <code>|</code>, <code>&amp;</code>, <code>-</code>; <code>list(set(a))</code> removes duplicates."],
            ]),
            N("<b>Topic 07: Data visualization and exceptions</b>. Plotting lists of values, and handling errors with try and except.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
