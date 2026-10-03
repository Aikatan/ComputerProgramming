"""Raster illustrations for the lecture site.

The prompts are in tools/images/<topic>.json: one shared "style" and one "prompt" per image.
The PNG masters stay in .claude/tmp/img-src/<topic>/ (not committed). The site uses the WebP
files in img/<topic>/.

    python tools/make-images.py gen t01 hdd-inside     # generate one master with the Codex CLI
    python tools/make-images.py build t01              # masters -> img/t01/*.webp (all, or one name)

gen: runs `codex exec` with the image generation tool and copies the newest PNG from
~/.codex/generated_images. Look at the master before you build: no text, correct parts,
plain background.
build: flattens the master onto the plate colour, fits it into 1200x800, and writes WebP.
It prints the pixel size for the `image` block (w, h).
"""
import json
import pathlib
import shutil
import subprocess
import sys
import time

ROOT = pathlib.Path(__file__).resolve().parent.parent
PLATE = (242, 244, 247)          # #f2f4f7: the plate behind every figure (css: .fig-frame)
SIZE = (1200, 800)
LIMIT_KB = 150


def spec(topic):
    return json.loads((ROOT / "tools" / "images" / (topic + ".json")).read_text(encoding="utf-8"))


def masters(topic):
    d = ROOT / ".claude" / "tmp" / "img-src" / topic
    d.mkdir(parents=True, exist_ok=True)
    return d


def gen(topic, name, ref=None):
    s = spec(topic)
    item = next(i for i in s["images"] if i["name"] == name)
    text = ("Use the image generation tool to create exactly one image. Do not write code and do not "
            "create any other file. Reply with one short sentence when the image is done.\n\n"
            "Style: " + s["style"] + "\n\nSubject: " + item["prompt"] + "\n")
    codex = shutil.which("codex")
    if not codex:
        sys.exit("codex CLI not found")
    work = masters(topic)
    cmd = [codex, "exec"]
    if ref:                          # -i takes several files: it must come before the other options
        cmd += ["-i", str(ref)]
        text += "\nMatch the drawing style, palette, lighting and background of the attached reference image.\n"
    cmd += ["--skip-git-repo-check", "-s", "read-only", "-C", str(work), "-"]
    t0 = time.time()
    r = subprocess.run(cmd, input=text, text=True, encoding="utf-8", capture_output=True)
    print((r.stdout or "")[-600:])
    if r.returncode:
        print((r.stderr or "")[-1200:])
        sys.exit("codex exec failed: " + str(r.returncode))
    out = pathlib.Path.home() / ".codex" / "generated_images"
    new = [p for p in out.rglob("*.png") if p.stat().st_mtime >= t0 - 2]
    if not new:
        print((r.stderr or "")[-1200:])
        sys.exit("no new image in " + str(out))
    newest = max(new, key=lambda p: p.stat().st_mtime)
    dest = work / (name + ".png")
    shutil.copyfile(newest, dest)
    print("master:", dest, "(%d s)" % (time.time() - t0))


def build(topic, only=None):
    from PIL import Image
    dest = ROOT / "img" / topic
    dest.mkdir(parents=True, exist_ok=True)
    for src in sorted(masters(topic).glob("*.png")):
        if only and src.stem != only:
            continue
        im = Image.open(src).convert("RGBA")
        flat = Image.new("RGBA", im.size, PLATE + (255,))
        flat.alpha_composite(im)
        im = flat.convert("RGB")
        im.thumbnail(SIZE, Image.LANCZOS)
        out = dest / (src.stem + ".webp")
        q = 82
        while True:
            im.save(out, "WEBP", quality=q, method=6)
            kb = out.stat().st_size / 1024
            if kb <= LIMIT_KB or q <= 50:
                break
            q -= 6
        corner = im.getpixel((4, 4))
        print("%s  w: %d, h: %d  %.0f KB  q%d  corner #%02x%02x%02x" % ((out.name,) + im.size + (kb, q) + corner))


if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) >= 3 and a[0] == "gen":
        gen(a[1], a[2], a[3] if len(a) > 3 else None)
    elif len(a) >= 2 and a[0] == "build":
        build(a[1], a[2] if len(a) > 2 else None)
    else:
        sys.exit(__doc__)
