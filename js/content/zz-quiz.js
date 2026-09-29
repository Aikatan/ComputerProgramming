/* ============================================================
   zz-quiz.js - tops up each sub-topic's "Check yourself" quiz to 5
   questions. Keyed by "tNN.lesson-id"; appends from the pool only
   until the lesson has 5 (naturally idempotent).
   Loaded after all topics, before app.js.
   ============================================================ */
(function () {
  const P = {
    /* ---------- Topic 00 ---------- */
    "t00.what-is-programming": [
      { q: "Source code is…", choices: ["The CPU itself", "Human-readable instructions you write", "A type of memory", "An output device"], answer: 1, explain: "Source code is the text you write; the interpreter/compiler turns it into machine instructions." },
      { q: "Which language does this course use?", choices: ["C", "Java", "Python", "Rust"], answer: 2, explain: "This course teaches Python." },
      { q: "A program is best described as…", choices: ["A single number", "An ordered list of instructions", "A picture", "A folder"], answer: 1, explain: "A program is a precise, ordered set of instructions." },
    ],
    "t00.course-tools": [
      { q: "VS Code is a…", choices: ["Web browser", "Code editor", "Spreadsheet", "Compiler only"], answer: 1, explain: "VS Code is the editor you write code in." },
      { q: "Which lets you run Python with zero install?", choices: ["Miniconda", "Google Colab", "VS Code", "Notepad"], answer: 1, explain: "Colab runs Python in the browser." },
      { q: "pip is used to…", choices: ["Edit text", "Install Python packages", "Restart the PC", "Draw charts"], answer: 1, explain: "pip installs third-party packages from PyPI." },
    ],
    "t00.first-run": [
      { q: "A .py file is…", choices: ["An image", "A Python script", "A folder", "A spreadsheet"], answer: 1, explain: "A .py file holds Python source code." },
      { q: "To see output you usually call…", choices: ["input()", "print()", "open()", "def"], answer: 1, explain: "print() displays output." },
      { q: "Before running, VS Code needs you to…", choices: ["Pick a Python interpreter", "Delete the file", "Disconnect the internet", "Rename to .txt"], answer: 0, explain: "You select which Python interpreter runs your file." },
    ],
    /* ---------- Topic 01 ---------- */
    "t01.hardware-software": [
      { q: "A keyboard is a(n)…", choices: ["Output device", "Input device", "Storage device", "CPU"], answer: 1, explain: "A keyboard inputs data into the computer." },
      { q: "Which is software?", choices: ["RAM", "A web browser", "A monitor", "A hard drive"], answer: 1, explain: "A browser is application software." },
      { q: "A monitor is a(n)…", choices: ["Input device", "Output device", "Processing unit", "Memory"], answer: 1, explain: "A monitor outputs visual information." },
    ],
    "t01.cpu": [
      { q: "Registers are…", choices: ["Slow disk storage", "Tiny, fastest storage in the CPU", "Network cards", "Cooling fans"], answer: 1, explain: "Registers are the fastest storage, inside the CPU." },
      { q: "The Control Unit…", choices: ["Does arithmetic", "Directs operations", "Stores files", "Displays pixels"], answer: 1, explain: "The CU directs the processor; the ALU does arithmetic." },
      { q: "Which is fastest to access?", choices: ["HDD", "RAM", "CPU register", "SSD"], answer: 2, explain: "Registers are fastest, then cache, RAM, SSD, HDD." },
    ],
    "t01.memory": [
      { q: "RAM is…", choices: ["Non-volatile", "Volatile (lost on power off)", "Read-only", "On the CPU die only"], answer: 1, explain: "RAM loses its contents without power." },
      { q: "ROM mainly stores…", choices: ["Your documents", "Firmware/boot instructions", "Web pages", "Temp files"], answer: 1, explain: "ROM holds permanent firmware." },
      { q: "Which is faster but pricier per bit?", choices: ["DRAM", "SRAM", "HDD", "Tape"], answer: 1, explain: "SRAM (caches) is faster and costlier than DRAM." },
    ],
    "t01.storage": [
      { q: "An SSD has…", choices: ["Spinning platters", "No moving parts", "A read head on an arm", "A spindle motor"], answer: 1, explain: "SSDs are fully electronic flash memory." },
      { q: "Lowest cost per GB for bulk storage?", choices: ["NVMe SSD", "HDD", "RAM", "Cache"], answer: 1, explain: "HDDs are cheapest per GB." },
      { q: "Why do unsaved variables vanish on power loss?", choices: ["They're on the SSD", "They live in volatile RAM", "They're in ROM", "They're encrypted"], answer: 1, explain: "Running data sits in RAM, which is volatile." },
    ],
    "t01.system-levels": [
      { q: "Python sits at which level?", choices: ["Digital logic", "Machine (ISA)", "High-level language", "Control"], answer: 2, explain: "Python is a high-level language (Level 5)." },
      { q: "Logic gates are at the…", choices: ["User level", "Digital logic level", "OS level", "Assembly level"], answer: 1, explain: "Gates/flip-flops are Level 0." },
      { q: "The main benefit of layered abstraction is…", choices: ["More electricity", "Each layer hides the one below", "Fewer files", "Faster RAM"], answer: 1, explain: "Abstraction lets you ignore lower-level detail." },
    ],
    /* ---------- Topic 07 ---------- */
    "t07.matplotlib-basics": [
      { q: "Conventional import alias?", choices: ["mp", "plt", "plot", "mpl"], answer: 1, explain: "import matplotlib.pyplot as plt." },
      { q: "Which renders the figure?", choices: ["plt.draw()", "plt.show()", "plt.figure()", "plt.plot()"], answer: 1, explain: "plt.show() displays it." },
      { q: "Add a title with…", choices: ["plt.name()", "plt.title()", "plt.head()", "plt.label()"], answer: 1, explain: "plt.title('...')." },
    ],
    "t07.chart-types": [
      { q: "Show a distribution with a…", choices: ["bar", "scatter", "histogram", "pie"], answer: 2, explain: "A histogram bins values." },
      { q: "Compare categories with a…", choices: ["histogram", "bar chart", "scatter", "line"], answer: 1, explain: "Bar charts compare categories." },
      { q: "Relationship between two variables → …", choices: ["bar", "scatter", "histogram", "pie"], answer: 1, explain: "Scatter plots show pairs of values." },
    ],
    "t07.exceptions": [
      { q: "Which block always runs?", choices: ["try", "except", "else", "finally"], answer: 3, explain: "finally always runs." },
      { q: "`else` in try runs when…", choices: ["An error occurs", "No error occurs", "Always", "Never"], answer: 1, explain: "else runs only if no exception." },
      { q: "Trigger an error on purpose with…", choices: ["throw", "raise", "error", "panic"], answer: 1, explain: "raise SomeError('msg')." },
    ],
    /* ---------- Topic 08 ---------- */
    "t08.file-handling": [
      { q: "Mode 'w' on an existing file…", choices: ["Appends", "Truncates it", "Errors", "Reads it"], answer: 1, explain: "'w' wipes existing content." },
      { q: "`with open(...)` is preferred because it…", choices: ["Is faster", "Auto-closes the file", "Encrypts", "Avoids imports"], answer: 1, explain: "It closes the file even on error." },
      { q: "Append to a file with mode…", choices: ["'r'", "'w'", "'a'", "'x'"], answer: 2, explain: "'a' appends." },
    ],
    "t08.csv-json": [
      { q: "Serialize a dict to a file with…", choices: ["csv", "json", "os", "math"], answer: 1, explain: "json.dump writes dicts/lists." },
      { q: "CSV stands for…", choices: ["Comma-Separated Values", "Code Style Verify", "Compact Storage Volume", "Column Sorted Values"], answer: 0, explain: "Comma-Separated Values." },
      { q: "`json.loads(s)` does what?", choices: ["Writes JSON", "Parses JSON text to Python", "Deletes JSON", "Sorts JSON"], answer: 1, explain: "loads parses a JSON string." },
    ],
    "t08.numpy": [
      { q: "Conventional import?", choices: ["import numpy as np", "import np", "from numpy", "include numpy"], answer: 0, explain: "import numpy as np." },
      { q: "`np.array([1,2]) + np.array([3,4])` is…", choices: ["[1,2,3,4]", "[4,6]", "10", "Error"], answer: 1, explain: "Element-wise: [4, 6]." },
      { q: "NumPy is fast because arrays are…", choices: ["On the GPU", "Contiguous + run in C", "Smaller", "Sorted"], answer: 1, explain: "Contiguous memory + compiled C." },
    ],
    "t08.pandas": [
      { q: "A DataFrame is like a…", choices: ["Single number", "Table/spreadsheet", "Text file", "Loop"], answer: 1, explain: "2-D labelled table." },
      { q: "Read a CSV with…", choices: ["pd.open_csv", "pd.read_csv", "pd.csv", "pd.load"], answer: 1, explain: "pd.read_csv(...)." },
      { q: "Average salary per dept uses…", choices: ["df.mean()", "df.groupby('dept')['salary'].mean()", "df.head()", "df.sort()"], answer: 1, explain: "groupby then mean." },
    ],
    /* ---------- Topic 09 ---------- */
    "t09.what-is-algorithm": [
      { q: "We measure cost by…", choices: ["Nanoseconds", "How work grows with input n", "Lines of code", "File size"], answer: 1, explain: "Growth with n, not raw time." },
      { q: "Two nested loops over n are…", choices: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: 1, explain: "n × n = n²." },
      { q: "An algorithm must above all be…", choices: ["Short", "Correct", "Recursive", "In C"], answer: 1, explain: "Correctness comes first." },
    ],
    "t09.big-o": [
      { q: "Best growth for large n?", choices: ["O(n²)", "O(n)", "O(log n)", "O(2ⁿ)"], answer: 2, explain: "O(log n) grows slowest here." },
      { q: "`O(2n+5)` simplifies to…", choices: ["O(2n)", "O(n)", "O(5)", "O(n²)"], answer: 1, explain: "Drop constants → O(n)." },
      { q: "Naive recursive Fibonacci is…", choices: ["O(1)", "O(n)", "O(2ⁿ)", "O(log n)"], answer: 2, explain: "Exponential - it recomputes subproblems." },
    ],
    "t09.searching": [
      { q: "Binary search needs data that is…", choices: ["Small", "Sorted", "Unique", "Numeric"], answer: 1, explain: "Halving by comparison needs order." },
      { q: "Linear search is…", choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2, explain: "It may check every element." },
      { q: "Binary search on 1,000,000 items ≈ … steps", choices: ["1,000,000", "1,000", "20", "1"], answer: 2, explain: "log2(1e6) ≈ 20." },
    ],
    "t09.sorting": [
      { q: "Bubble sort is…", choices: ["O(1)", "O(n)", "O(n²)", "O(log n)"], answer: 2, explain: "Two nested loops." },
      { q: "In real code, sort with…", choices: ["your own loop", "sorted()/list.sort()", "while", "recursion"], answer: 1, explain: "Built-in Timsort is O(n log n) and tuned." },
      { q: "Python's built-in sort is…", choices: ["O(n²)", "O(n log n)", "O(2ⁿ)", "O(1)"], answer: 1, explain: "Timsort is O(n log n)." },
    ],
    "t09.data-structures": [
      { q: "Membership `x in s` is O(1) for a…", choices: ["list", "set/dict", "tuple", "string"], answer: 1, explain: "Hashing gives ~constant lookup." },
      { q: "Remove duplicates fast with a…", choices: ["list", "set", "string", "loop"], answer: 1, explain: "set() drops duplicates." },
      { q: "`{1,2} & {2,3}` is…", choices: ["{1,2,3}", "{2}", "{1,3}", "set()"], answer: 1, explain: "& is intersection → {2}." },
    ],
    "t09.efficient-python": [
      { q: "`+=` in a loop to build a string is slow because strings are…", choices: ["Sets", "Immutable (each += copies)", "Numbers", "Sorted"], answer: 1, explain: "Use ''.join() instead." },
      { q: "Memoizing naive Fibonacci changes it from…", choices: ["O(n)→O(1)", "O(2ⁿ)→O(n)", "O(n²)→O(n)", "no change"], answer: 1, explain: "Caching makes each n computed once." },
      { q: "A generator helps mainly with…", choices: ["Speed only", "Memory (streams items)", "Sorting", "Plotting"], answer: 1, explain: "It avoids building a big list in memory." },
    ],
    /* ---------- Topic 10 - C ---------- */
    "t10.why-c": [
      { q: "C is…", choices: ["Interpreted", "Compiled to machine code", "Run in a browser", "A database"], answer: 1, explain: "A compiler builds a native executable." },
      { q: "Execution starts at…", choices: ["The top line", "main()", "#include", "the last function"], answer: 1, explain: "C programs start at main()." },
      { q: "After editing C source you must…", choices: ["Nothing", "Recompile", "Reboot", "Convert to Python"], answer: 1, explain: "Recompile to a new executable." },
    ],
    "t10.types": [
      { q: "In C a variable's type is…", choices: ["Inferred & changeable", "Declared & fixed", "Always int", "Optional"], answer: 1, explain: "You declare it and it stays fixed." },
      { q: "`int q = 7 / 2;` gives…", choices: ["3.5", "3", "4", "Error"], answer: 1, explain: "Integer division drops the fraction." },
      { q: "A single char uses quotes…", choices: ["\"A\"", "'A'", "`A`", "none"], answer: 1, explain: "'A' is a char; \"A\" is a string." },
    ],
    "t10.control-flow": [
      { q: "Blocks in C are marked by…", choices: ["Indentation", "{ }", "Colons", "( )"], answer: 1, explain: "Braces group statements." },
      { q: "A C `for` has parts…", choices: ["(init; condition; update)", "(start, stop)", "(condition)", "(list)"], answer: 0, explain: "Three parts separated by semicolons." },
      { q: "Missing `break;` in a switch causes…", choices: ["Error", "Fall-through", "Halt", "Nothing"], answer: 1, explain: "Execution falls into the next case." },
    ],
    "t10.functions": [
      { q: "A C function declares…", choices: ["Only a name", "Return type and parameter types", "Nothing", "Line count"], answer: 1, explain: "Both the return type and each parameter type." },
      { q: "Returns nothing → return type…", choices: ["int", "void", "null", "none"], answer: 1, explain: "void means no return value." },
      { q: "Default argument passing in C is…", choices: ["By reference", "By value (a copy)", "By name", "By pointer always"], answer: 1, explain: "C copies arguments unless you pass a pointer." },
    ],
    "t10.pointers": [
      { q: "`&x` gives…", choices: ["x's value", "x's address", "a copy of x", "zero"], answer: 1, explain: "& is address-of." },
      { q: "`*p` (dereference) gives…", choices: ["p's address", "the value p points to", "a copy of p", "NULL"], answer: 1, explain: "*p reads the value at p's address." },
      { q: "Pass `&n` to a function so it can…", choices: ["Run faster", "Modify the caller's n", "Copy n", "Delete n"], answer: 1, explain: "Passing the address allows writing back." },
    ],
    "t10.arrays-strings": [
      { q: "`arr[i]` is O(1) because…", choices: ["arrays are sorted", "address = base + i×size", "the CPU searches", "arrays are small"], answer: 1, explain: "One address calculation." },
      { q: "A C string ends with…", choices: ["a space", "newline", "'\\0' (NUL)", "255"], answer: 2, explain: "NUL-terminated." },
      { q: "Writing past an array's end…", choices: ["Raises IndexError", "Grows it", "Corrupts memory", "Is impossible"], answer: 2, explain: "C has no bounds checking - buffer overflow." },
    ],
    "t10.memory": [
      { q: "Local variables live on the…", choices: ["heap", "stack", "ROM", "disk"], answer: 1, explain: "Stack frames hold locals." },
      { q: "Forgetting free() after malloc() causes a…", choices: ["Syntax error", "Memory leak", "Speedup", "Stack overflow"], answer: 1, explain: "Unfreed heap memory leaks." },
      { q: "Python avoids manual free() via…", choices: ["A bigger stack", "Reference counting + GC", "The GPU", "Compiling to C"], answer: 1, explain: "CPython reclaims objects automatically." },
    ],
  };

  function findLesson(key) {
    const dot = key.indexOf(".");
    const t = (App.TOPICS || []).find((x) => x.id === key.slice(0, dot));
    return t && t.lessons.find((l) => l.id === key.slice(dot + 1));
  }

  // one more question for lessons that started with only a single quiz item
  const EXTRA = {
    "t00.first-run": { q: "Comments in Python start with…", choices: ["//", "#", "/*", "--"], answer: 1, explain: "# begins a comment in Python." },
    "t07.chart-types": { q: "`plt.bar(...)` draws a…", choices: ["line", "bar chart", "scatter", "histogram"], answer: 1, explain: "bar() makes a bar chart." },
    "t08.csv-json": { q: "`json.dump(data, f)` …", choices: ["Reads JSON", "Writes data to file f", "Deletes f", "Prints data"], answer: 1, explain: "dump serializes data into the open file." },
    "t10.why-c": { q: "C source becomes an executable via a…", choices: ["Interpreter", "Compiler", "Browser", "Spreadsheet"], answer: 1, explain: "A compiler builds the native executable." },
  };

  function topUp(map) {
    Object.keys(map).forEach((key) => {
      const lesson = findLesson(key);
      if (!lesson || lesson.deck) return; // authored decks carry their own checks
      lesson.quiz = lesson.quiz || [];
      const items = Array.isArray(map[key]) ? map[key] : [map[key]];
      for (const q of items) {
        if (lesson.quiz.length >= 5) break;
        if (lesson.quiz.some((existing) => existing.q === q.q)) continue;
        lesson.quiz.push(q);
      }
    });
  }

  topUp(P);
  topUp(EXTRA);
})();
