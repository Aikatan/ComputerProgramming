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

## Instructor mode

Students see only the task of an exercise. The lecturer signs in, and the answer controls appear on the same slide:

- **Show answer** on a slide that has an answer (for example the completed table)
- **Run** and **Step Run** on the program of an exercise slide
- **Previous row / Next row / All / Reset** for a blank trace table (the arrow keys also reveal the rows)

**Sign in:** click **Instructor** in the top bar, enter the username and the password, and click **Sign in**. The button then reads **Instructor: on**. Click it again to sign out. The mode also ends when the browser tab is closed.

**Default login:** username `admin`, password `password`.

**Change the login:**

```bash
python tools/set-instructor-login.py
```

The script asks for the username, and twice for the password (the password is not displayed). It writes a new salt and the SHA-256 hash of the login to `js/instructor.js`, and raises the `?v=` number of that file in `index.html`. Commit and publish both files to use the new login on the public site.

Instructor mode only hides the answers. They stay in the page source, and the hash is public, so a short password can be found by trial. Do not reuse a password of another account, and do not put exam answers on the site.

For authors: the content fields (`answer`, `hideOnAnswer`, `studentRun`, `showCode`) are described in `CHAPTER-IMPROVEMENT-PROMPT.md`, section 6. In the browser console, `App.setInstructor(true)` switches the mode on without the dialog.

## Project layout

```
index.html              page shell + script/CDN loading
css/styles.css          all styling (dark/light themes)
css/scenes.css          animated scenes and static diagrams
img/tNN/                raster figures of a chapter (WebP, made by tools/make-images.py)
js/
  core.js               namespace, content registry, progress, static highlighter, instructor mode
  instructor.js         the instructor login (salt and hash; written by tools/set-instructor-login.py)
  runner.js             Pyodide engine (stdin, stdout, matplotlib capture)
  editor.js             live CodeMirror + Run/Reset block
  widgets.js            interactive visuals (binary, truth table, flowchart, steppers, …)
  scenes.js             the scene engine (animStepper): one stage, smooth steps, Play
  scenes-t01.js         the scenes and diagrams of Topic 01
  lesson.js             two-section lesson renderer
  app.js                router, sidebar, home, search, theme
  content/topic00..10.js  all lesson content (data-driven)
tools/
  make-images.py        generates and converts the figures; prompts in tools/images/tNN.json
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
