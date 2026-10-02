"""Trace challenges of Topic 09 (Lesson 8). Build with: python tools/make-trace.py t09

Python level: everything from Topics 02 to 08, and the algorithms of this chapter (counting steps,
linear search, binary search, the pass, bubble sort, list search and lookup, a program of functions).
No f-strings. Every program is in the side layout: the students write the number of the line that runs.

Width (a table with the column Condition): 13.2 px x the longest program line + the columns of the
variables must be 728 px or less. A variable is 93 px; a list of four one-digit numbers is 200 px,
and a list of three is 160 px. A program line has 37 characters or fewer. So:
- the constant list of a search has no column (hide), and the program beside the table shows it;
- binary search is in the main program (a local variable is named "low (binary_search)": too wide);
- the swap in one line, a[j], a[j + 1] = a[j + 1], a[j], is 39 characters inside a loop and an if,
  and 43 characters inside two loops and an if: both sorting programs swap with a temporary variable t;
- C_passes (list of four, j, t) has two passes as two loops, with no variable i;
- C_bubble (list of three, i, j; t has no column) writes the loops as range(1, n) and range(n - i):
  the line "for j in range(n - 1 - i):" is 2 characters too long;
- the parameters of the functions of C_logs have no column.
"""

TRACES = [
    # ---------------- Level 1: Lessons 1 and 2 (counting steps, nested loops, halving) ----------------
    dict(name="C_halve", side=True,
         about="Level 1. Halving with >=: the loop also runs for n = 1, and 3 // 2 is 1.", code='''
n = 12
count = 0
while n >= 1:
    count = count + 1
    n = n // 2
print("Count:", count)
'''),
    dict(name="C_pairs", side=True,
         about="Level 1. The inner range depends on i: 3 + 2 + 1 + 0 steps, not 4 x 4. For i = 3 the inner loop is empty.", code='''
n = 4
pairs = 0
for i in range(n):
    for j in range(i + 1, n):
        pairs = pairs + 1
print("Pairs:", pairs)
'''),

    # ---------------- Level 2: Lesson 3 (linear search, binary search) ----------------
    dict(name="C_match", side=True, hide=["codes"],
         about="Level 2. A search that continues keeps the last match; a search with break stops at the first match.", code='''
codes = [8, 22, 22, 15]
last = -1
for i in range(len(codes)):
    if codes[i] == 22:
        last = i
first = -1
for i in range(len(codes)):
    if codes[i] == 22:
        first = i
        break
print(first, last)
'''),
    dict(name="C_binary", side=True, hide=["ids"],
         about="Level 2. Binary search, target present: low moves, high moves, then low == high and one element is left.", code='''
ids = [4, 9, 13, 17, 22, 28]
low = 0
high = len(ids) - 1
while low <= high:
    mid = (low + high) // 2
    if ids[mid] == 17:
        print("Found at", mid)
        break
    elif ids[mid] < 17:
        low = mid + 1
    else:
        high = mid - 1
if low > high:
    print("Not found")
'''),
    dict(name="C_absent", side=True, hide=["ids"],
         about="Level 2. Binary search, target absent: the loop ends when low is greater than high.", code='''
ids = [3, 8, 12, 17, 21, 26]
low = 0
high = len(ids) - 1
while low <= high:
    mid = (low + high) // 2
    if ids[mid] == 10:
        print("Found at", mid)
        break
    elif ids[mid] < 10:
        low = mid + 1
    else:
        high = mid - 1
if low > high:
    print("Not found")
'''),
    dict(name="C_stuck", side=True, hide=["ids", "high"],
         about="Level 2. An error: low = mid keeps the element mid, so low, high, and mid stop changing. The counter step ends the loop.", code='''
ids = [4, 9, 13, 17]
low = 0
high = len(ids) - 1
step = 0
while low <= high and step < 4:
    step = step + 1
    mid = (low + high) // 2
    if ids[mid] == 17:
        print("Found at", mid)
        break
    elif ids[mid] < 17:
        low = mid
    else:
        high = mid - 1
'''),

    # ---------------- Level 3: Lesson 4 (the pass, bubble sort) ----------------
    dict(name="C_passes", side=True, hide=["n"],
         about="Level 3. Pass 1 and pass 2 as two loops: 3 comparisons, then 2. A swap with t takes three lines.", code='''
a = [2, 4, 1, 3]
n = len(a)
for j in range(n - 1):
    if a[j] > a[j + 1]:
        t = a[j]
        a[j] = a[j + 1]
        a[j + 1] = t
for j in range(n - 2):
    if a[j] > a[j + 1]:
        t = a[j]
        a[j] = a[j + 1]
        a[j + 1] = t
print(a)
'''),
    dict(name="C_bubble", side=True, hide=["n", "t"],
         about="Level 3. Bubble sort with nested loops: i counts the passes from 1, and pass i compares n - i pairs. Pass 2 runs although the list is sorted.", code='''
a = [3, 1, 2]
n = len(a)
for i in range(1, n):
    for j in range(n - i):
        if a[j] > a[j + 1]:
            t = a[j]
            a[j] = a[j + 1]
            a[j + 1] = t
print(a)
'''),

    # ---------------- Level 4: Lessons 5 to 7 (list search and lookup, a program of functions) ----------------
    dict(name="C_lookup", side=True, hide=["names", "volts"],
         about="Level 4. Two list searches: break ends only the inner loop; an absent name costs n comparisons.", code='''
names = ["pump", "fan", "lamp"]
volts = [220, 110, 12]
steps = 0
for q in ["fan", "led"]:
    for i in range(len(names)):
        steps = steps + 1
        if names[i] == q:
            print(q, volts[i])
            break
print("Steps:", steps)
'''),
    dict(name="C_logs", side=True, error="name", hide=["logs", "v (valid)", "a (mean)"],
         about="Level 4. Two functions: the second log has no valid reading, so mean() divides by zero. Line 5 stops; line 13 called it.", code='''
def valid(v):
    return 1 <= v <= 5

def mean(a):
    return sum(a) / len(a)

logs = [[5, 7], [0, 9]]
for log in logs:
    kept = []
    for r in log:
        if valid(r):
            kept.append(r)
    print(mean(kept))
'''),
]
