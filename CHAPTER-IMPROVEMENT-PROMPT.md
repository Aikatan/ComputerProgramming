# Chapter Improvement Prompt: Python ComPro Learn

Paste this file to Claude Code and add one line:
**"Improve chapter tXX using CHAPTER-IMPROVEMENT-PROMPT.md. Plan first, then edit and verify."**

## Context

- **The course:** 010711301 Computer Programming (Bachelor of Engineering, first year).
- **The site** (`python-compro-learn/`) is a static HTML/CSS/JS site with CodeMirror and Pyodide.
- **It replaces PowerPoint in lectures** (slide mode). Students also read it later on their own (slide mode or scroll view).

Where things live:
- Content: `js/content/topicNN.js`
- Rendering: `js/lesson.js` (blocks, scroll view), `js/present.js` (slides)
- Widgets: `js/widgets.js`
- Runner: `js/runner.js`
- Styles: `css/styles.css`
- Lecture decks and exam papers: the parent folder

**Reference chapter:** `js/content/topic02.js` already follows this prompt. Copy its patterns.

**Quality bar:** the chapter is clear, linear, concise, formal, easy to follow, technically correct, and focused on fundamental programming and engineering problem-solving.

---

## 1. Chapter structure

### Continuity (the most important rule)
**Explain one topic completely before the next. Never alternate between related topics (no A → B → A).**

- One lesson teaches one subject. A lesson that mixes two subjects is split into two complete lessons.
- Every major topic follows: **Overview → General principle → Subtopic → Explanation → Example → Completion → Next subtopic → … → Summary**.
- Students always know which topic is being explained, how it fits the chapter, when it is complete, and why the next topic follows. Each summary ends with a "Next lesson" note that gives the reason.

Example (file handling). Wrong: CSV read → JSON load → CSV write → JSON save → text read. Right:
```
File handling overview
→ Text files: open, read, process, close, examples
→ CSV files: what CSV is, read, process, write, examples
→ JSON files: what JSON is, load, access data, save, examples
```

### Order and scope
- Go from simple to more difficult. **Prerequisites come first:** nothing is used before it is explained, in this chapter or an earlier one.
  - Example: t02 teaches errors *last*, because its error examples need variables, conversion, division, and strings.
- Do not repeat an explanation. Do not return to an earlier topic unless the current concept needs it; then refer to it in one line.
- **Do not re-teach an earlier chapter.** Refer to it and build on it.
  - Example: t06 strings starts from t02's indexing and slicing.
- Remove content that is not needed for the main programming principle. Keep the amount suitable for a first-year course.
- Keep material that is already clear, correct, and well placed. Do not rewrite only for style.

### Lesson template (one purpose per slide)
1. **Overview**: one or two sentences about the subject, then the subtopics as an ordered list.
2. **For each subtopic, in order:**
   - **Concept** slide(s): the principle, the rule, the algorithm, or a diagram. When a statement is introduced, add a 1–3 line syntax card.
   - **Problem** slide, when the subtopic solves a task: the given values, required output, processing, and algorithm.
   - **First example:** a `codeTrace` slide, then a `traceTable` slide (§4).
   - **Further examples:** one per slide, each harder than the one before.
3. **Summary**: the rules of the lesson and a "Next lesson" note.
4. **Exercises**: 4–6, graded easy → hard, of different types (§5).
5. **Check**: one slide with 2 multiple-choice questions about this lesson only.

The chapter ends with a **practice lesson**:
- an overview of the problem-solving steps
- for each problem, a Problem slide (input / output / processing), then a `practiceq` slide
- a chapter summary

## 2. Language

- **Style:** use simple, direct, formal language. State the concept directly. Explain technical ideas without unnecessary academic wording.
- **Avoid:**
  - conversational expressions
  - rhetorical or unnecessary questions ("What do you think happens next?", "Have you ever wondered…?")
  - introductory filler ("In this topic, you will learn…", "Let's explore…", "Now let's take a look…")
  - metaphors and analogies, unless one is essential (the lecturer adds them in class)
  - the em-dash `—` (use a colon, a period, a new line, or a list)
  - UI narration ("press Play", "watch it change"); state the point instead
