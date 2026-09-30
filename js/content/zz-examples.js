/* ============================================================
   zz-examples.js - appends an "Examples" section to EACH sub-topic
   (lesson) so every sub-topic carries its own runnable code examples,
   ordered simplest-first (>= 3 each). Keyed by "tNN.lesson-id".
   Every example editor has both Run and Step Run.
   ============================================================ */
(function () {
  // Python example: { t, code }.  C example: { t, c, py }
  const E = {
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
