# Animation plan — per lesson (already / yet)

Legend: **(have)** = real animation exists · **(yet)** = proposed new animation · _static_ = current `diagram`/list only.

## Structural changes (do first, small)
1. **Cross-topic back-nav → last slide.** In `present.js` `goPrev`, when at slide 0, navigate to the previous lesson with a large index (`#/l/<prev>/9999`); `renderDeck` already clamps to the last slide. (Same idea optional for `goNext` staying at 0.)
2. **Definition-only slides get a syntax example.** Any lesson whose slide is pure definition + empty space gets a short `example` block (syntax only, no run) so the reader sees the structure. Marked ⟨+ex⟩ below.
3. **New widget `boxTrain`** — the "train of boxes with a value ball inside" the user asked for. A row of boxed cells, each holding a ball (number OR string). Animates append (ball slides in at the end), insert (balls shift over), remove/pop (ball pops out), index access (ball lifts). Reused for lists, dicts (key→value balls), arrays, stack/queue.

## t00 Introduction — (user said skip; intro only)
- what-is-programming : _static journey diagram_ — skip
- course-tools / first-run : admin — skip

## t01 Architecture
- hardware-software : _static cycle diagram_ → **cycleFlow** animate Input→Process→Store→Output data flowing (yet)
- cpu : **cpuCycle** (have)
- memory RAM/ROM : _static_ → **powerToggle** anim: cut power → RAM clears, ROM persists (yet) ⟨+ex⟩
- storage HDD/SSD : _static_ → **seekViz** anim: HDD head seeks + platter spins vs SSD instant (yet)
- system-levels : _static 7 levels_ → **levelDrop** anim: `print("Hi")` descends level 6→0 to the gates (yet)

## t02 Basics
- errors : example (static) → **errorKind** anim: syntax (won't start) / runtime (crash mid-run) / logical (wrong answer) timeline (yet)
- input-output : definition-heavy → **ioBuild** anim: print sep/end building the output line (yet) ⟨+ex ok⟩
- variables : example → **rebindViz** anim: a name-tag hops from one object to another (dynamic typing) (yet)
- values-in-memory : **binaryConverter** (have) + two's-complement has none → **twosComp** anim: flip bits +1 (yet)
- python-memory : notes → **aliasViz** anim: two name-tags on ONE object; mutate shows through both (yet) — high value
- data-types : list (static) — optional type cards, skip
- strings-numbers : **stringIndex + stringSlice** (have)

## t03 Decisions & Loops
- boolean : list (static) ⟨+ex⟩ — small; optional truthy tester
- operators : **truthTable** (have)
- if-elif-else : **steprun** (have) — optional branch-highlight visual
- loops : **loopViz** ×2 + **steprun** (have)
- loop-control : **steprun** (have)

## t04 Flowchart & Pseudocode
- flowchart-symbols : _static symbols_ — reference, optional
- flowchart-to-code : **flowchart ×2 + flowExec** (have)
- pseudocode : text/example → **pseudoMap** anim: pseudocode line ↔ Python line (yet, optional) ⟨+ex⟩

## t05 Functions & Modules
- defining : **funcCall + funcNested** (have)
- scope : memoryModel (static) + **funcScope** (have)
- recursion : **__recursion__** custom + **steprun** (have)
- arguments : **funcArgs** (have)
- modules : list/diagram (static) → **importResolve** anim (yet, optional) ⟨+ex⟩

## t06 Strings/Lists/Dicts
- strings : **stringIndex + stringSlice** (have)
- lists : **listViz** (have) → REPLACE with **boxTrain** (value balls; animate append/insert/remove/pop) (yet) — user asked for this
- dictionaries : **listViz** dict (have) → **boxTrain** dict mode (key→value balls) (yet)
- list-vs-dict : _static_ → **lookupRace** anim: scan-by-position vs jump-by-key (yet, optional)

## t07 Plots & Exceptions
- matplotlib-basics / chart-types : live Matplotlib charts (have)
- exceptions : **tryFlow** (have)

## t08 Data Processing — fully animated
- file-handling **fileFlow** · numpy **arrayOp** · pandas **dfFilter** · csv-json **csvFlow** (have)

## t09 Algorithms
- what-is-algorithm : _static_ → **stepsAnim** recipe steps (yet, optional) ⟨+ex⟩
- big-o : **bigOViz** (have)
- searching : **steprun** (have) → add visual **searchViz** linear-vs-binary array (yet) — more visual
- sorting : **steprun** (have) → add visual **bubbleViz** swap animation (yet) — more visual
- data-structures : _static_ → could reuse **boxTrain** for list/stack/queue/dict (yet, optional)
- efficient-python : text/example — optional

## t10 Programming in C — fully animated on core lessons
- pointers **ptrViz** · memory **heapViz** · arrays-strings **arrViz** (have)
- why-c / types / control-flow / functions : _static diagrams_ → control-flow could reuse **flowExec**/steprun (yet, optional) ⟨+ex where thin⟩

## Suggested build order (high value first)
1. Structural: back-nav-to-last-slide + boxTrain widget.
2. t06 lists + dicts → boxTrain (the headline request).
3. t02 aliasViz + rebindViz (Python's core "gotcha", very visual).
4. t01 four static lessons → animations (cycleFlow, powerToggle, seekViz, levelDrop).
5. t09 searchViz + bubbleViz (more visual than the code stepper).
6. Definition-only ⟨+ex⟩ syntax examples pass across topics.
7. Optional: t04 pseudoMap, t05 importResolve, t10 control-flow, t09 data-structures via boxTrain.
