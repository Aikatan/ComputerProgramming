# Chapter Improvement Prompt: Python ComPro Learn

Paste this whole file to Claude Code, then add one line:
**"Improve chapter tXX using CHAPTER-IMPROVEMENT-PROMPT.md. Plan first, then edit and verify."**

The site is an interactive Python lecture for Bachelor of Engineering students (course 010711301). It is static, with no build step: HTML/CSS/JS, CodeMirror, and Pyodide.
- It is **used directly in lectures instead of PowerPoint** (slide mode is the default).
- Students also **read it later without the instructor** (slide mode or scroll view).

Where things live:
- Content: `js/content/topicNN.js`
- Rendering: `js/lesson.js` (blocks and scroll view), `js/present.js` (slides)
- Widgets: `js/widgets.js`
- Styles: `css/styles.css`

**Reference chapter:** `js/content/topic02.js` is the first chapter built to this prompt. Copy its patterns.

The final chapter must be: **clear, linear, concise, formal, easy to follow, technically correct, and focused on fundamental programming and engineering problem-solving.**

---

## 1. Content structure

- Organize the content in one clear linear sequence, from simple to more difficult.
- **Prerequisites first.** A lesson uses only what earlier lessons or earlier chapters have explained.
  - Example: in t02, Errors comes *last*, because its examples need variables, conversion, division and strings.
- **Each slide has one clear purpose.** A slide that needs two titles is two slides.
- Do not repeat the same explanation on several slides.
- Do not return to a previously explained topic unless the current concept needs it. Then refer to it in one line ("see Lesson 4").
- **Never re-teach an earlier chapter.** Refer to it in one line and build on it.
  - Example: t06 "Strings in depth" starts from t02's indexing and slicing and adds only the new methods.
- Remove content that is not needed to understand the main programming principle.
- Keep the amount of content suitable for an introductory Bachelor of Engineering programming course.
- Keep existing material when it is already clear, correct, and well placed. Do not rewrite only for stylistic variation.

## 2. Topic continuity (the golden rule)

**Explain one topic completely before the next. Do not alternate between related but different concepts (no A → B → A).**

For each major topic:
1. Start with a brief overview of what belongs to the topic (the subtopics, in order).
2. Explain the basic idea and its purpose.
3. Introduce the first subtopic.
4. Explain and demonstrate that subtopic completely.
5. Finish that subtopic before introducing the next one.
6. Continue until all necessary subtopics are complete.
7. End with a short summary or a combined example, plus a "Next lesson" line that says why the next topic follows.

The general sequence is:

**Overview → General principle → One subtopic → Explanation → Example → Completion → Next subtopic**

The explanation reads as one continuous story, not a collection of disconnected examples. Students always know:
- which topic is being explained
- how it relates to the whole chapter
- when that topic is complete
- why the next topic follows

The platform supports this automatically (§10):
- a chapter map on each cover slide
- the kicker "CONCEPT · SUBTOPIC"
- the location in the bottom bar
- subtopic headings in the outline and the scroll view

Example (file handling). Wrong: CSV read → JSON load → CSV write → JSON save → text read → CSV example. Right:
```
File handling overview
→ Text files: open, read, process, close or manage, examples
→ CSV files: what CSV is, read, process, write, examples
→ JSON files: what JSON is, load, access data, save, examples
```
When a section such as "reading files" is explained, complete the idea of reading first. Do not switch between CSV reading and JSON loading before students understand the general principle.
- If one lesson mixes two subjects, split it into two lessons, each complete on its own.
- Reference: t08 `csv-json` was split into `csv` and `json`.

## 3. Language

- Use simple, direct, formal language. State the concept directly.
- Explain technical ideas clearly, without unnecessary academic wording.
- Do not use conversational expressions.
- Do not use rhetorical questions or unnecessary questions such as "What do you think happens next?" or "Have you ever wondered…?".
- Do not use introductory filler: "In this topic, you will learn…", "Let's explore…", "Now let's take a look…".
- Do not use analogies or metaphors unless they are essential for understanding. The lecturer adds them live.
- Do not use the em-dash `—`. Use a colon, a period, a new line, or a list.
- Do not narrate the UI ("press Play", "click the box", "watch it change"). State the point; the widget shows itself.
- Use the same keyword for the same idea every time: index, value, variable, string, statement, output.

