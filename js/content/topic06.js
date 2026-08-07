/* ===================== Topic 06 — Strings, Lists & Dictionaries ===================== */
App.registerTopic({
  id: "t06",
  title: "Strings, Lists & Dictionaries",
  short: "Strings, Lists, Dicts",
  blurb: "The everyday data containers: text, ordered lists, and key-value dictionaries.",
  intro: "Most programs move collections of data around.<br>Here are the three you use daily, with live animations.",
  lessons: [
    {
      id: "strings",
      title: "Strings in depth",
      sub: "How text is stored, indexed, sliced, and shifted.",
      slides: "06:4–12",
      keywords: "string slice index method upper lower strip replace split find format fstring len immutable caesar shift",
      learn: [
        { type: "text", html: "A <span class='term'>string</span> is an <b>ordered sequence of characters</b>.<br>Every character has a numbered position." },

        { type: "tabs", tabs: [
          { label: "Creating", blocks: [
            { type: "text", html: "Write a string with single, double, or triple quotes.<br>Triple quotes span multiple lines." },
            { type: "example", caption: "three ways to quote", code:
"single = 'Hello'\ndouble = \"World\"\nmulti  = '''line one\nline two'''\nprint(single, double)\nprint(multi)",
              output: "Hello World\nline one\nline two" },
            { type: "note", html: "Double quotes when the text has an apostrophe (<code>\"it's\"</code>).<br>Single quotes when it has double quotes (<code>'He said \"hi\"'</code>).<br>Both are the same type: <code>str</code>." },
          ] },
          { label: "Indexing", blocks: [
            { type: "text", html: "Each character has a position called an <span class='term'>index</span>.<br>Counting starts at <b>0</b> on the left.<br><b>Negative</b> indices count from the right, from <code>-1</code>.<br>A missing index raises <code>IndexError</code>." },
            { type: "example", caption: "positive and negative indexing", code:
"text = \"Python\"\nprint(text[0])   # 'P'  (first)\nprint(text[5])   # 'n'  (last)\nprint(text[-1])  # 'n'  (last, from the right)\nprint(text[-6])  # 'P'  (first, from the right)",
              output: "P\nn\nn\nP" },
            { type: "note", html: "Every character has <b>two</b> indexes: a positive one from the left and a negative one from the right." },
          ] },
          { label: "Slicing", blocks: [
            { type: "text", html: "A <span class='term'>slice</span> <code>text[start:end:step]</code> pulls out a substring." },
            { type: "deflist", title: "The three slice numbers", items: [
              { t: "<code>start</code>", d: "First index to include. Default <code>0</code>." },
              { t: "<code>end</code>", d: "Stop before this index. Default is the length." },
              { t: "<code>step</code>", d: "How far to jump each time. Default <code>1</code>." },
            ] },
            { type: "example", caption: "the three slice numbers", code:
"text = \"Programming\"\nprint(text[0:6])   # 'Progra'   start..end-1\nprint(text[3:])    # 'gramming' to the end\nprint(text[:4])    # 'Prog'     from the start\nprint(text[::2])   # 'Pormig'   every 2nd char\nprint(text[::-1])  # 'gnimmargorP'  reversed (step -1)",
              annot: [
                { c: "text[0:6]", e: "Indices 0,1,2,3,4,5. The 6 is excluded." },
                { c: "text[::2]", e: "Empty start/end means the whole string. Step 2 takes every other character." },
                { c: "text[::-1]", e: "Negative step walks backwards. Reverses the string. A common idiom." },
              ] },
            { type: "note", html: "Slicing <b>never errors</b> on out-of-range numbers. It just clamps.<br><code>\"Hi\"[0:999]</code> is simply <code>\"Hi\"</code>." },
          ] },
          { label: "Methods", blocks: [
            { type: "text", html: "Methods are functions you call with a dot.<br>They <b>return a new string</b>. The original never changes." },
            { type: "deflist", title: "Methods you use daily", items: [
              { t: "<code>.upper()</code> / <code>.lower()</code>", d: "Change case." },
              { t: "<code>.strip()</code>", d: "Remove leading and trailing spaces." },
              { t: "<code>.replace(old, new)</code>", d: "Swap every occurrence." },
              { t: "<code>.split(sep)</code>", d: "Break into a <i>list</i> of pieces." },
              { t: "<code>.find(sub)</code>", d: "Index of the first match, or <code>-1</code>." },
              { t: "<code>.count(sub)</code>", d: "How many times it appears." },
              { t: "<code>.startswith(x)</code> / <code>.endswith(x)</code>", d: "True or False checks." },
              { t: "<code>len(s)</code>", d: "Number of characters." },
            ] },
            { type: "example", caption: "chaining methods", code:
"raw = \"  Hello, World!  \"\nprint(raw.strip().lower())          # 'hello, world!'\nprint(raw.strip().split(\",\"))       # ['Hello', ' World!']\nprint(\"banana\".count(\"a\"))          # 3",
              output: "hello, world!\n['Hello', ' World!']\n3" },
          ] },
          { label: "Formatting", blocks: [
            { type: "text", html: "An <span class='term'>f-string</span> (prefix <code>f</code>) drops variables into text with <code>{ }</code>.<br>Format numbers too, e.g. <code>{value:.2f}</code> for two decimals." },
            { type: "example", caption: "f-strings with formatting", code:
"name = \"Alice\"\nscore = 87.5\nprint(f\"{name} scored {score}\")\nprint(f\"{name} scored {score:.0f}%\")     # no decimals\nprint(f\"{'pad':>8}|\")                    # right-align in 8 cols",
              output: "Alice scored 87.5\nAlice scored 88%\n     pad|" },
            { type: "note", html: "The older <code>\"{} {}\".format(a, b)</code> style still works.<br>f-strings read in order and are usually clearer." },
          ] },
          { label: "Immutability", blocks: [
            { type: "text", html: "Strings are <span class='term'>immutable</span>.<br>You cannot change a character in place.<br>Instead you build a <b>new</b> string." },
            { type: "example", caption: "you can't edit, only rebuild", code:
"text = \"hello\"\n# text[0] = \"H\"      # TypeError: does not support item assignment\ntext = \"H\" + text[1:]  # build a new string instead\nprint(text)            # 'Hello'",
              output: "Hello" },
            { type: "deepdive", title: "Why immutable? (and the C contrast)", html: "<p>In <b>C</b>, a string is a mutable array of bytes ending in <code>\\0</code>. You can poke any byte, and it is your job not to overrun the buffer.</p><p>Python trades that raw control for safety. Because strings cannot change, they can be shared freely, used as dictionary keys, and cached.</p><p>The cost: building a string one character at a time makes many temporaries. So collect pieces in a list and <code>\"\".join(...)</code> at the end.</p>" },
          ] },
        ] },

        { type: "subhead", text: "Indexing" },
        { type: "text", html: "<code>text[i]</code> returns the character at position <code>i</code>.<br>Positive index counts from the left (<code>0</code> is first).<br>Negative index counts from the right (<code>-1</code> is last)." },
        { type: "widget", name: "stringIndex", config: { text: "Python" } },

        { type: "subhead", text: "Slicing" },
        { type: "text", html: "A slice keeps characters from <code>start</code> up to (but not including) <code>end</code>, jumping by <code>step</code>.<br>A negative <code>step</code> walks backwards and reverses." },
        { type: "widget", name: "stringSlice", config: { text: "Programming" } },

      ],
      live: [
        { title: "Indexing & slicing: change the numbers and re-run", code: "text = \"Programming\"\nprint(\"first :\", text[0])\nprint(\"last  :\", text[-1])\nprint(\"3..7  :\", text[3:7])\nprint(\"every2:\", text[::2])\nprint(\"reverse:\", text[::-1])" },
        { title: "Method tour", code: "s = \"  Hello, World!  \"\nprint(s.strip())\nprint(s.upper())\nprint(s.replace(\"World\", \"Python\"))\nprint(s.strip().split(\",\"))\nprint(\"length:\", len(s))\nprint(\"count l:\", s.count('l'))" },
        { title: "Build your own Caesar cipher", code: "def caesar(text, shift):\n    result = \"\"\n    for ch in text:\n        if ch.isupper():\n            result += chr((ord(ch) - 65 + shift) % 26 + 65)\n        elif ch.islower():\n            result += chr((ord(ch) - 97 + shift) % 26 + 97)\n        else:\n            result += ch          # leave spaces/punctuation alone\n    return result\n\nsecret = caesar(\"Hello, World!\", 3)\nprint(secret)                 # Khoor, Zruog!\nprint(caesar(secret, -3))     # decrypt back" },
      ],
      quiz: [
        { q: "`\"Python\"[-2]` is…", choices: ["P", "o", "h", "n"], answer: 1, explain: "Index -2 is the second character from the right: 'o'." },
        { q: "`\"ComPro\"[::-1]` gives…", choices: ["ComPro", "orPmoC", "CmPo", "Error"], answer: 1, explain: "Step -1 walks backwards, reversing the string: orPmoC." },
        { q: "What does `\"Programming\"[2:5]` return?", choices: ["'rog'", "'ogr'", "'rogr'", "'Pro'"], answer: 0, explain: "Indices 2,3,4 give 'r','o','g'. The 5 is excluded." },
        { q: "Why can't you do `text[0] = 'H'`?", choices: ["Index 0 is reserved", "Strings are immutable", "You need text[0.0]", "It actually works"], answer: 1, explain: "Strings can't be changed in place. Build a new one instead." },
        { q: "In a Caesar shift of 1, 'Z' becomes…", choices: ["'[' (next ASCII)", "'A' (wraps around)", "'Y'", "Error"], answer: 1, explain: "The modulo-26 wrap takes 'Z' back to 'A'." },
      ],
    },
    {
      id: "lists",
      title: "Lists",
      sub: "Ordered, mutable collections.",
      slides: "06:13–21",
      keywords: "list append insert extend remove pop clear index slice mutable",
      learn: [
        { type: "text", html: "A <span class='term'>list</span> is an <b>ordered, mutable</b> collection in square brackets: <code>[1, 2, 3]</code>.<br>It holds mixed types and resizes automatically." },
        { type: "subhead", text: "How a list changes" },
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
        { type: "deflist", title: "Key operations", items: [
          { t: "Access / slice", d: "<code>my_list[0]</code>, <code>my_list[1:4]</code>, <code>my_list[::-1]</code>." },
          { t: "Add", d: "<code>append(x)</code>, <code>insert(i, x)</code>, <code>extend([...])</code>." },
          { t: "Remove", d: "<code>remove(x)</code>, <code>pop(i)</code>, <code>clear()</code>." },
          { t: "Aggregate", d: "<code>sum()</code>, <code>min()</code>, <code>max()</code>, <code>len()</code>." },
        ] },
      ],
      live: [
        { title: "Grades example", code: "grades = [85, 90, 78, 92, 88, 76]\nprint(\"highest:\", max(grades))\nprint(\"lowest :\", min(grades))\nprint(f\"average: {sum(grades)/len(grades):.2f}\")" },
        { title: "Mutate a list", code: "tasks = [\"Project\", \"Groceries\", \"Read\"]\ntasks.append(\"Exercise\")\ntasks.remove(\"Groceries\")\nprint(tasks)" },
      ],
      quiz: [
        { q: "Which adds a single item to the end of a list?", choices: ["extend", "append", "insert", "pop"], answer: 1, explain: "append(x) adds one item at the end. extend adds each item from an iterable." },
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
        { type: "text", html: "A <span class='term'>dictionary</span> stores <b>key → value</b> pairs in curly braces:<br><code>{\"name\": \"Alice\", \"age\": 25}</code>." },
        { type: "list", title: "Two rules to remember", items: [
          "Keys are unique and immutable.",
          "Lookup by key is very fast (it uses hashing).",
        ] },
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
        { type: "deflist", title: "Access & iterate", items: [
          { t: "<code>d['key']</code>", d: "Direct read. Errors if the key is missing." },
          { t: "<code>d.get('key', default)</code>", d: "Safe read. Returns the default if missing." },
          { t: "<code>for k in d:</code>", d: "Loop over keys." },
          { t: "<code>for v in d.values():</code>", d: "Loop over values." },
          { t: "<code>for k, v in d.items():</code>", d: "Loop over pairs." },
          { t: "<code>del d['k']</code> / <code>d.pop('k', default)</code>", d: "Remove a key." },
        ] },
        { type: "example", caption: "counting words (a classic dict pattern)", code:
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
          { title: "List", body: "Indexed by <b>position</b> (0,1,2…).<br>Allows duplicates.<br>Lookup by value is slower.<br>Use when order matters." },
          { title: "Dictionary", body: "Indexed by <b>key</b> (\"name\", \"age\").<br>Keys are unique.<br>Fast lookup (hashing).<br>Use when each item has a label." },
        ] } },
        { type: "note", html: "Rule of thumb:<br>Reach items by a meaningful name → dict.<br>Walk through an ordered sequence → list." },
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
