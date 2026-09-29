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
    "t07.exceptions": {
      intro: "Watch execution jump from <code>try</code> straight into <code>except</code> the moment <code>n</code> is 0 - then carry on with the next item.",
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
