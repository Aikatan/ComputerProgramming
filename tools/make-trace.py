"""Build the trace objects of the "Trace challenges" lessons from a real run of each program.

    python tools/make-trace.py t02            # rewrite the generated block of js/content/topic02.js
    python tools/make-trace.py t02 --show     # only display the traces (rows, values, output)

The programs of a chapter are in tools/traces/tNN.py, in the list TRACES. Each entry is a dict:

    name    the JS constant, for example "C_swap"
    code    the program (use r'''...''' when the program contains a backslash)
    inputs  the lines that the user types, for example ["12", "5"]            (optional)
    files   {file name: content}: files that exist when the program starts     (optional)
    hide    variables that get no column, for example ["i"]                    (optional)
    resume  True: after a function returns, the line of the call gets a row    (optional)
            of its own (it holds the value that the call line stores)
    for_end False: no row for the last test of a for loop (no value is left)   (optional)
    error   "name": a program that stops shows only the name of the error,     (optional)
            for example ValueError (the default is the last line of the message)
    echo    False: an input line is not shown as output (flowcharts)           (optional)
    display the text that the slide shows instead of the program, with the     (optional)
            same number of lines (pseudocode: the program has a comment line
            where the pseudocode has END IF, END WHILE, or END FOR)
    flow    {line number: shape id}: the trace of a flowchart. The program     (optional)
            is the Python form of the chart, one line for each shape (use while,
            not for). Each step names its shape (node) instead of a line; two
            lines of the same shape, one after the other, are one step. The
            constant holds only the steps: the chart object in the topic file
            uses them as its trace (trace: C_name.steps).
    side    True: the program is shown beside the table, and the students      (optional)
            write the number of the line that runs (showCode + hideLines of the
            traceTable). Use it for every program with a branch, a loop, or a
            function. Without it, each row of the table shows its line of code.
    about   one line for the comment above the constant                        (optional)

The tool runs the program line by line (sys.settrace) and writes one step for each line that
runs, in the format of js/widgets.js (codeTrace, traceTable):

    line   0-based line of the program
    set    the variables that the line changes, as Python literals
    unset  the local variables that disappear when their function returns
    print  the text that the line writes (an input line is echoed: prompt, then the typed text)
    end    "" when the text does not end with a line break
    test   "True" or "False" on a line that tests a condition (if, elif, while)

The local variable v of the function f is named "v (f)". A program that stops with an error
has the last line of the error message as the print text of the line that stopped.

A C program (lang="c") is not run by this tool: its steps come from the C engine of the site.
Its entry has pre / code / post (the lines before, the shown lines, the lines after), inputs,
hex (variables shown in hexadecimal), and expect (the expected output). See tools/c-trace.js:

    python tools/make-trace.py t10 --c-programs     # write tools/traces/t10.programs.json
    (in the browser)  await cTraceAll("t10")         # save t10.steps.json in tools/traces/
    python tools/make-trace.py t10                  # write the trace objects

The generated block of the topic file is between two marker comments (see BEGIN and END).
The steps have no notes: the block is used by blank trace tables, which show no notes.
"""
import ast
import builtins
import contextlib
import importlib.util
import io
import json
import os
import re
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROGRAM = "<program>"
BEGIN = "trace challenges (generated"
END = "end of the generated traces"
SHOWN = (int, float, bool, str, type(None), list, tuple, dict, set, range, complex)


def literal(value):
    """The text of a value, or None when the value gets no column (a module, a function, a file)."""
    kind = type(value).__module__ + "." + type(value).__name__
    if kind.startswith("numpy.") and kind != "numpy.ndarray" and hasattr(value, "item"):
        return repr(value.item())            # a NumPy number is shown as the Python number
    if isinstance(value, SHOWN):
        return repr(value)
    if kind == "numpy.ndarray":            # as print() displays an array: [1 2 3]
        return re.sub(r"\s+", " ", str(value)) if value.ndim <= 2 and value.size <= 12 else None
    return None


def assigned_names(node):
    """The plain names that a statement assigns (x = ..., x += ..., a, b = ..., for x in ...)."""
    targets = []
    if isinstance(node, ast.Assign):
        targets = node.targets
    elif isinstance(node, (ast.AugAssign, ast.AnnAssign, ast.For)):
        targets = [node.target]
    names = []
    for target in targets:
        for item in ast.walk(target):
            if isinstance(item, ast.Name) and isinstance(item.ctx, ast.Store):
                names.append(item.id)
    return names


