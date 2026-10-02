# Trace challenges

Each chapter with programs has a lesson **"Trace challenges"** (`id: "trace"`). It is placed after the last content lesson and before "Chapter practice". The lecturer uses it at the end of a class: the students trace a program on paper, and the lecturer reveals the rows of the table in instructor mode.

`js/content/topic02.js` (Lesson 9) with `tools/traces/t02.py` is the reference. Copy its patterns.

## What the lecturer asked for (2026-10-02)

- Ten programs for each chapter, harder than the trace exercises inside the lessons.
- The programs train **accuracy in the content of the chapter**: each program applies rules that the chapter teaches, and has at least one line that students often trace wrongly (a "trap"). The trap is a rule of the chapter, never a trick outside it.
- There is no limit on the number of rows. A long trace is welcome when every part of it is interesting: a loop where the values change in a new way, a branch that goes another way, a call that returns to another line. A long trace that repeats the same step many times is boring: reduce the number of iterations.
- The lesson is in levels. Each level names the lessons that it uses, so that a level can be done at the end of the class that finishes those lessons. A program of a level uses only statements taught up to the last lesson of the level (and in earlier chapters).

## Files

| File | Content |
|---|---|
| `tools/traces/tNN.py` | the ten programs of chapter NN, in the list `TRACES` |
| `tools/make-trace.py` | runs each program line by line and writes the trace objects into the topic file |
| `js/content/topicNN.js` | the generated block (between two marker comments), and the lesson that uses it |

```
python tools/make-trace.py t03 --show     # display the rows, the output, and a width estimate
python tools/make-trace.py t03            # also rewrite the generated block of js/content/topic03.js
```

The keys of an entry of `TRACES` are listed at the top of `tools/make-trace.py`. The values of the table come from a real run, so they are always correct. Never write the steps of a Python program by hand.

## Other kinds of trace

- **Flowchart** (t04): `flow={line: shape id}` and `echo=False`. The program is the Python form of the chart, one line for each shape, with `while` loops. The constant holds only the steps; the chart object in the topic file uses them (`trace: C_name.steps`), and the slide shows the chart beside the table (`showChart:true`).
- **Pseudocode** (t04): `display='''...'''` is the text that the slide shows. The program has a comment line where the pseudocode has END IF, END WHILE, or END FOR, so that both have the same line numbers.
- **C** (t10): `lang="c"` with `pre`, `code`, `post`, `inputs`, `hex`, and `expect`. The steps come from the C engine of the site, not from this tool: see the three commands at the top of `tools/c-trace.js`. `tools/traces/t10.steps.json` holds them.

## The two layouts

| Layout | Entry | The table shows | Use it for |
|---|---|---|---|
| inline | (default) | Line, Code, the variables, Output | a program whose lines run once, from top to bottom |
| side | `side=True` | the program beside the table; a blank row has an empty Line box | every program with a branch, a loop, a function call, an exception, or a line that does not run |

In the side layout the students decide **which line runs next**, and write its number. A table of an `if` or `while` program also has the column **Condition**: the students write True or False on each line that tests a condition (the tool adds it).

## Limits (the slide is 1188 px wide at 1280×720; all text is 24px)

The tool prints an estimate after each trace ("width at 1280x720: about … px, fits"). Keep every trace at "fits".

- Code lines: 30 characters or fewer is safe. A longer line costs 13 px for each character.
- Side layout: the program has 14 lines or fewer.
- Variables: each one is a column of at least 102 px. A long value makes its column wider in every row: a list `[24, 18, 20]` needs about 200 px. Use short lists (3 or 4 small numbers) and short strings, and at most 4 or 5 variables. `hide=["name"]` removes a column that teaches nothing.
- Rows: any number, but see "boring" above. More than about 30 rows is rarely worth it.
- Output: short lines (a long line makes the Output column wide).

## The program

- Python level: only what the chapter and the earlier chapters have taught, at the level of the challenge (see the table "Nothing before it is taught" in `CHAPTER-IMPROVEMENT-PROMPT.md`).
- **No f-strings.** Output with `print("Power =", power, "W")`.
- Simple engineering data where it is natural (voltage, current, temperature, sensor readings, battery level, tank level). The context must not make the trace harder. Short abstract names (`a`, `b`, `n`) are acceptable in a puzzle about operators.
- Descriptive `snake_case` names, kept short because of the width.
- `input()`: give the typed lines in `inputs=[...]`, and state them in the task text ("Test input: 12 and 5.").
- Each challenge is harder than the one before it inside its level, and the levels follow the order of the lessons.
- Do not reuse a program that the chapter already shows (an example, an exercise, a practice problem), and do not give away a practice problem of the chapter.
- At least one challenge of the last level contains an error for the students to find: a logical error (the task gives the correct result; the students name the line with the first wrong value), or a program that stops (`error="name"`; the students find the line that stops and name the error), when the chapter or an earlier one has taught the error.
- One or two challenges may be "a program without a name": the task also asks what the program computes.

## The lesson in the topic file

Copy the structure of Lesson 9 of `topic02.js`:

1. Above `App.registerTopic`: the two marker comments (the tool fills the block between them), the constant `TRACE` (the common task text), and the helper `CH`.
2. The lesson `{ id: "trace", title: "Trace challenges", sub, keywords, deck: [...] }`, placed directly before the lesson "Chapter practice".
3. Slide 1, `kind: "overview"`: one sentence about the lesson, and the ordered list "Rules of a trace" (5 items or fewer). From Topic 03 on, the rules say how to fill the column Line (side layout) and the column Condition.
4. Slide 2, `kind: "concept"`, "The levels": a table Level / Lessons / Programs / Subject.
5. Ten slides, `kind: "exercise"`, with the title `"Level N: short name"`, no `part`, the blocks `[T(task), CH(C_name)]`, and `answer: [...]`.
   - `CH(C_name, 3)` keeps the first three rows complete (the default is one row). Use it when the first rows hold no value, for example the `def` lines of a program with functions; say the number in the task text.
   - The title must not give away the trap.
   - The task: `TRACE`, plus numbered lines for the test input or an extra question. An error challenge has its own task text.
   - `answer` (shown only in instructor mode by "Show answer"): one to four short sentences or list items that name the trap and the rule behind it, with the line numbers. It does not repeat the table.
6. The summary slide of the lesson before it: its "Next lesson" note names **Trace challenges**. Update the lesson order in the header comment of the file and in `intro`, and the number in the comment banner of "Chapter practice".

Wording: follow `CHAPTER-IMPROVEMENT-PROMPT.md` §2 (simple, direct, formal; no em-dash; no rhetorical questions) and §5 "Wording of instructions" (one plain task sentence, then numbered requirements; the students are not native speakers of English). Write code as single-quoted JS strings when it contains double quotes; escape `<` in HTML.

## After editing

1. `python tools/make-trace.py tNN`: no error, every trace "fits".
2. Read each table of the `--show` output as a student: every value must follow from rules that the chapter teaches.
3. Bump `?v=` of the topic file in `index.html`.
4. Browser: load `.claude/tmp/trace-audit.js`, then `await __bad("tNN.trace")` at 1280×720, 1536×864, and 1920×1080 (student and instructor mode): no wrapped rows, no clipped table, no text of another size.
