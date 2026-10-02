"""Trace challenges of Topic 05 (Lesson 7). Build with: python tools/make-trace.py t05

Python level: t02 to t04 material plus def, return, import. No lists, dicts, or try.
*args appears only with a for loop. No f-strings.

All programs use the side layout: the students write the number of the line that runs.
All programs use the default rows of the tool (no resume), as the trace exercise of Lesson 2
(T_area) does: the row of return removes the local variables and also holds what the line of
the call then does with the returned value (it stores, displays, or passes the value).
A line with two calls of functions of the program gets no row between the calls: the row of
the first return also holds the parameters of the second call. Only C_nested (line 12) has
such a line, and its task says so. Do not write "f(a) + f(b)" in one line.
A function that stops with an error loses its local variables in the row of the error, so
the program of C_stop stops in a line of the main program.
Names are short because a local variable has a wide column ("v (half)").
"""

TRACES = [
    # ---------------- Level 1: Lessons 1 and 2 (defining, parameters, return) ----------------
    dict(name="C_two", about="Level 1. One function returns a value, the other only displays: the call line stores None.", side=True, code='''
def half(v):
    return v / 2

def show(v):
    print("V =", v)

a = half(9)
b = show(a)
a = half(a)
print(a, b)
'''),
    dict(name="C_low", about="Level 1. Two return values; a return in an if ends the function; the targets of line 7 are y, x.", side=True, code='''
def low(a, b):
    if a > b:
        return b, a
    return a, b

x, y = low(7, 3)
y, x = low(x, y + 1)
x, y = low(x, y)
print(x, y)
'''),
    dict(name="C_heat", about="Level 1. A return inside a loop ends the function; the second call ends the loop and returns 0.", side=True, code='''
def heat(t):
    for n in range(1, 3):
        t = t + 10
        if t >= 40:
            return n
    return 0

a = heat(30)
print(a, heat(a))
'''),

    # ---------------- Level 2: Lesson 3 (positional, keyword, default arguments, *args) ----------------
    dict(name="C_drop", about="Level 2. A default that is replaced by position, keyword arguments in another order, a default that is kept.", side=True, code='''
def drop(v, r=10, i=2):
    return v - r * i

x = drop(60)
x = drop(100, x)
print(x)
x = drop(i=1, v=x)
x = drop(x * 9, i=x // 2)
print(x)
'''),
    dict(name="C_top", about="Level 2. *args with 2, 0, and 2 arguments: with no argument the loop does not run; hi starts at 0.", side=True, hide=["temps"], code='''
def top(*temps):
    hi = 0
    for t in temps:
        if t > hi:
            hi = t
    return hi

a = top(35, 28)
print(top())
b = top(-4, -a)
print(a, b)
'''),

    # ---------------- Level 3: Lesson 4 (scope) ----------------
    dict(name="C_boost", about="Level 3. A parameter with the name of a global variable; a returned value that is lost; a global variable that is read.", side=True, code='''
gain = 2
level = 10

def boost(level):
    level = level * gain
    return level

boost(level)
print(level)
gain = boost(gain + 1)
level = boost(level)
print(level, gain)
'''),
    dict(name="C_total", about="Level 3. global changes the global variable; without global the assignment is local; add() returns None.", side=True, code='''
total = 10
def add(n):
    global total
    total = total + n

def clear():
    total = 0
    return total

add(5)
x = clear()
print(total, x)
x = add(x + 2)
print(total, x)
'''),

    # ---------------- Level 4: Lessons 5 and 6 (nested calls, recursion, modules) ----------------
    dict(name="C_nested", about="Level 4. Each call has its own v; math.sqrt returns a float; in line 12, diff(9) runs before root.", side=True, code='''
import math

def root(v):
    v = v + 7
    return math.sqrt(v)

def diff(v):
    w = root(v * 2)
    return w - v

print(diff(1))
x = root(diff(9) + 6)
print(x)
'''),
    dict(name="C_recur", about="Level 4. An unnamed program: n + n // 2 + n // 4 + ... + 1. The calls return in reverse order: 1, then 4, then 10.", side=True, code='''
def f(n):
    if n > 1:
        n = n + f(n // 2)
    return n

print(f(6))
'''),
    dict(name="C_stop", about="Level 4. Lines 10 to 12 look wrong but run (None, a name without parentheses); line 13 stops with a NameError.", error="name", side=True, code='''
from math import floor

def half(n):
    return floor(n / 2)

def show(n):
    h = half(n)
    print("half:", h)

a = show(9)
half
print(a)
b = math.floor(4.5)
print(b)
'''),
]
