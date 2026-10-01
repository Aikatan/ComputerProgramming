#!/usr/bin/env python3
"""Set the instructor login of the lecture site.

Run:
    python tools/set-instructor-login.py

The script asks for the username, and twice for the password. It then
1. writes a new random salt and the SHA-256 hash of "username:password:salt"
   to js/instructor.js, and
2. raises the ?v= number of js/instructor.js in index.html, so that browsers
   load the new file.

The password is never displayed and never stored: only the hash is written.
Standard library only (Python 3).
"""
import getpass
import hashlib
import re
import secrets
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "js" / "instructor.js"
INDEX = ROOT / "index.html"

TEMPLATE = """/* ============================================================
   instructor.js - the instructor login (see README.md, "Instructor mode").
   This file is written by tools/set-instructor-login.py. Do not edit it by hand.
   HASH = SHA-256 of username + ":" + password + ":" + SALT, as hexadecimal.
   An empty HASH switches the sign-in dialog off.
   ============================================================ */
App.INSTRUCTOR_SALT = "{salt}";
App.INSTRUCTOR_HASH = "{digest}";
"""


def login_hash(username, password, salt):
    """The value that js/core.js (App.checkInstructorLogin) computes in the browser."""
    text = username + ":" + password + ":" + salt
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def make_js(username, password):
    """The complete text of js/instructor.js for this login, with a new salt."""
    salt = secrets.token_hex(16)
    return TEMPLATE.format(salt=salt, digest=login_hash(username, password, salt))


def bump_version():
    """Raise ?v=N of js/instructor.js in index.html. Returns the new number, or None."""
    if not INDEX.exists():
        return None
    html = INDEX.read_bytes().decode("utf-8")      # bytes: the line endings stay as they are
    found = re.search(r"(js/instructor\.js\?v=)(\d+)", html)
    if not found:
        return None
    number = int(found.group(2)) + 1
    html = html[:found.start()] + found.group(1) + str(number) + html[found.end():]
    INDEX.write_bytes(html.encode("utf-8"))
    return number


def main():
    username = input("Username: ").strip()
    if not username:
        sys.exit("The username is empty. Nothing was changed.")
    password = getpass.getpass("Password: ")
    if not password:
        sys.exit("The password is empty. Nothing was changed.")
    if getpass.getpass("Password again: ") != password:
        sys.exit("The two passwords are different. Nothing was changed.")

    TARGET.write_text(make_js(username, password), encoding="utf-8", newline="\n")
    print("Written:", TARGET)
    number = bump_version()
    if number is None:
        print("index.html: js/instructor.js?v= was not found. Raise the number by hand.")
    else:
        print("index.html: js/instructor.js?v=" + str(number))
    print("The new login for the user", repr(username), "is set.")
    print("Commit and publish js/instructor.js and index.html to use it on the public site.")


if __name__ == "__main__":
    main()