def run_trace(code, inputs=(), files=None, hide=(), resume=False, for_end=True, max_steps=400, error_text="message", echo=True):
    code = code.strip("\n")
    lines = code.split("\n")
    tree = ast.parse(code, PROGRAM)
    # a line that tests a condition -> the first line of its block
    tests = {n.lineno: n.body[0].lineno for n in ast.walk(tree) if isinstance(n, (ast.If, ast.While))}
    fors = {n.lineno: n.body[0].lineno for n in ast.walk(tree) if isinstance(n, ast.For)}
    # a line that assigns plain names: an assignment of an equal value is still a change of the row
    assigns = {}
    for n in ast.walk(tree):
        if isinstance(n, (ast.Assign, ast.AugAssign, ast.AnnAssign, ast.For)):
            assigns.setdefault(n.lineno, []).extend(assigned_names(n))

    steps = []
    state = {"cur": None, "snap": {}, "resume": None, "frame": None}   # frame: id of the frame of the current step
    frames = []      # [frame, label]: the program frames that are active, outermost first
    pending = {}     # id(frame) -> (step, first line of the block): a condition whose result is not known yet
    pending_for = {} # id(frame) -> (step, first line of the block): the last step of a for line
    failed = {}      # id(frame) -> True: the current statement of the frame raised an exception
    out = io.StringIO()
    typed = iter(inputs)

    def fake_input(prompt=""):
        try:
            text = next(typed)
        except StopIteration:
            raise EOFError("the trace has no more input lines") from None
        if echo:
            out.write(str(prompt) + text + "\n")   # the terminal shows the prompt and the typed text
        return text

    def label(name, frame_label):
        return name if frame_label is None else name + " (" + frame_label + ")"

    def snapshot():
        snap = {}
        for frame, frame_label in frames:
            for name, value in list(frame.f_locals.items()):
                if name.startswith("__") or label(name, frame_label) in hide or name in hide:
                    continue
                text = literal(value)
                if text is not None:
                    snap[label(name, frame_label)] = text
        return snap

    def new_step(lineno, frame=None):
        if len(steps) >= max_steps:
            raise RuntimeError("the trace has more than " + str(max_steps) + " steps")
        step = {"line": lineno - 1}
        steps.append(step)
        state["cur"] = step
        state["frame"] = id(frame) if frame is not None else None
        return step

    def frame_label(frame):
        return next((lb for f, lb in frames if f is frame), None)

    def finished(frame):
        """The names that the current step assigns, when its statement has ended in this frame."""
        cur = state["cur"]
        if failed.pop(id(frame), False):     # the statement stopped with an error: it assigned nothing
            return ()
        if cur is None or state["frame"] != id(frame):
            return ()
        lineno = cur["line"] + 1
        if lineno in fors and frame.f_lineno != fors[lineno]:
            return ()                        # the for loop has no more values: nothing is assigned
        return [label(name, frame_label(frame)) for name in assigns.get(lineno, [])]

    def sync(forced=()):
        """Give the changes since the last event to the current step."""
        new = snapshot()
        text = out.getvalue()
        changed = {k: v for k, v in new.items() if state["snap"].get(k) != v or k in forced}
        gone = [k for k in state["snap"] if k not in new]
        if state["resume"] is not None and (changed or text):
            new_step(state["resume"])       # the line of the call, after the function has returned
        state["resume"] = None if (changed or text) else state["resume"]
        cur = state["cur"]
        if cur is not None:
            if changed:
                cur.setdefault("set", {}).update(changed)
            if gone:
                cur.setdefault("unset", []).extend(gone)
                for k in gone:
                    cur.get("set", {}).pop(k, None)
            if text:
                cur["out"] = cur.get("out", "") + text
        state["snap"] = new
        out.seek(0)
        out.truncate()

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != PROGRAM:
            return None
        name = frame.f_code.co_name
        if name.startswith("<") and name != "<module>":
            return None                      # a lambda or a generator expression: no rows
        if event == "call":
            if name == "<module>":
                frames.append([frame, None])
            else:
                active = sum(1 for _, lb in frames if lb is not None and lb.split(" #")[0] == name)
                frames.append([frame, name if active == 0 else name + " #" + str(active + 1)])
                sync()                       # the parameters belong to the line of the call
                state["resume"] = None
            return tracer
        if event == "line":
            sync(finished(frame))
            state["resume"] = None
            wait = pending.pop(id(frame), None)
            if wait:
                wait[0]["test"] = "True" if frame.f_lineno == wait[1] else "False"
            last = pending_for.pop(id(frame), None)
            if last and not for_end and frame.f_lineno != last[1] and len(last[0]) == 1:
                steps.remove(last[0])        # the for loop has no more values: no row
            step = new_step(frame.f_lineno, frame)
            if frame.f_lineno in tests:
                pending[id(frame)] = (step, tests[frame.f_lineno])
            if frame.f_lineno in fors:
                pending_for[id(frame)] = (step, fors[frame.f_lineno])
        elif event == "exception":
            failed[id(frame)] = True
            pending.pop(id(frame), None)     # a condition that stops with an error has no result
            pending_for.pop(id(frame), None)
        elif event == "return":
            if name != "<module>" and state["frame"] != id(frame):
                sync()
                new_step(frame.f_lineno, frame)   # a called function has returned: this line continues, then returns
            sync(finished(frame))
            wait = pending.pop(id(frame), None)
            if wait:
                wait[0]["test"] = "False"
            last = pending_for.pop(id(frame), None)
            if last and not for_end and len(last[0]) == 1:
                steps.remove(last[0])
                state["cur"] = steps[-1] if steps else None
            for k in range(len(frames) - 1, -1, -1):
                if frames[k][0] is frame:
                    del frames[k]
                    break
            if name != "<module>":
                sync()                       # the local variables disappear on the line that returns
                if resume and frames:
                    state["resume"] = frames[-1][0].f_lineno
        return tracer

    scope = dict(vars(builtins))
    scope["input"] = fake_input
    globs = {"__builtins__": scope, "__name__": "__main__"}
    error = None
    old_cwd = os.getcwd()
    with tempfile.TemporaryDirectory() as folder:
        for fname, content in (files or {}).items():
            with open(os.path.join(folder, fname), "w", encoding="utf-8", newline="\n") as f:
                f.write(content)
        os.chdir(folder)
        compiled = compile(tree, PROGRAM, "exec")
        try:
            with contextlib.redirect_stdout(out):
                sys.settrace(tracer)
                try:
                    exec(compiled, globs)
                finally:
                    sys.settrace(None)
        except Exception as exc:             # the program stops with an error
            error = type(exc).__name__ + (": " + str(exc) if str(exc) and error_text != "name" else "")
        finally:
            os.chdir(old_cwd)
    # every change is already in the steps: the last event of a run is the return of the program frame
    cur = state["cur"]
    if error is not None and cur is not None:
        cur["out"] = cur.get("out", "") + error + "\n"

    # out -> print / end
    output = ""
    for step in steps:
        text = step.pop("out", None)
        if text is None:
            continue
        output += text
        if text.endswith("\n"):
            step["print"] = text[:-1]
        else:
            step["print"] = text
            step["end"] = ""
    names = []
    for step in steps:
        for k in step.get("set", {}):
            if k not in names:
                names.append(k)
    return {"code": lines, "steps": steps, "names": names, "output": output, "error": error}


