"""Maat Make contract v2. Copy this file from maat-ui/tools into each product CI."""

import argparse
import os
from pathlib import Path
import re
import subprocess
import sys

COMMON = "help init build lint test compose-up compose-build compose-down"
PROFILES = {
    "backend": "format migrate-create migrate-up migrate-down migrate-version db-restore verify-restore",
    "frontend": "install dev check check-i18n",
    "worker": "install dev check test-unit test-training check-gpu",
}


def implemented_targets(directory):
    # Inspect GNU Make's resolved rules (includes, variables and grouped aliases).
    # An empty inspection goal avoids even recursive recipes in application targets.
    result = subprocess.run(
        ["make", "-rRnp", "-f", "Makefile", "--eval=__maat_inspect__: ;", "__maat_inspect__"],
        cwd=directory, env={**os.environ, "LC_ALL": "C", "MAKEFLAGS": "", "GNUMAKEFLAGS": ""},
        stdout=subprocess.PIPE, text=True, check=True,
    )
    section = result.stdout.split("\n# Files\n", 1)[1].split("\n# files hash-table stats:", 1)[0]
    targets = set()
    aliases = {}
    for block in section.split("\n\n"):
        # Make also prints target-specific variables above the rule in the same block.
        headers = re.findall(r"^([\w.-]+):([^\n]*)$", block, re.MULTILINE)
        if not headers:
            continue
        name, prerequisites = headers[-1]
        if any(line.startswith("\t") and line.strip() for line in block.splitlines()):
            targets.add(name)
        elif prerequisites.strip():
            aliases[name] = prerequisites.split()
    # .PHONY alone creates an empty rule. An alias must lead to an actual recipe.
    while additions := {name for name, deps in aliases.items() if targets.intersection(deps)} - targets:
        targets.update(additions)
    return targets


def main():
    parser = argparse.ArgumentParser(description="Check Make commands required by the Maat family")
    parser.add_argument("profile", choices=PROFILES)
    parser.add_argument("directory", nargs="?", type=Path, default=Path("."))
    args = parser.parse_args()
    label = f"{args.profile} ({args.directory.resolve()}/Makefile)"
    try:
        targets = implemented_targets(args.directory)
    except (OSError, subprocess.CalledProcessError, IndexError) as exc:
        sys.exit(f"{label}: cannot inspect GNU Make rules: {exc}")
    required = (COMMON + " " + PROFILES[args.profile]).split()
    missing = sorted(set(required) - targets)
    if missing:
        sys.exit(f"{label}: missing Make targets: {', '.join(missing)}")
    print(f"{label}: {len(required)} required targets present")


if __name__ == "__main__":
    main()
