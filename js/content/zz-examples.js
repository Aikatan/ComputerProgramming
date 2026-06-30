/* ============================================================
   zz-examples.js — appends an "Examples" section to EACH sub-topic
   (lesson) so every sub-topic carries its own runnable code examples,
   ordered simplest-first (>= 3 each). Keyed by "tNN.lesson-id".
   Every example editor has both Run and Step Run.
   ============================================================ */
(function () {
  // Python example: { t, code }.  C example: { t, c, py }
  const E = {
    /* ---------- Topic 02 — Basics ---------- */
    "t02.errors": [
      { t: "Fix a TypeError", code: 'print("Age: " + str(25))   # str() makes the int joinable' },
      { t: "Spot a logical error (precedence)", code: 'print(10 + 20 / 2)     # wrong: 20.0\nprint((10 + 20) / 2)   # right: 15.0' },
      { t: "Catch a ValueError", code: 'try:\n    int("abc")\nexcept ValueError as e:\n    print("ValueError:", e)' },
    ],
    "t02.input-output": [
      { t: "sep and end", code: 'print("a", "b", "c", sep="-")\nprint("loading", end="... ")\nprint("done")' },
      { t: "Format numbers in an f-string", code: 'pi = 3.14159\nprint(f"{pi:.2f}")\nprint(f"{42:>6}|")' },
      { t: "Print several values", code: 'name, score = "Al", 92\nprint(name, score)\nprint(f"{name}: {score}")' },
    ],
    "t02.variables": [
      { t: "A name can change type", code: 'x = 5\nprint(x, type(x).__name__)\nx = "five"\nprint(x, type(x).__name__)' },
      { t: "Swap and multiple assignment", code: 'a, b = 1, 2\na, b = b, a\nprint(a, b)\nx = y = z = 0\nprint(x, y, z)' },
      { t: "Augmented assignment", code: 'x = 10\nx += 5\nx *= 2\nprint(x)' },
    ],
    "t02.values-in-memory": [
      { t: "Bits and ASCII", code: "print(bin(13))\nprint(ord('A'), '->', chr(65))" },
      { t: "Fixed-size wrap vs Python big ints", code: 'print((255 + 1) & 0xFF)   # 8-bit wrap -> 0\nprint(2 ** 64)            # Python never overflows' },
      { t: "Other bases", code: 'print(hex(255))\nprint(oct(8))\nprint(int("ff", 16))' },
    ],
    "t02.python-memory": [
      { t: "is vs ==", code: 'a = [1, 2]\nb = a\nc = [1, 2]\nprint(a is b, a is c, a == c)' },
      { t: "Alias vs copy", code: 'a = [1, 2, 3]\nb = a\nb.append(9)\nprint("alias changed a:", a)\nc = a.copy()\nc.append(0)\nprint("copy left a:", a)' },
      { t: "Immutable ints rebind", code: 'a = 5\nb = a\na += 1\nprint(a, b)   # 6 5 — b is unaffected' },
    ],
    "t02.data-types": [
      { t: "Inspect types", code: 'for v in [42, 3.14, "hi", True, [1]]:\n    print(v, "->", type(v).__name__)' },
      { t: "Convert between types", code: 'print(int("42") + 8)\nprint(float(7))\nprint(str(100) + "%")' },
      { t: "Collection literals", code: 'print(type([1]).__name__)\nprint(type((1,)).__name__)\nprint(type({1}).__name__)\nprint(type({"a": 1}).__name__)' },
    ],
    "t02.strings-numbers": [
      { t: "Slice a string three ways", code: 's = "Programming"\nprint(s[:4], s[-4:], s[::-1])' },
      { t: "The math module", code: 'import math\nprint(round(math.pi, 3))\nprint(math.sqrt(144), 2 ** 10)' },
      { t: "String methods", code: 's = "Hello, World"\nprint(s.upper())\nprint(s.lower())\nprint(s.replace("o", "0"))' },
    ],

    /* ---------- Topic 03 — Decisions & Loops ---------- */
    "t03.boolean": [
      { t: "Truthiness of values", code: 'for v in [0, 1, "", "hi", None, []]:\n    print(repr(v), "->", bool(v))' },
      { t: "Booleans are numbers", code: 'print(True + True + False)   # 2\nprint(int(5 > 3))' },
      { t: "or / and return a value", code: 'print(0 or "default")\nprint("a" and "b")' },
    ],
    "t03.operators": [
      { t: "Combine conditions", code: 'age = 20\nprint(age >= 18 and age < 65)' },
      { t: "Chained comparison & not", code: 'x = 5\nprint(1 <= x <= 10)\nprint(not (x == 5))' },
      { t: "Comparisons return booleans", code: 'print(2 == 2.0)\nprint(2 != 3)\nprint("a" < "b")' },
    ],
    "t03.if-elif-else": [
      { t: "Sign of a number", code: 'n = -4\nif n > 0:\n    print("positive")\nelif n < 0:\n    print("negative")\nelse:\n    print("zero")' },
      { t: "Grade several scores", code: 'for s in [95, 73, 55]:\n    g = "A" if s >= 80 else "B" if s >= 70 else "C" if s >= 60 else "F"\n    print(s, "->", g)' },
      { t: "One-line ternary", code: 'n = 7\nprint("even" if n % 2 == 0 else "odd")' },
    ],
    "t03.loops": [
      { t: "Sum 1 to 10", code: 'total = 0\nfor i in range(1, 11):\n    total += i\nprint(total)' },
      { t: "Times table", code: 'for i in range(1, 6):\n    print(f"3 x {i} = {3 * i}")' },
      { t: "A triangle of stars", code: 'for r in range(1, 5):\n    print("*" * r)' },
    ],
    "t03.loop-control": [
      { t: "break out early", code: 'for n in range(10):\n    if n == 5:\n        break\n    print(n, end=" ")' },
      { t: "continue skips evens", code: 'for n in range(1, 11):\n    if n % 2 == 0:\n        continue\n    print(n, end=" ")' },
      { t: "pass as a placeholder", code: 'for i in range(3):\n    if i == 1:\n        pass   # do nothing for now\n    print(i)' },
    ],

    /* ---------- Topic 04 — Flowchart & Pseudocode ---------- */
    "t04.flowchart-to-code": [
      { t: "Largest of two", code: 'a, b = 12, 8\nprint(max(a, b))' },
      { t: "Countdown loop", code: 'x = 3\nwhile x > 0:\n    print(x)\n    x -= 1\nprint("Go!")' },
      { t: "Sum 1 to N", code: 'n = 5\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)' },
    ],
    "t04.pseudocode": [
      { t: "Even or odd", code: 'number = 8\nprint("even" if number % 2 == 0 else "odd")' },
      { t: "Largest of two", code: 'a, b = 4, 9\nif a > b:\n    print(a)\nelse:\n    print(b)' },
      { t: "Sum a list", code: 'nums = [3, 5, 2]\ns = 0\nfor n in nums:\n    s += n\nprint(s)' },
    ],

    /* ---------- Topic 05 — Functions & Modules ---------- */
    "t05.defining": [
      { t: "Return a value", code: 'def square(n):\n    return n * n\n\nprint(square(7))' },
      { t: "Return two values", code: 'def stats(nums):\n    return min(nums), max(nums)\n\nlo, hi = stats([4, 9, 1, 7])\nprint(lo, hi)' },
      { t: "A documented function", code: 'def greet(name):\n    """Return a greeting."""\n    return "Hi " + name\n\nprint(greet("Sam"))' },
    ],
    "t05.scope": [
      { t: "Local vs global", code: 'x = 10\ndef show():\n    y = 5\n    print(x, y)\nshow()' },
      { t: "The global keyword", code: 'count = 0\ndef inc():\n    global count\n    count += 1\ninc(); inc()\nprint(count)' },
      { t: "Local shadows global", code: 'x = "global"\ndef f():\n    x = "local"\n    return x\nprint(f(), x)' },
    ],
    "t05.recursion": [
      { t: "Recursive countdown", code: 'def down(n):\n    if n == 0:\n        return\n    print(n, end=" ")\n    down(n - 1)\ndown(5)' },
      { t: "Recursive sum to n", code: 'def s(n):\n    return 0 if n == 0 else n + s(n - 1)\nprint(s(100))' },
      { t: "Recursive factorial", code: 'def fact(n):\n    return 1 if n == 0 else n * fact(n - 1)\nprint(fact(5))' },
    ],
    "t05.arguments": [
      { t: "Default argument", code: 'def greet(name, msg="Hi"):\n    return f"{msg}, {name}"\nprint(greet("Sam"))\nprint(greet("Sam", "Yo"))' },
      { t: "**kwargs", code: 'def info(**kw):\n    for k, v in kw.items():\n        print(k, "=", v)\ninfo(a=1, b=2)' },
      { t: "*args", code: 'def total(*nums):\n    return sum(nums)\nprint(total(1, 2, 3, 4))' },
    ],
    "t05.modules": [
      { t: "math module", code: 'import math\nprint(math.gcd(12, 18))\nprint(math.factorial(5))' },
      { t: "random (seeded)", code: 'import random\nrandom.seed(0)\nprint(random.randint(1, 100))' },
      { t: "ceil and floor", code: 'import math\nprint(math.ceil(4.2), math.floor(4.8))' },
    ],

    /* ---------- Topic 06 — Strings, Lists, Dicts ---------- */
    "t06.strings": [
      { t: "Clean up text", code: 's = "  Hello  "\nprint(s.strip().upper())' },
      { t: "count and replace", code: 't = "banana"\nprint(t.count("a"), t.replace("a", "A"))' },
      { t: "split and join", code: 's = "a,b,c"\nparts = s.split(",")\nprint(parts)\nprint("-".join(parts))' },
    ],
    "t06.lists": [
      { t: "Build a list", code: 'nums = [1, 2, 3]\nnums.append(4)\nnums.insert(0, 0)\nprint(nums)' },
      { t: "List comprehensions", code: 'print([n * n for n in range(1, 6)])\nprint([n for n in range(10) if n % 2 == 0])' },
      { t: "Sort and aggregate", code: 'nums = [5, 2, 8, 1]\nnums.sort()\nprint(nums, sum(nums), max(nums))' },
    ],
    "t06.dictionaries": [
      { t: "Access with a default", code: 'p = {"name": "Al", "age": 30}\nprint(p["name"], p.get("city", "N/A"))' },
      { t: "Count words", code: 'c = {}\nfor w in "a b a c a".split():\n    c[w] = c.get(w, 0) + 1\nprint(c)' },
      { t: "Loop over items", code: 'p = {"a": 1, "b": 2}\nfor k, v in p.items():\n    print(k, "=", v)' },
    ],
    "t06.list-vs-dict": [
      { t: "Membership in each", code: 'nums = [1, 2, 3]\nd = {"a": 1}\nprint(2 in nums, "a" in d)' },
      { t: "Deduplicate with a set", code: 'nums = [1, 1, 2, 3, 3]\nprint(sorted(set(nums)))' },
      { t: "Build a dict from two lists", code: 'keys = ["a", "b"]\nvals = [1, 2]\nprint(dict(zip(keys, vals)))' },
    ],

    /* ---------- Topic 07 — Plots & Exceptions ---------- */
    "t07.matplotlib-basics": [
      { t: "A line plot", code: 'import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [1, 4, 9])\nplt.show()' },
      { t: "Style the line", code: 'import matplotlib.pyplot as plt\nplt.plot([1,2,3], [2,1,3], marker="o", color="r", linestyle="--")\nplt.title("Demo"); plt.grid(True)\nplt.show()' },
      { t: "Label the axes", code: 'import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [3, 1, 2])\nplt.xlabel("x"); plt.ylabel("y"); plt.title("Labelled")\nplt.show()' },
    ],
    "t07.chart-types": [
      { t: "Bar chart", code: 'import matplotlib.pyplot as plt\nplt.bar(["a", "b", "c"], [3, 7, 2])\nplt.show()' },
      { t: "Scatter plot", code: 'import matplotlib.pyplot as plt\nplt.scatter([1, 2, 3, 4], [2, 4, 1, 8])\nplt.show()' },
      { t: "Histogram", code: 'import matplotlib.pyplot as plt, numpy as np\nplt.hist(np.random.randn(300), bins=15)\nplt.show()' },
    ],
    "t07.exceptions": [
      { t: "try / except", code: 'try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print("no divide by zero")' },
      { t: "else and finally", code: 'try:\n    x = int("42")\nexcept ValueError:\n    print("bad number")\nelse:\n    print("ok", x)\nfinally:\n    print("done")' },
      { t: "Catch several error types", code: 'for v in ["5", "x"]:\n    try:\n        print(10 / int(v))\n    except (ValueError, ZeroDivisionError) as e:\n        print("error:", type(e).__name__)' },
    ],

    /* ---------- Topic 08 — Files, NumPy & Pandas ---------- */
    "t08.file-handling": [
      { t: "Write then read", code: 'with open("a.txt", "w") as f:\n    f.write("hi\\n")\nwith open("a.txt") as f:\n    print(f.read())' },
      { t: "Sum numbers from a file", code: 'with open("n.txt", "w") as f:\n    for i in range(1, 6):\n        f.write(f"{i}\\n")\ntotal = sum(int(line) for line in open("n.txt"))\nprint(total)' },
      { t: "Append mode", code: 'with open("a.txt", "w") as f:\n    f.write("one\\n")\nwith open("a.txt", "a") as f:\n    f.write("two\\n")\nprint(open("a.txt").read())' },
    ],
    "t08.csv-json": [
      { t: "JSON round-trip", code: 'import json\nd = {"x": 1, "y": [2, 3]}\ns = json.dumps(d)\nprint(s)\nprint(json.loads(s)["y"])' },
      { t: "CSV round-trip", code: 'import csv\nwith open("d.csv", "w", newline="") as f:\n    csv.writer(f).writerows([["a", "b"], [1, 2]])\nwith open("d.csv") as f:\n    print(list(csv.reader(f)))' },
      { t: "Pretty-print JSON", code: 'import json\nd = {"users": [{"n": "A"}, {"n": "B"}]}\nprint(json.dumps(d, indent=2))' },
    ],
    "t08.numpy": [
      { t: "Element-wise math", code: 'import numpy as np\na = np.array([1, 2, 3, 4])\nprint(a * 10)' },
      { t: "2-D arrays", code: 'import numpy as np\nm = np.array([[1, 2], [3, 4]])\nprint(m.sum(), m.sum(axis=0))' },
      { t: "arange and aggregate", code: 'import numpy as np\na = np.arange(1, 6)\nprint(a, a.sum(), a.mean())' },
    ],
    "t08.pandas": [
      { t: "A DataFrame column mean", code: 'import pandas as pd\ndf = pd.DataFrame({"x": [1, 2, 3]})\nprint(df["x"].mean())' },
      { t: "Filter rows", code: 'import pandas as pd\ndf = pd.DataFrame({"name": ["A", "B", "C"], "age": [20, 35, 28]})\nprint(df[df["age"] > 25])' },
      { t: "Group and sum", code: 'import pandas as pd\ndf = pd.DataFrame({"d": ["x", "y", "x"], "v": [1, 2, 3]})\nprint(df.groupby("d")["v"].sum())' },
    ],

    /* ---------- Topic 09 — Algorithms & Efficiency ---------- */
    "t09.what-is-algorithm": [
      { t: "Linear vs quadratic work", code: 'n = 50\nprint("linear   :", n)\nprint("quadratic:", n * n)' },
      { t: "Count steps in nested loops", code: 'steps = 0\nfor i in range(5):\n    for j in range(5):\n        steps += 1\nprint(steps)' },
      { t: "Accumulate a result", code: 'data = [4, 8, 15, 16]\ntotal = 0\nfor x in data:\n    total += x\nprint(total)' },
    ],
    "t09.big-o": [
      { t: "Steps for binary search", code: 'import math\nfor n in [10, 1000, 1_000_000]:\n    print(f"n={n:>9,}  log2={int(math.log2(n))}")' },
      { t: "Compare growth", code: 'for n in [10, 100, 1000]:\n    print(f"n={n:>4}  n={n:>5}  n^2={n*n}")' },
      { t: "O(1) vs O(n) lookup", code: 'd = {"a": 1}\nprint("a" in d)       # O(1)\nprint(3 in [1, 2, 3]) # O(n)' },
    ],
    "t09.searching": [
      { t: "Linear search", code: 'def find(a, t):\n    for i, v in enumerate(a):\n        if v == t:\n            return i\n    return -1\nprint(find([3, 6, 9], 9))' },
      { t: "Binary search", code: 'def bs(a, t):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        m = (lo + hi) // 2\n        if a[m] == t: return m\n        elif a[m] < t: lo = m + 1\n        else: hi = m - 1\n    return -1\nprint(bs([1, 3, 5, 7, 9], 7))' },
      { t: "The in operator", code: 'print(9 in [3, 6, 9])\nprint(5 in [3, 6, 9])' },
    ],
    "t09.sorting": [
      { t: "Built-in sort", code: 'print(sorted([5, 2, 8, 1]))\nprint(sorted(["pear", "fig"], key=len))' },
      { t: "Bubble sort by hand", code: 'a = [5, 1, 4, 2]\nfor i in range(len(a)):\n    for j in range(len(a) - 1 - i):\n        if a[j] > a[j + 1]:\n            a[j], a[j + 1] = a[j + 1], a[j]\nprint(a)' },
      { t: "reverse and key", code: 'print(sorted([3, 1, 2], reverse=True))\nprint(sorted(["bb", "a", "ccc"], key=len))' },
    ],
    "t09.data-structures": [
      { t: "A set removes duplicates", code: 'print(sorted(set([1, 1, 2, 3, 3, 3])))' },
      { t: "Set operations", code: 'a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a & b, a | b, a - b)' },
      { t: "Counting with Counter", code: 'from collections import Counter\nprint(Counter("banana"))' },
    ],
    "t09.efficient-python": [
      { t: "Comprehension over a loop", code: 'print([n * 2 for n in range(5)])' },
      { t: "join beats += for strings", code: 'parts = ["a", "b", "c", "d"]\nprint("".join(parts))' },
      { t: "Generator for memory", code: 'print(sum(n * n for n in range(1, 6)))' },
    ],

    /* ---------- Topic 10 — Programming in C (C + Python twin) ---------- */
    "t10.why-c": [
      { t: "Hello world", c: '#include <stdio.h>\nint main(void) {\n    puts("Hello, World!");\n    return 0;\n}', py: 'print("Hello, World!")' },
      { t: "Exit code from main", c: 'int main(void) {\n    return 0;   // 0 = success\n}', py: '# Python returns 0 automatically when it finishes\nprint("done")' },
      { t: "Including a library", c: '#include <stdio.h>   // pulls in puts/printf\nint main(void) {\n    puts("ready");\n    return 0;\n}', py: 'import math   # Python\'s version of #include\nprint(math.pi)' },
    ],
    "t10.types": [
      { t: "Declare and add typed numbers", c: 'int    a = 7, b = 2;\nint    q = a / b;             // 3 (integer division)\ndouble exact = (double)a / b; // 3.5', py: 'a, b = 7, 2\nprint(a // b)   # 3\nprint(a / b)    # 3.5' },
      { t: "A character is a number", c: "char c = 'A';   // stored as 65\nint  n = c + 1; // 66 -> 'B'", py: "print(ord('A'))\nprint(chr(ord('A') + 1))" },
      { t: "Fixed size overflows", c: 'unsigned char x = 255;\nx = x + 1;   // wraps to 0', py: 'print((255 + 1) % 256)   # 0 — simulated wrap' },
    ],
    "t10.control-flow": [
      { t: "Sum 1..5 with a for loop", c: 'int total = 0;\nfor (int i = 1; i <= 5; i++) {\n    total = total + i;   // ends at 15\n}', py: 'total = 0\nfor i in range(1, 6):\n    total += i\nprint(total)' },
      { t: "if / else if / else", c: 'if (score >= 80) grade = \'A\';\nelse if (score >= 70) grade = \'B\';\nelse grade = \'C\';', py: 'score = 73\ngrade = "A" if score >= 80 else "B" if score >= 70 else "C"\nprint(grade)' },
      { t: "while loop", c: 'int i = 0;\nwhile (i < 3) {\n    i++;\n}', py: 'i = 0\nwhile i < 3:\n    i += 1\nprint(i)' },
    ],
    "t10.functions": [
      { t: "A typed add function", c: 'int add(int a, int b) {\n    return a + b;\n}\n// add(3, 4) -> 7', py: 'def add(a, b):\n    return a + b\nprint(add(3, 4))' },
      { t: "void returns nothing", c: 'void say_hi(void) {\n    puts("hi");\n}', py: 'def say_hi():\n    print("hi")\nsay_hi()' },
      { t: "Pass by value (copy)", c: 'void f(int x) {\n    x = 99;   // only the local copy changes\n}\n// the caller\'s variable is unchanged', py: 'def f(x):\n    x = 99\nn = 5\nf(n)\nprint(n)   # still 5' },
    ],
    "t10.pointers": [
      { t: "Swap via pointers", c: 'void swap(int *x, int *y) {\n    int tmp = *x; *x = *y; *y = tmp;\n}', py: 'a, b = 1, 2\na, b = b, a       # Python needs no pointers\nprint(a, b)' },
      { t: "Address-of and dereference", c: 'int x = 42;\nint *p = &x;   // p holds x\'s address\n*p = 99;       // x is now 99', py: '# Python references work the same way under the hood\nx = [42]\np = x\np[0] = 99\nprint(x[0])' },
      { t: "Modify the caller's variable", c: 'void set99(int *p) { *p = 99; }\nint n = 5;\nset99(&n);   // n is now 99', py: 'def set99(box):\n    box[0] = 99\nn = [5]\nset99(n)\nprint(n[0])' },
    ],
    "t10.arrays-strings": [
      { t: "Sum an array with a loop", c: 'int arr[4] = {10, 20, 30, 40};\nint sum = 0;\nfor (int i = 0; i < 4; i++) {\n    sum += arr[i];   // 100\n}', py: 'arr = [10, 20, 30, 40]\nprint(sum(arr))' },
      { t: "Index an element", c: 'int arr[3] = {5, 6, 7};\nint first = arr[0];   // 5', py: 'arr = [5, 6, 7]\nprint(arr[0])' },
      { t: "A string is chars + a NUL", c: 'char name[6] = "Hello";\n// stores: H e l l o \\0', py: 'name = "Hello"\nprint(len(name), list(name))' },
    ],
    "t10.memory": [
      { t: "Heap allocation vs automatic", c: '#include <stdlib.h>\nint *p = malloc(4 * sizeof(int));\np[0] = 7;\nfree(p);   // you must free it', py: 'nums = [0, 0, 0, 0]\nnums[0] = 7\nprint(nums)   # freed automatically' },
      { t: "Stack frame per call", c: 'void f(void) {\n    int local = 5;   // on the stack\n}                    // freed on return', py: 'def f():\n    local = 5\n    return local\nprint(f())' },
      { t: "Reference counting", c: '// C: you track lifetimes yourself with malloc/free', py: 'import sys\na = [1, 2, 3]\nb = a\nprint(sys.getrefcount(a) - 1)   # Python counts references' },
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
