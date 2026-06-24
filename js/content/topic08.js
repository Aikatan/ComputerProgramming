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
        { type: "text", html: "<span class='term'>File handling</span> lets a program save data that outlives a single run (remember: RAM forgets, disk remembers). You <code>open()</code> a file in a <b>mode</b>, work with it, and close it." },
        { type: "list", title: "File modes", items: [
          "<code>'r'</code> read (default) — errors if missing.",
          "<code>'w'</code> write — creates or <b>truncates</b> (wipes) the file.",
          "<code>'a'</code> append — adds to the end.",
          "<code>'x'</code> create — errors if it already exists.",
          "Add <code>'b'</code> for binary (images etc.); <code>'t'</code> text is the default.",
        ] },
        { type: "example", caption: "the with statement closes the file for you", code:
"with open('example.txt', 'w') as file:\n    file.write('Hello, World!\\n')\n    file.writelines(['Line 1\\n', 'Line 2\\n'])\n\nwith open('example.txt', 'r') as file:\n    print(file.read())",
          annot: [
            { c: "with open(...) as file", e: "Auto-closes the file even if an error happens — always prefer this." },
            { c: "'w'", e: "Write mode wipes any existing content first." },
            { c: ".read()", e: "Reads the whole file as one string. (Also: readline, readlines.)" },
          ] },
        { type: "note", title: "The os module", html: "<code>import os</code> gives <code>os.getcwd()</code>, <code>os.listdir(path)</code>, <code>os.mkdir(path)</code>, <code>os.remove(path)</code> for working with files and folders." },
      ],
      live: [
        { title: "Write then read a file (virtual FS — really runs)", code: "with open('notes.txt', 'w') as f:\n    f.write('first line\\n')\n    f.writelines(['second\\n', 'third\\n'])\n\nwith open('notes.txt', 'r') as f:\n    print(f.read())\n\nimport os\nprint('files here:', [x for x in os.listdir('.') if x.endswith('.txt')])" },
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
        { type: "text", html: "<span class='term'>NumPy</span> provides the <code>ndarray</code>: a grid of numbers, all the same type, that supports fast <b>element-wise</b> maths. Convention: <code>import numpy as np</code>." },
        { type: "example", caption: "element-wise operations", code:
"import numpy as np\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nprint(a + b)   # [5 7 9]\nprint(a * b)   # [ 4 10 18]\nprint(np.sum(a), np.mean(a))   # 6 2.0",
          annot: [
            { c: "a + b", e: "Adds matching elements — no loop needed." },
            { c: "np.sum(a)", e: "Aggregations like sum/mean/max run in fast C code." },
          ] },
        { type: "list", title: "Array attributes", items: [
          "<code>a.ndim</code> dimensions, <code>a.shape</code> size per axis, <code>a.size</code> total, <code>a.dtype</code> element type.",
          "Index multi-D with commas: <code>a[1, 2]</code>. Slice like lists: <code>a[1:4]</code>.",
        ] },
        { type: "deepdive", title: "Why NumPy is fast (C arrays under Python)", html: "<p>A Python <code>list</code> stores <i>pointers</i> to scattered objects; looping over it in pure Python is slow. A NumPy array stores raw numbers <b>packed contiguously</b> — exactly like a C array — so the CPU can stream them through cache and the math runs in compiled C. This is the convenience-vs-speed trade-off from Topic 00 resolved: write Python, get C speed for bulk numbers.</p>" },
      ],
      live: [
        { title: "Array maths", code: "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\nprint(\"shape:\", a.shape)\nprint(\"a[1,2]:\", a[1, 2])\nprint(\"row sums:\", a.sum(axis=1))\nprint(\"max:\", a.max())" },
        { title: "Identity-ish array (practice idea)", code: "import numpy as np\nm = np.zeros((4, 4))\nfor i in range(4):\n    m[i, i] = 1\nprint(m)" },
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
        { type: "text", html: "<span class='term'>pandas</span> adds the <b>Series</b> (a labelled 1-D column) and the <b>DataFrame</b> (a 2-D table with named columns). Convention: <code>import pandas as pd</code>." },
        { type: "example", caption: "build and inspect a DataFrame", code:
"import pandas as pd\ndata = {\n    'Name': ['Ali', 'Bob', 'Char'],\n    'Age':  [25, 30, 35],\n    'City': ['New York', 'LA', 'Chicago'],\n}\ndf = pd.DataFrame(data)\nprint(df)\nprint(df[df['Age'] > 28])   # rows where Age > 28",
          annot: [
            { c: "pd.DataFrame(data)", e: "Turns a dict of columns into a table." },
            { c: "df['Age'] > 28", e: "Boolean filtering — keep only matching rows." },
          ] },
        { type: "list", title: "Everyday pandas", items: [
          "Read/write: <code>pd.read_csv(...)</code>, <code>df.to_csv(...)</code> (also excel, json).",
          "Inspect: <code>df.head()</code>, <code>df.info()</code>, <code>df.describe()</code>.",
          "Select: <code>df['col']</code>, <code>df.loc[label]</code>, <code>df.iloc[0]</code>.",
          "Sort: <code>df.sort_values(by='Age')</code>.  Group: <code>df.groupby('dept')['salary'].mean()</code>.",
        ] },
      ],
      live: [
        { title: "DataFrame: create, sort, filter, average", code: "import pandas as pd\ndata = {'Name': ['Alice','Bob','Charlie'],\n        'Age':  [25, 30, 35],\n        'Score':[88, 72, 95]}\ndf = pd.DataFrame(data)\nprint(df)\nprint(\"\\nSorted by Score:\")\nprint(df.sort_values(by='Score', ascending=False))\nprint(\"\\nAverage score:\", df['Score'].mean())" },
        { title: "Group by department (practice idea)", code: "import pandas as pd\nstaff = pd.DataFrame({\n    'name': ['A','B','C','D'],\n    'dept': ['IT','HR','IT','HR'],\n    'salary': [50000, 45000, 60000, 47000],\n})\nprint(staff.groupby('dept')['salary'].mean())" },
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
