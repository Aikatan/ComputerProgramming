/* ===================== Topic 08 - Data Processing =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: text files -> file modes, errors, folders -> CSV -> JSON -> NumPy -> pandas (2 lessons) -> practice.
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
  const TT = (trace, rows) => W("traceTable", rows ? { trace, rows } : { trace });

  /* ---------- traces ---------- */
  const T_np = {
    code: ["import numpy as np", "a = np.array([1, 2, 3])", "b = a * 2", "c = a + b", "print(c, c.sum())"],
    steps: [
      { line: 0, note: "NumPy is imported with the short name np." },
      { line: 1, note: "np.array turns the list into an array.", set: { a: "array([1, 2, 3])" } },
      { line: 2, note: "a * 2 multiplies every element: no loop is needed.", set: { b: "array([2, 4, 6])" } },
      { line: 3, note: "a + b adds the elements at the same positions.", set: { c: "array([3, 6, 9])" } },
      { line: 4, note: "An array prints without commas. c.sum() is 18.", print: "[3 6 9] 18" },
    ],
  };
  const FILE_STEPS = [
    { line: 0, mode: "w", status: "open", content: [], exists: true, note: "open(..., 'w') creates the file (or empties it) and opens it for writing." },
    { line: 1, mode: "w", status: "open", content: ["21.5"], flow: "write", note: "write adds the text \"21.5\\n\": one line." },
    { line: 2, mode: "w", status: "open", content: ["21.5", "22.0"], flow: "write", note: "A second line." },
    { line: 3, status: "closed", content: ["21.5", "22.0"], note: "The with block ends: the file is closed." },
    { line: 3, mode: "r", status: "open", content: ["21.5", "22.0"], note: "The file is opened again, for reading." },
    { line: 4, mode: "r", status: "open", content: ["21.5", "22.0"], flow: "read", out: "21.5\n22.0", note: "read() returns the whole content as one string; print displays it." },
    { line: 4, status: "closed", content: ["21.5", "22.0"], out: "21.5\n22.0", note: "The with block ends: the file is closed." },
  ];

  App.registerTopic({
    id: "t08",
    title: "Data Processing",
    short: "Data Processing",
    blurb: "Text files, CSV and JSON data, NumPy arrays, and pandas DataFrames.",
    intro: "This chapter covers reading and writing data: text files, CSV and JSON files, and the NumPy and pandas libraries for numerical and tabular data. Each lesson uses only what the lessons before it have explained:<br>text files → file modes and errors → CSV → JSON → NumPy → pandas → practice.",
    lessons: [
      /* =============================== 1. TEXT FILES =============================== */
      {
        id: "file-handling",
        title: "Text files",
        sub: "Opening and closing files, writing lines, and reading them back.",
        slides: "08:4, 7–11",
        keywords: "file open close with write writelines read readline readlines newline",
        deck: [
          { kind: "overview", title: "Text files", blocks: [
            T("A <b>file</b> stores data on the disk, so that it remains after the program ends. A text file holds lines of characters."),
            L(["Opening and closing a file", "Writing to a file", "Reading a whole file", "Reading line by line"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Opening and closing a file", title: "open(), close(), and with", blocks: [
            CODE('with open("data.txt", "w") as f:\n    statements that use f', null, "syntax"),
            L([
              "<code>open(name, mode)</code> opens a file and returns a file object, here f. <code>\"w\"</code> writes, <code>\"r\"</code> reads (Lesson 2 lists all modes).",
              "A file must be closed after use: <code>f.close()</code>.",
              "<code>with</code> closes the file automatically at the end of its block, also after an error. Always use with.",
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
          { kind: "concept", part: "Writing to a file", title: "The file after each statement", blocks: [
            TB(["Statement", "File", "Content of readings.txt"], [
              ['<code>open("readings.txt", "w")</code>', "open for writing", "(empty)"],
              ['<code>f.write("21.5\\n")</code>', "open", "21.5"],
              ['<code>f.write("22.0\\n")</code>', "open", "21.5 / 22.0"],
              ["end of the with block", "closed", "21.5 / 22.0"],
              ["<code>f.read()</code>", "open for reading", "returns <code>'21.5\\n22.0\\n'</code>"],
            ]),
          ] },
          { kind: "code", part: "Writing to a file", title: "Example: writelines", blocks: [
            EX('lines = ["pump\\n", "fan\\n", "heater\\n"]\nwith open("devices.txt", "w") as f:\n    f.writelines(lines)\nwith open("devices.txt") as f:\n    print(f.read())', "each string already ends with \\n", [
              { c: "f.writelines(lines)", e: "Writes the three strings; their \\n make three lines." },
              { c: 'open("devices.txt")', e: "Mode \"r\" is the default." },
            ]),
          ] },
          { kind: "concept", part: "Reading a whole file", title: "read() and read(n)", blocks: [
            TB(["Method", "Returns"], [
              ["<code>f.read()</code>", "the whole remaining content as one string"],
              ["<code>f.read(n)</code>", "the next n characters"],
            ]),
            T("The file object remembers its position: the next read continues where the previous one stopped."),
          ] },
          { kind: "code", part: "Reading a whole file", title: "Example: read(n) continues", blocks: [
            EX('with open("code.txt", "w") as f:\n    f.write("ABCDEFG")\nwith open("code.txt") as f:\n    print(f.read(3))\n    print(f.read(2))\n    print(f.read())', "the position moves on", [
              { c: "f.read(3)", e: "<code>ABC</code>" },
              { c: "f.read(2)", e: "Continues: <code>DE</code>" },
              { c: "f.read()", e: "The rest: <code>FG</code>" },
            ]),
          ] },
          { kind: "concept", part: "Reading line by line", title: "readline(), readlines(), and a for loop", blocks: [
            TB(["Code", "Result"], [
              ["<code>f.readline()</code>", "the next line, including its \"\\n\""],
              ["<code>f.readlines()</code>", "a list of all lines, each with its \"\\n\""],
              ["<code>for line in f:</code>", "one line per iteration"],
            ]),
            T("<code>line.strip()</code> removes the \"\\n\" at the end; <code>float(line)</code> converts a number line."),
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
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>with open(name, mode) as f:</code> opens a file and closes it at the end of the block.",
              "<code>write()</code> and <code>writelines()</code> write strings; add \"\\n\" for new lines.",
              "<code>read()</code>: everything; <code>read(n)</code>: n characters; the position moves on.",
              "<code>readline()</code>: one line; <code>readlines()</code>: a list; <code>for line in f</code>: a loop.",
            ]),
            NEXT("<b>File modes, errors, and folders</b>. Appending, creating, missing files, and the os module."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output on paper.<br>Then run the program and compare.")],
            [RUN('with open("t.txt", "w") as f:\n    f.write("one\\ntwo\\nthree\\n")\nwith open("t.txt") as f:\n    print(f.read(5))\n    print(f.readline())\n    print(len(f.readlines()))')],
          ] },
          { kind: "exercise", title: "Write a program: save and count", blocks: [
            PQ("Write the three words pump, fan, heater into \"names.txt\", one per line. Then read the file and display the number of lines.",
              "3", "# Write your program here\n", null, "len(f.readlines())"),
          ] },
          { kind: "exercise", title: "Write a program: the maximum reading", blocks: [
            PQ("The starter writes readings to a file. Read the file line by line and display the largest value.",
              "25.4", 'with open("v.txt", "w") as f:\n    f.write("21.5\\n25.4\\n22.0\\n")\n# Read the file here\n', null, "for line in f: value = float(line) ..."),
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
          { kind: "code", part: "Append compared with write", title: "Example: w empties, a adds", blocks: [
            EX('with open("log.txt", "w") as f:\n    f.write("start\\n")\nwith open("log.txt", "a") as f:\n    f.write("running\\n")\nwith open("log.txt") as f:\n    print(f.read())', "a keeps the old content", [
              { c: '"w"', e: "The file now holds only start." },
              { c: '"a"', e: "running is added after start: two lines." },
            ]),
          ] },
          { kind: "code", part: "Append compared with write", title: "Example: w a second time", blocks: [
            EX('with open("log.txt", "w") as f:\n    f.write("start\\n")\nwith open("log.txt", "w") as f:\n    f.write("new\\n")\nwith open("log.txt") as f:\n    print(f.read())', "the old content is lost", [
              { c: 'second open(..., "w")', e: "Empties the file first: only <code>new</code> remains." },
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
              ["<code>os.listdir(path)</code>", "a list of the names in a folder"],
              ["<code>os.path.exists(name)</code>", "True if the file or folder exists"],
              ["<code>os.mkdir(name)</code>", "creates a folder"],
              ["<code>os.remove(name)</code>", "deletes a file"],
            ]),
            T("A file name without a folder refers to the current working folder."),
          ] },
          { kind: "code", part: "The os module", title: "Example: checking before opening", blocks: [
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
            [T("Write the output on paper.<br>Then run the program and compare.")],
            [RUN('with open("m.txt", "w") as f:\n    f.write("A\\n")\nwith open("m.txt", "a") as f:\n    f.write("B\\n")\nwith open("m.txt", "w") as f:\n    f.write("C\\n")\nwith open("m.txt") as f:\n    print(f.read())')],
          ] },
          { kind: "exercise", title: "Write a program: a log file", blocks: [
            PQ("Create \"events.txt\" with the line boot. Then append the lines ready and stop with mode \"a\". Display the file content.",
              "boot\nready\nstop", "# Write your program here\n", null, 'open("events.txt", "a")'),
          ] },
          { kind: "exercise", title: "Write a program: a missing file", blocks: [
            PQ("Try to read \"config.txt\", which does not exist. Display \"using defaults\" when it is missing.",
              "using defaults", "# Write your program here\n", null, "except FileNotFoundError:"),
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
        keywords: "csv comma separated writer writerow reader dictreader header table",
        deck: [
          { kind: "overview", title: "CSV files", blocks: [
            T("A <b>CSV</b> file (comma-separated values) stores a table as text: one row per line, with the columns separated by commas. Spreadsheets and data loggers use it."),
            L(["The CSV format", "Writing rows", "Reading rows", "Reading rows as dictionaries"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The CSV format", title: "A table as text", blocks: [
            CODE("Name,Voltage,Current\npump,220,1.5\nfan,110,0.4", null, "devices.csv", "text"),
            L([
              "The first line usually holds the column names (the header).",
              "Every value is text in the file; numbers must be converted after reading.",
              "The module <code>csv</code> reads and writes this format: <code>import csv</code>.",
            ]),
          ] },
          { kind: "visual", part: "The CSV format", title: "Table and text", blocks: [
            W("csvFlow", { filename: "devices.csv", columns: ["Name", "Voltage", "Current"], rows: [["pump", 220, 1.5], ["fan", 110, 0.4]] }),
          ] },
          { kind: "concept", part: "Writing rows", title: "csv.writer", blocks: [
            L([
              "Open the file with <code>newline=\"\"</code>, so that no empty lines appear between the rows.",
              "<code>w = csv.writer(f)</code> creates a writer.",
              "<code>w.writerow(list)</code> writes one row; <code>w.writerows(list_of_lists)</code> writes several.",
            ]),
          ] },
          { kind: "code", part: "Writing rows", title: "First example: write, then look at the text", blocks: [
            EX('import csv\nwith open("devices.csv", "w", newline="") as f:\n    w = csv.writer(f)\n    w.writerow(["Name", "Voltage"])\n    w.writerow(["pump", 220])\n    w.writerow(["fan", 110])\nwith open("devices.csv") as f:\n    print(f.read())', "the file is plain text", [
              { c: "w.writerow([...])", e: "One list becomes one comma-separated line." },
              { c: "print(f.read())", e: "<code>Name,Voltage</code>, <code>pump,220</code>, <code>fan,110</code>" },
            ]),
          ] },
          { kind: "concept", part: "Reading rows", title: "csv.reader", blocks: [
            L([
              "<code>for row in csv.reader(f):</code> gives each row as a list of strings.",
              "The header is also a row. Skip it with a counter, or read all rows with <code>list(csv.reader(f))</code> and slice <code>[1:]</code>.",
              "Convert numbers: <code>float(row[1])</code>.",
            ]),
          ] },
          { kind: "code", part: "Reading rows", title: "Example: the total voltage (rows[1:] skips the header)", blocks: [
            RUN('import csv\nwith open("devices.csv", "w") as f:\n    f.write("Name,Voltage\\npump,220\\nfan,110\\n")\nwith open("devices.csv") as f:\n    rows = list(csv.reader(f))\ntotal = 0\nfor row in rows[1:]:\n    total = total + int(row[1])\nprint(total)'),
          ] },
          { kind: "concept", part: "Reading rows as dictionaries", title: "csv.DictReader", blocks: [
            L([
              "<code>csv.DictReader(f)</code> uses the header row as keys.",
              "Each row is a dictionary: <code>row[\"Voltage\"]</code> instead of <code>row[1]</code>.",
              "The header row is not returned as data.",
            ]),
          ] },
          { kind: "code", part: "Reading rows as dictionaries", title: "Example: rows by column name", blocks: [
            EX('import csv\nwith open("devices.csv", "w", newline="") as f:\n    csv.writer(f).writerows([["Name", "Voltage"], ["pump", 220], ["fan", 110]])\nwith open("devices.csv") as f:\n    for row in csv.DictReader(f):\n        print(row["Name"], row["Voltage"])', "the header gives the keys", [
              { c: "csv.DictReader(f)", e: "Each row is a dictionary with the keys Name and Voltage." },
              { c: 'row["Name"]', e: "<code>pump 220</code>, then <code>fan 110</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A CSV file is a table as text: one row per line, values separated by commas.",
              "<code>csv.writer(f).writerow(list)</code> writes a row; open with <code>newline=\"\"</code>.",
              "<code>csv.reader(f)</code> gives rows as lists of strings; convert the numbers.",
              "<code>csv.DictReader(f)</code> gives rows as dictionaries keyed by the header.",
            ]),
            NEXT("<b>JSON files</b>. Dictionaries and lists stored as text."),
          ] },
          { kind: "exercise", title: "Write a program: rows above a limit", blocks: [
            PQ("The starter writes a CSV file. Display the names of the rows whose price is above 100, one per line.",
              "motor\nsensor", 'import csv\nwith open("items.csv", "w", newline="") as f:\n    csv.writer(f).writerows([["name", "price"], ["cable", 40], ["motor", 250], ["sensor", 120]])\n# Read the file here\n', null, 'for row in csv.DictReader(f): if float(row["price"]) > 100: ...'),
          ] },
          { kind: "exercise", title: "Write a program: write a CSV file", blocks: [
            PQ("Write the header hour,temp and the rows 8,24 and 12,31 to \"t.csv\" with csv.writer. Then display the file text.",
              "hour,temp\n8,24\n12,31", "import csv\n# Write your program here\n", null, 'open("t.csv", "w", newline="")'),
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
        keywords: "json dump load dumps loads dictionary serialize",
        deck: [
          { kind: "overview", title: "JSON files", blocks: [
            T("<b>JSON</b> is a text format for dictionaries and lists. Web services and configuration files use it."),
            L(["The JSON format", "Files: dump and load", "Strings: dumps and loads"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The JSON format", title: "Dictionaries and lists as text", blocks: [
            CODE('{"name": "Pump", "voltage": 220, "modes": ["auto", "manual"]}', null, "JSON text", "text"),
            L([
              "It looks like a Python dictionary, but strings always use double quotes.",
              "true, false, and null in JSON become True, False, and None in Python.",
              "The module <code>json</code> converts between Python data and JSON text: <code>import json</code>.",
            ]),
          ] },
          { kind: "visual", part: "The JSON format", title: "A dictionary and its JSON text", blocks: [
            W("jsonFlow", { data: { name: "Pump", voltage: 220, modes: ["auto", "manual"] } }),
          ] },
          { kind: "concept", part: "Files: dump and load", title: "json.dump and json.load", blocks: [
            TB(["Function", "Effect"], [
              ["<code>json.dump(data, f)</code>", "writes a dictionary or list to an open file as JSON text"],
              ["<code>json.load(f)</code>", "reads JSON text from an open file and returns the Python data"],
            ]),
          ] },
          { kind: "code", part: "Files: dump and load", title: "First example: save and load settings", blocks: [
            EX('import json\nsettings = {"name": "Pump", "voltage": 220}\nwith open("settings.json", "w") as f:\n    json.dump(settings, f)\nwith open("settings.json") as f:\n    loaded = json.load(f)\nprint(loaded["voltage"])', "a round trip through a file", [
              { c: "json.dump(settings, f)", e: "The file holds <code>{\"name\": \"Pump\", \"voltage\": 220}</code>." },
              { c: "json.load(f)", e: "A new dictionary; <code>loaded[\"voltage\"]</code> is <code>220</code>." },
            ]),
          ] },
          { kind: "concept", part: "Strings: dumps and loads", title: "json.dumps and json.loads", blocks: [
            TB(["Function", "Effect"], [
              ["<code>json.dumps(data)</code>", "returns the JSON text as a string (s = string)"],
              ["<code>json.loads(text)</code>", "converts a JSON string into Python data"],
            ]),
            T("Data received from a network or a sensor often arrives as a JSON string; loads converts it."),
          ] },
          { kind: "code", part: "Strings: dumps and loads", title: "Example: a sensor message", blocks: [
            EX('import json\ntext = \'{"sensor": "T1", "value": 25.4, "ok": true}\'\ndata = json.loads(text)\nprint(data["value"] + 1)\nprint(data["ok"])\nprint(json.dumps({"a": 1}))', "string to dictionary and back", [
              { c: "json.loads(text)", e: "A dictionary; true became <code>True</code>." },
              { c: 'data["value"] + 1', e: "25.4 is a number: <code>26.4</code>" },
              { c: "json.dumps", e: "<code>{\"a\": 1}</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "JSON is text for dictionaries and lists; strings use double quotes.",
              "<code>json.dump(data, f)</code> / <code>json.load(f)</code> work with files.",
              "<code>json.dumps(data)</code> / <code>json.loads(text)</code> work with strings.",
            ]),
            NEXT("<b>NumPy arrays</b>. Fast calculations on many numbers at once."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output on paper.<br>Then run the program and compare.")],
            [RUN('import json\ntext = \'{"id": 7, "tags": ["a", "b"]}\'\nd = json.loads(text)\nprint(d["id"] * 2)\nprint(d["tags"][1])\nprint(len(d))')],
          ] },
          { kind: "exercise", title: "Write a program: update a JSON file", blocks: [
            PQ("The starter saves settings. Load them, change \"speed\" to 5, save them again, then load and display the new speed.",
              "5", 'import json\nwith open("cfg.json", "w") as f:\n    json.dump({"mode": "auto", "speed": 3}, f)\n# Write your program here\n', null, 'cfg = json.load(f); cfg["speed"] = 5; json.dump(cfg, f)'),
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
        keywords: "numpy array np shape ndim size indexing slicing element-wise sum mean max min axis",
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
          { kind: "code", part: "Arrays", title: "First example: execution step by step", blocks: [W("codeTrace", T_np)] },
          { kind: "trace", part: "Arrays", title: "Trace table", blocks: [TT(T_np)] },
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
              "An operator between two arrays of the same shape works on the elements at the same positions: <code>a + b</code>, <code>a * b</code>.",
              "An operator with a single number applies to every element: <code>a * 2</code>, <code>a + 10</code>.",
              "Functions such as <code>np.sqrt(a)</code> also work element by element.",
            ]),
          ] },
          { kind: "visual", part: "Element-wise operations", title: "a + b: matching positions", blocks: [
            W("arrayOp", { title: "a + b", a: [1, 2, 3], b: [4, 5, 6], op: "+" }),
          ] },
          { kind: "visual", part: "Element-wise operations", title: "a * 2: the number applies to every element", blocks: [
            W("arrayOp", { title: "a * 2", a: [1, 2, 3], b: 2, op: "*" }),
          ] },
          { kind: "concept", part: "Aggregation", title: "Aggregation functions", blocks: [
            TB(["Function", "Result for a = np.array([2, 4, 9])"], [
              ["<code>np.sum(a)</code> or <code>a.sum()</code>", "<code>15</code>"],
              ["<code>np.mean(a)</code>", "<code>5.0</code>"],
              ["<code>np.max(a)</code>, <code>np.min(a)</code>", "<code>9</code>, <code>2</code>"],
            ]),
            T("For a two-dimensional array, <code>axis=1</code> works along each row, and <code>axis=0</code> along each column: <code>np.sum(m, axis=1)</code> gives the row sums."),
          ] },
          { kind: "code", part: "Aggregation", title: "Example: row sums and the maximum", blocks: [
            EX("import numpy as np\nm = np.array([[1, 2, 3], [4, 5, 6]])\nprint(np.sum(m))\nprint(np.sum(m, axis=1))\nprint(np.mean(m))\nprint(np.max(m))", "the whole array, or row by row", [
              { c: "np.sum(m)", e: "<code>21</code>" },
              { c: "np.sum(m, axis=1)", e: "Row sums: <code>[ 6 15]</code>" },
              { c: "np.mean(m), np.max(m)", e: "<code>3.5</code> and <code>6</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>np.array(list)</code> creates an array; it prints without commas.",
              "<code>shape</code>, <code>ndim</code>, <code>size</code> describe it; <code>m[row, col]</code> indexes 2-D arrays.",
              "Operators and np functions work element by element, without loops.",
              "<code>np.sum</code>, <code>np.mean</code>, <code>np.max</code>, <code>np.min</code>; <code>axis=1</code> for rows.",
            ]),
            NEXT("<b>pandas DataFrames</b>. Tables with named columns."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output on paper.<br>Then run the program and compare.")],
            [RUN("import numpy as np\na = np.array([2, 4, 6, 8])\nprint(a / 2)\nprint(a[1:3])\nprint(a.shape)\nprint(np.mean(a))")],
          ] },
          { kind: "exercise", title: "Write a program: power of each device", blocks: [
            PQ("Compute the power of each device with arrays: voltages 12, 24, 230 and currents 2, 0.5, 0.1. Display the array of powers and their total.",
              "[24. 12. 23.]\n59.0", "import numpy as np\n# Write your program here\n", null, "p = v * i; print(p); print(np.sum(p))"),
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
        sub: "Creating tables, reading CSV files, inspecting, selecting, and column statistics.",
        slides: "08:26–32",
        keywords: "pandas dataframe series read_csv head tail info describe column select loc iloc mean max",
        deck: [
          { kind: "overview", title: "pandas: DataFrames", blocks: [
            T("<b>pandas</b> is a library for tables. A <b>DataFrame</b> is a table with named columns and a row index. Each column is a <b>Series</b>."),
            L(["Creating a DataFrame", "Reading and writing CSV files", "Inspecting a table", "Selecting columns and rows", "Column statistics"], "Subtopics in this lesson", true),
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
            ]),
            T("<code>read_excel</code> and <code>read_json</code> read other formats in the same way."),
          ] },
          { kind: "code", part: "Reading and writing CSV files", title: "First example: a table from a CSV file", blocks: [
            EX('import pandas as pd\nwith open("staff.csv", "w") as f:\n    f.write("Name,Age,City\\nAli,25,Bangkok\\nBob,30,Chiang Mai\\nChar,35,Phuket\\n")\ndf = pd.read_csv("staff.csv")\nprint(df)', "the file becomes a table", [
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
          { kind: "concept", part: "Selecting columns and rows", title: "Selecting columns and rows", blocks: [
            TB(["Code", "Result"], [
              ["<code>df[\"Age\"]</code>", "one column (a Series)"],
              ["<code>df[[\"Name\", \"City\"]]</code>", "several columns (a DataFrame): note the double brackets"],
              ["<code>df.loc[0]</code>", "the row with the index label 0"],
              ["<code>df.iloc[0]</code>", "the row at position 0"],
            ]),
          ] },
          { kind: "code", part: "Selecting columns and rows", title: "Example: one column and one row", blocks: [
            EX('import pandas as pd\ndf = pd.DataFrame({"Name": ["Ali", "Bob", "Char"], "Age": [25, 30, 35]})\nprint(df.shape)\nprint(df["Name"].tolist())\nprint(df.iloc[1]["Age"])', "shape, a column, a row", [
              { c: "df.shape", e: "<code>(3, 2)</code>" },
              { c: 'df["Name"].tolist()', e: "The column as a list: <code>['Ali', 'Bob', 'Char']</code>" },
              { c: 'df.iloc[1]["Age"]', e: "Row 1, column Age: <code>30</code>" },
            ]),
          ] },
          { kind: "concept", part: "Column statistics", title: "Column statistics", blocks: [
            TB(["Code", "Result for Age = 25, 30, 35"], [
              ["<code>df[\"Age\"].mean()</code>", "<code>30.0</code>"],
              ["<code>df[\"Age\"].max()</code>, <code>.min()</code>", "<code>35</code>, <code>25</code>"],
              ["<code>df[\"Age\"].sum()</code>", "<code>90</code>"],
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A DataFrame is a table: named columns (Series) and a row index.",
              "<code>pd.DataFrame(dict)</code> or <code>pd.read_csv(file)</code> creates it; <code>to_csv</code> saves it.",
              "<code>head()</code>, <code>tail()</code>, <code>shape</code>, <code>info()</code>, <code>describe()</code> inspect it.",
              "<code>df[\"col\"]</code> selects a column; <code>loc</code> and <code>iloc</code> select rows.",
              "<code>df[\"col\"].mean()</code>, <code>.max()</code>, <code>.min()</code>, <code>.sum()</code>.",
            ]),
            NEXT("<b>pandas: filtering, sorting, and changing data</b>."),
          ] },
          { kind: "exercise", title: "Write a program: average score", blocks: [
            PQ("Create a DataFrame of students with the columns name and score: Ann 78, Ben 85, Cat 92. Display the average score.",
              "85.0", "import pandas as pd\n# Write your program here\n", null, 'print(df["score"].mean())'),
          ] },
          { kind: "exercise", title: "Write a program: the first rows", blocks: [
            PQ("The starter writes a CSV file. Read it with pandas and display the number of rows and the largest temp.",
              "4\n31", 'import pandas as pd\nwith open("log.csv", "w") as f:\n    f.write("hour,temp\\n0,22\\n6,24\\n12,31\\n18,26\\n")\n# Write your program here\n', null, 'print(df.shape[0]); print(df["temp"].max())'),
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
        keywords: "pandas filter condition sort_values reset_index new column groupby mean",
        deck: [
          { kind: "overview", title: "pandas: filtering, sorting, and changing data", blocks: [
            T("pandas answers questions about a table with short expressions: which rows meet a condition, in which order, and what each group contains."),
            L(["Filtering rows", "Sorting", "Adding and changing columns", "Groups"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Filtering rows", title: "Filtering rows with a condition", blocks: [
            L([
              "<code>df[\"Age\"] &gt; 28</code> gives True or False for every row.",
              "<code>df[df[\"Age\"] &gt; 28]</code> keeps only the rows where it is True.",
              "Combine conditions with <code>&amp;</code> (and) and <code>|</code> (or), each in parentheses: <code>df[(df[\"Age\"] &gt; 20) &amp; (df[\"City\"] == \"Bangkok\")]</code>.",
            ]),
          ] },
          { kind: "visual", part: "Filtering rows", title: "A filter and a sort", blocks: [
            W("dfFilter", { title: "df", columns: ["Name", "Age", "City"], rows: [["Ali", 25, "Bangkok"], ["Bob", 30, "Chiang Mai"], ["Char", 35, "Phuket"]], scenarios: [
              { label: "df[df['Age'] > 28]", filter: { col: "Age", op: ">", value: 28 } },
              { label: "sort_values('Age', ascending=False)", sort: { col: "Age", dir: "desc" } },
            ] }),
          ] },
          { kind: "code", part: "Filtering rows", title: "Example: rows above an age", blocks: [
            EX('import pandas as pd\ndf = pd.DataFrame({"Name": ["Ali", "Bob", "Char"], "Age": [25, 30, 35]})\nolder = df[df["Age"] > 28]\nprint(older["Name"].tolist())\nprint(len(older))', "a boolean filter", [
              { c: 'df[df["Age"] > 28]', e: "The rows of Bob and Char." },
              { c: "print(...)", e: "<code>['Bob', 'Char']</code> and <code>2</code>" },
            ]),
          ] },
          { kind: "concept", part: "Sorting", title: "sort_values and reset_index", blocks: [
            TB(["Code", "Result"], [
              ["<code>df.sort_values(\"Age\")</code>", "a new table sorted by Age, increasing"],
              ["<code>df.sort_values(\"Age\", ascending=False)</code>", "sorted by Age, decreasing"],
              ["<code>df.reset_index(drop=True)</code>", "renumbers the rows 0, 1, 2, … after a sort or a filter"],
            ]),
          ] },
          { kind: "code", part: "Sorting", title: "Example: the highest first", blocks: [
            EX('import pandas as pd\ndf = pd.DataFrame({"Name": ["Ali", "Bob", "Char"], "Score": [78, 92, 85]})\ntop = df.sort_values("Score", ascending=False).reset_index(drop=True)\nprint(top["Name"].tolist())\nprint(top.loc[0, "Name"])', "sort, then renumber", [
              { c: "sort_values(..., ascending=False)", e: "Bob 92, Char 85, Ali 78." },
              { c: 'top.loc[0, "Name"]', e: "After reset_index, row 0 is the best: <code>Bob</code>" },
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
            EX('import pandas as pd\ndf = pd.DataFrame({"Device": ["pump", "fan"], "Voltage": [220, 110], "Current": [1.5, 0.4]})\ndf["Power"] = df["Voltage"] * df["Current"]\nprint(df["Power"].tolist())', "one row at a time, without a loop", [
              { c: 'df["Power"] = ...', e: "220 × 1.5 and 110 × 0.4: <code>[330.0, 44.0]</code>" },
            ]),
          ] },
          { kind: "concept", part: "Groups", title: "groupby", blocks: [
            L([
              "<code>df.groupby(\"Dept\")[\"Salary\"].mean()</code> splits the rows into groups by Dept and computes the mean salary of each group.",
              "The result has one value per group; loop over it with <code>.items()</code>, as with a dictionary.",
            ]),
          ] },
          { kind: "code", part: "Groups", title: "Example: mean salary per department", blocks: [
            EX('import pandas as pd\ndf = pd.DataFrame({"Dept": ["IT", "HR", "IT"], "Salary": [50000, 40000, 60000]})\navg = df.groupby("Dept")["Salary"].mean()\nfor dept, value in avg.items():\n    print(dept, value)', "one mean per group", [
              { c: "groupby(\"Dept\")", e: "Groups: HR (40000) and IT (50000, 60000)." },
              { c: "for dept, value", e: "<code>HR 40000.0</code>, <code>IT 55000.0</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>df[df[\"col\"] &gt; x]</code> filters rows; combine conditions with &amp; and |.",
              "<code>sort_values(col, ascending=False)</code> sorts; <code>reset_index(drop=True)</code> renumbers.",
              "<code>df[\"new\"] = expression</code> adds a computed column.",
              "<code>df.groupby(col)[other].mean()</code> summarizes each group.",
            ]),
            NEXT("<b>Chapter practice</b>. Complete data processing problems."),
          ] },
          { kind: "exercise", title: "Write a program: filter by price", blocks: [
            PQ("The starter writes a CSV file. Read it with pandas, keep the rows with price above 100, and display their names as a list.",
              "['motor', 'sensor']", 'import pandas as pd\nwith open("items.csv", "w") as f:\n    f.write("name,price\\ncable,40\\nmotor,250\\nsensor,120\\n")\n# Write your program here\n', null, 'print(df[df["price"] > 100]["name"].tolist())'),
          ] },
          { kind: "exercise", title: "Write a program: sort", blocks: [
            PQ("Sort the table by temp, highest first, and display the hours in that order as a list.",
              "[12, 18, 6, 0]", 'import pandas as pd\ndf = pd.DataFrame({"hour": [0, 6, 12, 18], "temp": [22, 24, 31, 26]})\n', null, 'df.sort_values("temp", ascending=False)["hour"].tolist()'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which code keeps only the rows with Age above 28?", choices: ["df[\"Age\"] > 28", "df[df[\"Age\"] > 28]", "df.Age(28)", "df.filter(28)"], answer: 1, explain: "The condition inside df[...] selects the rows." },
            { q: "`df.sort_values(\"Age\")` sorts…", choices: ["decreasing", "increasing", "by the index", "randomly"], answer: 1, explain: "The default is ascending (increasing)." },
          ])] },
        ],
      },

      /* =============================== 8. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete data processing problems.",
        slides: "08:39",
        keywords: "practice numpy array row sum dataframe average csv filter groupby file",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("For each problem, choose the tool that fits the data:"),
            L([
              "a text file for simple lines of values",
              "CSV or JSON for tables and settings",
              "NumPy for calculations on arrays of numbers",
              "pandas for tables with named columns",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: a 3 × 3 array", blocks: [
            T("Create a 3 × 3 array with the values 1 to 9, row by row. Display the sum of each row and the largest value."),
            IPO([["Data", "np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])"], ["Output", "the row sums, then the maximum"], ["Processing", "np.sum(m, axis=1), np.max(m)"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Write the program.", "[ 6 15 24]\n9", "import numpy as np\n# Write your program here\n", null, "print(np.sum(m, axis=1)); print(np.max(m))"),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: readings from a text file", blocks: [
            T("A data logger writes one temperature per line into a text file. Compute the average, rounded to 1 decimal place."),
            IPO([["Input", "the file temps.txt"], ["Output", "the average"], ["Processing", "read each line, float(), sum, count"]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("The starter writes the file. Read it and display the average.", "24.5", 'with open("temps.txt", "w") as f:\n    f.write("22.0\\n24.5\\n27.0\\n")\n# Write your program here\n', null, "round(total / count, 1)"),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: mean salary per department", blocks: [
            T("Create a DataFrame of employees (name, dept, salary) and display the mean salary of each department."),
            IPO([["Data", "Ann IT 50000, Ben HR 40000, Cid IT 60000, Dee HR 44000"], ["Output", "one line per department"], ["Processing", "groupby(\"dept\")[\"salary\"].mean()"]]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Write the program. Display each department and its mean on one line, as in the target.", "HR 42000.0\nIT 55000.0", "import pandas as pd\n# Write your program here\n", null, "for dept, value in avg.items(): print(dept, value)"),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: a JSON sensor message", blocks: [
            T("A sensor sends <code>{\"id\": \"T7\", \"values\": [21.5, 22.5, 23.5]}</code> as a JSON string. Display the id and the average of the values."),
            IPO([["Input", "a JSON string"], ["Output", "the id and the average"], ["Processing", "json.loads, then sum / len of the list"]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", blocks: [
            PQ("Use the string in the starter.", "T7 22.5", 'import json\ntext = \'{"id": "T7", "values": [21.5, 22.5, 23.5]}\'\n# Write your program here\n', null, 'data = json.loads(text); print(data["id"], sum(v) / len(v))'),
          ] },
          { kind: "summary", title: "Chapter summary", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1–2. Files", "<code>with open(name, mode)</code>; r / w / a / x; read, readline, readlines; FileNotFoundError."],
              ["3–4. CSV and JSON", "csv.writer / reader / DictReader; json.dump / load / dumps / loads."],
              ["5. NumPy", "Arrays, shape, element-wise operations, np.sum / mean / max, axis."],
              ["6–7. pandas", "DataFrame, read_csv, head, df[\"col\"], filters, sort_values, groupby."],
            ]),
            N("<b>Topic 09: Algorithms and efficiency</b>. How to measure and compare the speed of algorithms.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
