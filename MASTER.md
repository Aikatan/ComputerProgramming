# MASTER — Python ComPro, interactive lecture material (rework blueprint)

Single source of truth for the reworked site. For each **topic → subtopic** it states: the **content**, the **animation/interactive** that makes it click, and the **code** (syntax card = shown not run · live = runnable · practice = student task). Design language and motion grammar live in [VISION.md](VISION.md).

**Legend** — 🟢 widget exists · 🔵 new (from VISION) · 🟡 upgrade existing · ✅ built this rework · 📄 syntax card · ▶ live editor · ✎ practice task · ❓ predict-then-reveal beat.

**Build log** — ✅ back-nav → previous topic's last slide (present.js) · ✅ `boxTrain` wired into t06 lists · ✅ `dictTrain` wired into t06 dicts · ✅ t06 text pass: direct/professional wording, no metaphors, keywords (index/element/key/value) repeated · ✅ `rebindViz` wired into t02 variables (name rebinds; type can change) · ✅ `aliasViz` wired into t02 python-memory (two names → one object; is vs ==) · ✅ `searchViz` wired into t09 searching (linear vs binary, step counts compared) · ✅ `bubbleViz` wired into t09 sorting (bars, comparisons, swaps, locked tail) · ✅ t01 architecture set: `cycleFlow` (processing cycle), `powerToggle` (RAM clears / ROM persists), `seekViz` (HDD seek+rotate vs SSD instant, SVG), `levelDrop` (line descends L6→L0) · ✅ `branchViz` wired into t03 if/elif/else (top-down eval, first True runs, rest skip, switchable inputs) · ✅ `callStack` replaced the old text-only recursion widget in t05 (frame cards grow to base case, unwind with return values; removed dead `__recursion__` helper + injection) · ✅ `pseudoMap` wired into t04 pseudocode (line-by-line pseudocode↔Python reveal, indentation preserved) · ✅ `buildPipeline` wired into t10 why-c (source → compile → link → run, artifacts revealed per stage). **All proposed new widgets built (14 across t01–t10).** · ✅ syntax-card pass: audited every topic for definition-only slides with dead space — the widget work already filled almost all of them; the two genuinely bare ones (t02 data-types, t03 booleans) now carry `📄` syntax cards (side-by-side with the definition). · ✅ predict-then-reveal: new reusable `predict` widget (commit a guess → reveal correct/explanation); becomes its own slide immediately before the animation. Wired before boxTrain (t06), aliasViz (t02), searchViz (t09), branchViz (t03). **Every VISION idea now built.** · ✅ wording sweep: removed pre-rule metaphors + UI narration from older prose (t02 "watch/drag", t03 steprun narration, t04 flowExec narration, t05 "machine with named slots"/"boxes"/"the colour shows"). Verified by scanning all lesson data — 0 banned phrases remain. **Rework feature-complete; wording consistent across all topics.** · ✅ boxTrain + dictTrain redesigned to two-column: whole program on the RIGHT (current line marked ▸, so past + upcoming lines are visible), boxes/lockers stepping on the LEFT; returned values now shown as their own persistent variable boxes (`a = nums[1]`, `b = nums.pop()`, `c = person['city']`, `e = person.get(...)`) instead of weak "→ returned" text. Added a predict beat before dictTrain so it gets a full-width slide. · ✅ whole-code audit: added shared `btCodePanel`/`btTwoCol` helpers; `callStack` (t05 recursion, t02 memory) and `rebindViz` (t02 variables) now show the whole program on the right with the current line marked (matching boxTrain). Added predict beats before each so they get full-width slides. Confirmed already-compliant: boxTrain, dictTrain, loopViz, fileFlow, ptrViz. · ✅ `pyToC` widget (Python left / C right, stepped construct-by-construct) wired into t10 control-flow (if/elif/else, while, for) — frames the C topic as "your Python knowledge, in C syntax." Can be extended to t10 types/functions/arrays. (heapViz code panel: skipped per user — not needed.)
**Lesson skeleton (every subtopic):** Hook/❓ → Visual → 📄 Syntax card → ▶ Try-it → ❓Check (quiz).

---

## Course map