Prefer: `A variable stores a value that can be used or changed later in the program.`
Instead of: `Have you ever wondered how Python remembers information? In this topic, you will learn about variables.`

## 4. Teaching approach

- Prioritize understanding of the programming principle over Python syntax. Students must understand **why** the code works, not only how to write it.
- When appropriate, use this order:

**Problem → Logic → Algorithm → Code → Execution → Result**

The engineering problem-solving steps are taught in full in t02 Lesson 6. After that they are only applied.
1. identify the input
2. identify the required output
3. determine the processing steps
4. determine conditions or repetitions
5. write the algorithm
6. convert the algorithm into Python
7. verify the result (a hand calculation)

Use simple engineering examples where appropriate: voltage, current, power, temperature, sensor values, battery level, distance, speed, threshold checking. The engineering context must not make the programming problem harder.

## 5. Python level and code style

- Use basic Python whenever possible: variables, arithmetic operators, comparison operators, `if`, `elif`, `else`, `for`, `while`, basic `input()`, basic `print()`.
- Do not introduce advanced syntax when basic statements show the concept clearly.
- Use other methods or functions only when they are necessary and there is no reasonable basic alternative.
- **Nothing before it is taught** (the chapter that introduces it):

| Chapter | Must not use yet |
|---|---|
| t00–t02 | `if`, loops, lists, dicts, functions (`def`), `try` |
| t03 | functions, lists, dicts, `try` (`range()` is allowed in `for`) |
| t04 | functions, lists, dicts, `try` |
| t05 | lists, dicts, `try` |
| t06 | `try`, files |
| t07+ | normal use of earlier material |

- **Do not use f-strings.** Use `print("Voltage =", voltage, "V")` or `print("Voltage = " + str(voltage) + " V")`. For decimals, use `round(x, 2)`.
- Readable, explicit code is preferred over short or clever code. Use descriptive `snake_case` names.
- Keep examples short and easy to trace by hand. The size limits per slide type are in §7.
- Do not combine too many programming concepts in the same first example.
- Every example that uses `input()` sets `inputs:[...]`, so it runs without pop-up prompts. Exercises may leave `inputs` out, so that students type the values.

## 6. Explanation slides, code slides, and the first example

- **Separate explanation slides from code-example slides.**
  - Explanation (concept) slides focus on the principle, the logic, the algorithm, the flow, a diagram, or an important rule. A syntax card of 1 to 3 lines is allowed.
  - Code slides focus on the code, its execution, the variable values, the output, and short notes on the important lines.
  - Never put a large code block and a large amount of explanatory text on the same slide.
- **The first example of a new concept** is explained carefully, line by line, on two slides:
  1. `codeTrace` (kind `code`) shows:
     - which line executes
     - what the line does (the note)
     - the current variable values and what changes
     - the output
     - what the program does next (the next step)
  2. `traceTable` (kind `trace`) shows the same trace as a static table, with a short result check (for example "12 × 2 = 24").
- Later examples use shorter explanations: a runnable `example` with 2–3 short `annot` notes.
- Use several small, simple examples instead of one complicated example. Order them from easy to harder: typically the traced first example, then one or more further examples.

**Animation and visualization**
- Use animation only when it helps to explain program execution. It supports teaching; it is not decoration. Useful animation:
  - highlighting the current line
  - variable values changing
  - the result of a condition and the branch selected
  - each loop iteration
  - accumulated values
- Important information must remain understandable without the animation. For this reason every `codeTrace` has a `traceTable`.

**Content visibility**
- Do not use hidden-content controls for teaching material: Show More, accordions, expandable explanations (`deepdive`), `tabs`, hidden code, hover-only information, or `predict` teasers. Important content is directly visible.
- Normal slide navigation is allowed. So is feedback after an exercise attempt: the quiz explanation, the Check result, and a hint after a wrong answer.

