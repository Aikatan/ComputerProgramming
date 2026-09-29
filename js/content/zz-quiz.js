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