# ---------- JS text ----------
def js(text):
    return json.dumps(text, ensure_ascii=False)


def key(name):
    return name if re.fullmatch(r"[A-Za-z_$][\w$]*", name) else js(name)


def flow_steps(steps, flow):
    """Steps of a flowchart: the shape of each line; two lines of one shape in a row are one step."""
    out = []
    last_line = None
    for step in steps:
        lineno = step["line"] + 1
        if lineno not in flow:
            raise SystemExit("flow: line " + str(lineno) + " has no shape")
        if flow[lineno] is None:             # a line without a shape (break)
            continue
        new = {"node": flow[lineno]}
        for k in ("test", "unset", "set", "print", "end"):
            if k in step:
                new[k] = step[k]
        prev = out[-1] if out else None
        if prev and prev["node"] == new["node"] and last_line is not None and lineno > last_line and "test" not in prev:
            prev.setdefault("set", {}).update(new.get("set", {}))
            if "print" in new:
                prev["print"] = (prev["print"] + prev.get("end", "\n") if "print" in prev else "") + new["print"]
                prev.pop("end", None)
                if "end" in new:
                    prev["end"] = new["end"]
            if not prev["set"]:
                del prev["set"]
        else:
            out.append(new)
        last_line = lineno
    return out


def step_js(step):
    parts = ["node: " + js(step["node"])] if "node" in step else ["line: " + str(step["line"])]
    if "test" in step:
        parts.append("test: " + js(step["test"]))
    if step.get("unset"):
        parts.append("unset: [" + ", ".join(js(k) for k in step["unset"]) + "]")
    if step.get("set"):
        parts.append("set: { " + ", ".join(key(k) + ": " + js(v) for k, v in step["set"].items()) + " }")
    if "print" in step:
        parts.append("print: " + js(step["print"]))
    if "end" in step:
        parts.append("end: " + js(step["end"]))
    return "{ " + ", ".join(parts) + " }"


