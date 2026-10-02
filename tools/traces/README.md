# Trace challenges

Each chapter with programs has a lesson **"Trace challenges"** (`id: "trace"`). It is placed after the last content lesson and before "Chapter practice". The lecturer uses it at the end of a class: the students trace a program on paper, and the lecturer reveals the rows of the table in instructor mode. The lesson is eight exercise slides, with no introduction.

`js/content/topic02.js` (Lesson 9) with `tools/traces/t02.py` is the reference. Copy its patterns.

## What the lecturer asked for (2026-10-02, revised 2026-10-03)

- **Eight programs** for each chapter, harder than the trace exercises inside the lessons, in order from easy to difficult.
- The programs train **accuracy in the content of the chapter**: each program applies rules that the chapter teaches, and has at least one line that students often trace wrongly. That line uses a rule of the chapter, never a trick outside it.
- **Length:** 8 to 16 rows, about 12 for a harder program. Never more than 20 rows. A loop has 2 to 4 iterations, and each iteration shows something new.
- **Direct questions only.** The students find the values and the output. There is no "find the error" question: no "first wrong value", no "corrected line", no program with a bug to repair.
- **One or two "missing lines" questions** in each chapter (`missing=[4, 6]`): the table is complete, and two or three lines of the program are empty boxes. The students write the lines from the values of their rows. Choose lines that their rows fix without doubt, and that need thought about the chapter's rules (a branch, a return, a conversion, a method call), not a single plain operator. They are the last programs of the lesson.
- **The slides are minimal.** This is a lecture deck: no overview slide, no slide about levels, no rules of a trace (the lecturer shows one trace in class), no level in the title, no explanation of the answer.

## Files

| File | Content |
|---|---|
| `tools/traces/tNN.py` | the eight programs of chapter NN, in the list `TRACES` |
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
- Rows: 20 at most (the tool reports "TOO LONG"), 8 to 16 preferred.
- Output: short lines (a long line makes the Output column wide).

## The program

- Python level: only what the chapter and the earlier chapters have taught, at the level of the challenge (see the table "Nothing before it is taught" in `CHAPTER-IMPROVEMENT-PROMPT.md`).
- **No f-strings.** Output with `print("Power =", power, "W")`.
- Simple engineering data where it is natural (voltage, current, temperature, sensor readings, battery level, tank level). The context must not make the trace harder. Short abstract names (`a`, `b`, `n`) are acceptable in a puzzle about operators.
- Descriptive `snake_case` names, kept short because of the width.
- `input()`: give the typed lines in `inputs=[...]`, and state them in the task text ("Test input: 12 and 5.").
- The programs follow the order of the lessons of the chapter, and each one is a little harder than the one before it.
- Do not reuse a program that the chapter already shows (an example, an exercise, a practice problem), and do not give away a practice problem of the chapter.
- A program may stop with an error that the chapter teaches (`error="name"`): the last row then has the name of the error in the column Output. Use it at most once in a chapter, and only when the students can find the line by tracing. It needs no extra task text.

## The lesson in the topic file

Copy the structure of Lesson 9 of `topic02.js`:

1. Above `App.registerTopic`: the two marker comments (the tool fills the block between them) and the helper `CH`.
2. The lesson `{ id: "trace", title: "Trace challenges", sub, keywords, deck: [...] }`, placed directly before the lesson "Chapter practice". `sub` is the only instruction of the lesson (it is on the cover slide): "Eight programs to trace on paper: the value of every variable and the output, line by line."
3. The deck has **eight slides and nothing else**, each `{ kind: "exercise", title, blocks: [...] }`:
   - `title`: a short name of the program, with a capital letter ("Two tanks"). No level, no number, and nothing that gives away the difficult line.
   - `blocks`: `[CH(C_name)]`. Add one line of text before it only when the students need a fact that the slide does not show: `T("Test input: 12 and 5.")`. A file that the program reads is shown by the table itself (the tool passes `files` on), not described in a sentence.
   - A "missing lines" slide: `[T("Write lines 4 and 6 of the program."), CH(C_name)]` and `answer: [CODE("line 4
line 6", null, "lines 4 and 6")]`. No other slide has `answer`: the revealed table is the answer.
   - `CH(C_name, 3)` keeps the first three rows complete (the default is one row). Use it when the first rows hold no value, for example the `def` lines of a program with functions.
4. The summary slide of the lesson before it: its "Next lesson" note names **Trace challenges** ("Eight programs to trace by hand."). The lesson order in the header comment of the file and in `intro` names the lesson.

Wording, where text is needed: follow `CHAPTER-IMPROVEMENT-PROMPT.md` §2 and §5 "Wording of instructions". Write code as single-quoted JS strings when it contains double quotes; escape `<` in HTML.

## After editing

1. `python tools/make-trace.py tNN`: no error, every trace "fits".
2. Read each table of the `--show` output as a student: every value must follow from rules that the chapter teaches.
3. Bump `?v=` of the topic file in `index.html`.
4. Browser: load `.claude/tmp/trace-audit.js`, then `await __bad("tNN.trace")` at 1280×720, 1536×864, and 1920×1080 (student and instructor mode): no wrapped rows, no clipped table, no text of another size.
