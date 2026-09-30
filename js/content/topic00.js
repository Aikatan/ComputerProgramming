/* ===================== Topic 00 - Introduction to Computer Programming =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: course agreements -> what programming is -> course tools -> creating and running
   a program -> practice. Each lesson uses only what the lessons before it explained.
   Python level: print() with text and simple arithmetic only. No variables, if, loops, lists, def.
   ============================================================================================ */
(function () {
  /* ---------- block helpers (as in topic02.js) ---------- */
  const T = (html) => ({ type: "text", html });
  const L = (items, title, ordered) => ({ type: "list", items, title, ordered });
  const N = (html, title, variant) => ({ type: "note", html, title, variant });
  const TB = (head, rows, caption, cls) => ({ type: "table", head, rows, caption, cls });
  const CODE = (code, output, caption, lang) => ({ type: "code", code, output, caption, lang });
  const EX = (code, caption, annot, inputs) => ({ type: "example", code, caption, annot, inputs });
  const RUN = (code, title, inputs) => ({ type: "livecode", code, title: title || "Program", inputs });
  const PQ = (prompt, expected, starter, inputs, hint) => ({ type: "practiceq", prompt, expected, starter, inputs, hint });
  const QZ = (items) => ({ type: "quiz", items });
  const NEXT = (html) => N(html, "Next lesson");
  const IPO = (rows) => TB(["Step", "Result"], rows);
  const PAPER = T("Write the output of this program on paper, line by line.<br>Then run the program and compare.");
  const STARTER = "# Write your program here\n";

  App.registerTopic({
    id: "t00",
    title: "Introduction to Computer Programming",
    short: "Intro & Setup",
    blurb: "The course agreements, what programming is, the course tools, and running the first program.",
    intro: "This chapter introduces the course and the tools used to write and run Python programs. Each lesson uses only what the lessons before it have explained:<br>course agreements → what programming is → course tools → creating and running a program → practice.",
    lessons: [
      /* =============================== 1. COURSE AGREEMENTS =============================== */
      {
        id: "course-agreements",
        title: "Course agreements",
        sub: "Assessment, grades, attendance, assignments, and classroom rules.",
        slides: "00:3–6",
        keywords: "course agreements assessment weight grade score attendance late absent leave assignment submission classroom rules",
        deck: [
          { kind: "overview", title: "Course agreements", blocks: [
            T("The course agreements are the rules of 010711301 Computer Programming.<br>They state how the grade is computed, and how students attend the classes and submit their work."),
            L(["Assessment", "Grades", "Attendance", "Assignments", "Classroom rules"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Assessment", title: "Course assessment", blocks: [
            TB(["Component", "Weight", "When"], [
              ["Class attendance", "10%", "every week"],
              ["Assignments", "30%", "every week"],
              ["Project presentation", "10%", "week 14"],
              ["Midterm examination", "20%", "week 8"],
              ["Final examination", "30%", "week 16"],
            ]),
            T("The weights add up to 100%. Each component gives at most its weight in points: the final examination gives at most 30 points."),
          ] },
          { kind: "concept", part: "Grades", title: "From the total score to a grade", blocks: [
            T("The total score is the sum of the five components, out of 100 points."),
            TB(["Grade", "Total score", "Grade", "Total score"], [
              ["A", "80–100", "C", "50–59"],
              ["B+", "75–79", "D+", "45–49"],
              ["B", "70–74", "D", "40–44"],
              ["C+", "60–69", "F", "0–39"],
            ], null, "center"),
            T("The course syllabus states that these ranges are approximate."),
          ] },
          { kind: "code", part: "Grades", title: "Example: a total score and its grade", blocks: [
            TB(["Component", "Maximum", "Score"], [
              ["Class attendance", "10", "9"],
              ["Assignments", "30", "26"],
              ["Project presentation", "10", "8"],
              ["Midterm examination", "20", "15"],
              ["Final examination", "30", "24"],
              ["<b>Total</b>", "<b>100</b>", "<b>82</b>"],
            ], null, "center"),
            T("9 + 26 + 8 + 15 + 24 = 82. The range 80–100 gives the grade <b>A</b>."),
          ] },
          { kind: "concept", part: "Attendance", title: "Attendance rules", blocks: [
            L([
              "Students attend every class, and their attendance is checked in every class.",
              "The attendance check starts 15 minutes after the class begins. A student who misses the check is counted as late or absent.",
              "Absences are counted over the whole semester.",
              "A student with more than 3 absences loses the right to sit the examinations.",
            ]),
          ] },
          { kind: "concept", part: "Attendance", title: "The attendance score", blocks: [
            T("The attendance score starts at 10 points. Points are deducted as follows:"),
            TB(["Record", "Points deducted"], [
              ["Late", "1 point each time"],
              ["Absent", "1 absence: 1 point. 2 absences: 3 points. 3 absences: 6 points."],
              ["Sick leave with a medical certificate", "1 point each time"],
              ["Personal leave with a leave form, notified in advance", "1 point each time, except for activities that benefit the university"],
            ]),
          ] },
          { kind: "code", part: "Attendance", title: "Example: an attendance score", blocks: [
            T("A student was late 2 times, absent 1 time, and on sick leave with a medical certificate 1 time."),
            TB(["Record", "Points deducted"], [
              ["Late 2 times", "2 × 1 = 2"],
              ["Absent 1 time", "1"],
              ["Sick leave 1 time", "1"],
              ["<b>Total deducted</b>", "<b>4</b>"],
            ], null, "center"),
            T("Attendance score: 10 − 4 = <b>6</b> points."),
          ] },
          { kind: "concept", part: "Assignments", title: "Submitting an assignment", blocks: [
            L([
              "Assignments are submitted in Google Classroom.",
              "Sign in with the university e-mail account: <code>sXXXXXXXXXXXXX@email.kmutnb.ac.th</code>.",
              "The file name must have this format, and no other: <code>SX_YY_ZZZZZZZZZZZZZ_LAB00</code>.",
            ]),
          ] },
          { kind: "concept", part: "Assignments", title: "Late submission", blocks: [
            TB(["Submission", "Score"], [
              ["On time", "the full score"],
              ["Late, up to 7 days", "half of the score"],
              ["Late, more than 7 days", "no score"],
            ]),
            T("Example: an assignment earns 8 of 10 points and is submitted 3 days late. It receives 8 ÷ 2 = 4 points."),
          ] },
          { kind: "concept", part: "Classroom rules", title: "Classroom rules", blocks: [
            L([
              "Keep quiet during the class unless it is necessary. Raise a hand to ask a question.",
              "AI tools such as ChatGPT are not allowed during the class, unless the lecturer permits them for a specific case.",
              "To meet the lecturer, request an appointment at least 24 hours in advance.",
              "The request states the name, student ID, course, section, the requested date and time, the topic, and other details.",
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Weights: attendance 10%, assignments 30%, project 10%, midterm 20%, final 30%.",
              "The total score gives the grade: 80 or more is A; below 40 is F.",
              "Attendance starts at 10 points. More than 3 absences: no right to sit the examinations.",
              "Late assignments: up to 7 days, half of the score; after 7 days, no score.",
              "No AI tools in class without permission. Appointments: at least 24 hours in advance.",
            ]),
            NEXT("<b>What is programming?</b> The course teaches programming, so the next lesson explains what a program is and how a computer runs it."),
          ] },
          { kind: "exercise", title: "Complete the table: grades", blocks: [
            T("Write the grade for each total score on paper. The next exercise checks it."),
            TB(["Student", "Total score", "Grade"], [
              ["1", "85", ""], ["2", "79", ""], ["3", "60", ""], ["4", "47", ""], ["5", "39", ""],
            ], null, "center"),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Student", "Total score", "Grade"], [
              ["1", "85", "A"], ["2", "79", "B+"], ["3", "60", "C+"], ["4", "47", "D+"], ["5", "39", "F"],
            ], null, "center"),
            T("A score equal to the lower limit of a range gets that grade: 60 is C+."),
          ] },
          { kind: "exercise", title: "Complete the table: attendance scores", blocks: [
            T("Each row is the record of one student for the semester. Complete the table on paper. The next exercise checks it."),
            TB(["Record", "Points deducted", "Attendance score"], [
              ["Late 3 times", "", ""],
              ["Absent 2 times", "", ""],
              ["Late 1 time, absent 1 time", "", ""],
              ["Absent 3 times, sick leave 1 time", "", ""],
              ["Absent 4 times", "", ""],
            ], null, "center"),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Record", "Points deducted", "Attendance score"], [
              ["Late 3 times", "3", "7"],
              ["Absent 2 times", "3", "7"],
              ["Late 1 time, absent 1 time", "1 + 1 = 2", "8"],
              ["Absent 3 times, sick leave 1 time", "6 + 1 = 7", "3"],
              ["Absent 4 times", "more than 3 absences", "no right to sit the examinations"],
            ], null, "center"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "What is the weight of the final examination?", choices: ["10%", "20%", "30%", "50%"], answer: 2, explain: "The final examination is 30%, the same weight as the assignments." },
            { q: "A student has a total score of 74. The grade is…", choices: ["B+", "B", "C+", "C"], answer: 1, explain: "74 is in the range 70–74, which gives B." },
          ])] },
        ],
      },

      /* =============================== 2. WHAT IS PROGRAMMING? =============================== */
      {
        id: "what-is-programming",
        title: "What is programming?",
        sub: "Programs, programming languages, compilers and interpreters, and the first Python program.",
        slides: "00:2, 01:44",
        keywords: "program instruction source code programming language machine language high-level compiler interpreter python print hello world",
        deck: [
          { kind: "overview", title: "What is programming?", blocks: [
            T("A <b>program</b> is a sequence of instructions that a computer executes to perform a task.<br><b>Programming</b> is writing these instructions in a programming language."),
            L(["Programs and instructions", "Programming languages", "Compilers and interpreters", "Python", "The first program", "How Python runs a program"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Programs and instructions", title: "A program is a sequence of instructions", blocks: [
            L([
              "An <b>instruction</b> tells the computer to perform one small action: compute a value, compare two values, or display a result.",
              "A <b>program</b> is a sequence of instructions for one task.",
              "The computer executes the instructions in order, one after another.",
              "The computer does exactly what the instructions state. It cannot guess what the programmer meant.",
              "The text of a program, as the programmer writes it, is the <b>source code</b>.",
            ]),
          ] },
          { kind: "code", part: "Programs and instructions", title: "Example: a task written as instructions", blocks: [
            T("Task: display the area of a room that is 5 m long and 3 m wide."),
            TB(["Step", "Instruction"], [
              ["1", "Take the length, 5, and the width, 3."],
              ["2", "Multiply them: 5 × 3 = 15."],
              ["3", "Display the result: 15 m²."],
            ]),
            T("The order matters: step 3 can display the area only after step 2 has computed it."),
          ] },
          { kind: "concept", part: "Programming languages", title: "Machine language and high-level languages", blocks: [
            TB(["", "Machine language", "High-level language"], [
              ["Written as", "binary numbers: 0 and 1", "words and symbols close to English and mathematics"],
              ["Example", "<code>10110000 01100001</code>", "<code>print(\"Hello\")</code>"],
              ["Executed by", "the CPU, directly", "the CPU, after translation into machine language"],
              ["Portability", "each type of CPU has its own machine language", "the same source code runs on many types of computer"],
            ]),
            T("Examples of high-level languages: Python, C, C++, Java.<br>A <b>translator</b> converts high-level source code into machine language."),
          ] },
          { kind: "concept", part: "Compilers and interpreters", title: "Two kinds of translator", blocks: [
            TB(["", "Compiler", "Interpreter"], [
              ["Translates", "the whole program, before it runs", "one statement at a time, while the program runs"],
              ["Result", "an executable file, for example <code>program.exe</code>", "no executable file: the source code is run directly"],
              ["After a change", "compile again, then run", "run again"],
              ["Speed", "fast, because the machine code runs directly", "slower, because translation is part of the run"],
              ["Languages", "C, C++", "Python"],
            ]),
          ] },
          { kind: "concept", part: "Python", title: "Python", blocks: [
            L([
              "Python is a high-level language. Its programs are executed by the Python <b>interpreter</b>.",
              "Its syntax is short and readable, so a program stays close to the steps of the task.",
              "The interpreter manages the memory, so the programmer can focus on the logic.",
              "Libraries such as NumPy, pandas, and Matplotlib add tools for calculations, data, and charts (Topics 07 and 08).",
              "Python is slower than C. Topic 10 teaches C, which is used for hardware and microcontrollers.",
            ]),
          ] },
          { kind: "concept", part: "The first program", title: "The first program", blocks: [
            CODE('print("text")', null, "syntax"),
            L([
              "<code>print()</code> displays the value between its parentheses. The displayed text is the <b>output</b>.",
              "Text is written between quotes. The quotes are not displayed.",
              "A number or a calculation is written without quotes: <code>print(5 * 3)</code> displays <code>15</code>.",
              "Each <code>print()</code> statement displays one line. Topic 02 explains <code>print()</code> in full.",
            ]),
          ] },
          { kind: "code", part: "The first program", title: "First example: Hello, World!", blocks: [
            EX('print("Hello, World!")\nprint("I am learning to program.")', "two statements, two lines", [
              { c: 'print("Hello, World!")', e: "Output: <code>Hello, World!</code>" },
              { c: 'print("I am learning to program.")', e: "The second statement displays the second line." },
            ]),
          ] },
          { kind: "code", part: "The first program", title: "Example: an instruction that computes", blocks: [
            EX('print("Room area (m2):")\nprint(5 * 3)', "the area of the room", [
              { c: 'print("Room area (m2):")', e: "Text in quotes: displayed as written." },
              { c: "print(5 * 3)", e: "A calculation: Python computes 15, then displays it. Output: <code>15</code>" },
            ]),
          ] },
          { kind: "concept", part: "How Python runs a program", title: "How Python runs a program", blocks: [
            TB(["Step", "What happens"], [
              ["1. Write", "The programmer writes the source code in a <code>.py</code> file."],
              ["2. Check", "The interpreter reads the file and checks its syntax (the grammar of Python)."],
              ["3. Execute", "The interpreter executes the statements one at a time, from top to bottom."],
            ]),
            L([
              "If the syntax is wrong, no statement is executed.",
              "If a statement cannot be executed, the program stops at that statement. The statements before it have already run.",
            ]),
          ] },
          { kind: "code", part: "How Python runs a program", title: "Example: one statement at a time", blocks: [
            EX('print("Line 1")\nprint("Line 2")\nprint(10 / 0)\nprint("Line 4")', "the program stops at line 3", [
              { c: 'print("Line 2")', e: "Lines 1 and 2 are executed. Output: <code>Line 1</code> and <code>Line 2</code>." },
              { c: "print(10 / 0)", e: "A division by zero cannot be executed. The program stops with the error <code>ZeroDivisionError</code>." },
              { c: 'print("Line 4")', e: "This statement is never executed." },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A program is a sequence of instructions. The computer executes them in order.",
              "The CPU executes only machine language. High-level source code must be translated.",
              "A compiler translates the whole program before it runs. An interpreter translates and executes one statement at a time.",
              "<code>print()</code> displays a value. Text is written between quotes.",
              "Python runs with an interpreter: it checks the syntax, executes the statements one at a time, and stops at a statement that fails.",
            ]),
            NEXT("<b>Course tools</b>. A Python program needs an editor to write it and an interpreter to run it. The next lesson installs both."),
          ] },
          { kind: "exercise", title: "Complete the table: compiler or interpreter", blocks: [
            T("Write <b>compiler</b> or <b>interpreter</b> for each statement on paper. The next exercise checks it."),
            TB(["Statement", "Compiler or interpreter?"], [
              ["Translates the whole program before it runs", ""],
              ["Translates and executes one statement at a time", ""],
              ["Creates an executable file", ""],
              ["Runs Python programs", ""],
              ["Is used to build C programs", ""],
            ]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Statement", "Compiler or interpreter?"], [
              ["Translates the whole program before it runs", "compiler"],
              ["Translates and executes one statement at a time", "interpreter"],
              ["Creates an executable file", "compiler"],
              ["Runs Python programs", "interpreter"],
              ["Is used to build C programs", "compiler"],
            ]),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [PAPER],
            [RUN('print("Program start")\nprint(4 * 25)\nprint("Program end")')],
          ] },
          { kind: "exercise", title: "Determine the output: a program that stops", cols: [
            [T("Write on paper the lines that are displayed before the program stops. Explain why line 3 is not executed.<br>Then run the program and compare.")],
            [RUN('print("Motor ON")\nprint(100 / 0)\nprint("Motor OFF")')],
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The program does not run: the interpreter reports a syntax error. Correct it.",
              "Hello, World!", 'print("Hello, World!)\n', null, "Text starts and ends with a quote."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Write a program that displays the two lines of the target output exactly.",
              "Hello, ComPro!\nPython is ready.", STARTER, null, 'Use one print() for each line: print("Hello, ComPro!")'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "A compiler translates…", choices: ["one statement at a time, while the program runs", "the whole program, before it runs", "machine language into Python", "only the comments"], answer: 1, explain: "A compiler translates the whole program into an executable file before it runs." },
            { q: "Python is…", choices: ["a high-level language run by an interpreter", "a high-level language run by an assembler", "a machine language", "a low-level language run by a compiler"], answer: 0, explain: "Python is a high-level language; its programs are executed by the Python interpreter." },
          ])] },
        ],
      },

      /* =============================== 3. COURSE TOOLS =============================== */
      {
        id: "course-tools",
        title: "Course tools",
        sub: "The editor, the Python interpreter, Miniconda, and the VS Code extensions.",
        slides: "00:7–10",
        keywords: "tools vscode visual studio code editor miniconda conda pip python 3.10 install extension jupyter version",
        deck: [
          { kind: "overview", title: "Course tools", blocks: [
            T("A Python program is written in an <b>editor</b> and executed by the Python <b>interpreter</b>.<br>This course uses Visual Studio Code as the editor, and Python 3.10 as the interpreter."),
            L(["The course tools", "Visual Studio Code", "Python and Miniconda", "The Python and Jupyter extensions"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The course tools", title: "The course tools and their roles", blocks: [
            TB(["Tool", "Role", "Source"], [
              ["Visual Studio Code", "the editor: writes, opens, and runs program files", "<code>code.visualstudio.com</code>"],
              ["Python 3.10", "the interpreter: executes Python programs", "<code>python.org</code>, or the Microsoft Store (Windows)"],
              ["Miniconda 3", "installs Python and manages its packages", "<code>docs.anaconda.com/miniconda/install/</code>"],
              ["Python and Jupyter extensions", "add Python and notebook support to VS Code", "inside VS Code"],
              ["Google Colab", "runs notebooks in a web browser, without installation (Lesson 4)", "<code>colab.google</code>"],
            ]),
          ] },
          { kind: "concept", part: "Visual Studio Code", title: "Visual Studio Code", blocks: [
            L([
              "Visual Studio Code (VS Code) is a free <b>code editor</b>.",
              "It colours the syntax of the code, marks errors, and completes names while the programmer types.",
              "It opens a project folder and lists its files in the <b>Explorer</b> panel.",
              "It runs programs in its <b>Terminal</b> panel, where the output appears.",
              "<b>Extensions</b> add support for languages and tools, such as Python and Jupyter.",
            ]),
            N("Download VS Code from <code>code.visualstudio.com</code> and run the installer with the default options.", "Installation"),
          ] },
          { kind: "concept", part: "Python and Miniconda", title: "Python and Miniconda", blocks: [
            L([
              "Python 3.10 is the interpreter of this course. It executes <code>.py</code> files.",
              "Download and install Python 3.10. On Windows, it can also be installed from the Microsoft Store.",
              "Miniconda 3 installs Python together with <b>conda</b>, a tool that installs and updates packages.",
              "A <b>package</b> (library) adds tools to Python, for example NumPy for calculations (Topic 08).",
              "Packages are installed in a terminal: <code>conda install numpy</code> or <code>pip install numpy</code>.",
            ]),
          ] },
          { kind: "concept", part: "Python and Miniconda", title: "Checking the installation", blocks: [
            CODE("python --version", null, "in a terminal", "text"),
            L([
              "The command displays the version of the installed interpreter, for example <code>Python 3.10.11</code>.",
              "If the terminal reports that <code>python</code> is not recognized, Python is not installed or cannot be found.",
              "In that case, install Python again and select the installer option that adds Python to PATH.",
            ]),
          ] },
          { kind: "concept", part: "The Python and Jupyter extensions", title: "The Python and Jupyter extensions", blocks: [
            TB(["Extension", "Purpose"], [
              ["Python", "runs <code>.py</code> files and selects the interpreter"],
              ["Jupyter", "opens and runs notebooks (<code>.ipynb</code> files)"],
            ]),
            T("Both extensions are published by Microsoft. They are installed with the same three steps."),
          ] },
          { kind: "concept", part: "The Python and Jupyter extensions", title: "Installing an extension", blocks: [
            TB(["Step", "Python extension", "Jupyter extension"], [
              ["1. Open the Extensions view", "Ctrl+Shift+X", "Ctrl+Shift+X"],
              ["2. Search", "<code>Python</code>", "<code>Jupyter</code>"],
              ["3. Install", "Python (Microsoft)", "Jupyter (Microsoft)"],
            ]),
            T("The Extensions view is also opened with the Extensions icon in the bar on the left of VS Code."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "VS Code is the editor. It writes, opens, and runs program files.",
              "Python 3.10 is the interpreter. It executes the programs.",
              "Miniconda installs Python and manages packages with conda. pip also installs packages.",
              "<code>python --version</code> in a terminal checks the installation.",
              "The Python and Jupyter extensions add Python and notebook support to VS Code.",
            ]),
            NEXT("<b>Creating and running a program</b>. With the tools installed, the next lesson creates a project folder and a file, and runs the first program."),
          ] },
          { kind: "exercise", title: "Complete the table: tools", blocks: [
            T("Write the tool used for each task on paper. The next exercise checks it."),
            TB(["Task", "Tool"], [
              ["Write and edit a <code>.py</code> file", ""],
              ["Execute a Python program", ""],
              ["Install the NumPy package", ""],
              ["Open a notebook in VS Code", ""],
              ["Run a notebook without installing anything", ""],
            ]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Task", "Tool"], [
              ["Write and edit a <code>.py</code> file", "Visual Studio Code"],
              ["Execute a Python program", "the Python 3.10 interpreter"],
              ["Install the NumPy package", "conda (Miniconda) or pip"],
              ["Open a notebook in VS Code", "the Jupyter extension"],
              ["Run a notebook without installing anything", "Google Colab"],
            ]),
          ] },
          { kind: "exercise", title: "Put the steps in order", blocks: [
            T("The steps to install the Jupyter extension are in the wrong order. Write the letters in the correct order on paper. The next exercise checks it."),
            TB(["Letter", "Step"], [
              ["A", "Type <code>Jupyter</code> in the search box."],
              ["B", "Open VS Code."],
              ["C", "Select <b>Install</b> on the Jupyter extension by Microsoft."],
              ["D", "Open the Extensions view (Ctrl+Shift+X)."],
            ], null, "center"),
          ] },
          { kind: "exercise", title: "Check your order", blocks: [
            T("The correct order is <b>B, D, A, C</b>:"),
            L([
              "Open VS Code.",
              "Open the Extensions view (Ctrl+Shift+X).",
              "Type <code>Jupyter</code> in the search box.",
              "Select <b>Install</b> on the Jupyter extension by Microsoft.",
            ], null, true),
          ] },
          { kind: "exercise", title: "Set up your computer", blocks: [
            T("Complete these steps on your own computer before the next class."),
            L([
              "Install Visual Studio Code.",
              "Install Python 3.10, or Miniconda 3.",
              "Install the Python and Jupyter extensions in VS Code.",
              "Open a terminal in VS Code (<b>Terminal → New Terminal</b>) and run <code>python --version</code>.",
              "Result check: the terminal displays <code>Python 3.10</code> followed by a third number.",
            ], null, true),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Visual Studio Code is…", choices: ["a web browser", "a code editor", "the Python interpreter", "a package"], answer: 1, explain: "VS Code is the editor in which the programs are written and run." },
            { q: "conda and pip are used to…", choices: ["edit program files", "install packages", "draw charts", "open folders"], answer: 1, explain: "conda and pip install packages, such as NumPy, for Python." },
          ])] },
        ],
      },

      /* =============================== 4. CREATING AND RUNNING A PROGRAM =============================== */
      {
        id: "first-run",
        title: "Creating and running a program",
        sub: "A project folder, a .py file, a Jupyter notebook, and Google Colab.",
        slides: "00:11–15",
        keywords: "folder file create run interpreter select terminal output py ipynb jupyter notebook cell kernel colab google",
        deck: [
          { kind: "overview", title: "Creating and running a program", blocks: [
            T("A Python program is saved in a file inside a project folder. The interpreter then runs the file.<br>This lesson follows this workflow in VS Code, then runs code in a notebook and in Google Colab."),
            L(["The project folder", "Creating a file", "Running a .py file", "Jupyter notebooks", "Google Colab"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The project folder", title: "Creating a project folder", blocks: [
            L([
              "A <b>project folder</b> holds all the files of one project, for example the labs of this course.",
              "In VS Code, select <b>File → Open Folder</b>.",
              "Create a new folder, for example <code>ComPro</code>, and select it.",
              "VS Code lists the files of the folder in the <b>Explorer</b> panel on the left.",
            ], null, true),
          ] },
          { kind: "concept", part: "Creating a file", title: "Creating a file", blocks: [
            L([
              "In the Explorer panel, select <b>New File</b>.",
              "Type the name of the file, for example <code>lab00.py</code>.",
              "The <b>extension</b> at the end of the name selects the file type: <code>.py</code> for a Python program, <code>.ipynb</code> for a Jupyter notebook.",
            ], null, true),
          ] },
          { kind: "concept", part: "Creating a file", title: "A Python file and a Jupyter notebook", blocks: [
            TB(["", "Python file (.py)", "Jupyter notebook (.ipynb)"], [
              ["Content", "Python code only", "cells of code and text, with their output"],
              ["Execution", "the whole file, from top to bottom", "one cell at a time"],
              ["Output", "in the Terminal panel", "below each cell"],
              ["Used for", "complete programs", "trying code step by step, calculations, charts"],
            ]),
          ] },
          { kind: "concept", part: "Running a .py file", title: "Running a .py file", blocks: [
            L([
              "Write the code in the file, and save it with Ctrl+S.",
              "Check the interpreter: the status bar at the bottom right shows the selected Python version. Select it to choose Python 3.10.",
              "Run the file with the ▶ button (<b>Run Python File</b>) at the top right of the editor.",
              "The output appears in the <b>Terminal</b> panel.",
            ], null, true),
            T("The command <code>python lab00.py</code>, typed in the terminal, runs the file in the same way."),
          ] },
          { kind: "code", part: "Running a .py file", title: "Example: lab00.py", blocks: [
            EX('print("Lab 00")\nprint("Computer Programming")\nprint("Python is ready.")', "lab00.py", [
              { c: 'print("Lab 00")', e: "The statements run from top to bottom." },
              { c: 'print("Python is ready.")', e: "The third line of output. In VS Code, the three lines appear in the Terminal panel." },
            ]),
          ] },
          { kind: "concept", part: "Jupyter notebooks", title: "Jupyter notebooks", blocks: [
            L([
              "A notebook is a sequence of <b>cells</b>. A code cell holds Python code; a Markdown cell holds text.",
              "Each code cell runs on its own: with the ▶ button beside the cell, or with Shift+Enter.",
              "The output of a cell appears directly below the cell.",
              "Before the first run, select the <b>kernel</b>: the Python interpreter that runs the cells.",
            ]),
          ] },
          { kind: "code", part: "Jupyter notebooks", title: "Example: a notebook with two cells", cols: [
            [CODE('print("Cell 1")', "Cell 1", "cell 1"), CODE("print(3 * 4)", "12", "cell 2")],
            [L([
              "Each cell is run separately.",
              "The output of each cell is displayed directly below it.",
              "A cell can be changed and run again without running the other cells.",
            ])],
          ] },
          { kind: "concept", part: "Google Colab", title: "Google Colab", blocks: [
            L([
              "Google Colab runs Jupyter notebooks in a web browser. Nothing is installed on the computer.",
              "The code runs on Google's servers, so an internet connection is needed.",
              "The notebooks are saved in Google Drive as <code>.ipynb</code> files.",
            ]),
          ] },
          { kind: "concept", part: "Google Colab", title: "Opening and running a Colab notebook", blocks: [
            TB(["Step", "Opening a notebook", "Running code"], [
              ["1", "Sign in with a Google account.", "Write code in a cell."],
              ["2", "Go to <code>colab.google</code>.", "Select ▶ (Run) beside the cell."],
              ["3", "Select <b>New Notebook</b>.", "The output appears below the cell."],
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A project folder holds the files of a project: <b>File → Open Folder</b>.",
              "<code>.py</code> is a Python program; <code>.ipynb</code> is a notebook of cells.",
              "Before running a <code>.py</code> file, select the interpreter. The output appears in the Terminal.",
              "A notebook cell runs on its own; its output appears below it.",
              "Google Colab runs notebooks in the browser, without installation.",
            ]),
            NEXT("<b>Chapter practice</b>. Short programs that display text and results, written and run with the tools of this chapter."),
          ] },
          { kind: "exercise", title: "Complete the table: .py or .ipynb", blocks: [
            T("Write <code>.py</code> or <code>.ipynb</code> for each description on paper. The next exercise checks it."),
            TB(["Description", ".py or .ipynb?"], [
              ["The whole file runs from top to bottom", ""],
              ["The output appears below each cell", ""],
              ["Code and text are mixed in one file", ""],
              ["A new Google Colab notebook", ""],
              ["Runs with <code>python lab00.py</code> in a terminal", ""],
            ]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Description", ".py or .ipynb?"], [
              ["The whole file runs from top to bottom", "<code>.py</code>"],
              ["The output appears below each cell", "<code>.ipynb</code>"],
              ["Code and text are mixed in one file", "<code>.ipynb</code>"],
              ["A new Google Colab notebook", "<code>.ipynb</code>"],
              ["Runs with <code>python lab00.py</code> in a terminal", "<code>.py</code>"],
            ]),
          ] },
          { kind: "exercise", title: "Put the steps in order", blocks: [
            T("The steps to run a first program in VS Code are in the wrong order. Write the letters in the correct order on paper. The next exercise checks it."),
            TB(["Letter", "Step"], [
              ["A", "Run the file with the ▶ button."],
              ["B", "Create the file <code>lab00.py</code>."],
              ["C", "Open the project folder."],
              ["D", "Write the code and save the file."],
              ["E", "Select the Python 3.10 interpreter."],
            ], null, "center"),
          ] },
          { kind: "exercise", title: "Check your order", blocks: [
            T("The correct order is <b>C, B, D, E, A</b>:"),
            L([
              "Open the project folder.",
              "Create the file <code>lab00.py</code>.",
              "Write the code and save the file.",
              "Select the Python 3.10 interpreter. (This step can also come before step 3.)",
              "Run the file with the ▶ button.",
            ], null, true),
          ] },
          { kind: "exercise", title: "Write and run a program", blocks: [
            PQ("Write <code>lab00.py</code>, which displays the three lines of the target output. Run it in VS Code and in a Google Colab cell; then check it here.",
              "Lab 00\nComputer Programming\nMy first program runs.", STARTER, null, 'Use one print() for each line: print("Lab 00")'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "A Jupyter notebook cell is used to…", choices: ["run the whole program only once", "run a small piece of code on its own", "store images only", "select the interpreter"], answer: 1, explain: "Each cell runs on its own, and its output appears below it." },
            { q: "Before a `.py` file is run in VS Code, the programmer selects…", choices: ["the Python interpreter", "a web browser", "a Colab notebook", "the size of the file"], answer: 0, explain: "The selected interpreter is the Python that executes the file." },
          ])] },
        ],
      },

      /* =============================== 5. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Short programs that display text and the results of calculations.",
        slides: "00:4–6",
        keywords: "practice print calculation total score grade attendance assignment",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Each problem uses the lessons of this chapter: the data comes from the course agreements, and the program uses <code>print()</code> with text and calculations. Solve every problem in the same order:"),
            L([
              "<b>Given values</b>: the values stated in the problem.",
              "<b>Required output</b>: the lines the program displays.",
              "<b>Processing</b>: the calculation.",
              "<b>Code</b>: one <code>print()</code> statement for each line of output.",
              "<b>Verify</b>: compare the output with a hand calculation.",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: a welcome message", blocks: [
            T("Display the course code and the course name on the first line, and a greeting on the second line."),
            IPO([
              ["Given values", "the course code 010711301 and the name Computer Programming"],
              ["Required output", "two lines of text"],
              ["Processing", "none: each line is displayed as written"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Write the program. Write it in VS Code or Google Colab as well.",
              "010711301 Computer Programming\nHello, ComPro!", STARTER, null, 'print("010711301 Computer Programming")'),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: a total score", blocks: [
            T("A student has these scores: attendance 7, assignments 22, project 8, midterm 12, final 18. Display the total score, and then the grade."),
            IPO([
              ["Given values", "the five scores"],
              ["Required output", "a label, the total score, and the grade"],
              ["Processing", "total = 7 + 22 + 8 + 12 + 18. The grade is read from the grade table by hand."],
            ]),
            N("A program can choose the grade itself with a decision, <code>if</code> (Topic 03).", "Note"),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("Line 2 computes the total with <code>print()</code>. Line 3 displays the grade that you found by hand. Check by hand: the total is 67, in the range 60–69.",
              "Total score:\n67\nGrade: C+", STARTER, null, "print(7 + 22 + 8 + 12 + 18)"),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: an attendance score", blocks: [
            T("A student was late 2 times and absent 2 times. Display the attendance score."),
            IPO([
              ["Given values", "the score starts at 10; late 2 times: 2 points; absent 2 times: 3 points"],
              ["Required output", "a label and the attendance score"],
              ["Processing", "score = 10 − 2 − 3"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Write the program. Check by hand: 10 − 2 − 3 = 5.",
              "Attendance score:\n5", STARTER, null, "print(10 - 2 - 3)"),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: a late assignment", blocks: [
            T("An assignment earns 9 of 10 points, but it is submitted 2 days late. Display the score that it receives."),
            IPO([
              ["Given values", "9 points; 2 days late"],
              ["Required output", "a label and the score"],
              ["Processing", "up to 7 days late: half of the score, 9 / 2"],
            ]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", blocks: [
            PQ("Write the program. Check by hand: 9 ÷ 2 = 4.5.",
              "Assignment score:\n4.5", STARTER, null, "print(9 / 2)"),
          ] },
          { kind: "summary", title: "Chapter summary", blocks: [
            TB(["Lesson", "Key point"], [
              ["1. Course agreements", "Weights, grades, attendance, late submission, and classroom rules."],
              ["2. What is programming?", "A program is a sequence of instructions. Python runs with an interpreter."],
              ["3. Course tools", "VS Code is the editor; Python 3.10 is the interpreter; extensions add Python and Jupyter."],
              ["4. Creating and running a program", "Folder, <code>.py</code> file, interpreter, Run. Notebooks run cell by cell, also in Colab."],
            ]),
            N("<b>Topic 01: Computer operation and architecture</b>. The hardware that executes a program: the CPU, memory, and storage.", "Next topic"),
          ] },
        ],
      },
    ],
  });
})();
