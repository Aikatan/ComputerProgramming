/* ===================== Topic 00 — Introduction & Setup ===================== */
App.registerTopic({
  id: "t00",
  title: "Introduction to Computer Programming",
  short: "Intro & Setup",
  blurb: "What this course is, the tools you'll use, and getting Python running.",
  intro: "This topic mirrors the course agreements and the install walkthrough (VS Code, Miniconda, Python, Jupyter, Google Colab). The live playground below means you can actually start coding right now — even before any local install.",
  lessons: [
    {
      id: "what-is-programming",
      title: "What is programming?",
      sub: "From an idea to instructions a computer can run.",
      slides: "00:2–3",
      keywords: "program instructions interpreter source code",
      learn: [
        { type: "text", html: "A <span class='term'>program</span> is a precise list of <span class='term'>instructions</span> that tells a computer how to perform a task. You write those instructions in a <b>programming language</b> — in this course, <span class='kw'>Python</span> — and a piece of software called the <b>interpreter</b> turns them into something the CPU actually executes." },
        { type: "note", title: "Why Python first", html: "Python reads almost like English, hides messy low-level details (memory, types), and has huge libraries (NumPy, pandas, Matplotlib) you'll meet later in this course. It lets you focus on <i>logic</i> before <i>machinery</i>." },
        { type: "widget", name: "diagram", config: { layout: "row", title: "The journey of one line of code", boxes: [
          { title: "You write", body: "<code>print(\"Hello\")</code> — human-readable source code in a <code>.py</code> file." },
          { title: "Interpreter reads", body: "Python parses your text, checks the grammar (syntax), and turns it into bytecode." },
          { title: "Computer runs", body: "The CPU executes the bytecode and the result — <code>Hello</code> — appears on screen." },
        ] } },
        { type: "deepdive", title: "Compiled vs interpreted (why C feels different)", html: "<p>Languages like <b>C/C++</b> are <i>compiled</i>: a compiler translates your whole program into a machine-code <code>.exe</code> ahead of time, which then runs directly on the CPU — very fast, but you must compile after every change.</p><p>Python is <i>interpreted</i>: it reads and runs your code line by line at run time. More flexible and beginner-friendly, but slower. This trade-off (convenience vs raw speed) comes back in Topic 08 when we use NumPy — a C-backed library — to make Python fast again.</p>" },
      ],
      live: [
        { title: "Your very first program — press Run", code: 'print("Hello, World!")\nprint("I am learning to program.")' },
      ],
      quiz: [
        { q: "What does an interpreter do?", choices: ["Designs the hardware", "Translates and runs your source code", "Stores files on disk", "Draws the user interface"], answer: 1, explain: "The Python interpreter reads your source code and executes it, line by line." },
        { q: "Which is true of Python compared to C?", choices: ["Python is compiled to an .exe first", "Python is generally easier to read but slower", "Python runs directly on the CPU with no interpreter", "C cannot be faster than Python"], answer: 1, explain: "Python is interpreted: friendlier and more flexible, but typically slower than compiled C." },
      ],
    },
    {
      id: "course-tools",
      title: "Course agreements & tools",
      sub: "Assessment, classroom rules, and the software you'll install.",
      slides: "00:3–8",
      keywords: "vscode miniconda assessment grade install python",
      learn: [
        { type: "list", title: "Course assessment (weights)", items: [
          "Class Attendance — 10%", "Assignments — 30%", "Project Presentation — 10%", "Midterm Examination — 20%", "Final Examination — 30%",
        ] },
        { type: "note", variant: "warn", title: "Classroom rules worth remembering", html: "Attendance is checked 15 minutes after start. Missing more than 3 classes total = you lose the right to sit the exam. Submit assignments named like <code>SX_YY_ZZ_LAB00</code>, on time (half marks if up to 7 days late, none after)." },
        { type: "widget", name: "diagram", config: { title: "Tools you'll set up", boxes: [
          { title: "Visual Studio Code", body: "The code editor. Download from <code>code.visualstudio.com</code>. You add the <b>Python</b> and <b>Jupyter</b> extensions inside it." },
          { title: "Miniconda 3", body: "A lightweight package/environment manager (from <code>docs.anaconda.com/miniconda</code>). It installs Python and lets you manage libraries cleanly." },
          { title: "Python 3.10", body: "The language itself. On Windows you can also install it from the Microsoft Store." },
          { title: "Google Colab", body: "A zero-install option: write and run Python notebooks in the browser at <code>colab.google</code>." },
        ] } },
        { type: "note", html: "Good news: the <b>Try it Live</b> box on every page of this site runs Python in your browser, so you can learn the whole course before your local install is finished." },
      ],
      live: [
        { title: "Confirm Python works — what version are we running?", code: "import sys\nprint(\"Python version:\", sys.version.split()[0])\nprint(\"It runs!\")" },
      ],
      quiz: [
        { q: "How much of your grade is the Final Examination?", choices: ["10%", "20%", "30%", "50%"], answer: 2, explain: "Final = 30%, the same as Assignments, and the largest single component alongside them." },
        { q: "Which tool requires no installation at all?", choices: ["Visual Studio Code", "Miniconda", "Google Colab", "Python from Microsoft Store"], answer: 2, explain: "Google Colab runs entirely in the browser — just log in with Google." },
      ],
    },
    {
      id: "first-run",
      title: "Creating and running your first file",
      sub: "Folders, files, choosing an interpreter, and seeing output.",
      slides: "00:11–15",
      keywords: "folder file run interpreter jupyter colab",
      learn: [
        { type: "list", title: "The workflow in VS Code", items: [
          "<b>Open a folder</b> — your project lives in one folder.",
          "<b>Create a file</b> — name it something like <code>lab00.py</code> (Python script) or <code>.ipynb</code> (Jupyter notebook).",
          "<b>Write something</b> — e.g. <code>print(\"Hi\")</code>.",
          "<b>Check the interpreter</b> — pick the Python 3.10 you installed.",
          "<b>Run</b> — press the ▶ button and read the result in the terminal.",
        ] },
        { type: "note", title: ".py vs .ipynb", html: "A <code>.py</code> file is a plain script that runs top-to-bottom. A Jupyter <code>.ipynb</code> notebook is split into <b>cells</b> you can run one at a time — great for experimenting and showing charts inline. Colab notebooks are the same idea, hosted online." },
      ],
      live: [
        { title: "Run a tiny multi-line program", code: 'name = "ComPro"\nyear = 2025\nprint("Welcome to", name)\nprint("Let\'s write Python in", year)' },
      ],
      quiz: [
        { q: "What is a Jupyter notebook cell good for?", choices: ["Running the whole program only once", "Running small pieces of code one at a time", "Storing images only", "Replacing the CPU"], answer: 1, explain: "Notebooks run code in independent cells — ideal for step-by-step experimentation and inline charts." },
      ],
    },
  ],
});
