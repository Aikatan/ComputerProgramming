/* ============================================================
   zz-practice.js - appends a "Coding Practice" lesson to the END
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
    t10: [
      { prompt: "In C you'd need pointers to swap two variables. In <b>Python</b>, write code to swap <code>a = 1, b = 2</code> and print <b>a=2 b=1</b>.", starter: "a, b = 1, 2\n# swap a and b, then print 'a=2 b=1'\n", expected: "a=2 b=1", hint: "Python swaps with: a, b = b, a" },
      { prompt: "Like summing a C array with a loop: write code to sum <code>[10, 20, 30, 40]</code> and print the <b>total</b>.", expected: "100", hint: "Loop and accumulate, or use sum()." },
    ],
  };

  function buildLesson(qs) {
    const learn = [{ type: "text", html: "Tasks combining the whole topic. Write code to produce each target output, then check your answer." }];
    qs.forEach((q, i) => {
      learn.push({ type: "subhead", text: "Task " + (i + 1) });
      learn.push({ type: "practiceq", prompt: q.prompt, starter: q.starter, expected: q.expected, inputs: q.inputs, hint: q.hint });
    });
    return { id: "coding-practice", title: "Mixed Practice", sub: "Tasks that combine the whole topic.", learn };
  }

  Object.keys(Q).forEach((tid) => {
    const t = (App.TOPICS || []).find((x) => x.id === tid);
    if (!t) return;
    if (t.lessons.some((l) => l.deck)) return; // authored topics carry their own practice lesson
    if (t.lessons.some((l) => l.id === "coding-practice")) return; // idempotent
    t.lessons.push(buildLesson(Q[tid])); // always last
  });
})();