**Self-study**
- Each slide contains enough information to understand its main point without the lecturer.
- Do not make slides so short that their meaning depends on spoken explanation. Avoid long paragraphs. Use 2 to 6 short sentences or list items.

## 7. Slide design

**Font sizes: exactly two sizes on slides**

| Size | Used for |
|---|---|
| **24px** | all normal content: text, lists, tables, notes, code, output, buttons, widget text, kicker, and the cover subtitle |
| **40px** | headers and titles only: the slide title and the cover title |

- **Do not reduce the font size to fit more content.** If the content does not fit clearly, divide it into additional slides.
- Do not use `<sup>`, `<sub>`, `<small>`, or inline `font-size` in content. They render below 24px. Write `2⁸`, `m²`, `I²` with Unicode characters, or use words.
- Keep clear spacing, high contrast (4.5:1 or better in the dark and light themes), readable code, and a clear visual hierarchy.
- The layout supports browser zoom in and zoom out without breaking: no horizontal page scroll at any width. Layouts use container queries and wrapping.

**Fit.** Every slide fits without vertical scrolling at **1280×720, 1536×864, and 1920×1080**. Always measure with the editors rendered (see §10). These limits fit at 1280×720 in t02:

| Slide type | Limit |
|---|---|
| Concept | 5 list items or fewer, or one table of 6 rows or fewer plus 2 short lines. Split two tables across two slides unless both are short. |
| Example (`example` + `annot`) | 7 code lines or fewer, 40 characters or fewer per line, 3 annotations or fewer of one short sentence each |
| `codeTrace` | 6 code lines or fewer, 40 characters or fewer per line, 4 variables or fewer, 2 output lines or fewer, notes of 2 lines or fewer |
| `traceTable` | 6 rows or fewer. Split a longer trace with `rows:[a,b]`. |
| `practiceq` | prompt of about 40 words or fewer, starter of 6 lines or fewer, target of 3 lines or fewer (on slides the task sits left and the editor right) |
| Exercise with `cols` | 4 task lines or fewer on the left, 6 code lines or fewer on the right. A blank `traceTable` of 5 columns or fewer fits in the half-width column. |
| Summary | 5 list items or fewer, or a table of 4 rows or fewer. Split a chapter summary over two slides. |
| Check | 2 multiple-choice questions with short options and a one-sentence explanation |

## 8. Examples and exercises

- Examples increase in difficulty step by step.
- Each lesson ends with **4–6 exercises, graded easy → hard, of different types**:

| Type | How to build it |
|---|---|
| Trace the code | `cols`: task + `traceTable` with `blank:true, given:1` on the left; the program as `livecode` on the right (students check with Step Run) |
| Determine the output | `cols`: task on the left; the program as `livecode` on the right (students write on paper, then Run) |
| Complete missing code | `practiceq` with a starter that has the gap |
| Modify existing code | `practiceq` with working starter code and a new target |
| Correct an error | `practiceq` with the broken starter code |
| Write a short program | `practiceq` with the starter `# Write your program here` |
| Design a simple algorithm | `practiceq` whose starter first asks for `# Input: / # Output: / # Processing: / # Algorithm:` comments |

- Do not rely mainly on multiple-choice questions. Multiple choice appears only as a short **Check** at the end: one slide with 2 questions.
- A chapter ends with a **practice lesson**: an overview of the problem-solving steps, then for each problem a Problem slide (input / output / processing table) and a `practiceq` slide. It closes with a chapter summary.

## 9. Code and output correctness (lessons from t02)

- Every output quoted in a note, annotation, table, or target must come from a real run, including float results such as `0.30000000000000004` and `23.310000000000002`.
- An error message shown on a slide must be copied from a real run. The runner shows only the student's program:
  ```
  Traceback (most recent call last):
    File "<program>", line 4, in <module>
      resistance = voltage / current
                   ~~~~~~~~^~~~~~~~~
  ZeroDivisionError: division by zero
  ```
- `practiceq` targets include the echoed input lines (for example `Age: 19`), because Run echoes each prompt with its answer on its own line.
- In content files:
  - write code as single-quoted JS strings when the code contains double quotes
  - `\n` separates lines
  - `\\n` is a Python escape inside the code
