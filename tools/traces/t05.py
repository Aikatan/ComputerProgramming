"""Trace challenges of Topic 05 (Lesson 7). Build with: python tools/make-trace.py t05

Basic statements only (the lecturer's rule, 2026-10-03): def, parameters, return, default and
keyword arguments, local and global names, a call inside a call, and recursion. No *args, no
global statement, no return of two values, no module.
Eight programs, in the order of the lessons; the last two have missing lines.

Row style: the row of return removes the local variables and also holds what the line of the
call then does with the returned value (it stores, displays, or passes the value), as the
chapter's own trace exercise does. Names are short because a local variable has a wide
column ("v (half)").
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
    dict(name="C_first", hide=["limit (first)"], about="A return inside a loop ends the function at once; the second call ends the loop and returns 0.", side=True, code='''
def first(limit):
    for n in range(1, 3):
        if n * 10 >= limit:
            return n
    return 0

a = first(15)
b = first(50)
print(a, b)
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
    dict(name="C_nested", about="Each function has its own v; a call inside a function; / gives a float.", side=True, code='''
def half(v):
    v = v + 6
    return v / 2

def diff(v):
    w = half(v * 3)
    return w - v

x = half(2)
print(x, diff(x))
'''),
    dict(name="C_recur", about="A function that calls itself: n + n // 2 + n // 4 + ... + 1. The calls return in reverse order: 1, then 4, then 10.", side=True, code='''
def f(n):
    if n > 1:
        n = n + f(n // 2)
    return n

print(f(6))
'''),
    dict(name="C_low", missing=[3, 4], about="Missing lines 3 and 4: the two return lines of a function with an if.", side=True, code='''
def low(a, b):
    if a > b:
        return b
    return a

x = low(7, 3)
y = low(x, x + 4)
x = low(y - 1, x)
print(x, y)
'''),
    dict(name="C_total", missing=[4, 8], about="Missing lines 4 and 8: an assignment inside a function makes a local variable; a function can read a global variable.", side=True, code='''
total = 10

def add(n):
    total = n + 1
    return total

def scale(k):
    return total * k

x = add(5)
y = scale(3)
print(total, x, y)
'''),
]
