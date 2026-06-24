/* ===================== Topic 01 — Computer Operation & Architecture ===================== */
App.registerTopic({
  id: "t01",
  title: "Computer Operation & Architecture",
  short: "Architecture",
  blurb: "Hardware vs software, the CPU cycle, memory (RAM/ROM), storage (HDD/SSD), and the layered model of a computer.",
  intro: "Before writing much code, it helps to know what runs it. This topic covers what a computer is made of and how a program reaches the hardware — the foundation for understanding performance and memory later.",
  lessons: [
    {
      id: "hardware-software",
      title: "Hardware, software & the processing cycle",
      sub: "The four jobs of a computer, and what's tangible vs intangible.",
      slides: "01:4–13",
      keywords: "hardware software input processing storage output cpu functions",
      learn: [
        { type: "text", html: "A <span class='term'>computer</span> is an electronic device that performs four primary functions: <b>Input</b> (receive data), <b>Processing</b> (transform it via instructions), <b>Storage</b> (save it), and <b>Output</b> (deliver results)." },
        { type: "widget", name: "diagram", config: { layout: "row", title: "The Information Processing Cycle", boxes: [
          { title: "① Input", body: "Data enters via keyboard, mouse, scanner, microphone, webcam." },
          { title: "② Processing", body: "The CPU executes instructions to transform the data." },
          { title: "③ Storage", body: "Results are kept in memory or on disk for later." },
          { title: "④ Output", body: "Information leaves via monitor, printer, speakers, projector." },
        ] } },
        { type: "list", title: "Hardware vs Software", items: [
          "<b>Hardware</b> = the <i>tangible</i> parts: input devices, output devices, storage devices, and the processing unit.",
          "<b>Software</b> = the <i>intangible</i> instructions. <b>System software</b> (Windows, macOS, Linux) manages hardware; <b>application software</b> (browsers, games, word processors) does end-user tasks.",
        ] },
        { type: "note", html: "Your Python program is application software. It cannot touch hardware directly — it asks the operating system, which talks to the hardware on its behalf." },
      ],
      live: [
        { title: "Software inspecting its own machine", code: "import platform, os\nprint(\"System:\", platform.system())\nprint(\"Machine:\", platform.machine())\nprint(\"CPU cores:\", os.cpu_count())" },
      ],
      quiz: [
        { q: "Which is NOT one of the four primary computer functions?", choices: ["Input", "Processing", "Compilation", "Output"], answer: 2, explain: "The four are Input, Processing, Storage, Output. Compilation is a software step, not a primary hardware function." },
        { q: "An operating system is an example of…", choices: ["Application software", "System software", "Hardware", "A storage device"], answer: 1, explain: "The OS is system software — it manages hardware and hosts applications." },
      ],
    },
    {
      id: "cpu",
      title: "The CPU and the instruction cycle",
      sub: "ALU, Control Unit, registers, and fetch–decode–execute–store.",
      slides: "01:11–12",
      keywords: "cpu alu control unit register fetch decode execute store",
      learn: [
        { type: "list", title: "Inside the CPU", items: [
          "<b>ALU (Arithmetic Logic Unit)</b> — does the maths and logic (+, −, comparisons).",
          "<b>Control Unit (CU)</b> — directs everything, deciding what happens when.",
          "<b>Registers</b> — tiny, ultra-fast storage right inside the CPU for the values being worked on right now.",
        ] },
        { type: "widget", name: "cpuCycle", config: {} },
        { type: "deepdive", title: "Why registers matter for speed", html: "<p>Registers are the fastest storage in the whole machine — accessed in a single clock tick. RAM is ~100× slower; an SSD thousands of times slower; an HDD slower still. A huge part of making programs fast is keeping the data you're using as close to the CPU as possible (registers → cache → RAM → disk). You'll feel this in Topic 08, where NumPy keeps numbers packed tightly so the CPU can stream them efficiently.</p>" },
      ],
      live: [
        { title: "The CPU doing arithmetic for you", code: "a = 12\nb = 5\nprint(\"sum     :\", a + b)\nprint(\"product :\", a * b)\nprint(\"compare :\", a > b)" },
      ],
      quiz: [
        { q: "Which CPU part performs additions and comparisons?", choices: ["Control Unit", "ALU", "Register", "Cache"], answer: 1, explain: "The Arithmetic Logic Unit (ALU) handles arithmetic and logic operations." },
        { q: "Put the instruction cycle in order:", choices: ["Decode → Fetch → Store → Execute", "Fetch → Decode → Execute → Store", "Execute → Fetch → Decode → Store", "Store → Execute → Decode → Fetch"], answer: 1, explain: "Fetch the instruction, Decode it, Execute it, then Store the result." },
      ],
    },
    {
      id: "memory",
      title: "Memory: RAM vs ROM",
      sub: "Volatile working memory vs permanent instructions.",
      slides: "01:14–26",
      keywords: "ram rom dram sram prom eprom eeprom volatile memory",
      learn: [
        { type: "text", html: "<span class='term'>Primary memory</span> is directly accessible by the CPU. Its two families are <b>RAM</b> (temporary, fast, read/write) and <b>ROM</b> (permanent, non-volatile, mostly read-only)." },
        { type: "widget", name: "diagram", config: { title: "RAM vs ROM", boxes: [
          { title: "RAM — Random Access Memory", body: "<b>Volatile</b>: contents vanish when power is off. Holds your running programs and their data. Fast. Types: <b>DRAM</b> (capacitor-based, cheap, needs refreshing — used as main memory) and <b>SRAM</b> (flip-flop based, faster, pricier — used in CPU caches)." },
          { title: "ROM — Read-Only Memory", body: "<b>Non-volatile</b>: keeps data without power. Stores firmware that boots the machine. Types: <b>PROM</b> (write once), <b>EPROM</b> (erase with UV light), <b>EEPROM</b> (erase electrically — modern BIOS chips)." },
        ] } },
        { type: "note", title: "The one-line summary", html: "RAM = fast scratch space that forgets. ROM = permanent instructions that remember. A computer needs both." },
        { type: "deepdive", title: "What 'a variable lives in RAM' really means", html: "<p>When your Python program creates <code>x = 25</code>, the value sits in RAM. Because RAM is volatile, the moment the program ends (or power is lost) it's gone — which is exactly why Topic 08 teaches <b>file handling</b>: writing to disk is how you make data survive past a single run.</p>" },
      ],
      live: [
        { title: "These values exist only in RAM while this runs", code: "x = 25          # lives in RAM\nname = \"Sophia\" # also in RAM\nprint(x, name)\nprint(\"When this program ends, these are gone unless saved to disk.\")" },
      ],
      quiz: [
        { q: "Your unsaved work disappears in a power cut because RAM is…", choices: ["Non-volatile", "Volatile", "Read-only", "Permanent"], answer: 1, explain: "RAM is volatile — it loses its contents without power." },
        { q: "A modern BIOS chip is which kind of ROM?", choices: ["PROM", "EPROM", "EEPROM", "DRAM"], answer: 2, explain: "EEPROM can be erased and rewritten electrically, which is why firmware can be updated." },
      ],
    },
    {
      id: "storage",
      title: "Storage: HDD vs SSD",
      sub: "Spinning platters vs flash memory — and why it matters.",
      slides: "01:27–36",
      keywords: "hdd ssd storage nand flash platter seek latency nvme",
      learn: [
        { type: "text", html: "<span class='term'>Secondary storage</span> is non-volatile — it keeps your files when the power is off. The two main technologies work completely differently." },
        { type: "widget", name: "diagram", config: { layout: "row", title: "HDD vs SSD", boxes: [
          { title: "HDD — Hard Disk Drive", body: "Electromechanical: spinning magnetic platters (5400/7200 RPM) and a read/write head on a moving arm. Data access = <b>seek</b> (move head) + <b>rotational latency</b> (wait for the sector). 5–15 ms, ~80–200 MB/s. Cheap per GB; great for bulk/archive." },
          { title: "SSD — Solid State Drive", body: "Fully electronic NAND flash, no moving parts. Access &lt;0.1 ms, 500 MB/s (SATA) to &gt;7000 MB/s (NVMe). Silent, shock-resistant, low power. Pricier per GB; ideal for OS, gaming, databases." },
        ] } },
        { type: "list", title: "When to use which", items: [
          "<b>HDD</b>: long-term bulk data, cost-sensitive, mostly sequential reads (backups, CCTV, archives).",
          "<b>SSD</b>: high-speed and random access (boot drive, databases, real-time analytics).",
        ] },
        { type: "deepdive", title: "Why the gap is so huge (orders of magnitude)", html: "<p>An HDD must physically <i>move metal</i> to the right track and wait for the disk to spin around — milliseconds. An SSD addresses a flash cell electrically — microseconds. That's roughly a 100× difference in latency and even more in random-access throughput (IOPS: ~100–300 for HDD vs &gt;100,000 for SSD). This is why opening a program from an SSD feels instant.</p>" },
      ],
      live: [
        { title: "Numbers don't lie — relative access times", code: "# Rough access latencies, scaled so register = 1 second\nlevels = {\n    \"CPU register\": 1,\n    \"RAM\":          60,\n    \"SSD\":          150_000,\n    \"HDD\":          6_000_000,\n}\nfor name, t in levels.items():\n    print(f\"{name:13}: {t:>10,} (relative)\")" },
      ],
      quiz: [
        { q: "Why is an SSD faster than an HDD?", choices: ["It spins faster", "It has no moving parts and addresses cells electronically", "It uses more electricity", "It stores less data"], answer: 1, explain: "No mechanical seek or rotational latency — flash is accessed electrically in microseconds." },
        { q: "For a cheap, large backup archive you'd pick…", choices: ["NVMe SSD", "HDD", "RAM", "CPU cache"], answer: 1, explain: "HDDs offer the lowest cost per GB, ideal for bulk sequential storage." },
      ],
    },
    {
      id: "system-levels",
      title: "Levels of a computer system",
      sub: "From logic gates up to the user — and where your Python lives.",
      slides: "01:37–46",
      keywords: "levels digital logic machine assembly high-level user abstraction",
      learn: [
        { type: "text", html: "A computer is best understood as <b>layers of abstraction</b>. Each level hides the messy details of the one below it. Your Python program sits near the top — many layers above the electrons." },
        { type: "widget", name: "diagram", config: { title: "The 7 levels (top = closest to you)", boxes: [
          { title: "Level 6 — User", body: "You, using applications through a GUI or command line." },
          { title: "Level 5 — High-Level Language", body: "Python, C++, Java. Translated by compilers/interpreters. <b>Your code lives here.</b>" },
          { title: "Level 4 — Assembly Language", body: "Human-readable mnemonics; an assembler turns them into machine code." },
          { title: "Level 3 — Operating System", body: "The kernel and device drivers manage resources between hardware and apps." },
          { title: "Level 2 — Machine (ISA)", body: "Binary instructions the CPU executes directly; registers." },
          { title: "Level 1 — Control", body: "Microcode and control units that drive the logic." },
          { title: "Level 0 — Digital Logic", body: "Gates (AND/OR/NOT) and flip-flops — the physical electronics." },
        ] } },
        { type: "note", title: "Why this matters", html: "When you write <code>print(\"Hi\")</code>, that single line is translated down through every layer until gates switch on and off. Abstraction is what lets you ignore all of that and just think about your problem." },
      ],
      live: [
        { title: "One high-level line, a whole stack of work underneath", code: "# This single line travels through every level down to the gates:\nprint(\"From Level 5 (Python) all the way to Level 0 (logic gates)!\")" },
      ],
      quiz: [
        { q: "At which level does your Python code live?", choices: ["Level 0 — Digital Logic", "Level 2 — Machine", "Level 5 — High-Level Language", "Level 6 — User"], answer: 2, explain: "Python is a high-level language (Level 5), translated downward toward the hardware." },
        { q: "What is the main benefit of layered abstraction?", choices: ["It makes computers slower", "Each layer hides the complexity of the one below", "It removes the need for an OS", "It stores more data"], answer: 1, explain: "Abstraction lets you work at one level without worrying about the details beneath it." },
      ],
    },
  ],
});
