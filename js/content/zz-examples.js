/* ============================================================
   zz-examples.js - appends an "Examples" section to EACH sub-topic
   (lesson) so every sub-topic carries its own runnable code examples,
   ordered simplest-first (>= 3 each). Keyed by "tNN.lesson-id".
   Every example editor has both Run and Step Run.
   ============================================================ */
(function () {
  // Python example: { t, code }.  C example: { t, c, py }
  const E = {
    /* ---------- Topic 08 - Files, NumPy & Pandas ---------- */
    "t08.file-handling": [
      { t: "Write then read", code: 'with open("a.txt", "w") as f:\n    f.write("hi\\n")\nwith open("a.txt") as f:\n    print(f.read())' },
      { t: "Sum numbers from a file", code: 'with open("n.txt", "w") as f:\n    for i in range(1, 6):\n        f.write(str(i) + "\\n")\ntotal = sum(int(line) for line in open("n.txt"))\nprint(total)' },
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

    /* ---------- Topic 09 - Algorithms & Efficiency ---------- */
    "t09.what-is-algorithm": [
      { t: "Linear vs quadratic work", code: 'n = 50\nprint("linear   :", n)\nprint("quadratic:", n * n)' },
      { t: "Count steps in nested loops", code: 'steps = 0\nfor i in range(5):\n    for j in range(5):\n        steps += 1\nprint(steps)' },
      { t: "Accumulate a result", code: 'data = [4, 8, 15, 16]\ntotal = 0\nfor x in data:\n    total += x\nprint(total)' },
    ],
    "t09.big-o": [
      { t: "Steps for binary search", code: 'import math\nfor n in [10, 1000, 1_000_000]:\n    print("n =", n, " log2 =", int(math.log2(n)))' },
      { t: "Compare growth", code: 'for n in [10, 100, 1000]:\n    print("n =", n, " n^2 =", n * n)' },
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

    /* ---------- Topic 10 - Programming in C (C + Python twin) ---------- */
    "t10.why-c": [
      { t: "Hello world", c: '#include <stdio.h>\nint main(void) {\n    puts("Hello, World!");\n    return 0;\n}', py: 'print("Hello, World!")' },
      { t: "Exit code from main", c: 'int main(void) {\n    return 0;   // 0 = success\n}', py: '# Python returns 0 automatically when it finishes\nprint("done")' },
      { t: "Including a library", c: '#include <stdio.h>   // pulls in puts/printf\nint main(void) {\n    puts("ready");\n    return 0;\n}', py: 'import math   # Python\'s version of #include\nprint(math.pi)' },
    ],
    "t10.types": [
      { t: "Declare and add typed numbers", c: '#include <stdio.h>\nint main(void) {\n    int    a = 7, b = 2;\n    int    q = a / b;             // 3 (integer division)\n    double exact = (double)a / b; // 3.5\n    printf("%d %.1f\\n", q, exact);\n    return 0;\n}', py: 'a, b = 7, 2\nprint(a // b)   # 3\nprint(a / b)    # 3.5' },
      { t: "A character is a number", c: "#include <stdio.h>\nint main(void) {\n    char c = 'A';   // stored as 65\n    int  n = c + 1; // 66 -> 'B'\n    printf(\"%d %c\\n\", c, n);\n    return 0;\n}", py: "print(ord('A'))\nprint(chr(ord('A') + 1))" },
      { t: "Fixed size overflows", c: '#include <stdio.h>\nint main(void) {\n    int x = 255;\n    x = (x + 1) % 256;   // 8-bit wrap -> 0 (real overflow is silent)\n    printf("%d\\n", x);\n    return 0;\n}', py: 'print((255 + 1) % 256)   # 0 - simulated wrap' },
    ],
    "t10.control-flow": [
      { t: "Sum 1..5 with a for loop", c: '#include <stdio.h>\nint main(void) {\n    int total = 0;\n    for (int i = 1; i <= 5; i++) {\n        total = total + i;   // ends at 15\n    }\n    printf("%d\\n", total);\n    return 0;\n}', py: 'total = 0\nfor i in range(1, 6):\n    total += i\nprint(total)' },
      { t: "if / else if / else", c: '#include <stdio.h>\nint main(void) {\n    int score = 73;\n    char grade;\n    if (score >= 80) grade = \'A\';\n    else if (score >= 70) grade = \'B\';\n    else grade = \'C\';\n    printf("%c\\n", grade);\n    return 0;\n}', py: 'score = 73\ngrade = "A" if score >= 80 else "B" if score >= 70 else "C"\nprint(grade)' },
      { t: "while loop", c: '#include <stdio.h>\nint main(void) {\n    int i = 0;\n    while (i < 3) {\n        i++;\n    }\n    printf("%d\\n", i);\n    return 0;\n}', py: 'i = 0\nwhile i < 3:\n    i += 1\nprint(i)' },
    ],
    "t10.functions": [
      { t: "A typed add function", c: '#include <stdio.h>\nint add(int a, int b) {\n    return a + b;\n}\nint main(void) {\n    printf("%d\\n", add(3, 4));   // 7\n    return 0;\n}', py: 'def add(a, b):\n    return a + b\nprint(add(3, 4))' },
      { t: "void returns nothing", c: '#include <stdio.h>\nvoid say_hi() {\n    puts("hi");\n}\nint main(void) {\n    say_hi();\n    return 0;\n}', py: 'def say_hi():\n    print("hi")\nsay_hi()' },
      { t: "Pass by value (copy)", c: '#include <stdio.h>\nvoid f(int x) {\n    x = 99;   // only the local copy changes\n}\nint main(void) {\n    int n = 5;\n    f(n);\n    printf("%d\\n", n);   // still 5 - the caller is unchanged\n    return 0;\n}', py: 'def f(x):\n    x = 99\nn = 5\nf(n)\nprint(n)   # still 5' },
    ],
    "t10.pointers": [
      { t: "Swap via pointers", c: '#include <stdio.h>\nvoid swap(int *x, int *y) {\n    int tmp = *x; *x = *y; *y = tmp;\n}\nint main(void) {\n    int a = 1, b = 2;\n    swap(&a, &b);\n    printf("%d %d\\n", a, b);\n    return 0;\n}', py: 'a, b = 1, 2\na, b = b, a       # Python needs no pointers\nprint(a, b)' },
      { t: "Address-of and dereference", c: '#include <stdio.h>\nint main(void) {\n    int x = 42;\n    int *p = &x;   // p holds x\'s address\n    *p = 99;       // x is now 99\n    printf("%d\\n", x);\n    return 0;\n}', py: '# Python references work the same way under the hood\nx = [42]\np = x\np[0] = 99\nprint(x[0])' },
      { t: "Modify the caller's variable", c: '#include <stdio.h>\nvoid set99(int *p) { *p = 99; }\nint main(void) {\n    int n = 5;\n    set99(&n);   // n is now 99\n    printf("%d\\n", n);\n    return 0;\n}', py: 'def set99(box):\n    box[0] = 99\nn = [5]\nset99(n)\nprint(n[0])' },
    ],
    "t10.arrays-strings": [
      { t: "Sum an array with a loop", c: '#include <stdio.h>\nint main(void) {\n    int arr[4] = {10, 20, 30, 40};\n    int sum = 0;\n    for (int i = 0; i < 4; i++) {\n        sum += arr[i];   // 100\n    }\n    printf("%d\\n", sum);\n    return 0;\n}', py: 'arr = [10, 20, 30, 40]\nprint(sum(arr))' },
      { t: "Index an element", c: '#include <stdio.h>\nint main(void) {\n    int arr[3] = {5, 6, 7};\n    int first = arr[0];   // 5\n    printf("%d\\n", first);\n    return 0;\n}', py: 'arr = [5, 6, 7]\nprint(arr[0])' },
      { t: "A string is chars + a NUL", c: '#include <stdio.h>\nint main(void) {\n    char name[6] = "Hello";   // stores: H e l l o \\0\n    printf("%s\\n", name);\n    return 0;\n}', py: 'name = "Hello"\nprint(len(name), list(name))' },
    ],
    "t10.memory": [
      { t: "Heap allocation vs automatic (read-only)", nr: true, c: '#include <stdlib.h>\nint main(void) {\n    int *p = malloc(4 * sizeof(int));\n    p[0] = 7;\n    free(p);   // you must free it\n    return 0;\n}\n// malloc/free are not supported by the in-browser engine - read only', py: 'nums = [0, 0, 0, 0]\nnums[0] = 7\nprint(nums)   # freed automatically' },
      { t: "Stack frame per call", c: '#include <stdio.h>\nvoid f() {\n    int local = 5;          // on the stack\n    printf("local = %d\\n", local);\n}                           // freed on return\nint main(void) {\n    f();\n    return 0;\n}', py: 'def f():\n    local = 5\n    return local\nprint(f())' },
      { t: "Reference counting", c: '#include <stdio.h>\nint main(void) {\n    // C has no reference counting: heap memory you malloc, you free.\n    // A stack value like this is freed automatically when main returns.\n    int n = 3;\n    printf("n = %d (freed automatically)\\n", n);\n    return 0;\n}', py: 'import sys\na = [1, 2, 3]\nb = a\nprint(sys.getrefcount(a) - 1)   # Python counts references' },
    ],
  };

  function findLesson(key) {
    const dot = key.indexOf(".");
    const t = (App.TOPICS || []).find((x) => x.id === key.slice(0, dot));
    return t && t.lessons.find((l) => l.id === key.slice(dot + 1));
  }

  Object.keys(E).forEach((key) => {
    const lesson = findLesson(key);
    if (!lesson || !lesson.learn || lesson.deck) return; // authored decks carry their own examples
    if (lesson.learn.some((b) => b.__examples)) return; // idempotent
    lesson.learn.push({ type: "subhead", text: "Examples", __examples: true });
    E[key].forEach((ex) => {
      if (ex.c) {
        lesson.learn.push({ type: "example", lang: "c", caption: ex.t, code: ex.c, norun: !!ex.nr });
        if (ex.py) lesson.learn.push({ type: "livecode", title: ex.t + " (Python)", code: ex.py });
      } else {
        lesson.learn.push({ type: "livecode", title: ex.t, code: ex.code });
      }
    });
  });
})();
