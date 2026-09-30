/* ============================================================
   zz-practice.js - appends a "Coding Practice" lesson to the END
   of every topic: "write code to …" questions with a writable,
   runnable editor and an auto-checking Check button.
   Loaded after all topics + zz-examples, before app.js.
   ============================================================ */
(function () {
  const Q = {
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
