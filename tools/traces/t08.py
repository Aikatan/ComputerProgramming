"""Trace challenges of Topic 08 (Lesson 8). Build with: python tools/make-trace.py t08

Python level: t02-t07 material plus open / with, the file modes, csv, json, numpy, pandas.
A file object, a csv reader, a DataFrame, and a Series get no column: the programs store numbers,
text, and short lists in variables. The files of a program are in `files`; the slide shows each
file as a block above the program, so every file is small (2 to 4 short lines), and the
lines of a file and of its program are 12 or fewer together (side layout).
NumPy and pandas numbers are shown as Python numbers, and a 1-D array as print() shows it.
No program prints a whole DataFrame or Series: that text depends on the version of pandas.
Eight programs, in the order of the lessons; the last two have a missing line.
"""

TRACES = [
    dict(name="C_position", about="The position in an open file: readline, read(n), readlines, and a read at the end.",
         side=True, files={"pins.txt": "A1\nB22\nC3\n"}, code=r'''
with open("pins.txt") as f:
    head = f.readline()
    part = f.read(2)
    rest = f.readlines()
    last = f.read()
print(len(head), part)
print(rest[0].strip())
print(len(rest), len(last))
'''),
    dict(name="C_limit", about="A missing file: the except block runs. Mode a creates the file; write() adds no line break.",
         side=True, code=r'''
try:
    with open("limit.txt") as f:
        limit = int(f.read())
except FileNotFoundError:
    limit = 5
with open("limit.txt", "a") as f:
    f.write(str(limit))
    f.write("0\n")
with open("limit.txt") as f:
    text = f.read()
limit = limit + int(text)
print(len(text), limit)
'''),
    dict(name="C_parts", about="csv.reader: the header and an empty line are rows; every value is a str.",
         side=True, hide=["rows"], files={"parts.csv": "name,qty\nnut,40\n\npin,9\n"}, code=r'''
import csv
with open("parts.csv") as f:
    rows = list(csv.reader(f))
total = 0
for row in rows[1:]:
    if row != []:
        total += int(row[1])
print(total, rows[1][1] * 2)
'''),
    dict(name="C_log", about="json.load: a text in quotes, a number, and true keep their types; len() of a dictionary; json.dumps.",
         side=True, hide=["log"], files={"log.json": '{"t": ["19", 20.5], "ok": true}\n'}, code=r'''
import json
with open("log.json") as f:
    log = json.load(f)
total = 0
for t in log["t"]:
    t = t * 2
    total += float(t)
log["t"] = len(log)
print(total, log["ok"])
print(json.dumps(log))
'''),
    dict(name="C_shapes", about="Rows, columns, and axis of a 2-D array; line 10 stops: 2 elements and 3 elements.",
         side=True, hide=["data", "m"], error="name", code=r'''
import numpy as np
data = [[1, 0, 2], [2, 1, 3]]
m = np.array(data)
row = m[1]
col = m[:, 1]
tot = np.sum(m, axis=1)
col = col + tot
tot = np.sum(m, axis=0)
row = row + tot
out = col * tot
print(out)
'''),
    dict(name="C_pumps", about="read_csv: the header is not a row; a new column, a filter, a sort that is not stored; loc and iloc after a sort.",
         files={"pumps.csv": "name,kw,h\nA,1,10\nB,5,4\nC,3,6\n"}, code=r'''
import pandas as pd
df = pd.read_csv("pumps.csv")
n = len(df)
avg = df["kw"].mean()
df["e"] = df["kw"] * df["h"]
big = df[df["kw"] >= avg]
big.sort_values("e")
names = big["name"].tolist()
low = df.sort_values("e")
a = low.loc[1]["name"]
b = low.iloc[1]["name"]
print(n, df.shape)
print(a, b)
'''),
    dict(name="C_fans", missing=[5, 7], about="Missing lines 5 and 7: a value from csv.DictReader is text; int() converts it before the comparison.",
         side=True, hide=["row"], files={"fans.csv": "fan,rpm\nA,800\nB,95\n"}, code=r'''
import csv
best = 0
with open("fans.csv") as f:
    for row in csv.DictReader(f):
        rpm = int(row["rpm"])
        if rpm > best:
            best = rpm
print(best)
'''),
    dict(name="C_twice", missing=[4, 5, 7], about="Missing lines 4, 5 and 7: / on an array gives floats. * 2 repeats a list and multiplies an array.", code=r'''
import numpy as np
nums = [4, 2]
arr = np.array(nums)
nums = nums * 2
arr = arr * 2
nums = nums + [1]
arr = arr / 2
arr = arr + 1
total = np.sum(arr)
print(len(nums), arr.size, total)
'''),
]
