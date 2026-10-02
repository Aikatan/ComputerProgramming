/* ===================== Topic 08 - Data Processing =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: text files -> file modes, errors, folders -> CSV -> JSON -> NumPy -> pandas (2 lessons) -> trace challenges -> practice.
   Python level: t02-t07 material plus open/with, csv, json, numpy, pandas. No f-strings.
   Each file example writes its own file first, so it runs the same way every time.
   ===================================================================== */
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
  /* "Determine the output" exercises (instructor mode, see CHAPTER-IMPROVEMENT-PROMPT.md §6):
     PAPER is the task text; OUT is the expected output, for the `answer` of the slide. */
  const OUT = (text) => CODE(text, null, "output", "text");
  const PAPER = "Write the output of the program on paper, line by line.";

  /* ---------- traces ---------- */
  const FILE_STEPS = [
    { line: 0, mode: "w", status: "open", content: [], exists: true, note: "open(..., 'w') creates the file (or empties it) and opens it for writing." },
    { line: 1, mode: "w", status: "open", content: ["21.5"], flow: "write", note: "write adds the text \"21.5\\n\": one line." },
    { line: 2, mode: "w", status: "open", content: ["21.5", "22.0"], flow: "write", note: "A second line." },
    { line: 0, status: "closed", content: ["21.5", "22.0"], note: "The with block ends: the file is closed." },
    { line: 3, mode: "r", status: "open", content: ["21.5", "22.0"], note: "The file is opened again, for reading." },
    { line: 4, mode: "r", status: "open", content: ["21.5", "22.0"], flow: "read", out: "21.5\n22.0\n\n", note: "read() returns <code>'21.5\\n22.0\\n'</code>; print adds one more \\n: the empty last line." },
    { line: 3, status: "closed", content: ["21.5", "22.0"], out: "21.5\n22.0\n\n", note: "The file is closed. Result check: two write() calls, two lines." },
  ];

  /* ---------- trace challenges (generated: edit tools/traces/t08.py, then run "python tools/make-trace.py t08") ---------- */
  // Level 1. The position in an open file: readline, read(n), readlines, and a read at the end.
  const C_position = {
    side: true,
    code: ["with open(\"pins.txt\") as f:", "    head = f.readline()", "    part = f.read(2)", "    rest = f.readlines()", "    last = f.read()", "print(len(head), part)", "print(rest[0].strip())", "print(len(rest), len(last))"],
    steps: [
      { line: 0 },
      { line: 1, set: { head: "'A1\\n'" } },
      { line: 2, set: { part: "'B2'" } },
      { line: 3, set: { rest: "['2\\n', 'C3\\n']" } },
      { line: 4, set: { last: "''" } },
      { line: 0 },
      { line: 5, print: "3 B2" },
      { line: 6, print: "2" },
      { line: 7, print: "2 0" },
    ],
  };

  // Level 1. A line is a str with its line break: text is joined, numbers are added; an empty line.
  const C_lines = {
    side: true,
    code: ["text = \"\"", "total = 0", "with open(\"levels.txt\") as f:", "    for line in f:", "        line = line.strip()", "        if line == \"\":", "            continue", "        text += line", "        total += int(line)", "print(text, total)", "print(int(text) - total)"],
    steps: [
      { line: 0, set: { text: "''" } },
      { line: 1, set: { total: "0" } },
      { line: 2 },
      { line: 3, set: { line: "'12\\n'" } },
      { line: 4, set: { line: "'12'" } },
      { line: 5, test: "False" },
      { line: 7, set: { text: "'12'" } },
      { line: 8, set: { total: "12" } },
      { line: 3, set: { line: "'\\n'" } },
      { line: 4, set: { line: "''" } },
      { line: 5, test: "True" },
      { line: 6 },
      { line: 3, set: { line: "'5\\n'" } },
      { line: 4, set: { line: "'5'" } },
      { line: 5, test: "False" },
      { line: 7, set: { text: "'125'" } },
      { line: 8, set: { total: "17" } },
      { line: 3 },
      { line: 2 },
      { line: 9, print: "125 17" },
      { line: 10, print: "108" },
    ],
  };

  // Level 1. A missing file, then mode a: write() adds the digits at the end, with no line break.
  const C_counter = {
    side: true,
    code: ["for run in range(3):", "    try:", "        with open(\"n.txt\") as f:", "            count = int(f.read())", "    except FileNotFoundError:", "        count = 0", "    count += 1", "    with open(\"n.txt\", \"a\") as f:", "        f.write(str(count))", "print(count)"],
    steps: [
      { line: 0, set: { run: "0" } },
      { line: 1 },
      { line: 2 },
      { line: 4 },
      { line: 5, set: { count: "0" } },
      { line: 6, set: { count: "1" } },
      { line: 7 },
      { line: 8 },
      { line: 7 },
      { line: 0, set: { run: "1" } },
      { line: 1 },
      { line: 2 },
      { line: 3, set: { count: "1" } },
      { line: 2 },
      { line: 6, set: { count: "2" } },
      { line: 7 },
      { line: 8 },
      { line: 7 },
      { line: 0, set: { run: "2" } },
      { line: 1 },
      { line: 2 },
      { line: 3, set: { count: "12" } },
      { line: 2 },
      { line: 6, set: { count: "13" } },
      { line: 7 },
      { line: 8 },
      { line: 7 },
      { line: 0 },
      { line: 9, print: "13" },
    ],
  };

  // Level 2. csv.reader: the header and an empty line are rows; every value is a str.
  const C_parts = {
    side: true,
    code: ["import csv", "with open(\"parts.csv\") as f:", "    rows = list(csv.reader(f))", "total = 0", "for row in rows[1:]:", "    if row == []:", "        continue", "    total += int(row[1])", "print(len(rows), total)", "print(rows[1][1] * 2)"],
    steps: [
      { line: 0 },
      { line: 1 },
      { line: 2 },
      { line: 1 },
      { line: 3, set: { total: "0" } },
      { line: 4, set: { row: "['nut', '40']" } },
      { line: 5, test: "False" },
      { line: 7, set: { total: "40" } },
      { line: 4, set: { row: "[]" } },
      { line: 5, test: "True" },
      { line: 6 },
      { line: 4, set: { row: "['pin', '9']" } },
      { line: 5, test: "False" },
      { line: 7, set: { total: "49" } },
      { line: 4 },
      { line: 8, print: "4 49" },
      { line: 9, print: "4040" },
    ],
  };

  // Level 2. csv.DictReader: the values are text, so > compares the characters.
  const C_fastest = {
    side: true,
    code: ["import csv", "best = \"0\"", "name = \"\"", "with open(\"fans.csv\") as f:", "    reader = csv.DictReader(f)", "    for row in reader:", "        rpm = row[\"rpm\"]", "        if rpm > best:", "            best = rpm", "            name = row[\"fan\"]", "print(name, best)"],
    steps: [
      { line: 0 },
      { line: 1, set: { best: "'0'" } },
      { line: 2, set: { name: "''" } },
      { line: 3 },
      { line: 4 },
      { line: 5 },
      { line: 6, set: { rpm: "'800'" } },
      { line: 7, test: "True" },
      { line: 8, set: { best: "'800'" } },
      { line: 9, set: { name: "'A'" } },
      { line: 5 },
      { line: 6, set: { rpm: "'1200'" } },
      { line: 7, test: "False" },
      { line: 5 },
      { line: 6, set: { rpm: "'95'" } },
      { line: 7, test: "True" },
      { line: 8, set: { best: "'95'" } },
      { line: 9, set: { name: "'C'" } },
      { line: 5 },
      { line: 3 },
      { line: 10, print: "C 95" },
    ],
  };

  // Level 2. json.load: a number, a text in quotes, and true keep their types; len() of a dictionary; json.dumps.
  const C_log = {
    side: true,
    code: ["import json", "with open(\"log.json\") as f:", "    log = json.load(f)", "total = 0", "for t in log[\"t\"]:", "    t = t * 2", "    total += float(t)", "log[\"t\"] = len(log)", "print(total, log[\"ok\"])", "print(json.dumps(log))"],
    steps: [
      { line: 0 },
      { line: 1 },
      { line: 2 },
      { line: 1 },
      { line: 3, set: { total: "0" } },
      { line: 4, set: { t: "21" } },
      { line: 5, set: { t: "42" } },
      { line: 6, set: { total: "42.0" } },
      { line: 4, set: { t: "'19'" } },
      { line: 5, set: { t: "'1919'" } },
      { line: 6, set: { total: "1961.0" } },
      { line: 4, set: { t: "20.5" } },
      { line: 5, set: { t: "41.0" } },
      { line: 6, set: { total: "2002.0" } },
      { line: 4 },
      { line: 7 },
      { line: 8, print: "2002.0 True" },
      { line: 9, print: "{\"t\": 2, \"ok\": true}" },
    ],
  };

  // Level 3. The same operators on a list and on an array; / gives floats.
  const C_twice = {
    code: ["import numpy as np", "nums = [4, 2]", "arr = np.array(nums)", "nums = nums * 2", "arr = arr * 2", "nums = nums + [1]", "arr = arr / 2", "arr = arr + 1", "total = float(np.sum(arr))", "print(len(nums), arr.size, total)"],
    steps: [
      { line: 0 },
      { line: 1, set: { nums: "[4, 2]" } },
      { line: 2, set: { arr: "[4 2]" } },
      { line: 3, set: { nums: "[4, 2, 4, 2]" } },
      { line: 4, set: { arr: "[8 4]" } },
      { line: 5, set: { nums: "[4, 2, 4, 2, 1]" } },
      { line: 6, set: { arr: "[4. 2.]" } },
      { line: 7, set: { arr: "[5. 3.]" } },
      { line: 8, set: { total: "8.0" } },
      { line: 9, print: "5 2 8.0" },
    ],
  };

  // Level 3. Rows, columns, and axis of a 2-D array; line 10 stops: 2 elements and 3 elements.
  const C_shapes = {
    side: true,
    code: ["import numpy as np", "data = [[1, 0, 2], [2, 1, 3]]", "m = np.array(data)", "row = m[1]", "col = m[:, 1]", "tot = np.sum(m, axis=1)", "col = col + tot", "tot = np.sum(m, axis=0)", "row = row + tot", "out = col * tot", "print(out)"],
    steps: [
      { line: 0 },
      { line: 1 },
      { line: 2 },
      { line: 3, set: { row: "[2 1 3]" } },
      { line: 4, set: { col: "[0 1]" } },
      { line: 5, set: { tot: "[3 6]" } },
      { line: 6, set: { col: "[3 7]" } },
      { line: 7, set: { tot: "[3 1 5]" } },
      { line: 8, set: { row: "[5 2 8]" } },
      { line: 9, print: "ValueError" },
    ],
  };

  // Level 4. read_csv: the header is not a row; a new column, a filter, and a sort that is not stored.
  const C_pumps = {
    code: ["import pandas as pd", "df = pd.read_csv(\"pumps.csv\")", "n = len(df)", "avg = float(df[\"kw\"].mean())", "df[\"e\"] = df[\"kw\"] * df[\"h\"]", "big = df[df[\"kw\"] >= avg]", "big.sort_values(\"e\")", "names = big[\"name\"].tolist()", "total = int(big[\"e\"].sum())", "print(n, df.shape, total)"],
    steps: [
      { line: 0 },
      { line: 1 },
      { line: 2, set: { n: "3" } },
      { line: 3, set: { avg: "3.0" } },
      { line: 4 },
      { line: 5 },
      { line: 6 },
      { line: 7, set: { names: "['B', 'C']" } },
      { line: 8, set: { total: "38" } },
      { line: 9, print: "3 (3, 4) 38" },
    ],
  };

  // Level 4. A logical error: after a sort, loc[0] is the row with the label 0, not the first row (line 7).
  const C_lowest = {
    code: ["import pandas as pd", "df = pd.read_csv(\"cells.csv\")", "df[\"wh\"] = df[\"v\"] * df[\"ah\"]", "energy = df[\"wh\"].tolist()", "low = df.sort_values(\"wh\")", "order = low[\"name\"].tolist()", "name = low.loc[0][\"name\"]", "print(name, min(energy))"],
    steps: [
      { line: 0 },
      { line: 1 },
      { line: 2 },
      { line: 3, set: { energy: "[20, 8, 18]" } },
      { line: 4 },
      { line: 5, set: { order: "['B', 'C', 'A']" } },
      { line: 6, set: { name: "'A'" } },
      { line: 7, print: "A 8" },
    ],
  };
  /* ---------- end of the generated traces ---------- */

  // the task text of a trace challenge (Lesson 8)
  const TRACE = "Complete the trace table on paper. The first row is complete.<br>1. Before the trace, write the output that you expect. Then complete the rows in order.";
  // rows: "two" or "three": the first rows hold no value (an import line, or a variable that has no column)
  const TRACE_ROWS = (rows) => TRACE.replace("The first row is", "The first " + rows + " rows are");
  // the extra task line of a program that is beside the table (side layout); SIDE_IF: the table also has the column Condition
  const SIDE = "<br>2. In the column Line, write the number of the line that runs.";
  const SIDE_IF = SIDE + " In the column Condition, write True or False.";
  // side: the program is beside the table, and a blank row does not show which line runs
  // given: the number of rows that are complete (default 1)
  const CH = (trace, given) => W("traceTable", { trace, blank: true, given: given || 1, showCode: !!trace.side, hideLines: !!trace.side });

  App.registerTopic({
    id: "t08",
    title: "Data Processing",
    short: "Data Processing",
    blurb: "Text files, CSV and JSON data, NumPy arrays, and pandas DataFrames.",
    intro: "This chapter covers reading and writing data: text files, CSV and JSON files, and the NumPy and pandas libraries for numerical and tabular data. Each lesson uses only what the lessons before it have explained:<br>text files → file modes and errors → CSV → JSON → NumPy → pandas → trace challenges → practice.",
    lessons: [
      /* =============================== 1. TEXT FILES =============================== */
      {
        id: "file-handling",
        title: "Text files",
        sub: "Opening and closing files, writing lines, and reading them back.",
        slides: "08:4, 7–11",
        keywords: "file open close with write writelines read readline readlines newline position encoding utf-8 strip str convert",
        deck: [
          { kind: "overview", title: "Text files", blocks: [
            T("A <b>file</b> stores data on the disk, so that it remains after the program ends. A text file holds lines of characters."),
            L(["Opening and closing a file", "Writing to a file", "Reading a whole file", "Reading line by line"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Opening and closing a file", title: "open(), close(), and with", blocks: [
            CODE('with open("data.txt", "w") as f:\n    statements that use f', null, "syntax"),
            L([
              "<code>open(name, mode)</code> opens a file and returns a file object, here f. <code>\"w\"</code> writes, <code>\"r\"</code> reads (Lesson 2 lists all modes).",
              "A file must be closed after use: <code>f.close()</code>. Written data is safely in the file only after the close.",
              "<code>with</code> closes the file automatically at the end of its block, also after an error. Always use with.",
              "For text that is not English (for example Thai), add <code>encoding=\"utf-8\"</code>: <code>open(name, mode, encoding=\"utf-8\")</code>. Without it, the encoding depends on the computer.",
            ]),
          ] },
          { kind: "code", part: "Opening and closing a file", title: "Example: open() and close() without with", blocks: [
            EX('f = open("note.txt", "w")\nf.write("hi")\ncheck = open("note.txt")\nprint(len(check.read()))\ncheck.close()\nf.close()\ncheck = open("note.txt")\nprint(len(check.read()))\ncheck.close()', "data is saved at close()", [
              { c: 'f.write("hi")', e: "The text waits in memory, not yet in the file. The file holds <code>0</code> characters." },
              { c: "f.close()", e: "Writes the waiting text into the file and closes it. It now holds <code>2</code> characters." },
              { c: "with open(...) as f:", e: "Calls close() automatically at the end of its block, so no data is left waiting." },
            ]),
          ] },
          { kind: "concept", part: "Writing to a file", title: "write() and writelines()", blocks: [
            TB(["Method", "Effect"], [
              ["<code>f.write(text)</code>", "writes one string; it adds no line break"],
              ["<code>f.writelines(list)</code>", "writes each string of a list; it adds no line breaks"],
            ]),
            L([
              "End each line with <code>\"\\n\"</code> (new line), or the lines join together.",
              "write needs a string: <code>f.write(str(21.5) + \"\\n\")</code>.",
            ]),
          ] },
          { kind: "visual", part: "Writing to a file", title: "First example: write, close, read", blocks: [
            W("fileFlow", { filename: "readings.txt", title: "readings.txt", code: [
              'with open("readings.txt", "w") as f:', '    f.write("21.5\\n")', '    f.write("22.0\\n")',
              'with open("readings.txt", "r") as f:', "    print(f.read())",
            ], steps: FILE_STEPS }),
          ] },
          { kind: "code", part: "Writing to a file", title: "Example: writelines", blocks: [
            EX('lines = ["pump\\n", "fan\\n",\n         "heater\\n"]\nwith open("devices.txt", "w") as f:\n    f.writelines(lines)\nwith open("devices.txt") as f:\n    print(f.read())', "each string already ends with \\n", [
              { c: "f.writelines(lines)", e: "Writes the three strings; their \\n make three lines." },
              { c: 'open("devices.txt")', e: "Mode \"r\" is the default." },
            ]),
          ] },
          { kind: "concept", part: "Reading a whole file", title: "read() and read(n)", blocks: [
            TB(["Method", "Returns"], [
              ["<code>f.read()</code>", "the whole remaining content as one string"],
              ["<code>f.read(n)</code>", "the next n characters"],
            ]),
            TB(["Position", "0", "1", "2", "3", "4", "5", "6", "7", "8"], [
              ["Character", "f", "a", "n", "\\n", "p", "u", "m", "p", "\\n"],
              ["<code>f.read(5)</code>", "f", "a", "n", "\\n", "p", "", "", "", ""],
              ["<code>f.readline()</code>", "", "", "", "", "", "u", "m", "p", "\\n"],
            ], "A file with the lines fan and pump: 9 characters. A line break <code>\"\\n\"</code> is one character.", "center"),
            T("The file object remembers its <b>position</b>: each read continues where the previous one stopped. After <code>f.read(5)</code> the position is 5. <code>f.readline()</code> (next part) then reads to the end of that line: position 9, the end of the file."),
          ] },
          { kind: "code", part: "Reading a whole file", title: "Example: read(n) continues", blocks: [
            EX('with open("code.txt", "w") as f:\n    f.write("ABCDEFG")\nwith open("code.txt") as f:\n    print(f.read(3))\n    print(f.read(2))\n    print(f.read())', "the position moves on", [
              { c: "f.read(3)", e: "<code>ABC</code>" },
              { c: "f.read(2)", e: "Continues: <code>DE</code>" },
              { c: "f.read()", e: "The rest: <code>FG</code>" },
            ]),
          ] },
          { kind: "code", part: "Reading a whole file", title: "Example: read(n) counts the line break", blocks: [
            EX('with open("two.txt", "w") as f:\n    f.write("ab\\ncd\\n")\nwith open("two.txt") as f:\n    part = f.read(4)\nprint(len(part))\nprint(part)', "the file holds two lines", [
              { c: "f.read(4)", e: "a, b, the line break, c: <code>'ab\\nc'</code>" },
              { c: "len(part)", e: "<code>4</code>: the line break is one character" },
              { c: "print(part)", e: "<code>ab</code> and <code>c</code> on two lines" },
            ]),
          ] },
          { kind: "concept", part: "Reading line by line", title: "readline(), readlines(), and a for loop", blocks: [
            TB(["Code", "Result"], [
              ["<code>f.readline()</code>", "the next line, including its \"\\n\""],
              ["<code>f.readlines()</code>", "a list of all lines, each with its \"\\n\""],
              ["<code>for line in f:</code>", "one line per iteration"],
            ]),
            T("<code>line.strip()</code> removes the \"\\n\" at the end; <code>float(line)</code> converts a number line."),
            T("An empty line becomes <code>\"\"</code>, and <code>float(\"\")</code> stops the program: <code>ValueError: could not convert string to float: ''</code>"),
          ] },
          { kind: "code", part: "Reading line by line", title: "Example: readline and readlines", blocks: [
            EX('with open("r.txt", "w") as f:\n    f.write("21.5\\n22.0\\n23.1\\n")\nwith open("r.txt") as f:\n    print(f.readline())\n    print(f.readlines())', "one line, then the rest as a list", [
              { c: "f.readline()", e: "<code>21.5</code> and an empty line (the line keeps its \\n)" },
              { c: "f.readlines()", e: "The remaining lines: <code>['22.0\\n', '23.1\\n']</code>" },
            ]),
          ] },
          { kind: "code", part: "Reading line by line", title: "Example: the average of the readings", blocks: [
            EX('with open("r.txt", "w") as f:\n    f.write("21.5\\n22.0\\n23.1\\n")\ntotal = 0\ncount = 0\nwith open("r.txt") as f:\n    for line in f:\n        total = total + float(line)\n        count = count + 1\nprint(round(total / count, 2))', "a loop over the lines", [
              { c: "float(line)", e: "Converts \"21.5\\n\" to 21.5 (spaces and \\n are ignored)." },
              { c: "print(...)", e: "<code>22.2</code>" },
            ]),
          ] },
          { kind: "code", part: "Reading line by line", title: "Example: convert the text, skip empty lines", blocks: [
            EX('with open("r.txt", "w") as f:\n    f.write("21.5\\n22.0\\n\\n")\nwith open("r.txt") as f:\n    lines = f.readlines()\ntotal = 0\nfor line in lines:\n    text = line.strip()\n    if text != "":\n        total = total + float(text)\nprint(total)', "data from a file is always a str", [
              { c: "lines", e: "<code>['21.5\\n', '22.0\\n', '\\n']</code>: every element is a str, also a line with a number. Convert it before a calculation." },
              { c: "line.strip()", e: "Removes the \\n: the empty last line becomes <code>\"\"</code>." },
              { c: 'if text != "":', e: "Skips the empty line: the output is <code>43.5</code>." },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>with open(name, mode) as f:</code> opens a file and closes it at the end of the block. Written data is in the file after the close.",
              "<code>write()</code> and <code>writelines()</code> write strings; add \"\\n\" for new lines.",
              "<code>read()</code>: everything; <code>read(n)</code>: n characters; the position moves on.",
              "<code>readline()</code>: one line; <code>readlines()</code>: a list; <code>for line in f</code>: a loop.",
              "Data from a file is always a str: convert it with <code>float()</code> or <code>int()</code>, and skip empty lines.",
            ]),
            NEXT("<b>File modes, errors, and folders</b>. Appending, creating, missing files, and the os module."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T(PAPER)],
            [RUN('with open("t.txt", "w") as f:\n    f.write("one\\ntwo\\nthree\\n")\nwith open("t.txt") as f:\n    print(f.read(5))\n    print(f.readline())\n    print(len(f.readlines()))')],
          ], answerCol: 0, answer: [
            OUT("one\nt\nwo\n\n1"),
            T("Line 4 of the output is empty: <code>readline()</code> returns <code>\"wo\\n\"</code>, and <code>print()</code> adds a line break."),
          ] },
          { kind: "exercise", title: "Write a program: save and count", blocks: [
            PQ("Write a program that writes three words into a file and counts the lines.<br>1. Write pump, fan, and heater into \"names.txt\", one word on each line.<br>2. Read the file, and display the number of lines.",
              "3", "# Write your program here\n", null, "Use len(f.readlines()) for the number of lines."),
          ] },
          { kind: "exercise", title: "Write a program: the maximum reading", blocks: [
            PQ("Complete the program. Lines 1 and 2 already write three readings into \"v.txt\".<br>1. Read the file line by line.<br>2. Display the largest reading.",
              "25.4", 'with open("v.txt", "w") as f:\n    f.write("21.5\\n25.4\\n22.0\\n")\n# Read the file here\n', null, "Use for line in f: and convert each line with float(line)."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "What does `with` do for a file?", choices: ["opens it twice", "closes it automatically", "deletes it", "reads it"], answer: 1, explain: "The file is closed at the end of the with block." },
            { q: "`f.readlines()` returns…", choices: ["one string", "one line", "a list of lines", "the number of lines"], answer: 2, explain: "It returns a list; each element is a line with its \\n." },
          ])] },
        ],
      },

      /* =============================== 2. MODES, ERRORS, FOLDERS =============================== */
      {
        id: "file-modes",
        title: "File modes, errors, and folders",
        sub: "The modes r, w, a, x, errors when opening files, and the os module.",
        slides: "08:5–6, 8",
        keywords: "mode r w a x append create filenotfounderror fileexistserror os getcwd listdir path exists remove mkdir",
        deck: [
          { kind: "overview", title: "File modes, errors, and folders", blocks: [
            T("The mode of <code>open()</code> decides what happens to an existing file. Opening can also fail, and the os module works with folders."),
            L(["The four modes", "Append compared with write", "Errors when opening files", "The os module"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The four modes", title: "r, w, a, and x", blocks: [
            TB(["Mode", "Use", "File exists", "File does not exist"], [
              ["<code>\"r\"</code>", "read (the default)", "read from the start", "FileNotFoundError"],
              ["<code>\"w\"</code>", "write", "<b>emptied</b>, then written", "created"],
              ["<code>\"a\"</code>", "append", "written at the end; the old content stays", "created"],
              ["<code>\"x\"</code>", "create", "FileExistsError", "created"],
            ]),
            T("Adding <code>b</code> (for example <code>\"rb\"</code>) opens a file in binary mode, for images and other non-text files."),
          ] },
          { kind: "code", part: "Append compared with write", title: "Example: a adds, w empties", blocks: [
            EX('with open("log.txt", "w") as f:\n    f.write("start\\n")\nwith open("log.txt", "a") as f:\n    f.write("running\\n")\nwith open("log.txt") as f:\n    print(f.read())\nwith open("log.txt", "w") as f:\n    f.write("new\\n")\nwith open("log.txt") as f:\n    print(f.read())', "a keeps the old content", [
              { c: 'first open(..., "w")', e: "The file holds only start." },
              { c: 'open(..., "a")', e: "running is added after start. The first read() displays two lines: <code>start</code>, <code>running</code>" },
              { c: 'second open(..., "w")', e: "Empties the file first. The second read() displays only <code>new</code>" },
            ]),
          ] },
          { kind: "concept", part: "Errors when opening files", title: "FileNotFoundError and FileExistsError", blocks: [
            L([
              "Opening a missing file in mode \"r\" raises a <b>FileNotFoundError</b>.",
              "Opening an existing file in mode \"x\" raises a <b>FileExistsError</b>.",
              "Both are handled with try and except (Topic 07).",
            ]),
          ] },
          { kind: "code", part: "Errors when opening files", title: "Example: a missing file", blocks: [
            EX('try:\n    with open("missing.txt") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("The file does not exist.")', "handled, not stopped", [
              { c: 'open("missing.txt")', e: "The file does not exist: FileNotFoundError." },
              { c: "except FileNotFoundError", e: "The message is displayed instead." },
            ]),
          ] },
          { kind: "code", part: "Errors when opening files", title: "Example: x on an existing file", blocks: [
            EX('with open("report.txt", "w") as f:\n    f.write("v1\\n")\ntry:\n    with open("report.txt", "x") as f:\n        f.write("v2\\n")\nexcept FileExistsError:\n    print("report.txt already exists")', "x protects an existing file", [
              { c: 'open("report.txt", "x")', e: "The file exists, so x fails: FileExistsError." },
            ]),
          ] },
          { kind: "concept", part: "The os module", title: "The os module", blocks: [
            TB(["Function", "Result"], [
              ["<code>os.getcwd()</code>", "the current working folder"],
              ["<code>os.path.exists(name)</code>", "True if the file or folder exists"],
              ["<code>os.remove(name)</code>", "deletes a file"],
              ["<code>os.listdir(path)</code>", "a list of the names in a folder"],
              ["<code>os.mkdir(name)</code>", "creates a folder"],
            ]),
            T("A file name without a folder refers to the current working folder."),
            T("On this site, files are kept in the browser's memory, not on the computer's disk."),
          ] },
          { kind: "code", part: "The os module", title: "Example: exists() before and after remove()", blocks: [
            EX('import os\n\nwith open("temp.txt", "w") as f:\n    f.write("x")\nprint(os.path.exists("temp.txt"))\nos.remove("temp.txt")\nprint(os.path.exists("temp.txt"))', "exists, remove, exists", [
              { c: "os.path.exists", e: "<code>True</code> after the file is written" },
              { c: "os.remove", e: "Deletes it: then <code>False</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>\"r\"</code> reads; <code>\"w\"</code> empties and writes; <code>\"a\"</code> appends; <code>\"x\"</code> creates a new file only.",
              "A missing file in mode r: FileNotFoundError. An existing file in mode x: FileExistsError.",
              "The os module lists, checks, creates, and removes files and folders.",
            ]),
            NEXT("<b>CSV files</b>. Tables stored as text, one row per line."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T(PAPER)],
            [RUN('with open("m.txt", "w") as f:\n    f.write("A\\n")\nwith open("m.txt", "a") as f:\n    f.write("B\\n")\nwith open("m.txt", "w") as f:\n    f.write("C\\n")\nwith open("m.txt") as f:\n    print(f.read())')],
          ], answerCol: 0, answer: [
            OUT("C\n\n"),
            T("Line 2 of the output is empty: <code>read()</code> returns <code>\"C\\n\"</code>, and <code>print()</code> adds a line break."),
          ] },
          { kind: "exercise", title: "Write a program: a log file", blocks: [
            PQ("Write a program that creates a file, adds two lines, and displays the file.<br>1. Create \"events.txt\" with the line <code>boot</code>.<br>2. Use mode \"a\" to add the line <code>ready</code> and the line <code>stop</code>.<br>3. Display the content of the file.",
              "boot\nready\nstop", "# Write your program here\n", null, 'Use open("events.txt", "a") to add lines at the end of the file.'),
          ] },
          { kind: "exercise", title: "Write a program: a missing file", blocks: [
            PQ("Write a program that tries to read the file \"config.txt\". The file does not exist.<br>1. Open the file inside a try block.<br>2. For a FileNotFoundError, display \"using defaults\".",
              "using defaults", "# Write your program here\n", null, "A missing file raises a FileNotFoundError. Use except FileNotFoundError: for the message."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "A file holds the line A. It is opened with mode `\"a\"`, and B is written. The file now holds…", choices: ["only A", "only B", "A, then B", "an error"], answer: 2, explain: "Append mode keeps the old content and writes at the end." },
            { q: "Which mode raises an error when the file already exists?", choices: ["\"r\"", "\"w\"", "\"a\"", "\"x\""], answer: 3, explain: "\"x\" only creates new files: FileExistsError." },
          ])] },
        ],
      },

      /* =============================== 3. CSV =============================== */
      {
        id: "csv",
        title: "CSV files",
        sub: "Tables as comma-separated text: writing rows and reading them back.",
        slides: "08:12–13",
        keywords: "csv comma separated writer writerow reader dictreader header table convert compare typeerror",
        deck: [
          { kind: "overview", title: "CSV files", blocks: [
            T("A <b>CSV</b> file (comma-separated values) stores a table as text: one row per line, with the columns separated by commas. Spreadsheets and data loggers use it."),
            L(["The CSV format", "Writing rows", "Reading rows", "Reading rows as dictionaries", "Reading, computing, and writing"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The CSV format", title: "A table as text", blocks: [
            CODE("Name,Voltage,Current\npump,220,1.5\nfan,110,0.4", null, "devices.csv", "text"),
            L([
              "The first line usually holds the column names (the header).",
              "Every value is text in the file; numbers must be converted after reading.",
              "The module <code>csv</code> reads and writes this format: <code>import csv</code>.",
            ]),
          ] },
          { kind: "concept", part: "Writing rows", title: "csv.writer", blocks: [
            L([
              "Open the file with <code>newline=\"\"</code>. Without it, Windows adds an empty line after every row, and csv.reader later returns these lines as empty rows <code>[]</code>.",
              "<code>w = csv.writer(f)</code> creates a writer.",
              "<code>w.writerow(list)</code> writes one row; <code>w.writerows(list_of_lists)</code> writes several.",
            ]),
          ] },
          { kind: "code", part: "Writing rows", title: "First example: write, then look at the text", blocks: [
            EX('import csv\nwith open("devices.csv", "w",\n          newline="") as f:\n    w = csv.writer(f)\n    w.writerow(["Name", "Voltage"])\n    w.writerow(["pump", 220])\n    w.writerow(["fan", 110])\nwith open("devices.csv") as f:\n    print(f.read())', "the file is plain text", [
              { c: "w.writerow([...])", e: "One list becomes one comma-separated line." },
              { c: "print(f.read())", e: "<code>Name,Voltage</code>, <code>pump,220</code>, <code>fan,110</code>" },
            ]),
          ] },
          { kind: "concept", part: "Reading rows", title: "csv.reader", blocks: [
            L([
              "<code>for row in csv.reader(f):</code> gives each row as a list of strings.",
              "The header is also a row. <code>rows = list(csv.reader(f))</code> reads all rows into a list; <code>rows[1:]</code> skips the header.",
              "Convert numbers: <code>float(row[1])</code>.",
            ]),
          ] },
          { kind: "visual", part: "Reading rows", title: "Writing rows and reading them back", blocks: [
            W("csvFlow", { filename: "devices.csv", columns: ["Name", "Voltage", "Current"], rows: [["pump", 220, 1.5], ["fan", 110, 0.4]] }),
          ] },
          { kind: "code", part: "Reading rows", title: "Example: the total voltage", blocks: [
            T("<code>rows[1:]</code> skips the header row, and <code>int()</code> converts each voltage. The output is 330 = 220 + 110."),
            RUN('import csv\nwith open("devices.csv", "w") as f:\n    f.write("Name,Voltage\\npump,220\\nfan,110\\n")\nwith open("devices.csv") as f:\n    rows = list(csv.reader(f))\ntotal = 0\nfor row in rows[1:]:\n    total = total + int(row[1])\nprint(total)'),
          ] },
          { kind: "concept", part: "Reading rows", title: "Convert before comparing", blocks: [
            T("A value from a CSV file is a string. Convert it with <code>int()</code> or <code>float()</code> before a comparison, as before a calculation."),
            TB(["Code", "Result for row = [\"cable\", \"40\"]"], [
              ["<code>row[1] &gt; \"100\"</code>", "<code>True</code>, with no error. <code>\"40\" &gt; \"100\"</code> compares the characters, and \"4\" comes after \"1\": the answer is wrong."],
              ["<code>row[1] &gt; 100</code>", "<code>TypeError: '&gt;' not supported between instances of 'str' and 'int'</code>"],
              ["<code>int(row[1]) &gt; 100</code>", "<code>False</code>: 40 and 100 are compared as numbers."],
            ]),
          ] },
          { kind: "concept", part: "Reading rows as dictionaries", title: "csv.DictReader", blocks: [
            L([
              "<code>csv.DictReader(f)</code> uses the header row as keys.",
              "Each row is a dictionary: <code>row[\"Voltage\"]</code> instead of <code>row[1]</code>.",
              "The header row is not returned as data.",
            ]),
          ] },
          { kind: "code", part: "Reading rows as dictionaries", title: "Example: rows by column name", blocks: [
            EX('import csv\nwith open("devices.csv", "w") as f:\n    f.write("Name,Voltage\\n")\n    f.write("pump,220\\nfan,110\\n")\nwith open("devices.csv") as f:\n    for row in csv.DictReader(f):\n        print(row, row["Voltage"])', "the header gives the keys", [
              { c: "csv.DictReader(f)", e: "The header line gives the keys." },
              { c: "row", e: "One dictionary per data row; the values are strings." },
              { c: 'row["Voltage"]', e: "By column name: <code>220</code>, then <code>110</code>" },
            ]),
          ] },
          { kind: "code", part: "Reading, computing, and writing", title: "Example: read, compute, write a new file", blocks: [
            T("The program reads devices.csv, computes the power of each data row, and writes power.csv. The output is the text of the new file: <code>Name,Power</code>, <code>pump,330.0</code>, <code>fan,44.0</code>."),
            RUN('import csv\nwith open("devices.csv", "w") as f:\n    f.write("Name,Voltage,Current\\npump,220,1.5\\nfan,110,0.4\\n")\nwith open("devices.csv") as f:\n    rows = list(csv.reader(f))\nwith open("power.csv", "w", newline="") as f:\n    w = csv.writer(f)\n    w.writerow(["Name", "Power"])\n    for row in rows[1:]:\n        power = float(row[1]) * float(row[2])\n        w.writerow([row[0], power])\nwith open("power.csv") as f:\n    print(f.read())'),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A CSV file is a table as text: one row per line, values separated by commas.",
              "<code>csv.writer(f).writerow(list)</code> writes a row; open with <code>newline=\"\"</code>.",
              "<code>csv.reader(f)</code> gives rows as lists of strings. Convert the numbers before a calculation or a comparison.",
              "<code>csv.DictReader(f)</code> gives rows as dictionaries keyed by the header.",
              "Data processing: read the rows, compute a value for each row, write the new rows to a file.",
            ]),
            NEXT("<b>JSON files</b>. Dictionaries and lists stored as text."),
          ] },
          { kind: "exercise", title: "Write a program: rows above a limit", blocks: [
            PQ("Complete the program. Lines 2 and 3 already write the file \"items.csv\".<br>1. Read the rows of the file.<br>2. Display the name of each row with a price above 100, one name on each line.",
              "motor\nsensor", 'import csv\nwith open("items.csv", "w", newline="") as f:\n    csv.writer(f).writerows([["name", "price"], ["cable", 40], ["motor", 250], ["sensor", 120]])\n# Read the file here\n', null, 'Use for row in csv.DictReader(f): and compare float(row["price"]) with 100.'),
          ] },
          { kind: "exercise", title: "Write a program: write a CSV file", blocks: [
            PQ("Write a program that writes a CSV file with <code>csv.writer</code> and displays the text of the file.<br>1. The file name is \"t.csv\".<br>2. The header is <code>hour,temp</code>.<br>3. The rows are <code>8,24</code> and <code>12,31</code>.",
              "hour,temp\n8,24\n12,31", "import csv\n# Write your program here\n", null, 'Open the file with open("t.csv", "w", newline="").'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which module reads and writes CSV files?", choices: ["json", "csv", "os", "math"], answer: 1, explain: "The csv module handles comma-separated values." },
            { q: "`csv.reader` returns each row as…", choices: ["a string", "a list of strings", "a list of numbers", "a dictionary"], answer: 1, explain: "Every value is text; numbers must be converted." },
          ])] },
        ],
      },

      /* =============================== 4. JSON =============================== */
      {
        id: "json",
        title: "JSON files",
        sub: "Dictionaries and lists as text: dump, load, dumps, and loads.",
        slides: "08:14–15",
        keywords: "json dump load dumps loads dictionary serialize indent true false null jsondecodeerror",
        deck: [
          { kind: "overview", title: "JSON files", blocks: [
            T("<b>JSON</b> is a text format for dictionaries and lists. Web services and configuration files use it."),
            L(["The JSON format", "Files: dump and load", "Strings: dumps and loads"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The JSON format", title: "Dictionaries and lists as text", blocks: [
            CODE('{"name": "Pump", "voltage": 220, "modes": ["auto", "manual"]}', null, "JSON text", "text"),
            L([
              "The text looks like a Python dictionary: keys and values in { }, lists in [ ]. A few values are written differently.",
              "The module <code>json</code> converts between Python data and JSON text: <code>import json</code>.",
            ]),
          ] },
          { kind: "concept", part: "The JSON format", title: "A dictionary and its JSON text", blocks: [
            TB(["Python", "JSON text"], [
              ["<code>True</code>", "<code>true</code>"],
              ["<code>False</code>", "<code>false</code>"],
              ["<code>None</code>", "<code>null</code>"],
              ["<code>'text'</code> or <code>\"text\"</code>", "<code>\"text\"</code>: double quotes only"],
              ["numbers, lists, dictionaries", "written in the same way"],
            ]),
            T("The dictionary <code>{'name': 'Pump', 'on': True, 'error': None}</code> becomes the JSON text <code>{\"name\": \"Pump\", \"on\": true, \"error\": null}</code>."),
          ] },
          { kind: "concept", part: "Files: dump and load", title: "json.dump and json.load", blocks: [
            TB(["Function", "Effect"], [
              ["<code>json.dump(data, f)</code>", "writes a dictionary or list to an open file as JSON text"],
              ["<code>json.load(f)</code>", "reads JSON text from an open file and returns the Python data"],
            ]),
            T("<code>json.dump(data, f)</code> writes one line of text. With <code>json.dump(data, f, indent=4)</code>, each key is on its own line, indented by 4 spaces."),
          ] },
          { kind: "code", part: "Files: dump and load", title: "First example: save and load settings", blocks: [
            EX('import json\nsettings = {"name": "Pump",\n            "voltage": 220}\nwith open("settings.json", "w") as f:\n    json.dump(settings, f)\nwith open("settings.json") as f:\n    print(f.read())\nwith open("settings.json") as f:\n    loaded = json.load(f)\nprint(loaded["voltage"])', "a round trip through a file", [
              { c: "json.dump(settings, f)", e: "Writes the dictionary into the file as one line of JSON text." },
              { c: "print(f.read())", e: "<code>{\"name\": \"Pump\", \"voltage\": 220}</code>" },
              { c: "json.load(f)", e: "A new dictionary; <code>loaded[\"voltage\"]</code> is <code>220</code>." },
            ]),
          ] },
          { kind: "concept", part: "Strings: dumps and loads", title: "json.dumps and json.loads", blocks: [
            TB(["Function", "Effect"], [
              ["<code>json.dumps(data)</code>", "returns the JSON text as a string (s = string)"],
              ["<code>json.loads(text)</code>", "converts a JSON string into Python data"],
            ]),
            T("Data received from a network or a sensor often arrives as a JSON string; loads converts it."),
            T("The text must be valid JSON. With single quotes, <code>json.loads(\"{'a': 1}\")</code> raises <code>json.decoder.JSONDecodeError: Expecting property name enclosed in double quotes: line 1 column 2 (char 1)</code>."),
          ] },
          { kind: "code", part: "Strings: dumps and loads", title: "Example: a sensor message", blocks: [
            EX('import json\ntext = \'{"id": "T1", "value": 25.4}\'\ndata = json.loads(text)\nprint(data["value"] + 1)\ndata["ok"] = True\nprint(json.dumps(data))', "string to dictionary and back", [
              { c: "json.loads(text)", e: "A dictionary; 25.4 is a number: <code>26.4</code>" },
              { c: 'data["ok"] = True', e: "A new key with a Python bool." },
              { c: "json.dumps(data)", e: "JSON text again; True is written as <code>true</code>." },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "JSON is text for dictionaries and lists: double quotes only, and true, false, null for True, False, None.",
              "<code>json.dump(data, f)</code> / <code>json.load(f)</code> work with files.",
              "<code>json.dumps(data)</code> / <code>json.loads(text)</code> work with strings.",
            ]),
            NEXT("<b>NumPy arrays</b>. Fast calculations on many numbers at once."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T(PAPER)],
            [RUN('import json\ntext = \'{"id": 7, "tags": ["a", "b"]}\'\nd = json.loads(text)\nprint(d["id"] * 2)\nprint(d["tags"][1])\nprint(len(d))')],
          ], answerCol: 0, answer: [OUT("14\nb\n2")] },
          { kind: "exercise", title: "Write a program: update a JSON file", blocks: [
            PQ("Complete the program. Lines 2 and 3 already save settings in \"cfg.json\".<br>1. Load the settings from the file.<br>2. Change \"speed\" to 5.<br>3. Save the settings in the file again.<br>4. Load the settings again, and display the speed.",
              "5", 'import json\nwith open("cfg.json", "w") as f:\n    json.dump({"mode": "auto", "speed": 3}, f)\n# Write your program here\n', null, 'Use cfg = json.load(f) to load, cfg["speed"] = 5 to change, and json.dump(cfg, f) to save.'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which function converts a JSON string into a dictionary?", choices: ["json.dump", "json.dumps", "json.load", "json.loads"], answer: 3, explain: "loads = load from a string." },
            { q: "JSON `true` becomes, in Python…", choices: ["\"true\"", "True", "1", "None"], answer: 1, explain: "JSON true, false, null become True, False, None." },
          ])] },
        ],
      },

      /* =============================== 5. NUMPY =============================== */
      {
        id: "numpy",
        title: "NumPy arrays",
        sub: "Creating arrays, shape, indexing, element-wise operations, and aggregation.",
        slides: "08:17–24",
        keywords: "numpy array np shape ndim size indexing slicing element-wise list sum mean max min axis",
        deck: [
          { kind: "overview", title: "NumPy arrays", blocks: [
            T("<b>NumPy</b> is a library for numerical computing. Its <b>array</b> stores many numbers of the same type and calculates with all of them at once."),
            L(["Arrays", "Shape and two-dimensional arrays", "Indexing and slicing", "Element-wise operations", "Aggregation"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Arrays", title: "Creating an array", blocks: [
            L([
              "NumPy is a third-party module: <code>pip install numpy</code>, then <code>import numpy as np</code>.",
              "<code>np.array([1, 2, 3])</code> creates an array from a list.",
              "<code>np.arange(0, 10, 2)</code> works like range: <code>[0 2 4 6 8]</code>. <code>np.zeros(3)</code> gives <code>[0. 0. 0.]</code>.",
              "An array prints without commas: <code>[1 2 3]</code>.",
            ]),
          ] },
          { kind: "code", part: "Arrays", title: "First example: a list and an array", blocks: [
            EX("import numpy as np\nreadings = [21, 25, 19, 27]\ntemps = np.array(readings)\nprint(readings)\nprint(temps)\nprint(np.arange(0, 10, 2))\nprint(np.zeros(3))", "an array prints without commas", [
              { c: "np.array(readings)", e: "The list becomes an array: <code>[21 25 19 27]</code>" },
              { c: "np.arange(0, 10, 2)", e: "Like range, but the result is an array: <code>[0 2 4 6 8]</code>" },
              { c: "np.zeros(3)", e: "Three zeros: <code>[0. 0. 0.]</code>. The dot marks a float." },
            ]),
          ] },
          { kind: "concept", part: "Shape and two-dimensional arrays", title: "Shape", blocks: [
            TB(["Attribute", "Meaning", "For np.array([[1, 2, 3], [4, 5, 6]])"], [
              ["<code>a.shape</code>", "the size along each dimension", "<code>(2, 3)</code>: 2 rows, 3 columns"],
              ["<code>a.ndim</code>", "the number of dimensions", "<code>2</code>"],
              ["<code>a.size</code>", "the number of elements", "<code>6</code>"],
            ]),
            T("A two-dimensional array is created from a list of rows."),
          ] },
          { kind: "concept", part: "Indexing and slicing", title: "Indexing and slicing", blocks: [
            L([
              "A one-dimensional array is indexed like a list: <code>a[0]</code>, <code>a[-1]</code>, <code>a[1:3]</code>.",
              "A two-dimensional array uses <code>a[row, column]</code>: <code>m[1, 2]</code> is row 1, column 2.",
              "<code>m[0]</code> is the whole row 0; <code>m[:, 1]</code> is the whole column 1.",
            ]),
          ] },
          { kind: "code", part: "Indexing and slicing", title: "Example: rows and columns", blocks: [
            EX("import numpy as np\nm = np.array([[1, 2, 3], [4, 5, 6]])\nprint(m.shape)\nprint(m[1, 2])\nprint(m[0])\nprint(m[:, 1])", "a 2 × 3 array", [
              { c: "m.shape", e: "<code>(2, 3)</code>" },
              { c: "m[1, 2]", e: "Row 1, column 2: <code>6</code>" },
              { c: "m[0], m[:, 1]", e: "Row 0: <code>[1 2 3]</code>; column 1: <code>[2 5]</code>" },
            ]),
          ] },
          { kind: "concept", part: "Element-wise operations", title: "Element-wise operations", blocks: [
            L([
              "An operator between two arrays works on the elements at the same positions: <code>a + b</code>, <code>a * b</code>.",
              "The two arrays must have the same shape. Arrays of 3 and 2 elements give <code>ValueError: operands could not be broadcast together with shapes (3,) (2,)</code>.",
              "An operator with a single number applies the number to every element: for <code>a = np.array([1, 2, 3])</code>, <code>a * 2</code> is <code>[2 4 6]</code>.",
              "Functions such as <code>np.sqrt(a)</code> also work element by element.",
            ]),
          ] },
          { kind: "visual", part: "Element-wise operations", title: "a + b: matching positions", blocks: [
            W("arrayOp", { title: "a + b", a: [1, 2, 3], b: [4, 5, 6], op: "+" }),
          ] },
          { kind: "code", part: "Element-wise operations", title: "Example: temperature rise", blocks: [
            EX("import numpy as np\nmorning = np.array([20, 25, 30])\nnoon = np.array([31, 36, 42])\nprint(noon - morning)\nprint(morning * 9 / 5 + 32)", "no loop is needed", [
              { c: "noon - morning", e: "Position by position: 31 − 20, 36 − 25, 42 − 30 → <code>[11 11 12]</code>" },
              { c: "morning * 9 / 5 + 32", e: "Each number applies to every element: the values in °F, <code>[68. 77. 86.]</code>" },
            ]),
          ] },
          { kind: "concept", part: "Element-wise operations", title: "Operators on a list and on an array", blocks: [
            TB(["Code", "a and b are lists", "a and b are arrays"], [
              ["<code>a * 2</code>", "<code>[1, 2, 3, 1, 2, 3]</code>: the list is repeated", "<code>[2 4 6]</code>: each element is multiplied"],
              ["<code>a + b</code>", "<code>[1, 2, 3, 4, 5, 6]</code>: the lists are joined", "<code>[5 7 9]</code>: the elements are added"],
              ["<code>a / 2</code>", "<code>TypeError: unsupported operand type(s) for /: 'list' and 'int'</code>", "<code>[0.5 1.&nbsp; 1.5]</code>: each element is divided"],
            ], "<code>a</code> holds 1, 2, 3 and <code>b</code> holds 4, 5, 6."),
            T("For a calculation on every element, convert the list first: <code>np.array(a)</code>."),
          ] },
          { kind: "concept", part: "Aggregation", title: "Aggregation functions", blocks: [
            TB(["Function", "Result for a = np.array([2, 4, 9])"], [
              ["<code>np.sum(a)</code> or <code>a.sum()</code>", "<code>15</code>"],
              ["<code>np.mean(a)</code>", "<code>5.0</code>"],
              ["<code>np.max(a)</code>, <code>np.min(a)</code>", "<code>9</code>, <code>2</code>"],
            ]),
            T("For a two-dimensional array, <code>axis=0</code> gives one result for each column, and <code>axis=1</code> one result for each row."),
          ] },
          { kind: "code", part: "Aggregation", title: "Example: column sums, row sums, and the maximum", blocks: [
            EX("import numpy as np\nm = np.array([[1, 2, 3], [4, 5, 6]])\nprint(np.sum(m))\nprint(np.sum(m, axis=0))\nprint(np.sum(m, axis=1))\nprint(np.mean(m))\nprint(np.max(m))", "the whole array, each column, or each row", [
              { c: "np.sum(m)", e: "All six elements: <code>21</code>" },
              { c: "axis=0, axis=1", e: "Column sums 1 + 4, 2 + 5, 3 + 6: <code>[5 7 9]</code>. Row sums: <code>[ 6 15]</code>" },
              { c: "np.mean(m), np.max(m)", e: "<code>3.5</code> and <code>6</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>np.array(list)</code> creates an array; it prints without commas.",
              "<code>shape</code>, <code>ndim</code>, <code>size</code> describe it; <code>m[row, col]</code> indexes 2-D arrays.",
              "Operators and np functions work element by element, without loops; two arrays must have the same shape.",
              "A list is different: <code>* 2</code> repeats a list, and <code>+</code> joins two lists.",
              "<code>np.sum</code>, <code>np.mean</code>, <code>np.max</code>, <code>np.min</code>; <code>axis=0</code>: each column, <code>axis=1</code>: each row.",
            ]),
            NEXT("<b>pandas DataFrames</b>. Tables with named columns."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T(PAPER)],
            [RUN("import numpy as np\na = np.array([2, 4, 6, 8])\nprint(a / 2)\nprint(a[1:3])\nprint(a.shape)\nprint(np.mean(a))")],
          ], answerCol: 0, answer: [OUT("[1. 2. 3. 4.]\n[4 6]\n(4,)\n5.0")] },
          { kind: "exercise", title: "Write a program: power of each device", blocks: [
            PQ("Write a program that computes the power of three devices with NumPy arrays.<br>1. Use these values: voltages 12, 24, 230 and currents 2, 0.5, 0.1.<br>2. Display the array of the powers.<br>3. Display the total of the powers.",
              "[24. 12. 23.]\n59.0", "import numpy as np\n# Write your program here\n", null, "Multiply the two arrays: p = v * i. Use np.sum(p) for the total."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`np.array([[1, 2], [3, 4], [5, 6]]).shape` is…", choices: ["(2, 3)", "(3, 2)", "6", "(6,)"], answer: 1, explain: "3 rows and 2 columns." },
            { q: "`np.array([1, 2]) + np.array([10, 20])` is…", choices: ["[1 2 10 20]", "[11 22]", "33", "an error"], answer: 1, explain: "Element-wise addition." },
          ])] },
        ],
      },

      /* =============================== 6. PANDAS: DATAFRAMES =============================== */
      {
        id: "pandas",
        title: "pandas: DataFrames",
        sub: "Creating tables, reading CSV files, inspecting, selecting, column statistics, and plotting.",
        slides: "08:26–32",
        keywords: "pandas dataframe series read_csv head tail info describe std column select iloc mean max plot matplotlib",
        deck: [
          { kind: "overview", title: "pandas: DataFrames", blocks: [
            T("<b>pandas</b> is a library for tables. A <b>DataFrame</b> is a table with named columns and a row index. Each column is a <b>Series</b>."),
            L(["Creating a DataFrame", "Reading and writing CSV files", "Inspecting a table", "Selecting columns and rows", "Column statistics", "Plotting columns"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Creating a DataFrame", title: "Creating a DataFrame", blocks: [
            L([
              "<code>pip install pandas</code>, then <code>import pandas as pd</code>.",
              "<code>pd.DataFrame(dictionary)</code>: each key is a column name, each value is the list of that column.",
              "The rows get the index 0, 1, 2, … automatically.",
            ]),
            CODE('df = pd.DataFrame({"Name": ["Ali", "Bob"], "Age": [25, 30]})\nprint(df)', "  Name  Age\n0  Ali   25\n1  Bob   30", "example"),
          ] },
          { kind: "concept", part: "Reading and writing CSV files", title: "read_csv and to_csv", blocks: [
            TB(["Function", "Effect"], [
              ["<code>pd.read_csv(\"file.csv\")</code>", "reads a CSV file into a DataFrame; the header gives the column names"],
              ["<code>df.to_csv(\"file.csv\", index=False)</code>", "writes the table; index=False leaves out the row numbers"],
              ["<code>pd.read_excel(file)</code>, <code>pd.read_json(file)</code>", "read an Excel file or a JSON file in the same way"],
            ]),
          ] },
          { kind: "code", part: "Reading and writing CSV files", title: "First example: a table from a CSV file", blocks: [
            EX('import pandas as pd\nwith open("staff.csv", "w") as f:\n    f.write("Name,Age,City\\n")\n    f.write("Ali,25,Bangkok\\n")\n    f.write("Bob,30,Chiang Mai\\n")\n    f.write("Char,35,Phuket\\n")\ndf = pd.read_csv("staff.csv")\nprint(df)', "the file becomes a table", [
              { c: 'pd.read_csv("staff.csv")', e: "Three rows; the columns Name, Age, City." },
              { c: "print(df)", e: "The table with the index 0, 1, 2 on the left." },
            ]),
          ] },
          { kind: "concept", part: "Inspecting a table", title: "Inspecting a table", blocks: [
            TB(["Code", "Result"], [
              ["<code>df.head(n)</code>", "the first n rows (default 5)"],
              ["<code>df.tail(n)</code>", "the last n rows"],
              ["<code>df.shape</code>", "(rows, columns)"],
              ["<code>df.info()</code>", "the columns, their types, and missing values"],
              ["<code>df.describe()</code>", "count, mean, min, max, … of each numeric column"],
            ]),
          ] },
          { kind: "code", part: "Inspecting a table", title: "Example: head() and shape", cols: [
            [CODE('import pandas as pd\ndf = pd.DataFrame({\n    "Name": ["Ali", "Bob", "Char"],\n    "Age": [25, 30, 35]})\nprint(df.head(2))\nprint(df.shape)', null, "program")],
            [CODE("  Name  Age\n0  Ali   25\n1  Bob   30\n(3, 2)", null, "output", "text")],
          ] },
          { kind: "code", part: "Inspecting a table", title: "Example: describe()", cols: [
            [CODE('import pandas as pd\ndf = pd.DataFrame({\n    "Name": ["Ali", "Bob", "Char"],\n    "Age": [25, 30, 35]})\nprint(df.describe())', null, "program"),
              T("<b>std</b> is the standard deviation: how far the values lie from the mean. <b>25%</b>, <b>50%</b>, <b>75%</b>: a quarter, a half (the median), and three quarters of the values lie below this value.")],
            [CODE("        Age\ncount   3.0\nmean   30.0\nstd     5.0\nmin    25.0\n25%    27.5\n50%    30.0\n75%    32.5\nmax    35.0", null, "output", "text")],
          ] },
          { kind: "concept", part: "Selecting columns and rows", title: "Selecting columns and rows", blocks: [
            TB(["Code", "Result"], [
              ["<code>df[\"Age\"]</code>", "one column: a <b>Series</b>, the values of the column with the row index"],
              ["<code>df[\"Age\"].tolist()</code>", "the values of the column as a list"],
              ["<code>df[[\"Name\", \"City\"]]</code>", "several columns (a DataFrame): note the double brackets"],
              ["<code>df.iloc[0]</code>", "the row at position 0; positions count from 0, as in a list"],
            ]),
          ] },
          { kind: "code", part: "Selecting columns and rows", title: "Example: one column and one row", blocks: [
            EX('import pandas as pd\ndf = pd.DataFrame({\n    "Name": ["Ali", "Bob", "Char"],\n    "Age": [25, 30, 35]})\nprint(df["Age"])\nprint(df["Age"].tolist())\nprint(df.iloc[1]["Age"])', "a Series, a list, a row", [
              { c: 'df["Age"]', e: "A Series: one line for each row, with the index and the value (<code>0&nbsp;&nbsp;&nbsp;&nbsp;25</code>), then <code>Name: Age, dtype: int64</code>" },
              { c: 'df["Age"].tolist()', e: "Only the values, as a list: <code>[25, 30, 35]</code>" },
              { c: 'df.iloc[1]["Age"]', e: "The row at position 1, then its Age: <code>30</code>" },
            ]),
          ] },
          { kind: "concept", part: "Column statistics", title: "Column statistics", blocks: [
            TB(["Code", "Result for Age = 25, 30, 35"], [
              ["<code>df[\"Age\"].mean()</code>", "<code>30.0</code>"],
              ["<code>df[\"Age\"].max()</code>, <code>.min()</code>", "<code>35</code>, <code>25</code>"],
              ["<code>df[\"Age\"].sum()</code>", "<code>90</code>"],
            ]),
          ] },
          { kind: "code", part: "Plotting columns", title: "Example: plotting two columns", blocks: [
            EX('import pandas as pd\nimport matplotlib.pyplot as plt\nwith open("day.csv", "w") as f:\n    f.write("hour,temp\\n6,23\\n9,27\\n")\n    f.write("12,31\\n15,30\\n")\ndf = pd.read_csv("day.csv")\nplt.plot(df["hour"], df["temp"])\nplt.xlabel("Hour")\nplt.ylabel("Temperature (C)")\nplt.show()', "data from a file as a line plot", [
              { c: 'pd.read_csv("day.csv")', e: "A table with the columns hour and temp." },
              { c: 'plt.plot(df["hour"], df["temp"])', e: "A column is used like a list (Topic 07): hour gives the x values, temp the y values." },
              { c: "plt.xlabel, plt.ylabel", e: "The axis labels, with the unit." },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A DataFrame is a table: named columns (Series) and a row index.",
              "<code>pd.DataFrame(dict)</code> or <code>pd.read_csv(file)</code> creates it; <code>to_csv</code> saves it.",
              "<code>head()</code>, <code>tail()</code>, <code>shape</code>, <code>info()</code>, <code>describe()</code> inspect it.",
              "<code>df[\"col\"]</code> selects a column (a Series), <code>df.iloc[n]</code> a row; <code>.mean()</code>, <code>.max()</code>, <code>.min()</code>, <code>.sum()</code> summarize a column.",
              "<code>plt.plot(df[\"x\"], df[\"y\"])</code> plots one column against another.",
            ]),
            NEXT("<b>pandas: filtering, sorting, and changing data</b>."),
          ] },
          { kind: "exercise", title: "Write a program: average score", blocks: [
            PQ("Write a program that creates a DataFrame of students and displays the average score.<br>1. The columns are <code>name</code> and <code>score</code>.<br>2. Use these values: Ann 78, Ben 85, Cat 92.",
              "85.0", "import pandas as pd\n# Write your program here\n", null, 'Use df["score"].mean() for the average.'),
          ] },
          { kind: "exercise", title: "Write a program: the number of rows and the maximum", blocks: [
            PQ("Complete the program. Lines 2 and 3 already write the file \"log.csv\".<br>1. Read the file with <code>pd.read_csv()</code>.<br>2. Display the number of rows.<br>3. Display the largest value of the column <code>temp</code>.",
              "4\n31", 'import pandas as pd\nwith open("log.csv", "w") as f:\n    f.write("hour,temp\\n0,22\\n6,24\\n12,31\\n18,26\\n")\n# Write your program here\n', null, 'Use df.shape[0] for the number of rows, and df["temp"].max() for the largest value.'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "What is a DataFrame?", choices: ["a single number", "a table with named columns and a row index", "a file mode", "a NumPy function"], answer: 1, explain: "A DataFrame is the pandas table." },
            { q: "Which code shows the first 5 rows?", choices: ["df.tail()", "df.head()", "df.info()", "df[5]"], answer: 1, explain: "head() shows the first rows (5 by default)." },
          ])] },
        ],
      },

      /* =============================== 7. PANDAS: FILTER, SORT, CHANGE =============================== */
      {
        id: "pandas-filter",
        title: "pandas: filtering, sorting, and changing data",
        sub: "Selecting rows by a condition, sorting, new columns, and groups.",
        slides: "08:32–37",
        keywords: "pandas filter condition and or sort_values loc iloc reset_index new column concat groupby mean",
        deck: [
          { kind: "overview", title: "pandas: filtering, sorting, and changing data", blocks: [
            T("pandas answers questions about a table with short expressions: which rows meet a condition, in which order, and what each group contains."),
            L(["Filtering rows", "Sorting", "Adding and changing columns", "Groups"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Filtering rows", title: "Filtering rows with a condition", blocks: [
            L([
              "<code>df[\"Age\"] &gt; 28</code> gives True or False for every row.",
              "<code>df[df[\"Age\"] &gt; 28]</code> keeps only the rows where it is True.",
              "Combine conditions with <code>&amp;</code> (and) and <code>|</code> (or), each condition in parentheses: <code>df[(df[\"Age\"] &gt; 20) &amp; (df[\"City\"] == \"Bangkok\")]</code>.",
              "The keywords <code>and</code> and <code>or</code> do not work here: they need a single True or False, not one value for every row. They raise <code>ValueError: The truth value of a Series is ambiguous. Use a.empty, a.bool(), a.item(), a.any() or a.all().</code> The same error appears without the parentheses.",
            ]),
          ] },
          { kind: "visual", part: "Filtering rows", title: "A filter, row by row", blocks: [
            W("dfFilter", { title: "df", columns: ["Name", "Age", "City"], rows: [["Ali", 25, "Bangkok"], ["Bob", 30, "Chiang Mai"], ["Char", 35, "Phuket"]], scenarios: [
              { label: "df[df['Age'] > 28]", filter: { col: "Age", op: ">", value: 28 } },
            ] }),
          ] },
          { kind: "code", part: "Filtering rows", title: "Example: rows above an age", blocks: [
            EX('import pandas as pd\ndf = pd.DataFrame({\n    "Name": ["Ali", "Bob", "Char"],\n    "Age": [25, 30, 35]})\nolder = df[df["Age"] > 28]\nprint(older["Name"].tolist())\nprint(len(older))', "a boolean filter", [
              { c: 'df[df["Age"] > 28]', e: "The rows of Bob and Char." },
              { c: "print(...)", e: "<code>['Bob', 'Char']</code> and <code>2</code>" },
            ]),
          ] },
          { kind: "code", part: "Filtering rows", title: "Example: two conditions", blocks: [
            EX('import pandas as pd\ndf = pd.DataFrame({\n    "temp": [24, 31, 35, 28],\n    "hum": [60, 45, 30, 70]})\nboth = df[(df["temp"] > 30) &\n          (df["hum"] < 40)]\neither = df[(df["temp"] > 30) |\n            (df["hum"] < 40)]\nprint(both["temp"].tolist())\nprint(either["temp"].tolist())', "& and |, each condition in parentheses", [
              { c: "(...) & (...)", e: "Both conditions are True only for temp 35, hum 30: <code>[35]</code>" },
              { c: "(...) | (...)", e: "At least one condition is True in two rows: <code>[31, 35]</code>" },
            ]),
          ] },
          { kind: "concept", part: "Sorting", title: "sort_values, loc and iloc, reset_index", blocks: [
            TB(["Code", "Result"], [
              ["<code>df.sort_values(\"Age\")</code>", "a new table sorted by Age, increasing"],
              ["<code>df.sort_values(\"Age\", ascending=False)</code>", "sorted by Age, decreasing"],
              ["<code>df.loc[0]</code>", "the row with the index <b>label</b> 0"],
              ["<code>df.iloc[0]</code>", "the row at <b>position</b> 0, the first row"],
              ["<code>df.reset_index(drop=True)</code>", "renumbers the labels 0, 1, 2, … after a sort or a filter"],
            ]),
            T("In a new table, label and position are the same. A sort or a filter moves or removes rows, but each row keeps its label: then loc and iloc give different rows."),
          ] },
          { kind: "code", part: "Sorting", title: "Example: the highest first", blocks: [
            EX('import pandas as pd\ndf = pd.DataFrame({\n    "Name": ["Ali", "Bob", "Char"],\n    "Score": [78, 92, 85]})\ntop = df.sort_values("Score",\n                     ascending=False)\nprint(top.loc[0]["Name"])\nprint(top.iloc[0]["Name"])\ntop = top.reset_index(drop=True)\nprint(top.loc[0]["Name"])', "sort, then renumber", [
              { c: "sort_values(...)", e: "Bob 92, Char 85, Ali 78. Each row keeps its index label: 1, 2, 0." },
              { c: "top.loc[0], top.iloc[0]", e: "Label 0 is still the row of Ali: <code>Ali</code>. Position 0 is the first row: <code>Bob</code>" },
              { c: "reset_index(drop=True)", e: "Renumbers the labels 0, 1, 2. Label 0 is now the first row: <code>Bob</code>" },
            ]),
          ] },
          { kind: "concept", part: "Adding and changing columns", title: "New and changed columns", blocks: [
            L([
              "<code>df[\"Power\"] = df[\"Voltage\"] * df[\"Current\"]</code> adds a column computed element by element.",
              "<code>df[\"Age\"] = df[\"Age\"] + 1</code> changes a column.",
              "<code>pd.concat([df1, df2])</code> joins two tables with the same columns, one below the other.",
            ]),
          ] },
          { kind: "code", part: "Adding and changing columns", title: "Example: a computed column", blocks: [
            EX('import pandas as pd\ndf = pd.DataFrame({\n    "Device": ["pump", "fan"],\n    "Voltage": [220, 110],\n    "Current": [1.5, 0.4]})\npower = df["Voltage"] * df["Current"]\ndf["Power"] = power\nprint(df)', "every row at once, without a loop", [
              { c: 'df["Voltage"] * df["Current"]', e: "Row by row: 220 × 1.5 = 330.0 and 110 × 0.4 = 44.0" },
              { c: 'df["Power"] = power', e: "Stores the results as a new column." },
              { c: "print(df)", e: "The table now has four columns." },
            ]),
          ] },
          { kind: "concept", part: "Groups", title: "groupby", blocks: [
            L([
              "<code>df.groupby(\"Dept\")[\"Salary\"].mean()</code> splits the rows into groups by Dept and computes the mean salary of each group.",
              "The result has one value per group; loop over it with <code>.items()</code>, as with a dictionary.",
            ]),
          ] },
          { kind: "code", part: "Groups", title: "Example: mean salary per department", blocks: [
            EX('import pandas as pd\ndf = pd.DataFrame({\n    "Dept": ["IT", "HR", "IT"],\n    "Salary": [50000, 40000, 60000]})\ngroups = df.groupby("Dept")\navg = groups["Salary"].mean()\nfor dept, value in avg.items():\n    print(dept, value)', "one mean per group", [
              { c: "groupby(\"Dept\")", e: "Groups: HR (40000) and IT (50000, 60000)." },
              { c: 'groups["Salary"].mean()', e: "The mean salary of each group." },
              { c: "for dept, value", e: "<code>HR 40000.0</code>, <code>IT 55000.0</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>df[df[\"col\"] &gt; x]</code> filters rows; combine conditions with &amp; and |, each in parentheses, not with and / or.",
              "<code>sort_values(col, ascending=False)</code> sorts; each row keeps its label. <code>loc</code> uses the label, <code>iloc</code> the position; <code>reset_index(drop=True)</code> renumbers.",
              "<code>df[\"new\"] = expression</code> adds a computed column.",
              "<code>df.groupby(col)[other].mean()</code> summarizes each group.",
            ]),
            NEXT("<b>Trace challenges</b>. Ten programs to trace by hand. They use the rules of all lessons of this chapter."),
          ] },
          { kind: "exercise", title: "Write a program: filter by price", blocks: [
            PQ("Complete the program. Lines 2 and 3 already write the file \"items.csv\".<br>1. Read the file with <code>pd.read_csv()</code>.<br>2. Keep the rows with a price above 100.<br>3. Display the names of these rows as a list.",
              "['motor', 'sensor']", 'import pandas as pd\nwith open("items.csv", "w") as f:\n    f.write("name,price\\ncable,40\\nmotor,250\\nsensor,120\\n")\n# Write your program here\n', null, 'Use df[df["price"] > 100] for the rows, and ["name"].tolist() for the list of names.'),
          ] },
          { kind: "exercise", title: "Write a program: sort", blocks: [
            PQ("Complete the program: sort the table and display one column.<br>1. Sort the table by the column <code>temp</code>, from the highest value to the lowest.<br>2. Display the column <code>hour</code> of the sorted table as a list.",
              "[12, 18, 6, 0]", 'import pandas as pd\ndf = pd.DataFrame({"hour": [0, 6, 12, 18], "temp": [22, 24, 31, 26]})\n', null, 'Use df.sort_values("temp", ascending=False), then ["hour"].tolist().'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which code keeps only the rows with Age above 28?", choices: ["df[\"Age\"] > 28", "df[df[\"Age\"] > 28]", "df.Age(28)", "df.filter(28)"], answer: 1, explain: "The condition inside df[...] selects the rows." },
            { q: "`df.sort_values(\"Age\")` sorts…", choices: ["decreasing", "increasing", "by the index", "randomly"], answer: 1, explain: "The default is ascending (increasing)." },
          ])] },
        ],
      },

      /* =============================== 8. TRACE CHALLENGES =============================== */
      {
        id: "trace",
        title: "Trace challenges",
        sub: "Ten programs to execute by hand, in four levels.",
        keywords: "trace table trace the code execute by hand file csv json numpy pandas variable values output challenge",
        deck: [
          { kind: "overview", title: "Trace challenges", blocks: [
            T("Each program in this lesson has at least one line that is easy to trace wrongly. The task shows the content of each file. Every line of a file ends with a line break."),
            L([
              "Write one row for each line that runs. When the program is beside the table, write the number of the line in the column <b>Line</b>.",
              "A <code>with</code> line gets two rows: when the file is opened, and when the block ends and the file is closed. A <code>for</code> line gets one more row when the loop ends.",
              "On an <code>if</code> line, write True or False in the column <b>Condition</b>. A <code>try:</code> line gets a row. An <code>except</code> line gets a row only after an error.",
              "After each line, write the value of every variable. A file object, a csv reader, and a DataFrame have no column.",
              "Write text in quotes, with <code>\\n</code> for a line break: <code>'on\\n'</code>. Write an array as <code>print()</code> displays it: <code>[1 2 3]</code>.",
            ], "Rules of a trace", true),
          ] },
          { kind: "concept", title: "The four levels", blocks: [
            T("Each level uses only the lessons that it names. A level can be done when its lessons are complete."),
            TB(["Level", "Lessons", "Programs", "Subject"], [
              ["1", "1 and 2", "1 to 3", "the position in a file, the lines of a file as text, the modes, a missing file"],
              ["2", "3 and 4", "4 to 6", "<code>csv.reader</code>, <code>csv.DictReader</code>, the types of JSON values"],
              ["3", "5", "7 and 8", "operators on a list and on an array, rows and columns, and a program that stops"],
              ["4", "6 and 7", "9 and 10", "column statistics, a filter, a sort, and a logical error"],
            ]),
          ] },
          { kind: "exercise", title: "Level 1: pin names", blocks: [
            T(TRACE + SIDE + "<br>3. The file <code>pins.txt</code> holds three lines: <code>A1</code>, <code>B22</code>, and <code>C3</code>."),
            CH(C_position),
          ], answer: [
            L([
              "Line 2: <code>readline()</code> returns the line with its line break: <code>'A1\\n'</code>, 3 characters.",
              "Line 3: <code>read(2)</code> continues at position 3: <code>'B2'</code>. Line 4: <code>readlines()</code> returns the rest of the file as a list. The first element is the rest of the line B22: <code>'2\\n'</code>.",
              "Line 5: the position is at the end of the file, so <code>read()</code> returns the empty text <code>''</code>. Its length is 0.",
            ]),
          ] },
          { kind: "exercise", title: "Level 1: tank levels", blocks: [
            T(TRACE + SIDE_IF + "<br>3. The file <code>levels.txt</code> holds three lines: <code>12</code>, an empty line, and <code>5</code>."),
            CH(C_lines),
          ], answer: [
            L([
              "Line 4 stores each line with its line break: <code>'12\\n'</code>. Line 5 removes the line break.",
              "The empty line of the file is <code>'\\n'</code>. <code>strip()</code> gives <code>''</code>, so line 6 is True, and <code>continue</code> returns to line 4.",
              "Line 8 joins text: <code>'12' + '5'</code> → <code>'125'</code>. Line 9 adds numbers: <code>12 + 5</code> → <code>17</code>.",
              "Line 11: <code>int('125') - 17</code> → <code>108</code>.",
            ]),
          ] },
          { kind: "exercise", title: "Level 1: a run counter", blocks: [
            T(TRACE + SIDE + "<br>3. The file <code>n.txt</code> does not exist when the program starts.<br>4. After the trace, write the content of <code>n.txt</code>."),
            CH(C_counter),
          ], answer: [
            L([
              "run = 0: line 3 raises a FileNotFoundError, so line 4 does not run, and line 6 sets <code>count</code> to 0. Mode <code>\"a\"</code> creates the file: the file holds <code>1</code>.",
              "run = 1: the file exists, so the except block does not run. Mode <code>\"a\"</code> writes at the end, and <code>write()</code> adds no line break: the file holds <code>12</code>.",
              "run = 2: <code>int('12')</code> is 12, so <code>count</code> becomes 13. At the end, the file holds <code>1213</code>.",
              "With mode <code>\"w\"</code> in line 8, the file holds only the last number, and the output is 3.",
            ]),
          ] },
          { kind: "exercise", title: "Level 2: a parts list", blocks: [
            T(TRACE_ROWS("two") + SIDE_IF + "<br>3. The list <code>rows</code> has no column.<br>4. The file <code>parts.csv</code> holds the four lines below. Line 3 of the file is empty."),
            CODE("name,qty\nnut,40\n\npin,9", null, "parts.csv", "text"),
            CH(C_parts, 2),
          ], answer: [
            L([
              "<code>rows</code> holds 4 rows: the header is a row, and the empty line is the empty list <code>[]</code>.",
              "Line 5: <code>rows[1:]</code> leaves out the header. Line 6 is True for <code>[]</code>, so <code>continue</code> returns to line 5.",
              "Line 10: <code>rows[1][1]</code> is the text <code>'40'</code>, so <code>* 2</code> repeats the text: <code>4040</code>.",
            ]),
          ] },
          { kind: "exercise", title: "Level 2: fan speeds", blocks: [
            T(TRACE_ROWS("two") + SIDE_IF + "<br>3. The dictionary <code>row</code> has no column.<br>4. The file <code>fans.csv</code> holds the four lines below."),
            CODE("fan,rpm\nA,800\nB,1200\nC,95", null, "fans.csv", "text"),
            CH(C_fastest, 2),
          ], answer: [
            L([
              "<code>csv.DictReader</code> uses the header as the keys, so the loop runs 3 times. Every value is text: <code>'800'</code>.",
              "Line 8 compares text, character by character. <code>'1200' &gt; '800'</code> is False: <code>'1'</code> comes before <code>'8'</code>. <code>'95' &gt; '800'</code> is True: <code>'9'</code> comes after <code>'8'</code>.",
              "The output is <code>C 95</code>, but fan B is the fastest. A correct program compares numbers: <code>best = 0</code> in line 2, and <code>rpm = int(row[\"rpm\"])</code> in line 7.",
            ]),
          ] },
          { kind: "exercise", title: "Level 2: a sensor log", blocks: [
            T(TRACE_ROWS("two") + SIDE + "<br>3. The dictionary <code>log</code> has no column.<br>4. The file <code>log.json</code> holds the line below."),
            CODE('{"t": [21, "19", 20.5], "ok": true}', null, "log.json", "text"),
            CH(C_log, 2),
          ], answer: [
            L([
              "<code>json.load()</code> keeps the type of each value: <code>21</code> is an int, <code>\"19\"</code> is text, and <code>20.5</code> is a float. Line 6 gives <code>42</code>, <code>'1919'</code>, and <code>41.0</code>.",
              "Line 7: <code>float('1919')</code> is <code>1919.0</code>, so the total is 2002.0. With the number 19 in the file, the total is 121.0.",
              "Line 8: <code>len(log)</code> is the number of keys: 2.",
              "Line 9: JSON <code>true</code> is the bool <code>True</code> in Python. Line 10: <code>json.dumps()</code> writes <code>True</code> as <code>true</code>.",
            ]),
          ] },
          { kind: "exercise", title: "Level 3: a list and an array", blocks: [
            T(TRACE_ROWS("two")),
            CH(C_twice, 2),
          ], answer: [
            L([
              "Lines 4 and 6 work on a list: <code>* 2</code> repeats the list, and <code>+ [1]</code> joins two lists.",
              "Lines 5 and 8 work on an array: <code>* 2</code> multiplies every element, and <code>+ 1</code> adds 1 to every element.",
              "Line 7: <code>/</code> gives floats: <code>[4. 2.]</code>, with a dot after each number.",
              "Line 3 copies the values of the list: line 4 changes <code>nums</code>, and <code>arr</code> stays <code>[4 2]</code>.",
            ]),
          ] },
          { kind: "exercise", title: "Level 3: the program stops", blocks: [
            T("The program stops with an error message before its last line.<br>1. Complete the trace table on paper. The first three rows are complete.<br>2. In the column Line, write the number of the line that runs.<br>3. The list <code>data</code> and the array <code>m</code> have no column.<br>4. In the last row, write the name of the error in the column Output."),
            CH(C_shapes, 3),
          ], answer: [
            L([
              "Line 4: <code>m[1]</code> is row 1: <code>[2 1 3]</code>. Line 5: <code>m[:, 1]</code> is column 1: <code>[0 1]</code>.",
              "Line 6: <code>axis=1</code> gives one sum for each row: 2 elements. Line 7 runs: both arrays have 2 elements.",
              "Line 8: <code>axis=0</code> gives one sum for each column: 3 elements. Line 9 runs: both arrays have 3 elements.",
              "Line 10 stops with a <b>ValueError</b>: <code>col</code> has 2 elements, and <code>tot</code> has 3. Line 11 does not run.",
            ]),
          ] },
          { kind: "exercise", title: "Level 4: a table of pumps", blocks: [
            T(TRACE_ROWS("two") + "<br>2. The tables <code>df</code> and <code>big</code> have no column.<br>3. The file <code>pumps.csv</code> holds the four lines below."),
            CODE("name,kw,h\nA,1,10\nB,5,4\nC,3,6", null, "pumps.csv", "text"),
            CH(C_pumps, 2),
          ], answer: [
            L([
              "Line 3: the header gives the column names, so the table has 3 rows. Line 4: <code>mean()</code> gives a float: <code>3.0</code>.",
              "Line 6: <code>3 &gt;= 3.0</code> is True, so the rows of B and C stay.",
              "Line 7 changes nothing: <code>sort_values()</code> returns a new table, and the program does not store it. The order stays B, C.",
              "Line 9: <code>20 + 18</code> → <code>38</code>. Line 10: the new column <code>e</code> is the 4th column: <code>(3, 4)</code>.",
            ]),
          ] },
          { kind: "exercise", title: "Level 4: the first wrong value", blocks: [
            T("The program must display the battery pack with the lowest energy, and this energy. The correct output is <code>B 8</code>.<br>1. Complete the trace table on paper. The first two rows are complete.<br>2. The tables <code>df</code> and <code>low</code> have no column. The file <code>cells.csv</code> holds the four lines below.<br>3. Write the number of the line with the first wrong value, and the corrected line."),
            CODE("name,v,ah\nA,4,5\nB,2,4\nC,3,6", null, "cells.csv", "text"),
            CH(C_lowest, 2),
          ], answer: [
            T("Line 7 has the first wrong value. The sort moves the rows, but each row keeps its label: the first row of <code>low</code> is B, with the label 1. <code>loc[0]</code> takes the row with the label 0: the row of A. <code>iloc[0]</code> takes the first row."),
            CODE('name = low.iloc[0]["name"]', null, "line 7, corrected"),
          ] },
        ],
      },

      /* =============================== 9. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete data processing problems.",
        slides: "08:39",
        keywords: "practice numpy array row sum dataframe average csv filter groupby file summary maximum minimum try except",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Solve every problem with the five steps:"),
            L([
              "<b>Understand</b>: the data and the required output.",
              "<b>Design</b>: choose the tool: a text file for lines of values, CSV or JSON for tables and settings, NumPy for calculations on arrays, pandas for tables with named columns.",
              "<b>Code</b>: write the program.",
              "<b>Test</b>: compare the output with a hand calculation on the small data.",
              "<b>Correct</b>: if the output differs, find the wrong step, correct it, and test again.",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: a 3 × 3 array", blocks: [
            T("Create a 3 × 3 array with the values 1 to 9, row by row. Display the sum of each row. Then display the largest value of the array."),
            IPO([["Data", "np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])"], ["Output", "the row sums, then the maximum"], ["Processing", "np.sum(m, axis=1), np.max(m)"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Write the program of Problem 1. The output must match the target output.", "[ 6 15 24]\n9", "import numpy as np\n# Write your program here\n", null, "Use np.sum(m, axis=1) for the row sums, and np.max(m) for the largest value."),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: readings from a text file", blocks: [
            T("A data logger writes one temperature on each line of a text file. A line can contain text that is not a number. Write the maximum, the minimum, and the average of the valid readings into a summary file."),
            IPO([
              ["Input", "the file temps.txt: one reading per line"],
              ["Output", "the file summary.txt with three lines: max, min, avg (1 decimal place). Display the file."],
              ["Processing", "read each line, float(), collect the values in a list; max(), min(), sum() / len()"],
              ["Exceptions (Topic 07)", "ValueError from float(): skip the line. FileNotFoundError from open(): display \"temps.txt not found\"."],
              ["Test", "valid readings 22.0, 24.5, 27.0: (22.0 + 24.5 + 27.0) / 3 = 24.5"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("Write the program of Problem 2.<br>1. Write \"summary.txt\" with the three lines of the target output.<br>2. Read \"summary.txt\", and display its text.<br>3. Use try for the ValueError and for the FileNotFoundError.", "max 27.0\nmin 22.0\navg 24.5", 'with open("temps.txt", "w") as f:\n    f.write("22.0\\n24.5\\nerror\\n27.0\\n")\n# Write your program here\n', null, 'Lines 1 and 2 write temps.txt, and the line "error" is not a number. Use try: values.append(float(line)) and except ValueError: continue. Then use f.write("max " + str(max(values)) + "\\n").'),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: mean salary per department", blocks: [
            T("Create a DataFrame of employees with the columns name, dept, and salary. Display the mean salary of each department."),
            IPO([["Data", "Ann IT 50000, Ben HR 40000, Cid IT 60000, Dee HR 44000"], ["Output", "one line per department"], ["Processing", "groupby(\"dept\")[\"salary\"].mean()"]]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Write the program of Problem 3.<br>Display each department and its mean salary on one line, as in the target output.", "HR 42000.0\nIT 55000.0", "import pandas as pd\n# Write your program here\n", null, "Use for dept, value in avg.items(): and print(dept, value)."),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: a JSON sensor message", blocks: [
            T("A sensor sends <code>{\"id\": \"T7\", \"values\": [21.5, 22.5, 23.5]}</code> as a JSON string. Display the id and the average of the values."),
            IPO([["Input", "a JSON string"], ["Output", "the id and the average"], ["Processing", "json.loads, then sum / len of the list"]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", blocks: [
            PQ("Write the program of Problem 4.<br>1. Use the string <code>text</code> in line 2 of the program.<br>2. Display the id and the average on one line, as in the target output.", "T7 22.5", 'import json\ntext = \'{"id": "T7", "values": [21.5, 22.5, 23.5]}\'\n# Write your program here\n', null, 'Use data = json.loads(text). Then use print(data["id"], sum(v) / len(v)) for the list v = data["values"].'),
          ] },
          { kind: "summary", title: "Chapter summary", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1–2. Files", "<code>with open(name, mode)</code>; r / w / a / x; read, readline, readlines; data from a file is a str; FileNotFoundError."],
              ["3–4. CSV and JSON", "csv.writer / reader / DictReader; convert before comparing; json.dump / load / dumps / loads."],
              ["5. NumPy", "Arrays, shape, element-wise operations (not as with lists), np.sum / mean / max, axis."],
              ["6–7. pandas", "DataFrame, read_csv, head, describe, df[\"col\"], plotting columns, filters with &amp; and |, sort_values, groupby."],
            ]),
            N("<b>Topic 09: Algorithms and efficiency</b>. How to measure and compare the speed of algorithms.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
