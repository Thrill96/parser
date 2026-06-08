---
name: skill-evolution
description: Continuous self-improvement for Will Stewart's skills. Reflects on the current work session, finds what worked, what got corrected, and what was missing, then updates the relevant skill files so the lessons stick. Triggered automatically at the end of each session by the Stop hook, and can be run manually anytime Will says "update my skills", "learn from this", "improve the skills", or "evolve". Edits skill files in .claude/skills/, records every change in each skill's changelog, and relies on git for persistence and rollback.
---

# Skill Evolution — Continuous Improvement

Your job: make the skills smarter every time they're used. Read what just
happened in this session, decide what is genuinely worth remembering, and write
those lessons into the skill files so the next session starts smarter than this
one ended.

This runs automatically at the end of each session (via the Stop hook) and can
also be run on demand.

---

## WHERE SKILLS LIVE (important)

- **Master copies (persistent):** `.claude/skills/<name>/SKILL.md` in the git
  repo. **This is what you edit.** The repo is the only thing that survives
  between sessions, so edits here are what actually accumulate.
- **Active copies (this session only):** `/mnt/skills/user/<name>/`. These are
  copied in from the repo at session start. Do not edit these directly — they
  get overwritten next session. If you want a change to also take effect for the
  rest of the current session, mirror it to the active copy too, but the repo
  copy is the source of truth.

After editing a master copy, the existing git Stop hook will require it to be
committed and pushed before the session ends. That commit IS the save + the
backup + the rollback point. You do not need a separate backup file.

---

## THE LOOP (run this top to bottom)

### 1. Gather the evidence
Look back over the current session (the conversation you are in). Find:
- **Corrections** — anywhere Will said "no", "actually", "don't", "that's
  wrong", redirected you, or fixed something you did. These are the highest-value
  signals.
- **Confirmations** — anywhere Will said "yes", "perfect", "exactly", "that's
  what I want". These lock in patterns worth keeping.
- **New patterns** — a workflow, preference, fact, or rule that emerged and isn't
  yet written in any skill.
- **Recurring friction** — the same mistake or clarification happening more than
  once.

### 2. Map each lesson to a skill
For each lesson, find the most specific skill it belongs to under
`.claude/skills/`. List the current skills first so you know what exists. If a
lesson fits no existing skill and the same kind of need has come up 3+ times,
note a new-skill suggestion to Will instead of inventing one silently.

### 3. Make the edit (conservative)
- Edit the **master copy** in `.claude/skills/<name>/SKILL.md`.
- Make the **smallest change that captures the lesson** — add a rule, tighten a
  sentence, add an example. Do not rewrite whole sections. Do not delete the
  user's existing content unless a correction explicitly invalidated it.
- Preserve the skill's voice and structure.
- Every factual claim you add must trace to something that actually happened in
  the session. Never invent feedback or preferences.

### 4. Record it in the skill's changelog
Every skill you touch gets a `## Changelog` section at the very bottom (create it
if missing). Prepend a dated, one-line entry in plain English:

```
## Changelog
- 2026-06-07: Added rule to always verify gender from the bio — Will corrected an assumption made from the first name. (skill-evolution)
```

This is what makes the learning visible and auditable to a non-technical user.

### 5. Mirror to the active copy (optional, same session only)
If the change should take effect immediately this session, also copy the edited
file to `/mnt/skills/user/<name>/`. Otherwise it applies starting next session.

### 6. Let git save it
Stage, commit, and push the changed skill files. Use a clear, plain-English
commit message, e.g. `skill-evolution: digital-tells-pipeline now verifies
gender from bio`. The git Stop hook enforces this anyway; doing it yourself keeps
the message meaningful.

### 7. Report briefly
Tell Will, in one or two lines, what was learned and which skills changed — or
say plainly that nothing this session was worth saving. Don't narrate the whole
process.

---

## HARD RULES

1. **Evidence only.** Every change must come from something that actually
   happened this session. If you can't point to it, don't write it.
2. **Corrections win.** A correction from Will is the strongest signal — capture
   it as an explicit rule.
3. **Small, surgical edits.** Add and tighten; don't rewrite or delete the
   user's content without a clear reason.
4. **Never edit this skill (skill-evolution).** Self-modification is out of
   scope. If the evolution process itself needs changing, tell Will.
5. **Don't touch unrelated skills.** Only edit skills a lesson genuinely maps to.
6. **When in doubt, do less.** If a "lesson" is really just a one-off or you're
   unsure it generalizes, leave it out and mention it to Will instead.
7. **Nothing worth learning is a valid outcome.** Plenty of sessions teach
   nothing new. Say so and move on. Do not manufacture changes to look busy.

---

## Changelog
- 2026-06-07: Skill created. (manual)
