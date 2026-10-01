/* ===================== Topic 10 - Programming in C =====================
   Authored deck format (see CHAPTER-IMPROVEMENT-PROMPT.md).
   A complete first course in C, taught as its own language (students already know the
   programming concepts, so the pace is faster). Lecture deck: "Computer Programming 09.pptx".
   Lesson order: introduction -> variables and types -> input and output -> operators ->
   decisions -> loops -> functions -> arrays -> strings -> structures -> pointers ->
   number systems and fixed-size integers -> bitwise operators -> C for microcontrollers ->
   practice. The core is Lessons 1-11. Lessons 12-14 prepare the Digital and Microprocessor
   course at a reading level: hexadecimal, stdint.h, bit manipulation, registers, volatile,
   static, and enum.
   Conventions:
   - Runnable programs are complete (#include, main, return 0) and run in the browser (JSCPP,
     patched in crunner.js). Every quoted output was checked with a real compiler (clang).
   - From Lesson 2 on, a codeTrace shows only the statements inside main, unless the example
     has its own functions.
   - C output uses printf; no Python appears in this chapter.
   ===================================================================== */
(function () {
  /* ---------- block helpers ---------- */
  const T = (html) => ({ type: "text", html });
  const L = (items, title, ordered) => ({ type: "list", items, title, ordered });
  const N = (html, title, variant) => ({ type: "note", html, title, variant });
  const TB = (head, rows, caption, cls) => ({ type: "table", head, rows, caption, cls });
  const CODE = (code, output, caption) => ({ type: "code", lang: "c", code, output, caption });
  const TXT = (code, caption) => ({ type: "code", lang: "text", code, caption });
  const EX = (code, caption, annot, inputs) => ({ type: "example", lang: "c", code, caption, annot, inputs });
  const RUN = (code, title, inputs) => ({ type: "livecode", lang: "c", code, title: title || "Program", inputs });
  const PQ = (prompt, expected, starter, inputs, hint) => ({ type: "practiceq", lang: "c", prompt, expected, starter, inputs, hint });
  const W = (name, config) => ({ type: "widget", name, config });
  const QZ = (items) => ({ type: "quiz", items });
  const NEXT = (html) => N(html, "Next lesson");
  const IPO = (rows) => TB(["Step", "Result"], rows);
  const TRACE = (trace) => W("codeTrace", trace);
  const MAIN = (body) => "#include <stdio.h>\nint main(void) {\n" + body + "\n    return 0;\n}";
  const MAIN_U8 = (body) => "#include <stdio.h>\n#include <stdint.h>\nint main(void) {\n" + body + "\n    return 0;\n}";
  const STEP_RUN = T("Run the program with <b>Step Run</b>. Compare the variables after each line with your table.");
  const PAPER = T("Write the output on paper. Then run the program and compare.");
  const STARTER = MAIN("    // write your program here");

  /* ---------- traces ---------- */
  const T_hello = { lang: "c",
    code: ["#include <stdio.h>", "", "int main(void) {", '    printf("Power check\\n");', '    printf("Status: OK\\n");', "    return 0;", "}"],
    steps: [
      { line: -1, note: "The program has been compiled. Line 1, <code>#include &lt;stdio.h&gt;</code>, added the standard input/output library, which contains printf." },
      { line: 2, note: "Line 3: running starts in <code>main</code>. <code>int</code>: main returns a whole number to the operating system. <code>(void)</code>: main takes no values." },
      { line: 3, note: "A <b>statement</b>; it ends with <code>;</code>. printf displays the text. <code>\\n</code> ends the line.", print: "Power check" },
      { line: 4, note: "The second printf displays the second line.", print: "Status: OK" },
      { line: 5, note: "<code>return 0;</code> ends main and reports success (0) to the operating system. Result check: two lines are displayed, one for each printf, because each string ends with <code>\\n</code>." },
    ] };
  const T_vars = { lang: "c",
    code: ["int voltage = 12;", "double current = 1.5;", "double power = voltage * current;", 'printf("P = %.1f W\\n", power);', "current = 2.0;", "power = voltage * current;", 'printf("P = %.1f W\\n", power);'],
    steps: [
      { line: -1, note: "The statements inside main. No variable exists yet." },
      { line: 0, note: "voltage is created as an int and receives 12.", set: { voltage: "12" } },
      { line: 1, note: "current is created as a double and receives 1.5.", set: { current: "1.5" } },
      { line: 2, note: "12 * 1.5 → 18.0. An int times a double gives a double.", set: { power: "18.0" } },
      { line: 3, note: "%.1f is replaced by the value of power, with 1 decimal place.", print: "P = 18.0 W" },
      { line: 4, note: "current receives a new value. power keeps 18.0: it is not computed again by itself.", set: { current: "2.0" } },
      { line: 5, note: "power is computed again with the new current: 12 * 2.0 → 24.0.", set: { power: "24.0" } },
      { line: 6, note: "Result check: 12 × 1.5 = 18.0, then 12 × 2.0 = 24.0.", print: "P = 24.0 W" },
    ] };
  const T_exSwap = { lang: "c",
    code: ["int a = 5;", "int b = 8;", "int t = a;", "a = b;", "b = t;", 'printf("%d %d\\n", a, b);'],
    steps: [
      { line: 0, note: "a is created.", set: { a: "5" } },
      { line: 1, note: "b is created.", set: { b: "8" } },
      { line: 2, note: "t keeps a copy of a.", set: { t: "5" } },
      { line: 3, note: "a receives the value of b.", set: { a: "8" } },
      { line: 4, note: "b receives the old value of a.", set: { b: "5" } },
      { line: 5, note: "The values are exchanged.", print: "8 5" },
    ] };
  const T_scan = { lang: "c",
    code: ["int age;", 'printf("Enter age: ");', 'scanf("%d", &age);', 'printf("Next year: %d\\n", age + 1);'],
    steps: [
      { line: -1, note: "The statements inside main." },
      { line: 0, note: "age is declared. It has no value yet." },
      { line: 1, note: "The prompt is displayed. Without <code>\\n</code>, the cursor stays on the same line.", print: "Enter age: ", end: "" },
      { line: 2, note: "scanf waits. The user types 19 and presses Enter: the terminal shows 19 after the prompt, and 19 is stored at the address &age.", set: { age: "19" }, print: "19" },
      { line: 3, note: "age + 1 → 20. Result check: 19 + 1 = 20.", print: "Next year: 20" },
    ] };
  const T_div = { lang: "c",
    code: ["int sum = 7, count = 2;", "double avg1 = sum / count;", "double avg2 = (double) sum / count;", 'printf("%.1f %.1f\\n", avg1, avg2);'],
    steps: [
      { line: -1, note: "The statements inside main." },
      { line: 0, note: "Two int variables.", set: { sum: "7", count: "2" } },
      { line: 1, note: "sum / count: int / int → 3. The decimal part is lost; 3 is stored as 3.0.", set: { avg1: "3.0" } },
      { line: 2, note: "(double) sum is 7.0. 7.0 / 2 → 3.5.", set: { avg2: "3.5" } },
      { line: 3, note: "Both values with 1 decimal place. Result check: 7 / 2 = 3.5. The first average lost 0.5.", print: "3.0 3.5" },
    ] };
  const T_exOps = { lang: "c",
    code: ["int n = 10;", "n -= 4;", "n *= 2;", "n++;", "int r = n % 5;", 'printf("%d %d\\n", n, r);'],
    steps: [
      { line: 0, note: "n is created.", set: { n: "10" } },
      { line: 1, note: "n = n - 4", set: { n: "6" } },
      { line: 2, note: "n = n * 2", set: { n: "12" } },
      { line: 3, note: "n = n + 1", set: { n: "13" } },
      { line: 4, note: "13 % 5: the remainder", set: { r: "3" } },
      { line: 5, note: "Both values are displayed.", print: "13 3" },
    ] };
  const T_if = { lang: "c",
    code: ["double temp = 82.5;", "if (temp > 80.0) {", '    printf("Overheat\\n");', "} else {", '    printf("Normal\\n");', "}"],
    steps: [
      { line: -1, note: "The statements inside main." },
      { line: 0, note: "temp is created.", set: { temp: "82.5" } },
      { line: 1, note: "82.5 > 80.0 is true (1): the first block runs." },
      { line: 2, note: "The message is displayed.", print: "Overheat" },
      { line: 5, note: "The else block is skipped. The if statement is complete. Result check: 82.5 is above 80.0, so only Overheat is displayed." },
    ] };
  const T_elif = { lang: "c",
    code: ["int score = 70;", "if (score >= 80) {", '    printf("A\\n");', "} else if (score >= 50) {", '    printf("Pass\\n");', "} else {", '    printf("Fail\\n");', "}"],
    steps: [
      { line: -1, note: "The statements inside main." },
      { line: 0, note: "score is created.", set: { score: "70" } },
      { line: 1, note: "70 >= 80 is false: this block is skipped." },
      { line: 3, note: "70 >= 50 is true." },
      { line: 4, note: "The second block runs.", print: "Pass" },
      { line: 7, note: "The rest is skipped: only one block of the chain runs. Result check: 70 is below 80 but at least 50: Pass." },
    ] };
  const T_switch = { lang: "c",
    code: ["char cmd = 'm';", "int rpm = 0;", "switch (cmd) {", "    case 'l': rpm = 800; break;", "    case 'm': rpm = 1500; break;", "    case 'h': rpm = 2400; break;", '    default: printf("Unknown\\n");', "}", 'printf("Speed: %d rpm\\n", rpm);'],
    steps: [
      { line: -1, note: "The statements inside main. A fan has three speeds: l, m, and h." },
      { line: 0, note: "cmd is created.", set: { cmd: "'m'" } },
      { line: 1, note: "rpm is created.", set: { rpm: "0" } },
      { line: 2, note: "switch compares cmd with the cases. cmd is 'm': execution jumps to case 'm'. case 'l' does not run." },
      { line: 4, note: "rpm = 1500. Then break leaves the switch.", set: { rpm: "1500" } },
      { line: 8, note: "Execution continues after the switch. case 'h' and default did not run. Result check: only the statements of case 'm' ran.", print: "Speed: 1500 rpm" },
    ] };
  const T_exSw = { lang: "c",
    code: ["int n = 2;", "switch (n) {", '    case 1: printf("one\\n");', '    case 2: printf("two\\n");', '    case 3: printf("three\\n"); break;', "}"],
    steps: [
      { line: 0, note: "n is created.", set: { n: "2" } },
      { line: 1, note: "Jump to case 2." },
      { line: 3, note: "No break: continue.", print: "two" },
      { line: 4, note: "break leaves the switch.", print: "three" },
      { line: 5, note: "The switch is complete." },
    ] };
  const T_while = { lang: "c",
    code: ["int i = 0;", "while (i < 3) {", '    printf("%d\\n", i);', "    i++;", "}"],
    steps: [
      { line: -1, note: "The statements inside main." },
      { line: 0, note: "The counter starts at 0.", set: { i: "0" } },
      { line: 1, note: "0 < 3 is true: the block runs." },
      { line: 2, note: "The value of i is displayed.", print: "0" },
      { line: 3, note: "i++", set: { i: "1" } },
      { line: 1, note: "1 < 3 is true." },
      { line: 2, note: "Displayed.", print: "1" },
      { line: 3, note: "i++", set: { i: "2" } },
      { line: 1, note: "2 < 3 is true." },
      { line: 2, note: "Displayed.", print: "2" },
      { line: 3, note: "i++", set: { i: "3" } },
      { line: 1, note: "3 < 3 is false: the loop ends. Result check: 0, 1, 2 are displayed; the loop stops when i reaches 3." },
    ] };
  const T_do = { lang: "c",
    code: ["int n;", "do {", '    printf("Enter 1-5: ");', '    scanf("%d", &n);', "} while (n < 1 || n > 5);", 'printf("OK: %d\\n", n);'],
    steps: [
      { line: -1, note: "The statements inside main. The user types 9, then 3." },
      { line: 0, note: "n is declared. It has no value yet." },
      { line: 1, note: "do: the block starts without a check." },
      { line: 2, note: "The prompt is displayed.", print: "Enter 1-5: ", end: "" },
      { line: 3, note: "The user types 9.", set: { n: "9" }, print: "9" },
      { line: 4, note: "9 > 5, so the condition is true: the block runs again." },
      { line: 2, note: "The prompt is displayed again.", print: "Enter 1-5: ", end: "" },
      { line: 3, note: "The user types 3.", set: { n: "3" }, print: "3" },
      { line: 4, note: "3 is from 1 to 5, so the condition is false: the loop ends." },
      { line: 5, note: "Result check: the invalid 9 was rejected; the block ran twice.", print: "OK: 3" },
    ] };
  const T_for = { lang: "c",
    code: ["int sum = 0;", "for (int i = 1; i <= 3; i++) {", "    sum += i;", "}", 'printf("%d\\n", sum);'],
    steps: [
      { line: -1, note: "The statements inside main." },
      { line: 0, note: "The sum starts at 0.", set: { sum: "0" } },
      { line: 1, note: "Start: i = 1. 1 <= 3 is true.", set: { i: "1" } },
      { line: 2, note: "sum = 0 + 1", set: { sum: "1" } },
      { line: 1, note: "Update: i = 2. 2 <= 3 is true.", set: { i: "2" } },
      { line: 2, note: "sum = 1 + 2", set: { sum: "3" } },
      { line: 1, note: "Update: i = 3. 3 <= 3 is true.", set: { i: "3" } },
      { line: 2, note: "sum = 3 + 3", set: { sum: "6" } },
      { line: 1, note: "Update: i = 4. 4 <= 3 is false: the loop ends.", set: { i: "4" } },
      { line: 4, note: "i existed only inside the loop. The sum is displayed. Result check: 1 + 2 + 3 = 6.", unset: ["i"], print: "6" },
    ] };
  const T_exWhile = { lang: "c",
    code: ["int n = 3;", "while (n > 0) {", "    n -= 2;", "}", 'printf("%d\\n", n);'],
    steps: [
      { line: 0, note: "n is created.", set: { n: "3" } },
      { line: 1, note: "3 > 0 is true." },
      { line: 2, note: "n = 3 - 2", set: { n: "1" } },
      { line: 1, note: "1 > 0 is true." },
      { line: 2, note: "n = 1 - 2", set: { n: "-1" } },
      { line: 1, note: "-1 > 0 is false: the loop ends." },
      { line: 4, note: "n is displayed.", print: "-1" },
    ] };
  const T_func = { lang: "c",
    code: ["int square(int n) {", "    return n * n;", "}", "int main(void) {", "    int s = square(4);", '    printf("%d\\n", s);', "    return 0;", "}"],
    steps: [
      { line: -1, note: "Running starts in main (line 4), not at the first line." },
      { line: 4, note: "square(4) is called: the parameter n receives 4.", set: { "n (square)": "4" } },
      { line: 1, note: "n * n → 16. return sends 16 back; n disappears.", unset: ["n (square)"] },
      { line: 4, note: "The call is replaced by 16, which is stored in s.", set: { s: "16" } },
      { line: 5, note: "s is displayed.", print: "16" },
      { line: 6, note: "main ends. Result check: 4 × 4 = 16." },
    ] };
  const T_byval = { lang: "c",
    code: ["void reset(int x) {", "    x = 0;", "}", "int main(void) {", "    int level = 70;", "    reset(level);", '    printf("%d\\n", level);', "    return 0;", "}"],
    steps: [
      { line: -1, note: "Running starts in main." },
      { line: 4, note: "level is created.", set: { level: "70" } },
      { line: 5, note: "reset(level): the parameter x receives a copy of 70.", set: { "x (reset)": "70" } },
      { line: 1, note: "x = 0 changes only the copy.", set: { "x (reset)": "0" } },
      { line: 2, note: "reset ends: x disappears.", unset: ["x (reset)"] },
      { line: 6, note: "Result check: level is still 70; only the copy x was set to 0.", print: "70" },
    ] };
  const T_exFunc = { lang: "c",
    code: ["int twice(int v) {", "    v = v * 2;", "    return v;", "}", "int main(void) {", "    int a = 5;", '    printf("%d %d\\n", a, twice(a));', "    return 0;", "}"],
    steps: [
      { line: 5, note: "a is created.", set: { a: "5" } },
      { line: 6, note: "twice(a): v receives a copy of 5.", set: { "v (twice)": "5" } },
      { line: 1, note: "Only the copy changes.", set: { "v (twice)": "10" } },
      { line: 2, note: "10 is returned; v disappears.", unset: ["v (twice)"] },
      { line: 6, note: "a is unchanged; the call is replaced by 10.", print: "5 10" },
    ] };
  const T_arrLoop = { lang: "c",
    code: ["double t[3] = {21.0, 25.5, 30.0};", "for (int i = 0; i < 3; i++) {", "    t[i] = t[i] + 0.5;", '    printf("t[%d] = %.1f\\n", i, t[i]);', "}"],
    steps: [
      { line: -1, note: "The statements inside main. Each reading is corrected by +0.5." },
      { line: 0, note: "Three elements, index 0 to 2.", set: { "t[0]": "21.0", "t[1]": "25.5", "t[2]": "30.0" } },
      { line: 1, note: "i = 0. 0 < 3 is true.", set: { i: "0" } },
      { line: 2, note: "t[0] = 21.0 + 0.5", set: { "t[0]": "21.5" } },
      { line: 3, note: "t[0] is displayed.", print: "t[0] = 21.5" },
      { line: 1, note: "i = 1. 1 < 3 is true.", set: { i: "1" } },
      { line: 2, note: "t[1] = 25.5 + 0.5", set: { "t[1]": "26.0" } },
      { line: 3, note: "t[1] is displayed.", print: "t[1] = 26.0" },
      { line: 1, note: "i = 2. 2 < 3 is true.", set: { i: "2" } },
      { line: 2, note: "t[2] = 30.0 + 0.5", set: { "t[2]": "30.5" } },
      { line: 3, note: "t[2] is displayed.", print: "t[2] = 30.5" },
      { line: 1, note: "i = 3: 3 < 3 is false, the loop ends. Result check: each element grew by 0.5.", set: { i: "3" } },
    ] };
  const T_stats = { lang: "c",
    code: ["int d[3] = {4, 9, 2};", "int max = d[0], sum = 0;", "for (int i = 0; i < 3; i++) {", "    sum += d[i];", "    if (d[i] > max) { max = d[i]; }", "}", 'printf("%d %d\\n", max, sum);', 'printf("%.2f\\n", (double) sum / 3);'],
    steps: [
      { line: -1, note: "The statements inside main." },
      { line: 0, note: "Three readings.", set: { d: "{4, 9, 2}" } },
      { line: 1, note: "max starts with the first element; sum with 0.", set: { max: "4", sum: "0" } },
      { line: 2, note: "i = 0", set: { i: "0" } },
      { line: 3, note: "sum = 0 + 4", set: { sum: "4" } },
      { line: 4, note: "4 > 4 is false." },
      { line: 2, note: "i = 1", set: { i: "1" } },
      { line: 3, note: "sum = 4 + 9", set: { sum: "13" } },
      { line: 4, note: "9 > 4 is true: max = 9.", set: { max: "9" } },
      { line: 2, note: "i = 2", set: { i: "2" } },
      { line: 3, note: "sum = 13 + 2", set: { sum: "15" } },
      { line: 4, note: "2 > 9 is false." },
      { line: 2, note: "i = 3: 3 < 3 is false, the loop ends.", set: { i: "3" } },
      { line: 6, note: "The maximum and the sum are displayed.", unset: ["i"], print: "9 15" },
      { line: 7, note: "Result check: max of 4, 9, 2 is 9; 4 + 9 + 2 = 15; 15.0 / 3 = 5.00.", print: "5.00" },
    ] };
  const T_str = { lang: "c",
    code: ['char unit[6] = "volts";', "unit[0] = 'V';", 'printf("%s\\n", unit);', "unit[4] = '\\0';", 'printf("%s\\n", unit);'],
    steps: [
      { line: -1, note: "The statements inside main." },
      { line: 0, note: "6 chars: the 5 letters, and '\\0' at index 5.", set: { unit: '"volts"', "unit[4]": "'s'", "unit[5]": "'\\0'" } },
      { line: 1, note: "unit[0], the first character, becomes 'V'.", set: { unit: '"Volts"' } },
      { line: 2, note: "%s displays the characters up to the first '\\0'.", print: "Volts" },
      { line: 3, note: "unit[4], the 's', becomes '\\0'. The array still has 6 chars: unit[5] is also '\\0'.", set: { "unit[4]": "'\\0'", unit: '"Volt"' } },
      { line: 4, note: "%s stops at the first '\\0', unit[4]. Result check: only V, o, l, t come before it.", print: "Volt" },
    ] };
  const T_swap = { lang: "c",
    code: ["void swap(int *a, int *b) {", "    int t = *a;", "    *a = *b;", "    *b = t;", "}", "int main(void) {", "    int x = 1, y = 2;", "    swap(&x, &y);", '    printf("%d %d\\n", x, y);', "    return 0;", "}"],
    steps: [
      { line: -1, note: "Running starts in main." },
      { line: 6, note: "Two variables.", set: { x: "1", y: "2" } },
      { line: 7, note: "swap(&x, &y): a receives the address of x, b the address of y.", set: { "a, b (swap)": { v: "&x, &y", t: "obj" } } },
      { line: 1, note: "*a is x: t = 1.", set: { "t (swap)": "1" } },
      { line: 2, note: "*a = *b: x receives the value of y.", set: { x: "2" } },
      { line: 3, note: "*b = t: y receives 1.", set: { y: "1" } },
      { line: 4, note: "swap ends: a, b, and t disappear; x and y stay changed.", unset: ["a, b (swap)", "t (swap)"] },
      { line: 8, note: "Result check: x and y are exchanged, because swap worked on their addresses.", print: "2 1" },
    ] };

  const T_wrap = { lang: "c",
    code: ["uint8_t count = 254;", "count++;", "count++;", "count = count + 10;", 'printf("%d\\n", count);'],
    steps: [
      { line: -1, note: "The statements inside main (with #include <stdint.h>)." },
      { line: 0, note: "An 8-bit unsigned value: 0 to 255.", set: { count: "254" } },
      { line: 1, note: "254 + 1 = 255, the largest value.", set: { count: "255" } },
      { line: 2, note: "255 + 1 = 256 needs 9 bits: only the low 8 bits are kept, 0.", set: { count: "0" } },
      { line: 3, note: "0 + 10 = 10.", set: { count: "10" } },
      { line: 4, note: "The value is displayed. Result check: 256 mod 256 = 0, then 0 + 10 = 10.", print: "10" },
    ] };
  const H = (x) => ({ v: x, t: "int" });   // a hexadecimal value shown as an int
  const T_ops = { lang: "c",
    code: ["uint8_t port = 0x00;", "port |= (1 << 3);", "port |= (1 << 0);", "port &= ~(1 << 3);", "port ^= (1 << 7);", 'printf("%02X\\n", port);', 'printf("%d\\n", (port & 1) != 0);'],
    steps: [
      { line: -1, note: "The statements inside main. port simulates an output register." },
      { line: 0, note: "All 8 bits are 0: every pin is low.", set: { port: H("0x00") } },
      { line: 1, note: "Set bit 3: 0000 1000.", set: { port: H("0x08") } },
      { line: 2, note: "Set bit 0: 0000 1001. Bit 3 stays 1.", set: { port: H("0x09") } },
      { line: 3, note: "Clear bit 3: ~0x08 is 1111 0111; AND keeps the other bits.", set: { port: H("0x01") } },
      { line: 4, note: "Toggle bit 7: 1000 0001.", set: { port: H("0x81") } },
      { line: 5, note: "port is displayed in hexadecimal: 1000 0001 is 81.", print: "81" },
      { line: 6, note: "Test bit 0: port & 1 is not 0, so the comparison gives 1. Result check: only bits 7 and 0 are 1: 1000 0001 = 0x81.", print: "1" },
    ] };
  const T_exBits = { lang: "c",
    code: ["uint8_t reg = 0xF0;", "reg &= ~(1 << 7);", "reg |= 0x03;", "reg ^= 0x11;", 'printf("%02X\\n", reg);'],
    steps: [
      { line: 0, note: "1111 0000", set: { reg: H("0xF0") } },
      { line: 1, note: "clear bit 7: 0111 0000", set: { reg: H("0x70") } },
      { line: 2, note: "set bits 0 and 1: 0111 0011", set: { reg: H("0x73") } },
      { line: 3, note: "toggle bits 4 and 0: 0110 0010", set: { reg: H("0x62") } },
      { line: 4, note: "displayed in hexadecimal", print: "62" },
    ] };
  const T_static = { lang: "c",
    code: ["int count_press(void) {", "    static int n = 0;", "    n++;", "    return n;", "}", "int main(void) {", "    count_press();", "    count_press();", '    printf("%d\\n", count_press());', "    return 0;", "}"],
    steps: [
      { line: -1, note: "Running starts in main." },
      { line: 6, note: "First call of count_press." },
      { line: 1, note: "The static variable is created once, with 0.", set: { "n (static)": "0" } },
      { line: 2, note: "n = 1", set: { "n (static)": "1" } },
      { line: 3, note: "return 1. n is not destroyed: it keeps 1." },
      { line: 7, note: "Second call. The initialization is not run again." },
      { line: 2, note: "n = 2", set: { "n (static)": "2" } },
      { line: 3, note: "return 2." },
      { line: 8, note: "Third call, inside printf." },
      { line: 2, note: "n = 3", set: { "n (static)": "3" } },
      { line: 3, note: "return 3." },
      { line: 8, note: "printf displays the returned value. Result check: three calls, so n is 3. Without static, every call would return 1.", print: "3" },
    ] };

  const T_struct = { lang: "c",
    code: ["struct sensor {", "    int id;", "    double value;", "};", "int main(void) {", "    struct sensor s = {3, 21.5};", "    s.value = s.value + 0.5;", '    printf("%d %.1f\\n", s.id, s.value);', "    return 0;", "}"],
    steps: [
      { line: -1, note: "Lines 1–4 define the type struct sensor. A definition creates no variable. Running starts in main." },
      { line: 5, note: "s is created. Its members receive the values in the order of the definition: id 3, value 21.5.", set: { "s.id": "3", "s.value": "21.5" } },
      { line: 6, note: "s.value is a double: 21.5 + 0.5 → 22.0 is stored in the member value.", set: { "s.value": "22.0" } },
      { line: 7, note: "The members are displayed like ordinary variables. Result check: 21.5 + 0.5 = 22.0; id keeps the value 3.", print: "3 22.0" },
    ] };
  const T_heatCopy = { lang: "c",
    code: ["struct sensor heat(struct sensor s) {", "    s.value = s.value + 2.0;", "    return s;", "}", "int main(void) {", "    struct sensor a = {3, 21.5};", "    a = heat(a);", '    printf("%.1f\\n", a.value);', "    return 0;", "}"],
    steps: [
      { line: -1, note: "struct sensor is defined above. Running starts in main." },
      { line: 5, note: "a is created.", set: { "a.id": "3", "a.value": "21.5" } },
      { line: 6, note: "heat(a) is called: the parameter s receives a copy of every member of a.", set: { "s.id (heat)": "3", "s.value (heat)": "21.5" } },
      { line: 1, note: "Only the copy changes: 21.5 + 2.0. a.value is still 21.5.", set: { "s.value (heat)": "23.5" } },
      { line: 2, note: "return s sends the changed copy back; s disappears.", unset: ["s.id (heat)", "s.value (heat)"] },
      { line: 6, note: "a = ... stores the returned struct in a.", set: { "a.value": "23.5" } },
      { line: 7, note: "Result check: 21.5 + 2.0 = 23.5.", print: "23.5" },
    ] };
  const T_heat = { lang: "c",
    code: ["void heat(struct sensor *p, double d) {", "    p->value = p->value + d;", "}", "int main(void) {", "    struct sensor s = {3, 21.5};", "    heat(&s, 2.0);", '    printf("%.1f\\n", s.value);', "    return 0;", "}"],
    steps: [
      { line: -1, note: "struct sensor (Lesson 10) is defined above. Running starts in main." },
      { line: 4, note: "s is created.", set: { "s.id": "3", "s.value": "21.5" } },
      { line: 5, note: "heat(&s, 2.0): p receives the address of s, and d receives 2.0.", set: { "p (heat)": { v: "&s", t: "obj" }, "d (heat)": "2.0" } },
      { line: 1, note: "p->value is the member value of the struct that p points to: 21.5 + 2.0.", set: { "s.value": "23.5" } },
      { line: 2, note: "heat ends: p and d disappear; s stays changed.", unset: ["p (heat)", "d (heat)"] },
      { line: 6, note: "The changed member is displayed. Result check: 21.5 + 2.0 = 23.5; heat changed s through p.", print: "23.5" },
    ] };
  const T_exStruct = { lang: "c",
    code: ["struct point a = {1, 2};", "struct point b = a;", "b.x = 5;", "a.y = a.y + b.x;", 'printf("%d %d\\n", a.y, b.x);'],
    steps: [
      { line: 0, note: "a is created.", set: { "a.x": "1", "a.y": "2" } },
      { line: 1, note: "b receives a copy of every member of a.", set: { "b.x": "1", "b.y": "2" } },
      { line: 2, note: "Only b changes.", set: { "b.x": "5" } },
      { line: 3, note: "a.y = 2 + 5", set: { "a.y": "7" } },
      { line: 4, note: "a.y and b.x are displayed.", print: "7 5" },
    ] };

  App.registerTopic({
    id: "t10",
    title: "Programming in C",
    short: "Programming in C",
    blurb: "A complete first course in C: variables, input and output, operators, decisions, loops, functions, arrays, strings, structures, pointers, bit manipulation, and C for microcontrollers.",
    intro: "C is a compiled language that runs close to the hardware; most embedded systems are programmed in it. This chapter is a complete first course in C. Each lesson uses only what the lessons before it have explained:<br>introduction → variables → input and output → operators → decisions → loops → functions → arrays → strings → structures → pointers → number systems → bitwise operators → C for microcontrollers → practice.<br>Lessons 12 to 14 prepare the Digital and Microprocessor course.<br>Every program runs in the browser. <b>Step Run</b> shows each line, the variables, and the output.",
    lessons: [
      /* =============================== 1. INTRODUCTION =============================== */
      {
        id: "why-c",
        title: "Introduction to C",
        sub: "What C is, compiling and running, the structure of a program, printf, comments, and errors.",
        slides: "09:3–9",
        keywords: "c compiled gcc compile run main include stdio printf escape sequence comment syntax error",
        deck: [
          { kind: "overview", title: "Introduction to C", blocks: [
            T("<b>C</b> is a compiled programming language, created in 1972. It is used where speed and direct control of the hardware matter: operating systems, microcontrollers, and the embedded devices in engineering products."),
            L(["What C is", "Compiling and running", "The structure of a C program", "Output with printf", "Comments", "Errors"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "What C is", title: "Why engineers learn C", blocks: [
            L([
              "Most embedded systems (motor controllers, sensors, car control units, household appliances) are programmed in C.",
              "C programs are fast and small, because the compiler translates them directly into machine code.",
              "C gives direct access to memory: the programmer decides the type and size of every value.",
              "C++, Java, and C# use the syntax of C, and many systems (operating systems, interpreters) are written in C.",
            ]),
          ] },
          { kind: "concept", part: "Compiling and running", title: "From source code to a running program", blocks: [
            TB(["Step", "What happens", "Result"], [
              ["1. Write", "the programmer writes the source code in a text file", "<code>hello.c</code>"],
              ["2. Compile", "the compiler checks the code and translates it into machine code", "<code>hello.exe</code> (Windows) or <code>hello</code>"],
              ["3. Run", "the operating system loads the machine code; the CPU executes it", "the output"],
            ]),
            T("If the code contains an error, step 2 stops. Nothing runs until the error is corrected."),
          ] },
          { kind: "concept", part: "Compiling and running", title: "Compiling with gcc", blocks: [
            TXT("gcc hello.c -o hello\n./hello", "in a terminal"),
            L([
              "<code>gcc</code> is a C compiler. <code>-o hello</code> names the program that it creates.",
              "<code>./hello</code> runs the program (on Windows: <code>hello.exe</code>).",
              "After every change to the source code, compile again before running.",
              "On this site, <b>Run</b> compiles and runs the program in one step.",
            ]),
          ] },
          { kind: "concept", part: "The structure of a C program", title: "Rules of C syntax", blocks: [
            L([
              "A <b>statement</b> is one instruction. Every statement ends with a semicolon <code>;</code>.",
              "Braces <code>{ }</code> group statements into a block. Indentation is only for the reader.",
              "C is case-sensitive: <code>printf</code> is correct; <code>Printf</code> is an error.",
              "Text in double quotes, <code>\"...\"</code>, is a <b>string</b>.",
            ]),
          ] },
          { kind: "code", part: "The structure of a C program", title: "The first program: execution step by step", blocks: [TRACE(T_hello)] },
          { kind: "concept", part: "Output with printf", title: "printf and escape sequences", blocks: [
            TB(["Escape sequence", "Meaning"], [
              ["<code>\\n</code>", "new line"],
              ["<code>\\t</code>", "tab (moves to the next column)"],
              ["<code>\\\\</code>", "one backslash"],
              ["<code>\\\"</code>", "a double quote inside a string"],
            ]),
            T("Without <code>\\n</code>, the next output continues on the same line."),
          ] },
          { kind: "code", part: "Output with printf", title: "Example: new lines and tabs", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    printf("Motor ");
    printf("ON\\n");
    printf("Speed:\\t1500 rpm\\n");
    printf("File: C:\\\\data\\n");
    return 0;
}`, "without \\n, the output continues on the same line", [
              { c: 'printf("Motor ");', e: "no <code>\\n</code>: <code>ON</code> follows on the same line" },
              { c: "\\t", e: "a tab between <code>Speed:</code> and <code>1500</code>" },
              { c: "\\\\", e: "displays one backslash: <code>C:\\data</code>" },
            ]),
          ] },
          { kind: "concept", part: "Comments", title: "Comments", blocks: [
            CODE('// a comment on one line\n/* a comment\n   over several lines */\nprintf("Ready\\n");   // a comment after code'),
            L([
              "Comments explain the code to people. The compiler ignores them.",
              "<code>//</code> starts a comment that ends at the end of the line.",
              "<code>/* ... */</code> encloses a comment of one or more lines.",
            ]),
          ] },
          { kind: "concept", part: "Errors", title: "Three kinds of error", blocks: [
            TB(["Error", "When it appears", "Example"], [
              ["Syntax (compile) error", "the compiler finds it; no program is created", "a missing <code>;</code> or <code>}</code>"],
              ["Run-time error", "the program stops while it runs", "a division by zero"],
              ["Logical error", "the program runs, but the output is wrong", "a wrong formula"],
              ["Warning", "the compiler creates the program, but reports a probable mistake", "a value that does not match its printf specifier (Lesson 2)"],
            ]),
            T("Read every warning. This site stops with an error message for the most common of these mistakes."),
          ] },
          { kind: "code", part: "Errors", title: "Example: a missing semicolon", cols: [
            [L([
              "Run the program: the compiler reports a syntax error.",
              "The ; is missing at the end of line 3. A compiler reports it at the end of line 3 or at the start of line 4.",
              "Add the ; and run the program again.",
            ])],
            [RUN('#include <stdio.h>\nint main(void) {\n    printf("Line 1\\n")\n    printf("Line 2\\n");\n    return 0;\n}')],
          ] },
          { kind: "concept", part: "Errors", title: "Reading a compiler message", blocks: [
            TXT('semi.c:3:23: error: expected \';\' after expression\n    3 |     printf("Line 1\\n")\n      |                       ^\n      |                       ;', "clang, a C compiler, for the program above saved as semi.c"),
            L([
              "<code>semi.c:3:23</code>: the file, line 3, column 23. Then the kind (error or warning) and the description.",
              "The compiler shows the line and marks the position with <code>^</code>.",
              "Fix the first error first, then compile again: one mistake can cause several messages.",
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "C is compiled: source code → compiler → executable program → run.",
              "A program starts in <code>main</code>; statements end with <code>;</code>; braces group statements.",
              "<code>#include &lt;stdio.h&gt;</code> is needed for printf; <code>\\n</code> starts a new line.",
              "Comments: <code>//</code> for one line, <code>/* ... */</code> for several lines.",
              "A syntax error stops the build: nothing runs until it is corrected.",
            ]),
            NEXT("<b>Variables and data types</b>. Declaring variables, the basic types, and displaying their values."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [PAPER],
            [RUN('#include <stdio.h>\nint main(void) {\n    printf("A");\n    printf("B\\n");\n    printf("C\\tD\\n");\n    return 0;\n}')],
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The program has two errors. Correct them.",
              "Sensor ready", '#include <stdio.h>\nint main(void) {\n    Printf("Sensor ready\\n")\n    return 0;\n}', null, "C is case-sensitive, and every statement ends with ;."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("Display the three lines of the target output. Use one printf for each line.",
              "Device: Pump\nVoltage: 220 V\nStatus: ON", STARTER, null, 'printf("Device: Pump\\n");'),
          ] },
          { kind: "exercise", title: "Modify a program", blocks: [
            PQ("Modify the program: display the two columns separated by a tab, <code>\\t</code>, instead of a space.",
              "Item\tQty\nFuse\t4", '#include <stdio.h>\nint main(void) {\n    printf("Item Qty\\n");\n    printf("Fuse 4\\n");\n    return 0;\n}', null, 'printf("Item\\tQty\\n");'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Where does a C program start running?", choices: ["at the first line", "in main", "at #include", "at return 0"], answer: 1, explain: "Every C program starts in the function main." },
            { q: "What does `\\n` do in a printf string?", choices: ["displays n", "starts a new line", "ends the program", "adds a space"], answer: 1, explain: "It moves the output to the next line." },
          ])] },
        ],
      },

      /* =============================== 2. VARIABLES AND TYPES =============================== */
      {
        id: "types",
        title: "Variables and data types",
        sub: "The basic types, declaring variables, displaying values, sizes and ranges, constants, and characters.",
        slides: "09:10–14",
        keywords: "variable declare initialize int double float char bool sizeof const define printf format specifier ascii",
        deck: [
          { kind: "overview", title: "Variables and data types", blocks: [
            T("A <b>variable</b> is a named memory location that stores a value. In C, every variable has a fixed <b>type</b>, stated when the variable is created."),
            L(["The basic data types", "Declaring variables", "Displaying values", "Sizes and ranges", "Constants", "Characters are numbers", "Names"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "The basic data types", title: "The basic data types", blocks: [
            TB(["Type", "Stores", "Example"], [
              ["<code>int</code>", "whole numbers", "<code>int count = -3;</code>"],
              ["<code>double</code>", "decimal numbers (about 15 digits)", "<code>double v = 3.3;</code>"],
              ["<code>float</code>", "decimal numbers (about 7 digits)", "<code>float t = 21.5f;</code>"],
              ["<code>char</code>", "one character, in single quotes", "<code>char unit = 'V';</code>"],
              ["<code>bool</code>", "true or false (<code>#include &lt;stdbool.h&gt;</code>)", "<code>bool on = true;</code>"],
            ]),
            T("Use double for decimal values unless memory is very limited."),
            T("The f in <code>21.5f</code> makes the value a float; without the f, 21.5 is a double."),
          ] },
          { kind: "concept", part: "Declaring variables", title: "Declaration and initialization", blocks: [
            CODE("int count;            // declaration\ncount = 10;           // assignment\ndouble price = 9.99;  // declaration with initialization", null, "syntax: type name = value;"),
            L([
              "A <b>declaration</b> creates a variable of a type. It must come before the variable is used.",
              "<b>Initialization</b> gives the first value in the declaration itself.",
              "The type cannot change: an int variable always stores whole numbers.",
            ]),
          ] },
          { kind: "concept", part: "Declaring variables", title: "A variable without a value", blocks: [
            L([
              "A declared variable that is not initialized contains an unknown leftover value (\"garbage\").",
              "Always give a variable a value before its value is read. A real compiler only warns about this mistake; the program then uses the leftover value.",
              "Several variables of one type can be declared together: <code>int a = 1, b = 2;</code>",
            ]),
          ] },
          { kind: "code", part: "Declaring variables", title: "Example: a variable without a value", blocks: [
            CODE('int count;\ncount = count + 1;\nprintf("%d\\n", count);', "-402653671", "the statements inside main, compiled with clang; %d displays an int (next slides)"),
            TXT("warning: variable 'count' is uninitialized when used here", "the warning of clang"),
            T("A real compiler only warns and creates the program, which displays a leftover value, a different one on each run. This site stops with an error message instead, so the mistake is found at once."),
          ] },
          { kind: "concept", part: "Displaying values", title: "Format specifiers", blocks: [
            CODE('printf("V = %d\\n", voltage);', null, "a specifier is replaced by the value after the string"),
            TB(["Specifier", "Type", "Example output"], [
              ["<code>%d</code>", "int", "<code>12</code>"],
              ["<code>%f</code>", "double, float", "<code>1.500000</code> (6 decimals)"],
              ["<code>%.2f</code>", "double, float", "<code>1.50</code> (2 decimals)"],
              ["<code>%c</code>", "char", "<code>A</code>"],
              ["<code>%s</code>", "string", "<code>pump</code>"],
            ]),
          ] },
          { kind: "concept", part: "Displaying values", title: "Several values in one printf", blocks: [
            CODE('printf("%d V, %.1f A\\n", voltage, current);', "12 V, 1.5 A"),
            L([
              "The values follow the string, separated by commas, in the order of the specifiers.",
              "The type of each value must match its specifier: %d for int, %f for double.",
              "A wrong specifier is a common error: a real compiler only warns, and the program displays a wrong value.",
            ]),
          ] },
          { kind: "code", part: "Displaying values", title: "First example: execution step by step", blocks: [TRACE(T_vars)] },
          { kind: "code", part: "Displaying values", title: "Example: variables of three types", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int rpm = 1500;
    double temp = 36.6;
    char unit = 'C';
    printf("%d rpm\\n", rpm);
    printf("%.1f %c\\n", temp, unit);
    return 0;
}`, "each value with its own specifier", [
              { c: "int rpm = 1500;", e: "a whole number" },
              { c: "char unit = 'C';", e: "one character, in single quotes" },
              { c: "printf(...)", e: "<code>1500 rpm</code> and <code>36.6 C</code>" },
            ]),
          ] },
          { kind: "code", part: "Displaying values", title: "Example: a wrong specifier", blocks: [
            CODE('double current = 1.5;\nprintf("I = %d A\\n", current);', "I = 0 A", "the statements inside main, compiled with clang"),
            TXT("warning: format specifies type 'int' but the argument has type 'double'", "the warning of clang"),
            T("A real compiler only warns and creates the program, which displays a wrong value. A double needs %f or %.1f. This site stops with an error message instead, so the mistake is found at once."),
          ] },
          { kind: "concept", part: "Sizes and ranges", title: "Sizes and ranges", blocks: [
            TB(["Type", "Size (typical)", "Range or precision"], [
              ["<code>char</code>", "1 byte", "−128 to 127"],
              ["<code>int</code>", "4 bytes", "about −2.1 billion to +2.1 billion"],
              ["<code>float</code>", "4 bytes", "about 7 significant digits"],
              ["<code>double</code>", "8 bytes", "about 15 significant digits"],
            ]),
            T("<code>sizeof(type)</code> gives the size in bytes. A value outside the range does not fit, and the result is wrong (overflow)."),
          ] },
          { kind: "code", part: "Sizes and ranges", title: "Example: sizeof", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int c = (int) sizeof(char);
    int i = (int) sizeof(int);
    int d = (int) sizeof(double);
    printf("%d %d %d\\n", c, i, d);
    return 0;
}`, "sizes in bytes", [
              { c: "(int) sizeof(...)", e: "(int) turns the size into an int, for %d. This is a <b>cast</b> (Lesson 4)." },
              { c: "output", e: "<code>1 4 8</code>" },
            ]),
          ] },
          { kind: "concept", part: "Constants", title: "Constants: const and #define", blocks: [
            CODE("const double PI = 3.14159;\n#define RATED_V 220", null, "two ways to name a fixed value"),
            L([
              "A <code>const</code> variable cannot be changed after its initialization; the compiler reports an error.",
              "<code>#define NAME value</code> replaces NAME with the value before compiling. It has no ; and no type.",
              "Names of constants are usually written in capital letters.",
            ]),
          ] },
          { kind: "code", part: "Constants", title: "Example: a constant and a macro", blocks: [
            EX(`#include <stdio.h>
#define RATED_V 220
int main(void) {
    const double PI = 3.14159;
    double r = 2.0;
    printf("%.2f\\n", PI * r * r);
    printf("%d V\\n", RATED_V);
    return 0;
}`, "fixed values with names", [
              { c: "PI * r * r", e: "the area of a circle of radius 2: <code>12.57</code>" },
              { c: "RATED_V", e: "replaced by 220: <code>220 V</code>" },
            ]),
          ] },
          { kind: "concept", part: "Characters are numbers", title: "A char stores a number", blocks: [
            L([
              "A char stores the ASCII code of a character: 'A' is 65, 'a' is 97, '0' is 48.",
              "<code>%c</code> displays the character; <code>%d</code> displays its code.",
              "Arithmetic works on the code: <code>'A' + 1</code> is 66, the code of 'B'.",
            ]),
          ] },
          { kind: "code", part: "Characters are numbers", title: "Example: one value, two formats", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    char grade = 'A';
    printf("%c %d\\n", grade, grade);
    grade = grade + 1;
    printf("%c\\n", grade);
    return 0;
}`, "%c and %d on the same char", [
              { c: "%c %d", e: "<code>A 65</code>" },
              { c: "grade + 1", e: "66 is the code of <code>B</code>" },
            ]),
          ] },
          { kind: "concept", part: "Names", title: "Names of variables", blocks: [
            TB(["Name", "Valid?", "Reason"], [
              ["<code>motor_speed</code>", "<span class='t-yes'>valid</span>", "letters and _"],
              ["<code>temp2</code>", "<span class='t-yes'>valid</span>", "a digit, not at the start"],
              ["<code>2temp</code>", "<span class='t-no'>invalid</span>", "starts with a digit"],
              ["<code>max speed</code>", "<span class='t-no'>invalid</span>", "contains a space"],
              ["<code>int</code>", "<span class='t-no'>invalid</span>", "a keyword of C"],
            ]),
            T("Names are case-sensitive: <code>Speed</code> and <code>speed</code> are two different variables."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "Declare before use: <code>type name = value;</code>. The type cannot change.",
              "printf: %d int, %f or %.2f double, %c char, %s string, in the order of the values.",
              "int, double, float, char, bool; sizeof gives the size in bytes.",
              "const and #define name fixed values.",
              "A char stores its ASCII code: %c shows the character, %d the number.",
            ]),
            NEXT("<b>Input and formatted output</b>. Reading values with scanf and controlling the output format."),
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("The statements inside main. Complete the trace table on paper. The first row is done. The next exercise checks it."),
            W("traceTable", { trace: T_exSwap, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Check your trace", cols: [
            [STEP_RUN],
            [RUN(MAIN("    " + T_exSwap.code.join("\n    ")))],
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            PAPER,
            RUN(`#include <stdio.h>
int main(void) {
    int n = 7;
    double v = 2.5;
    char c = 'x';
    printf("%d %.2f %c %d\\n", n, v, c, c);
    return 0;
}`),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The program should display <code>Area = 12.50</code>. Correct the two errors.",
              "Area = 12.50", '#include <stdio.h>\nint main(void) {\n    double w = 2.5\n    double h = 5.0;\n    printf("Area = %d\\n", w * h);\n    return 0;\n}', null, "A ; is missing, and a double needs %.2f, not %d."),
          ] },
          { kind: "exercise", title: "Write a program", blocks: [
            PQ("A battery pack has 4 cells (an int) of 3.7 V each (a double). Display the total voltage with 1 decimal place.",
              "Total: 14.8 V", STARTER, null, 'printf("Total: %.1f V\\n", cells * cell_v);'),
          ] },
          { kind: "exercise", title: "Write a program: characters", blocks: [
            PQ("Store the character 'M' in a char variable. Display the character, its ASCII code, and the next character.",
              "M 77 N", STARTER, null, "Use %c and %d. The next character is the variable + 1."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which specifier displays a double with 2 decimal places?", choices: ["%d", "%2d", "%.2f", "%c"], answer: 2, explain: "%.2f shows 2 digits after the decimal point." },
            { q: "After `char c = 'A';`, what does `printf(\"%d\", c);` display?", choices: ["A", "65", "'A'", "an error"], answer: 1, explain: "%d shows the ASCII code of the character: 65." },
          ])] },
        ],
      },

      /* =============================== 3. INPUT AND OUTPUT =============================== */
      {
        id: "input",
        title: "Input and formatted output",
        sub: "Width and precision in printf, and reading values with scanf.",
        slides: "09:14–15",
        keywords: "printf width precision format scanf input address ampersand lf char string prompt",
        deck: [
          { kind: "overview", title: "Input and formatted output", blocks: [
            T("Programs read data from the user and display results in a clear format. <b>scanf</b> reads values from the keyboard; <b>printf</b> controls how values are displayed."),
            L(["Width and precision", "Reading a value with scanf", "Reading several values", "Reading a character", "A complete input program"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Width and precision", title: "Width and precision", blocks: [
            TB(["Format", "Value", "Output (· is a space)"], [
              ["<code>%5d</code>", "42", "<code>···42</code> (width 5, aligned right)"],
              ["<code>%-5d</code>", "42", "<code>42···</code> (aligned left)"],
              ["<code>%05d</code>", "42", "<code>00042</code>"],
              ["<code>%8.2f</code>", "3.14159", "<code>····3.14</code>"],
              ["<code>%.0f</code>", "3.6", "<code>4</code> (rounded)"],
            ]),
            T("<code>%%</code> displays the % sign."),
          ] },
          { kind: "code", part: "Width and precision", title: "Example: a table with aligned columns", blocks: [
            RUN(`#include <stdio.h>
int main(void) {
    printf("%-8s%6s\\n", "Motor", "RPM");
    printf("%-8s%6d\\n", "Fan", 1450);
    printf("%-8s%6d\\n", "Pump", 980);
    printf("Load: %.1f%%\\n", 72.456);
    return 0;
}`),
            T("<code>%-8s</code>: the name, aligned left in 8 characters. <code>%6d</code>: the number, aligned right in 6. <code>%.1f%%</code>: <code>72.5%</code>."),
          ] },
          { kind: "concept", part: "Reading a value with scanf", title: "scanf reads a value", blocks: [
            CODE('int age;\nprintf("Enter age: ");\nscanf("%d", &age);', null, "syntax"),
            L([
              "scanf waits until the user types a value and presses Enter.",
              "The specifier gives the type: <code>%d</code> for an int.",
              "<code>&amp;age</code> is the <b>address</b> of age: the location of age in memory. scanf stores the value there.",
              "Forgetting &amp; is a common error. A real compiler only warns, and the program crashes without an error message. This site stops with an error message.",
              "Display a prompt with printf first, so that the user knows what to type.",
            ]),
          ] },
          { kind: "code", part: "Reading a value with scanf", title: "First example: execution step by step", blocks: [TRACE(T_scan)] },
          { kind: "concept", part: "Reading several values", title: "scanf and printf specifiers", blocks: [
            TB(["Type", "scanf", "printf"], [
              ["int", "<code>%d</code>", "<code>%d</code>"],
              ["double", "<code>%lf</code>", "<code>%f</code>"],
              ["float", "<code>%f</code>", "<code>%f</code>"],
              ["char", "<code>%c</code>", "<code>%c</code>"],
              ["string", "<code>%s</code> (Lesson 9)", "<code>%s</code>"],
            ]),
            T("For a double, scanf needs <code>%lf</code> (long float); printf uses <code>%f</code>."),
          ] },
          { kind: "concept", part: "Reading several values", title: "Several values in one scanf", blocks: [
            CODE('scanf("%d %lf", &count, &price);'),
            L([
              "The specifiers and the addresses are in the same order.",
              "The user separates the values with spaces or with Enter.",
              "A letter typed for %d stops scanf, and the variable keeps its old value.",
            ]),
          ] },
          { kind: "code", part: "Reading several values", title: "Example: two values in one line", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    double v, i;
    printf("Voltage and current: ");
    scanf("%lf %lf", &v, &i);
    printf("P = %.2f W\\n", v * i);
    return 0;
}`, "the user types 12 1.5", [
              { c: 'scanf("%lf %lf", &v, &i);', e: "two doubles: v = 12, i = 1.5" },
              { c: "v * i", e: "<code>P = 18.00 W</code>" },
            ], ["12 1.5"]),
          ] },
          { kind: "concept", part: "Reading a character", title: "Reading a char", blocks: [
            L([
              "%d and %lf skip spaces and line breaks before a value. %c does not: it reads the next character, even a space or the Enter.",
              "<code>scanf(\" %c\", &amp;c)</code>: the space before %c skips the Enter left by an earlier scanf. Without it, %c reads that line break.",
            ]),
          ] },
          { kind: "code", part: "Reading a character", title: "Example: a number and a character", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int qty;
    char unit;
    scanf("%d", &qty);
    scanf(" %c", &unit);
    printf("%d %c\\n", qty, unit);
    return 0;
}`, "the user types 5, then m", [
              { c: '" %c"', e: "skips the line break after 5, then reads <code>m</code>" },
              { c: "printf", e: "<code>5 m</code>" },
            ], ["5", "m"]),
          ] },
          { kind: "problem", part: "A complete input program", title: "Problem: battery runtime", blocks: [
            T("A battery has a capacity in mAh. A device draws a current in mA. Compute the runtime in hours and in minutes, in two aligned lines."),
            IPO([
              ["Input", "capacity 2000 mAh and current 300 mA, typed by the user"],
              ["Output", "Hours: 6.67 and Minutes: 400, with the numbers aligned right"],
              ["Processing", "hours = capacity / current; minutes = hours × 60"],
            ]),
          ] },
          { kind: "code", part: "A complete input program", title: "The program", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    double cap, cur;
    printf("Capacity, current: ");
    scanf("%lf %lf", &cap, &cur);
    double h = cap / cur;
    printf("Hours:%9.2f\\n", h);
    printf("Minutes:%7.0f\\n", h * 60);
    return 0;
}`, "input, processing, formatted output", [
              { c: "cap / cur", e: "2000 / 300 = 6.666…" },
              { c: "%9.2f", e: "<code>6.67</code>, aligned right in 9 characters" },
              { c: "%7.0f", e: "<code>400</code> in 7 characters: both lines end in the same column" },
            ], ["2000 300"]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "printf: width %5d, left-aligned %-5d, precision %.2f, and %% for the % sign.",
              "<code>scanf(\"%d\", &amp;x)</code>: the specifier gives the type; &amp; gives the address.",
              "double: %lf in scanf, %f in printf.",
              "\" %c\" skips the line break before a character.",
            ]),
            NEXT("<b>Operators and expressions</b>. Arithmetic, integer division, casting, and conditions."),
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            T("The user types <code>7 2.46</code>. Write the output on paper. Then run the program and compare."),
            RUN('#include <stdio.h>\nint main(void) {\n    int a;\n    double b;\n    scanf("%d %lf", &a, &b);\n    printf("[%4d][%-6.1f]\\n", a, b);\n    return 0;\n}', "Program", ["7 2.46"]),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The program should read a price and display it with 2 decimals. Correct the two errors in the scanf line.",
              "Price: 4.5\n4.50", '#include <stdio.h>\nint main(void) {\n    double price;\n    printf("Price: ");\n    scanf("%d", price);\n    printf("%.2f\\n", price);\n    return 0;\n}', ["4.5"], "A double needs %lf, and scanf needs the address &price."),
          ] },
          { kind: "exercise", title: "Write a program: temperature", blocks: [
            PQ("Read a temperature in °C (a double). Display it in °F with 1 decimal place: F = C × 1.8 + 32.",
              "Temperature (C): 25\n77.0 F", '#include <stdio.h>\nint main(void) {\n    double c;\n    printf("Temperature (C): ");\n    // read c and display the result\n    return 0;\n}', ["25"], 'scanf("%lf", &c); then printf("%.1f F\\n", c * 1.8 + 32);'),
          ] },
          { kind: "exercise", title: "Write a program: a total", blocks: [
            PQ("Read a quantity (int) and a unit price (double). Display the total with 2 decimals, aligned right in 10 characters.",
              "Qty, price: 3 2.5\nTotal:      7.50", '#include <stdio.h>\nint main(void) {\n    int qty;\n    double price;\n    printf("Qty, price: ");\n    // read and display\n    return 0;\n}', ["3 2.5"], 'printf("Total:%10.2f\\n", qty * price);'),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which scanf reads a double into x?", choices: ['`scanf("%d", &x);`', '`scanf("%lf", &x);`', '`scanf("%lf", x);`', '`scanf("%f", x);`'], answer: 1, explain: "A double needs %lf, and scanf needs the address &x." },
            { q: "What does `printf(\"[%04d]\", 25);` display?", choices: ["[25]", "[0025]", "[2500]", "[25.00]"], answer: 1, explain: "Width 4, filled with zeros on the left." },
          ])] },
        ],
      },

      /* =============================== 4. OPERATORS =============================== */
      {
        id: "operators",
        title: "Operators and expressions",
        sub: "Arithmetic, integer division, casting, increment, conditions, and precedence.",
        slides: "09:16–20",
        keywords: "operator arithmetic integer division modulo remainder cast assignment increment decrement comparison logical and or not precedence",
        deck: [
          { kind: "overview", title: "Operators and expressions", blocks: [
            T("An <b>expression</b> combines values, variables, and operators, and produces one value. C's operators follow mathematics, with some rules of their own for integers."),
            L(["Arithmetic operators", "Integer division and casting", "Assignment and increment", "Comparison and logical operators", "Precedence"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Arithmetic operators", title: "Arithmetic operators", blocks: [
            TB(["Operator", "Meaning", "Example (a = 17, b = 5)", "Result"], [
              ["<code>+</code>", "addition", "<code>a + b</code>", "22"],
              ["<code>-</code>", "subtraction", "<code>a - b</code>", "12"],
              ["<code>*</code>", "multiplication", "<code>a * b</code>", "85"],
              ["<code>/</code>", "division", "<code>a / b</code>", "3"],
              ["<code>%</code>", "remainder (int only)", "<code>a % b</code>", "2"],
            ], "a and b are int", "center"),
          ] },
          { kind: "concept", part: "Integer division and casting", title: "int / int gives an int", blocks: [
            L([
              "When both operands are int, / gives an int: the decimal part is cut off. <code>7 / 2</code> is 3.",
              "When at least one operand is a double, the result is a double: <code>7.0 / 2</code> is 3.5.",
              "Storing the result in a double does not help: in <code>double d = 7 / 2;</code> the division is already done, so d is 3.0.",
            ]),
          ] },
          { kind: "concept", part: "Integer division and casting", title: "Casting", blocks: [
            CODE("(double) sum / count\n(int) 9.99", null, "syntax: (type) value"),
            L([
              "A <b>cast</b> converts a value to another type.",
              "<code>(double) sum</code> makes a double before the division.",
              "<code>(int) 9.99</code> is 9: the decimal part is cut off, not rounded.",
              "Assigning a double to an int also cuts off the decimal part.",
            ]),
          ] },
          { kind: "code", part: "Integer division and casting", title: "First example: execution step by step", blocks: [TRACE(T_div)] },
          { kind: "code", part: "Integer division and casting", title: "Example: / and % split a quantity", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int minutes = 135;
    int h = minutes / 60;
    int m = minutes % 60;
    printf("%d h %d min\\n", h, m);
    return 0;
}`, "whole hours and the remainder", [
              { c: "minutes / 60", e: "135 / 60 = 2 whole hours" },
              { c: "minutes % 60", e: "the remainder: 15" },
              { c: "printf", e: "<code>2 h 15 min</code>" },
            ]),
          ] },
          { kind: "concept", part: "Assignment and increment", title: "Assignment operators", blocks: [
            TB(["Statement", "Same as", "n after it (n was 5)"], [
              ["<code>n += 3;</code>", "<code>n = n + 3;</code>", "8"],
              ["<code>n -= 2;</code>", "<code>n = n - 2;</code>", "3"],
              ["<code>n *= 4;</code>", "<code>n = n * 4;</code>", "20"],
              ["<code>n /= 2;</code>", "<code>n = n / 2;</code>", "2"],
              ["<code>n %= 3;</code>", "<code>n = n % 3;</code>", "2"],
            ], null, "center"),
          ] },
          { kind: "concept", part: "Assignment and increment", title: "Increment and decrement", blocks: [
            L([
              "<code>n++;</code> adds 1 to n; <code>n--;</code> subtracts 1.",
              "As a statement on its own, <code>++n;</code> is the same as <code>n++;</code>.",
              "Inside an expression they differ: <code>b = n++;</code> uses n, then adds 1; <code>b = ++n;</code> adds 1, then uses n.",
              "Write ++ and -- as statements on their own, so that the order is clear.",
            ]),
          ] },
          { kind: "code", part: "Assignment and increment", title: "Example: updating a variable", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int n = 5;
    n += 3;
    n++;
    int b = n++;
    printf("%d %d\\n", n, b);
    return 0;
}`, "each statement changes n", [
              { c: "n += 3; n++;", e: "5 → 8 → 9" },
              { c: "int b = n++;", e: "b receives 9, then n becomes 10" },
              { c: "printf", e: "<code>10 9</code>" },
            ]),
          ] },
          { kind: "concept", part: "Comparison and logical operators", title: "Comparison operators", blocks: [
            TB(["Operator", "Meaning", "Example"], [
              ["<code>==</code>", "equal to", "<code>7 == 5</code> is 0"],
              ["<code>!=</code>", "not equal to", "<code>7 != 5</code> is 1"],
              ["<code>&gt;</code>", "greater than", "<code>7 &gt; 5</code> is 1"],
              ["<code>&lt;</code>", "less than", "<code>7 &lt; 5</code> is 0"],
              ["<code>&gt;=</code>, <code>&lt;=</code>", "greater or equal, less or equal", "<code>5 &gt;= 5</code> is 1"],
            ]),
            T("In C, a true comparison gives the int 1, and a false one gives 0."),
          ] },
          { kind: "concept", part: "Comparison and logical operators", title: "Logical operators", blocks: [
            TB(["Operator", "Meaning", "The result is 1 (true) when"], [
              ["<code>&amp;&amp;</code>", "and", "both conditions are true"],
              ["<code>||</code>", "or", "at least one condition is true"],
              ["<code>!</code>", "not", "the condition is false"],
            ]),
            L([
              "<code>score &gt;= 50 &amp;&amp; score &lt;= 100</code> checks a range.",
              "<code>0 &lt; x &lt; 10</code> does not test a range in C: it compares <code>0 &lt; x</code> (1 or 0) with 10, so it is always 1. Write <code>x &gt; 0 &amp;&amp; x &lt; 10</code>.",
              "Any value other than 0 counts as true; 0 is false.",
            ]),
          ] },
          { kind: "code", part: "Comparison and logical operators", title: "Example: conditions give 1 or 0", blocks: [
            RUN(`#include <stdio.h>
int main(void) {
    int score = 80;
    printf("%d\\n", score >= 50 && score <= 100);
    printf("%d\\n", score < 0 || score > 100);
    printf("%d\\n", !(score == 0));
    return 0;
}`),
            T("Each condition is an expression; printf displays its value: <code>1</code>, <code>0</code>, <code>1</code>."),
          ] },
          { kind: "concept", part: "Precedence", title: "Order of evaluation", blocks: [
            TB(["Priority", "Operators"], [
              ["1 (first)", "<code>( )</code>, casts, <code>!</code>, <code>++</code>, <code>--</code>"],
              ["2", "<code>*</code> <code>/</code> <code>%</code>"],
              ["3", "<code>+</code> <code>-</code>"],
              ["4", "<code>&lt;</code> <code>&lt;=</code> <code>&gt;</code> <code>&gt;=</code>, then <code>==</code> <code>!=</code>"],
              ["5", "<code>&amp;&amp;</code>, then <code>||</code>"],
              ["6 (last)", "<code>=</code> <code>+=</code> <code>-=</code> …"],
            ]),
            T("Operators of equal priority are evaluated from left to right. Parentheses make the order explicit."),
          ] },
          { kind: "code", part: "Precedence", title: "Example: parentheses change the result", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int a = 10, b = 4, c = 2;
    printf("%d\\n", a - b * c);
    printf("%d\\n", (a - b) * c);
    printf("%d\\n", a / b * c);
    return 0;
}`, "* and / before + and -", [
              { c: "a - b * c", e: "10 - 8 = <code>2</code>" },
              { c: "(a - b) * c", e: "6 * 2 = <code>12</code>" },
              { c: "a / b * c", e: "left to right: 10 / 4 = 2, then 2 * 2 = <code>4</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "+, -, *, /, and % (the remainder, for int only).",
              "int / int cuts off the decimals; cast first: <code>(double) a / b</code>.",
              "n += 3 is n = n + 3; n++ adds 1.",
              "Comparisons and &amp;&amp;, ||, ! give 1 (true) or 0 (false).",
              "* / % before + -; use parentheses when in doubt.",
            ]),
            NEXT("<b>Decisions</b>. if, else, else if, and switch."),
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            PAPER,
            RUN(`#include <stdio.h>
int main(void) {
    int x = 17 % 5;
    int y = 7 / 2;
    double z = 7.0 / 2;
    printf("%d %d %.1f\\n", x, y, z);
    printf("%d\\n", x > y && y > 2);
    return 0;
}`),
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("The statements inside main. Complete the trace table on paper. The first row is done. The next exercise checks it."),
            W("traceTable", { trace: T_exOps, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Check your trace", cols: [
            [STEP_RUN],
            [RUN(MAIN("    " + T_exOps.code.join("\n    ")))],
          ] },
          { kind: "exercise", title: "Write a program: four operations", blocks: [
            PQ("Read two integers. Display their sum, difference, and product, and the quotient as a double with 2 decimals.",
              "a, b: 7 2\n9 5 14 3.50", '#include <stdio.h>\nint main(void) {\n    int a, b;\n    printf("a, b: ");\n    scanf("%d %d", &a, &b);\n    // display the four results\n    return 0;\n}', ["7 2"], "Cast before dividing: (double) a / b."),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The average of 7 and 8 should be <code>7.50</code>. Correct the expression.",
              "7.50", '#include <stdio.h>\nint main(void) {\n    int a = 7, b = 8;\n    double avg = (a + b) / 2;\n    printf("%.2f\\n", avg);\n    return 0;\n}', null, "(a + b) / 2 is int / int. Divide by 2.0, or cast first."),
          ] },
          { kind: "exercise", title: "Write a program: minutes and seconds", blocks: [
            PQ("Read a time in seconds and display it as minutes and seconds.",
              "Seconds: 200\n3 min 20 s", '#include <stdio.h>\nint main(void) {\n    int t;\n    printf("Seconds: ");\n    scanf("%d", &t);\n    // display minutes and seconds\n    return 0;\n}', ["200"], "Use t / 60 and t % 60."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "In C, `7 / 2` is…", choices: ["3.5", "3", "4", "3.0"], answer: 1, explain: "int / int gives an int; the decimal part is cut off." },
            { q: "After `int n = 5; n += 3; n++;`, n is…", choices: ["8", "9", "6", "10"], answer: 1, explain: "5 + 3 = 8, then ++ gives 9." },
          ])] },
        ],
      },

      /* =============================== 5. DECISIONS =============================== */
      {
        id: "control-flow",
        title: "Decisions: if and switch",
        sub: "if, else, else if, the braces rule, nested decisions, and switch.",
        slides: "09:21–24",
        keywords: "if else else if condition braces block nested switch case break default fall through",
        deck: [
          { kind: "overview", title: "Decisions: if and switch", blocks: [
            T("A decision runs a block of statements only when a condition is true. C has two decision statements: <b>if</b> for conditions, and <b>switch</b> for one value compared with fixed cases."),
            L(["if and else", "else if", "Blocks and braces", "Nested decisions", "switch"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "if and else", title: "if and if-else", blocks: [
            CODE("if (condition) {\n    statements when true\n} else {\n    statements when false\n}", null, "syntax"),
            L([
              "The condition is in parentheses. It is true when its value is not 0.",
              "The first block runs only when the condition is true. The else part is optional.",
              "No ; after the condition: <code>if (x &gt; 0);</code> ends the if with an empty statement.",
            ]),
          ] },
          { kind: "code", part: "if and else", title: "First example: execution step by step", blocks: [TRACE(T_if)] },
          { kind: "code", part: "if and else", title: "Example: if without else", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int level = 15;
    if (level < 20) {
        printf("Refill tank\\n");
    }
    printf("Level %d%%\\n", level);
    return 0;
}`, "the last printf always runs", [
              { c: "level < 20", e: "15 < 20 is true: <code>Refill tank</code>" },
              { c: 'printf("Level ...', e: "after the if: <code>Level 15%</code>" },
            ]),
          ] },
          { kind: "concept", part: "if and else", title: "= instead of ==", blocks: [
            CODE("if (level = 50)    // assigns 50: always true\nif (level == 50)   // compares level with 50"),
            TXT("warning: using the result of an assignment as a condition without parentheses", "the warning of clang for the first line"),
            L([
              "<code>=</code> in a condition assigns a value; the condition is then the assigned value.",
              "Any value other than 0 is true, so <code>if (level = 50)</code> is always true, and level is changed.",
              "A real compiler only warns, and the block always runs. This site stops with an error message instead, so the mistake is found at once.",
            ]),
          ] },
          { kind: "concept", part: "else if", title: "else if: several conditions", cols: [
            [CODE('if (score >= 80) {\n    printf("A\\n");\n} else if (score >= 70) {\n    printf("B\\n");\n} else {\n    printf("F\\n");\n}')],
            [L([
              "The conditions are checked from the top. The first true one runs; the rest are skipped.",
              "Order matters: check the largest limit first.",
              "The final else runs when no condition is true.",
            ])],
          ] },
          { kind: "code", part: "else if", title: "Example: execution step by step", blocks: [TRACE(T_elif)] },
          { kind: "code", part: "else if", title: "Example: invalid values first", blocks: [
            RUN(`#include <stdio.h>
int main(void) {
    int t;
    scanf("%d", &t);
    if (t < -40 || t > 125) { printf("Sensor error\\n"); }
    else if (t > 80) { printf("Overheat\\n"); }
    else { printf("Normal\\n"); }
    return 0;
}`, "Program", ["90"]),
            T("Invalid readings are handled first. The input 90 gives <code>Overheat</code>."),
          ] },
          { kind: "concept", part: "Blocks and braces", title: "Braces group the statements", blocks: [
            CODE('if (x > 0)\n    printf("positive\\n");\n    printf("done\\n");', null, "indentation does not group statements"),
            L([
              "Without braces, the if controls only the <b>next statement</b>.",
              "Line 3 always runs, although its indentation suggests otherwise.",
              "Write braces for every block, even for one statement. A short block may stay on the line of its condition: <code>if (x &gt; 0) { n++; }</code>",
            ]),
          ] },
          { kind: "code", part: "Blocks and braces", title: "Example: the pump starts by mistake", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int level = 50;
    if (level < 20)
        printf("Level low\\n");
        printf("Pump ON\\n");
    return 0;
}`, "the level is not low", [
              { c: "if (level < 20)", e: "50 < 20 is false: <code>Level low</code> is skipped" },
              { c: 'printf("Pump ON\\n");', e: "not part of the if: <code>Pump ON</code> is displayed" },
              { c: "correction", e: "put both statements in braces: <code>{ }</code>" },
            ]),
          ] },
          { kind: "concept", part: "Nested decisions", title: "An if inside an if", blocks: [
            CODE("if (outer condition) {\n    if (inner condition) { ... } else { ... }\n} else { ... }", null, "syntax"),
            L([
              "The inner if runs only when the outer condition is true.",
              "Each else belongs to the if of its own block.",
              "Deep nesting is hard to read: combine conditions with &amp;&amp; when possible.",
            ]),
          ] },
          { kind: "code", part: "Nested decisions", title: "Example: a decision inside a decision", blocks: [
            RUN(`#include <stdio.h>