| # | Topic | Subtopics | Signature interactive |
|---|---|---|---|
| 00 | Intro to Programming | what-is-programming · thinking-in-steps · first-run | `pipelineDrop` 🔵 |
| 01 | Computer Operation & Architecture | processing-cycle · cpu · memory RAM/ROM · storage HDD/SSD · levels | `cpuCycle` 🟢 · `levelDrop` 🔵 · `seekViz` 🔵 |
| 02 | Basic Python | errors · input/output · variables · values-in-memory · python-memory · data-types · strings-numbers | `binaryConverter` 🟢 · `aliasViz` 🔵 · `boxTrain` 🔵 |
| 03 | Decisions & Loops | booleans · operators · if/elif/else · loops · loop-control | `truthTable` 🟢 · `loopViz` 🟢 · `branchViz` 🔵 |
| 04 | Flowchart & Pseudocode | symbols · flowchart↔code · pseudocode · design-practice | `flowExec` 🟢 · `pseudoMap` 🔵 |
| 05 | Functions & Modules | defining · scope · arguments · recursion · modules | `funcCall` 🟢 · `funcScope` 🟢 · `callStack` 🟡 |
| 06 | Strings, Lists & Dicts | strings · lists · dicts · list-vs-dict · comprehensions | `stringSlice` 🟢 · `boxTrain` 🔵 · `dictTrain` 🔵 |
| 07 | Plots & Exceptions | matplotlib · chart-types · exceptions | live charts 🟢 · `tryFlow` 🟢 |
| 08 | Data Processing | files · csv/json · numpy · pandas | `fileFlow` 🟢 · `arrayOp` 🟢 · `dfFilter` 🟢 |
| 09 | Algorithms & Efficiency | what-is-algorithm · big-o · searching · sorting · data-structures · efficient-python | `bigOViz` 🟢 · `searchViz` 🔵 · `bubbleViz` 🔵 |
| 10 | Programming in C | why-c · types · control-flow · functions · pointers · arrays-strings · memory | `ptrViz` 🟢 · `heapViz` 🟢 · `arrViz` 🟢 |

Reused engines: **boxTrain** also powers arrays / stack / queue; **dictTrain** powers any key→value store; **flowExec/steprun** any control flow; **callStack** any function/recursion.

---

## T00 — Introduction to Programming
> A program is a precise recipe. Turn an idea into ordered steps a machine can follow.

### 00.1 What is programming?
- **Content:** program = ordered instructions; source → translate → run; compiled vs interpreted (Python = interpreted); the idea→code→machine journey.
- **Animation:** `pipelineDrop` 🔵 — an idea bubble ("add two numbers") drops and morphs down a pipe: plain steps → Python code → bytecode → CPU, output lights at the bottom.
- **Code:** 📄 `print("Hello, world!")` as the smallest complete program. ▶ run it.
- **Check:** ❓ compiled vs interpreted; what "syntax" means.

### 00.2 Thinking in steps (computational thinking)
- **Content:** decompose a task; sequence, selection, repetition (preview of 03); be unambiguous. Everyday example (make tea) → numbered steps.
- **Animation:** `stepsAnim` 🔵 — a messy task card breaks into ordered numbered chips; reorder them and the "robot" fails if steps are out of order (shows why order matters).
- **Code:** 📄 pseudo-steps beside the Python that mirrors them.
- **Check:** ❓ reorder the steps to make toast correctly.

### 00.3 Your first file & run
- **Content:** editor vs interpreter; `.py` files; run and read output; the REPL vs a script. (In-browser: Pyodide, no install.)
- **Animation:** reuse `pipelineDrop` focused on "file → interpreter → output".
- **Code:** ▶ editable hello + a deliberate typo to see an error, then fix. ✎ change the message.

---

## T01 — Computer Operation & Architecture
> Know what runs your code: the four jobs, the CPU cycle, memory, storage, and layers of abstraction.

### 01.1 The information-processing cycle
- **Content:** Input → Processing → Storage → Output; hardware (tangible) vs software (intangible); OS mediates.
- **Animation:** `cycleFlow` 🔵 — a data packet flows Input→Process→Store→Output around a loop; click each stage to see example devices; the packet visibly transforms at "Process".
- **Code:** ▶ `platform`/`os` introspection (system, machine, cpu_count).
- **Check:** which is NOT a primary function; OS = system software.