def trace_js(entry, result, indent="  "):
    rows = []
    if entry.get("about"):
        rows.append(indent + "// " + entry["about"])
    rows.append(indent + "const " + entry["name"] + " = {")
    if entry.get("flow"):
        rows.append(indent + "  steps: [")
        rows.extend(indent + "    " + step_js(s) + "," for s in result["steps"])
        rows.append(indent + "  ],")
        rows.append(indent + "};")
        return "\n".join(rows)
    if entry.get("side"):
        rows.append(indent + "  side: true,")
    if entry.get("lang"):
        rows.append(indent + "  lang: " + js(entry["lang"]) + ",")
    rows.append(indent + "  code: [" + ", ".join(js(ln) for ln in result["code"]) + "],")
    rows.append(indent + "  steps: [")
    rows.extend(indent + "    " + step_js(s) + "," for s in result["steps"])
    rows.append(indent + "  ],")
    rows.append(indent + "};")
    return "\n".join(rows)


def show(entry, result):
    print("=" * 70)
    print(entry["name"], "-", len(result["steps"]), "rows,", len(result["names"]), "variables:", ", ".join(result["names"]))
    for step in result["steps"]:
        cells = [step["node"].ljust(6)] if "node" in step else [str(step["line"] + 1).rjust(3), result["code"][step["line"]].ljust(38)]
        if "test" in step:
            cells.append("[" + step["test"] + "]")
        if step.get("unset"):
            cells.append("unset " + ",".join(step["unset"]))
        if step.get("set"):
            cells.append("  ".join(k + "=" + v for k, v in step["set"].items()))
        if "print" in step:
            cells.append("| " + step["print"].replace("\n", "\\n") + ("" if "end" not in step else " (no line break)"))
        print(" ".join(cells))
    print("--- output ---")
    print(result["output"], end="" if result["output"].endswith("\n") or not result["output"] else "\n")
    print("--- " + fit(entry, result))


CHAR = 13.2      # px of one character of code at 24px
SLIDE = 1188     # px of a slide at 1280x720, the narrowest lecture screen


def fit(entry, result):
    """An estimate of the width of the slide at 1280x720 (the browser audit gives the real value)."""
    steps, code = result["steps"], result["code"]
    if not steps:
        return "no rows"
    if entry.get("flow"):
        return "flowchart: check the width of the chart and the table in the browser"
    longest = max(len(code[s["line"]]) for s in steps)
    values = {}
    for s in steps:
        for k, v in s.get("set", {}).items():
            values[k] = max(values.get(k, 0), len(v))
    # blank table: every variable has a box (93 px), and the first row shows its values;
    # filled table: the widest value of each variable
    given = {k: len(v) for k, v in steps[0].get("set", {}).items()}
    blank = sum(max(93, CHAR * len(k) + 21, CHAR * given.get(k, 0) + 41) for k in values) + (117 if entry.get("side") else 141)
    lines = [ln for s in steps if "print" in s for ln in s["print"].splitlines()]
    filled = sum(max(CHAR * len(k) + 21, CHAR * n + 41) for k, n in values.items()) + max([60] + [CHAR * len(ln) + 21 for ln in lines])
    test = 137 if any("test" in s for s in steps) else 0
    table = test + max(blank, filled)
    if entry.get("side"):
        panel = CHAR * max(len(ln) for ln in code) + 98
        width = panel + 20 + 64 + table
        note = "side: program " + str(round(panel)) + " px + table " + str(round(64 + table)) + " px"
        if len(code) > 14:
            note += "; the program has " + str(len(code)) + " lines (more than 14 do not fit beside the table)"
        if panel > SLIDE / 2:                # the program gets half of the slide at most
            width = max(width, SLIDE + panel - SLIDE / 2)
            note += "; a program line is too long (the limit is about 37 characters)"
    else:
        width = 77 + CHAR * (longest + 1) + 21 + table
        note = "inline: code column " + str(round(CHAR * (longest + 1) + 21)) + " px + other columns " + str(round(77 + table)) + " px"
    verdict = "fits" if width <= SLIDE else "TOO WIDE by " + str(round(width - SLIDE)) + " px (code lines or values will wrap)"
    return "width at 1280x720: about " + str(round(width)) + " of " + str(SLIDE) + " px, " + verdict + " (" + note + ")"


