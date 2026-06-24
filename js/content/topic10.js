/* ===================== Topic 10 — Algorithms & Efficiency ===================== */
App.registerTopic({
  id: "t10",
  title: "Algorithms & Efficiency",
  short: "Algorithms & Efficiency",
  blurb: "Beyond the course: algorithmic thinking, Big-O, searching & sorting, and writing code that respects CPU and memory limits.",
  intro: "Two programs can give the same answer yet differ by a million times in speed. This advanced topic is about thinking like an engineer: measuring the cost of an algorithm, recognising growth rates (Big-O), stepping through classic searching and sorting algorithms, and choosing data structures and Python idioms that work with the hardware instead of against it.",
  lessons: [
    {
      id: "what-is-algorithm",
      title: "What is an algorithm?",
      sub: "A recipe with a cost — correctness AND efficiency.",
      keywords: "algorithm correctness efficiency time space cost steps",
      learn: [
        { type: "text", html: "An <span class='term'>algorithm</span> is a finite, unambiguous sequence of steps that solves a problem. Two things matter: it must be <b>correct</b> (right answer for every valid input), and it should be <b>efficient</b> (not waste time or memory)." },
        { type: "widget", name: "diagram", config: { title: "Two costs to watch", layout: "row", boxes: [
          { title: "Time complexity", body: "How the number of <i>operations</i> grows as the input grows. This is usually the bottleneck — it decides whether your program finishes in a second or a year." },
          { title: "Space complexity", body: "How much extra <i>memory</i> the algorithm needs as the input grows. Matters on big data and constrained devices." },
        ] } },
        { type: "text", html: "We don't count nanoseconds (those vary by machine). We count <b>how the work grows with input size n</b>. Summing a list of n numbers does ~n additions; comparing every pair does ~n² — and that difference is everything once n is large." },
        { type: "example", caption: "same task, very different growth", code:
"# A) does ~n operations  (linear)\ntotal = 0\nfor x in data:\n    total += x\n\n# B) does ~n*n operations (quadratic) — every pair\nfor a in data:\n    for b in data:\n        compare(a, b)",
          annot: [
            { c: "one loop", e: "Work grows in step with n — double the data, double the work." },
            { c: "nested loops", e: "Work grows with n²  — double the data, <b>quadruple</b> the work." },
          ] },
        { type: "note", html: "Goal of this topic: be able to look at code and estimate how it will scale — then pick a better approach <i>before</i> it becomes a problem." },
      ],
      live: [
        { title: "Feel the difference: count the operations", code: "def linear_ops(n):\n    ops = 0\n    for i in range(n):\n        ops += 1\n    return ops\n\ndef quadratic_ops(n):\n    ops = 0\n    for i in range(n):\n        for j in range(n):\n            ops += 1\n    return ops\n\nfor n in [10, 100, 1000]:\n    print(f\"n={n:>4}:  linear={linear_ops(n):>7,}   quadratic={quadratic_ops(n):>9,}\")" },
      ],
      quiz: [
        { q: "An algorithm must always be…", choices: ["Written in C", "Correct for every valid input", "Recursive", "Less than 10 lines"], answer: 1, explain: "Correctness is non-negotiable; efficiency is the second goal." },
        { q: "Two nested loops over n items do roughly how many steps?", choices: ["n", "2n", "n²", "log n"], answer: 2, explain: "Each of n outer iterations runs n inner iterations → n×n = n² steps." },
      ],
    },
    {
      id: "big-o",
      title: "Big-O notation",
      sub: "The language of how fast cost grows.",
      keywords: "big o notation complexity constant logarithmic linear quadratic exponential growth",
      learn: [
        { type: "text", html: "<span class='term'>Big-O</span> describes the <b>growth rate</b> of an algorithm's cost as input size n grows, ignoring constants and small terms. <code>O(2n + 5)</code> is just <code>O(n)</code> — what matters at scale is the <i>shape</i> of the curve." },
        { type: "widget", name: "diagram", config: { title: "The common complexity classes, best to worst", boxes: [
          { title: "O(1) — constant", body: "Same cost regardless of n. e.g. <code>list[i]</code>, <code>dict[key]</code>. The dream." },
          { title: "O(log n) — logarithmic", body: "Cost grows very slowly; doubling n adds one step. e.g. binary search. Excellent." },
          { title: "O(n) — linear", body: "Cost grows with n. e.g. scanning a list once. Usually fine." },
          { title: "O(n log n) — linearithmic", body: "The best general sorting can do. e.g. Python's <code>sorted()</code>. Good." },
          { title: "O(n²) — quadratic", body: "Every pair. e.g. bubble sort, nested loops over the same data. Slow on big n." },
          { title: "O(2ⁿ) — exponential", body: "Doubling with each extra item. e.g. naive recursive Fibonacci. Unusable beyond tiny n." },
        ] } },
        { type: "list", title: "Why the shape dominates", items: [
          "At n = 1,000,000: <b>O(log n)</b> ≈ 20 steps, <b>O(n)</b> = 1,000,000, <b>O(n²)</b> = 1,000,000,000,000.",
          "A faster computer shifts the line up a little; a better Big-O changes the whole curve.",
          "Constants still matter in practice — but only after you've picked the right growth class.",
        ] },
        { type: "note", title: "Best / average / worst", html: "Big-O usually describes the <b>worst case</b>. Some algorithms have a great average but a bad worst case (e.g. quicksort). Knowing which case you're quoting matters." },
      ],
      live: [
        { title: "Plot the growth curves yourself (Matplotlib)", code: "import matplotlib.pyplot as plt\nimport math\n\nns = list(range(1, 31))\nplt.plot(ns, [1]*len(ns),            label=\"O(1)\")\nplt.plot(ns, [math.log2(n) for n in ns], label=\"O(log n)\")\nplt.plot(ns, ns,                      label=\"O(n)\")\nplt.plot(ns, [n*math.log2(n) for n in ns], label=\"O(n log n)\")\nplt.plot(ns, [n*n for n in ns],       label=\"O(n^2)\")\nplt.ylim(0, 300)\nplt.title(\"How cost grows with input size\")\nplt.xlabel(\"n\"); plt.ylabel(\"operations\")\nplt.legend(); plt.grid(True)\nplt.show()" },
      ],
      quiz: [
        { q: "Which complexity is best for large n?", choices: ["O(n²)", "O(n)", "O(log n)", "O(2ⁿ)"], answer: 2, explain: "O(log n) grows slowest of these — doubling n adds just one step." },
        { q: "`O(3n + 100)` simplifies to…", choices: ["O(3n)", "O(n)", "O(100)", "O(n²)"], answer: 1, explain: "Big-O drops constant factors and lower-order terms: O(3n+100) = O(n)." },
        { q: "Naive recursive Fibonacci is famously…", choices: ["O(1)", "O(n)", "O(n log n)", "O(2ⁿ) exponential"], answer: 3, explain: "It recomputes the same subproblems, branching exponentially — O(2ⁿ)." },
      ],
    },
    {
      id: "searching",
      title: "Searching: linear vs binary",
      sub: "Step through both and see O(n) vs O(log n).",
      keywords: "linear search binary search sorted halving log n algorithm steprun",
      learn: [
        { type: "text", html: "Finding an item in a list is the simplest place to feel Big-O. <span class='term'>Linear search</span> checks every element — O(n). <span class='term'>Binary search</span> repeatedly halves a <b>sorted</b> list — O(log n) — but it only works if the data is already sorted." },
        { type: "example", caption: "linear search — check each in turn", code:
"def linear_search(data, target):\n    for i, value in enumerate(data):\n        if value == target:\n            return i        # found at index i\n    return -1               # not found",
          annot: [
            { c: "for ... in data", e: "Worst case visits every element → O(n)." },
          ] },
        { type: "subhead", text: "▶ Step through binary search" },
        { type: "text", html: "Watch <code>low</code>, <code>high</code> and <code>mid</code> close in on the target. Each step throws away <i>half</i> the remaining list — that's why even a million items take only ~20 steps." },
        { type: "steprun", title: "binary search for 23 in a sorted list", code: "def binary_search(data, target):\n    low = 0\n    high = len(data) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if data[mid] == target:\n            return mid\n        elif data[mid] < target:\n            low = mid + 1      # target is in the right half\n        else:\n            high = mid - 1     # target is in the left half\n    return -1\n\nnums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(\"found at index:\", binary_search(nums, 23))" },
        { type: "note", variant: "warn", title: "Binary search needs sorted data", html: "The halving logic only works if the list is ordered. If your data changes a lot, the cost of keeping it sorted may outweigh the faster search — engineering is about trade-offs." },
      ],
      live: [
        { title: "Race them: steps taken by each", code: "def linear_steps(data, target):\n    steps = 0\n    for v in data:\n        steps += 1\n        if v == target:\n            break\n    return steps\n\ndef binary_steps(data, target):\n    steps = 0\n    low, high = 0, len(data) - 1\n    while low <= high:\n        steps += 1\n        mid = (low + high) // 2\n        if data[mid] == target: break\n        elif data[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return steps\n\ndata = list(range(1, 1_000_001))   # 1,000,000 sorted numbers\ntarget = 999_999\nprint(\"linear search steps:\", linear_steps(data, target))\nprint(\"binary search steps:\", binary_steps(data, target))" },
      ],
      quiz: [
        { q: "Binary search on 1,000,000 sorted items takes about how many steps (worst case)?", choices: ["1,000,000", "1,000", "20", "1"], answer: 2, explain: "log2(1,000,000) ≈ 20 — each step halves the search space." },
        { q: "Binary search requires the data to be…", choices: ["Small", "Sorted", "Unique", "Numbers only"], answer: 1, explain: "Halving by comparison only works on ordered data." },
      ],
    },
    {
      id: "sorting",
      title: "Sorting: bubble sort & beyond",
      sub: "Step through an O(n²) sort, then meet Python's fast one.",
      keywords: "sorting bubble sort selection comparison swap timsort sorted n log n steprun",
      learn: [
        { type: "text", html: "Sorting reorders data — and it's where Big-O really bites. <span class='term'>Bubble sort</span> is the simplest to understand: repeatedly walk the list swapping neighbours that are out of order, so big values 'bubble' to the end. It's O(n²) — fine to learn, too slow for real data." },
        { type: "subhead", text: "▶ Step through bubble sort" },
        { type: "text", html: "Watch the inner loop compare neighbours and swap. Notice how many comparisons it takes for just 5 numbers — then imagine a million." },
        { type: "steprun", title: "bubble sort a small list", code: "def bubble_sort(data):\n    n = len(data)\n    for i in range(n - 1):\n        for j in range(n - 1 - i):\n            if data[j] > data[j + 1]:\n                data[j], data[j + 1] = data[j + 1], data[j]  # swap\n    return data\n\nnums = [5, 1, 4, 2, 8]\nprint(bubble_sort(nums))" },
        { type: "note", title: "Don't write your own sort in real code", html: "Python's built-in <code>sorted()</code> and <code>list.sort()</code> use <b>Timsort</b> — an O(n log n) algorithm tuned in C. It is dramatically faster and well-tested. Hand-written sorts are for <i>learning</i> the ideas." },
        { type: "example", caption: "the right way in practice", code:
"nums = [5, 1, 4, 2, 8]\nprint(sorted(nums))                       # [1, 2, 4, 5, 8]\nprint(sorted(nums, reverse=True))         # [8, 5, 4, 2, 1]\nwords = ['pear', 'fig', 'banana']\nprint(sorted(words, key=len))             # ['fig', 'pear', 'banana']",
          output: "[1, 2, 4, 5, 8]\n[8, 5, 4, 2, 1]\n['fig', 'pear', 'banana']" },
      ],
      live: [
        { title: "Count the comparisons bubble sort makes", code: "def bubble_count(data):\n    comparisons = 0\n    n = len(data)\n    for i in range(n - 1):\n        for j in range(n - 1 - i):\n            comparisons += 1\n            if data[j] > data[j + 1]:\n                data[j], data[j + 1] = data[j + 1], data[j]\n    return comparisons\n\nfor size in [5, 10, 50, 100]:\n    import random\n    sample = [random.randint(0, 999) for _ in range(size)]\n    print(f\"n={size:>3}:  {bubble_count(sample):>5,} comparisons\")" },
      ],
      quiz: [
        { q: "Bubble sort's time complexity is…", choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 3, explain: "Two nested loops over the data → O(n²)." },
        { q: "In real Python code you should sort with…", choices: ["Your own bubble sort", "sorted() / list.sort() (Timsort)", "a while loop", "recursion only"], answer: 1, explain: "Built-in sort is O(n log n), C-optimised, and battle-tested." },
      ],
    },
    {
      id: "data-structures",
      title: "Choosing the right data structure",
      sub: "The same task can be O(n) or O(1) — by picking list vs set/dict.",
      keywords: "list set dict membership lookup hashing o(1) o(n) complexity choice",
      learn: [
        { type: "text", html: "Often the biggest speed-up isn't a cleverer loop — it's a better <b>container</b>. Checking 'is x in here?' is O(n) for a list (it scans) but O(1) for a set or dict (it hashes straight to the answer)." },
        { type: "widget", name: "diagram", config: { title: "Cost of common operations", boxes: [
          { title: "list", body: "Index <code>lst[i]</code>: O(1). Membership <code>x in lst</code>: <b>O(n)</b> — scans every element. Great for ordered sequences you iterate." },
          { title: "set", body: "Membership <code>x in s</code>: <b>O(1)</b> average (hashing). No duplicates, no order. Perfect for 'have I seen this?' checks." },
          { title: "dict", body: "Lookup <code>d[key]</code>: <b>O(1)</b> average. Key → value mapping. The workhorse for counting, indexing, caching." },
        ] } },
        { type: "example", caption: "same result, very different cost", code:
"# Slow: 'in' on a list scans — O(n) per check, O(n*m) overall\nseen = []\nfor x in items:\n    if x not in seen:      # O(n) each time!\n        seen.append(x)\n\n# Fast: 'in' on a set hashes — O(1) per check, O(n) overall\nseen = set()\nfor x in items:\n    if x not in seen:      # O(1)\n        seen.add(x)",
          annot: [
            { c: "x not in seen  (list)", e: "Re-scans the whole list every time — quadratic overall." },
            { c: "x not in seen  (set)", e: "Hashes directly to the bucket — near-constant time." },
          ] },
        { type: "deepdive", title: "Why hashing is O(1) (and the hardware angle)", html: "<p>A set/dict computes a <b>hash</b> of the key to jump straight to a memory slot, instead of comparing against every stored item. It trades a little extra memory for a huge time win — a recurring engineering theme. The cost: hashing scatters data across memory, so iterating a set is less cache-friendly than walking a contiguous list. Right tool, right job.</p>" },
      ],
      live: [
        { title: "Time it: list membership vs set membership", code: "import time\n\nbig_list = list(range(100_000))\nbig_set  = set(big_list)\ntargets  = [99_999, 50_000, 0, 75_321]\n\nstart = time.perf_counter()\nfor _ in range(2000):\n    for t in targets:\n        t in big_list      # O(n) each\nlist_time = time.perf_counter() - start\n\nstart = time.perf_counter()\nfor _ in range(2000):\n    for t in targets:\n        t in big_set       # O(1) each\nset_time = time.perf_counter() - start\n\nprint(f\"list 'in': {list_time:.4f}s\")\nprint(f\"set  'in': {set_time:.4f}s\")\nprint(f\"set was ~{list_time/set_time:.0f}x faster\")" },
      ],
      quiz: [
        { q: "Checking `x in collection` is O(1) for a…", choices: ["list", "set or dict", "tuple", "string"], answer: 1, explain: "Sets and dicts hash the value for near-constant-time membership; lists/tuples scan (O(n))." },
        { q: "To deduplicate while checking membership efficiently, use a…", choices: ["list", "set", "string", "nested loop"], answer: 1, explain: "A set gives O(1) membership, turning an O(n²) dedupe into O(n)." },
      ],
    },
    {
      id: "efficient-python",
      title: "Writing efficient Python",
      sub: "Work with the interpreter and the hardware, not against them.",
      keywords: "efficiency comprehension generator join memoization cache numpy locality optimization",
      learn: [
        { type: "text", html: "Once your Big-O is right, these habits squeeze out the constants — and respect the CPU and memory you're running on." },
        { type: "tabs", tabs: [
          { label: "Don't repeat work", blocks: [
            { type: "text", html: "Hoist anything that doesn't change out of the loop, and avoid rebuilding the same thing each pass." },
            { type: "example", caption: "compute once, not every iteration", code:
"# slower: len(data) and the lookup recomputed each pass\nfor i in range(len(data)):\n    if data[i] > threshold * factor:\n        ...\n\n# better: compute the constant once\nlimit = threshold * factor\nfor value in data:\n    if value > limit:\n        ..." },
          ] },
          { label: "Use built-ins", blocks: [
            { type: "text", html: "Built-ins and comprehensions run in optimised C, far faster than an equivalent hand-written Python loop." },
            { type: "example", caption: "comprehension over manual append", code:
"# slower\nsquares = []\nfor n in range(1000):\n    squares.append(n * n)\n\n# faster and clearer\nsquares = [n * n for n in range(1000)]\n\n# and use built-ins\ntotal = sum(squares)\nbiggest = max(squares)" },
          ] },
          { label: "Strings & memory", blocks: [
            { type: "text", html: "Building a string with <code>+=</code> in a loop creates a new string every time (O(n²)). Collect pieces and <code>join</code> once. For huge sequences, a <b>generator</b> streams items instead of building a giant list in memory." },
            { type: "example", caption: "join, and generators for memory", code:
"# slow: quadratic string building\ns = \"\"\nfor w in words:\n    s += w\n\n# fast: O(n)\ns = \"\".join(words)\n\n# memory: sum a billion squares WITHOUT building the list\ntotal = sum(n*n for n in range(1_000_000))   # generator — constant memory" },
          ] },
          { label: "Cache results", blocks: [
            { type: "text", html: "If a function recomputes the same answers (like naive recursive Fibonacci, O(2ⁿ)), <b>memoize</b> it — store results and reuse them. One decorator turns exponential into linear." },
            { type: "example", caption: "memoization with functools.lru_cache", code:
"from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(100))   # instant — each value computed once" },
          ] },
        ] },
        { type: "deepdive", title: "The hardware angle: locality & NumPy", html: "<p>The CPU reads memory in <b>cache lines</b>, so data that sits together is read together. Walking a contiguous array is far faster than chasing references scattered across the heap — even with the same Big-O. That's why <b>NumPy</b> (contiguous C arrays + operations in compiled C) can be 10–100× faster than a Python loop for number crunching. Choosing the right representation is a hardware decision, not just a style one.</p>" },
      ],
      live: [
        { title: "Memoization: O(2ⁿ) vs O(n) on Fibonacci", code: "import time\nfrom functools import lru_cache\n\ndef slow_fib(n):\n    if n < 2: return n\n    return slow_fib(n-1) + slow_fib(n-2)\n\n@lru_cache(maxsize=None)\ndef fast_fib(n):\n    if n < 2: return n\n    return fast_fib(n-1) + fast_fib(n-2)\n\nstart = time.perf_counter()\nslow_fib(30)\nprint(f\"naive fib(30): {time.perf_counter()-start:.3f}s\")\n\nstart = time.perf_counter()\nfast_fib(100)\nprint(f\"memoized fib(100): {time.perf_counter()-start:.5f}s (and far bigger n)\")" },
        { title: "String join vs += (watch the gap grow)", code: "import time\nwords = [\"x\"] * 50_000\n\nstart = time.perf_counter()\ns = \"\"\nfor w in words:\n    s += w\nplus_time = time.perf_counter() - start\n\nstart = time.perf_counter()\ns = \"\".join(words)\njoin_time = time.perf_counter() - start\n\nprint(f\"+=   : {plus_time:.4f}s\")\nprint(f\"join : {join_time:.4f}s\")" },
      ],
      quiz: [
        { q: "Building a big string with `+=` in a loop is slow because…", choices: ["Strings are immutable, so each += makes a new copy", "Python can't add strings", "It uses the GPU", "Strings are too small"], answer: 0, explain: "Immutability means += rebuilds the whole string each time — O(n²). Use ''.join()." },
        { q: "Memoizing naive Fibonacci changes its complexity from…", choices: ["O(n) to O(1)", "O(2ⁿ) to O(n)", "O(n²) to O(n log n)", "It stays the same"], answer: 1, explain: "Caching each result means every n is computed once: exponential becomes linear." },
        { q: "NumPy is fast for numbers mainly because it…", choices: ["Skips the answer", "Stores data contiguously and runs in compiled C (cache-friendly)", "Uses more RAM", "Avoids loops by luck"], answer: 1, explain: "Contiguous memory + C operations = cache-friendly, vectorised speed." },
      ],
    },
  ],
});
