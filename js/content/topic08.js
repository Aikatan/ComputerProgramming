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
            PQ("Create a DataFrame of students with the columns name and score: Ann 78, Ben 85, Cat 92. Display the average score.",
              "85.0", "import pandas as pd\n# Write your program here\n", null, 'print(df["score"].mean())'),
          ] },
          { kind: "exercise", title: "Write a program: the number of rows and the maximum", blocks: [
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
            T("Create a 3 × 3 array with the values 1 to 9, row by row. Display the sum of each row and the largest value."),
            IPO([["Data", "np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])"], ["Output", "the row sums, then the maximum"], ["Processing", "np.sum(m, axis=1), np.max(m)"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Write the program.", "[ 6 15 24]\n9", "import numpy as np\n# Write your program here\n", null, "print(np.sum(m, axis=1)); print(np.max(m))"),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: readings from a text file", blocks: [
            T("A data logger writes one temperature per line into a text file. A line can be damaged. Write the maximum, the minimum, and the average of the valid readings into a summary file."),
            IPO([
              ["Input", "the file temps.txt: one reading per line"],
              ["Output", "the file summary.txt with three lines: max, min, avg (1 decimal place). Display the file."],
              ["Processing", "read each line, float(), collect the values in a list; max(), min(), sum() / len()"],
              ["Exceptions (Topic 07)", "ValueError from float(): skip the line. FileNotFoundError from open(): display \"temps.txt not found\"."],
              ["Test", "valid readings 22.0, 24.5, 27.0: (22.0 + 24.5 + 27.0) / 3 = 24.5"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("The starter writes the file; one line is not a number. Write summary.txt with the three lines of the target, then read it and display it. Use try for both exceptions.", "max 27.0\nmin 22.0\navg 24.5", 'with open("temps.txt", "w") as f:\n    f.write("22.0\\n24.5\\nerror\\n27.0\\n")\n# Write your program here\n', null, 'try: values.append(float(line)) / except ValueError: continue. Then f.write("max " + str(max(values)) + "\\n")'),
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
