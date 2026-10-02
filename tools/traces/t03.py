"""Trace challenges of Topic 03 (Lesson 8). Build with: python tools/make-trace.py t03

Python level: Topic 02 plus bool, comparisons, and / or / not, if / elif / else, while, for,
range(), nested loops, break, continue, pass, and the else of a loop.
No lists, dicts, functions, or try. Each program has one line that is easy to trace wrongly.
"""

TRACES = [
    # ---------------- Level 1: Lessons 1 and 2 (comparisons, logical operators) ----------------
    dict(name="C_battery", about="Level 1. A bool is a stored value: ok stays True after volt changes. < at a limit; 13.0 == 13.", code='''
volt = 11.5
low = volt < 11.5
ok = 11.5 <= volt < 13
volt = volt + 1.5
high = volt >= 13
same = volt == 13
low = low or not ok
print(ok and high, same)
'''),
    dict(name="C_logic", about="Level 1. not, then and, then or; parentheses; or stops at the first True, so line 6 does not divide.", code='''
x = 6
y = 0
p = x > 5 or y > 5 and x < 3
q = (x > 5 or y > 5) and x < 3
p = not q or p and y > 0
q = y == 0 or x / y > 2
p = not (p and q) or bool(y)
print(p, q)
'''),

    # ---------------- Level 2: Lesson 3 (if, elif, else) ----------------
    dict(name="C_tank", about="Level 2. The same condition in lines 3 and 10: an elif chain runs one block; a separate if is checked again.", side=True, code='''
level = 45
drain = False
if level >= 80 or drain:
    level = level - 30
elif level >= 40 and not drain:
    level = level + 40
    drain = True
elif level >= 20:
    level = 0
if level >= 80 or drain:
    level = level - 30
if not drain or level > 50:
    drain = False
print(level, drain)
'''),
    dict(name="C_mode", about="Level 2. Line 4 is True for every mode (2 is truthy); 0 is falsy; the else belongs to the if of line 4.", side=True, code='''
code = 0
mode = 3
state = "X"
if mode == 1 or 2:
    if code and mode > 2:
        state = "R"
    elif not code:
        code = mode % 2
    if code:
        state = state + "!"
else:
    state = "S"
print(state, code)
'''),

    # ---------------- Level 3: Lessons 4 and 5 (while, for, range) ----------------
    dict(name="C_range", about="Level 3. range(14, 2, -4) gives 14, 10, 6: the stop value 2 is excluded. After the loop, k is 6.", side=True, code='''
total = 0
for k in range(14, 2, -4):
    if k % 3 == 0 or 8 < k <= 12:
        total = total + k
    else:
        total = total - 1
print(k, total)
'''),
    dict(name="C_fan", about="Level 3. A while condition with or: the loop continues while one side is True. 60 > 60 is False.", side=True, code='''
temp = 70
fan = 1
while temp > 60 or fan < 3:
    temp = temp - 10 * fan
    if not temp > 50:
        fan = fan + 1
print(temp, fan)
'''),
    dict(name="C_heater", about="Level 3. A heater with two limits: four iterations, four different paths. 70 < 70 is False.", side=True, code='''
temp = 78
on = True
for t in range(4):
    if on and temp >= 80:
        on = False
    elif not on and temp < 70:
        on = True
    if on:
        temp = temp + 4
    else:
        temp = temp - 12
print(temp, on)
'''),

    # ---------------- Level 4: Lessons 6 and 7 (nested loops, loop control) ----------------
    dict(name="C_control", about="Level 4. pass, continue, and break in one loop; break skips the else of the loop.", side=True, code='''
total = 0
for n in range(1, 5):
    if n == 1:
        pass
    elif n % 2 == 0 and total < 4:
        continue
    if total > 3 or n == 5:
        break
    total = total + n
else:
    total = -1
print(n, total)
'''),
    dict(name="C_rows", about="Level 4. break ends only the inner loop and skips its else; the else runs after a normal end, also for an empty range.", side=True, code='''
for i in range(1, 4):
    for j in range(i + 1, 4):
        if i * j % 2 == 1 and j > 2:
            break
        print(i, j)
    else:
        print("row", i, "ends")
print(i, j)
'''),
    dict(name="C_divide", about="Level 4. Line 5 does not stop for d = 0 (and stops at the first False); line 9 stops with a ZeroDivisionError.", error="name", side=True, code='''
n = 9
d = 3
while True:
    d = d - 1
    if d != 0 and n % d != 0:
        continue
    if d < 0:
        break
    print(d, n // d)
print("End")
'''),
]
