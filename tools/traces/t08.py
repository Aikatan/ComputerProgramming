"""Trace challenges of Topic 08 (Lesson 8). Build with: python tools/make-trace.py t08

Python level: t02-t07 material plus open / with, the file modes, csv, json, numpy, pandas.
A file object, a csv reader, and a DataFrame get no column: the programs store numbers, text,
and short lists in variables. The files of a program are in `files`; the slide shows their content.
NumPy and pandas numbers that are stored or printed are converted with int() or float(), and
lists with tolist(), so that the text is the same in every version of the libraries.
(round() of a NumPy float is still a NumPy float: its column would show np.float64(3.0).)
"""

TRACES = [
    # ---------------- Level 1: Lessons 1 and 2 (text files, modes, errors) ----------------
    dict(name="C_position", about="Level 1. The position in an open file: readline, read(n), readlines, and a read at the end.",
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
    dict(name="C_lines", about="Level 1. A line is a str with its line break: text is joined, numbers are added; an empty line.",
         side=True, files={"levels.txt": "12\n\n5\n"}, code=r'''
text = ""
total = 0
with open("levels.txt") as f:
    for line in f:
        line = line.strip()
        if line == "":
            continue
        text += line
        total += int(line)
print(text, total)
print(int(text) - total)
'''),
    dict(name="C_counter", about="Level 1. A missing file, then mode a: write() adds the digits at the end, with no line break.",
         side=True, code=r'''
for run in range(3):
    try:
        with open("n.txt") as f:
            count = int(f.read())
    except FileNotFoundError:
        count = 0
    count += 1
    with open("n.txt", "a") as f:
        f.write(str(count))
print(count)
'''),

    # ---------------- Level 2: Lessons 3 and 4 (CSV, JSON) ----------------
    dict(name="C_parts", about="Level 2. csv.reader: the header and an empty line are rows; every value is a str.",
         side=True, hide=["rows"], files={"parts.csv": "name,qty\nnut,40\n\npin,9\n"}, code=r'''
import csv
with open("parts.csv") as f:
    rows = list(csv.reader(f))
total = 0
for row in rows[1:]:
    if row == []:
        continue
    total += int(row[1])
print(len(rows), total)
print(rows[1][1] * 2)
'''),
    dict(name="C_fastest", about="Level 2. csv.DictReader: the values are text, so > compares the characters.",
         side=True, hide=["row"], files={"fans.csv": "fan,rpm\nA,800\nB,1200\nC,95\n"}, code=r'''
import csv
best = "0"
name = ""
with open("fans.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        rpm = row["rpm"]
        if rpm > best:
            best = rpm
            name = row["fan"]
print(name, best)
'''),
    dict(name="C_log", about="Level 2. json.load: a number, a text in quotes, and true keep their types; len() of a dictionary; json.dumps.",
         side=True, hide=["log"], files={"log.json": '{"t": [21, "19", 20.5], "ok": true}\n'}, code=r'''
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

    # ---------------- Level 3: Lesson 5 (NumPy) ----------------
    dict(name="C_twice", about="Level 3. The same operators on a list and on an array; / gives floats.", code=r'''
import numpy as np
nums = [4, 2]
arr = np.array(nums)
nums = nums * 2
arr = arr * 2
nums = nums + [1]
arr = arr / 2
arr = arr + 1
total = float(np.sum(arr))
print(len(nums), arr.size, total)
'''),
    dict(name="C_shapes", about="Level 3. Rows, columns, and axis of a 2-D array; line 10 stops: 2 elements and 3 elements.",
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

    # ---------------- Level 4: Lessons 6 and 7 (pandas) ----------------
    dict(name="C_pumps", about="Level 4. read_csv: the header is not a row; a new column, a filter, and a sort that is not stored.",
         files={"pumps.csv": "name,kw,h\nA,1,10\nB,5,4\nC,3,6\n"}, code=r'''
import pandas as pd
df = pd.read_csv("pumps.csv")
n = len(df)
avg = float(df["kw"].mean())
df["e"] = df["kw"] * df["h"]
big = df[df["kw"] >= avg]
big.sort_values("e")
names = big["name"].tolist()
total = int(big["e"].sum())
print(n, df.shape, total)
'''),
    dict(name="C_lowest", about="Level 4. A logical error: after a sort, loc[0] is the row with the label 0, not the first row (line 7).",
         files={"cells.csv": "name,v,ah\nA,4,5\nB,2,4\nC,3,6\n"}, code=r'''
import pandas as pd
df = pd.read_csv("cells.csv")
df["wh"] = df["v"] * df["ah"]
energy = df["wh"].tolist()
low = df.sort_values("wh")
order = low["name"].tolist()
name = low.loc[0]["name"]
print(name, min(energy))
'''),
]
