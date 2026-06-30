/* ============================================================
   zz-practice.js — appends a "Coding Practice" lesson to the END
   of every topic: "write code to …" questions with a writable,
   runnable editor and an auto-checking Check button.
   Loaded after all topics + zz-examples, before app.js.
   ============================================================ */
(function () {
  const Q = {
    t00: [
      { prompt: "Write code to print exactly: <b>Hello, ComPro!</b>", expected: "Hello, ComPro!" },
      { prompt: "Write code to print the numbers <b>1 to 5</b>, each on its own line.", expected: "1\n2\n3\n4\n5", hint: "A for loop over range(1, 6)." },
    ],
    t01: [
      { prompt: "A program needs 4 bytes per <code>int</code>. Write code to print how many bytes <b>10 ints</b> take.", expected: "40" },
      { prompt: "Write code to print the four CPU instruction-cycle stages, one per line: <b>Fetch, Decode, Execute, Store</b>.", expected: "Fetch\nDecode\nExecute\nStore", hint: "Loop over a list of the four stage names." },
    ],
    t02: [
      { prompt: "Given <code>name = 'Sam'</code> and <code>age = 20</code>, write code to print: <b>Sam is 20 years old.</b>", starter: "name = 'Sam'\nage = 20\n# print the sentence below\n", expected: "Sam is 20 years old.", hint: "Use an f-string: f\"{name} is {age} years old.\"" },
      { prompt: "Write code to print the quotient and remainder of 17 ÷ 5 as: <b>17 / 5 = 3 remainder 2</b>", expected: "17 / 5 = 3 remainder 2", hint: "Use // for the quotient and % for the remainder." },
      { prompt: "Write code to print the first 3 letters of <code>'python'</code> in uppercase.", expected: "PYT", hint: "Slice [:3] then .upper()." },
    ],
    t03: [
      { prompt: "Write code to print whether <b>17</b> is even or odd, like: <b>17 is odd</b>", expected: "17 is odd", hint: "Test n % 2 == 0." },
      { prompt: "Write code to print the <b>sum of all numbers from 1 to 100</b>.", expected: "5050", hint: "Loop and accumulate, or use sum(range(1, 101))." },
      { prompt: "Write code to print the 7× table from 7×1 to 7×5, like:<br><code>7 x 1 = 7</code> … each on its own line.", expected: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35", hint: "for i in range(1, 6): print(f\"7 x {i} = {7*i}\")" },
    ],
    t04: [
      { prompt: "Given <code>a, b, c = 5, 9, 2</code>, write code to print the <b>largest</b> value.", starter: "a, b, c = 5, 9, 2\n", expected: "9", hint: "Use max(a, b, c) — or nested if statements." },
      { prompt: "Write code to print a countdown from 3 to 1, then <b>Go!</b> — each on its own line.", expected: "3\n2\n1\nGo!" },
    ],
    t05: [
      { prompt: "Write a function <code>double(n)</code> that returns <code>n * 2</code>, then print <code>double(21)</code>.", expected: "42" },
      { prompt: "Write a function that returns the <b>average</b> of <code>[4, 8, 15, 16, 23, 42]</code> and print it.", expected: "18.0", hint: "sum(nums) / len(nums)" },
      { prompt: "Write a <b>recursive</b> factorial function and print <code>factorial(5)</code>.", expected: "120", hint: "Base case: n == 0 returns 1." },
    ],
    t06: [
      { prompt: "Write code to print the list <code>[3, 1, 2]</code> <b>sorted</b>.", expected: "[1, 2, 3]", hint: "sorted([3, 1, 2])" },
      { prompt: "Write code to count each letter in <code>'banana'</code> and print the dictionary.", expected: "{'b': 1, 'a': 3, 'n': 2}", hint: "Loop the string; use d.get(ch, 0) + 1." },
      { prompt: "Write code to print the <b>longest</b> word in <code>['hi', 'hello', 'hey']</code>.", expected: "hello", hint: "Track the word with the greatest len()." },
    ],
    t07: [
      { prompt: "Write code that tries <code>10 / 0</code> and instead prints <b>cannot divide by zero</b> (no crash).", expected: "cannot divide by zero", hint: "Wrap it in try / except ZeroDivisionError." },
      { prompt: "For each value in <code>[5, 0, 2]</code>, print <code>100 // value</code>, or <b>skip</b> if it would divide by zero — one per line.", expected: "20\nskip\n50", hint: "try the division inside the loop; except prints 'skip'." },
    ],
    t08: [
      { prompt: "Write code to save the numbers 1–5 to a file, read it back, and print their <b>sum</b>.", expected: "15", hint: "Write each number + '\\n', then read and int() each line." },
      { prompt: "Using NumPy, write code to make the array <code>[1, 2, 3, 4]</code> and print its <b>mean</b>.", expected: "2.5", hint: "import numpy as np; np.array([...]).mean()" },
    ],
    t09: [
      { prompt: "Write a <b>linear search</b> and print the index of <code>9</code> in <code>[4, 2, 9, 7]</code>.", expected: "2", hint: "enumerate the list; return i when value == target." },
      { prompt: "Write a <b>binary search</b> and print the index of <code>23</code> in <code>[2, 5, 8, 12, 16, 23, 38]</code>.", expected: "5", hint: "Track low/high; compare the middle element." },
    ],
    t10: [
      { prompt: "In C you'd need pointers to swap two variables. In <b>Python</b>, write code to swap <code>a = 1, b = 2</code> and print <b>a=2 b=1</b>.", starter: "a, b = 1, 2\n# swap a and b, then print 'a=2 b=1'\n", expected: "a=2 b=1", hint: "Python swaps with: a, b = b, a" },
      { prompt: "Like summing a C array with a loop: write code to sum <code>[10, 20, 30, 40]</code> and print the <b>total</b>.", expected: "100", hint: "Loop and accumulate, or use sum()." },
    ],
  };

  function buildLesson(qs) {
    const learn = [{ type: "text", html: "Tasks combining the whole topic. Write code to produce each target output, then press Check." }];
    qs.forEach((q, i) => {
      learn.push({ type: "subhead", text: "Task " + (i + 1) });
      learn.push({ type: "practiceq", prompt: q.prompt, starter: q.starter, expected: q.expected, inputs: q.inputs, hint: q.hint });
    });
    return { id: "coding-practice", title: "Mixed Practice", sub: "Tasks that combine the whole topic.", learn };
  }

  Object.keys(Q).forEach((tid) => {
    const t = (App.TOPICS || []).find((x) => x.id === tid);
    if (!t) return;
    if (t.lessons.some((l) => l.id === "coding-practice")) return; // idempotent
    t.lessons.push(buildLesson(Q[tid])); // always last
  });
})();