### 01.2 The CPU & instruction cycle
- **Content:** ALU, Control Unit, registers; fetch → decode → execute → store; registers are the fastest storage.
- **Animation:** `cpuCycle` 🟢 (keep) — highlight each stage; 🟡 add a register file lighting up as values load.
- **Code:** ▶ arithmetic the ALU "does for you". 📄 a register-level pseudo-trace.
- **Check:** order the cycle; which part adds/compares.

### 01.3 Memory: RAM vs ROM
- **Content:** primary memory; RAM volatile (DRAM/SRAM), ROM non-volatile (PROM/EPROM/EEPROM); "RAM forgets, ROM remembers."
- **Animation:** `powerToggle` 🔵 — a power switch; flip OFF → RAM cells empty out and fade, ROM cells keep their glyphs. Drives home volatility.
- **Code:** ▶ values that "live in RAM" until the program ends. 📄 link forward to file-handling (t08).
- **Check:** why unsaved work vanishes; modern BIOS = EEPROM.

### 01.4 Storage: HDD vs SSD
- **Content:** secondary storage; HDD = platters + seek + rotational latency; SSD = NAND, no moving parts; orders-of-magnitude gap; when to use which.
- **Animation:** `seekViz` 🔵 — side by side: HDD arm swings to a track + platter spins the sector under it (visible wait + stopwatch) vs SSD cell lights instantly. Same request, different wait.
- **Code:** ▶ relative access-time table (register=1 … HDD=6,000,000).
- **Check:** why SSD faster; cheap bulk archive = HDD.

### 01.5 Levels of a computer system
- **Content:** 7 layers of abstraction (User → High-level → Assembly → OS → Machine/ISA → Control → Digital logic); your Python = Level 5.
- **Animation:** `levelDrop` 🔵 — drop `print("Hi")` at Level 5; it falls through each layer (each lights and shows what it does) until gates flip at Level 0 and an LED spells the output.
- **Code:** 📄 one line annotated with "what each layer does to it."
- **Check:** where Python lives; benefit of abstraction.

---

## T02 — Basic Python
> Read errors calmly, talk to the user, store data, and reason about how values sit in memory.

