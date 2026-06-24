/* ===================== Topic 07 — Data Visualization & Exception Handling ===================== */
App.registerTopic({
  id: "t07",
  title: "Data Visualization & Exceptions",
  short: "Plots & Exceptions",
  blurb: "Draw charts with Matplotlib, and handle errors gracefully with try/except.",
  intro: "Two practical skills: turning numbers into charts (Matplotlib renders live below!), and writing programs that survive bad input instead of crashing.",
  lessons: [
    {
      id: "matplotlib-basics",
      title: "Matplotlib basics",
      sub: "Line plots, titles, labels — rendered live in your browser.",
      slides: "07:4–7",
      keywords: "matplotlib pyplot plot show line chart title label legend grid",
      learn: [
        { type: "text", html: "<span class='term'>Matplotlib</span> is Python's plotting library. The usual import is <code>import matplotlib.pyplot as plt</code>. You build a plot with calls like <code>plt.plot(x, y)</code> and finish with <code>plt.show()</code>." },
        { type: "example", caption: "a basic line plot", code:
"import matplotlib.pyplot as plt\nx = [1, 2, 3, 4, 5]\ny = [10, 20, 25, 30, 35]\nplt.plot(x, y)\nplt.show()",
          annot: [
            { c: "plt.plot(x, y)", e: "Maps each x to its y and draws a line." },
            { c: "plt.show()", e: "Renders the figure. (Here, the chart appears under the editor.)" },
          ] },
        { type: "note", title: "It really runs", html: "The <b>Try it Live</b> editors below download Matplotlib the first time and draw the chart inline — no Jupyter needed." },
      ],
      live: [
        { title: "Run me — a real chart appears below", code: "import matplotlib.pyplot as plt\nx = [1, 2, 3, 4, 5]\ny = [10, 20, 25, 30, 35]\nplt.plot(x, y, marker='o', linestyle='--', color='g', label=\"Data Line\")\nplt.title(\"Customized Line Plot\")\nplt.xlabel(\"X-Axis\")\nplt.ylabel(\"Y-Axis\")\nplt.legend()\nplt.grid(True)\nplt.show()" },
      ],
      quiz: [
        { q: "What's the conventional alias for matplotlib.pyplot?", choices: ["mp", "plt", "plot", "mpl"], answer: 1, explain: "import matplotlib.pyplot as plt is the standard convention." },
        { q: "Which call actually renders the figure?", choices: ["plt.draw_now()", "plt.render()", "plt.show()", "plt.figure()"], answer: 2, explain: "plt.show() displays the plot." },
      ],
    },
    {
      id: "chart-types",
      title: "Bar, scatter & histogram",
      sub: "Pick the right chart for the data.",
      slides: "07:8–11",
      keywords: "bar scatter histogram hist savefig chart type",
      learn: [
        { type: "list", title: "Common chart types", items: [
          "<code>plt.bar(categories, values)</code> — compare categories.",
          "<code>plt.scatter(x, y)</code> — relationship between two variables.",
          "<code>plt.hist(data, bins=30)</code> — distribution of one variable.",
          "<code>plt.savefig(\"plot.png\", dpi=300)</code> — save to a file.",
        ] },
      ],
      live: [
        { title: "Bar chart", code: "import matplotlib.pyplot as plt\ncategories = ['A', 'B', 'C', 'D']\nvalues = [30, 50, 20, 40]\nplt.bar(categories, values, color='royalblue')\nplt.title(\"Bar Chart Example\")\nplt.show()" },
        { title: "Histogram of random data", code: "import numpy as np\nimport matplotlib.pyplot as plt\ndata = np.random.randn(1000)\nplt.hist(data, bins=30, color='purple', alpha=0.7)\nplt.title(\"Histogram Example\")\nplt.show()" },
      ],
      quiz: [
        { q: "To show the distribution of a single variable you'd use a…", choices: ["bar chart", "scatter plot", "histogram", "pie of pies"], answer: 2, explain: "A histogram bins values to show their distribution." },
      ],
    },
    {
      id: "exceptions",
      title: "Exception handling",
      sub: "try / except / else / finally — don't let bad input crash you.",
      slides: "07:12–20",
      keywords: "exception try except else finally error handling valueerror zerodivision filenotfound",
      learn: [
        { type: "text", html: "An <span class='term'>exception</span> is a runtime event that disrupts normal flow (bad input, missing file, divide-by-zero). Instead of crashing, wrap risky code in <span class='kw'>try</span>/<span class='kw'>except</span> to handle it gracefully." },
        { type: "example", caption: "catching specific errors", code:
"try:\n    num = int(input(\"Enter a number: \"))\n    result = 10 / num\n    print(result)\nexcept ValueError:\n    print(\"That wasn't a valid number.\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero.\")",
          annot: [
            { c: "try:", e: "Code that might fail goes here." },
            { c: "except ValueError", e: "Runs only if int() got something non-numeric." },
            { c: "except ZeroDivisionError", e: "Runs only if num was 0. Catch specific types when you can." },
          ] },
        { type: "list", title: "The full shape", items: [
          "<b>try</b> — the risky code.",
          "<b>except</b> — handle a particular error type (or <code>except Exception as e</code> for any).",
          "<b>else</b> — runs only if no exception occurred.",
          "<b>finally</b> — always runs (cleanup), exception or not.",
        ] },
        { type: "note", title: "raise & assert", html: "<code>raise ValueError(\"msg\")</code> triggers an exception on purpose (e.g. to reject invalid input). <code>assert condition, \"msg\"</code> checks something that should always be true while debugging." },
      ],
      live: [
        { title: "Safe division — try entering 0 or 'abc'", code: "try:\n    num = int(input(\"Enter a number: \"))\n    print(\"10 /\", num, \"=\", 10 / num)\nexcept ValueError:\n    print(\"Error: not a valid integer.\")\nexcept ZeroDivisionError:\n    print(\"Error: cannot divide by zero.\")\nfinally:\n    print(\"Done.\")" },
        { title: "raise your own exception", code: "def check_age(age):\n    if age < 0:\n        raise ValueError(\"Age cannot be negative.\")\n    print(f\"Age is {age}.\")\n\ntry:\n    check_age(-5)\nexcept ValueError as e:\n    print(\"Caught:\", e)" },
      ],
      quiz: [
        { q: "Which block always runs, error or not?", choices: ["try", "except", "else", "finally"], answer: 3, explain: "finally always runs — perfect for cleanup like closing files." },
        { q: "`else` in a try statement runs when…", choices: ["An exception occurs", "No exception occurs", "Always", "Never"], answer: 1, explain: "The else block runs only if the try block raised nothing." },
      ],
    },
    {
      id: "practice",
      title: "Practice problems",
      sub: "Robust input and quick plots.",
      slides: "07:26",
      keywords: "practice division register plot line bar",
      learn: [
        { type: "list", title: "Try these (from the slides)", items: [
          "Division program that warns on divide-by-zero and invalid input.",
          "Pick an item from a list by index, warning on a bad index.",
          "Registration: reject duplicate usernames and passwords shorter than 6 chars.",
          "Plot a line for x = [1..5], y = [2,4,6,8,10].",
          "Plot a bar chart for subjects A–D with scores [80,65,90,70].",
        ] },
      ],
      live: [
        { title: "Bar chart of scores (solved)", code: "import matplotlib.pyplot as plt\nsubjects = ['A', 'B', 'C', 'D']\nscores = [80, 65, 90, 70]\nplt.bar(subjects, scores, color='teal')\nplt.title(\"Scores\")\nplt.ylabel(\"Score\")\nplt.show()" },
        { title: "Safe index selection (your turn)", code: "items = [1, 2, 3]\ntry:\n    i = int(input(\"Pick index 0-2: \"))\n    print(\"You chose:\", items[i])\nexcept (ValueError, IndexError) as e:\n    print(\"Invalid choice:\", e)" },
      ],
    },
  ],
});
