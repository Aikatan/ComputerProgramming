/* ===================== Topic 06 — Strings, Lists & Dictionaries ===================== */
App.registerTopic({
  id: "t06",
  title: "Strings, Lists & Dictionaries",
  short: "Strings, Lists, Dicts",
  blurb: "The everyday data containers: text, ordered lists, and key-value dictionaries.",
  intro: "Most real programs shuffle collections of data around. Here are the three you'll reach for daily — with animations that show them changing as your code runs.",
  lessons: [
    {
      id: "strings",
      title: "Strings in depth",
      sub: "How text is stored, indexed, sliced, transformed — and shifted.",
      slides: "06:4–12",
      keywords: "string slice index method upper lower strip replace split find format fstring len immutable caesar shift",
      learn: [
        { type: "text", html: "A <span class='term'>string</span> is an <b>ordered sequence of characters</b>. Because it's ordered, every character has a numbered position; because it's a sequence, indexing and slicing work exactly like they do on lists. The reading below is organised into tabs — skim what you need, then play with the interactive demos underneath." },

        { type: "tabs", tabs: [
          { label: "Creating", blocks: [
            { type: "text", html: "You can write a string with single, double, or triple quotes. Triple quotes span multiple lines and are also used for docstrings." },
            { type: "example", caption: "three ways to quote", code:
"single = 'Hello'\ndouble = \"World\"\nmulti  = '''line one\nline two'''\nprint(single, double)\nprint(multi)",
              output: "Hello World\nline one\nline two" },
            { type: "note", html: "Use double quotes when the text contains an apostrophe (<code>\"it's\"</code>), and single quotes when it contains double quotes (<code>'He said \"hi\"'</code>). Either way they're the same type — <code>str</code>." },
          ] },
          { label: "Indexing", blocks: [
            { type: "text", html: "Each character has a position called an <span class='term'>index</span>, starting at <b>0</b> on the left. <b>Negative</b> indices count from the right, starting at <code>-1</code> for the last character. Asking for an index that doesn't exist raises an <code>IndexError</code>." },
            { type: "example", caption: "positive and negative indexing", code:
"text = \"Python\"\nprint(text[0])   # 'P'  (first)\nprint(text[5])   # 'n'  (last)\nprint(text[-1])  # 'n'  (last, from the right)\nprint(text[-6])  # 'P'  (first, from the right)",
              output: "P\nn\nn\nP" },
            { type: "note", html: "Play with the <b>String indexing</b> demo below to see the positive (blue) and negative (orange) index of every character at once." },
          ] },
          { label: "Slicing", blocks: [
            { type: "text", html: "A <span class='term'>slice</span> <code>text[start:end:step]</code> extracts a substring. <b>start</b> is included, <b>end</b> is excluded, and the optional <b>step</b> is how far to jump each time. Any of the three can be left out to use its default (<code>0</code>, <code>len</code>, <code>1</code>)." },
            { type: "example", caption: "the three slice numbers", code:
"text = \"Programming\"\nprint(text[0:6])   # 'Progra'   start..end-1\nprint(text[3:])    # 'gramming' to the end\nprint(text[:4])    # 'Prog'     from the start\nprint(text[::2])   # 'Pormig'   every 2nd char\nprint(text[::-1])  # 'gnimmargorP'  reversed (step -1)",
              annot: [
                { c: "text[0:6]", e: "indices 0,1,2,3,4,5 — the 6 is excluded." },
                { c: "text[::2]", e: "empty start/end means whole string; step 2 takes every other character." },
                { c: "text[::-1]", e: "a negative step walks backwards, reversing the string — a very common idiom." },
              ] },
            { type: "note", html: "Slicing <b>never errors</b> on out-of-range numbers — it just clamps. <code>\"Hi\"[0:999]</code> is simply <code>\"Hi\"</code>. The <b>String slicing</b> demo below lets you drag start/end/step and watch the selection change." },
          ] },
          { label: "Methods", blocks: [
            { type: "text", html: "Strings come with dozens of built-in <span class='term'>methods</span> — functions you call with a dot. They <b>return a new string</b> (the original is never changed)." },
            { type: "list", title: "The ones you'll use daily", items: [
              "<code>.upper()</code> / <code>.lower()</code> — change case.",
              "<code>.strip()</code> — remove leading/trailing whitespace.",
              "<code>.replace(old, new)</code> — swap every occurrence of a substring.",
              "<code>.split(sep)</code> — break the string into a <i>list</i> of pieces.",
              "<code>.find(sub)</code> — index of the first match (or <code>-1</code> if absent).",
              "<code>.count(sub)</code> — how many times a substring appears.",
              "<code>.startswith(x)</code> / <code>.endswith(x)</code> — boolean checks.",
              "<code>len(s)</code> — number of characters (spaces and punctuation count too).",
            ] },
            { type: "example", caption: "chaining methods", code:
"raw = \"  Hello, World!  \"\nprint(raw.strip().lower())          # 'hello, world!'\nprint(raw.strip().split(\",\"))       # ['Hello', ' World!']\nprint(\"banana\".count(\"a\"))          # 3",
              output: "hello, world!\n['Hello', ' World!']\n3" },
          ] },
          { label: "Formatting", blocks: [
            { type: "text", html: "An <span class='term'>f-string</span> (prefix <code>f</code>) lets you embed variables and expressions directly inside text using <code>{ }</code>. You can also format numbers — e.g. <code>{value:.2f}</code> for two decimals." },
            { type: "example", caption: "f-strings with formatting", code:
"name = \"Alice\"\nscore = 87.5\nprint(f\"{name} scored {score}\")\nprint(f\"{name} scored {score:.0f}%\")     # no decimals\nprint(f\"{'pad':>8}|\")                    # right-align in 8 cols",
              output: "Alice scored 87.5\nAlice scored 88%\n     pad|" },
            { type: "note", html: "The older <code>\"{} {}\".format(a, b)</code> style still works, but f-strings read top-to-bottom in order and are almost always clearer." },
          ] },
          { label: "Immutability", blocks: [
            { type: "text", html: "Strings are <span class='term'>immutable</span> — once created, you cannot change a character in place. Instead you build a <b>new</b> string. This is why operations like 'shift every letter' produce a fresh string rather than editing the old one." },
            { type: "example", caption: "you can't edit, only rebuild", code:
"text = \"hello\"\n# text[0] = \"H\"      # TypeError: does not support item assignment\ntext = \"H\" + text[1:]  # build a new string instead\nprint(text)            # 'Hello'",
              output: "Hello" },
            { type: "deepdive", title: "Why immutable? (and the C contrast)", html: "<p>In <b>C</b>, a string is a mutable array of bytes ending in a <code>\\0</code> — you can poke any byte directly, and it's your job not to overrun the buffer. Python trades that raw control for safety: because strings can't change, they can be shared freely, used as dictionary keys, and cached. The cost is that building a string character-by-character creates many temporaries — which is why you usually collect pieces in a list and <code>\"\".join(...)</code> them at the end.</p>" },
          ] },
        ] },

        { type: "subhead", text: "🔵 Interactive: indexing" },
        { type: "text", html: "Type any text and an index (try negatives). The selected box shows what <code>text[i]</code> returns; the small numbers are the positive index (top) and negative index (bottom)." },
        { type: "widget", name: "stringIndex", config: { text: "Python" } },

        { type: "subhead", text: "🟢 Interactive: slicing" },
        { type: "text", html: "Drag the three slice values. Highlighted boxes are the characters included, numbered in the order they're picked — so you can <i>see</i> exactly what <code>text[start:end:step]</code> produces, including reversed slices with a negative step." },
        { type: "widget", name: "stringSlice", config: { text: "Programming" } },

        { type: "subhead", text: "🟡 Interactive: shifting letters (the Caesar cipher)" },
        { type: "text", html: "A classic text transform: move every letter forward by <code>x</code> places in the alphabet, wrapping <code>Z→A</code>. Because strings are immutable, the result is a brand-new string. Slide the shift and watch each letter map to its new one." },
        { type: "widget", name: "stringShift", config: { text: "HELLO", shift: 3 } },
      ],
      live: [
        { title: "Indexing & slicing — change the numbers and re-run", code: "text = \"Programming\"\nprint(\"first :\", text[0])\nprint(\"last  :\", text[-1])\nprint(\"3..7  :\", text[3:7])\nprint(\"every2:\", text[::2])\nprint(\"reverse:\", text[::-1])" },
        { title: "Method tour", code: "s = \"  Hello, World!  \"\nprint(s.strip())\nprint(s.upper())\nprint(s.replace(\"World\", \"Python\"))\nprint(s.strip().split(\",\"))\nprint(\"length:\", len(s))\nprint(\"count l:\", s.count('l'))" },
        { title: "Build your own Caesar cipher", code: "def caesar(text, shift):\n    result = \"\"\n    for ch in text:\n        if ch.isupper():\n            result += chr((ord(ch) - 65 + shift) % 26 + 65)\n        elif ch.islower():\n            result += chr((ord(ch) - 97 + shift) % 26 + 97)\n        else:\n            result += ch          # leave spaces/punctuation alone\n    return result\n\nsecret = caesar(\"Hello, World!\", 3)\nprint(secret)                 # Khoor, Zruog!\nprint(caesar(secret, -3))     # decrypt back" },
      ],
      quiz: [
        { q: "`\"Python\"[-2]` is…", choices: ["P", "o", "h", "n"], answer: 1, explain: "Index -2 is the second character from the right: 'o'." },
        { q: "`\"ComPro\"[::-1]` gives…", choices: ["ComPro", "orPmoC", "CmPo", "Error"], answer: 1, explain: "Step −1 walks backwards, reversing the string: orPmoC." },
        { q: "What does `\"Programming\"[2:5]` return?", choices: ["'rog'", "'ogr'", "'rogr'", "'Pro'"], answer: 0, explain: "Indices 2,3,4 → 'r','o','g'. The 5 is excluded." },
        { q: "Why can't you do `text[0] = 'H'`?", choices: ["Index 0 is reserved", "Strings are immutable", "You need text[0.0]", "It actually works"], answer: 1, explain: "Strings can't be changed in place — build a new one instead." },
        { q: "In a Caesar shift of 1, 'Z' becomes…", choices: ["'[' (next ASCII)", "'A' (wraps around)", "'Y'", "Error"], answer: 1, explain: "The modulo-26 wrap takes 'Z' back to 'A'." },
      ],
    },
    {
      id: "lists",
      title: "Lists",
      sub: "Ordered, mutable collections — watch them change.",
      slides: "06:13–21",
      keywords: "list append insert extend remove pop clear index slice mutable",
      learn: [
        { type: "text", html: "A <span class='term'>list</span> is an <b>ordered, mutable</b> collection in square brackets: <code>[1, 2, 3]</code>. It can hold mixed types and resizes automatically." },
        { type: "subhead", text: "Watch modifications happen" },
        { type: "widget", name: "listViz", config: {
          kind: "list",
          title: "Building and trimming a list",
          steps: [
            { items: [1, 2], caption: "my_list = [1, 2]" },
            { items: [1, 2, 3], flash: [2], caption: "my_list.append(3)  → adds 3 to the end" },
            { items: [1, 2, 2, 3], flash: [1], caption: "my_list.insert(1, 2)  → inserts 2 at index 1" },
            { items: [1, 2, 2, 3, 4, 5], flash: [4, 5], caption: "my_list.extend([4, 5])  → appends each element" },
            { items: [1, 2, 3, 4, 5], flash: [1], caption: "my_list.remove(2)  → removes the FIRST 2" },
            { items: [1, 3, 4, 5], caption: "my_list.pop(1)  → removes & returns index 1" },
            { items: [], caption: "my_list.clear()  → empties the list" },
          ],
        } },
        { type: "list", title: "Key operations", items: [
          "Access/slice like strings: <code>my_list[0]</code>, <code>my_list[1:4]</code>, <code>my_list[::-1]</code>.",
          "Add: <code>append(x)</code>, <code>insert(i, x)</code>, <code>extend([...])</code>.",
          "Remove: <code>remove(x)</code>, <code>pop(i)</code>, <code>clear()</code>.",
          "Aggregate: <code>sum()</code>, <code>min()</code>, <code>max()</code>, <code>len()</code>.",
        ] },
      ],
      live: [
        { title: "Grades example", code: "grades = [85, 90, 78, 92, 88, 76]\nprint(\"highest:\", max(grades))\nprint(\"lowest :\", min(grades))\nprint(f\"average: {sum(grades)/len(grades):.2f}\")" },
        { title: "Mutate a list", code: "tasks = [\"Project\", \"Groceries\", \"Read\"]\ntasks.append(\"Exercise\")\ntasks.remove(\"Groceries\")\nprint(tasks)" },
      ],
      quiz: [
        { q: "Which adds a single item to the end of a list?", choices: ["extend", "append", "insert", "pop"], answer: 1, explain: "append(x) adds one item at the end; extend adds each item from an iterable." },
        { q: "Lists are…", choices: ["Immutable", "Ordered and mutable", "Key-value pairs", "Always sorted"], answer: 1, explain: "Lists keep insertion order and can be changed after creation." },
      ],
    },
    {
      id: "dictionaries",
      title: "Dictionaries",
      sub: "Key-value pairs with fast lookup.",
      slides: "06:22–34",
      keywords: "dict dictionary key value get pop items keys values lookup hash",
      learn: [
        { type: "text", html: "A <span class='term'>dictionary</span> stores <b>key → value</b> pairs in curly braces: <code>{\"name\": \"Alice\", \"age\": 25}</code>. Keys must be unique and immutable; lookup by key is very fast (it uses hashing)." },
        { type: "widget", name: "listViz", config: {
          kind: "dict",
          title: "Adding, updating, and removing keys",
          steps: [
            { items: { name: "Alice", age: 25 }, caption: "person = {'name': 'Alice', 'age': 25}" },
            { items: { name: "Alice", age: 26 }, flash: ["age"], caption: "person['age'] = 26  → update existing key" },
            { items: { name: "Alice", age: 26, gender: "Female" }, flash: ["gender"], caption: "person['gender'] = 'Female'  → add new key" },
            { items: { name: "Alice", gender: "Female" }, caption: "del person['age']  → remove a key" },
            { items: { name: "Alice" }, caption: "person.popitem()  → remove the last pair" },
          ],
        } },
        { type: "list", title: "Access & iterate", items: [
          "<code>d['key']</code> — errors if missing.  <code>d.get('key', default)</code> — safe.",
          "Loop keys: <code>for k in d:</code> / values: <code>for v in d.values():</code> / both: <code>for k, v in d.items():</code>.",
          "Remove: <code>del d['k']</code>, <code>d.pop('k', default)</code>, <code>d.clear()</code>.",
        ] },
        { type: "example", caption: "counting words — a classic dict pattern", code:
"text = \"apple banana apple orange banana apple\"\nwords = text.split()\ncount = {}\nfor word in words:\n    count[word] = count.get(word, 0) + 1\nprint(count)",
          output: "{'apple': 3, 'banana': 2, 'orange': 1}" },
      ],
      live: [
        { title: "Word frequency counter", code: "text = \"apple banana apple orange banana apple\"\ncount = {}\nfor word in text.split():\n    count[word] = count.get(word, 0) + 1\nprint(count)" },
      ],
      quiz: [
        { q: "What's the safe way to read a possibly-missing key?", choices: ["d['x']", "d.get('x', default)", "d.x", "get d x"], answer: 1, explain: "get() returns a default instead of raising KeyError." },
        { q: "Why is dict lookup fast?", choices: ["It scans every item", "It uses hashing", "It sorts first", "It uses the GPU"], answer: 1, explain: "Dictionaries hash keys for near-constant-time lookup." },
      ],
    },
    {
      id: "list-vs-dict",
      title: "Lists vs Dictionaries",
      sub: "When to pick which.",
      slides: "06:34",
      keywords: "list dictionary comparison index key lookup speed",
      learn: [
        { type: "widget", name: "diagram", config: { layout: "row", title: "Two containers, different jobs", boxes: [
          { title: "List", body: "Indexed by <b>position</b> (0,1,2…). Allows duplicates. Lookup by value is slower. Use when <i>order</i> matters and items are a sequence." },
          { title: "Dictionary", body: "Indexed by <b>key</b> (\"name\", \"age\"). Keys unique. Lookup is fast (hashing). Use when each item has a <i>label</i>." },
        ] } },
        { type: "note", html: "Rule of thumb: reaching for items by a meaningful name → dict. Walking through an ordered sequence → list." },
      ],
      live: [
        { title: "Same data, two shapes", code: "# As a list (order)\nscores_list = [85, 92, 78]\nprint(scores_list[0])\n\n# As a dict (labels)\nscores_dict = {\"math\": 85, \"sci\": 92, \"eng\": 78}\nprint(scores_dict[\"sci\"])" },
      ],
      quiz: [
        { q: "You need to look data up by a name like \"email\". Use a…", choices: ["list", "dictionary", "tuple", "string"], answer: 1, explain: "Dictionaries map meaningful keys to values." },
      ],
    },
    {
      id: "practice",
      title: "Practice problems",
      sub: "Combine strings, lists, and dicts.",
      slides: "06:36",
      keywords: "practice word count even sum longest merge unique frequency",
      learn: [
        { type: "list", title: "Try these (from the slides)", items: [
          "Count words in a sentence (split on spaces).",
          "Sum only the even numbers in a list.",
          "Find the longest word in a list of words.",
          "Merge two lists with no duplicates.",
          "Count how many times each letter appears in a string (store in a dict).",
          "Store student names and subject scores in a dict; compute each one's average.",
          "Merge two number dicts; if a key repeats, add the values.",
        ] },
      ],
      live: [
        { title: "Sum of even numbers (solved)", code: "nums = [3, 8, 1, 6, 7, 4, 10]\ntotal = sum(n for n in nums if n % 2 == 0)\nprint(\"sum of evens:\", total)" },
        { title: "Merge two dicts, adding repeats (your turn)", code: "a = {'x': 1, 'y': 2}\nb = {'y': 5, 'z': 3}\nresult = dict(a)\nfor k, v in b.items():\n    result[k] = result.get(k, 0) + v\nprint(result)   # {'x':1,'y':7,'z':3}" },
      ],
    },
  ],
});
