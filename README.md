# Python ComPro Learn

An interactive web courseware for the **010711301 Computer Programming** course.
Every lesson has two sections on one page:

1. **① Concept & Visuals** — clear explanations, animated/interactive widgets, annotated static examples, and "under-the-hood" deep dives (incl. C-style pointers/stack/memory for context).
2. **② Try it Live** — a real Python interpreter (Pyodide) running in your browser. Edit any example and **Run** it — including `input()`, Matplotlib charts, NumPy and pandas. No install required.

A short self-check quiz closes most lessons. Progress is saved per device.

## Content (all 9 topics, 44 lessons)

| Topic | Covers |
|-------|--------|
| 00 Intro & Setup | what programming is, course tools, first run |
| 01 Architecture | hardware/software, CPU cycle, RAM/ROM, HDD/SSD, system levels |
| 02 Basics | errors, input/output, variables & memory, data types, strings, numbers |
| 03 Decisions & Loops | booleans, operators, if/elif/else, loops, break/continue/pass/else |
| 04 Flowchart & Pseudocode | symbols, flowchart↔code, pseudocode |
| 05 Functions & Modules | def, scope, recursion, args/kwargs, modules & pip |
| 06 Strings, Lists, Dicts | string methods, list/dict operations |
| 07 Plots & Exceptions | Matplotlib charts, try/except/else/finally, raise, assert |
| 08 Files, NumPy & Pandas | file handling, CSV/JSON, NumPy arrays, pandas DataFrames |

## How to run

It's a static site, but the in-browser Python engine must be **served over HTTP** (opening `index.html` directly with `file://` will not work).

From this folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in a modern browser.

> First time you press **Run**, the browser downloads the Python engine (~6 MB; NumPy/pandas/Matplotlib download on demand the first time a lesson needs them). After that it's cached and fast.

### Deploying
Any static host works (GitHub Pages, Netlify, etc.) — just upload the folder. No build step.

## Project layout

```
index.html              page shell + script/CDN loading
css/styles.css          all styling (dark/light themes)
js/
  core.js               namespace, content registry, progress, static highlighter
  runner.js             Pyodide engine (stdin, stdout, matplotlib capture)
  editor.js             live CodeMirror + Run/Reset block
  widgets.js            interactive visuals (binary, truth table, flowchart, steppers, …)
  lesson.js             two-section lesson renderer
  app.js                router, sidebar, home, search, theme
  content/topic00..08.js  all lesson content (data-driven)
```

## Editing / adding content
Lessons are plain data in `js/content/topicNN.js`. Each lesson is:

```js
{ id, title, sub, slides, keywords,
  learn: [ ...blocks ],          // text / note / list / example / widget / deepdive
  live:  [ { title, code } ],    // runnable editors
  quiz:  [ { q, choices, answer, explain } ] }
```

No build tools — edit the file and refresh the page.

---
Vendored from CDN: [Pyodide](https://pyodide.org) (Python), [CodeMirror 5](https://codemirror.net) (editor).
