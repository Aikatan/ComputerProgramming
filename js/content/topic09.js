/* ===================== Topic 09 — Inside the Machine: C & Memory ===================== */
App.registerTopic({
  id: "t09",
  title: "Inside the Machine: C & Memory",
  short: "C & Memory",
  blurb: "Beyond the course: how C compiles, how values really live in memory, pointers, the stack & heap, and how Python compares.",
  intro: "Python hides the machine from you on purpose. This advanced topic lifts the lid: how a lower-level language like C turns into instructions, how bits and bytes store every value, what a pointer really is, and how the stack and heap manage memory. Understanding this makes you reason about performance and bugs that Python's comfort otherwise hides. (C code here is illustrative — it shows concepts; the live Python boxes demonstrate the same ideas you can run.)",
  lessons: [
    {
      id: "compiled-vs-interpreted",
      title: "Compiled vs interpreted",
      sub: "How C becomes a runnable program — and why that makes it fast.",
      keywords: "compiler interpreter c machine code toolchain assembly link executable",
      learn: [
        { type: "text", html: "Your CPU only understands <span class='term'>machine code</span> — raw binary instructions. The difference between languages is <i>when</i> your source text becomes machine code." },
        { type: "widget", name: "diagram", config: { title: "Two routes to the CPU", layout: "row", boxes: [
          { title: "C — compiled ahead of time", body: "A <b>compiler</b> translates your whole program into a machine-code executable <i>once</i>. Running it is then just the CPU executing those instructions directly — very fast, but you must recompile after every change, and the binary is tied to one platform." },
          { title: "Python — interpreted at run time", body: "The Python <b>interpreter</b> reads your source and executes it line by line (via bytecode) <i>every</i> time it runs. Flexible and portable, but slower because translation happens while running." },
        ] } },
        { type: "subhead", text: "The C build pipeline" },
        { type: "list", items: [
          "<b>Preprocess</b> — handle <code>#include</code> and <code>#define</code> (textual substitution).",
          "<b>Compile</b> — turn C into assembly for your CPU.",
          "<b>Assemble</b> — turn assembly into machine-code object files (<code>.o</code>).",
          "<b>Link</b> — stitch object files + libraries into one executable.",
        ] },
        { type: "example", lang: "c", caption: "a tiny C program (compiled with: gcc hello.c -o hello)", code:
"int main(void) {\n    int x = 41;\n    x = x + 1;      // the CPU runs an ADD instruction\n    return x;       // exit code 42 — no runtime to translate it\n}" },
        { type: "note", title: "Why this matters", html: "C has almost no run-time overhead: no interpreter, no automatic memory management, no type checks while running. That speed is exactly why Python's heavy-lifting libraries (NumPy, pandas) are written in C underneath." },
        { type: "deepdive", title: "Where Python sits", html: "<p>CPython (the standard Python) compiles your <code>.py</code> to <b>bytecode</b> (<code>.pyc</code>) and then a <i>virtual machine</i> interprets that bytecode. So Python is 'compiled' to bytecode but 'interpreted' by the VM — a middle ground. The cost of that VM loop, plus everything being a heap object (next lessons), is the speed gap with C.</p>" },
      ],
      live: [
        { title: "Python tells you it's interpreting, right now", code: "import sys\nprint(\"Interpreter:\", sys.implementation.name)\nprint(\"Version:\", sys.version.split()[0])\n# Peek at the bytecode Python actually runs:\nimport dis\ndef add(a, b):\n    return a + b\ndis.dis(add)" },
      ],
      quiz: [
        { q: "Why is compiled C usually faster than interpreted Python?", choices: ["C uses more electricity", "Translation to machine code happens once, ahead of time", "C has more keywords", "Python can't use the CPU"], answer: 1, explain: "A compiler produces machine code once; Python translates while running, every run." },
        { q: "What does the linker do?", choices: ["Runs the program", "Combines object files and libraries into one executable", "Checks spelling", "Allocates RAM"], answer: 1, explain: "Linking stitches compiled object files and libraries into a single runnable binary." },
      ],
    },
    {
      id: "values-in-memory",
      title: "How a value is stored in memory",
      sub: "Bits, bytes, addresses, and two's complement.",
      keywords: "bit byte word address binary two's complement integer overflow ascii endian",
      learn: [
        { type: "text", html: "Memory is a long row of <span class='term'>bytes</span>, each with a numeric <span class='term'>address</span>. Every value — a number, a character, a pixel — is ultimately a pattern of bits in some of those bytes." },
        { type: "list", title: "The units", items: [
          "<b>Bit</b> — one 0 or 1.",
          "<b>Byte</b> — 8 bits; holds 0–255. The smallest addressable unit.",
          "<b>Word</b> — the CPU's natural chunk (4 bytes on 32-bit, 8 on 64-bit).",
        ] },
        { type: "widget", name: "binaryConverter", config: {} },
        { type: "subhead", text: "Negative numbers: two's complement" },
        { type: "text", html: "How do you store <code>-5</code> with only 0s and 1s? Computers use <span class='term'>two's complement</span>: to negate a number, flip every bit and add 1. The top bit becomes a sign bit. This lets the same ADD circuit handle both positive and negative numbers." },
        { type: "example", lang: "c", caption: "fixed sizes and ranges in C", code:
"unsigned char a = 255;   // 1 byte, range 0..255\nsigned char   b = -5;    // 1 byte, range -128..127  (two's complement)\nint           c = 100;   // usually 4 bytes\n\n// a + 1 would WRAP to 0 — an overflow C does not warn about!" },
        { type: "note", variant: "danger", title: "Fixed size means overflow", html: "In C a number has a fixed width, so exceeding it <b>wraps around</b> silently (255 + 1 → 0). This is a real source of bugs and security holes. Python integers grow without limit, so you never see this — at the cost of speed and memory." },
        { type: "deepdive", title: "Endianness & floats", html: "<p>A multi-byte number can be stored low-byte-first (<b>little-endian</b>, x86) or high-byte-first (<b>big-endian</b>). It matters when reading raw files or network data. Decimals use <b>IEEE 754</b>: a sign bit, an exponent, and a fraction — which is also why <code>0.1 + 0.2 != 0.3</code> exactly, in every language.</p>" },
      ],
      live: [
        { title: "See the bits — and watch Python's big integers", code: "x = 13\nprint(\"13 in binary:\", bin(x))         # 0b1101\nprint(\"'A' is\", ord('A'), '->', bin(ord('A')))\n# Two's complement of -5 in one byte:\nprint(\"-5 as a byte:\", format((-5) & 0xFF, '08b'))\n# Python ints never overflow:\nprint(2 ** 200)\n# Floating point isn't exact:\nprint(0.1 + 0.2)" },
      ],
      quiz: [
        { q: "How many distinct values fit in one byte?", choices: ["8", "16", "256", "1024"], answer: 2, explain: "8 bits → 2^8 = 256 values (0–255 unsigned)." },
        { q: "In C, an 8-bit unsigned value at 255, plus 1, becomes…", choices: ["256", "0 (it wraps)", "-1", "an error"], answer: 1, explain: "Fixed-width integers wrap on overflow — 255 + 1 wraps to 0, silently." },
        { q: "Why does Python never show integer overflow?", choices: ["It rounds", "Its ints grow arbitrarily large", "It uses the GPU", "It forbids big numbers"], answer: 1, explain: "Python integers are arbitrary-precision; they grow as needed (slower, more memory)." },
      ],
    },
    {
      id: "pointers",
      title: "Pointers: variables that hold addresses",
      sub: "The idea Python hides — and why it's so powerful.",
      keywords: "pointer address reference dereference c ampersand asterisk indirection",
      learn: [
        { type: "text", html: "A <span class='term'>pointer</span> is a variable whose value is the <b>address</b> of another variable. In C you take an address with <code>&</code> and follow a pointer (read what it points to) with <code>*</code>. This <i>indirection</i> is the foundation of arrays, strings, and every linked data structure." },
        { type: "example", lang: "c", caption: "a pointer to an int", code:
"int   x = 42;     // x lives at some address, say 0x1000\nint  *p = &x;     // p holds 0x1000 (the address OF x)\n\n*p = 99;          // follow p and write — now x == 99\n// p  is an address (0x1000)\n// *p is the value at that address (99)" },
        { type: "widget", name: "memoryModel", config: { title: "x and a pointer to it, in memory", columns: [
          { head: "Address → contents", cells: [
            { addr: "0x1000", name: "x (int)", val: "99" },
            { addr: "0x1004", name: "p (int*)", val: "0x1000", kind: "ptr", note: "p doesn't hold 99 — it holds the ADDRESS where 99 lives. Following p (*p) reaches x." },
          ] },
        ] } },
        { type: "list", title: "Why pointers matter", items: [
          "<b>Modify the caller's data</b> — pass an address so a function can change the original (C's 'pass by reference').",
          "<b>Avoid copies</b> — pass a pointer (8 bytes) instead of copying a huge struct.",
          "<b>Build structures</b> — linked lists, trees and graphs are nodes that point to other nodes.",
          "<b>Dynamic memory</b> — <code>malloc</code> hands you a pointer to fresh heap memory.",
        ] },
        { type: "note", variant: "danger", title: "Pointers are sharp", html: "A pointer to the wrong place — uninitialised, already freed (<i>dangling</i>), or null — crashes the program (segfault) or corrupts data. This power-with-danger is why beginner languages like Python hide pointers entirely." },
        { type: "deepdive", title: "Python has 'pointers' too — they're called references", html: "<p>You never write <code>*</code> or <code>&</code> in Python, but every variable is really a <b>reference</b> (an address) to an object on the heap. <code>b = a</code> copies the reference, not the object — so both names point to the same list, and mutating through one is visible through the other. The next lessons make this concrete with <code>id()</code>.</p>" },
      ],
      live: [
        { title: "Python references behave like hidden pointers", code: "a = [1, 2, 3]\nb = a                 # copies the REFERENCE, not the list\nprint(id(a) == id(b)) # True — same object/address\nb.append(99)\nprint(\"a is now:\", a) # a changed too! both names point to one list\n\n# To actually copy the data:\nc = a.copy()\nc.append(0)\nprint(\"a:\", a, \" c:\", c)" },
      ],
      quiz: [
        { q: "In C, if `p = &x`, what is `*p`?", choices: ["The address of x", "The value stored in x", "A copy of p", "Always zero"], answer: 1, explain: "`*p` dereferences — it reads the value at the address p holds, i.e. x's value." },
        { q: "In Python, after `b = a` where a is a list, b.append(9)…", choices: ["Leaves a unchanged", "Also changes a (same object)", "Raises an error", "Copies the list first"], answer: 1, explain: "b and a are references to the same list object, so the change is visible through both." },
      ],
    },
    {
      id: "arrays-strings",
      title: "Arrays & strings in memory",
      sub: "Contiguous bytes, and why C strings end in a hidden zero.",
      keywords: "array contiguous index pointer arithmetic null terminator buffer overflow string c",
      learn: [
        { type: "text", html: "An <span class='term'>array</span> is a block of equal-sized elements laid out <b>contiguously</b> — back-to-back in memory. That's why indexing is instant: <code>arr[i]</code> is just 'start address + i × element size'. The CPU computes one address and reads it." },
        { type: "widget", name: "memoryModel", config: { title: "int arr[4] = {10, 20, 30, 40} — one contiguous block", columns: [
          { head: "Address → element", cells: [
            { addr: "0x2000", name: "arr[0]", val: "10" },
            { addr: "0x2004", name: "arr[1]", val: "20" },
            { addr: "0x2008", name: "arr[2]", val: "30" },
            { addr: "0x200C", name: "arr[3]", val: "40", note: "Each int is 4 bytes, so addresses step by 4. arr[i] = base + i*4." },
          ] },
        ] } },
        { type: "example", lang: "c", caption: "an array name is basically a pointer to its first element", code:
"int arr[4] = {10, 20, 30, 40};\nint *p = arr;       // p points at arr[0]\n// arr[2] is the same as *(p + 2) — 'pointer arithmetic'\n\nchar name[6] = \"Hello\";  // actually 6 bytes: 'H' 'e' 'l' 'l' 'o' '\\0'\n// C strings end with a hidden NUL ('\\0') so code knows where they stop" },
        { type: "note", variant: "danger", title: "No bounds checking → buffer overflow", html: "C does <b>not</b> check that an index is valid. Writing <code>arr[10]</code> on a 4-element array scribbles over whatever bytes follow — a classic crash and the root of countless security exploits. Python lists check bounds and raise <code>IndexError</code> instead." },
        { type: "deepdive", title: "Why this makes NumPy fast (and Python lists slow-ish)", html: "<p>A Python <code>list</code> stores <i>references</i> to objects scattered across the heap, so walking it chases pointers all over memory — cache-unfriendly. A NumPy array (like a C array) packs the raw numbers contiguously, so the CPU streams them through its cache efficiently. Same reason C arrays are fast: <b>memory locality</b>. You'll feel this in Topic 10.</p>" },
      ],
      live: [
        { title: "Python lists are bounds-checked (C arrays are not)", code: "arr = [10, 20, 30, 40]\nprint(arr[2])          # 30\ntry:\n    print(arr[10])     # C would read garbage; Python protects you\nexcept IndexError as e:\n    print(\"IndexError:\", e)" },
      ],
      quiz: [
        { q: "Why is array indexing O(1) (instant)?", choices: ["Arrays are sorted", "Element address = base + index × size, one calculation", "The CPU searches each element", "Arrays are small"], answer: 1, explain: "Contiguous layout means any element's address is a single arithmetic step." },
        { q: "What marks the end of a C string?", choices: ["A space", "A newline", "A NUL byte '\\0'", "The number 255"], answer: 2, explain: "C strings are NUL-terminated: a hidden '\\0' byte signals the end." },
      ],
    },
    {
      id: "stack-heap",
      title: "The stack & the heap",
      sub: "Two regions of memory with very different rules.",
      keywords: "stack heap malloc free function frame stack overflow memory leak dangling recursion",
      learn: [
        { type: "text", html: "A running program's memory has two working regions. The <span class='term'>stack</span> is automatic and fast; the <span class='term'>heap</span> is manual and flexible." },
        { type: "widget", name: "memoryModel", config: { title: "Stack vs Heap", columns: [
          { head: "Stack (automatic)", cells: [
            { name: "main() frame", val: "x = 5", kind: "frame" },
            { name: "f() frame", val: "n = 10", kind: "frame", note: "Each call pushes a frame with its locals; returning pops it. Fast (just move a pointer), but limited in size." },
          ] },
          { head: "Heap (manual)", cells: [
            { addr: "0x9000", name: "malloc(40)", val: "[ … 40 bytes … ]", kind: "ptr", note: "You request memory explicitly and must free() it later. Flexible and large, but you own the cleanup." },
          ] },
        ] } },
        { type: "list", title: "Stack vs heap at a glance", items: [
          "<b>Stack</b>: holds function call frames and local variables. Allocated/freed automatically as functions enter and return. Fast, but small — deep recursion can overflow it.",
          "<b>Heap</b>: for data whose size or lifetime you decide at run time. You <code>malloc</code> it and must <code>free</code> it. Large, but mismanagement causes leaks and dangling pointers.",
        ] },
        { type: "example", lang: "c", caption: "stack local vs heap allocation", code:
"void demo(void) {\n    int local = 5;             // on the STACK — gone when demo() returns\n    int *block = malloc(40);   // 40 bytes on the HEAP\n    block[0] = 7;\n    free(block);               // you MUST return heap memory\n    // forgetting free() = memory leak; using block after free = dangling pointer\n}" },
        { type: "note", variant: "warn", title: "Stack overflow = the recursion limit", html: "Every function call pushes a stack frame. Unbounded recursion keeps pushing until the stack is exhausted — a <i>stack overflow</i>. Python catches this and raises <code>RecursionError</code> (see Topic 05) instead of crashing." },
        { type: "deepdive", title: "Python frees you from free()", html: "<p>Python objects live on the heap, but you never call <code>malloc</code>/<code>free</code>. CPython uses <b>reference counting</b> (each object tracks how many names point to it; at zero it's freed) plus a cycle-collecting garbage collector. Convenient and safe — but the bookkeeping is part of why Python is slower than C.</p>" },
      ],
      live: [
        { title: "Watch Python's automatic memory accounting", code: "import sys\na = [1, 2, 3]\nprint(\"references to the list:\", sys.getrefcount(a) - 1)\nb = a\nprint(\"after b = a:\", sys.getrefcount(a) - 1)\ndel b\nprint(\"after del b:\", sys.getrefcount(a) - 1)\nprint(\"bytes used by the list object:\", sys.getsizeof(a))" },
      ],
      quiz: [
        { q: "Where do a function's local variables normally live?", choices: ["The heap", "The stack", "ROM", "The CPU cache only"], answer: 1, explain: "Locals live in the function's stack frame, freed automatically on return." },
        { q: "In C, forgetting to free() heap memory causes a…", choices: ["Syntax error", "Memory leak", "Faster program", "Stack overflow"], answer: 1, explain: "Unfreed heap allocations accumulate — a memory leak." },
        { q: "Unbounded recursion exhausts which region?", choices: ["The heap", "The stack", "The disk", "ROM"], answer: 1, explain: "Each call adds a stack frame; too many overflow the stack (RecursionError in Python)." },
      ],
    },
    {
      id: "python-memory-model",
      title: "Python's memory model",
      sub: "Everything is an object reference — see it with id().",
      keywords: "reference object id is mutable immutable aliasing interning garbage collection getsizeof",
      learn: [
        { type: "text", html: "Now bring it home. In Python a variable is a <b>name bound to an object</b> on the heap — effectively a managed pointer. <code>id(x)</code> reveals the object's identity (its address in CPython). Knowing this explains a whole class of 'spooky' bugs." },
        { type: "example", caption: "names vs objects", code:
"a = [1, 2, 3]\nb = a          # b points at the SAME list\nc = a.copy()   # c points at a NEW list with the same values\nprint(a is b)  # True  — same object\nprint(a is c)  # False — different object, equal contents\nprint(a == c)  # True  — == compares values, 'is' compares identity",
          annot: [
            { c: "a is b", e: "<code>is</code> asks 'same object/address?' — True, they're aliases." },
            { c: "a == c", e: "<code>==</code> asks 'same value?' — True even though they're different objects." },
          ] },
        { type: "note", variant: "warn", title: "Mutable default trap", html: "Because references are shared, a mutable default argument (<code>def f(x, items=[])</code>) is created <b>once</b> and reused across calls — a famous bug. Use <code>None</code> and create a fresh list inside instead." },
        { type: "deepdive", title: "Small-int and string interning", html: "<p>For speed, CPython pre-creates the small integers <b>−5 to 256</b> once and reuses them, so a freshly built 256 <code>is</code> the cached one, while a freshly built 257 is a separate object. (Writing both as literals on one line can fool you: the compiler folds equal constants into one, so to really see it, build the value at run time with <code>int(\"257\")</code>.) The lesson: never use <code>is</code> to compare <i>values</i> — use <code>==</code>. <code>is</code> is for identity only, typically <code>x is None</code>.</p>" },
      ],
      live: [
        { title: "Identity vs equality — run and inspect", code: "a = [1, 2, 3]\nb = a\nc = list(a)\nprint(\"id(a):\", id(a))\nprint(\"id(b):\", id(b), \"-> a is b:\", a is b)\nprint(\"id(c):\", id(c), \"-> a is c:\", a is c, \" a == c:\", a == c)\n\n# small-int caching: -5..256 are pre-made and reused.\n# (Build them at runtime with int() so the compiler can't fold the literals.)\nsmall = 256\nx = int(\"256\")\nprint(\"256 cached? \", x is small)   # True  — same cached object\nbig = 257\ny = int(\"257\")\nprint(\"257 cached? \", y is big)     # False — 257 is a fresh object\nprint(\"but values equal:\", y == big)" },
        { title: "The mutable-default trap (and the fix)", code: "def buggy(item, bag=[]):      # bag is created ONCE\n    bag.append(item)\n    return bag\nprint(buggy(\"a\"))   # ['a']\nprint(buggy(\"b\"))   # ['a', 'b']  <-- surprise!\n\ndef fixed(item, bag=None):\n    if bag is None:\n        bag = []\n    bag.append(item)\n    return bag\nprint(fixed(\"a\"))   # ['a']\nprint(fixed(\"b\"))   # ['b']  correct" },
      ],
      quiz: [
        { q: "What does `is` compare?", choices: ["Values", "Object identity (same object)", "Types", "Lengths"], answer: 1, explain: "`is` checks identity — whether two names point to the very same object. Use `==` for values." },
        { q: "Why is a mutable default argument dangerous?", choices: ["It's slow", "It's created once and shared across all calls", "It raises an error", "It can't be changed"], answer: 1, explain: "The default object is created a single time at definition and reused, so mutations persist between calls." },
      ],
    },
  ],
});