- HTML in notes must escape `<` as `&lt;` (for example `&lt;class 'float'&gt;`).

## 10. Technical reference

### Lesson format: `deck` (authored slides)
```js
(function () {                        // wrap the topic file: consts must not leak between script files
  const T_power = { code: [...], steps: [...] };   // a trace is defined once and used twice
  App.registerTopic({ id: "t02", title, short, blurb, intro, lessons: [
    { id: "variables", title: "Variables", sub: "…", keywords: "…",
      deck: [
        { kind: "overview", title: "Variables", blocks: [ text, ordered list of subtopics ] },
        { kind: "concept", part: "Assignment", title: "Assignment stores a value", blocks: [ … ] },
        { kind: "problem", part: "Assignment", title: "Problem: power of a device", blocks: [ text, IPO table ] },
        { kind: "code",    part: "Assignment", title: "First example: execution step by step", blocks: [ {type:"widget", name:"codeTrace", config:T_power} ] },
        { kind: "trace",   part: "Assignment", title: "Trace table and result check", blocks: [ {type:"widget", name:"traceTable", config:{trace:T_power}}, text ] },
        …
        { kind: "summary", title: "Summary", blocks: [ list, note "Next lesson" ] },
        { kind: "exercise", title: "Determine the output", cols: [[left blocks], [right blocks]] },
        { kind: "check", title: "Check", blocks: [ {type:"quiz", items:[q1, q2]} ] },
      ] },
  ] });
})();
```
- `kind` sets the kicker. The values are: overview, concept, problem, code (shown as "Example"), visual (shown as "Illustration"), trace (shown as "Trace table"), summary, exercise (numbered "Exercise n of N"), and check.
- `part` is the subtopic name. It appears in the kicker, the bottom bar, the outline, and the scroll-view section headings.
- `blocks` stack full width. `cols: [[…],[…]]` makes a two-column slide, which stacks below 900px.
- The cover slide with the chapter map is added automatically.
- Lessons without `deck` (older chapters) still use `learn/live/quiz` with automatic slide splitting. **Convert a chapter to `deck` when it is improved.**

### Block types
- `text`
- `note` (`title`, `variant`)
- `list` (`title`, `ordered`)
- `table` (`head`, `rows`, `caption`, `cls:"center"`). Use `<span class='t-yes'>Valid</span>` and `<span class='t-no'>Invalid</span>` in cells.
- `code`: read-only (`code`, `output`, `caption`, `lang:"text"` for a plain message)
- `example`: runnable (`annot:[{c,e}]`, `inputs`)
- `livecode` (`title`, `inputs`)
- `practiceq` (`prompt`, `expected`, `starter`, `inputs`, `hint`)
- `quiz` (`items`); question text accepts `` `code` ``
- `widget` (`name`, `config`)

### Trace object (drives `codeTrace` and `traceTable`)
```js
{ code: ["voltage = 12", "current = 2", "power = voltage * current", 'print("Power =", power, "W")'],
  steps: [
    { line: -1, note: "No variable exists yet." },                        // start (not a table row)
    { line: 0, note: "The value 12 is stored in <code>voltage</code>.", set: { voltage: "12" } },
    { line: 2, note: "… → <code>24</code>. Then 24 is stored in <code>power</code>.", set: { power: "24" } },
    { line: 3, note: "…", print: "Power = 24 W" },
    { line: -1, note: "The program ends. Result: Power = 24 W." } ] }   // end (optional)
```
- `line` counts from 0.
- `set` lists only the variables that change. Values are Python literals: `"12"`, `"12.0"`, `"'ohm'"`, `"True"`. For an explicit type use `{v:"10", t:"float"}`.
- `print` is the output that step adds. For `input()`, include the echoed line (`"Name: Anan"`).
- `traceTable` options:
  - `blank:true`: empty boxes for students to fill in
  - `given:n`: the first n rows are filled in
  - `rows:[a,b]`: a range of rows
- On slides, → / Space / PageDown step a codeTrace first; the deck moves on at the last step. Going back lands on the last step.

