#!/usr/bin/env python3
"""Sync docs/partials/header.html and footer.html into every page in docs/*.html."""
import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "docs"
PARTIALS = SITE / "partials"


def sync(name):
    partial = (PARTIALS / f"{name}.html").read_text(encoding="utf-8").strip("\n")
    start, end = f"<!-- partial:{name} -->", f"<!-- /partial:{name} -->"
    pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.DOTALL)
    replacement = f"{start}\n{partial}\n{end}"
    for page in sorted(SITE.glob("*.html")):
        text = page.read_text(encoding="utf-8")
        # lambda: insert the partial literally (no backslash/group expansion)
        new_text, count = pattern.subn(lambda _m: replacement, text)
        if count == 0:
            print(f"warning: no {name} markers in {page.name}")
            continue
        if new_text != text:
            # newline="\n": keep LF line endings on Windows too
            with open(page, "w", encoding="utf-8", newline="\n") as f:
                f.write(new_text)
            print(f"updated {name} in {page.name}")
        else:
            print(f"{name} already in sync in {page.name}")


if __name__ == "__main__":
    sync("header")
    sync("footer")
