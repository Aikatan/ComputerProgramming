"""Trace challenges of Topic 05 (Lesson 7). Build with: python tools/make-trace.py t05

Python level: t02 to t04 material plus def, return, import. No lists, dicts, or try.
*args appears only with a for loop. No f-strings.
Eight programs, in the order of the lessons; the last two have a missing line.

All programs use the side layout: the students write the number of the line that runs.
All programs use the default rows of the tool (no resume), as the trace exercise of Lesson 2
(T_area) does: the row of return removes the local variables and also holds what the line of
the call then does with the returned value (it stores, displays, or passes the value).
A line with two calls of functions of the program gets no row between the calls: no program
has such a line. Do not write "f(a) + f(b)" or "f(g(a))" in one line.
A line "global name" gets no row. Only C_total has one, and its table is complete.
Names are short because a local variable has a wide column ("v (half)").
"""

TRACES = [
    dict(name="C_two", about="One function returns a value, the other only displays: the call line stores None.", side=True, code='''
def half(v):
    return v / 2

def show(v):
    print("V =", v)

a = half(9)
b = show(a)
a = half(a)
print(a, b)
'''),
    dict(name="C_drop", about="A default that is replaced by position, keyword arguments in another order, a default that is kept.", side=True, code='''
def drop(v, r=10, i=2):
    return v - r * i

x = drop(60)
x = drop(100, x)
print(x)
x = drop(i=1, v=x)
x = drop(x * 9, i=x // 2)
print(x)
'''),
    dict(name="C_first", about="*args with 3 and 0 arguments: a return inside the loop ends the function (40 is not tested); with no argument the loop does not run.", side=True, hide=["temps"], code='''
def first(*temps):
    for t in temps:
        if t > 30:
            return t
    return 0

a = first(28, 35, 40)
print(a, first())
'''),
    dict(name="C_boost", about="A parameter with the name of a global variable; a returned value that is lost; a global variable that is read.", side=True, code='''
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
    dict(name="C_nested", about="Each call has its own v: line 9 uses the v of diff. math.sqrt returns a float.", side=True, code='''
import math

def root(v):
    v = v + 7
    return math.sqrt(v)

def diff(v):
    w = root(v * 3)
    return w - v

x = root(2)
print(x, diff(x))
'''),
    dict(name="C_recur", about="n + n // 2 + n // 4 + ... + 1. The calls return in reverse order: 1, then 4, then 10.", side=True, code='''
def f(n):
    if n > 1:
        n = n + f(n // 2)
    return n

print(f(6))
'''),
    dict(name="C_low", missing=[3, 4], about="Missing lines 3 and 4: return b, a. Its two rows store the smaller value first; the targets of line 7 are y, x.", side=True, code='''
def low(a, b):
    if a > b:
        return b, a
    return a, b

x, y = low(7, 3)
y, x = low(x, y + 1)
x, y = low(x, y)
print(x, y)
'''),
    dict(name="C_total", missing=[4, 8], about="Missing lines 4 and 8: total = total + n. global makes it change the global variable; clear() changes a local total; add() returns None.", side=True, code='''
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
]
