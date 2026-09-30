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
  const CHECK_NEXT = "Complete the table on paper. The next exercise checks it.";

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
        keywords: "computer definition input processing storage output information processing cycle hardware software input device output device system software application software operating system",
        deck: [
          { kind: "overview", title: "Computer, hardware, and software", blocks: [
            T("A <b>computer</b> is an electronic device that processes and stores information. It performs calculations, changes data, and executes instructions to complete a task.<br>A computer system has two parts: <b>hardware</b> and <b>software</b>."),
            L(["The four functions of a computer", "Hardware", "Input and output devices", "Software", "Computers in modern society", "A program uses the four functions"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The four functions", title: "The four functions of a computer", blocks: [
            TB(["Function", "Meaning"], [
              ["<b>Input</b>", "receiving data from input devices"],
              ["<b>Processing</b>", "executing instructions to transform the data"],
              ["<b>Storage</b>", "saving data and instructions for immediate or future use"],
              ["<b>Output</b>", "delivering the processed information through output devices"],
            ]),
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
          { kind: "concept", part: "Computers in modern society", title: "Computers in modern society", blocks: [
            TB(["Area", "Examples of use"], [
              ["Communication", "email, social media, video conferencing"],
              ["Education", "e-learning platforms, research"],
              ["Healthcare", "patient records, diagnostic tools"],
              ["Finance", "online banking, financial modelling"],
              ["Entertainment", "streaming services, games"],
            ]),
            T("Every one of these uses the same four functions: input, processing, storage, and output."),
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
              "A computer performs four functions: input, processing, storage, and output.",
              "The information processing cycle usually runs in this order: input → processing → storage → output.",
              "Hardware is the tangible part: input devices, the processing unit, memory and storage devices, and output devices.",
              "Software is the intangible part. System software manages the hardware. Application software performs tasks for the user.",
              "A Python program is application software. It uses processing, storage, and output; with <code>input()</code> (Topic 02), it also uses input.",
            ]),
            NEXT("<b>The CPU and the instruction cycle</b>. The processing unit executes the instructions of every program, one instruction after another."),
          ] },
          { kind: "exercise", title: "Classify hardware and software", blocks: [
            T("For each item, write <b>hardware</b> or <b>software</b>, and its group: input, processing, storage, or output device; or system or application software. The first row is done. The next exercise checks the table."),
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
            T("Write the hardware that performs each function. " + CHECK_NEXT),
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
            PQ("The thermostat converts 25 °C to °F with the formula F = C × 9 / 5 + 32. Write one <code>print()</code> statement that computes the value (processing) and displays it as in the target (output).",
              "Temperature = 77.0 F", "# Write your program here\n", null, 'print("Temperature =", 25 * 9 / 5 + 32, "F")'),
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
        keywords: "cpu central processing unit alu arithmetic logic unit control unit cu register fetch decode execute store instruction cycle",
        deck: [
          { kind: "overview", title: "The CPU and the instruction cycle", blocks: [
            T("The <b>central processing unit</b> (CPU) is the component that performs most of the processing in a computer. It executes the instructions of a program, one instruction after another."),
            L(["The parts of the CPU", "The instruction cycle", "The CPU executes a program"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The parts of the CPU", title: "ALU, control unit, and registers", blocks: [
            TB(["Part", "Function"], [
              ["<b>ALU</b> (Arithmetic Logic Unit)", "performs arithmetic operations (+, −, ×, ÷) and logic operations, such as a comparison of two numbers"],
              ["<b>Control unit</b> (CU)", "directs the operations of the processor: it fetches and decodes the instructions and controls the other parts"],
              ["<b>Registers</b>", "small storage locations inside the CPU; they hold the current instruction and the values in use"],
            ]),
            T("Registers are the fastest storage in a computer. Lesson 4 compares them with the other kinds of storage."),
          ] },
          { kind: "concept", part: "The instruction cycle", title: "Fetch, decode, execute, store", blocks: [
            L([
              "<b>Fetch</b>: the control unit retrieves the next instruction from memory.",
              "<b>Decode</b>: the control unit interprets the instruction: the operation and the values it needs.",
              "<b>Execute</b>: the ALU or another part carries out the instruction.",
              "<b>Store</b>: the result is written back to a register or to memory, if needed.",
            ], "The instruction cycle", true),
            T("The CPU repeats this cycle for every instruction of a program."),
          ] },
          { kind: "visual", part: "The instruction cycle", title: "One instruction through the cycle", blocks: [
            W("cycleFlow", { title: "The instruction ADD R1, R2", stages: [
              { name: "Fetch", data: "ADD R1, R2", note: "The control unit fetches the instruction <code>ADD R1, R2</code> from memory. Register R1 holds 12. Register R2 holds 30." },
              { name: "Decode", data: "add R1, R2", note: "The control unit decodes it: the operation is addition, and the values are in R1 and R2." },
              { name: "Execute", data: "12 + 30 = 42", note: "The ALU executes the addition: 12 + 30 = 42." },
              { name: "Store", data: "R1 = 42", note: "The result, 42, is written back to register R1. Then the next instruction is fetched." },
            ] }),
          ] },
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
              "Registers are small, very fast storage locations inside the CPU.",
              "The instruction cycle: fetch → decode → execute → store, repeated for every instruction.",
            ]),
            NEXT("<b>Memory: RAM and ROM</b>. The CPU fetches every instruction and every value from memory."),
          ] },
          { kind: "exercise", title: "Complete the table: parts of the CPU", blocks: [
            T("Write the CPU part that performs each task: ALU, control unit, or register. The first row is done. The next exercise checks the table."),
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
              ["decides which instruction runs next", "control unit"],
              ["checks whether 35 °C is greater than 30 °C", "ALU (a logic operation)"],
              ["interprets (decodes) an instruction", "control unit"],
            ]),
          ] },
          { kind: "exercise", title: "Complete the table: the instruction cycle", blocks: [
            T("Register R1 holds 50 and register R2 holds 8. The CPU executes <code>SUB R1, R2</code>: it subtracts R2 from R1 and stores the result in R1."),
            T("Write the part that works in each stage and what happens. " + CHECK_NEXT),
            TB(["Stage", "Part", "What happens"], [["Fetch", "", ""], ["Decode", "", ""], ["Execute", "", ""], ["Store", "", ""]]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Stage", "Part", "What happens"], [
              ["Fetch", "control unit", "retrieves <code>SUB R1, R2</code> from memory"],
              ["Decode", "control unit", "finds the operation (subtraction) and the values (R1 and R2)"],
              ["Execute", "ALU", "computes 50 − 8 = 42"],
              ["Store", "register R1", "R1 now holds 42"],
            ]),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("Each line is one operation of the ALU. Write the output of the program on paper.<br>Then run the program and compare.")],
            [RUN("print(17 + 5)\nprint(17 - 5)\nprint(17 * 5)\nprint(17 > 5)\nprint(5 > 17)")],
          ] },
          { kind: "exercise", title: "Write a program: power of a heater", blocks: [
            PQ("A heater works at 230 V and draws 4 A. Its power is P = V × I. Write a program that computes the power with one expression and displays it as in the target.",
              "Power = 920 W", "# Write your program here\n", null, 'print("Power =", 230 * 4, "W")'),
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
        keywords: "memory primary secondary tertiary bit byte kb mb gb tb units ram random access rom volatile non-volatile dram sram refresh flip-flop cache prom eprom eeprom bios firmware",
        deck: [
          { kind: "overview", title: "Memory: RAM and ROM", blocks: [
            T("<b>Memory</b> stores data and instructions, temporarily or permanently. The CPU exchanges data with memory for every instruction, so a computer cannot operate without memory."),
            L(["Classes of storage: primary, secondary, and tertiary", "RAM", "ROM", "Volatile and non-volatile memory", "Types of RAM: DRAM and SRAM", "Types of ROM: PROM, EPROM, and EEPROM"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Classes of storage", title: "Primary, secondary, and tertiary storage", blocks: [
            TB(["Class", "Properties", "Examples"], [
              ["Primary memory (main memory)", "fast; directly accessible by the CPU", "RAM, ROM"],
              ["Secondary storage", "non-volatile; keeps data for a long time", "HDD, SSD (Lesson 4)"],
              ["Tertiary storage", "very large volumes of data; often removable", "optical discs, magnetic tapes"],
            ]),
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
            T("Firmware in EEPROM can be updated without removing the chip."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            TB(["Feature", "RAM", "ROM"], [
              ["Power off", "volatile: the data is lost", "non-volatile: the data is kept"],
              ["Access", "read and write, high speed", "read-only (mostly)"],
              ["Holds", "the running programs and their data", "firmware and start-up instructions"],
              ["Types", "DRAM (main memory), SRAM (cache)", "PROM, EPROM, EEPROM"],
            ]),
            NEXT("<b>Storage devices: HDD and SSD</b>. Secondary storage keeps programs and files when the power is off and RAM is cleared."),
          ] },
          { kind: "exercise", title: "Complete the table: types of memory", blocks: [
            T("Write <b>yes</b> or <b>no</b> in the first two columns, and a typical use in the third. The first row is done. The next exercise checks the table."),
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
            T("Write the most suitable memory for each task in a PC: DRAM, SRAM, PROM, EPROM, or EEPROM. " + CHECK_NEXT),
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
            PQ("A PC has 16 GB of RAM (DRAM). Its CPU has 16 MB of cache (SRAM). 1 GB is 1024 MB. Write a program that computes how many times larger the RAM is than the cache.",
              "RAM / cache = 1024.0", "# Write your program here\n", null, 'print("RAM / cache =", 16 * 1024 / 16). SRAM is expensive, so a cache is much smaller than RAM.'),
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
        keywords: "storage secondary hdd hard disk ssd solid state nand flash platter spindle head seek rotational latency access time transfer rate iops usb sd card memory hierarchy",
        deck: [
          { kind: "overview", title: "Storage devices: HDD and SSD", blocks: [
            T("<b>Storage devices</b> keep the operating system, programs, data logs, media, and backups when the power is off. The two main technologies are the hard disk drive (HDD) and the solid state drive (SSD)."),
            L(["Storage devices and their uses", "The hard disk drive (HDD)", "The solid state drive (SSD)", "Access time", "HDD compared with SSD", "Access and transfer time", "The memory hierarchy"], "Subtopics in this lesson", true),
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
            T("Access time = seek time + rotational latency: about 5–15 ms.<br>A higher RPM, a larger cache, and more platters and heads improve the performance."),
          ] },
          { kind: "concept", part: "The solid state drive (SSD)", title: "NAND flash memory", blocks: [
            T("An SSD stores each bit as an electric charge in a <b>NAND flash</b> memory cell. The cell is a floating-gate transistor that traps the charge. One cell stores 1 to 4 bits."),
            TB(["Cell type", "Bits per cell"], [
              ["SLC (single-level cell)", "1"],
              ["MLC (multi-level cell)", "2"],
              ["TLC (triple-level cell)", "3"],
              ["QLC (quad-level cell)", "4"],
            ], null, "center"),
            T("Data is written in <b>pages</b> (about 4 KB) and erased in <b>blocks</b> (about 128–256 pages)."),
          ] },
          { kind: "concept", part: "The solid state drive (SSD)", title: "The SSD controller", blocks: [
            T("A controller chip manages the flash memory of the SSD."),
            L([
              "<b>Wear levelling</b>: spreads the write and erase cycles evenly over the blocks.",
              "<b>Garbage collection</b>: frees the blocks that contain old data.",
              "<b>Bad block mapping</b>: stops using the blocks that have failed.",
              "<b>Error correction (ECC)</b>: detects and corrects wrong bits.",
              "<b>Cache</b>: DRAM, or a part of the computer's RAM (HMB), for fast access.",
            ]),
          ] },
          { kind: "concept", part: "The solid state drive (SSD)", title: "How an SSD reads data", blocks: [
            L([
              "The computer (the host) sends a read or write command.",
              "The controller translates the logical address into a physical location in the flash.",
              "The data is accessed directly in the NAND flash through a page buffer.",
              "Error correction (ECC) checks and corrects the bits.",
              "The data passes through the interface buffer to the host.",
            ], null, true),
            T("There are no moving parts: no seek and no rotational latency. Access time: about 0.05–0.1 ms."),
          ] },
          { kind: "concept", part: "The solid state drive (SSD)", title: "SSD performance and limitations", cols: [
            [L([
              "the number of parallel channels and flash chips (dies)",
              "SLC caching and DRAM or HMB buffers",
              "the firmware, for example how it queues and groups commands",
            ], "The speed depends on")],
            [L([
              "<b>Write amplification</b>: the SSD writes more data than the host sends.",
              "<b>Garbage collection</b> and other background work can cause short delays.",
              "<b>Wear</b>: each block allows a limited number of program/erase (P/E) cycles.",
            ], "Limitations")],
          ] },
          { kind: "visual", part: "Access time", title: "Reading one block: HDD and SSD", blocks: [
            W("seekViz", { title: "", seek: 6, latency: 4 }),
          ] },
          { kind: "concept", part: "HDD compared with SSD", title: "Operation and speed", blocks: [
            TB(["Parameter", "HDD", "SSD"], [
              ["Principle", "electromechanical (magnetic)", "electronic (charge in flash cells)"],
              ["Access", "a moving head over spinning platters", "cells addressed by the controller"],
              ["Access time", "5–15 ms", "under 0.1 ms"],
              ["Transfer rate", "80–200 MB/s (SATA)", "500 MB/s (SATA) to over 7000 MB/s (NVMe)"],
              ["IOPS", "about 100–300", "over 100,000"],
            ]),
            T("IOPS: input/output operations per second, for small reads and writes at random locations.<br>SATA and NVMe are interfaces that connect a drive to the computer. NVMe is the faster one."),
          ] },
          { kind: "concept", part: "HDD compared with SSD", title: "Durability, power, and cost", blocks: [
            TB(["Parameter", "HDD", "SSD"], [
              ["Endurance", "mechanical wear (bearings, head crash)", "flash cell wear (limited P/E cycles)"],
              ["Shock resistance", "50–70 G", "1500 G"],
              ["Power (active, idle)", "5–10 W, 1–2 W", "2–4 W, under 1 W"],
              ["Noise", "audible (spindle and seek)", "silent"],
              ["Cost per GB", "lower", "higher"],
            ]),
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
          { kind: "concept", part: "Access and transfer time", title: "Two calculations", blocks: [
            TB(["Quantity", "Formula", "Unit"], [
              ["HDD access time", "seek time + rotational latency", "ms"],
              ["Transfer time", "file size ÷ transfer rate", "MB ÷ (MB/s) = s"],
            ]),
            T("Topic 00, Lesson 2 explains <code>+</code>, <code>/</code> (its result has a decimal point), and <code>print()</code> with several values."),
          ] },
          { kind: "code", part: "Access and transfer time", title: "Example: access time and copy time", blocks: [
            EX('print("HDD access:", 6 + 4, "ms")\nprint("SSD access:", 0.1, "ms")\nprint("Copy on HDD:", 1000 / 125, "s")\nprint("Copy on SSD:", 1000 / 500, "s")', "seek + latency; size ÷ rate", [
              { c: "6 + 4", e: "Seek 6 ms + latency 4 ms = 10 ms: 100 times the SSD access time." },
              { c: "1000 / 125", e: "A 1000 MB file at 125 MB/s (HDD) takes <code>8.0</code> s." },
              { c: "1000 / 500", e: "At 500 MB/s (SATA SSD) it takes <code>2.0</code> s." },
            ]),
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
              "An HDD stores bits magnetically on rotating platters. Access time = seek + rotational latency: 5–15 ms.",
              "An SSD stores bits as charge in NAND flash cells. It has no moving parts: under 0.1 ms.",
              "An SSD is faster, silent, and shock-resistant. An HDD costs less per GB.",
              "Transfer time = file size ÷ transfer rate.",
              "The memory hierarchy, fastest first: registers → cache → RAM → SSD → HDD.",
            ]),
            NEXT("<b>Levels of a computer system</b>. The hardware of Lessons 1 to 4 forms the lowest levels of a computer system. The software levels are built on it."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [T("An HDD has a seek time of 7 ms and a rotational latency of 4 ms. It reads a 900 MB file at 150 MB/s.<br>Calculate the access time and the transfer time on paper. Then run the program and compare.")],
            [RUN('print(7 + 4, "ms")\nprint(900 / 150, "s")')],
          ] },
          { kind: "exercise", title: "Correct the error", blocks: [
            PQ("An HDD has a seek time of 9 ms and a rotational latency of 4 ms. The program displays a wrong access time. Correct the calculation.",
              "Access time = 13 ms", 'print("Access time =", 9 - 4, "ms")\n', null, "Access time = seek time + rotational latency."),
          ] },
          { kind: "exercise", title: "Write a program: copy time", blocks: [
            PQ("A 6000 MB video file is copied to three drives. Display the copy time on an HDD (150 MB/s), a SATA SSD (500 MB/s), and an NVMe SSD (3000 MB/s).",
              "HDD: 40.0 s\nSATA SSD: 12.0 s\nNVMe SSD: 2.0 s", "# Write your program here\n", null, 'Transfer time = size ÷ rate: print("HDD:", 6000 / 150, "s")'),
          ] },
          { kind: "exercise", title: "Complete the table: HDD or SSD", blocks: [
            T("Choose an HDD or an SSD for each application, and give one reason. " + CHECK_NEXT),
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
              ["database server with many random reads", "SSD", "over 100,000 IOPS"],
              ["data logger on a vibrating machine", "SSD", "no moving parts; 1500 G shock resistance"],
            ]),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which order is from the fastest to the slowest access?", choices: ["Register → Cache → RAM → Hard disk", "Cache → Register → RAM → Hard disk", "RAM → Register → Cache → Hard disk", "Register → RAM → Cache → Hard disk"], answer: 0, explain: "Registers are fastest, then the cache, then RAM. The hard disk is the slowest." },
            { q: "How does an SSD store data?", choices: ["As magnetic polarity on platters", "As electric charge in flash memory cells", "As marks read by a laser", "As sound waves"], answer: 1, explain: "An SSD uses NAND flash: each cell traps an electric charge." },
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
            T("A <b>program</b> is a set of instructions written in a programming language. The CPU executes it to perform a task. While it runs, the program uses the hardware:"),
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
            T("Write the level of each component: its number and name. The first row is done. The next exercise checks the table."),
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
          { kind: "exercise", title: "Complete the table: translators", blocks: [
            T("Write the translator for each program, and when the translation takes place. " + CHECK_NEXT),
            TB(["Program", "Translator", "When"], [
              ["<code>ADD R1, R2</code> (assembly language)", "", ""],
              ["a C++ program", "", ""],
              ["a Python program", "", ""],
            ]),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Program", "Translator", "When"], [
              ["<code>ADD R1, R2</code> (assembly language)", "assembler", "before the program runs"],
              ["a C++ program", "compiler", "before the program runs"],
              ["a Python program", "interpreter", "while the program runs, one statement at a time"],
            ]),
          ] },
          { kind: "exercise", title: "Complete the table: a program and the hardware", blocks: [
            T("A student writes a Python program that converts 25 °C to °F, saves it as <code>temp.py</code>, and runs it. Write the hardware used in each step. " + CHECK_NEXT),
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
