/* ===================== Topic 01 - Computer Operation and Architecture =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   Lesson order: each lesson uses only what the lessons before it explained.
   Computer, hardware, and software -> CPU -> Memory -> Storage -> System levels
   Python level: print() and simple arithmetic expressions only (no variables yet: Topic 02).
   ========================================================================================= */
(function () {
  /* ---------- block helpers (as in topic02.js) ---------- */
  const T = (html) => ({ type: "text", html });
  const L = (items, title, ordered) => ({ type: "list", items, title, ordered });
  const N = (html, title, variant) => ({ type: "note", html, title, variant });
  const TB = (head, rows, caption, cls) => ({ type: "table", head, rows, caption, cls });
  const EX = (code, caption, annot, inputs) => ({ type: "example", code, caption, annot, inputs });
  const RUN = (code, title, inputs) => ({ type: "livecode", code, title: title || "Program", inputs });
  const PQ = (prompt, expected, starter, inputs, hint) => ({ type: "practiceq", prompt, expected, starter, inputs, hint });
  const W = (name, config) => ({ type: "widget", name, config });
  const QZ = (items) => ({ type: "quiz", items });
  const NEXT = (html) => N(html, "Next lesson");
  const CHECK_NEXT = "The next exercise shows the completed table.";

  /* ---------- trace: three assembly instructions through the instruction cycle ----------
     The code lines are assembly, not Python. Addresses are the line numbers 1 to 3.
     IR is shown as plain text (type "obj"), not as a Python string. */
  const IR = (text) => ({ v: text, t: "obj" });
  const T_cycle = {
    code: ["LOAD R1, 12", "LOAD R2, 30", "ADD R1, R2"],
    steps: [
      { line: -1, note: "The program is in memory at addresses 1 to 3. The PC holds address 1.", set: { PC: "1" } },
      { line: 0, note: "Fetch: the IR receives the instruction at address 1. The PC increases by 1.", set: { IR: IR("LOAD R1, 12"), PC: "2" } },
      { line: 0, note: "Decode: load the value 12 into R1. Execute and store: R1 holds 12.", set: { R1: "12" } },
      { line: 1, note: "Fetch: the IR receives the instruction at address 2. The PC increases by 1.", set: { IR: IR("LOAD R2, 30"), PC: "3" } },
      { line: 1, note: "Decode: load the value 30 into R2. Execute and store: R2 holds 30.", set: { R2: "30" } },
      { line: 2, note: "Fetch: the IR receives the instruction at address 3. The PC increases by 1.", set: { IR: IR("ADD R1, R2"), PC: "4" } },
      { line: 2, note: "Decode: add R2 to R1. Execute: the ALU adds 12 + 30. Store: R1 holds 42.", set: { R1: "42" } },
      { line: -1, note: "No instruction is left. R1 holds 42. Result check: 12 + 30 = 42." },
    ],
  };

  App.registerTopic({
    id: "t01",
    title: "Computer Operation and Architecture",
    short: "Architecture",
    blurb: "Hardware and software, the CPU and the instruction cycle, memory (RAM and ROM), storage (HDD and SSD), and the levels of a computer system.",
    intro: "This chapter explains the parts of a computer and how a program uses them. Each lesson uses only what the lessons before it have explained:<br>computer, hardware, and software → CPU → memory → storage → system levels.",
    lessons: [
      /* =============================== 1. COMPUTER, HARDWARE, AND SOFTWARE =============================== */
      {
        id: "hardware-software",
        title: "Computer, hardware, and software",
        sub: "The four functions of a computer, the processing cycle, hardware, and software.",
        slides: "01:4–13",
        keywords: "computer definition input processing storage output data information processing cycle hardware stored program bus address software input device output device system software application software operating system",
        deck: [
          { kind: "overview", title: "Computer, hardware, and software", blocks: [
            T("A <b>computer</b> is an electronic device that processes and stores information. It performs calculations, changes data, and executes instructions to complete a task.<br>A computer system has two parts: <b>hardware</b> and <b>software</b>."),
            L(["The four functions of a computer", "Hardware", "The stored program", "Input and output devices", "Software", "A program uses the four functions"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The four functions", title: "The four functions of a computer", blocks: [
            TB(["Function", "Meaning"], [
              ["<b>Input</b>", "receiving data from input devices"],
              ["<b>Processing</b>", "executing instructions to transform the data"],
              ["<b>Storage</b>", "saving data and instructions for immediate or future use"],
              ["<b>Output</b>", "delivering the processed information through output devices"],
            ]),
            T("<b>Data</b> is a raw value, such as 25 from a sensor. <b>Information</b> is a processed result with a meaning, such as 77 °F."),
            T("The four functions usually occur in this order. Together they form the <b>information processing cycle</b>:<br>input → processing → storage → output."),
          ] },
          { kind: "visual", part: "The four functions", title: "The cycle for one temperature reading", blocks: [
            W("cycleFlow", { title: "Input → Processing → Storage → Output", stages: [
              { name: "Input", data: "25 °C", note: "A temperature sensor sends the value 25 °C to the computer." },
              { name: "Processing", data: "25 °C → 77 °F", note: "The CPU executes instructions that convert the value: 25 × 9 ÷ 5 + 32 = 77." },
              { name: "Storage", data: "77 °F saved", note: "The result is saved in memory or on a disk for later use." },
              { name: "Output", data: "77 °F shown", note: "The monitor displays the result to the user." },
            ] }),
          ] },
          { kind: "concept", part: "Hardware", title: "Hardware: the tangible parts", blocks: [
            T("<b>Hardware</b> is the tangible (physical) part of a computer system. It has four groups, one for each function."),
            TB(["Group", "Function", "Examples"], [
              ["Input devices", "enter data into the computer", "keyboard, mouse"],
              ["Processing unit", "interprets and executes instructions", "CPU (Lesson 2)"],
              ["Memory and storage devices", "store data and programs, temporarily or permanently", "memory: RAM (Lesson 3); storage: SSD, HDD (Lesson 4)"],
              ["Output devices", "present the results of the processing", "monitor, printer"],
            ]),
          ] },
          { kind: "concept", part: "The stored program", title: "The stored program", blocks: [
            L([
              "The instructions of a program and its data are both stored in memory (RAM) as binary numbers: sequences of 0 and 1.",
              "Each location in memory has a number: its <b>address</b>.",
              "The CPU fetches the instructions from memory, one after another, and executes them.",
            ]),
            W("diagram", { layout: "row", boxes: [
              { title: "CPU", body: "executes the instructions" },
              { title: "Bus", body: "carries instructions and data between the parts" },
              { title: "RAM", body: "holds the running program and its data" },
              { title: "Storage", body: "keeps the program file when the power is off" },
              { title: "I/O devices", body: "input and output: keyboard, monitor" },
            ] }),
          ] },
          { kind: "concept", part: "Input and output devices", title: "Input and output devices", cols: [
            [T("An <b>input device</b> enters data into a computer system."),
              TB(["Input device", "Enters"], [
                ["Keyboard", "text and commands"],
                ["Mouse", "pointing and clicking"],
                ["Scanner", "paper documents, in digital form"],
                ["Microphone", "sound"],
                ["Webcam", "video"],
              ])],
            [T("An <b>output device</b> presents the results to the user."),
              TB(["Output device", "Presents"], [
                ["Monitor", "text and images"],
                ["Printer", "paper copies of documents"],
                ["Speakers", "sound"],
                ["Projector", "the display, enlarged on a surface"],
              ])],
          ] },
          { kind: "concept", part: "Software", title: "Software: the instructions", blocks: [
            T("<b>Software</b> is the intangible part of a computer system: the instructions that tell the hardware which tasks to perform."),
            TB(["Kind", "Purpose", "Examples"], [
              ["System software", "manages the hardware and provides a platform for applications", "operating systems: Windows, macOS, Linux"],
              ["Application software", "performs specific tasks for the user", "word processors, web browsers, games"],
            ]),
            T("A Python program is application software. It runs on the operating system, and the operating system controls the hardware."),
          ] },
          { kind: "code", part: "A program uses the four functions", title: "Example: one program and the four functions", blocks: [
            RUN('print("Power =", 12 * 2, "W")', "Program: the power of a 12 V, 2 A device"),
            TB(["Function", "In this program"], [
              ["Input", "none: the values 12 and 2 are written in the code. Topic 02 reads values from the keyboard with <code>input()</code>."],
              ["Storage", "the program file is saved on the disk and loaded into memory to run"],
              ["Processing", "the CPU computes <code>12 * 2</code> → <code>24</code>"],
              ["Output", "the monitor displays <code>Power = 24 W</code>"],
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A computer performs four functions: input → processing → storage → output.",
              "Hardware is the tangible part: input, processing, memory and storage, and output devices.",
              "A program and its data are both stored in memory; the CPU fetches the instructions one after another.",
              "Software is the intangible part: system software manages the hardware; application software performs tasks for the user.",
              "A Python program is application software.",
            ]),
            NEXT("<b>The CPU and the instruction cycle</b>. The processing unit executes the instructions of every program, one instruction after another."),
          ] },
          { kind: "exercise", title: "Classify hardware and software", blocks: [
            T("Complete the table on paper. The first row is an example. " + CHECK_NEXT + "<br>1. Column 2: write <b>hardware</b> or <b>software</b>.<br>2. Column 3, hardware: write input, processing, storage, or output device.<br>3. Column 3, software: write system or application software."),
            TB(["Item", "Hardware or software", "Group"], [
              ["Keyboard", "hardware", "input device"],
              ["Projector", "", ""],
              ["SSD", "", ""],
              ["Linux", "", ""],
              ["Web browser", "", ""],
              ["CPU", "", ""],
            ], null, "center"),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Item", "Hardware or software", "Group"], [
              ["Keyboard", "hardware", "input device"],
              ["Projector", "hardware", "output device"],
              ["SSD", "hardware", "storage device"],
              ["Linux", "software", "system software (an operating system)"],
              ["Web browser", "software", "application software"],
              ["CPU", "hardware", "processing unit"],
            ], null, "center"),
          ] },
          { kind: "exercise", title: "Complete the table: a smart thermostat", blocks: [
            T("A smart thermostat measures the room temperature with a sensor, and it reads the set temperature from two buttons. A processor compares the two values. The thermostat keeps a log of the readings, shows the temperature on a small screen, and switches the heater on or off."),
            T("On paper, write the hardware that performs each function.<br>" + CHECK_NEXT),
            TB(["Function", "Hardware in the thermostat"], [["Input", ""], ["Processing", ""], ["Storage", ""], ["Output", ""]]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Function", "Hardware in the thermostat"], [
              ["Input", "the temperature sensor and the two buttons"],
              ["Processing", "the processor, which compares the two temperatures"],
              ["Storage", "the memory that keeps the log of readings"],
              ["Output", "the screen and the heater switch"],
            ]),
          ] },
          { kind: "exercise", title: "Write a program: processing and output", blocks: [
            PQ("Write a program that converts 25 °C to °F and displays the target output.<br>1. Use one <code>print()</code> statement.<br>2. Processing: compute the value with F = C × 9 / 5 + 32.<br>3. Output: display the value as in the target output.",
              "Temperature = 77.0 F", "# Write your program here\n", null, 'Use print("Temperature =", 25 * 9 / 5 + 32, "F").'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which list contains the four functions of a computer?", choices: ["Input, output, and processing", "Input, processing, storage, and output", "Input, output, control unit, and register", "Input, output, control unit, and ALU"], answer: 1, explain: "A computer receives input, processes it, stores data, and delivers output." },
            { q: "An operating system is an example of…", choices: ["application software", "system software", "hardware", "a storage device"], answer: 1, explain: "An operating system manages the hardware, so it is system software." },
          ])] },
        ],
      },

      /* =============================== 2. THE CPU =============================== */
      {
        id: "cpu",
        title: "The CPU and the instruction cycle",
        sub: "The ALU, the control unit, the registers, and fetch, decode, execute, store.",
        slides: "01:11",
        keywords: "cpu central processing unit alu arithmetic logic unit control unit cu register program counter pc instruction register ir clock speed ghz mhz fetch decode execute store instruction cycle",
        deck: [
          { kind: "overview", title: "The CPU and the instruction cycle", blocks: [
            T("The <b>central processing unit</b> (CPU) is the component that performs most of the processing in a computer. It executes the instructions of a program, one instruction after another."),
            L(["The parts of the CPU", "The instruction cycle", "The CPU executes a program"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The parts of the CPU", title: "ALU, control unit, and registers", blocks: [
            TB(["Part", "Function"], [
              ["<b>ALU</b> (Arithmetic Logic Unit)", "performs arithmetic (+, −, ×, ÷) and logic operations, such as a comparison"],
              ["<b>Control unit</b> (CU)", "fetches and decodes the instructions and controls the other parts"],
              ["<b>Registers</b>", "small storage locations inside the CPU; they hold the current instruction and the values in use"],
              ["<b>Program counter</b> (PC)", "a register that holds the address of the next instruction"],
              ["<b>Instruction register</b> (IR)", "a register that holds the instruction being executed"],
            ]),
            T("Registers are the fastest storage in a computer. Lesson 4 compares them with the other kinds of storage."),
          ] },
          { kind: "concept", part: "The instruction cycle", title: "Fetch, decode, execute, store", blocks: [
            L([
              "<b>Fetch</b>: the control unit copies the instruction at the address in the PC from memory to the IR. Then the PC increases by 1.",
              "<b>Decode</b>: the control unit interprets the instruction: the operation and the values it needs.",
              "<b>Execute</b>: the ALU or another part carries out the instruction.",
              "<b>Store</b>: the result is written back to a register or to memory, if needed.",
            ], "The instruction cycle", true),
            T("The CPU repeats this cycle for every instruction of a program.<br>The <b>clock speed</b> sets how fast the cycle runs: 3 GHz is 3 thousand million clock cycles per second. A 16 MHz microcontroller is much slower."),
          ] },
          { kind: "code", part: "The instruction cycle", title: "Three instructions through the cycle", blocks: [W("codeTrace", T_cycle)] },
          { kind: "concept", part: "The CPU executes a program", title: "Every calculation runs in the ALU", blocks: [
            L([
              "One Python statement is translated into many machine instructions (Lesson 5).",
              "The CPU executes each of these instructions with the instruction cycle.",
              "A calculation, such as <code>12 + 30</code>, is an arithmetic operation of the ALU.",
              "A comparison, such as <code>12 &gt; 30</code>, is a logic operation of the ALU. Its result is <code>True</code> or <code>False</code>.",
            ]),
          ] },
          { kind: "code", part: "The CPU executes a program", title: "Example: arithmetic and logic in the ALU", blocks: [
            EX("print(12 + 30)\nprint(12 * 30)\nprint(30 - 12)\nprint(12 > 30)", "each result comes from the ALU", [
              { c: "12 + 30", e: "Arithmetic: an addition. Output: <code>42</code>" },
              { c: "12 * 30, 30 - 12", e: "Output: <code>360</code> and <code>18</code>" },
              { c: "12 > 30", e: "Logic: a comparison. 12 is not greater than 30. Output: <code>False</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "The CPU has three main parts: the ALU, the control unit, and the registers.",
              "The ALU performs arithmetic and logic operations.",
              "The control unit fetches and decodes the instructions and directs the other parts.",
              "Registers are small, very fast storage locations inside the CPU. The PC holds the address of the next instruction. The IR holds the current instruction.",
              "The instruction cycle: fetch → decode → execute → store, repeated for every instruction.",
            ]),
            NEXT("<b>Memory: RAM and ROM</b>. The CPU fetches every instruction and every value from memory."),
          ] },
          { kind: "exercise", title: "Complete the table: parts of the CPU", blocks: [
            T("On paper, write the CPU part that performs each task: ALU, control unit, or register.<br>The first row is an example. " + CHECK_NEXT),
            TB(["Task", "CPU part"], [
              ["computes 17 − 5", "ALU"],
              ["holds the value 42 for the next instruction", ""],
              ["decides which instruction runs next", ""],
              ["checks whether 35 °C is greater than 30 °C", ""],
              ["interprets (decodes) an instruction", ""],
            ]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Task", "CPU part"], [
              ["computes 17 − 5", "ALU"],
              ["holds the value 42 for the next instruction", "register"],
              ["decides which instruction runs next", "control unit (it uses the address in the PC)"],
              ["checks whether 35 °C is greater than 30 °C", "ALU (a logic operation)"],
              ["interprets (decodes) an instruction", "control unit"],
            ]),
          ] },
          { kind: "exercise", title: "Complete the table: the instruction cycle", blocks: [
            T("Register R1 holds 50 and register R2 holds 8. The CPU executes <code>SUB R1, R2</code>: the instruction subtracts R2 from R1 and stores the result in R1."),
            T("Complete the table on paper. " + CHECK_NEXT + "<br>1. Column <b>Part</b>: write the part that works in the stage.<br>2. Column <b>What happens</b>: write what happens in the stage."),
            TB(["Stage", "Part", "What happens"], [["Fetch", "", ""], ["Decode", "", ""], ["Execute", "", ""], ["Store", "", ""]]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Stage", "Part", "What happens"], [
              ["Fetch", "control unit", "copies <code>SUB R1, R2</code> from memory to the IR; the PC increases by 1"],
              ["Decode", "control unit", "finds the operation (subtraction) and the values (R1 and R2)"],
              ["Execute", "ALU", "computes 50 − 8 = 42"],
              ["Store", "register R1", "R1 now holds 42"],
            ]),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Determine the output of the program. Each line is one operation of the ALU.<br>1. Write the output on paper.<br>2. Run the program.<br>3. Compare the output with your answer on paper.")],
            [RUN("print(17 + 5)\nprint(17 - 5)\nprint(17 * 5)\nprint(17 > 5)\nprint(5 > 17)")],
          ] },
          { kind: "exercise", title: "Write a program: power of a heater", blocks: [
            PQ("Write a program that computes the power of a heater and displays the target output.<br>1. Use these values: voltage 230 V, current 4 A.<br>2. Compute the power with one expression: P = V × I.",
              "Power = 920 W", "# Write your program here\n", null, 'Use print("Power =", 230 * 4, "W").'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which CPU part performs additions and comparisons?", choices: ["Control unit", "ALU", "Register", "Cache"], answer: 1, explain: "The Arithmetic Logic Unit (ALU) performs arithmetic and logic operations." },
            { q: "Which stage of the instruction cycle interprets the instruction?", choices: ["Fetch", "Decode", "Execute", "Store"], answer: 1, explain: "Decode interprets the instruction: the operation and the values it needs." },
          ])] },
        ],
      },

      /* =============================== 3. MEMORY =============================== */
      {
        id: "memory",
        title: "Memory: RAM and ROM",
        sub: "Classes of storage, volatile and non-volatile memory, and the types of RAM and ROM.",
        slides: "01:14–26",
        keywords: "memory primary secondary tertiary bit byte kb mb gb tb units ram random access rom volatile non-volatile dram sram refresh flip-flop cache prom eprom eeprom flash bios firmware",
        deck: [
          { kind: "overview", title: "Memory: RAM and ROM", blocks: [
            T("<b>Memory</b> stores data and instructions, temporarily or permanently. The CPU exchanges data with memory for every instruction, so a computer cannot operate without memory."),
            L(["Classes of storage: primary, secondary, and tertiary", "RAM", "ROM", "Volatile and non-volatile memory", "Types of RAM: DRAM and SRAM", "Types of ROM: PROM, EPROM, and EEPROM"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Classes of storage", title: "Primary, secondary, and tertiary storage", blocks: [
            TB(["Class", "Properties", "Examples"], [
              ["Primary memory (main memory)", "fast; directly accessible by the CPU", "RAM, ROM"],
              ["Secondary storage", "non-volatile; keeps data for a long time", "HDD, SSD (Lesson 4)"],
            ]),
            T("<b>Tertiary storage</b>, such as optical discs and magnetic tapes, keeps very large archives. It is often removable."),
            T("The RAM size and the storage size of a device are different quantities: a phone can have 8 GB of RAM (primary memory) and 256 GB of storage (secondary storage)."),
            T("This lesson explains primary memory: RAM and ROM."),
          ] },
          { kind: "concept", part: "Classes of storage", title: "Units of memory and storage size", blocks: [
            TB(["Unit", "Size"], [
              ["bit", "one binary digit: 0 or 1"],
              ["byte", "8 bits"],
              ["KB (kilobyte)", "1024 bytes"],
              ["MB (megabyte)", "1024 KB"],
              ["GB (gigabyte)", "1024 MB"],
              ["TB (terabyte)", "1024 GB"],
            ], null, "center"),
            T("Drive manufacturers often use 1000 instead of 1024. Topic 02 explains how values are stored in bits."),
          ] },
          { kind: "concept", part: "RAM", title: "RAM: Random Access Memory", blocks: [
            T("<b>RAM</b> temporarily stores the data and instructions of the programs that are running."),
            L([
              "<b>Random access</b>: any location can be read or written directly, in about the same time.",
              "<b>Volatile</b>: its data is erased when the power is off.",
              "<b>Read and write</b>: data can be read and changed many times.",
              "<b>High speed</b>: fast access keeps the system responsive.",
              "Uses: the running programs and their data; system files during start-up (booting).",
            ]),
          ] },
          { kind: "concept", part: "ROM", title: "ROM: Read-Only Memory", blocks: [
            T("<b>ROM</b> permanently stores essential data and instructions."),
            L([
              "<b>Non-volatile</b>: it keeps its data when the power is off.",
              "<b>Read-only</b>: its data cannot be changed easily.",
              "<b>Pre-written</b>: the instructions are written during manufacturing.",
              "Uses: <b>firmware</b>, the basic instructions that start the hardware, such as the <b>BIOS</b> of a PC; embedded systems in microwaves, washing machines, and calculators.",
            ]),
          ] },
          { kind: "visual", part: "Volatile and non-volatile memory", title: "Power off: RAM and ROM", blocks: [
            W("powerToggle", { title: "RAM and ROM when the power is switched off", ram: ["running program", "unsaved document"], rom: ["BIOS", "firmware"] }),
            T("A running Python program and its values are in RAM. When the power is off, they are lost, unless they were saved to a file on a disk."),
          ] },
          { kind: "concept", part: "Types of RAM", title: "DRAM and SRAM", blocks: [
            TB(["Feature", "DRAM (dynamic RAM)", "SRAM (static RAM)"], [
              ["Stores each bit in", "a capacitor", "a flip-flop: a circuit that holds one bit"],
              ["Refresh", "needed periodically: each bit is rewritten, because the capacitor slowly loses its charge", "not needed while powered"],
              ["Speed and cost", "slower, less expensive", "faster, more expensive"],
              ["Used in", "main memory: DDR4 and DDR5 modules in PCs, laptops, and phones", "CPU caches (L1, L2, L3) and GPUs"],
            ]),
            T("A <b>cache</b> is a small, fast memory in the CPU. It keeps copies of the data from RAM that the CPU used recently."),
          ] },
          { kind: "concept", part: "Types of ROM", title: "PROM, EPROM, and EEPROM", blocks: [
            TB(["Type", "Erasing and reprogramming", "Examples"], [
              ["PROM (programmable ROM)", "programmed once, after manufacturing; cannot be erased", "game cartridges, older embedded systems"],
              ["EPROM (erasable PROM)", "erased with ultraviolet (UV) light; reprogrammable many times", "older microcontrollers"],
              ["EEPROM (electrically erasable PROM)", "erased and reprogrammed with electrical signals, also in parts", "modern BIOS chips, embedded systems"],
            ]),
            T("Firmware in EEPROM can be updated without removing the chip.<br><b>Flash memory</b> is EEPROM that is erased in blocks. SSDs, USB drives, and memory cards use it."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            TB(["Feature", "RAM", "ROM"], [
              ["Power off", "volatile: the data is lost", "non-volatile: the data is kept"],
              ["Access", "read and write, high speed", "read-only (mostly)"],
              ["Holds", "the running programs and their data", "firmware and start-up instructions"],
              ["Types", "DRAM (main memory), SRAM (cache)", "PROM, EPROM, EEPROM (flash memory is a kind of EEPROM)"],
            ]),
            NEXT("<b>Storage devices: HDD and SSD</b>. Secondary storage keeps programs and files when the power is off and RAM is cleared."),
          ] },
          { kind: "exercise", title: "Complete the table: types of memory", blocks: [
            T("Complete the table on paper. The first row is an example. " + CHECK_NEXT + "<br>1. Columns <b>Volatile</b> and <b>Can be rewritten</b>: write <b>yes</b> or <b>no</b>.<br>2. Column <b>Typical use</b>: write one typical use of the memory."),
            TB(["Memory", "Volatile", "Can be rewritten", "Typical use"], [
              ["DRAM", "yes", "yes", "main memory"],
              ["SRAM", "", "", ""],
              ["PROM", "", "", ""],
              ["EPROM", "", "", ""],
              ["EEPROM", "", "", ""],
            ], null, "center"),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Memory", "Volatile", "Can be rewritten", "Typical use"], [
              ["DRAM", "yes", "yes", "main memory"],
              ["SRAM", "yes", "yes", "CPU cache"],
              ["PROM", "no", "no", "game cartridges"],
              ["EPROM", "no", "yes, with UV light", "older microcontrollers"],
              ["EEPROM", "no", "yes, electrically", "BIOS chips"],
            ], null, "center"),
          ] },
          { kind: "exercise", title: "Complete the table: choose the memory", blocks: [
            T("On paper, write the most suitable memory for each task in a PC.<br>Choose from: DRAM, SRAM, PROM, EPROM, EEPROM.<br>" + CHECK_NEXT),
            TB(["Task", "Memory"], [
              ["holds the programs that are running", ""],
              ["keeps copies of recently used data inside the CPU", ""],
              ["stores the BIOS, which the manufacturer updates", ""],
              ["stores a program that is written once and never changes", ""],
            ]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Task", "Memory"], [
              ["holds the programs that are running", "DRAM (main memory)"],
              ["keeps copies of recently used data inside the CPU", "SRAM (cache)"],
              ["stores the BIOS, which the manufacturer updates", "EEPROM"],
              ["stores a program that is written once and never changes", "PROM"],
            ]),
          ] },
          { kind: "exercise", title: "Write a program: RAM and cache", blocks: [
            PQ("Write a program that computes RAM size ÷ cache size and displays the target output.<br>1. Use these values: RAM 16 GB (DRAM), cache 16 MB (SRAM).<br>2. Use the same unit for both sizes: 1 GB is 1024 MB.",
              "RAM / cache = 1024.0", "# Write your program here\n", null, 'Use print("RAM / cache =", 16 * 1024 / 16). SRAM is expensive, so a cache is much smaller than RAM.'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which memory loses its data as soon as the computer is switched off?", choices: ["Hard disk", "RAM", "ROM", "Flash memory"], answer: 1, explain: "RAM is volatile: its data is erased when the power is off." },
            { q: "Which type of ROM is used for a modern BIOS chip?", choices: ["PROM", "EPROM", "EEPROM", "DRAM"], answer: 2, explain: "EEPROM is erased and rewritten electrically, so the BIOS can be updated." },
          ])] },
        ],
      },

      /* =============================== 4. STORAGE =============================== */
      {
        id: "storage",
        title: "Storage devices: HDD and SSD",
        sub: "How hard disk drives and solid state drives store and read data, how they compare, and the memory hierarchy.",
        slides: "01:27–36",
        keywords: "storage secondary hdd hard disk ssd solid state nand flash platter spindle head seek rotational latency rpm access time transfer rate wear usb sd card memory hierarchy",
        deck: [
          { kind: "overview", title: "Storage devices: HDD and SSD", blocks: [
            T("<b>Storage devices</b> keep the operating system, programs, data logs, media, and backups when the power is off. The two main technologies are the hard disk drive (HDD) and the solid state drive (SSD)."),
            L(["Storage devices and their uses", "The hard disk drive (HDD)", "Access and transfer time", "The solid state drive (SSD)", "HDD compared with SSD", "The memory hierarchy"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Storage devices and their uses", title: "HDD, SSD, and flash memory devices", blocks: [
            TB(["Device", "How it stores data", "Typical use"], [
              ["HDD", "electromechanical: magnetic polarity on rotating platters", "archives, CCTV, low-cost servers"],
              ["SSD", "electronic: NAND flash memory, no moving parts", "laptops, desktops, gaming, fast servers"],
              ["USB flash drive", "NAND flash with a USB interface; slower than an SSD", "carrying and transferring files"],
              ["Memory card (SD, microSD)", "a small flash card; low power; limited endurance", "phones, cameras, drones, IoT devices"],
            ]),
            T("Phones and tablets use built-in flash storage (eMMC or UFS)."),
          ] },
          { kind: "concept", part: "The hard disk drive (HDD)", title: "Parts of an HDD", blocks: [
            TB(["Part", "Function"], [
              ["Platters", "aluminium or glass disks with a magnetic coating; data is stored in circular tracks, divided into sectors"],
              ["Spindle motor", "rotates the platters at a constant speed, such as 5400 or 7200 RPM (revolutions per minute)"],
              ["Read/write head", "reads and writes the bits; it hovers nanometres above the platter"],
              ["Actuator arm", "moves the head to a track; a voice coil motor drives it precisely"],
              ["Controller board", "conditions the signals, corrects errors, and connects to the computer (SATA, SAS)"],
            ]),
          ] },
          { kind: "concept", part: "The hard disk drive (HDD)", title: "How an HDD reads data", blocks: [
            L([
              "<b>Seek</b>: the arm moves the head to the track (about 3–10 ms).",
              "<b>Rotational latency</b>: the head waits until the sector rotates under it (about 2–5 ms).",
              "<b>Read/write</b>: the head reads or sets the magnetic polarity of each bit.",
              "<b>Transfer</b>: the data passes through the buffer (cache) and the interface to the computer.",
            ], null, true),
            T("One revolution takes 60000 ÷ RPM ms (1 minute = 60000 ms). On average, the sector is half a revolution away from the head:<br>average rotational latency = 60000 ÷ RPM ÷ 2 ms. At 7200 RPM: about 4.17 ms. A higher RPM gives a shorter latency."),
          ] },
          { kind: "concept", part: "Access and transfer time", title: "Two calculations", blocks: [
            TB(["Quantity", "Formula", "Unit"], [
              ["HDD access time", "seek time + rotational latency", "ms"],
              ["Transfer time", "file size ÷ transfer rate", "MB ÷ (MB/s) = s"],
            ]),
            T("The access time of an HDD is about 5–15 ms.<br>Topic 00, Lesson 2 explains <code>+</code>, <code>/</code> (its result has a decimal point), and <code>print()</code> with several values."),
          ] },
          { kind: "code", part: "Access and transfer time", title: "Example: access time and copy time", blocks: [
            EX('print("HDD access:", 6 + 4, "ms")\nprint("SSD access:", 0.1, "ms")\nprint("Copy on HDD:", 1000 / 125, "s")\nprint("Copy on SSD:", 1000 / 500, "s")', "seek + latency; size ÷ rate", [
              { c: "6 + 4", e: "Seek 6 ms + latency 4 ms = 10 ms: 100 times the SSD access time." },
              { c: "1000 / 125", e: "A 1000 MB file at 125 MB/s (HDD) takes <code>8.0</code> s." },
              { c: "1000 / 500", e: "At 500 MB/s (SATA SSD) it takes <code>2.0</code> s." },
            ]),
          ] },
          { kind: "visual", part: "Access and transfer time", title: "Reading one block: HDD and SSD", blocks: [
            W("seekViz", { title: "", seek: 8, latency: 4 }),
          ] },
          { kind: "concept", part: "The solid state drive (SSD)", title: "How an SSD stores and reads data", blocks: [
            L([
              "An SSD stores each bit as an electric charge in a <b>NAND flash</b> memory cell. Flash memory is non-volatile (Lesson 3).",
              "A <b>controller</b> chip finds the cells of the requested data and reads them electronically.",
              "There are no moving parts: no seek and no rotational latency. Access time: about 0.05–0.1 ms.",
              "The cells <b>wear out</b>: each cell allows a limited number of write and erase cycles. The controller spreads the writes evenly over the cells.",
            ]),
          ] },
          { kind: "concept", part: "HDD compared with SSD", title: "HDD compared with SSD", blocks: [
            TB(["Parameter", "HDD", "SSD"], [
              ["Principle", "electromechanical: magnetic platters", "electronic: flash cells, no moving parts"],
              ["Access time", "5–15 ms", "under 0.1 ms"],
              ["Transfer rate", "80–200 MB/s (SATA)", "500 MB/s (SATA) to over 7000 MB/s (NVMe)"],
              ["Wear", "mechanical: bearings, head crash", "flash cells: limited write and erase cycles"],
              ["Shock and noise", "sensitive to shock; audible", "shock-resistant; silent"],
              ["Cost per GB", "lower", "higher"],
            ]),
            T("SATA and NVMe are interfaces that connect a drive to the computer. NVMe is the faster one."),
          ] },
          { kind: "concept", part: "HDD compared with SSD", title: "When to use an HDD or an SSD", cols: [
            [L([
              "long-term bulk data",
              "cost-sensitive applications",
              "sequential work: archiving, backup, video surveillance",
            ], "Use an HDD for")],
            [L([
              "high-speed access",
              "many random reads and writes: databases, virtual machines",
              "boot drives and performance-critical tasks: the OS, gaming, real-time analytics",
            ], "Use an SSD for")],
          ] },
          { kind: "concept", part: "The memory hierarchy", title: "The memory hierarchy", blocks: [
            TB(["Level (fastest first)", "Location", "Typical capacity"], [
              ["Registers", "inside the CPU", "bytes"],
              ["Cache (SRAM)", "inside the CPU", "MB"],
              ["Main memory: RAM (DRAM)", "memory modules", "GB"],
              ["SSD", "drive", "hundreds of GB to TB"],
              ["HDD", "drive", "TB"],
            ]),
            T("From top to bottom, the access time and the capacity increase, and the cost per byte decreases.<br>Registers, cache, and RAM are volatile. SSD and HDD are non-volatile."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "An HDD stores bits magnetically on rotating platters. Access time = seek time + rotational latency: 5–15 ms.",
              "Average rotational latency = 60000 ÷ RPM ÷ 2 ms. Transfer time = file size ÷ transfer rate.",
              "An SSD stores bits as charge in NAND flash cells. It has no moving parts (under 0.1 ms), but its cells wear out.",
              "An SSD is faster, silent, and shock-resistant. An HDD costs less per GB.",
              "The memory hierarchy, fastest first: registers → cache → RAM → SSD → HDD.",
            ]),
            NEXT("<b>Levels of a computer system</b>. The hardware of Lessons 1 to 4 forms the lowest levels of a computer system. The software levels are built on it."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Compute the access time and the transfer time of an HDD.<br>1. Use these values: seek time 7 ms, rotational latency 4 ms, file size 900 MB, transfer rate 150 MB/s.<br>2. Compute both times on paper.<br>3. Run the program.<br>4. Compare the output with your answer on paper.")],
            [RUN('print(7 + 4, "ms")\nprint(900 / 150, "s")')],
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("Correct the calculation, so that the program displays the target output.<br>1. The error: the program displays a wrong access time of an HDD.<br>2. Use these values: seek time 9 ms, rotational latency 4 ms.",
              "Access time = 13 ms", 'print("Access time =", 9 - 4, "ms")\n', null, "Access time = seek time + rotational latency."),
          ] },
          { kind: "exercise", title: "Write a program: copy time", blocks: [
            PQ("Write a program that displays the copy time of a 6000 MB video file on three drives.<br>1. Use these transfer rates: HDD 150 MB/s, SATA SSD 500 MB/s, NVMe SSD 3000 MB/s.<br>2. Display one line for each drive, as in the target output.",
              "HDD: 40.0 s\nSATA SSD: 12.0 s\nNVMe SSD: 2.0 s", "# Write your program here\n", null, 'Transfer time = size ÷ rate, for example print("HDD:", 6000 / 150, "s").'),
          ] },
          { kind: "exercise", title: "Complete the table: HDD or SSD", blocks: [
            T("Complete the table on paper. " + CHECK_NEXT + "<br>1. Column 2: write <b>HDD</b> or <b>SSD</b> for the application.<br>2. Column 3: write one reason for the choice."),
            TB(["Application", "HDD or SSD", "Reason"], [
              ["boot drive of a laptop", "", ""],
              ["10-year archive of CCTV video", "", ""],
              ["database server with many random reads", "", ""],
              ["data logger on a vibrating machine", "", ""],
            ]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Application", "HDD or SSD", "Reason"], [
              ["boot drive of a laptop", "SSD", "short access time: fast start-up"],
              ["10-year archive of CCTV video", "HDD", "lowest cost per GB; sequential writing"],
              ["database server with many random reads", "SSD", "no seek time: each read takes under 0.1 ms"],
              ["data logger on a vibrating machine", "SSD", "no moving parts: shock-resistant"],
            ]),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which order is from the fastest to the slowest access?", choices: ["Register → Cache → RAM → Hard disk", "Cache → Register → RAM → Hard disk", "RAM → Register → Cache → Hard disk", "Register → RAM → Cache → Hard disk"], answer: 0, explain: "Registers are fastest, then the cache, then RAM. The hard disk is the slowest." },
            { q: "How does an SSD store data?", choices: ["As magnetic polarity on platters", "As electric charge in flash memory cells", "As marks read by a laser", "As sound waves"], answer: 1, explain: "An SSD uses NAND flash: each cell stores a bit as an electric charge." },
          ])] },
        ],
      },

      /* =============================== 5. SYSTEM LEVELS =============================== */
      {
        id: "system-levels",
        title: "Levels of a computer system",
        sub: "Seven levels from digital logic to the user, translators, and how a program uses the hardware.",
        slides: "01:37–46",
        keywords: "levels abstraction digital logic gate flip-flop control microcode machine isa operating system kernel driver assembly assembler high-level language compiler interpreter user program hardware",
        deck: [
          { kind: "overview", title: "Levels of a computer system", blocks: [
            T("A computer system is described as seven <b>levels</b>, from the electronic circuits (Level 0) to the user (Level 6). Each level uses the level below it and hides its details. This principle is called <b>abstraction</b>."),
            L(["The seven levels", "Levels 0 to 2: hardware", "Levels 3 and 4: operating system and assembly language", "Levels 5 and 6: high-level language and user", "Translators", "One statement through the levels", "Programs and hardware"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The seven levels", title: "The seven levels of a computer system", blocks: [
            TB(["Level", "Name", "Main components"], [
              ["6", "User", "application programs, user interface"],
              ["5", "High-level language", "Python, C++, Java; compilers, interpreters"],
              ["4", "Assembly language", "assembly instructions, assembler"],
              ["3", "Operating system", "kernel, device drivers"],
              ["2", "Machine (ISA)", "machine language instructions, registers"],
              ["1", "Control", "microcode, control unit"],
              ["0", "Digital logic", "logic gates, flip-flops"],
            ]),
          ] },
          { kind: "concept", part: "Levels 0 to 2: hardware", title: "Levels 0 to 2: hardware", blocks: [
            L([
              "The electronic circuits that perform the basic operations.",
              "<b>Logic gates</b> (AND, OR, NOT) process binary signals. <b>Flip-flops</b> store binary data.",
            ], "Level 0: Digital logic"),
            L([
              "Manages the digital logic and coordinates its activities.",
              "<b>Microcode</b>: in many CPUs, a small built-in program that turns each machine instruction into control signals. The <b>control unit</b> directs the processor.",
            ], "Level 1: Control"),
            L([
              "The instruction set architecture (ISA): the instructions that the hardware executes directly.",
              "<b>Machine language instructions</b> (binary codes) and <b>registers</b>.",
            ], "Level 2: Machine (ISA)"),
          ] },
          { kind: "concept", part: "Levels 3 and 4", title: "Levels 3 and 4: operating system and assembly", blocks: [
            L([
              "Links the hardware and the application software. It manages the resources and provides services.",
              "<b>Kernel</b>: manages the resources and the communication between hardware and software.",
              "<b>Device drivers</b>: let the operating system control each device.",
            ], "Level 3: Operating system"),
            L([
              "A human-readable form of machine code, with short names (mnemonics), such as <code>ADD R1, R2</code>.",
              "<b>Assembler</b>: converts assembly code into machine code.",
            ], "Level 4: Assembly language"),
          ] },
          { kind: "concept", part: "Levels 5 and 6", title: "Levels 5 and 6: high-level language and user", blocks: [
            L([
              "Languages close to human language, such as Python, C++, and Java. They hide the hardware details.",
              "<b>Compilers</b> and <b>interpreters</b> translate the code into machine code or into an internal form, such as Python bytecode (Topic 00).",
            ], "Level 5: High-level language"),
            L([
              "The user works with the computer through application programs: word processors, web browsers, games.",
              "<b>User interface</b>: graphical (GUI) or command line.",
            ], "Level 6: User"),
          ] },
          { kind: "concept", part: "Translators", title: "Translators: the assembler", blocks: [
            TB(["Translator", "Translates", "When"], [
              ["Assembler", "assembly language (Level 4) into machine code (Level 2)", "before the program runs"],
            ]),
            T("The translators of Level 5, compilers (for example for C) and interpreters (for example for Python), are explained in Topic 00, Lesson 2."),
          ] },
          { kind: "visual", part: "One statement through the levels", title: 'The statement print("Hi"): Levels 6 to 3', blocks: [
            W("levelDrop", { title: "Software levels", levels: [
              { n: 6, name: "User", token: "runs the program", desc: "The user starts the program." },
              { n: 5, name: "High-level language", token: 'print("Hi")', desc: "The Python interpreter reads the statement." },
              { n: 4, name: "Assembly language", token: "CALL write", desc: "The interpreter runs as machine code, for example CALL write." },
              { n: 3, name: "Operating system", token: "write request", desc: "The OS displays the text with the driver of the screen." },
            ] }),
          ] },
          { kind: "visual", part: "One statement through the levels", title: 'The statement print("Hi"): Levels 2 to 0', blocks: [
            W("levelDrop", { title: "Hardware levels", levels: [
              { n: 2, name: "Machine (ISA)", token: "10110100 …", desc: "The CPU executes binary machine instructions with its registers." },
              { n: 1, name: "Control", token: "control signals", desc: "The control unit produces the signals for each instruction." },
              { n: 0, name: "Digital logic", token: "Hi", desc: "Logic gates switch, and the text Hi appears on the screen.", out: true },
            ] }),
          ] },
          { kind: "concept", part: "Programs and hardware", title: "A program uses the hardware", blocks: [
            T("While a program runs, it uses the hardware:"),
            TB(["Hardware", "Use by the program"], [
              ["CPU", "executes the instructions"],
              ["RAM", "holds the instructions and the values while the program runs"],
              ["SSD or HDD", "stores the program file permanently"],
              ["Input and output devices", "receive the data and present the results"],
            ]),
            T("The operating system gives each running program these resources, so that the programs run smoothly together."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A computer system has seven levels, from digital logic (Level 0) to the user (Level 6).",
              "Each level uses the level below it and hides its details: abstraction.",
              "Levels 0 to 2 are hardware: logic gates, control, and machine instructions.",
              "The operating system (Level 3) manages the hardware for the programs.",
              "An assembler translates assembly code into machine code. Python (Level 5) is run by an interpreter.",
            ]),
            N("<b>Topic 02: Basic programming with Python</b>. Programs at Level 5: output, variables, data types, arithmetic, input, and strings.", "Next topic"),
          ] },
          { kind: "exercise", title: "Complete the table: levels", blocks: [
            T("Write the level of each component: the number and the name of the level. The first row is an example. " + CHECK_NEXT),
            TB(["Component", "Level"], [
              ["AND gate", "0: Digital logic"],
              ["microcode", ""],
              ["machine language instruction", ""],
              ["device driver", ""],
              ["assembler", ""],
              ["Python interpreter", ""],
              ["web browser", ""],
            ]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Component", "Level"], [
              ["AND gate", "0: Digital logic"],
              ["microcode", "1: Control"],
              ["machine language instruction", "2: Machine (ISA)"],
              ["device driver", "3: Operating system"],
              ["assembler", "4: Assembly language"],
              ["Python interpreter", "5: High-level language"],
              ["web browser", "6: User (an application program)"],
            ]),
          ] },
          { kind: "exercise", title: "Complete the table: a program and the hardware", blocks: [
            T("A student writes a Python program that converts 25 °C to °F. The student saves the program as <code>temp.py</code> and runs the program.<br>On paper, write the hardware that each step uses. " + CHECK_NEXT),
            TB(["Step", "Hardware"], [
              ["the code is typed", ""],
              ["<code>temp.py</code> is saved permanently", ""],
              ["the program is loaded to run", ""],
              ["<code>25 * 9 / 5 + 32</code> is computed", ""],
              ["the result is displayed", ""],
            ]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Step", "Hardware"], [
              ["the code is typed", "keyboard (input device)"],
              ["<code>temp.py</code> is saved permanently", "SSD or HDD (secondary storage)"],
              ["the program is loaded to run", "RAM (main memory)"],
              ["<code>25 * 9 / 5 + 32</code> is computed", "CPU: the ALU"],
              ["the result is displayed", "monitor (output device)"],
            ]),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "At which level does a Python program exist?", choices: ["Level 0: Digital logic", "Level 2: Machine", "Level 5: High-level language", "Level 6: User"], answer: 2, explain: "Python is a high-level language: Level 5." },
            { q: "What does an assembler do?", choices: ["It translates assembly language into machine language.", "It translates machine language into assembly language.", "It translates assembly language into a high-level language.", "It translates a high-level language into assembly language."], answer: 0, explain: "An assembler converts assembly instructions (Level 4) into machine code (Level 2)." },
          ])] },
        ],
      },
    ],
  });
})();
