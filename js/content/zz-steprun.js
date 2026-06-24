/* ============================================================
   zz-steprun.js — adds line-by-line "Step Run" demos to many
   lessons so students can watch variables update.
   Loaded AFTER all topicNN.js and BEFORE app.js.
   (Lessons that already have a Step Run are not listed here.)
   ============================================================ */
(function () {
  const demos = {
    "t00.first-run": {
      intro: "Watch each variable get its value as the lines run, then how it's used in the output.",
      code: 'name = "ComPro"\nyear = 2025\ngreeting = "Welcome to " + name\nprint(greeting)\nprint("Year:", year)',
    },
    "t02.errors": {
      intro: "A <i>logical error</i> runs without crashing but gives the wrong answer. Step through and watch <code>result</code> — the precedence bug computes <code>a + (b/2)</code>, not <code>(a+b)/2</code>.",
      code: 'a = 10\nb = 20\nresult = a + b / 2     # bug: only b is divided\nprint("buggy:", result)\nresult = (a + b) / 2   # fixed with parentheses\nprint("fixed:", result)',
    },
    "t02.input-output": {
      intro: "This example reads input. The Step Run feeds the sample answers <b>Alice</b> and <b>25</b> so you can trace it without typing.",
      code: 'name = input("Name: ")\nage = int(input("Age: "))\nnext_age = age + 1\nprint(f"{name}, next year you\'ll be {next_age}")',
      inputs: ["Alice", "25"],
    },
    "t02.variables": {
      intro: "See how one name can change value — and even type — as the program runs.",
      code: 'x = 5\ny = "!"\nx = x + 3\nx = str(x) + y\nprint(x)',
    },
    "t02.data-types": {
      intro: "Watch <code>s</code> and its type name <code>t</code> change on each pass of the loop.",
      code: 'samples = [42, 3.14, True, "hi"]\nfor s in samples:\n    t = type(s).__name__\n    print(s, "->", t)',
    },
    "t02.strings-numbers": {
      intro: "Each slice result becomes its own variable — step through to see them appear one by one.",
      code: 'text = "Programming"\nfirst = text[0]\nlast = text[-1]\nmiddle = text[3:7]\nreverse = text[::-1]\nprint(first, last, middle, reverse)',
    },
    "t05.defining": {
      intro: "Step <i>into</i> the call: notice the scope label 'inside square()', watch <code>result</code> get built, then returned back to <code>x</code>.",
      code: 'def square(n):\n    result = n * n\n    return result\n\nx = square(5)\ny = square(3)\nprint(x, y)',
    },
    "t05.scope": {
      intro: "Watch the scope switch to 'inside show()' for the local <code>y</code>, then return to the module where only the global <code>x</code> exists.",
      code: 'x = 20            # global\n\ndef show():\n    y = 10        # local to show()\n    print("inside:", x, y)\n\nshow()\nprint("outside:", x)',
    },
    "t05.arguments": {
      intro: "<code>*args</code> collects every argument into a tuple; step through the loop to watch <code>s</code> accumulate the sum.",
      code: 'def total(*args):\n    s = 0\n    for n in args:\n        s = s + n\n    return s\n\nprint(total(1, 2, 3, 4))',
    },
    "t05.modules": {
      intro: "Imported modules aren't shown as variables — watch your own <code>r</code> and <code>area</code> instead.",
      code: 'import math\nr = 5\narea = math.pi * r ** 2\nprint(round(area, 2))',
    },
    "t06.strings": {
      intro: "Each string method returns a <b>new</b> string into its own variable — the original <code>s</code> never changes.",
      code: 's = "hello"\nup = s.upper()\nrep = s.replace("l", "L")\nn = len(s)\nprint(up, rep, n)',
    },
    "t06.lists": {
      intro: "Lists are mutable — watch <code>nums</code> change in place on every line.",
      code: 'nums = [1, 2]\nnums.append(3)\nnums.insert(1, 9)\nnums.remove(2)\nlast = nums.pop()\nprint("nums:", nums)\nprint("popped:", last)',
    },
    "t06.dictionaries": {
      intro: "The classic word-counter: step through and watch the <code>count</code> dictionary fill up key by key.",
      code: 'text = "apple banana apple cherry banana apple"\ncount = {}\nfor word in text.split():\n    count[word] = count.get(word, 0) + 1\nprint(count)',
    },
    "t07.exceptions": {
      intro: "Watch execution jump from <code>try</code> straight into <code>except</code> the moment <code>n</code> is 0 — then carry on with the next item.",
      code: 'nums = [10, 0, 5]\nfor n in nums:\n    try:\n        r = 100 / n\n        print("ok:", r)\n    except ZeroDivisionError:\n        print("skip: cannot divide by zero")',
    },
    "t08.file-handling": {
      intro: "Step through writing a file, then reading it back into the <code>content</code> variable.",
      code: "with open('demo.txt', 'w') as f:\n    f.write('line 1\\n')\n    f.write('line 2\\n')\n\nwith open('demo.txt', 'r') as f:\n    content = f.read()\nprint(repr(content))",
    },
    "t08.numpy": {
      intro: "Watch the arrays update line by line. (NumPy downloads on the first run.)",
      code: 'import numpy as np\na = np.array([1, 2, 3])\nb = a * 2\ntotal = int(a.sum())\nprint(b, total)',
    },
  };

  function findLesson(key) {
    const dot = key.indexOf(".");
    const tid = key.slice(0, dot), lid = key.slice(dot + 1);
    const t = (App.TOPICS || []).find((x) => x.id === tid);
    return t && t.lessons.find((l) => l.id === lid);
  }

  Object.keys(demos).forEach((key) => {
    const lesson = findLesson(key);
    if (!lesson) return;
    lesson.learn = lesson.learn || [];
    // avoid duplicates if this runs twice
    if (lesson.learn.some((b) => b.type === "steprun")) return;
    const d = demos[key];
    lesson.learn.push({ type: "subhead", text: "▶ Run it yourself — line by line" });
    if (d.intro) lesson.learn.push({ type: "text", html: d.intro });
    lesson.learn.push({ type: "steprun", title: "Step through real execution — watch each variable update", code: d.code, inputs: d.inputs });
  });
})();
