# Vision — living lecture slides (class + self-practice)

Goal: every slide is a small **interactive machine**, not a bullet list. It works two ways from the same object:
- **Lecture mode:** the lecturer taps Space/→ to advance one *beat* at a time. Big, one idea per beat, readable from the back row.
- **Practice mode:** the student changes an input and re-runs, gets a "your turn" prompt, and can self-check.

Both modes share the same widget; only the framing changes.

---

## 1. A shared visual language (so every topic feels like one system)

A student should be able to read ANY animation because the vocabulary is constant:

| Element | Means | Look |
|---|---|---|
| **value ball** | the data itself | a rounded pill/ball with the value printed on it; **colored by type**: int=blue, float=teal, str=amber, bool=purple, None=grey |
| **box / cell** | a container or memory slot | rounded square "car"; empty = dashed outline |
| **name tag** | a variable name | a small luggage-tag that attaches to a ball with a short string |
| **arrow** | a reference / pointer / flow of control | thin line, arrowhead; warm color when it's a pointer |
| **glow ring** | "active right now" | blue box-shadow halo |
| **red** | error / danger / freed / dropped | red border + strike-through |
| **ghost** | about-to-happen or just-left | 40% opacity |

**Motion grammar** (consistent easing so motion *means* something):
- **arrive**: spring ease-out, slides in + small overshoot bounce (~350ms) — "new data".
- **leave**: fade + slide out (~250ms) — "removed".
- **read**: the ball lifts ~6px and pulses once — "we looked at it, unchanged".
- **write**: the ball flashes its color — "value changed here".
- **shift**: neighbors glide sideways to make/close a gap (~300ms) — "everything moved".

Every widget has the **same control bar**: `⟲ ‹ Prev | ▶ Play | Next ›  ▔▔▔▔ beat 3/8`, a scrubber, and keyboard (←/→/space). Slide-mode sizes already honor the 24px floor.

---

## 2. Signature interactives (the ones worth building deeply)

### boxTrain — the list as a train of cars (the headline)
A **list** is a locomotive pulling **cars coupled left→right**. Each car holds one **value ball** (number or string, colored by type). Under each car: a little **odometer** showing the index (positive on top, negative below).

Beats for `nums = [10, 20, 30]; nums.append(40); nums.insert(1, 99); nums.pop()`:
- start: three coupled cars roll in from the right, settle with a bounce.
- `append(40)`: a new blue car rolls in on the right rail and **couples** (clunk bounce); indices tick.
- `insert(1, 99)`: cars 1..n **slide right** to open a gap; the new car drops into the gap from above; indices re-number.
- `pop()`: last car **uncouples and rolls off** the right edge, fading; returns its ball to an "output" tray.
- `nums[1]` (index): tap any car → its ball **lifts and pulses**, a caption reads `nums[1] → 20`.

Interactions in practice mode: student types the list contents and picks an op from buttons (`append`, `insert`, `remove`, `pop`, `reverse`, `sort`); the train performs it. Reversing = the whole train animates its cars swapping ends. Slicing = a translucent bracket sweeps over the selected cars and a copy-train peels off below.

Same engine drives: **arrays** (fixed cars, addresses under each = base + i*size), **stack** (cars stacked vertically, push/pop at the top only), **queue** (enqueue rear, dequeue front).

### dictTrain — dictionaries as a wall of labeled lockers
Not a train but a **row of lockers**; each locker has a **key plate** (amber string tag) on the door and a **value ball** inside. `d['age']=26` = the "age" locker door highlights, old ball swaps for new with a flash. `d.get('x')` = a hand tries a locker; if the key plate doesn't exist, the locker is drawn ghosted and returns the default. Lookup is shown as **instant** (jump straight to the locker) vs the list's walk — that contrast *is* the lesson for list-vs-dict.

### aliasViz — the Python reference "aha" (very high value)
The bug that confuses everyone, made obvious. One **balloon** (list object) floats on the heap. `a = [...]` ties a **name-tag "a"** to it with a string. `b = a` ties a **second tag "b"** to the *same* balloon (both strings converge on one balloon). `b.append(9)` = a ball drops into the balloon — and because both tags point there, **the caption highlights that `a` sees it too**. Then `c = a.copy()` inflates a **second balloon** and ties "c" to that one; mutating c leaves a's balloon untouched. Toggle `is` vs `==`: `is` lights the *string* (same balloon?), `==` weighs the two balloons' *contents*.

