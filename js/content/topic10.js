/* ===================== Topic 10 — Programming in C ===================== */
App.registerTopic({
  id: "t10",
  title: "Programming in C",
  short: "Programming in C",
  blurb: "Take everything you learned in Python into a lower-level language. A from-scratch C course for Python programmers — types you must declare, pointers, arrays, and manual memory.",
  intro: "You already know how to think like a programmer — variables, loops, functions, data. This topic teaches you to express those same ideas in C, a compiled language that sits much closer to the hardware. C makes you state things Python decided for you (types, sizes, memory), which is exactly why it's fast and why learning it deepens your understanding. Assumes no prior C. Note: C examples here are for reading and study — the in-browser engine runs Python, so each C snippet is paired with a runnable Python equivalent where it helps.",
  lessons: [
    {
      id: "why-c",
      title: "Why C, and how a C program runs",
      sub: "Compiling, the structure of a program, and your first build.",
      keywords: "c compiled gcc main include header compile link executable hello",
      learn: [
        { type: "text", html: "<span class='term'>C</span> (1972) is the language the modern world is built on — operating systems, databases, Python's own interpreter, embedded devices. It's <b>compiled</b>: you write source, a compiler turns it into a machine-code executable, and the CPU runs that directly. No interpreter, almost no run-time safety net — fast, but you are responsible for the details Python handled for you." },
        { type: "widget", name: "diagram", config: { title: "Python vs C — the same idea, different contract", layout: "row", boxes: [
          { title: "Python (you've used)", body: "Interpreted. No type declarations. Memory managed for you. Bounds checked. Runs anywhere with Python. Slower." },
          { title: "C (you're learning)", body: "Compiled to a native executable. You declare every type and size. You manage memory by hand. No bounds checking. Platform-specific. Very fast." },
        ] } },
        { type: "subhead", text: "The shape of a C program" },
        { type: "text", html: "Every C program starts at a function called <code>main</code>. Lines end in semicolons <code>;</code>, blocks use curly braces <code>{ }</code> (not indentation), and you bring in library features with <code>#include</code> headers. Returning <code>0</code> from <code>main</code> means 'success'." },
        { type: "example", lang: "c", caption: "hello.c — your first C program", code:
"#include <stdio.h>     // brings in input/output, e.g. puts()\n\nint main(void) {       // execution starts here\n    puts(\"Hello, World!\");   // print a line of text\n    return 0;          // 0 = program finished successfully\n}" },
        { type: "list", title: "How you build and run it (in a terminal)", items: [
          "<b>Compile:</b> <code>gcc hello.c -o hello</code> — turns source into an executable named <code>hello</code>.",
          "<b>Run:</b> <code>./hello</code> (or <code>hello.exe</code> on Windows).",
          "Change the code? You must <b>recompile</b> before running again — there's no interpreter reading it live.",
        ] },
        { type: "note", title: "Output in C", html: "<code>puts(\"text\")</code> prints a line. C's general-purpose output function is <code>printf</code>, which uses <i>format specifiers</i> — <code>%d</code> for an int, <code>%f</code> for a float, <code>%c</code> for a char, <code>%s</code> for a string — e.g. conceptually 'print the value of x as an integer'. We'll describe results in comments so you can focus on the concepts." },
        { type: "deepdive", title: "What 'compiled' buys and costs", html: "<p>The compiler checks types and produces optimised machine code <i>once</i>, so running is pure CPU work — no per-line translation, no type checks, no garbage collector. That's the speed. The cost: a build step every change, errors that are sometimes cryptic, and full responsibility for memory and bounds. Python traded all that away for convenience; C hands it back for control.</p>" },
      ],
      live: [
        { title: "The same program in Python (for comparison)", code: "# The Python you already know does the same job in one line:\nprint(\"Hello, World!\")\n# No #include, no main(), no types, no compile step." },
      ],
      quiz: [
        { q: "Where does a C program begin executing?", choices: ["The first line of the file", "The main() function", "The #include", "The last function"], answer: 1, explain: "Execution starts at main(); other functions run only when called." },
        { q: "After editing C source you must…", choices: ["Nothing, it re-reads itself", "Recompile before running", "Restart the computer", "Convert it to Python"], answer: 1, explain: "C is compiled — changes require a fresh compile to a new executable." },
      ],
    },
    {
      id: "types",
      title: "Variables & types in C",
      sub: "The big change from Python: you declare the type, and it's fixed.",
      keywords: "c type int char float double declare size cast variable constant",
      learn: [
        { type: "text", html: "In Python a variable is just a name and the type follows the value. In C you must <b>declare</b> each variable's type up front, and that type is <b>fixed</b> for its whole life. The type decides how many bytes it takes and what it can hold." },
        { type: "example", lang: "c", caption: "declaring typed variables", code:
"int    age   = 25;       // whole number, usually 4 bytes\ndouble price = 19.99;    // 64-bit decimal, high precision\nfloat  ratio = 0.5f;     // 32-bit decimal (note the f)\nchar   grade = 'A';      // a single character (1 byte) — single quotes!\n\nage = 26;        // OK: same type\n// age = \"hello\"; // ERROR: can't put text in an int (compiler refuses)" },
        { type: "widget", name: "diagram", config: { title: "The core C types", boxes: [
          { title: "int", body: "Whole numbers, typically 4 bytes (about ±2.1 billion). Variants: <code>short</code>, <code>long</code>, and <code>unsigned</code> (non-negative, doubles the positive range)." },
          { title: "float / double", body: "Decimals. <code>float</code> ≈ 7 digits (4 bytes); <code>double</code> ≈ 15 digits (8 bytes). Use <code>double</code> unless memory is tight." },
          { title: "char", body: "One character / one byte, stored as its ASCII number ('A' is 65). Written with single quotes. (A whole string is an array of char — later lesson.)" },
          { title: "_Bool / bool", body: "True or false (0 or 1). With <code>#include &lt;stdbool.h&gt;</code> you can write <code>bool</code>, <code>true</code>, <code>false</code>." },
        ] } },
        { type: "subhead", text: "Fixed size means limits" },
        { type: "text", html: "Because each type has a fixed width, values have hard limits and can <b>overflow</b> (wrap around) silently — the constraint that makes you think about ranges. Decimals also do integer division surprises just like Python 2." },
        { type: "example", lang: "c", caption: "casting and integer division", code:
"int a = 7, b = 2;\nint   q = a / b;          // 3  — integer division drops the remainder\ndouble exact = (double)a / b;  // 3.5 — cast a to double first\n\nunsigned char small = 255;\nsmall = small + 1;        // wraps to 0 — overflow, no warning!" },
        { type: "note", variant: "warn", title: "C is statically typed", html: "Types are checked at <i>compile</i> time. Many bugs that Python only discovers when the line runs, C catches before the program even starts — a real benefit of declaring types." },
      ],
      live: [
        { title: "Python equivalents — see the same operations", code: "# integer division and float division (Python 3):\nprint(7 // 2)        # 3   (like C's int / int)\nprint(7 / 2)         # 3.5 (Python auto-floats; C needs a cast)\n\n# a char is just a number:\nprint(ord('A'))      # 65  (C stores 'A' as 65 too)\nprint(chr(66))       # 'B'" },
      ],
      quiz: [
        { q: "In C, after `int x = 5;`, can x later hold \"hello\"?", choices: ["Yes, like Python", "No — its type is fixed at int", "Only with quotes", "Only if global"], answer: 1, explain: "C variables have a fixed declared type; the compiler rejects assigning a string to an int." },
        { q: "`int q = 7 / 2;` gives q = …", choices: ["3.5", "3", "4", "error"], answer: 1, explain: "Integer division drops the fraction — 3. Cast to double for 3.5." },
        { q: "A single character in C is written with…", choices: ["double quotes \"A\"", "single quotes 'A'", "backticks", "no quotes"], answer: 1, explain: "'A' is a char (single quotes); \"A\" is a string (an array of char)." },
      ],
    },
    {
      id: "control-flow",
      title: "Control flow in C",
      sub: "if/else, switch, while, for — same logic, new punctuation.",
      keywords: "c if else switch while for loop braces semicolon condition",
      learn: [
        { type: "text", html: "The control structures are the same ideas you used in Python (Topic 03). The differences are punctuation: conditions go in <code>( )</code>, blocks go in <code>{ }</code>, and statements end with <code>;</code>. Indentation is for humans only — it doesn't define blocks." },
        { type: "example", lang: "c", caption: "if / else if / else", code:
"int score = 73;\nif (score >= 80) {\n    grade = 'A';\n} else if (score >= 70) {\n    grade = 'B';\n} else {\n    grade = 'C';\n}",
          annot: [
            { c: "if (score >= 80) {", e: "Condition in parentheses; body in braces. Compare with Python's <code>if score &gt;= 80:</code> + indentation." },
            { c: "} else if (...) {", e: "C writes <code>else if</code> (two words) where Python writes <code>elif</code>." },
          ] },
        { type: "example", lang: "c", caption: "while and for loops", code:
"// while: same as Python\nint i = 0;\nwhile (i < 5) {\n    i = i + 1;\n}\n\n// for: C's for is a counter in three parts — (init; condition; update)\nfor (int j = 0; j < 5; j = j + 1) {\n    // runs for j = 0,1,2,3,4\n}",
          annot: [
            { c: "for (int j = 0; j < 5; j++)", e: "Three parts: start, keep-going test, and step. Python hides this inside <code>range()</code>." },
          ] },
        { type: "note", title: "switch — a tidy multi-way branch", html: "C has <code>switch</code> for choosing among many constant values (Python got <code>match</code> only recently). Each <code>case</code> needs a <code>break;</code> or it 'falls through' to the next — a classic beginner bug." },
        { type: "example", lang: "c", caption: "switch statement", code:
"switch (day) {\n    case 1:  /* Monday    */  break;\n    case 6:\n    case 7:  /* Weekend   */  break;\n    default: /* a weekday  */  break;   // when nothing else matched\n}" },
        { type: "deepdive", title: "Braces vs indentation — a real bug", html: "<p>In Python indentation <i>is</i> the block, so it can't lie. In C, indentation is cosmetic — only braces group statements. A missing pair of braces (<code>if (x) doA(); doB();</code> where you meant both to be conditional) compiles fine but does the wrong thing. Always brace your blocks.</p>" },
      ],
      live: [
        { title: "The same grade logic in Python", code: "score = 73\nif score >= 80:\n    grade = 'A'\nelif score >= 70:\n    grade = 'B'\nelse:\n    grade = 'C'\nprint(grade)   # B\n\n# C's for(j=0;j<5;j++) is just:\nfor j in range(5):\n    print(j, end=' ')" },
      ],
      quiz: [
        { q: "In C, what marks a block of code?", choices: ["Indentation", "Curly braces { }", "Colons", "Parentheses"], answer: 1, explain: "Braces { } group statements in C; indentation is only for readability." },
        { q: "C's `for (init; condition; update)` corresponds to Python's…", choices: ["while True", "for x in range(...)", "if/else", "def"], answer: 1, explain: "The C for-loop is a counting loop, like iterating a range in Python." },
        { q: "Forgetting `break;` in a switch case causes…", choices: ["A syntax error", "Fall-through into the next case", "The program to stop", "Nothing"], answer: 1, explain: "Without break, execution falls through into the following case(s)." },
      ],
    },
    {
      id: "functions",
      title: "Functions in C",
      sub: "Typed parameters, a return type, and declare-before-use.",
      keywords: "c function prototype return type parameter pass by value void",
      learn: [
        { type: "text", html: "A C function declares the <b>type it returns</b> and the <b>type of each parameter</b>. Like Python, you define it once and call it many times — but the compiler must know about it <i>before</i> the call, so functions are defined above <code>main</code> (or declared with a <i>prototype</i>)." },
        { type: "example", lang: "c", caption: "a typed function", code:
"// return type ─┐     ┌─ parameter types\n//              int   (int, int)\nint add(int a, int b) {\n    int sum = a + b;\n    return sum;        // must return an int, as promised\n}\n\nint main(void) {\n    int result = add(3, 4);   // result is 7\n    return 0;\n}",
          annot: [
            { c: "int add(int a, int b)", e: "Returns an int; takes two ints. Python's <code>def add(a, b):</code> names nothing's type." },
            { c: "return sum;", e: "The returned value's type must match the declared return type." },
          ] },
        { type: "note", title: "void = returns nothing", html: "A function that returns no value has return type <code>void</code> (like a Python function with no <code>return</code>). <code>main</code> returns <code>int</code> — the program's exit code." },
        { type: "subhead", text: "Pass by value" },
        { type: "text", html: "By default C copies each argument into the function (<b>pass by value</b>) — changing a parameter inside does <i>not</i> change the caller's variable. To let a function modify the caller's data, you pass its <b>address</b> (a pointer — next lesson). Python behaves differently again: it passes references, so mutating a passed list is visible outside." },
        { type: "example", lang: "c", caption: "the copy doesn't escape", code:
"void try_change(int x) {\n    x = 99;        // changes only the local copy\n}\nint main(void) {\n    int n = 5;\n    try_change(n);  // n is STILL 5 afterward\n    return 0;\n}" },
        { type: "deepdive", title: "Prototypes", html: "<p>If you want to define helper functions <i>below</i> main, you put a <b>prototype</b> (the signature plus a semicolon) near the top so the compiler knows the function exists: <code>int add(int, int);</code>. This 'declare before use' rule is why C headers (<code>.h</code> files) exist — they're collections of prototypes.</p>" },
      ],
      live: [
        { title: "Same function in Python — note what's missing", code: "def add(a, b):       # no types declared\n    return a + b\n\nprint(add(3, 4))     # 7\n\n# Pass-by-value vs Python references:\ndef try_change(x):\n    x = 99           # rebinds local name only\nn = 5\ntry_change(n)\nprint(n)             # still 5 (ints are immutable)" },
      ],
      quiz: [
        { q: "A C function must declare…", choices: ["Only its name", "Its return type and parameter types", "Nothing", "Its line count"], answer: 1, explain: "C functions state the return type and each parameter's type." },
        { q: "With pass-by-value, changing a parameter inside a function…", choices: ["Changes the caller's variable", "Affects only the local copy", "Is illegal", "Returns automatically"], answer: 1, explain: "C copies arguments; the original is untouched unless you pass an address." },
      ],
    },
    {
      id: "pointers",
      title: "Pointers",
      sub: "Variables that hold addresses — C's defining feature.",
      keywords: "c pointer address dereference ampersand asterisk pass by reference indirection",
      learn: [
        { type: "text", html: "A <span class='term'>pointer</span> is a variable whose value is the <b>memory address</b> of another variable. This is the idea Python hides completely. Two operators: <code>&x</code> gives 'the address of x', and <code>*p</code> means 'the value stored at the address p holds' (called <i>dereferencing</i>)." },
        { type: "example", lang: "c", caption: "a pointer to an int", code:
"int  x = 42;     // x lives at some address, say 0x1000\nint *p = &x;     // p holds 0x1000 — 'the address of x'\n\nint  value = *p; // value = 42  — follow p to read x\n*p = 99;         // follow p and write — now x == 99 too\n\n// p   is an address (0x1000)\n// *p  is the value there (99)\n// &x  is x's address (0x1000)",
          annot: [
            { c: "int *p = &x;", e: "The <code>*</code> in a declaration means 'p is a pointer to int'. <code>&x</code> is x's address." },
            { c: "*p = 99;", e: "Dereference and assign — reaches all the way back to x." },
          ] },
        { type: "widget", name: "memoryModel", config: { title: "x and a pointer to it, in memory", columns: [
          { head: "Address → contents", cells: [
            { addr: "0x1000", name: "x (int)", val: "99" },
            { addr: "0x1004", name: "p (int*)", val: "0x1000", kind: "ptr", note: "p does not hold 99 — it holds the ADDRESS where 99 lives. Following p (*p) reaches x." },
          ] },
        ] } },
        { type: "subhead", text: "The killer use: let a function change your variable" },
        { type: "text", html: "Because C passes copies, a function can only modify your variable if you hand it the <b>address</b>. This is how C does 'pass by reference'." },
        { type: "example", lang: "c", caption: "modifying the caller's variable via a pointer", code:
"void set_to_99(int *ptr) {\n    *ptr = 99;       // write through the pointer\n}\nint main(void) {\n    int n = 5;\n    set_to_99(&n);   // pass the ADDRESS of n\n    // n is now 99\n    return 0;\n}" },
        { type: "note", variant: "danger", title: "Pointers are powerful and dangerous", html: "A pointer aimed at the wrong place — uninitialised, freed (<i>dangling</i>), or <code>NULL</code> — crashes the program (segfault) or silently corrupts memory. This power-with-risk is exactly why beginner languages hide pointers." },
        { type: "deepdive", title: "Python's references are the same idea, hidden", html: "<p>You never write <code>*</code> or <code>&</code> in Python, yet every variable is secretly a reference (an address) to a heap object. <code>b = a</code> copies the reference, so <code>b.append(x)</code> changes the one shared list. Learning C pointers makes Python's 'spooky action at a distance' suddenly obvious — see it run on the right.</p>" },
      ],
      live: [
        { title: "Python references behave like hidden pointers", code: "a = [1, 2, 3]\nb = a                  # copies the REFERENCE, not the list\nprint(id(a) == id(b))  # True — same object/address\nb.append(99)\nprint(\"a is now:\", a)  # a changed too — both names point to one list\n\nc = a.copy()           # to truly copy, ask for a copy\nc.append(0)\nprint(\"a:\", a, \" c:\", c)" },
      ],
      quiz: [
        { q: "If `int *p = &x;`, what does `*p` give you?", choices: ["The address of x", "The value stored in x", "A copy of p", "Zero"], answer: 1, explain: "Dereferencing (*p) reads the value at the address p holds — x's value." },
        { q: "Why pass `&n` to a function?", choices: ["To make it faster", "So the function can modify the caller's n", "To copy n", "Pointers are required everywhere"], answer: 1, explain: "Passing the address lets the function write through the pointer to the original variable." },
      ],
    },
    {
      id: "arrays-strings",
      title: "Arrays & strings in C",
      sub: "Contiguous memory, and why C strings hide a zero at the end.",
      keywords: "c array contiguous index pointer arithmetic string null terminator buffer overflow",
      learn: [
        { type: "text", html: "An <span class='term'>array</span> is a fixed-size block of equal elements stored <b>contiguously</b> (back-to-back). Indexing is instant because <code>arr[i]</code> is computed as 'start address + i × element size'. The array's name is essentially a pointer to its first element." },
        { type: "example", lang: "c", caption: "an array of ints", code:
"int arr[4] = {10, 20, 30, 40};  // 4 ints, side by side\nint first = arr[0];   // 10\narr[2] = 99;          // change the third element\n\nint *p = arr;         // arr decays to a pointer to arr[0]\n// arr[2] is the same as *(p + 2)  — 'pointer arithmetic'",
          annot: [
            { c: "int arr[4]", e: "Size is fixed at declaration — you can't grow it like a Python list." },
            { c: "*(p + 2)", e: "Adding to a pointer moves it by whole elements; identical to arr[2]." },
          ] },
        { type: "widget", name: "memoryModel", config: { title: "int arr[4] = {10,20,30,40} — one contiguous block", columns: [
          { head: "Address → element", cells: [
            { addr: "0x2000", name: "arr[0]", val: "10" },
            { addr: "0x2004", name: "arr[1]", val: "20" },
            { addr: "0x2008", name: "arr[2]", val: "30" },
            { addr: "0x200C", name: "arr[3]", val: "40", note: "Each int is 4 bytes, so addresses step by 4. arr[i] = base + i*4 — that's why indexing is O(1)." },
          ] },
        ] } },
        { type: "subhead", text: "Strings are arrays of char ending in '\\0'" },
        { type: "text", html: "C has no built-in string type. A string is an <b>array of <code>char</code></b> with a hidden <span class='term'>NUL terminator</span> (<code>'\\0'</code>, value 0) marking the end — that's how functions know where the text stops." },
        { type: "example", lang: "c", caption: "a C string", code:
"char name[6] = \"Hello\";  // actually 6 chars: 'H' 'e' 'l' 'l' 'o' '\\0'\n// name[0] == 'H',  name[5] == '\\0'\n// string functions (strlen, strcpy...) live in <string.h>" },
        { type: "note", variant: "danger", title: "No bounds checking → buffer overflow", html: "C does not check that an index is valid. Writing <code>arr[10]</code> on a 4-element array overwrites whatever bytes follow — a crash, or a security exploit. Python lists raise <code>IndexError</code> instead; in C, staying in bounds is <i>your</i> job." },
        { type: "deepdive", title: "Why this layout makes C (and NumPy) fast", html: "<p>Contiguous memory is <b>cache-friendly</b>: the CPU loads nearby bytes together, so marching through an array is very fast. A Python list stores scattered object references instead, so iterating it chases pointers around the heap. This is exactly why NumPy (C-style contiguous arrays) crushes a Python loop for number-crunching — the hardware lesson from Topic 09.</p>" },
      ],
      live: [
        { title: "Python lists are bounds-checked and growable (C arrays are neither)", code: "arr = [10, 20, 30, 40]\nprint(arr[2])          # 30\narr.append(50)         # Python lists grow; C arrays are fixed size\nprint(arr)\ntry:\n    print(arr[99])     # C would read garbage; Python protects you\nexcept IndexError as e:\n    print(\"IndexError:\", e)" },
      ],
      quiz: [
        { q: "Why is `arr[i]` an O(1) operation?", choices: ["Arrays are sorted", "Address = base + i × element size, one calculation", "The CPU searches", "Arrays are short"], answer: 1, explain: "Contiguous layout means any element's address is a single arithmetic step." },
        { q: "What marks the end of a C string?", choices: ["A space", "A newline", "A NUL byte '\\0'", "255"], answer: 2, explain: "C strings are NUL-terminated — a hidden '\\0' signals the end." },
        { q: "Writing past the end of a C array…", choices: ["Raises IndexError", "Grows the array", "Corrupts memory / buffer overflow", "Is impossible"], answer: 2, explain: "C has no bounds checking — out-of-range writes corrupt memory." },
      ],
    },
    {
      id: "memory",
      title: "Memory: the stack & the heap",
      sub: "Automatic locals vs memory you allocate and must free.",
      keywords: "c stack heap malloc free memory leak dangling pointer stack overflow sizeof",
      learn: [
        { type: "text", html: "A running C program has two working regions. The <span class='term'>stack</span> is automatic and fast; the <span class='term'>heap</span> is manual and flexible. Knowing the difference is the heart of writing correct C." },
        { type: "widget", name: "memoryModel", config: { title: "Stack vs Heap", columns: [
          { head: "Stack (automatic)", cells: [
            { name: "main() frame", val: "n = 5", kind: "frame" },
            { name: "f() frame", val: "i = 10", kind: "frame", note: "Each function call pushes a frame holding its locals; returning pops it automatically. Fast, but limited — deep recursion overflows it." },
          ] },
          { head: "Heap (manual)", cells: [
            { addr: "0x9000", name: "malloc(40)", val: "[ … 40 bytes … ]", kind: "ptr", note: "You request memory explicitly and must free() it yourself. Big and flexible, but you own the cleanup." },
          ] },
        ] } },
        { type: "list", title: "Stack vs heap", items: [
          "<b>Stack</b>: local variables and call frames. Allocated and freed <i>automatically</i> as functions enter and return. Very fast, but small — unbounded recursion causes a <b>stack overflow</b>.",
          "<b>Heap</b>: memory whose size or lifetime you decide at run time. You <code>malloc</code> it and must <code>free</code> it. Large, but mismanagement causes leaks and dangling pointers.",
        ] },
        { type: "example", lang: "c", caption: "allocating and freeing heap memory", code:
"#include <stdlib.h>   // for malloc / free\n\nint *make_array(int n) {\n    int *block = malloc(n * sizeof(int));  // ask for n ints on the heap\n    return block;                          // hand back the pointer\n}\nint main(void) {\n    int *data = make_array(10);\n    data[0] = 7;          // use it\n    free(data);           // you MUST return heap memory\n    // using data after free() = dangling pointer (undefined behaviour)\n    return 0;\n}",
          annot: [
            { c: "malloc(n * sizeof(int))", e: "Request enough bytes for n ints; <code>sizeof</code> gives a type's byte size." },
            { c: "free(data);", e: "Forgetting this is a memory leak; using data afterwards is a dangling-pointer bug." },
          ] },
        { type: "note", variant: "warn", title: "This is what Python does for you", html: "Python objects live on the heap too, but you never call <code>malloc</code>/<code>free</code>. Reference counting plus a garbage collector reclaim memory automatically. Convenient and safe — and part of why Python is slower than C. Stack overflow still exists: it's the <code>RecursionError</code> from Topic 05." },
        { type: "deepdive", title: "The full memory picture", html: "<p>A C program's address space has: the <b>stack</b> (grows down, holds call frames), the <b>heap</b> (grows up, holds malloc'd data), a <b>global/static</b> area (lives the whole run), and the <b>code</b> itself. Bugs like leaks (heap never freed), use-after-free (dangling), and overflows (stack or buffer) are the price of manual control — and the reason memory-safe languages exist.</p>" },
      ],
      live: [
        { title: "Watch Python manage memory automatically", code: "import sys\na = [1, 2, 3]\nprint(\"references to the list:\", sys.getrefcount(a) - 1)\nb = a\nprint(\"after b = a:\", sys.getrefcount(a) - 1)\ndel b\nprint(\"after del b:\", sys.getrefcount(a) - 1)\nprint(\"bytes used by the list object:\", sys.getsizeof(a))\n# No malloc, no free — Python frees the list when nothing references it." },
      ],
      quiz: [
        { q: "Where do a function's local variables normally live?", choices: ["The heap", "The stack", "ROM", "The disk"], answer: 1, explain: "Locals live in the function's stack frame, freed automatically on return." },
        { q: "In C, forgetting `free()` after `malloc()` causes a…", choices: ["Syntax error", "Memory leak", "Faster program", "Stack overflow"], answer: 1, explain: "Heap memory you never free accumulates — a memory leak." },
        { q: "Python avoids manual free() by using…", choices: ["A bigger stack", "Reference counting + garbage collection", "The GPU", "Compiling to C"], answer: 1, explain: "CPython reclaims objects automatically via reference counting and a cycle collector." },
      ],
    },
  ],
});
