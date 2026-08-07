# Session notes — slide-mode overhaul + t06 content rewrite

_Working dir: `python-compro-learn/` (git repo, branch `main`). Static no-build site served at `http://localhost:8000/` (server root = this folder). Hard-refresh (Ctrl+F5) after edits; cache-bust via `?v=NN` in `index.html`._

## What was done this session (all UNCOMMITTED)

### 1. Slide-first + full-screen layout
- Default view is now **slides** (was scroll). Scroll is the backup. — `js/app.js` (`route()`, `syncViewBtn`, view toggle).
- In slide mode the body gets `slide-mode` + `nav-collapsed`; sidebar auto-hides, deck widens to `min(1600px, 95vw)`. — `css/styles.css` (`body.slide-mode …`).
- Sidebar is now hideable on **desktop**: the ☰ button toggles `nav-collapsed` (mobile still uses `nav-open`). — `js/app.js` navToggle handler; `css/styles.css` `body.nav-collapsed .sidebar { display:none }`.

### 2. Flowchart sizing (was tiny)
- In slide mode `.flow-wrap` stacks to 1 column; SVG sized by height `min(62vh,560px)`, centered. SVG text bumped to 18 user-units → ~28px rendered. — `css/styles.css` `body.slide-mode .flow …`.

### 3. Type scale — **24 / 28 / 32 only, 24px is the hard floor (code included)**
- `.slide { font-size: 24px }` base floor; body/cards/h4 = 32; notes/quiz-q/sub/split-body/flowchart = 28; all code, annotations, quiz options, tables, chips, kicker = 24. Titles 38 / cover 52 (display, above scale). Mobile fallback raised to 24. — `css/styles.css`.
- Interactive-widget internals lifted in slide mode: `.widget-title`, `.w-btn`, `.w-input` (placeholder boxes 7ch, text box 15ch via `!important` so `start` no longer clips to "star"), `.step-log`, `.lv-item`, and string-viz cells (`.scell .sch` 36px hero glyph, `.scell small` 24px). — `css/styles.css`.

### 4. Content rendering: stacked label→value
- `.annot` "Line by line" lists now stack: code on its own line, explanation indented 1.6em below (was side-by-side). — `css/styles.css`.
- **New `deflist` block type**: term on its own line, meaning indented below. — `js/lesson.js` (`case "deflist"`) + `css/styles.css` (`.deflist .dt/.dd`, slide sizes 32/28).

### 5. t06 content rewrite (`js/content/topic06.js`)
- Long paragraphs → short stacked lines (`<br>`), one idea per line.
- Definitional lists → `deflist` (slice numbers, string methods, list ops, dict access).
- **No em-dashes (—)** in user-facing text (only the source comment banner still has one).
- **Removed UI/how-to-use narration** ("drag the values", "try the demo below", "highlighted boxes are…", "watch them change"). Text now states the point/theory only. Widgets speak for themselves.

### 6. New animation: `tryFlow` widget (topic07 exceptions)
- Built `App.widgets.tryFlow` in `js/widgets.js`: stacked try/except/except/finally boxes; pick an input scenario (`num = 5`, `num = 0`, `num = 'abc'`) and step through. Active block highlights; the raising block gets a red border + ⚡ error badge; control visibly jumps to the matching `except`; `finally` always lights up. CSS `.tryflow`/`.tf-*` in `styles.css` (slide sizes honor 24px floor).
- Wired into `topic07.exceptions` learn section. Rewrote that lesson's text to the style rules (short lines, no em-dash, no UI-how-to, `deflist` for "the full shape").
- Graded the exceptions `live` examples easy→hard: (1) catch one divide-by-zero, (2) multiple except + finally, (3) raise your own + else.

### 7. New animations: fileFlow + arrayOp (topic08)
- `App.widgets.fileFlow` (widgets.js): open→write→close→reopen→read→close, with an open/closed dot, mode badge, write/read glow, growing file content, output. Wired into `t08.file-handling`. Verified end-to-end.
- `App.widgets.arrayOp` (widgets.js): NumPy element-wise op + broadcasting; result fills cell-by-cell. Wired into `t08.numpy` (a+b, and a*2 broadcast). Verified.
- Both lessons rewritten to style rules (short lines, no em-dash, deflist for modes/attributes) and `live` examples graded easy→medium→hard.
- CSS `.ff-*` and `.ao-*` in styles.css, slide sizes honor 24px floor.

