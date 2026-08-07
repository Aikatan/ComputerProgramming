/* ===================== Topic 08 — Data Processing ===================== */
App.registerTopic({
  id: "t08",
  title: "Data Processing",
  short: "Files, NumPy & Pandas",
  blurb: "Read and write files, crunch numbers with NumPy, and analyse tables with pandas.",
  intro: "The capstone: making data persist (files), compute fast (NumPy), and analyse cleanly (pandas). Every example runs live — files are created in an in-browser virtual filesystem.",
  lessons: [
    {
      id: "file-handling",
      title: "File handling",
      sub: "open, read, write, and the with statement.",
      slides: "08:4–11",
      keywords: "file open read write close with mode os module append",
      learn: [
        { type: "text", html: "<span class='term'>File handling</span> saves data that outlives one run.<br>RAM forgets, disk remembers.<br>You <code>open()</code> a file in a <b>mode</b>, use it, then close it." },

        { type: "subhead", text: "The life of a file" },
        { type: "widget", name: "fileFlow", config: {
          filename: "notes.txt",
          title: "Open, write, close, then reopen to read",
          code: [
            "with open('notes.txt', 'w') as f:",
            "    f.write('first line')",
            "    f.writelines(['second', 'third'])",
            "",
            "with open('notes.txt', 'r') as f:",
            "    text = f.read()",
            "    print(text)",
          ],
          steps: [
            { line: 0, mode: "w", status: "open", content: [], exists: true, note: "<code>open('notes.txt', 'w')</code> creates the file and opens it. Mode <code>'w'</code> starts empty." },
            { line: 1, mode: "w", status: "open", content: ["first line"], flow: "write", note: "<code>f.write</code> adds one line." },
            { line: 2, mode: "w", status: "open", content: ["first line", "second", "third"], flow: "write", note: "<code>f.writelines</code> adds several lines." },
            { line: 3, status: "closed", content: ["first line", "second", "third"], note: "The <b>with</b> block ends. The file closes on its own." },
            { line: 4, mode: "r", status: "open", content: ["first line", "second", "third"], note: "Reopen the same file in read mode <code>'r'</code>." },
            { line: 5, mode: "r", status: "open", content: ["first line", "second", "third"], flow: "read", note: "<code>f.read()</code> pulls the whole file into <code>text</code>." },
            { line: 6, mode: "r", status: "open", content: ["first line", "second", "third"], flow: "read", out: "first line\nsecond\nthird", note: "<code>print(text)</code> shows what we read." },
            { line: 6, status: "closed", content: ["first line", "second", "third"], out: "first line\nsecond\nthird", note: "The block ends. The file closes again." },
          ],
        } },

        { type: "deflist", title: "File modes", items: [
          { t: "<code>'r'</code> read", d: "Default. Errors if the file is missing." },
          { t: "<code>'w'</code> write", d: "Creates the file, or wipes it if it exists." },
          { t: "<code>'a'</code> append", d: "Adds to the end. Keeps what is there." },
          { t: "<code>'x'</code> create", d: "Errors if the file already exists." },
          { t: "<code>'b'</code> / <code>'t'</code>", d: "Binary or text. Text is the default." },
        ] },
        { type: "example", caption: "the with statement closes the file for you", code:
"with open('example.txt', 'w') as file:\n    file.write('Hello, World!\\n')\n    file.writelines(['Line 1\\n', 'Line 2\\n'])\n\nwith open('example.txt', 'r') as file:\n    print(file.read())",
          annot: [
            { c: "with open(...) as file", e: "Auto-closes the file even if an error happens." },
            { c: "'w'", e: "Write mode wipes any existing content first." },
            { c: ".read()", e: "Reads the whole file as one string." },
          ] },
        { type: "note", title: "The os module", html: "<code>import os</code> gives file and folder tools:<br><code>os.getcwd()</code>, <code>os.listdir(path)</code>, <code>os.mkdir(path)</code>, <code>os.remove(path)</code>." },
      ],
      live: [
        { title: "Easy: write one line, read it back", code: "with open('hi.txt', 'w') as f:\n    f.write('Hello, file!\\n')\n\nwith open('hi.txt', 'r') as f:\n    print(f.read())" },
        { title: "Medium: write many lines, then list .txt files", code: "with open('notes.txt', 'w') as f:\n    f.write('first line\\n')\n    f.writelines(['second\\n', 'third\\n'])\n\nwith open('notes.txt', 'r') as f:\n    print(f.read())\n\nimport os\nprint('files here:', [x for x in os.listdir('.') if x.endswith('.txt')])" },
        { title: "Harder: append keeps old content ('a' vs 'w')", code: "with open('log.txt', 'w') as f:\n    f.write('line 1\\n')\n\nwith open('log.txt', 'a') as f:\n    f.write('line 2\\n')\n\nwith open('log.txt', 'r') as f:\n    print(f.read())" },
      ],
      quiz: [
        { q: "Opening a file in 'w' mode when it exists…", choices: ["Appends to it", "Truncates (wipes) it", "Raises an error", "Reads it"], answer: 1, explain: "'w' truncates the file. Use 'a' to append instead." },
        { q: "Why prefer `with open(...)`?", choices: ["It's faster", "It auto-closes the file, even on error", "It encrypts data", "It avoids imports"], answer: 1, explain: "The with statement guarantees the file is closed properly." },
      ],
    },
    {
      id: "csv-json",
      title: "CSV & JSON files",
      sub: "Two everyday data formats.",
      slides: "08:12–15",
      keywords: "csv json writer reader dump load serialize",
      learn: [
        { type: "list", title: "Two modules", items: [
          "<b>csv</b> — comma-separated tables: <code>csv.writer(f).writerow([...])</code> and <code>csv.reader(f)</code>.",
          "<b>json</b> — structured data: <code>json.dump(data, f)</code> to write, <code>json.load(f)</code> to read. Works directly with dicts and lists.",
        ] },
        { type: "example", caption: "round-tripping JSON", code:
"import json\ndata = {'name': 'Alice', 'age': 30}\nwith open('data.json', 'w') as f:\n    json.dump(data, f)\n\nwith open('data.json', 'r') as f:\n    print(json.load(f))",
          output: "{'name': 'Alice', 'age': 30}" },
      ],
      live: [
        { title: "CSV write & read", code: "import csv\nwith open('data.csv', 'w', newline='') as f:\n    w = csv.writer(f)\n    w.writerow(['Name', 'Age', 'City'])\n    w.writerow(['Alice', 30, 'New York'])\n    w.writerow(['Bob', 25, 'San Francisco'])\n\nwith open('data.csv', 'r') as f:\n    for row in csv.reader(f):\n        print(row)" },
      ],
      quiz: [
        { q: "Which module serializes a Python dict to a file directly?", choices: ["csv", "json", "os", "math"], answer: 1, explain: "json.dump() writes dicts/lists; json.load() reads them back." },
      ],
    },
    {
      id: "numpy",
      title: "NumPy arrays",
      sub: "Fast numerical computing with ndarray.",
      slides: "08:16–24",
      keywords: "numpy array ndarray shape dtype slicing elementwise sum mean ufunc",
      learn: [
        { type: "text", html: "<span class='term'>NumPy</span> gives the <code>ndarray</code>: a grid of numbers, all one type.<br>It runs fast <b>element-wise</b> maths.<br>Convention: <code>import numpy as np</code>." },

        { type: "subhead", text: "Element-wise, all at once" },
        { type: "widget", name: "arrayOp", config: { title: "a + b  (matching positions add)", a: [1, 2, 3], b: [4, 5, 6], op: "+" } },
        { type: "widget", name: "arrayOp", config: { title: "a * 2  (broadcasting: the scalar spreads to every element)", a: [1, 2, 3], b: 2, op: "*" } },

        { type: "example", caption: "element-wise operations", code:
"import numpy as np\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nprint(a + b)   # [5 7 9]\nprint(a * b)   # [ 4 10 18]\nprint(np.sum(a), np.mean(a))   # 6 2.0",
          annot: [
            { c: "a + b", e: "Adds matching elements. No loop needed." },
            { c: "np.sum(a)", e: "Aggregations like sum/mean/max run in fast C code." },
          ] },
        { type: "deflist", title: "Array attributes", items: [
          { t: "<code>a.ndim</code>", d: "Number of dimensions." },
          { t: "<code>a.shape</code>", d: "Size along each axis." },
          { t: "<code>a.size</code>", d: "Total number of elements." },
          { t: "<code>a.dtype</code>", d: "Element type." },
          { t: "Index / slice", d: "<code>a[1, 2]</code> for multi-D, <code>a[1:4]</code> like lists." },
        ] },
        { type: "deepdive", title: "Why NumPy is fast (C arrays under Python)", html: "<p>A Python <code>list</code> stores pointers to scattered objects. Looping it in pure Python is slow.</p><p>A NumPy array packs raw numbers <b>contiguously</b>, like a C array.</p><p>The CPU streams them through cache and the math runs in compiled C. Write Python, get C speed for bulk numbers.</p>" },
      ],
      live: [
        { title: "Easy: element-wise add and multiply", code: "import numpy as np\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nprint(a + b)\nprint(a * 2)" },
        { title: "Medium: 2-D array, shape, row sums", code: "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\nprint(\"shape:\", a.shape)\nprint(\"a[1,2]:\", a[1, 2])\nprint(\"row sums:\", a.sum(axis=1))\nprint(\"max:\", a.max())" },
        { title: "Harder: build a 4x4 identity with a loop", code: "import numpy as np\nm = np.zeros((4, 4))\nfor i in range(4):\n    m[i, i] = 1\nprint(m)" },
      ],
      quiz: [
        { q: "`np.array([1,2,3]) * np.array([4,5,6])` gives…", choices: ["[5 7 9]", "[4 10 18]", "32", "Error"], answer: 1, explain: "Multiplication is element-wise: 1·4, 2·5, 3·6." },
        { q: "NumPy is fast mainly because its arrays are…", choices: ["Stored on the GPU always", "Packed contiguously and processed in C", "Smaller than lists", "Written to disk"], answer: 1, explain: "Contiguous storage + compiled C operations make NumPy fast." },
      ],
    },
    {
      id: "pandas",
      title: "Pandas DataFrames",
      sub: "Spreadsheet-like analysis in Python.",
      slides: "08:25–37",
      keywords: "pandas dataframe series read_csv head describe loc iloc sort filter",
      learn: [
        { type: "text", html: "<span class='term'>pandas</span> adds two things:<br>a <b>Series</b> (one labelled column) and a <b>DataFrame</b> (a table with named columns).<br>Convention: <code>import pandas as pd</code>." },

        { type: "subhead", text: "Filter and sort a table" },
        { type: "widget", name: "dfFilter", config: {
          title: "Step through a filter, then a sort",
          columns: ["Name", "Age", "City"],
          rows: [["Ali", 25, "New York"], ["Bob", 30, "LA"], ["Char", 35, "Chicago"]],
          scenarios: [
            { label: "df[df['Age'] > 28]", filter: { col: "Age", op: ">", value: 28 } },
            { label: "sort_values('Age', desc)", sort: { col: "Age", dir: "desc" } },
          ],
        } },

        { type: "example", caption: "build and inspect a DataFrame", code:
"import pandas as pd\ndata = {\n    'Name': ['Ali', 'Bob', 'Char'],\n    'Age':  [25, 30, 35],\n    'City': ['New York', 'LA', 'Chicago'],\n}\ndf = pd.DataFrame(data)\nprint(df)\nprint(df[df['Age'] > 28])   # rows where Age > 28",
          annot: [
            { c: "pd.DataFrame(data)", e: "Turns a dict of columns into a table." },
            { c: "df['Age'] > 28", e: "Boolean filter. Keeps only matching rows." },
          ] },
        { type: "deflist", title: "Everyday pandas", items: [
          { t: "Read / write", d: "<code>pd.read_csv(...)</code>, <code>df.to_csv(...)</code> (also excel, json)." },
          { t: "Inspect", d: "<code>df.head()</code>, <code>df.info()</code>, <code>df.describe()</code>." },
          { t: "Select", d: "<code>df['col']</code>, <code>df.loc[label]</code>, <code>df.iloc[0]</code>." },
          { t: "Sort", d: "<code>df.sort_values(by='Age')</code>." },
          { t: "Group", d: "<code>df.groupby('dept')['salary'].mean()</code>." },
        ] },
      ],
      live: [
        { title: "Easy: build and print a DataFrame", code: "import pandas as pd\ndf = pd.DataFrame({'Name': ['Alice', 'Bob', 'Charlie'],\n                   'Score': [88, 72, 95]})\nprint(df)" },
        { title: "Medium: sort by score, then average", code: "import pandas as pd\ndata = {'Name': ['Alice','Bob','Charlie'],\n        'Age':  [25, 30, 35],\n        'Score':[88, 72, 95]}\ndf = pd.DataFrame(data)\nprint(df.sort_values(by='Score', ascending=False))\nprint(\"\\nAverage score:\", df['Score'].mean())" },
        { title: "Harder: average salary per department (groupby)", code: "import pandas as pd\nstaff = pd.DataFrame({\n    'name': ['A','B','C','D'],\n    'dept': ['IT','HR','IT','HR'],\n    'salary': [50000, 45000, 60000, 47000],\n})\nprint(staff.groupby('dept')['salary'].mean())" },
      ],
      quiz: [
        { q: "A pandas DataFrame is most like a…", choices: ["single number", "table / spreadsheet", "text file", "for loop"], answer: 1, explain: "A DataFrame is a 2-D labelled table — rows and named columns." },
        { q: "Which gives the average salary per department?", choices: ["df.mean()", "df.groupby('dept')['salary'].mean()", "df.sort_values('salary')", "df.head()"], answer: 1, explain: "groupby('dept') then .mean() on salary aggregates per group." },
      ],
    },
    {
      id: "practice",
      title: "Practice problems",
      sub: "Files, arrays, and tables together.",
      slides: "08:39",
      keywords: "practice file sum numpy diagonal dataframe average csv groupby",
      learn: [
        { type: "list", title: "Try these (from the slides)", items: [
          "Write 1..10 to a .txt file, read it back, and sum the numbers.",
          "Make a 4×4 NumPy array of zeros with 1s on the diagonal.",
          "Make a 3×3 array of ints 1..10; find each row's sum and the overall max.",
          "Build a student DataFrame (name, age, score) and find the average score.",
          "Read a CSV and keep only rows where price > 100.",
          "Employee DataFrame (name, dept, salary); group by dept for average salary.",
        ] },
      ],
      live: [
        { title: "Write 1..10, read back, sum (solved)", code: "with open('nums.txt', 'w') as f:\n    for i in range(1, 11):\n        f.write(f\"{i}\\n\")\n\ntotal = 0\nwith open('nums.txt', 'r') as f:\n    for line in f:\n        total += int(line)\nprint(\"sum 1..10 =\", total)" },
        { title: "4x4 identity (your turn)", code: "import numpy as np\nm = np.eye(4, dtype=int)   # try building it with a loop too!\nprint(m)" },
      ],
    },
  ],
});
