"""Trace challenges of Topic 10 (Lesson 15). C programs: their steps come from the C engine of
the site, not from make-trace.py. See the three commands at the top of tools/c-trace.js.

Eight programs, in the order of the lessons; the last two have a missing line. No Python.
Each program has at least one line that is easy to trace wrongly; "about" names it.

Keys of an entry: name, lang="c", side, about, pre (the lines before the shown part), code (the
shown lines), post (the lines after the shown part), hex (variables shown in hexadecimal),
missing (the line that the students write), and expect (the output of a real C compiler).
pre + code + post is the complete program.
A program without its own functions shows only the statements inside main.

Limits that these programs keep (the estimate of make-trace.py, 1188 px):
- side layout with a Condition column: 13.2 px for each character of the longest line, plus
  93 px for each column (more for a long name such as "v (cut)"), is 752 px or less.
  Without a Condition column (no if, no loop): 889 px or less.
- 20 rows at most, about 12 for a harder program;
- every declaration gives its variable a value (an engine row needs an expression on the line);
- a value that a line stores differs from the old value, so that the row shows a change
  (the one exception is line 5 of C_average: the unchanged value is the point of the line);
- every case line of a switch that runs changes a variable (an empty case row is removed);
- no array parameter (v[]), no global variable, no negative division, no value of a comparison
  stored in an int.
"""

MAIN = '#include <stdio.h>\nint main(void) {'
MAIN_STDINT = '#include <stdio.h>\n#include <stdint.h>\nint main(void) {'
END = '    return 0;\n}'

TRACES = [
    dict(name="C_average", lang="c", side=False,
         about="int / int in lines 3, 5, 8, and 9; the position of a cast in lines 6, 7, and 9.",
         pre=MAIN, post=END, expect="28 2.00\n", code=r'''
int sum = 29;
int n = 4;
double avg = sum / n;
int rem = sum % n;
avg = avg + rem / n;
avg = (double) sum / n;
n = (int) avg * 2;
rem = sum / n * n;
avg = (double) (sum / n);
printf("%d %.2f\n", rem, avg);
'''),
    dict(name="C_charge", lang="c", side=True,
         about="An else-if chain without else in a while loop: 70 < 70 is false, so no block of the chain runs; the separate if still runs.",
         pre=MAIN, post=END, expect="100 30\n", code=r'''
int level = 35;
int step = 0;
while (level < 90) {
    if (level < 40) {
        step = 40;
    } else if (level < 70) {
        step = 30;
    }
    if (step > 30) {
        step -= 5;
    }
    level += step;
}
printf("%d %d\n", level, step);
'''),
    dict(name="C_modes", lang="c", side=True,
         about="do-while with a switch: cases without break continue into the next case; break leaves the switch, not the loop.",
         pre=MAIN, post=END, expect="0 19\n", code=r'''
int mode = 3;
int sum = 0;
do {
    switch (mode) {
        case 3: sum += 8;
        case 2: sum += 4; break;
        case 1: sum += 2;
        default: sum += 1;
    }
    mode--;
} while (mode > 0);
printf("%d %d\n", mode, sum);
'''),
    dict(name="C_grid", lang="c", side=True,
         about="Nested for loops: break ends only the inner loop; continue jumps to r++.",
         pre=MAIN, post=END, expect="1\n", code=r'''
int sum = 0;
for (int r = 1; r <= 2; r++) {
    if (r == 2) {
        continue;
    }
    for (int c = 1; c <= 2; c++) {
        if (c > r) {
            break;
        }
        sum += r * c;
    }
}
printf("%d\n", sum);
'''),
    dict(name="C_boxes", lang="c", side=True,
         about="Copies: a struct copy is independent, an argument is a copy (a.w stays 9), and line 10 does not store the result.",
         pre='#include <stdio.h>', post='', expect="6\n", code=r'''
struct box { int w; int h; };
int cut(int v) {
    v = v - 2;
    return v;
}
int main(void) {
    struct box a = {9, 4};
    struct box b = a;
    b.w = cut(a.w);
    cut(b.h);
    a.h = a.w - b.w + b.h;
    printf("%d\n", a.h);
    return 0;
}
'''),
    dict(name="C_add", lang="c", side=True,
         about="A pointer parameter changes the caller's element; n is a copy; the name t is the address of t[0].",
         pre='#include <stdio.h>', post='', expect="10 14\n", code=r'''
void add(int *p, int n) {
    *p = *p + n;
    n = 0;
}
int main(void) {
    int t[2] = {3, 4};
    add(&t[1], t[0]);
    add(t, t[1]);
    add(&t[1], t[1]);
    printf("%d %d\n", t[0], t[1]);
    return 0;
}
'''),
    dict(name="C_time", lang="c", side=True, missing=[4, 5],
         about="Missing lines 4 and 5: the element keeps the rest of the division by 60. The second repetition uses the new value of t[1], 60.",
         pre=MAIN, post=END, expect="2 0\n15\n", code=r'''
int t[3] = {75, 59, 1};
int i = 0;
while (i < 2) {
    t[i + 1] += t[i] / 60;
    t[i] = t[i] % 60;
    i++;
}
printf("%d %d\n", t[2], t[1]);
printf("%d\n", t[0]);
'''),
    dict(name="C_bits", lang="c", side=True, hex=["reg", "mask"], missing=[6, 8],
         about="Missing lines 6 and 8: AND with the inverted mask clears one bit. 0x80 << 1 is 0 in a uint8_t; 255 + 1 wraps around to 0.",
         pre=MAIN_STDINT, post=END, expect="1A 0\n", code=r'''
uint8_t reg = 0x5A;
uint8_t mask = 0x40;
uint8_t n = 254;
while (mask != 0) {
    if (reg & mask) {
        reg &= ~mask;
    }
    mask = mask << 1;
    n++;
}
printf("%02X %d\n", reg, n);
'''),
]
