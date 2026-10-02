"""Trace challenges of Topic 07 (Lesson 5). Build with: python tools/make-trace.py t07

Python level: t02-t06 (if, loops, functions, lists, dicts), then try / except / else / finally
(Lesson 3) and errors in functions, raise, assert (Lesson 4).
Eight programs, in the order of the lessons; the last two have a missing line.
A trace table cannot show a chart: the first program builds the lists that a line plot receives.
No program calls matplotlib.
A list or dict that never changes is hidden (hide), so that the table has no constant column.
"""

TRACES = [
    dict(name="C_points", about="The lists of a line plot: x gets a value in each iteration, y only for a reading above 0.",
         side=True, hide=["raw"], code='''
raw = [21, -1]
x = []
y = []
for i in range(2):
    x.append(i * 2)
    if raw[i] > 0:
        y.append(raw[i])
print(x)
print(y)
'''),
    dict(name="C_count", about="Line 4 completes, line 5 fails, line 6 is skipped; the second except block matches.",
         side=True, inputs=["3"], code='''
total = 30
count = 0
try:
    count = int(input("Count: "))
    total = total / (count - 3)
    count = count + 1
except ValueError:
    total = -1
except ZeroDivisionError:
    total = total + count
print(total, count)
'''),
    dict(name="C_volts", about="No error: else, then finally. The same statement fails later; except Exception matches.",
         side=True, code='''
cells = 4
volts = 12
try:
    volts = volts / cells
except ZeroDivisionError:
    volts = 0
else:
    cells = cells - 4
finally:
    volts = volts + 1
try:
    volts = volts / cells
except Exception:
    print(volts, cells)
'''),
    dict(name="C_texts", about="A try statement in a loop: after the handled error, r keeps the value of the text before it, and the loop continues.",
         side=True, code='''
total = 0
for text in ["8", "x", "2"]:
    try:
        r = int(text)
        total = total + 24 // r
    except ValueError:
        total = total + r
print(total, r)
'''),
    dict(name="C_stock", about="else and finally in a loop. The first error matches the except block; the second matches none: finally runs, then the program stops.",
         side=True, hide=["stock"], error="name", code='''
stock = {"r1": 5, "c1": 0}
for part in ["d1", "c1"]:
    try:
        n = 10 // stock[part]
    except KeyError:
        n = 0
    else:
        print("ok", n)
    finally:
        print(part, n)
print("end")
'''),
    dict(name="C_chain", about="An error passes through two functions to the try statement of the main program.",
         side=True, code='''
def cell(c):
    return 12 // c
def show(n):
    v = cell(n)
    print("cell", v)
    return v
total = show(4)
try:
    total += show(0)
    total += show(2)
except ZeroDivisionError:
    total = total - 1
print(total)
'''),
    dict(name="C_step", missing=[3, 4], about="Missing lines 3 and 4: the raise statement. The except line gives the type, and the output gives the message.",
         side=True, code='''
def step(v):
    if v > 20:
        raise ValueError("high")
    return v + 10
level = 20
try:
    level = step(level)
    level = step(level)
    level = step(level)
except ValueError as e:
    print(e, level)
    level = level * 2
print(level)
'''),
    dict(name="C_checks", missing=[3, 5], about="Missing lines 3 and 5: the return of the except block. The function handles its own error; the second assert fails.",
         side=True, code='''
def num(t):
    try:
        return int(t)
    except ValueError:
        return 0
first = num("2a")
last = num("-3")
try:
    assert first >= 0, "first"
    assert last >= 0, "last"
    print(first + last)
except AssertionError as e:
    print("bad", e)
'''),
]
