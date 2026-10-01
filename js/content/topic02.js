/* ===================== Topic 02 - Basic Programming with Python =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: each lesson uses only what the lessons before it taught.
   Output -> Variables -> Data types -> Memory -> Arithmetic -> Input -> Strings -> Errors -> Practice
   Python level: int, float, str, bool, print, input, arithmetic. No if / loops / lists / functions.
   ==================================================================================== */
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
  const PAPER = "Write the output of the program on paper, line by line.";   // the task text of a paper exercise
  const HIDE = (b) => Object.assign(b, { hideOnAnswer: true });   // the block is hidden while the answer of its slide is shown
  const OUT = (text) => ({ type: "code", code: text, caption: "output", lang: "text" });   // the expected output, in the answer of a slide

  /* ---------- traces: one object drives codeTrace and traceTable ---------- */
  const T_print = {
    code: ['print("Battery check")', "print(85)", 'print("Check complete")'],
    steps: [
      { line: -1, note: "The program has not started. The output is empty." },
      { line: 0, note: "<code>print()</code> displays the text inside the quotes. The quotes are not displayed.", print: "Battery check" },
      { line: 1, note: "<code>85</code> is a number. <code>print()</code> displays its value on the next line.", print: "85" },
      { line: 2, note: "The third statement displays its text on a new line.", print: "Check complete" },
      { line: -1, note: "No statement is left. The program ends. Result check: three statements gave three output lines, in the same order." },
    ],
  };

  const T_power = {
    code: ["voltage = 12", "current = 2", "power = voltage * current", 'print("Power =", power, "W")'],
    steps: [
      { line: -1, note: "No variable exists yet. The colour of a value shows its data type (Lesson 3): whole number blue, decimal number green, text yellow, True or False purple." },
      { line: 0, note: "The value 12 is stored in the variable <code>voltage</code>.", set: { voltage: "12" } },
      { line: 1, note: "The value 2 is stored in the variable <code>current</code>.", set: { current: "2" } },
      { line: 2, note: "The right side is evaluated first: <code>voltage * current</code> → <code>12 * 2</code> → <code>24</code>. Then 24 is stored in <code>power</code>.", set: { power: "24" } },
      { line: 3, note: "<code>print()</code> displays the text, the value of <code>power</code>, and the unit.", print: "Power = 24 W" },
      { line: -1, note: "The program ends. Result: Power = 24 W. <b>Check:</b> 12 × 2 = 24. The output <code>Power = 24 W</code> is correct." },
    ],
  };

  const T_temp = {
    code: ["temperature = 25", 'print("T =", temperature)', "temperature = 30", 'print("T =", temperature)'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "25 is stored in <code>temperature</code>.", set: { temperature: "25" } },
      { line: 1, note: "The current value, 25, is displayed.", print: "T = 25" },
      { line: 2, note: "30 replaces 25. The old value is no longer stored.", set: { temperature: "30" } },
      { line: 3, note: "The same statement now displays the new value.", print: "T = 30" },
    ],
  };

  const T_battery = {
    code: ["battery = 80", "battery = battery - 15", "battery -= 15", "battery += 10", 'print("Battery =", battery, "%")'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "80 is stored in <code>battery</code>.", set: { battery: "80" } },
      { line: 1, note: "The right side uses the current value: <code>80 - 15</code> → <code>65</code>. 65 is stored back in <code>battery</code>.", set: { battery: "65" } },
      { line: 2, note: "<code>battery -= 15</code> is the short form of <code>battery = battery - 15</code>: <code>65 - 15</code> → <code>50</code>.", set: { battery: "50" } },
      { line: 3, note: "<code>battery += 10</code> adds 10 (charging): <code>50 + 10</code> → <code>60</code>.", set: { battery: "60" } },
      { line: 4, note: "The final value is displayed.", print: "Battery = 60 %" },
    ],
  };

  const T_abc = {
    code: ["a = 5", "b = a + 3", "a = b * 2", "print(a, b)"],
    steps: [
      { line: 0, note: "5 is stored in a.", set: { a: "5" } },
      { line: 1, note: "a + 3 → 5 + 3 → 8.", set: { b: "8" } },
      { line: 2, note: "b * 2 → 8 * 2 → 16. The old value of a is replaced.", set: { a: "16" } },
      { line: 3, note: "The values of a and b are displayed.", print: "16 8" },
    ],
  };

  const T_types = {
    code: ["voltage = 12", "resistance = 4.7", 'unit = "ohm"', "is_on = True", "print(type(resistance))", "print(type(unit))"],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "12 has no decimal point, so it is an <code>int</code>.", set: { voltage: "12" } },
      { line: 1, note: "4.7 has a decimal point, so it is a <code>float</code>.", set: { resistance: "4.7" } },
      { line: 2, note: "Text in quotes is a <code>str</code>.", set: { unit: "'ohm'" } },
      { line: 3, note: "<code>True</code> is a <code>bool</code>.", set: { is_on: "True" } },
      { line: 4, note: "<code>type(resistance)</code> reports the type <code>float</code>.", print: "<class 'float'>" },
      { line: 5, note: "<code>type(unit)</code> is <code>str</code>. Result check: 4.7 → float, <code>\"ohm\"</code> → str.", print: "<class 'str'>" },
    ],
  };

  const T_speed = {
    code: ["distance = 120   # km", "minutes = 90", "hours = minutes / 60", "speed = distance / hours", 'print("Speed =", speed, "km/h")'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "120 (km) is stored in <code>distance</code>.", set: { distance: "120" } },
      { line: 1, note: "90 (minutes) is stored in <code>minutes</code>.", set: { minutes: "90" } },
      { line: 2, note: "<code>90 / 60</code> → <code>1.5</code>. The time is now in hours.", set: { hours: "1.5" } },
      { line: 3, note: "<code>120 / 1.5</code> → <code>80.0</code>. The operator <code>/</code> always gives a float, even when the division is exact.", set: { speed: "80.0" } },
      { line: 4, note: "The speed is displayed with its unit.", print: "Speed = 80.0 km/h" },
      { line: -1, note: "The program ends. Result check: 90 min = 1.5 h, and 120 ÷ 1.5 = 80. The output shows <code>80.0</code>, because <code>/</code> produces a float." },
    ],
  };

  const T_time = {
    code: ["total_minutes = 125", "hours = total_minutes // 60", "minutes = total_minutes % 60", 'print(hours, "h", minutes, "min")'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "125 is stored in <code>total_minutes</code>.", set: { total_minutes: "125" } },
      { line: 1, note: "<code>125 // 60</code> → <code>2</code>: two full hours.", set: { hours: "2" } },
      { line: 2, note: "<code>125 % 60</code> → <code>5</code>: the minutes that remain.", set: { minutes: "5" } },
      { line: 3, note: "Four values are displayed with one space between them. Result check: 2 × 60 + 5 = 125.", print: "2 h 5 min" },
    ],
  };

  const T_name = {
    code: ['name = input("Name: ")', 'age = input("Age: ")', 'print("Hello", name)', "print(type(age))"],
    steps: [
      { line: -1, note: "The program has not started. Test input: the user types Anan, and then 19." },
      { line: 0, note: "The prompt is displayed. The user types Anan. <code>'Anan'</code> is stored in <code>name</code>.", set: { name: "'Anan'" }, print: "Name: Anan" },
      { line: 1, note: "The user types 19. <code>input()</code> returns the text <code>'19'</code>, not the number 19.", set: { age: "'19'" }, print: "Age: 19" },
      { line: 2, note: "The text <code>Hello</code> and the value of <code>name</code> are displayed.", print: "Hello Anan" },
      { line: 3, note: "Result check: <code>age</code> is a <code>str</code>. The digits 19 are text, not a number.", print: "<class 'str'>" },
    ],
  };

  const T_powerIn = {
    code: ['voltage = float(input("Voltage (V): "))', 'current = float(input("Current (A): "))', "power = voltage * current", 'print("Power =", power, "W")'],
    steps: [
      { line: -1, note: "Test values: the user enters 12 and then 1.5." },
      { line: 0, note: "<code>input()</code> runs first and returns the str <code>'12'</code>. Nothing is stored yet.", print: "Voltage (V): 12" },
      { line: 0, note: "Then <code>float('12')</code> gives <code>12.0</code>, which is stored in <code>voltage</code>.", set: { voltage: "12.0" } },
      { line: 1, note: "The same two actions: <code>input()</code> returns <code>'1.5'</code>; <code>float()</code> gives <code>1.5</code>.", set: { current: "1.5" }, print: "Current (A): 1.5" },
      { line: 2, note: "<code>12.0 * 1.5</code> → <code>18.0</code>.", set: { power: "18.0" } },
      { line: 3, note: "The power is displayed. Result check: 12 × 1.5 = 18, as displayed.", print: "Power = 18.0 W" },
    ],
  };

  const T_index = {
    code: ['label = "PUMP-07"', "n = len(label)", "first = label[0]", "last = label[n - 1]", "print(first, last)", "print(label[-1])"],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "The device label is stored as a string of 7 characters.", set: { label: "'PUMP-07'" } },
      { line: 1, note: "<code>len(label)</code> → 7. The indexes are 0 to 6.", set: { n: "7" } },
      { line: 2, note: "Index 0 is the first character: <code>'P'</code>.", set: { first: "'P'" } },
      { line: 3, note: "<code>n - 1</code> → 6. Index 6 is the last character: <code>'7'</code>.", set: { last: "'7'" } },
      { line: 4, note: "Both characters are displayed.", print: "P 7" },
      { line: 5, note: "Index -1 also gives the last character. Result check: both give <code>'7'</code>.", print: "7" },
    ],
  };

  const T_cost = {
    code: ["minutes = 90", "hours = minutes // 60", "energy = 1.5 * hours   # kWh", "cost = energy * 4      # 4 baht/kWh", 'print("Cost =", cost, "baht")'],
    steps: [
      { line: -1, note: "A 1.5 kW heater runs for 90 minutes. 1 kWh costs 4 baht. Expected by hand: 1.5 h × 1.5 kW = 2.25 kWh, and 2.25 × 4 = 9.0 baht." },
      { line: 0, note: "90 is stored in <code>minutes</code>. Correct.", set: { minutes: "90" } },
      { line: 1, note: "<code>90 // 60</code> → <b>1</b>. The expected value is 1.5 h. This is the first wrong value: the error is on this line.", set: { hours: "1" } },
      { line: 2, note: "<code>1.5 * 1</code> → 1.5. The expected value is 2.25. It is wrong only because <code>hours</code> is wrong.", set: { energy: "1.5" } },
      { line: 3, note: "<code>1.5 * 4</code> → 6.0. The expected value is 9.0.", set: { cost: "6.0" } },
      { line: 4, note: "Result check: 6.0 is not 9.0. The output shows the error, but its cause is line 2.", print: "Cost = 6.0 baht" },
    ],
  };

  App.registerTopic({
    id: "t02",
    title: "Basic Programming with Python",
    short: "Basics",
    blurb: "Output, variables, data types, memory, arithmetic, input, strings, and errors.",
    intro: "This chapter covers the basic statements of a Python program. Each lesson uses only what the lessons before it have explained:<br>output → variables → data types → memory → arithmetic → input → strings → errors → practice.",
    lessons: [
      /* =============================== 1. OUTPUT =============================== */
      {
        id: "output",
        title: "Output with print()",
        sub: "Tracing execution, the separator, and the line ending.",
        slides: "02:30–31",
        keywords: "print output statement order sep end comment",
        deck: [
          { kind: "overview", title: "Output with print()", blocks: [
            T("Topic 00 introduced <code>print()</code>, which displays values as the <b>output</b> of a program.<br>This lesson traces the execution of a program step by step, and then adds two settings of <code>print()</code>: the separator and the line ending."),
            L(["Recap of Topic 00", "Execution step by step", "sep and end"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Recap of Topic 00", title: "print(): what Topic 00 covered", blocks: [
            T("Topic 00, Lesson 2, introduced these rules. This chapter builds on them."),
            L([
              "Python executes the statements from top to bottom. Each <code>print()</code> displays one line.",
              "Text is written in quotes. A number or a calculation is written without quotes.",
              "Commas separate several values. <code>print()</code> inserts one space between them.",
              "<code>#</code> starts a comment. Python ignores the rest of the line.",
            ]),
            N("<code>print()</code> with no value displays an empty line.<br>A comment can follow a statement on the same line: <code>print(85)   # battery level in percent</code>", "New in this lesson"),
          ] },
          { kind: "code", part: "Execution step by step", title: "First example: execution step by step", blocks: [W("codeTrace", T_print)] },
          { kind: "concept", part: "sep and end", title: "The separator and the line ending", blocks: [
            T("<code>print()</code> has two optional settings. They are written after the values."),
            TB(["Setting", "Default", "Effect"], [
              ["<code>sep=\"...\"</code>", "one space", "the text placed <b>between</b> the values"],
              ["<code>end=\"...\"</code>", "a new line", "the text placed <b>after</b> the last value"],
            ]),
            T("<code>end=\" \"</code> or <code>end=\"\"</code> keeps the next output on the same line."),
          ] },
          { kind: "code", part: "sep and end", title: "Example: sep", blocks: [
            EX('print(29, 9, 2026, sep="/")\nprint("A", "B", "C", sep="")', "changing the separator", [
              { c: 'sep="/"', e: "A slash between the values. Output: <code>29/9/2026</code>" },
              { c: 'sep=""', e: "Nothing between the values. Output: <code>ABC</code>" },
            ]),
          ] },
          { kind: "code", part: "sep and end", title: "Example: end", blocks: [
            EX('print("Loading", end="...")\nprint("done")\nprint("Next line")', "changing the line ending", [
              { c: 'end="..."', e: "The line ends with <code>...</code> instead of a new line." },
              { c: 'print("done")', e: "Continues the same line. Output: <code>Loading...done</code>" },
              { c: 'print("Next line")', e: "Line 2 ended normally, so this text starts a new line." },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>print()</code> displays its values in order, with one space between them, and then starts a new line.",
              "<code>print()</code> with no value displays an empty line.",
              "<code>sep</code> sets the text between the values. <code>end</code> sets the text after the last value.",
              "<code>end=\"\"</code> or <code>end=\" \"</code> keeps the next output on the same line.",
              "A comment starts with <code>#</code>. It can follow a statement on the same line.",
            ]),
            NEXT("<b>Variables</b>. A variable stores a value, so that the program can use the value again without writing it each time."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T(PAPER)],
            [RUN('print("Motor", "A")   # device name\nprint()\nprint("Speed:", 1500, "rpm")\nprint("10 + 5 =", 10 + 5)')],
          ], answerCol: 0, answer: [OUT("Motor A\n\nSpeed: 1500 rpm\n10 + 5 = 15")] },
          { kind: "exercise", title: "Determine the output: sep and end", cols: [
            [T(PAPER + "<br>The program uses <code>sep</code> and <code>end</code>.")],
            [RUN('print("x", "y", "z", sep=",")\nprint("Start", end=" ")\nprint("Stop")\nprint(1, 2, 3, sep=" - ")')],
          ], answerCol: 0, answer: [OUT("x,y,z\nStart Stop\n1 - 2 - 3")] },
          { kind: "exercise", title: "Complete the code", blocks: [
            PQ("Complete the two <code>print()</code> statements, so that the output matches the target exactly.",
              "Temperature = 25 C\nStatus: OK", 'print("Temperature =")\nprint()\n', null,
              'Line 1 needs two more values: 25 and "C". Line 2 needs "Status:" and "OK".'),
          ] },
          { kind: "exercise", title: "Modify the code", blocks: [
            PQ("Change line 1 of the program, so that the program displays the target output.<br>1. The program displays two lines. The target output is one line.<br>2. Use the setting <code>end</code> in the <code>print()</code> of line 1.",
              "Sensor 1: ready", 'print("Sensor 1:")\nprint("ready")\n', null, 'Use end=" " in line 1: print("Sensor 1:", end=" ").'),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Write a program that displays the device label in the target output.<br>1. Output lines 1 to 3: use one <code>print()</code> for each line, with commas between the values.<br>2. Line 4 (date): use <code>sep=\"/\"</code> in <code>print()</code>.<br>3. Write the month as the text <code>\"09\"</code>.",
              "Device: Pump\nVoltage: 220 V\nCurrent: 1.5 A\n29/09/2026", "# Write your program here\n", null,
              "A number cannot start with 0, so 09 must be text in quotes."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: '`print("A", "B", sep="-")` displays…', choices: ["A B", "A-B", "AB", "A - B"], answer: 1, explain: "sep replaces the space between the values with a dash." },
            { q: 'The statements `print("A", end="")` and `print("B")` display…', choices: ["A B", "AB", "A and B on two lines", "Error"], answer: 1, explain: "end=\"\" writes nothing after A, so B continues on the same line." },
          ])] },
        ],
      },

      /* =============================== 2. VARIABLES =============================== */
      {
        id: "variables",
        title: "Variables",
        sub: "Storing values, updating them, and naming them.",
        slides: "02:18–22",
        keywords: "variable assignment reassignment update += -= naming rules snake case keyword case-sensitive",
        deck: [
          { kind: "overview", title: "Variables", blocks: [
            T("A <b>variable</b> is a name that stores a value. The program can use the value or change it later.<br>With variables, a program computes with names such as <code>voltage</code> instead of repeating fixed numbers."),
            L(["Assignment", "Using variables in calculations", "Reassignment", "Updating a variable", "Assigning several variables", "Naming rules"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Assignment", title: "Assignment stores a value", blocks: [
            CODE("variable_name = value", null, "syntax"),
            L([
              "Python evaluates the <b>right side</b> of <code>=</code> first.",
              "Python then stores the result under the <b>name</b> on the left.",
              "<code>=</code> means <i>store</i>. It does not mean <i>is equal to</i>.",
              "A variable must be assigned before it is used.",
            ]),
          ] },
          { kind: "problem", part: "Assignment", title: "Problem: power of a device", blocks: [
            T("A device operates at 12 V and draws a current of 2 A. The program must display the electrical power of the device."),
            IPO([
              ["Input (given values)", "voltage = 12 V, current = 2 A"],
              ["Required output", "power in W"],
              ["Processing", "power = voltage × current"],
              ["Algorithm", "1. Store the voltage.<br>2. Store the current.<br>3. Compute the power.<br>4. Display the power."],
            ]),
            T("This table is steps 1 and 2 of the five steps of Topic 00: understand and design. Lesson 6 uses all five steps."),
          ] },
          { kind: "code", part: "Assignment", title: "First example: execution step by step", blocks: [W("codeTrace", T_power)] },
          { kind: "concept", part: "Using variables in calculations", title: "A name is replaced by its value", blocks: [
            L([
              "When Python evaluates an expression, each variable name is replaced by its <b>current value</b>.",
              "A variable can be used many times in the same program.",
              "Descriptive names make a formula readable: <code>area = length * width</code>.",
            ]),
          ] },
          { kind: "code", part: "Using variables in calculations", title: "Example: area and perimeter of a steel plate", blocks: [
            EX('length = 5   # cm\nwidth = 3    # cm\narea = length * width\nperimeter = 2 * length + 2 * width\nprint("Area =", area, "cm2")\nprint("Perimeter =", perimeter, "cm")', "one value, used several times", [
              { c: "area = length * width", e: "5 * 3 → <code>15</code>" },
              { c: "perimeter = ...", e: "2 * 5 + 2 * 3 → 10 + 6 → <code>16</code>" },
              { c: "print(...)", e: "Output: <code>Area = 15 cm2</code> and <code>Perimeter = 16 cm</code>" },
            ]),
          ] },
          { kind: "concept", part: "Reassignment", title: "Reassignment replaces the old value", blocks: [
            L([
              "Assigning a new value to an existing variable <b>replaces</b> the old value.",
              "A variable holds only its <b>latest</b> value. The old value is no longer stored.",
              "Statements before the reassignment used the old value. Statements after it use the new value.",
              "An assignment stores a <b>value</b>, not a formula. After <code>power = voltage * current</code>, a change of <code>voltage</code> does not change <code>power</code> until the assignment runs again.",
            ]),
          ] },
          { kind: "code", part: "Reassignment", title: "Example: a temperature reading changes", blocks: [W("codeTrace", T_temp)] },
          { kind: "code", part: "Reassignment", title: "Example: a value, not a formula", blocks: [
            EX('voltage = 12\ncurrent = 2\npower = voltage * current\nvoltage = 6\nprint("Power =", power)\npower = voltage * current\nprint("Power =", power)', "power changes only when it is assigned", [
              { c: "voltage = 6", e: "<code>power</code> holds the value 24, not the formula: <code>Power = 24</code>" },
              { c: "Line 6", e: "The assignment runs again: 6 * 2 → 12. <code>Power = 12</code>" },
            ]),
          ] },
          { kind: "concept", part: "Updating a variable", title: "Updating a variable from its own value", blocks: [
            T("A variable can appear on <b>both sides</b> of <code>=</code>: <code>battery = battery - 15</code>"),
            L([
              "The right side uses the current value. If <code>battery</code> is 80: <code>80 - 15</code> → <code>65</code>.",
              "The result, 65, is stored back in <code>battery</code>.",
            ]),
            TB(["Short form", "Same as"], [
              ["<code>x += 5</code>", "<code>x = x + 5</code>"],
              ["<code>x -= 5</code>", "<code>x = x - 5</code>"],
              ["<code>x *= 2</code>", "<code>x = x * 2</code>"],
            ], null, "center"),
          ] },
          { kind: "code", part: "Updating a variable", title: "Example: battery level during operation", blocks: [W("codeTrace", T_battery)] },
          { kind: "concept", part: "Assigning several variables", title: "Several variables in one line", blocks: [
            TB(["Statement", "Result"], [
              ["<code>x, y = 8, 3</code>", "<code>x</code> is 8 and <code>y</code> is 3: the values are assigned in order"],
              ["<code>a = b = 0</code>", "<code>a</code> and <code>b</code> are both 0"],
            ]),
            T("The number of names on the left must equal the number of values on the right."),
            CODE("voltage, current = 12, 2\nprint(voltage, current)", "12 2", "example"),
          ] },
          { kind: "concept", part: "Naming rules", title: "Rules for variable names", blocks: [
            L([
              "A name contains letters, digits, and the underscore <code>_</code> only.",
              "A name cannot start with a digit.",
              "A name cannot contain spaces or symbols such as <code>$</code>, <code>@</code>, <code>-</code>.",
              "A name cannot be a Python keyword, such as <code>if</code>, <code>for</code>, <code>while</code>, <code>True</code>.",
              "Names are case-sensitive: <code>speed</code> and <code>Speed</code> are two different variables.",
            ]),
            N("Use lowercase words joined by underscores, and describe the value: <code>motor_speed</code>, <code>max_temperature</code>.", "Style"),
          ] },
          { kind: "concept", part: "Naming rules", title: "Valid and invalid names", blocks: [
            TB(["Name", "Valid?", "Reason"], [
              ["<code>sensor_1</code>", "<span class='t-yes'>Valid</span>", "letters, a digit, and an underscore"],
              ["<code>motorSpeed</code>", "<span class='t-yes'>Valid</span>", "allowed, but <code>motor_speed</code> is the Python style"],
              ["<code>1sensor</code>", "<span class='t-no'>Invalid</span>", "starts with a digit"],
              ["<code>max speed</code>", "<span class='t-no'>Invalid</span>", "contains a space"],
              ["<code>speed$</code>", "<span class='t-no'>Invalid</span>", "contains a symbol"],
              ["<code>for</code>", "<span class='t-no'>Invalid</span>", "a Python keyword"],
              ["<code>print</code>", "<span class='t-yes'>Valid</span>", "a built-in name: allowed, but it hides the function"],
            ]),
            T("After <code>print = \"abc\"</code>, <code>print(\"Hi\")</code> stops with <code>TypeError: 'str' object is not callable</code>. The same applies to <code>str</code> and <code>len</code> (Lessons 6 and 7)."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>name = value</code> evaluates the right side, then stores the result under the name.",
              "A variable name in an expression is replaced by its current value.",
              "Reassignment replaces the old value. A variable stores a value, not a formula.",
              "<code>x = x + 1</code> updates a variable from its own value. <code>+=</code> and <code>-=</code> are short forms.",
              "Names use letters, digits, and <code>_</code>. They do not start with a digit and are case-sensitive.",
            ]),
            NEXT("<b>Data types</b>. Every value stored in a variable has a type, such as a whole number, a decimal number, or text."),
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("Complete the trace table on paper. The first row is an example.<br>Write the value of every variable after each line."),
            W("traceTable", { trace: T_abc, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Determine the output of the program.<br>1. Write the output on paper.<br>2. Explain why line 4 of the program does not change <code>distance</code>.")],
            [RUN('speed = 60\ntime = 2\ndistance = speed * time\nspeed = 80\nprint("Distance =", distance)')],
          ], answerCol: 0, answer: [
            OUT("Distance = 120"),
            T("Line 3 stores the value 120 in <code>distance</code>, not the formula. Line 4 changes only <code>speed</code>."),
          ] },
          { kind: "exercise", title: "Correct the order of the lines", blocks: [
            PQ("Correct the order of the lines, so that the program displays the target output.<br>The error: line 1 uses <code>voltage</code> and <code>current</code> before the two variables have values.",
              "Power = 115.0 W", 'power = voltage * current\nvoltage = 230\ncurrent = 0.5\nprint("Power =", power, "W")\n', null,
              "A variable must be assigned before the program uses the variable, so move line 1 below the two assignments."),
          ] },
          { kind: "exercise", title: "Complete the code", blocks: [
            PQ("Complete line 3, so that the program displays the target output.<br>1. A 100 W lamp is on for 5 hours.<br>2. Line 3 computes the energy in watt-hours: energy = power × hours.",
              "Energy = 500 Wh", 'power = 100\nhours = 5\nenergy = \nprint("Energy =", energy, "Wh")\n', null, "Write the formula with the variable names: energy = power * hours."),
          ] },
          { kind: "exercise", title: "Correct the names", blocks: [
            PQ("Correct the variable names, so that the program runs and displays the target output.<br>1. The two variable names in the program are invalid.<br>2. Replace each invalid name with a valid name, in every line.",
              "20 80", "1st_reading = 20\nmax temp = 80\nprint(1st_reading, max temp)\n", null, "Valid names are, for example, first_reading and max_temp."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Write a program that computes the water level of a tank and displays the target output.<br>1. Store the start level, 100 litres, in <code>level</code>.<br>2. 30 litres are used: subtract 30 with <code>-=</code>.<br>3. 20 litres are added: add 20 with <code>+=</code>.<br>4. Display the value of <code>level</code>.",
              "Level = 90 litres", "# Write your program here\n", null, 'Use four statements: level = 100, level -= 30, level += 20, and print("Level =", level, "litres").'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which variable name is valid?", choices: ["3phase", "phase_3", "phase 3", "phase-3"], answer: 1, explain: "phase_3 uses letters, an underscore, and a digit, and it does not start with a digit." },
            { q: "After `x = 4` and then `x = x + 2`, the value of x is…", choices: ["4", "2", "6", "Error"], answer: 2, explain: "The right side uses the current value: 4 + 2 = 6." },
          ])] },
        ],
      },

      /* =============================== 3. DATA TYPES =============================== */
      {
        id: "data-types",
        title: "Data types",
        sub: "int, float, str, bool, and the type() function.",
        slides: "02:23–27",
        keywords: "type int float str bool type() dynamic typing",
        deck: [
          { kind: "overview", title: "Data types", blocks: [
            T("Every value in Python has a <b>data type</b>. The type decides which operations are allowed and how the value is stored in memory.<br>This lesson covers the four basic types. Collection types, such as lists, are covered in Topic 06."),
            L(["The four basic types", "Checking a type with type()", "Numbers and text are different", "A variable takes the type of its value"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The four basic types", title: "int, float, str, and bool", blocks: [
            TB(["Type", "Meaning", "Examples"], [
              ["<code>int</code>", "whole number", "<code>12</code>, <code>-5</code>, <code>0</code>"],
              ["<code>float</code>", "number with a decimal point", "<code>4.7</code>, <code>0.5</code>, <code>12.0</code>"],
              ["<code>str</code>", "text (string), written in quotes", "<code>\"ohm\"</code>, <code>'Motor A'</code>, <code>\"12\"</code>"],
              ["<code>bool</code>", "truth value", "<code>True</code>, <code>False</code>"],
            ]),
            L([
              "<code>12</code> is an int. <code>12.0</code> is a float. <code>\"12\"</code> is a str.",
              "<code>True</code> and <code>False</code> start with a capital letter. Topic 03 uses them in decisions.",
              "A float can be written in scientific notation: <code>4.7e3</code> is 4.7 × 10³, the float <code>4700.0</code>. Python displays a very small float in this form: <code>0.000001</code> is displayed as <code>1e-06</code>.",
            ]),
          ] },
          { kind: "concept", part: "Checking a type", title: "type() reports the type of a value", blocks: [
            CODE("type(value)", null, "syntax"),
            T("<code>print(type(4.7))</code> displays <code>&lt;class 'float'&gt;</code>. Here <b>class</b> means type. The word in quotes is the type name."),
          ] },
          { kind: "code", part: "Checking a type", title: "First example: execution step by step", blocks: [W("codeTrace", T_types)] },
          { kind: "concept", part: "Numbers and text are different", title: "The same digits, two different types", blocks: [
            TB(["Expression", "Result", "Reason"], [
              ["<code>12 + 3</code>", "<code>15</code>", "two ints: addition"],
              ["<code>\"12\" + \"3\"</code>", "<code>\"123\"</code>", "two strs: the texts are joined (concatenated)"],
              ["<code>\"12\" + 3</code>", "error", "a str and an int cannot be added (TypeError, Lesson 8)"],
            ]),
            T("Digits inside quotes are characters, not a number. Python does not calculate with them."),
          ] },
          { kind: "code", part: "Numbers and text are different", title: "Example: adding numbers and joining text", blocks: [
            EX('print(220 + 10)\nprint("220" + "10")\nprint("220" + "V")\nprint(1.5 + 1.5)', "the type decides what + does", [
              { c: "220 + 10 and 1.5 + 1.5", e: "Numbers are added: <code>230</code> and <code>3.0</code> (a float keeps the decimal point)" },
              { c: '"220" + "10"', e: "str + str → <code>22010</code> (the texts are joined)" },
              { c: '"220" + "V"', e: "Joining is useful for labels: <code>220V</code>" },
            ]),
          ] },
          { kind: "concept", part: "A variable takes the type of its value", title: "The type follows the value", blocks: [
            L([
              "Python does not require a type declaration. The type comes from the value that is assigned.",
              "After a reassignment, the variable has the type of the new value.",
              "Other languages, such as C (Topic 10), fix the type of a variable when it is declared.",
            ]),
          ] },
          { kind: "visual", part: "A variable takes the type of its value", title: "One name, three values", blocks: [
            T("A name <b>refers to</b> its value in memory. A value that no name refers to is <b>unreferenced</b>: the program cannot use it."),
            W("rebindViz", { title: "reading: one name, three values", name: "reading", code: ["reading = 25", "reading = 25.5", 'reading = "error"'], steps: [
              { value: 25, note: "<code>reading</code> refers to an int." },
              { value: 25.5, note: "The same name now refers to a float." },
              { value: "error", note: "The same name now refers to a str." },
            ] }),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>int</code>: whole numbers. <code>float</code>: numbers with a decimal point.",
              "<code>str</code>: text in quotes. <code>bool</code>: <code>True</code> or <code>False</code>.",
              "<code>type(value)</code> reports the type.",
              "<code>+</code> adds numbers but joins strings.",
              "A variable takes the type of the value assigned last.",
            ]),
            NEXT("<b>How values are stored in memory</b>. The type of a value decides how many bytes it uses and how its bits are read."),
          ] },
          { kind: "exercise", title: "Determine the types", cols: [
            [T("Determine the type of each value in the table. The program displays the six types.<br>Write int, float, str, or bool on paper."),
              HIDE(TB(["Value", "Type"], [["<code>7</code>", ""], ["<code>7.0</code>", ""], ["<code>\"7\"</code>", ""], ["<code>False</code>", ""], ["<code>-3</code>", ""], ["<code>\"True\"</code>", ""]]))],
            [RUN('print(type(7))\nprint(type(7.0))\nprint(type("7"))\nprint(type(False))\nprint(type(-3))\nprint(type("True"))')],
          ], answerCol: 0, answer: [
            TB(["Value", "Type"], [["<code>7</code>", "int"], ["<code>7.0</code>", "float"], ["<code>\"7\"</code>", "str"], ["<code>False</code>", "bool"], ["<code>-3</code>", "int"], ["<code>\"True\"</code>", "str"]]),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T(PAPER)],
            [RUN('print("5" + "5")\nprint(5 + 5)\nprint(2.0 * 3)\nprint("Volt" + "age")')],
          ], answerCol: 0, answer: [OUT("55\n10\n6.0\nVoltage")] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Correct lines 1 and 2, so that the program displays the target output.<br>The error: the program must display the total length of two cables, 30 m, but the program displays 1020.",
              "Total = 30 m", 'cable_1 = "10"\ncable_2 = "20"\ntotal = cable_1 + cable_2\nprint("Total =", total, "m")\n', null,
              "Remove the quotes, so that the values are ints."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Store a device record in four variables, and display the target output.<br>1. Values: name <code>\"Pump\"</code>, rated voltage <code>220</code>, current <code>1.5</code>, running state <code>True</code>.<br>2. Display each value with the type of the value.",
              "Pump <class 'str'>\n220 <class 'int'>\n1.5 <class 'float'>\nTrue <class 'bool'>", "# Write your program here\n", null, "Use print(name, type(name)) for the first line of the output."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`type(3.0)` reports…", choices: ["int", "float", "str", "bool"], answer: 1, explain: "3.0 has a decimal point, so it is a float." },
            { q: '`"7" + "1"` gives…', choices: ["8", "\"71\"", "71.0", "Error"], answer: 1, explain: "Both values are strings, so + joins them: \"71\"." },
          ])] },
        ],
      },

      /* =============================== 4. MEMORY =============================== */
      {
        id: "memory",
        title: "How values are stored in memory",
        sub: "Bits, bytes, binary numbers, characters, and the size of each type.",
        slides: "02:11–17",
        keywords: "memory bit byte address binary decimal conversion ascii character size char int float double overflow approximate",
        deck: [
          { kind: "overview", title: "How values are stored in memory", blocks: [
            T("A variable is a name for a <b>location in memory</b>. The computer stores every value in that location as <b>binary digits</b> (bits).<br>The data type decides how many bytes the value uses and how the bits are read."),
            L(["Bits, bytes, and addresses", "Binary numbers", "Converting decimal to binary", "Characters (ASCII)", "Size of each data type", "float values are approximate"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Bits, bytes, and addresses", title: "Bits, bytes, and addresses", blocks: [
            T("Topic 01 defined the bit and the byte (8 bits)."),
            L([
              "One byte has 2⁸ = 256 bit patterns, so it stores the numbers 0 to 255.",
              "Memory is a long sequence of bytes.",
              "An <b>address</b> is the number that identifies one byte in memory. Each byte has its own address.",
              "A value that needs 4 bytes uses 4 consecutive addresses.",
            ]),
          ] },
          { kind: "visual", part: "Bits, bytes, and addresses", title: "Two values in memory", blocks: [
            W("memoryModel", { title: "Address and stored value (C types, example addresses)", columns: [
              { head: "Address → value", cells: [
                { addr: "1000", name: "voltage (int, 4 bytes)", val: "12" },
                { addr: "1004", name: "grade (char, 1 byte)", val: "65 ('A')" },
                { addr: "1005", name: "next free byte", val: "..." },
              ] },
            ], note: "Each value occupies a fixed number of consecutive bytes. The next value starts at the next free address." }),
            T("C types are used here because C fixes the size of each type (Topic 10)."),
          ] },
          { kind: "concept", part: "Binary numbers", title: "Place values of a binary number", blocks: [
            T("Each bit of a binary number has a <b>place value</b>. From the right, the place values are 1, 2, 4, 8, 16, 32, 64, 128. Each place value is double the one on its right.<br>The value of the number is the sum of the place values where the bit is 1."),
            TB(["Place value", "128", "64", "32", "16", "8", "4", "2", "1"], [
              ["Bits of 13", "0", "0", "0", "0", "1", "1", "0", "1"],
            ], "13 = 8 + 4 + 1, so 13 is <code>00001101</code> in one byte.", "center"),
          ] },
          { kind: "concept", part: "Converting decimal to binary", title: "Algorithm: decimal to binary", blocks: [
            L([
              "Divide the number by 2. Write down the remainder (0 or 1). The quotient becomes the new number.",
              "Repeat step 1 until the quotient is 0.",
              "Read the remainders from the <b>last</b> to the <b>first</b>.",
            ], "Algorithm", true),
            TB(["Number", "Quotient (÷ 2)", "Remainder"], [
              ["13", "6", "1"], ["6", "3", "0"], ["3", "1", "1"], ["1", "0", "1"],
            ], "13 in binary: the remainders read upward, 1101.", "center"),
          ] },
          { kind: "visual", part: "Converting decimal to binary", title: "Binary converter", blocks: [
            W("binaryConverter", { value: 13 }),
            T("The number below each bit is its place value."),
          ] },
          { kind: "concept", part: "Characters (ASCII)", title: "Characters are stored as numbers", blocks: [
            T("A character is stored as a number. The <b>ASCII</b> code assigns a number from 0 to 127 to each basic character."),
            TB(["Character", "ASCII code", "Binary (1 byte)"], [
              ["<code>'A'</code>", "65", "01000001"],
              ["<code>'B'</code>", "66", "01000010"],
              ["<code>'a'</code>", "97", "01100001"],
              ["<code>'0'</code>", "48", "00110000"],
              ["space", "32", "00100000"],
            ], null, "center"),
            N("The character <code>'7'</code> (code 55) is not the number <code>7</code>. So <code>\"12\" + \"3\"</code> joins characters."),
          ] },
          { kind: "concept", part: "Size of each data type", title: "Each type uses a fixed number of bytes", blocks: [
            TB(["Type (C)", "Size", "Range or precision"], [
              ["<code>char</code>", "1 byte", "one character: 8 bits hold codes 0 to 255. ASCII needs only 7 bits (0 to 127)."],
              ["<code>int</code>", "4 bytes", "about −2.1 billion to +2.1 billion"],
              ["<code>float</code>", "4 bytes", "about 7 significant digits"],
              ["<code>double</code>", "8 bytes", "about 15 to 16 significant digits"],
            ]),
            L([
              "A value outside the range of its type cannot be stored correctly. This is called <b>overflow</b>.",
              "A Python <code>int</code> has no fixed size. It uses more bytes when the number grows.",
              "A Python <code>float</code> uses 8 bytes, the same as a C <code>double</code>.",
            ]),
          ] },
          { kind: "concept", part: "float values are approximate", title: "float values are approximate", blocks: [
            L([
              "A float is stored in binary with a fixed number of bits.",
              "Many decimal fractions, such as 0.1, have no exact binary form. The float stores the nearest possible value.",
              "The error does not always appear. <code>0.1 + 0.2</code> displays <code>0.30000000000000004</code>, but <code>0.1 + 0.4</code> displays <code>0.5</code>.",
              "Fractions with a denominator of 2, 4, 8, 16, …, such as 0.5 (1/2) and 0.25 (1/4), are stored exactly.",
              "<code>round()</code> (Lesson 5) shortens a displayed result.",
            ]),
          ] },
          { kind: "code", part: "float values are approximate", title: "Example: exact and approximate results", blocks: [
            EX("print(0.1 + 0.2)\nprint(0.25 + 0.5)\nprint(1.1 + 2.2)", "some results show the error; 1/2 and 1/4 are exact", [
              { c: "0.1 + 0.2", e: "Approximate: <code>0.30000000000000004</code>" },
              { c: "0.25 + 0.5", e: "Exact: <code>0.75</code>" },
              { c: "1.1 + 2.2", e: "Approximate: <code>3.3000000000000003</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "One byte has 256 bit patterns: 0 to 255. Every byte has an address.",
              "A binary number is the sum of the place values of its 1 bits.",
              "Decimal to binary: divide by 2 repeatedly and read the remainders upward.",
              "A character is stored as its ASCII code: <code>'A'</code> is 65.",
              "The type decides the size. A float value can be approximate.",
            ]),
            NEXT("<b>Arithmetic operations</b>. Python computes new values from stored numbers with arithmetic operators."),
          ] },
          { kind: "exercise", title: "Convert decimal to binary", cols: [
            [T("Convert the decimal number 25 to an 8-bit binary number.<br>1. Use the division algorithm. Write each division on paper.<br>2. Enter 25 in the converter.<br>3. Compare the result with your answer on paper.")],
            [W("binaryConverter", { value: 0 })],
          ] },
          { kind: "exercise", title: "Convert binary to decimal", cols: [
            [L([
              "The byte <code>01000010</code> is stored in memory. Compute the decimal value of the byte with the place values.",
              "The decimal value is an ASCII code. Find the character with the code in the ASCII table.",
              "Enter the decimal value in the converter. Compare the result with both answers.",
            ], null, true)],
            [W("binaryConverter", { value: 0 })],
          ] },
          { kind: "exercise", title: "Calculate memory size", blocks: [
            PQ("Compute two results on paper. Then write a program that displays the target output.<br>1. Output line 1: the number of bit patterns in 2 bytes (one byte has 256).<br>2. Output line 2: the memory in bytes for 1000 C <code>int</code> values (4 bytes each).",
              "65536\n4000", "# Write your program here\n", null, "Use print(256 * 256) and print(1000 * 4)."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Determine the output of the program.<br>1. Write the output of each line on paper.<br>2. Mark each line that has an approximate result.")],
            [RUN("print(0.5 + 0.25)\nprint(0.1 + 0.7)\nprint(1.5 * 2)")],
          ], answerCol: 0, answer: [
            OUT("0.75\n0.7999999999999999\n3.0"),
            T("Line 2 has an approximate result: 0.1 and 0.7 have no exact binary form."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "How many different bit patterns does one byte have?", choices: ["8", "16", "255", "256"], answer: 3, explain: "One byte has 8 bits, so it has 2⁸ = 256 patterns: the numbers 0 to 255." },
            { q: "The ASCII code of 'A' is…", choices: ["1", "48", "65", "97"], answer: 2, explain: "'A' is 65. 'a' is 97, and '0' is 48." },
          ])] },
        ],
      },

      /* =============================== 5. ARITHMETIC =============================== */
      {
        id: "arithmetic",
        title: "Arithmetic operations",
        sub: "Operators, division, order of operations, result types, and functions for numbers.",
        slides: "02:42–46",
        keywords: "arithmetic operator + - * / // % ** floor division remainder modulus precedence order round abs math sqrt pi",
        deck: [
          { kind: "overview", title: "Arithmetic operations", blocks: [
            T("Arithmetic operators compute a new value from numbers. The result can be stored in a variable or displayed."),
            L(["The arithmetic operators", "Division: /, //, and %", "Order of operations", "int and float results", "round(), abs(), and the math module"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The arithmetic operators", title: "Seven arithmetic operators", blocks: [
            TB(["Operator", "Operation", "Example with 7 and 2", "Result"], [
              ["<code>+</code>", "addition", "<code>7 + 2</code>", "<code>9</code>"],
              ["<code>-</code>", "subtraction", "<code>7 - 2</code>", "<code>5</code>"],
              ["<code>*</code>", "multiplication", "<code>7 * 2</code>", "<code>14</code>"],
              ["<code>/</code>", "division", "<code>7 / 2</code>", "<code>3.5</code>"],
              ["<code>//</code>", "floor division", "<code>7 // 2</code>", "<code>3</code>"],
              ["<code>%</code>", "remainder (modulus)", "<code>7 % 2</code>", "<code>1</code>"],
              ["<code>**</code>", "power", "<code>7 ** 2</code>", "<code>49</code>"],
            ]),
          ] },
          { kind: "problem", part: "The arithmetic operators", title: "Problem: average speed", blocks: [
            T("A vehicle travels 120 km in 90 minutes. The program must display the average speed of the vehicle in km/h."),
            IPO([
              ["Input (given values)", "distance = 120 km, time = 90 min"],
              ["Required output", "speed in km/h"],
              ["Processing", "hours = minutes ÷ 60<br>speed = distance ÷ hours"],
              ["Algorithm", "1. Store the distance and the time.<br>2. Convert the time to hours.<br>3. Compute the speed.<br>4. Display the speed."],
            ]),
          ] },
          { kind: "code", part: "The arithmetic operators", title: "First example: execution step by step", blocks: [W("codeTrace", T_speed)] },
          { kind: "concept", part: "Division: /, //, and %", title: "Floor division and remainder", blocks: [
            L([
              "<code>a // b</code> gives the whole-number part of the division (for positive numbers).",
              "<code>a % b</code> gives the remainder of the division.",
            ]),
            TB(["Expression", "Result", "Reason"], [
              ["<code>17 // 5</code>", "<code>3</code>", "5 fits into 17 three times"],
              ["<code>17 % 5</code>", "<code>2</code>", "17 = 3 × 5 + 2"],
              ["<code>18 // 6</code>", "<code>3</code>", "6 fits into 18 exactly three times"],
              ["<code>18 % 6</code>", "<code>0</code>", "no remainder: 18 is a multiple of 6"],
              ["<code>18 % 2</code>", "<code>0</code>", "<code>n % 2</code> is 0 for an even number, and 1 for an odd number"],
              ["<code>-7 // 2</code>", "<code>-4</code>", "floor division rounds <b>down</b>: −3.5 becomes −4"],
            ]),
          ] },
          { kind: "code", part: "Division: /, //, and %", title: "Example: minutes to hours and minutes", blocks: [W("codeTrace", T_time)] },
          { kind: "concept", part: "Order of operations", title: "Order of operations", blocks: [
            TB(["Priority", "Operators"], [
              ["1 (first)", "<code>( )</code> parentheses"],
              ["2", "<code>**</code>"],
              ["3", "<code>-x</code>: a minus sign before one value"],
              ["4", "<code>*</code> &nbsp; <code>/</code> &nbsp; <code>//</code> &nbsp; <code>%</code>"],
              ["5 (last)", "<code>+</code> &nbsp; <code>-</code>"],
            ]),
            T("Operators with the same priority are evaluated from left to right. Only <code>**</code> groups from the right: <code>2 ** 3 ** 2</code> → <code>2 ** 9</code> → <code>512</code>."),
            T("<code>**</code> comes before the minus sign: <code>-2 ** 2</code> → <code>-(2 ** 2)</code> → <code>-4</code>. Parentheses change the order."),
          ] },
          { kind: "concept", part: "Order of operations", title: "Evaluating an expression step by step", blocks: [
            TB(["Step", "Expression"], [
              ["Start", "<code>9 // 2 + 9 % 2</code>"],
              ["1. <code>//</code> and <code>%</code>, left to right", "<code>4 + 1</code>"],
              ["2. <code>+</code>", "<code>5</code>"],
            ]),
            TB(["Step", "Expression"], [
              ["Start", "<code>(2 + 3) * 4 ** 2</code>"],
              ["1. parentheses", "<code>5 * 4 ** 2</code>"],
              ["2. <code>**</code>", "<code>5 * 16</code>"],
              ["3. <code>*</code>", "<code>80</code>"],
            ]),
          ] },
          { kind: "concept", part: "Order of operations", title: "Left to right, and a float result", blocks: [
            TB(["Expression", "Evaluation", "Result"], [
              ["<code>7 // 2 * 2</code>", "first <code>//</code>: <code>3 * 2</code>", "<code>6</code>"],
              ["<code>2 * 7 // 2</code>", "first <code>*</code>: <code>14 // 2</code>", "<code>7</code>"],
              ["<code>4 + 4 ** 2 / 2</code>", "<code>4 + 16 / 2</code> → <code>4 + 8.0</code>", "<code>12.0</code>"],
            ]),
            L([
              "<code>*</code> and <code>//</code> have the same priority, so the operator on the left is evaluated first. The same numbers in another order give another result.",
              "<code>/</code> gives the float <code>8.0</code>, so the sum is also a float: <code>12.0</code>. The next subtopic gives the rule.",
            ]),
          ] },
          { kind: "code", part: "Order of operations", title: "Example: average of three sensor readings", blocks: [
            EX('r1 = 20\nr2 = 22\nr3 = 27\nwrong = r1 + r2 + r3 / 3\naverage = (r1 + r2 + r3) / 3\nprint("Wrong:", wrong)\nprint("Average:", average)', "parentheses change the result", [
              { c: "r1 + r2 + r3 / 3", e: "Only r3 is divided: 20 + 22 + 9.0 → <code>51.0</code>" },
              { c: "(r1 + r2 + r3) / 3", e: "The sum is computed first: 69 / 3 → <code>23.0</code>" },
            ]),
          ] },
          { kind: "concept", part: "int and float results", title: "The type of an arithmetic result", blocks: [
            L([
              "<code>/</code> always gives a float.",
              "If one <b>operand</b> (a value on either side of an operator) is a float, the result is a float.",
              "If both operands are ints, <code>+</code>, <code>-</code>, <code>*</code>, <code>//</code>, and <code>%</code> give an int.",
            ]),
            TB(["Expression", "Result", "Type"], [
              ["<code>6 + 2</code>", "<code>8</code>", "int"],
              ["<code>6 / 2</code>", "<code>3.0</code>", "float"],
              ["<code>6 * 2.0</code>", "<code>12.0</code>", "float"],
              ["<code>7 // 2</code>", "<code>3</code>", "int"],
              ["<code>7.0 // 2</code>", "<code>3.0</code>", "float"],
            ], null, "center"),
          ] },
          { kind: "concept", part: "round(), abs(), and the math module", title: "Functions for numbers", blocks: [
            TB(["Function", "Result", "Example"], [
              ["<code>round(x, n)</code>", "x rounded to n decimal places", "<code>round(3.14159, 2)</code> → <code>3.14</code>"],
              ["<code>round(x)</code>", "x rounded to a whole number", "<code>round(4.6)</code> → <code>5</code>"],
              ["<code>abs(x)</code>", "the distance of x from 0", "<code>abs(-0.5)</code> → <code>0.5</code>"],
              ["<code>math.sqrt(x)</code>", "the square root of x", "<code>math.sqrt(16)</code> → <code>4.0</code>"],
              ["<code>math.pi</code>", "the constant π", "<code>3.141592653589793</code>"],
            ]),
            T("<code>round()</code> does not format the output: <code>round(2.0, 2)</code> displays <code>2.0</code>. A halfway value goes to the even neighbour: <code>round(2.5)</code> is <code>2</code>."),
            T("<code>math.sqrt</code> and <code>math.pi</code> need <code>import math</code> at the top of the program (Topic 05)."),
          ] },
          { kind: "code", part: "round(), abs(), and the math module", title: "Example: cross-section area of a cable", blocks: [
            EX('import math\ndiameter = 2.5   # mm\nradius = diameter / 2\narea = math.pi * radius ** 2\nprint("Area =", round(area, 2), "mm2")', "area = π × r²", [
              { c: "radius = diameter / 2", e: "2.5 / 2 → <code>1.25</code>" },
              { c: "math.pi * radius ** 2", e: "<code>**</code> first: 1.25 ** 2 → 1.5625. Then × π → 4.9087..." },
              { c: "round(area, 2)", e: "Two decimal places. Output: <code>Area = 4.91 mm2</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>/</code> gives a float. <code>//</code> gives the whole-number part. <code>%</code> gives the remainder.",
              "Order: parentheses, <code>**</code>, a minus sign <code>-x</code>, <code>* / // %</code>, then <code>+ -</code>. The same level runs left to right, except <code>**</code>.",
              "A float operand gives a float result.",
              "<code>round()</code> and <code>abs()</code> are built in. <code>math.sqrt()</code> and <code>math.pi</code> need <code>import math</code>.",
            ]),
            NEXT("<b>Input and type conversion</b>. The values so far are written in the code. The next lesson reads them from the keyboard."),
          ] },
          { kind: "exercise", title: "Evaluate the expressions", cols: [
            [T("Evaluate each expression in the program by hand.<br>1. Follow the order of operations.<br>2. Write each result on paper.")],
            [RUN("print(7 + 3 * 2)\nprint((7 + 3) * 2)\nprint(17 // 4)\nprint(17 % 4)\nprint(2 ** 3 + 1)\nprint(9 / 3)")],
          ], answerCol: 0, answer: [OUT("13\n20\n4\n1\n9\n3.0")] },
          { kind: "exercise", title: "Complete the code: Ohm's law", blocks: [
            PQ("Complete line 3, so that the program displays the target output.<br>1. A 12 V source is connected to a 4 Ω resistor.<br>2. Line 3 uses Ohm's law: current = voltage ÷ resistance.",
              "Current = 3.0 A", 'voltage = 12\nresistance = 4\ncurrent = \nprint("Current =", current, "A")\n', null, "Write the formula with the variable names: current = voltage / resistance."),
          ] },
          { kind: "exercise", title: "Write a program: seconds to minutes", blocks: [
            PQ("Write a program that converts 200 seconds to minutes and seconds.<br>1. Store 200 in <code>seconds</code>.<br>2. Compute the minutes with <code>//</code>.<br>3. Compute the seconds that remain with <code>%</code>.<br>4. Display the two results as in the target output.",
              "3 min 20 s", "# Write your program here\n", null, 'Use minutes = seconds // 60 and rest = seconds % 60, then print(minutes, "min", rest, "s").'),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Correct line 3, so that the program displays the target output.<br>The error: the perimeter of a 5 cm × 3 cm plate is 16 cm, but the program displays 13.",
              "Perimeter = 16", 'length = 5\nwidth = 3\nperimeter = 2 * length + width\nprint("Perimeter =", perimeter)\n', null,
              "Python evaluates multiplication before addition, so add parentheses: 2 * (length + width)."),
          ] },
          { kind: "exercise", title: "Write a program: power in a resistor", blocks: [
            PQ("Complete the program, so that the program displays the target output.<br>1. A current of 0.5 A flows through a 100 Ω resistor.<br>2. Compute the power P = I² × R. Use <code>**</code> for I².<br>3. Display the power.",
              "P = 25.0 W", "current = 0.5\nresistance = 100\n# compute and display the power\n", null, 'Use power = current ** 2 * resistance, then print("P =", power, "W").'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`13 // 4 + 13 % 4` equals…", choices: ["3", "3.25", "4", "4.25"], answer: 2, explain: "13 // 4 is 3 and 13 % 4 is 1, so 3 + 1 = 4." },
            { q: "The type of `6 / 2` is…", choices: ["int", "float", "str", "bool"], answer: 1, explain: "The operator / always gives a float: 3.0." },
          ])] },
        ],
      },

      /* =============================== 6. INPUT =============================== */
      {
        id: "input",
        title: "Input and type conversion",
        sub: "Reading values from the keyboard, converting types, and solving a problem step by step.",
        slides: "02:28–29, 43",
        keywords: "input prompt int float str conversion type conversion problem solving algorithm verify",
        deck: [
          { kind: "overview", title: "Input and type conversion", blocks: [
            T("<code>input()</code> reads a value typed by the user. The value is always text. Conversion functions change it into a number, so that the program can calculate with it."),
            L(["Reading text with input()", "Converting text to numbers", "Converting numbers to text", "Solving a problem step by step"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Reading text with input()", title: "input() reads one line of text", blocks: [
            CODE('variable = input("prompt text")', null, "syntax"),
            L([
              "<code>input()</code> displays the prompt text.",
              "The program waits until the user types a value and presses Enter.",
              "<code>input()</code> returns (gives back) the typed characters as a <b>str</b>, even when they are digits.",
              "The assignment stores the returned text in the variable.",
            ]),
          ] },
          { kind: "code", part: "Reading text with input()", title: "First example: execution step by step", blocks: [W("codeTrace", T_name)] },
          { kind: "concept", part: "Converting text to numbers", title: "Text digits are not numbers", blocks: [
            T("<code>input()</code> returns a str. Two inputs joined with <code>+</code> are placed side by side. They are not added."),
            T("To calculate, the program must first convert the text to a number."),
          ] },
          { kind: "code", part: "Converting text to numbers", title: "Example: the problem with text digits", blocks: [
            EX('a = input("First number: ")\nb = input("Second number: ")\nprint("Sum =", a + b)', "test input: 12 and 3", [
              { c: 'a = input(...)', e: "The user types 12. <code>a</code> stores <code>'12'</code>, a str." },
              { c: "a + b", e: "str + str joins the texts. Output: <code>Sum = 123</code>" },
            ], ["12", "3"]),
          ] },
          { kind: "concept", part: "Converting text to numbers", title: "Conversion functions", blocks: [
            TB(["Expression", "Result", "Type"], [
              ["<code>int(\"12\")</code>", "<code>12</code>", "int"],
              ["<code>float(\"3.5\")</code>", "<code>3.5</code>", "float"],
              ["<code>float(\"12\")</code>", "<code>12.0</code>", "float"],
              ["<code>int(3.9)</code>", "<code>3</code>: the fraction is removed, not rounded", "int"],
              ["<code>int(\"3.5\")</code>", "error: the text is not a whole number (ValueError)", "none"],
            ]),
            T("Convert the input directly: <code>voltage = float(input(\"Voltage: \"))</code>.<br>Use <code>float()</code> when the value can have a decimal point."),
          ] },
          { kind: "code", part: "Converting text to numbers", title: "Example: adding two numbers correctly", blocks: [
            EX('a = int(input("First number: "))\nb = int(input("Second number: "))\nprint("Sum =", a + b)', "test input: 12 and 3", [
              { c: "int(input(...))", e: "<code>input()</code> returns <code>'12'</code>. <code>int()</code> converts it to <code>12</code>." },
              { c: "a + b", e: "int + int → <code>15</code>. Output: <code>Sum = 15</code>" },
            ], ["12", "3"]),
          ] },
          { kind: "concept", part: "Converting numbers to text", title: "str() converts a number to text", blocks: [
            L([
              "<code>str(24)</code> returns the text <code>'24'</code>.",
              "<code>+</code> joins a str only with another str. A number must be converted with <code>str()</code> first.",
              "Commas in <code>print()</code> do not need <code>str()</code>, and they insert the spaces automatically.",
            ]),
            TB(["Statement (power = 24)", "Output"], [
              ["<code>print(\"Power =\", power, \"W\")</code>", "<code>Power = 24 W</code>"],
              ["<code>print(\"Power = \" + str(power) + \" W\")</code>", "<code>Power = 24 W</code>"],
              ["<code>print(\"Power =\" + str(power))</code>", "<code>Power =24</code>: <code>+</code> inserts no space"],
              ["<code>print(\"Power = \" + power)</code>", "error (TypeError)"],
            ]),
          ] },
          { kind: "concept", part: "Solving a problem step by step", title: "From a problem to a program", blocks: [
            L([
              "<b>Understand</b>: identify the <b>input</b>, the values the program receives, and the <b>output</b>, the result it must display.",
              "<b>Design</b>: determine the <b>processing</b>, the formula or the steps, and write the <b>algorithm</b>: the steps in order, in plain language.",
              "<b>Code</b>: convert each step into Python.",
              "<b>Test</b>: run the program with test values and compare the output with a hand calculation.",
              "<b>Correct</b>: if the output differs, find the wrong step, correct it, and test again.",
            ], null, true),
            T("These are the five steps of Topic 00. From Topic 03 on, the design also states which steps depend on a condition and which steps repeat."),
          ] },
          { kind: "problem", part: "Solving a problem step by step", title: "Problem: power from measured values", blocks: [
            T("The user enters the voltage and the current of a device. The program displays the power."),
            IPO([
              ["Input", "voltage (V) and current (A), typed by the user. Both can have decimals, so <code>float</code>."],
              ["Output", "power in W"],
              ["Processing", "power = voltage × current"],
              ["Conditions or repetition", "none"],
              ["Algorithm", "1. Read the voltage and convert it to float.<br>2. Read the current and convert it to float.<br>3. Compute the power.<br>4. Display the power."],
            ]),
          ] },
          { kind: "code", part: "Solving a problem step by step", title: "Code: execution step by step", blocks: [W("codeTrace", T_powerIn)] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>input(prompt)</code> displays the prompt and returns the typed text as a str.",
              "<code>int()</code> and <code>float()</code> convert text to numbers. <code>int(3.9)</code> is 3.",
              "<code>str()</code> converts a number to text, so that <code>+</code> can join it.",
              "Solve a problem with the five steps: understand, design, code, test, correct.",
            ]),
            NEXT("<b>Strings</b>. Text values have their own operations: length, joining, indexing, and slicing."),
          ] },
          { kind: "exercise", title: "Run with test values", cols: [
            [T("Test the program with the values in the table.<br>1. Compute the power of each row by hand first.<br>2. Run the program once for each row.<br>3. In each run, enter the voltage and the current of the row."),
              HIDE(TB(["Voltage (V)", "Current (A)", "Power (W)"], [["12", "1.5", ""], ["230", "0.5", ""], ["5", "0.2", ""]], null, "center"))],
            // studentRun: the task of this exercise is to run the program with test values
            [Object.assign(RUN('voltage = float(input("Voltage: "))\ncurrent = float(input("Current: "))\npower = voltage * current\nprint("Power =", power, "W")'), { studentRun: true })],
          ], answerCol: 0, answer: [
            TB(["Voltage (V)", "Current (A)", "Power (W)"], [["12", "1.5", "18.0"], ["230", "0.5", "115.0"], ["5", "0.2", "1.0"]], null, "center"),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T(PAPER + "<br>The user types 5 and then 7.")],
            [RUN('a = input("a: ")\nb = input("b: ")\nprint(a + b)\nprint(int(a) + int(b))', "Program (test input: 5 and 7)", ["5", "7"])],
          ], answerCol: 0, answer: [OUT("a: 5\nb: 7\n57\n12")] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Correct line 1, so that the program displays the target output.<br>1. The error: the program stops with a TypeError when line 2 adds 1 to the input.<br>2. Test input: 19.",
              "Age: 19\nNext year: 20", 'age = input("Age: ")\nprint("Next year:", age + 1)\n', ["19"], "Convert the input with int()."),
          ] },
          { kind: "exercise", title: "Write a program: temperature", blocks: [
            PQ("Write a program that converts a temperature from °C to °F and displays the target output.<br>1. Read the temperature in °C. Use the prompt <code>Temperature (C): </code>.<br>2. Compute F = C × 9 / 5 + 32.<br>3. Test input: 25.",
              "Temperature (C): 25\nTemperature (F) = 77.0", "# Write your program here\n", ["25"], 'Read and convert the input in one statement: c = float(input("Temperature (C): ")).'),
          ] },
          { kind: "exercise", title: "Design and write: resistance", blocks: [
            PQ("Design a program, and then write the program.<br>1. First complete the four comments.<br>2. Read the voltage and the current.<br>3. Display the resistance R = V ÷ I, as in the target output.<br>4. Test input: 12 and 0.5.",
              "Voltage (V): 12\nCurrent (A): 0.5\nR = 24.0 ohm",
              "# Input:\n# Output:\n# Processing:\n# Algorithm:\n\n", ["12", "0.5"], 'Use resistance = voltage / current, then print("R =", resistance, "ohm").'),
          ] },
          { kind: "exercise", title: "Write a program: battery runtime", blocks: [
            PQ("Write a program that displays the runtime of a battery in hours.<br>1. Read the capacity (mAh) and the current (mA). Use the prompts in the target output.<br>2. Convert both values with <code>int()</code>.<br>3. Compute the runtime: capacity ÷ current.<br>4. Test input: 2000 and 500.",
              "Capacity (mAh): 2000\nCurrent (mA): 500\nRuntime = 4.0 h", "# Write your program here\n", ["2000", "500"],
              'Read and convert the input in one statement: capacity = int(input("Capacity (mAh): ")).'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`input()` returns a value of type…", choices: ["int", "float", "str", "bool"], answer: 2, explain: "input() always returns a str. Convert it to calculate." },
            { q: '`int("7") + int(3.9)` equals…', choices: ["10", "10.9", "11", "Error"], answer: 0, explain: "int(\"7\") is 7 and int(3.9) is 3, so the sum is 10." },
          ])] },
        ],
      },

      /* =============================== 7. STRINGS =============================== */
      {
        id: "strings",
        title: "Strings",
        sub: "Creating text, length, joining, indexing, slicing, and string methods.",
        slides: "02:35–41",
        keywords: "string str quotes escape newline len concatenate repeat index slice immutable in upper lower replace",
        deck: [
          { kind: "overview", title: "Strings", blocks: [
            T("A <b>string</b> (<code>str</code>) is a sequence of characters, such as a device name, a unit, or a message from a sensor."),
            L(["Creating strings and escape characters", "Length, joining, and repeating", "Indexing", "Slicing", "Strings cannot be changed", "Checking and changing text"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Creating strings", title: "Quotes and escape characters", blocks: [
            L([
              "A string is written in double quotes <code>\"...\"</code> or single quotes <code>'...'</code>.",
              "To place one kind of quote inside the text, use the other kind outside: <code>\"It's on\"</code>.",
              "An <b>escape character</b> starts with a backslash <code>\\</code> and represents a special character.",
            ]),
            TB(["Escape", "Meaning"], [
              ["<code>\\n</code>", "new line"],
              ["<code>\\t</code>", "tab (horizontal space)"],
              ["<code>\\\"</code>", "a double quote inside double quotes"],
              ["<code>\\\\</code>", "one backslash"],
            ]),
          ] },
          { kind: "code", part: "Creating strings", title: "Example: escape characters", blocks: [
            EX('print("Line 1\\nLine 2")\nprint("V\\tI\\tP")\nprint("Status: \\"OK\\"")', "special characters in text", [
              { c: "\\n", e: "Starts a new line. Output: <code>Line 1</code>, then <code>Line 2</code>" },
              { c: "\\t", e: "A tab between the letters" },
              { c: "\\\"", e: "Quotes inside the text. Output: <code>Status: \"OK\"</code>" },
            ]),
          ] },
          { kind: "concept", part: "Length, joining, and repeating", title: "len(), +, and *", blocks: [
            TB(["Operation", "Example", "Result"], [
              ["<code>len(s)</code>: number of characters", "<code>len(\"Motor A\")</code>", "<code>7</code> (the space counts)"],
              ["<code>s1 + s2</code>: join (concatenate)", "<code>\"Motor\" + \"-\" + \"A\"</code>", "<code>\"Motor-A\"</code>"],
              ["<code>s * n</code>: repeat n times", "<code>\"=\" * 5</code>", "<code>\"=====\"</code>"],
            ]),
          ] },
          { kind: "code", part: "Length, joining, and repeating", title: "Example: a report header", blocks: [
            EX('label = "Sensor" + "-" + "A1"\nprint(label)\nprint(len(label))\nprint("=" * 20)', "len, + and *", [
              { c: '"Sensor" + "-" + "A1"', e: "Joined: <code>Sensor-A1</code>" },
              { c: "len(label)", e: "<code>9</code> characters" },
              { c: '"=" * 20', e: "A line of 20 equals signs" },
            ]),
          ] },
          { kind: "concept", part: "Indexing", title: "Each character has an index", blocks: [
            L([
              "The characters of a string are numbered from <b>0</b>. The number is the <b>index</b>.",
              "<code>s[i]</code> returns the character at index <code>i</code>. The last index is <code>len(s) - 1</code>.",
              "A negative index counts from the end: <code>s[-1]</code> is the last character.",
              "An index outside the string stops the program (IndexError).",
            ]),
            TB(["Character", "T", "M", "P", "3", "6"], [
              ["Index", "0", "1", "2", "3", "4"],
              ["Negative index", "-5", "-4", "-3", "-2", "-1"],
            ], "<code>code = \"TMP36\"</code>", "center"),
          ] },
          { kind: "visual", part: "Indexing", title: "Indexing: one character", blocks: [W("stringIndex", { text: "Motor A" })] },
          { kind: "code", part: "Indexing", title: "First example: execution step by step", blocks: [W("codeTrace", T_index)] },
          { kind: "concept", part: "Slicing", title: "A slice takes part of a string", blocks: [
            CODE("s[start:end]\ns[start:end:step]", null, "syntax"),
            L([
              "The slice starts at index <code>start</code> and stops <b>before</b> index <code>end</code>.",
              "An omitted <code>start</code> means 0. An omitted <code>end</code> means the end of the string.",
              "<code>step</code> takes every step-th character. The default is 1.",
            ]),
          ] },
          { kind: "concept", part: "Slicing", title: "Slicing examples", blocks: [
            TB(["Slice of \"Programming\"", "Indexes taken", "Result"], [
              ["<code>[0:4]</code>", "0, 1, 2, 3", "<code>\"Prog\"</code>"],
              ["<code>[3:7]</code>", "3, 4, 5, 6", "<code>\"gram\"</code>"],
              ["<code>[:3]</code>", "0, 1, 2", "<code>\"Pro\"</code>"],
              ["<code>[7:]</code>", "7 to the end", "<code>\"ming\"</code>"],
              ["<code>[-4:]</code>", "the last 4", "<code>\"ming\"</code>"],
              ["<code>[0:6:2]</code>", "0, 2, 4", "<code>\"Por\"</code>"],
            ], null, "center"),
          ] },
          { kind: "visual", part: "Slicing", title: "Slicing: part of a string", blocks: [W("stringSlice", { text: "Programming", end: -4 })] },
          { kind: "code", part: "Slicing", title: "Example: a value from a sensor message", blocks: [
            EX('message = "T=25.4C"\nvalue_text = message[2:6]\ntemperature = float(value_text)\nprint(temperature + 1)', "slice, convert, calculate", [
              { c: "message[2:6]", e: "Indexes 2, 3, 4, 5: <code>'25.4'</code>" },
              { c: "float(value_text)", e: "The text is converted to the number <code>25.4</code>" },
              { c: "temperature + 1", e: "A calculation is now possible: <code>26.4</code>" },
            ]),
          ] },
          { kind: "concept", part: "Strings cannot be changed", title: "Strings are immutable", blocks: [
            L([
              "A string cannot be changed after it is created. This property is called <b>immutable</b>.",
              "<code>s[0] = \"M\"</code> stops the program with a TypeError.",
              "To change text, build a <b>new</b> string and assign it to the variable.",
            ]),
            CODE('word = "motor"\nword = "M" + word[1:]\nprint(word)', "Motor", "building a new string"),
          ] },
          { kind: "concept", part: "Checking and changing text", title: "in, upper(), lower(), and replace()", blocks: [
            T("A <b>method</b> is a function that belongs to a value and is called with a dot: <code>s.upper()</code>. A function such as <code>len(s)</code> takes the value in its parentheses."),
            TB(["Operation", "Result", "Example with s = \"motor ok\""], [
              ["<code>x in s</code>", "<code>True</code> if x appears in s, otherwise <code>False</code>", "<code>\"ok\" in s</code> → <code>True</code>"],
              ["<code>s.upper()</code>", "a copy in capital letters", "<code>\"MOTOR OK\"</code>"],
              ["<code>s.lower()</code>", "a copy in small letters", "<code>\"motor ok\"</code>"],
              ["<code>s.replace(a, b)</code>", "a copy with every a replaced by b", "<code>s.replace(\"ok\", \"fault\")</code> → <code>\"motor fault\"</code>"],
            ]),
            T("These methods return a <b>new</b> string. The original string does not change."),
          ] },
          { kind: "code", part: "Checking and changing text", title: "Example: a status message", blocks: [
            EX('status = "motor ok"\nprint("ok" in status)\nprint(status.upper())\nprint(status.replace("ok", "fault"))\nprint(status)', "methods return new strings", [
              { c: "Lines 2 to 4", e: "<code>True</code>, <code>MOTOR OK</code>, <code>motor fault</code>" },
              { c: "print(status)", e: "The original is unchanged: <code>motor ok</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A string is written in quotes. <code>\\n</code> is a new line.",
              "<code>len()</code> counts characters. <code>+</code> joins strings. <code>*</code> repeats a string.",
              "<code>s[i]</code> uses an index from 0. <code>s[-1]</code> is the last character.",
              "<code>s[start:end]</code> stops before <code>end</code>.",
              "Strings are immutable. The methods return new strings.",
            ]),
            NEXT("<b>Errors and debugging</b>. The error messages of all statements in this chapter, and the steps to find a wrong result."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T(PAPER)],
            [RUN('word = "Voltage"\nprint(word[0])\nprint(word[-1])\nprint(word[1:4])\nprint(word[:3])\nprint(len(word))')],
          ], answerCol: 0, answer: [OUT("V\ne\nolt\nVol\n7")] },
          { kind: "exercise", title: "Complete the code", blocks: [
            PQ("Complete lines 2 and 3, so that the program displays the target output.<br>1. Line 2: write a slice of <code>device_id</code> that gives the year.<br>2. Line 3: write a slice of <code>device_id</code> that gives the unit number.",
              "Year: 2026 Number: 07", 'device_id = "PUMP-2026-07"\nyear = \nnumber = \nprint("Year:", year, "Number:", number)\n', null,
              "Count the indexes: P is index 0, and the year starts at index 5."),
          ] },
          { kind: "exercise", title: "Write a program: word report", blocks: [
            PQ("Write a program that reads a word and displays the target output.<br>1. Use the prompt <code>Word: </code>.<br>2. Display on one line: the word in capital letters, then the length of the word.<br>3. Test input: voltage.",
              "Word: voltage\nVOLTAGE 7", "# Write your program here\n", ["voltage"], "Use print(word.upper(), len(word))."),
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Correct line 2, so that the program displays the target output.<br>1. The error: line 2 must change the first letter to a capital letter, but the program stops with a TypeError.<br>2. In line 2, build a new string and store the new string in <code>s</code>.",
              "Sensor", 's = "sensor"\ns[0] = "S"\nprint(s)\n', null, 'A string cannot be changed, so use s = "S" + s[1:].'),
          ] },
          { kind: "exercise", title: "Write a program: initials", blocks: [
            PQ("Write a program that reads two names and displays the initials (the first letters).<br>1. Use the prompts in the target output.<br>2. Display a dot after each letter.<br>3. Test input: Somchai and Jaidee.",
              "First name: Somchai\nLast name: Jaidee\nS.J.", "# Write your program here\n", ["Somchai", "Jaidee"], 'Join the first letters and the dots with +: first[0] + "." + last[0] + ".".'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: '`"Python"[-1]` is…', choices: ["P", "n", "o", "Error"], answer: 1, explain: "Index -1 is the last character: n." },
            { q: '`len("  hi ")` is…', choices: ["2", "3", "4", "5"], answer: 3, explain: "Spaces are characters: 2 spaces + 2 letters + 1 space = 5." },
          ])] },
        ],
      },

      /* =============================== 8. ERRORS =============================== */
      {
        id: "errors",
        title: "Errors and debugging",
        sub: "The three kinds of error, error messages, and the steps to find a wrong result.",
        slides: "02:3–9",
        keywords: "error syntax runtime logical nameerror typeerror valueerror zerodivisionerror indexerror traceback debug",
        deck: [
          { kind: "overview", title: "Errors and debugging", blocks: [
            T("An <b>error</b> is a fault in a program. It stops the program, or it makes the program produce a wrong result.<br>Every statement type in this chapter can produce the errors in this lesson."),
            L(["Three kinds of error", "Reading an error message", "Common runtime errors", "Finding a logical error"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Three kinds of error", title: "Syntax, runtime, and logical errors", blocks: [
            TB(["Kind", "When it is found", "What happens"], [
              ["Syntax error", "before the program starts", "The code breaks the rules of Python. No line is executed."],
              ["Runtime error", "while the program runs", "An operation cannot be performed. The program stops at that line."],
              ["Logical error", "when the output is checked", "The program runs without a message, but the result is wrong."],
            ]),
            T("Topic 00, Lesson 4, shows syntax errors and their messages. This lesson continues with runtime errors and logical errors."),
          ] },
          { kind: "code", part: "Three kinds of error", title: "Example: a runtime error", blocks: [
            EX('voltage = 12\ncurrent = 0\nprint("Voltage =", voltage)\nresistance = voltage / current\nprint("R =", resistance)', "division by zero", [
              { c: 'print("Voltage =", voltage)', e: "Lines 1 to 3 run. Output: <code>Voltage = 12</code>" },
              { c: "voltage / current", e: "Division by zero. The program stops here with a ZeroDivisionError." },
              { c: 'print("R =", resistance)', e: "Line 5 does not run." },
            ]),
          ] },
          { kind: "concept", part: "Reading an error message", title: "Reading an error message", blocks: [
            CODE('Traceback (most recent call last):\n  File "<program>", line 4, in <module>\n    resistance = voltage / current\n                 ~~~~~~~~^~~~~~~~~\nZeroDivisionError: division by zero', null, "error message of the previous example", "text"),
            L([
              "Read the <b>last line</b> first: it names the error (Topic 00).",
              "<code>Traceback</code> starts the error message. The line <code>File \"&lt;program&gt;\", line 4</code> gives the <b>line number</b> of the statement that failed. <code>in &lt;module&gt;</code> means the main program.",
              "The source line follows. The marker <code>^</code> points to the part that failed: here, the division.",
              "Correct that line, or the earlier line that gave a variable its wrong value.",
            ]),
          ] },
          { kind: "concept", part: "Common runtime errors", title: "Common runtime errors", blocks: [
            TB(["Error", "Cause", "Correction"], [
              ["NameError", "a name is used before it is assigned, or it is misspelled", "assign the variable first; check the spelling and capitals"],
              ["TypeError", "an operation on incompatible types, such as str + int", "convert with <code>str()</code>, <code>int()</code>, or <code>float()</code>"],
              ["ValueError", "a conversion receives unsuitable text, such as <code>int(\"abc\")</code>", "enter a valid number; use <code>float()</code> for decimals"],
              ["ZeroDivisionError", "division by zero", "make sure that the divisor is not 0"],
              ["IndexError", "an index outside the string", "use an index from 0 to <code>len(s) - 1</code>"],
            ]),
          ] },
          { kind: "code", part: "Common runtime errors", title: "NameError", blocks: [
            EX("Voltage = 12\nprint(voltage)", "a misspelled name", [
              { c: "print(voltage)", e: "The last line: <code>NameError: name 'voltage' is not defined. Did you mean: 'Voltage'?</code> Line 1 created <code>Voltage</code> with a capital V." },
              { c: "Correction", e: "Use exactly the same name in both lines." },
            ]),
          ] },
          { kind: "code", part: "Common runtime errors", title: "TypeError", blocks: [
            EX('count = 5\nprint("Count: " + count)', "a str joined with an int", [
              { c: '"Count: " + count', e: 'The last line: <code>TypeError: can only concatenate str (not "int") to str</code> <i>Concatenate</i> means join: a str joins only with a str.' },
              { c: "Correction", e: '<code>"Count: " + str(count)</code> or <code>print("Count:", count)</code>' },
            ]),
          ] },
          { kind: "code", part: "Common runtime errors", title: "ValueError", blocks: [
            EX('reading = int("25.5")\nprint(reading)', "unsuitable text for int()", [
              { c: 'int("25.5")', e: "The last line: <code>ValueError: invalid literal for int() with base 10: '25.5'</code> The <i>literal</i> (the text) is not a whole decimal (<i>base 10</i>) number." },
              { c: "Correction", e: '<code>float("25.5")</code>' },
            ]),
          ] },
          { kind: "code", part: "Common runtime errors", title: "IndexError", blocks: [
            EX('code = "TMP36"\nprint(code[5])', "an index outside the string", [
              { c: "code[5]", e: "The last line: <code>IndexError: string index out of range</code> The indexes of <code>\"TMP36\"</code> are 0 to 4." },
              { c: "Correction", e: "<code>code[4]</code> or <code>code[-1]</code>" },
            ]),
          ] },
          { kind: "concept", part: "Finding a logical error", title: "Steps to find a logical error", blocks: [
            L([
              "Compute the expected result by hand.",
              "Run the program and compare its output with the expected result.",
              "Trace the program line by line: with a trace table, with Step Run, or with temporary <code>print()</code> statements that display the intermediate values, such as <code>print(\"hours =\", hours)</code>.",
              "Find the first line where a variable gets a wrong value.",
              "Correct that line, and remove the temporary <code>print()</code> statements.",
              "Run the program again and compare again.",
            ], null, true),
          ] },
          { kind: "code", part: "Finding a logical error", title: "Example: tracing a wrong cost", blocks: [W("codeTrace", T_cost)] },
          { kind: "code", part: "Finding a logical error", title: "Correction and verification", blocks: [
            EX('minutes = 90\nhours = minutes / 60\nenergy = 1.5 * hours   # kWh\ncost = energy * 4      # 4 baht/kWh\nprint("Cost =", cost, "baht")', "/ keeps the fraction", [
              { c: "minutes / 60", e: "Line 2 is corrected: 90 / 60 → <code>1.5</code> h, as expected." },
              { c: "energy, cost", e: "1.5 * 1.5 → 2.25 kWh, and 2.25 * 4 → 9.0. Output: <code>Cost = 9.0 baht</code>, the same as the hand calculation." },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A syntax error prevents the program from starting.",
              "A runtime error stops the program at one line.",
              "A logical error gives a wrong result without a message.",
              "Read the last line of an error message first, then the line number.",
              "To find a logical error, compare a hand calculation with a trace of the program.",
            ]),
            NEXT("<b>Chapter practice</b>. Complete engineering problems that combine all lessons of this chapter."),
          ] },
          { kind: "exercise", title: "Correct the syntax error", blocks: [
            PQ("Correct the syntax error, so that the program displays the target output.<br>The error: the program does not start.", "Current = 2 A", 'print("Current =" 2, "A")\n', null, "A comma is missing between the values."),
          ] },
          { kind: "exercise", title: "Correct the NameError", blocks: [
            PQ("Correct line 2, so that the program displays the target output.<br>The error: the program stops with a NameError.", "Speed: 1500", 'motor_speed = 1500\nprint("Speed:", motor_sped)\n', null, "Compare the spelling of the two names."),
          ] },
          { kind: "exercise", title: "Correct the TypeError", blocks: [
            PQ("Correct line 2, so that the program displays the target output.<br>1. The error: the program stops with a TypeError.<br>2. Keep the operator <code>+</code> in line 2, and use <code>str()</code>.", "Battery 85 %", 'level = 85\nprint("Battery " + level + " %")\n', null, 'Use "Battery " + str(level) + " %" in print().'),
          ] },
          { kind: "exercise", title: "Correct the ValueError", blocks: [
            PQ("Correct line 1, so that the program displays the target output.<br>1. The error: the user enters a length with a decimal point, and the program stops with a ValueError.<br>2. Test input: 2.5.",
              "Length (m): 2.5\nDouble: 5.0", 'length = int(input("Length (m): "))\nprint("Double:", length * 2)\n', ["2.5"], "Use float() instead of int()."),
          ] },
          { kind: "exercise", title: "Correct the logical error", blocks: [
            PQ("Correct line 2, so that the program displays the target output.<br>1. The error: 100 °C is 212 °F, but the program displays a wrong value.<br>2. The formula is F = C × 9 / 5 + 32.",
              "F = 212.0", 'c = 100\nf = c * (9 / 5 + 32)\nprint("F =", f)\n', null, "Remove the parentheses: c * 9 / 5 + 32."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which kind of error prevents a program from starting?", choices: ["Syntax error", "Runtime error", "Logical error", "ValueError"], answer: 0, explain: "A syntax error breaks the rules of Python, so no line is executed." },
            { q: '`int("abc")` causes a…', choices: ["NameError", "TypeError", "ValueError", "ZeroDivisionError"], answer: 2, explain: "The text \"abc\" is not a number, so int() reports a ValueError." },
          ])] },
        ],
      },

      /* =============================== 9. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete engineering problems that combine the whole chapter.",
        slides: "02:48",
        keywords: "practice problem solving algorithm ohm battery conversion sensor",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Each problem combines several lessons of this chapter. Solve every problem with the five steps:"),
            L([
              "<b>Understand</b>: the input and the output.",
              "<b>Design</b>: the processing, then the algorithm: the steps in order.",
              "<b>Code</b>: one Python statement for each step.",
              "<b>Test</b>: compare the output with a hand calculation.",
              "<b>Correct</b>: if the output differs, find the wrong step, correct it, and test again.",
            ], null, true),
            T("The Check button compares the output with the target for the given test input."),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: name and age", blocks: [
            T("Read a name and an age. Display the name and the age in the form <code>Name อายุ: Age</code>."),
            IPO([["Input", "a name (str) and an age (str is sufficient: no calculation)"], ["Output", "for example <code>Pokpong อายุ: 25</code>"], ["Processing", "<code>print(name, \"อายุ:\", age)</code>"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Write the program for Problem 1 that displays the target output.<br>1. Use the prompts <code>Name: </code> and <code>Age: </code>.<br>2. Test input: Pokpong and 25.", "Name: Pokpong\nAge: 25\nPokpong อายุ: 25", "# Write your program here\n", ["Pokpong", "25"], 'Use print(name, "อายุ:", age) for the last line of the output.'),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: first three characters", blocks: [
            T("Read a text from the user. Display the first 3 characters of the text in capital letters."),
            IPO([["Input", "a text (str)"], ["Output", "the first 3 characters in capital letters"], ["Processing", "slice <code>[:3]</code>, then <code>upper()</code>"]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("Write the program for Problem 2 that displays the target output.<br>1. Use the prompt <code>Enter text: </code>.<br>2. Test input: engineering.", "Enter text: engineering\nENG", "# Write your program here\n", ["engineering"], "Use text[:3].upper() for the first 3 characters in capital letters."),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: a calculation with rounding", blocks: [
            T("Read a number and display a computed result.<br>1. Add 2 to the number. Multiply the sum by 3.33.<br>2. Display the result with 2 decimal places."),
            IPO([["Input", "a number (float)"], ["Output", "(n + 2) × 3.33, rounded to 2 decimal places"], ["Processing", "<code>result = (n + 2) * 3.33</code>, then <code>round(result, 2)</code>"]]),
            N("Without <code>round()</code>, the input 5 displays <code>23.310000000000002</code>, because float values are approximate (Lesson 4)."),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Write the program for Problem 3 that displays the target output.<br>1. Use the prompt <code>Enter a number: </code>.<br>2. Test input: 5.", "Enter a number: 5\n23.31", "# Write your program here\n", ["5"], "Use round((n + 2) * 3.33, 2) for the result."),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: Ohm's law", blocks: [
            T("Read the voltage of a source and the resistance of a resistor. Display the current, rounded to 2 decimal places."),
            IPO([["Input", "voltage (V) and resistance (Ω), both float"], ["Output", "current in A, 2 decimal places"], ["Processing", "current = voltage ÷ resistance"]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", blocks: [
            PQ("Write the program for Problem 4 that displays the target output.<br>1. Use the prompts in the target output.<br>2. Test input: 9 and 4.7.", "Voltage (V): 9\nResistance (ohm): 4.7\nCurrent = 1.91 A", "# Write your program here\n", ["9", "4.7"], 'Use print("Current =", round(voltage / resistance, 2), "A") for the last line of the output.'),
          ] },
          { kind: "problem", part: "Problem 5", title: "Problem 5: time conversion", blocks: [
            T("Read a time in seconds. Display the time in hours, minutes, and seconds."),
            IPO([
              ["Input", "seconds (int)"],
              ["Output", "hours, minutes, and seconds"],
              ["Processing", "<code>hours = s // 3600</code><br><code>minutes = s % 3600 // 60</code><br><code>rest = s % 60</code>"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 5", title: "Problem 5: write the program", blocks: [
            PQ("Write the program for Problem 5 that displays the target output.<br>1. Use the prompt <code>Seconds: </code>.<br>2. Test input: 3725.<br>3. Check by hand: 1 × 3600 + 2 × 60 + 5 = 3725.", "Seconds: 3725\n1 h 2 min 5 s", "# Write your program here\n", ["3725"], 'Use print(hours, "h", minutes, "min", rest, "s") for the last line of the output.'),
          ] },
          { kind: "problem", part: "Problem 6", title: "Problem 6: battery runtime", blocks: [
            T("Read the capacity of a battery (mAh) and the current of a device (mA). Display the runtime in hours and minutes."),
            IPO([
              ["Input", "capacity (mAh) and current (mA), both int"],
              ["Output", "runtime in whole hours and minutes"],
              ["Processing", "<code>total_minutes = capacity * 60 // current</code><br>then <code>//</code> and <code>%</code> with 60"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 6", title: "Problem 6: write the program", blocks: [
            PQ("Write the program for Problem 6 that displays the target output.<br>1. Use the prompts in the target output.<br>2. Test input: 3000 and 450.<br>3. Check by hand: 3000 × 60 ÷ 450 = 400 minutes = 6 h 40 min.", "Capacity (mAh): 3000\nCurrent (mA): 450\nRuntime: 6 h 40 min", "# Write your program here\n", ["3000", "450"], 'Use print("Runtime:", hours, "h", minutes, "min") for the last line of the output.'),
          ] },
          { kind: "problem", part: "Problem 7", title: "Problem 7: a sensor message", blocks: [
            T("A voltage sensor sends a message such as <code>V=12.5</code>. The device current is 2 A. Read the message, and display the voltage and the power."),
            IPO([
              ["Input", "a message (str) in the form <code>V=value</code>"],
              ["Output", "the voltage and the power"],
              ["Processing", "<code>voltage = float(message[2:])</code><br><code>power = voltage * 2</code>"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 7", title: "Problem 7: write the program", blocks: [
            PQ("Write the program for Problem 7 that displays the target output.<br>1. Use the prompt <code>Message: </code>.<br>2. Test input: V=12.5.", "Message: V=12.5\nVoltage = 12.5 V\nPower = 25.0 W", "# Write your program here\n", ["V=12.5"], "Use voltage = float(message[2:]) to get the voltage from the message."),
          ] },
          { kind: "summary", title: "Chapter summary: lessons 1 to 4", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1. Output", "<code>print()</code> displays values. Commas insert spaces. <code>sep</code> and <code>end</code> change them."],
              ["2. Variables", "<code>name = value</code> stores a value. <code>x = x + 1</code> updates it."],
              ["3. Data types", "<code>int</code>, <code>float</code>, <code>str</code>, <code>bool</code>. <code>type()</code> reports the type."],
              ["4. Memory", "Bits, bytes, binary, ASCII. float values are approximate."],
            ]),
          ] },
          { kind: "summary", title: "Chapter summary: lessons 5 to 8", blocks: [
            TB(["Lesson", "Key rule"], [
              ["5. Arithmetic", "<code>/ // % **</code> and the order of operations."],
              ["6. Input", "<code>input()</code> returns a str. <code>int()</code>, <code>float()</code>, <code>str()</code> convert."],
              ["7. Strings", "<code>len</code>, <code>+</code>, <code>*</code>, indexing, slicing, methods."],
              ["8. Errors", "Syntax, runtime, logical. Read the last line of the message first."],
            ]),
            N("<b>Topic 03: Decisions and loops</b>. A program chooses between statements with <code>if</code> and repeats statements with <code>while</code> and <code>for</code>.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
