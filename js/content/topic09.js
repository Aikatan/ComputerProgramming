/* ===================== Topic 09 - Algorithms & Efficiency =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: algorithms -> growth rates and Big-O -> searching -> sorting
   -> choosing a data structure -> efficient Python -> developing a larger program -> practice.
   Python level: t02-t08 material only, including sets (Topic 06). No comprehensions, sorted(key=), or decorators. No f-strings.
   Only the time module (time.perf_counter) is new. There is no lecture deck for this chapter.
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
  const T_max = {
    code: ["readings = [21, 25, 19, 27]", "highest = readings[0]", "for r in readings[1:]:", "    if r > highest:", "        highest = r", 'print("Highest:", highest)'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "The four readings are stored in a list.", set: { readings: "[21, 25, 19, 27]" } },
      { line: 1, note: "The first reading, 21, is the highest so far.", set: { highest: "21" } },
      { line: 2, note: "readings[1:] is [25, 19, 27]. r takes the first value, 25.", set: { r: "25" } },
      { line: 3, note: "25 > 21 is True." },
      { line: 4, note: "25 is the new highest so far.", set: { highest: "25" } },
      { line: 2, note: "r takes the next value, 19.", set: { r: "19" } },
      { line: 3, note: "19 > 25 is False: highest does not change." },
      { line: 2, note: "r takes the last value, 27.", set: { r: "27" } },
      { line: 3, note: "27 > 25 is True." },
      { line: 4, note: "27 is the new highest so far.", set: { highest: "27" } },
      { line: 5, note: "The loop has ended. The result is displayed. Result check: the highest of 21, 25, 19, and 27 is 27.", print: "Highest: 27" },
    ],
  };
  const T_exMin = {
    code: ["readings = [24, 18, 20]", "lowest = readings[0]", "for r in readings[1:]:", "    if r < lowest:", "        lowest = r", "print(lowest)"],
    steps: [
      { line: 0, note: "The list is stored.", set: { readings: "[24, 18, 20]" } },
      { line: 1, note: "The first reading is the lowest so far.", set: { lowest: "24" } },
      { line: 2, note: "r takes the first value of [18, 20].", set: { r: "18" } },
      { line: 3, note: "18 < 24 is True." },
      { line: 4, note: "18 is the new lowest.", set: { lowest: "18" } },
      { line: 2, note: "r takes the next value.", set: { r: "20" } },
      { line: 3, note: "20 < 18 is False." },
      { line: 5, note: "The lowest reading is displayed.", print: "18" },
    ],
  };
  const T_nested = {
    code: ["n = 2", "count = 0", "for i in range(n):", "    for j in range(n):", "        count = count + 1", 'print("Steps:", count)'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "n is the input size.", set: { n: "2" } },
      { line: 1, note: "The step counter starts at 0.", set: { count: "0" } },
      { line: 2, note: "Outer loop: i = 0.", set: { i: "0" } },
      { line: 3, note: "Inner loop: j = 0.", set: { j: "0" } },
      { line: 4, note: "count = 0 + 1 → 1.", set: { count: "1" } },
      { line: 3, note: "Inner loop: j = 1.", set: { j: "1" } },
      { line: 4, note: "count → 2. The inner loop has run n times.", set: { count: "2" } },
      { line: 2, note: "Outer loop: i = 1. The inner loop starts again.", set: { i: "1" } },
      { line: 3, note: "Inner loop: j = 0.", set: { j: "0" } },
      { line: 4, note: "count → 3.", set: { count: "3" } },
      { line: 3, note: "Inner loop: j = 1.", set: { j: "1" } },
      { line: 4, note: "count → 4. Both loops have ended.", set: { count: "4" } },
      { line: 5, note: "The number of steps is displayed. Result check: n × n = 2 × 2 = 4 steps.", print: "Steps: 4" },
    ],
  };
  const T_halve = {
    code: ["n = 8", "halvings = 0", "while n > 1:", "    n = n // 2", "    halvings = halvings + 1", 'print("Halvings:", halvings)'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "n is the number of elements.", set: { n: "8" } },
      { line: 1, note: "The counter starts at 0.", set: { halvings: "0" } },
      { line: 2, note: "8 > 1 is True." },
      { line: 3, note: "8 // 2 → 4.", set: { n: "4" } },
      { line: 4, note: "One halving.", set: { halvings: "1" } },
      { line: 2, note: "4 > 1 is True." },
      { line: 3, note: "4 // 2 → 2.", set: { n: "2" } },
      { line: 4, note: "Two halvings.", set: { halvings: "2" } },
      { line: 2, note: "2 > 1 is True." },
      { line: 3, note: "2 // 2 → 1.", set: { n: "1" } },
      { line: 4, note: "Three halvings.", set: { halvings: "3" } },
      { line: 2, note: "1 > 1 is False: the loop ends." },
      { line: 5, note: "The number of halvings is displayed. Result check: 8 → 4 → 2 → 1 is 3 halvings, and 2³ = 8.", print: "Halvings: 3" },
    ],
  };
  const T_lin = {
    code: ["ids = [12, 30, 18]", "target = 30", "position = -1", "for i in range(len(ids)):", "    if ids[i] == target:", "        position = i", 'print("Position:", position)'],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "The list to search.", set: { ids: "[12, 30, 18]" } },
      { line: 1, note: "The value to find.", set: { target: "30" } },
      { line: 2, note: "-1 means: not found.", set: { position: "-1" } },
      { line: 3, note: "range(3) gives 0, 1, 2. i = 0.", set: { i: "0" } },
      { line: 4, note: "ids[0] is 12. 12 == 30 is False." },
      { line: 3, note: "i = 1.", set: { i: "1" } },
      { line: 4, note: "ids[1] is 30. 30 == 30 is True." },
      { line: 5, note: "The index is stored.", set: { position: "1" } },
      { line: 3, note: "i = 2: the loop continues.", set: { i: "2" } },
      { line: 4, note: "ids[2] is 18. 18 == 30 is False." },
      { line: 6, note: "The position is displayed. Result check: ids[1] is 30. The loop compared all 3 elements.", print: "Position: 1" },
    ],
  };
  const T_pass = {
    code: ["a = [4, 1, 5, 2]", "for j in range(len(a) - 1):", "    if a[j] > a[j + 1]:", "        a[j], a[j + 1] = a[j + 1], a[j]", "print(a)"],
    steps: [
      { line: -1, note: "No variable exists yet." },
      { line: 0, note: "The list to sort.", set: { a: "[4, 1, 5, 2]" } },
      { line: 1, note: "len(a) - 1 is 3, so j takes 0, 1, 2. j = 0.", set: { j: "0" } },
      { line: 2, note: "a[0] > a[1]: 4 > 1 is True." },
      { line: 3, note: "Swap: 4 and 1 change places.", set: { a: "[1, 4, 5, 2]" } },
      { line: 1, note: "j = 1.", set: { j: "1" } },
      { line: 2, note: "a[1] > a[2]: 4 > 5 is False. No swap." },
      { line: 1, note: "j = 2.", set: { j: "2" } },
      { line: 2, note: "a[2] > a[3]: 5 > 2 is True." },
      { line: 3, note: "Swap: 5 reaches the end.", set: { a: "[1, 4, 2, 5]" } },
      { line: 4, note: "One pass is complete. Result check: the largest value, 5, is at the end. The rest of the list is not sorted yet.", print: "[1, 4, 2, 5]" },
    ],
  };
  const T_exPass = {
    code: ["a = [2, 3, 1]", "for j in range(len(a) - 1):", "    if a[j] > a[j + 1]:", "        a[j], a[j + 1] = a[j + 1], a[j]", "print(a)"],
    steps: [
      { line: 0, note: "The list to sort.", set: { a: "[2, 3, 1]" } },
      { line: 1, note: "j = 0.", set: { j: "0" } },
      { line: 2, note: "2 > 3 is False." },
      { line: 1, note: "j = 1.", set: { j: "1" } },
      { line: 2, note: "3 > 1 is True." },
      { line: 3, note: "Swap.", set: { a: "[2, 1, 3]" } },
      { line: 4, note: "The list is displayed.", print: "[2, 1, 3]" },
    ],
  };

  const BUBBLE = "a = [4, 1, 5, 2]\nn = len(a)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if a[j] > a[j + 1]:\n            a[j], a[j + 1] = a[j + 1], a[j]\nprint(a)";
  const BINARY = "def binary_search(data, target):\n    low = 0\n    high = len(data) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        low = high + 1  # replace this line\n    return -1\nids = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(binary_search(ids, 72))";
  const BINARY_ERR = "def binary_search(data, target):\n    low = 0\n    high = len(data) - 1\n    while low < high:\n        mid = (low + high) / 2\n        if data[mid] == target:\n            return mid\n        elif data[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\nids = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(binary_search(ids, 23))\nprint(binary_search(ids, 91))";

  /* ---------- the sensor-log program of Lesson 7, one part per function ---------- */
  const P_VALID_V1 = 'def is_valid(text):\n    value = float(text)\n    return -40 <= value <= 125\n\nassert is_valid("21.5") == True\nassert is_valid("999") == False\nassert is_valid("error") == False\nprint("is_valid: all tests passed")';
  const P_VALID = "def is_valid(text):\n    try:\n        value = float(text)\n    except ValueError:\n        return False\n    return -40 <= value <= 125";
  const P_READ = "def read_readings(filename):\n    with open(filename) as f:\n        lines = f.readlines()\n    values = []\n    for line in lines:\n        text = line.strip()\n        if is_valid(text):\n            values.append(float(text))\n    return values";
  const P_STATS = 'def statistics(readings):\n    count = len(readings)\n    total = sum(readings)\n    average = round(total / count, 2)\n    stats = {}\n    stats["readings"] = count\n    stats["minimum"] = min(readings)\n    stats["maximum"] = max(readings)\n    stats["average"] = average\n    return stats';
  const P_STATS_GAP = "def statistics(readings):\n    stats = {}\n    # Complete this function\n    return stats";
  const P_REPORT = 'def report(stats):\n    print("Sensor log report")\n    for name in stats:\n        print(name + ":", stats[name])';
  // the main program; the two arguments are the lines that it writes to the file
  const P_MAIN = (first, second) => '# Main program\nwith open("log.txt", "w") as f:\n    f.write("' + first + '")\n    f.write("' + second + '")\n\nreadings = read_readings("log.txt")\nif len(readings) == 0:\n    print("No valid readings.")\nelse:\n    stats = statistics(readings)\n    report(stats)';
  const P_MAIN_1 = P_MAIN("21.5\\n22.8\\nerror\\n", "24.1\\n999\\n19.6\\n");
  const PROGRAM = [P_VALID, P_READ, P_STATS, P_REPORT, P_MAIN_1].join("\n\n");
  const PROGRAM_GAP = [P_VALID, P_READ, P_STATS_GAP, P_REPORT, P_MAIN("18.5\\n-50\\n20.0\\n", "N/A\\n23.5\\n")].join("\n\n");
  const PROGRAM_MODIFY = [P_VALID, P_READ, P_STATS, P_REPORT, P_MAIN("30.2\\n28.9\\n-99\\n31.5\\n", "fault\\n27.4\\n33.0\\n")].join("\n\n");

  App.registerTopic({
    id: "t09",
    title: "Algorithms & Efficiency",
    short: "Algorithms & Efficiency",
    blurb: "Algorithms, Big-O notation, searching and sorting, data structures, efficient Python, and developing a larger program.",
    intro: "This chapter compares algorithms by the amount of work they do. It counts the steps of a program, describes their growth with Big-O notation, and applies this to searching, sorting, and the choice of data structures. It then builds a larger program from tested functions. Each lesson uses only what the lessons before it have explained:<br>algorithms → Big-O → searching → sorting → data structures → efficient Python → a larger program → practice.",
    lessons: [
      /* =============================== 1. ALGORITHMS =============================== */
      {
        id: "what-is-algorithm",
        title: "Algorithms",
        sub: "What an algorithm is, its properties, correctness, and counting its steps.",
        keywords: "algorithm steps properties correctness test edge case count comparisons time space",
        deck: [
          { kind: "overview", title: "Algorithms", blocks: [
            T("An <b>algorithm</b> is a sequence of steps that solves a problem (Topic 04). A <b>program</b> is an algorithm written in a programming language, such as Python or C (Topic 10)."),
            T("One problem can have several algorithms. They give the same result, but they can do very different amounts of work. This chapter compares them."),
            L(["Definition and properties", "From algorithm to program", "Correctness and testing", "Counting steps", "Time and space"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Definition and properties", title: "Properties of an algorithm", blocks: [
            T("Topic 04 wrote algorithms as flowcharts and pseudocode. Every algorithm has these five properties."),
            TB(["Property", "Meaning"], [
              ["Input", "It receives zero or more values."],
              ["Output", "It produces at least one result."],
              ["Definite", "Each step has exactly one meaning."],
              ["Finite", "It stops after a finite number of steps."],
              ["Effective", "Each step is basic enough to be carried out by hand or by a computer."],
            ]),
          ] },
          { kind: "problem", part: "From algorithm to program", title: "Problem: the highest reading", blocks: [
            T("A sensor records four temperatures. Find the highest one."),
            IPO([
              ["Input", "the readings 21, 25, 19, 27"],
              ["Output", "the highest reading: 27"],
              ["Processing", "compare each reading with the highest reading found so far"],
            ]),
          ] },
          { kind: "concept", part: "From algorithm to program", title: "The algorithm in steps", blocks: [
            L([
              "Take the first reading as the highest so far.",
              "For each of the other readings: if it is greater than the highest so far, it becomes the highest so far.",
              "After the last reading, display the highest so far.",
            ], null, true),
            T("Each step has one meaning, and the algorithm stops after the last reading."),
          ] },
          { kind: "code", part: "From algorithm to program", title: "The program: execution step by step", blocks: [W("codeTrace", T_max)] },
          { kind: "concept", part: "Correctness and testing", title: "Correctness", blocks: [
            L([
              "An algorithm is <b>correct</b> when it gives the right output for every valid input.",
              "A <b>test</b> runs the program with an input whose correct output is known, and compares the two outputs.",
              "One passed test does not prove that an algorithm is correct. The tests must also include <b>edge cases</b>: unusual inputs at the limits.",
            ]),
          ] },
          { kind: "code", part: "Correctness and testing", title: "Example: an error that an ordinary test misses", blocks: [
            EX('readings = [-5, -2, -8]\nhighest = 0\nfor r in readings:\n    if r > highest:\n        highest = r\nprint("Highest:", highest)', "this program has a logical error", [
              { c: "highest = 0", e: "Correct for 21, 25, 19, 27. Here, no reading is greater than 0." },
              { c: "print(...)", e: "<code>Highest: 0</code>, but the correct output is -2." },
              { c: "the fix", e: "Start with <code>highest = readings[0]</code>." },
            ]),
          ] },
          { kind: "concept", part: "Correctness and testing", title: "Test cases for the highest reading", blocks: [
            TB(["Input", "Expected output", "What it tests"], [
              ["<code>[21, 25, 19, 27]</code>", "27", "an ordinary case"],
              ["<code>[7]</code>", "7", "one element"],
              ["<code>[-5, -2, -8]</code>", "-2", "negative values"],
              ["<code>[30, 12, 8]</code>", "30", "the answer is the first element"],
              ["<code>[4, 4, 4]</code>", "4", "equal values"],
              ["<code>[]</code>", "<span class='t-no'>IndexError</span>", "an invalid input: the algorithm needs at least one reading"],
            ]),
          ] },
          { kind: "code", part: "Correctness and testing", title: "Example: running the tests", blocks: [
            T("Each test compares one call of the function with its expected output: <code>True</code> is a passed test."),
            RUN("def highest(values):\n    top = values[0]\n    for v in values[1:]:\n        if v > top:\n            top = v\n    return top\nprint(highest([21, 25, 19, 27]) == 27, highest([7]) == 7)\nprint(highest([-5, -2, -8]) == -2, highest([30, 12, 8]) == 30)\nprint(highest([4, 4, 4]) == 4)"),
          ] },
          { kind: "concept", part: "Counting steps", title: "Measuring work by counting steps", blocks: [
            L([
              "The time a program takes depends on the computer. The number of steps depends only on the algorithm and the input.",
              "The work of an algorithm is therefore measured by counting its basic steps, for example its comparisons.",
              "<b>n</b> is the input size: here, the number of readings.",
              "The highest-reading algorithm compares each reading except the first once: <b>n − 1</b> comparisons.",
            ]),
          ] },
          { kind: "concept", part: "Counting steps", title: "Comparisons for different input sizes", blocks: [
            TB(["n (readings)", "Comparisons: n − 1"], [["4", "3"], ["10", "9"], ["1000", "999"], ["1 000 000", "999 999"]], null, "center"),
            T("The number of comparisons grows in proportion to n: twice as many readings need about twice as many comparisons."),
          ] },
          { kind: "code", part: "Counting steps", title: "Example: counting the comparisons", blocks: [
            T("A counter variable is increased by 1 at each comparison."),
            RUN("readings = [21, 25, 19, 27, 30, 18]\nhighest = readings[0]\ncomparisons = 0\nfor r in readings[1:]:\n    comparisons = comparisons + 1\n    if r > highest:\n        highest = r\nprint(highest, comparisons)"),
          ] },
          { kind: "concept", part: "Time and space", title: "Time and space", blocks: [
            TB(["Cost", "Meaning", "Highest reading"], [
              ["Time", "the number of steps, as n grows", "n − 1 comparisons"],
              ["Space", "the extra memory, as n grows", "two extra variables, highest and r, for any n"],
            ]),
            L([
              "The input itself is not counted as extra memory.",
              "The slice <code>readings[1:]</code> also copies n − 1 readings, because a slice is a new list (Topic 06). A loop over <code>range(1, len(readings))</code> needs only the two variables.",
              "This chapter mainly compares time. Lessons 5 and 6 also consider memory.",
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "An algorithm is a finite sequence of definite steps. It has input and output, and each step can be carried out.",
              "A correct algorithm gives the right output for every valid input. Tests must include edge cases.",
              "Work is measured by counting basic steps as a function of the input size n.",
              "Time: the number of steps. Space: the extra memory.",
            ]),
            NEXT("<b>Growth rates and Big-O</b>. How the number of steps grows with n, and how to describe it."),
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("Complete the trace table on paper. The first row is done. The next exercise checks it."),
            W("traceTable", { trace: T_exMin, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Check your trace", cols: [
            [T("Run the program with <b>Step Run</b>. Compare the variables after each line with your table.")],
            [RUN(T_exMin.code.join("\n"))],
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The program displays 0 instead of the lowest reading. Correct the error.",
              "Lowest: 18", 'readings = [24, 18, 20]\nlowest = 0\nfor r in readings:\n    if r < lowest:\n        lowest = r\nprint("Lowest:", lowest)', null, "No reading is below 0. Start with a value from the list."),
          ] },
          { kind: "exercise", title: "Modify a program", blocks: [
            PQ("Modify the program so that it also displays the index of the highest reading.",
              "27 3", "readings = [21, 25, 19, 27]\nhighest = readings[0]\nfor r in readings[1:]:\n    if r > highest:\n        highest = r\nprint(highest)", null, "Loop over the indexes with for i in range(1, len(readings)). Store i whenever highest changes."),
          ] },
          { kind: "exercise", title: "Write a program: test a function", blocks: [
            PQ("Write the function <code>lowest(values)</code>, which returns the lowest value. Test it with [24, 18, 20], [7], and [-5, -2, -8] in one print.",
              "18 7 -8", "# Write your program here\n", null, "Start with low = values[0]. Then compare each other value with low."),
          ] },
          { kind: "exercise", title: "Design an algorithm: the range", blocks: [
            PQ("The range of the readings is the highest minus the lowest. Find it with one loop. Write the algorithm as comments first, then the program.",
              "8", "# Input:\n# Output:\n# Processing:\n# Algorithm:\n\nreadings = [21, 25, 19, 27]\n", null, "Keep highest and lowest, both starting at readings[0]. Update both in the same loop."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "An algorithm must stop after a limited number of steps. This property is called…", choices: ["definite", "finite", "effective", "correct"], answer: 1, explain: "Finite: the algorithm ends after a finite number of steps." },
            { q: "How many comparisons does the highest-reading algorithm make for 50 readings?", choices: ["50", "49", "25", "2500"], answer: 1, explain: "Each reading except the first is compared once: n − 1 = 49." },
          ])] },
        ],
      },

      /* =============================== 2. GROWTH RATES AND BIG-O =============================== */
      {
        id: "big-o",
        title: "Growth rates and Big-O",
        sub: "How the number of steps grows with the input size, and Big-O notation.",
        keywords: "big o notation growth rate constant logarithmic linear quadratic exponential nested loop halving log n",
        deck: [
          { kind: "overview", title: "Growth rates and Big-O", blocks: [
            T("The number of steps of an algorithm depends on the input size n. This lesson describes how fast the number of steps grows when n grows."),
            L(["Loops and steps", "Nested loops", "Halving and log n", "Big-O notation", "Common growth rates"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Loops and steps", title: "Counting the steps of a program", blocks: [
            TB(["Program", "Steps for n items"], [
              ["one statement, for example <code>x = data[0]</code>", "1"],
              ["one loop over the items", "n"],
              ["two loops, one after the other", "n + n = 2n"],
              ["one loop with 3 statements inside", "3n"],
            ]),
            T("A step is one basic operation: an assignment, a comparison, or an arithmetic operation."),
          ] },
          { kind: "code", part: "Loops and steps", title: "Example: one loop", blocks: [
            EX("def count_steps(n):\n    count = 0\n    for i in range(n):\n        count = count + 1\n    return count\nprint(count_steps(10))\nprint(count_steps(100))", "the loop body runs n times", [
              { c: "count = count + 1", e: "runs once for each i: n times" },
              { c: "print(...)", e: "<code>10</code>, then <code>100</code>: 10 times more items, 10 times more steps" },
            ]),
          ] },
          { kind: "concept", part: "Nested loops", title: "A loop inside a loop", blocks: [
            CODE("for i in range(n):\n    for j in range(n):\n        statement", null, "structure"),
            L([
              "For each value of i, the inner loop runs completely: n times.",
              "The outer loop runs n times, so the statement runs n × n = n² times.",
              "Doubling n makes the work four times larger.",
            ]),
          ] },
          { kind: "code", part: "Nested loops", title: "First example: execution step by step", blocks: [W("codeTrace", T_nested)] },
          { kind: "code", part: "Nested loops", title: "Example: n² steps", blocks: [
            EX("def count_pairs(n):\n    count = 0\n    for i in range(n):\n        for j in range(n):\n            count = count + 1\n    return count\nprint(count_pairs(10))\nprint(count_pairs(100))", "the inner statement runs n × n times", [
              { c: "count_pairs(10)", e: "<code>100</code>" },
              { c: "count_pairs(100)", e: "<code>10000</code>: 10 times more items, 100 times more steps" },
            ]),
          ] },
          { kind: "concept", part: "Halving and log n", title: "Halving the input", blocks: [
            L([
              "Some algorithms halve the remaining data at each step. Binary search (Lesson 3) works this way.",
              "The number of halvings from n down to 1 is <b>log₂ n</b>, the logarithm of n to base 2.",
              "2³ = 8, so log₂ 8 = 3: 8 → 4 → 2 → 1.",
              "Doubling n adds only one step: log₂ 16 = 4.",
            ]),
          ] },
          { kind: "code", part: "Halving and log n", title: "First example: execution step by step", blocks: [W("codeTrace", T_halve)] },
          { kind: "concept", part: "Halving and log n", title: "log₂ n grows slowly", blocks: [
            TB(["n", "Halvings to reach 1"], [["8", "3"], ["1024", "10"], ["1 000 000", "19"], ["1 000 000 000", "29"]], null, "center"),
            T("A thousand times more data needs only about 10 more halvings."),
          ] },
          { kind: "concept", part: "Big-O notation", title: "Big-O notation", blocks: [
            L([
              "<b>Big-O</b> describes how the number of steps grows as n grows.",
              "It keeps only the fastest-growing term and drops constant factors.",
              "O(n) is read \"order n\". It means that the steps grow in proportion to n.",
            ]),
          ] },
          { kind: "concept", part: "Big-O notation", title: "Simplifying to Big-O", blocks: [
            TB(["Steps", "Fastest-growing term", "Big-O"], [
              ["n − 1", "n", "O(n)"],
              ["3n + 5", "3n", "O(n)"],
              ["n² + n", "n²", "O(n²)"],
              ["20", "a constant", "O(1)"],
            ], null, "center"),
          ] },
          { kind: "concept", part: "Big-O notation", title: "Big-O from code", blocks: [
            TB(["Structure", "Code", "Big-O"], [
              ["one loop over n items", "<code>for x in a:</code>", "O(n)"],
              ["two loops, one after the other", "<code>for x in a:</code> … <code>for y in a:</code>", "O(n)"],
              ["a loop with a fixed count", "<code>for i in range(10):</code>", "O(1)"],
              ["a loop inside a loop", "<code>for i in range(n):</code> <code>for j in range(n):</code>", "O(n²)"],
              ["an inner loop up to i", "<code>for i in range(n):</code> <code>for j in range(i):</code>", "O(n²)"],
              ["halving", "<code>while n &gt; 1:</code> <code>n = n // 2</code>", "O(log n)"],
              ["a hidden loop over a list", "<code>x in a</code>, <code>sum(a)</code>", "O(n)"],
            ]),
          ] },
          { kind: "concept", part: "Big-O notation", title: "Why constant factors are dropped", blocks: [
            TB(["n", "3n + 5", "n²"], [["10", "35", "100"], ["100", "305", "10 000"], ["1000", "3005", "1 000 000"]], null, "center"),
            L([
              "For small n, the two are close. For large n, n² is far larger than 3n + 5.",
              "A faster computer divides every count by a constant. A better Big-O changes how the count grows.",
            ]),
          ] },
          { kind: "concept", part: "Common growth rates", title: "Common growth rates", blocks: [
            TB(["Big-O", "Name", "Example", "Steps for n = 1000"], [
              ["O(1)", "constant", "<code>data[i]</code>", "1"],
              ["O(log n)", "logarithmic", "halving", "about 10"],
              ["O(n)", "linear", "one loop", "1000"],
              ["O(n log n)", "n log n", "<code>sort()</code> (Lesson 4)", "about 10 000"],
              ["O(n²)", "quadratic", "nested loops", "1 000 000"],
              ["O(2ⁿ)", "exponential", "all on/off settings of n switches", "a 302-digit number"],
            ]),
            T("O(n log n): n elements, and each one is handled about log₂ n times."),
          ] },
          { kind: "concept", part: "Common growth rates", title: "Doubling the input", blocks: [
            TB(["Big-O", "When n doubles, the steps…"], [
              ["O(1)", "stay the same"],
              ["O(log n)", "increase by 1"],
              ["O(n)", "double"],
              ["O(n log n)", "grow a little more than 2 times: about 2.2 times from n = 1000 to 2000"],
              ["O(n²)", "become 4 times larger"],
              ["O(2ⁿ)", "are squared"],
            ]),
            T("This rule estimates the effect of more data without running the program."),
          ] },
          { kind: "code", part: "Common growth rates", title: "Example: plotting O(n) and O(n²) for n = 1 to 32", blocks: [
            RUN('import matplotlib.pyplot as plt\nimport numpy as np\nns = np.array([1, 2, 4, 8, 16, 32])\nplt.plot(ns, ns, label="O(n)")\nplt.plot(ns, ns * ns, label="O(n²)")\nplt.xlabel("n")\nplt.ylabel("steps")\nplt.legend()\nplt.show()'),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "One loop over n items: O(n). A loop inside a loop: O(n²).",
              "Halving until 1 takes log₂ n steps: O(log n).",
              "Big-O keeps the fastest-growing term and drops constant factors.",
              "From best to worst: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ).",
            ]),
            NEXT("<b>Searching</b>. Linear search, O(n), and binary search, O(log n)."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Write the output on paper.<br>Then run the program and compare.")],
            [RUN("count = 0\nfor i in range(4):\n    for j in range(3):\n        count = count + 1\nprint(count)")],
          ] },
          { kind: "exercise", title: "Complete missing code", blocks: [
            PQ("Replace line 4 with the statement that halves n, so that the program counts how many times 64 can be halved before it reaches 1.",
              "Halvings: 6", 'n = 64\nhalvings = 0\nwhile n > 1:\n    n = 1  # replace this line\n    halvings = halvings + 1\nprint("Halvings:", halvings)', null, "n = n // 2"),
          ] },
          { kind: "exercise", title: "Modify a program", blocks: [
            PQ("Change the inner loop to <code>range(i)</code>, so that it counts only the pairs with j &lt; i.",
              "Steps: 10", 'n = 5\ncount = 0\nfor i in range(n):\n    for j in range(n):\n        count = count + 1\nprint("Steps:", count)', null, "The count is 0 + 1 + 2 + 3 + 4. This is n(n − 1) / 2, still O(n²)."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Write the function <code>count_halvings(n)</code>, which returns the number of halvings from n down to 1. Display it for 16, 1024, and 1000000 in one print.",
              "4 10 19", "# Write your program here\n", null, "Use the while loop from this lesson inside the function, and return the counter."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`O(4n + 7)` simplifies to…", choices: ["O(4n)", "O(n)", "O(7)", "O(n²)"], answer: 1, explain: "The constant factor 4 and the term 7 are dropped." },
            { q: "An O(n²) program takes 1 second for n = 1000. About how long does it take for n = 2000?", choices: ["1 second", "2 seconds", "4 seconds", "1000 seconds"], answer: 2, explain: "Doubling n makes n² four times larger." },
          ])] },
        ],
      },

      /* =============================== 3. SEARCHING =============================== */
      {
        id: "searching",
        title: "Searching",
        sub: "Linear search, best and worst case, and binary search on sorted data.",
        keywords: "linear search binary search sorted halving low high mid best case worst case average",
        deck: [
          { kind: "overview", title: "Searching", blocks: [
            T("<b>Searching</b> finds the position of a value in a list. The two search algorithms in this lesson do very different amounts of work."),
            L(["Linear search", "Stopping at the first match", "Best, average, and worst case", "Binary search", "Linear and binary search compared"], "Subtopics in this lesson", true),
          ] },
          { kind: "problem", part: "Linear search", title: "Problem: find a sensor ID", blocks: [
            T("A list holds the IDs of the installed sensors. Find the position of the ID 30."),
            IPO([
              ["Input", "the list [12, 30, 18] and the target 30"],
              ["Output", "the position (index) of the target: 1, or -1 if it is absent"],
              ["Processing", "compare the target with each element in turn"],
            ]),
          ] },
          { kind: "concept", part: "Linear search", title: "The linear search algorithm", blocks: [
            T("<b>Linear search</b> compares the elements one after another, from the start."),
            L([
              "Set the position to -1, which means \"not found\".",
              "For each index i from 0 to the last index: if the element at i equals the target, store i as the position.",
              "Display the position.",
            ], null, true),
          ] },
          { kind: "code", part: "Linear search", title: "First example: execution step by step", blocks: [W("codeTrace", T_lin)] },
          { kind: "concept", part: "Stopping at the first match", title: "Stopping at the first match", blocks: [
            L([
              "The first program continues after the target is found. The remaining comparisons are unnecessary.",
              "<code>break</code> (Topic 03) ends a loop at once.",
              "Inside a function, <code>return</code> (Topic 05) ends the loop and the function at once.",
              "With repeated values, the results differ. For 30 in [12, 30, 18, 30], the first program gives the last position, 3. A search that stops gives the first position, 1.",
            ]),
            CODE("for i in range(len(data)):\n    if data[i] == target:\n        return i\nreturn -1", null, "inside a function"),
          ] },
          { kind: "code", part: "Stopping at the first match", title: "Example: linear search as a function", blocks: [
            EX("def linear_search(data, target):\n    for i in range(len(data)):\n        if data[i] == target:\n            return i\n    return -1\nprint(linear_search([12, 30, 18], 30))\nprint(linear_search([12, 30, 18], 99))", "return ends the search", [
              { c: "return i", e: "Found: the loop stops. Finding 30 takes 2 comparisons: <code>1</code>" },
              { c: "return -1", e: "Runs only after every element was compared: <code>-1</code>" },
            ]),
          ] },
          { kind: "concept", part: "Best, average, and worst case", title: "Best, average, and worst case", blocks: [
            TB(["Case", "When", "Comparisons"], [
              ["Best", "the target is the first element", "1"],
              ["Worst", "the target is the last element, or absent", "n"],
              ["Average", "the target is at a random position", "about n / 2"],
            ]),
            L([
              "Big-O normally describes the worst case: linear search is <b>O(n)</b>.",
              "The worst case is a guarantee: the algorithm never needs more steps.",
            ]),
          ] },
          { kind: "code", part: "Best, average, and worst case", title: "Example: a function that counts the comparisons", blocks: [
            T("12 is the first element: best case. 7 is the last element and 99 is absent: worst case."),
            RUN("def comparisons(data, target):\n    count = 0\n    for value in data:\n        count = count + 1\n        if value == target:\n            return count\n    return count\nids = [12, 30, 18, 7]\nprint(comparisons(ids, 12), comparisons(ids, 7), comparisons(ids, 99))"),
          ] },
          { kind: "concept", part: "Binary search", title: "The idea of binary search", blocks: [
            L([
              "<b>Binary search</b> works only on a <b>sorted</b> list.",
              "It compares the target with the middle element.",
              "If the target is larger, it can only be in the right half. If it is smaller, it can only be in the left half.",
              "Each comparison discards half of the remaining elements.",
            ]),
          ] },
          { kind: "concept", part: "Binary search", title: "The binary search algorithm", blocks: [
            L([
              "low = 0 and high = the last index. The target can only be between low and high.",
              "While low &lt;= high: mid = (low + high) // 2.",
              "If data[mid] equals the target, the result is mid.",
              "If data[mid] &lt; target, the target is on the right: low = mid + 1. Otherwise, it is on the left: high = mid - 1.",
              "When low &gt; high, no element is left: the result is -1.",
            ], null, true),
            T("<code>//</code> rounds down, so mid is an int: <code>(0 + 9) // 2</code> is 4. With <code>/</code>, mid is 4.5: <code>TypeError: list indices must be integers or slices, not float</code>.<br>The condition is <code>low &lt;= high</code>, not <code>low &lt; high</code>: when low equals high, one element is left to compare. With <code>&lt;</code>, the search misses 2, 12, 38, and 91 in the list of the next slide."),
          ] },
          { kind: "visual", part: "Binary search", title: "Binary search and linear search, step by step", blocks: [
            W("searchViz", { title: "Searching for 23 in a sorted list", data: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 23 }),
          ] },
          { kind: "code", part: "Binary search", title: "The function (part 1 of 2): the range and the loop", cols: [
            [CODE("def binary_search(data, target):\n    low = 0\n    high = len(data) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        # part 2: the comparison\n    return -1")],
            [L([
              "Lines 2–3: the target can only be between low and high.",
              "Line 4: repeat while at least one element is left.",
              "Line 5: the middle index.",
              "Line 7: no element is left: -1.",
            ])],
          ] },
          { kind: "code", part: "Binary search", title: "The function (part 2 of 2): the comparison", cols: [
            [CODE("        if data[mid] == target:\n            return mid\n        elif data[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1", null, "inside the while loop")],
            [L([
              "Found: return mid ends the function.",
              "data[mid] &lt; target: mid and the left half are discarded.",
              "Otherwise: mid and the right half are discarded.",
            ])],
          ] },
          { kind: "visual", part: "Binary search", title: "When the target is absent", blocks: [
            W("searchViz", { title: "Searching for 20, which is not in the list", data: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 20 }),
          ] },
          { kind: "code", part: "Binary search", title: "Example: an unsorted list gives a wrong result", cols: [
            [CODE("ids = [30, 12, 18, 7]\nprint(binary_search(ids, 7))", "-1", "binary_search from the previous slides")],
            [L([
              "7 is at index 3, but the result is -1. No error message appears.",
              "mid is 1, and data[1] is 12. Since 12 &gt; 7, the right half is discarded: 7 is in that half.",
              "Binary search does not check the order. Sort the list first (Lesson 4), or use linear search.",
            ])],
          ] },
          { kind: "concept", part: "Linear and binary search compared", title: "Comparisons in the worst case", blocks: [
            TB(["n", "Linear search, O(n)", "Binary search, O(log n)"], [["10", "10", "4"], ["1000", "1000", "10"], ["1 000 000", "1 000 000", "20"]], null, "center"),
            T("On large lists, binary search is much faster.<br>After the last halving, one element is left, and it is also compared. So the worst case is the number of halvings + 1: for 1 000 000, 19 halvings (Lesson 2) and 20 comparisons."),
          ] },
          { kind: "concept", part: "Linear and binary search compared", title: "Which search to use", blocks: [
            TB(["Situation", "Search"], [
              ["unsorted data", "linear search"],
              ["sorted data", "binary search"],
              ["a small list", "either: the difference is small"],
            ]),
            T("Sorting costs more than one linear search (Lesson 4). Sorting first is worthwhile only when the same data are searched many times."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Linear search compares each element in turn: O(n). It works on any list.",
              "<code>return</code> or <code>break</code> stops the search at the first match: best case 1, worst case n comparisons.",
              "Binary search halves the range from low to high at each step: O(log n). The list must be sorted.",
              "When low &gt; high, the target is absent: the result is -1.",
            ]),
            NEXT("<b>Sorting</b>. Bubble sort, O(n²), and Python's built-in sort, O(n log n)."),
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            T("Write the output on paper. Then run the program and compare."),
            RUN("def linear_search(data, target):\n    for i in range(len(data)):\n        if data[i] == target:\n            return i\n    return -1\ncodes = [4, 9, 4, 7]\nprint(linear_search(codes, 4))\nprint(linear_search(codes, 7))"),
          ] },
          { kind: "exercise", title: "Complete the iteration table", blocks: [
            T("Binary search for 72 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]. Complete the table on paper. The next exercise checks it."),
            TB(["Iteration", "low", "high", "mid", "data[mid]", "Decision"], [
              ["1", "0", "9", "4", "16", "16 &lt; 72: low = 5"],
              ["2", "", "", "", "", ""],
              ["3", "", "", "", "", ""],
            ], null, "center"),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            T("Compare your table with the correct one."),
            TB(["Iteration", "low", "high", "mid", "data[mid]", "Decision"], [
              ["1", "0", "9", "4", "16", "16 &lt; 72: low = 5"],
              ["2", "5", "9", "7", "56", "56 &lt; 72: low = 8"],
              ["3", "8", "9", "8", "72", "72 == 72: the result is 8"],
            ], null, "center"),
            T("Binary search needs 3 comparisons; linear search needs 9."),
          ] },
          { kind: "exercise", title: "Complete missing code", blocks: [
            PQ("Replace line 6 with the six lines of the comparison from part 2, so that the function finds 72.",
              "8", BINARY, null, "if data[mid] == target: return mid. elif data[mid] < target: low = mid + 1. else: high = mid - 1."),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The function has two errors. The first stops the program with a TypeError. After it is corrected, the search for 91 still gives -1. Correct both errors.",
              "5\n9", BINARY_ERR, null, "Line 5: an index must be an int, so use //. Line 4: when low equals high, one element is left to compare."),
          ] },
          { kind: "exercise", title: "Modify a program", blocks: [
            PQ("Modify linear_search so that it returns a list of all the positions of the target.",
              "[0, 2]", "def linear_search(data, target):\n    for i in range(len(data)):\n        if data[i] == target:\n            return i\n    return -1\nprint(linear_search([4, 9, 4, 7], 4))", null, "Start with positions = []. Append i for each match, and return positions after the loop."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Search the list names for \"fan\" with linear search. Display its position, or \"not found\".",
              "Position: 1", 'names = ["pump", "fan", "valve"]\n# Write your program here\n', null, "for i in range(len(names)): compare names[i] with \"fan\", then break."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Binary search requires the list to be…", choices: ["short", "sorted", "free of duplicates", "made of integers"], answer: 1, explain: "Discarding half of the list is correct only when the elements are in order." },
            { q: "Binary search on 1000 sorted elements needs at most about…", choices: ["1000 comparisons", "500 comparisons", "10 comparisons", "1 comparison"], answer: 2, explain: "Each comparison halves the range: log₂ 1000 is about 10." },
          ])] },
        ],
      },

      /* =============================== 4. SORTING =============================== */
      {
        id: "sorting",
        title: "Sorting",
        sub: "Swapping, bubble sort, its cost, and the built-in sort.",
        keywords: "sorting bubble sort swap pass comparison sort sorted reverse tuple temporary variable n log n",
        deck: [
          { kind: "overview", title: "Sorting", blocks: [
            T("<b>Sorting</b> arranges the elements of a list in order, for example from the lowest to the highest value. Sorted data can be searched with binary search."),
            L(["Swapping two elements", "One pass", "Bubble sort", "The cost of bubble sort", "Built-in sorting"], "Subtopics in this lesson", true),
          ] },
          { kind: "problem", part: "Swapping two elements", title: "Problem: sort the readings", blocks: [
            T("Arrange the readings 4, 1, 5, 2 in ascending order."),
            IPO([
              ["Input", "the list [4, 1, 5, 2]"],
              ["Output", "[1, 2, 4, 5]"],
              ["Processing", "compare neighbouring elements, and swap them when they are in the wrong order"],
            ]),
          ] },
          { kind: "concept", part: "Swapping two elements", title: "Swapping two elements", blocks: [
            CODE("a[0], a[1] = a[1], a[0]", null, "syntax"),
            L([
              "Multiple assignment (Topic 02) evaluates the whole right side first: the pair a[1], a[0]. Then it stores the two values, so the elements change places.",
              "Two separate statements do not swap. For [5, 1], <code>a[0] = a[1]</code> gives [1, 1]: the 5 is lost. <code>a[1] = a[0]</code> then stores 1 again.",
              "A temporary variable also swaps: <code>temp = a[0]</code>, <code>a[0] = a[1]</code>, <code>a[1] = temp</code>.",
              "In the sorting programs, <code>a</code> is the list to be sorted.",
            ]),
          ] },
          { kind: "code", part: "Swapping two elements", title: "Example: compare and swap", blocks: [
            EX("a = [5, 1]\nif a[0] > a[1]:\n    a[0], a[1] = a[1], a[0]\nprint(a)", "one comparison, one swap", [
              { c: "a[0] > a[1]", e: "5 > 1 is True: the pair is in the wrong order." },
              { c: "a[0], a[1] = a[1], a[0]", e: "The right side is evaluated first: (1, 5). Then a[0] = 1 and a[1] = 5." },
              { c: "print(a)", e: "<code>[1, 5]</code>" },
            ]),
          ] },
          { kind: "concept", part: "One pass", title: "One pass through the list", blocks: [
            L([
              "A <b>pass</b> compares each neighbouring pair from left to right: a[0] and a[1], then a[1] and a[2], and so on.",
              "A pair in the wrong order is swapped.",
              "A list of n elements has n − 1 neighbouring pairs.",
              "After one pass, the largest value is at the end.",
            ]),
          ] },
          { kind: "code", part: "One pass", title: "First example: one pass, step by step", blocks: [W("codeTrace", T_pass)] },
          { kind: "concept", part: "Bubble sort", title: "Bubble sort", blocks: [
            L([
              "<b>Bubble sort</b> repeats the pass. Each pass moves the next largest value to its final place.",
              "n − 1 passes sort a list of n elements.",
              "In the code, i counts the passes from 0. When pass i starts, the last i elements are already in place, so it compares only n − 1 − i pairs.",
            ]),
            CODE("for i in range(n - 1):            # the passes\n    for j in range(n - 1 - i):    # one pass\n        compare a[j] and a[j + 1]; swap if needed", null, "structure", "text"),
          ] },
          { kind: "visual", part: "Bubble sort", title: "Bubble sort, comparison by comparison", blocks: [
            W("bubbleViz", { title: "Sorting [4, 1, 5, 2]", data: [4, 1, 5, 2] }),
          ] },
          { kind: "code", part: "Bubble sort", title: "The bubble sort program", blocks: [
            T("The outer loop counts the passes. The inner loop is one pass. For [4, 1, 5, 2], the passes make 3 + 2 + 1 = 6 comparisons, and the result is [1, 2, 4, 5]."),
            RUN(BUBBLE),
          ] },
          { kind: "concept", part: "The cost of bubble sort", title: "Counting the comparisons", blocks: [
            L([
              "Pass 1 makes n − 1 comparisons, pass 2 makes n − 2, and the last pass makes 1.",
              "Total: (n − 1) + (n − 2) + … + 1 = n(n − 1) / 2.",
              "n(n − 1) / 2 = n²/2 − n/2. The fastest-growing term is n²: bubble sort is <b>O(n²)</b>.",
            ]),
            TB(["n", "Comparisons"], [["4", "6"], ["10", "45"], ["1000", "499 500"]], null, "center"),
          ] },
          { kind: "code", part: "The cost of bubble sort", title: "Example: counting the comparisons", blocks: [
            EX("def bubble_comparisons(n):\n    count = 0\n    for i in range(n - 1):\n        for j in range(n - 1 - i):\n            count = count + 1\n    return count\nprint(bubble_comparisons(100))\nprint(bubble_comparisons(200))", "one step for each comparison", [
              { c: "count = count + 1", e: "runs once for each comparison" },
              { c: "bubble_comparisons(100)", e: "<code>4950</code> = 100 × 99 / 2" },
              { c: "bubble_comparisons(200)", e: "<code>19900</code>: twice the elements, about 4 times the comparisons, as for O(n²)" },
            ]),
          ] },
          { kind: "concept", part: "Built-in sorting", title: "sort() and sorted()", blocks: [
            TB(["Code", "Result"], [
              ["<code>a.sort()</code>", "sorts the list a itself (Topic 06)"],
              ["<code>a.sort(reverse=True)</code>", "sorts a in descending order"],
              ["<code>sorted(a)</code>", "returns a new sorted list; a is unchanged"],
            ]),
            L([
              "Both use an O(n log n) algorithm, in compiled code.",
              "In practice, use sort() or sorted(). Bubble sort shows how sorting works.",
            ]),
          ] },
          { kind: "code", part: "Built-in sorting", title: "Example: sort() and sorted()", blocks: [
            EX("readings = [25, 19, 31, 22]\nordered = sorted(readings)\nprint(ordered)\nprint(readings)\nreadings.sort(reverse=True)\nprint(readings)", "sorted() makes a new list; sort() changes the list", [
              { c: "sorted(readings)", e: "<code>[19, 22, 25, 31]</code>" },
              { c: "print(readings)", e: "<code>[25, 19, 31, 22]</code>: unchanged" },
              { c: "sort(reverse=True)", e: "<code>[31, 25, 22, 19]</code>" },
            ]),
          ] },
          { kind: "code", part: "Built-in sorting", title: "Example: sorting readings with their sensor names", blocks: [
            EX('pairs = [(80.0, "A"), (65.0, "B"),\n         (93.3, "C")]\npairs.sort(reverse=True)\nprint(pairs)\nprint(pairs[0][1])', "tuples (Topic 06): reading, sensor", [
              { c: "pairs.sort(reverse=True)", e: "Tuples are compared by the first element (the reading), then by the second." },
              { c: "print(pairs)", e: "<code>[(93.3, 'C'), (80.0, 'A'), (65.0, 'B')]</code>: each name stays with its reading." },
              { c: "pairs[0][1]", e: "<code>C</code>: the sensor with the highest reading." },
            ]),
          ] },
          { kind: "concept", part: "Built-in sorting", title: "O(n²) and O(n log n) compared", blocks: [
            TB(["n", "Bubble sort: n(n − 1) / 2", "n log₂ n"], [
              ["10", "45", "about 33"],
              ["1000", "499 500", "about 10 000"],
              ["1 000 000", "about 500 000 000 000", "about 20 000 000"],
            ], null, "center"),
            T("For a million elements, bubble sort needs about 25 000 times more comparisons."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>a[j], a[j + 1] = a[j + 1], a[j]</code> swaps two elements.",
              "One pass compares neighbours and swaps them; the largest value moves to the end.",
              "Bubble sort repeats the pass n − 1 times: n(n − 1) / 2 comparisons, O(n²).",
              "<code>sort()</code> and <code>sorted()</code> are O(n log n). Use them in practice.",
            ]),
            NEXT("<b>Choosing a data structure</b>. Lists and dictionaries, and the cost of their operations."),
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("Complete the trace table on paper. The first row is done. The next exercise checks it."),
            W("traceTable", { trace: T_exPass, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Check your trace", cols: [
            [T("Run the program with <b>Step Run</b>. Compare the variables after each line with your table.")],
            [RUN(T_exPass.code.join("\n"))],
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            T("The program displays the list after each pass. Write the three lines on paper. Then run the program and compare."),
            RUN("a = [4, 3, 2, 1]\nn = len(a)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if a[j] > a[j + 1]:\n            a[j], a[j + 1] = a[j + 1], a[j]\n    print(a)"),
          ] },
          { kind: "exercise", title: "Modify a program", blocks: [
            PQ("Modify the program so that it sorts the list in descending order.",
              "[5, 4, 2, 1]", BUBBLE, null, "Swap when a[j] < a[j + 1]."),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The program stops with an IndexError. Correct the error.",
              "[1, 2, 4, 5]", BUBBLE.replace("range(n - 1 - i)", "range(n - i)"), null, "The last pair is a[n - 2] and a[n - 1], so j must stop at n - 2."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Display the three highest readings, from the highest down. Use sorted() and a slice.",
              "[31, 28, 25]", "readings = [25, 19, 31, 22, 28]\n# Write your program here\n", null, "sorted(readings, reverse=True) sorts in descending order. Then take [:3]."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "How many comparisons does bubble sort make for 5 elements?", choices: ["5", "10", "20", "25"], answer: 1, explain: "4 + 3 + 2 + 1 = 10 = 5 × 4 / 2." },
            { q: "After `b = sorted(a)`, the list a is…", choices: ["sorted", "unchanged", "empty", "reversed"], answer: 1, explain: "sorted() returns a new list; a.sort() would change a." },
          ])] },
        ],
      },

      /* =============================== 5. DATA STRUCTURES =============================== */
      {
        id: "data-structures",
        title: "Choosing a data structure",
        sub: "The cost of list, dictionary, and set operations, and how to choose between them.",
        keywords: "list dictionary dict set lookup membership in hash reference o(1) o(n) duplicates repeated choose data structure",
        deck: [
          { kind: "overview", title: "Choosing a data structure", blocks: [
            T("A <b>data structure</b> is a way of storing data, such as a list, a dictionary, or a set (Topic 06). The same task can take O(n) steps with one structure and O(1) with another."),
            L(["The cost of list operations", "The cost of dictionary operations", "Checking for repeated values", "Choosing a structure"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The cost of list operations", title: "The cost of list operations", blocks: [
            TB(["Operation", "Big-O", "Reason"], [
              ["<code>a[i]</code>", "O(1)", "the index gives the position directly"],
              ["<code>len(a)</code>", "O(1)", "the list stores its length"],
              ["<code>a.append(x)</code>", "O(1)", "adds at the end"],
              ["<code>x in a</code>", "O(n)", "a linear search"],
              ["<code>a.insert(0, x)</code>", "O(n)", "every element moves one place to the right"],
              ["<code>a.remove(x)</code>", "O(n)", "a search, then the later elements move left"],
            ]),
          ] },
          { kind: "concept", part: "The cost of list operations", title: "Why indexing takes one step", blocks: [
            L([
              "A list does not store the values themselves. Each entry is a <b>reference</b>: the address of a value in memory (Topic 02: addresses).",
              "A Python int has no fixed size (Topic 02), but every reference has the same size, 8 bytes.",
              "The entries are stored one after another. The address of entry i is start + i × 8. One calculation finds it, for any i.",
            ]),
            TB(["Entry", "a[0]", "a[1]", "a[2]", "a[3]"], [["Address of the entry", "1000", "1008", "1016", "1024"]], null, "center"),
          ] },
          { kind: "concept", part: "The cost of dictionary operations", title: "The cost of dictionary operations", blocks: [
            TB(["Operation", "Big-O (average)"], [
              ["<code>d[key]</code>", "O(1)"],
              ["<code>key in d</code>", "O(1)"],
              ["<code>d[key] = value</code>", "O(1)"],
            ]),
            L([
              "Python computes a number from the key, called its <b>hash</b>. The hash gives the storage position directly, so no other key is compared.",
              "The cost: a dictionary uses more memory than a list with the same values.",
            ]),
          ] },
          { kind: "code", part: "The cost of dictionary operations", title: "Example: a list search and a dictionary lookup", cols: [
            [EX('names = ["pump", "fan", "heater"]\nvolts = [220, 110, 230]\nfor i in range(len(names)):\n    if names[i] == "heater":\n        print(volts[i])', "list: 3 comparisons, O(n)")],
            [EX('volts = {"pump": 220, "fan": 110,\n         "heater": 230}\nprint(volts["heater"])', "dictionary: 1 lookup, O(1); the same output")],
          ] },
          { kind: "concept", part: "The cost of dictionary operations", title: "Lookups for n devices", blocks: [
            TB(["n (devices)", "List search, O(n)", "Dictionary lookup, O(1)"], [["3", "up to 3", "1"], ["1000", "up to 1000", "1"], ["1 000 000", "up to 1 000 000", "1"]], null, "center"),
            T("A dictionary trades memory for time."),
          ] },
          { kind: "concept", part: "Checking for repeated values", title: "A list or a set for seen", blocks: [
            T("Topic 06 finds repeated values with a set <code>seen</code>: for each reading r, it checks <code>r in seen</code>, and then adds r with <code>seen.add(r)</code>."),
            TB(["seen is a…", "Cost of <code>r in seen</code>", "Total for n readings"], [
              ["list", "O(n)", "O(n²)"],
              ["set", "O(1) on average", "O(n)"],
            ]),
            L([
              "With a list, every check searches the earlier readings.",
              "A set finds an element by its hash, as a dictionary finds a key: every check takes one step.",
            ]),
          ] },
          { kind: "code", part: "Checking for repeated values", title: "Example: removing repeated readings", blocks: [
            EX("readings = [21, 25, 21, 30, 25]\nkept = {}\nfor r in readings:\n    kept[r] = True\nprint(list(kept))", "the keys of a dictionary keep the order in which they were added", [
              { c: "kept[r] = True", e: "a repeated key is stored only once; only the keys are used" },
              { c: "list(kept)", e: "<code>[21, 25, 30]</code>, in the first-seen order; <code>list(set(readings))</code> (Topic 06) loses the order" },
            ]),
          ] },
          { kind: "concept", part: "Choosing a structure", title: "Choosing a structure", blocks: [
            TB(["Task", "Structure"], [
              ["keep values in order; access them by position", "list"],
              ["find a value by a name or an ID", "dictionary"],
              ["check many times whether a value is present", "set (Topic 06)"],
              ["count how often each value occurs", "dictionary (Topic 06)"],
              ["search sorted data by value", "sorted list and binary search"],
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "List: <code>a[i]</code>, <code>len(a)</code>, and append are O(1); <code>in</code>, insert, and remove are O(n).",
              "Dictionary and set: lookup, <code>in</code>, and adding are O(1) on average, because of hashing.",
              "A dictionary or a set uses more memory than a list: it trades space for time.",
              "Use a dictionary for lookups by key, and a set for repeated membership checks.",
            ]),
            NEXT("<b>Writing efficient Python</b>. Measuring time, avoiding repeated work, and lookup tables."),
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            T("Write the output on paper. Then run the program and compare."),
            RUN('codes = {"E1": "overheat", "E2": "low battery"}\nprint("E2" in codes)\nprint("E3" in codes)\nprint("overheat" in codes)\nprint(codes["E1"])'),
          ] },
          { kind: "exercise", title: "Complete missing code", blocks: [
            PQ("Complete line 5, so that the loop builds the dictionary volts from the two lists.",
              "110", 'names = ["pump", "fan", "heater"]\nvalues = [220, 110, 230]\nvolts = {}\nfor i in range(len(names)):\n    \nprint(volts["fan"])', null, "volts[names[i]] = values[i]"),
          ] },
          { kind: "exercise", title: "Modify a program", blocks: [
            PQ("seen is a list, so each check is O(n). Change it to a set. The output stays the same.",
              "Repeated: 21\nRepeated: 25", 'readings = [21, 25, 21, 30, 25]\nseen = []\nfor r in readings:\n    if r in seen:\n        print("Repeated:", r)\n    seen.append(r)', null, "seen = set() and seen.add(r)"),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Count how often each error code occurs. Display each code and its count.",
              "E1 2\nE2 1\nE3 1", 'codes = ["E1", "E2", "E1", "E3"]\n# Write your program here\n', null, "counts[c] = counts.get(c, 0) + 1"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which operation is O(n) for a list a?", choices: ["`a[5]`", "`a.append(x)`", "`x in a`", "`len(a)`"], answer: 2, explain: "`x in a` is a linear search through the list." },
            { q: "`key in d` for a dictionary d takes…", choices: ["O(1) on average", "O(log n)", "O(n)", "O(n²)"], answer: 0, explain: "The hash of the key gives its position directly." },
          ])] },
        ],
      },

      /* =============================== 6. EFFICIENT PYTHON =============================== */
      {
        id: "efficient-python",
        title: "Writing efficient Python",
        sub: "Measuring time, avoiding repeated work, built-in functions, building strings, and lookup tables.",
        keywords: "efficient time perf_counter repeated work built-in sum join numpy lookup table memoization",
        deck: [
          { kind: "overview", title: "Writing efficient Python", blocks: [
            T("The algorithm decides the Big-O. The habits in this lesson then reduce the time further, and each one can be checked by measuring."),
            L(["Measuring time", "Avoiding repeated work", "Built-in functions and NumPy", "Building strings", "Lookup tables"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Measuring time", title: "Measuring time", blocks: [
            CODE("import time\nstart = time.perf_counter()\n# statements to measure\nelapsed = time.perf_counter() - start", null, "syntax"),
            L([
              "<code>time.perf_counter()</code> returns a time in seconds, as a float.",
              "The difference of two readings is the time between them.",
              "The result differs between runs and between computers. Compare times measured on the same computer.",
            ]),
          ] },
          { kind: "code", part: "Measuring time", title: "Example: timing a loop", blocks: [
            EX("import time\nstart = time.perf_counter()\ntotal = 0\nfor i in range(1000000):\n    total = total + i\nelapsed = time.perf_counter() - start\nprint(total, round(elapsed, 3))", "the time differs on each run", [
              { c: "range(1000000)", e: "one million additions" },
              { c: "print(...)", e: "<code>499999500000</code>, then the time in seconds" },
            ]),
          ] },
          { kind: "concept", part: "Avoiding repeated work", title: "Avoiding repeated work", blocks: [
            L([
              "A statement inside a loop runs once in every iteration.",
              "A value that does not change during the loop can be computed once, before the loop.",
              "A function that loops is a hidden loop: <code>sum(readings)</code> inside a loop over readings costs n × n steps.",
            ]),
          ] },
          { kind: "code", part: "Avoiding repeated work", title: "Example: percentages of the total", cols: [
            [EX("readings = [20, 30, 50]\nfor r in readings:\n    print(r * 100 // sum(readings))", "sum() in every iteration: n × n additions, O(n²)")],
            [EX("readings = [20, 30, 50]\ntotal = sum(readings)\nfor r in readings:\n    print(r * 100 // total)", "sum() once: n additions, O(n); the same output")],
          ] },
          { kind: "concept", part: "Built-in functions and NumPy", title: "Built-in functions", blocks: [
            TB(["Built-in", "Replaces a loop that…"], [
              ["<code>sum(a)</code>", "adds the elements"],
              ["<code>max(a)</code>, <code>min(a)</code>", "finds the highest or the lowest element"],
              ["<code>a.sort()</code>, <code>sorted(a)</code>", "sorts the list"],
              ["<code>\"\".join(parts)</code>", "joins strings"],
            ]),
            T("A built-in function has the same Big-O as the loop, but it runs as compiled machine code, so it takes less time."),
          ] },
          { kind: "code", part: "Built-in functions and NumPy", title: "Example: timing sum()", blocks: [
            EX("import time\ndata = list(range(1000000))\nstart = time.perf_counter()\ntotal = sum(data)\nelapsed = time.perf_counter() - start\nprint(total, round(elapsed, 3))", "the same total as the loop in the first example", [
              { c: "sum(data)", e: "one million additions, in compiled code" },
              { c: "print(...)", e: "<code>499999500000</code>, in a fraction of the loop's time" },
            ]),
          ] },
          { kind: "concept", part: "Built-in functions and NumPy", title: "Why NumPy is faster", blocks: [
            L([
              "A NumPy array (Topic 08) stores numbers of one type, one after another in memory. A Python list holds references (Lesson 5) to values in separate places.",
              "An operation such as <code>arr * 2</code> or <code>arr.mean()</code> runs as one compiled loop over that memory. For large arrays, it is many times faster than a Python loop.",
              "NumPy integers have a fixed size, like C integers (Topic 02). A very large integer sum can overflow and give a wrong result.",
            ]),
          ] },
          { kind: "concept", part: "Building strings", title: "Building strings", blocks: [
            L([
              "A string cannot be changed (Topic 02). <code>text = text + part</code> creates a new string.",
              "The new string can require copying all the characters so far, in every iteration.",
              "<code>\";\".join(parts)</code> (Topic 06) builds the result once.",
            ]),
          ] },
          { kind: "code", part: "Building strings", title: "Example: + and join()", blocks: [
            EX('parts = ["T=21", "T=22", "T=24"]\ntext = ""\nfor p in parts:\n    text = text + p + ";"\nprint(text)\nprint(";".join(parts))', "the same parts, joined in two ways", [
              { c: 'text + p + ";"', e: "<code>T=21;T=22;T=24;</code>: a new string in each iteration" },
              { c: '";".join(parts)', e: "<code>T=21;T=22;T=24</code>: one new string; no ; at the end" },
            ]),
          ] },
          { kind: "concept", part: "Lookup tables", title: "A lookup table", blocks: [
            L([
              "A <b>lookup table</b> holds values that are computed once, before they are needed. The program then reads a value from the table instead of computing it again.",
              "A list is the table when the input is a small integer: the input is the index. A dictionary is the table for other inputs: the input is the key.",
              "Reading from the table is O(1) (Lesson 5). The table needs extra memory: it trades space for time.",
              "<b>Memoization</b> fills the table during the run: a function stores each result the first time that it computes it.",
            ]),
          ] },
          { kind: "code", part: "Lookup tables", title: "Example: a table of voltages", blocks: [
            EX("volts = []\nfor code in range(8):\n    v = code * 5 / 7\n    volts.append(round(v, 2))\nreadings = [7, 3, 7, 0, 3]\nfor code in readings:\n    print(volts[code])", "a converter gives the codes 0 to 7 for 0 V to 5 V", [
              { c: "the first loop", e: "Computes the voltage of every code once. The code is the index." },
              { c: "volts[code]", e: "One index operation for each reading: no division and no rounding." },
              { c: "print(...)", e: "<code>5.0</code>, <code>2.14</code>, <code>5.0</code>, <code>0.0</code>, <code>2.14</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>time.perf_counter()</code> measures the time between two points of a program.",
              "Compute values that do not change before the loop, not inside it.",
              "Built-in functions and NumPy run as compiled code: the same Big-O in less time.",
              "Build strings with join(). Compute values that are read many times once, and store them in a lookup table.",
            ]),
            NEXT("<b>Developing a larger program</b>. The programs so far are short. A longer program is built from functions that are written and tested one at a time."),
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            T("Write the output on paper. Then run the program and compare."),
            RUN('memo = {}\ndef square(n):\n    if n not in memo:\n        print("computing", n)\n        memo[n] = n * n\n    return memo[n]\nprint(square(4))\nprint(square(4))'),
          ] },
          { kind: "exercise", title: "Modify a program: repeated work", blocks: [
            PQ("The program computes max(readings) in every iteration. Modify it so that max() runs only once. The output stays the same.",
              "0.8\n1.0\n0.6", "readings = [4, 5, 3]\nfor r in readings:\n    print(r / max(readings))", null, "peak = max(readings), before the loop"),
          ] },
          { kind: "exercise", title: "Modify a program: NumPy", cols: [
            [T("Run the program. Then replace lines 5–8, which compute the average with a loop, with <code>average = arr.mean()</code> and run it again.<br>Compare the two times. The times differ on each run.")],
            [RUN("import time\nimport numpy as np\narr = np.array(list(range(1000000)))\nstart = time.perf_counter()\ntotal = 0\nfor i in range(1000000):\n    total = total + i\naverage = total / 1000000\nelapsed = time.perf_counter() - start\nprint(average, round(elapsed, 4))")],
          ] },
          { kind: "exercise", title: "Write a program: join()", blocks: [
            PQ("Build the text <code>21.5, 22.0, 23.1</code> from the list with join(), and display it.",
              "21.5, 22.0, 23.1", 'readings = ["21.5", "22.0", "23.1"]\n# Write your program here\n', null, 'The separator is ", ".'),
          ] },
          { kind: "exercise", title: "Write a program: a lookup table", blocks: [
            PQ("A 100 Ω resistor at v volts dissipates v × v / 100 watts. Build the list power with the values for v = 0 to 12, computed once. Then display the power for each voltage in queries.",
              "0.25\n1.44\n0.25", "queries = [5, 12, 5]\n# Write your program here\n", null, "power = []. For v in range(13): power.append(v * v / 100). Then display power[q] for each q in queries."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which line belongs before the loop?", choices: ["`print(r)`", "`limit = max(readings) * 0.9`", "`total = total + r`", "`if r > limit:`"], answer: 1, explain: "Its value does not change during the loop, so it is computed once." },
            { q: "A lookup table in a list holds 256 computed values. Reading one value from it is…", choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0, explain: "The input is the index, and indexing a list is one step. The values were computed once, before." },
          ])] },
        ],
      },

      /* =============================== 7. DEVELOPING A LARGER PROGRAM =============================== */
      {
        id: "larger-program",
        title: "Developing a larger program",
        sub: "Decomposing a task into functions, testing one function at a time, and reading a traceback with two frames.",
        keywords: "larger program decompose functions test assert traceback frame file sensor log statistics report main program",
        deck: [
          { kind: "overview", title: "Developing a larger program", blocks: [
            T("A larger program is built from functions (Topic 05). This lesson develops one program of about 40 lines. It reads temperature readings from a text file with one reading on each line, rejects the invalid lines, computes the minimum, maximum, and average, and displays a report."),
            L(["Decomposing a task into functions", "Writing and testing one function at a time", "Reading a traceback with two frames", "The complete program"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Decomposing a task into functions", title: "Decomposing a task into functions", blocks: [
            T("Each function has one task. Its parameter and its return value are decided before it is written."),
            TB(["Function", "Parameter", "Returns", "Task"], [
              ["<code>is_valid(text)</code>", "one line of the file", "True or False", "checks the text: a number from −40 to 125"],
              ["<code>read_readings(filename)</code>", "the file name", "a list of floats", "reads the file; keeps the valid readings"],
              ["<code>statistics(readings)</code>", "the valid readings", "a dictionary", "computes count, minimum, maximum, average"],
              ["<code>report(stats)</code>", "the dictionary", "nothing", "displays the results"],
            ]),
            T("The main program calls read_readings, statistics, and report, in this order."),
          ] },
          { kind: "code", part: "Writing and testing one function at a time", title: "Writing and testing one function at a time", blocks: [
            EX(P_VALID_V1, "write one function, then test it", [
              { c: "assert … == …", e: "A test (assert: Topic 07): one call with a known value and its expected result." },
              { c: "print(...)", e: "Runs only when every test has passed. The next function is written then." },
              { c: 'is_valid("error")', e: "The third test stops this first version with an error message. The next slide reads it." },
            ]),
          ] },
          { kind: "concept", part: "Reading a traceback with two frames", title: "Reading a traceback with two frames", blocks: [
            CODE('Traceback (most recent call last):\n  File "<program>", line 7, in <module>\n    assert is_valid("error") == False\n           ^^^^^^^^^^^^^^^^^\n  File "<program>", line 2, in is_valid\n    value = float(text)\n            ^^^^^^^^^^^\nValueError: could not convert string to float: \'error\'', null, "the error message of the previous slide: each File line starts a frame", "text"),
            L([
              "Read from the bottom. The last line is the error: float() cannot convert 'error'.",
              "The last <b>frame</b> is the place of the error: line 2, inside is_valid.",
              "The frame above it is the call that led there: line 7, in the main program.",
            ], null, true),
          ] },
          { kind: "code", part: "The complete program", title: "is_valid(text): the corrected function", cols: [
            [CODE(P_VALID)],
            [L([
              "Lines 2–5: when float() cannot convert the text, the ValueError is handled (Topic 07). The result is False.",
              "Line 6: True only for a value from −40 to 125, the range of the sensor.",
              "The three tests now pass.",
            ])],
          ] },
          { kind: "code", part: "The complete program", title: "read_readings(filename): the valid readings", cols: [
            [CODE(P_READ)],
            [L([
              "Lines 2–3: the file is read into a list of lines (Topic 08).",
              "Lines 5–8: strip() removes the \\n of each line. Only a line that is_valid accepts is converted and stored.",
              "Test: for a file with the lines 21.5, error, and 19.6, the result is <code>[21.5, 19.6]</code>.",
            ])],
          ] },
          { kind: "code", part: "The complete program", title: "statistics(readings): the results", cols: [
            [CODE(P_STATS)],
            [L([
              "Lines 2–4: built-in functions do the work (Lesson 6). With an empty list, line 4 divides by zero.",
              "Lines 5–9: a dictionary gives each result a name (Lesson 5).",
              "Test: for <code>[20.0, 30.0]</code>, the values are 2, 20.0, 30.0, and 25.0.",
            ])],
          ] },
          { kind: "code", part: "The complete program", title: "report(stats): the output", cols: [
            [CODE(P_REPORT)],
            [L([
              "The parameter is the dictionary that statistics returns.",
              "The loop takes the keys in the order in which they were added (Lesson 5).",
              "There is no return statement: the result of this function is its output.",
            ])],
          ] },
          { kind: "code", part: "The complete program", title: "The main program", cols: [
            [CODE(P_MAIN_1)],
            [L([
              "Lines 2–4 create the file, so that the program has data to read.",
              "Lines 6–8: read_readings can return an empty list. statistics is called only with at least one reading.",
              "Each result is passed on: file name → readings → stats → report.",
            ])],
          ] },
          { kind: "code", part: "The complete program", title: "The complete program", blocks: [
            T("The lines error and 999 are rejected. Result check: (21.5 + 22.8 + 24.1 + 19.6) / 4 = 88.0 / 4 = 22.0."),
            RUN(PROGRAM, "Sensor log program"),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Decompose the task into functions with one task each. Decide each parameter and return value first.",
              "Write one function at a time. Test it with assert and known values before the next one.",
              "A traceback has one frame for the main program and one for each call that has not ended. Read from the bottom: the error, its line, then the call that led there.",
              "The main program is short: it calls the functions and passes each result to the next one.",
            ]),
            NEXT("<b>Chapter practice</b>. Complete problems on searching, sorting, and efficiency, solved with the five steps."),
          ] },
          { kind: "exercise", title: "Complete missing code", blocks: [
            PQ("The body of statistics() is missing. Complete it. The function returns a dictionary with the keys readings, minimum, maximum, and average (rounded to 2 decimals).",
              "Sensor log report\nreadings: 3\nminimum: 18.5\nmaximum: 23.5\naverage: 20.67", PROGRAM_GAP, null, 'Use len(), min(), max(), and sum(). Store each result under its key, for example stats["minimum"] = min(readings).'),
          ] },
          { kind: "exercise", title: "Modify existing code", blocks: [
            PQ("Add the function <code>count_above(readings, limit)</code>. It returns the number of readings above limit. In the main program, display its result for 30 after the report: <code>Above 30: 3</code>.",
              "Sensor log report\nreadings: 5\nminimum: 27.4\nmaximum: 33.0\naverage: 30.2\nAbove 30: 3", PROGRAM_MODIFY, null, 'Count with a loop: if r > limit, add 1. After report(stats): print("Above 30:", count_above(readings, 30)).'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "A traceback has two frames: first `line 12, in <module>`, then `line 3, in is_valid`. The error occurred…", choices: ["at line 12, in the main program", "at line 3, inside is_valid", "at both lines", "before line 3"], answer: 1, explain: "The last frame is the place of the error. The frame above it is the call that led there." },
            { q: "Each function is tested before the next one is written, so that…", choices: ["the program runs faster", "an error is found in the few lines just written", "the function needs no parameters", "the traceback has more frames"], answer: 1, explain: "A test with known values finds an error while the new code is still small." },
          ])] },
        ],
      },

      /* =============================== 8. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete problems on searching, sorting, and efficiency.",
        keywords: "practice binary search iterations selection sort repeated median lookup dictionary big o",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Solve every problem with the five steps:"),
            L([
              "<b>Understand</b>: the input and the output.",
              "<b>Design</b>: write the algorithm as steps, and state its Big-O.",
              "<b>Code</b>: write the program.",
              "<b>Test</b>: run it, including the edge cases.",
              "<b>Correct</b>: if the output differs, find the wrong step, correct it, and test again.",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: iterations of binary search", blocks: [
            T("Write a version of binary search that returns the number of iterations instead of the position. Search the even numbers 0, 2, 4, …, 998 for 998."),
            IPO([["Input", "list(range(0, 1000, 2)) and the target 998"], ["Output", "the number of iterations"], ["Processing", "binary search with a counter"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Write the function binary_steps(data, target) above the last two lines.",
              "9", "# Write the function binary_steps here\n\nevens = list(range(0, 1000, 2))\nprint(binary_steps(evens, 998))\n", null, "Add steps = steps + 1 at the start of each iteration of the while loop. Return steps when the target is found."),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: selection sort", blocks: [
            T("<b>Selection sort</b> sorts in another way: for each position i, it finds the smallest element from i to the end, and swaps it into position i."),
            IPO([["Input", "the list [4, 1, 5, 2]"], ["Output", "[1, 2, 4, 5]"], ["Processing", "n − 1 times: find the index of the smallest remaining element, then swap"]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: design and write the program", blocks: [
            PQ("Write the algorithm as comments first, then the program. Selection sort is also O(n²).",
              "[1, 2, 4, 5]", "# Input:\n# Output:\n# Processing:\n# Algorithm:\n\na = [4, 1, 5, 2]\n", null, "for i in range(n - 1): smallest = i. Then for j in range(i + 1, n): if a[j] < a[smallest]: smallest = j. Then swap a[i] and a[smallest]."),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: the first repeated reading", blocks: [
            T("A logger records readings. Display the first reading that appears for the second time."),
            IPO([["Input", "[22, 25, 23, 25, 22]"], ["Output", "25"], ["Processing", "a set of the readings seen so far; stop at the first repeat"]]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Write the program. Use a set, so that the program is O(n).",
              "25", "readings = [22, 25, 23, 25, 22]\n# Write your program here\n", null, "seen = set(). If r in seen: display r and break. Otherwise: seen.add(r)."),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: the median", blocks: [
            T("The <b>median</b> of an odd number of readings is the middle value after sorting."),
            IPO([["Input", "[25, 19, 31, 22, 28]"], ["Output", "Median: 25"], ["Processing", "sorted(), then the element at index len // 2: O(n log n)"]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", blocks: [
            PQ("Write the program.",
              "Median: 25", "readings = [25, 19, 31, 22, 28]\n# Write your program here\n", null, "ordered = sorted(readings). The middle index is len(ordered) // 2."),
          ] },
          { kind: "problem", part: "Problem 5", title: "Problem 5: a lookup table", blocks: [
            T("Each sensor ID has a location. Display the location of each queried ID, or \"unknown\"."),
            IPO([["Input", "IDs T1, T2, P1; places hall, lab, roof; queries P1, T9, T1"], ["Output", "roof, unknown, hall (one per line)"], ["Processing", "build a dictionary once; then one O(1) lookup per query"]]),
          ] },
          { kind: "exercise", part: "Problem 5", title: "Problem 5: write the program", blocks: [
            PQ("Write the program.",
              "roof\nunknown\nhall", 'ids = ["T1", "T2", "P1"]\nplaces = ["hall", "lab", "roof"]\nqueries = ["P1", "T9", "T1"]\n# Write your program here\n', null, "where = {}. For i in range(len(ids)): where[ids[i]] = places[i]. Then check each query with in."),
          ] },
          { kind: "summary", title: "Chapter summary", blocks: [
            TB(["Lesson", "Key rule"], [
              ["1–2. Algorithms and Big-O", "Correct for every valid input. Big-O keeps the fastest-growing term."],
              ["3–4. Searching and sorting", "Linear search O(n); binary search O(log n) on sorted data. Bubble sort O(n²); sort() and sorted() O(n log n)."],
              ["5–6. Efficiency", "Dictionaries for lookups and sets for membership; compute once; built-ins and NumPy; join(); lookup tables."],
              ["7. A larger program", "One task for each function; test each function before the next; read a traceback from the bottom."],
            ]),
            N("<b>Topic 10: Programming in C</b>. A compiled language close to the hardware, used in most embedded systems.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
