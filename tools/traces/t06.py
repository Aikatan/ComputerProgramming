"""Trace challenges of Topic 06 (Lesson 7). Build with: python tools/make-trace.py t06

Python level: t02 to t05 (if, loops, functions) plus strings, lists, tuples, dictionaries, sets.
No try, no files, no f-strings. A set holds small integers only, so that its order is fixed
(every set of these programs is displayed in increasing order).
Width: a list or a dictionary fills its column in every row, so the values are short.
The line that stops (C_stop) is not an if or while line: the tool would give it a Condition.
"""

TRACES = [
    # ---------------- Level 1: Lesson 1 (strings) ----------------
    dict(name="C_message", about="Level 1. strip() without assignment, find() on the old text, find() gives -1, index -1.", code='''
msg = " Temp:25C "
msg.strip()
pos = msg.find(":")
msg = msg.strip().lower()
num = msg[pos:-1]
low = msg.find("T")
unit = msg[low]
print(msg[:pos], num[::-1])
print(unit, num.isdigit())
'''),
    dict(name="C_unit", about="Level 1. A loop over the characters: '.' is not a digit; ch + unit and unit + ch; a chain of methods.", side=True, code='''
num = ""
unit = ""
for ch in "3.5kW":
    if ch.isdigit():
        num = num + ch
    elif ch in "kMG":
        unit = ch + unit
    else:
        unit = unit + ch
print(num, unit[::-1])
print(unit.lower().find("W"))
'''),

    # ---------------- Level 2: Lessons 2 and 3 (lists, list methods) ----------------
    dict(name="C_levels", about="Level 2. insert and remove move the elements; append adds a list as one element; pop returns it.", code='''
levels = [4, 9, 6]
levels.insert(1, levels[-1])
levels.remove(6)
top = levels.pop(1)
levels.append([top, 1])
n = len(levels)
last = levels.pop()
levels.extend(last)
del levels[n - 4]
print(levels, n)
'''),
    dict(name="C_names", about="Level 2. Two names for one list, a slice is a copy, sort() returns None, a new list for an old name.", code='''
data = [7, 3]
view = data
saved = data[:]
view.append(5)
saved.insert(0, data[-1])
res = view.sort()
view = view[1:]
view[0] = saved[0] * 2
data.reverse()
print(data[0], view[0])
print(res)
'''),
    dict(name="C_loops", about="Level 2. The loop variable does not change the list; index -1 when i is 0; a changed element is used again.", side=True, code='''
amp = [2, 5, 3]
step = []
for a in amp:
    a = a * len(step)
    step.append(a)
for i in range(len(amp)):
    amp[i] = step[i] + amp[i - 1]
print(sum(amp))
'''),

    # ---------------- Level 3: Lessons 4 and 5 (tuples, dictionaries) ----------------
    dict(name="C_limits", about="Level 3. Packing, unpacking, a list made from a tuple is a copy, (x) is not a tuple, a slice of a tuple.", code='''
lim = 2, 8
low, high = lim
low, high = high - low, low
vals = list(lim)
vals[0] = low
one = (vals[1])
lim = lim[:1]
print(lim, one, high in lim)
'''),
    dict(name="C_stock", about="Level 3. get() adds no key, an existing key keeps its place, in tests the keys, pop() and popitem().", code='''
stock = {"R": 5, "C": 2}
n = stock.get("L", 9)
stock["C"] = stock["R"] + n
stock["L"] = stock.pop("R")
found = 5 in stock
key, n = stock.popitem()
stock[key] = len(stock)
print(stock["L"], n, found)
'''),
    dict(name="C_bins", about="Level 3. An unnamed program: a histogram. A dictionary keeps the order in which its keys were added.", side=True, code='''
bins = {}
for t in [24, 31, 27, 9]:
    b = t // 10
    bins[b] = bins.get(b, 0) + 1
for b, n in bins.items():
    print(b * 10, "*" * n)
'''),

    # ---------------- Level 4: Lesson 6 (sets) and combinations ----------------
    dict(name="C_pins", about="Level 4. A set stores a value once, an operator returns a new set, discard() of a missing element, set().", code='''
pins = [3, 5, 3, 1]
used = set(pins)
free = {2, 3, 4} - used
used | free
free.add(len(used))
used.discard(4)
both = used & free
used = used - both
both = used & free
print(len(used), both)
'''),
    dict(name="C_stop", about="Level 4. 2 stays in the set, so the loop does not end; remove() of a missing element stops with a KeyError.", error="name", side=True, code='''
todo = {1, 2, 3}
done = []
n = 3
while len(todo) > 0:
    todo.remove(n)
    done.append(n)
    n = n - 2
print(done)
'''),
]
