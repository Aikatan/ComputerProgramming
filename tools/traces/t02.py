"""Trace challenges of Topic 02 (Lesson 9). Build with: python tools/make-trace.py t02

Python level: print, variables, int / float / str / bool, arithmetic, input, strings.
No if, loops, lists, or functions. Each program has one line that is easy to trace wrongly.
Seven programs with basic statements only (no method, no slice), in the order of the lessons;
the last two have missing lines.
"""

TRACES = [
    dict(name="C_tanks", about="A swap through a third variable, then a swap that loses a value.", code='''
tank_a = 30
tank_b = 70
temp = tank_a
tank_a = tank_b
tank_b = temp
print(tank_a, tank_b)
tank_a = tank_b
tank_b = tank_a
print(tank_a, tank_b)
'''),
    dict(name="C_values", about="A variable stores a value, not a formula; +=, -=, several names in one line, sep and end.", code='''
x = 4
y = x + 1
x = x * 2
total = x + y
y -= 3
x, y = y, x
total += x
x = y = total - 10
print(x, y, total, sep="-", end="!")
print(x + y)
'''),
    dict(name="C_order", about="The order of operations, and int and float results.", code='''
a = 7
b = 2
c = a / b
d = a // b * b
a = a % b + d ** 2
c = c * b - d
b = -b ** 2 + a // 3
print(a, b, c)
'''),
    dict(name="C_digits_text", about="Text digits are joined; numbers are added. int() removes the fraction.", inputs=["12", "5"], code='''
a = input("A: ")
b = input("B: ")
text = a + b
total = int(a) + int(b)
n = int(int(a) / int(b))
text = text * n
total = total + len(text)
print(text, total)
'''),
    dict(name="C_code", about="Indexes of a string: the last index is n - 1. Text digits are converted before they are added.", code='''
code = "TMP36"
n = len(code)
last = code[n - 1]
num = int(code[3]) + int(last)
tag = code[0] + str(num)
print(tag, n)
'''),
    dict(name="C_coins", missing=[3, 4], about="Missing lines 3 and 4: the same variable keeps the rest of the division.", code='''
amount = 87
tens = amount // 10
amount = amount % 10
fives = amount // 5
amount = amount % 5
print(tens, fives, amount)
print(tens * 10 + fives * 5 + amount)
'''),
    dict(name="C_digits", missing=[2, 3, 4], about="Missing lines 2, 3 and 4: the middle digit. r holds the digits of n in reverse order.", code='''
n = 472
a = n // 100
b = n // 10 % 10
c = n % 10
r = c * 100 + b * 10 + a
print(r)
print(n - r)
'''),
]
