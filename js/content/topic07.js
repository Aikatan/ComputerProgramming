/* ===================== Topic 07 - Data Visualization & Exception Handling ===================== */
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
      sub: "Line plots, titles, labels - rendered live in your browser.",
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
        { type: "note", title: "It really runs", html: "The <b>Try it Live</b> editors below download Matplotlib the first time and draw the chart inline - no Jupyter needed." },
      ],
      live: [
        { title: "Run me - a real chart appears below", code: "import matplotlib.pyplot as plt\nx = [1, 2, 3, 4, 5]\ny = [10, 20, 25, 30, 35]\nplt.plot(x, y, marker='o', linestyle='--', color='g', label=\"Data Line\")\nplt.title(\"Customized Line Plot\")\nplt.xlabel(\"X-Axis\")\nplt.ylabel(\"Y-Axis\")\nplt.legend()\nplt.grid(True)\nplt.show()" },
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
          "<code>plt.bar(categories, values)</code> - compare categories.",
          "<code>plt.scatter(x, y)</code> - relationship between two variables.",
          "<code>plt.hist(data, bins=30)</code> - distribution of one variable.",
          "<code>plt.savefig(\"plot.png\", dpi=300)</code> - save to a file.",
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
      sub: "try / except / else / finally - don't let bad input crash you.",
      slides: "07:12–20",
      keywords: "exception try except else finally error handling valueerror zerodivision filenotfound",
      learn: [
        { type: "text", html: "An <span class='term'>exception</span> is a runtime error that stops normal flow.<br>Causes: bad input, a missing file, divide by zero.<br>Wrap risky code in <span class='kw'>try</span> / <span class='kw'>except</span> so the error is handled instead of crashing." },

        { type: "subhead", text: "How control flows" },
        { type: "widget", name: "tryFlow", config: {
          title: "Pick an input and step through the flow",
          blocks: [
            { id: "try", label: "try:", code: "num = int(input())\nresult = 10 / num\nprint(result)" },
            { id: "except:val", label: "except ValueError:", code: "print(\"Not a valid number.\")" },
            { id: "except:zero", label: "except ZeroDivisionError:", code: "print(\"Cannot divide by zero.\")" },
            { id: "finally", label: "finally:", code: "print(\"Done.\")" },
          ],
          scenarios: [
            { label: "num = 5", steps: [
              { active: "try", note: "<code>int('5')</code> gives 5.", out: "" },
              { active: "try", note: "<code>result = 10 / 5</code> gives 2.0.", out: "" },
              { active: "try", note: "<code>print(result)</code>.", out: "2.0" },
              { active: "finally", note: "No error was raised, so no <b>except</b> runs. <b>finally</b> still runs.", out: "2.0\nDone." },
            ] },
            { label: "num = 0", steps: [
              { active: "try", note: "<code>int('0')</code> gives 0. Fine so far.", out: "" },
              { active: "try", note: "<code>10 / 0</code> raises an error.", out: "", badge: "⚡ ZeroDivisionError", badgeOn: "try", raised: true },
              { active: "except:zero", note: "<b>ValueError</b> is skipped. Control jumps to the matching <b>except</b>.", out: "Cannot divide by zero." },
              { active: "finally", note: "<b>finally</b> runs no matter what.", out: "Cannot divide by zero.\nDone." },
            ] },
            { label: "num = 'abc'", steps: [
              { active: "try", note: "<code>int('abc')</code> raises an error right away.", out: "", badge: "⚡ ValueError", badgeOn: "try", raised: true },
              { active: "except:val", note: "The rest of <b>try</b> is skipped. <b>except ValueError</b> handles it.", out: "Not a valid number." },
              { active: "finally", note: "<b>finally</b> always runs.", out: "Not a valid number.\nDone." },
            ] },
          ],
        } },

        { type: "example", caption: "catch specific errors", code:
"try:\n    num = int(input(\"Enter a number: \"))\n    result = 10 / num\n    print(result)\nexcept ValueError:\n    print(\"Not a valid number.\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero.\")",
          annot: [
            { c: "try:", e: "Code that might fail goes here." },
            { c: "except ValueError", e: "Runs if int() got something non-numeric." },
            { c: "except ZeroDivisionError", e: "Runs if num was 0. Catch specific types when you can." },
          ] },
        { type: "deflist", title: "The full shape", items: [
          { t: "<span class='kw'>try</span>", d: "The risky code." },
          { t: "<span class='kw'>except</span>", d: "Handle one error type. <code>except Exception as e</code> catches any." },
          { t: "<span class='kw'>else</span>", d: "Runs only if no exception occurred." },
          { t: "<span class='kw'>finally</span>", d: "Always runs. Good for cleanup." },
        ] },
        { type: "note", title: "raise & assert", html: "<code>raise ValueError(\"msg\")</code> triggers an exception on purpose.<br><code>assert condition, \"msg\"</code> checks something that must be true while debugging." },
      ],
      live: [
        { title: "Easy: catch a divide-by-zero", code: "try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero.\")" },
        { title: "Medium: many errors + finally (try 0 or 'abc')", code: "try:\n    num = int(input(\"Enter a number: \"))\n    print(\"10 /\", num, \"=\", 10 / num)\nexcept ValueError:\n    print(\"Error: not a valid integer.\")\nexcept ZeroDivisionError:\n    print(\"Error: cannot divide by zero.\")\nfinally:\n    print(\"Done.\")" },
        { title: "Harder: raise your own, then else", code: "def check_age(age):\n    if age < 0:\n        raise ValueError(\"Age cannot be negative.\")\n    print(f\"Age is {age}.\")\n\ntry:\n    check_age(-5)\nexcept ValueError as e:\n    print(\"Caught:\", e)\nelse:\n    print(\"No error.\")" },
      ],
      quiz: [
        { q: "Which block always runs, error or not?", choices: ["try", "except", "else", "finally"], answer: 3, explain: "finally always runs - perfect for cleanup like closing files." },
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
