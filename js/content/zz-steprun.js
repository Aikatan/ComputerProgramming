/* ============================================================
   zz-steprun.js - adds line-by-line "Step Run" demos to many
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
  };

  function findLesson(key) {
    const dot = key.indexOf(".");
    const tid = key.slice(0, dot), lid = key.slice(dot + 1);
    const t = (App.TOPICS || []).find((x) => x.id === tid);
    return t && t.lessons.find((l) => l.id === lid);
  }

  Object.keys(demos).forEach((key) => {
    const lesson = findLesson(key);
    if (lesson && lesson.deck) return; // authored decks carry their own examples
    if (!lesson) return;
    lesson.learn = lesson.learn || [];
    // avoid duplicates if this runs twice
    if (lesson.learn.some((b) => b.type === "steprun")) return;
    const d = demos[key];
    lesson.learn.push({ type: "subhead", text: "Step through it line by line" });
    if (d.intro) lesson.learn.push({ type: "text", html: d.intro });
    lesson.learn.push({ type: "steprun", title: "Step through the code", code: d.code, inputs: d.inputs });
  });
})();
