"""Trace challenges of Topic 07 (Lesson 5). Build with: python tools/make-trace.py t07

Python level: t02-t06 (if, loops, functions, lists, dicts), then try / except / else / finally
(Lesson 3) and errors in functions, raise, assert (Lesson 4).
A trace table cannot show a chart: the two programs of Level 1 build the data that a chart
receives, and the task asks one question about the chart. No program calls matplotlib.
A list or dict that never changes is hidden (hide), so that the table has no constant column;
the task text of the slide says so.
"""

TRACES = [
    # ---------------- Level 1: Lessons 1 and 2 (the data of a chart) ----------------
    dict(name="C_points", about="Level 1. x gets 3 values and y gets 2: plt.plot(x, y) stops with a ValueError.",
         side=True, hide=["raw"], code='''
raw = [21, -1, 26]
x = []
y = []
for i in range(3):
    x.append(i * 2)
    if raw[i] > 0:
        y.append(raw[i])
print(x)
print(y)
'''),
    dict(name="C_bins", about="Level 1. The bin counts of plt.hist(data, bins=3): a value on a bin edge, and the largest value.",
         side=True, code='''
counts = [0, 0, 0]
for v in [13, 16, 10, 14]:
    i = (v - 10) // 2
    if i == 3:
        i = 2
    counts[i] += 1
print(counts)
'''),

    # ---------------- Level 2: Lesson 3 (try, except, else, finally) ----------------
    dict(name="C_count", about="Level 2. Line 4 completes, line 5 fails, line 6 is skipped; the second except block matches.",
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
    dict(name="C_volts", about="Level 2. No error: else, then finally. The same statement fails later; except Exception matches.",
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
    dict(name="C_pins", about="Level 2. The key exists, the index does not: IndexError. else is skipped, finally runs.",
         side=True, hide=["pins", "levels"], code='''
pins = {"led": 2, "fan": 5}
levels = [0, 1, 1]
state = -1
try:
    pin = pins["fan"]
    state = levels[pin]
except KeyError:
    print("no pin")
except IndexError:
    print("no level")
else:
    state = state + 1
finally:
    print(pin, state)
'''),

    # ---------------- Level 3: Lesson 3 (a try statement inside a loop) ----------------
    dict(name="C_texts", about="Level 3. The loop continues after each handled error; r keeps the value of the last valid text.",
         side=True, code='''
total = 0
r = 1
for text in ["8", "x", "0", "4"]:
    try:
        r = int(text)
        total = total + 24 // r
    except ValueError:
        total = total + r
    except ZeroDivisionError:
        r = 2
print(total, r)
'''),
    dict(name="C_stock", about="Level 3. else and finally in a loop. The third error matches no except block: finally runs, then the program stops.",
         side=True, hide=["stock"], error="name", code='''
stock = {"r1": 5, "c1": 0}
used = 0
for part in ["r1", "d1", "c1"]:
    try:
        n = 10 // stock[part]
    except KeyError:
        print("no", part)
    else:
        used = used + n
    finally:
        print(part, n)
print("used", used)
'''),

    # ---------------- Level 4: Lesson 4 (errors in functions, raise, assert) ----------------
    dict(name="C_chain", about="Level 4. An error passes through two functions to the try statement of the main program.",
         side=True, code='''
def cell(c):
    return 12 // c
def show(n):
    v = cell(n)
    print("cell", v)
    return v
total = 0
try:
    total += show(4)
    total += show(0)
    total += show(2)
except ZeroDivisionError:
    total = total - 1
print(total)
'''),
    dict(name="C_step", about="Level 4. 20 > 20 is False; raise ends the function, so level keeps 30. The loop continues after the handled error.",
         side=True, code='''
def step(v):
    if v > 20:
        raise ValueError("high")
    return v + 10
level = 10
while level < 40:
    try:
        level = step(level)
    except ValueError as e:
        print(e, level)
        level = level * 2
print(level)
'''),
    dict(name="C_assert", about="Level 4. The function handles its own error; assert passes twice, then stops the program on line 9.",
         side=True, error="name", code='''
def num(t):
    try:
        return int(t)
    except ValueError:
        return 0
total = 0
for text in ["5", "2a", "-3"]:
    n = num(text)
    assert n >= 0, "negative"
    total = total + n
print(total)
'''),
]
