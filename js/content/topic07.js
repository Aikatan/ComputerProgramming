/* ===================== Topic 07 - Data Visualization and Exceptions =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: line plots -> other chart types -> handling exceptions -> raise and assert -> practice.
   Python level: t02-t06 material plus matplotlib.pyplot and try / except / else / finally, raise, assert.
   ======================================================================================== */
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
  const T_try = {
    code: ['text = "12a"', "try:", "    value = int(text)", '    print("Value:", value)', "except ValueError:", '    print("Not a number")', 'print("Done")'],
    steps: [
      { line: 0, note: "The text is not a valid integer.", set: { text: "'12a'" } },
      { line: 1, note: "try: the following block is watched for errors." },
      { line: 2, note: "int('12a') raises a ValueError. The rest of the try block is skipped." },
      { line: 4, note: "The error type matches except ValueError: its block runs." },
      { line: 5, note: "The except block displays a message.", print: "Not a number" },
      { line: 6, note: "The program continues normally after the try statement. With <code>text = \"12\"</code>, no error occurs: the output is <code>Value: 12</code> and <code>Done</code>; the except block is skipped.", print: "Done" },
    ],
  };
  const T_raise = {
    code: ["def check_voltage(v):", "    if v < 0:", '        raise ValueError("negative voltage")', "    return v", "try:", "    check_voltage(-5)", "except ValueError as e:", '    print("Error:", e)'],
    steps: [
      { line: 0, note: "def creates the function." },
      { line: 5, note: "Inside try: check_voltage(-5) is called.", set: { "v (check_voltage)": "-5" } },
      { line: 1, note: "-5 < 0 is True." },
      { line: 2, note: "raise creates a ValueError with a message. The function stops.", unset: ["v (check_voltage)"] },
      { line: 6, note: "except ValueError catches it. e holds the error; its text is the message.", set: { e: "'negative voltage'" } },
      { line: 7, note: "The message is displayed.", print: "Error: negative voltage" },
    ],
  };

  App.registerTopic({
    id: "t07",
    title: "Data Visualization and Exceptions",
    short: "Visualization & Exceptions",
    blurb: "Line plots, bar charts, scatter plots and histograms with Matplotlib, and handling errors with try, except, raise and assert.",
    intro: "This chapter covers two topics: drawing data with Matplotlib, and handling errors so that a program does not stop. Each lesson uses only what the lessons before it have explained:<br>line plots → other chart types → handling exceptions → raise and assert → practice.",
    lessons: [
      /* =============================== 1. LINE PLOTS =============================== */
      {
        id: "matplotlib-basics",
        title: "Line plots with Matplotlib",
        sub: "Importing Matplotlib, plot(), labels, title, legend, line styles, and saving a figure.",
        slides: "07:4–7",
        keywords: "matplotlib pyplot plot show xlabel ylabel title legend color linestyle marker grid savefig",
        deck: [
          { kind: "overview", title: "Line plots with Matplotlib", blocks: [
            T("<b>Matplotlib</b> is a Python library that draws charts from data. Its module <code>pyplot</code> provides one function for each chart part."),
            L(["Importing Matplotlib", "A line plot", "Labels, title, and grid", "Several lines and a legend", "Line styles", "Saving a figure"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Importing Matplotlib", title: "Importing Matplotlib", blocks: [
            L([
              "Matplotlib is a third-party module: <code>pip install matplotlib</code> in a terminal (Topic 05). Google Colab and this site already include it.",
              "<code>import matplotlib.pyplot as plt</code> imports pyplot with the short name plt.",
              "All drawing functions are then called as <code>plt.name(...)</code>.",
            ]),
          ] },
          { kind: "concept", part: "A line plot", title: "plot() and show()", blocks: [
            L([
              "<code>plt.plot(x, y)</code> draws a line through the points (x[0], y[0]), (x[1], y[1]), …",
              "x and y are lists of the same length.",
              "<code>plt.show()</code> displays the figure. On this site the figure appears in the output area.",
            ]),
          ] },
          { kind: "code", part: "A line plot", title: "First example: temperature during a day", blocks: [
            EX("import matplotlib.pyplot as plt\n\nhours = [0, 4, 8, 12, 16, 20]\ntemps = [22, 21, 25, 31, 29, 24]\nplt.plot(hours, temps)\nplt.show()", "run it to see the plot", [
              { c: "hours, temps", e: "Six points: the x values and the y values." },
              { c: "plt.plot(hours, temps)", e: "Draws a line through the six points." },
              { c: "plt.show()", e: "Displays the figure." },
            ]),
          ] },
          { kind: "concept", part: "Labels, title, and grid", title: "Labels, title, and grid", blocks: [
            TB(["Function", "Effect"], [
              ["<code>plt.xlabel(\"Hour\")</code>", "the label of the x axis"],
              ["<code>plt.ylabel(\"Temperature (C)\")</code>", "the label of the y axis"],
              ["<code>plt.title(\"Room temperature\")</code>", "the title above the chart"],
              ["<code>plt.grid(True)</code>", "grid lines that help to read values"],
            ]),
            T("An engineering chart always has labelled axes with units."),
          ] },
          { kind: "code", part: "Labels, title, and grid", title: "Example: a labelled chart", blocks: [
            EX('import matplotlib.pyplot as plt\nhours = [0, 4, 8, 12, 16, 20]\ntemps = [22, 21, 25, 31, 29, 24]\nplt.plot(hours, temps)\nplt.xlabel("Hour")\nplt.ylabel("Temperature (C)")\nplt.title("Room temperature")\nplt.show()', "the same data with labels (grid: plt.grid(True))", null),
          ] },
          { kind: "concept", part: "Several lines and a legend", title: "Several lines and a legend", blocks: [
            L([
              "Each call of <code>plt.plot()</code> before <code>plt.show()</code> adds a line to the same chart.",
              "<code>label=\"...\"</code> names a line.",
              "<code>plt.legend()</code> displays the names in a box.",
            ]),
          ] },
          { kind: "code", part: "Several lines and a legend", title: "Example: two sensors", blocks: [
            EX('import matplotlib.pyplot as plt\n\nhours = [0, 6, 12, 18]\nplt.plot(hours, [22, 24, 31, 26], label="Room")\nplt.plot(hours, [18, 20, 34, 23], label="Outside")\nplt.legend()\nplt.show()', "two lines in one chart", [
              { c: 'label="Room"', e: "The name of the first line." },
              { c: "plt.legend()", e: "Shows both names with their colors." },
            ]),
          ] },
          { kind: "concept", part: "Line styles", title: "Colors, line styles, and markers", blocks: [
            TB(["Argument", "Examples", "Effect"], [
              ["<code>color=</code>", "<code>\"red\"</code>, <code>\"blue\"</code>", "the color of the line"],
              ["<code>linestyle=</code>", "<code>\"-\"</code>, <code>\"--\"</code>, <code>\":\"</code>", "solid, dashed, dotted"],
              ["<code>marker=</code>", "<code>\"o\"</code>, <code>\"s\"</code>, <code>\"x\"</code>", "a symbol at each point"],
              ["<code>linewidth=</code>", "<code>2</code>", "the thickness of the line"],
            ]),
          ] },
          { kind: "code", part: "Line styles", title: "Example: a styled line", blocks: [
            EX('import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4]\ny = [3, 5, 4, 6]\nplt.plot(x, y, color="red", linestyle="--", marker="o")\nplt.show()', "a red dashed line with circles", null),
          ] },
          { kind: "concept", part: "Saving a figure", title: "Saving a figure", blocks: [
            L([
              "<code>plt.savefig(\"chart.png\")</code> saves the figure as an image file.",
              "Call savefig before <code>plt.show()</code>: after show, the figure may be empty.",
              "The file type follows the name: <code>.png</code>, <code>.pdf</code>, <code>.jpg</code>.",
            ]),
            CODE('plt.plot(hours, temps)\nplt.savefig("temperature.png")\nplt.show()', null, "example"),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>import matplotlib.pyplot as plt</code>, then <code>plt.plot(x, y)</code> and <code>plt.show()</code>.",
              "<code>xlabel</code>, <code>ylabel</code>, <code>title</code>, and <code>grid</code> make a chart readable.",
              "Several plot() calls give several lines; <code>label=</code> and <code>legend()</code> name them.",
              "<code>color</code>, <code>linestyle</code>, <code>marker</code> style a line.",
              "<code>savefig()</code> saves the figure, before show().",
            ]),
            NEXT("<b>Other chart types</b>. Bar charts, scatter plots, and histograms."),
          ] },
          { kind: "exercise", title: "Write a program: a labelled plot", cols: [
            [T("Plot the battery level over time: minutes 0, 10, 20, 30 and levels 100, 82, 65, 47. Add the axis labels \"Time (min)\" and \"Battery (%)\" and a title. Run the program and check the chart.")],
            [RUN("import matplotlib.pyplot as plt\n\n# Write your program here\n")],
          ] },
          { kind: "exercise", title: "Modify the plot", cols: [
            [T("Change the plot: green color, dotted line, and a square marker at each point.")],
            [RUN('import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4]\ny = [3, 5, 4, 6]\nplt.plot(x, y)\nplt.show()')],
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which function adds the names of the lines to a chart?", choices: ["plt.title()", "plt.legend()", "plt.xlabel()", "plt.grid()"], answer: 1, explain: "legend() displays the label of each line." },
            { q: "When should `plt.savefig()` be called?", choices: ["before plt.show()", "after plt.show()", "before import", "never"], answer: 0, explain: "After show(), the figure may already be closed and empty." },
          ])] },
        ],
      },

      /* =============================== 2. CHART TYPES =============================== */
      {
        id: "chart-types",
        title: "Bar charts, scatter plots, and histograms",
        sub: "Choosing and drawing the right chart for the data.",
        slides: "07:8–11",
        keywords: "bar scatter hist histogram bins chart type categories distribution",
        deck: [
          { kind: "overview", title: "Bar charts, scatter plots, and histograms", blocks: [
            T("Each chart type answers a different question about data."),
            L(["Bar charts", "Scatter plots", "Histograms", "Choosing a chart"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Bar charts", title: "Bar charts", blocks: [
            L([
              "<code>plt.bar(categories, values)</code> draws one bar for each category.",
              "Use it to compare values between named groups, such as the energy of each machine.",
              "categories is a list of strings; values is a list of numbers.",
            ]),
          ] },
          { kind: "code", part: "Bar charts", title: "Example: energy per machine", blocks: [
            EX('import matplotlib.pyplot as plt\n\nmachines = ["Pump", "Fan", "Heater"]\nenergy = [12, 5, 20]\nplt.bar(machines, energy)\nplt.ylabel("Energy (kWh)")\nplt.show()', "one bar per machine", null),
          ] },
          { kind: "concept", part: "Scatter plots", title: "Scatter plots", blocks: [
            L([
              "<code>plt.scatter(x, y)</code> draws one point for each pair, without lines.",
              "Use it to see whether two measured quantities are related, such as voltage and current.",
            ]),
          ] },
          { kind: "code", part: "Scatter plots", title: "Example: voltage and current", blocks: [
            EX('import matplotlib.pyplot as plt\n\nvoltage = [1, 2, 3, 4, 5]\ncurrent = [0.21, 0.39, 0.62, 0.80, 1.01]\nplt.scatter(voltage, current)\nplt.xlabel("Voltage (V)")\nplt.ylabel("Current (A)")\nplt.show()', "points close to a straight line", null),
          ] },
          { kind: "concept", part: "Histograms", title: "Histograms", blocks: [
            L([
              "<code>plt.hist(data, bins=5)</code> divides the range of the data into intervals (bins) and draws how many values fall into each.",
              "Use it to see the <b>distribution</b> of many measurements: where most values are, and how far they spread.",
              "data is one list of numbers, not x and y.",
            ]),
          ] },
          { kind: "code", part: "Histograms", title: "Example: distribution of resistor values", blocks: [
            EX('import matplotlib.pyplot as plt\n\nohms = [98, 101, 100, 99, 103, 100, 97, 102, 100, 101]\nplt.hist(ohms, bins=4)\nplt.xlabel("Resistance (ohm)")\nplt.ylabel("Count")\nplt.show()', "ten measurements in 4 bins", null),
          ] },
          { kind: "concept", part: "Choosing a chart", title: "Choosing a chart", blocks: [
            TB(["Question", "Chart", "Function"], [
              ["How does a value change over time?", "line plot", "<code>plt.plot(x, y)</code>"],
              ["How do named groups compare?", "bar chart", "<code>plt.bar(names, values)</code>"],
              ["Are two quantities related?", "scatter plot", "<code>plt.scatter(x, y)</code>"],
              ["How are many values distributed?", "histogram", "<code>plt.hist(data, bins)</code>"],
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>bar()</code> compares named groups.",
              "<code>scatter()</code> shows points to reveal a relation.",
              "<code>hist()</code> shows how many values fall into each interval.",
              "Choose the chart by the question that the data should answer.",
            ]),
            NEXT("<b>Handling exceptions</b>. A program can react to errors instead of stopping."),
          ] },
          { kind: "exercise", title: "Choose the chart", blocks: [
            T("Write the best chart type for each data set on paper."),
            TB(["Data", "Chart"], [
              ["The power consumption of 5 departments", ""],
              ["The motor temperature every minute for one hour", ""],
              ["200 measured cable lengths", ""],
              ["Speed and fuel consumption of 30 test drives", ""],
            ]),
          ] },
          { kind: "exercise", title: "Write a program: a bar chart", cols: [
            [T("Draw a bar chart of the monthly production: Jan 120, Feb 135, Mar 128 units. Add a y-axis label and a title.")],
            [RUN("import matplotlib.pyplot as plt\n\n# Write your program here\n")],
          ] },
          { kind: "exercise", title: "Write a program: a histogram", cols: [
            [T("Draw a histogram with 3 bins of these test scores: 55, 62, 68, 70, 71, 75, 78, 80, 85, 92.")],
            [RUN("import matplotlib.pyplot as plt\n\nscores = [55, 62, 68, 70, 71, 75, 78, 80, 85, 92]\n# Write the histogram here\n")],
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which chart shows how many values fall into each interval?", choices: ["bar", "scatter", "hist", "plot"], answer: 2, explain: "A histogram counts values per interval (bin)." },
            { q: "Which function draws points without connecting lines?", choices: ["plt.plot()", "plt.scatter()", "plt.bar()", "plt.hist()"], answer: 1, explain: "scatter draws only the points." },
          ])] },
        ],
      },

      /* =============================== 3. HANDLING EXCEPTIONS =============================== */
      {
        id: "exceptions",
        title: "Handling exceptions",
        sub: "try and except, several except blocks, else, and finally.",
        slides: "07:13–20",
        keywords: "exception try except else finally valueerror zerodivisionerror indexerror keyerror typeerror handling",
        deck: [
          { kind: "overview", title: "Handling exceptions", blocks: [
            T("An <b>exception</b> is an error that occurs while a program runs (a runtime error, Topic 02). Without handling, it stops the program. With <code>try</code> and <code>except</code>, the program reacts and continues."),
            L(["Built-in exceptions", "try and except", "Several except blocks", "else and finally"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Built-in exceptions", title: "Common built-in exceptions", blocks: [
            TB(["Exception", "Cause", "Example"], [
              ["<code>ValueError</code>", "an unsuitable value", "<code>int(\"abc\")</code>"],
              ["<code>ZeroDivisionError</code>", "division by zero", "<code>10 / 0</code>"],
              ["<code>TypeError</code>", "incompatible types", "<code>\"a\" + 1</code>"],
              ["<code>IndexError</code>", "an index outside a list or string", "<code>[1, 2][5]</code>"],
              ["<code>KeyError</code>", "a missing dictionary key", "<code>{}[\"x\"]</code>"],
              ["<code>FileNotFoundError</code>", "a file that does not exist (Topic 08)", "<code>open(\"no.txt\")</code>"],
            ]),
          ] },
          { kind: "concept", part: "try and except", title: "try and except", blocks: [
            CODE("try:\n    statements that may fail\nexcept ErrorType:\n    statements that handle the error", null, "syntax"),
            L([
              "Python runs the try block. If no error occurs, the except block is skipped.",
              "If an error occurs, the rest of the try block is skipped. If the error type matches, the except block runs.",
              "After the try statement, the program continues normally.",
            ]),
          ] },
          { kind: "code", part: "try and except", title: "First example: execution step by step", blocks: [W("codeTrace", T_try)] },
          { kind: "code", part: "try and except", title: "Example: safe input", blocks: [
            EX('try:\n    n = int(input("Number: "))\n    print("Double:", n * 2)\nexcept ValueError:\n    print("Please enter a whole number.")', "test input: abc", [
              { c: 'int(input("Number: "))', e: "\"abc\" raises a ValueError." },
              { c: "except ValueError", e: "The message is displayed; the program does not stop." },
            ], ["abc"]),
          ] },
          { kind: "concept", part: "Several except blocks", title: "Several except blocks", blocks: [
            L([
              "A try statement can have several except blocks, one for each error type.",
              "Python checks them from top to bottom; the first matching block runs, and the others are skipped.",
              "<code>except (ValueError, TypeError):</code> handles two types in one block.",
              "<code>except ValueError as e:</code> stores the error in e; <code>print(e)</code> shows its message.",
            ]),
          ] },
          { kind: "code", part: "Several except blocks", title: "Example: division with two possible errors", blocks: [
            EX('try:\n    a = int(input("a: "))\n    b = int(input("b: "))\n    print(a / b)\nexcept ValueError:\n    print("Not a number")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")', "test input: 10 and 0", [
              { c: "a / b", e: "b is 0: a ZeroDivisionError" },
              { c: "except ZeroDivisionError", e: "The second block matches: <code>Cannot divide by zero</code>" },
            ], ["10", "0"]),
          ] },
          { kind: "concept", part: "else and finally", title: "else and finally", blocks: [
            TB(["Block", "Runs when"], [
              ["<code>try</code>", "always first"],
              ["<code>except</code>", "an error of its type occurred in try"],
              ["<code>else</code>", "no error occurred in try"],
              ["<code>finally</code>", "always, last, with or without an error"],
            ]),
            T("finally is used for work that must always happen, such as closing a file (Topic 08)."),
          ] },
          { kind: "code", part: "else and finally", title: "Example: all four blocks", blocks: [
            EX('try:\n    r = 10 / int(input("Divisor: "))\nexcept ZeroDivisionError:\n    print("Division by zero")\nelse:\n    print("Result:", r)\nfinally:\n    print("Finished")', "test input: 4", [
              { c: "try", e: "10 / 4 → 2.5: no error" },
              { c: "else", e: "Runs because there was no error: <code>Result: 2.5</code>" },
              { c: "finally", e: "Always runs: <code>Finished</code>" },
            ], ["4"]),
          ] },
          { kind: "concept", part: "else and finally", title: "Which blocks run", blocks: [
            TB(["Divisor", "try", "except ZeroDivisionError", "else", "finally", "Output"], [
              ["4", "completes", "skipped", "runs", "runs", "Result: 2.5, Finished"],
              ["0", "stops at the division", "runs", "skipped", "runs", "Division by zero, Finished"],
            ], "The example with two different inputs", "center"),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "try runs the risky statements; except handles a matching error.",
              "After an error, the rest of the try block is skipped.",
              "With several except blocks, the first matching type runs.",
              "else runs only without an error; finally always runs.",
            ]),
            NEXT("<b>raise and assert</b>. A program can also create its own errors on purpose."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output on paper.<br>Then run the program and compare.")],
            [RUN('values = [4, 8]\ntry:\n    print(values[1])\n    print(values[5])\n    print("end of try")\nexcept IndexError:\n    print("bad index")')],
          ] },
          { kind: "exercise", title: "Determine the output: else", cols: [
            [T("Write the output on paper. Decide which blocks run.<br>Then run the program and compare.")],
            [RUN('try:\n    x = int("25")\nexcept ValueError:\n    print("error")\nelse:\n    print("ok", x)\nfinally:\n    print("end")')],
          ] },
          { kind: "exercise", title: "Write a program: safe division", blocks: [
            PQ("Read two integers with the prompts <code>a: </code> and <code>b: </code>, and display a / b. Display \"Not a number\" for a ValueError and \"Cannot divide by zero\" for a ZeroDivisionError. Test input: 7 and 0.",
              "a: 7\nb: 0\nCannot divide by zero", "# Write your program here\n", ["7", "0"], "Two except blocks, one for each error type."),
          ] },
          { kind: "exercise", title: "Correct the error type", blocks: [
            PQ("The program should display \"missing\" for a missing key, but it stops with a KeyError, because it catches the wrong type. Correct the except line.",
              "missing", 'd = {"a": 1}\ntry:\n    print(d["b"])\nexcept IndexError:\n    print("missing")\n', null, "A missing dictionary key raises a KeyError."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "When does the else block of a try statement run?", choices: ["always", "when an error occurs", "when no error occurs", "never"], answer: 2, explain: "else runs only if the try block completed without an error." },
            { q: "Which block runs whether an error occurs or not?", choices: ["try", "except", "else", "finally"], answer: 3, explain: "finally always runs." },
          ])] },
        ],
      },

      /* =============================== 4. RAISE AND ASSERT =============================== */
      {
        id: "raise-assert",
        title: "raise and assert",
        sub: "Creating errors on purpose, and checking conditions while testing.",
        slides: "07:21–24",
        keywords: "raise assert assertionerror valueerror validation message",
        deck: [
          { kind: "overview", title: "raise and assert", blocks: [
            T("A program can create an error on purpose when data is invalid. The caller then handles it with try and except."),
            L(["raise", "assert"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "raise", title: "raise creates an exception", blocks: [
            L([
              "<code>raise ValueError(\"message\")</code> stops the current function and creates a ValueError with a message.",
              "Use it when a function receives values that it cannot process, for example a negative voltage.",
              "The caller catches it with <code>except ValueError as e:</code>; <code>e</code> gives the message.",
            ]),
          ] },
          { kind: "code", part: "raise", title: "First example: execution step by step", blocks: [W("codeTrace", T_raise)] },
          { kind: "concept", part: "assert", title: "assert checks a condition", blocks: [
            CODE('assert condition, "message"', null, "syntax"),
            L([
              "If the condition is True, nothing happens.",
              "If it is False, Python raises an <code>AssertionError</code> with the message.",
              "assert is used while developing and testing, to check what must always be true. Use raise for invalid input from users.",
            ]),
          ] },
          { kind: "code", part: "assert", title: "Example: a checked division", blocks: [
            EX('def divide(a, b):\n    assert b != 0, "Denominator must not be zero"\n    return a / b\n\nprint(divide(10, 2))\nprint(divide(1, 0))', "the second call fails the check", [
              { c: "divide(10, 2)", e: "b != 0 is True: <code>5.0</code>" },
              { c: "divide(1, 0)", e: "AssertionError: Denominator must not be zero" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>raise ErrorType(\"message\")</code> creates an error on purpose.",
              "The caller handles it with try and except; <code>as e</code> gives the message.",
              "<code>assert condition, \"message\"</code> raises an AssertionError when the condition is False.",
            ]),
            NEXT("<b>Chapter practice</b>. Complete problems with charts and error handling."),
          ] },
          { kind: "exercise", title: "Determine the output on paper, then run", blocks: [
            RUN('def check_age(age):\n    if age < 0:\n        raise ValueError("age cannot be negative")\n    return age\ntry:\n    print(check_age(20))\n    print(check_age(-1))\nexcept ValueError as e:\n    print("Error:", e)'),
          ] },
          { kind: "exercise", title: "Write a function with raise", blocks: [
            PQ("Define <code>set_speed(rpm)</code> that raises ValueError(\"speed too high\") when rpm is above 3000, and otherwise returns rpm. Call set_speed(3500) in try, and display the error message after \"Error:\".",
              "Error: speed too high", "# Write your program here\n", null, 'except ValueError as e: print("Error:", e)'),
          ] },
          { kind: "exercise", title: "Write an assert", blocks: [
            PQ("Complete line 2 with an assert: a negative length raises an AssertionError with the message \"length must be positive\".",
              "length must be positive", 'def area(length):\n    \n    return length * length\ntry:\n    area(-3)\nexcept AssertionError as e:\n    print(e)\n', null, 'assert length > 0, "length must be positive"'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`assert x > 0` with x = -1 raises…", choices: ["ValueError", "AssertionError", "TypeError", "nothing"], answer: 1, explain: "A false assert condition raises an AssertionError." },
            { q: "What does `except ValueError as e:` give?", choices: ["the error, whose message print(e) shows", "the value that caused it", "the line number", "True or False"], answer: 0, explain: "e is the exception object; printing it shows its message." },
          ])] },
        ],
      },

      /* =============================== 5. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete problems with charts and error handling.",
        slides: "07:26",
        keywords: "practice division error handling chart plot validation",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("For each problem, decide which errors can occur and which chart shows the data best."),
            L([
              "List the inputs that can be invalid, and the exception each one raises.",
              "Handle each exception with its own except block.",
              "For a chart, label both axes with units.",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: safe division", blocks: [
            T("Read two numbers and display their quotient. Report invalid numbers and division by zero instead of stopping."),
            IPO([["Input", "a, b (float)"], ["Output", "a / b, or an error message"], ["Errors", "ValueError: not a number; ZeroDivisionError: b = 0"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Use the prompts <code>a: </code> and <code>b: </code>. Display \"Invalid number\" or \"Division by zero\". Test input: 12 and x.",
              "a: 12\nb: x\nInvalid number", "# Write your program here\n", ["12", "x"], "float(input(...)) inside try; two except blocks"),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: read until valid", blocks: [
            T("Ask for a temperature until the user enters a valid number, then display it."),
            IPO([["Input", "text, repeated"], ["Output", "\"Try again\" after each invalid entry, then the value"], ["Processing", "a while loop with try inside; break after a valid conversion"]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("Use the prompt <code>Temperature: </code>. Test input: warm, 2x, 25.5.",
              "Temperature: warm\nTry again\nTemperature: 2x\nTry again\nTemperature: 25.5\n25.5", "# Write your program here\n", ["warm", "2x", "25.5"], "while True: try: t = float(input(...)); break  except ValueError: print(\"Try again\")"),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: safe list access", blocks: [
            T("A list holds the readings of 4 sensors. Read a sensor number and display its reading, or \"No such sensor\" for an invalid number."),
            IPO([["Input", "a sensor index (int)"], ["Output", "the reading, or a message"], ["Errors", "IndexError: index outside the list; ValueError: not an integer"]]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Use the prompt <code>Sensor: </code>. Test input: 7.",
              "Sensor: 7\nNo such sensor", "readings = [21.5, 22.0, 23.1, 20.8]\n# Write your program here\n", ["7"], "except (IndexError, ValueError): print(\"No such sensor\")"),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: plot measured data", cols: [
            [T("Plot these motor measurements as a line with circle markers: speed 500, 1000, 1500, 2000 rpm and current 1.2, 2.0, 2.9, 3.7 A. Label both axes with units, and add a title.")],
            [RUN("import matplotlib.pyplot as plt\n\n# Write your program here\n")],
          ] },
          { kind: "summary", title: "Chapter summary", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1. Line plots", "<code>plt.plot(x, y)</code>, labels, title, legend, styles, <code>savefig()</code> before <code>show()</code>."],
              ["2. Chart types", "bar: groups; scatter: relations; hist: distributions."],
              ["3. Exceptions", "try / except (first match) / else (no error) / finally (always)."],
              ["4. raise and assert", "raise creates an error on purpose; assert checks a condition."],
            ]),
            N("<b>Topic 08: Data processing</b>. Reading and writing files, CSV and JSON data, NumPy arrays, and pandas tables.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
