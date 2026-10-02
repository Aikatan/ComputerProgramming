"""Trace challenges of Topic 09 (Lesson 8). Build with: python tools/make-trace.py t09

Python level: everything from Topics 02 to 08, and the algorithms of this chapter (counting steps,
linear search, binary search, the pass, bubble sort, a program of functions).
No f-strings. Every program is in the side layout: the students write the number of the line that runs.
Eight programs, in the order of the lessons; the last two have a missing line.

Rows: a binary search costs 3 rows before the loop and 5 rows for each iteration, so a search ends
after 2 iterations. A swap with t costs 3 rows, so the bubble sort has one swap.

Width (a table with the column Condition): 13.2 px x the longest program line + the columns of the
variables must be 728 px or less. A variable is 93 px; a list of four one-digit numbers is 200 px,
and a list of three is 160 px. A program line has 37 characters or fewer. So:
- the constant list of a search has no column (hide), and the program beside the table shows it;
- binary search is in the main program (a local variable is named "low (binary_search)": too wide);
- the swap in one line, a[j], a[j + 1] = a[j + 1], a[j], is 39 characters inside a loop and an if,
  and 43 characters inside two loops and an if: both sorting programs swap with a temporary variable t;
- C_bubble (list of three, i, j; n and t have no column) writes the loops as range(1, n) and
  range(n - i): the line "for j in range(n - 1 - i):" is 2 characters too long;
- C_swap (list of four, j, t) has no column for n;
- the parameters of the functions of C_valid have no column.
"""

TRACES = [
    # ---------------- Lesson 2 (counting steps, halving) ----------------
    dict(name="C_halve", side=True,
         about="Halving with >=: the loop also runs for n = 1. 7 // 2 is 3, 3 // 2 is 1, and 1 // 2 is 0.", code='''
n = 7
count = 0
while n >= 1:
    count = count + 1
    n = n // 2
print("Count:", count)
'''),

    # ---------------- Lesson 3 (linear search, binary search) ----------------
    dict(name="C_linear", side=True, hide=["codes"],
         about="Linear search with break: the search stops at the first match, after 2 comparisons. The for line does not run again.", code='''
codes = [8, 22, 15, 22]
pos = -1
steps = 0
for i in range(len(codes)):
    steps = steps + 1
    if codes[i] == 22:
        pos = i
        break
print(pos, steps)
'''),
    dict(name="C_binary", side=True, hide=["ids"],
         about="Binary search, target present: low moves, then (3 + 4) // 2 is 3. mid is an index, and the program compares ids[mid].", code='''
ids = [4, 9, 13, 17, 22]
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
         about="Binary search, target absent: high moves, then low moves. The loop ends when low is greater than high.", code='''
ids = [3, 8, 12, 17]
low = 0
high = len(ids) - 1
while low <= high:
    mid = (low + high) // 2
    if ids[mid] == 5:
        print("Found at", mid)
        break
    elif ids[mid] < 5:
        low = mid + 1
    else:
        high = mid - 1
if low > high:
    print("Not found")
'''),

    # ---------------- Lesson 4 (bubble sort) ----------------
    dict(name="C_bubble", side=True, hide=["n", "t"],
         about="Bubble sort with nested loops: i counts the passes from 1, and pass i compares n - i pairs. Pass 2 runs although the list is sorted.", code='''
a = [4, 9, 6]
n = len(a)
for i in range(1, n):
    for j in range(n - i):
        if a[j] > a[j + 1]:
            t = a[j]
            a[j] = a[j + 1]
            a[j + 1] = t
print(a)
'''),

    # ---------------- Lesson 7 (a program of functions) ----------------
    dict(name="C_valid", side=True,
         about="A function that returns True or False, called in a loop: only valid readings are added and counted.", code='''
def valid(v):
    return 1 <= v <= 5

total = 0
count = 0
for r in [5, 7]:
    if valid(r):
        total = total + r
        count = count + 1
print(total / count)
'''),

    # ---------------- Missing line ----------------
    dict(name="C_low", side=True, missing=[6, 11], hide=["temps"],
         about="Missing lines 6 and 11: low = mid + 1. Its two rows: mid is 1 and low becomes 2; mid is 2 and low becomes 3.", code='''
temps = [15, 18, 22]
low = 0
high = len(temps) - 1
pos = -1
while low <= high:
    mid = (low + high) // 2
    if temps[mid] == 25:
        pos = mid
        break
    elif temps[mid] < 25:
        low = mid + 1
    else:
        high = mid - 1
print("Position:", pos)
'''),
    dict(name="C_swap", side=True, missing=[6, 7], hide=["n"],
         about="Missing lines 6 and 7: a[j] = a[j + 1], the second line of a swap with t. Its two rows: a[0] gets the value of a[1]; a[2] gets the value of a[3].", code='''
a = [5, 2, 9, 3]
n = len(a)
for j in range(n - 1):
    if a[j] > a[j + 1]:
        t = a[j]
        a[j] = a[j + 1]
        a[j + 1] = t
print(a)
'''),
]
