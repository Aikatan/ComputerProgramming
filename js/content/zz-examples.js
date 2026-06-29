/* ============================================================
   zz-examples.js — adds an "Examples — easy → hard" lesson to
   each code-bearing topic. Loaded after all topics, before app.js.
   Each example is runnable (Python); the C topic shows static C
   plus a runnable Python equivalent.
   ============================================================ */
(function () {
  const D = ["Easy", "Medium", "Harder", "Challenge", "Challenge"]; // difficulty labels by index

  const examples = {
    t02: [
      { t: "Greeting with an f-string", code: 'name = "Alice"\nage = 25\nprint(f"{name} is {age} years old.")\nprint(f"Next year: {age + 1}")' },
      { t: "Celsius to Fahrenheit", code: 'celsius = 30\nfahrenheit = celsius * 9/5 + 32\nprint(f"{celsius}\\u00b0C = {fahrenheit}\\u00b0F")' },
      { t: "Initials from a full name", note: "Split text into words, then take the first letter of each.", code: 'full_name = "Ada Lovelace"\nparts = full_name.split()\ninitials = parts[0][0] + "." + parts[1][0] + "."\nprint("Initials:", initials)' },
      { t: "Count the vowels in a string", note: "Loop over each character and test membership.", code: 'text = "Computer Programming"\nvowels = "aeiouAEIOU"\ncount = 0\nfor ch in text:\n    if ch in vowels:\n        count += 1\nprint(f"\'{text}\' has {count} vowels")' },
    ],
    t03: [
      { t: "Even or odd", code: 'n = 7\nif n % 2 == 0:\n    print(n, "is even")\nelse:\n    print(n, "is odd")' },
      { t: "FizzBuzz (1–15)", note: "Check the most specific case (divisible by both) first.", code: 'for n in range(1, 16):\n    if n % 15 == 0:\n        print("FizzBuzz")\n    elif n % 3 == 0:\n        print("Fizz")\n    elif n % 5 == 0:\n        print("Buzz")\n    else:\n        print(n)' },
      { t: "Sum of a number's digits", note: "Turn the number into a string to walk its digits.", code: 'number = 12345\ntotal = 0\nfor digit in str(number):\n    total += int(digit)\nprint("Sum of digits:", total)' },
      { t: "Print all primes up to 30", note: "A nested loop tests each number for divisors.", code: 'for num in range(2, 31):\n    is_prime = True\n    for d in range(2, int(num ** 0.5) + 1):\n        if num % d == 0:\n            is_prime = False\n            break\n    if is_prime:\n        print(num, end=" ")' },
    ],
    t04: [
      { t: "Largest of two numbers", note: "A single decision — the diamond in a flowchart.", code: 'a, b = 12, 8\nbiggest = a if a > b else b\nprint("Largest:", biggest)' },
      { t: "Countdown loop", note: "A loop with a condition that eventually turns false.", code: 'x = 5\nwhile x > 0:\n    print(x)\n    x -= 1\nprint("Liftoff!")' },
      { t: "Factorial via a sub-process", note: "A predefined process (function) called from the main flow.", code: 'def factorial(n):\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result\n\nprint("5! =", factorial(5))' },
    ],
    t05: [
      { t: "A function that returns a value", code: 'def square(n):\n    return n * n\n\nprint(square(6))' },
      { t: "Default argument", note: "Callers can omit the second argument.", code: 'def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Sam"))\nprint(greet("Sam", "Hi"))' },
      { t: "Average with *args", note: "Accept any number of arguments.", code: 'def average(*nums):\n    return sum(nums) / len(nums)\n\nprint(average(4, 8, 15, 16, 23))' },
      { t: "Power by recursion", note: "The function calls itself with a smaller exponent.", code: 'def power(base, exp):\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)\n\nprint("2^10 =", power(2, 10))' },
    ],
    t06: [
      { t: "Reverse a string and a list", code: 'word = "Python"\nprint(word[::-1])\n\nnums = [1, 2, 3, 4]\nprint(nums[::-1])' },
      { t: "Word frequency with a dict", note: "get(word, 0) supplies a default for new keys.", code: 'text = "the cat sat on the mat the end"\nfreq = {}\nfor w in text.split():\n    freq[w] = freq.get(w, 0) + 1\nprint(freq)' },
      { t: "Find the longest word", code: 'words = ["fig", "banana", "kiwi", "watermelon"]\nlongest = ""\nfor w in words:\n    if len(w) > len(longest):\n        longest = w\nprint("Longest:", longest)' },
      { t: "Group students by grade band", note: "A dict whose values are lists.", code: 'students = {"Ann": 82, "Bob": 67, "Cara": 91, "Dan": 74}\ngroups = {"A": [], "B": [], "C": []}\nfor name, score in students.items():\n    if score >= 80:\n        groups["A"].append(name)\n    elif score >= 70:\n        groups["B"].append(name)\n    else:\n        groups["C"].append(name)\nprint(groups)' },
    ],
    t07: [
      { t: "A simple line plot", code: 'import matplotlib.pyplot as plt\nplt.plot([1,2,3,4,5], [1,4,9,16,25], marker="o")\nplt.title("Squares")\nplt.show()' },
      { t: "Bar chart of scores", code: 'import matplotlib.pyplot as plt\nsubjects = ["Math", "Sci", "Eng", "Art"]\nscores = [80, 65, 90, 70]\nplt.bar(subjects, scores, color="teal")\nplt.title("Scores"); plt.ylabel("Score")\nplt.show()' },
      { t: "Safe division over many pairs", note: "Handle the bad case without crashing the whole loop.", code: 'pairs = [(10, 2), (5, 0), (9, 3)]\nfor a, b in pairs:\n    try:\n        print(f"{a}/{b} =", a / b)\n    except ZeroDivisionError:\n        print(f"{a}/{b} -> cannot divide by zero")' },
      { t: "Histogram of random data", code: 'import numpy as np\nimport matplotlib.pyplot as plt\ndata = np.random.randn(500)\nplt.hist(data, bins=20, color="purple", alpha=0.7)\nplt.title("Normal distribution")\nplt.show()' },
    ],
    t08: [
      { t: "Write then read a text file", code: 'with open("notes.txt", "w") as f:\n    f.write("hello\\nworld\\n")\n\nwith open("notes.txt") as f:\n    print(f.read())' },
      { t: "NumPy array statistics", code: 'import numpy as np\na = np.array([4, 8, 15, 16, 23, 42])\nprint("sum :", a.sum())\nprint("mean:", a.mean())\nprint("max :", a.max())' },
      { t: "Write & read a CSV file", code: 'import csv\nwith open("data.csv", "w", newline="") as f:\n    w = csv.writer(f)\n    w.writerow(["name", "score"])\n    w.writerow(["Ann", 82])\n    w.writerow(["Bob", 67])\n\nwith open("data.csv") as f:\n    for row in csv.reader(f):\n        print(row)' },
      { t: "Group and average a DataFrame", note: "pandas groupby — one line for what would be a whole loop.", code: 'import pandas as pd\ndf = pd.DataFrame({\n    "dept": ["IT", "HR", "IT", "HR"],\n    "salary": [50000, 45000, 60000, 47000],\n})\nprint(df.groupby("dept")["salary"].mean())' },
    ],
    t09: [
      { t: "Linear search", code: 'def find(data, target):\n    for i, v in enumerate(data):\n        if v == target:\n            return i\n    return -1\n\nprint(find([5, 3, 9, 1], 9))' },
      { t: "Count operations: quadratic", note: "Nested loops grow as n\\u00b2.", code: 'def ops(n):\n    c = 0\n    for i in range(n):\n        for j in range(n):\n            c += 1\n    return c\n\nprint("n=100 ->", ops(100), "operations")' },
      { t: "Binary search (needs sorted data)", code: 'def bsearch(data, target):\n    lo, hi = 0, len(data) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if data[mid] == target:\n            return mid\n        elif data[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n\nprint(bsearch([2, 5, 8, 12, 16, 23, 38], 23))' },
      { t: "Memoized Fibonacci", note: "Caching turns O(2\\u207f) into O(n).", code: 'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nprint([fib(i) for i in range(10)])\nprint("fib(100) =", fib(100))' },
    ],
    t10: [
      { t: "Add two integers", c: '#include <stdio.h>\nint main(void) {\n    int a = 5, b = 3;\n    int sum = a + b;   // sum is 8\n    puts("computed the sum");\n    return 0;\n}', py: 'a, b = 5, 3\nprint("sum:", a + b)' },
      { t: "Count with a for loop", c: 'int main(void) {\n    int total = 0;\n    for (int i = 1; i <= 5; i++) {\n        total = total + i;   // 1+2+3+4+5\n    }\n    // total is now 15\n    return 0;\n}', py: 'total = 0\nfor i in range(1, 6):\n    total += i\nprint("total:", total)' },
      { t: "A function returning the max", c: 'int max(int a, int b) {\n    if (a > b) return a;\n    return b;\n}\nint main(void) {\n    int m = max(12, 8);   // m is 12\n    return 0;\n}', py: 'def maximum(a, b):\n    return a if a > b else b\n\nprint(maximum(12, 8))' },
      { t: "Swap two variables with pointers", note: "C must pass <i>addresses</i> so the function can change the caller's variables. Python swaps with tuple assignment — no pointers needed.", c: 'void swap(int *x, int *y) {\n    int tmp = *x;\n    *x = *y;\n    *y = tmp;\n}\nint main(void) {\n    int a = 1, b = 2;\n    swap(&a, &b);   // now a == 2, b == 1\n    return 0;\n}', py: 'a, b = 1, 2\na, b = b, a       # Python swaps in one line\nprint(a, b)       # 2 1' },
    ],
  };

  function buildLesson(cfg) {
    const learn = [{ type: "text", html: "A ladder of worked examples, from easy to harder. Read the short note, then <b>run</b> each one and tweak it — changing the inputs is the fastest way to learn." }];
    cfg.forEach((ex, i) => {
      learn.push({ type: "subhead", text: "Example " + (i + 1) + " — " + ex.t + "  ·  " + (D[i] || "Challenge") });
      if (ex.note) learn.push({ type: "text", html: ex.note });
      if (ex.c) {
        learn.push({ type: "example", lang: "c", code: ex.c });
        if (ex.py) learn.push({ type: "livecode", title: "The same idea in Python — run it", code: ex.py });
      } else {
        learn.push({ type: "livecode", code: ex.code });
      }
    });
    return { id: "examples", title: "Examples — easy → hard", sub: "A ladder of worked, runnable examples to practise the ideas in this topic.", learn };
  }

  Object.keys(examples).forEach((tid) => {
    const t = (App.TOPICS || []).find((x) => x.id === tid);
    if (!t) return;
    if (t.lessons.some((l) => l.id === "examples")) return; // idempotent
    const lesson = buildLesson(examples[tid]);
    // place before a trailing "practice" lesson if there is one, else at the end
    const lastIsPractice = t.lessons.length && t.lessons[t.lessons.length - 1].id === "practice";
    if (lastIsPractice) t.lessons.splice(t.lessons.length - 1, 0, lesson);
    else t.lessons.push(lesson);
  });
})();
