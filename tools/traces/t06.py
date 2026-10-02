"""Trace challenges of Topic 06 (Lesson 7). Build with: python tools/make-trace.py t06

Basic operations only (the lecturer's rule, 2026-10-03): indexing, len(), assignment to an
element, append(), in, loops, and a dictionary with d[key]. No method or function that only
Python has (no find, isdigit, strip, sort, pop, get, set(), tuples, slices).
Eight programs, in the order of the lessons; the last one has two missing lines.
Width: a list or a dictionary fills its column in every row, so the values are short.
"""

TRACES = [
    dict(name="C_chars", about="Indexes of a string: the last index is n - 1, and n // 2 is the middle.", code='''
code = "T2-K9"
n = len(code)
first = code[0]
last = code[n - 1]
mid = code[n // 2]
tag = last + mid + first
print(tag, n)
'''),
    dict(name="C_unit", about="A loop over the characters: characters are compared as text; ch + unit puts the new character in front.", side=True, code='''
text = "2mA"
num = ""
unit = ""
for ch in text:
    if "0" <= ch <= "9":
        num = num + ch
    else:
        unit = ch + unit
print(num, unit)
'''),
    dict(name="C_levels", about="Elements of a list: an index on both sides, append(), and len() after the list grows.", code='''
levels = [4, 9, 6]
levels[0] = levels[2] + 1
levels.append(levels[0] - levels[1])
n = len(levels)
levels[n - 1] = levels[n - 2] * 2
top = levels[1] + levels[3]
print(levels, top)
'''),
    dict(name="C_names", about="Two names for one list: view = data is not a copy; a new list for view ends the shared name.", code='''
data = [7, 3]
view = data
saved = [data[0], data[1]]
view[0] = 5
data[1] = view[0] + saved[0]
saved[1] = data[1] * 2
view = [0]
print(data, saved, view)
'''),
    dict(name="C_loops", about="The loop variable is a copy of the element: line 4 does not change the list; an index does.", side=True, code='''
amp = [2, 5]
total = 0
for a in amp:
    a = a * 2
    total = total + a
for i in range(len(amp)):
    amp[i] = amp[i] + i
print(amp, total)
'''),
    dict(name="C_best", hide=["temps"], about="The position of the largest element: best holds an index, not a value.", side=True, code='''
temps = [21, 30, 26]
best = 0
for i in range(1, len(temps)):
    if temps[i] > temps[best]:
        best = i
print(best, temps[best])
'''),
    dict(name="C_pins", about="A dictionary: a new key, a changed value, len(), and in tests the keys (1 is a value, not a key).", code='''
pins = {3: 1, 5: 0}
pins[5] = pins[3] + 1
pins[8] = pins[5] - 2
n = len(pins)
found = 1 in pins
pins[3] = pins[3] + n
print(pins[3], n, found)
'''),
    dict(name="C_bins", missing=[5, 7], about="Missing lines 5 and 7: counting with a dictionary. A key that exists is increased; a new key starts at 1.", side=True, code='''
bins = {}
for t in [24, 9, 27]:
    b = t // 10
    if b in bins:
        bins[b] = bins[b] + 1
    else:
        bins[b] = 1
print(bins[2], len(bins))
'''),
]