- **Keywords:** use one term for one idea throughout (variable, value, index, element, statement, output, …).
- **Self-study:** each slide is understandable without the lecturer. Concept slides use 2–6 short, complete sentences or list items, never a paragraph. Annotations and table cells may use short phrases.

> Prefer: `A variable stores a value that can be used or changed later in the program.`
> Avoid: `Have you ever wondered how Python remembers information? In this topic, you will learn about variables.`

## 3. Teaching and code

### Teaching approach
- Teach the programming principle, not only the syntax. Students must understand **why** the code works.
- When appropriate, follow: **Problem → Logic → Algorithm → Code → Execution → Result**.
- Engineering problem-solving is taught in full in t02 Lesson 6 and applied from then on:
  1. identify the input
  2. identify the required output
  3. determine the processing
  4. determine conditions or repetitions
  5. write the algorithm
  6. convert it to Python
  7. verify with a hand calculation

### Python level
- **Use basic statements:** variables, arithmetic, comparisons, `if`/`elif`/`else`, `for`, `while`, `input()`, `print()`.
- **Other functions and methods** only when necessary and no basic alternative is reasonable.
- **Nothing before it is taught:**

| Chapter | Not yet allowed |
|---|---|
| t00–t02 | `if`, loops, lists, dicts, `def`, `try` |
| t03 | lists, dicts, `def`, `try` (`range()` is allowed in `for`) |
| t04 | lists, dicts, `def`, `try` |
| t05 | lists, dicts, `try` (`*args` and `**kwargs` appear only with a `for` loop) |
| t06 | `try`, files (aliasing and mutable defaults are taught here) |
| t07+ | normal use of earlier material |

### Code style
- **Output (Python): no f-strings.** Use `print("Voltage =", voltage, "V")` or `print("Voltage = " + str(voltage) + " V")`. For decimals, use `round(x, 2)`.
- **Output (C, t10):** `printf` is allowed. Frame t10 as "your Python knowledge → C syntax" (`pyToC`).
- Readable, explicit code over short or clever code. Use descriptive `snake_case` names.
- **Examples:**
  - short and easy to trace by hand
  - graded easy → hard, with different data each time
  - not too many new concepts in one first example
- **Context:** simple engineering data (voltage, current, power, temperature, sensor values, battery level, distance, speed, thresholds). The context must never make the programming harder.
- **`input()`:** every example that uses it sets `inputs:[...]`, so it runs without pop-ups. Exercises may leave it out, so that students type the values.

## 4. Slides

### Concept slides and code slides
- **Concept slides:** principle, logic, algorithm, flow, rule, diagram, a small table, or a 1–3 line syntax card.
- **Code slides:** code, execution, variable values, output, and short notes on the important lines.
- **Never** combine a large code block with a large amount of explanation.

### First example of a new concept
It is explained line by line on two slides:
1. **`codeTrace`** shows which line executes (`▸`), what it does (the note), the current variable values and what changed, the output, and what happens next.
2. **`traceTable`** shows the same trace as a static table, followed by a result check ("12 × 2 = 24").

Later examples use a runnable `example` with 2–3 short `annot` notes.

### Animation and visibility
- **Animation** only explains execution: the current line, changing values, a condition's result and the chosen branch, loop iterations, accumulated values. It is never decoration.
- **Every animation has a static equivalent.** A `codeTrace` is always followed by its `traceTable`.
- **Nothing is hidden:**
  - Not allowed: show-more, accordions or `deepdive`, `tabs`, hidden code, hover-only content, and guess-before-teaching beats (`predict`).
  - Allowed: normal slide navigation, and feedback after an exercise attempt (the quiz explanation, the Check result, a hint after a wrong answer).

### Type and layout
| Size | Used for |
|---|---|
| **24px** | all normal content: text, lists, tables, notes, code, output, buttons, widget text, the kicker |
| **40px** | titles only: the slide title and the cover title |

- **No other sizes.** Never shrink text to fit: split the slide.
- **No small-text markup:** no `<sup>`, `<sub>`, `<small>`, or inline `font-size` in content. Write `2⁸`, `m²` with Unicode.
- **Readability:** high contrast (4.5:1 or more in both themes), clear spacing, clear hierarchy.
- **Zoom:** it must work: no horizontal page scroll at any width.
- **Fit:** every slide fits without vertical scrolling at **1280×720, 1536×864 and 1920×1080**. Limits that fit, from t02 and t03:

