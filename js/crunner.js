/* ============================================================
   crunner.js - in-browser C via JSCPP.
   Lazy-loaded from CDN on first C Run. Captures stdout/stderr,
   feeds stdin from opts.inputs. Mirrors App.py.run's contract so
   editor.js can call either engine the same way.
   ============================================================ */
App.c = {
  _loading: null,
  _url: "https://cdn.jsdelivr.net/npm/JSCPP@2.0.6/dist/JSCPP.es5.min.js",

  /* The learner's code is rewritten before JSCPP parses it, so that JSCPP behaves
     like a C compiler for the course material. Every rewrite keeps the line numbers,
     so error messages and Step Run point at the learner's own lines.
     - A call to an undeclared function is reported, as C99 does (_checkDeclared).
     - #include <stdint.h> becomes typedefs for uint8_t ... int32_t (JSCPP has no stdint.h).
     - volatile is removed: in the browser no hardware changes a value.
     - enum constants become const int variables, and "enum name" becomes int (JSCPP has no enum).
     - A struct definition is read into _structs and replaced by a declaration of its name:
       JSCPP parses the definition but drops the members (see _defineStructs).
     - A static local variable becomes a global with a private name (JSCPP would reset it).
     - s == "text" becomes 0, and != becomes 1: C compares two addresses there.
     - f(void) becomes f(): JSCPP rejects the empty parameter list.
     - A 2D initializer {{...}, {...}} becomes one assignment per element.
     - fgets(line, n, stdin): stdin becomes 0 (see _patch).
     - A top-level prototype is blanked: JSCPP would count it as a second overload.
     - Spaces inside string literals become \x20: JSCPP's tokenizer drops them. */
  // JSCPP does not accept typedef names in casts or sizeof, so the names are replaced by their types
  STDINT: { uint8_t: "unsigned char", int8_t: "signed char", uint16_t: "unsigned short",
    int16_t: "short", uint32_t: "unsigned int", int32_t: "int" },
  _types(code) {
    const names = ["void", "int", "double", "float", "char", "bool", "long", "short",
      "uint8_t", "int8_t", "uint16_t", "int16_t", "uint32_t", "int32_t"];
    (code.match(/\btypedef\b[^;{]*?(\w+)\s*;/g) || []).forEach((t) => names.push(t.match(/(\w+)\s*;$/)[1]));
    (code.match(/\}\s*(\w+)\s*;/g) || []).forEach((t) => names.push(t.match(/(\w+)\s*;$/)[1]));   // typedef enum { } Name;
    return "(?:(?:const|unsigned|signed|static)\\s+)*(?:struct\\s+\\w+|" + names.join("|") + ")";
  },
  // replace a regular expression in the parts of a line that are not string or char literals
  _outsideLiterals(line, re, rep) {
    return line.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/).map((part, k) => (k % 2 ? part : part.replace(re, rep))).join("");
  },
  _checkDeclared(code, types) {
    const lines = code.split("\n");
    const head = new RegExp("^" + types + "\\s*\\*?\\s*(\\w+)\\s*\\(([^;{]*)\\)\\s*([;{]?)");
    const defs = {}, protos = {};
    lines.forEach((ln, i) => {
      const m = ln.match(head);
      if (!m || m[1] === "main") return;
      if (m[3] === ";") { if (!(m[1] in protos)) protos[m[1]] = i; }
      else if (!(m[1] in defs)) defs[m[1]] = { line: i, head: ln.replace(/\s*\{.*$/, "").trim() };
    });
    Object.keys(defs).forEach((name) => {
      const first = Math.min(defs[name].line, name in protos ? protos[name] : Infinity);
      const re = new RegExp("\\b" + name + "\\s*\\(");
      for (let i = 0; i < first; i++) {
        if (re.test(lines[i].replace(/"(?:\\.|[^"\\])*"/g, '""'))) {
          throw new Error("Error: line " + (i + 1) + ": the function " + name + " is used before it is declared.\n" +
            "Define it above this line, or declare it with a prototype: " + defs[name].head + ";");
        }
      }
    });
  },
  _enums(code) {
    // enum name { A, B = 5, C };   typedef enum { ... } Name;   typedef enum name { ... } Name;
    code = code.replace(/\b(typedef\s+)?enum\s*(\w*)\s*\{([^{}]*)\}\s*(\w*)\s*;/g, (all, td, tag, body, alias) => {
      let next = 0, base = null;
      const decls = body.split(",").map((s) => s.trim()).filter(Boolean).map((item) => {
        const m = item.match(/^(\w+)\s*(?:=\s*(.+))?$/);
        let value;
        if (m[2] !== undefined) {
          const v = m[2].trim();
          if (/^(0x[0-9a-f]+|\d+)$/i.test(v)) { next = parseInt(v); base = null; value = String(next); }
          else { base = v; next = 0; value = v; }
        } else value = base === null ? String(next) : "(" + base + ") + " + next;
        next++;
        return "const int " + m[1] + " = " + value + ";";
      });
      return decls.join(" ") + (td && alias ? " typedef int " + alias + ";" : "") + "\n".repeat((all.match(/\n/g) || []).length);
    });
    return code.replace(/\benum\s+\w+\b/g, "int");
  },
  // struct tag { members } vars;   typedef struct [tag] { members } Name;
  _structDefs(code) {
    const macros = {};
    (code.match(/^[ \t]*#define[ \t]+\w+[ \t]+\S[^\n]*/gm) || []).forEach((d) => {
      const m = d.match(/#define\s+(\w+)\s+(.*?)\s*$/);
      macros[m[1]] = m[2];
    });
    const size = (expr) => {
      const e = expr.replace(/\b[A-Za-z_]\w*\b/g, (w) => (w in macros ? "(" + macros[w] + ")" : w));
      return /^[\d\s+\-*/()]+$/.test(e) ? Math.floor(Function("return (" + e + ");")()) : NaN;
    };
    const lineOf = (pos) => code.slice(0, pos).split("\n").length;
    const structs = this._structs = [];
    let anon = 0, out = "", last = 0, m;
    const head = /\b(typedef\s+)?struct\b\s*(\w*)\s*\{([^{}]*)\}/g;
    while ((m = head.exec(code))) {
      // the declaration ends at the next ; outside braces: struct p { ... } a, b = {3, 4};
      let end = head.lastIndex, depth = 0;
      while (end < code.length && !(code[end] === ";" && depth === 0)) {
        if (code[end] === "{") depth++;
        else if (code[end] === "}") depth--;
        end++;
      }
      const all = code.slice(m.index, end + 1);
      if (/[()]/.test(code.slice(head.lastIndex, end))) {
        throw new Error("Error: line " + lineOf(head.lastIndex - 1) + ": a ; is missing after the } that ends struct " +
          (m[2] || "") + ". Write }; at the end of a struct definition.");
      }
      const text = define(all, m[1], m[2], m[3], code.slice(head.lastIndex, end).trim(), m.index);
      if (text === null) continue;
      out += code.slice(last, m.index) + text + "\n".repeat((all.match(/\n/g) || []).length - (text.match(/\n/g) || []).length);
      last = end + 1;
      head.lastIndex = end + 1;
    }
    return out + code.slice(last);
    function define(all, td, tag, body, after, pos) {
      if (td && !/^\w+$/.test(after)) return null;
      const name = "struct " + (tag || (td ? after : "__anon" + ++anon));
      const members = [];
      const member = (stars, id, dims, decl) => {
        const sizes = (dims.match(/\[[^\]]*\]/g) || []).map((d) => size(d.slice(1, -1)));
        if (sizes.some((n) => !(n > 0))) {
          throw new Error("Error: line " + lineOf(pos) + ": the size of the array member " + id + " must be a number or a #define.");
        }
        members.push({ name: id, base: decl, stars: stars.length, dims: sizes });
      };
      body.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "").split(";").map((s) => s.trim()).filter(Boolean).forEach((decl) => {
        const parts = decl.split(",");
        const first = parts[0].match(/^([\w\s]*?\w)\s*(\**)\s*(\w+)\s*((?:\[[^\]]*\])*)$/);
        if (!first) throw new Error("Error: line " + lineOf(pos) + ": this struct member cannot be run in the browser: " + decl.replace(/\s+/g, " "));
        const base = first[1].replace(/\s+/g, " ");
        member(first[2], first[3], first[4], base);
        parts.slice(1).forEach((p) => {
          const m = p.trim().match(/^(\**)\s*(\w+)\s*((?:\[[^\]]*\])*)$/);
          if (!m) throw new Error("Error: line " + lineOf(pos) + ": this struct member cannot be run in the browser: " + p.trim());
          member(m[1], m[2], m[3], base);
        });
      });
      structs.push({ name, members });
      if (td) return "typedef " + name + " " + after + ";";
      return after ? name + " " + after + ";" : "";
    }
  },
  _statics(code, types) {
    const lines = code.split("\n");
    const head = new RegExp("^" + types + "\\s*\\*?\\s*(\\w+)\\s*\\([^;{]*\\)\\s*\\{");
    const decl = new RegExp("^\\s*static\\s+(" + types.replace("static|", "") + ")\\s+(\\w+)\\s*(?:=\\s*([^;]+))?;\\s*(?://.*)?$");
    for (let i = 0; i < lines.length; i++) {
      const h = lines[i].match(head);
      if (!h) continue;
      let depth = 0, end = i;
      for (let j = i; j < lines.length; j++) {
        const bare = lines[j].replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*$/g, "");
        depth += (bare.match(/\{/g) || []).length - (bare.match(/\}/g) || []).length;
        if (depth === 0 && j > i) { end = j; break; }
        end = j;
      }
      for (let j = i + 1; j < end; j++) {
        const d = lines[j].match(decl);
        if (!d) continue;
        const global = "s__" + h[1] + "__" + d[2];
        lines[i] = d[1] + " " + global + " = " + (d[3] ? d[3].trim() : "0") + "; " + lines[i];
        lines[j] = "";
        const re = new RegExp("\\b" + d[2] + "\\b", "g");
        for (let k = j + 1; k <= end; k++) lines[k] = this._outsideLiterals(lines[k], re, global);
      }
    }
    return lines.join("\n");
  },
  _prep(code) {
    const types = this._types(code);
    this._checkDeclared(code, types);
    if (/^[ \t]*#include\s*<stdint\.h>/m.test(code)) {
      code = code.replace(/^[ \t]*#include\s*<stdint\.h>[ \t]*$/m, "");
      const re = /\b(u?int(?:8|16|32)_t)\b/g;
      code = code.split("\n").map((ln) => (/^\s*#/.test(ln) ? ln : this._outsideLiterals(ln, re, (t) => this.STDINT[t]))).join("\n");
    }
    code = code.replace(/\bvolatile\s+/g, "");
    code = this._enums(code);
    code = this._structDefs(code);
    code = this._statics(code, types);
    const lit = '"(?:\\\\.|[^"\\\\])*"', operand = "\\b\\w+(?:\\[[^\\]]*\\])?(?:(?:\\.|->)\\w+(?:\\[[^\\]]*\\])?)*";
    code = code.replace(new RegExp(operand + "\\s*(==|!=)\\s*" + lit + "|" + lit + "\\s*(==|!=)\\s*" + operand, "g"),
      (all, op1, op2) => ((op1 || op2) === "==" ? "0" : "1"));
    code = code.replace(/(\w)\s*\(\s*void\s*\)/g, "$1()");
    code = code.replace(/\b((?:int|double|float|long|short|char)\s+(\w+)\s*\[[^\]]*\]\s*\[[^\]]*\])\s*=\s*\{((?:\s*\{[^{}]*\}\s*,?)+)\s*\}\s*;/g, (all, decl, name, rows) => {
      const sets = [];
      (rows.match(/\{[^{}]*\}/g) || []).forEach((row, r) => row.slice(1, -1).split(",").map((v) => v.trim()).filter((v) => v !== "")
        .forEach((v, c) => sets.push(name + "[" + r + "][" + c + "] = " + v + ";")));
      return decl + "; " + sets.join(" ") + "\n".repeat((all.match(/\n/g) || []).length);
    });
    code = code.replace(/,\s*stdin\s*\)/g, ", 0)");
    // JSCPP's preprocessor also replaces macro names inside string literals ("READY" would
    // print the value of #define READY). The first letter of such a name inside a string is
    // written as a \xHH escape (JSCPP reads exactly two hex digits, as JavaScript does),
    // which prints the same character but hides the name.
    const macros = (code.match(/^[ \t]*#define\s+(\w+)/gm) || []).map((d) => d.match(/(\w+)$/)[1]);
    if (macros.length) {
      const nameRe = new RegExp("\\b(" + macros.join("|") + ")\\b", "g");
      code = code.split("\n").map((ln) => (/^\s*#/.test(ln) ? ln : ln.replace(/"(?:\\.|[^"\\])*"/g, (lit) =>
        lit.replace(nameRe, (m) => "\\x" + m.charCodeAt(0).toString(16).padStart(2, "0") + m.slice(1))))).join("\n");
    }
    code = code.replace(new RegExp("^" + types + "\\s*\\*?\\s*\\w+\\s*\\([^;{}]*\\)\\s*;[ \\t]*(?://[^\\n]*)?$", "gm"), "");
    let out = "", i = 0;
    const n = code.length;
    while (i < n) {
      const ch = code[i];
      if (ch === '"') {
        out += ch; i++;
        while (i < n) {
          const c = code[i];
          if (c === "\\") { out += c + (code[i + 1] || ""); i += 2; continue; }
          if (c === '"') { out += c; i++; break; }
          if (c === " ") { out += "\\x20"; i++; continue; }
          out += c; i++;
        }
        continue;
      }
      if (ch === "'") {
        out += ch; i++;
        while (i < n) {
          const c = code[i];
          if (c === "\\") { out += c + (code[i + 1] || ""); i += 2; continue; }
          out += c; i++;
          if (c === "'") break;
        }
        continue;
      }
      out += ch; i++;
    }
    return out;
  },

  /* JSCPP is a C++ interpreter. Some of its library and runtime behaviours differ
     from C; _patch fixes them for every run without changing the learner's code:
     1. printf: a comparison gives a C++ bool (true/false), which printf("%d")
        rejects. In C a comparison gives the int 1 or 0, so booleans are passed
        as 1 or 0.
     2. scanf: JSCPP cannot store into an array element (&nums[i]) and reads
        stdin silently. The replacement reads the queued inputs one line at a
        time, echoes each line as a terminal would, and stores through both
        kinds of pointer (a variable, or an array element / char array).
     3. fgets(line, n, stdin) is missing. It reads one line, keeping its "\n".
     4. <stdbool.h> is missing; bool, true and false are built in.
     5. strcat and strcmp fail inside JSCPP; they are replaced as well.
     6. An integer value outside the range of its type raises "overflow". In C it
        wraps around (uint8_t 255 + 1 is 0), which programs for hardware rely on.
     7. struct: JSCPP has class values ({ members }) but no struct definitions.
        The definitions read by _structDefs are registered for each run.
     8. Pointers: p = a shared the position of a, so p++ also moved a; p += n
        and p != q failed; 0 could not be stored in a pointer or compared with one. */
  _patch(JS) {
    if (JS._pclPatched) return;
    JS._pclPatched = true;
    const self = this;
    JS.includes["stdbool.h"] = { load() {} };
    const wrapLoad = (inc, replace, extra) => {
      if (inc._pclWrapped) return;
      inc._pclWrapped = true;
      const orig = inc.load;
      inc.load = function (rt) {
        const reg = rt.regFunc;
        rt.regFunc = function (f, scope, name, ...rest) {
          if (replace[name]) f = replace[name](f);
          return reg.call(this, f, scope, name, ...rest);
        };
        let r;
        try { r = orig.call(this, rt); } finally { rt.regFunc = reg; }
        if (extra) extra(rt);
        return r;
      };
    };
    const stdio = {
      printf: (f) => self._printf(f),
      scanf: () => (rt, _this, fmt, ...ptrs) => self._scanf(rt, fmt, ptrs),
    };
    const addFgets = (rt) => {
      self._wrapIntegers(rt);
      self._fixPointers(rt);
      self._defineStructs(rt);
      const charPtr = rt.normalPointerType(rt.charTypeLiteral);
      rt.regFunc((rt2, _this, buf, size) => self._fgets(rt2, buf, size), "global", "fgets", [charPtr, "?"], charPtr);
    };
    const cstring = {
      strcmp: () => (rt, _this, a, b) => {
        const x = rt.getStringFromCharArray(a), y = rt.getStringFromCharArray(b);
        return rt.val(rt.intTypeLiteral, x < y ? -1 : x > y ? 1 : 0);
      },
      strcat: () => (rt, _this, dest, src) => self._putString(rt, dest, rt.getStringFromCharArray(dest) + rt.getStringFromCharArray(src), "strcat"),
    };
    ["stdio.h", "cstdio"].forEach((n) => JS.includes[n] && wrapLoad(JS.includes[n], stdio, addFgets));
    ["string.h", "cstring"].forEach((n) => JS.includes[n] && wrapLoad(JS.includes[n], cstring));
  },
  /* 6: wrap integer values into the range of their type, as C does */
  _wrapIntegers(rt) {
    const proto = Object.getPrototypeOf(rt);
    if (!proto._pclWrap) this._wrapValues(proto);
    // ++ and -- have their own range check, in the operator table of this run
    Object.keys(rt.types).forEach((key) => {
      const ops = rt.types[key];
      ["o(++)", "o(--)"].forEach((op) => {
        if (!ops || !ops[op] || !ops[op]["#default"] || ops[op]._pcl) return;
        const orig = ops[op]["#default"];
        ops[op]["#default"] = function (rt2, b, post) {
          if (!b || !b.left || !rt2.isPrimitiveType(b.t) || !rt2.isIntegerType(b.t) || b.t.name === "char" || b.t.name === "bool") {
            return orig.apply(this, arguments);
          }
          const old = b.v;
          b.v = proto._pclWrap.call(rt2, b.t, b.v + (op === "o(++)" ? 1 : -1));
          return post ? rt2.val(b.t, old) : b;
        };
        ops[op]._pcl = true;
      });
      // << and >> take the promoted type of the left operand; >> is a logical shift for unsigned
      ["o(<<)", "o(>>)"].forEach((op) => {
        if (!ops || !ops[op] || !ops[op]["#default"] || ops[op]._pcl) return;
        const orig = ops[op]["#default"];
        ops[op]["#default"] = function (rt2, b, c) {
          if (!b || !c || !rt2.isIntegerType(b.t) || !rt2.isIntegerType(c.t)) return orig.apply(this, arguments);
          const t = rt2._pclPromote(b.t);
          const v = op === "o(<<)" ? b.v << c.v : (rt2.isUnsignedType(t) ? b.v >>> c.v : b.v >> c.v);
          return rt2.val(t, v);
        };
        ops[op]._pcl = true;
      });
    });
  },
  _wrapValues(proto) {
    const wrap = function (type, v) {
      if (!this.isPrimitiveType(type) || !this.isIntegerType(type) || type.name === "char" || type.name === "bool") return v;
      if (typeof v !== "number" || !Number.isInteger(v) || this.inrange(type, v)) return v;
      const lim = this.config.limits[type.name];
      if (!lim) return v;
      const m = Math.pow(2, 8 * lim.bytes);
      let x = ((v % m) + m) % m;
      if (x > lim.max) x -= m;
      return this.inrange(type, x) ? x : v;
    };
    proto._pclWrap = wrap;
    // C's integer promotion: in arithmetic, a type smaller than int becomes int
    // (JSCPP keeps unsigned char, short, ... and would cut (high << 8) to 8 bits).
    const small = new Set(["bool", "char", "signed char", "unsigned char", "short", "short int", "signed short",
      "signed short int", "unsigned short", "unsigned short int"]);
    proto._pclPromote = function (t) { return this.isPrimitiveType(t) && small.has(t.name) ? this.intTypeLiteral : t; };
    const promote = proto.promoteNumeric;
    proto.promoteNumeric = function (a, b) { return promote.call(this, this._pclPromote(a), this._pclPromote(b)); };
    const val = proto.val, cast = proto.cast;
    proto.val = function (type, v, left) { return val.call(this, type, wrap.call(this, type, v), left); };
    proto.cast = function (type, value) {
      if (value && this.isPrimitiveType(type) && this.isIntegerType(type) && value.t && this.isIntegerType(value.t)) {
        const w = wrap.call(this, type, value.v);
        if (w !== value.v) value = { t: value.t, v: w, left: value.left };
      }
      return cast.call(this, type, value);
    };
  },
  /* 8: every pointer variable gets its own pointer value; the broken pointer operators are replaced */
  _fixPointers(rt) {
    const proto = Object.getPrototypeOf(rt);
    if (!proto._pclPointers) {
      proto._pclPointers = true;
      const own = (v) => (v && v.t && v.t.type === "pointer" && v.v && typeof v.v === "object" ? { t: v.t, v: Object.assign({}, v.v), left: v.left } : v);
      const clone = proto.clone;
      proto.clone = function (v) { return own(clone.call(this, v)); };
      const cast = proto.cast;
      proto.cast = function (type, value) {
        if (type && type.type === "pointer" && type.ptrType === "normal" && value && value.t && this.isPrimitiveType(value.t) &&
            this.isIntegerType(value.t) && value.v === 0) {
          return this.val(type, this.makeNormalPointerValue(null));   // p = 0
        }
        return cast.call(this, type, value);
      };
    }
    const P = rt.types.pointer, A = rt.types.pointer_array;
    if (P._pcl) return;
    P._pcl = true;
    const isNull = (p) => !p.v || p.v.target === null || p.v.target === undefined;
    // comparisons and p - q gave bare JavaScript values; in C they are ints
    const toInt = (rt2, x) => (typeof x === "boolean" ? rt2.val(rt2.intTypeLiteral, x ? 1 : 0)
      : typeof x === "number" ? rt2.val(rt2.intTypeLiteral, x) : x);
    const eq = P["o(==)"]["#default"];
    const same = (rt2, l, r) => (r && r.t && rt2.isPrimitiveType(r.t) ? r.v === 0 && isNull(l) : !!eq(rt2, l, r));   // p == 0
    P["o(==)"]["#default"] = (rt2, l, r) => toInt(rt2, same(rt2, l, r));
    P["o(!=)"]["#default"] = (rt2, l, r) => toInt(rt2, !same(rt2, l, r));
    ["o(<)", "o(>)", "o(<=)", "o(>=)", "o(-)"].forEach((op) => {
      const f = A[op]["#default"];
      A[op]["#default"] = function (rt2, l, r) { return toInt(rt2, f.call(this, rt2, l, r)); };
    });
    const assign = P["o(=)"]["#default"];
    P["o(=)"]["#default"] = function (rt2, l, r) {
      const res = assign.call(this, rt2, l, r);
      if (l.v && typeof l.v === "object") l.v = Object.assign({}, l.v);
      return res;
    };
    A["o(+=)"]["#default"] = (rt2, l, r) => P["o(=)"]["#default"](rt2, l, A["o(+)"]["#default"](rt2, l, r));
    A["o(-=)"]["#default"] = (rt2, l, r) => P["o(=)"]["#default"](rt2, l, A["o(-)"]["#default"](rt2, l, r));
  },
  /* 7: struct types. A struct value is { t: {type:"class", name:"struct tag"}, v: { members } };
     each member is an ordinary JSCPP value, so ., ->, &, scanf and printf work on members. */
  _defineStructs(rt) {
    const self = this;
    const proto = Object.getPrototypeOf(rt);
    if (!proto._pclIsStruct) this._structProto(proto);
    // in the first run the preprocessor set rt.interp before the setter existed
    if (Object.prototype.hasOwnProperty.call(rt, "interp")) { const it = rt.interp; delete rt.interp; rt.interp = it; }
    // the type table is shared by all runs: remove the structs of an earlier program
    Object.keys(rt.types).forEach((k) => { if (rt.types[k] && rt.types[k]._pclStruct) delete rt.types[k]; });
    const noCompare = { "#default": (rt2) => rt2.raiseException("two structs cannot be compared with == or !=; compare their members") };
    (this._structs || []).forEach((def) => {
      rt.types[rt.getTypeSignature({ type: "class", name: def.name })] = {
        _pclStruct: def,
        "o(&)": { "#default": (rt2, l, r) => {
          if (r !== undefined) return rt2.raiseException("& cannot be used on a struct");
          if (l.array) return rt2.val(rt2.arrayPointerType(l.t, l.array.length), rt2.makeArrayPointerValue(l.array, l.arrayIndex));
          return rt2.val(rt2.normalPointerType(l.t), rt2.makeNormalPointerValue(l));
        } },
        "o(=)": { "#default": (rt2, l, r) => {
          if (!l.left) return rt2.raiseException("the left side of = is not a variable");
          if (!r || !r.t || r.t.type !== "class" || r.t.name !== l.t.name) {
            return rt2.raiseException("a " + (r && r.t ? rt2.makeTypeString(r.t) : "value") + " cannot be stored in a " + l.t.name);
          }
          self._assignInto(rt2, l, r);
          return l;
        } },
        "o(==)": noCompare,
        "o(!=)": noCompare,
      };
    });
  },
  _structProto(proto) {
    const self = this;
    proto._pclIsStruct = function (t) {
      return !!(t && t.type === "class" && (this.types[this.getTypeSignature(t)] || {})._pclStruct);
    };
    const defaultValue = proto.defaultValue;
    proto.defaultValue = function (type, left) {
      if (!this._pclIsStruct(type)) return defaultValue.call(this, type, left);
      const members = {};
      self._members(this, type).forEach((m) => { members[m.name] = this.defaultValue(m.type, true); });
      return { t: type, v: { members }, left: !!left };
    };
    // a struct is copied when it is passed, returned, or used as an initial value
    const cast = proto.cast;
    proto.cast = function (type, value) {
      if (!this._pclIsStruct(type)) return cast.call(this, type, value);
      if (!value || !value.t || value.t.type !== "class" || value.t.name !== type.name) {
        return this.raiseException("a " + (value && value.t ? this.makeTypeString(value.t) : "value") + " cannot be used as a " + type.name);
      }
      return self._copy(this, value);
    };
    const getMember = proto.getMember;
    proto.getMember = function (l, r) {
      const t = l && l.t;
      if (this._pclIsStruct(t)) {
        if (!(r in l.v.members)) return this.raiseException(t.name + " has no member named " + r);
        return l.v.members[r];
      }
      if (t && t.type === "pointer" && this._pclIsStruct(t.ptrType === "array" ? t.eleType : t.targetType)) {
        return this.raiseException(t.ptrType === "array"
          ? "an array of structs needs an index before the dot, for example list[i]." + r
          : "this is a pointer to a struct: use -> instead of . (p->" + r + ")");
      }
      if (t && t.type !== "class") return this.raiseException("only a struct has members: ." + r + " cannot be used here");
      return getMember.call(this, l, r);
    };
    const makeValueString = proto.makeValueString;
    proto.makeValueString = function (l, options) {
      if (!l || !this._pclIsStruct(l.t)) return makeValueString.call(this, l, options);
      return "{" + self._members(this, l.t).map((m) => m.name + " = " +
        this.makeValueString(l.v.members[m.name], Object.assign({}, options))).join(", ") + "}";
    };
    const getSizeByType = proto.getSizeByType;
    proto.getSizeByType = function (type) {
      return this._pclIsStruct(type) ? self._layout(this, type).size : getSizeByType.call(this, type);
    };
    // Interpreter.run sets rt.interp: its visitors get struct initializers {...} and a checked ->
    Object.defineProperty(proto, "interp", {
      configurable: true,
      get() { return this._pclInterp; },
      set(interp) { this._pclInterp = interp; if (interp) self._patchInterp(interp); },
    });
  },
  // the members of a struct type with their JSCPP types (resolved once per run, after the typedefs)
  _members(rt, type) {
    const def = rt.types[rt.getTypeSignature(type)]._pclStruct;
    if (!def.resolved) {
      def.resolved = def.members.map((m) => {
        let t;
        try { t = rt.simpleType(m.base.split(" ")); } catch (e) { return rt.raiseException("unknown type " + m.base + " in " + def.name); }
        for (let i = 0; i < m.stars; i++) t = rt.normalPointerType(t);
        for (let i = m.dims.length - 1; i >= 0; i--) t = rt.arrayPointerType(t, m.dims[i]);
        return { name: m.name, type: t };
      });
    }
    return def.resolved;
  },
  // size and alignment as a C compiler lays the members out
  _layout(rt, type) {
    if (rt.isPrimitiveType(type)) { const b = rt.config.limits[type.name].bytes; return { size: b, align: b }; }
    if (type.type === "pointer" && type.ptrType === "array") {
      const e = this._layout(rt, type.eleType);
      return { size: e.size * type.size, align: e.align };
    }
    if (type.type === "pointer") { const b = rt.config.limits.pointer.bytes; return { size: b, align: b }; }
    let size = 0, align = 1;
    this._members(rt, type).forEach((m) => {
      const x = this._layout(rt, m.type);
      size = Math.ceil(size / x.align) * x.align + x.size;
      align = Math.max(align, x.align);
    });
    return { size: Math.ceil(size / align) * align, align };
  },
  // a copy of a value: the arrays and structs inside a struct are copied too, as in C
  _copy(rt, v, left) {
    if (rt._pclIsStruct(v.t)) {
      const members = {};
      Object.keys(v.v.members).forEach((k) => { members[k] = this._copy(rt, v.v.members[k], true); });
      return { t: v.t, v: { members }, left: !!left };
    }
    if (v.t.type === "pointer" && v.t.ptrType === "array") {
      return { t: v.t, v: { target: v.v.target.map((e) => this._copy(rt, e, true)), position: v.v.position }, left: !!left };
    }
    return { t: v.t, v: v.v, left: !!left };
  },
  // a = b for structs: the values are copied into a's own members, so pointers to them stay valid
  _assignInto(rt, dst, src) {
    if (rt._pclIsStruct(dst.t)) {
      Object.keys(dst.v.members).forEach((k) => this._assignInto(rt, dst.v.members[k], src.v.members[k]));
    } else if (dst.t.type === "pointer" && dst.t.ptrType === "array") {
      dst.v.target.forEach((e, i) => this._assignInto(rt, e, src.v.target[i]));
    } else {
      dst.v = src.v;
    }
  },
  _patchInterp(interp) {
    const self = this;
    const V = interp.visitors;
    if (V._pcl || !V.Declaration) return;   // the preprocessor has an interpreter of its own
    V._pcl = true;
    const declaration = V.Declaration;
    // JSCPP's generators are transpiled; Interpreter.visit tells them apart by their constructor
    const visitor = (fn) => Object.defineProperty(fn, "constructor", { value: declaration.constructor });
    V.Declaration = visitor(function* (it, s, param) {
      if (!s._pclDone) { s._pclDone = true; self._structInitializers(it.rt, s); }
      return yield* declaration(it, s, param);
    });
    V.PclStructInit = visitor(function* (it, s, param) {
      const value = it.rt.defaultValue(s.structType, false);
      yield* self._initInto(it, value, s.structType, s.init, param);
      return value;
    });
    V.PostfixExpression_MemberPointerAccess = visitor(function* (it, s, param) {
      const rt = it.rt;
      const p = yield* it.visit(it, s.Expression, param);
      if (rt._pclIsStruct(p.t)) return rt.raiseException("this is a struct, not a pointer: use . instead of -> (." + s.member + ")");
      if (!rt.isPointerType(p.t) || rt.isFunctionType(p.t)) return rt.raiseException("-> needs a pointer to a struct");
      if (p.t.ptrType === "normal" && !p.v.target) return rt.raiseException("the pointer does not point to a struct yet (->" + s.member + ")");
      return rt.getFunc(p.t, rt.makeOperatorFuncName("->"), [])(rt, p, s.member);
    });
  },
  // struct s = {...} and struct list[n] = {{...}, ...}: each {...} of a struct becomes a PclStructInit node
  _structInitializers(rt, s) {
    let base;
    try { base = rt.simpleType(s.DeclarationSpecifiers); } catch (e) { return; }
    if (!rt._pclIsStruct(base)) return;
    s.InitDeclaratorList.forEach((dec) => {
      const init = dec.Initializers;
      if (!init || init.type !== "Initializer_array" || dec.Declarator.Pointer) return;
      const dims = (dec.Declarator.right || []).filter((r) => r.type === "DirectDeclarator_modifier_array").length;
      const wrap = (node) => {
        const e = { type: "PclStructInit", structType: base, init: node };
        Object.keys(node).forEach((k) => { if (/^[se](Line|Column|Offset)$/.test(k)) e[k] = node[k]; });
        return { type: "Initializer_expr", Expression: e };
      };
      const walk = (node, depth) => {
        if (depth === dims) return node.type === "Initializer_array" ? wrap(node) : node;
        if (node.type === "Initializer_array") node.Initializers = node.Initializers.map((n) => walk(n, depth + 1));
        return node;
      };
      dec.Initializers = walk(init, 0);
    });
  },
  // store one initializer (an expression, a string, or {...}) into a member of the given type
  *_initInto(interp, target, type, node, param) {
    const rt = interp.rt;
    if (node.type === "Initializer_expr") {
      const x = yield* interp.visit(interp, node.Expression, param);
      if (rt.isArrayType(type)) {
        if (!rt.isCharType(type.eleType) || !x || !rt.isArrayType(x.t)) return rt.raiseException("an array member needs { } or a string");
        const text = rt.getStringFromCharArray(x);
        if (text.length > type.size) return rt.raiseException("the string \"" + text + "\" does not fit in char[" + type.size + "]");
        target.v.target.forEach((c, i) => { c.v = i < text.length ? text.charCodeAt(i) : 0; });
      } else if (rt._pclIsStruct(type)) {
        this._assignInto(rt, target, rt.cast(type, x));
      } else {
        target.v = rt.cast(type, x).v;
      }
      return;
    }
    const items = node.Initializers || [];
    if (rt._pclIsStruct(type)) {
      const members = this._members(rt, type);
      if (items.length > members.length) return rt.raiseException("too many values in the initializer of " + type.name);
      for (let k = 0; k < items.length; k++) yield* this._initInto(interp, target.v.members[members[k].name], members[k].type, items[k], param);
    } else if (rt.isArrayType(type)) {
      if (items.length > type.size) return rt.raiseException("too many values for an array of " + type.size + " elements");
      for (let k = 0; k < items.length; k++) yield* this._initInto(interp, target.v.target[k], type.eleType, items[k], param);
    } else {
      if (items.length !== 1) return rt.raiseException("one value is needed here, not { }");
      yield* this._initInto(interp, target, type, items[0], param);
    }
  },
  /* write text and '\0' into a char array from its start; returns the array */
  _putString(rt, dest, text, fname) {
    const arr = dest.v.target;
    let pos = dest.v.position || 0;
    if (pos + text.length >= arr.length) return rt.raiseException(fname + ": the result is longer than the char array");
    for (const ch of text) arr[pos++].v = ch.charCodeAt(0);
    arr[pos].v = 0;
    return dest;
  },
  _printf(orig) {
    return function (rt, _this, fmt, ...args) {
      args = args.map((a) => (a && typeof a.v === "boolean") ? rt.val(rt.intTypeLiteral, a.v ? 1 : 0) : a);
      // JSCPP reads "%% d" as the specifier "% d"; %% is passed through as \u0001 and restored on output
      const text = rt.getStringFromCharArray(fmt);
      if (text.indexOf("%%") >= 0) fmt = rt.makeCharArrayFromString(text.replace(/%%/g, "\u0001"));
      return orig.call(this, rt, _this, fmt, ...args);
    };
  },
  /* the input of the current run: queued lines, the unread rest of the current line, and the output sink */
  _fill() {
    const io = this._io;
    if (!io.lines.length) return false;
    const line = String(io.lines.shift());
    if (io.echo) io.sink(line + "\n", false);   // the terminal shows what the user typed
    io.buf += line + "\n";
    return true;
  },
  /* skip whitespace, reading further lines when needed; null at the end of the input */
  _word() {
    const io = this._io;
    for (;;) {
      io.buf = io.buf.replace(/^\s+/, "");
      if (io.buf.length) return io.buf;
      if (!this._fill()) return null;
    }
  },
  /* the format is read directive by directive, as in C: a space skips any
     whitespace (also line ends), %c reads the next character as it is, the
     other conversions skip whitespace first, and other characters must match */
  _scanf(rt, fmt, ptrs) {
    const io = this._io;
    const parts = rt.getStringFromCharArray(fmt).match(/\s+|%h{0,2}l?[dicfsuxX]|[^%\s]/g) || [];
    let count = 0, skipws = false;
    for (const part of parts) {
      if (/^\s/.test(part)) { skipws = true; continue; }
      if (part[0] !== "%") {
        io.buf = io.buf.replace(/^\s+/, "");
        if (io.buf[0] !== part) break;
        io.buf = io.buf.slice(1);
        skipws = false;
        continue;
      }
      if (count >= ptrs.length) break;
      // %lf -> %f, %hhu / %u / %i -> %d, %X -> %x
      const spec = part.replace(/[hl]/g, "").replace(/%[ui]/, "%d").replace("%X", "%x");
      let text;
      if (spec === "%c") {
        for (;;) {
          if (skipws) io.buf = io.buf.replace(/^\s+/, "");
          if (io.buf.length) break;
          if (!this._fill()) break;
        }
        if (!io.buf.length) break;
        text = io.buf[0]; io.buf = io.buf.slice(1);
      } else {
        if (this._word() === null) break;          // skips whitespace; false at the end of the input
        const m = io.buf.match(spec === "%s" ? /^\S+/ : spec === "%f" ? /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/
          : spec === "%x" ? /^[-+]?(0[xX])?[0-9a-fA-F]+/ : /^[-+]?\d+/);
        if (!m) break;                             // like C: a non-number stops scanf
        text = m[0]; io.buf = io.buf.slice(text.length);
      }
      skipws = false;
      if (!this._store(rt, ptrs[count], spec, text)) break;
      count++;
    }
    return rt.val(rt.intTypeLiteral, count);
  },
  _store(rt, p, spec, text) {
    if (!p || !p.t || !p.t.ptrType) return rt.raiseException("scanf needs the address of a variable, for example &x");
    const isArr = p.t.ptrType === "array";
    if (spec === "%s") {
      if (!isArr) return rt.raiseException("scanf %s needs a char array");
      const arr = p.v.target;
      let pos = p.v.position;
      if (pos + text.length >= arr.length) return rt.raiseException("the input is longer than the char array");
      for (const ch of text) arr[pos++].v = ch.charCodeAt(0);
      arr[pos].v = 0;
      return true;
    }
    const num = spec === "%c" ? text.charCodeAt(0) : spec === "%f" ? parseFloat(text) : spec === "%x" ? parseInt(text, 16) : parseInt(text, 10);
    const type = isArr ? p.t.eleType : p.t.targetType;
    const cell = isArr ? p.v.target[p.v.position] : p.v.target;
    cell.v = rt.val(type, num, true).v;
    return true;
  },
  _fgets(rt, buf, size) {
    const io = this._io;
    if (!io.buf.length && !this._fill()) return rt.val(buf.t, buf.v);
    const n = Math.max(1, (size && size.v) || 1);
    const cut = io.buf.indexOf("\n");
    let text = cut >= 0 ? io.buf.slice(0, cut + 1) : io.buf;
    text = text.slice(0, n - 1);
    io.buf = io.buf.slice(text.length);
    const arr = buf.v.target;
    let pos = buf.v.position || 0;
    for (const ch of text) { if (pos >= arr.length - 1) break; arr[pos++].v = ch.charCodeAt(0); }
    arr[pos].v = 0;
    return buf;
  },

  /* A parse failure lists every token JSCPP could accept. Shorten it to the
     position and the unexpected text, and name the usual cause. */
  _message(msg) {
    const m = msg.match(/Parsing Failure:\s*line (\d+) \(column (\d+)\)[\s\S]*?Expected ([\s\S]*?) but ("[^"]*"|end of input) found/);
    if (/method o\([^)]*\) is not defined in struct /.test(msg)) {
      msg = msg.replace(/method o\([^)]*\) is not defined in (struct \w+)/,
        "a whole $1 cannot be printed or used in a calculation: use its members, for example s.x");
    }
    if (/Cannot read propert|is not a function|is undefined/.test(msg)) {
      return "Error: the browser's C engine cannot run one of the statements. Check the program, or compile it with gcc.";
    }
    if (!m) return msg.replace(/\\x20/g, " ").replace(/^(\d+):(\d+) /, "Error: line $1, column $2: ");
    const semi = /"\;"/.test(m[3]);
    return "Syntax error: line " + m[1] + ", column " + m[2] + ": unexpected " + m[4] + "." +
      (semi ? "\nCheck the line before it: a ; may be missing." : "");
  },

  /* load JSCPP once; resolves to the global JSCPP object */
  ensure() {
    if (window.JSCPP) { this._patch(window.JSCPP); return Promise.resolve(window.JSCPP); }
    if (this._loading) return this._loading;
    this._loading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = this._url;
      s.onload = () => (window.JSCPP ? (this._patch(window.JSCPP), resolve(window.JSCPP)) : reject(new Error("C engine loaded but not available.")));
      s.onerror = () => { this._loading = null; reject(new Error("Could not load the C engine (check your connection).")); };
      document.head.appendChild(s);
    });
    return this._loading;
  },

  /* run C source. opts: { sink(text,isErr), inputs:[...] }. Returns { ok, error }. */
  async run(code, opts) {
    opts = opts || {};
    const out = opts.sink || (() => {});
    let last = "";
    const sink = (s, isErr) => { if (s) last = s[s.length - 1]; out(s, isErr); };
    let JS;
    try {
      JS = await this.ensure();
    } catch (e) {
      sink(String(e.message || e), true);
      return { ok: false, error: String(e.message || e) };
    }
    // scanf and fgets read the queued inputs line by line (see _patch).
    const lines = Array.isArray(opts.inputs) ? opts.inputs.slice() : [];
    this._io = { lines, buf: "", sink, echo: opts.echo !== false };   // echo:false only for tests
    try {
      // The debugger runs the program node by node, so an endless loop can be stopped.
      const dbg = this._start(JS, code, (s) => sink(s, false));
      const t0 = performance.now();
      for (let n = 1; ; n++) {
        dbg.next();
        if (dbg.done) break;
        if (n % 20000 === 0 && performance.now() - t0 > this.TIME_LIMIT) throw new Error(this._tooLong());
      }
      return { ok: true };
    } catch (e) {
      // JSCPP error messages carry the offending line.
      const msg = this._message(String(e.message || e));
      sink((last && last !== "\n" ? "\n" : "") + msg, true);
      return { ok: false, error: msg };
    }
  },

  TIME_LIMIT: 4000,   // ms; JSCPP runs synchronously, so a longer run would freeze the page
  _tooLong() {
    return "The program was stopped after " + this.TIME_LIMIT / 1000 + " seconds. Check the loop conditions: a loop may never end.";
  },
  /* compile (JSCPP parses) and return a debugger positioned before the first statement of main */
  _start(JS, code, write) {
    return JS.run(this._prep(code), "", {
      stdio: { write: (s) => write(s.replace(/\u0001/g, "%")) },
      unsigned_overflow: "silent",
      debug: true,
    });
  },

  /* Step Run: the same result shape as App.py.trace.
     One step each time execution reaches a new line: { line, vars, out }. */
  async trace(code, opts) {
    opts = opts || {};
    let JS;
    try { JS = await this.ensure(); } catch (e) { return { steps: [], error: String(e.message || e) }; }
    let out = "";
    this._io = { lines: Array.isArray(opts.inputs) ? opts.inputs.slice() : [], buf: "", sink: (s) => { out += s; }, echo: true };
    const steps = [];
    let error = null, truncated = false;
    try {
      const dbg = this._start(JS, code, (s) => { out += s; });
      const t0 = performance.now();
      let lastLine = -1;
      for (let n = 1; ; n++) {
        const node = dbg.nextNode();                 // undefined before the first step
        const line = node ? node.sLine : -1;
        if (line > 0 && line !== lastLine) {
          if (steps.length >= 1000) { truncated = true; break; }
          steps.push({ line, vars: this._vars(dbg), out });
          lastLine = line;
        }
        dbg.next();
        if (dbg.done) break;
        if (n % 20000 === 0 && performance.now() - t0 > this.TIME_LIMIT) throw new Error(this._tooLong());
      }
    } catch (e) {
      error = this._message(String(e.message || e));
    }
    return { steps, final_out: out, error, truncated };
  },
  /* the variables in scope, innermost first; functions are left out */
  _vars(dbg) {
    const vars = {};
    let list = [];
    try { list = dbg.variable(); } catch (e) { return vars; }
    list.forEach((v) => {
      const value = String(v.value);
      if (value === "undefined" || /\(/.test(v.type)) return;   // a function, not a variable
      const hoisted = v.name.match(/^s__\w+?__(\w+)$/);        // a static local (see _statics)
      vars[hoisted ? hoisted[1] + " (static)" : v.name] = value.replace(/\\x20/g, " ");
    });
    return vars;
  },
};