### searchViz — linear vs binary, side by side, racing
Two identical sorted **box rows**, one labeled Linear, one Binary, a shared target chip up top. Press Play and they race:
- Linear: a scanner sweeps left→right, each cell pings as it's compared, a step counter climbs.
- Binary: `lo`/`hi` fences bracket the row; `mid` cell pulses; half the row **greys out and collapses** each step; counter climbs by 1.
- The finish line lands binary in ~log₂n while linear is still crawling — the O(n) vs O(log n) gut-punch. A tiny bar shows "steps: 7 vs 3".

### bubbleViz — sorting you can feel
Values as **vertical bars** (height = value). The inner loop's two neighbors light up; if out of order they **swap with an arc** (one lifts over the other); a "comparisons" tally climbs. After each pass the largest bar "**bubbles**" to the right and locks (dims to done). Optional: a ghost "Timsort finished already" marker to make the O(n²) sting land.

### levelDrop (architecture) — one line falling through the stack
`print("Hi")` as a **glowing packet** dropped at Level 5 (Python). It falls through 7 stacked layers (High-level → Assembly → OS → Machine → Control → Gates), each layer lighting and briefly showing what it does to the packet (compile → syscall → opcodes → …), until at Level 0 a little row of **logic gates flips** and an LED spells output. Makes "abstraction" physical.

### seekViz (HDD vs SSD) — why the gap is huge
Left: an **HDD** — a spinning platter, an arm that must *swing to the track* then *wait for the sector* to rotate under it (you watch the delay). Right: an **SSD** — a grid of cells; the requested cell just lights **instantly**. A stopwatch on each. Same request, wildly different wait — the latency lesson, seen.

### twosComp / bit widgets — negatives, made mechanical
Eight **bit switches**. To make −5: show 5 in bits, then **flip every bit** (each switch animates) **+1** (a ripple carry rolls left). The sign bit turns red. One ADD circuit handles both — shown by feeding 5 + (−5) through and watching it land on 0.

---

## 3. Content / structure improvements (beyond current)

- **Predict-then-reveal:** before an animation runs, a one-tap "What will happen?" beat (2–3 guesses) so students commit before seeing. Turns passive watching into a mini-quiz. Works great in lecture (hands up) and solo.
- **Definition slides get a "syntax card":** any pure-definition slide gains a short, **non-run** code example showing the exact structure (fills the empty space, anchors the concept in real syntax).
- **Sandbox beat per topic:** a free "mess with it" widget at each topic's end (the boxTrain/dictTrain with all buttons unlocked) for self-practice.
- **"Your turn" checkpoints:** practice mode surfaces a small task ("make the list [3,1,2] sorted") the widget can verify.
- **Consistent lesson skeleton:** Hook (a question/prediction) → Visual (the interactive) → Syntax card → Try-it (live editor) → Check (quiz). One idea per slide.
- **Speaker beats vs student beats:** in lecture mode, extra "pause here / ask the room" markers between beats; hidden in practice mode.

## 4. Platform touches
- **Back-nav across topics lands on the previous topic's LAST slide** (finish-the-thought), not slide 1.
- **Autoplay toggle** for a hands-free classroom run; **presenter timer**.
- **Deep links** to any beat of any widget (for assignments: "open slide t06.lists beat 4").
- **Reduced-motion** respect for accessibility.

## 5. Build order (proposed)
1. `boxTrain` engine (list) + the shared control/motion system → the template every later widget copies.
2. `dictTrain`, then wire both into t06 (lists/dicts) and reuse for arrays/stack/queue.
3. `aliasViz` (t02 python-memory) — the highest-conceptual-value single animation.
4. `searchViz` + `bubbleViz` (t09) — the iconic CS visuals.
5. Architecture set: `levelDrop`, `seekViz`, RAM/ROM power toggle (t01).
6. `twosComp` + predict-then-reveal + syntax-card pass across definition slides.
7. Structural: back-nav-to-last-slide, autoplay, deep-link-to-beat.
