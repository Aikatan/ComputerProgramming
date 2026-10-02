"""Trace challenges of Topic 02 (Lesson 9). Build with: python tools/make-trace.py t02

Python level: print, variables, int / float / str / bool, arithmetic, input, strings.
No if, loops, lists, or functions. Each program has one line that is easy to trace wrongly.
"""

TRACES = [
    # ---------------- Level 1: Lessons 1 and 2 (output, variables) ----------------
    dict(name="C_tanks", about="Level 1. A swap through a third variable, then a swap that loses a value.", code='''
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
    dict(name="C_values", about="Level 1. A variable stores a value, not a formula; +=, -=, several names in one line, sep and end.", code='''
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

    # ---------------- Level 2: Lessons 3 to 5 (data types, memory, arithmetic) ----------------
    dict(name="C_coins", about="Level 2. // and % in a chain: the same variable keeps the rest.", code='''
amount = 87
tens = amount // 10
amount = amount % 10
fives = amount // 5
amount = amount % 5
print(tens, fives, amount)
print(tens * 10 + fives * 5 + amount)
'''),
    dict(name="C_digits", about="Level 2. An unnamed program: r holds the digits of n in reverse order.", code='''
n = 472
a = n // 100
b = n // 10 % 10
c = n % 10
r = c * 100 + b * 10 + a
print(r)
print(n - r)
'''),
    dict(name="C_order", about="Level 2. The order of operations, and int and float results.", code='''
a = 7
b = 2
c = a / b
d = a // b * b
a = a % b + d ** 2
c = c * b - d
b = -b ** 2 + a // 3
print(a, b, c)
print(type(c), round(c / 3, 2))
'''),

    # ---------------- Level 3: Lessons 6 and 7 (input, strings) ----------------
    dict(name="C_digits_text", about="Level 3. Text digits are joined; numbers are added. int() removes the fraction.", inputs=["12", "5"], code='''
a = input("A: ")
b = input("B: ")
text = a + b
total = int(a) + int(b)
n = int(int(a) / int(b))
text = text * n
total = total + len(text)
print(text, total)
'''),
    dict(name="C_code", about="Level 3. Slices, str() and *, and a method call that changes nothing.", code='''
code = "TMP36-A"
left = code[:3].lower()
num = int(code[3:5])
num = num // 10 + num % 10
tag = code[-1] + str(num) * 2
code = left + "-" + tag
code.upper()
print(code, len(code))
'''),
    dict(name="C_report", about="Level 3. The whole chapter in one program: input, slices, conversion, arithmetic, reassignment, sep.", inputs=["12.5V2A"], code='''
msg = input("Data: ")
value = float(msg[:4])
value = value * int(msg[-2])
value = value * 90 / 60
whole = int(value)
value = value - whole
tag = msg[4] + msg[-1]
tag = tag.lower() + str(whole)
whole = whole % 10 * len(tag)
print(tag, value, sep=":")
print("=" * (whole // 10))
print(whole)
'''),

    # ---------------- Level 4: Lesson 8 (errors) ----------------
    dict(name="C_rise", about="Level 4. A logical error: the first wrong value is on line 3 (parentheses are missing).", code='''
t1 = 20
t2 = 24
mean = t1 + t2 / 2
rise = mean - t1
percent = rise / t1 * 100
print(percent, "%")
'''),
    dict(name="C_stop", about="Level 4. Lines 3, 5, and 6 look wrong but run; line 7 stops with a ValueError.", inputs=["4"], error="name", side=True, code='''
width = input("Width: ")
height = 3
area = width * height
print("Area =", area)
last = area[height - 1]
count = int(area) // 100
side = int(width + ".0")
print("Side =", side)
'''),
]
