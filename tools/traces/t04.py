"""Trace challenges of Topic 04 (Lesson 5). Build with: python tools/make-trace.py t04

Six flowcharts (flow=...) and two pseudocode texts (display=...); the last one has a missing line. The traced program is
the Python form of the chart or of the pseudocode: t02-t03 material only (no lists, no def).

A flowchart: each line of the program is one shape (the shape ids are those of the chart
object G_... in js/content/topic04.js). Loops are written with while, so that the test and
the update are shapes of their own. A break line has no shape (None).
Pseudocode: the program has a comment line where the pseudocode has END IF, END WHILE, or
END FOR, so that both texts have the same line numbers.
"""

TRACES = [
    dict(name="C_swap", about="A sequence: three processes exchange two values without a third variable.",
         inputs=["3", "8"], echo=False, flow={1: "i1", 2: "i2", 3: "p1", 4: "p2", 5: "p3", 6: "d"}, code='''
a = int(input())
b = int(input())
a = a + b
b = a - b
a = a - b
print(a, b)
'''),
    dict(name="C_cost", about="Two decisions in a row: the second one tests the value that the first one changed.",
         inputs=["520"], echo=False, flow={1: "i", 2: "q1", 3: "p1", 4: "q2", 5: "p2", 6: "d"}, code='''
cost = int(input())
if cost > 500:
    cost = cost - 50
if cost > 480:
    cost = cost - 20
print(cost)
'''),
    dict(name="C_double", about="The update comes before DISPLAY: a value that fails the test is displayed.",
         flow={1: "a", 2: "q", 3: "b", 4: "d"}, code='''
x = 1
while x < 8:
    x = x * 2
    print(x)
'''),
    dict(name="C_count", about="A loop that repeats an input, with a decision inside: 30 is not above 30.",
         inputs=["28", "35", "30", "0"], echo=False,
         flow={1: "a", 2: "i1", 3: "q1", 4: "q2", 5: "c", 6: "i2", 7: "d"}, code='''
n = 0
t = int(input())
while t != 0:
    if t > 30:
        n = n + 1
    t = int(input())
print(n)
'''),
    dict(name="C_break", about="Two exits of a loop: the break exit is taken before the loop test fails.",
         flow={1: "a", 2: "q1", 3: "q2", 4: None, 5: "b", 6: "d"}, code='''
x = 50
while x < 100:
    if x % 4 == 0:
        break
    x = x + 15
print(x)
'''),
    dict(name="C_nest", about="A loop inside a loop: the inner counter starts again, and its limit is the outer counter. In the first outer pass the inner loop does not run.",
         flow={1: "a", 2: "q1", 3: "c", 4: "q2", 5: "d", 6: "v", 7: "u"}, code='''
i = 1
while i < 3:
    j = 1
    while j < i:
        print(i * j)
        j = j + 1
    i = i + 1
'''),
    dict(name="C_chain", about="FOR with IF / ELSE IF: 6 passes the first condition, so ELSE IF is not tested.",
         side=True, inputs=["6"], echo=False, display='''
INPUT n
SET total TO 0
FOR i FROM 3 TO n
    IF i % 2 == 0 THEN
        SET total TO total + i
    ELSE IF i % 3 == 0 THEN
        SET total TO total - i
    END IF
END FOR
DISPLAY total
''', code='''
n = int(input())
total = 0
for i in range(3, n + 1):
    if i % 2 == 0:
        total = total + i
    elif i % 3 == 0:
        total = total - i
    # END IF
# END FOR
print(total)
'''),
    dict(name="C_level", about="Missing lines 5 and 7 (the ELSE branch). WHILE with IF / ELSE: the branch changes during the loop, and the last pass goes below the limit.",
         side=True, missing=[5, 7], display='''
SET level TO 70
SET count TO 0
WHILE level > 20
    IF level > 60 THEN
        SET level TO level - 30
    ELSE
        SET level TO level - 15
    END IF
    INCREMENT count BY 1
END WHILE
DISPLAY count
DISPLAY level
''', code='''
level = 70
count = 0
while level > 20:
    if level > 60:
        level = level - 30
    else:
        level = level - 15
    # END IF
    count = count + 1
# END WHILE
print(count)
print(level)
'''),
]