def load(topic):
    path = os.path.join(ROOT, "tools", "traces", topic + ".py")
    spec = importlib.util.spec_from_file_location("traces_" + topic, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.TRACES


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1 or not re.fullmatch(r"t\d\d", args[0]):
        sys.exit(__doc__)
    topic = args[0]
    only_show = "--show" in sys.argv
    entries = load(topic)
    blocks = []
    c_entries = [e for e in entries if e.get("lang") == "c" and "steps" not in e]
    steps_path = os.path.join(ROOT, "tools", "traces", topic + ".steps.json")
    if "--c-programs" in sys.argv:
        keys = ("name", "pre", "code", "post", "inputs", "hex", "indent")
        path = os.path.join(ROOT, "tools", "traces", topic + ".programs.json")
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            json.dump([{k: e[k] for k in keys if k in e} for e in c_entries], f, ensure_ascii=False, indent=1)
        print("Wrote", len(c_entries), "C programs to", os.path.relpath(path, ROOT))
        return
    c_steps = {}
    if c_entries:
        if not os.path.exists(steps_path):
            sys.exit("The steps of the C programs are missing: " + steps_path + "\nSee tools/c-trace.js.")
        with open(steps_path, encoding="utf-8") as f:
            c_steps = json.load(f)
    for entry in entries:
        if entry.get("lang") == "c" and "steps" not in entry:
            got = c_steps.get(entry["name"])
            if got is None:
                sys.exit(entry["name"] + ": no steps in " + steps_path + ". Run cTraceAll again (tools/c-trace.js).")
            entry = dict(entry, steps=got["steps"], code=entry["code"])
            want = entry.get("expect")
            if got.get("error"):
                print("!!!", entry["name"], "ENGINE ERROR:", got["error"])
            if want is not None and got.get("output", "").rstrip("\n") != want.rstrip("\n"):
                print("!!!", entry["name"], "OUTPUT DIFFERS FROM expect:", repr(got.get("output")), "expected", repr(want))
        if "steps" in entry:                 # steps that are given (a C program): only formatted
            result = {"code": entry["code"].strip("\n").split("\n"), "steps": entry["steps"], "names": [], "output": ""}
            for s in result["steps"]:
                for k in s.get("set", {}):
                    if k not in result["names"]:
                        result["names"].append(k)
                result["output"] += s.get("print", "") + s.get("end", "\n") if "print" in s else ""
        else:
            result = run_trace(entry["code"], entry.get("inputs", ()), entry.get("files"), entry.get("hide", ()),
                               entry.get("resume", False), entry.get("for_end", True), entry.get("max_steps", 400),
                               entry.get("error", "message"), entry.get("echo", True))
            if entry.get("display"):         # the slide shows other text (pseudocode) with the same line numbers
                shown = entry["display"].strip("\n").split("\n")
                if len(shown) != len(result["code"]):
                    sys.exit(entry["name"] + ": display has " + str(len(shown)) + " lines, the program has " + str(len(result["code"])))
                result["code"] = shown
                entry.setdefault("lang", "text")
            if entry.get("flow"):
                result["steps"] = flow_steps(result["steps"], entry["flow"])
        show(entry, result)
        blocks.append(trace_js(entry, result))
    if only_show:
        return
    path = os.path.join(ROOT, "js", "content", "topic" + topic[1:] + ".js")
    with open(path, encoding="utf-8", newline="") as f:
        text = f.read()
    nl = "\r\n" if "\r\n" in text else "\n"
    rows = text.split(nl)
    try:
        a = next(i for i, r in enumerate(rows) if BEGIN in r)
        b = next(i for i, r in enumerate(rows) if END in r)
    except StopIteration:
        sys.exit("The marker comments are missing in " + path + ". Add these two lines above App.registerTopic:\n"
                 '  /* ---------- trace challenges (generated: edit tools/traces/' + topic + '.py, then run "python tools/make-trace.py ' + topic + '") ---------- */\n'
                 "  /* ---------- end of the generated traces ---------- */")
    body = ("\n\n".join(blocks)).split("\n")
    rows[a + 1:b] = body
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(nl.join(rows))
    print("=" * 70)
    print("Wrote", len(blocks), "traces to", os.path.relpath(path, ROOT))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
