"""Trace challenges of Topic 06 (Lesson 7). Build with: python tools/make-trace.py t06

Python level: t02 to t05 (if, loops, functions) plus strings, lists, tuples, dictionaries, sets.
No try, no files, no f-strings. A set holds small integers only, so that its order is fixed
(every set of these programs is displayed in increasing order).
Width: a list or a dictionary fills its column in every row, so the values are short.
Eight programs, in the order of the lessons; the last one has a missing line.
"""

TRACES = [
    dict(name="C_message", about="strip() without assignment, find() on the old text, find() gives -1, index -1.", code='''
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
    dict(name="C_unit", about="A loop over the characters: '.' is not a digit; ch + unit puts the character in front; a chain of methods.", side=True, code='''
num = ""
unit = ""
for ch in "3.5k":
    if ch.isdigit():
        num = num + ch
    else:
        unit = ch + unit
print(num, unit.upper().find("k"))
'''),
    dict(name="C_levels", about="insert and remove move the elements; append adds a list as one element; pop returns it.", code='''
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
    dict(name="C_names", about="Two names for one list, a slice is a copy, sort() returns None, a new list for an old name.", code='''
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
    dict(name="C_limits", about="Packing, unpacking, a list made from a tuple is a copy, (x) is not a tuple, a slice of a tuple.", code='''
lim = 2, 8
low, high = lim
low, high = high - low, low
vals = list(lim)
vals[0] = low
one = (vals[1])
lim = lim[:1]
print(lim, one, high in lim)
'''),
    dict(name="C_stock", about="get() adds no key, an existing key keeps its place, in tests the keys, pop() and popitem().", code='''
stock = {"R": 5, "C": 2}
n = stock.get("L", 9)
stock["C"] = stock["R"] + n
stock["L"] = stock.pop("R")
found = 5 in stock
key, n = stock.popitem()
stock[key] = len(stock)
print(stock["L"], n, found)
'''),
    dict(name="C_pins", about="A set stores a value once, an operator returns a new set, discard() of a missing element, set().", code='''
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
    dict(name="C_bins", missing=[3, 4], about="Missing lines 3 and 4: counting with get(). A new key starts at 0, and an existing key keeps its place.", side=True, code='''
bins = {}
for t in [24, 9, 27]:
    b = t // 10
    bins[b] = bins.get(b, 0) + 1
print(bins)
'''),
]