| Slide | Limit |
|---|---|
| Concept | 5 list items or fewer, or one table of 6 rows or fewer plus 2 short lines |
| `example` + `annot` | 7 lines or fewer, 40 characters or fewer per line, 3 short notes or fewer. A longer program (8–9 lines) goes on its own slide as one line of text plus a `livecode`. |
| `codeTrace` | 7 lines or fewer, 40 characters or fewer per line, 4 variables or fewer, 4 output lines or fewer. Loop traces: one-line notes (80 characters or fewer). |
| `traceTable` | 6 rows with two-line notes, or 7 rows with one-line notes. Split longer traces (loops) into parts with `rows:[a,b]`, titled "Trace table (part 1 of 2)". |
| `practiceq` | prompt of about 40 words or fewer, starter of 6 lines or fewer, target of 3 lines or fewer |
| Exercise with `cols` | 4 task lines or fewer on the left, 6 code lines or fewer on the right |
| Summary | 5 items or fewer, or a table of 4 rows or fewer |
| Check | 2 questions, short options, one-sentence explanations |
| `flowchart` | 6 rows or fewer, with 2 decisions or fewer. A chart wider than about 550px gets its own slide (not a half column). A traced chart places its panel beside it. |

## 5. Exercises

| Type | Build |
|---|---|
| Trace the code | `cols`: task + `traceTable` (`blank:true, given:1`) on the left; the program as `livecode` on the right (checked with Step Run). If the table has more than 5 columns, use two slides: "Trace the code" (task + full-width table), then "Check your trace" (the program). |
| Determine the output | `cols`: task on the left; `livecode` on the right (paper first, then Run) |
| Complete missing code | `practiceq` with a gap in the starter |
| Modify existing code | `practiceq` with working code and a new target |
| Correct an error | `practiceq` with broken code |
| Write a short program | `practiceq` with `# Write your program here` |
| Design an algorithm | `practiceq` whose starter asks for `# Input / # Output / # Processing / # Algorithm` comments first |

- **Mix:** each lesson uses several of these types. Multiple choice appears only in the final Check.
- **Targets:** a `practiceq` target includes the echoed input lines (for example `Age: 19`).

## 6. Technical reference

### Lesson format
```js
(function () {   // wrap the file: top-level consts must not leak between script files
  const T_power = { code: [...], steps: [...] };           // trace: defined once, used twice
  App.registerTopic({ id: "t02", title, short, blurb, intro, lessons: [
    { id: "variables", title: "Variables", sub: "…", keywords: "…", slides: "02:18–22",
      deck: [
        { kind: "overview", title: "Variables", blocks: [ … ] },
        { kind: "concept", part: "Assignment", title: "Assignment stores a value", blocks: [ … ] },
        { kind: "code", part: "Assignment", title: "First example: execution step by step",
          blocks: [ { type: "widget", name: "codeTrace", config: T_power } ] },
        { kind: "trace", part: "Assignment", title: "Trace table and result check",
          blocks: [ { type: "widget", name: "traceTable", config: { trace: T_power } } ] },
        { kind: "exercise", title: "Determine the output", cols: [[ …left ], [ …right ]] },
        { kind: "check", title: "Check", blocks: [ { type: "quiz", items: [q1, q2] } ] },
      ] },
  ] });
})();
```
- **`kind`:** overview, concept, problem, code, visual, trace, summary, exercise, or check. It sets the kicker label; exercises are numbered automatically.
- **`part`:** the subtopic name. It appears in the kicker, the bottom bar, the outline, and the scroll view.
- **Layout:** `blocks` stack; `cols` makes two columns, which stack below 900px.
- **Cover slide:** added automatically, with the chapter map.
- **Lesson ids:** keep existing ids when the subject is the same, because student progress is stored by id.
- **Older chapters:** unconverted chapters use `learn/live/quiz` with automatic slide splitting. Convert each one to `deck` when it is improved.