int main(void) {
    int power_on = 1, temp = 72;
    if (power_on) {
        if (temp > 80) { printf("Overheat\\n"); }
        else { printf("Running\\n"); }
    } else { printf("Off\\n"); }
    return 0;
}`),
            T("The output is Running. Change power_on to 0, or temp to 90, and run the program again."),
          ] },
          { kind: "concept", part: "switch", title: "switch", blocks: [
            CODE('switch (day) {\n    case 1: printf("Mon\\n"); break;\n    case 2: printf("Tue\\n"); break;\n    default: printf("Other\\n");\n}', null, "syntax"),
            L([
              "switch compares one int or char value with constant cases.",
              "Execution starts at the matching case and continues until <code>break</code>.",
              "<code>default</code> runs when no case matches. It is optional.",
            ]),
          ] },
          { kind: "code", part: "switch", title: "Example: switch, step by step", blocks: [TRACE(T_switch)] },
          { kind: "code", part: "switch", title: "Example: a missing break", blocks: [
            RUN(`#include <stdio.h>
int main(void) {
    int mode = 1;
    switch (mode) {
        case 1: printf("Eco\\n");
        case 2: printf("Normal\\n"); break;
    }
    return 0;
}`, "case 1 has no break"),
            T("case 1 has no break: execution continues into case 2. Output: <code>Eco</code>, then <code>Normal</code>."),
          ] },
          { kind: "code", part: "switch", title: "Example: 'h' and 'H' share one block", blocks: [
            RUN(`#include <stdio.h>