## "go dev" directives (current task)
- Every topic should have its OWN animation/visualization. Visual > text (except syntax).
- Examples must vary easy → harder.
- Progress: **t07 exceptions ✅ (tryFlow)**, **t08 file-handling ✅ (fileFlow)**, **t08 numpy ✅ (arrayOp)**, **t08 pandas ✅ (dfFilter — filter + sort)**.
- **t08 csv-json ✅ (csvFlow — table↔CSV text round-trip)**. t08 is now FULLY animated (all 5 lessons).
- t00 SKIPPED (intro only, per user).
- **t09 big-o ✅ (bigOViz — bar race of O(1)..O(n²) as n doubles)**.
- Survey result: `diagram` widget = STATIC reading cards (not animation). `steprun` = real line-by-line Pyodide execution (counts as animation).
  - t01: cpuCycle (anim) + static diagrams. t02: binaryConverter/stringIndex/stringSlice (anim) + memoryModel. t03: loopViz (anim) + truthTable. t04: flowchart/flowExec (anim). t05: funcCall/funcNested/funcScope/funcArgs (anim). All have real animation.
  - t09: searching + sorting already have `steprun`; big-o now has bigOViz. Remaining static-only lessons: what-is-algorithm, data-structures, efficient-python (lower priority; conceptual).
  - t10 (Programming in C): why-c, types, control-flow, functions, arrays-strings use static diagram; pointers/arrays/memory use memoryModel (static illustration). NO stepped animation. Biggest remaining gap = t10 could use a pointer/memory animation (stack frames, pointer dereference) and control-flow could reuse flowExec/steprun.
- NEXT candidates: t10 pointer/stack animation; optionally a visual searchViz for t09 searching (currently steprun only); t09 sorting could get a visual bubble-sort swap animation.
- `csvFlow` widget (widgets.js): write phase builds comma-separated lines from a table; read phase splits lines back into rows. Built on stepper, reuses .dftbl + .ff-* styles.
- `dfFilter` widget (widgets.js): pandas table filter (rows tested → keep ✓ / drop ✗) and sort (reorder + highlight sorted column). Scenario buttons. Verified: Age>28 keeps Bob/Char; sort desc → 35,30,25.

## Reusable animation widgets available (widgets.js)
diagram, cpuCycle, binaryConverter, truthTable, stepper (generic step driver), varChips, codeLines, loopViz (line+vars+log tracer), memoryModel, flowchart, listViz, funcCall/funcNested/funcArgs/funcScope, stringIndex/stringSlice/stringShift, flowExec, **tryFlow**, **fileFlow**, **arrayOp**. Prefer building new ones on top of `stepper` (like loopViz/fileFlow/arrayOp do).

## Cache versions in index.html (current)
- `styles.css?v=33`, `widgets.js?v=33`, `app.js?v=24`, `lesson.js?v=30`, `topic06.js?v=31`, `topic07.js?v=31`, `topic08.js?v=33`. All other files still `?v=23`. NOTE: browser aggressively caches index.html itself — force-reload with a `?cb=N` query when verifying.

## Memory rules saved (persist across sessions)
- `content-writing-style.md` — short lines/bullets; no long paragraphs; stack `label:` above an indented value; **no em-dash**; concise (not textbook); **no UI/widget how-to text, only the point/theory**.

## Content-style rules to apply to EVERY future topic
1. Short lines / bullets, never 2–3 sentence blocks.
2. `label:` on one line, value indented below (use `deflist` or `.annot`), never `label: value` inline.
3. No em-dash (—). Use period / colon / comma / new line.
4. Concise, key-point phrasing. Not a textbook.
5. No "how to use the UI/widget" text — teach the theory/takeaway only.

## Remaining TODO
- [ ] Apply the same content pass to the other topics: `topic00`–`topic05`, `topic07`–`topic10`, and `zz-examples.js` / `zz-quiz.js` / `zz-steprun.js` / `zz-practice.js`. Bump their `?v=` when edited.
- [ ] Commit everything (user hasn't committed yet this session). Suggested: one commit, or group as (a) layout+type-scale CSS/JS, (b) content rendering (annot/deflist), (c) t06 rewrite.
- [ ] User to eyeball t06 density in-browser and confirm before rolling wider.

## Verified this session (browser preview)
- Slide mode: sidebar hidden, deck 1596px @1680px wide.
- Flowchart text renders 28px, no box overflow.
- All HTML slide text ≥24px (smallest = kicker 24). Flowchart SVG ≥24px rendered.
- String-slice widget: title 24, glyph 36, index labels 24, `start` box no longer clips.
- `deflist` + `annot` render stacked with ~1.6em indent. No console errors.