### Blocks
- `text`
- `note` (`title`, `variant`)
- `list` (`title`, `ordered`)
- `table` (`head`, `rows`, `caption`, `cls:"center"`). Mark valid/invalid with `<span class='t-yes'>…</span>` and `<span class='t-no'>…</span>`.
- `code`: read-only (`code`, `output`, `caption`, `lang:"text"`)
- `example`: runnable (`annot:[{c,e}]`, `inputs`)
- `livecode` (`title`, `inputs`)
- `practiceq` (`prompt`, `expected`, `starter`, `inputs`, `hint`)
- `quiz` (`items`); question text accepts `` `code` ``
- `widget` (`name`, `config`)

### Trace object
```js
{ code: ["voltage = 12", "current = 2", "power = voltage * current", 'print("Power =", power, "W")'],
  steps: [
    { line: -1, note: "No variable exists yet." },                 // start; not a table row
    { line: 0, note: "12 is stored in <code>voltage</code>.", set: { voltage: "12" } },
    { line: 2, note: "12 * 2 → 24. 24 is stored in <code>power</code>.", set: { power: "24" } },
    { line: 3, note: "The result is displayed.", print: "Power = 24 W" } ] }
```
- **`line`:** counts from 0.
- **`set`:** lists only the changes, as Python literals (`"12"`, `"12.0"`, `"'ohm'"`, `"True"`). Use `{v:"10", t:"float"}` to force a type.
- **`print`:** includes echoed input lines.
- **`unset`:** a list of variables that disappear. Use it when a function returns, so that its locals are removed. Name locals `"v (power)"`, meaning v inside power.
- **`traceTable` options:** `blank:true`, `given:n`, `rows:[a,b]`.
- **Keyboard:** on slides, → / Space step the trace before the deck moves on.

### Widgets (reuse before building new ones)
- **Every chapter:** `codeTrace`, `traceTable`
- **By topic:**
  - `binaryConverter`, `stringIndex`, `stringSlice`, `rebindViz`, `memoryModel` (t02)
  - `truthTable`, `branchViz`, `loopViz` (t03)
  - `flowchart` (t04): static, with a `code` panel, or traced with `trace`. `flowExec` and `pseudoMap` are no longer used; mappings are shown as tables.
  - `callStack` (t05): recursion. Function calls use `codeTrace` with local names and `unset`. `funcCall` / `funcNested` / `funcArgs` / `funcScope` are no longer used.
  - `boxTrain`, `dictTrain`, `stringShift` (t06)
  - `tryFlow` (t07)
  - `fileFlow`, `csvFlow`, `jsonFlow`, `arrayOp`, `dfFilter` (t08)
  - `searchViz`, `bubbleViz`, `bigOViz` (t09)
  - `pyToC`, `buildPipeline`, `ptrViz`, `heapViz`, `arrViz` (t10)
  - `cpuCycle`, `cycleFlow`, `powerToggle`, `seekViz`, `levelDrop` (t01)
- **Values shown as balls** use the shared colours: int blue, float teal, str amber, bool purple, None grey (`bt-int` … `bt-none`).
- **New widgets:** follow the same visual language. A new stepping widget also needs a static equivalent.

### Flowchart object (the `flowchart` widget)
```js
{ cols: [0, 300],                      // x offsets of the columns (default [0])
  nodes: [{ id, type, text, col, row }], // type: terminator | process | io | decision | predefined | connector
  edges: [{ from, to, port, lane, laneIndex, label }],
  code: [...], map: { nodeId: [line indices] },          // optional code panel
  trace: [{ node, note, set, print }] }                  // optional step-by-step mode
```
- **Drawing:** the chart is drawn at 1:1 scale, so its text is exactly 24px. Shapes are sized from their text.
- **Arrows:**
  - `port: "left"` / `"right"` leaves a decision sideways.
  - A target on the same row is entered from the side.
  - `lane: "left"` / `"right"` routes around the chart: loop-backs and exits.
  - Leave at least about 110px between the diamond and a same-row target, so the True/False label fits.
- **Trace table:** `traceTable` takes `{ flow: F }` and shows a Shape column.
- **On phones:** charts scroll inside their own box.