int main(void) {
    char mode = 'H';
    switch (mode) {
        case 'h': case 'H': printf("Heat\\n"); break;
        default: printf("Off\\n");
    }
    return 0;
}`),
            T("case 'h' has no statement: execution continues into case 'H'. Both letters display <code>Heat</code>."),
          ] },
          { kind: "concept", part: "switch", title: "if or switch", blocks: [
            TB(["Situation", "Use"], [
              ["ranges, for example <code>score &gt;= 80</code>", "if / else if"],
              ["one int or char compared with fixed values", "switch"],
              ["conditions combined with &amp;&amp; or ||", "if"],
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>if (condition) { } else { }</code>: the condition is true when it is not 0.",
              "else if chains: the first true condition runs; the rest are skipped.",
              "Without braces, if controls only the next statement. Always write braces.",
              "= assigns; == compares.",
              "switch jumps to the matching case; break leaves it; default handles the rest.",
            ]),
            NEXT("<b>Loops</b>. while, do-while, and for."),
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            PAPER,
            RUN(`#include <stdio.h>
int main(void) {
    int a = 4, b = 9;
    if (a > b) { printf("X\\n"); }
    else if (a * 2 > b) { printf("Y\\n"); }
    else { printf("Z\\n"); }
    return 0;
}`),
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("The statements inside main. Complete the trace table on paper. The first row is done. The next exercise checks it."),
            W("traceTable", { trace: T_exSw, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Check your trace", cols: [
            [STEP_RUN],
            [RUN(MAIN("    " + T_exSw.code.join("\n    ")))],
          ] },
          { kind: "exercise", title: "Write a program: grade", blocks: [
            PQ("Read a score. Display A (80 or more), B (70), C (60), D (50), or F. For a score outside 0–100, display <code>Invalid score</code>.",
              "Score: 73\nB", '#include <stdio.h>\nint main(void) {\n    int score;\n    printf("Score: ");\n    scanf("%d", &score);\n    // display the grade\n    return 0;\n}', ["73"], "Check the invalid range first: if (score < 0 || score > 100)."),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The program should display OK only when level is 50, and then the level. Correct the error.",
              "Level 30", '#include <stdio.h>\nint main(void) {\n    int level = 30;\n    if (level = 50) {\n        printf("OK\\n");\n    }\n    printf("Level %d\\n", level);\n    return 0;\n}', null, "= assigns; == compares."),
          ] },
          { kind: "exercise", title: "Write a program: switch", blocks: [
            PQ("Read a command character: f displays Forward, b Backward, s Stop; any other character displays Unknown. Use switch.",
              "Command: b\nBackward", '#include <stdio.h>\nint main(void) {\n    char cmd;\n    printf("Command: ");\n    scanf(" %c", &cmd);\n    // use switch here\n    return 0;\n}', ["b"], "case 'b': printf(\"Backward\\n\"); break;"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Without braces, `if (x > 0)` controls…", choices: ["all the indented lines", "only the next statement", "nothing", "the rest of main"], answer: 1, explain: "Only braces group statements." },
            { q: "In a switch, `break`…", choices: ["ends the program", "leaves the switch", "skips one case", "is required after default"], answer: 1, explain: "Without break, execution continues into the next case." },
          ])] },
        ],
      },

      /* =============================== 6. LOOPS =============================== */
      {
        id: "loops",
        title: "Loops: while, do-while, and for",
        sub: "The three loops, break and continue, nested loops, and common loop errors.",
        slides: "09:25–27",
        keywords: "loop while do while for counter condition update break continue nested infinite off by one",
        deck: [
          { kind: "overview", title: "Loops", blocks: [
            T("A <b>loop</b> repeats a block of statements while a condition is true. C has three loops: <b>while</b>, <b>do-while</b>, and <b>for</b>."),
            L(["while", "do-while", "for", "Choosing a loop", "break and continue", "Nested loops", "Common loop errors"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "while", title: "The while loop", blocks: [
            CODE("while (condition) {\n    statements\n}", null, "syntax"),
            L([
              "The condition is checked <b>before</b> each repetition.",
              "When the condition is false at the start, the block never runs.",
              "The block must change a variable of the condition; otherwise the loop never ends.",
            ]),
          ] },
          { kind: "code", part: "while", title: "First example: execution step by step", blocks: [TRACE(T_while)] },
          { kind: "code", part: "while", title: "Example: an unknown number of repetitions", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int level = 100, hours = 0;
    while (level > 20) {
        level -= 15;
        hours++;
    }
    printf("%d h, %d%%\\n", hours, level);
    return 0;
}`, "a battery loses 15% per hour", [
              { c: "while (level > 20)", e: "stops when the level is 20% or less" },
              { c: "printf", e: "100 → 85 → … → 10: <code>6 h, 10%</code>" },
            ]),
          ] },
          { kind: "concept", part: "do-while", title: "The do-while loop", blocks: [
            CODE("do {\n    statements\n} while (condition);", null, "syntax: note the ; at the end"),
            L([
              "The block runs first; the condition is checked <b>after</b> it.",
              "The block always runs at least once.",
              "Typical use: repeat an input until the value is valid.",
            ]),
          ] },
          { kind: "code", part: "do-while", title: "Example: repeat until the input is valid", blocks: [TRACE(T_do)] },
          { kind: "concept", part: "for", title: "The for loop", blocks: [
            CODE("for (start; condition; update) {\n    statements\n}", null, "syntax"),
            TB(["Part", "Runs", "Example"], [
              ["start", "once, before the loop", "<code>int i = 0</code>"],
              ["condition", "before each repetition", "<code>i &lt; 5</code>"],
              ["update", "after each repetition", "<code>i++</code>"],
            ]),
          ] },
          { kind: "code", part: "for", title: "Example: execution step by step", blocks: [TRACE(T_for)] },
          { kind: "code", part: "for", title: "Example: a table of values", blocks: [
            T("Ohm's law for a 4 Ω resistor: the current for each voltage from 0 V to 12 V, in steps of 4 V."),
            RUN(`#include <stdio.h>
int main(void) {
    for (int v = 0; v <= 12; v += 4) {
        printf("%2d V -> %.1f A\\n", v, v / 4.0);
    }
    return 0;
}`),
          ] },
          { kind: "concept", part: "Choosing a loop", title: "Choosing a loop", blocks: [
            TB(["Loop", "Use it when"], [
              ["for", "the number of repetitions is known: counting"],
              ["while", "the loop continues until a condition changes; the count is unknown"],
              ["do-while", "the block must run at least once: input checking"],
            ]),
          ] },
          { kind: "concept", part: "break and continue", title: "break and continue", blocks: [
            L([
              "<code>break</code> ends the loop at once; execution continues after the loop.",
              "<code>continue</code> skips the rest of the block and starts the next repetition. In a for loop, continue jumps to the update (<code>i++</code>), then to the condition.",
              "<code>while (1)</code> repeats until a break: the exit is inside the block.",
            ]),
          ] },
          { kind: "code", part: "break and continue", title: "Example: continue and break", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) { continue; }
        if (i > 7) { break; }
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`, "odd numbers up to 7", [
              { c: "continue;", e: "even numbers are skipped" },
              { c: "break;", e: "at i = 9 the loop ends" },
              { c: "output", e: "<code>1 3 5 7</code>" },
            ]),
          ] },
          { kind: "concept", part: "Nested loops", title: "A loop inside a loop", blocks: [
            L([
              "The inner loop runs completely for each repetition of the outer loop.",
              "An outer loop of 3 repetitions and an inner loop of 4 run the inner block 12 times.",
              "Typical use: rows and columns (tables, patterns, two-dimensional arrays).",
            ]),
          ] },
          { kind: "code", part: "Nested loops", title: "Example: a triangle of stars", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    for (int r = 1; r <= 3; r++) {
        for (int c = 1; c <= r; c++) {
            printf("*");
        }
        printf("\\n");
    }
    return 0;
}`, "row r has r stars", [
              { c: "c <= r", e: "the inner loop depends on the row" },
              { c: 'printf("\\n");', e: "ends each row: <code>*</code>, <code>**</code>, <code>***</code>" },
            ]),
          ] },
          { kind: "concept", part: "Common loop errors", title: "Common loop errors", blocks: [
            TB(["Error", "Example", "Effect"], [
              ["; after the loop header", "<code>for (i = 0; i &lt; 5; i++);</code>", "the loop repeats an empty statement; the block runs once"],
              ["off by one", "<code>i &lt;= 5</code> instead of <code>i &lt; 5</code>", "one repetition too many"],
              ["no update", "<code>while (i &lt; 5)</code> without <code>i++</code>", "an infinite loop"],
            ]),
            T("On this site, a program that runs longer than 4 seconds is stopped."),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "while checks first; do-while checks after the block and runs at least once.",
              "for (start; condition; update) for counting.",
              "break leaves the loop; continue starts the next repetition.",
              "A nested loop runs completely for each outer repetition.",
              "Check the condition and the update: off-by-one and infinite loops.",
            ]),
            NEXT("<b>Functions</b>. Defining functions, parameters, return values, and prototypes."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [PAPER],
            [RUN(`#include <stdio.h>
int main(void) {
    int k = 10;
    while (k > 1) {
        k = k / 2;
        printf("%d ", k);
    }
    printf("\\n");
    return 0;
}`)],
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("The statements inside main. Complete the trace table on paper. The first row is done. The next exercise checks it."),
            W("traceTable", { trace: T_exWhile, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Check your trace", cols: [
            [STEP_RUN],
            [RUN(MAIN("    " + T_exWhile.code.join("\n    ")))],
          ] },
          { kind: "exercise", title: "Write a program: 1 to N", blocks: [
            PQ("Read N. Display the numbers 1 to N on one line, and then their sum.",
              "N: 5\n1 2 3 4 5\nSum = 15", '#include <stdio.h>\nint main(void) {\n    int n, sum = 0;\n    printf("N: ");\n    scanf("%d", &n);\n    // use a for loop\n    return 0;\n}', ["5"], "printf(\"%d \", i) inside the loop; after the loop, printf(\"\\n\")."),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The program should display 1 to 5, but it displays one number too many. Correct it.",
              "1 2 3 4 5", '#include <stdio.h>\nint main(void) {\n    for (int i = 1; i <= 6; i++) {\n        printf("%d ", i);\n    }\n    printf("\\n");\n    return 0;\n}', null, "The condition decides the last number."),
          ] },
          { kind: "exercise", title: "Write a program: valid input", blocks: [
            PQ("Ask for a percentage until the user types a value from 0 to 100. Then display it.",
              "Percent: 120\nPercent: 45\nValue: 45", '#include <stdio.h>\nint main(void) {\n    int p;\n    // use a do-while loop\n    return 0;\n}', ["120", "45"], "do { printf(\"Percent: \"); scanf(...); } while (p < 0 || p > 100);"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which loop always runs its block at least once?", choices: ["while", "for", "do-while", "none"], answer: 2, explain: "do-while checks its condition after the block." },
            { q: "`for (int i = 0; i < 4; i++)` runs its block…", choices: ["3 times", "4 times", "5 times", "forever"], answer: 1, explain: "i is 0, 1, 2, 3." },
          ])] },
        ],
      },

      /* =============================== 7. FUNCTIONS =============================== */
      {
        id: "functions",
        title: "Functions",
        sub: "Defining and calling functions, parameters and return values, void, prototypes, pass by value, and scope.",
        slides: "09:28–31",
        keywords: "function define call parameter argument return void prototype declaration pass by value local global scope",
        deck: [
          { kind: "overview", title: "Functions", blocks: [
            T("A <b>function</b> is a named block of statements that performs one task. A program is divided into functions, so that each part can be written, tested, and reused on its own."),
            L(["Defining and calling", "Parameters and return values", "void functions", "Prototypes", "Pass by value", "Local and global variables", "Designing a function"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Defining and calling", title: "Defining a function", blocks: [
            CODE("return_type name(parameters) {\n    statements\n    return value;\n}", null, "syntax"),
            L([
              "The return type is the type of the result, for example int or double.",
              "Each parameter has a type and a name; parameters are separated by commas.",
              "<code>return</code> ends the function and sends the value back to the caller.",
              "A call is the name with arguments in parentheses: <code>square(4)</code>.",
            ]),
          ] },
          { kind: "code", part: "Defining and calling", title: "First example: execution step by step", blocks: [TRACE(T_func)] },
          { kind: "concept", part: "Parameters and return values", title: "Parameters and arguments", blocks: [
            L([
              "A <b>parameter</b> is a variable of the function: <code>n</code> in <code>square(int n)</code>.",
              "An <b>argument</b> is the value in the call: <code>4</code> in <code>square(4)</code>.",
              "Arguments are matched to parameters by position; their number and types must agree.",
              "A function returns at most one value.",
            ]),
          ] },
          { kind: "code", part: "Parameters and return values", title: "Example: one definition, two calls", blocks: [
            EX(`#include <stdio.h>
double power(double v, double i) {
    return v * i;
}
int main(void) {
    printf("%.1f\\n", power(12, 1.5));
    printf("%.1f\\n", power(230, 0.5));
    return 0;
}`, "P = V × I, in W", [
              { c: "power(12, 1.5)", e: "v = 12, i = 1.5: <code>18.0</code>" },
              { c: "power(230, 0.5)", e: "v = 230, i = 0.5: <code>115.0</code>" },
            ]),
          ] },
          { kind: "concept", part: "void functions", title: "void: no result, no parameters", blocks: [
            CODE('void show_line(void) {\n    printf("----------\\n");\n}'),
            L([
              "<code>void</code> as the return type: the function returns no value; <code>return;</code> is optional.",
              "<code>void</code> in the parentheses: the function takes no arguments.",
              "A call to a void function is a statement on its own: <code>show_line();</code>",
            ]),
          ] },
          { kind: "code", part: "void functions", title: "Example: a void function with parameters", blocks: [
            T("report displays one line for each sensor; it returns nothing."),
            RUN(`#include <stdio.h>
void report(int id, double temp) {
    printf("Sensor %d: %.1f C\\n", id, temp);
}
int main(void) {
    report(1, 21.5);
    report(2, 23.0);
    return 0;
}`),
          ] },
          { kind: "concept", part: "Prototypes", title: "Prototypes: declare before use", blocks: [
            CODE("int add(int a, int b);", null, "a prototype: the first line of the definition, with ;"),
            L([
              "The compiler reads the file from top to bottom. A function must be known before it is called.",
              "A function defined below main is declared above main with a prototype.",
              "Header files such as stdio.h contain the prototypes of library functions.",
            ]),
          ] },
          { kind: "code", part: "Prototypes", title: "Example: a function below main", blocks: [
            EX(`#include <stdio.h>
int add(int a, int b);
int main(void) {
    printf("%d\\n", add(2, 3));
    return 0;
}
int add(int a, int b) {
    return a + b;
}`, "the prototype on line 2", [
              { c: "int add(int a, int b);", e: "tells the compiler the types of add" },
              { c: "add(2, 3)", e: "<code>5</code>" },
            ]),
          ] },
          { kind: "concept", part: "Pass by value", title: "Arguments are copied", blocks: [
            L([
              "C passes each argument <b>by value</b>: the parameter is a new variable that receives a copy.",
              "Changing the parameter inside the function does not change the caller's variable.",
              "To let a function change a variable of the caller, pass its address (Lesson 11).",
            ]),
          ] },
          { kind: "code", part: "Pass by value", title: "Example: execution step by step", blocks: [TRACE(T_byval)] },
          { kind: "concept", part: "Local and global variables", title: "Scope: where a variable exists", blocks: [
            L([
              "A <b>local</b> variable is declared inside a function or a block. It exists only there, while the function runs.",
              "Two functions may use the same local name; they are two different variables.",
              "A <b>global</b> variable is declared outside all functions. Every function can read and change it.",
              "Prefer parameters and local variables: global variables make a program hard to follow.",
            ]),
          ] },
          { kind: "code", part: "Local and global variables", title: "Example: a global counter", blocks: [
            EX(`#include <stdio.h>
int count = 0;
void tick(void) { count++; }
int main(void) {
    tick();
    tick();
    printf("%d\\n", count);
    return 0;
}`, "count is shared by all functions", [
              { c: "int count = 0;", e: "global: outside all functions" },
              { c: "tick(); tick();", e: "each call adds 1: <code>2</code>" },
            ]),
          ] },
          { kind: "concept", part: "Designing a function", title: "Designing a function", blocks: [
            L([
              "Name the task, for example: test whether a number is even.",
              "Choose the parameters (the inputs) and their types.",
              "Choose the return type (the output), or void.",
              "Write the body, and test the function with values whose result is known.",
            ], null, true),
          ] },
          { kind: "code", part: "Designing a function", title: "Example: is_even", blocks: [
            EX(`#include <stdio.h>
int is_even(int n) {
    return n % 2 == 0;
}
int main(void) {
    printf("%d\\n", is_even(8));
    printf("%d\\n", is_even(7));
    return 0;
}`, "1 means true, 0 means false", [
              { c: "n % 2 == 0", e: "1 when the remainder is 0" },
              { c: "printf", e: "<code>1</code>, then <code>0</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>type name(parameters) { ... return value; }</code>; a call passes the arguments.",
              "void: no return value, or no parameters.",
              "A prototype declares a function that is defined below main.",
              "Arguments are copied: a function cannot change the caller's variables through its parameters.",
              "Local variables exist only in their function; globals are visible everywhere.",
            ]),
            NEXT("<b>Arrays</b>. Many values of one type under one name."),
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            PAPER,
            RUN(`#include <stdio.h>
int f(int x) {
    return 2 * x + 1;
}
int main(void) {
    int a = f(3);
    printf("%d %d\\n", a, f(a));
    return 0;
}`),
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("Complete the trace table on paper. The first row is done. The next exercise checks it."),
            W("traceTable", { trace: T_exFunc, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Check your trace", cols: [
            [STEP_RUN],
            [RUN("#include <stdio.h>\n" + T_exFunc.code.join("\n"))],
          ] },
          { kind: "exercise", title: "Complete missing code", blocks: [
            PQ("Complete the function c_to_f, which returns the temperature in °F: F = C × 9 / 5 + 32.",
              "77.0\n212.0", '#include <stdio.h>\ndouble c_to_f(double c) {\n    \n}\nint main(void) {\n    printf("%.1f\\n", c_to_f(25));\n    printf("%.1f\\n", c_to_f(100));\n    return 0;\n}', null, "return c * 9 / 5 + 32;"),
          ] },
          { kind: "exercise", title: "Write a program: maximum of two", blocks: [
            PQ("Write the function <code>int max2(int a, int b)</code>, which returns the larger value. Display max2(7, 12) and max2(-3, -8) on one line, separated by a space.",
              "12 -3", STARTER, null, "if (a > b) { return a; } return b;"),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The function is called before the compiler knows it. Add a prototype.",
              "25", '#include <stdio.h>\nint main(void) {\n    printf("%d\\n", area(5));\n    return 0;\n}\nint area(int side) {\n    return side * side;\n}', null, "int area(int side); above main."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "A function that returns no value has the return type…", choices: ["int", "void", "null", "none"], answer: 1, explain: "void means no value." },
            { q: "After `reset(level)`, where reset sets its parameter to 0, level is…", choices: ["0", "unchanged", "1", "unknown"], answer: 1, explain: "The parameter is a copy of the argument." },
          ])] },
        ],
      },

      /* =============================== 8. ARRAYS =============================== */
      {
        id: "arrays-strings",
        title: "Arrays",
        sub: "Indexes, loops over arrays, sum and maximum, arrays in functions, and 2D arrays.",
        slides: "09:32–34",
        keywords: "array index element size loop sum average maximum minimum function parameter two dimensional matrix bounds",
        deck: [
          { kind: "overview", title: "Arrays", blocks: [
            T("An <b>array</b> stores many values of the same type under one name. The values are numbered by an <b>index</b> that starts at 0."),
            L(["Declaring an array", "Index and elements", "Loops over an array", "Sum, average, and maximum", "Arrays and functions", "Two-dimensional arrays"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Declaring an array", title: "Declaring an array", blocks: [
            CODE("int nums[5] = {10, 20, 30, 40, 50};\ndouble v[3];         // values unknown (Lesson 2)\nint z[4] = {0};      // 0, 0, 0, 0\nint w[4] = {5};      // 5, 0, 0, 0\nint a[] = {5, 6, 7}; // size 3, from the list"),
            L([
              "The size is fixed when the array is created; the array cannot grow.",
              "All elements have the same type.",
              "Elements not listed in the braces are 0: <code>{5}</code> gives 5, 0, 0, 0.",
              "The elements are stored one after another in memory.",
            ]),
          ] },
          { kind: "concept", part: "Index and elements", title: "Index: from 0 to size − 1", blocks: [
            TB(["Element", "nums[0]", "nums[1]", "nums[2]", "nums[3]", "nums[4]"], [
              ["Value", "10", "20", "30", "40", "50"],
              ["Address", "1000", "1004", "1008", "1012", "1016"],
            ], "an int uses 4 bytes", "center"),
            L([
              "<code>nums[i]</code> reads or changes element i.",
              "The last index of an array of 5 elements is 4.",
              "C does not check the index: <code>nums[5]</code> reads or overwrites memory that belongs to something else.",
            ]),
          ] },
          { kind: "code", part: "Index and elements", title: "Example: reading and changing elements", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int nums[5] = {5, 10, 15, 20, 25};
    nums[2] = 99;
    int first = nums[0];
    printf("%d %d\\n", nums[2], first);
    return 0;
}`, "an index selects one element", [
              { c: "nums[2] = 99;", e: "index 2 is the third element: 15 becomes 99" },
              { c: "nums[0]", e: "index 0 is the first element: 5" },
              { c: "printf", e: "<code>99 5</code>" },
            ]),
          ] },
          { kind: "concept", part: "Loops over an array", title: "A loop over all elements", blocks: [
            CODE('for (int i = 0; i < 5; i++) {\n    printf("%d\\n", nums[i]);\n}'),
            L([
              "i runs from 0 to size − 1: the condition is <code>i &lt; size</code>, not <code>i &lt;= size</code>.",
              "C does not store the size of an array. Keep it in a constant: <code>#define N 5</code>.",
            ]),
          ] },
          { kind: "code", part: "Loops over an array", title: "Example: a loop over an array, step by step", blocks: [TRACE(T_arrLoop)] },
          { kind: "code", part: "Loops over an array", title: "Example: reading values into an array", blocks: [
            EX(`#include <stdio.h>
#define N 3
int main(void) {
    double v[N];
    for (int i = 0; i < N; i++) {
        scanf("%lf", &v[i]);
    }
    printf("%.1f\\n", v[N - 1]);
    return 0;
}`, "the user types 3.3, 5.0, 12.0", [
              { c: "&v[i]", e: "the address of element i: scanf stores the value there" },
              { c: "v[N - 1]", e: "the last element, index 2: <code>12.0</code>" },
            ], ["3.3", "5.0", "12.0"]),
          ] },
          { kind: "problem", part: "Sum, average, and maximum", title: "Problem: statistics of readings", blocks: [
            T("Readings are stored in an array. Find the maximum and the sum; the average follows from the sum."),
            IPO([
              ["Input", "the array {4, 9, 2}"],
              ["Output", "max 9, sum 15 (average 5.00)"],
              ["Processing", "one loop over the elements"],
            ]),
          ] },
          { kind: "concept", part: "Sum, average, and maximum", title: "The algorithms", blocks: [
            L([
              "Sum: start with 0 and add each element.",
              "Average: sum / N, computed as a double: <code>(double) sum / N</code>.",
              "Maximum: start with the first element; replace it by any larger element.",
              "Index of the maximum: keep the index of the largest element, not its value; compare each element with the element at that index.",
            ], null, true),
          ] },
          { kind: "code", part: "Sum, average, and maximum", title: "Example: execution step by step", blocks: [TRACE(T_stats)] },
          { kind: "code", part: "Sum, average, and maximum", title: "Example: the index of the maximum", blocks: [
            RUN(`#include <stdio.h>
int main(void) {
    double t[5] = {21.5, 24.0, 26.5, 25.0, 22.0};
    int best = 0;
    for (int i = 1; i < 5; i++) {
        if (t[i] > t[best]) { best = i; }
    }
    printf("Max: t[%d] = %.1f\\n", best, t[best]);
    return 0;
}`, "best stores an index. Output: Max: t[2] = 26.5"),
          ] },
          { kind: "concept", part: "Arrays and functions", title: "Passing an array to a function", blocks: [
            CODE("double average(int v[], int n)", null, "the size is a separate parameter"),
            L([
              "An array parameter is written with empty brackets: <code>int v[]</code>.",
              "The function does not know the size: pass it as another argument.",
              "The array is <b>not copied</b>: the function receives the address of element 0 (details in Lesson 11), so it works on the caller's elements and can change them.",
              "An int argument, in contrast, is copied (Lesson 7).",
            ]),
          ] },
          { kind: "code", part: "Arrays and functions", title: "Example: scale changes the caller's array", blocks: [
            RUN(`#include <stdio.h>
void scale(double v[], int n, double k) {
    for (int i = 0; i < n; i++) { v[i] = v[i] * k; }
}
int main(void) {
    double r[3] = {1.0, 2.5, 4.0};
    scale(r, 3, 2.0);
    printf("%.1f %.1f %.1f\\n", r[0], r[1], r[2]);
    return 0;
}`, "scale changes r itself. Output: 2.0 5.0 8.0"),
          ] },
          { kind: "concept", part: "Two-dimensional arrays", title: "Two-dimensional arrays", blocks: [
            CODE("int m[2][3] = {{1, 2, 3},\n               {4, 5, 6}};", null, "2 rows, 3 columns"),
            L([
              "<code>m[r][c]</code> is the element in row r and column c; both indexes start at 0.",
              "<code>m[1][2]</code> is 6.",
              "A nested loop visits every element: rows in the outer loop, columns in the inner loop.",
            ]),
          ] },
          { kind: "code", part: "Two-dimensional arrays", title: "Example: the total of each row", blocks: [
            RUN(`#include <stdio.h>
int main(void) {
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    for (int r = 0; r < 2; r++) {
        int total = 0;
        for (int c = 0; c < 3; c++) { total += m[r][c]; }
        printf("Row %d: %d\\n", r, total);
    }
    return 0;
}`, "One total per row. Output: Row 0: 6, Row 1: 15"),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>type name[size]</code>; indexes 0 to size − 1; C does not check them.",
              "A for loop with <code>i &lt; size</code> visits every element.",
              "Sum from 0; maximum from the first element; average with a cast to double.",
              "An array parameter <code>int v[]</code> plus its size; the function works on the caller's array.",
              "<code>m[r][c]</code>: row r, column c; nested loops.",
            ]),
            NEXT("<b>Strings</b>. Text as arrays of char."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [PAPER],
            [RUN(`#include <stdio.h>
int main(void) {
    int a[4] = {3, 8, 1, 6};
    a[1] = a[0] + a[3];
    for (int i = 3; i >= 0; i--) {
        printf("%d ", a[i]);
    }
    printf("\\n");
    return 0;
}`)],
          ] },
          { kind: "exercise", title: "Complete missing code", blocks: [
            PQ("Complete line 6, so that min holds the smallest element.",
              "Min = 2", '#include <stdio.h>\nint main(void) {\n    int d[5] = {4, 9, 2, 7, 5};\n    int min = d[0];\n    for (int i = 1; i < 5; i++) {\n        \n    }\n    printf("Min = %d\\n", min);\n    return 0;\n}', null, "if (d[i] < min) { min = d[i]; }"),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The loop reads beyond the end of the array. Correct it, so that the program displays the sum of the 4 elements.",
              "20", '#include <stdio.h>\nint main(void) {\n    int v[4] = {2, 4, 6, 8};\n    int sum = 0;\n    for (int i = 0; i <= 4; i++) {\n        sum += v[i];\n    }\n    printf("%d\\n", sum);\n    return 0;\n}', null, "The last index is 3."),
          ] },
          { kind: "exercise", title: "Write a program: maximum and average", blocks: [
            PQ("Read 5 integers into an array. Display the maximum and the average with 2 decimals.",
              "4\n9\n2\n7\n5\nMax = 9\nAverage = 5.40", '#include <stdio.h>\nint main(void) {\n    int nums[5];\n    // read, then find the maximum and the average\n    return 0;\n}', ["4", "9", "2", "7", "5"], "scanf(\"%d\", &nums[i]) in a loop; then one loop for sum and max."),
          ] },
          { kind: "exercise", title: "Write a program: count", blocks: [
            PQ("Count the readings above 25.0 in the array, and display the count.",
              "3", '#include <stdio.h>\nint main(void) {\n    double t[6] = {24.5, 26.0, 25.0, 27.5, 23.0, 30.1};\n    // count the readings above 25.0\n    return 0;\n}', null, "count++ when t[i] > 25.0."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`int a[5];` The last element is…", choices: ["a[5]", "a[4]", "a[6]", "a[0]"], answer: 1, explain: "The indexes are 0 to 4." },
            { q: "An array passed to a function is…", choices: ["copied", "not copied: the function uses the caller's elements", "converted to int", "read-only"], answer: 1, explain: "The function receives the address of the array." },
          ])] },
        ],
      },

      /* =============================== 9. STRINGS =============================== */
      {
        id: "strings",
        title: "Strings",
        sub: "Strings as char arrays, the null character, reading and printing strings, and the string functions.",
        slides: "09:35–36",
        keywords: "string char array null character terminator printf s scanf fgets strlen strcpy strcat strcmp ctype toupper",
        deck: [
          { kind: "overview", title: "Strings", blocks: [
            T("C has no separate string type. A <b>string</b> is an array of char that ends with the <b>null character</b> <code>'\\0'</code>."),
            L(["A string is a char array", "Printing and reading strings", "The characters of a string", "String functions", "Common string errors"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "A string is a char array", title: "A string is a char array", blocks: [
            CODE('char name[] = "Ann";'),
            TB(["Index", "0", "1", "2", "3"], [["Element", "'A'", "'n'", "'n'", "'\\0'"]], null, "center"),
            L([
              "The compiler adds <code>'\\0'</code> (the value 0) after the last character: \"Ann\" needs 4 chars.",
              "The array must be large enough for the text and '\\0': <code>char word[20];</code> holds up to 19 characters.",
            ]),
          ] },
          { kind: "code", part: "A string is a char array", title: "First example: execution step by step", blocks: [TRACE(T_str)] },
          { kind: "concept", part: "Printing and reading strings", title: "printf and scanf with strings", blocks: [
            L([
              "<code>printf(\"%s\", name)</code> displays the characters up to '\\0'.",
              "<code>scanf(\"%s\", name)</code> reads one word. There is no &amp;: the name of an array is already an address.",
              "%s stops at a space. For a whole line, use <code>fgets</code>.",
            ]),
          ] },
          { kind: "code", part: "Printing and reading strings", title: "Example: a greeting", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    char name[20];
    printf("Name: ");
    scanf("%s", name);
    printf("Hello, %s\\n", name);
    return 0;
}`, "the user types Anan", [
              { c: 'scanf("%s", name);', e: "no &amp; before an array" },
              { c: "printf", e: "<code>Hello, Anan</code>" },
            ], ["Anan"]),
          ] },
          { kind: "concept", part: "Printing and reading strings", title: "Reading a whole line: fgets", blocks: [
            CODE("fgets(line, 50, stdin);", null, "reads at most 49 characters, up to Enter"),
            L([
              "fgets reads a whole line, spaces included.",
              "It keeps the Enter character <code>'\\n'</code> at the end of the text (if it fits).",
              "<code>stdin</code> is the keyboard input.",
            ]),
          ] },
          { kind: "code", part: "Printing and reading strings", title: "Example: fgets keeps the line break", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    char line[50];
    printf("Location: ");
    fgets(line, 50, stdin);
    printf("[%s]\\n", line);
    return 0;
}`, "the user types Lab 3 roof", [
              { c: "fgets(...)", e: "the spaces are kept" },
              { c: '"[%s]"', e: "the <code>]</code> is on the next line: the \\n is part of the text" },
            ], ["Lab 3 roof"]),
          ] },
          { kind: "concept", part: "The characters of a string", title: "A loop over the characters", blocks: [
            CODE("for (int i = 0; s[i] != '\\0'; i++) {\n    // s[i] is one character\n}"),
            L([
              "The loop stops at the null character, so it works for any length.",
              "Each s[i] is a char: it can be compared, <code>s[i] == 'a'</code>, or changed.",
            ]),
          ] },
          { kind: "concept", part: "The characters of a string", title: "Functions for one character: ctype.h", blocks: [
            TB(["Function", "Result"], [
              ["<code>toupper(c)</code>", "the upper-case letter: <code>toupper('a')</code> is 'A'; other characters stay the same"],
              ["<code>tolower(c)</code>", "the lower-case letter: <code>tolower('B')</code> is 'b'"],
              ["<code>isdigit(c)</code>", "not 0 (true) if c is '0' to '9'; otherwise 0"],
              ["<code>isupper(c)</code>", "not 0 (true) if c is 'A' to 'Z'; otherwise 0"],
            ]),
            T("<code>#include &lt;ctype.h&gt;</code> is required. In an if, a result that is not 0 counts as true."),
          ] },
          { kind: "code", part: "The characters of a string", title: "Example: counting a character", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    char s[] = "temperature";
    int count = 0, i;
    for (i = 0; s[i] != '\\0'; i++) {
        if (s[i] == 'e') { count++; }
    }
    printf("%d\\n", count);
    return 0;
}`, "how many letters e", [
              { c: "s[i] != '\\0'", e: "stops at the end of the text" },
              { c: "printf", e: "t-<b>e</b>-m-p-<b>e</b>-r-a-t-u-r-<b>e</b>: <code>3</code>" },
            ]),
          ] },
          { kind: "concept", part: "String functions", title: "The functions of string.h", blocks: [
            TB(["Function", "Result"], [
              ["<code>strlen(s)</code>", "the number of characters, without '\\0'"],
              ["<code>strcpy(dest, src)</code>", "copies src into dest"],
              ["<code>strcat(dest, src)</code>", "appends src to the end of dest; dest must already hold a string that ends with '\\0'"],
              ["<code>strcmp(a, b)</code>", "0 if equal; less than 0 if a comes first; greater than 0 if b comes first. The order is that of the ASCII codes: 'B' (66) comes before 'a' (97)."],
            ]),
            T("<code>#include &lt;string.h&gt;</code> is required. dest must be large enough for the result."),
          ] },
          { kind: "concept", part: "String functions", title: "= and == do not work on strings", blocks: [
            L([
              "<code>s = \"text\";</code> is an error: an array cannot be assigned. Use <code>strcpy(s, \"text\");</code>",
              "<code>a == b</code> compares two addresses, not the texts. Use <code>strcmp(a, b) == 0</code>.",
            ]),
          ] },
          { kind: "code", part: "String functions", title: "Example: strcpy, strcat, and strlen", blocks: [
            RUN(`#include <stdio.h>
#include <string.h>
int main(void) {
    char msg[30];
    strcpy(msg, "Motor");
    strcat(msg, " ready");
    printf("%s (%d)\\n", msg, (int) strlen(msg));
    return 0;
}`, "(int) turns the size from strlen into an int, for %d"),
            T("strcpy stores \"Motor\"; strcat appends \" ready\"; strlen counts 11 characters, without '\\0'."),
          ] },
          { kind: "code", part: "String functions", title: "Example: checking a command", blocks: [
            EX(`#include <stdio.h>
#include <string.h>
int main(void) {
    char cmd[10];
    scanf("%s", cmd);
    if (strcmp(cmd, "stop") == 0) {
        printf("Stopping\\n");
    }
    return 0;
}`, "the user types stop", [
              { c: 'strcmp(cmd, "stop") == 0', e: "true when the texts are equal: <code>Stopping</code>" },
            ], ["stop"]),
          ] },
          { kind: "concept", part: "Common string errors", title: "Common string errors", blocks: [
            TB(["Error", "Effect"], [
              ["the array has no room for '\\0'", "the text runs into the following memory"],
              ["<code>scanf(\"%s\", &amp;name)</code>", "&amp; is not needed for an array"],
              ["comparing texts with ==", "compares addresses: almost always false"],
              ["forgetting <code>#include &lt;string.h&gt;</code>", "strlen, strcpy, … are unknown"],
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A string is a char array that ends with '\\0'; it needs one extra char.",
              "%s in printf and scanf; scanf reads one word, without &amp;; fgets reads a line with its \\n.",
              "A loop <code>s[i] != '\\0'</code> visits every character.",
              "strlen, strcpy, strcat, strcmp from string.h; never = or == on strings.",
            ]),
            NEXT("<b>Structures</b>. Several values of different types under one name."),
          ] },
          { kind: "exercise", title: "Determine the output", blocks: [
            PAPER,
            T("<code>(int)</code> turns the size from strlen into an int, for %d, as for sizeof (Lesson 2)."),
            RUN(`#include <stdio.h>
#include <string.h>
int main(void) {
    char w[10] = "valve";
    w[0] = 'h';
    printf("%s %d %c\\n", w, (int) strlen(w), w[4]);
    return 0;
}`),
          ] },
          { kind: "exercise", title: "Write a program: greeting", blocks: [
            PQ("Read a user name (one word) and greet the user.",
              "Name: Mali\nHello, Mali!", '#include <stdio.h>\nint main(void) {\n    char name[20];\n    printf("Name: ");\n    // read the name and greet\n    return 0;\n}', ["Mali"], 'scanf("%s", name); printf("Hello, %s!\\n", name);'),
          ] },
          { kind: "exercise", title: "Write a program: count the digits", blocks: [
            PQ("Count the digits in the text \"Room 12B, floor 3\" and display the count.",
              "3", '#include <stdio.h>\n#include <ctype.h>\nint main(void) {\n    char s[] = "Room 12B, floor 3";\n    // count the digits\n    return 0;\n}', null, "if (isdigit(s[i])) { count++; }"),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The comparison never succeeds, even when the user types open. Correct it.",
              "open\nDoor opening", '#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char cmd[10];\n    scanf("%s", cmd);\n    if (cmd == "open") {\n        printf("Door opening\\n");\n    }\n    return 0;\n}', ["open"], "Compare texts with strcmp(cmd, \"open\") == 0."),
          ] },
          { kind: "exercise", title: "Write a program: upper case", blocks: [
            PQ("Change every letter of the text \"pump on\" to upper case, and display it.",
              "PUMP ON", '#include <stdio.h>\n#include <ctype.h>\nint main(void) {\n    char s[] = "pump on";\n    // change the letters, then display s\n    return 0;\n}', null, "s[i] = toupper(s[i]); in a loop up to '\\0'."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "How many chars does `char s[] = \"Ann\";` use?", choices: ["3", "4", "5", "1"], answer: 1, explain: "3 letters and the null character '\\0'." },
            { q: "How are two strings compared in C?", choices: ["a == b", "strcmp(a, b) == 0", "strcpy(a, b)", "a = b"], answer: 1, explain: "== compares addresses; strcmp compares the characters." },
          ])] },
        ],
      },

      /* =============================== 10. STRUCTURES =============================== */
      {
        id: "structs",
        title: "Structures",
        sub: "Members, initialization, copying, typedef, arrays of structs, and structs with functions and pointers.",
        keywords: "struct structure member dot record initializer copy typedef array of structs function pointer arrow strcpy",
        deck: [
          { kind: "overview", title: "Structures", blocks: [
            T("A <b>struct</b> groups several values of different types under one name, for example the ID and the reading of a sensor, or the name and the score of a student. Each value is a <b>member</b>. One struct variable holds one record; an array of structs holds many records."),
            L(["Defining a struct", "Members and initialization", "Copying a struct", "typedef", "Arrays of structs", "Structs and functions", "struct errors"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Defining a struct", title: "Why a struct", cols: [
            [T("Without a struct: one array for each value. The data of one student is linked only by the index."),
              CODE("// 3 names, up to 19 chars each\nchar name[3][20];\nint score[3];\ndouble gpa[3];")],
            [T("With a struct: the values of one student stay together, and one array holds all the records."),
              CODE("struct student {\n    char name[20];\n    int score;\n    double gpa;\n};\nstruct student list[3];")],
          ] },
          { kind: "concept", part: "Defining a struct", title: "Defining a struct", cols: [
            [CODE("struct sensor {\n    int id;\n    double value;\n};", null, "a definition: a new type")],
            [L([
              "<code>struct sensor</code> is the name of a new type. id and value are its <b>members</b>; each member has its own type.",
              "The definition ends with <code>};</code> and creates no variable.",
              "Write the definition above main, so that main and the other functions can use the type.",
            ])],
          ] },
          { kind: "concept", part: "Members and initialization", title: "Variables and members", cols: [
            [CODE("struct sensor s1;\ns1.id = 1;\ns1.value = 25.5;\n\nstruct sensor s2 = {2, 27.0};\ns2.value = s2.value + 1.0;")],
            [L([
              "<code>struct sensor s1;</code> declares a variable of the new type. It has its own id and value.",
              "The dot reaches a member: <code>s1.value</code> is a double and is used like any double variable.",
              "An initializer <code>{…}</code> gives the members their values in the order of the definition.",
              "Members that the initializer does not list become 0.",
            ])],
          ] },
          { kind: "code", part: "Members and initialization", title: "First example: execution step by step", blocks: [TRACE(T_struct)] },
          { kind: "concept", part: "Members and initialization", title: "Text members and scanf", cols: [
            [CODE('struct student {\n    char name[20];\n    int score;\n};\nstruct student a = {"Anan", 72};\nstrcpy(a.name, "Bua");\nscanf("%d", &a.score);')],
            [L([
              "A char array member stores text. It receives text in the initializer, or with strcpy.",
              "<code>a.name = \"Bua\";</code> is an error, as for every char array (Lesson 9).",
              "scanf needs the address of a number member: <code>&amp;a.score</code>. A char array member needs no &amp;: <code>scanf(\"%s\", a.name)</code>.",
            ])],
          ] },
          { kind: "code", part: "Members and initialization", title: "Example: reading a record", blocks: [
            RUN(`#include <stdio.h>
struct student { char name[20]; int score; };
int main(void) {
    struct student s;
    scanf("%s %d", s.name, &s.score);
    printf("%s: %d\\n", s.name, s.score);
    return 0;
}`, null, ["Mali 87"]),
          ] },
          { kind: "concept", part: "Copying a struct", title: "= copies every member", cols: [
            [CODE("struct sensor a = {1, 25.5};\nstruct sensor b = a;   // a copy\nb.value = 99.0;       // a is unchanged")],
            [L([
              "<code>b = a</code> copies all members, also the arrays inside the struct.",
              "After the copy, a and b are separate variables.",
              "<code>==</code> cannot compare two structs. Compare the members: <code>a.id == b.id</code>.",
            ])],
          ] },
          { kind: "code", part: "Copying a struct", title: "Example: a copy is independent", blocks: [
            EX(`#include <stdio.h>
struct point { int x; int y; };
int main(void) {
    struct point a = {1, 2};
    struct point b = a;
    b.x = 9;
    printf("%d %d\\n", a.x, b.x);
    return 0;
}`, "a short struct can be defined on one line", [
              { c: "struct point b = a;", e: "b.x is 1 and b.y is 2: a copy of a" },
              { c: "b.x = 9;", e: "changes b only" },
              { c: "printf", e: "<code>1 9</code>" },
            ]),
          ] },
          { kind: "concept", part: "typedef", title: "typedef: a shorter type name", cols: [
            [CODE("typedef struct {\n    int x;\n    int y;\n} Point;\n\nPoint a = {1, 2};\nPoint b = a;", null, "Point is the name of the type")],
            [L([
              "typedef gives a type a new name. The word struct is then not written.",
              "The new name follows the closing brace: <code>} Point;</code>",
              "Both styles are common. This lesson writes <code>struct name</code>, which shows that the type is a struct.",
            ])],
          ] },
          { kind: "concept", part: "Arrays of structs", title: "An array of records", cols: [
            [CODE('struct student c[3] = {\n    {"Anan", 72},\n    {"Bua", 91},\n    {"Chai", 85}\n};\nprintf("%s\\n", c[1].name);', "Bua")],
            [L([
              "Each element is a whole struct: <code>c[1]</code> is the second student.",
              "<code>c[1].name</code>: first the index, then the member.",
              "The initializer has one <code>{…}</code> for each element.",
              "A loop over the indexes processes every record.",
            ])],
          ] },
          { kind: "problem", part: "Arrays of structs", title: "Problem: the best student", blocks: [
            T("The names and scores of three students are stored in an array of structs. Display the name and the score of the student with the highest score."),
            IPO([
              ["Input", "Anan 72, Bua 91, Chai 85"],
              ["Output", "Top: Bua (91)"],
              ["Processing", "keep the index of the best record; compare the score of every other record with it"],
            ]),
          ] },
          { kind: "code", part: "Arrays of structs", title: "Example: the best student", blocks: [
            RUN(`#include <stdio.h>
struct student { char name[20]; int score; };
int main(void) {
    struct student c[3] = {{"Anan", 72}, {"Bua", 91}, {"Chai", 85}};
    int best = 0;
    for (int i = 1; i < 3; i++) {
        if (c[i].score > c[best].score) { best = i; }
    }
    printf("Top: %s (%d)\\n", c[best].name, c[best].score);
    return 0;
}`),
          ] },
          { kind: "concept", part: "Structs and functions", title: "Structs as parameters and results", cols: [
            [CODE("struct rect { double w; double h; };\n\ndouble area(struct rect r) {\n    return r.w * r.h;\n}\n\nstruct rect make(double w, double h) {\n    struct rect r = {w, h};\n    return r;\n}")],
            [L([
              "A struct parameter receives a <b>copy</b> of the argument, as an int parameter does (Lesson 7).",
              "A function can return a struct: several values in one result.",
              "A change to the parameter does not reach the caller. Return the changed struct and store it: <code>a = heat(a);</code> Lesson 11 shows a second way, with a pointer.",
            ])],
          ] },
          { kind: "code", part: "Structs and functions", title: "Example: a changed copy is returned, step by step", blocks: [TRACE(T_heatCopy)] },
          { kind: "concept", part: "struct errors", title: "struct errors", blocks: [
            TB(["Error", "Correction"], [
              ["no ; after the } of the definition", "end the definition with <code>};</code>"],
              ["<code>a == b</code> for two structs", "compare the members: <code>a.id == b.id</code>"],
              ["<code>a.name = \"Anan\";</code>", "<code>strcpy(a.name, \"Anan\");</code>"],
              ["a function changes its struct parameter, but the caller's struct stays the same", "return the changed struct: <code>s = heat(s, 5.0);</code>"],
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A definition creates a type: <code>struct name { members };</code>",
              "<code>s.member</code> reaches a member; <code>{…}</code> initializes the members in order.",
              "<code>b = a</code> copies all members; <code>==</code> cannot compare structs.",
              "An array of structs holds records: <code>c[i].score</code>.",
              "A struct parameter is a copy; a function can return a changed struct.",
            ]),
            NEXT("<b>Pointers</b>. Addresses and variables that store them."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [PAPER],
            [RUN(`#include <stdio.h>
struct pair { int a; int b; };
int main(void) {
    struct pair p = {4, 7};
    struct pair q = p;
    q.a = q.a + p.b;
    printf("%d %d\\n", p.a, q.a);
    return 0;
}`)],
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("struct point has the members x and y. The statements inside main: complete the trace table on paper. The first row is done."),
            W("traceTable", { trace: T_exStruct, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Check your trace", cols: [
            [STEP_RUN],
            [RUN("#include <stdio.h>\nstruct point { int x; int y; };\nint main(void) {\n    " + T_exStruct.code.join("\n    ") + "\n    return 0;\n}")],
          ] },
          { kind: "exercise", title: "Complete missing code", blocks: [
            PQ("Complete the function make_sensor, which returns a struct sensor with the given id and value.",
              "4 18.5", '#include <stdio.h>\nstruct sensor { int id; double value; };\nstruct sensor make_sensor(int id, double value) {\n    \n}\nint main(void) {\n    struct sensor s = make_sensor(4, 18.5);\n    printf("%d %.1f\\n", s.id, s.value);\n    return 0;\n}', null, "struct sensor s = {id, value}; return s;"),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("s.value should become 25.0, but it stays 20.0. Correct the program: heat returns the changed struct.",
              "25.0", '#include <stdio.h>\nstruct sensor { int id; double value; };\nvoid heat(struct sensor s, double d) { s.value = s.value + d; }\nint main(void) {\n    struct sensor s = {1, 20.0};\n    heat(s, 5.0);\n    printf("%.1f\\n", s.value);\n    return 0;\n}', null, "The return type becomes struct sensor; heat ends with return s; and main writes s = heat(s, 5.0);"),
          ] },
          { kind: "exercise", title: "Write a program: the best student", blocks: [
            PQ("Read the names and scores of 3 students, one student per line, into an array of structs. Display the student with the highest score, and the average score with 2 decimals.",
              "Dao 64\nEk 88\nFah 79\nTop: Ek (88)\nAverage: 77.00", '#include <stdio.h>\nstruct student { char name[20]; int score; };\nint main(void) {\n    struct student s[3];\n    // read, find the best, compute the average\n    return 0;\n}', ["Dao 64", "Ek 88", "Fah 79"], "scanf(\"%s %d\", s[i].name, &s[i].score); keep the index of the best score, and the sum."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "What does `struct sensor { int id; double value; };` create?", choices: ["a type, and no variable", "a variable named sensor", "two variables", "an array of two values"], answer: 0, explain: "A definition describes a type; `struct sensor s;` then creates a variable." },
            { q: "a and b are struct variables. After `b = a;`, the statement `b.x = 9;` changes…", choices: ["only b", "a and b", "only a", "nothing: structs cannot be assigned"], answer: 0, explain: "= copies all members; a and b stay separate variables." },
          ])] },
        ],
      },

      /* =============================== 11. POINTERS =============================== */
      {
        id: "pointers",
        title: "Pointers",
        sub: "Addresses, pointer variables, dereferencing, passing addresses to functions, and pointers with arrays.",
        keywords: "pointer address ampersand dereference asterisk swap pass by address array pointer arithmetic null",
        deck: [
          { kind: "overview", title: "Pointers", blocks: [
            T("Every variable is stored at an <b>address</b> in memory. A <b>pointer</b> is a variable that stores an address. Pointers let a function change the caller's variables, and they explain how arrays and scanf work."),
            L(["Addresses", "Pointer variables", "Dereferencing", "Pointers as parameters", "Pointers and arrays", "Pointers to structs", "Pointer errors"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Addresses", title: "Every variable has an address", blocks: [
            TB(["Name", "Type", "Address", "Value"], [["x", "int", "1000", "42"], ["t", "double", "1004", "21.5"]], "example addresses", "center"),
            L([
              "<code>&amp;x</code> is the address of x: here 1000.",
              "scanf needs <code>&amp;x</code> because it must know where to store the value it reads.",
              "The real addresses differ on every computer and every run.",
            ]),
          ] },
          { kind: "concept", part: "Pointer variables", title: "Declaring a pointer", blocks: [
            CODE("int x = 42;\nint *p = &x;   // p stores the address of x"),
            L([
              "<code>int *p</code> declares p as a pointer to an int.",
              "<code>p = &amp;x</code> makes p point to x.",
              "<code>int *p = &amp;x;</code> stores &amp;x in p, not in *p; here * is part of the declaration.",
              "The type matters: an int pointer points to an int.",
            ]),
          ] },
          { kind: "concept", part: "Dereferencing", title: "Dereferencing: *p", blocks: [
            L([
              "<code>*p</code> is the variable that p points to.",
              "<code>int v = *p;</code> reads x through p.",
              "<code>*p = 99;</code> changes x through p.",
              "The * has two meanings: in a declaration it makes a pointer; in an expression it follows the pointer.",
            ]),
          ] },
          { kind: "visual", part: "Dereferencing", title: "A pointer, step by step", blocks: [
            W("ptrViz", {
              title: "p holds the address of x; *p follows it to x",
              target: { addr: "1000", name: "x (int)" },
              pointer: { addr: "1004", name: "p (int *)" },
              code: ["int x = 42;", "int *p = &x;", "int v = *p;", "*p = 99;"],
              steps: [
                { line: 0, xval: 42, pval: null, arrow: false, note: "x is stored at address 1000." },
                { line: 1, xval: 42, pval: "1000", arrow: true, note: "p stores the address of x: p points to x." },
                { line: 2, xval: 42, pval: "1000", arrow: true, deref: "read", note: "*p follows the pointer and reads 42." },
                { line: 3, xval: 99, pval: "1000", arrow: true, deref: "write", note: "*p = 99 writes through the pointer: x is now 99, although the statement does not name x." },
              ],
            }),
          ] },
          { kind: "code", part: "Dereferencing", title: "Example: changing x through p", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int x = 42;
    int *p = &x;
    *p = *p + 8;
    printf("%d %d\\n", x, *p);
    return 0;
}`, "*p and x are the same variable", [
              { c: "*p = *p + 8;", e: "x = 42 + 8" },
              { c: "printf", e: "<code>50 50</code>" },
            ]),
          ] },
          { kind: "concept", part: "Pointers as parameters", title: "Changing the caller's variables", blocks: [
            L([
              "A function receives copies of its arguments (Lesson 7).",
              "If it receives the <b>address</b> of a variable, it can change that variable through the pointer.",
              "This is why scanf needs &amp;: scanf changes your variable.",
              "A function can return several results this way, one pointer parameter for each.",
            ]),
          ] },
          { kind: "code", part: "Pointers as parameters", title: "Example: swap, step by step", blocks: [TRACE(T_swap)] },
          { kind: "concept", part: "Pointers and arrays", title: "Arrays and pointers", blocks: [
            L([
              "The name of an array is the address of its first element: <code>int *p = nums;</code> is the same as <code>p = &amp;nums[0];</code>",
              "<code>p + i</code> points to element i: <code>*(p + i)</code>, <code>p[i]</code>, and <code>nums[i]</code> are the same element.",
              "If nums starts at address 1000, p + 1 is 1004, not 1001: it moves by the size of one element (an int has 4 bytes).",
              "This is why an array parameter lets a function change the caller's elements, and why <code>scanf(\"%s\", name)</code> needs no &amp;.",
            ]),
          ] },
          { kind: "code", part: "Pointers and arrays", title: "Example: a pointer over an array", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int nums[3] = {10, 20, 30};
    int *p = nums;
    printf("%d %d\\n", *p, *(p + 1));
    printf("%d\\n", p[2]);
    p++;
    printf("%d\\n", *p);
    return 0;
}`, "p + 1 is the next element", [
              { c: "*(p + 1)", e: "the element with index 1: <code>10 20</code>" },
              { c: "p[2]", e: "the same element as nums[2]: <code>30</code>" },
              { c: "p++;", e: "p moves to the next element: <code>20</code>" },
            ]),
          ] },
          { kind: "concept", part: "Pointers to structs", title: "Pointers to structs and ->", cols: [
            [CODE("struct sensor s = {3, 21.5};\nstruct sensor *p = &s;\n\np->value = 30.0;     // the same as\n(*p).value = 30.0;   // this")],
            [L([
              "<code>p-&gt;value</code> is the member value of the struct that p points to.",
              "<code>(*p).value</code> means the same. The parentheses are needed, because . is applied before *.",
              "With a pointer parameter, a function changes the caller's struct, and the struct is not copied.",
            ])],
          ] },
          { kind: "code", part: "Pointers to structs", title: "Example: heat, step by step", blocks: [TRACE(T_heat)] },
          { kind: "concept", part: "Pointer errors", title: "Pointer errors", blocks: [
            TB(["Error", "Effect"], [
              ["using a pointer that was never given an address", "it points to an unknown place: a crash or wrong data"],
              ["dereferencing <code>NULL</code>", "NULL means \"points nowhere\"; check <code>if (p != NULL)</code> first"],
              ["returning the address of a local variable", "the variable no longer exists after the function returns"],
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "<code>&amp;x</code> is the address of x; <code>int *p = &amp;x;</code> stores it.",
              "<code>*p</code> reads or changes the variable that p points to.",
              "A function with pointer parameters can change the caller's variables: swap, scanf.",
              "An array name is the address of element 0; <code>*(p + i)</code> is <code>p[i]</code>.",
              "<code>p-&gt;member</code> is a member of the struct that p points to.",
            ]),
            NEXT("<b>Number systems and fixed-size integers</b>. Hexadecimal, binary, and the integer types of stdint.h."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [PAPER],
            [RUN(`#include <stdio.h>
int main(void) {
    int a = 3, b = 7;
    int *p = &a;
    *p = *p * 2;
    p = &b;
    *p = *p + a;
    printf("%d %d\\n", a, b);
    return 0;
}`)],
          ] },
          { kind: "exercise", title: "Complete missing code", blocks: [
            PQ("Complete the function to_percent, which multiplies the variable that its parameter points to by 100.",
              "45.0", '#include <stdio.h>\nvoid to_percent(double *x) {\n    \n}\nint main(void) {\n    double load = 0.45;\n    to_percent(&load);\n    printf("%.1f\\n", load);\n    return 0;\n}', null, "*x = *x * 100;"),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("add_bonus should add 10 to the caller's variable, but s stays 50. Correct the function.",
              "60", '#include <stdio.h>\nvoid add_bonus(int *score) {\n    score = score + 10;\n}\nint main(void) {\n    int s = 50;\n    add_bonus(&s);\n    printf("%d\\n", s);\n    return 0;\n}', null, "score is the address; *score is the variable."),
          ] },
          { kind: "exercise", title: "Write a program: two results", blocks: [
            PQ("Write <code>void min_max(int v[], int n, int *lo, int *hi)</code>, which stores the smallest and the largest element. Test it with {4, 9, 2, 7, 5}, and display lo and hi separated by a space: <code>2 9</code>.",
              "2 9", STARTER, null, "*lo = v[0]; *hi = v[0]; then compare each element."),
          ] },
          { kind: "exercise", title: "Write a program: a pointer parameter", blocks: [
            PQ("Write <code>void scale(struct rect *r, double k)</code>, which multiplies w and h of the caller's rectangle by k. Test it with {2.0, 3.0} and k = 1.5, and display w and h with 1 decimal.",
              "3.0 4.5", '#include <stdio.h>\nstruct rect { double w; double h; };\n// write scale here\nint main(void) {\n    struct rect a = {2.0, 3.0};\n    // call scale, then display a.w and a.h\n    return 0;\n}', null, "r->w = r->w * k; r->h = r->h * k; call it with scale(&a, 1.5);"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "After `int x = 5; int *p = &x; *p = 8;`, x is…", choices: ["5", "8", "the address of x", "unknown"], answer: 1, explain: "*p is x, so x becomes 8." },
            { q: "After `struct sensor *p = &s;`, which expression is the member value of s?", choices: ["`p.value`", "`p->value`", "`*p.value`", "`&p.value`"], answer: 1, explain: "p is a pointer: -> reaches the member of the struct that p points to. `*p.value` means `*(p.value)`." },
          ])] },
        ],
      },

      /* =============================== 12. NUMBER SYSTEMS AND FIXED-SIZE INTEGERS =============================== */
      {
        id: "numbers",
        title: "Number systems and fixed-size integers",
        sub: "Binary, hexadecimal, and octal in C, printing in other bases, the types of stdint.h, and wrap-around.",
        keywords: "binary hexadecimal octal literal 0x 0b printf x X o stdint uint8_t uint16_t int8_t unsigned wrap around overflow cast microcontroller",
        deck: [
          { kind: "overview", title: "Number systems and fixed-size integers", blocks: [
            T("A microcontroller stores every value as a pattern of bits, in registers of 8, 16, or 32 bits. Programs for hardware therefore write values in hexadecimal or binary, and use integer types of an exact size. Lessons 12 to 14 prepare the C used in the Digital and Microprocessor course."),
            L(["Binary and hexadecimal", "Number literals in C", "Printing in other bases", "Fixed-size integer types", "Unsigned values and wrap-around", "Conversion to a smaller type"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Binary and hexadecimal", title: "One hexadecimal digit is four bits", blocks: [
            TB(["Binary", "Hexadecimal", "Decimal"], [
              ["0000", "0", "0"], ["0101", "5", "5"], ["1001", "9", "9"], ["1010", "A", "10"], ["1100", "C", "12"], ["1111", "F", "15"],
            ], null, "center"),
            T("A byte (8 bits) is exactly two hexadecimal digits: 1010 0101 is A5."),
          ] },
          { kind: "concept", part: "Binary and hexadecimal", title: "Converting between binary and hexadecimal", blocks: [
            L([
              "Split the binary number into groups of 4 bits, from the right: 1101 0110.",
              "Replace each group by its hexadecimal digit: 1101 → D, 0110 → 6, so D6.",
              "Back: replace each hexadecimal digit by 4 bits: 3C → 0011 1100.",
              "The decimal value: D6 = 13 × 16 + 6 = 214.",
            ], null, true),
          ] },
          { kind: "concept", part: "Number literals in C", title: "Writing numbers in other bases", blocks: [
            TB(["Literal", "Base", "Value"], [
              ["<code>214</code>", "decimal", "214"],
              ["<code>0xD6</code>", "hexadecimal (0x)", "214"],
              ["<code>0b11010110</code>", "binary (0b)", "214"],
              ["<code>0326</code>", "octal (a leading 0)", "214"],
            ], null, "center"),
            L([
              "0b is accepted by gcc, clang, and most microcontroller compilers; it is standard since C23.",
              "A leading 0 means octal: <code>010</code> is 8, not 10. Never write a decimal number with a leading 0.",
            ]),
          ] },
          { kind: "code", part: "Number literals in C", title: "Example: three bases", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int a = 0x1F;
    int b = 0b1010;
    int c = 017;
    printf("%d %d %d\\n", a, b, c);
    return 0;
}`, "%d displays every value in decimal", [
              { c: "0x1F, 0b1010", e: "1 × 16 + 15 = 31; 8 + 2 = 10" },
              { c: "017", e: "octal: 1 × 8 + 7 = 15" },
              { c: "printf", e: "<code>31 10 15</code>" },
            ]),
          ] },
          { kind: "concept", part: "Printing in other bases", title: "Specifiers for other bases", blocks: [
            TB(["Specifier", "Output for 214", "Output for 5"], [
              ["<code>%d</code>", "214", "5"],
              ["<code>%x</code>", "d6", "5"],
              ["<code>%X</code>", "D6", "5"],
              ["<code>%02X</code>", "D6", "05"],
              ["<code>%#X</code>", "0XD6", "0X5"],
              ["<code>%o</code>", "326", "5"],
            ], null, "center"),
            T("printf has no specifier for binary. A loop over the bits displays it (Lesson 13)."),
          ] },
          { kind: "code", part: "Printing in other bases", title: "Example: one value in three bases", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    int v = 214;
    printf("%d = 0x%02X\\n", v, v);
    printf("octal %o\\n", v);
    printf("%02X %04X\\n", 5, 0x3F);
    return 0;
}`, "%02X: at least two digits", [
              { c: "0x%02X", e: "<code>214 = 0xD6</code>" },
              { c: "%o", e: "<code>octal 326</code>" },
              { c: "%04X", e: "filled with 0: <code>05 003F</code>" },
            ]),
          ] },
          { kind: "concept", part: "Fixed-size integer types", title: "int has no fixed size", blocks: [
            TB(["Processor", "Size of int"], [
              ["8-bit AVR (Arduino Uno)", "2 bytes (16 bits)"],
              ["8051", "2 bytes (16 bits)"],
              ["32-bit ARM, PC", "4 bytes (32 bits)"],
            ]),
            L([
              "A program that assumes a 4-byte int can fail on an 8-bit microcontroller: 40000 does not fit in 16 bits.",
              "For hardware, use the types of <code>&lt;stdint.h&gt;</code>: their size is the same on every processor.",
            ]),
          ] },
          { kind: "concept", part: "Fixed-size integer types", title: "The types of stdint.h", blocks: [
            TB(["Type", "Bits", "Range"], [
              ["<code>uint8_t</code>", "8", "0 to 255"],
              ["<code>int8_t</code>", "8", "−128 to 127"],
              ["<code>uint16_t</code>", "16", "0 to 65 535"],
              ["<code>int16_t</code>", "16", "−32 768 to 32 767"],
              ["<code>uint32_t</code>", "32", "0 to 4 294 967 295"],
            ]),
            T("u means unsigned: no sign, values from 0. The number is the size in bits. printf uses %d for the signed types and %u for the unsigned types; a uint8_t also works with %d, because it becomes an int."),
          ] },
          { kind: "code", part: "Fixed-size integer types", title: "Example: an 8-bit register and a 16-bit reading", blocks: [
            RUN(`#include <stdio.h>
#include <stdint.h>
int main(void) {
    uint8_t port = 0xA5;
    uint16_t adc = 1023;
    printf("%d %d\\n", (int) sizeof(port), (int) sizeof(adc));
    printf("%u %u\\n", port, adc);
    return 0;
}`),
            T("Output: <code>1 2</code> (bytes), then <code>165 1023</code>. 1023 is the largest value of a 10-bit analog-to-digital converter."),
          ] },
          { kind: "concept", part: "Unsigned values and wrap-around", title: "Wrap-around", blocks: [
            L([
              "An unsigned value that passes its maximum starts again at 0: for uint8_t, 255 + 1 is 0.",
              "Below 0 it continues from the maximum: 0 − 1 is 255.",
              "The result is the value modulo 2ⁿ for n bits: (250 + 10) mod 256 = 4.",
              "The timers and counters of a microcontroller count in the same way.",
            ]),
          ] },
          { kind: "code", part: "Unsigned values and wrap-around", title: "Example: execution step by step", blocks: [TRACE(T_wrap)] },
          { kind: "concept", part: "Conversion to a smaller type", title: "Converting to a smaller type", blocks: [
            L([
              "A value stored in a smaller type keeps only its low bits: <code>(uint8_t) 0x1234</code> is 0x34.",
              "A negative value stored in an unsigned type becomes large: <code>(uint8_t) -1</code> is 255 (1111 1111).",
            ]),
          ] },
          { kind: "code", part: "Conversion to a smaller type", title: "Example: keeping the low byte", blocks: [
            EX(`#include <stdio.h>
#include <stdint.h>
int main(void) {
    uint16_t reading = 0x1234;
    uint8_t low = (uint8_t) reading;
    uint8_t minus = (uint8_t) -1;
    printf("0x%02X %u\\n", low, minus);
    return 0;
}`, "only 8 bits fit", [
              { c: "(uint8_t) reading", e: "the low byte of 0x1234: <code>0x34</code>" },
              { c: "(uint8_t) -1", e: "all 8 bits are 1: <code>255</code>" },
            ]),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "One hexadecimal digit is 4 bits; a byte is 2 hexadecimal digits.",
              "Literals: 0x for hexadecimal, 0b for binary, a leading 0 for octal.",
              "printf: %X, %02X, %#X, %o. There is no binary specifier.",
              "int has 2 or 4 bytes, depending on the processor; stdint.h gives uint8_t, int16_t, uint32_t, ….",
              "Unsigned values wrap around; a smaller type keeps only the low bits.",
            ]),
            NEXT("<b>Bitwise operators</b>. Working on the single bits of a register."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [PAPER],
            [RUN(`#include <stdio.h>
int main(void) {
    int a = 0x20, b = 0b111, c = 012;
    printf("%d %d %d\\n", a, b, c);
    printf("%X %02x\\n", 255, 10);
    printf("%o\\n", 64);
    return 0;
}`)],
          ] },
          { kind: "exercise", title: "Complete the table", blocks: [
            T("Write the missing values on paper. The next exercise checks them."),
            TB(["Binary", "Hexadecimal", "Decimal"], [["0011 0111", "", ""], ["", "0xA4", ""], ["", "", "200"], ["1111 1111", "", ""]], null, "center"),
          ] },
          { kind: "exercise", title: "Check your table", blocks: [
            TB(["Binary", "Hexadecimal", "Decimal"], [["0011 0111", "0x37", "55"], ["1010 0100", "0xA4", "164"], ["1100 1000", "0xC8", "200"], ["1111 1111", "0xFF", "255"]], null, "center"),
            T("Check with printf: <code>printf(\"%d %X\", 0b00110111, 55);</code>"),
          ] },
          { kind: "exercise", title: "Write a program: hexadecimal", blocks: [
            PQ("Read a number from 0 to 255 and display it as two hexadecimal digits with 0x.",
              "Value: 200\n0xC8", '#include <stdio.h>\nint main(void) {\n    int v;\n    printf("Value: ");\n    scanf("%d", &v);\n    // display v in hexadecimal\n    return 0;\n}', ["200"], 'printf("0x%02X\\n", v);'),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("A timer should wait 10 minutes, but the program displays 8. Correct the error.",
              "10", '#include <stdio.h>\nint main(void) {\n    int minutes = 010;\n    printf("%d\\n", minutes);\n    return 0;\n}', null, "A leading 0 makes an octal number."),
          ] },
          { kind: "exercise", title: "Write a program: wrap-around", blocks: [
            PQ("A uint8_t counter starts at 250. Add 1 to it ten times, and display the value after each step, on one line.",
              "251 252 253 254 255 0 1 2 3 4", '#include <stdio.h>\n#include <stdint.h>\nint main(void) {\n    uint8_t counter = 250;\n    // add 1 ten times\n    return 0;\n}', null, "for (int i = 0; i < 10; i++) { counter++; printf(\"%d \", counter); }"),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "`0x2A` in decimal is…", choices: ["20", "42", "210", "2A"], answer: 1, explain: "2 × 16 + 10 = 42." },
            { q: "`uint8_t x = 255; x++;` Now x is…", choices: ["256", "0", "255", "an error"], answer: 1, explain: "An 8-bit unsigned value wraps around from 255 to 0." },
          ])] },
        ],
      },

      /* =============================== 13. BITWISE OPERATORS =============================== */
      {
        id: "bitwise",
        title: "Bitwise operators and bit manipulation",
        sub: "AND, OR, XOR, NOT, shifts, masks, and setting, clearing, toggling, and testing bits.",
        keywords: "bitwise and or xor not shift mask set clear toggle test bit register nibble byte binary",
        deck: [
          { kind: "overview", title: "Bitwise operators and bit manipulation", blocks: [
            T("Hardware is controlled bit by bit: one bit of an output register switches one LED; one bit of an input register reports one button. The <b>bitwise operators</b> work on each bit of a value separately."),
            L(["AND, OR, XOR, and NOT", "Shifts", "Masks", "Setting, clearing, toggling, and testing a bit", "Fields and bytes", "Displaying the bits"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "AND, OR, XOR, and NOT", title: "The bitwise operators", blocks: [
            TB(["Operator", "Name", "A result bit is 1 when…"], [
              ["<code>&amp;</code>", "AND", "both bits are 1"],
              ["<code>|</code>", "OR", "at least one bit is 1"],
              ["<code>^</code>", "XOR", "the two bits are different"],
              ["<code>~</code>", "NOT", "the bit is 0: every bit is inverted"],
            ]),
            T("Each bit position is computed on its own, column by column, as in the truth tables of logic gates."),
          ] },
          { kind: "concept", part: "AND, OR, XOR, and NOT", title: "Column by column: an example", blocks: [
            TB(["Expression", "Bits", "Hexadecimal"], [
              ["a", "1100 1010", "0xCA"],
              ["b", "1010 0110", "0xA6"],
              ["a &amp; b", "1000 0010", "0x82"],
              ["a | b", "1110 1110", "0xEE"],
              ["a ^ b", "0110 1100", "0x6C"],
              ["~a (8 bits)", "0011 0101", "0x35"],
            ], null, "center"),
          ] },
          { kind: "code", part: "AND, OR, XOR, and NOT", title: "Example: the four operators", blocks: [
            EX(`#include <stdio.h>
#include <stdint.h>
int main(void) {
    uint8_t a = 0xCA, b = 0xA6;
    uint8_t not_a = ~a;
    printf("%X %X\\n", a & b, a | b);
    printf("%X %X\\n", a ^ b, not_a);
    return 0;
}`, "the values of the previous slide", [
              { c: "a & b, a | b", e: "<code>82 EE</code>" },
              { c: "a ^ b", e: "<code>6C</code>" },
              { c: "uint8_t not_a = ~a;", e: "<code>35</code>: ~ gives an int; uint8_t keeps 8 bits" },
            ]),
          ] },
          { kind: "concept", part: "AND, OR, XOR, and NOT", title: "& and && are different", blocks: [
            TB(["Expression", "Kind", "Result"], [
              ["<code>6 &amp; 3</code>", "bitwise: 110 AND 011", "2 (010)"],
              ["<code>6 &amp;&amp; 3</code>", "logical: both are not 0", "1"],
              ["<code>4 &amp; 2</code>", "bitwise: 100 AND 010", "0"],
              ["<code>4 &amp;&amp; 2</code>", "logical: both are not 0", "1"],
            ], null, "center"),
            T("Use &amp;&amp;, ||, and ! to combine conditions; use &amp;, |, ^, and ~ on bits."),
          ] },
          { kind: "concept", part: "Shifts", title: "Shift operators", blocks: [
            TB(["Expression", "Bits", "Value"], [
              ["<code>x</code>", "0000 0101", "5"],
              ["<code>x &lt;&lt; 1</code>", "0000 1010", "10"],
              ["<code>x &lt;&lt; 3</code>", "0010 1000", "40"],
              ["<code>x &gt;&gt; 1</code>", "0000 0010", "2"],
              ["<code>1 &lt;&lt; n</code>", "a single 1 at position n", "2ⁿ"],
            ], null, "center"),
            T("Bits shifted out are lost; zeros come in. For unsigned x: x &lt;&lt; n is x × 2ⁿ, and x &gt;&gt; n is x / 2ⁿ."),
          ] },
          { kind: "code", part: "Shifts", title: "Example: shifts", blocks: [
            EX(`#include <stdio.h>
int main(void) {
    unsigned int x = 5;
    printf("%u %u\\n", x << 1, x << 3);
    printf("%u\\n", x >> 1);
    printf("%d %d\\n", 1 << 0, 1 << 7);
    return 0;
}`, "multiply and divide by powers of 2", [
              { c: "x << 3", e: "5 × 8: <code>10 40</code>" },
              { c: "x >> 1", e: "5 / 2: <code>2</code>" },
              { c: "1 << 7", e: "bit 7 alone: <code>1 128</code>" },
            ]),
          ] },
          { kind: "concept", part: "Masks", title: "A mask selects bits", blocks: [
            L([
              "A <b>mask</b> is a value whose 1 bits mark the bits to work on.",
              "Bits are numbered from 0, the rightmost (least significant) bit.",
              "Bit n alone has the mask <code>1 &lt;&lt; n</code>: bit 3 is 0000 1000 (0x08).",
              "Several bits: <code>(1 &lt;&lt; 3) | (1 &lt;&lt; 0)</code> is 0000 1001 (0x09).",
            ]),
          ] },
          { kind: "concept", part: "Setting, clearing, toggling, and testing a bit", title: "The four bit operations", blocks: [
            TB(["Operation", "Code", "Why it works (b is one bit)"], [
              ["set bit n to 1", "<code>reg |= (1 &lt;&lt; n);</code>", "b | 1 = 1; b | 0 = b"],
              ["clear bit n to 0", "<code>reg &amp;= ~(1 &lt;&lt; n);</code>", "b &amp; 0 = 0; b &amp; 1 = b"],
              ["toggle bit n", "<code>reg ^= (1 &lt;&lt; n);</code>", "b ^ 1 = not b; b ^ 0 = b"],
              ["test bit n", "<code>if (reg &amp; (1 &lt;&lt; n))</code>", "not 0 only when bit n is 1"],
            ]),
            T("The other bits keep their values: a program switches one pin without changing the others."),
          ] },
          { kind: "code", part: "Setting, clearing, toggling, and testing a bit", title: "Example: execution step by step", blocks: [TRACE(T_ops)] },
          { kind: "code", part: "Setting, clearing, toggling, and testing a bit", title: "Example: which input pins are high", blocks: [
            RUN(`#include <stdio.h>
#include <stdint.h>
int main(void) {
    uint8_t pins = 0x24;
    for (int n = 0; n < 8; n++) {
        if (pins & (1 << n)) { printf("pin %d is high\\n", n); }
    }
    return 0;
}`),
            T("0x24 is 0010 0100: bits 2 and 5 are 1."),
          ] },
          { kind: "concept", part: "Fields and bytes", title: "Reading a field and joining bytes", blocks: [
            L([
              "The high 4 bits (bits 4–7): <code>(reg &gt;&gt; 4) &amp; 0x0F</code>.",
              "The low 4 bits (bits 0–3): <code>reg &amp; 0x0F</code>.",
              "Two bytes joined into 16 bits: <code>(high &lt;&lt; 8) | low</code>.",
              "16 bits split into bytes: <code>value &gt;&gt; 8</code> and <code>value &amp; 0xFF</code>.",
            ]),
          ] },
          { kind: "code", part: "Fields and bytes", title: "Example: joining bytes and reading fields", blocks: [
            RUN(`#include <stdio.h>
#include <stdint.h>
int main(void) {
    uint8_t high = 0x03, low = 0xE8;
    uint16_t adc = (high << 8) | low;
    printf("%u\\n", adc);
    printf("%X %X\\n", (low >> 4) & 0x0F, low & 0x0F);
    return 0;
}`),
            T("A 10-bit reading: 0x03E8 is 1000. The low byte 0xE8 splits into E and 8."),
          ] },
          { kind: "concept", part: "Displaying the bits", title: "Displaying a value in binary", blocks: [
            CODE('for (int n = 7; n >= 0; n--) {\n    printf("%d", (value >> n) & 1);\n}'),
            L([
              "Start with the highest bit, 7, and go down to bit 0.",
              "<code>(value &gt;&gt; n) &amp; 1</code> moves bit n to position 0 and keeps only that bit: 0 or 1.",
            ]),
          ] },
          { kind: "code", part: "Displaying the bits", title: "Example: a function that displays 8 bits", blocks: [
            RUN(`#include <stdio.h>
#include <stdint.h>
void print_bits(uint8_t v) {
    for (int n = 7; n >= 0; n--) { printf("%d", (v >> n) & 1); }
    printf("\\n");
}
int main(void) {
    print_bits(0xA5);
    return 0;
}`),
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "&amp; AND, | OR, ^ XOR, ~ NOT work bit by bit; &amp;&amp; and || work on conditions.",
              "&lt;&lt; and &gt;&gt; shift the bits; 1 &lt;&lt; n is the mask of bit n.",
              "Set <code>|= mask</code>, clear <code>&amp;= ~mask</code>, toggle <code>^= mask</code>, test <code>&amp; mask</code>.",
              "Fields: shift, then mask; bytes: <code>(high &lt;&lt; 8) | low</code>.",
            ]),
            NEXT("<b>C for microcontrollers</b>. Registers, volatile, the main loop, and data types for hardware."),
          ] },
          { kind: "exercise", title: "Determine the output", cols: [
            [PAPER],
            [RUN(`#include <stdio.h>
int main(void) {
    int a = 0x5C, b = 0x0F;
    printf("%02X ", a & b);
    printf("%02X\\n", a | b);
    printf("%02X ", a ^ 0xFF);
    printf("%d\\n", a >> 2);
    printf("%d %d\\n", 6 & 1, 6 && 1);
    return 0;
}`)],
          ] },
          { kind: "exercise", title: "Trace the code", blocks: [
            T("The statements inside main. Complete the trace table on paper, in hexadecimal. The first row is done."),
            W("traceTable", { trace: T_exBits, blank: true, given: 1 }),
          ] },
          { kind: "exercise", title: "Check your trace", cols: [
            [STEP_RUN],
            [RUN(MAIN_U8("    " + T_exBits.code.join("\n    ")))],
          ] },
          { kind: "exercise", title: "Complete missing code", blocks: [
            PQ("The LED is on bit 5 of port. Complete line 6, so that the LED is switched off and the other bits stay unchanged.",
              "0x87", '#include <stdio.h>\n#include <stdint.h>\nint main(void) {\n    uint8_t port = 0xA7;\n    // switch off bit 5\n    \n    printf("0x%02X\\n", port);\n    return 0;\n}', null, "port &= ~(1 << 5);"),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("The program should display <code>on</code> only when bit 2 of status is 1. Correct the condition.",
              "off", '#include <stdio.h>\n#include <stdint.h>\nint main(void) {\n    uint8_t status = 0x18;\n    if (status && (1 << 2)) { printf("on\\n"); }\n    else { printf("off\\n"); }\n    return 0;\n}', null, "&& is logical; a bit is tested with &."),
          ] },
          { kind: "exercise", title: "Write a program: count the 1 bits", blocks: [
            PQ("Count the bits that are 1 in the byte 0xB7, and display the count.",
              "6", '#include <stdio.h>\n#include <stdint.h>\nint main(void) {\n    uint8_t r = 0xB7;\n    // count the 1 bits\n    return 0;\n}', null, "Test bit 0 with r & 1, then shift r >> 1; repeat 8 times."),
          ] },
          { kind: "exercise", title: "Write a program: swap the nibbles", blocks: [
            PQ("A <b>nibble</b> is a group of 4 bits: one hexadecimal digit. Exchange the high and low nibbles of x = 0x3C, and display the result as two hexadecimal digits.",
              "C3", '#include <stdio.h>\n#include <stdint.h>\nint main(void) {\n    uint8_t x = 0x3C;\n    // swap the nibbles\n    return 0;\n}', null, "x = (x << 4) | (x >> 4); the uint8_t keeps the low 8 bits."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Which statement sets bit 3 of reg and keeps the other bits?", choices: ["`reg = 1 << 3;`", "`reg |= (1 << 3);`", "`reg &= (1 << 3);`", "`reg ^= 3;`"], answer: 1, explain: "OR with the mask sets bit 3; the other bits are ORed with 0." },
            { q: "`0x0F & 0x3C` is…", choices: ["0x0C", "0x3F", "0x33", "1"], answer: 0, explain: "0000 1111 AND 0011 1100 = 0000 1100." },
          ])] },
        ],
      },

      /* =============================== 14. C FOR MICROCONTROLLERS =============================== */
      {
        id: "embedded",
        title: "C for microcontrollers",
        sub: "Registers, volatile, the main loop, pin names, lookup tables, static, enum, and struct.",
        keywords: "microcontroller embedded register address volatile main loop while 1 define macro pin lookup table 7 segment static enum state struct typedef arrow",
        deck: [
          { kind: "overview", title: "C for microcontrollers", blocks: [
            T("A microcontroller program controls the hardware through its <b>registers</b>. The examples simulate each register with a variable, because the browser has no hardware."),
            L(["Registers at fixed addresses", "volatile", "The main loop", "Names for pins and bits", "Lookup tables", "static variables", "enum: named states", "struct for registers"], "Subtopics in this lesson", true),
          ] },
          { kind: "concept", part: "Registers at fixed addresses", title: "A register is memory at a fixed address", blocks: [
            L([
              "Each input/output register has a fixed address, given in the data sheet of the microcontroller.",
              "Writing to that address changes the pins; reading it returns the pin levels.",
              "C reaches the address through a pointer, in two steps. The cast <code>(uint8_t *) 0x25</code> makes the number 0x25 an address; the <code>*</code> in front of it is the byte at that address.",
              "Written for a register: <code>*(volatile uint8_t *) 0x25</code> (volatile: the next subtopic).",
            ]),
            TB(["Register (ATmega328P)", "Address", "Purpose"], [
              ["DDRB", "0x24", "direction of the pins of port B (1 = output)"],
              ["PORTB", "0x25", "output levels of port B"],
              ["PINB", "0x23", "input levels of port B"],
            ]),
          ] },
          { kind: "concept", part: "Registers at fixed addresses", title: "Register names in C", blocks: [
            CODE("#define DDRB  (*(volatile uint8_t *) 0x24)\n#define PORTB (*(volatile uint8_t *) 0x25)\n\nDDRB |= (1 << 5);    // pin 5 of port B is an output\nPORTB |= (1 << 5);   // pin 5 high: the LED is on", null, "as a microcontroller header defines them (read-only)"),
            L([
              "The header of the microcontroller (for example avr/io.h) contains these definitions.",
              "After that, a register is used like a variable, with the bit operations of Lesson 13.",
            ]),
          ] },
          { kind: "concept", part: "volatile", title: "volatile", blocks: [
            CODE("volatile uint8_t button_pressed = 0;   // changed by an interrupt"),
            L([
              "<code>volatile</code> tells the compiler that the value can change outside the program: by the hardware, or by an interrupt routine (a function that the hardware starts when an event occurs, for example a button press).",
              "The compiler then reads the value from memory every time, instead of reusing an old copy.",
              "Hardware registers and variables shared with an interrupt must be volatile.",
            ]),
          ] },
          { kind: "concept", part: "The main loop", title: "Setup, then an endless loop", cols: [
            [CODE("int main(void) {\n    DDRB |= (1 << 5);        // setup: once\n    while (1) {              // loop: forever\n        PORTB ^= (1 << 5);   // toggle the LED\n        _delay_ms(500);      // wait 500 ms\n    }\n}", null, "a blinking LED on an AVR (read-only)")],
            [L([
              "A microcontroller program never ends: main contains an endless loop, <code>while (1)</code>.",
              "Before the loop, the setup runs once.",
              "Arduino's setup() and loop() hide the same structure.",
            ])],
          ] },
          { kind: "code", part: "The main loop", title: "Example: the loop, simulated four times", blocks: [
            RUN(`#include <stdio.h>
#include <stdint.h>
int main(void) {
    uint8_t portb = 0x00;
    for (int t = 0; t < 4; t++) {   // on the chip: while (1)
        portb ^= (1 << 5);
        printf("t=%d PORTB=0x%02X\\n", t, portb);
    }
    return 0;
}`),
          ] },
          { kind: "concept", part: "Names for pins and bits", title: "Names instead of numbers", blocks: [
            CODE("#define LED_PIN    5\n#define BUTTON_PIN 2\n#define BIT(n)     (1 << (n))\n\nPORTB |= BIT(LED_PIN);"),
            L([
              "#define gives a pin number a name: the program reads like the circuit diagram.",
              "A macro with a parameter is replaced before compiling: BIT(5) becomes (1 &lt;&lt; (5)).",
              "Put parentheses around the parameter and the whole macro, so that BIT(n + 1) is correct.",
            ]),
          ] },
          { kind: "code", part: "Names for pins and bits", title: "Example: a pin name and a bit macro", blocks: [
            EX(`#include <stdio.h>
#include <stdint.h>
#define LED_PIN 5
#define BIT(n) (1 << (n))
int main(void) {
    uint8_t portb = 0;
    portb |= BIT(LED_PIN);
    printf("0x%02X\\n", portb);
    return 0;
}`, "BIT(LED_PIN) is (1 << (5))", [
              { c: "portb |= BIT(LED_PIN);", e: "sets bit 5" },
              { c: "printf", e: "0010 0000: <code>0x20</code>" },
            ]),
          ] },
          { kind: "concept", part: "Lookup tables", title: "Lookup tables", blocks: [
            L([
              "A <b>lookup table</b> is a const array that maps a number to the bit pattern that the hardware needs.",
              "A 7-segment display shows a digit when the right segments a–g are on; each segment is one bit.",
              "const tables can stay in the program memory (flash) of the microcontroller.",
            ]),
          ] },
          { kind: "concept", part: "Lookup tables", title: "The codes of a 7-segment display", blocks: [
            TB(["Digit", "Segments on", "Bits g…a", "Code"], [
              ["0", "a b c d e f", "011 1111", "0x3F"],
              ["1", "b c", "000 0110", "0x06"],
              ["2", "a b d e g", "101 1011", "0x5B"],
              ["3", "a b c d g", "100 1111", "0x4F"],
            ], "bit 0 is segment a, bit 6 is segment g (common cathode)", "center"),
          ] },
          { kind: "code", part: "Lookup tables", title: "Example: a digit to its segments", blocks: [
            EX(`#include <stdio.h>
#include <stdint.h>
const uint8_t SEG[4] = {0x3F, 0x06,
                        0x5B, 0x4F};
int main(void) {
    int digit = 2;
    uint8_t code = SEG[digit];
    printf("0x%02X\\n", code);
    return 0;
}`, "the index is the digit", [
              { c: "SEG[digit]", e: "one array access instead of a switch" },
              { c: "printf", e: "<code>0x5B</code>: segments a, b, d, e, g" },
            ]),
          ] },
          { kind: "concept", part: "static variables", title: "static local variables", blocks: [
            L([
              "A local variable normally disappears when its function returns.",
              "A <code>static</code> local variable is created once and keeps its value between calls.",
              "Typical use: a counter inside a function that is called again and again, such as a button handler.",
            ]),
          ] },
          { kind: "code", part: "static variables", title: "Example: execution step by step", blocks: [TRACE(T_static)] },
          { kind: "concept", part: "enum: named states", title: "enum: named constants", blocks: [
            CODE("enum state { IDLE, RUNNING, FAULT };\nenum state s = IDLE;"),
            L([
              "enum gives names to the integers 0, 1, 2, …: IDLE is 0, RUNNING 1, FAULT 2.",
              "A value can be chosen: <code>enum level { LOW = 0, HIGH = 1 };</code>",
              "enum makes the states of a machine readable; switch or if handles each state.",
            ]),
          ] },
          { kind: "code", part: "enum: named states", title: "Example: a state from a reading", blocks: [
            RUN(`#include <stdio.h>
enum state { IDLE, RUNNING, FAULT };
int main(void) {
    enum state s = IDLE;
    int temp = 95;
    if (temp > 90) { s = FAULT; }
    if (s == FAULT) { printf("fault: state %d\\n", s); }
    else { printf("state %d\\n", s); }
    return 0;
}`),
          ] },
          { kind: "concept", part: "struct for registers", title: "Registers as a struct, and ->", cols: [
            [CODE("typedef struct {\n    volatile uint32_t IDR;   // input\n    volatile uint32_t ODR;   // output\n} GPIO_TypeDef;\n\nGPIO_TypeDef *gpioa = ...;\ngpioa->ODR |= (1 << 5);", null, "simplified, in the style of ARM libraries (read-only)")],
            [L([
              "A group of registers can be described as a struct (Lesson 10): each register is a member, at its own address.",
              "gpioa points to the group; <code>gpioa-&gt;ODR</code> is its output register (-&gt;, Lesson 11).",
              "STM32 and other ARM libraries write <code>GPIOA-&gt;ODR</code>.",
            ])],
          ] },
          { kind: "summary", title: "Summary", blocks: [
            L([
              "A register is memory at a fixed address, reached through a volatile pointer.",
              "volatile: the value can change outside the program; always read it from memory.",
              "A microcontroller program: setup, then <code>while (1)</code>.",
              "#define names pins and bits; const lookup tables map numbers to bit patterns.",
              "static keeps a local value between calls; enum names states; a struct can describe a group of registers.",
            ]),
            NEXT("<b>Chapter practice</b>. Complete programs that use the whole chapter."),
          ] },
          { kind: "exercise", title: "Determine the output on paper, then run", blocks: [
            RUN(`#include <stdio.h>
int tick(void) {
    static int t = 10;
    t += 5;
    return t;
}
int main(void) {
    tick();
    printf("%d\\n", tick());
    return 0;
}`),
          ] },
          { kind: "exercise", title: "Write a program: segments", blocks: [
            PQ("Use the table to display the letters of the segments that are on for the digit 3, in the order a to g.",
              "abcdg", '#include <stdio.h>\n#include <stdint.h>\nconst uint8_t SEG[4] = {0x3F, 0x06, 0x5B, 0x4F};\nint main(void) {\n    uint8_t code = SEG[3];\n    // for each bit 0..6 that is 1, display \'a\' + bit\n    return 0;\n}', null, "for (int s = 0; s < 7; s++) { if (code & (1 << s)) { printf(\"%c\", 'a' + s); } }"),
          ] },
          { kind: "exercise", title: "Correct an error", blocks: [
            PQ("DOUBLE(3 + 1) should be 8, but the program displays 5. Correct the macro.",
              "8", '#include <stdio.h>\n#define DOUBLE(x) x * 2\nint main(void) {\n    printf("%d\\n", DOUBLE(3 + 1));\n    return 0;\n}', null, "3 + 1 * 2 is 5: put parentheses around x and around the whole macro."),
          ] },
          { kind: "exercise", title: "Write a program: a static counter", blocks: [
            PQ("Write <code>int next_id(void)</code>, which returns 1, 2, 3, … on successive calls, with a static variable. Call it three times and display the results on one line.",
              "1 2 3", STARTER, null, "static int id = 0; id++; return id;"),
          ] },
          { kind: "exercise", title: "Write a program: a traffic light", blocks: [
            PQ("With <code>enum light { RED, GREEN, YELLOW };</code>, start at RED and display the next 5 states as numbers: RED → GREEN → YELLOW → RED …",
              "0 1 2 0 1", '#include <stdio.h>\nenum light { RED, GREEN, YELLOW };\nint main(void) {\n    enum light l = RED;\n    // display 5 states\n    return 0;\n}', null, "printf(\"%d \", l); then l = (l + 1) % 3; in a loop."),
          ] },
          { kind: "check", title: "Check", blocks: [QZ([
            { q: "Why is a hardware register declared `volatile`?", choices: ["to make it faster", "its value can change outside the program", "to make it constant", "to store it in flash"], answer: 1, explain: "The compiler must read it from memory every time." },
            { q: "What does a `static` local variable do?", choices: ["it cannot be changed", "it keeps its value between calls", "it is visible in every file", "it is stored in a register"], answer: 1, explain: "It is created once and survives the return of the function." },
          ])] },
        ],
      },

      /* =============================== 15. PRACTICE =============================== */
      {
        id: "practice",
        title: "Chapter practice",
        sub: "Complete C programs that combine the lessons of this chapter.",
        slides: "09:38",
        keywords: "practice c program electricity bill statistics menu switch prime function string count pointer struct stock",
        deck: [
          { kind: "overview", title: "Chapter practice", blocks: [
            T("Solve every problem with the five steps:"),
            L([
              "<b>Understand</b>: the input and the output.",
              "<b>Design</b>: write the algorithm as steps.",
              "<b>Code</b>: write the program.",
              "<b>Test</b>: run it with values whose result is known.",
              "<b>Correct</b>: if the output differs, find the wrong step with Step Run, correct it, and test again.",
            ], null, true),
          ] },
          { kind: "problem", part: "Problem 1", title: "Problem 1: an electricity bill", blocks: [
            T("The first 100 units cost 3.00 per unit; every further unit costs 4.50. Read the units used and display the bill."),
            IPO([["Input", "units (int), for example 150"], ["Output", "Bill: 525.00"], ["Processing", "100 × 3.00 + (150 − 100) × 4.50"]]),
          ] },
          { kind: "exercise", part: "Problem 1", title: "Problem 1: write the program", blocks: [
            PQ("Write the program. Use if / else for the two cases.",
              "Units: 150\nBill: 525.00", '#include <stdio.h>\nint main(void) {\n    int units;\n    printf("Units: ");\n    scanf("%d", &units);\n    // compute and display the bill\n    return 0;\n}', ["150"], "if (units <= 100) { bill = units * 3.0; } else { bill = 300.0 + (units - 100) * 4.5; }"),
          ] },
          { kind: "problem", part: "Problem 2", title: "Problem 2: a menu", blocks: [
            T("Repeat: read an operator (+, -, *, /) and two numbers, and display the result. The operator q ends the program."),
            IPO([["Input", "+ 2 3, then / 7 2, then q"], ["Output", "5.00, then 3.50"], ["Processing", "a do-while loop with a switch inside"]]),
          ] },
          { kind: "exercise", part: "Problem 2", title: "Problem 2: write the program", blocks: [
            PQ("Write the program. Read the operator with <code>scanf(\" %c\", &amp;op)</code>, and the two numbers only when op is not q.",
              "+ 2 3\n5.00\n/ 7 2\n3.50\nq", '#include <stdio.h>\nint main(void) {\n    char op;\n    double a, b;\n    // do { ... } while (op != \'q\');\n    return 0;\n}', ["+ 2 3", "/ 7 2", "q"], "Inside the loop: scanf(\" %c\", &op); if (op != 'q') { scanf(\"%lf %lf\", &a, &b); switch (op) { ... } }"),
          ] },
          { kind: "problem", part: "Problem 3", title: "Problem 3: prime numbers", blocks: [
            T("A number greater than 1 is prime when no number from 2 to n − 1 divides it. Display the primes up to 30."),
            IPO([["Input", "none (the limit 30)"], ["Output", "2 3 5 7 11 13 17 19 23 29"], ["Processing", "a function is_prime(n), called for 2 to 30"]]),
          ] },
          { kind: "exercise", part: "Problem 3", title: "Problem 3: write the program", blocks: [
            PQ("Write <code>int is_prime(int n)</code>, which returns 1 or 0. Then display the primes up to 30 on one line.",
              "2 3 5 7 11 13 17 19 23 29", STARTER, null, "In is_prime: for (int d = 2; d < n; d++) { if (n % d == 0) { return 0; } } return 1;"),
          ] },
          { kind: "problem", part: "Problem 4", title: "Problem 4: temperature statistics", blocks: [
            T("Read 6 temperatures into an array. Display the average with 1 decimal, and the number of readings above the average."),
            IPO([["Input", "21.0 23.5 22.0 26.5 24.0 21.0"], ["Output", "Average: 23.0, above: 3"], ["Processing", "one loop for the sum; a second loop to count"]]),
          ] },
          { kind: "exercise", part: "Problem 4", title: "Problem 4: write the program", blocks: [
            PQ("Write the program. The six values are typed on one line.",
              "21.0 23.5 22.0 26.5 24.0 21.0\nAverage: 23.0, above: 3", '#include <stdio.h>\n#define N 6\nint main(void) {\n    double t[N];\n    // read, average, count\n    return 0;\n}', ["21.0 23.5 22.0 26.5 24.0 21.0"], "The average must be known before counting: two loops."),
          ] },
          { kind: "problem", part: "Problem 5", title: "Problem 5: analysing a text", blocks: [
            T("Read a line of text. Count its upper-case letters, digits, and spaces."),
            IPO([["Input", "Motor 3 at 1500 RPM"], ["Output", "upper 4, digits 5, spaces 4"], ["Processing", "fgets, then a loop over the characters with ctype.h"]]),
          ] },
          { kind: "exercise", part: "Problem 5", title: "Problem 5: write the program", blocks: [
            PQ("Write the program. Stop the loop at '\\n' or '\\0', so that the Enter is not counted.",
              "Motor 3 at 1500 RPM\nupper 4, digits 5, spaces 4", '#include <stdio.h>\n#include <ctype.h>\nint main(void) {\n    char s[100];\n    fgets(s, 100, stdin);\n    // count and display\n    return 0;\n}', ["Motor 3 at 1500 RPM"], "isupper(s[i]), isdigit(s[i]), s[i] == ' '"),
          ] },
          { kind: "problem", part: "Problem 6", title: "Problem 6: a stock of parts", blocks: [
            T("A workshop keeps its parts in an array of structs: name, quantity, and price. Display every part whose quantity is below 5, and the total value of the stock."),
            IPO([["Input", "the array in the program (4 parts)"], ["Output", "Reorder: fuse, Reorder: relay, Total: 967.50"], ["Processing", "a loop with if for the reorder list; a function total_value(list, n)"]]),
          ] },
          { kind: "exercise", part: "Problem 6", title: "Problem 6: write the program", blocks: [
            PQ("Write total_value. In main, display the parts whose qty is below 5, then the total.",
              "Reorder: fuse\nReorder: relay\nTotal: 967.50", '#include <stdio.h>\nstruct part { char name[12]; int qty; double price; };\ndouble total_value(struct part list[], int n) {\n    // return the sum of qty * price\n}\nint main(void) {\n    struct part stock[4] = {{"fuse", 3, 12.5}, {"cable", 40, 8.0},\n                            {"relay", 2, 95.0}, {"switch", 12, 35.0}};\n    return 0;\n}', null, "In total_value: double sum = 0; add list[i].qty * list[i].price for every i; return sum;"),
          ] },
          { kind: "problem", part: "Problem 7", title: "Problem 7: statistics through pointers", blocks: [
            T("Write a function that computes the sum and the maximum of an array, and returns both through pointer parameters."),
            IPO([["Input", "the array {12, 7, 30, 18}"], ["Output", "sum 67, max 30"], ["Processing", "void stats(int v[], int n, int *sum, int *max)"]]),
          ] },
          { kind: "exercise", part: "Problem 7", title: "Problem 7: write the program", blocks: [
            PQ("Write stats and a main that calls it and displays both results.",
              "sum 67, max 30", STARTER, null, "In main: int s, m; stats(v, 4, &s, &m); printf(\"sum %d, max %d\\n\", s, m);"),
          ] },
          { kind: "problem", part: "Problem 8", title: "Problem 8: an LED bar", blocks: [
            T("A bar of 8 LEDs is connected to one port. The program switches on 5 LEDs, from bit 0 upward, and displays the port value in binary."),
            IPO([["Input", "the level 5 (in the program)"], ["Output", "the 8 bits of the port, from bit 7 to bit 0"], ["Processing", "the mask (1 &lt;&lt; 5) - 1, then (port &gt;&gt; n) &amp; 1 for n = 7 down to 0"]]),
          ] },
          { kind: "exercise", part: "Problem 8", title: "Problem 8: determine the output", cols: [
            [PAPER],
            [RUN(`#include <stdio.h>
#include <stdint.h>
int main(void) {
    uint8_t port = (1 << 5) - 1;
    for (int n = 7; n >= 0; n--) {
        printf("%d", (port >> n) & 1);
    }
    printf("\\n");
    return 0;
}`)],
          ] },
          { kind: "problem", part: "Problem 9", title: "Problem 9: a status register", blocks: [
            T("A device reports a status byte. Bit 0 means READY, bit 3 ERROR, and bit 5 BUSY. The program tests each bit with &amp; and displays the name of each flag that is set."),
            IPO([["Input", "the status byte 0x21 (in the program)"], ["Output", "the name of each flag that is set, one per line"], ["Processing", "status &amp; (1 &lt;&lt; n) is not 0 only when bit n is 1"]]),
          ] },
          { kind: "exercise", part: "Problem 9", title: "Problem 9: determine the output", blocks: [
            PAPER,
            RUN(`#include <stdio.h>
int main(void) {
    unsigned int status = 0x21;
    if (status & (1 << 0)) { printf("READY\\n"); }
    if (status & (1 << 3)) { printf("ERROR\\n"); }
    if (status & (1 << 5)) { printf("BUSY\\n"); }
    return 0;
}`),
          ] },
          { kind: "summary", title: "Chapter summary", blocks: [
            TB(["Lessons", "Key rules"], [
              ["1–4. Basics", "Compile, then run; declare types; printf and scanf specifiers; int / int; casts."],
              ["5–7. Control and functions", "if, switch with break; while, do-while, for; typed functions; arguments are copied."],
              ["8–11. Data", "Arrays from index 0; strings end with '\\0'; a struct groups members, reached with .; pointers hold addresses, and -&gt; reaches a member through a pointer."],
              ["12–14. Hardware", "Hexadecimal and uint8_t; set, clear, toggle, and test bits; volatile registers; the main loop."],
            ]),
            N("Review each lesson by solving its exercises again without looking at the examples, and use Step Run to find your own errors.", "After this chapter"),
          ] },
        ],
      },
    ],
  });
})();
