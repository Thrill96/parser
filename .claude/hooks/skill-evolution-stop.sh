#!/usr/bin/env bash
# Stop hook: at the end of a session, ask the main agent to run the
# skill-evolution review so the skills learn from what just happened.
#
# Fires at most once per session (marker file), and never recurses into itself
# (stop_hook_active guard). Exit code 2 + stderr feeds the instruction back to
# the agent; the existing git Stop hook then enforces that any resulting skill
# edits are committed and pushed before the session can end.

input="$(cat)"

# Recursion guard: if we're already inside a stop-hook-triggered turn, allow.
active="$(printf '%s' "$input" | jq -r '.stop_hook_active' 2>/dev/null)"
[[ "$active" == "true" ]] && exit 0

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/home/user/parser}"
[[ -d "$PROJECT_DIR/.claude/skills/skill-evolution" ]] || exit 0

# Run once per session.
sid="$(printf '%s' "$input" | jq -r '.session_id // .transcript_path // empty' 2>/dev/null)"
[[ -z "$sid" ]] && exit 0
key="$(printf '%s' "$sid" | tr -c 'A-Za-z0-9' '_')"
marker_dir="$HOME/.skill-evolution"
mkdir -p "$marker_dir"
marker="$marker_dir/$key.done"
[[ -f "$marker" ]] && exit 0
touch "$marker"

cat >&2 <<EOF
Before ending this session, run the skill-evolution review.

Read $PROJECT_DIR/.claude/skills/skill-evolution/SKILL.md and follow it: reflect
on THIS session, capture any corrections, confirmed preferences, or new patterns
into the relevant skill files under $PROJECT_DIR/.claude/skills/, update each
touched skill's changelog, then commit. If nothing in this session is worth
learning from, say so briefly and proceed.
EOF
exit 2