### Other rules
- **Injected content:** the `zz-*.js` files add examples and quizzes to unconverted lessons and skip `deck` lessons. When a chapter is converted, delete its entries there.
- **Content strings:** write code as single-quoted JS strings when it contains double quotes. `\n` separates lines; `\\n` is a Python escape inside the code. Escape `<` in HTML (`&lt;class 'float'&gt;`).

## 7. Workflow

### Plan (before editing)
1. Read `js/content/topicNN.js` and list its lessons and subtopics.
2. Check the matching lecture deck (`../Computer Programming NN.pptx`; each lesson's `slides` field names the deck and slide numbers), the syllabus, and the exam papers (`../*Midterm*`, `../*Final*`).
   - Content that is lectured or examined stays; simplify it rather than cut it.
3. Find the problems: interleaving, duplication, wrong order, forward use, advanced syntax, style, hidden content, text sizes.
4. Write the new outline: lessons → subtopics → slide list.
5. Ask the lecturer only about real choices, for example moving a topic away from the lecture-deck order.

### Build
- Edit the topic file. Change widgets, CSS, or the renderers only when needed.
- Remove the chapter's `zz-*.js` entries.
- **Bump `?v=N` in `index.html`** for every changed file.

### Verify in the browser preview (`.claude/launch.json` → "compro-static")
1. **Hidden pane:** a hidden preview pane pauses animation frames, so editors are not created. Run `window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16)` in the page before measuring.
2. **Slide audit.** At 1280×720, 1536×864, and 1920×1080, walk every slide (`App._deckNav.next()`, ~120 ms each) and check:
   - no "Unknown block/widget"
   - every element with its own text is exactly 24px or 40px
   - no horizontal scroll
   - the slide plus the bottom bar fits the height

   At tablet and phone width, check only for horizontal scroll.
3. **Examples:** run every `example` and `livecode` with `App.py.run(code, {inputs, sink})`. The output must match the notes.
4. **Exercises:** run a reference solution for every `practiceq`. Its output must equal `expected` (trailing spaces and blank edge lines ignored).
5. **Traces:** step each `codeTrace` with its buttons and the arrow keys, and compare it with its table.
6. **Scroll view:** every slide appears as a section.
7. **Console and theme:** no console errors; light-theme contrast is sufficient.
8. **Grep the topic file** for `f"`, `f'`, `—`, `<sup>`, `predict`, `deepdive`, `tabs`, and syntax not yet taught.

### Correctness
- **Real outputs:** every output quoted anywhere comes from a real run (floats included, for example `0.30000000000000004`).
- **Error messages** are copied from a real run. The runner shows only the student's program:
  ```
  Traceback (most recent call last):
    File "<program>", line 4, in <module>
      resistance = voltage / current
                   ~~~~~~~~^~~~~~~~~
  ZeroDivisionError: division by zero
  ```

### Commit
Commit per chapter with a clear message. Push to `main` only when asked, because it publishes to GitHub Pages.

## 8. Known issues in unconverted chapters (verify and fix when you reach them)
- **t06, t09:** use `tabs`. Convert them to visible slides.
- **t06:** "Strings in depth" repeats t02 (creating, indexing, slicing, immutability) and teaches f-strings. Keep only what is new, without f-strings.
- **Older widgets:** some use fixed pixel widths that were sized for smaller text. Check them for overflow at 24px.

## 9. Review checklist (before finishing)
1. The sequence was reviewed, and each lesson teaches one subject.
2. Duplicated and unnecessary content is removed, including repeats of earlier chapters.
3. No related subtopics are mixed together.
4. Every topic starts with an overview and finishes each subtopic before the next.
5. The order goes from basic to difficult, with prerequisites first.
6. No advanced or not-yet-taught syntax. No f-strings.
7. The language is simple, formal, and direct (§2).
8. Concept slides and code slides are separate.
9. Every first example has a `codeTrace` and a `traceTable`.
10. Animation is used only where it explains execution.
11. Several graded examples, and 4–6 varied exercises per lesson.
12. The chapter teaches problem-solving, not only syntax.
13. Text is 24px, titles are 40px, and every slide fits.
14. Every slide is understandable in class and in later self-study.
