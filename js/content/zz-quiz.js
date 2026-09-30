/* ============================================================
   zz-quiz.js - tops up each sub-topic's "Check yourself" quiz to 5
   questions. Keyed by "tNN.lesson-id"; appends from the pool only
   until the lesson has 5 (naturally idempotent).
   Loaded after all topics, before app.js.
   ============================================================ */
(function () {
  const P = {
    /* ---------- Topic 00 ---------- */
    /* ---------- Topic 01 ---------- */
  };

  function findLesson(key) {
    const dot = key.indexOf(".");
    const t = (App.TOPICS || []).find((x) => x.id === key.slice(0, dot));
    return t && t.lessons.find((l) => l.id === key.slice(dot + 1));
  }

  // one more question for lessons that started with only a single quiz item
  const EXTRA = {
  };

  function topUp(map) {
    Object.keys(map).forEach((key) => {
      const lesson = findLesson(key);
      if (!lesson || lesson.deck) return; // authored decks carry their own checks
      lesson.quiz = lesson.quiz || [];
      const items = Array.isArray(map[key]) ? map[key] : [map[key]];
      for (const q of items) {
        if (lesson.quiz.length >= 5) break;
        if (lesson.quiz.some((existing) => existing.q === q.q)) continue;
        lesson.quiz.push(q);
      }
    });
  }

  topUp(P);
  topUp(EXTRA);
})();
