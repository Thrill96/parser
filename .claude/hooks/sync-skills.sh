#!/usr/bin/env bash
# SessionStart hook: load the persistent master skills from the repo into the
# active skills directory so they're available this session. The repo is the
# only thing that survives between sessions, so this is how accumulated learning
# gets re-activated each time.
set -e

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/home/user/parser}"
SRC="$PROJECT_DIR/.claude/skills"
DEST="/mnt/skills/user"

[[ -d "$SRC" ]] || exit 0
mkdir -p "$DEST"

for skill in "$SRC"/*/; do
  [[ -d "$skill" ]] || continue
  name="$(basename "$skill")"
  rm -rf "$DEST/$name"
  cp -r "$skill" "$DEST/$name"
done

exit 0
