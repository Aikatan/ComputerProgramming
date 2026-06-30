/* ============================================================
   zz-examples.js — appends an "Examples" section to EACH sub-topic
   (lesson) so every sub-topic carries its own runnable code examples,
   ordered simplest-first. Keyed by "tNN.lesson-id".
   Loaded after all topics + zz-steprun, before zz-practice/app.js.
   ============================================================ */
(function () {
  // key: "topicId.lessonId" -> array of examples
  // Python example: { t, code }.  C example: { t, c, py }
  const E = {
    /* ---------- Topic 02 — Basics ---------- */
    "t02.errors": [
      { t: "Fix a TypeError", code: 'print("Age: " + str(25))   # str() makes the int joinable' },
      { t: "Spot a logical error (precedence)", code: '# average of 10 and 20 — parentheses fix the bug\nprint(10 + 20 / 2)     # wrong: 20.0\nprint((10 + 20) / 2)   # right: 15.0' },
    ],
    "t02.input-output": [
      { t: "sep and end", code: 'print("a", "b", "c", sep="-")\nprint("loading", end="... ")\nprint("done")' },
      { t: "Format numbers in an f-string", code: 'pi = 3.14159\nprint(f"{pi:.2f}")\nprint(f"{42:>6}|")   # right-aligned in 6 columns' },
    ],
    "t02.variables": [
      { t: "A name can change type", code: 'x = 5\nprint(x, type(x).__name__)\nx = "five"\nprint(x, type(x).__name__)' },
      { t: "Swap and multiple assignment", code: 'a, b = 1, 2\na, b = b, a\nprint(a, b)\nx = y = z = 0\nprint(x, y, z)' },
    ],
    "t02.values-in-memory": [
      { t: "Bits and ASCII", code: "print(bin(13))\nprint(ord('A'), '->', chr(65))" },
      { t: "Fixed-size wrap vs Python big ints", code: 'print((255 + 1) & 0xFF)   # 8-bit wrap -> 0\nprint(2 ** 64)            # Python never overflows' },
    ],
    "t02.python-memory": [
      { t: "is vs ==", code: 'a = [1, 2]\nb = a\nc = [1, 2]\nprint(a is b, a is c, a == c)' },
      { t: "Alias vs copy", code: 'a = [1, 2, 3]\nb = a\nb.append(9)\nprint("alias changed a:", a)\nc = a.copy()\nc.append(0)\nprint("copy left a:", a)' },
    ],
    "t02.data-types": [
      { t: "Inspect types", code: 'for v in [42, 3.14, "hi", True, [1]]:\n    print(v, "->", type(v).__name__)' },
      { t: "Convert between types", code: 'print(int("42") + 8)\nprint(float(7))\nprint(str(100) + "%")' },
    ],
    "t02.strings-numbers": [
      { t: "Slice a string three ways", code: 's = "Programming"\nprint(s[:4], s[-4:], s[::-1])' },
      { t: "The math module", code: 'import math\nprint(round(math.pi, 3))\nprint(math.sqrt(144), 2 ** 10)' },
    ],

    /* ---------- Topic 03 — Decisions & Loops ---------- */
    "t03.boolean": [
      { t: "Truthiness of values", code: 'for v in [0, 1, "", "hi", None, []]:\n    print(repr(v), "->", bool(v))' },
      { t: "Booleans are numbers", code: 'print(True + True + False)   # 2\nprint(int(5 > 3))' },
    ],
    "t03.operators": [
      { t: "Combine conditions", code: 'age = 20\nprint(age >= 18 and age < 65)' },
      { t: "Chained comparison & not", code: 'x = 5\nprint(1 <= x <= 10)\nprint(not (x == 5))' },
    ],
    "t03.if-elif-else": [
      { t: "Sign of a number", code: 'n = -4\nif n > 0:\n    print("positive")\nelif n < 0:\n    print("negative")\nelse:\n    print("zero")' },
      { t: "Grade several scores", code: 'for s in [95, 73, 55]:\n    g = "A" if s >= 80 else "B" if s >= 70 else "C" if s >= 60 else "F"\n    print(s, "->", g)' },
    ],
    "t03.loops": [
      { t: "Sum 1 to 10", code: 'total = 0\nfor i in range(1, 11):\n    total += i\nprint(total)' },
      { t: "Times table", code: 'for i in range(1, 6):\n    print(f"3 x {i} = {3 * i}")' },
      { t: "A triangle of stars", code: 'for r in range(1, 5):\n    print("*" * r)' },
    ],
    "t03.loop-control": [
      { t: "break out early", code: 'for n in range(10):\n    if n == 5:\n        break\n    print(n, end=" ")' },
      { t: "continue skips evens", code: 'for n in range(1, 11):\n    if n % 2 == 0:\n        continue\n    print(n, end=" ")' },
    ],

    /* ---------- Topic 04 — Flowchart & Pseudocode ---------- */
    "t04.flowchart-to-code": [
      { t: "Largest of two", code: 'a, b = 12, 8\nprint(max(a, b))' },
      { t: "Countdown loop", code: 'x = 3\nwhile x > 0:\n    print(x)\n    x -= 1\nprint("Go!")' },
    ],
    "t04.pseudocode": [
      { t: "Even or odd from pseudocode", code: 'number = 8\nprint("even" if number % 2 == 0 else "odd")' },
    ],

    /* ---------- Topic 05 — Functions & Modules ---------- */
    "t05.defining": [
      { t: "Return a value", code: 'def square(n):\n    return n * n\n\nprint(square(7))' },
      { t: "Return two values", code: 'def stats(nums):\n    return min(nums), max(nums)\n\nlo, hi = stats([4, 9, 1, 7])\nprint(lo, hi)' },
    ],
    "t05.scope": [
      { t: "Local vs global", code: 'x = 10\ndef show():\n    y = 5\n    print(x, y)\nshow()' },
      { t: "The global keyword", code: 'count = 0\ndef inc():\n    global count\n    count += 1\ninc(); inc()\nprint(count)' },
    ],
    "t05.recursion": [
      { t: "Recursive countdown", code: 'def down(n):\n    if n == 0:\n        return\n    print(n, end=" ")\n    down(n - 1)\ndown(5)' },
      { t: "Recursive sum to n", code: 'def s(n):\n    return 0 if n == 0 else n + s(n - 1)\nprint(s(100))' },
    ],
    "t05.arguments": [
      { t: "Default argument", code: 'def greet(name, msg="Hi"):\n    return f"{msg}, {name}"\nprint(greet("Sam"))\nprint(greet("Sam", "Yo"))' },
      { t: "**kwargs", code: 'def info(**kw):\n    for k, v in kw.items():\n        print(k, "=", v)\ninfo(a=1, b=2)' },
    ],
    "t05.modules": [
      { t: "math module", code: 'import math\nprint(math.gcd(12, 18))\nprint(math.factorial(5))' },
      { t: "random (seeded for a fixed result)", code: 'import random\nrandom.seed(0)\nprint(random.randint(1, 100))' },
    ],

    /* ---------- Topic 06 — Strings, Lists, Dicts ---------- */
    "t06.strings": [
      { t: "Clean up text", code: 's = "  Hello  "\nprint(s.strip().upper())' },
      { t: "count and replace", code: 't = "banana"\nprint(t.count("a"), t.replace("a", "A"))' },
    ],
    "t06.lists": [
      { t: "Build a list", code: 'nums = [1, 2, 3]\nnums.append(4)\nnums.insert(0, 0)\nprint(nums)' },
      { t: "List comprehensions", code: 'print([n * n for n in range(1, 6)])\nprint([n for n in range(10) if n % 2 == 0])' },
    ],
    "t06.dictionaries": [
      { t: "Access with a default", code: 'p = {"name": "Al", "age": 30}\nprint(p["name"], p.get("city", "N/A"))' },
      { t: "Count words", code: 'c = {}\nfor w in "a b a c a".split():\n    c[w] = c.get(w, 0) + 1\nprint(c)' },
    ],
    "t06.list-vs-dict": [
      { t: "Membership in each", code: 'nums = [1, 2, 3]\nd = {"a": 1}\nprint(2 in nums, "a" in d)' },
    ],

    /* ---------- Topic 07 — Plots & Exceptions ---------- */
    "t07.matplotlib-basics": [
      { t: "A line plot", code: 'import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [1, 4, 9])\nplt.show()' },
      { t: "Style the line", code: 'import matplotlib.pyplot as plt\nplt.plot([1,2,3], [2,1,3], marker="o", color="r", linestyle="--")\nplt.title("Demo"); plt.grid(True)\nplt.show()' },
    ],
    "t07.chart-types": [
      { t: "Bar chart", code: 'import matplotlib.pyplot as plt\nplt.bar(["a", "b", "c"], [3, 7, 2])\nplt.show()' },
      { t: "Scatter plot", code: 'import matplotlib.pyplot as plt\nplt.scatter([1, 2, 3, 4], [2, 4, 1, 8])\nplt.show()' },
    ],
    "t07.exceptions": [
      { t: "try / except", code: 'try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print("no divide by zero")' },
      { t: "else and finally", code: 'try:\n    x = int("42")\nexcept ValueError:\n    print("bad number")\nelse:\n    print("ok", x)\nfinally:\n    print("done")' },
    ],

    /* ---------- Topic 08 — Files, NumPy & Pandas ---------- */
    "t08.file-handling": [
      { t: "Write then read", code: 'with open("a.txt", "w") as f:\n    f.write("hi\\n")\nwith open("a.txt") as f:\n    print(f.read())' },
      { t: "Sum numbers from a file", code: 'with open("n.txt", "w") as f:\n    for i in range(1, 6):\n        f.write(f"{i}\\n")\ntotal = sum(int(line) for line in open("n.txt"))\nprint(total)' },
    ],
    "t08.csv-json": [
      { t: "JSON round-trip", code: 'import json\nd = {"x": 1, "y": [2, 3]}\ns = json.dumps(d)\nprint(s)\nprint(json.loads(s)["y"])' },
      { t: "CSV round-trip", code: 'import csv\nwith open("d.csv", "w", newline="") as f:\n    csv.writer(f).writerows([["a", "b"], [1, 2]])\nwith open("d.csv") as f:\n    print(list(csv.reader(f)))' },
    ],
    "t08.numpy": [
      { t: "Element-wise math", code: 'import numpy as np\na = np.array([1, 2, 3, 4])\nprint(a * 10)' },
      { t: "2-D arrays", code: 'import numpy as np\nm = np.array([[1, 2], [3, 4]])\nprint(m.sum(), m.sum(axis=0))' },
    ],
    "t08.pandas": [
      { t: "A DataFrame column mean", code: 'import pandas as pd\ndf = pd.DataFrame({"x": [1, 2, 3]})\nprint(df["x"].mean())' },
      { t: "Filter rows", code: 'import pandas as pd\ndf = pd.DataFrame({"name": ["A", "B", "C"], "age": [20, 35, 28]})\nprint(df[df["age"] > 25])' },
    ],

    /* ---------- Topic 09 — Algorithms & Efficiency ---------- */
    "t09.what-is-algorithm": [
      { t: "Linear vs quadratic work", code: 'n = 50\nprint("linear   :", n)\nprint("quadratic:", n * n)' },
    ],
    "t09.big-o": [
      { t: "How many steps for binary search?", code: 'import math\nfor n in [10, 1000, 1_000_000]:\n    print(f"n={n:>9,}  log2={int(math.log2(n))}")' },
    ],
    "t09.searching": [
      { t: "Linear search", code: 'def find(a, t):\n    for i, v in enumerate(a):\n        if v == t:\n            return i\n    return -1\nprint(find([3, 6, 9], 9))' },
      { t: "Binary search", code: 'def bs(a, t):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        m = (lo + hi) // 2\n        if a[m] == t: return m\n        elif a[m] < t: lo = m + 1\n        else: hi = m - 1\n    return -1\nprint(bs([1, 3, 5, 7, 9], 7))' },
    ],
    "t09.sorting": [
      { t: "Built-in sort", code: 'print(sorted([5, 2, 8, 1]))\nprint(sorted(["pear", "fig"], key=len))' },
      { t: "Bubble sort by hand", code: 'a = [5, 1, 4, 2]\nfor i in range(len(a)):\n    for j in range(len(a) - 1 - i):\n        if a[j] > a[j + 1]:\n            a[j], a[j + 1] = a[j + 1], a[j]\nprint(a)' },
    ],
    "t09.data-structures": [
      { t: "A set removes duplicates fast", code: 'print(sorted(set([1, 1, 2, 3, 3, 3])))' },
    ],
    "t09.efficient-python": [
      { t: "Comprehension over a loop", code: 'print([n * 2 for n in range(5)])' },
      { t: "join beats += for strings", code: 'parts = ["a", "b", "c", "d"]\nprint("".join(parts))' },
    ],

    /* ---------- Topic 10 — Programming in C (C + Python twin) ---------- */
    "t10.why-c": [
      { t: "Hello world", c: '#include <stdio.h>\nint main(void) {\n    puts("Hello, World!");\n    return 0;\n}', py: 'print("Hello, World!")' },
    ],
    "t10.types": [
      { t: "Declare and add typed numbers", c: 'int    a = 7, b = 2;\nint    q = a / b;            // 3 (integer division)\ndouble exact = (double)a / b; // 3.5', py: 'a, b = 7, 2\nprint(a // b)   # 3\nprint(a / b)    # 3.5' },
    ],
    "t10.control-flow": [
      { t: "Sum 1..5 with a for loop", c: 'int total = 0;\nfor (int i = 1; i <= 5; i++) {\n    total = total + i;   // ends at 15\n}', py: 'total = 0\nfor i in range(1, 6):\n    total += i\nprint(total)' },
    ],
    "t10.functions": [
      { t: "A typed add function", c: 'int add(int a, int b) {\n    return a + b;\n}\n// add(3, 4) -> 7', py: 'def add(a, b):\n    return a + b\nprint(add(3, 4))' },
    ],
    "t10.pointers": [
      { t: "Swap via pointers", c: 'void swap(int *x, int *y) {\n    int tmp = *x; *x = *y; *y = tmp;\n}\n// after swap(&a,&b): a and b are exchanged', py: 'a, b = 1, 2\na, b = b, a       # Python needs no pointers\nprint(a, b)' },
    ],
    "t10.arrays-strings": [
      { t: "Sum an array with a loop", c: 'int arr[4] = {10, 20, 30, 40};\nint sum = 0;\nfor (int i = 0; i < 4; i++) {\n    sum += arr[i];   // 100\n}', py: 'arr = [10, 20, 30, 40]\nprint(sum(arr))' },
    ],
    "t10.memory": [
      { t: "Heap allocation (C) vs automatic (Python)", c: '#include <stdlib.h>\nint *p = malloc(4 * sizeof(int)); // ask the heap\np[0] = 7;\nfree(p);                          // you must free it', py: '# Python allocates and frees for you\nnums = [0, 0, 0, 0]\nnums[0] = 7\nprint(nums)   # garbage-collected automatically' },
    ],
  };

  function findLesson(key) {
    const dot = key.indexOf(".");
    const t = (App.TOPICS || []).find((x) => x.id === key.slice(0, dot));
    return t && t.lessons.find((l) => l.id === key.slice(dot + 1));
  }

  Object.keys(E).forEach((key) => {
    const lesson = findLesson(key);
    if (!lesson || !lesson.learn) return;
    if (lesson.learn.some((b) => b.__examples)) return; // idempotent
    lesson.learn.push({ type: "subhead", text: "Examples", __examples: true });
    E[key].forEach((ex) => {
      if (ex.c) {
        lesson.learn.push({ type: "example", lang: "c", caption: ex.t, code: ex.c });
        if (ex.py) lesson.learn.push({ type: "livecode", title: ex.t + " (Python)", code: ex.py });
      } else {
        lesson.learn.push({ type: "livecode", title: ex.t, code: ex.code });
      }
    });
  });
})();