### Widget catalogue (reuse before building new)
- `codeTrace`, `traceTable`: execution and trace tables (every chapter)
- `rebindViz`: one name rebinding to new values and types
- `branchViz`: if / elif / else
- `loopViz`: the older loop tracer; prefer `codeTrace`
- `boxTrain`, `dictTrain`: list and dict operations
- `callStack`: function frames and recursion
- `flowchart`, `flowExec`, `pseudoMap`: flowcharts and pseudocode
- `tryFlow`: exceptions
- `fileFlow`, `csvFlow`, `jsonFlow`: files
- `arrayOp`: NumPy
- `dfFilter`: pandas
- `searchViz`, `bubbleViz`, `bigOViz`: algorithms
- `binaryConverter` (`value`), `stringIndex` (`text`), `stringSlice` (`text`, `start`, `end`, `step`), `memoryModel`, `truthTable`, `cpuCycle`
- C (t10): `pyToC`, `ptrViz`, `heapViz`, `arrViz`, `buildPipeline`
- Do not use: `predict`, `deepdive`, `tabs`.

A widget of an older chapter may still contain text below 24px or fixed pixel sizes. Fix it (use a CSS class, not an inline `font-size`) when its chapter is improved.

### Injected content
`zz-steprun.js`, `zz-examples.js`, `zz-quiz.js` and `zz-practice.js` add content to older lessons. They skip any lesson or topic that uses `deck`.
- When a chapter is converted, delete its entries from these files.
- Put its examples, exercises, and checks into the deck itself.

### Workflow
1. Edit `js/content/topicNN.js`. Change `js/widgets.js`, `css/styles.css`, or the renderers only when needed.
2. **Bump `?v=N` in `index.html`** for every changed file. The browser caches hard.
3. Verify in the browser preview (`.claude/launch.json`, "compro-static").
   - A hidden preview pane pauses animation frames, so the editors are never created. Before measuring, run `window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16)` in the page.
   - For each viewport (1280×720, 1536×864, 1920×1080), walk every slide with `App._deckNav.next()` (wait ~120 ms per slide) and check:
     - no "Unknown block/widget" text
     - every element with its own text has a computed font size of exactly 24px or 40px
     - `document.documentElement.scrollWidth <= innerWidth`
     - slide top + slide height + bottom-bar height ≤ `innerHeight`
   - At tablet and phone width, check only that there is no horizontal scroll.
   - Run every `example`/`livecode` through `App.py.run(code, {inputs, sink})`. Compare the output with the notes.
   - Run a reference solution for every `practiceq`. Compare it with `expected` using the Check button's normalisation (trim trailing spaces and blank edge lines).
   - Step a codeTrace with its buttons and with the arrow keys.
   - Open the scroll view (the view toggle): every slide appears as a section.
   - Check the light theme contrast and the console (no errors).
4. Grep the topic file for `f"`, `f'`, `—`, `<sup>`, `predict`, `deepdive`, `tabs`, and syntax that has not been taught yet (§5).
5. Commit per chapter with a clear message. Push to `main` only when asked; it publishes to GitHub Pages.

## 11. Review process for each chapter

1. Review the existing sequence. List its lessons and subtopics.
2. Identify duplicated or unnecessary content, inside the chapter and against earlier chapters.
3. Identify places where related subtopics are unnecessarily mixed together.
4. Reorganize each major topic so that it starts with an overview and finishes one subtopic before moving to the next.
5. Reorder the content from basic to more difficult (prerequisites first).
6. Remove unnecessary advanced syntax (§5).
7. Simplify the language (§3).
8. Separate concept slides from code-example slides (§6).
9. Improve the first example with a clear step-by-step explanation: `codeTrace` + `traceTable`.
10. Add execution animation where it improves understanding.
11. Add several simple examples and 4–6 varied exercises where needed (§8).
12. Check that the chapter teaches problem-solving (Problem → Algorithm → Code → Verify), not only syntax.
13. Check that all normal text and code use 24px, that headers use 40px, and that every slide fits (§7, §10).
14. Check that the chapter can be understood both during class and in later self-study. Each slide carries its own meaning, and the summaries and "Next lesson" lines are present.