### 02.1 Errors & debugging
- **Content:** syntax (won't start) · runtime (crash mid-run) · logical (wrong answer); read the traceback bottom-up; common: NameError/TypeError/ValueError/ZeroDivisionError.
- **Animation:** `errorKind` 🔵 — three lanes; a program token runs down each: syntax lane is barricaded at the start, runtime lane explodes mid-way, logical lane finishes but the output is stamped WRONG.
- **Code:** 📄 the four errors + fixes. ▶ trigger then fix a TypeError; a precedence logical bug (`10 + 20/2`).
- **Check:** which happens before running; `"Age:"+25`.

### 02.2 Input & output
- **Content:** `input()` returns str always; `print(sep=, end=)`; f-strings; converting input with `int()/float()`.
- **Animation:** `ioBuild` 🔵 — watch `print("a","b","c", sep=" | ")` assemble the output line piece by piece, sep sliding between items, end appended at the tail.
- **Code:** 📄 sep/end variants with predicted output. ▶ interactive name+age; ✎ compute next-year age.
- **Check:** input() type; effect of `sep`.

### 02.3 Variables & naming
- **Content:** name → value; dynamic typing (a name can re-bind to another type); snake_case, case-sensitive, keywords; multiple assignment.
- **Animation:** `rebindViz` 🔵 — a **name-tag** hops from an int-ball to a str-ball when re-assigned (ball colors change with type); shows the name is a label, not a box.
- **Code:** 📄 `x=5; x="Ten"`. ▶ watch `type(x)` change; ASCII `ord/chr/bin`.
- **Check:** dynamic typing; values per byte.

### 02.4 How values sit in memory
- **Content:** bit/byte/word; byte-addressable; ASCII; two's-complement negatives; fixed width → overflow/wrap; Python big-ints trade speed for no overflow.
- **Animation:** `binaryConverter` 🟢 (keep) + `twosComp` 🔵 — 8 bit-switches; negate = flip all + ripple-carry +1, sign bit turns red; feed 5 + (−5) → 0 through one adder.
- **Code:** ▶ `bin`, two's-complement of −5 as a byte, simulated 8-bit wrap, `2**200`, float inexactness.
- **Check:** values per byte; 255+1 wraps; smaller type = faster (cache).

### 02.5 How Python stores variables (references)
- **Content:** name bound to a heap object; `id`, `is` vs `==`; aliasing; mutable vs immutable; the mutable-default trap; interning (−5..256).
- **Animation:** `aliasViz` 🔵 (high value) — one balloon (list); tags `a` and `b` both tie to it; `b.append` shows through `a`; `c=a.copy()` makes a second balloon. Toggle `is` (same balloon) vs `==` (same contents).
- **Code:** 📄 `a=[..]; b=a; c=a.copy()`. ▶ id() identity vs equality; ✎ fix the mutable-default bug.
- **Check:** what `is` compares; append-through-alias; why mutable default is dangerous.

### 02.6 Built-in data types
- **Content:** numeric (int/float/complex), str, bool, list/tuple/range, dict, set, None; `type()`.
- **Animation:** `typeGallery` 🔵 — a shelf of value-balls colored by type; click one to see literal + mutability tag; immutable ones show a lock.
- **Code:** 📄 one literal per type. ▶ loop printing `type(x).__name__`.
- **Check:** which is immutable; `type(42)`.

### 02.7 Strings & numbers
- **Content:** string = ordered chars, immutable, indexing/slicing; core methods; arithmetic operators & precedence; `math` module, rounding.
- **Animation:** `stringIndex` 🟢 + `stringSlice` 🟢 (keep) + a small `precedence` 🔵 tree that lights `2 + 3 * 4` bottom-up.
- **Code:** 📄 slice table; operators table. ▶ slice/methods; math module. (Deep dive lives in t06.)
- **Check:** `"Python"[-1]`; `17 % 5`; immutability.

---

## T03 — Decisions & Boolean Logic
> Make choices and repeat work: booleans, comparisons, branching, and loops.

### 03.1 Booleans & truthiness
- **Content:** True/False; falsy (0, "", None, empty); truthy everything else; bool is int underneath.
- **Animation:** `truthyMeter` 🔵 — drop any value on a scale that tips True/False; falsy values snap to False with a reason chip.
- **Code:** 📄 falsy list. ▶ `bool()` of edge cases; `int(True)+int(True)`.
- **Check:** which is truthy (a space).

### 03.2 Comparison & logical operators
- **Content:** `== != < > <= >=`; `and/or/not`; short-circuit; `=` vs `==`; chained comparisons.
- **Animation:** `truthTable` 🟢 (keep) — 🟡 add a live "build a condition" row that evaluates as you toggle inputs.
- **Code:** 📄 operator table. ▶ combine conditions; chained `2<=3<=4`.
- **Check:** `True and False`; equality operator.

### 03.3 if / elif / else
- **Content:** first-match wins; indentation defines the block; nesting; the ternary form.
- **Animation:** `branchViz` 🔵 — a token drops through the if/elif/else gates; each condition shows T/F; only the first matching branch lights and runs. (Parallel to `steprun` for real code.)
- **Code:** 📄 grade classifier. ▶ steprun the branch; ✎ change score to hit each branch.
- **Check:** how many branches run; what defines a block.

### 03.4 while & for loops
- **Content:** while = repeat while condition; for = iterate a sequence/range; range(start,stop,step); accumulator pattern; enumerate; nesting.
- **Animation:** `loopViz` 🟢 (keep, ×2) + 🔵 `boxTrain` cameo: a `for` walking a list lights each car in turn (ties loops to collections).
- **Code:** 📄 range table. ▶ steprun real loop; nested "clock"; ✎ sum 5 inputs.
- **Check:** range(0,20,5) output; when for vs while.

### 03.5 break / continue / pass / loop-else
- **Content:** break exits; continue skips to next; pass = placeholder; loop-else runs if no break (search idiom).
- **Animation:** 🟡 extend `loopViz`/`branchViz`: on `continue` the token jumps back to the header arc without reaching the body tail; `break` shoots the token out of the loop.
- **Code:** 📄 continue-skips-evens; loop-else search. ▶ steprun continue; ✎ FizzBuzz-ish.
- **Check:** what continue does; when loop-else runs.

---

## T04 — Flowchart & Pseudocode
> Plan logic visually and in plain language before you code.

### 04.1 Flowchart symbols
- **Content:** terminator, process, decision, I/O, connector, arrows; one meaning per shape.
- **Animation:** `symbolTour` 🟡 (was static `diagram`) — click a shape to see its role + a tiny code snippet it maps to; shapes drawn large (fixes the old tiny-icon issue).
- **Code:** 📄 the simplest flow as code (START→x=1→x+=2→print).
- **Check:** match shape → meaning.

### 04.2 Flowcharts ↔ Python
- **Content:** condition and loop flowcharts map directly to if/while; execution order via arrows.
- **Animation:** `flowExec` 🟢 (keep) — trace a run (x=12) lighting each shape; hover links shape ↔ code line.
- **Code:** 📄 flowchart beside its Python; ▶ steprun the same logic.
- **Check:** which shape = decision; follow the arrows.

### 04.3 Pseudocode
- **Content:** plain-language algorithm, syntax-free; BEGIN/END, INPUT/OUTPUT, IF/WHILE; bridge to Python.
- **Animation:** `pseudoMap` 🔵 — two columns; click a pseudocode line and its Python translation lights (and vice-versa); build a small algorithm line-by-line.
- **Code:** 📄 pseudocode ↔ Python side by side.
- **Check:** translate a pseudocode block.

### 04.4 Design-then-implement practice
- **Content:** given a problem, draw the flow / write pseudocode, then code it.
- **Animation:** reuse `flowExec`/`pseudoMap` on the practice items.
- **Code:** ✎ 2–3 problems easy→hard with starter code.

---

## T05 — Functions & Modules
> Package logic, control scope, pass arguments, recurse, and reuse via modules.

### 05.1 Defining & calling functions
- **Content:** `def`, parameters, `return`, why functions (reuse, naming, testing); call flow.
- **Animation:** `funcCall` 🟢 + `funcNested` 🟢 (keep) — arguments fly in as balls, result flies out; nested calls resolve inner-first.
- **Code:** 📄 def/return. ▶ call variations; ✎ write `area(w,h)`.
- **Check:** what return does; why functions help.

### 05.2 Scope: local vs global
- **Content:** local vs global names; a function can't see another's locals; `global` (and why to avoid); shadowing.
- **Animation:** `funcScope` 🟢 (keep) — two memory regions; locals appear on call and vanish on return; a global stays.
- **Code:** 📄 shadowing example. ▶ demonstrate scope; ✎ predict the output.
- **Check:** where locals live; scope of a name.

### 05.3 Arguments: positional, keyword, default, *args, **kwargs
- **Content:** positional vs keyword; defaults; variadic `*args`/`**kwargs`; argument order rules.
- **Animation:** `funcArgs` 🟢 (keep) — balls route into named slots; extra positionals bundle into an *args box; extra named into a **kwargs locker.
- **Code:** 📄 each form. ▶ mix forms; ✎ build a flexible function.
- **Check:** positional vs keyword; what *args collects.

### 05.4 Recursion
- **Content:** a function calling itself; base case + recursive case; the call stack grows then unwinds; stack overflow = RecursionError.
- **Animation:** `callStack` 🟡 (upgrade current recursion widget) — frames **stack upward** on each call (factorial(3)→(2)→(1)→(0)), then **unwind** multiplying back up; each frame a card that pops with its return value.
- **Code:** 📄 factorial. ▶ steprun into each call; ✎ sum-to-n recursively.
- **Check:** what a base case prevents; stack growth.

### 05.5 Modules & pip
- **Content:** import your own/std-lib modules; `from x import y`; `__name__`; pip for third-party; virtual envs (concept).
- **Animation:** `importResolve` 🔵 — an `import` request travels to find the module (your file → stdlib → installed packages), the found module's names drop into your namespace.
- **Code:** 📄 import forms. ▶ use `math`/`random`; ✎ split code into a module.
- **Check:** what import does; where pip packages come from.

---

## T06 — Strings, Lists & Dictionaries
> The everyday containers, taught with trains and lockers.

### 06.1 Strings in depth
- **Content:** create (quotes), index (+/−), slice (start:end:step), methods, f-strings, immutability, a Caesar-cipher capstone.
- **Animation:** `stringIndex` 🟢 + `stringSlice` 🟢 (keep) + `stringShift` 🟢 for Caesar.
- **Code:** 📄 slice/method tables (as deflists). ▶ method tour; ✎ build Caesar cipher.
- **Check:** `[-2]`, `[::-1]`, `[2:5]`, immutability, Caesar wrap.

### 06.2 Lists — the box train
- **Content:** ordered, mutable; index/slice; append/insert/extend/remove/pop/clear; aggregate (sum/min/max/len); iterate.
- **Animation:** `boxTrain` 🔵 (headline) — cars with value balls; append couples a new car, insert opens a gap, pop rolls a car off; tap a car → `list[i]` lifts. Practice mode: type contents + op buttons.
- **Code:** 📄 op deflist. ▶ grades example; ✎ mutate a list to a target (widget-checked).
- **Check:** append vs extend; ordered+mutable.

### 06.3 Dictionaries — the locker wall
- **Content:** key→value, unique immutable keys, fast lookup (hashing); get/`[]`, update, delete; iterate keys/values/items; word-count pattern.
- **Animation:** `dictTrain` 🔵 — labeled lockers; set flashes the swapped ball; `get(missing)` ghosts a locker + returns default; lookup shown **instant** (jump to locker).
- **Code:** 📄 access deflist. ▶ word-frequency counter; ✎ build a counter.
- **Check:** safe read; why lookup is fast.

### 06.4 Lists vs dictionaries
- **Content:** position vs label; when to use which; duplicates; lookup cost.
- **Animation:** `lookupRace` 🔵 — same data as list vs dict; find an item: the list **walks** cell by cell, the dict **jumps** straight to the locker. Speed difference is the lesson.
- **Code:** 📄 same data, two shapes. ✎ pick the right container for a scenario.
- **Check:** look-up by name → dict.

### 06.5 Comprehensions (new)
- **Content:** list/dict comprehensions as concise build-loops; filter + transform; readability limits.
- **Animation:** 🟡 `boxTrain` build mode — a comprehension fills the train car-by-car as the loop runs, filtered items skipped (ghosted).
- **Code:** 📄 `[n*n for n in range(5)]` beside the equivalent loop. ▶ filter evens; ✎ rewrite a loop as a comprehension.
- **Check:** map a comprehension to its loop.

---

## T07 — Data Visualization & Exceptions
> Turn numbers into charts, and write programs that survive bad input.

### 07.1 Matplotlib basics
- **Content:** `import matplotlib.pyplot as plt`; plot(x,y); title/labels/legend/grid; `show()`.
- **Animation:** the live chart itself (renders in-browser via Pyodide) is the visual; 🔵 optional `plotBuild` overlay narrating plot→title→labels→show as beats.
- **Code:** 📄 basic line plot. ▶ customized live chart; ✎ plot your data.
- **Check:** alias `plt`; which call renders.

### 07.2 Bar, scatter & histogram
- **Content:** choose the chart for the data; bar (categories), scatter (relationship), hist (distribution); savefig.
- **Animation:** `chartPicker` 🔵 — pick data shape → the right chart type highlights and renders.
- **Code:** 📄 chart-call deflist. ▶ bar + histogram; ✎ chart given data.
- **Check:** distribution → histogram.

### 07.3 Exception handling
- **Content:** try/except/else/finally; specific vs broad; raise; assert; control flow of an error.
- **Animation:** `tryFlow` 🟢 (keep) — pick an input; error jumps to the matching except; finally always runs.
- **Code:** 📄 full shape (deflist). ▶ safe division; raise+else; ✎ validate input.
- **Check:** which block always runs; when else runs.

---

## T08 — Data Processing
> Persist data (files), compute fast (NumPy), analyse cleanly (pandas).

### 08.1 File handling
- **Content:** open modes (r/w/a/x, b/t); `with` auto-closes; read/readline/readlines; write/writelines; os module.
- **Animation:** `fileFlow` 🟢 (keep) — open→write→close→reopen→read→close, dot flips open/closed, content grows.
- **Code:** 📄 modes deflist. ▶ write/read; append vs write; ✎ write 1..10 then sum.
- **Check:** what 'w' does; why `with`.

### 08.2 CSV & JSON
- **Content:** csv writer/reader; json dump/load; serialize/deserialize; table↔text.
- **Animation:** `csvFlow` 🟢 (keep) — table → comma-joined lines (write) → split back to rows (read).
- **Code:** 📄 two-modules deflist. ▶ JSON round-trip; CSV; DictReader.
- **Check:** which serializes a dict.

### 08.3 NumPy arrays
- **Content:** ndarray; element-wise math; broadcasting; shape/dtype; slicing; why contiguous = fast.
- **Animation:** `arrayOp` 🟢 (keep) — element-wise fills result cell-by-cell; broadcast spreads a scalar. 🔵 optional `contiguousViz` showing packed vs scattered memory.
- **Code:** 📄 attributes deflist. ▶ 2-D shape/row-sums; ✎ identity via loop.
- **Check:** element-wise multiply; why NumPy is fast.

### 08.4 Pandas DataFrames
- **Content:** Series & DataFrame; build/inspect; boolean filter; sort; select loc/iloc; groupby.
- **Animation:** `dfFilter` 🟢 (keep) — rows tested keep/drop on a condition; sort reorders + highlights column.
- **Code:** 📄 everyday-pandas deflist. ▶ sort+average; groupby.
- **Check:** DataFrame = table; groupby mean.

---

## T09 — Algorithms & Efficiency
> Think in algorithms and cost, not just code.

### 09.1 What is an algorithm?
- **Content:** finite ordered steps; correctness + termination; same problem, many algorithms.
- **Animation:** `stepsAnim` 🔵 (shared with 00.2) — steps chips; a robot follows them; wrong order = wrong result.
- **Code:** 📄 a tiny algorithm as steps → code.
- **Check:** what makes steps an algorithm.

### 09.2 Big-O notation
- **Content:** growth rate, drop constants/low-order; classes O(1)…O(2ⁿ); shape dominates at scale.
- **Animation:** `bigOViz` 🟢 (keep) — bars for each class pull apart as n doubles, live op counts. 🟡 add an optional "race track" curve view.
- **Code:** 📄 simplify examples. ▶ plot growth curves.
- **Check:** best for large n; simplify O(3n+100).

### 09.3 Searching: linear vs binary
- **Content:** linear O(n) checks each; binary O(log n) halves a sorted list; binary needs sorted data.
- **Animation:** `searchViz` 🔵 — two rows race; linear sweeps, binary brackets lo/hi and collapses half each step; steps counter "7 vs 3".
- **Code:** 📄 both functions. ▶ steprun binary; race on 1,000,000.
- **Check:** ~20 steps for 1e6; binary needs sorted.

### 09.4 Sorting: bubble → Timsort
- **Content:** bubble sort O(n²) swaps neighbours; count comparisons; real code uses `sorted()`/Timsort O(n log n).
- **Animation:** `bubbleViz` 🔵 — bars swap in arcs, biggest bubbles to the end and locks; comparisons tally.
- **Code:** 📄 `sorted()` with key/reverse. ▶ steprun bubble; count comparisons by size.
- **Check:** bubble complexity; use `sorted()` in practice.

### 09.5 Choosing a data structure
- **Content:** list vs dict vs set vs tuple vs stack/queue; access patterns → structure; cost table.
- **Animation:** reuse `boxTrain`/`dictTrain`/`lookupRace` to contrast access; a stack (push/pop top) and queue (enqueue/dequeue) demo.
- **Code:** 📄 structure→use-case deflist. ✎ pick a structure per scenario.
- **Check:** name-lookup → dict; LIFO → stack.

### 09.6 Writing efficient Python
- **Content:** avoid needless O(n²); use built-ins/comprehensions; sets for membership; generators; measure before optimizing.
- **Animation:** `lookupRace` 🔵 (list `in` vs set `in`) — the membership test walks a list but jumps a set.
- **Code:** 📄 before/after snippets. ▶ time list vs set membership; ✎ speed up a slow snippet.
- **Check:** why set membership is fast.

---

## T10 — Programming in C (for Python programmers)
> Drop a level: declared types, pointers, arrays, and manual memory.

### 10.1 Why C, and how a C program runs
- **Content:** compiled vs interpreted; speed/control vs safety; edit→compile→link→run; `main`, `#include`, `printf`.
- **Animation:** `buildPipeline` 🔵 — source → compiler → object → linker → executable → run; each stage a station the file passes through.
- **Code:** 📄 hello.c; the compile/run commands (shown).
- **Check:** compiled vs interpreted; role of the linker.

### 10.2 Variables & types in C
- **Content:** static typing; you must declare; int/float/char/double; sizes; format specifiers; overflow is real.
- **Animation:** `typeBoxes` 🔵 — each type is a fixed-width box (1/4/8 bytes) a value must fit; overflow spills red.
- **Code:** 📄 declarations + printf specifiers (avoid printf in *examples* per project rule elsewhere; here it's the C topic so show minimal I/O). ✎ Python↔C type table.
- **Check:** why declare types; a type's byte size.

### 10.3 Control flow in C
- **Content:** if/else, switch, while/for; braces + semicolons vs Python indentation.
- **Animation:** `flowExec` 🟢 reuse — trace a C `if`/loop; side-by-side C vs Python syntax card.
- **Code:** 📄 same logic in C and Python. ✎ translate a Python branch to C.
- **Check:** what defines a block in C.

### 10.4 Functions in C
- **Content:** declare return type + params; prototypes; pass-by-value (copies).
- **Animation:** `callStack` 🟡 reuse — frames with typed slots; a copy of the argument enters (motivates pointers next).
- **Code:** 📄 a typed function. ✎ write `int max(int,int)`.
- **Check:** pass-by-value means what.

### 10.5 Pointers
- **Content:** a pointer holds an address; `&x`, `*p` (dereference); pass-by-reference via addresses; NULL/dangling danger.
- **Animation:** `ptrViz` 🟢 (keep) — p holds x's address (arrow); `*p` follows it to read/write; x updates through the pointer.
- **Code:** 📄 pointer basics; pass-&n to mutate. ✎ swap two ints via pointers.
- **Check:** what `*p` gives; why pass `&n`.

### 10.6 Arrays & strings
- **Content:** contiguous fixed-size; `arr[i]` = base + i*size (O(1)); array name ≈ pointer; C strings = char arrays + '\0'; no bounds checking → overflow.
- **Animation:** `arrViz` 🟢 (keep) — cells with addresses; string mode flags the hidden '\0'.
- **Code:** 📄 array + C string. ✎ compare to Python's checked, growable list.
- **Check:** why O(1); the string terminator; overflow risk.

### 10.7 Memory: stack & heap
- **Content:** stack (auto frames) vs heap (malloc/free); leaks, dangling, stack overflow; Python's GC does this for you.
- **Animation:** `heapViz` 🟢 (keep) — frames push/pop; heap block malloc'd then freed (dangling after).
- **Code:** 📄 malloc/free. ✎ contrast with Python auto-management.
- **Check:** where locals live; forgetting free = leak.

---

## Cross-cutting improvements (apply everywhere)
- **Back-nav across topics → previous topic's LAST slide** (finish the thought).
- **Predict-then-reveal** beat before big animations (commit before seeing).
- **Syntax cards** on every definition-only slide (shown, not run) to fill dead space with real structure.
- **Per-topic sandbox** (unlocked widget) + **✎ your-turn checks** the widget can verify.
- **Dual mode**: lecture (presenter beats, ask-the-room markers) vs practice (editable, self-check).
- **Consistent controls & motion grammar** (see VISION.md); 24/28/32 type scale, 24px floor.
- **Examples graded easy → hard** in every subtopic.

## New/added since the reference site
- t00.2 thinking-in-steps; t06.5 comprehensions; t09.6 efficient-python kept & sharpened; predict-then-reveal; sandbox; syntax cards; dual-mode; boxTrain/dictTrain/aliasViz/searchViz/bubbleViz/levelDrop/seekViz/cycleFlow/powerToggle/twosComp/pseudoMap/importResolve/lookupRace/callStack/buildPipeline (new widgets).
