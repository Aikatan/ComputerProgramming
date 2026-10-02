"""Trace challenges of Topic 03 (Lesson 8). Build with: python tools/make-trace.py t03

Python level: Topic 02 plus bool, comparisons, and / or / not, if / elif / else, while, for,
range(), nested loops, break, continue, pass, and the else of a loop.
No lists, dicts, functions, or try. Each program has one line that is easy to trace wrongly.
Eight programs, in the order of the lessons; the last one has a missing line.
"""

TRACES = [
    dict(name="C_battery", about="A bool is a stored value: ok stays True after volt changes. < at a limit; 13.0 == 13.", code='''
volt = 11.5
low = volt < 11.5
ok = 11.5 <= volt < 13
volt = volt + 1.5
high = volt >= 13
same = volt == 13
low = low or not ok
print(ok and high, same)
'''),
    dict(name="C_logic", about="not, then and, then or; parentheses; or stops at the first True, so line 6 does not divide.", code='''
x = 6
y = 0
p = x > 5 or y > 5 and x < 3
q = (x > 5 or y > 5) and x < 3
p = not q or p and y > 0
q = y == 0 or x / y > 2
p = not (p and q) or bool(y)
print(p, q)
'''),
    dict(name="C_tank", about="The same condition in lines 3 and 10: an elif chain runs one block; a separate if is checked again.", side=True, code='''
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
    dict(name="C_mode", about="Line 4 is True for every mode (2 is truthy); 0 is falsy; the else belongs to the if of line 4.", side=True, code='''
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
    dict(name="C_fan", about="A while condition with or: the loop continues while one side is True. 60 > 60 and 40 > 40 are False.", side=True, code='''
temp = 80
fan = 2
while temp > 60 or fan < 3:
    temp = temp - 10 * fan
    if not temp > 40:
        fan = fan + 1
print(temp, fan)
'''),
    dict(name="C_control", about="continue, pass, and break in one loop. The else of line 7 belongs to the if; break skips the else of the loop (line 10).", side=True, code='''
total = 0
for n in range(2, 6):
    if n % 2 == 0 and total < 3:
        continue
    elif n == 3 or total > 5:
        pass
    else:
        break
    total = total + n
else:
    total = -1
print(n, total)
'''),
    dict(name="C_rows", about="range(1, 4, 2) gives 1 and 3. break ends only the inner loop and skips its else; range(4, 4) is empty, and the else runs.", side=True, code='''
for i in range(1, 4, 2):
    for j in range(i + 1, 4):
        if i * j % 2 == 1 and j > 2:
            break
        print(i, j)
    else:
        print("row", i, "ends")
print(i, j)
'''),
    dict(name="C_range", missing=[4, 6], about="Missing lines 4 and 6: total grows by k (10, then 6). range(14, 2, -4) gives 14, 10, 6; after the loop, k is 6.", side=True, code='''
total = 0
for k in range(14, 2, -4):
    if k % 3 == 0 or 8 < k <= 12:
        total = total + k
    else:
        total = total - 1
print(k, total)
'''),
]
